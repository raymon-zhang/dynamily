import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";

import { useMediaQuery } from "react-responsive";

import { auth, firestore } from "@lib/firebase";

/**  Custom hook to read  auth record and user profile doc.
 * username is undefined while loading, null if no user, and false if no username
 */
export function useUserData() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(undefined);
    const [userDoc, setUserDoc] = useState(undefined);

    useEffect(() => {
        if (loading) {
            return;
        }
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = firestore.collection("users").doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                const data = doc.data();
                if (data) {
                    setUserDoc(data);
                    setUsername(data?.username);
                } else {
                    setUsername(null);
                    setUserDoc(null);
                }
            });
        } else {
            setUsername(undefined);
            setUserDoc(undefined);
        }

        return unsubscribe;
    }, [user, loading]);

    return { user, username, userDoc, loading };
}

export function useAuthRedirect({
    username,
    loading,
    redirectTo = false,
    redirectIfFound = false,
} = {}) {
    const router = useRouter();

    useEffect(() => {
        if (!redirectTo || !username || loading) {
            return;
        }

        if (
            (redirectTo && !redirectIfFound && !username) ||
            (redirectIfFound && username)
        ) {
            router.push(redirectTo);
        }
    }, [username]);
}

export const useScreenType = () => {
    const is3Cols = useMediaQuery({ minWidth: 1440 });
    const is2Cols = useMediaQuery({ minWidth: 1265 });
    const is1Cols = useMediaQuery({ minWidth: 800 });

    if (is3Cols) {
        return "threeCols";
    }
    if (is2Cols) {
        return "twoCols";
    }
    if (is1Cols) {
        return "oneCols";
    }

    return "fullscreen";
};
