'use client';

import { ReduxProvider } from "@/reducer/provider";
import { AuthProvider } from '@/app/authContext';
import { SpeedInsights } from "@vercel/speed-insights/next";
import SnackbarContainer from "@/app/components/snackbarContainer";


export default function GlobalClientProviders({ children }) {
    return (
        <AuthProvider>
            <ReduxProvider>
                <SnackbarContainer />
                {children}
                <SpeedInsights />
            </ReduxProvider>
        </AuthProvider>
    );
}
