import Link from "next/link";
import Image from "next/image";

import motherImage from "../public/images/family_mother.jpg";
import fatherImage from "../public/images/family_father.jpg";
import olderSonImage from "../public/images/family_olderSon.jpg";
import youngerSonImage from "../public/images/family_youngerSon.jpg";

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
                        It can be difficult to keep your family organized.
                        Dynamily empowers you manage and connect your family's
                        everyday life, for free.
                    </p>
                    <Link href="/login">
                        <button
                            className={`${styles.heroButton} ${styles.heroCta}`}
                        >
                            Sign up today
                        </button>
                    </Link>
                    <Link href="/login">
                        <button
                            className={`${styles.heroButton} ${styles.heroSecondary}`}
                        >
                            Learn more
                        </button>
                    </Link>
                </div>
                <div className={`${styles.familyImage} ${styles.familyMother}`}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={motherImage}
                            width={144}
                            height={144}
                            alt={"Mother"}
                            placeholder="blur"
                        />
                    </div>
                </div>
                <div className={`${styles.familyImage} ${styles.familyFather}`}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={fatherImage}
                            width={144}
                            height={144}
                            alt={"Father"}
                            placeholder="blur"
                        />
                    </div>
                    <div className={styles.dots} />
                </div>
                <div
                    className={`${styles.familyImage} ${styles.familyOlderSon}`}
                >
                    <div className={styles.imageContainer}>
                        <Image
                            src={olderSonImage}
                            width={144}
                            height={144}
                            alt={"Older Son"}
                            placeholder="blur"
                        />
                    </div>
                    <div className={styles.dots} />
                </div>
                <div
                    className={`${styles.familyImage} ${styles.familyYoungerSon}`}
                >
                    <div className={styles.imageContainer}>
                        <Image
                            src={youngerSonImage}
                            width={144}
                            height={144}
                            alt={"Younger Son"}
                            placeholder="blur"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
