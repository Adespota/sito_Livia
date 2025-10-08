'use client';

import React, {useEffect, useRef, useState} from 'react';
import TitleAndSubtitle from "./Title&subtitle";
import LinkInterno from "./LinkInterno";
import IndiceArticolo from "./IndiceArticolo";
import SeoDataForm from "./SeoDataForm";
import NewParagraph from "./NewParagraph";
import {batch, useDispatch, useSelector} from "react-redux";
import {
    addParagraph,
    deleteAllParagraphs,
    deleteParagraph,
    resetAll,
    triggerResetKey,
    triggerSendToRedux,
    updateContentParagraph,
    updateIndiceFromGemini,
    updateMetaDescriptionFromGemini,
    updateParolaChiaveFromGemini,
    updateParolePerParagrafo,
    updateSlugFromGemini,
    updateSubtitleFromGemini,
    updateTitleFromGemini,
    updateTitleParagraph,
    updateTitoloSeoFromGemini,
} from "@/reducer/features/articoloSlice";
import {showSnackbar} from "@/reducer/features/snackBarSlice";
import LoadingModal from "@/app/dashboardAdmin/nuovoArticolo/LoadingModal";
import BottomSheetGemini from "@/app/dashboardAdmin/nuovoArticolo/BottomSheetGemini";
import HeaderPageArticle from "@/app/dashboardAdmin/nuovoArticolo/HeaderPageArticle";
import {Input, Switch} from '@headlessui/react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {Button} from "@adespota/my-react-component";
import HeroIcon from "@/app/components/HeroIcons";
import ArticleModal from "@/app/components/ArticleModal";
import {downloadArticle} from "@/utils/downloadArticle";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CardPerformanceArticle from "@/app/dashboardAdmin/nuovoArticolo/CardPerformanceArticle";
import {clearAudit, fetchAuditSuccess} from "@/reducer/features/auditSlice";
import auditSEO from "../../../../pages/api/auditSEO";
import {doc, increment, onSnapshot, updateDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {firestore} from "@/app/firebase";
import CardPrice from "@/app/prices/CardPrice";
import {motion} from "framer-motion";
import Image from "next/image";
const auth = getAuth();
const user = auth.currentUser;
import {cards} from '../../prices/CARDS_PRICES'
import {CheckCircleIcon, XMarkIcon} from "@heroicons/react/24/solid";
import classNames from "@/utils/classNames";
import {Elements} from "@stripe/react-stripe-js";
import UpgradePaymentModal from "@/app/dashboardAdmin/nuovoArticolo/UpgradePaymentModal";
import {loadStripe} from "@stripe/stripe-js";
import {selectCarrello, setPlan, addToCart, cleanPlan} from '@/reducer/features/carrelloSlice';
import {calcolaCreditoResiduo} from "@/utils/calcolaCreditoResiduo";
import {
    selectIsUserLoading,
    selectUserDisplayName,
    selectUserFirstName,
    selectUserLastName,
    selectUserUid
} from "@/reducer/features/user";





export default function NuovoArticolo() {
    const dispatch = useDispatch();
    const paragrafi = useSelector(state => state.articolo.paragrafi);
    const [geminiPrompt, setGeminiPrompt] = useState('');
    const [geminiLoading, setGeminiLoading] = useState(false);
    const [auditSEOLoading, setAuditSEOLoading] = useState(false);
    const [geminiError, setGeminiError] = useState('');
    //const seoDataFormRef = useRef(null); // Riferimento al componente SeoDataForm
    const [isSeoDataFormVisible, setIsSeoDataFormVisible] = useState(false);
    const [counterFlag, setCounterFlag] = useState(0);
    const [titolo, setTitolo] = useState("");
    const resetKey = useSelector(s => s.articolo.resetKey);
    const articolo = useSelector(state => state.articolo);
    const showDemo = process.env.NEXT_PUBLIC_SHOW_DEMO === 'true';
    const [chatGemini, setChatGemini] = useState(false);
    //const [imgs, setImgs] = useState([]);
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [showArticleContentSection, setShowArticleContentSection] = useState(false);
    const { currentAudit, isLoading, error } = useSelector(state => state.auditSlice);
    const [generationCount, setGenerationCount] = useState(0);
    const [showUpgradeModal, setShowUpgradeModal] = useState(true);
    const [upgradeMessage, setUpgradeMessage] = useState('');
    const [abbonamento, setAbbonamento]   = useState('');
    //console.log("Piano scelto dall'utente:", abbonamento);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    const { item, price, plan, planId } = useSelector(selectCarrello);
    const [dataSottoscrizioneAbbonamento, setDataSottoscrizioneAbbonamento] = useState('');
    const [durataAbbonamento, setDurataAbbonamento] = useState('');
    //console.log("Durata abbonamento:", durataAbbonamento);
    const activeCard = cards.find(card => card.textLabel === abbonamento);
    const prezzoAttivo = activeCard ? durataAbbonamento === 'Annuale' ? Math.round(activeCard.price * 12 * 0.85) : activeCard.price : 0;
    //console.log("prezzoAttivo:", prezzoAttivo);
    const userUid = useSelector(selectUserUid);
    const userFirstName = useSelector(selectUserFirstName);
    const userLastName = useSelector(selectUserLastName);






    const { credito, giorniTrascorsi } = calcolaCreditoResiduo(
        dataSottoscrizioneAbbonamento,
        prezzoAttivo,
        durataAbbonamento
    );


    useEffect(() => {
        if (abbonamento) {
            const found = cards.find(card => card.textLabel === abbonamento);
            if (found) setSelectedCard(found);
        }
    }, [abbonamento]);



    useEffect(() => {
        const auth = getAuth();
        const unsubAuth = onAuthStateChanged(auth, user => {
            if (!user?.uid) return;
            const userRef = doc(firestore, 'users', user.uid);
            const unsubSnap = onSnapshot(userRef, snap => {
                if (!snap.exists()) return;
                const data = snap.data();
                setGenerationCount(data.utilizzoGemini || 0);
                setAbbonamento(data.abbonamento || '');
                setDataSottoscrizioneAbbonamento(data.dataSottoscrizioneAbbonamento);
                setDurataAbbonamento(data.durataAbbonamento);

                // soglie
                if (abbonamento === 'Base' && generationCount === 16) {
                    setUpgradeMessage('Hai raggiunto la soglia massima disponibile dal tuo piano!');
                    setShowUpgradeModal(true);
                }
                if (abbonamento === 'Intermedio' && generationCount === 36) {
                    setUpgradeMessage('Hai raggiunto la soglia massima disponibile dal tuo piano!');
                    setShowUpgradeModal(true);
                }
            });
            return () => unsubSnap();
        });
        return () => unsubAuth();
    }, []);



    const incrementUsage = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.uid) {
            try {
                const userRef = doc(firestore, 'users', user.uid);
                await updateDoc(userRef, {
                    utilizzoGemini: increment(1)
                });
            } catch (err) {
                console.warn('Impossibile aggiornare utilizzoGemini:', err);
            }
        }
    };





        const handleShowSnackbar = () => {
        dispatch(showSnackbar({ message: "Articolo scaricato!", type: "success" }));
    };


    const handleAddParagraph = () => {
        dispatch(addParagraph());
        dispatch(showSnackbar({ message: "Paragrafo aggiunto con successo", type: "success" }));
    };

    const handleDeleteParagraph = (index) => {
        dispatch(deleteParagraph(index));
        dispatch(updateParolePerParagrafo({ index }));
        dispatch(showSnackbar({ message: "Paragrafo eliminato con successo", type: "success" }));
    };





    const resetArticle = () => {
        dispatch(deleteAllParagraphs());
        dispatch(resetAll());
        dispatch(addParagraph());
        dispatch(triggerResetKey());
        dispatch(clearAudit());
        setCounterFlag(prev => prev + 1);
    };



    // API per l'audit SEO sull' articolo
    const auditSEO = async (auditPayload) => {
        setAuditSEOLoading(true);
        setGeminiError("");

        try {
            const res = await fetch("/api/auditSEO", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleJson: auditPayload }),
            });

            if (!res.ok) {
                const errorText = await res.text(); // Leggi il testo dell'errore per maggiori dettagli
                throw new Error(`Audit SEO fallito: ${errorText}`);
            }

            const seoAudit = await res.json();
            console.log("Suggerimenti SEO:", seoAudit);
            dispatch(fetchAuditSuccess(seoAudit)); // Aggiorna lo store Redux con i risultati dell'audit
            dispatch(showSnackbar({ message: "Audit SEO completato!", type: "success" }));

        } catch (err) {
            console.error("Errore durante l'audit SEO:", err);
            setGeminiError(err.message); // Salva l'errore nello stato locale
            dispatch(showSnackbar({ message: `Errore durante l'audit: ${err.message}`, type: "error" }));
        } finally {
            setAuditSEOLoading(false);
        }
    };


    // Funzione per l'audit SEO manuale
    const handleManualAudit = async () => {
        // Costruisci il payload usando i dati attuali dello stato Redux `articolo`
        const auditPayload = {
            titolo:         articolo.titolo,
            sottotitolo:    articolo.sottotitolo,
            paragrafi:      articolo.paragrafi.map(p => ({
                titolo: p.title,
                contenuto: p.content
            })),
            parolaChiave:   articolo.parolaChiave,
            titoloSeo:      articolo.titoloSeo,
            slug:           articolo.slug,
            metaDescription:articolo.metaDescription,
        };

        await auditSEO(auditPayload);
    };



    const handleGenerateWithGemini = async () => {
        console.log("Valore di geminiPrompt al click:", geminiPrompt);

        // 1) reset sincrono se c'è già un titolo
        if (titolo) {
            dispatch(deleteAllParagraphs());
            dispatch(resetAll());
            dispatch(clearAudit());
            dispatch(addParagraph());
            dispatch(triggerResetKey());
        }

        setGeminiLoading(true);
        setGeminiError("");

        try {
            const res = await fetch("/api/geminiGenerateArticle", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({prompt: geminiPrompt}),
            });
            if (!res.ok) {
                const {error} = await res.json();
                throw new Error(error || "Errore durante la generazione con Gemini.");
            }
            const data = await res.json();


            batch(() => {

                // Dati SEO
                if (data.parolaChiave) {
                    dispatch(updateParolaChiaveFromGemini(data.parolaChiave));
                }
                if (data.titoloSeo) {
                    dispatch(updateTitoloSeoFromGemini(data.titoloSeo));
                }
                if (data.slug) {
                    dispatch(updateSlugFromGemini(data.slug));
                }
                if (data.metaDescription) {
                    dispatch(updateMetaDescriptionFromGemini(data.metaDescription));
                }


                // titolo + sottotitolo
                if (data.titolo) {
                    dispatch(updateTitleFromGemini(data.titolo));
                    setTitolo(data.titolo);
                }
                if (data.sottotitolo) {
                    dispatch(updateSubtitleFromGemini(data.sottotitolo));
                }

                // paragrafi dinamici
                data.paragrafi.forEach((p, i) => {
                    if (i > 0) dispatch(addParagraph());
                    dispatch(updateTitleParagraph({index: i, newTitle: p.titolo}));
                    dispatch(updateContentParagraph({index: i, newParagraph: p.contenuto}));
                });
                dispatch(updateIndiceFromGemini());
            });

            await incrementUsage();


            const auditPayload = {
                articleJson: {
                    titolo:         data.titolo,
                    sottotitolo:    data.sottotitolo,
                    paragrafi:      data.paragrafi,
                    parolaChiave:   data.parolaChiave,
                    titoloSeo:      data.titoloSeo,
                    slug:           data.slug,
                    metaDescription:data.metaDescription,
                }
            };

            // Chiamo l'API per analizzare l'articolo
           await auditSEO(auditPayload);


            setIsArticleModalOpen(true);
        } catch (err) {
            console.error(err);
            setGeminiError(err.message);
        } finally {
            setGeminiLoading(false);
        }
    };





    /*
    // Chiamata API per generare l'immagine
    async function generateImage() {
            const res = await fetch("/api/geminiGenerateImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: "Lobo frontale del cervello umano",
                    n: 1,
                }),
            });
            const { images, error } = await res.json();
            if (error) {
                console.error(error);
                return;
            }
            setImgs(images);
        }
     */



    /*
    const example = [
        {
            text: "Parla con me",
            onClick: () => setChatGemini(true)
        },
        {
            text: "Devo scrivere un articolo su Gaza"
        },
        {
            text: "Voglio un supporto per scrivere un articolo per il mio blog"
        },
        {
            text: "Mi serve aiuto per un articolo sull'arte"
        }
    ]

     */




    const handleModalActionToDisplayContent = (actionCompletedPath) => {
        console.log("Interruttore ricevuto dal modale per il path:", actionCompletedPath);

        // Controlla se l'azione è avvenuta sul percorso desiderato
        if (actionCompletedPath.startsWith('/dashboardAdmin/nuovoArticolo')) {
            setShowArticleContentSection(true);

        }
    };



    const disableSend =
        (abbonamento === 'Base'       && generationCount >= 16)  ||
        (abbonamento === 'Intermedio' && generationCount >= 36) ||
        (abbonamento === 'Avanzato'   && false);

    const sendColor = disableSend ? '#CCCCCC' : '#4a58a7';





    const isCurrentOrLower = (cardLabel) => {
        const piani = ['Base', 'Intermedio', 'Avanzato'];
        return piani.indexOf(cardLabel) <= piani.indexOf(abbonamento);
    };

    const handleSwitchChange = (value) => {
        dispatch(cleanPlan())
        dispatch(setPlan(value));
    };





    return (
        <>
            <LoadingModal
                isOpen={geminiLoading}
                message="L'IA sta generando il tuo articolo..."
            />
            <LoadingModal
                isOpen={auditSEOLoading}
                message="L'IA sta analizzando il tuo articolo..."
            />
            <BottomSheetGemini
                isOpen={chatGemini}
                onClose={() => setChatGemini(false)}
            />
            <ArticleModal
                isOpen={isArticleModalOpen}
                onClose={() => setIsArticleModalOpen(false)}
                onActionComplete={handleModalActionToDisplayContent}
            />


            {showUpgradeModal && (
                <motion.div
                    className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    <div className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm ">
                        <div className="bg-myColor-grayCard p-5 sm:w-5/12 w-10/12 relative rounded-lg shadow-lg">
                            <div className="flex flex-col space-y-3 items-left pb-4">
                                <div className="flex flex-row justify-between items-center">
                                    <div className="bg-white rounded-2xl inline-block w-fit h-fit p-2">
                                        <Image
                                            src={`/faviconSeoLO.svg`}
                                            width={33}
                                            height={33}
                                            alt="Logo SeoLO"
                                        />
                                    </div>
                                    <div
                                        onClick={() => setShowUpgradeModal(false)}
                                        className="cursor-pointer text-xl font-bold text-gray-500 hover:text-black"
                                        aria-label="Chiudi"
                                    >
                                        &times;
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <p className="font-bold">Sblocca funzionalità avanzate con un piano superiore</p>
                                    <p>Cambia ora il tuo abbonamento per accedere a strumenti esclusivi, migliorare le prestazioni e far crescere il tuo progetto online.</p>
                                </div>
                                {durataAbbonamento !== "Annuale" && (
                                    <div className="flex items-center mt-4 sm:pb-4 mb-0">
                                        <p className="mr-2">Mensile</p>
                                        <Switch
                                            checked={plan}
                                            onChange={handleSwitchChange}
                                            className={classNames(
                                                plan ? 'bg-myColor-default' : 'bg-gray-200',
                                                'relative inline-flex h-6 w-11 items-center rounded-full'
                                            )}
                                        >
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                plan ? 'translate-x-6' : 'translate-x-1',
                                                'inline-block h-4 w-4 transform bg-white rounded-full transition-transform'
                                            )}
                                        />
                                        </Switch>
                                        <p className="ml-2">Annuale (- 15%)</p>
                                    </div>
                                )}
                                <div className="flex flex-row space-x-3 w-fullf">
                                    {cards.map((card, idx) => {
                                        const monthlyPrice = card.price;
                                        const annualDiscount = monthlyPrice * 0.15;
                                        const discountedMonthlyPrice = (monthlyPrice - annualDiscount).toFixed(2);


                                        const annualPrice = (monthlyPrice * 12 * 0.85).toFixed(2); // 15% sconto
                                        const prezzoFinale = plan ? annualPrice : monthlyPrice;

                                        return (
                                            <div
                                                key={idx}
                                                className={`flex flex-col border p-4 rounded-2xl w-full cursor-pointer ${
                                                    selectedCard?.textLabel === card.textLabel
                                                        ? 'border-myColor-default'
                                                        : 'border-gray-300'
                                                }`}
                                                onClick={() => {
                                                    const isSameOrLower = card.textLabel === abbonamento || isCurrentOrLower(card.textLabel);
                                                    if (isSameOrLower) return; // Blocca click se è attivo o inferiore
                                                    setSelectedCard(card);
                                                    dispatch(addToCart({
                                                        item: card.textLabel,
                                                        price: prezzoFinale,
                                                        plan: !!plan,
                                                    }));
                                                }}
                                            >
                                                <div className="flex flex-row space-x-2">
                                                    <p className="font-bold ">{card.textLabel}</p>
                                                    {card.textLabel === abbonamento && (
                                                        <div className="px-1 rounded bg-green-300">
                                                            <p className="font-bold text-[0.65rem] text-green-800">
                                                                Attivo
                                                            </p>
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="flex flex-row space-x-1 w-full items-center">
                                                    <p className="font-bold text-[1.1rem] pb-4 pt-4">€{plan ? discountedMonthlyPrice : monthlyPrice}</p>
                                                    <p className="text-[0.46rem]"> {plan ? "/mese IVA inclusa" : "/mese IVA inclusa"}</p>
                                                </div>
                                                <p className="text-[0.65rem] pb-4 -mt-4">{ plan ? 'Fatturato annualmente' : ''}</p>
                                            </div>
                                        );
                                    })}

                                </div>
                                <p className="font-semibold">Caratteristiche</p>
                                {selectedCard && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-5 mt-2">
                                            {selectedCard.features?.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-1.5">
                                                    <HeroIcon
                                                        icon={feature.available ? CheckCircleIcon : XMarkIcon}
                                                        className={feature.available ? 'text-myColor-default' : 'text-red-500'}
                                                        size={{ width: 'w-5', height: 'h-5' }}
                                                    />
                                                    <p>{feature.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Button
                                buttonTextDesktop="Scegli e prosegui"
                                backgroundColor={backgroundButtonStyle}
                                textStyle={textButtonStyle}
                                colorCircularProgress="#4a58a7"
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full mt-4"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Modale di pagamento */}
            {showPaymentModal && (
                <motion.div
                    className="flex items-center justify-center p-4 fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                >
                    <Elements stripe={stripePromise}>
                        <UpgradePaymentModal
                            activePlan={`${abbonamento} - (${durataAbbonamento})`}
                            planName={`${item} - (${plan ? "Annuale" : "Mensile"})`}
                            amountToPay={price}
                            creditApplied={credito}
                            giorniUtilizzati={giorniTrascorsi}
                            onClose={() => setShowPaymentModal(false)}
                            userFirstName={userFirstName}
                            userLastName={userLastName}
                            userUid={userUid}
                            planDuration={plan}
                            onSuccess={() => {
                                setShowPaymentModal(false);
                                dispatch(setPlan(selectedCard.textLabel));
                                setAbbonamento(selectedCard.textLabel);
                                dispatch(
                                    showSnackbar({
                                        message: `Upgrade completato!`,
                                        type: 'success',
                                    })
                                );
                            }}
                        />
                    </Elements>
                </motion.div>
            )}



            <div className="md:mx-52 my-10 mt-4 sm:mt-20">
                <div className="flex flex-col space-y-5">
                        <HeaderPageArticle />
                    <>
                        <div className="relative w-full pr-3">
                            <Input
                                name="full_name"
                                type="text"
                                value={geminiPrompt}
                                onChange={(e) => setGeminiPrompt(e.target.value)}
                                placeholder="Di cosa vuoi parlare nel tuo articolo?"
                                className="w-full pr-16 px-4 py-3 rounded-2xl border"
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center pr-4">
                                <HeroIcon
                                    icon={SendRoundedIcon}
                                    size={{ width: 'w-6', height: 'h-6' }}
                                    iconColor={sendColor}
                                    isDisabled={disableSend}
                                    tooltipPosition="top"
                                    tooltipText={
                                        disableSend
                                            ? `Limite raggiunto per il piano ${abbonamento}`
                                            : 'Invia'
                                    }
                                    onClick={() => {
                                        if (!disableSend) handleGenerateWithGemini();
                                    }}
                                    className={disableSend ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                />
                            </div>
                        </div>
                    </>

                    <div className="flex flex-col lg:flex-row gap-8 pt-16 pr-3">
                        <div className="flex-1 space-y-5">
                            {showArticleContentSection && (
                                <>
                                    <div className="w-full flex justify-end mt-6">
                                        <div className="inline-flex w-max justify-end items-center space-x-2 mt-6 bg-white py-2.5 px-4 rounded-2xl">
                                            <HeroIcon
                                                icon={MessageRoundedIcon}
                                                size={{ width: 'w-6', height: 'h-6' }}
                                                iconColor={sendColor}
                                                isDisabled={disableSend}
                                                tooltipPosition="top"
                                                tooltipText="Chiedi all'IA"
                                                onClick={() => setChatGemini(true)}
                                                className="cursor-pointer"
                                            />
                                            <HeroIcon
                                                icon={DeleteRoundedIcon}
                                                size={{ width: 'w-6', height: 'h-6' }}
                                                iconColor="#4a58a7"
                                                tooltipPosition="top"
                                                tooltipText="Cancella articolo"
                                                onClick={resetArticle}
                                                className="cursor-pointer"
                                            />
                                            <HeroIcon
                                                icon={FileDownloadRoundedIcon}
                                                size={{ width: 'w-6', height: 'h-6' }}
                                                iconColor="#4a58a7"
                                                tooltipPosition="top"
                                                tooltipText="Esporta articolo"
                                                onClick={() => {
                                                    downloadArticle(articolo, handleShowSnackbar)
                                                    dispatch(showSnackbar({ message: "Articolo scaricato!", type: "success" }))
                                                }}
                                                className="cursor-pointer"
                                            />
                                            <HeroIcon
                                                icon={AutoAwesomeIcon}
                                                size={{ width: 'w-6', height: 'h-6' }}
                                                iconColor="#4a58a7"
                                                tooltipPosition="top"
                                                tooltipText="Analizza con IA"
                                                onClick={() => {
                                                    console.log("Ho cliccato Analizza IA...")
                                                    setAuditSEOLoading(true);
                                                    handleManualAudit()
                                                }}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <SeoDataForm/>
                                    <TitleAndSubtitle/>
                                    <LinkInterno />
                                    <IndiceArticolo />
                                    {paragrafi.map((paragrafo, index) => (
                                        <NewParagraph
                                            key={`${paragrafo.id}-${resetKey}`}
                                            index={index}
                                            onAdd={handleAddParagraph}
                                            remove={() => handleDeleteParagraph(index)}
                                            counterFlag={counterFlag}
                                        />
                                    ))}
                                    {currentAudit && (
                                        <div className="bg-white rounded-2xl p-4 ">
                                            <h6>Analisi SEO dettagliata</h6>
                                            <div className="flex flex-col">
                                                {currentAudit.strengths && currentAudit.strengths.length > 0 && (
                                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                                        <h6 className="text-md font-semibold text-gray-800 mb-3">Punti di forza</h6>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {currentAudit.strengths.map((strength, index) => (
                                                                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                                    {strength}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {currentAudit.weaknesses && currentAudit.weaknesses.length > 0 && (
                                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                                        <h6 className="text-md font-semibold text-gray-800 mb-3">Debolezze</h6>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {currentAudit.weaknesses.map((w, index) => ( // Ora puoi fare il .map in sicurezza
                                                                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                                    {w}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {currentAudit.seoSuggestions && currentAudit.seoSuggestions.length > 0 && (
                                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                                        <h6 className="text-md font-semibold text-gray-800 mb-3">Suggerimenti SEO</h6>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {currentAudit.seoSuggestions.map((suggestion, index) => (
                                                                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                                    {suggestion}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {currentAudit.actionableTips && currentAudit.actionableTips.length > 0 && (
                                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                                        <h6 className="text-md font-semibold text-gray-800 mb-3">Consigli</h6>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {currentAudit.actionableTips.map((action, index) => (
                                                                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                                                                    {action}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            {/*
                                            <pre>{JSON.stringify(currentAudit, null, 2)}</pre>
                                            */}
                                        </div>
                                    )}
                                    <div className="absolute right-0 top-[15%] ml-2 mr-5">
                                        <CardPerformanceArticle />
                                    </div>
                                    {/*
                            <div ref={seoDataFormRef}>
                                <PerformanceArticleSEO/>
                            </div>
                            */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
