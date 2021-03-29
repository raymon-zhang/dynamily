import { useState } from "react";
import Head from "next/head";

import "@styles/globals.scss";
import Navbar from "@components/Navbar";
import { UserContext, GAPIContext } from "@lib/context";
import { useUserData } from "@lib/hooks";
import { Toaster } from "react-hot-toast";

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
            window.gapi.load("client:auth2", async () => {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                });
                setIsGAPILoaded(true);
            });
    };

    return (
        <UserContext.Provider value={userData}>
            <GAPIContext.Provider value={isGAPILoaded}>
                <Navbar />
                <Head>
                    <script
                        async
                        defer
                        src="/js/gapi.js"
                        onLoad={onLoad()}
                    ></script>
                </Head>
                <Component {...pageProps} />
                <Toaster />
            </GAPIContext.Provider>
        </UserContext.Provider>
    );
}

export default MyApp;
