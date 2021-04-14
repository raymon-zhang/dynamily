import { useScreenType } from "@lib/hooks";

import styles from "./DefaultDesktop.module.scss";

export default function DefaultDesktopLayout({
    leftPanel,
    rightPanel,
    children,
}) {
    const screenType = useScreenType();

    var middle = null;

    switch (screenType) {
        case "threeCols":
            middle = (
                <>
                    {leftPanel}
                    {children}
                    {rightPanel}
                </>
            );
            break;
        case "twoCols":
            middle = (
                <>
                    {children}
                    {rightPanel}
                </>
            );
            break;
        case "oneCols":
            middle = <>{children}</>;
            break;
        case "fullscreen":
            middle = <>{children}</>;
            break;
    }

    return (
        <div className={`${styles.gridContainer} ${styles[screenType]}`}>
            {middle}
        </div>
    );
}
