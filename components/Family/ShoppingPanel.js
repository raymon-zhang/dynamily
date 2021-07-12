import { useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import PanelStickyHeader from "./PanelStickyHeader";

import styles from "./ShoppingPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import CheckIcon from "@icons/check.svg";
import ChevronRight from "@icons/chevron-right.svg";
import Modal from "@components/Modal";

export default function ShoppingPanel({ doc }) {
    const shoppingRef = doc?.ref?.collection("shopping");

    const query = shoppingRef
        ?.where("done", "==", false)
        ?.orderBy("createdAt", "desc");
    const [items, loading, error] = useCollection(query);

    return (
        <div className={styles.shoppingPanel}>
            <PanelStickyHeader page="shopping">Shopping list</PanelStickyHeader>

            <div className={styles.shoppingListContainer}>
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
                    onClick={() => {
                        setEditOpen(true);
                        console.log(editOpen);
                    }}
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

        await itemDoc.ref.set(
            {
                name: itemName,
                notes: itemNotes,
            },
            { merge: true }
        );

        setOpen(false);
    };

    return (
        <Modal isOpen onRequestClose={props.onRequestClose}>
            <h3 className={utilStyles.headingLg}>Edit Profile</h3>

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
