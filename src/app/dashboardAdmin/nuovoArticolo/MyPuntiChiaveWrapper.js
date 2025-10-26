'use client';

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as domainLib from "@tuoorg/domain-lib";
import { PuntiChiave } from "@adespota/my-react-component";



export default function MyPuntiChiaveWrapper() {
    const dispatch = useDispatch();

    const puntiChiave = useSelector((s) => s?.articolo?.puntiChiave || []);
    const validazione = useSelector(
        (s) => s?.articolo?.validazione?.puntiChiave ?? true
    );

    const setInput = domainLib.articolo.setInput;

    return (
        <PuntiChiave
            value={puntiChiave}
            isValid={validazione}
            onChange={(payload) => dispatch(setInput(payload))}
        />
    );
}
