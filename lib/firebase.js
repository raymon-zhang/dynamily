import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import { useRouter } from "next/router";
import { useContext } from "react";

import { GAPIContext } from "@lib/context";

const firebaseConfig = {
    apiKey: "AIzaSyAM_HBTzHRwctNGYxlQV8jNNhMSuloymZI",
    authDomain: "raymonzhang-family-app.firebaseapp.com",
    projectId: "raymonzhang-family-app",
    storageBucket: "raymonzhang-family-app.appspot.com",
    messagingSenderId: "780407119655",
    appId: "1:780407119655:web:f977b3608f192b9cfb9302",
    measurementId: "G-68GS2VKE76",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

/**`
 * Signs out the user
 * @param  {string} gapiLoaded - Is the Google API loaded. Example: useContext(GAPILoaded)
 * @param {Object} router - The Next router object, if you want to reload. Example: useRouter()
 */
export const signOut = (gapiLoaded, router = null) => {
    if (gapiLoaded) {
        gapi.auth2.getAuthInstance().signOut();
        auth.signOut();
        router && router.reload();
        return true;
    } else {
        return null;
    }
};

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection("users");
    const query = usersRef.where("username", "==", username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}
