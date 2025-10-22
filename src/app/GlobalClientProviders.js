// src/app/GlobalClientProviders.js

'use client'; // ⭐ ESSENZIALE: Contrassegna come Client Component

import { ReduxProvider } from "@/reducer/provider";
import { AuthProvider } from '@/app/authContext';
import { CustomSnackBar } from "@adespota/my-react-component";
import { SpeedInsights } from "@vercel/speed-insights/next";


export default function GlobalClientProviders({ children }) {
    return (
        <AuthProvider>
            <ReduxProvider>
                {children}
                <CustomSnackBar />
                <SpeedInsights />
            </ReduxProvider>
        </AuthProvider>
    );
}
