import { useState, useEffect, useContext } from "react";

import toast from "react-hot-toast";

import PanelStickyHeader from "./PanelStickyHeader";
import User from "@components/User";
import Modal from "@components/Modal";

import { UserContext } from "@lib/context";
import { arrayRemove } from "@lib/firebase";

import styles from "./SettingsPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import MoreIcon from "@icons/more-vertical.svg";
import XIcon from "@icons/x.svg";
import PromoteIcon from "@icons/chevrons-up.svg";
import CopyIcon from "@icons/copy.svg";

export default function SettingsPanel({ doc }) {
    const data = doc?.data();
    const [familyData, setFamilyData] = useState({ name: "", members: [] });
    const [isAdmin, setIsAdmin] = useState(false);

    const [removeOpen, setRemoveOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    const { username } = useContext(UserContext);

    useEffect(() => {
        data?.name && setFamilyData(data);
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
                                page.{" "}
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
                        <div className={styles.codeContainer}>{doc?.id}</div>
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
