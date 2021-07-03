export const defaultSelectStyles = {
    container: (provided) => ({
        ...provided,
        width: "100%",
        display: "inline-block",
    }),
    control: (provided) => ({
        ...provided,
        border: "none",
        backgroundColor: "var(--color-blue-light)",
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: "10px 20px",
    }),
    input: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
        input: {
            borderRadius: 0,
            boxShadow: "none",
        },
    }),
    menu: (provided) => ({
        ...provided,
        border: "none",
        boxShadow: "0px 2px 10px 10px var(--color-shadow)",
        overflow: "hidden",
    }),
    menuList: (provided) => ({
        ...provided,
        padding: 0,
    }),
    multiValue: (provided) => ({
        ...provided,
        marginTop: 0,
        marginBottom: 0,
    }),
};

export const defaultSelectTheme = (theme) => ({
    ...theme,
    borderRadius: 20,
    colors: {
        ...theme.colors,
        primary: "var(--color-blue)",
        primary25: "var(--color-blue-light)",
        primary50: "var(--color-blue-light)",
        danger: "var(--color-red)",
        dangerLight: "var(--color-red-light)",
        neutral0: "var(--color-base)",
        neutral20: "var(--color-gray)",
        neutral50: "#08090a",
        neutral80: "#08090a",
    },
});
