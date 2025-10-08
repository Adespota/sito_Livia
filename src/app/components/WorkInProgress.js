'use client'
import Image from "next/image";
import React from "react";
import NavBar from "@/app/components/navBar/NavBar";
import Button from "@/app/components/Button";
import Footer from "@/app/components/Footer";



export default function WorkInProgress() {
    return(
        <>
            <NavBar />
            <div className="mt-16">
                <div className="w-full flex-col justify-center items-center flex">
                    <Image
                        src={'/workInProgress.svg'}
                        alt=""
                        width={550}
                        height={550}
                        className="borderRadius_style"
                        quality={90}
                    />
                    <p className="mt-5 text-center">La pagina sarà disponibile a breve</p>
                    <div className="mt-3 mb-20">
                        <Button
                            buttonTextDesktop="Ritorna alla home"
                            linkTo="/"
                        />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
