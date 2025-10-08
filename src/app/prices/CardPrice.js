'use client';

import Label from "@/app/components/Label";
import HeroIcon from "@/app/components/HeroIcons";
import {useDispatch} from "react-redux";
import { useRouter } from 'next/navigation'
import {addToCart} from "@/reducer/features/carrelloSlice";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";
import {CheckCircleIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useEffect, useState} from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {cards} from './CARDS_PRICES'






function Card({ card, isAnnual }) {
    const dispatch = useDispatch();
    const router = useRouter()
    const monthlyPrice = card.price;
    const priceMonthlyOfYear = monthlyPrice * 0.15;
    const priceMontlyOfYearEnd   = monthlyPrice - priceMonthlyOfYear;
    const annualPrice = (priceMontlyOfYearEnd).toFixed(2);


    return (
        <div className="relative p-3 rounded-2xl overflow-visible boxShadow_custom hover_boxShadow_custom">
            <div className="flex justify-start mb-2">
                <Label textLabel={card.textLabel}/>
            </div>
            <p className="text-sm pb-6">{card.description}</p>
            <h5 className="mb-4 text-[1.66rem]">
                <div className="flex flex-col">
                    <span className="text-gray-400 line-through text-[1.3rem]">€ {card.originalPrice}</span>
                    <div className="flex flex-row -mt-2">
                        <div className="flex flex-col">
                            <span className="mr-1">€ {isAnnual ? annualPrice : monthlyPrice}</span>
                            <span className="text-[0.60rem] -mt-3.5"> {isAnnual ? "Fatturati annualmente" : ""}</span>
                        </div>

                        <span className="text-[0.58rem]"> {isAnnual ? "/mese IVA inclusa" : "/mese IVA inclusa"}</span>
                    </div>
                </div>
            </h5>
            {card.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex flex-col">
                    <div key={featureIndex} className="inline-flex items-center mt-2 space-x-1.5">
                        <HeroIcon icon={feature.available ? CheckCircleIcon : XMarkIcon}
                            className={`${feature.available ? 'text-myColor-default' : 'text-red-500'}`}
                            size={{width:'w-5', height:'h-5'}}
                        />
                        <p className={`text-sm ${feature.available ? '' : 'line-through'}`}>{feature.name}</p>
                    </div>
                </div>
            ))}
            <div className="mt-6">
                <Button
                    buttonTextDesktop="Scegli e prosegui"
                    backgroundColor={backgroundButtonStyle }
                    textStyle={textButtonStyle}
                    colorCircularProgress="#4a58a7"
                    icon={<RocketLaunchIcon />}
                    iconColor="text-black"
                    widthFull
                    onClick={() => {
                        const item = card.textLabel;
                        const price = isAnnual ? annualPrice : monthlyPrice;
                        const planId = isAnnual ? card.planIdAnnual : card.planIdMonth;
                        dispatch(addToCart({item, price, planId}));
                        router.push('/cart');
                    }}
                />
            </div>
            <p className="flex items-center justify-center text-center pt-4 text-[0.65rem] leading-relaxed">
                Rimborso garantito entro 30 giorni.
            </p>
        </div>
    );
}




export default function CardPrice({
                                      isAnnual,
                                      containerClassName = 'grid sm:grid-cols-11 grid-cols-1 gap-6 sm:space-y-0 space-y-5 mt-4'
}) {
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        const host = window.location.hostname;
        setIsLocalhost(host === 'localhost' || host === '127.0.0.1');
    }, []);



    const visibleCards = cards.filter(card => {
        // rimuovi “Test” solo in produzione
        return !(card.textLabel === 'Test' && !isLocalhost);

    });

    return (
        <div className={containerClassName}>
            {visibleCards.map((card, index) => (
                <div
                    key={index}
                    className={`col-span-3 ${index === 0 ? 'sm:col-start-2 col-start-1' : ''}`}
                >
                    <Card card={card} isAnnual={isAnnual} />
                </div>
            ))}
        </div>
    );
}
