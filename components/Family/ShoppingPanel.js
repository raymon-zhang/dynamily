import PanelStickyHeader from "./PanelStickyHeader";

import styles from "./ShoppingPanel.module.scss";

export default function ShoppingPanel({ doc }) {
    return (
        <div className={styles.shoppingPanel}>
            <PanelStickyHeader>Shopping list</PanelStickyHeader>
        </div>
    );
}
