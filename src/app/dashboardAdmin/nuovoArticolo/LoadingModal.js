'use client';

import React from 'react';
import { createPortal } from 'react-dom'; // Importante per i portali

export default function LoadingModal({ isOpen, message,  }) {
    // Se la modale non deve essere aperta, non renderizzare nulla
    if (!isOpen) return null;

    // Mi assicuro che codice sia eseguito solo nel browser
    if (typeof document === 'undefined') return null;


    // createPortal renderizza i figli (il div della modale) in un elemento DOM specificato (document.body)
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay semitrasparente con blur */}
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>

            {/* Contenuto della modale */}
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl text-center mx-4">
                <div className="flex items-center justify-center mb-4">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-semibold text-gray-800">{message}</p>
                </div>
            </div>
        </div>,
        document.body // Questo è il nodo DOM dove la modale verrà effettivamente renderizzata
    );
}
