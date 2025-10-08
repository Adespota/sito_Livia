import React from 'react';




export default function Card ({ title, text, primaryIcon, className, icon, width, height }) {

    const cardStyles = {
        width: width,      // Imposta la larghezza se fornita
        height: height,    // Imposta l'altezza se fornita
    };


    return (
        <div className={`bg-white rounded-lg p-4 space-y-2 shadow-3xl ${className}`} style={cardStyles}>
            {primaryIcon && <span>{primaryIcon}</span>}
            {title && <p className="text-base">{title}</p>}
            {text && (
                <div className="text-black">
                    {Array.isArray(text) ? (
                        <ul>
                            {text.map((item, index) => (
                                <li key={index} className="flex items-center mb-1">
                                    {icon && ( // Verifica se è stata fornita un'icona
                                        typeof icon === 'string' ? ( // Se è una stringa, assumi che sia il nome dell'icona
                                            <i className={`icon-${icon} mr-2`} /> // Sostituisci "icon-" con la tua classe di icona
                                        ) : (
                                            // Altrimenti, assume che sia un componente React dell'icona
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
        </div>
    );
}




