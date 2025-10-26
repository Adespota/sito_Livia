'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomSnackbar } from '@adespota/my-react-component';
import * as domainLib from "@tuoorg/domain-lib";



export default function SnackbarContainer() {
    const dispatch = useDispatch();
    const { open, message, type } = useSelector((state) => state.snackbar);
    const azioneSnackbar = domainLib.snackbar.hideSnackbar;


    return (
        <CustomSnackbar
            open={open}
            message={message}
            type={type}
            onClose={() => dispatch(azioneSnackbar())}
        />
    );
}
