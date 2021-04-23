import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { useDarkMode } from "next-dark-mode";

import { UserContext, GAPIContext } from "@lib/context";
import { auth, signOut } from "@lib/firebase";

import Loader from "@components/Loader";

import utilStyles from "@styles/utils.module.scss";

import Logo from "@icons/Logo.svg";
import LogoWhite from "@icons/LogoWhite.svg";
import BrushIcon from "@icons/brush.svg";
import UserIcon from "@icons/user.svg";
import LogoutIcon from "@icons/log-out.svg";

// Top navbar
export default function Navbar() {
    const { user, username, loading } = useContext(UserContext);

    const {
        darkModeActive,
        switchToDarkMode,
        switchToLightMode,
    } = useDarkMode();

    const gapiLoaded = useContext(GAPIContext);

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
                                                        ? switchToLightMode()
                                                        : switchToDarkMode();
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </button>
                                    <button
                                        onClick={() => {
                                            signOut(gapiLoaded, router);
                                        }}
                                        disabled={!gapiLoaded}
                                        className="dropdownItem"
                                    >
                                        <LogoutIcon />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                            {/* <Link href={`/u/${username}`}>
                                <img src={user?.photoURL} />
                            </Link> */}
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
