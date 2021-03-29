import { auth, firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user, loading] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const ref = firestore.collection("users").doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username, loading };
}

export function useAuthRedirect({
    user,
    loading,
    redirectTo = false,
    redirectIfFound = false,
} = {}) {
    const router = useRouter();

    useEffect(() => {
        if (!redirectTo || !user || loading) {
            return;
        }

        if (
            (redirectTo && !redirectIfFound && !user) ||
            (redirectIfFound && user)
        ) {
            router.push(redirectTo);
        }
    }, [user]);
}
