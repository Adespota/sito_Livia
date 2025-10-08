import {useEffect, useState} from "react";

export const useRecaptcha = () => {
    const clientKey = process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY;
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const loadRecaptcha = async () => {
        if (
            typeof window !== "undefined" &&
            typeof window.grecaptcha !== "undefined" &&
            typeof window.grecaptcha.execute === "function"
        ) {
            console.log("reCAPTCHA is ready, attempting to retrieve token...");
            const token = await window.grecaptcha.execute(clientKey, {
                action: "submit",
            });
            console.log("reCAPTCHA token obtained: ", token);
            setRecaptchaToken(token);
        } else {
            console.log("Recaptcha not yet ready. Check again in 1 second.");
            setTimeout(loadRecaptcha, 1000); // Try again after 1 second.
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.onerror = () => {
            console.error("Error loading recaptcha script");
        };
        script.src = `https://www.google.com/recaptcha/api.js?render=${clientKey}`;
        script.async = true;
        document.body.appendChild(script);
        script.addEventListener("load", loadRecaptcha);

        // Cleanup function
        return () => {
            document.body.removeChild(script);
            script.removeEventListener("load", loadRecaptcha);
        };
    }, []);

    const sendTokenToCloudService = async (token) => {
        if (!token) return;
        const response = await fetch('https://us-central1-psicologo-1361d.cloudfunctions.net/verifyRecaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
        });
        const result = await response.json();
        if (result.success) {
            console.log('Recaptcha verification passed:', result.message);
        } else {
            console.log('Recaptcha verification failed:', result.message);
        }
    };

    useEffect(() => {
        sendTokenToCloudService(recaptchaToken);
    }, [recaptchaToken]);

    return recaptchaToken;
};



