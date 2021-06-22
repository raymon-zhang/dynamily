import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { useTheme } from "next-themes";

import { UserContext } from "@lib/context";
import { signOut } from "@lib/firebase";

import utilStyles from "@styles/utils.module.scss";

import Logo from "@icons/Logo.svg";
import LogoWhite from "@icons/LogoWhite.svg";
import BrushIcon from "@icons/brush.svg";
import UserIcon from "@icons/user.svg";
import LogoutIcon from "@icons/log-out.svg";

// Top navbar
export default function Navbar() {
    const { user, username, loading } = useContext(UserContext);

    const { theme, setTheme } = useTheme();
    const darkModeActive = theme === "dark";

    const router = useRouter();

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <a className="logo">
                            {darkModeActive ? <LogoWhite /> : <Logo />}
                        </a>
                    </Link>
                </li>

                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className={utilStyles.pushLeft}>
                            <div
                                tabIndex={0}
                                role="button"
                                className="profileButton"
                            >
                                <img src={user?.photoURL} />
                                <div className="dropdown">
                                    <Link href={`/u/${username}`}>
                                        <a className="dropdownItem">
                                            <UserIcon /> Profile
                                        </a>
                                    </Link>
                                    <button className="dropdownItem">
                                        <BrushIcon /> Dark mode{" "}
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={darkModeActive}
                                                onChange={() => {
                                                    darkModeActive
                                                        ? setTheme("light")
                                                        : setTheme("dark");
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </button>
                                    <button
                                        onClick={() => {
                                            signOut(router);
                                        }}
                                        className="dropdownItem"
                                    >
                                        <LogoutIcon />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/login">
                            <button className="btn-blue-light">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
