import styles from "./LandingPage.module.scss";

export default function LandingPage() {
    return (
        <div className={styles.landingPage}>
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <h1 className={styles.heroHeading}>
                        Keep your family organized
                    </h1>
                    <p className={styles.heroSubHeading}>
                        Dynamily helps you manage and connect your family's
                        everyday life.
                    </p>
                </div>
            </section>
        </div>
    );
}
