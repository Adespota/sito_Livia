"use client";

import React, {useEffect, useState} from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/app/components/Input";

import {addMessage, clearChat, setListChat} from "@/reducer/features/chatGeminiSlice";
import ReactMarkdown from "react-markdown";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import {TrashIcon} from "@heroicons/react/24/outline";
import {Avatar} from "@mui/material";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, textButtonStyle} from "@/styles/constants";

const suggestions = [
    "Aiutami con nuove idee per l'articolo",
    "Aiutami a correggere l'articolo",
    "Ho bisogno di una ricerca approfondita",
];

export default function BottomSheetGemini({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const listChat = useSelector((state) => state.chatGemini.listChat) || [];
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSuggestionClick = (text) => setInputValue(text);
    const handleInputChange = (e) => setInputValue(e.target.value);




    useEffect(() => {
        const saved = sessionStorage.getItem("chatGemini");
        if (saved) {
            dispatch(setListChat(JSON.parse(saved)));
        }
    }, []);


    if (!isOpen || typeof document === "undefined") return null;

    const handleGenerateChatGemini = async () => {
        const prompt = inputValue.trim();
        if (!prompt) return;

        // Invia messaggio Utente
        dispatch(addMessage({ text: prompt, sender: "UTENTE" }));

        setInputValue("");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/geminiChat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Errore generazione");

            // Aggiungi risposta IA
            dispatch(addMessage({ text: json.text, sender: "IA" }));

            // sincronizza in sessionStorage
            const chatStoraged = JSON.parse(
                sessionStorage.getItem("chatGemini") || "[]"
            );

            // aggiungi i due messaggi
            chatStoraged.push({ text: prompt, sender: "UTENTE" });
            chatStoraged.push({ text: json.text, sender: "IA" });

            // riscrivi in sessionStorage
            sessionStorage.setItem("chatGemini", JSON.stringify(chatStoraged));

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        dispatch(clearChat());
        setInputValue("");
        sessionStorage.removeItem("chatGemini");
    };

    return createPortal(
        <div className="fixed sm:w-2/3 w-96 bottom-0 left-0 right-0 z-50 bg-white shadow-2xl h-[58vh] flex flex-col sm:mx-20 mx-2 mb-5 rounded-2xl">
            {/* Header / Close */}
            <div className="flex justify-between items-center p-2">
                <button
                    onClick={onClose}
                    aria-label="Chiudi pannello"
                    className="text-gray-600 hover:text-gray-800 absolute right-2 top-0 mr-3 ml-4 mt-2 mb-3"
                >
                    ✕
                </button>
            </div>

            {/* Area chat */}
            <div className="flex-1 overflow-auto px-4 py-2 space-y-2">
                {listChat.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "IA" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[75%] p-3 rounded-2xl shadow ${
                            msg.sender === "IA"
                                ? "bg-blue-100 text-gray-900 mr-2"
                                : "bg-green-100 text-gray-900"
                        }`}>
                            {msg.sender === "IA" &&
                                <>
                                    <div className="flex flex-row space-x-2">
                                        <Avatar
                                            alt="IA"
                                            src="/static/images/avatar/1.jpg"
                                            sx={{ width: 24, height: 24 }}
                                        />
                                        <p className="font-bold">IA</p>
                                    </div>
                                    <p className="whitespace-pre-wrap pt-2"><ReactMarkdown>{msg.text}</ReactMarkdown></p>
                                </>
                            }
                            {msg.sender === "UTENTE" &&
                                <>
                                    <div className="flex flex-row space-x-2">
                                        <Avatar
                                            alt="IA"
                                            src="/static/images/avatar/1.jpg"
                                            sx={{ width: 24, height: 24 }}
                                        />
                                        <p className="font-bold">Utente</p>
                                    </div>
                                    <p className="whitespace-pre-wrap pt-2"><ReactMarkdown>{msg.text}</ReactMarkdown></p>
                                </>
                            }
                        </div>
                    </div>
                ))}
                {error && <p className="text-red-500 text-sm">Errore: {error}</p>}
            </div>

            {/* Controlli */}
            <div className="px-4 pt-4 pb-4 rounded-2xl space-y-3 mx-10 mb-4 mt-4 shadow">

                {/*
                <div className="flex flex-row space-x-2 overflow-x-auto ">
                    {suggestions.map((text, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(text)}
                            className="flex-shrink-0 rounded-lg px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <p className="font-semibold text-sm">{text}</p>
                        </button>
                    ))}
                </div>
                */}


                <Input
                    placeholder="Di cosa hai bisogno?"
                    multiline
                    rows={2}
                    value={inputValue}
                    onChange={handleInputChange}
                >
                    <Button
                        icon={<PaperAirplaneIcon />}
                        backgroundColor="bg-[#fcc71c] hover:bg-[#ffd700]"
                        iconColor="text-black"
                        tooltipText="Invia"
                        onClick={handleGenerateChatGemini}
                        disable={loading}
                    />
                    <Button
                        icon={<TrashIcon />}
                        backgroundColor={backgroundButtonStyle }
                        textStyle={textButtonStyle}
                        iconColor="text-black"
                        tooltipText="Elimina chat"
                        onClick={handleClear}
                        disable={loading}
                    />
                </Input>
            </div>
        </div>,
        document.body
    );
}
