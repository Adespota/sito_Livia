'use client';

import React from 'react';
import AuthLayoutWrapper from "@/app/components/AuthLayoutWrapper";


export default function DashboardAdminLayout({ children, className }) {

    // Applichi il wrapper qui.
    // Solo se l'utente è autenticato, il wrapper renderizzerà i 'children' (cioè le tue pagine admin).
    return (
        <AuthLayoutWrapper children={children} className={className}></AuthLayoutWrapper>
    );
}
