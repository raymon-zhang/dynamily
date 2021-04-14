import { useState } from "react";
import Link from "next/link";

import { getUserWithUsername } from "@lib/firebase";

import styles from "./User.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function User({ username, options = { size: "big" } }) {
    const [user, setUser] = useState(null);
    if (!user) {
        getUserWithUsername(username).then((userDoc) =>
            setUser(userDoc.data())
        );
    }
    return (
        <Link href={user?.username ? `u/${user.username}` : "/"}>
            <a>
                <div
                    className={`${styles.user} ${
                        options.size === "small" ? styles.userSmall : ""
                    }`}
                >
                    <img
                        src={user?.photoURL}
                        className={`${styles.userPhoto} ${utilStyles.borderCircle}`}
                    />
                    {user?.username}
                </div>
            </a>
        </Link>
    );
}
