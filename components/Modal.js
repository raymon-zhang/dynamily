import { useState } from "react";
import ReactModal from "react-modal";

import CloseButton from "./CloseButton";

const customStyles = {
    default: {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
        },
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            borderRadius: 8,
            padding: "40px 40px 40px 40px",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--color-base)",
            border: "none",
            maxHeight: "80vh",
            width: "90%",
            maxWidth: 530,
        },
    },
    imageView: {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
        },
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            borderRadius: 8,
            padding: 0,
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--color-base)",
            border: "none",
            height: "80vh",
            width: "90%",
            maxWidth: "720px",
        },
    },
};

export default function Modal({ children, variant = "default", ...props }) {
    return (
        <ReactModal
            shouldCloseOnEsc
            shouldFocusAfterRender
            style={customStyles[variant]}
            {...props}
        >
            <CloseButton
                onClick={(e) => props?.onRequestClose?.(e)}
                color={variant === "imageView" ? "white" : "black"}
            />
            <div>{children}</div>
        </ReactModal>
    );
}
