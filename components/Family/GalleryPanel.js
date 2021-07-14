import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";

import { v4 as uuidv4 } from "uuid";

import Jimp from "jimp/es";

import Modal from "@components/Modal";
import Loader from "@components/Loader";
import PanelStickyHeader from "./PanelStickyHeader";

import { UserContext } from "@lib/context";
import { STATE_CHANGED, storage } from "@lib/firebase";

import styles from "./GalleryPanel.module.scss";
import utilStyles from "@styles/utils.module.scss";

import ImageIcon from "@icons/image.svg";
import TrashIcon from "@icons/trash.svg";

export default function GalleryPanel({ doc }) {
    const { username } = useContext(UserContext);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState([0]);

    const [images, setImages] = useState([]);
    const [imageViewOpen, setImageViewOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

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
                        item: item,
                    };
                })
            );

            images.sort((a, b) => {
                if (a.name < b.name) {
                    return 1;
                } else if (a.name > b.name) {
                    return -1;
                }
                return 0;
            });

            setImages(images);
        }
    };

    const uploadImages = async (e) => {
        setUploading(true);

        const files = await Promise.all(
            Array.from(e.target.files).map(async (file) => {
                const extension = file.type.split("/")[1];
                if (extension === "png") {
                    const reader = new FileReader();

                    const buffer = await new Promise((resolve, reject) => {
                        reader.onerror = () => {
                            reader.abort();
                            reject(
                                new DOMException("Problem parsing input file.")
                            );
                        };

                        reader.onload = () => {
                            resolve(reader.result);
                        };

                        reader.readAsArrayBuffer(file);
                    });

                    const image = await Jimp.read(buffer);
                    image
                        .deflateStrategy(0)
                        .filterType(Jimp.PNG_FILTER_NONE)
                        .colorType(2);
                    const result = await image.getBufferAsync(Jimp.MIME_PNG);
                    return { file: result, type: extension };
                } else if (extension === "jpeg") {
                    return { file, type: extension };
                } else {
                    return null;
                }
            })
        );

        function uploadFile(file, count) {
            const ref = storage.ref(
                `familyUploads/${doc.id}/${Date.now()}-${uuidv4()}.${file.type}`
            );

            return new Promise((resolve, reject) => {
                const task = ref.put(file.file, {
                    customMetadata: { author: username },
                    contentType: `image/${file.type}`,
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
        )
            .then(() => {
                setUploading(false);
                setProgress([0]);
                getImages();
            })
            .catch((error) => {
                toast.error(
                    "Oops! There was an error! Make sure your file size is less than 5MB.",
                    { duration: 5000 }
                );
                setUploading(false);
                setProgress([0]);
            });
    };

    const shimmer = `
        <svg width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <linearGradient id="g">
                    <stop stop-color="#00000000" offset="0%" />
                    <stop stop-color="#00000022" offset="50%" />
                    <stop stop-color="#00000000" offset="100%" />
                </linearGradient>
            </defs>
            <rect width="200" height="200" fill="#00000000" />
            <rect id="r" width="200" height="200" fill="url(#g)" />
            <animate xlink:href="#r" attributeName="x" from="-200" to="200" dur="1s" repeatCount="indefinite"  />
        </svg>`;

    const toBase64 = (str) =>
        typeof window === "undefined"
            ? Buffer.from(str).toString("base64")
            : window.btoa(str);

    return (
        <div className={styles.galleryPanel}>
            <PanelStickyHeader page="gallery">Family gallery</PanelStickyHeader>

            <div className={styles.galleryContainer}>
                {!uploading && (
                    <label className={styles.uploadButton}>
                        <ImageIcon />
                        Upload image
                        <input
                            type="file"
                            onChange={uploadImages}
                            accept="image/x-png,image/jpeg"
                            multiple
                        />
                    </label>
                )}
                {uploading && <LoadingPlaceholder progress={progress} />}
                {images.map((image) => (
                    <button
                        className={styles.imageContainer}
                        key={image.name}
                        onClick={() => {
                            setImageViewOpen(true);
                            setActiveImage(image);
                        }}
                    >
                        <Image
                            src={image.url}
                            alt={image.name}
                            layout="fill"
                            objectFit="cover"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer
                            )}`}
                        />
                    </button>
                ))}
            </div>
            {imageViewOpen && (
                <ImageViewModal
                    setImageViewOpen={setImageViewOpen}
                    getImages={getImages}
                    activeImage={activeImage}
                />
            )}
        </div>
    );
}

function ImageViewModal({ setImageViewOpen, getImages, activeImage }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const deleteImage = async () => {
        await activeImage.item.delete();
        setImageViewOpen(false);
        getImages();
    };

    return (
        <Modal
            isOpen
            variant="imageView"
            onRequestClose={() => setImageViewOpen(false)}
        >
            <div className={styles.imageViewContainer}>
                <Image
                    src={activeImage.url}
                    alt={activeImage.name}
                    layout="fill"
                    objectFit="contain"
                />
                <div className={styles.imageTop}>
                    <button
                        className={styles.deleteButton}
                        onClick={() => {
                            setDeleteModalOpen(true);
                        }}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
            {deleteModalOpen && (
                <Modal isOpen onRequestClose={() => setDeleteModalOpen(false)}>
                    <h3 className={utilStyles.headingLg}>
                        Are you sure you would like to delete this image?
                    </h3>
                    <button onClick={deleteImage}>Delete</button>
                </Modal>
            )}
        </Modal>
    );
}

function LoadingPlaceholder({ progress }) {
    const loadingProgress = (
        progress.reduce((a, b) => a + b, 0) / progress.length
    ).toFixed(0);

    return (
        <label className={styles.uploadButton}>
            {loadingProgress}%
            <div className={styles.progressBar}>
                <div
                    className={styles.progressIndicator}
                    style={{ width: `${loadingProgress}%` }}
                ></div>
            </div>
        </label>
    );
}
