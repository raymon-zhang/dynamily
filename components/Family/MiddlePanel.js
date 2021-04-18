import Link from "next/link";

import { useContext, useEffect, useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import ReactMarkdownWithHtml from "react-markdown/with-html";

import { UserContext } from "@lib/context";
import { serverTimestamp } from "@lib/firebase";
import { useScreenType } from "@lib/hooks";

import { timeSince } from "@utils/Date";

import User from "@components/User";
import RichTextEditor, { TextArea } from "./RichTextEditor";

import styles from "./MiddlePanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import ChevronRight from "@icons/chevron-right.svg";
import ChevronDown from "@icons/chevron-down.svg";
import MoreIcon from "@icons/more-vertical.svg";
import TrashIcon from "@icons/trash.svg";

export default function MiddlePanel({ doc }) {
    const family = doc?.data();
    const messagesRef = doc?.ref?.collection("messages");
    const [messages, setMessages] = useState([]);

    const { user, username } = useContext(UserContext);

    const query = messagesRef?.orderBy("createdAt", "desc").limit(10);
    const [first, loading, error] = useCollection(query);

    const screenType = useScreenType();

    useEffect(() => {
        first && setMessages(first.docs);
    }, [first]);

    const nextPage = async () => {
        const query = messagesRef
            .orderBy("createdAt", "desc")
            .startAfter(messages[messages.length - 1])
            .limit(10);

        await query.get().then((documentSnapshots) => {
            setMessages(messages.concat(documentSnapshots.docs));
        });
    };

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
                    {screenType === "threeCols" ? (
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
                    ) : (
                        <TextArea
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
                    )}
                </div>
                {messages.map((doc) => {
                    const message = doc.data();
                    return (
                        <div
                            key={doc.id}
                            className={`${styles.message} ${
                                message.username === username
                                    ? styles.messageSent
                                    : ""
                            }`}
                        >
                            <div className={styles.messageTop}>
                                <User
                                    username={message.username}
                                    options={{ size: "small" }}
                                    style={{
                                        color:
                                            message.username === username
                                                ? "var(--color-blue)"
                                                : "var(--color-text)",
                                    }}
                                />
                                <div className={styles.messageMeta}>
                                    {timeSince(message.createdAt?.toDate())}
                                    {message.username === username && (
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className={styles.menuButton}
                                        >
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
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ReactMarkdownWithHtml allowDangerousHtml>
                                {message.content}
                            </ReactMarkdownWithHtml>
                        </div>
                    );
                })}
                <button
                    onClick={nextPage}
                    className={`${styles.loadMore} btn-circle btn-blue-light`}
                >
                    <ChevronDown className={utilStyles.iconLeft} />
                    Load more
                </button>
            </div>
        </div>
    );
}
