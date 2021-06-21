import { createContext } from "react";

export const UserContext = createContext({
    user: null,
    username: undefined,
    userDoc: undefined,
    loading: false,
});
