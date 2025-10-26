'use client';

import React from "react";
import MyCategoryWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyCategoryWrapper";
import MyTitleAndSubtitleWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyTitleAndSubtitleWrapper";
import MyAddNewCategoryWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyAddNewCategoryWrapper";
import MyIndiceWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyIndiceWrapper";
import MySintesiArticoloWrapper from "@/app/dashboardAdmin/nuovoArticolo/MySintesiArticoloWrapper";
import MyPuntiChiaveWrapper from "@/app/dashboardAdmin/nuovoArticolo/MyPuntiChiaveWrapper";





export default function Page() {


    return (
        <div className="flex flex-col space-y-3">
            <h6 className="mb-8">Nuovo articolo</h6>
            <MyCategoryWrapper />
            <MyTitleAndSubtitleWrapper />
            <MyAddNewCategoryWrapper />
            <MyIndiceWrapper />
            <MySintesiArticoloWrapper />
            <MyPuntiChiaveWrapper />
        </div>
    );
}
