import { commonIcons } from "../navDashboard/iconData";


const {
    paperClip,
    paperAirplane,
    documentText,
    homeIcon,
    nuovoArticolo,
} = commonIcons;


export const links = [

    { id: "inizio",
        text: "Inizio",
        icon: homeIcon,
        href:'/dashboardAdmin/inizio'
    },
    {
        id: "articoli",
        text: "Articoli",
        icon: documentText,
        subLinks: [
            {id: "nuovo_articolo", text: "Nuovo", icon: nuovoArticolo, href: '/dashboardAdmin/nuovoArticolo'},
            {id: "articoli_bozze", text: "Bozze", icon: paperClip, href: '/dashboardAdmin/articoliBozze'},
            {
                id: "articoli_pubblicati",
                text: "Pubblicati",
                icon: paperAirplane,
                href: '/dashboardAdmin/articoliPubblicati'
            },
        ],
    }
]

