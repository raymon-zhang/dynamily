import { useState } from "react";
import Link from "next/link";

import { getUserWithUsername } from "@lib/firebase";

import styles from "./User.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function User({
    username,
    options = { size: "big" },
    userData = null,
}) {
    const [user, setUser] = useState(null);
    if (!user) {
        if (!userData) {
            getUserWithUsername(username).then((userDoc) =>
                setUser(userDoc.data())
            );
        } else {
            setUser(userData);
        }
    }

    return (
        <Link href={user?.username ? `/u/${user.username}` : "/"}>
            <a>
                <div
                    className={`${styles.user} ${
                        options.size === "small" ? styles.userSmall : ""
                    }`}
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
