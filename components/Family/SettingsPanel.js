import { useState, useEffect, useContext } from "react";

import { useRouter } from "next/router";

import toast from "react-hot-toast";

import PanelStickyHeader from "./PanelStickyHeader";
import User from "@components/User";
import Modal from "@components/Modal";

import { UserContext } from "@lib/context";
import { arrayRemove, firestore } from "@lib/firebase";

import styles from "./SettingsPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import MoreIcon from "@icons/more-vertical.svg";
import XIcon from "@icons/x.svg";
import PromoteIcon from "@icons/chevrons-up.svg";
import CopyIcon from "@icons/copy.svg";

export default function SettingsPanel({ doc }) {
    const data = doc?.data();
    const [familyData, setFamilyData] = useState({
        name: "",
        members: [],
        admin: "",
    });
    const [isAdmin, setIsAdmin] = useState(false);

    const [removeOpen, setRemoveOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    const { user, username } = useContext(UserContext);

    useEffect(() => {
        data && setFamilyData(data);
        setIsAdmin(data?.admin === username);
    }, [doc]);

    const rename = (e) => {
        e.preventDefault();

        if (familyData.name !== data?.name) {
            doc.ref.set(
                {
                    name: familyData.name,
                },
                { merge: true }
            );
        }
    };

    return (
        <div className={styles.settingsPanel}>
            <PanelStickyHeader page="settings">
                Family settings
            </PanelStickyHeader>

            <div className={styles.settingsContainer}>
                <div
                    className={`${styles.settingsSection} ${styles.mainSettings}`}
                >
                    {isAdmin ? (
                        <form onSubmit={rename}>
                            <h4
                                className={utilStyles.headingMd}
                                htmlFor="familyName"
                            >
                                Family name
                            </h4>
                            <p className={utilStyles.subHeading}>
                                Used to identify your family, shown on messages
                                page.
                            </p>
                            <div className={styles.nameContainer}>
                                <input
                                    value={familyData.name}
                                    onChange={(e) =>
                                        setFamilyData((data) => ({
                                            ...data,
                                            name: e.target.value,
                                        }))
                                    }
                                    id="familyName"
                                />
                                <button type="submit">Rename</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h4
                                className={utilStyles.headingMd}
                                htmlFor="familyName"
                            >
                                Family name
                            </h4>
                            <div className={styles.nameContainer}>
                                <input value={familyData.name} disabled />
                            </div>
                        </>
                    )}
                </div>
                <div
                    className={`${styles.settingsSection} ${styles.membersSettings}`}
                >
                    <h4 className={utilStyles.headingMd}>Family members</h4>
                    {isAdmin && (
                        <p className={utilStyles.subHeading}>
                            Manage your family members.
                        </p>
                    )}
                    <ul className={styles.membersList}>
                        {familyData.members.map((member) => (
                            <li key={member}>
                                <div className={styles.memberContainer}>
                                    <User
                                        username={member}
                                        style={{ padding: 0, color: "#08090a" }}
                                        usernameModifier={(username) =>
                                            member === data?.admin
                                                ? username + " ⭐"
                                                : username
                                        }
                                    />
                                    {isAdmin && member !== username && (
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className={styles.menuButton}
                                        >
                                            <MoreIcon />
                                            <div className={styles.dropdown}>
                                                <button
                                                    onClick={() => {
                                                        setRemoveOpen(true);
                                                        setCurrentUser(member);
                                                    }}
                                                >
                                                    <XIcon />
                                                    Remove user
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAdminOpen(true);
                                                        setCurrentUser(member);
                                                    }}
                                                >
                                                    <PromoteIcon />
                                                    Make admin
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {removeOpen && (
                        <RemoveModal
                            username={currentUser}
                            doc={doc}
                            setOpen={setRemoveOpen}
                            onRequestClose={() => setRemoveOpen(false)}
                        />
                    )}
                    {adminOpen && (
                        <AdminModal
                            username={currentUser}
                            doc={doc}
                            setOpen={setAdminOpen}
                            onRequestClose={() => setAdminOpen(false)}
                        />
                    )}
                </div>
                <div
                    className={`${styles.settingsSection} ${styles.invitationSettings}`}
                >
                    <h4 className={utilStyles.headingMd}>Family join code</h4>
                    <p className={utilStyles.subHeading}>
                        Use this code to invite new members.
                    </p>
                    <div className={styles.codeSection}>
                        <input value={doc?.id || ""} disabled />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(doc?.id);
                                toast.success("Copied!");
                            }}
                        >
                            <CopyIcon />
                        </button>
                    </div>
                </div>
                <div
                    className={`${styles.settingsSection} ${styles.dangerZone}`}
                >
                    <h4 className={utilStyles.headingMd}>Danger zone</h4>
                    <p className={styles.subHeading}>
                        Be careful! Changes in this section may be permanent.
                    </p>
                    <div className={styles.buttonsContainer}>
                        <button
                            onClick={() => setLeaveOpen(true)}
                            className="btn-red-light"
                        >
                            Leave family
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setDeleteOpen(true)}
                                className="btn-red-light"
                            >
                                Delete family
                            </button>
                        )}
                    </div>
                    {leaveOpen && (
                        <LeaveModal
                            user={user}
                            username={username}
                            doc={doc}
                            onRequestClose={() => setLeaveOpen(false)}
                        />
                    )}
                    {deleteOpen && (
                        <DeleteModal
                            user={user}
                            username={username}
                            doc={doc}
                            onRequestClose={() => setDeleteOpen(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

const RemoveModal = ({ username, doc, setOpen, ...props }) => {
    const removeUser = async () => {
        await doc.ref
            .set(
                {
                    members: arrayRemove(username),
                },
                { merge: true }
            )
            .catch(() => toast.error("Oops! An error occured."));

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>
                Are you sure you would like to remove {username}?
            </h3>
            <button className="btn-red" onClick={removeUser}>
                Remove
            </button>
        </Modal>
    );
};

const AdminModal = ({ username, doc, setOpen, ...props }) => {
    const makeAdmin = async () => {
        await doc.ref
            .set(
                {
                    admin: username,
                },
                { merge: true }
            )
            .catch(() => toast.error("Oops! An error occured."));

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>
                Are you sure you would like to make {username} admin?
            </h3>
            <p className={utilStyles.subHeading}>
                {username} will replace you as the admin.
            </p>
            <button className="btn-red" onClick={makeAdmin}>
                Make admin
            </button>
        </Modal>
    );
};

const LeaveModal = ({ user, username, doc, ...props }) => {
    const router = useRouter();

    const data = doc.data();

    const isAdmin = username === data.admin;

    const leaveFamily = async () => {
        const batch = firestore.batch();
        const userDoc = firestore.doc(`users/${user.uid}`);
        const familyDoc = doc.ref;

        batch.set(userDoc, { familyId: null }, { merge: true });
        batch.set(
            familyDoc,
            { members: arrayRemove(username) },
            { merge: true }
        );

        await batch.commit();

        router.push("/family");
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            {data.members.length > 1 ? (
                isAdmin ? (
                    <>
                        <h3 className={utilStyles.headingLg}>
                            You are currently the admin of this family.
                        </h3>
                        <p className={utilStyles.subHeading}>
                            You must make another member of the family the admin
                            before leaving.
                        </p>
                        <button onClick={props.onRequestClose}>Go back</button>
                    </>
                ) : (
                    <>
                        <h3 className={utilStyles.headingLg}>
                            Are you sure you would like to leave this family?
                        </h3>
                        <button onClick={leaveFamily} className="btn-red">
                            Leave
                        </button>
                    </>
                )
            ) : (
                <>
                    <h3 className={utilStyles.headingLg}>
                        You are the only member of this family.
                    </h3>
                    <p className={utilStyles.subHeading}>
                        Instead of leaving this family, you can delete it.
                    </p>
                    <button onClick={props.onRequestClose}>Go back</button>
                </>
            )}
        </Modal>
    );
};

const DeleteModal = ({ user, username, doc, ...props }) => {
    const router = useRouter();

    const data = doc.data();

    const deleteFamily = async () => {
        const batch = firestore.batch();
        const familyDoc = doc.ref;
        const userDoc = firestore.doc(`users/${user.uid}`);

        const messagesRef = familyDoc.collection("messages");
        const messagesDocs = await messagesRef.get();
        messagesDocs.forEach((doc) => batch.delete(doc.ref));

        const todosRef = familyDoc.collection("todos");
        const todosDocs = await todosRef.get();
        todosDocs.forEach((doc) => batch.delete(doc.ref));

        const shoppingRef = familyDoc.collection("shopping");
        const shoppingDocs = await shoppingRef.get();
        shoppingDocs.forEach((doc) => batch.delete(doc.ref));

        batch.delete(familyDoc);

        batch.set(userDoc, { familyId: null }, { merge: true });

        await batch.commit();

        router.push("/family");
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            {data.members.length > 1 ? (
                <>
                    <h3 className={utilStyles.headingLg}>
                        There are still other members in this family.
                    </h3>
                    <p>Remove them first before deleting.</p>
                    <button onClick={props.onRequestClose}>Go back</button>
                </>
            ) : (
                <>
                    <h3 className={utilStyles.headingLg}>
                        Are you sure you would like to delete this family?
                    </h3>
                    <p className={utilStyles.subHeading}>
                        This will delete all of its data, including messages,
                        pictures, todos, and shopping items.
                    </p>
                    <p className={utilStyles.subHeading}>
                        This can not be undone.
                    </p>
                    <button onClick={deleteFamily} className="btn-red">
                        Delete
                    </button>
                </>
            )}
        </Modal>
    );
};
