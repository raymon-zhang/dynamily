import { useState, useEffect, useContext } from "react";

import PanelStickyHeader from "./PanelStickyHeader";
import User from "@components/User";

import { UserContext } from "@lib/context";
import { arrayRemove } from "@lib/firebase";

import styles from "./SettingsPanel.module.scss";

import MoreIcon from "@icons/more-vertical.svg";
import XIcon from "@icons/x.svg";
import PromoteIcon from "@icons/chevrons-up.svg";
import Modal from "@components/Modal";

export default function SettingsPanel({ doc }) {
    const data = doc?.data();
    const [familyData, setFamilyData] = useState({ name: "", members: [] });
    const [isAdmin, setIsAdmin] = useState(false);

    const [removeOpen, setRemoveOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

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
                    name: data,
                },
                { merge: true }
            );
        }
    };

    const removeUser = (username) => {
        doc.ref.set(
            {
                members: arrayRemove(username),
            },
            { merge: true }
        );
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
                            <label htmlFor="familyName">Family name</label>
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
                            <label htmlFor="familyName">Family name</label>
                            <div className={styles.nameContainer}>
                                <input value={familyData.name} disabled />
                            </div>
                        </>
                    )}
                </div>
                <div
                    className={`${styles.settingsSection} ${styles.membersSettings}`}
                >
                    <label>Family members</label>
                    <ul className={styles.membersList}>
                        {familyData.members.map((member) => (
                            <li key={member}>
                                <div className={styles.memberContainer}>
                                    <User
                                        username={member}
                                        style={{ padding: 0, color: "#08090a" }}
                                    />
                                    {isAdmin && (
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
                                                    }}
                                                >
                                                    <XIcon />
                                                    Remove user
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAdminOpen(true);
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
                </div>
            </div>
        </div>
    );
}
