import CloseIcon from "@icons/x.svg";

import styles from "./CloseButton.module.scss";

/*
 * Returns a X button that calls onClick.
 * Should be used in a relatively positioned parent container
 */
export default function CloseButton({ color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`${styles.buttonContainer} ${
                color !== "var(--color-text)" ? styles.imageView : ""
            }`}
            style={{ color: color || "var(--color-text)" }}
        >
            <CloseIcon />
        </button>
    );
}
