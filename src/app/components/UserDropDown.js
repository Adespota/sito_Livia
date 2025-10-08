"use client";

import React, { useState } from "react";
import HeroIcon from "./HeroIcons";
import chevronDownIcon from "@heroicons/react/20/solid/esm/ChevronDownIcon";
import { useAuth } from "@/app/authContext";
import {useRouter} from "next/navigation";
import { auth, firestore } from "@/app/firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import {
    ArrowLeftStartOnRectangleIcon,
    Cog6ToothIcon,
    UserMinusIcon,
} from "@heroicons/react/24/outline";
import { Popover } from "@headlessui/react";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";


const OptionSettingUsers = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleItemClick = item => {
        if (item.href) {
            router.push(item.href);
        } else if (item.onClick) {
            item.onClick();
        }
    };


    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await auth.signOut();
            router.push("/");
        } catch (error) {
            console.error("An error occurred during logout:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Sei sicuro di voler eliminare il tuo account? Questa operazione è irreversibile."
        );
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) throw new Error("Utente non autenticato");
            await deleteDoc(doc(firestore, "users", firebaseUser.uid));
            await deleteUser(firebaseUser);
            router.push("/");
        } catch (error) {
            console.error("Errore eliminazione account:", error);
            alert("Impossibile eliminare l'account. Riprova più tardi.");
        } finally {
            setIsDeleting(false);
        }
    };

    const opzioniUtente = [
        {
            name: "Impostazioni",
            description: "Modifica le tue impostazioni utente",
            href: '/dashboardAdmin/settingUser',
            icon: Cog6ToothIcon,
        },
        {
            name: "Cancella account",
            description: "Elimina definitivamente il tuo account e tutti i dati associati",
            onClick: handleDeleteAccount,
            icon: UserMinusIcon,
        },
        {
            name: "Esci",
            description: "Abbandona la sessione attuale della tua dashboard",
            onClick: handleLogout,
            icon: ArrowLeftStartOnRectangleIcon,
        },
    ];

    return (
        <div className="w-screen max-w-md ml-3 flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
                {opzioniUtente.map((item, idx) => (
                    <div
                        key={idx}
                        className="group relative flex items-center gap-x-4 rounded-lg p-3 text-sm leading-6 hover:bg-gray-50"
                    >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <item.icon
                                className="h-6 w-6 text-gray-600 group-hover:text-myColor-default"
                                aria-hidden="true"
                            />
                        </div>
                        {(isLoggingOut && item.name === "Esci") || (isDeleting && item.name === "Cancella account") ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="flex-auto cursor-pointer" onClick={() => handleItemClick(item)}>
                                <p className="block font-semibold w-full">{item.name}</p>
                                <p className="mt-1 text-sm font-medium tracking-normal">{item.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function UserDropdown() {
    const { user } = useAuth();

    return (
        <Popover className="relative">
            <Popover.Button className="flex items-center">
                <p className="font-semibold ml-0.5 cursor-pointer text-nowrap">{user?.displayName || "Caricamento..."}</p>
                <HeroIcon
                    icon={chevronDownIcon}
                    className="text-myColor-greyDefault cursor-pointer ml-1"
                />
            </Popover.Button>

            <Popover.Panel className="absolute right-1 z-50 mt-5 flex w-screen max-w-max px-4">
                <OptionSettingUsers />
            </Popover.Panel>
        </Popover>
    );
}
