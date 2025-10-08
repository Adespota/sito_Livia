'use client';

import React, {useEffect, useState} from 'react';
import HeroIcon from "./HeroIcons";
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import {useDispatch, useSelector} from "react-redux";
import { firestore } from "@/app/firebase";
import {collection, doc, getDocs} from "firebase/firestore";
import {selectTotalPaymentProfit, setTotalPending, setTotalProfit} from "@/reducer/features/paymentSlice";
import {useCrud} from "@/services/crudServices";
import {useAuth} from "@/app/authContext";
import {useEmailNormalizer} from "@/hooks/useEmailNormalizer";




export default function DashboardCards({ isClient }) {
    const clients = useSelector((state) => state.dashboardInitial.clients);
    const profit = useSelector(selectTotalPaymentProfit);
    const clientCount = clients.length;
    const { readDocument } = useCrud();
    const dispatch = useDispatch();
    const user = useAuth();
    const { normalizeEmail } = useEmailNormalizer();
    const emailCurrentUser = normalizeEmail(user?.user?.email) || '';
    const userId = user?.user?.uid;
    const [articleCount, setArticleCount] = useState(0);


    const DashboardCard = ({ count, icon, text }) => (
        <div className="flex flex-col flex-grow rounded-xl bg-white px-5 py-5 justify-center items-center space-y-3 w-40">
            <p className="font-extrabold">{count}</p>
            <HeroIcon
                icon={icon}
                className="text-myColor-default"
                style={{ width: '40px', height: '40px', }}
            />
            <p className="text-sm text-center">{text}</p>
        </div>
    );




    useEffect(() => {
        const getArticlesCount = async () => {
            const articlesCollection = collection(firestore, 'articoliPubblicati','oscarprata_hotmail_it', 'articoli');
            const articlesSnapshot = await getDocs(articlesCollection);
            setArticleCount(articlesSnapshot.docs.length);
        };
        getArticlesCount();
    }, []);


    // Questo codice serve a fare la somma dei profitti leggendo dalle notifiche
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationsRef = collection(
                    firestore,
                    'notifications',
                    userId,
                    'notificationsPayment',
                    emailCurrentUser,
                    'notifiche'
                );

                const snapshot = await getDocs(notificationsRef);

                if (!snapshot.empty) {
                    let newTotalProfit = 0;
                    snapshot.forEach((doc) => {
                        const pagamento = doc.data();
                        if (pagamento.read === true) {
                            newTotalProfit += Number(pagamento.totale);
                        }
                    });

                    dispatch(setTotalProfit(newTotalProfit));
                } else {
                    console.warn('Nessun documento trovato');
                }
            } catch (error) {
                console.error('Errore durante il recupero delle notifiche:', error);
            }
        };

        fetchNotifications();
    }, [dispatch, userId, emailCurrentUser]);

    // Questo codice serve a fare la somma dei profitti leggendo dalle notifiche
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationsRef = collection(
                    firestore,
                    'notifications',
                    userId,
                    'notificationsPayment',
                    emailCurrentUser,
                    'notifiche'
                );

                const snapshot = await getDocs(notificationsRef);

                if (!snapshot.empty) {
                    let newTotalPending = 0;
                    snapshot.forEach((doc) => {
                        const pagamento = doc.data();
                        if (pagamento.read === false) {
                            newTotalPending += Number(pagamento.totale);
                        }
                    });
                    dispatch(setTotalPending(newTotalPending));
                } else {
                    console.warn('Nessun documento trovato');
                }
            } catch (error) {
                console.error('Errore durante il recupero delle notifiche:', error);
            }
        };

        fetchNotifications();
    }, [dispatch, userId, emailCurrentUser]);



    const dashboardCardsAdmin = [
        { count: articleCount.toString(), icon: ArticleRoundedIcon, text: <>Articoli <br /> pubblicati</> },
        { count: "\u20AC" + profit.toString(), icon: AccountBalanceWalletRoundedIcon, text: <>Totale <br /> entrate</> },
        { count: "145", icon: LocalHospitalRoundedIcon, text: <>Consulenze <br /> effettuate</> },
        { count: clientCount.toString(), icon: HealthAndSafetyRoundedIcon, text: <>Tutti i <br /> pazienti</> },
    ];

    const dashboardCardsClient = [
        { count: "0", icon: ArticleRoundedIcon, text: <>File <br /> inviati</> },
        { count: "\u20AC0", icon: AccountBalanceWalletRoundedIcon, text: <>Spese <br /> sostenute</> },
        { count: "0", icon: LocalHospitalRoundedIcon, text: <>Consulenze <br /> effettuate</> },
        { count: "0", icon: HealthAndSafetyRoundedIcon, text: <>I miei <br /> certificati</> },
    ];

    const dashboardCards = isClient ? dashboardCardsClient : dashboardCardsAdmin;

    return (
        <div className="flex space-x-3">
            {dashboardCards.map((data, index) => (
                <DashboardCard
                    key={index}
                    {...data}
                />
            ))}
        </div>
    );
}
