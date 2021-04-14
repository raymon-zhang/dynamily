import { useEffect } from "react";

import toast, { Toaster } from "react-hot-toast";

export default function Toasts() {
    const offline = () => {
        toast.error("You're offline!");
    };

    const online = () => {
        toast.success("Back online!");
    };

    useEffect(() => {
        window.addEventListener("offline", offline);
        window.addEventListener("online", online);
        return () => {
            window.removeEventListener("offline", offline);
            window.removeEventListener("online", online);
        };
    });

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    padding: "20px",
                },
                success: {
                    style: {
                        backgroundColor: "var(--color-green-light)",
                        color: "var(--color-green)",
                    },
                    iconTheme: {
                        primary: "var(--color-green)",
                        secondary: "white",
                    },
                },
                error: {
                    style: {
                        backgroundColor: "var(--color-red-light)",
                        color: "var(--color-red)",
                    },
                    iconTheme: {
                        primary: "var(--color-red)",
                        secondary: "white",
                    },
                },
            }}
        />
    );
}
