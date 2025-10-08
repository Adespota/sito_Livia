import React from "react";
import InputTextBlog from "./InputTextBlog";
import EditorParagraph from "../nuovoArticolo/EditorParagraph";
import HeroIcon from "../../components/HeroIcons";
import plusCircleIcon from "@heroicons/react/20/solid/esm/PlusCircleIcon";
import minusCircleIcon from "@heroicons/react/24/solid/esm/MinusCircleIcon";
import {useSelector} from "react-redux";
import AddImageParagraph from "../../components/AddImageParagraph";


export default function NewParagraph({ onAdd, remove, index, counterFlag }) {
    //const paragraphContent = useSelector(state => state.articolo.paragrafi[index]?.contenuto);

    const handleIconClickAddParagraph = () => {
        if (onAdd) {
            onAdd();
        } else {
            console.log("Paragrafo aggiunto");
        }
    };

    const handleRemove = () => {
        if (typeof remove === 'function') {
            remove(index);
        } else {
            console.error('remove is not a function');
        }
    }
    return (
        <div className="rounded-2xl bg-white px-5 py-5">
            <div className="grid grid-cols-8 gap-4">
                <div className="col-span-4 md:col-span-2 items-start flex flex-row justify-start ">
                    <p className="text-[0.95rem] font-semibold mr-1.5">{`Paragrafo ${index + 1}`}</p>
                    <div className="flex flex-row items-center space-x-2 md:space-x-0">
                        <HeroIcon
                            icon={plusCircleIcon}
                            tooltipText="Aggiungi nuovo paragrafo"
                            size={{width: 'w-5', height: 'h-5'}}
                            className="text-myColor-default cursor-pointer"
                            onClick={handleIconClickAddParagraph}
                        />
                        <HeroIcon
                            icon={minusCircleIcon}
                            tooltipText="Elimina paragrafo"
                            size={{width: 'w-5', height: 'h-5'}}
                            className="text-myColor-default cursor-pointer"
                            onClick={handleRemove}
                        />
                    </div>
                </div>


                <div className="md:col-span-6 col-span-8 space-y-5">
                    <InputTextBlog
                        placeholder="Titolo paragrafo"
                        field={`paragrafi[${index}].titoloParagrafo`}
                    />
                    <EditorParagraph
                        field={`paragrafi[${index}].contenuto`}
                        //initialContent={paragraphContent}
                        index={index}
                        counterFlag={counterFlag}
                    />
                </div>
            </div>
        </div>
    );
}
