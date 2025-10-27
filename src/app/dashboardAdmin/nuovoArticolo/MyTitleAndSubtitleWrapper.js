'use client';

import React, {useCallback, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import * as domainLib from '@tuoorg/domain-lib';
import {TitleAndSubtitle} from "@adespota/my-react-component";






export default function MyTitleAndSubtitleWrapper() {
    const dispatch = useDispatch();



    // Dati da passare TitleAndSubtitle
    const titolo = useSelector(s => s?.articolo?.titolo) || "" ;
    const sottotitolo = useSelector(s => s?.articolo?.sottotitolo) || "" ;
    const azione = domainLib.articolo.setInput;



    return (
        <>
            <TitleAndSubtitle
                titolo={titolo}
                sottotitolo={sottotitolo}
                onSetInput={(value) => dispatch(azione(value))}
            />
        </>

    );
}
