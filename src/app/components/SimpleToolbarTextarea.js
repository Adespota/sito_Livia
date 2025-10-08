import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@adespota/my-react-component";
import { backgroundButtonStyle, textButtonStyle } from "@/styles/constants";
import BoldIcon from '@mui/icons-material/FormatBold';
import LinkIcon from '@mui/icons-material/AddLinkRounded';
import { HeroIcon } from "@/app/componentsClient/componentsClient";


export default function SimpleToolbarContentEditable({
                                                         initialContent = '',
                                                         onContentChange,
                                                         editorId,
                                                     }) {
    const editorRef = useRef(null);
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [linkURL, setLinkURL] = useState('');
    const savedRange = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
            editorRef.current.innerHTML = initialContent;
            if (!savedRange.current) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
                savedRange.current = range;
            }
        }
    }, [initialContent]);

    const saveSelection = useCallback(() => {
        if (editorRef.current && editorRef.current === document.activeElement) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (editorRef.current.contains(range.commonAncestorContainer)) {
                    savedRange.current = range;
                }
            }
        }
    }, []);

    const restoreSelection = useCallback(() => {
        if (savedRange.current && editorRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            try {
                selection.addRange(savedRange.current);
            } catch (e) {
                console.warn("Could not restore selection, falling back to end of editor:", e);
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                selection.addRange(range);
                savedRange.current = range;
            }
        }
    }, []);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            saveSelection();
            if (onContentChange) {
                onContentChange(editorRef.current.innerHTML);
            }
        }
    }, [onContentChange, saveSelection]);

    // *** NUOVA FUNZIONE PER APPLICARE FORMATTAZIONE PERSONALIZZATA ***
    const applyCustomFormatting = useCallback((tag, value = null) => {
        if (!editorRef.current) return;

        editorRef.current.focus();
        restoreSelection();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        let selectedContent;

        if (range.collapsed) { // Nessuna selezione (solo cursore)
            // Inserisci il tag vuoto o con un placeholder e posiziona il cursore all'interno
            const node = document.createElement(tag);
            if (tag === 'a' && value) {
                node.href = value;
                node.textContent = 'Link Testo'; // Testo placeholder per il link vuoto
            } else {
                node.textContent = 'testo'; // Placeholder per <strong>
            }
            range.insertNode(node);
            // Posiziona il cursore all'interno del nodo
            range.setStart(node, 0);
            range.setEnd(node, node.childNodes.length); // Se c'è testo placeholder
            selection.removeAllRanges();
            selection.addRange(range);

        } else { // Testo selezionato
            // Controlla se la selezione è già all'interno di un tag <strong>
            const parentNode = range.commonAncestorContainer;
            const existingTag = parentNode.nodeType === Node.ELEMENT_NODE && parentNode.tagName.toLowerCase() === tag
                ? parentNode
                : range.commonAncestorContainer.parentNode && range.commonAncestorContainer.parentNode.tagName.toLowerCase() === tag
                    ? range.commonAncestorContainer.parentNode
                    : null;

            if (existingTag) {
                // Se è già all'interno, "sbloccalo" (rimuovi il tag)
                const tempDocFrag = document.createDocumentFragment();
                while (existingTag.firstChild) {
                    tempDocFrag.appendChild(existingTag.firstChild);
                }
                existingTag.parentNode.replaceChild(tempDocFrag, existingTag);
                selection.removeAllRanges();
                selection.addRange(range); // Mantiene la selezione del testo originale
            } else {
                // Avvolgi la selezione con il nuovo tag
                try {
                    const node = document.createElement(tag);
                    if (tag === 'a' && value) {
                        node.href = value;
                    }
                    range.surroundContents(node);
                } catch (e) {
                    // Questa parte gestisce casi complessi di selezione che non possono essere avvolti direttamente
                    // Ad esempio, se la selezione attraversa diversi nodi non contigui.
                    // In questo caso, potresti voler applicare la formattazione a livello di blocchi o fallire.
                    // Per semplicità qui, useremo document.execCommand come fallback per il link se surround fallisce,
                    // ma per <strong> non abbiamo un fallback diretto.
                    console.warn(`Failed to surround contents with <${tag}>. Error:`, e);
                    if (tag === 'a') {
                        document.execCommand('createLink', false, value);
                    }
                }
            }
        }

        saveSelection();
        handleInput();
    }, [saveSelection, restoreSelection, handleInput]);

    // Modificato handleBold per usare applyCustomFormatting
    const handleBold = () => {
        applyCustomFormatting('strong');
    };

    const handleAddLink = () => {
        if (!editorRef.current) return;
        saveSelection();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editorRef.current.contains(range.commonAncestorContainer) && range.toString().trim() !== '') {
                setShowLinkPopup(true);
            } else {
                alert('Seleziona il testo da trasformare in link.');
                savedRange.current = null;
            }
        } else {
            alert('Seleziona il testo da trasformare in link.');
            savedRange.current = null;
        }
    };

    const handleLinkSubmit = () => {
        if (!linkURL || !savedRange.current) {
            alert('URL o selezione non valida.');
            return;
        }

        applyCustomFormatting('a', linkURL); // Usa applyCustomFormatting per i link

        setShowLinkPopup(false);
        setLinkURL('');
        savedRange.current = null;
    };

    const handleFocus = useCallback(() => {
        restoreSelection();
    }, [restoreSelection]);

    const handleBlur = useCallback(() => {
        saveSelection();
    }, [saveSelection]);

    const handleUnorderedList = useCallback(() => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        restoreSelection();
        // questo crea <ul><li>…</li></ul> attorno ai paragrafi selezionati
        document.execCommand('insertUnorderedList', false, null);
        saveSelection();
        handleInput();
    }, [restoreSelection, saveSelection, handleInput]);



    return (
        <div className="container">
            <div className="flex flex-row space-x-2 mt-3 p-2 bg-gray-100 border border-gray-200 rounded-2xl mb-2">
                <HeroIcon
                    icon={BoldIcon}
                    onClick={handleBold}
                    tooltipText="Grassetto (Strong)"
                    size={{ width: 'w-4', height: 'h-4' }}
                    className="p-1 cursor-pointer hover:bg-gray-200 rounded-md"
                />
                <HeroIcon
                    icon={LinkIcon}
                    onClick={handleAddLink}
                    tooltipText="Aggiungi link"
                    size={{ width: 'w-4', height: 'h-4' }}
                    className="p-1 cursor-pointer hover:bg-gray-200 rounded-md"
                />
                <HeroIcon
                    icon={LinkIcon}
                    onClick={handleUnorderedList}
                    tooltipText="Elenco puntato"
                    size={{ width: 'w-4', height: 'h-4' }}
                    className="p-1 cursor-pointer hover:bg-gray-200 rounded-md"
                />
            </div>
            <div
                id={editorId}
                ref={editorRef}
                contentEditable={true}
                onInput={handleInput}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48 overflow-y-auto"
            />

            {showLinkPopup && (
                <div className="link-popup border p-4 mt-4 rounded shadow-lg bg-white">
                    <p className="mb-2">Inserisci l&apos;URL per il link.</p>
                    <input
                        type="text"
                        placeholder="Inserisci l'URL del link"
                        value={linkURL}
                        onChange={(e) => setLinkURL(e.target.value)}
                        className="border p-2 w-full mb-3 rounded"
                    />
                    <div className="flex space-x-4 mt-3">
                        <Button
                            backgroundColor={backgroundButtonStyle}
                            textStyle={textButtonStyle}
                            buttonTextDesktop="Aggiungi Link"
                            onClick={handleLinkSubmit}
                        />
                        <Button
                            buttonTextDesktop="Annulla"
                            backgroundColor={backgroundButtonStyle}
                            textStyle={textButtonStyle}
                            onClick={() => {
                                setShowLinkPopup(false);
                                setLinkURL('');
                                editorRef.current.focus();
                                restoreSelection();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
