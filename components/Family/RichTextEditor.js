import { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
    Text,
} from "slate";
import { withHistory } from "slate-history";

import styles from "./RichTextEditor.module.scss";

// import { Button, Icon, Toolbar } from "../components";

import IconBold from "@icons/bold.svg";
import IconItalic from "@icons/italic.svg";
import IconUnderline from "@icons/underline.svg";
import IconCode from "@icons/code.svg";
import IconList from "@icons/list.svg";
import IconOrderedList from "@icons/list-ordered.svg";
import IconOne from "@icons/one.svg";
import IconTwo from "@icons/two.svg";
import IconQuote from "@icons/quote.svg";

const icons = {
    bold: <IconBold />,
    italic: <IconItalic />,
    underline: <IconUnderline />,
    code: <IconCode />,
    list: <IconList />,
    "list-ordered": <IconOrderedList />,
    one: <IconOne />,
    two: <IconTwo />,
    quote: <IconQuote />,
};

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichTextEditor = ({ onSubmit, placeholder }) => {
    const [value, setValue] = useState(initialValue);
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={(value) => setValue(value)}
        >
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder={placeholder}
                spellCheck
                onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            toggleMark(editor, mark);
                        }
                    }
                }}
            />
            <Toolbar
                value={value}
                editor={editor}
                setValue={setValue}
                onSubmit={onSubmit}
            >
                <MarkButton format="bold" icon="bold" />
                <MarkButton format="italic" icon="italic" />
                <MarkButton format="underline" icon="underline" />
                <MarkButton format="code" icon="code" />
                <BlockButton format="heading-one" icon="one" />
                <BlockButton format="heading-two" icon="two" />
                <BlockButton format="block-quote" icon="quote" />
                <BlockButton format="numbered-list" icon="list-ordered" />
                <BlockButton format="bulleted-list" icon="list" />
            </Toolbar>
        </Slate>
    );
};

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            LIST_TYPES.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
        split: true,
    });
    const newProperties = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === format,
    });

    return !!match;
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case "block-quote":
            return <blockquote {...attributes}>{children}</blockquote>;
        case "bulleted-list":
            return <ul {...attributes}>{children}</ul>;
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case "heading-two":
            return <h2 {...attributes}>{children}</h2>;
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "numbered-list":
            return <ol {...attributes}>{children}</ol>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

const Toolbar = ({ value, setValue, editor, onSubmit, children }) => (
    <div className={`${styles.menu} ${styles.toolbar}`}>
        {children}
        <button
            onClick={() => {
                Transforms.deselect(editor);
                onSubmit(value.map((node) => serializeToMd(node)).join("\n"));
                setValue(initialValue);
            }}
            className={styles.submit}
        >
            Send
        </button>
    </div>
);

const Button = ({ active, icon, ...props }) => {
    return (
        <span {...props} className={active ? styles.active : styles.button}>
            {icons[icon]}
        </span>
    );
};

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
            icon={icon}
        />
    );
};

const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
            icon={icon}
        />
    );
};

const initialValue = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    },
];

const serializeToMd = (node) => {
    if (Text.isText(node)) {
        var string = node.text;

        if (node.bold) {
            string = `**${string}**`;
        }
        if (node.italic) {
            string = `*${string}*`;
        }
        if (node.underline) {
            string = `<ins>${string}</ins>`;
        }
        if (node.code) {
            string = `\`${string}\``;
        }
        return string;
    }

    const children = node.children.map((n) => serializeToMd(n));

    switch (node.type) {
        case "paragraph":
            return children.join("\n") + "\n";
        case "block-quote":
            return children.map((child) => "> " + child).join("\n");
        case "heading-one":
            return "# " + children;
        case "heading-two":
            return "## " + children;
        case "numbered-list":
            return children.map((child) => "1. " + child).join("\n");
        case "bulleted-list":
            return children.map((child) => " - " + child).join("\n");
        default:
            return children.join("\n");
    }
};

export default RichTextEditor;
