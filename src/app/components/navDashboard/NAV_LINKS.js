import {commonIcons} from "@/app/components/navDashboard/iconData";

export const NAV_LINKS = [
    {
        id:   'inizio',
        text: 'Inizio',
        href: '/dashboardAdmin',
        icon: commonIcons.homeIcon
    },
    {
        id:   'nuovo_articolo',
        text: 'Scrivi articolo',
        href: '/dashboardAdmin/nuovoArticolo',
        icon: commonIcons.newspaper
    },
];
