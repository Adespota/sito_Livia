// NavDashboard.js
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react"; // Aggiunto useMemo
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from 'next/navigation'; // <-- Importato per ottenere la rotta corrente
import { Collapse, List, Skeleton, } from "@mui/material";
import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import HeroIcon from "../HeroIcons";
import { commonIcons } from "../navDashboard/iconData";
import {links} from "@/app/components/navDashboard/links";


const MotionDiv = dynamic(() => import("framer-motion").then(mod => mod.motion.div), { ssr: false });


export default function NavDashboard({ className }) {
    const pathname = usePathname(); // <-- Ottieni il percorso URL corrente
    const linkRefs = useRef({});
    const cardRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [selectedLinkId, setSelectedLinkId] = useState(null); // Usato per l'apertura/chiusura del sottomenu
    const [showText, setShowText] = useState(true);
    const [isIconRotated, setIsIconRotated] = useState(false);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const { arrowMenuClose } = commonIcons;


    // ⭐️ CORREZIONE CHIAVE: Calcola l'ID attivo basandosi sull'URL corrente
    const selectedId = useMemo(() => {
        // Cerca il link principale o secondario il cui href corrisponde al pathname corrente
        for (const link of links) {
            if (link.href === pathname) {
                return link.id; // Trovato nel link principale
            }
            if (link.subLinks) {
                const subLinkMatch = link.subLinks.find(subLink => subLink.href === pathname);
                if (subLinkMatch) {
                    return subLinkMatch.id; // Trovato in un sottomenu
                }
            }
        }
        return null; // Nessun match
    }, [pathname]); // Ricalcola solo quando la rotta cambia


    // ⭐️ LOGICA AGGIUNTIVA: Apri il sottomenu se il link attivo è al suo interno
    useEffect(() => {
        const activeLink = links.find(link =>
            link.subLinks?.some(subLink => subLink.id === selectedId)
        );
        if (activeLink && selectedLinkId !== activeLink.id) {
            // Imposta l'ID del link principale per tenere il sottomenu aperto
            setSelectedLinkId(activeLink.id);
        }
    }, [selectedId, selectedLinkId]);


    const handleNestedLinkClick = (id) => {
        // Toggle l'apertura del sottomenu
        setSelectedLinkId(selectedLinkId === id ? null : id);

        // Logica per posizionare la card esterna (menu chiuso)
        if (linkRefs.current[id] && !showText) {
            const rect = linkRefs.current[id].getBoundingClientRect();
            setCardPosition({
                top: rect.top + window.scrollY,
                left: rect.left + rect.width + 10
            });
        }
    };

    const handleCloseMenu = () => {
        setShowText(!isMenuOpen);
        setIsMenuOpen(!isMenuOpen);
        setIsIconRotated(!isIconRotated);
        // Quando chiudi il menu, chiudi la card esterna, ma non il sottomenu interno
        if (!isMenuOpen) {
            setSelectedLinkId(null);
        }
    };


    // Evento di clic globale che permette di chiudere la card esterna
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target) && selectedLinkId && !showText) {
                // Chiudi solo la card esterna (quando showText è false)
                const isLinkRef = Object.values(linkRefs.current).some(ref => ref && ref.contains(event.target));
                if (!isLinkRef) {
                    setSelectedLinkId(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedLinkId, showText]);


    // Funzione helper per wrappare il contenuto con Link o Div
    const LinkWrapper = ({ link, children, ...props }) => {
        // ... (Logica del wrapper rimasta invariata)
        if (link.href) {
            return (
                <Link
                    href={link.href}
                    passHref
                    className="w-full"
                    {...props}
                >
                    {children}
                </Link>
            );
        }
        // Se il link ha 'subLinks' (è un menu), usa un div e gestisci il click
        if (link.subLinks) {
            return (
                <div
                    onClick={(e) => { e.stopPropagation(); handleNestedLinkClick(link.id); }}
                    {...props}
                >
                    {children}
                </div>
            );
        }
        return <div {...props}>{children}</div>;
    };


    return (
        <div className={className}>
            <div className="flex h-screen">
                <div className={`bg-[#115054] max-h-screen overflow-y-auto ${isMenuOpen ? "w-[16rem]" : "w-[4rem]"}`}>

                    {/* Pulsante di chiusura/apertura */}
                    <div className="flex w-9 items-center justify-center bg-[#007B82] rounded-[6px] py-1.5 mb-6 ml-3 mt-5 cursor-pointer" onClick={handleCloseMenu}>
                        <MotionDiv
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 1.1 }}
                            initial={{ rotate: isIconRotated ? 180 : 0 }}
                            animate={{ rotate: isIconRotated ? 180 : 0 }}
                        >
                            <HeroIcon
                                icon={arrowMenuClose}
                                size={{ width: "w-4", height: "w-4" }}
                                iconColor="white"
                                tooltipText={isIconRotated ? "Espandi menu" : "Riduci menu"}
                            />
                        </MotionDiv>
                    </div>

                    {/* Lista dei Link (Skeleton o Reale) */}
                    {links.length === 0 ? (
                        Array.from({ length: 12 }).map((_, index) => (
                            <div className="flex items-center ml-2 mr-5 px-2 py-2.5" key={index}>
                                <Skeleton variant="rounded" height={26} width={28} />
                                <Skeleton variant="rounded" height={135} width={135} className="ml-4" />
                            </div>
                        ))
                    ) : (
                        links.map((link) => (
                            <div
                                key={link.id}
                                ref={el => linkRefs.current[link.id] = el}
                                // Applica la classe di selezione se il link è quello attivo
                                className={`flex flex-col ${showText ? 'mx-2.5' : 'mx-2'} px-1 mt-1 rounded-lg cursor-pointer hover:bg-myColor-default
                                ${selectedId === link.id || link.subLinks?.some(s => s.id === selectedId) ? "bg-myColor-default text-white px-1.5" : ""}`}
                                tabIndex="0"
                            >
                                {/* USIAMO IL WRAPPER PER GESTIRE LINK O DIV */}
                                <LinkWrapper link={link}>
                                    <div className={`flex items-center px-1 py-1 ${isMenuOpen ? "justify-start" : "justify-center py-2 px-0.5"}`}>
                                        {link.icon && (
                                            <HeroIcon
                                                icon={link.icon}
                                                size={{ width: showText ? "w-[1.18rem]" : "w-[1.2rem]", height: showText ? "w-[1.18rem]" : "h-[1.2rem]"}}
                                                iconColor="white"
                                                className={`text-white ${showText ? "mr-3" : "mr-0"} text-gray-200 ${selectedId === link.id || link.subLinks?.some(s => s.id === selectedId) ? "text-white" : ""}`}
                                                tooltipText={link.text}
                                                tooltipPosition="right"
                                            />
                                        )}
                                        {showText && (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    <p className={`font-semibold text-[0.82rem] mr-4 text-gray-200 ${selectedId === link.id || link.subLinks?.some(s => s.id === selectedId) ? "text-white" : ""}`} style={{ whiteSpace: 'nowrap' }}>
                                                        {link.text}
                                                    </p>
                                                    {link.badge && (
                                                        <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-green-500 rounded">
                                                            {link.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Freccia per l'apertura/chiusura del sottomenu */}
                                                {link.subLinks && (
                                                    <div onClick={(e) => { e.stopPropagation(); handleNestedLinkClick(link.id); }}>
                                                        {selectedLinkId === link.id ? <ExpandLessRounded className="text-white" /> : <ExpandMoreRounded className="text-white" />}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </LinkWrapper>

                                {/* Sotto-Link (menu aperto) */}
                                {link.subLinks && (
                                    <Collapse in={selectedLinkId === link.id && showText} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {link.subLinks.map(subLink => (
                                                <Link href={subLink.href} key={subLink.id} passHref>
                                                    <div
                                                        className={`flex items-center ml-1.5 px-6 py-1 rounded-lg hover:bg-myColor-light/10`}
                                                        tabIndex="0"
                                                    >
                                                        <HeroIcon
                                                            icon={subLink.icon}
                                                            iconColor='white'
                                                            size={{ width: showText ? "w-[1.18rem]" : "w-[1.2rem]", height: showText ? "w-[1.18rem]" : "h-[1.2rem]"}}
                                                            className={`mr-3.5 ${selectedId === subLink.id ? "text-white" : ""}`}
                                                            tooltipText={subLink.text}
                                                        />
                                                        <p className={`font-semibold text-wrap text-[0.82rem] ${selectedId === subLink.id ? "text-white underline decoration-1" : "text-white"}`}>
                                                            {subLink.text}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </div>
                        ))
                    )}

                    {/* Card esterna per i sublinks (menu chiuso) */}
                    {!showText && selectedLinkId && (
                        <div
                            ref={cardRef}
                            className="absolute bg-white shadow-lg rounded-2xl p-3"
                            style={{
                                top: cardPosition.top,
                                left: cardPosition.left,
                                zIndex:9999,
                            }}
                        >
                            <List component="div" disablePadding>
                                {links.find(link => link.id === selectedLinkId)?.subLinks.map(subLink => (
                                    <Link href={subLink.href} key={subLink.id} passHref>
                                        <div
                                            className={`flex items-center ml-1.5 mt-1 px-6 py-2.5 rounded-lg hover:bg-gray-100 ${selectedId === subLink.id ? "rounded-lg focus:bg-gray-100" : ""}`}
                                            tabIndex="0"
                                        >
                                            <HeroIcon
                                                icon={subLink.icon}
                                                iconColor="text-[#3a4246]"
                                                size={{ width: "w-4", height: "h-4" }}
                                                className={`mr-3.5 ${selectedId === subLink.id ? "" : ""}`}
                                                tooltipText={subLink.text}
                                            />
                                            <p className="font-semibold text-wrap text-[0.82rem] cursor-pointer leading-tight">
                                                {subLink.text}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </List>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
