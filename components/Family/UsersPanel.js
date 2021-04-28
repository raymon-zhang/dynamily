import User from "@components/User";

import styles from "./UsersPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function UsersPanel({ members }) {
    return (
        <div className={styles.leftPanel}>
            <div className={styles.userPanel}>
                <h3 className={utilStyles.headingLg}>People</h3>
                <p className={utilStyles.subHeading}>Family members</p>
                <div className={styles.usersContainer}>
                    {members?.map((member) => (
                        <User key={member.username} userData={member} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SmallUsersPanel({ members }) {
    return (
        <div className={styles.leftPanel}>
            <div className={styles.userPanel}>
                <div className={styles.usersContainer}>
                    {members?.map((member) => (
                        <User
                            key={member.username}
                            userData={member}
                            options={{ size: "photo" }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
