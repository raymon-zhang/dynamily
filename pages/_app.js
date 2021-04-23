import { useState, useEffect } from "react";
import Head from "next/head";

import ReactModal from "react-modal";

import withDarkMode, { useDarkMode } from "next-dark-mode";

import "@styles/globals.scss";

import Navbar from "@components/Navbar";
import Toasts from "@components/Toasts";

import { UserContext, GAPIContext } from "@lib/context";
import { useUserData } from "@lib/hooks";

function MyApp({ Component, pageProps }) {
    const userData = useUserData();

    const [isGAPILoaded, setIsGAPILoaded] = useState(false);

    var CLIENT_ID =
        "780407119655-nj3s82c1tv1rddpeblqcmljvb2bthara.apps.googleusercontent.com";
    var API_KEY = "AIzaSyAM_HBTzHRwctNGYxlQV8jNNhMSuloymZI";

    var DISCOVERY_DOCS = [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ];

    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    function onLoad() {
        handleClientLoad().catch((error) => {
            console.error("Error loading GAPI: " + error);
        });
    }

    const handleClientLoad = async () => {
        typeof window !== "undefined" &&
            window.gapi?.load("client:auth2", async () => {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                });
                setIsGAPILoaded(true);
            });
    };

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
            <GAPIContext.Provider value={isGAPILoaded}>
                <Head>
                    <script
                        async
                        defer
                        src="/js/gapi.js"
                        onLoad={onLoad()}
                    ></script>
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
                    <Component {...pageProps} />
                    <Toasts />
                </div>
            </GAPIContext.Provider>
        </UserContext.Provider>
    );
}

export default withDarkMode(MyApp);
