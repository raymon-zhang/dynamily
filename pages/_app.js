import { useState, useEffect } from "react";
import Head from "next/head";

import ReactModal from "react-modal";

import withDarkMode, { useDarkMode } from "next-dark-mode";

import "@styles/globals.scss";

import Navbar from "@components/Navbar";
import Toasts from "@components/Toasts";

import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

import FamilyPageLayout from "@layouts/FamilyPageLayout";

function MyApp({ Component, pageProps, router }) {
    const userData = useUserData();

    const { darkModeActive, switchToDarkMode } = useDarkMode();

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
            <div className={darkModeActive ? "dark layout" : "light layout"}>
                <Navbar />
                {router.pathname.startsWith("/family") ? (
                    <FamilyPageLayout>
                        <Component {...pageProps} />
                    </FamilyPageLayout>
                ) : (
                    <Component {...pageProps} />
                )}
                <Toasts />
            </div>
        </UserContext.Provider>
    );
}

export default withDarkMode(MyApp);
