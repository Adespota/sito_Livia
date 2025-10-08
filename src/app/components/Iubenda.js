'use client';

import {usePathname} from "next/navigation";
import Script from "next/script";


export default function Iubenda() {
    const pathname = usePathname();

    if (pathname === "/dashboardAdmin/nuovoArticolo") {
        return null;
    }

    return (
        <>
            {/* Inizializzazione Iubenda (prima di interagire) */}
            <Script
                id="iubenda-init"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            var _iub = _iub || [];
            _iub.csConfiguration = {
              siteId: 4015673,
              cookiePolicyId: 49433699,
              lang: "it",
              storage: { useSiteId: true }
            };
          `,
                }}
            />

            {/* Libreria Iubenda (dopo che la pagina è interattiva) */}
            <Script
                src="https://cs.iubenda.com/autoblocking/4015673.js"
                strategy="afterInteractive"
            />
            <Script
                src="//cdn.iubenda.com/cs/iubenda_cs.js"
                strategy="afterInteractive"
                async
                charSet="UTF-8"
            />
        </>
    );
}
