import React from "react";
import { gaugeClasses, Gauge as MUIGauge } from "@mui/x-charts/Gauge";
import {useMediaQuery, useTheme} from "@mui/system";


export default function SeoGauge({ settings, punteggioSEO, getColor }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const size = isMobile ? 85 : 108;
    const positionGauge = isMobile
        ? "fixed  flex justify-center bottom-0 left-0 z-30"
        : "fixed right-6 top-[75%] mt-6 sm:mt-0 sm:top-[140px] transform -translate-y-1/2 z-30";

    return (
        <div className={`${positionGauge}`}>
            <div className="flex flex-col justify-center items-center bg-white p-1.5 rounded-2xl shadow-md ">
                <div className="sm:w-[125px] sm:h-[90px] flex sm:space-y-2 space-y-0">
                    <MUIGauge
                        {...settings}
                        width={size}
                        height={size}
                        value={punteggioSEO}
                        text={({ value, valueMax }) => `${value}/${valueMax}`}
                        cornerRadius="50%"
                        sx={{
                            // Riduce il font per il testo del gauge
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: isMobile ? 13 : 16,
                            },
                            // Usa la funzione getColor per impostare il colore dinamico
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: getColor(punteggioSEO),
                            },
                            // Colore di riferimento
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: "#e0e0e0",
                            },
                        }}
                    />
                </div>
                <p className="hidden sm:block text-center pb-2 text-[0.60rem] font-semibold px-0.5 pt-3.5 leading-4">
                    Punteggio SEO<br/>e leggibilità
                </p>
            </div>
        </div>
    );
}
