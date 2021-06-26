import Link from "next/link";

import styles from "./PanelStickyHeader.module.scss";
import utilStyles from "@styles/utils.module.scss";

import HomeIcon from "@icons/home.svg";

export default function PanelStickyHeader({ children }) {
    return (
        <div className={styles.stickyHeader}>
            <Link href="/family">
                <a className={styles.headerContent}>
                    <h3 className={utilStyles.headingLg}>{children}</h3>
                    <HomeIcon />
                </a>
            </Link>
        </div>
    );
}
