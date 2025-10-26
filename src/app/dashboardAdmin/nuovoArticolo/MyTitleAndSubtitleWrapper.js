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
    const azione = domainLib.articolo.setInputPath;
    //console.log("setSelectedCategory in domainLib →", domainLib.setSelectedCategory);





    return (
        <>
            <TitleAndSubtitle
                titolo={titolo}
                sottotitolo={sottotitolo}
                onSetInput={({ field, value }) => dispatch(azione({ path: field, value }))}
            />
        </>

    );
}
