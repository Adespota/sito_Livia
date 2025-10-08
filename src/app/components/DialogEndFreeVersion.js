import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

import { CheckIcon } from "@heroicons/react/20/solid";
import {addParagraph, deleteAllParagraphs, resetAll, triggerResetKey} from "@/reducer/features/articoloSlice";
import {Button} from "@adespota/my-react-component";
import {backgroundButtonStyle, buttonStyle, textButtonStyle} from "@/styles/constants";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogEndFreeVersion({ open, onClose }) {
    const features = [
        {
            title: "Valutazioni senza limiti",
            description: "Amplia i tuoi limiti e scrivi articoli ottimizzati per la SEO senza limiti",
            iconSize: "w-8 h-8"
        },
        {
            title: "Modifiche illimitate",
            description: "Potrai modificare il tuo articolo senza limiti.",
            iconSize: "w-8 h-8"
        },
        {
            title: "Supporto Dedicato",
            description: "Ricevi assistenza personalizzata e consigli da esperti del settore.",
            iconSize: "w-8 h-8"
        },
    ];

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
                sx: {
                    width: '90%',      // larghezza del dialog
                    maxWidth: '800px',  // larghezza massima
                    height: '500px',    // altezza desiderata del dialog
                    borderRadius: '12px',
                    margin: '3px',
                }
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <button
                    onClick={() => onClose()}
                    className="absolute top-0 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
                >
                    &times;
                </button>
                <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    {/* Colonna colorata: visibile solo su schermi medi e superiori */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' }, // non visibile su mobile (xs)
                            width: { md: '35%' },
                            backgroundColor: '#4a58a7',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* Eventuali contenuti per la colonna colorata */}
                    </Box>

                    {/* Colonna destra: testi e pulsante */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '65%' },
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <div className="flex flex-col space-y-6 mb-10">
                            <h6>Passa a SeoLo illimitato</h6>
                            {features.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex flex-row space-x-3 items-center">
                                        <CheckIcon className={`${item.iconSize} text-emerald-600`} />
                                        <div className="flex flex-col">
                                            <p className="font-semibold">{item.title}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            buttonTextDesktop="Passa a Premium"
                            backgroundColor={backgroundButtonStyle }
                            textStyle={textButtonStyle}
                            className="w-full"
                            linkTo="/prices"
                        />
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
