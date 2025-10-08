'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Popover } from '@headlessui/react';

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from 'firebase/firestore';
import { auth, firestore } from '@/app/firebase';
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";
import {usePathname} from "next/navigation";

// Componente per il singolo messaggio
function MessageBubble({ text, responseText, isMe }) {
    const messageContent = text || responseText;
    return (
        <div
            className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                isMe ? 'self-end bg-blue-100 text-right' : 'self-start bg-gray-200 text-left'
            }`}
        >
            {messageContent}
        </div>
    );
}

export default function Chat() {
    const [user, setUser]         = useState(null);
    const [loading, setLoading]   = useState(true);
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const dummy = useRef();
    const pathname = usePathname();


    // 1) Login anonimo e listener auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                setLoading(false);
            } else {
                signInAnonymously(auth).catch(console.error);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2) Solo dopo che user è settato, sottoscriviti ai messaggi
    useEffect(() => {
        if (!user) return;

        const roomId = user.uid;
        const q = query(
            collection(firestore, 'rooms', roomId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribeSnapshot = onSnapshot(
            q,
            (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(msgs);
                setLoading(false);
                dummy.current?.scrollIntoView({ behavior: 'smooth' });
            },
            (err) => {
                console.error('Snapshot error:', err);
            }
        );

        return () => unsubscribeSnapshot();
    }, [user]);

    // 3) sendMessage usa sempre user.uid, mai auth.currentUser.uid diretto
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user) return;

        const text = formValue.trim();
        if (!text) return;

        try {
            await addDoc(
                collection(firestore, 'rooms', user.uid, 'messages'),
                {
                    text,
                    createdAt: serverTimestamp(),
                    uid: user.uid
                }
            );
            setFormValue('');
        } catch (err) {
            console.error('Send error:', err);
        }
    };

    // 4) finché loading=true non mostriamo nulla
    if (loading) return null;

    const hiddenRoutes = ['/dashboardAdmin/nuovoArticolo', '/dashboardAdmin', '/documentation/nuove-metriche-e-kpi-da-analizzare-nell-era-dell-ia'];
    if (hiddenRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
        return null;
    }

    return (
        <Popover className="relative">
            {/* Trigger Button */}
            <Popover.Button
                className="fixed bottom-12 right-4 bg-myColor-default text-white p-3 rounded-full shadow-lg focus:outline-none z-50"
                aria-label="Apri chat"
            >
                {/* Icona chat */}
                {/*
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12c0 1.73.56 3.33 1.52 4.64L3 21l4.36-1.52A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z"
                    />
                </svg>
                */}
                <p className="text-white font-semibold">Live chat</p>
            </Popover.Button>

            {/* Popover Panel */}
            <Popover.Panel className="fixed bottom-28 right-4 w-[21rem] h-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold">Supporto</h2>
                    <Popover.Button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Chiudi chat"
                    >
                        ×
                    </Popover.Button>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white flex flex-col">
                    {loading && (
                        <p className="text-center text-gray-500">Caricamento...</p>
                    )}
                    {!loading &&
                        messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                text={msg.text}
                                responseText={msg.responseText}
                                isMe={msg.uid === user.uid}
                            />
                        ))}
                    <div ref={dummy} />
                </div>

                {/* Input form */}
                <form
                    className="flex w-full px-1.5 py-2 border-t border-gray-200 bg-white"
                    onSubmit={sendMessage}
                >
                    <input
                        type="text"
                        value={formValue}
                        onChange={e => setFormValue(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 m-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
                    />
                    <Button
                        buttonTextDesktop="Invia"
                        backgroundColor={backgroundButtonStyle }
                        textStyle={textButtonStyle}
                        colorCircularProgress="#4a58a7"
                        className="m-1"
                        onClick={sendMessage}
                    />
                </form>
            </Popover.Panel>
        </Popover>
    );
}
