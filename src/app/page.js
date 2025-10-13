import '/src/styles/globals.css'
import Footer from "./components/Footer";
import HeadHome from "./home/HeadHome";
import AboutUs from "@/app/home/AboutUS";
import VerticalCard from "@/app/home/VerticalCard";
import SectionRow from "@/app/home/SectionRow";
import SectionBoom from "@/app/home/SectionBoom";
import Reviews from "@/app/home/Reviews";



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
                imageSrc="/seo.png"
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
                imageSrc="/ads.png"
                imageAlt="Dashboard con KPI pubblicitari"
            />

            <SectionRow
                layout="image-right"
                showTopDivider={false}
                badge="Social & Content"
                title="Social & Content"
                description="Progettiamo strategie di comunicazione su misura per gestire e valorizzare i tuoi canali social, Creiamo contenuti originali e coerenti con la tua identità. Integrando estetica, storytelling e dati di performance. Analizziamo risultati, engagement e community per ottimizzare nel tempo la presenza del brand e costruire una relazione autentica con il pubblico."
                percentCard="70"
                textCard="Engagement"
                imageSrc="/social.png"
                imageAlt="Contenuti social su smartphone"
            />

            <SectionRow
                layout="image-left"
                showTopDivider={false}
                badge="Brand identity"
                title="Brand identity & graphic design"
                description=" Creiamo brand coerenti e autentici, capaci di comunicare i tuoi valori con eleganza e misura. Dallo studio del logo alla scelta della palette colori, fino al tono visivo dei contenuti digitali. ogni dettaglio è pensato per raccontare chi sei, con la stessa sensibilità con cui ti prendi cura dei tuoi clienti."
                percentCard="22"
                textCard="Tasso di conversione"
                imageSrc="/brand.png"
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
                imageSrc="/sito.png"
                imageAlt="Contenuti social su smartphone"
            />
            </div>
            <VerticalCard />
            <Reviews />
            <Footer />
        </>
    );
}

