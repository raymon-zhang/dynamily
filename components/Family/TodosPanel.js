import { useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import PanelStickyHeader from "./PanelStickyHeader";

import { serverTimestamp } from "@lib/firebase";

import styles from "./TodosPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import CheckIcon from "@icons/check.svg";

export default function TodosPanel({ doc }) {
    const [newTodo, setNewTodo] = useState("");

    const todosRef = doc?.ref?.collection("todos");

    const query = todosRef
        ?.where("done", "==", false)
        ?.orderBy("createdAt", "desc");
    const [todos, loading, error] = useCollection(query);

    const addNewTodo = (e) => {
        e.preventDefault();
        todosRef.add({
            name: newTodo,
            done: false,
            deadline: null,
            assigned: [],
            color: "blue",
            createdAt: serverTimestamp(),
        });
        setNewTodo("");
    };

    return (
        <div className={styles.todosPanel}>
            <PanelStickyHeader>Family todos</PanelStickyHeader>

            <div className={styles.todosContainer}>
                <form onSubmit={addNewTodo}>
                    <input
                        value={newTodo}
                        onChange={(e) => {
                            setNewTodo(e.target.value);
                        }}
                        placeholder="Add a new todo..."
                    />
                </form>
                <ul className={styles.todosList}>
                    {todos?.docs?.map((doc) => (
                        <TodoItem key={doc.id} doc={doc} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function TodoItem({ doc }) {
    const todo = doc.data();

    return (
        <li
            className={`${styles.todo} ${styles[`todo${todo.color}`]}`}
            onClick={() => setEditOpen(true)}
        >
            <button
                onClick={() => {
                    doc.ref.set({ done: true }, { merge: true });
                }}
                className={styles.todoCheckmark}
            >
                <CheckIcon />
            </button>
            {todo.name}
        </li>
    );
}
