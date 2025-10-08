import Label from "@/app/components/Label";

import Image from "next/image";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";


export default function SectionWebSite({
                                           textLabel,
                                           H2Text,
                                           pText,
                                           textButton,
                                           link,
                                           image,
                                           orderImageFirst,
                                           invertOrderOnMobile,
                                           altImage,
                                       }) {
    return (
        <div className="px-[18px] grid grid-cols-1 lg:grid-cols-12 gap-4 place-items-center sm:mb-44 mt-20">
            {orderImageFirst ? (
                <>
                    {/* Immagine per prima */}
                    <div className={`relative ${invertOrderOnMobile ? 'order-2 sm:order-1' : 'order-1 lg:order-none'} md:col-start-2 md:col-span-6 sm:pt-0 pt-10 sm:mb-0 mb-10`}>
                        <Image
                            src={image}
                            alt={altImage}
                            width={370}
                            height={370}
                            quality={75}
                            priority={false}
                        />
                    </div>
                    <div className={`flex flex-col ${invertOrderOnMobile ? 'order-1 sm:order-2' : 'order-2 lg:order-none'} sm:space-y-3 space-y-2 md:col-start-8 md:col-span-4`}>
                        <div className="flex justify-start">
                            <Label textLabel={textLabel} />
                        </div>
                        <h2 className="font-bold text-3xl text-left">{H2Text}</h2>
                        <p className="text-left sm:pb-0 pb-0.5">{pText}</p>
                        <Button
                            buttonTextDesktop={textButton}
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            linkTo={link}
                            className="w-full sm:w-auto hidden lg:block"
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Testo per primo */}
                    <div className={`flex flex-col ${invertOrderOnMobile ? 'order-2 sm:order-1' : 'order-1 lg:order-none'} sm:space-y-3 space-y-2 md:col-start-2 md:col-span-5 lg:col-start-3 lg:col-span-4`}>
                        <div className="flex justify-start">
                            <Label textLabel={textLabel} />
                        </div>
                        <h2 className="font-bold text-left text-3xl">{H2Text}</h2>
                        <p className="text-left sm:pb-0 pb-1">{pText}</p>
                        <Button
                            buttonTextDesktop={textButton}
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            linkTo={link}
                            className="w-full sm:w-auto hidden lg:block"
                        />
                    </div>
                    <div className={`order-2 ${invertOrderOnMobile ? 'order-1 sm:order-2' : 'lg:order-none'} md:col-start-7 md:col-span-5 lg:col-start-7 lg:col-span-5 ml-10 sm:pt-0 pt-10 sm:mb-0 mb-10`}>
                        <Image
                            src={image}
                            alt={altImage}
                            width={370}
                            height={370}
                            quality={75}
                            priority={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
}



