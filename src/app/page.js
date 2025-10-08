import '/src/styles/globals.css'
import Footer from "./components/Footer";
import HeadHome from "./home/HeadHome";
import AboutUs from "@/app/home/AboutUS";
import VerticalCard from "@/app/home/VerticalCard";
import SectionRow from "@/app/home/SectionRow";
import SectionBoom from "@/app/home/SectionBoom";



export const metadata = {
    title: '',
    description:
        '',
    author: '',
    keywords:
        '',
    openGraph: {
        title: '',
        description:
            '',
        canonical: 'https://www.liviadicaterino.com/',
        type: 'website',
        site_name: '',
        images: [''],
    },
    canonical: 'https://www.liviadicaterino.com/',
}


export default function HomePage() {
    return (
        <>
            <HeadHome/>
            <AboutUs />
            <SectionBoom />
            <div className="bg-white border border-gray-100 p-2 rounded-2xl mx-4 mt-14">
            <SectionRow
                layout="image-right"
                badge="Ottimizzazione SEO"
                title="Ottimizzazione SEO"
                description="Audit tecnico completo (crawl, Core Web Vitals, architettura), keyword strategy basata su intenti e SERP features, ottimizzazioni on-page/off-page con schema markup e link building etico; contenuti ottimizzati per EEAT e linee guida AI, monitoraggio costante con dashboard e OKR per scalare la SERP e far crescere traffico realmente qualificato."
                percentCard="50"
                textCard="Traffico organico"
                imageSrc="/1.png"
                imageAlt="Grafico di crescita del traffico organico"
            />

            <SectionRow
                layout="image-left"
                showTopDivider={false}
                badge="Performance Ads"
                title="Performance Ads"
                description="Campagne Google & Meta orientate al ROI con struttura scalabile, A/B test creativi e segmentazioni granulari; ottimizzazione continua di keyword/interessi, audience lookalike/remarketing, budget pacing e bidding; tracciamento eventi end-to-end (server-side, conversion API) e lettura delle metriche LTV/CPA per decisioni rapide e profittevoli."
                percentCard="35"
                textCard="ROAS medio"
                imageSrc="/1.png"
                imageAlt="Dashboard con KPI pubblicitari"
            />

            <SectionRow
                layout="image-right"
                showTopDivider={false}
                badge="Social & Content"
                title="Social & Content"
                description="Piano editoriale data-driven con calendario, format video e carousel nativi, UGC e community management; definizione della brand voice, storytelling per funnel TOFU-MOFU-BOFU, social listening e insight creativi; analisi di reach/retention/engagement per iterare i contenuti e rafforzare la fidelizzazione nel tempo."
                percentCard="70"
                textCard="Engagement"
                imageSrc="/1.png"
                imageAlt="Contenuti social su smartphone"
            />

            <SectionRow
                layout="image-left"
                showTopDivider={false}
                badge="Automazione dei processi"
                title="Automation & CRO"
                description="Funnel con workflow di email/SMS, segmentazioni dinamiche e trigger comportamentali; lead scoring, nurturing e personalizzazione onsite; A/B test su landing, form e checkout con heatmap/session replay, analisi di frizione e attribution modelling per aumentare il tasso di conversione senza alzare i costi di traffico."
                percentCard="22"
                textCard="Tasso di conversione"
                imageSrc="/1.png"
                imageAlt="Workflow di automazioni marketing"
            />

            <SectionRow
                layout="image-right"
                showTopDivider={false}
                badge="Sviluppo sito web"
                title="Progettazione e sviluppo sito web"
                description="Progettiamo e sviluppiamo siti performanti e responsive con attenzione ad accessibilità e SEO tecnico; integrazione CMS e blog per pubblicazione rapida, analytics avanzati e tracciamenti; performance, sicurezza e best practice moderne per un’esperienza veloce, affidabile e pronta a scalare con il business."
                percentCard="70"
                textCard="Engagement"
                imageSrc="/1.png"
                imageAlt="Contenuti social su smartphone"
            />
            </div>
            <VerticalCard />
            <Footer />
        </>
    );
}

