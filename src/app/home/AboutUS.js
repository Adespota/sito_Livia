"use client";

import React from "react";


function Sparkline({ data = [], height = 70, color = "#6366f1" }) {
    const width = 360;
    const h = height;
    const pad = 6;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = Math.max(max - min, 1e-6);

    const pts = data.map((v, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * (width - pad * 2) + pad;
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return [x, y];
    });

    const dLine = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
    const dArea =
        dLine +
        ` L ${pts[pts.length - 1][0]} ${h - pad}` +
        ` L ${pts[0][0]} ${h - pad} Z`;

    return (
        <svg className="w-full" viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={dArea} fill="url(#sparkFill)" />
            <path d={dLine} fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
}

/** Card singola KPI */
function StatCard({ title, value, change, positive = true, spark = [] }) {
    return (
        <div className="rounded-2xl shadow-lg">
            <div className="rounded-2xl bg-white relative overflow-hidden">
                <div className="px-3 pt-8 pb-10 text-center relative z-10">
                    <h4 className="text-sm uppercase text-gray-500 leading-tight">{title}</h4>
                    <h3 className="text-3xl text-gray-700 font-semibold leading-tight my-3">{value}</h3>
                    <p className={`text-xs leading-tight ${positive ? "text-green-500" : "text-red-500"}`}>
                        {positive ? "▲" : "▼"} {change}
                    </p>
                </div>
                <div className="absolute bottom-0 inset-x-0">
                    <Sparkline data={spark} height={65} />
                </div>
            </div>
        </div>
    );
}


const cards = [
    {
        title: "Leads",
        value: "52",
        change: "188%",
        positive: true,
        // esplosione subito, poi crescita lenta
        spark: [3, 28, 32, 34, 35, 38, 41, 45, 48, 50, 51, 52],
    },
    {
        title: "CTR",
        value: "3.8%",
        change: "18.9%",
        positive: true,
        // micro-step → salto enorme al 4° punto → rifinitura
        spark: [0.50, 0.55, 0.58, 2.40, 3.00, 3.30, 3.50, 3.60, 3.70, 3.75, 3.78, 3.80],
    },
    {
        title: "Conversion Rate",
        value: "4.1%",
        change: "21.7%",
        positive: true,
        // tre gradoni iniziali molto marcati, poi passi piccoli
        spark: [0.9, 1.8, 3.2, 3.6, 3.7, 3.85, 3.92, 3.98, 4.02, 4.06, 4.09, 4.10],
    },
];





export default function FiveBars() {
    return (
        <>
            <section className="grid grid-cols-12 gap-6 my-24 items-start">
                <h4 className="col-span-12 md:col-start-3 md:col-span-4 font-semibold">Chi siamo</h4>

                <div className="col-span-12 md:col-start-7 md:col-span-5 space-y-6 leading-relaxed">
                    <p className="font-bold">
                        Siamo un’agenzia di marketing digitale che mette strategia e risultati al centro.
                        Uniamo creatività e dati per far crescere brand e PMI.
                        Lavoriamo con processi chiari e obiettivi misurabili.
                    </p>
                    <p>
                        Offriamo SEO e content, campagne Meta/Google e sviluppo web.
                        Ogni progetto parte da un’analisi del business e dei competitor.
                        Parla con noi: trasformiamo idee in crescita reale.
                    </p>
                </div>
            </section>



            <div className="w-full my-24">
                {/* Griglia principale a 12 colonne */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Wrapper che parte dalla colonna 2 e prende fino alla 12 */}
                    <div className="col-start-4 col-span-11">
                        {/* Griglia delle card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {cards.map((c, i) => (
                                <StatCard
                                    key={i}
                                    title={c.title}
                                    value={c.value}
                                    change={c.change}
                                    positive={c.positive}
                                    spark={c.spark}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
