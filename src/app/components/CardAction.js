'use client';

import HeroIcon from "@/app/components/HeroIcons";
import Link from "next/link";



export default function CardAction({ title, href, text, textAction, className, icon, primaryIcon, width, height }) {
    const widthClass = width ? width : 'w-full';
    const heightClass = height ? height : 'h-full';

    return (
        <Link href={href}>
            <div className={`bg-[#F9FAFB] rounded-xl px-6 py-6 space-y-1 boxShadow_custom hover_boxShadow_custom ${widthClass} ${heightClass} ${className}`}>
                {primaryIcon && (
                    <div className='flex w-full justify-start'>
                        <HeroIcon
                            size={{ width: 'w-7', height: 'h-7' }}
                            icon={primaryIcon}
                            className="text-myColor-default mb-2"
                        />
                    </div>
                )}
                {title && <h5 className="text-[0.93rem] leading-normal pb-1.5">{title}</h5>}
                {text && (
                    <div className="text-left">
                        {Array.isArray(text) ? (
                            <ul>
                                {text.map((item, index) => (
                                    <li key={index} className="flex items-center mb-1">
                                        {icon && (
                                            typeof icon === 'string' ? (
                                                <i className={`icon-${icon} mr-2`} />
                                            ) : (
                                                <span className="mr-2">{icon}</span>
                                            )
                                        )}
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{text}</p>
                        )}
                    </div>
                )}
                {textAction && (
                    <div className="flex items-center sm:pt-6 pt-1">
                        <p className="font-semibold">{textAction}</p>
                        {icon && (
                            typeof icon === 'string' ? (
                                <i className={`icon-${icon} ml-2`} />
                            ) : (
                                <span className="ml-2">{icon}</span>
                            )
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
