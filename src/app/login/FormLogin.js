'use client';

import React, { useEffect } from 'react';
import Input from '../components/Input';
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectEmail,
    selectEmailError,
    selectPassword,
    selectPasswordError,
    togglePasswordVisibility,
    setEmailValidation,
    selectPasswordVisible,
    setPasswordValidation,
} from "/src/reducer/features/loginSlice";
import {
    openLoginModal,
    selectModalTypeLogin,
    selectShowLoginModal,
} from "/src/reducer/features/ModalSlice";
import { login } from "./functionLogin";
import { useRouter } from "next/navigation";
import ModalFailureLogin from "./ModalFailureLogin";
import {useRecaptcha} from "@/hooks/useRecaptcha";
import Link from "next/link";
import {Button, HeroIcons} from "@adespota/my-react-component";
import {backgroundButtonStyle} from "@/styles/constants";



const inputFields = [
    { label: 'Email', withIcon: false },
    { label: 'Password', withIcon: true },
];

const InputField = ({ label, withIcon, value, onChange, error, passwordVisible, togglePasswordVisibility }) => (
    <div className="relative mb-2">
        <Input
            placeholder={label}
            className={withIcon ? 'with-icon' : ''}
            type={label.includes('Password') && !passwordVisible ? 'password' : 'text'}
            value={value}
            onChange={(event) => onChange(label, event.target.value)}
            autoComplete={label === 'Email' ? "username" : (label === 'Password' ? "current-password" : undefined)}
        />
        {label === 'Email' && error && (
            <div className="text-red-500 text-sm font-semibold">
                {error}
            </div>
        )}
        {label === 'Password' && (
            <div className="absolute inset-y-0 right-0 items-center pr-2 pt-3 cursor-pointer">
                {withIcon ? (
                    <div onClick={togglePasswordVisibility}>
                        {passwordVisible ? <HeroIcons icon={Eye} /> : <HeroIcons icon={EyeOff} />}
                    </div>
                ) : null}
            </div>
        )}
        {label === 'Password' && error && (
            <div className="text-red-500 text-sm font-semibold">
                {error}
            </div>
        )}
        {label === 'Password' && (
            <div className="space-y-4 pt-4 font-semibold flex flex-col text-right cursor-pointer">
                <Link
                    href="/"
                    className="font-semibold text-lg">
                    Hai dimenticato la password?
                </Link>
            </div>
        )}
    </div>
);



export default function FormLogin() {
    const dispatch = useDispatch();
    const router = useRouter();
    const selectedEmail = useSelector(selectEmail);
    const emailError = useSelector(selectEmailError);
    const selectedPassword = useSelector(selectPassword);
    const passwordError = useSelector(selectPasswordError);
    const passwordVisible = useSelector(selectPasswordVisible);
    const showComponent = useSelector(selectShowLoginModal);
    const modalType = useSelector(selectModalTypeLogin);
    //const recaptchaPassed = useRecaptcha();
    const MODAL_TYPE_FAILURE = 'failure';



    const getFieldValue = (label) => {
        switch (label) {
            case 'Email':
                return selectedEmail.value;
            case 'Password':
                return selectedPassword.value;
            default:
                return '';
        }
    };

    const handleFieldChange = (label, value) => {
        switch (label) {
            case 'Email':
                dispatch(setEmailValidation({ value }));
                break;
            case 'Password':
                dispatch(setPasswordValidation({ value }));
                break;
            default:
                break;
        }
    };

    const handleLogin = async () => {
        try {
            {/*
            if (!recaptchaPassed) {
                console.log("Failed reCAPTCHA check");
                return;
            }
            */}
            const userCredential = await login(selectedEmail, selectedPassword);
            const { user } = userCredential;
            if (user) {
                router.push("/dashboardAdmin");
            }
        } catch (error) {
            if (!selectedEmail.value || !selectedPassword.value || emailError || passwordError) {
                dispatch(openLoginModal({ modalTypeLogin: MODAL_TYPE_FAILURE }));
            }
        }
    };

    return (
        <>
            {showComponent && modalType === "failure" && <ModalFailureLogin />}
            <form className="flex-1 px-10 sm:px-20 space-y-2 sm:mt-32 mt-28">
                <h3 className="mb-14">Accedi al tuo account</h3>
                {inputFields.map(({ label, withIcon }, index) => (
                    <InputField
                        key={index}
                        label={label}
                        withIcon={withIcon}
                        value={getFieldValue(label)}
                        onChange={handleFieldChange}
                        error={label === 'Email' ? emailError : (label === 'Password' ? passwordError : '')}
                        passwordVisible={passwordVisible}
                        togglePasswordVisibility={() => dispatch(togglePasswordVisibility())}
                    />
                ))}
                <div className="w-full pt-10">
                    <Button
                        buttonTextDesktop="Login"
                        backgroundColor={backgroundButtonStyle }
                        colorCircularProgress="#4a58a7"
                        onClick={handleLogin}
                        widthFull
                    />
                </div>
            </form>
        </>
    );
}
