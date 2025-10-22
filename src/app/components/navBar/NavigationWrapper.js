"use client";

import { usePathname } from 'next/navigation';
import { NavBar } from "@/app/componentsClient/componentsClient";


export default function NavigationWrapper() {
    const pathname = usePathname();

    const onPrenotaPage =
        pathname === '/prenota' ||
        pathname === '/login' ||
        pathname === '/registrazione' ||
        pathname.startsWith('/dashboardAdmin');

    if (onPrenotaPage) {
        return <NavBar className="block md:hidden" />;
    } else {
        return <NavBar />;
    }
}
