import React from "react";

import { Inter } from "next/font/google";
import "/src/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import {Iubenda} from "@/app/componentsClient/componentsClient";
import NavigationWrapper from "@/app/components/navBar/NavigationWrapper";
import GlobalClientProviders from "@/app/GlobalClientProviders";




const inter = Inter({ subsets: ["latin"] });




export const metadata = {
    icons: {
        icon: [
            {
                rel: 'icon',
                type: 'image/svg+xml',
                url: '/favicon.svg',
            },
        ],
    },
};




export default function RootLayout({ children }) {


    return (
        <html lang="it">
        <head>
            <Iubenda />
        </head>
        <body className={inter.className}>
        <GlobalClientProviders>
            <NavigationWrapper />
            {children}
        </GlobalClientProviders>
        </body>
        </html>
    );
}
