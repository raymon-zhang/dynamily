import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import ReactModal from "react-modal";

import { ThemeProvider } from "next-themes";

import NProgress from "nprogress";

import "@styles/globals.scss";

import Navbar from "@components/Navbar";
import Toasts from "@components/Toasts";

import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

import FamilyPageLayout from "@layouts/FamilyPageLayout";

function MyApp({ Component, pageProps }) {
    const userData = useUserData();

    const router = useRouter();

    useEffect(() => {
        const handleStart = () => {
            NProgress.start();
        };
        const handleStop = () => {
            NProgress.done();
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    ReactModal.setAppElement("#__next");

    const windowLoad = function () {
        console.log(
            "Hi there! If you want to contribute to Dynamily, you can contact us at raymonzhang.rz@gmail.com!"
        );
    };

    useEffect(() => {
        window.addEventListener("load", windowLoad);
        return () => window.removeEventListener("load", windowLoad);
    });

    return (
        <UserContext.Provider value={userData}>
            <Head>
                <link
                    rel="preload"
                    href="/fonts/GlacialIndifference-Regular.otf"
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/GlacialIndifference-Bold.otf"
                    as="font"
                    crossOrigin=""
                />
                {process.env.NODE_ENV === "development" && (
                    <script>self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;</script>
                )}
            </Head>
            <ThemeProvider>
                <Navbar />
                {router.pathname.startsWith("/family") ? (
                    <FamilyPageLayout>
                        <Component {...pageProps} />
                    </FamilyPageLayout>
                ) : (
                    <Component {...pageProps} />
                )}
                <Toasts />
            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default MyApp;
