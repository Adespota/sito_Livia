'use client';

import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectInitialStateArticolo,
    selectValidazione,
    setInput,
    setInputPath,
    setLinkInterni,
    setSelectedNewCategory,
    updateIndice,
    verificaUnicitaSlug
} from "/src/reducer/features/articoloSlice";
import { get } from 'lodash';
import {firestore} from "@/app/firebase";
import {collection, getDocs, query, where} from "firebase/firestore";
import HeroIcon from "@/app/components/HeroIcons";
import checkIcon from "@heroicons/react/20/solid/esm/CheckIcon";
import XIcon from "@heroicons/react/20/solid/esm/XMarkIcon";
import MyTextField from "@/app/components/MyTextField";
import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle,} from '@headlessui/react'



const InputTextBlog = React.forwardRef(({
                                            placeholder,
                                            rows,
                                            field,
                                            showComponents,
                                            className,
                                            readOnly = false,
                                            disableUserInput = false,
                                            isValid,
                                            ...props
                                        }, ref) => {
    const dispatch = useDispatch();
    const inputRef = React.useRef(null); // Ref per accedere al campo di testo
    const [checkingSlug, setCheckingSlug] = useState(false);
    const articolo = useSelector(selectInitialStateArticolo);
    const slugUnico = articolo.slugUnico;
    const parolaChiaveValue = useSelector((state) => state.articolo.parolaChiave);
    let [isOpen, setIsOpen] = useState(false)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }




    const handleInputChange = (event) => {
        if (readOnly) {
            return;
        }
        if (disableUserInput || (!field.includes('parolaChiave') && !parolaChiaveValue)) {
            event.preventDefault();
            setIsOpen(true);
            return;
        }

        const { value, selectionStart } = event.target; // Salva la posizione del cursore

        // Converti la prima lettera in maiuscolo
        const updatedValue = value.charAt(0).toUpperCase() + value.slice(1);


        if (field.includes('titoloParagrafo')) {
            const index = field.match(/\[(\d+)]/)[1]; // Estrai l'indice dal campo
            dispatch(updateIndice({ titoloParagrafo: updatedValue, indiceParagrafo: parseInt(index) }));
        }
        if (field === "newCategory") {
            handleSelectNewCategory(updatedValue);
        } else if (field && field.includes('[') && field.includes(']')) {
            dispatch(setInputPath({ path: field, value: updatedValue }));
        } else {
            dispatch(setInput({ field, value: updatedValue }));
        }


        // Ripristina la posizione del cursore dopo l'aggiornamento dello stato
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.selectionStart = selectionStart;
                inputRef.current.selectionEnd = selectionStart;
            }
        }, 0);
    };

    const fieldValue = useSelector((state) => {
        if (field && field.includes('[') && field.includes(']')) {
            return get(state.articolo, field);
        }
        return state.articolo[field];
    });

    const handleSelectNewCategory = (value) => {
        dispatch(setSelectedNewCategory(value));
        console.log(`handleSelectNewCategory - Impostazione della categoria selezionata con valore: ${value}`);
    };




    return (
        <>
            <Dialog open={isOpen} as="div" className="relative z-50" onClose={close}>
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogBackdrop className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 backdrop-blur-sm" />
                        <DialogPanel
                            className="w-full mx-3 max-w-md rounded-xl z-50 bg-[rgb(233,236,236)]  p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-myColor-colorText">
                                Aggiungi la parola chiave!
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-myColor-colorText">
                                Ti chiediamo di aggiungere prima la parola chiave
                            </p>
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center justify-end gap-2 rounded-md bg-[#fcc71c] px-3 py-1.5 text-sm/6 font-semibold text-myColor-colorText shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={close}
                                >
                                    Ho capito!
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>


            <MyTextField
            label={placeholder}
            value={fieldValue || ''}
            className={className}
            onChange={handleInputChange}
            readOnly={readOnly}
            multiline
            rows={rows}
            size="small"
            inputRef={inputRef} // Associa il ref al campo di testo
            {...props}
                /*
            InputProps={{
                endAdornment: (
                    <>
                        {isValid !== undefined && (
                            (isValid && (field !== "slug" || slugUnico)) ? (
                                <HeroIcon
                                    icon={checkIcon}
                                    size={{width: 'w-4', height: 'h-4'}}
                                    className="bg-green-200 text-[#52b202] rounded-full p-0.5"
                                    tooltipText="Il valore inserito è corretto"
                                />
                            ) : (
                                <HeroIcon
                                    icon={XIcon}
                                    size={{width: 'w-4', height: 'h-4'}}
                                    className="bg-red-300 text-red-600 rounded-full p-0.5"
                                    tooltipText="Il valore inserito non è corretto."
                                />
                            )
                        )}
                        {showComponents && React.isValidElement(showComponents) ? showComponents : null}
                    </>
                ),
            }}
            */
            ref={ref}
        />
        </>
    );
});

InputTextBlog.displayName = 'InputTextBlog';

export default InputTextBlog;




