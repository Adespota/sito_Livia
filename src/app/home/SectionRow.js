
import Image from "next/image";
import React from "react";


export default function SectionRow({
                                       layout = "image-right",
                                       badge = "",
                                       title = "",
                                       description = "",
                                       imageSrc = "/1.png",
                                       imageAlt = "",
                                       percentCard = "",
                                       textCard = "",
                                       showTopDivider = true,
                                       showBottomDivider = true,
                                   }) {
    const isRight = layout === "image-right";

    return (
        <>
            {showTopDivider && (
                <div className="flex w-full justify-center">
                    <div className="flex w-[80%] border-t-2 border-gray-200 my-16"></div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 items-center">
                {isRight ? (
                    <>
                        <div className="col-start-3 col-span-4 self-stretch">
                            <div className="flex flex-col h-full justify-between items-start">
                                {/* Badge in alto */}
                                <div className="inline-flex p-1 px-3 rounded-2xl border-2 border-gray-300">
                                    <p className="font-bold">{badge}</p>
                                </div>

                                {/* Testo in basso */}
                                <div className="pt-4">
                                    <h5 className="mb-2">{title}</h5>
                                    <p>{description}</p>
                                </div>
                            </div>
                        </div>



                        <div className="relative col-start-8 col-span-7">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={600}
                                height={600}
                                className="rounded-2xl"
                                unoptimized={true}
                            />
                            {(percentCard || textCard) && (
                                <div className="absolute top-1/3 -left-[3.9rem] flex flex-col space-y-1.5 bg-white border border-gray-200 p-3 rounded-2xl">
                                    <p className="font-extrabold text-[1.6rem]">+ {percentCard}%</p>
                                    <p>{textCard}</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative col-start-2 col-span-6">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={600}
                                height={600}
                                className="rounded-2xl"
                                unoptimized
                            />
                            {(percentCard || textCard) && (
                                <div className="absolute top-1/3 right-[10rem] flex flex-col space-y-1.5 bg-white border border-gray-200 p-3 rounded-2xl">
                                    <p className="font-extrabold text-[1.6rem]">+ {percentCard}%</p>
                                    <p>{textCard}</p>
                                </div>
                            )}
                        </div>

                        <div className="col-start-8 col-span-4 self-stretch">
                            <div className="flex flex-col h-full justify-between items-start">
                                {/* Badge in alto */}
                                <div className="inline-flex p-1 px-3 rounded-2xl border-2 border-gray-300">
                                    <p className="font-bold">{badge}</p>
                                </div>

                                {/* Testo in basso */}
                                <div className="pt-4">
                                    <h6 className="mb-2">{title}</h6>
                                    <p>{description}</p>
                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>

            {showBottomDivider && (
                <div className="flex w-full justify-center">
                    <div className="flex w-[80%] border-t-2 border-gray-200 my-16"></div>
                </div>
            )}
        </>
    );
}
