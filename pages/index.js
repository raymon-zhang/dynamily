import Head from "next/head";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";

import styles from "@styles/home.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function Home() {
    return (
        <main className={styles.main}>
            <Metatags />
            <AuthCheck fallback={<LandingPage />}>
                <FamilyDashboard />
            </AuthCheck>
        </main>
    );
}

function FamilyDashboard() {
    return <h1>Dashboard</h1>;
}

function LandingPage() {
    return <h1>Landing Page</h1>;
}
