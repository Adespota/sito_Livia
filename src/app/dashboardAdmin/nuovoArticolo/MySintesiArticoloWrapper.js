'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SintesiArticolo } from '@adespota/my-react-component';
import * as domainLib from '@tuoorg/domain-lib';



export default function MySintesiArticoloWrapper() {
    const dispatch = useDispatch();

    const sintesi = useSelector(s => s?.articolo?.sintesi || "");
    //const validazione = useSelector(s => s?.articolo?.validazione?.sintesi ?? true);

    const setInput = domainLib.articolo.setInput;

    return (
        <SintesiArticolo
            value={sintesi}
            //isValid={validazione}
            onChange={(payload) => dispatch(setInput(payload))}
        />
    );
}
