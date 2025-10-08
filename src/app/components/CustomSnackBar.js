"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import { hideSnackbar } from '@/reducer/features/snackBarSlice';

export default function CustomSnackbar() {
    const dispatch = useDispatch();
    const { open, message, type } = useSelector((state) => state.snackBarSlice);

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(hideSnackbar());
    };

    const backgroundColors = {
        success: '#c4fbba',
        error:   '#f4c6c6',
        warning: 'lightyellow',
        info:    'lightblue',
    };
    const textColors = {
        success: '#6cec54',
        error:   '#f60e0e',
        warning: 'darkorange',
        info:    'darkblue',
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ zIndex: 9999 }}
            ContentProps={{
                sx: {
                    minWidth:  'auto !important',
                    maxWidth:  'none !important',
                    width:     'auto',
                    display:       'inline-block',
                    whiteSpace:    'pre-line',
                    paddingX:      2,
                    paddingY:      1,
                    backgroundColor: backgroundColors[type] || 'lightgray',
                    color:           textColors[type] || 'black',
                    fontWeight:      'bold',
                    borderRadius:    '8px',
                }
            }}
            message={message}
        />
    );
}
