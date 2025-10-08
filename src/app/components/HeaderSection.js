import Image from 'next/image';
import NavBar from "/src/app/components/navBar/NavBar";

import TextAnimation from "@/app/components/TextAnimation";
import CardHeader from "/src/app/components/cardHeader/CardHeader";
import {dateCardsHeaderValutazioniNeuropsicologiche} from "@/app/components/cardHeader/date/dateCardsHeaderValutazioniNeuropsicologiche";
import {
    dateCardsHeaderRiabilitazioneCognitiva
} from "@/app/components/cardHeader/date/dateCardsHeaderRiabilitazioneCognitiva";
import {dateCardsHeaderPeriziaClinica} from "@/app/components/cardHeader/date/daterCardsHeaderPeriziaClinica";
import {
    dateCardsHeaderConsulenzaPsicologica
} from "@/app/components/cardHeader/date/dateCardsHeaderConsulenzaPsicologica";
import {dateCardsHeaderPsicodiagnosi} from "@/app/components/cardHeader/date/dateCardsHeaderPsicodiagnosi";
import {Skeleton} from "@mui/material";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, buttonStyle, textButtonStyle} from "@/styles/constants";






const MainCardCentral = ({ image = null, alt = "", title = "", subtitle = "", textLabels = [] }) => {
    return (
        <div className="absolute flex flex-col w-full sm:w-3/4 justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-4"
             style = {{
                 boxShadow: "rgba(0, 0, 0, 0.4) 0px 30px 90px"
             }}
        >
            <div className="flex flex-col w-full text-left mb-2">
                {title && <p className="text-[0.85rem] font-semibold leading-tight">{title}</p>}
                {subtitle && <p className="text-[0.83rem]">{subtitle}</p>}
            </div>
            {image && (
                <Image
                    src={image}
                    alt={alt || ""}
                    width={145}
                    height={145}
                    priority={true}
                />
            )}
            {/* Renderizza più textLabels */}
            {textLabels.length > 0 && (
                <div className="flex flex-wrap w-full pb-1 mt-1">
                    {textLabels.map((label, index) => (
                        <div key={index} className="bg-myColor-light rounded-xl px-1.5 inline-block mb-1 mr-1">
                            <p className="text-myColor-default text-center text-[0.71rem] font-bold">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}




export default function HeaderSection({
                                          textLabel = "",
                                          textTitle = "",
                                          textSubtitle = "",
                                          textDescription = "",
                                          textAnimationSequences = [],
                                          textNoAnimations,
                                          calendar = false,
                                          cardHeadValutazioniNeuropsicologiche = false,
                                          cardHeadRiabilitazioneCognitiva = false,
                                          cardHeadPeriziaClinica = false,
                                          cardHeadConsulenzaPsicologica = false,
                                          cardHeadPsicodiagnosi = false,
                                          buttonText1 = "",
                                          link1 = "",
                                          buttonText2 = "",
                                          link2 = "",
                                          imageSrc = "",
                                          altImage = "",
                                          imageWidth = 400,
                                          imageHeight = 370,
                                      }) {
    return (
        <div className="mx-auto w-full">
            <NavBar/>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-10 items-center px-[18px]">
                <div className="relative col-span-1 sm:col-start-8 sm:col-span-4 order-1 sm:order-2 sm:pt-0 pt-10">
                    <div className="relative">
                        <Image
                            src={imageSrc}
                            alt={altImage}
                            width={imageWidth}
                            height={imageHeight}
                            quality={90}
                            priority={true}
                        />
                        {cardHeadValutazioniNeuropsicologiche === true && (
                            <MainCardCentral
                                title={"Visita specialistica"}
                                subtitle={"Strumenti diagnostici accurati"}
                                image={'/imagesHeaderValutazioniNeuropsicologiche/fourthImageHeaderValutazioniNeuropsicologiche.svg'}
                                textLabels={["Neuropsicologica", "Test psicometrici",]}
                            />
                        )}
                        {cardHeadRiabilitazioneCognitiva === true && (
                            <MainCardCentral
                                title={"Riabilitazione cognitiva"}
                                subtitle={"Diagnosi e riabilitazione cognitiva"}
                                image={'/imagesHeaderRiabilitazioneCognitiva/thirdImageRiabilitazioneCognitiva.svg'}
                                textLabels={["Riabilitazione", "Stimolazione cognitiva",]}
                            />
                        )}
                        {cardHeadPeriziaClinica === true && (
                            <MainCardCentral
                                title={"Perizia clinico-legale"}
                                subtitle={"Perizia in ambito forense e assicurativo"}
                                image={'/imagesHeaderPeriziaClinica/firstImagePeriziaClinica.svg'}
                                textLabels={["Test psicometrici", "Lesioni cerebrali", "Deficit cognitivi"]}
                            />
                        )}
                        {cardHeadConsulenzaPsicologica === true && (
                            <MainCardCentral
                                title={"Consulenza psicologica"}
                                subtitle={"Consulenza psicologica on line"}
                                image={'/imagesHeaderConsulenzaPsicologica/firstImageConsulenzaPsicologica.svg'}
                                textLabels={["Psicodiagnosi", "Consulenza",]}
                            />
                        )}
                        {cardHeadPsicodiagnosi === true && (
                            <MainCardCentral
                                title={"Psicodiagnosi"}
                                subtitle={"Consulenza e psicodioagnosi"}
                                image={'/imagesHeaderPsicodiagnosi/firstImagePsicodiagnosi.svg'}
                                textLabels={["Psicodiagnosi", "Certificazione",]}
                            />
                        )}
                    </div>
                    {calendar === true && (
                        <div className="absolute top-[1.5rem] sm:left-10 left-0 w-full h-full">
                            {/* Aggiungere qualcosa */}
                        </div>
                    )}
                    <div className="hidden sm:block">
                        {cardHeadValutazioniNeuropsicologiche === true && (
                            dateCardsHeaderValutazioniNeuropsicologiche.map((card, index) => (
                                <CardHeader
                                    key={index}
                                    image={card.image}
                                    text={card.text}
                                    positionTop={card.positionTop}
                                    positionLeft={card.positionLeft}
                                    layout={card.layout}
                                />
                            ))
                        )}
                        {cardHeadRiabilitazioneCognitiva === true && (
                            dateCardsHeaderRiabilitazioneCognitiva.map((card, index) => (
                                <CardHeader
                                    key={index}
                                    image={card.image}
                                    text={card.text}
                                    positionTop={card.positionTop}
                                    positionLeft={card.positionLeft}
                                    layout={card.layout}
                                />
                            ))
                        )}
                        {cardHeadPeriziaClinica === true && (
                            dateCardsHeaderPeriziaClinica.map((card, index) => (
                                <CardHeader
                                    key={index}
                                    image={card.image}
                                    text={card.text}
                                    positionTop={card.positionTop}
                                    positionLeft={card.positionLeft}
                                    layout={card.layout}
                                />
                            ))
                        )}
                        {cardHeadConsulenzaPsicologica === true && (
                            dateCardsHeaderConsulenzaPsicologica.map((card, index) => (
                                <CardHeader
                                    key={index}
                                    image={card.image}
                                    text={card.text}
                                    positionTop={card.positionTop}
                                    positionLeft={card.positionLeft}
                                    layout={card.layout}
                                />
                            ))
                        )}
                        {cardHeadPsicodiagnosi === true && (
                            dateCardsHeaderPsicodiagnosi.map((card, index) => (
                                <CardHeader
                                    key={index}
                                    image={card.image}
                                    text={card.text}
                                    positionTop={card.positionTop}
                                    positionLeft={card.positionLeft}
                                    layout={card.layout}
                                />
                            ))
                        )}
                    </div>
                </div>
                {/* Testo e pulsanti */}
                <div className="col-span-1 sm:col-start-3 sm:col-span-4 sm:mt-20 mt-3 mb-10 space-y-3 items-center order-2 sm:order-1">
                    {textLabel && (
                        <div className="bg-[#c9cff1] rounded-xl px-3 inline-block">
                            <p className="text-myColor-default text-center text-[0.85rem] font-bold">
                                {textLabel}
                            </p>
                        </div>
                    )}
                    <h1 className="text-left sm:text-[1.150rem] text-[1.15rem] w-full font-bold leading-tight ">
                        {textTitle}
                    </h1>
                    <p className="w-full sm:text-[2rem] text-[2rem] text-myColor-colorTextOnDefaultColor leading-tight text-left">
                        {textSubtitle && (
                            textSubtitle
                        )}
                    </p>
                    {textAnimationSequences.length > 0 && (
                        <TextAnimation sequences={textAnimationSequences}/>
                    )}
                    {textNoAnimations && (
                        <h4 className="">{textNoAnimations}</h4>
                    )}
                    <p className="hidden sm:flex">
                        {textDescription}
                    </p>
                    <div className="flex w-full sm:flex-row flex-col space-y-3 sm:space-x-3 sm:space-y-0 items-center sm:pt-2 ">
                        <div className="w-full sm:w-auto">
                            <Button
                                buttonTextDesktop={buttonText1}
                                backgroundColor={backgroundButtonStyle }
                                textStyle={textButtonStyle}
                                colorCircularProgress="#4a58a7"
                                linkTo={link1}
                                className="w-full sm:w-auto"
                            />
                        </div>
                        {buttonText2 && (
                            <div className="w-full sm:w-auto hidden sm:block">
                                <Button
                                    buttonTextDesktop={buttonText2}
                                    backgroundColor={backgroundButtonStyle }
                                    textStyle={textButtonStyle}
                                    colorCircularProgress="#4a58a7"
                                    linkTo={link2}
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
