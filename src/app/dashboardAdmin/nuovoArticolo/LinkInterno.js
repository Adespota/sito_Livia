'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setLinkInterni,
    selectLinkInterni
} from '/src/reducer/features/articoloSlice'
import MyTextField from '@/app/components/MyTextField'
import HeroIcon from '@/app/components/HeroIcons'
import XIcon from '@heroicons/react/20/solid/esm/XMarkIcon'
import PlusIcon from '@heroicons/react/20/solid/esm/PlusIcon'



export default function LinkInterno({
                                        readOnly = false,
                                        disableUserInput = false,
                                        ...props
                                    }) {
    const dispatch = useDispatch()
    const persistedLinks = useSelector(selectLinkInterni)
    console.log("Link interni salvati in Redux;",persistedLinks)
    const [localLinks, setLocalLinks] = useState(persistedLinks)
    const [inputLink, setInputLink] = useState('')

    const handleAdd = () => {
        const trimmed = inputLink.trim()
        if (!trimmed || localLinks.includes(trimmed)) {
            setInputLink('')
            return
        }
        const updated = [...localLinks, trimmed]
        setLocalLinks(updated)
        dispatch(setLinkInterni(updated))
        setInputLink('')
    }

    const handleRemove = (toRemove) => {
        const updated = localLinks.filter(l => l !== toRemove)
        setLocalLinks(updated)
        dispatch(setLinkInterni(updated))
    }

    return (
        <div className="rounded-2xl bg-white px-5 py-5 space-y-5">
            <div className="flex w-full flex-col md:flex-row">

                <div className="flex flex-row items-center space-x-2 md:w-1/4 w-full flex-shrink-0 font-semibold text-[0.95rem] md:pb-0 pb-4">
                    <p className="font-semibold">Link interni</p>
                    <HeroIcon
                        icon={PlusIcon}
                        onClick={handleAdd} size={{ width: 'w-4', height: 'h-4' }}
                        tooltipText="Aggiungi link interno"
                        className="bg-myColor-default rounded-full text-white flex justify-center items-center"
                    />
                </div>


                <div className="w-full flex-grow">
                    <div className="flex flex-row space-x-3">
                        <MyTextField
                            label="https://www.esempio.it"
                            value={inputLink}
                            size="small"
                            inputProps={{
                                style: {
                                    borderRadius: 6,
                                    paddingTop: 3,
                                    paddingBottom: 5,
                                    paddingLeft: 1,
                                    paddingRight: 1,
                                }
                            }}
                            onChange={e => setInputLink(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAdd()
                                }
                            }}

                            readOnly={readOnly}
                            disabled={disableUserInput}
                            {...props}
                        />

                    </div>

                    <div className="items-start mt-3 w-full flex-grow min-w-0">
                        {/* wrapper che fa wrapping e dà gap */}
                        <div className="ml-0 flex flex-wrap gap-2">
                            {localLinks.map((link, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center bg-gray-100 sm:px-3 px-2 sm:py-1 py-0 rounded-full min-w-0 max-w-md overflow-hidden">
                                    <p className="block truncate whitespace-nowrap">
                                        {link}
                                    </p>
                                    <HeroIcon
                                        icon={XIcon}
                                        onClick={() => handleRemove(link)}
                                        size={{ width: 'w-4', height: 'h-4' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
