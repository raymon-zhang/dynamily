import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext, GAPIContext } from "@lib/context";
import { auth, signOut } from "@lib/firebase";

import Loader from "@components/Loader";

import utilStyles from "@styles/utils.module.scss";

import Logo from "@icons/Logo.svg";

// Top navbar
export default function Navbar() {
    const { user, username, loading } = useContext(UserContext);

    const gapiLoaded = useContext(GAPIContext);

    const router = useRouter();

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <a className="logo">
                            <Logo />
                        </a>
                    </Link>
                </li>

                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className={utilStyles.pushLeft}>
                            <button
                                onClick={() => {
                                    signOut(gapiLoaded, router);
                                }}
                                disabled={!gapiLoaded}
                            >
                                Sign Out
                            </button>
                        </li>

                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL || "/hacker.png"} />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/login">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
