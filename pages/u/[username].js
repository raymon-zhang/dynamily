import { useContext, useState } from "react";

import { UserContext } from "@lib/context";
import { firestore } from "@lib/firebase";

import { getUserWithUsername } from "@lib/firebase";
import Metatags from "@components/Metatags";
import Modal from "@components/Modal";

import EditIcon from "@icons/edit.svg";

import styles from "@styles/profile.module.scss";
import utilStyles from "@styles/utils.module.scss";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let user;
    if (userDoc) {
        const data = userDoc.data();
        user = {
            ...data,
            createdAt: data?.createdAt.toMillis() || 0,
        };
    }

    return {
        props: { user },
    };
}

export default function UserProfilePage({ user }) {
    const joinedDate = new Date(user.createdAt).toDateString();

    const { username } = useContext(UserContext);

    const [editOpen, setEditOpen] = useState(false);

    return (
        <main>
            <Metatags
                title={user.username}
                description={`${user.username}'s public profile`}
            />
            <div className={styles.profile}>
                <img
                    src={user?.photoURL}
                    className={`${styles.userPhoto} ${utilStyles.borderCircle}`}
                />
                <h3 className={`${utilStyles.headingLg} ${styles.heading}`}>
                    {user.displayName}
                </h3>
                <h4 className={styles.subHeading}>@{user.username}</h4>
                {user?.bio ? (
                    <p className={styles.bio}>{user.bio}</p>
                ) : (
                    username === user.username && (
                        <button
                            className={styles.bioButton}
                            onClick={() => {
                                setEditOpen(true);
                            }}
                        >
                            Add a bio
                        </button>
                    )
                )}
                <p className={`${utilStyles.subHeading} ${styles.joinedDate}`}>
                    Joined: {joinedDate}
                </p>
                {username === user.username && (
                    <button
                        className={styles.editButton}
                        onClick={() => {
                            setEditOpen(true);
                        }}
                    >
                        <EditIcon /> Edit profile
                    </button>
                )}
                {editOpen && (
                    <EditProfile
                        userDoc={user}
                        setOpen={(value) => setEditOpen(value)}
                        onRequestClose={() => setEditOpen(false)}
                    />
                )}
            </div>
        </main>
    );
}

function EditProfile({ userDoc, setOpen, ...props }) {
    const [photoURL, setPhotoURL] = useState(userDoc.photoURL || "");
    const [displayName, setDisplayName] = useState(userDoc.displayName || "");
    const [bio, setBio] = useState(userDoc.bio || "");

    const { user } = useContext(UserContext);

    const save = async (e) => {
        e.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);

        console.log(bio);

        await userDoc.set(
            {
                photoURL,
                displayName,
                bio,
            },
            { merge: true }
        );

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>Edit Profile</h3>

            <form onSubmit={save}>
                <label htmlFor="photoUrl">Google avatar URL</label>
                <input
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="URL"
                    className="marginSpacing"
                    id="photoUrl"
                />
                <label htmlFor="displayName">Display Name</label>
                <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="marginSpacing"
                    id="displayName"
                />
                <label htmlFor="bio">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe yourself"
                    className="marginSpacing"
                    id="bio"
                    rows={4}
                />
                <button type="submit">Save</button>
            </form>
        </Modal>
    );
}
