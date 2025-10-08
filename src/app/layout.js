import { Inter } from "next/font/google";
import "/src/styles/globals.css";
import { ReduxProvider } from "@/reducer/provider";
import { AuthProvider } from '@/app/authContext';
import CustomSnackbar from "@/app/components/CustomSnackBar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import {Iubenda} from "@/app/componentsClient/componentsClient";




const inter = Inter({ subsets: ["latin"] });



export const metadata = {
    icons: {
        icon: [
            {
                rel: 'icon',
                type: 'image/svg+xml',
                url: '',
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
        <AuthProvider>
            <ReduxProvider>
                {children}
                <CustomSnackbar />
                {/* <Analytics /> */}
                <SpeedInsights />
            </ReduxProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
