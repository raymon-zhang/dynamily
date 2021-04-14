import Link from "next/link";

import { useContext } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import ReactMarkdownWithHtml from "react-markdown/with-html";

import { UserContext } from "@lib/context";
import { serverTimestamp } from "@lib/firebase";

import { timeSince } from "@utils/Date";

import User from "@components/User";
import RichTextEditor from "./RichTextEditor";

import styles from "./MiddlePanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import ChevronRight from "@icons/chevron-right.svg";
import MoreIcon from "@icons/more-vertical.svg";
import TrashIcon from "@icons/trash.svg";

export default function MiddlePanel({ doc }) {
    let user, username;
    const family = doc?.data();
    const messagesRef = doc?.ref?.collection("messages");
    let messages, loading, error;

    if (messagesRef) {
        const query = messagesRef.orderBy("createdAt", "desc").limit(10);

        [messages, loading, error] = useCollection(query);

        ({ user, username } = useContext(UserContext));
    }

    return (
        <div className={styles.middlePanel}>
            <div className={styles.stickyHeader}>
                <Link href="/family">
                    <a className={styles.headerContent}>
                        <h3 className={utilStyles.headingLg}>{family?.name}</h3>
                        <ChevronRight />
                    </a>
                </Link>
            </div>

            <div className={styles.messagesContainer}>
                <div className={styles.messageTextEditor}>
                    <RichTextEditor
                        placeholder={`What's on your mind, ${
                            user ? user?.displayName.split(" ")[0] : ""
                        }?`}
                        onSubmit={(value) => {
                            messagesRef.add({
                                username,
                                content: value,
                                createdAt: serverTimestamp(),
                            });
                        }}
                    />
                </div>
                {messages?.docs?.map((doc) => {
                    const message = doc.data();
                    return (
                        <div key={doc.id} className={styles.message}>
                            <div className={styles.messageTop}>
                                <User
                                    username={message.username}
                                    options={{ size: "small" }}
                                />
                                <div className={styles.messageMeta}>
                                    {timeSince(message.createdAt?.toDate())}
                                    {message.username === username && (
                                        <button className={styles.menuButton}>
                                            <MoreIcon />
                                            <div className={styles.dropdown}>
                                                <button
                                                    onClick={() => {
                                                        doc.ref.delete();
                                                    }}
                                                >
                                                    <TrashIcon />
                                                    Delete
                                                </button>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <ReactMarkdownWithHtml allowDangerousHtml>
                                {message.content}
                            </ReactMarkdownWithHtml>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
