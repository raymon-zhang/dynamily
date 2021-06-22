import { useState, useEffect } from "react";
import Head from "next/head";

import ReactModal from "react-modal";

import { ThemeProvider } from "next-themes";

import "@styles/globals.scss";

import Navbar from "@components/Navbar";
import Toasts from "@components/Toasts";

import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

import FamilyPageLayout from "@layouts/FamilyPageLayout";

function MyApp({ Component, pageProps, router }) {
    const userData = useUserData();

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
