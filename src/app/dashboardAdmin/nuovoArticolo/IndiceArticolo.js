import React from "react";
import InputTextBlog from "./InputTextBlog";
import {Tooltip} from "@mui/material";
import InformationSEO from "@/app/components/InformationSEO";



export default function Indice() {
    return (
        <div className="rounded-2xl bg-white px-5 py-5 space-y-5">
            <div className="flex md:flex-row flex-col w-full">
                <h6 className="basis-1/4 font-semibold text-[0.95rem] md:pb-0">Indice</h6>
                <div className="flex flex-col flex-grow">
                    <Tooltip
                        title="L'indice si compilerà automaticamente"
                        placement="bottom-start"
                    >
                        <InputTextBlog
                            readOnly={true}
                            placeholder="Indice"
                            field="indice"
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}



