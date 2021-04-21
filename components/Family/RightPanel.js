import User from "@components/User";

import styles from "./RightPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function RightPanel({ members }) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.elementsPanel}>
                <h3 className={utilStyles.headingLg}>Family elements</h3>
                <p className={utilStyles.subHeading}>Family members</p>
                <div className={styles.elementsContainer}>
                    {members?.map((member) => (
                        <p className={utilStyles.subHeading}>{member}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
