import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./PanelStickyHeader.module.scss";
import utilStyles from "@styles/utils.module.scss";

import MessageIcon from "@icons/message.svg";
import GalleryIcon from "@icons/image.svg";
import TodoIcon from "@icons/check-square.svg";
import ShoppingIcon from "@icons/shopping-cart.svg";

export default function PanelStickyHeader({ page, children }) {
    const pageOptions = {
        messages: {
            url: "/family",
            icon: <MessageIcon />,
        },
        gallery: {
            url: "/family/gallery",
            icon: <GalleryIcon />,
        },
        todos: {
            url: "/family/todos",
            icon: <TodoIcon />,
        },
        shopping: {
            url: "/family/shopping",
            icon: <ShoppingIcon />,
        },
    };
    const currentPage = pageOptions[page];
    delete pageOptions[page];

    return (
        <div className={styles.stickyHeader}>
            <div className={styles.headerContent}>
                <h3 className={utilStyles.headingLg}>{children}</h3>
                <Link href={currentPage.url}>
                    <a>{currentPage.icon}</a>
                </Link>
            </div>
        </div>
    );
}
