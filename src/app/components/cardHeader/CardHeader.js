import Image from "next/image";
import {useState} from "react";
import {Skeleton} from "@mui/material";

export default function CardHeader({ image, text, positionTop, positionLeft, altImage, layout = "column" }) {

    const [loading, setLoading] = useState(true);

    // Funzione per gestire l'evento di caricamento dell'immagine
    const handleLoad = () => {
        setLoading(false); // L'immagine è caricata, quindi nascondi lo skeleton
    };

    return (
        <div className="absolute rounded-2xl p-4 bg-white"
            style={{
                top: positionTop,
                left: positionLeft,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            }}
        >
            <div className={`flex ${layout === "row" ? "flex-row items-center space-x-3 text-left" : "flex-col items-center"}`}>
                {loading && (
                    <Skeleton variant="rounded" width={45} height={45} />
                )}
                {image ? (
                    <Image
                        src={image}
                        alt={altImage}
                        width={45}
                        height={45}
                        quality={75}
                        priority={true}
                        onLoadingComplete={handleLoad}
                        style={{ display: loading ? 'none' : 'block' }}
                    />
                ) : null}
                <p className={`text-[0.81rem] font-semibold w-36 leading-tight mt-1.5 ${layout === "row" ? "text-left ml-2" : "text-center mt-2"}`}>
                    {text}
                </p>
            </div>
        </div>
    );
}
