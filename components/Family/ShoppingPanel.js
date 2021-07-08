import PanelStickyHeader from "./PanelStickyHeader";

import styles from "./ShoppingPanel.module.scss";

export default function ShoppingPanel({ doc }) {
    return (
        <div className={styles.shoppingPanel}>
            <PanelStickyHeader page="shopping">Shopping list</PanelStickyHeader>
        </div>
    );
}
