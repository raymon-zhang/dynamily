import Link from "next/link";

import ImageIcon from "@icons/image.svg";

import styles from "./RightPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function RightPanel({}) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.elementsPanel}>
                <h3 className={utilStyles.headingLg}>Family elements</h3>
                <p className={utilStyles.subHeading}>Manage your family</p>
                <div className={styles.elementsContainer}>
                    <Link href="/gallery">
                        <a
                            className={`${styles.element} ${styles.colorPurple}`}
                        >
                            <ImageIcon /> Family Gallery
                        </a>
                    </Link>
                    <Link href="/gallery">
                        <a className={`${styles.element} ${styles.colorGreen}`}>
                            <ImageIcon /> Family Gallery
                        </a>
                    </Link>
                    <Link href="/gallery">
                        <a
                            className={`${styles.element} ${styles.colorYellow}`}
                        >
                            <ImageIcon /> Family Gallery
                        </a>
                    </Link>
                    <Link href="/gallery">
                        <a className={`${styles.element} ${styles.colorRed}`}>
                            <ImageIcon /> Family Gallery
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
