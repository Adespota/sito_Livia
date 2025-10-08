import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CompositeDecorator, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import DOMPurify from 'dompurify';
import {
    selectInitialStateArticolo,
    setContaParole,
    setInputPath,
    triggerSendToRedux,
    validaTutto
} from '/src/reducer/features/articoloSlice';
import {stateToHTML} from 'draft-js-export-html';
import {throttle} from 'lodash';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
    BoldButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton,
} from '@draft-js-plugins/buttons';
import Editor from '@draft-js-plugins/editor';
import {stateFromHTML} from 'draft-js-import-html';
import Modifier from 'draft-js/lib/DraftModifier';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import {HeroIcon} from "@/app/componentsClient/componentsClient";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";
import {calculateWordCount} from "@/utils/calculateWordCount";
import linkDecorator, { findLinkEntities, Link } from '@/app/dashboardAdmin/nuovoArticolo/linkDecorator';
import latexMathDecorator, { findLatexMath, LatexMathSpan } from './latexMathDecorator';
import {strongToHTML} from "@/utils/strongToHTML";
import {convertAsteriskListsToHtml, convertDashListsToHtml} from "@/utils/convertDashListsToHtml";



const combinedDecorator = new CompositeDecorator([
    { strategy: findLinkEntities, component: Link },
    { strategy: findLatexMath,   component: LatexMathSpan }
]);



