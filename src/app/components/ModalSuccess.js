'use client';


import Image from "next/image";
import useLockScroll from "/src/hooks/useLockScroll";
import { motion } from "framer-motion";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle} from "@/styles/constants";



export default function ModalSuccess({ image, primaryText, secondaryText, textPrimaryButtonModal, textSecondaryButtonModal, stylePrimaryButton, styleSecondaryButton, onClickPrimary, onClickSecondary, linkPrimary, linkSecondary,}) {
    useLockScroll();

    return (
        <motion.div
            className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            <div className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm ">
                <div className="bg-myColor-grayCard sm:w-5/12 w-10/12 relative rounded-lg shadow-lg">
                    <div className="flex flex-col px-5 py-5 space-y-7 items-center">
                        {image && <div>{image}</div>}
                        <Image
                            src={`/modalImage/check.svg`}
                            width={70}
                            height={70}
                            className="pb-4"
                            alt="Check success"
                        />
                        <div className="grid grid-cols-1">
                            {primaryText && (<h6 className="text-center pb-2"> {primaryText}</h6>)}
                            {secondaryText && (<p className="text-center pb-4"> {secondaryText}</p>)}
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 w-full">
                            <Button
                                buttonTextDesktop={textPrimaryButtonModal}
                                backgroundColor="bg-white"
                                textStyle={textButtonStyle}
                                colorCircularProgress="#4a58a7"
                                onClick={onClickPrimary}
                                linkTo={linkPrimary}
                                className={`w-full col-span-1 bg-white border-2 border-myColor-borderColorCard ${stylePrimaryButton}`}
                            />
                            <Button
                                buttonTextDesktop={textSecondaryButtonModal}
                                backgroundColor={backgroundButtonStyle}
                                textStyle={textButtonStyle}
                                colorCircularProgress="#4a58a7"
                                onClick={onClickSecondary}
                                linkTo={linkSecondary}
                                className={`w-full col-span-1 ${styleSecondaryButton}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
