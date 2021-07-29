import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { useTheme } from "next-themes";

import { UserContext } from "@lib/context";
import { signOut } from "@lib/firebase";

import NavbarNotLoggedIn from "./NavbarNotLoggedIn";

import styles from "./Navbar.module.scss";
import utilStyles from "@styles/utils.module.scss";

import Logo from "@icons/Logo.svg";
import BrushIcon from "@icons/brush.svg";
import UserIcon from "@icons/user.svg";
import LogoutIcon from "@icons/log-out.svg";

// Top navbar
export default function Navbar() {
    const { user, username, loading } = useContext(UserContext);

    const { theme, setTheme } = useTheme();
    const darkModeActive = theme === "dark";

    const router = useRouter();

    if (!username) {
        return <NavbarNotLoggedIn />;
    }
    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link href="/">
                        <a className="logo">
                            <Logo />
                        </a>
                    </Link>
                </li>

                <li className={utilStyles.pushLeft}>
                    <div
                        tabIndex={0}
                        role="button"
                        className={styles.profileButton}
                    >
                        <img src={user?.photoURL} />
                        <div className={styles.dropdown}>
                            <Link href={`/u/${username}`}>
                                <a className={styles.dropdownItem}>
                                    <UserIcon /> Profile
                                </a>
                            </Link>
                            <button className={styles.dropdownItem}>
                                <BrushIcon /> Dark mode{" "}
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={darkModeActive}
                                        onChange={() => {
                                            darkModeActive
                                                ? setTheme("light")
                                                : setTheme("dark");
                                        }}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </button>
                            <button
                                onClick={() => {
                                    signOut(router);
                                }}
                                className={styles.dropdownItem}
                            >
                                <LogoutIcon />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
