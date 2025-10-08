'use client';

import React from "react";
import HeroIcon from "../components/HeroIcons";
import arrowSmallLeftIcon from "@heroicons/react/20/solid/esm/ArrowSmallLeftIcon";
import Link from "next/link";



export default function LeftColumnLogin() {
    return (
        <div className="w-3/5 bg-myColor-default relative overflow-hidden hidden md:block">
            <div className="text-left flex h-full items-center">
                <div className="w-2/3 space-y-5 mx-auto">
                    <h3 className="text-myColor-colorTextOnDefaultColor">
                        Accedi e Rivoluziona la Tua Strategia SEO!
                    </h3>
                    <p className="text-myColor-colorTextOnDefaultColor">
                        Effettua il login per entrare nella tua dashboard esclusiva: scopri come utilizzare SEOmatrix per i tuoi articoli
                    </p>

                    <div className="flex items-center">
                        <span aria-hidden="true" className="inline-block align-middle">
                            <HeroIcon
                                icon={arrowSmallLeftIcon}
                                className="text-myColor-colorTextOnDefaultColor" />
                        </span>
                        <Link href="/" className="block text-lg font-semibold leading-6 text-myColor-colorTextOnDefaultColor">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
