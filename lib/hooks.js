import { auth, firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(undefined);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = firestore.collection("users").doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                if (doc.data()) {
                    setUsername(doc.data()?.username);
                } else {
                    setUsername(null);
                }
            });
        } else {
            setUsername(undefined);
        }

        return unsubscribe;
    }, [user]);

    return { user, username, loading };
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
