import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./PanelStickyHeader.module.scss";
import utilStyles from "@styles/utils.module.scss";

import MessageIcon from "@icons/message.svg";
import GalleryIcon from "@icons/image.svg";
import TodoIcon from "@icons/check-square.svg";
import ShoppingIcon from "@icons/shopping-cart.svg";
import SettingsIcon from "@icons/settings.svg";
import ChevronDown from "@icons/chevron-down.svg";

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
        settings: {
            url: "/family/settings",
            icon: <SettingsIcon />,
        },
    };
    const currentPage = pageOptions[page];

    const pages = Object.keys(pageOptions);
    pages.splice(pages.indexOf(page), 1);

    return (
        <div className={styles.stickyHeader}>
            <div className={styles.headerContent}>
                <h3 className={utilStyles.headingLg}>{children}</h3>
                <div tabIndex={0} role="button" className={styles.menuButton}>
                    {currentPage.icon}
                    <ChevronDown />
                    <div className={styles.dropdown}>
                        {pages.map((page) => (
                            <Link key={page} href={pageOptions[page].url}>
                                <a>{pageOptions[page].icon}</a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
