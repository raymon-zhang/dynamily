import { useContext, useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PanelStickyHeader from "./PanelStickyHeader";
import Modal from "@components/Modal";
import User from "@components/User";

import { serverTimestamp } from "@lib/firebase";
import { UserContext } from "@lib/context";

import { defaultSelectStyles, defaultSelectTheme } from "@utils/ReactSelect";
import { toMmDdYyyy } from "@utils/Date";

import styles from "./TodosPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import CheckIcon from "@icons/check.svg";
import ChevronRight from "@icons/chevron-right.svg";

export default function TodosPanel({ doc }) {
    const [newTodo, setNewTodo] = useState("");
    const [currentView, setCurrentView] = useState({
        value: "notDone",
        label: "Not Done",
    });

    const { username } = useContext(UserContext);

    const todosRef = doc?.ref?.collection("todos");

    let query;

    if (currentView.value === "notDone") {
        query = todosRef
            ?.where("done", "==", false)
            ?.orderBy("createdAt", "desc");
    } else if (currentView.value === "done") {
        query = todosRef
            ?.where("done", "==", true)
            ?.orderBy("createdAt", "desc");
    } else if (currentView.value === "assigned") {
        query = todosRef
            ?.where("assigned", "array-contains", username)
            ?.where("done", "==", false)
            ?.orderBy("createdAt", "desc");
    }

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

    const viewOptions = [
        { value: "notDone", label: "Not done" },
        { value: "done", label: "Done" },
        { value: "assigned", label: "Assigned to me" },
    ];

    const viewSelectStyles = {
        ...defaultSelectStyles,
        control: (provided) => ({
            ...provided,
            backgroundColor: "transparent",
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "5px 20px",
        }),
    };

    return (
        <div className={styles.todosPanel}>
            <PanelStickyHeader>Family todos</PanelStickyHeader>

            <div className={styles.todosContainer}>
                <div className={styles.viewSelector}>
                    <label htmlFor="currentView">Filter: </label>
                    <Select
                        value={currentView}
                        onChange={(selectedView) =>
                            setCurrentView(selectedView)
                        }
                        options={viewOptions}
                        styles={viewSelectStyles}
                        theme={(theme) => ({
                            ...defaultSelectTheme(theme),
                            borderRadius: 5,
                        })}
                        id="currentView"
                        className={styles.viewSelect}
                    />
                </div>
                {currentView.value === "notDone" && (
                    <form onSubmit={addNewTodo} className={styles.newTodo}>
                        <input
                            value={newTodo}
                            onChange={(e) => {
                                setNewTodo(e.target.value);
                            }}
                            placeholder="Add a new todo..."
                            maxLength={255}
                        />
                        <button type="submit" className="btn-blue">
                            <ChevronRight />
                        </button>
                    </form>
                )}
                <ul className={styles.todosList}>
                    {todos?.docs?.map((todoDoc) => (
                        <TodoItem
                            key={todoDoc.id}
                            todoDoc={todoDoc}
                            familyDoc={doc}
                        />
                    ))}
                </ul>
                {!todos?.docs?.length && (
                    <p className={styles.noMessages}>
                        No todos here. Create one to get started...
                    </p>
                )}
            </div>
        </div>
    );
}

function TodoItem({ todoDoc, familyDoc }) {
    const [editOpen, setEditOpen] = useState(false);

    const todo = todoDoc.data();

    const { username } = useContext(UserContext);

    let todoMeta = "";
    if (todo.deadline) {
        todoMeta += `Due ${toMmDdYyyy(todo.deadline.toDate())}`;
    }
    if (todo.assigned.includes(username)) {
        todoMeta += ` · Assigned to you`;
    }
    if (todo?.deadline?.toDate() < new Date()) {
        todoMeta += ` · Overdue`;
    }

    return (
        <>
            <li
                className={`${styles.todo} ${styles[`todo${todo.color}`]} ${
                    todo.assigned.includes(username) ||
                    todo?.deadline?.toDate() < new Date()
                        ? styles.todoDanger
                        : ""
                }`}
            >
                <button
                    onClick={() => {
                        todoDoc.ref.set({ done: !todo.done }, { merge: true });
                    }}
                    className={styles.todoCheckmark}
                >
                    <CheckIcon />
                </button>
                <div
                    className={styles.todoDescription}
                    tabIndex={0}
                    role="button"
                    onClick={() => setEditOpen(true)}
                >
                    {todo.name}
                    {todoMeta && (
                        <div className={styles.todoMeta}>{todoMeta}</div>
                    )}
                </div>
                <ul className={styles.assignedUsersList}>
                    {todo.assigned?.map((assign) => (
                        <li key={assign} className={styles.assignedUser}>
                            <User
                                username={assign}
                                options={{ size: "photo" }}
                                style={{ padding: 0 }}
                            />
                        </li>
                    ))}
                </ul>
            </li>
            {editOpen && (
                <EditTodo
                    todoDoc={todoDoc}
                    familyDoc={familyDoc}
                    setOpen={(value) => setEditOpen(value)}
                    onRequestClose={() => setEditOpen(false)}
                />
            )}
        </>
    );
}

function EditTodo({ todoDoc, familyDoc, setOpen, ...props }) {
    const todoData = todoDoc.data();

    const [todoName, setTodoName] = useState(todoData.name ?? "");
    const [todoColor, setTodoColor] = useState(
        {
            value: todoData.color,
            label:
                todoData.color.charAt(0).toUpperCase() +
                todoData.color.slice(1),
        } ?? ""
    );
    const [todoAssign, setTodoAssign] = useState(
        todoData.assigned.map((user) => ({ value: user, label: user })) ?? []
    );
    const [todoDeadline, setTodoDeadline] = useState(
        todoData.deadline?.toDate() ?? null
    );

    const colorOptions = [
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
        { value: "yellow", label: "Yellow" },
        { value: "purple", label: "Purple" },
    ];

    const assignOptions = familyDoc
        .data()
        .members.map((user) => ({ value: user, label: user }));

    const colorSelectStyles = {
        ...defaultSelectStyles,
        control: (provided) => ({
            ...provided,
            border: "none",
            backgroundColor: `var(--color-${todoColor.value}-light)`,
            borderRadius: 20,
        }),
    };

    const colorSelectTheme = (theme) => ({
        ...theme,
        borderRadius: 10,
        colors: {
            ...theme.colors,
            primary: `var(--color-${todoColor.value})`,
            primary25: `var(--color-${todoColor.value}-light)`,
            primary50: `var(--color-${todoColor.value}-light)`,
            neutral0: "var(--color-base)",
            neutral20: "var(--color-gray)",
            neutral80: "#08090a",
        },
    });

    const assignSelectStyles = {
        ...defaultSelectStyles,
        valueContainer: (provided) => ({
            ...provided,
            padding: "6px 20px",
        }),
        multiValue: (provided) => ({
            ...provided,
            paddingLeft: "3px",
            borderRadius: 20,
            margin: 3,
            marginTop: 1,
            marginBottom: 1,
            overflow: "hidden",
            backgroundColor: "var(--color-blue-lighter)",
            color: "var(--color-blue)",
            div: {
                borderRadius: 0,
                color: "var(--color-blue)",
                transition: "background-color 100ms",
                "&:first-of-type": {
                    paddingTop: 3,
                    paddingBottom: 3,
                    fontSize: "1rem",
                },
            },
        }),
    };

    const save = async (e) => {
        e.preventDefault();

        await todoDoc.ref.set(
            {
                name: todoName,
                color: todoColor.value,
                assigned: todoAssign.map((assign) => assign.value),
                deadline: todoDeadline,
            },
            { merge: true }
        );

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <div className={styles.todoFormTop}>
                <h3 className={utilStyles.headingLg}>Edit todo</h3>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        todoDoc.ref.delete();
                        setOpen(false);
                    }}
                    className="btn-red-light"
                >
                    Delete todo
                </button>
            </div>

            <form onSubmit={save}>
                <label htmlFor="todoName">Name</label>
                <input
                    value={todoName}
                    onChange={(e) => setTodoName(e.target.value)}
                    placeholder="e.g. Buy some milk"
                    className="marginSpacing"
                    id="todoName"
                    maxLength={255}
                />
                <label htmlFor="todoColor">Color</label>
                <Select
                    value={todoColor}
                    onChange={(selectedColor) => setTodoColor(selectedColor)}
                    options={colorOptions}
                    styles={colorSelectStyles}
                    theme={colorSelectTheme}
                    className="marginSpacing"
                    id="todoColor"
                />
                <label htmlFor="todoAssign">Assign</label>
                <Select
                    isMulti
                    value={todoAssign}
                    onChange={(selectedAssign) => setTodoAssign(selectedAssign)}
                    options={assignOptions}
                    styles={assignSelectStyles}
                    theme={defaultSelectTheme}
                    isOptionDisabled={(option) => todoAssign.length >= 4}
                    className="marginSpacing"
                    id="todoAssign"
                />
                <label htmlFor="todoDeadline">Deadline</label>
                <DatePicker
                    selected={todoDeadline}
                    onChange={(date) => setTodoDeadline(date)}
                    id="todoDeadline"
                    className="marginSpacing"
                    placeholderText="Pick a date..."
                />
                <button type="submit">Save</button>
            </form>
        </Modal>
    );
}
