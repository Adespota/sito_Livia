'use client';

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as domainLib from "@tuoorg/domain-lib";
import { NewParagraph } from "@adespota/my-react-component";

export default function AllParagraphs() {
    const dispatch = useDispatch();
    const paragrafi = useSelector((s) => s.articolo.paragrafi || []);
    const resetKey = useSelector((s) => s.articolo.resetKey);
    const azione = domainLib.articolo.setInputPath;

    // ✅ Callback stabili e coerenti
    const handleTitleChange = useCallback((index, value) => {
        //console.log("Titolo aggiornato:", value);
        dispatch(azione({
            path: `paragrafi[${index}].titoloParagrafo`,
            value
        }));
    }, [dispatch, azione]);

    const handleContentChange = useCallback((index, value) => {
        dispatch(azione({
            path: `paragrafi[${index}].contenuto`,
            value
        }));
    }, [dispatch, azione]);

    const handleWordCount = useCallback((index, count) => {
        dispatch(domainLib.articolo.setContaParole({ index, wordCount: count }));
    }, [dispatch]);

    const handleValidate = useCallback(() => {
        dispatch(domainLib.articolo.validaTutto());
    }, [dispatch]);

    const handleAdd = useCallback(() => {
        dispatch(domainLib.articolo.addParagraph());
    }, [dispatch]);

    const handleRemove = useCallback((index) => {
        dispatch(domainLib.articolo.deleteParagraph(index));
    }, [dispatch]);

    console.log("PARAGRAFI:", paragrafi);

    return (
        <div className="space-y-5">
            {paragrafi.map((paragrafo, index) => (
                <NewParagraph
                    key={`${paragrafo.id}-${resetKey}`}
                    index={index}
                    titleValue={paragrafo.titoloParagrafo}
                    contentValue={paragrafo.contenuto}
                    onTitleChange={(i, value) => handleTitleChange(i, value)}
                    onContentChange={(i, value) => handleContentChange(i, value)}
                    onWordCount={(i, count) => handleWordCount(i, count)}
                    onValidate={handleValidate}
                    onAdd={handleAdd}
                    onRemove={() => handleRemove(index)}
                />
            ))}
        </div>
    );
}
