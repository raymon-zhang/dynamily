import { useScreenType } from "@lib/hooks";

import styles from "./DefaultDesktop.module.scss";

export default function DefaultDesktopLayout({
    leftPanel,
    rightPanel,
    children,
}) {
    const screenType = useScreenType();

    let left, right;

    switch (screenType) {
        case "threeCols":
            left = leftPanel;
            right = rightPanel;
            break;
        case "twoCols":
            left = null;
            right = rightPanel;
            break;
        case "oneCols":
            left = null;
            right = null;
            break;
        case "fullscreen":
            left = null;
            right = null;
            break;
    }

    return (
        <div className={`${styles.gridContainer} ${styles[screenType]}`}>
            {left}
            {children}
            {right}
        </div>
    );
}
