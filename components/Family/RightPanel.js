import Link from "next/link";

import ImageIcon from "@icons/image.svg";
import ShoppingIcon from "@icons/shopping-cart.svg";
import TodoIcon from "@icons/check-square.svg";
import MessagesIcon from "@icons/message.svg";

import styles from "./RightPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function RightPanel({}) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.elementsPanel}>
                <h3 className={utilStyles.headingLg}>Family elements</h3>
                <p className={utilStyles.subHeading}>Manage your family</p>
                <div className={styles.elementsContainer}>
                    <Link href="/family">
                        <a className={styles.element}>
                            <MessagesIcon /> Messages
                        </a>
                    </Link>
                    <Link href="/family/gallery">
                        <a className={styles.element}>
                            <ImageIcon /> Gallery
                        </a>
                    </Link>
                    <Link href="/family/todos">
                        <a className={styles.element}>
                            <TodoIcon /> Todo list
                        </a>
                    </Link>
                    <Link href="/family/shopping">
                        <a className={styles.element}>
                            <ShoppingIcon /> Shopping list
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
