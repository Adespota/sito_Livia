
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectInitialStateArticolo,
    selectValidazione,
    setContaParoleTotale,
    setPunteggioSEO,
    validaTutto
} from "@/reducer/features/articoloSlice";
import {WarningAmber} from "@mui/icons-material";
import HeroIcon from "@/app/components/HeroIcons";
import checkIcon from "@heroicons/react/20/solid/esm/CheckIcon";
import XIcon from "@heroicons/react/20/solid/esm/XMarkIcon";
import {getAuth, signInAnonymously} from "firebase/auth";
import {auth, firestore} from "@/app/firebase";
import {doc, serverTimestamp, increment, updateDoc, getDoc, setDoc, onSnapshot} from "firebase/firestore";
import DialogEndFreeVersion from "@/app/components/DialogEndFreeVersion";
import SeoGauge from "@/app/components/SeoGauge";


const settings = {
    width: 200,
    height: 200,
};

export default function PerformanceArticleSEO({ value = 0, crescita }) {
    const dispatch = useDispatch();
    const articolo = useSelector(selectInitialStateArticolo);
    const validazione = useSelector(selectValidazione);
    const parolePerParagrafo = articolo.numeroParolePerParagrafo || 0;
    console.log("Parole per paragrafo", parolePerParagrafo);
    const numeroParoleTotateArticolo = articolo.numeroParoleTotali || 0;
    const [isProcessing, setIsProcessing] = useState(false);
    const hasRunRef = useRef(false);
    const uid = auth.currentUser?.uid;
    const [showDialog, setShowDialog] = useState(false);
    const user = auth.currentUser;




    const handleFreeTrial = async (e) => {
        setIsProcessing(true);
        const auth = getAuth();

        // Se l'utente non è già autenticato, esegui il login anonimo
        if (!auth.currentUser) {
            try {
                await signInAnonymously(auth);
            } catch (error) {
                setIsProcessing(false);
                return;
            }
        }

        // Una volta autenticato, crea o aggiorna il documento nella collection trialUsers
        const uid = auth.currentUser.uid;
        const userTrialRef = doc(firestore, "trialUsers", uid);
        const userTrialSnap = await getDoc(userTrialRef);

        if (!userTrialSnap.exists()) {
            // Se il documento non esiste, è il primo accesso: crealo
            await setDoc(userTrialRef, {
                trialStart: serverTimestamp(),
                usageCount: 0
            });
        }
    };



    useEffect(() => {
        if (!hasRunRef.current) {
            handleFreeTrial();
            hasRunRef.current = true;
        }
    }, []);


    const ensureTrialDocumentExists = async (uid) => {
        const trialRef = doc(firestore, "trialUsers", uid);
        const docSnap = await getDoc(trialRef);
        if (!docSnap.exists()) {
            // Crea il documento con usageCount iniziale a 0
            await setDoc(trialRef, {
                usageCount: 0,
                trialStart: serverTimestamp(),
                lastUsed: serverTimestamp(),
            });
            console.log("Documento trial creato per l’utente:", uid);
        }
        return trialRef;
    };


    const trackUsage = async () => {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (uid) {
            // Assicurati che il documento esista
            const trialRef = await ensureTrialDocumentExists(uid);
            try {
                await updateDoc(trialRef, {
                    usageCount: increment(1),
                    lastUsed: serverTimestamp(),
                });
                console.log("Contatore aggiornato per l’utente:", uid);
            } catch (error) {
                console.error("Errore aggiornando il contatore del trial:", error);
            }
        }
    };


    useEffect(() => {
        if (!uid) return;
        const trialRef = doc(firestore, "trialUsers", uid);
        const unsubscribe = onSnapshot(trialRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Usage count aggiornato:", data.usageCount);
                if (data.usageCount >= 10000) {
                   setShowDialog(true);
                }
            }
        });
        return () => unsubscribe();
    }, [uid]);




    useEffect(() => {
        dispatch(validaTutto());
        dispatch(setContaParoleTotale());
    }, [
        dispatch,
        articolo.titolo,
        articolo.sottotitolo,
        articolo.paragrafi,
        articolo.paragrafi.titoloParagrafo,
        articolo.paragrafi.contenuto,
        articolo.parolaChiave,
        articolo.titoloSeo,
        articolo.metaDescription,
        articolo.slug,
        articolo.slugUnico,
        validazione.linkInterniValido,
        validazione.linkEsterniValido,
        parolePerParagrafo,
    ]);



    const calcolaPunteggioSEO = () => {
        let crescita = 0;

        // Verifica se la parola chiave è stata aggiunta
        if(validazione.parolaChiaveValida) crescita += 5;
        if(validazione.titoloSeoValido) crescita += 5;
        if(validazione.sottotitoloValido) crescita += 5;
        if(validazione.titoliParagrafiValidi) crescita += 15;
        if(validazione.parolaChiavePrimoParagrafoValida) crescita += 10;
        if(validazione.metaDescriptionValida) crescita += 5;
        if(validazione.slugValido) crescita += 5;
        if(validazione.titoloValido) crescita += 5;
        if(validazione.lunghezzaArticoloValida) crescita += 15;
        for(let index in parolePerParagrafo) {
            let paroleCorrenti = parolePerParagrafo[index];
            // Incrementa la crescita se il numero di parole è maggiore di zero e minore o uguale a 200
            if(paroleCorrenti > 0 && paroleCorrenti <= 200) {
                crescita += 0.5;
            }
        }
        if (Array.isArray(validazione.frasiValide)) {
            validazione.frasiValide.forEach((isValid, index) => {
                if (isValid) {
                    crescita += 1.5;
                    console.log(`Frasi valide nel paragrafo ${index + 1}: crescita incrementata.`);
                } else {
                    console.log(`Frasi non valide nel paragrafo ${index + 1}: crescita non incrementata.`);
                }
            });
        }
        if(Array.isArray(validazione.frasiValideCongiunzioniPronomi)) {
            validazione.frasiValide.forEach((isValid, index) => {
                if (isValid) {
                    crescita += 5.5;
                    console.log(`Congiunzioni e pronomi sufficientemente presenti nel paragrafo ${index + 1}: crescita incrementata.`);
                } else {
                    console.log(`Congiunzioni e pronomi poco presenti nel paragrafo  ${index + 1}: crescita non incrementata.`);
                }
            });
        }
        if(validazione.linkInterniValido) crescita += 5;
        if(validazione.linkEsterniValido) crescita += 5;

        // Limite massimo se manca uno dei due link
        const entrambiLinkPresenti = validazione.linkInterniValido && validazione.linkEsterniValido;
        if(!entrambiLinkPresenti) {
            crescita = Math.min(crescita, 80);
        }
        // Limite massimo se manca o è errata la parola chiave, il tiolo SEO, lo slug, la metadescription
        const tuttiDatiSEOCorretti = validazione.parolaChiaveValida && validazione.titoloSeoValido && validazione.slugValido && validazione.metaDescriptionValida;
        if(!tuttiDatiSEOCorretti) {
            crescita = Math.min(crescita, 93);
        }
        // Limite massimo se la lunghezza totale dell'articolo è errata
        if(!validazione.lunghezzaArticoloValida) {
            crescita = Math.min(crescita, 96);
        }
        // Limite massimo se i titolo paragrafi non errati
        if(!validazione.titoliParagrafiValidi) {
            crescita = Math.min(crescita, 98);
        }
        dispatch(setPunteggioSEO(Math.min(100, crescita)));
        return Math.min(100, crescita); // Assicura che il punteggio massimo sia 100%
    };



    // Calcola il punteggio SEO
    const punteggioSEO = React.useMemo(() => calcolaPunteggioSEO(articolo), [
        validazione.parolaChiaveValida,
        validazione.titoloSeoValido,
        validazione.metaDescriptionValida,
        validazione.slugValido,
        validazione.titoloValido,
        validazione.sottotitoloValido,
        validazione.titoliParagrafiValidi,
        validazione.lunghezzaArticoloValida,
        validazione.parolaChiavePrimoParagrafoValida,
        validazione.frasiValide,
        validazione.frasiValideCongiunzioniPronomi,
        validazione.linkInterniValido,
        validazione.linkEsterniValido,
    ]);

    useEffect(() => {
        console.log("punteggioSEO cambiato a:", punteggioSEO);
        trackUsage();
    }, [punteggioSEO]);



    // Funzione per determinare il colore dinamico
    const getColor = (value) => {
        if (value >= 70) return "#52b202";
        if (value >= 50) return "#f7c600";
        return "#d32f2f";
    };


    return (
        <>
            {/* renderizzo la modale solo se l’utente è anonimo e showDialog=true */}
            {user?.isAnonymous && showDialog && (
                <DialogEndFreeVersion open onClose={() => setShowDialog(false)} />
            )}
            <div className="space-x-3">
                <div className="rounded-2xl bg-white px-5 py-5 space-y-5">
                    <div className="grid grid-cols-8 gap-4 w-full">
                        <p className="hidden md:flex col-span-2 font-semibold text-[0.95rem]">
                            Valutazione SEO <br className="hidden md:block" /> per l&apos;articolo
                        </p>
                        <p className="col-span-8 font-semibold text-[0.95rem] md:hidden">
                            Valutazione SEO per l&apos;articolo
                        </p>
                        <div className="flex flex-col md:col-start-3 md:col-span-7 col-span-8 flex-grow space-y-1.5 md:mt-5 mt-0">
                            <p className="font-semibold text-[0.95rem] mt-6">1) Ottimizzazione titoli paragrafi</p>
                            <div className="border border-gray-100 p-2.5 rounded-2xl">
                                <p className="text-[0.7rem]">
                                    Inserisci la parola chiave in maniera uniforme nei titoli paragrafi. La percentuale
                                    ottimale di presenza della parola chiave nei titoli paragrafi è del 37,5% Ad esempio se ci sono 5 titoli paragrafi, almeno 2 devono
                                    contenere la parola chiave.
                                </p>
                                {validazione.titoliParagrafiValidi ? (
                                    <div className="flex flex-row items-center space-x-2">
                                        <HeroIcon
                                            icon={checkIcon}
                                            size={{width: 'w-4', height: 'h-4'}}
                                            className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                        />
                                        <p className="text-green-500 text-[0.7rem]">
                                            La parola chiave è presente un numero di volte sufficiente
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-row pt-3 items-center space-x-2">
                                        <HeroIcon
                                            icon={XIcon}
                                            size={{width: 'w-4', height: 'h-4'}}
                                            className="bg-red-300 text-red-600 rounded-full p-0.5"
                                        />
                                        <p className="text-red-500 text-[0.7rem]">
                                            La parola chiave non è sufficientemente presente nei titoli paragrafi. Ti
                                            consigliamo di aggiungerla a più titoli paragrafi
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <p className="font-bold text-[0.95rem] md:mt-10 mt-6">2) SEO on-page sui contenuti</p>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Ogni paragrafo deve contenere massimo 150 parole.
                                        In casi eccezionali, può arrivare a 200 parole.
                                    </p>
                                    <div>
                                        {parolePerParagrafo && Object.keys(parolePerParagrafo).length > 0 ? (
                                            Object.keys(parolePerParagrafo).map((key, index) => {
                                                // Estrai il numero di parole per il paragrafo corrente usando la chiave
                                                const numeroParole = parolePerParagrafo[key];

                                                return (
                                                    <div key={key}>
                                                        {numeroParole === 0 ? (
                                                            <div className="flex flex-row items-center space-x-2">
                                                                <WarningAmber style={{color: 'orange'}}/>
                                                                <p className="text-[0.7rem]">Paragrafo {index + 1}: Devi
                                                                    aggiungere del testo</p>
                                                            </div>
                                                        ) : numeroParole <= 200 ? (
                                                            <div className="flex flex-row items-center space-x-2">
                                                                <HeroIcon
                                                                    icon={checkIcon}
                                                                    size={{width: 'w-4', height: 'h-4'}}
                                                                    className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                                                />
                                                                <p className="text-green-500 text-[0.7rem]">Paragrafo {index + 1}:
                                                                    È corretto</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-row items-center space-x-2">
                                                                <HeroIcon
                                                                    icon={XIcon}
                                                                    size={{width: 'w-4', height: 'h-4'}}
                                                                    className="bg-red-300 text-red-600 rounded-full p-0.5"
                                                                />
                                                                <p className="text-red-500 text-[0.7rem]">Paragrafo {index + 1}:
                                                                    Non è corretto</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-[0.7rem]">Devi aggiungere del testo ai paragrafi.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        La parola chiave deve apparire nella primissima frase del paragrafo
                                        introduttivo.
                                    </p>
                                    {validazione.parolaChiavePrimoParagrafoValida ? (
                                        <div className="flex flex-row items-center space-x-2">
                                            <HeroIcon
                                                icon={checkIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                            />
                                            <p className="text-green-500 text-[0.7rem]">
                                                La parola chiave appare nella primissima frase de primo paragrafo
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={XIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-red-300 text-red-600 rounded-full p-0.5"
                                            />
                                            <p className="text-red-500 text-[0.7rem]">
                                                La parola chiave non è presente nella primissima frase del primo
                                                paragrafo
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Inserire almeno 1 link esterno (a fonti autorevoli e pertinenti) per
                                        migliorare la credibilità e il valore informativo del contenuto.
                                    </p>
                                    {validazione.linkEsterniValido ? (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={checkIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                            />
                                            <p className="text-green-500 text-[0.7rem]">Hai aggiunto correttamente
                                                almeno un link esterno</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={XIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-red-300 text-red-600 rounded-full p-0.5"
                                            />
                                            <p className="text-red-500 text-[0.7rem]">Non hai aggiunto nessun link
                                                esterno nei paragrafi</p>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Inserire almeno 1 link interno al sito per favorire la navigazione e migliorare
                                        la struttura del linking
                                    </p>
                                    {validazione.linkInterniValido ? (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={checkIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                            />
                                            <p className="text-green-500 text-[0.7rem]">Hai aggiunto correttamente
                                                almeno un link interno </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={XIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-red-300 text-red-600 rounded-full p-0.5"
                                            />
                                            <p className="text-red-500 text-[0.7rem]">Non hai aggiunto nessun link
                                                interno nei paragrafi
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Le frasi devono essere concise, massimo 20 parole per frase, per
                                        migliorare la leggibilità.
                                    </p>
                                    {validazione.frasiValide.map((isValid, index) => (
                                        <div key={index} className="flex flex-row items-center space-x-2">
                                            {isValid ? (
                                                <HeroIcon
                                                    icon={checkIcon}
                                                    size={{width: 'w-4', height: 'h-4'}}
                                                    className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                                />
                                            ) : (
                                                <HeroIcon
                                                    icon={XIcon}
                                                    size={{width: 'w-4', height: 'h-4'}}
                                                    className="bg-red-300 text-red-600 rounded-full p-0.5"
                                                />
                                            )}
                                            <p className={isValid ? 'text-green-500 text-[0.7rem]' : 'text-red-500 text-[0.7rem]'}>
                                                {isValid
                                                    ? `Paragrafo ${index === 0 ? 1 : index + 1}: Le frasi del paragrafo sono concise`
                                                    : `Paragrafo ${index === 0 ? 1 : index + 1}: Le frasi del paragrafo non sono concise`}

                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Il testo complessivo dell&apos;articolo deve essere di almeno 1000 parole per
                                        garantire approfondimento e valore per l’utente.
                                    </p>
                                    <p className="text-[0.7rem]">La lunghezza complessiva è
                                        di: {numeroParoleTotateArticolo} parole</p>
                                    {validazione.lunghezzaArticoloValida ? (
                                        <div className="flex flex-row items-center space-x-2">
                                            <HeroIcon
                                                icon={checkIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                            />
                                            <p className="text-green-500 text-[0.7rem]">
                                                La lunghezza del tuo articolo contiene almeno 1000 parole
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row pt-3 items-center space-x-2">
                                            <HeroIcon
                                                icon={XIcon}
                                                size={{width: 'w-4', height: 'h-4'}}
                                                className="bg-red-300 text-red-600 rounded-full p-0.5"
                                            />
                                            <p className="text-red-500 text-[0.7rem]">
                                                Il tuo articolo contiene meno di mille parole. Ti consigliamo di
                                                aggiungerne altre.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-gray-100 p-3 rounded-2xl">
                                    <p className="text-[0.7rem]">
                                        Utilizzare congiunzioni e pronomi ad esempio,
                                        “Perché”, “Che”, “Ma”, “Poiché” per mantenere un linguaggio fluido e naturale.
                                    </p>
                                    {validazione.frasiValideCongiunzioniPronomi.map((isValid, index) => (
                                        <div key={index} className="flex flex-row items-center space-x-2">
                                            {isValid ? (
                                                <HeroIcon
                                                    icon={checkIcon}
                                                    size={{width: 'w-4', height: 'h-4'}}
                                                    className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                                />
                                            ) : (
                                                <HeroIcon
                                                    icon={XIcon}
                                                    size={{width: 'w-4', height: 'h-4'}}
                                                    className="bg-red-300 text-red-600 rounded-full p-0.5"
                                                />
                                            )}
                                            <p className={isValid ? 'text-green-500 text-[0.7rem]' : 'text-red-500 text-[0.7rem]'}>
                                                {isValid
                                                    ? `Paragrafo ${index === 0 ? 1 : index + 1}: Contiene sufficienti pronomi e congiunzioni`
                                                    : `Paragrafo ${index === 0 ? 1 : index + 1}: Non contiene sufficienti pronomi e congiunzioni`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SeoGauge
                    punteggioSEO={punteggioSEO}
                    settings={settings}
                    getColor={getColor}
                />
            </div>
        </>
    );
}
