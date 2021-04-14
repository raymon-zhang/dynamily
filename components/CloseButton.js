import CloseIcon from "@icons/x.svg";

import styles from "./CloseButton.module.scss";

/**Returns a X button that calls onClick.
 * Should be used in a relatively position parent container
 */

export default function CloseButton(props) {
    return (
        <button onClick={props.onClick} className={styles.buttonContainer}>
            <CloseIcon />
        </button>
    );
}
