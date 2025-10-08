import GaugePerformanceSEO from "@/app/dashboardAdmin/nuovoArticolo/GaugePerformanceSEO";
import React from "react";
import {useSelector} from "react-redux";

const getColor = (value) => {
    if (value >= 70) return "#52b202";
    if (value >= 50) return "#f7c600";
    return "#d32f2f";
};

export default function CardPerformanceArticle() {
    const { currentAudit, isLoading, error } = useSelector(state => state.auditSlice);

    const metrics = [
        { label: "Leggibilità", score: currentAudit?.readability || 0 },
        { label: "SEO on-page", score: currentAudit?.onPageSeoScore || 0 },
        { label: "Coerenza del tono", score: currentAudit?.toneConsistency || 0 },
        { label: "% voce attiva vs passiva", score: currentAudit?.activeVsPassiveVoice || 0 },
        { label: "Uso link interni/esterni", score: currentAudit?.internalExternalLinksUsage || 0 },
        { label: "Lunghezza media frasi", score: currentAudit?.averageSentenceLength || 0 },
        { label: "Parole di transizione", score: currentAudit?.transitionWordsUsage || 0 },
        { label: "Tempo di lettura stimato", score: currentAudit?.estimatedReadingTime || 0 },
    ];



    // Questa è la funzione che calcola la media
    const calculateOverallScore = () => {
        // Estrai solo i punteggi numerici dall'array metrics
        const numericScores = metrics.map(metric => metric.score);
        const sum = numericScores.reduce((acc, score) => acc + score, 0); // Somma tutti i punteggi validi
        return Math.round(sum / numericScores.length); // Dividi per il numero di punteggi validi e arrotonda
    };

    const overallScore = calculateOverallScore();

    return (
        <div className="w-full bg-white rounded-2xl pr-2">
            {/* Totale */}
            <div className="flex items-center justify-center mb-0.5">
                <GaugePerformanceSEO
                    punteggioSEO={overallScore.toFixed(0)}
                    getColor={getColor}
                    width={46}
                    height={46}
                    sizeTextInGaugeDesktop={8}
                />
                <p className="text-[0.60rem] font-bold">Totale</p>
            </div>

            {/* Lista metriche */}
            <div className="flex flex-col">
                {metrics.map(({ label, score }) => (
                    <div key={label} className="flex items-center cursor-pointer">
                        <GaugePerformanceSEO
                            punteggioSEO={score}
                            getColor={getColor}
                            width={44}
                            height={44}
                            sizeTextInGaugeDesktop={9}
                        />
                        <p className="text-[0.60rem] font-bold">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
