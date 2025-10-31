'use client';

import { ReduxProvider } from "@/reducer/provider";
import { AuthProvider } from '@/app/authContext';
import SnackbarContainer from "@/app/components/snackbarContainer";


export default function GlobalClientProviders({ children }) {
    return (
        <AuthProvider>
            <ReduxProvider>
                <SnackbarContainer />
                {children}
            </ReduxProvider>
        </AuthProvider>
    );
}
