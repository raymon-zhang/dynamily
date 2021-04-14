import { useDocument } from "react-firebase-hooks/firestore";

import DefaultDesktopLayout from "@layouts/DefaultDesktop";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";
import UsersPanel from "@components/Family/UsersPanel";
import MiddlePanel from "@components/Family/MiddlePanel";

import { firestore } from "@lib/firebase";

export default function FamilyPageLayout({ family }) {
    return (
        <main>
            <Metatags />
            <AuthCheck>
                <FamilyLayout family={family} />
            </AuthCheck>
        </main>
    );
}

export function FamilyLayout({ family }) {
    const familyDoc = firestore.collection("families").doc(family);
    const [snapshot, loading, error] = useDocument(familyDoc);

    return (
        <DefaultDesktopLayout
            leftPanel={<UsersPanel members={snapshot?.data()?.members} />}
            rightPanel={<div>Right</div>}
        >
            <MiddlePanel doc={snapshot} />
        </DefaultDesktopLayout>
    );
}
