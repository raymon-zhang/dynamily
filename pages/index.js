import Head from "next/head";

import { useContext, useState } from "react";

import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";
import Modal from "@components/Modal";

import styles from "@styles/home.module.scss";
import utilStyles from "@styles/utils.module.scss";

import Icon from "@icons/icon.svg";

import { UserContext } from "@lib/context";
import { firestore } from "@lib/firebase";

import { FamilyLayout } from "@layouts/FamilyPageLayout";

export default function Home() {
    return (
        <main>
            <Metatags />
            <AuthCheck fallback={<LandingPage />}>
                <FamilyDashboard />
            </AuthCheck>
        </main>
    );
}

function FamilyDashboard() {
    const { userDoc } = useContext(UserContext);

    return (
        <>
            {userDoc?.familyId ? (
                <FamilyPage familyId={userDoc?.familyId} />
            ) : (
                <NewOrJoin />
            )}
        </>
    );
}

function NewOrJoin() {
    const [newOpen, setNewOpen] = useState(false);

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
                        className="btn-blue"
                    >
                        Create a family
                    </button>
                    <button className="btn">Join with code</button>
                </div>
            </div>
            {newOpen && (
                <CreateNewFamily onRequestClose={() => setNewOpen(false)} />
            )}
        </div>
    );
}

function CreateNewFamily(props) {
    const { username, user } = useContext(UserContext);

    const [name, setName] = useState("");
    const isValid = name.length > 1 && name.length < 30;

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
            name: familyName,
            members: [username],
        });

        batch.set(userDoc, { familyId }, { merge: true });

        await batch.commit();
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

function FamilyPage() {
    const { userDoc } = useContext(UserContext);

    return <FamilyLayout family={userDoc.familyId} />;
}

function LandingPage() {
    return (
        <div className={styles.landingPage}>
            <h1>Landing Page</h1>
        </div>
    );
}
