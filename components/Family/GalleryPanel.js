import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import Jimp from "jimp/es";

import { UserContext } from "@lib/context";
import { STATE_CHANGED, storage } from "@lib/firebase";

import styles from "./GalleryPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

export default function GalleryPanel({ doc }) {
    const { username } = useContext(UserContext);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState([0]);

    const [images, setImages] = useState([]);

    useEffect(() => {
        getImages();
    }, [doc]);

    const getImages = async () => {
        if (doc) {
            const ref = storage.ref(`familyUploads/${doc.id}`);
            const firstPage = await ref.list({ maxResults: 25 });

            const images = await Promise.all(
                firstPage.items.map(async (item) => {
                    return {
                        url: await item.getDownloadURL(),
                        name: item.name,
                    };
                })
            );

            setImages(images);
        }
    };

    const uploadImages = async (e) => {
        setUploading(true);

        const files = await Promise.all(
            Array.from(e.target.files).map(async (file) => {
                const reader = new FileReader();

                const buffer = await new Promise((resolve, reject) => {
                    reader.onerror = () => {
                        reader.abort();
                        reject(new DOMException("Problem parsing input file."));
                    };

                    reader.onload = () => {
                        resolve(reader.result);
                    };

                    reader.readAsArrayBuffer(file);
                });

                const image = await Jimp.read(buffer);
                image.colorType(2);
                const result = await image.getBufferAsync(Jimp.MIME_PNG);
                return result;
            })
        );

        function uploadFile(file, count) {
            const ref = storage.ref(`familyUploads/${doc.id}/${uuidv4()}.png`);

            return new Promise((resolve, reject) => {
                const task = ref.put(file, {
                    customMetadata: { author: username },
                });
                task.on(STATE_CHANGED, (snapshot) => {
                    setProgress((prev) => {
                        const newProgress = [...prev];
                        newProgress[count] = Math.floor(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100
                        );
                        return newProgress;
                    });
                });
                task.then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        }

        setProgress(Array(files.length).fill(0));

        let count = 0;

        Promise.all(
            files.map((file) => {
                count++;
                return uploadFile(file, count - 1);
            })
        ).then(() => {
            setUploading(false);
            getImages();
        });
    };

    return (
        <div className={styles.galleryPanel}>
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <h3 className={utilStyles.headingLg}>Family gallery</h3>
                </div>
            </div>

            <div className={styles.galleryContainer}>
                {!uploading && (
                    <label className={styles.uploadButton}>
                        Upload image
                        <input
                            type="file"
                            onChange={uploadImages}
                            accept="image/x-png,image/gif,image/jpeg"
                            multiple
                        />
                    </label>
                )}
                {uploading && (
                    <h3>
                        {(
                            progress.reduce((a, b) => a + b, 0) /
                            progress.length
                        ).toFixed(0)}
                        %
                    </h3>
                )}
                {images.map((image) => (
                    <div className={styles.imageContainer} key={image.name}>
                        <div className={styles.imagePlaceholder}></div>

                        <div className={styles.imageWrapper}>
                            <Image
                                src={image.url}
                                alt={image.name}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
