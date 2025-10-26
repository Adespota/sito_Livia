'use client';

import React, {useState} from "react";
import {Divider} from "@mui/material";
import { useSelector} from "react-redux";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Grid';
import {useAuth} from "@/app/authContext";






export default function Page() {
    const [loading, setLoading] = useState(true);

    //const categoryCount = articles.reduce((acc, article) => {
        //if (article.categoria) {
           // acc[article.categoria] = (acc[article.categoria] || 0) + 1;
        //}
        //return acc;
    //}, {});
    // Estrarre i nomi delle categorie e il numero di articoli
    //const categoryLabels = Object.keys(categoryCount); // Array con i nomi delle categorie
    //const categoryData = Object.values(categoryCount); // Array con il numero di articoli per categoria




    return (
        <>
            <h6 className="mb-8">Ciao </h6>

            <Grid container spacing={1}>
                <Grid item xs={5}>
                    <Box mb={2}>

                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <Box mb={2}>
                        <div className="flex flex-col rounded-2xl bg-white px-10 py-10 space-y-5">
                            <div className="flex md:flex-row flex-col">
                                <div className="flex flex-grow flex-col space-y-4">

                                    <div className="space-y-7 w-full">
                                        <Divider/>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={7}>
                    <Box mb={2}>
                        <div className="flex-col rounded-2xl bg-white px-10 py-10 space-y-5">
                            <div className="flex md:flex-row flex-col ">
                                <div className="flex w-full flex-col space-y-4">
                                    <h6>Statistiche articoli</h6>
                                    <div className="w-full">
                                        <Divider/>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs={5}>

                </Grid>
            </Grid>
        </>
    );
}