export default function EditorParagraph({ index, counterFlag, localStateOnly = false, initialLocalContent = [{}], }) {
    const dispatch = useDispatch();
    const articolo = useSelector(selectInitialStateArticolo);
    const paroleNelParagrafo = articolo.numeroParolePerParagrafo[index] || 0;
    let paragrafi;
    paragrafi = useSelector(state => state.articolo.paragrafi[index]) || {};
    const [editorState, setEditorState] = useState( EditorState.createEmpty(combinedDecorator));
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [linkURL, setLinkURL] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const toolbarPlugin = createToolbarPlugin();
    const { Toolbar } = toolbarPlugin;
    const plugins = [toolbarPlugin];
    const [contenuto, setContenuto] = useState("");
    const shouldSendToRedux = useSelector((state) => state.articolo.shouldSendToRedux);
    const isInitialized = useRef(false);
    const editorRef = useRef(null);
    const lastLocal  = useRef('');


    // eseguo questo blocco solo se localStateOnly === true
    useEffect(() => {
        console.log("initialLocalContent", initialLocalContent)
        if (!localStateOnly) return;

        // se il contenuto non è cambiato, esco
        if (initialLocalContent === lastLocal.current) return;
        lastLocal.current = initialLocalContent;

        // passo direttamente l’HTML che mi arriva da props
        const html = initialLocalContent || '';
        const contentState = stateFromHTML(html);
        const newState = EditorState.createWithContent(contentState, combinedDecorator);

        setEditorState(newState);
        setContenuto(html);

        // **Nessun dispatch**, qui non tocchiamo mai Redux
    }, [localStateOnly, initialLocalContent]);




    useEffect(() => {
        if (localStateOnly) return;
        let initContent;
        // Controlla prima il contenuto recuperato dal localStorage
        if (contenuto && contenuto !== '<p><br></p>' && contenuto.trim() !== '') {
            initContent = contenuto;
        } else if (paragrafi.contenuto) {
            //initContent = strongToHTML(paragrafi.contenuto);

            let processedContent = convertDashListsToHtml(paragrafi.contenuto);
            processedContent = strongToHTML(processedContent);

            initContent = processedContent;


            const wordCount = calculateWordCount(initContent);
            dispatch(setContaParole({ index, wordCount }));
        } else if (!paragrafi.contenuto && !localStateOnly && !contenuto) {
            // Se non esistono entrambi, inizializza l'editor vuoto
            setEditorState(EditorState.createEmpty(combinedDecorator));
            return;
        } else return;
        const formattedContent = restoreParagraphs(initContent);
        const contentState = stateFromHTML(formattedContent);
        setEditorState(EditorState.createWithContent(contentState, combinedDecorator));
    }, [paragrafi]);




    const throttledUpdateContentToRedux = throttle(sanitizedContent => {
        if (localStateOnly) {
            console.log("Sincronizzazione Redux disabilitata per localStateOnly = true.");
            return;
        }

        if (sanitizedContent?.trim().length > 0) {
            dispatch(setInputPath({
                path: `paragrafi[${index}].contenuto`,
                value: sanitizedContent,
            }));
            console.log("Chiamata a setInputPath...");
        } else {
            console.log("Non ho chiamato setInputPath...");
        }
    },);




    const handleEditorChange = (state) => {
        setEditorState(state);
        const currentContent = state.getCurrentContent();
        const htmlContent = stateToHTML(currentContent);
        const sanitizedContent = sanitizeContent(htmlContent);
        setContenuto(sanitizedContent);
        initialLocalContent = sanitizedContent;


        // Calcola il conteggio delle parole
        const wordCount = calculateWordCount(sanitizedContent);

        // Se localStateOnly è true, non inviare il conteggio a Redux
        if (!localStateOnly) {
            dispatch(setContaParole({ index, wordCount }));
            setTimeout(() => {
                dispatch(validaTutto())
                console.log("Ho avviato l'azione validaTutto() nel handlerEditorChange!!!");
            }, 1000);
        }


        /*
        // Invia il numero di parole per il paragrafo specifico
        dispatch(setContaParole({ index, wordCount }));

        setTimeout(() => {
            dispatch(validaTutto())
            console.log("Ho avviato l'azione validaTutto() nel handlerEditorChange!!!");
        }, 1000);
         */
    };




    // Questa funzione invia il contenuto del paragrafo a redux
    const handleSendToRedux = useCallback(async () => {
        return new Promise((resolve, reject) => {
            // Se localStateOnly è true, risolvi immediatamente senza fare nulla
            if (localStateOnly) {
                console.log("handleSendToRedux non eseguito perché localStateOnly è true.");
                resolve();
                return;
            }

            try {
                console.log("Contenuto che viene inviato al Redux:", contenuto);

                if (contenuto.trim().length > 0 && !/^<br\s*\/?>$/.test(contenuto) && contenuto !== paragrafi.contenuto) {
                    throttledUpdateContentToRedux(contenuto);
                    console.log("Contenuto salvato su Redux:", contenuto);
                } else {
                    console.log("Contenuto vuoto o non modificato, nessun salvataggio.");
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }, [contenuto, paragrafi, throttledUpdateContentToRedux]);




    useEffect(() => {
        // Esegui handleSendToRedux solo se shouldSendToRedux è true E localStateOnly è false
        if (shouldSendToRedux && !localStateOnly) {
            handleSendToRedux()
                .then(() => {
                    console.log("handleSendToRedux completato.");
                    dispatch(triggerSendToRedux(false));
                })
                .catch((error) => {
                    console.error("Errore durante l'esecuzione di handleSendToRedux:", error);
                });
        } else if (shouldSendToRedux && localStateOnly) {
            // Se shouldSendToRedux è true ma localStateOnly è true,
            // resetta comunque shouldSendToRedux per evitare futuri trigger
            dispatch(triggerSendToRedux(false));
        }
    }, [shouldSendToRedux, ]);


    /*
    useEffect(() => {
        if (shouldSendToRedux) {
            handleSendToRedux()
                .then(() => {
                    console.log("handleSendToRedux completato.");
                    dispatch(triggerSendToRedux(false));
                })
                .catch((error) => {
                    console.error("Errore durante l'esecuzione di handleSendToRedux:", error);
                });
        }
    }, [shouldSendToRedux]);
     */


    const restoreParagraphs = (dirtyContent) => {
        console.log("Testo originale con il quale si popola l'editor:", dirtyContent);
        const cleanedContent = dirtyContent?.trim();
        console.log("Testo dopo il restoreParagraphs:", cleanedContent);
        throttledUpdateContentToRedux(contenuto);
        throttledUpdateContentToRedux(cleanedContent);
        setContenuto(cleanedContent);
        return cleanedContent;
    };


    const addLink = (editorState, selectionState, url) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithLink = contentState.createEntity('LINK', 'MUTABLE', { url });
        const entityKey = contentStateWithLink.getLastCreatedEntityKey();
        const contentStateWithLinkApplied = Modifier.applyEntity(
            contentStateWithLink,
            selectionState,
            entityKey
        );

        return EditorState.push(
            editorState,
            contentStateWithLinkApplied,
            'apply-entity'
        );
    };

    const handleAddLink = async () => {
        const selectionState = editorState.getSelection();
        if (!selectionState.isCollapsed()) {
            const currentContent = editorState.getCurrentContent();
            const start = selectionState.getStartOffset();
            const end = selectionState.getEndOffset();
            const block = currentContent.getBlockForKey(selectionState.getStartKey());
            const selectedText = block.getText().slice(start, end);

            console.log('Testo selezionato prima del trim:', selectedText);
            console.log('Testo selezionato dopo il trim:', selectedText.trim());

            if (selectedText.trim() !== '') {
                setSelectedText(selectedText);
                setShowLinkPopup(true);
            } else {
                console.log('isAddingLink impostato a false perché il testo selezionato è vuoto dopo il trim');
            }
        }
    };



    const handleLinkSubmit = () => {
        if (linkURL) {
            const selectionState = editorState.getSelection();
            const newEditorState = addLink(editorState, selectionState, linkURL);
            setEditorState(newEditorState);
            handleEditorChange(newEditorState);

            setTimeout(() => {
                handleSendToRedux(newEditorState);
            }, 1000);

            setTimeout(() => {
                dispatch(validaTutto())
            }, 1000);

            setShowLinkPopup(false);
            setLinkURL('');
        }
    };


    const sanitizeText = (text) => {
        return DOMPurify.sanitize(text.trim(), { ALLOWED_TAGS: ['li', 'ol', 'ul'], ALLOWED_ATTR: [] });
    };


    // Questo codice permette al cursore di sparire dall'editor
    const handleBlurAfterTimeout = () => {
        if (editorRef && editorRef.current) {
            editorRef.current.blur();
        }
    }

    const handleEditorPaste = (text, html, editorState) => {
        // Usa Draft.js per creare un nuovo stato dell'editor con il testo incollato
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        const newEditorState = EditorState.push(
            editorState,
            Modifier.replaceText(contentState, selectionState, text), // Inseriamo il testo incollato
            'insert-characters'
        );

        // Chiamiamo handleEditorChange per gestire e validare il contenuto
        handleEditorChange(newEditorState);

        setTimeout(() => {
            handleSendToRedux(newEditorState);
            handleBlurAfterTimeout();
        }, 1000);


        // Restituisci true per indicare che l'evento è stato gestito
        return true;
    };




    const replaceParagraphTagsWithBr = (content) => {
        return content.replace(/<\/p>/g, '<br>');
    };

    const sanitizeContent = (dirtyContent) => {
        if (dirtyContent === '<p><br></p>') {
            console.log("Il contenuto contiene solo <p><br></p> percio non è effettuo la sanitizzazione");
            return dirtyContent;
        }
        // Condizione per eseguire la sanitizzazione
        if (dirtyContent.trim().length > 0 && !/^<br\s*\/?>$/.test(dirtyContent ) && dirtyContent !== paragrafi.contenuto) {

            console.log("Contenuto del paragrafo sporco:", dirtyContent);

            let cleanContent = DOMPurify.sanitize(dirtyContent, {
                ALLOWED_TAGS: ['strong', 'u', 'span', 'p', 'br', 'a', 'ul', 'ol', 'li'],
                ALLOWED_ATTR: ['style', 'href', 'data-math',],
            });

            // Rimuove sequenze multiple di <br>
            cleanContent = cleanContent.replace(/(<br\s*\/?>\s*)+/g, '<br>');

            // Sostituisce i tag <p> con <br>, se necessario
            cleanContent = replaceParagraphTagsWithBr(cleanContent);

            // Rimuove <p> vuoti e normalizza il contenuto
            cleanContent = cleanContent
                .replace(/^<p>(\s*|<br>)*<\/p>/g, '')  // Rimuove paragrafi vuoti
                .replace(/^<p>/, '')                   // Rimuove apertura <p> iniziale
                .replace(/<\/?p>/g, '')                // Rimuove qualsiasi <p> rimanente
                .replace(/<\/p>$/, '');                // Rimuove chiusura </p> finale

            console.log("Contenuto del paragrafo ripulito:", cleanContent);
            return cleanContent;
        }

        // Ritorna il contenuto originale se non c'è bisogno di sanitizzare
        return dirtyContent;
    };







    return (
        <div className="container" onMouseLeave={() => {
            if (editorRef && editorRef.current) {
                editorRef.current.blur();
            }
        }}>
            <div className="editor-toolbar flex flex-row space-x-2 mt-3">
                <Toolbar>
                    {(externalProps) => (
                        <div
                            className="flex flex-row -pb-3.5 pt-2 px-1 space-x-1 bg-gray-100 border border-gray-200 rounded-2xl mb-2">
                            <BoldButton {...externalProps} getEditorState={() => editorState}
                                        setEditorState={setEditorState}/>
                            <ItalicButton {...externalProps} getEditorState={() => editorState}
                                          setEditorState={setEditorState}/>
                            <UnderlineButton {...externalProps} getEditorState={() => editorState}
                                             setEditorState={setEditorState}/>
                            <OrderedListButton {...externalProps} getEditorState={() => editorState}
                                               setEditorState={setEditorState}/>
                            <UnorderedListButton {...externalProps} getEditorState={() => editorState}
                                                 setEditorState={setEditorState}/>
                        </div>
                    )}
                </Toolbar>
                <HeroIcon
                    icon={AddLinkRoundedIcon}
                    onClick={handleAddLink}
                    size={{width: 'w-4', height: 'h-4'}}
                    tooltipText="Aggiungi link"
                    className="bg-gray-100 border border-gray-200 rounded-[12px] mb-2 px-1 pt-[0.325rem]"
                />
            </div>
            <div className="editor">
                <Editor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={handleEditorChange}
                    plugins={plugins}
                    placeholder="Inizia a scrivere qui..."
                    handlePastedText={handleEditorPaste}
                />
            </div>
            <div className="word-count">
                <p className="text-gray-400 font-semibold text-[0.70rem]">Parole inserite: {paroleNelParagrafo}</p>
            </div>


            {/* Popup/modal per inserire il link */}
            {showLinkPopup && (
                <div className="link-popup">
                    <p>Testo selezionato: <strong>{sanitizeText(selectedText)}</strong></p>
                    <input
                        type="text"
                        placeholder="Inserisci l'URL del link"
                        value={linkURL}
                        onChange={(e) => setLinkURL(e.target.value)}
                    />
                    <div className="flex space-x-4 mt-3">
                        <Button
                            buttonTextDesktop="Aggiungi"
                            backgroundColor="bg-[#fcc71c] hover:bg-[#ffd700]"
                            onClick={handleLinkSubmit}
                        />
                        <Button
                            buttonTextDesktop="Annulla"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            onClick={() => {
                                setShowLinkPopup(false);
                                setLinkURL('');
                            }}/>
                    </div>
                </div>
            )}
        </div>
    );
}
