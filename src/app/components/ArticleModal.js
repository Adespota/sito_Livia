'use client';

import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@adespota/my-react-component";
import {downloadArticle} from "@/utils/downloadArticle";
import { showSnackbar } from "@/reducer/features/snackBarSlice";
import {addParagraph, deleteAllParagraphs, resetAll, triggerResetKey} from "@/reducer/features/articoloSlice";
import DialogEndFreeVersion from "@/app/components/DialogEndFreeVersion";
import {backgroundButtonStyle} from "@/styles/constants";
import {strongToHTML} from "@/utils/strongToHTML";
import {splitIntoBlocks} from "@/utils/splitIntoBlocks";
import {convertDashListsToHtml} from "@/utils/convertDashListsToHtml";
import {usePathname, useRouter, useSearchParams} from "next/navigation";




export default function ArticleModal({ isOpen, onClose, onActionComplete }) {
    const articolo = useSelector(state => state.articolo);
    const dispatch = useDispatch();
    const [dialogBuy, setDialogBuy] = useState(false);

    const pathname = usePathname() || '';
    const searchParams = useSearchParams();
    const isPreview = searchParams?.get('preview') === 'true';



    if (!isOpen) return null;

    // Funzione di callback per lo snackbar
    const handleShowSnackbar = (snackbarData) => {
        dispatch(showSnackbar(snackbarData));
    };

    const openDialogBuy= () => {
        setDialogBuy(true);
    }





    return (
        <>
            {dialogBuy  && (
                <DialogEndFreeVersion open={dialogBuy} onClose={() => setDialogBuy(false)} />
            )}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-hidden p-4">
                <div className="bg-white mt-10 p-7 rounded-lg shadow-xl max-w-5xl w-full mx-6 my-8 relative flex flex-col h-[90vh]">
                    <button
                        onClick={() => {
                            onClose();
                            dispatch(deleteAllParagraphs());
                            dispatch(resetAll());
                            dispatch(addParagraph());
                            dispatch(triggerResetKey());
                        }}
                        className="absolute top-0 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
                    >
                        &times;
                    </button>

                    {/* Contenitore scorrevole per l'articolo */}
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <article className="article-content">
                            <div className="mb-40 sm:mt-8 mt-20">
                                <div className="w-full pt-8 pb-10 select-none px-4">
                                    <div className="w-full md:pl-6 md:pr-28">
                                        <h1 className="text-[1.6rem] sm:text-[2.1rem] tracking-wide leading-tight font-bold mb-2">{articolo.titolo}</h1>
                                        <h2 className="text-[0.9rem] sm:text-[1.3rem] tracking-wide leading-relaxed font-semibold mb-4">{articolo.sottotitolo}</h2>
                                    </div>
                                    <div className="md:pl-6">
                                        <h2 className="text-[1.6rem] font-bold mb-2 tracking-wide">Indice</h2>
                                        <div className="text-md mb-6 flex flex-col space-y-1">
                                            <ul style={{listStyle: 'none', marginLeft: 0}}>
                                                {articolo.indice.map((item, index) => (
                                                    <li key={index}>
                                                        <a>{item}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {articolo.paragrafi.map((paragrafoObj, index) => {
                                            if (!paragrafoObj || typeof paragrafoObj.contenuto !== 'string') {
                                                console.error("Dato paragrafo non valido o 'contenuto' non stringa:", paragrafoObj);
                                                return null;
                                            }
                                            const blocksFromContent = splitIntoBlocks(paragrafoObj.contenuto);

                                            return (
                                                <div className="md:pr-44 pr-5 md:w-[75%] w-full"
                                                     key={`paragrafo-${index}`}>
                                                    <h2 className="text-[1.5rem] leading-tight tracking-wide font-bold mb-4 mt-10">{paragrafoObj.titoloParagrafo}</h2>
                                                    {blocksFromContent.map((blockHtml, blockIndex) => {
                                                        const convertToStrong = strongToHTML(blockHtml);
                                                        const processedHtml = convertDashListsToHtml(convertToStrong);

                                                        return (
                                                            <p
                                                                key={`paragrafo-${index}-block-${blockIndex}`}
                                                                dangerouslySetInnerHTML={{ __html: processedHtml }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                        <div className="p-6 md:p-10 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-12">
                                            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Metadati dell&apos;Articolo</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Parola Chiave</p>
                                                        <p className="text-lg font-bold text-gray-800 leading-tight">{articolo.parolaChiave}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Titolo SEO</p>
                                                        <p className="text-lg font-bold text-gray-800 leading-tight">{articolo.titoloSeo}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Slug</p>
                                                        <p className="text-lg font-bold text-gray-800 leading-tight">{articolo.slug}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Meta Description</p>
                                                        <p className="text-lg font-bold text-gray-800 leading-tight">{articolo.metaDescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="sticky bottom-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-end space-x-4">
                        <Button
                            buttonTextDesktop="Modifica"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            onClick={() => {
                                console.log('DEBUG Modifica click', { pathname, isPreview });
                                if (isPreview) {
                                    openDialogBuy();
                                } else if (pathname.startsWith('/dashboardAdmin/nuovoArticolo')) {
                                    onActionComplete?.(pathname);
                                    onClose();
                                }
                            }}
                        />
                        <Button
                            buttonTextDesktop="Scarica"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            onClick={() => downloadArticle(articolo, handleShowSnackbar)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
