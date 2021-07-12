import { useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import Select from "react-select";

import PanelStickyHeader from "./PanelStickyHeader";

import { serverTimestamp } from "@lib/firebase";

import { defaultSelectStyles, defaultSelectTheme } from "@utils/ReactSelect";

import styles from "./ShoppingPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import CheckIcon from "@icons/check.svg";
import ChevronRight from "@icons/chevron-right.svg";
import Modal from "@components/Modal";
import toast from "react-hot-toast";

export default function ShoppingPanel({ doc }) {
    const [newItem, setNewItem] = useState("");
    const [currentView, setCurrentView] = useState({
        value: "notDone",
        label: "Not done",
    });

    const shoppingRef = doc?.ref?.collection("shopping");

    let query;

    if (currentView.value === "notDone") {
        query = shoppingRef
            ?.where("done", "==", false)
            ?.orderBy("createdAt", "desc");
    } else if (currentView.value === "done") {
        query = shoppingRef
            ?.where("done", "==", true)
            ?.orderBy("createdAt", "desc");
    }

    const [items, loading, error] = useCollection(query);

    const addNewItem = (e) => {
        e.preventDefault();
        shoppingRef
            .add({
                name: newItem,
                notes: "",
                done: false,
                createdAt: serverTimestamp(),
            })
            .catch((e) => toast.error("Oops! An error occured."));
        setNewItem("");
    };

    const viewOptions = [
        { value: "notDone", label: "Not done" },
        { value: "done", label: "Done" },
    ];

    return (
        <div className={styles.shoppingPanel}>
            <PanelStickyHeader page="shopping">Shopping list</PanelStickyHeader>

            <div className={styles.shoppingListContainer}>
                <div className={styles.viewSelector}>
                    <label htmlFor="currentView">Filter: </label>
                    <Select
                        value={currentView}
                        onChange={(selectedView) =>
                            setCurrentView(selectedView)
                        }
                        options={viewOptions}
                        styles={defaultSelectStyles}
                        theme={defaultSelectTheme}
                        id="currentView"
                        className={styles.viewSelect}
                    />
                </div>
                {currentView.value === "notDone" && (
                    <form onSubmit={addNewItem} className={styles.newItem}>
                        <input
                            value={newItem}
                            onChange={(e) => {
                                setNewItem(e.target.value);
                            }}
                            placeholder="Add item..."
                            maxLength={255}
                        />
                        <button type="submit" className="btn-blue">
                            <ChevronRight />
                        </button>
                    </form>
                )}
                <ul className={styles.itemsList}>
                    {items?.docs.map((item) => (
                        <ShoppingItem key={item.id} itemDoc={item} />
                    ))}
                </ul>
                {!items?.docs?.length && (
                    <p className={styles.noItems}>
                        No items yet. Add one to get started...
                    </p>
                )}
            </div>
        </div>
    );
}

const ShoppingItem = ({ itemDoc }) => {
    const [editOpen, setEditOpen] = useState(false);

    const item = itemDoc.data();

    return (
        <>
            <li className={styles.item}>
                <button
                    onClick={() => {
                        itemDoc.ref.set({ done: !item.done }, { merge: true });
                    }}
                    className={styles.itemCheckmark}
                >
                    <CheckIcon />
                </button>
                <div
                    className={styles.itemDescription}
                    tabIndex={0}
                    role="button"
                    onClick={() => setEditOpen(true)}
                >
                    {item.name}
                </div>
            </li>
            {editOpen && (
                <EditItem
                    itemDoc={itemDoc}
                    setOpen={setEditOpen}
                    onRequestClose={() => setEditOpen(false)}
                />
            )}
        </>
    );
};

const EditItem = ({ itemDoc, setOpen, ...props }) => {
    const itemData = itemDoc.data();

    const [itemName, setItemName] = useState(itemData?.name ?? "");
    const [itemNotes, setItemNotes] = useState(itemData?.notes ?? "");

    const save = async (e) => {
        e.preventDefault();

        await itemDoc.ref
            .set(
                {
                    name: itemName,
                    notes: itemNotes,
                },
                { merge: true }
            )
            .catch((e) => toast.error("Oops! An error occured."));

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>Edit item</h3>

            <form onSubmit={save}>
                <label htmlFor="itemName">Name</label>
                <input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Milk"
                    className="marginSpacing"
                    id="itemName"
                    maxLength={255}
                />
                <label htmlFor="itemNotes">Notes</label>
                <textarea
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="Add notes"
                    className="marginSpacing"
                    id="itemNotes"
                    rows={4}
                />
                <button type="submit">Save</button>
            </form>
        </Modal>
    );
};
