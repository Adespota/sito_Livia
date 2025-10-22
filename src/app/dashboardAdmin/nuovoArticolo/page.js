'use client';

import React from "react";
import firebase from '../../firebase';
import { TitleAndSubtitle} from "@adespota/my-react-component";
import {SeoDataForm} from "@adespota/my-react-component";
import MyCategoriaWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyCategoriWrapper";





export default function Page() {
    const db = firebase.firestore;

    return (
        <div className="flex flex-col space-y-3">
            <h6 className="mb-8">Nuovo articolo</h6>
            <MyCategoriaWrapper />
            <TitleAndSubtitle />
            <SeoDataForm />
        </div>
    );
}
