import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useDocument } from "react-firebase-hooks/firestore";

import DefaultDesktopLayout from "@layouts/DefaultDesktop";
import LandingPage from "@layouts/LandingPage";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";
import Modal from "@components/Modal";
import UsersPanel, { SmallUsersPanel } from "@components/Family/UsersPanel";
import RightPanel from "@components/Family/RightPanel";
import MiddlePanel from "@components/Family/MiddlePanel";

import { firestore, getUserWithUsername, arrayUnion } from "@lib/firebase";
import { UserContext } from "@lib/context";

import styles from "@styles/family.module.scss";
import utilStyles from "@styles/utils.module.scss";

import Icon from "@icons/icon.svg";

export default function FamilyPageLayout({ children }) {
    return (
        <main>
            <Metatags />
            <AuthCheck fallback={<LandingPage />}>
                <FamilyDashboard>{children}</FamilyDashboard>
            </AuthCheck>
        </main>
    );
}

export function FamilyLayout({ children = <MiddlePanel /> }) {
    const { user, userDoc, username } = useContext(UserContext);
    const family = userDoc.familyId;
    const familyDoc = firestore.collection("families").doc(family);
    const [snapshot, loading, error] = useDocument(familyDoc);

    const [otherData, setOtherData] = useState({ members: null });

    const data = snapshot?.data();

    useEffect(() => {
        async function getMembers() {
            setOtherData({
                members: await Promise.all(
                    data.members.map(async (member) =>
                        (await getUserWithUsername(member)).data()
                    )
                ),
            });
        }
        if (data) {
            getMembers();

            if (!data.members.includes(username)) {
                const userDoc = firestore.doc(`users/${user.uid}`);
                userDoc.set({ familyId: null }, { merge: true });
            }
        }
    }, [snapshot]);

    return (
        <DefaultDesktopLayout
            leftPanel={
                <UsersPanel members={otherData.members} admin={data?.admin} />
            }
            smallLeftPanel={<SmallUsersPanel members={otherData.members} />}
            rightPanel={<RightPanel />}
        >
            {React.cloneElement(children, { doc: snapshot })}
        </DefaultDesktopLayout>
    );
}

function FamilyDashboard({ children }) {
    const { userDoc } = useContext(UserContext);

    return (
        <>
            {userDoc?.familyId ? (
                <FamilyLayout>{children}</FamilyLayout>
            ) : (
                <NewOrJoin />
            )}
        </>
    );
}

function NewOrJoin() {
    const [newOpen, setNewOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.welcomePanelContainer}>
                <div className={styles.welcomeCircle}>
                    <div
                        className={`${utilStyles.borderCircle} ${styles.iconContainer}`}
                    >
                        <Icon className={styles.icon} />
                    </div>
                </div>

                <h1 className={styles.heading}>Welcome to Dynamily</h1>
                <p className={styles.description}>
                    Dynamily helps you manage and connect your family's everyday
                    life. To get started, create or join a family.
                </p>
                <div className={styles.btnContainer}>
                    <button
                        onClick={() => {
                            setNewOpen(true);
                        }}
                        className="btn-blue btn-circle"
                    >
                        Create a family
                    </button>
                    <button
                        className="btn-circle btn-blue-light"
                        onClick={() => {
                            setJoinOpen(true);
                        }}
                    >
                        Join with code
                    </button>
                </div>
            </div>
            {newOpen && (
                <CreateNewFamily onRequestClose={() => setNewOpen(false)} />
            )}
            {joinOpen && (
                <JoinFamily onRequestClose={() => setJoinOpen(false)} />
            )}
        </div>
    );
}

function CreateNewFamily(props) {
    const { username, user } = useContext(UserContext);

    const [name, setName] = useState("");
    const isValid = name.length > 1 && name.length < 30;

    const router = useRouter();

    const createNewFamily = async (e) => {
        e.preventDefault();

        const batch = firestore.batch();
        const familyDoc = firestore.collection("families").doc();
        const userDoc = firestore.doc(`users/${user.uid}`);
        const familyId = familyDoc.id;

        const familyName = name.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        batch.set(familyDoc, {
            admin: username,
            name: familyName,
            members: [username],
        });

        batch.set(userDoc, { familyId }, { merge: true });

        await batch.commit();

        router.reload();
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>Create Family</h3>
            <p className={utilStyles.subHeading}>
                Fill out the following fields to start a new family
            </p>
            <form onSubmit={createNewFamily}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Family name"
                    className="marginSpacing"
                />
                <button type="submit" disabled={!isValid}>
                    Create family
                </button>
            </form>
        </Modal>
    );
}

function JoinFamily(props) {
    const { username, user } = useContext(UserContext);

    const [code, setCode] = useState("");

    const router = useRouter();

    const joinFamily = async (e) => {
        e.preventDefault();

        const familyDoc = firestore.collection("families").doc(code);
        const userDoc = firestore.doc(`users/${user.uid}`);

        const exists = await familyDoc.get().then((doc) => {
            return doc.exists;
        });

        if (exists) {
            const batch = firestore.batch();
            batch.set(userDoc, { familyId: code }, { merge: true });

            batch.set(
                familyDoc,
                {
                    members: arrayUnion(username),
                },
                { merge: true }
            );

            await batch.commit();

            router.reload();
        }
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>Join Family</h3>
            <p className={utilStyles.subHeading}>
                Please give us the join code of your family to join
            </p>
            <form onSubmit={joinFamily}>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Join code"
                    className="marginSpacing"
                />
                <button type="submit">Join family</button>
            </form>
        </Modal>
    );
}
