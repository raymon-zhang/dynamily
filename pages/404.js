import Metatags from "@components/Metatags";

import styles from "@styles/404.module.scss";

export default function Custom404() {
    return (
        <main>
            <Metatags title={"404 Not Found | Dynamily"} />
            <div className={styles.container}>
                <h1>404 - Not Found</h1>
            </div>
        </main>
    );
}
