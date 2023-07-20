import React, { useCallback, useState, memo, useRef } from "react";
import axios from "axios";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { compact } from "lodash";

import LoadingText from "./LoadingText";
// import { FileLite } from "../types/file";
// import FileViewerList from "./FileViewerList";

function FileUpload(props) {
    const handleSetFiles = props.handleSetFiles;

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const dropzoneRef = useRef(null);

    const handleFileChange = useCallback(
        async (selectedFiles) => {
            if (selectedFiles && selectedFiles.length > 0) {
                setError("");

                if (files.length + selectedFiles.length > props.maxNumFiles) {
                    setError(`You can only upload up to ${props.maxNumFiles} files.`);
                    if (dropzoneRef.current) {
                        dropzoneRef.current.value = "";
                    }
                    return;
                }

                setLoading(true);

                const uploadedFiles = await Promise.all(
                    Array.from(selectedFiles).map(async (file) => {
                        // Check the file type
                        if (
                            file.type.match(/(text\/plain|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(markdown|x-markdown))/) && // AND file isn't too big
                            file.size < props.maxFileSizeMB * 1024 * 1024
                        ) {
                            // Check if the file name already exists in the files state
                            if (files.find((f) => f.name === file.name)) {
                                return null; // Skip this file
                            }

                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("filename", file.name);
                            console.log(file.name);
                            console.log(file);

                            try {
                                const processFileResponse = await axios.post("src/api/process-file", formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                });

                                if (processFileResponse.status === 200) {
                                    const text = processFileResponse.data.text;
                                    const meanEmbedding = processFileResponse.data.meanEmbedding;
                                    const chunks = processFileResponse.data.chunks;

                                    const fileObject = {
                                        name: file.name,
                                        url: URL.createObjectURL(file),
                                        type: file.type,
                                        size: file.size,
                                        expanded: false,
                                        embedding: meanEmbedding,
                                        chunks,
                                        extractedText: text,
                                    };
                                    console.log(fileObject);

                                    return fileObject;
                                } else {
                                    console.log("Error creating file embedding");
                                    return null;
                                }
                            } catch (err) {
                                console.log(`Error creating file embedding: ${err}`);
                                return null;
                            }
                        } else {
                            alert(`Invalid file type or size. Only TXT, PDF, DOCX or MD are allowed, up to ${props.maxFileSizeMB}MB.`);
                            return null; // Skip this file
                        }
                    })
                );

                // Filter out any null values from the uploadedFiles array
                const validFiles = compact(uploadedFiles);

                // Set the files state with the valid files and the existing files
                setFiles((prevFiles) => [...prevFiles, ...validFiles]);
                handleSetFiles((prevFiles) => [...prevFiles, ...validFiles]);

                setLoading(false);
            }
        },
        [files, handleSetFiles, props.maxFileSizeMB, props.maxNumFiles]
    );

    const handleDragEnter = useCallback((event) => {
        event.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            setDragOver(false);
            const droppedFiles = event.dataTransfer.files;
            handleFileChange(droppedFiles);
        },
        [handleFileChange]
    );

    return (
        <div className="flex items-center justify-center w-full flex-col">
            <label htmlFor="dropzone-file" className={`flex flex-col shadow items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative ${dragOver ? "border-blue-500 bg-blue-50" : ""}`} ref={dropzoneRef} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {loading ? (
                        <LoadingText text="Uploading..." />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center text-center">
                            <ArrowUpTrayIcon className="w-7 h-7 mb-4" />
                            <p className="mb-2 text-sm">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs">TXT, PDF, DOCX or MD (max {props.maxFileSizeMB}MB per file)</p>
                            <p className="text-xs mt-1">
                                You can upload up to {props.maxNumFiles - files.length} more {props.maxNumFiles - files.length === 1 ? "file" : "files"}
                            </p>
                            <input id="dropzone-file" type="file" className="hidden" multiple onChange={(event) => handleFileChange(event.target.files)} />
                        </div>
                    )}
                </div>
            </label>

            {error && (
                <div className="flex items-center justify-center w-full mt-4">
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            )}

            {/* <FileViewerList files={files} title="Uploaded Files" /> */}
        </div>
    );
}

export default memo(FileUpload);