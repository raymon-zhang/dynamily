import { useRouter } from "next/router";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";

import LandingPage from "@layouts/LandingPage";
import Redirect from "@components/Redirect";

export default function Home() {
    return (
        <main>
            <Metatags />
            <AuthCheck fallback={<LandingPage />}>
                <Redirect to="/family" />
            </AuthCheck>
        </main>
    );
}
