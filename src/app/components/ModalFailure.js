'use client';

import { motion } from "framer-motion";
import useLockScroll from "/src/hooks/useLockScroll";
import Image from "next/image";
import {Button} from "@adespota/my-react-component";


export default function ModalFailure({
                                         image,
                                         primaryText,
                                         secondaryText,
                                         textPrimaryButtonModal,
                                         textSecondaryButtonModal,
                                         stylePrimaryButton,
                                         styleSecondaryButton,
                                         onClickPrimary,
                                         linkPrimary,
                                         onClickSecondary,
                                         linkSecondary,
                                     }) {
    useLockScroll();
    return (
        <motion.div
            className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            <div className="bg-myColor-grayCard sm:w-5/12 w-10/12 relative rounded-lg shadow-lg">
                <div className="flex flex-col px-5 py-5 space-y-7 items-center">
                    {image && <div>{image}</div>}

                    <div className="grid md:grid-cols-5 grid-cols-1">
                        <Image
                            src={`/modalImage/checkFailure.svg`}
                            width={50}
                            height={50}
                            className="pb-4"
                            alt="Icon failure"
                        />

                        <div className="grid col-span-4">
                            {primaryText && <h6 className="pb-2">{primaryText}</h6>}
                            {secondaryText && <p className="pb-4">{secondaryText}</p>}
                            <div className="inline-flex space-x-4">
                                <Button
                                    buttonTextDesktop={textPrimaryButtonModal}
                                    backgroundColor="bg-white"
                                    onClick={onClickPrimary}
                                    linkTo={linkPrimary}
                                    className={`bg-white border-2 border-myColor-borderColorCard ${stylePrimaryButton}`}
                                />
                                <Button
                                    buttonTextDesktop={textSecondaryButtonModal}
                                    backgroundColor="bg-red-500"
                                    onClick={onClickSecondary}
                                    linkTo={linkSecondary}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
