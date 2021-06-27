import { useEffect, useState } from "react";
import Link from "next/link";

import { getUserWithUsername } from "@lib/firebase";

import makeCancelable from "@utils/MakeCancelable";

import styles from "./User.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function User({
    username,
    options = { size: "big" },
    userData = null,
    style,
}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userData) {
            const cancelablePromise = makeCancelable(
                getUserWithUsername(username)
            );
            cancelablePromise.promise
                .then((userDoc) => setUser(userDoc.data()))
                .catch(() => {});
            return () => {
                cancelablePromise.cancel();
            };
        } else {
            setUser(userData);
        }
    }, [username, userData]);

    return (
        <Link href={user?.username ? `/u/${user.username}` : "/"}>
            <a title={user?.username}>
                <div
                    className={`${styles.user} ${
                        options.size === "small" ? styles.userSmall : ""
                    }`}
                    style={style}
                >
                    <img
                        src={user?.photoURL}
                        className={`${styles.userPhoto} ${
                            options.size === "photo" ? styles.noMarginRight : ""
                        } ${utilStyles.borderCircle}`}
                    />
                    {options.size !== "photo" && user?.username}
                </div>
            </a>
        </Link>
    );
}
