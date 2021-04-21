import { useDocument } from "react-firebase-hooks/firestore";

import DefaultDesktopLayout from "@layouts/DefaultDesktop";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";
import UsersPanel, { SmallUsersPanel } from "@components/Family/UsersPanel";
import RightPanel from "@components/Family/RightPanel";
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

    const data = snapshot?.data();

    return (
        <DefaultDesktopLayout
            leftPanel={<UsersPanel members={data?.members} />}
            smallLeftPanel={<SmallUsersPanel members={data?.members} />}
            rightPanel={<RightPanel members={data?.members} />}
        >
            <MiddlePanel doc={snapshot} />
        </DefaultDesktopLayout>
    );
}
