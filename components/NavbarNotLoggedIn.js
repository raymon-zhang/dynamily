import Link from "next/link";

import styles from "./NavbarNotLoggedIn.module.scss";
import utilStyles from "@styles/utils.module.scss";

import Logo from "@icons/Logo.svg";

// Top navbar
export default function NavbarNotLoggedIn() {
    return (
        <nav className={styles.navbarNotLoggedIn}>
            <ul>
                <li>
                    <Link href="/">
                        <a className="logo">
                            <Logo />
                        </a>
                    </Link>
                </li>

                {/* <li className={utilStyles.pushLeft}>
                        </li> */}
                <li className={utilStyles.pushLeft}>
                    <Link href="/login">
                        <button className={styles.loginButton}>Log in</button>
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        <button className={styles.signupButton}>Sign up</button>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
