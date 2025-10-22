import React from "react";
import { FormLogin, LeftColumnLogin } from '../componentsClient/componentsClient';




export const metadata = {
    title: '',
    description: '',
    author: '',
    keywords: '',
    openGraph: {
        title: '',
        description: '',
        canonical: '',
        type: 'website',
        site_name: '',
        images: [
            {
                url: '',
                alt: ''

            },
        ],
    },
    canonical: '',
}





export default function LoginPage() {
    return (
        <>
            <div className="flex h-screen">
                <LeftColumnLogin />
                <FormLogin />
            </div>
        </>
    );
}
