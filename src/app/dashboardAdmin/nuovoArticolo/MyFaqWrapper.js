'use client';

import React, { useCallback } from 'react';
import { FaqArticle } from '@adespota/my-react-component';
import * as domainLib from '@tuoorg/domain-lib';
import { useDispatch, useSelector } from 'react-redux';

export default function MyFaqWrapper() {
    const dispatch = useDispatch();
    const faqs = useSelector((s) => s?.articolo?.faq || []);
    const setInputPath = domainLib.articolo?.setInputPath;
    const addFaq = domainLib.articolo?.addFaq;
    const removeFaq = domainLib.articolo?.removeFaq;


    const handleChangeDomanda = useCallback((index, value) => {
        dispatch(
            setInputPath({
                path: `faq[${index}].domanda`,
                value,
            })
        );
    }, [dispatch, setInputPath]);


    const handleChangeRisposta = useCallback((index, value) => {
        dispatch(
            setInputPath({
                path: `faq[${index}].risposta`,
                value,
            })
        );
    }, [dispatch, setInputPath]);

    const handleAdd = useCallback(() => {
        dispatch(addFaq());
    }, [dispatch, addFaq]);

    const handleRemove = useCallback(
        (index) => {
            dispatch(removeFaq(index));
        },
        [dispatch, removeFaq]
    );

    return (
        <div className="space-y-6">
            {faqs.map((faq, index) => (
                <FaqArticle
                    key={`faq-${faq.id || index}`}
                    index={index}
                    domanda={faq.domanda}
                    risposta={faq.risposta}
                    onSetInputPathDomanda={handleChangeDomanda}
                    onSetInputPathRisposta={handleChangeRisposta}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                />
            ))}
        </div>
    );
}
