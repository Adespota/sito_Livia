'use client';

import React, { useState } from 'react';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import { Button } from '@adespota/my-react-component';
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";



export default function UpgradePaymentModal({
                                                amountToPay,
                                                creditApplied,
                                                giorniUtilizzati,
                                                planName,
                                                activePlan,
                                                onClose,
                                                onSuccess,
                                                userFirstName,
                                                userLastName,
                                                userUid,
                                                planDuration,
                                            }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState();



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(undefined);

        // 1) crea un PaymentMethod dai dati inseriti
        const cardElement = elements.getElement(CardNumberElement);
        const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                // puoi aggiungere email/nome se li hai
            }
        });
        if (pmError) {
            setError(pmError.message);
            setLoading(false);
            return;
        }

        // 2) chiama la tua API upgradePlan
        try {
            const res = await fetch('/api/upgradePlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName:    userFirstName,
                    lastName:     userLastName,
                    userId:       userUid,
                    paymentMethodId: paymentMethod.id,
                    amount:       Math.round(amountToPay * 100),
                    planName,
                    planDuration: planDuration ? 'Annuale' : 'Mensile',
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upgrade fallito');
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
                <button
                    type="button"
                    className="text-gray-500 float-right"
                    onClick={onClose}
                >×</button>


                <div className="flex flex-col w-full">
                    <p className="font-semibold">Conferma pagamento</p>
                </div>

                <div className="flex flex-col w-full space-y-1 bg-gray-50 p-3 rounded-2xl">
                   <div className="flex flex-row w-full justify-between">
                       <p className="text-[0.8rem] pr-2">Piano attualmente attivo:</p>
                       <div className="px-1 rounded bg-green-300">
                           <p className="font-bold text-[0.65rem] text-green-800">
                               {activePlan}
                           </p>
                       </div>
                   </div>
                    <p className="text-[0.8rem] flex justify-between">Nuovo piano scelto: <strong className="text-[0.66rem]">{planName}</strong></p>
                    <p className="text-[0.8rem] flex justify-between">Prezzo nuovo piano: <strong className="text-[0.66rem]">€ {amountToPay}</strong></p>
                    <p className="text-[0.8rem] flex justify-between">Giorni di servizio utilizzati: <strong className="text-[0.66rem]">{giorniUtilizzati}</strong> </p>
                    <p className="text-[0.8rem] flex justify-between">Credito residuo: <strong className="text-[0.66rem]">+ € {creditApplied}</strong> </p>
                    <p className="text-[0.8rem] flex justify-between">Totale da pagare: <strong className="text-[0.66rem]">€ {(amountToPay - creditApplied).toFixed(2)}</strong></p>
                </div>

                <div className="flex flex-col w-full pt-4">
                    <p className="font-semibold">Dati di pagamento</p>
                    <p className="text-[0.8rem]">Inserisci i dati della tua carta</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border p-3 rounded">
                        <CardNumberElement options={{ placeholder: 'Numero carta' }} />
                    </div>
                    <div className="border p-3 rounded">
                        <CardExpiryElement options={{ placeholder: 'MM/AA' }} />
                    </div>
                    <div className="border p-3 rounded">
                        <CardCvcElement options={{ placeholder: 'CVC' }} />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" className="w-full">
                        <Button
                            buttonTextDesktop="Paga ora"
                            backgroundColor={backgroundButtonStyle}
                            textStyle={textButtonStyle}
                            colorCircularProgress="#4a58a7"
                            className="w-full mt-4"
                        />
                    </button>

                </form>
            </div>
        </div>
    );
}
