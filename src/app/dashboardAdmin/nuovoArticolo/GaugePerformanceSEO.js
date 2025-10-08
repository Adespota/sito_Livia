import React from "react";
import { gaugeClasses, Gauge as MUIGauge } from "@mui/x-charts/Gauge";
import {useMediaQuery, useTheme} from "@mui/system";



export default function GaugePerformanceSEO({ width, height,  punteggioSEO, getColor, description, sizeDescription, sizeTextInGaugeMobile = 12, sizeTextInGaugeDesktop = 13, }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const size = isMobile ? 85 : 108;

    return (
        <div className="">
            <MUIGauge
                width={width}
                height={height}
                value={punteggioSEO}
                text={({ value, valueMax }) => `${value}`}
                cornerRadius="50%"
                sx={{
                    // Riduce il font per il testo del gauge
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: isMobile ? sizeTextInGaugeMobile : sizeTextInGaugeDesktop,
                        fontWeight: 700,
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
    );
}
