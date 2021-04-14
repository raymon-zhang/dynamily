import Link from "next/link";

import { auth, firestore, googleAuthProvider } from "@lib/firebase";
import { UserContext, GAPIContext } from "@lib/context";
import { useAuthRedirect } from "@lib/hooks";
import Metatags from "@components/Metatags";
import Loader from "@components/Loader";

import styles from "@styles/login.module.scss";
import utilStyles from "@styles/utils.module.scss";

import GoogleIcon from "@icons/google.svg";

import { useEffect, useState, useCallback, useContext } from "react";

import debounce from "lodash.debounce";
import toast from "react-hot-toast";

import LoginButtonSide from "@icons/loginButtonSide.svg";
import LoginUsernameSide from "@icons/loginUsernameSide.svg";

export default function Login(props) {
    const { user, username, loading } = useContext(UserContext);

    useAuthRedirect({
        username,
        loading,
        redirectTo: "/",
        redirectIfFound: true,
    });
    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            <Metatags title="Login" description="Login to Dynamily" />
            {loading ? (
                <Loader show={true} />
            ) : user ? (
                username === null ? (
                    <UsernameForm />
                ) : (
                    <Loader show={true} />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

// Sign in with Google button
function SignInButton(props) {
    function listUpcomingEvents() {
        gapi.client.calendar.events
            .list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
            })
            .then(function (response) {
                var events = response.result.items;
                console.log("Upcoming events:");

                if (events.length > 0) {
                    for (let i = 0; i < events.length; i++) {
                        var event = events[i];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        console.log(event.summary + " (" + when + ")");
                    }
                } else {
                    console.log("No upcoming events found.");
                }
            });
    }

    const signInWithGoogle = async () => {
        var error;
        await gapi.auth2
            .getAuthInstance()
            .signIn()
            .then((googleUser) => {
                var unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
                    unsubscribe();

                    if (!isUserEqual(googleUser, firebaseUser)) {
                        var credential = googleAuthProvider.credential(
                            googleUser.getAuthResponse().id_token
                        );
                        return auth.signInWithCredential(credential);
                    }
                });
            })
            .catch((e) => {
                toast.error("Error logging in");
                error = e;
            });
        if (!error) {
            listUpcomingEvents();
            toast.success("Logged in successfuly");
        }
    };

    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    const gapiLoaded = useContext(GAPIContext);

    return (
        <div className={`${utilStyles.boxCenter} ${styles.loginOuter}`}>
            <div className={styles.loginContainer}>
                <div className={styles.loginSide}>
                    <LoginButtonSide className={styles.loginSideFigure} />
                </div>
                <div className={styles.loginMain}>
                    <h3
                        className={`${utilStyles.headingLg} ${styles.loginHeading}`}
                    >
                        Sign in to your account
                    </h3>
                    <p>
                        By signing in, you agree to our Terms of service and
                        Privacy policy.
                    </p>
                    <button
                        className={`${styles.googleBtn} ${utilStyles.borderCircle}`}
                        onClick={gapiLoaded ? signInWithGoogle : null}
                    >
                        <GoogleIcon className={styles.googleIcon} /> Sign in
                        with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

// Username form
function UsernameForm() {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = firestore.batch();
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
            familyId: null,
        });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    //

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log("Firestore read executed!");
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <div className={`${utilStyles.boxCenter} ${styles.loginOuter}`}>
                <div className={styles.loginContainer}>
                    <div className={styles.loginMain}>
                        <h3
                            className={`${utilStyles.headingLg} ${styles.loginHeading}`}
                        >
                            Choose Username
                        </h3>
                        <form onSubmit={onSubmit}>
                            <input
                                name="username"
                                className={utilStyles.borderCircle}
                                placeholder="myname"
                                value={formValue}
                                onChange={onChange}
                            />
                            <UsernameMessage
                                username={formValue}
                                isValid={isValid}
                                loading={loading}
                            />
                            <button
                                type="submit"
                                className="btn-blue-light"
                                disabled={!isValid}
                            >
                                Choose
                            </button>

                            {/* <h3>Debug State</h3>
                        <div>
                            Username: {formValue}
                            <br />
                            Loading: {loading.toString()}
                            <br />
                            Username Valid: {isValid.toString()}
                        </div> */}
                        </form>
                    </div>
                    <div className={styles.loginSide}>
                        <LoginUsernameSide className={styles.loginSideFigure} />
                    </div>
                </div>
            </div>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is not available!</p>;
    } else {
        return <p>&nbsp;</p>;
    }
}
