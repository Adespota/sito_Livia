import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";


export default function DragAndDropImage ({ onFileAccepted })  {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                onFileAccepted(acceptedFiles[0]);
            }
        },
        [onFileAccepted]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <UploadFileRoundedIcon className="w-12 h-12 text-gray-400 mb-2" />
                {isDragActive ? (
                    <p className="text-gray-600">Rilascia qui l&apos;immagine...</p>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 text-[0.75rem]">
                            Trascina e rilascia un&apos;immagine, oppure clicca per selezionare il file
                        </p>
                    </div>

                )}
            </div>
        </div>
    );
};
