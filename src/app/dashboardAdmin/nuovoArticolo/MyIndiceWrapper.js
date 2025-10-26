'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { Indice } from '@adespota/my-react-component';

export default function MyIndiceWrapper() {
    const indice = useSelector(s => s?.articolo?.indice || []);

    return (
        <Indice value={indice} />
    );
}
