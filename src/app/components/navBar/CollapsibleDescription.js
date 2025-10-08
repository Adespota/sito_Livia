import { useState } from 'react';

export default function CollapsibleDescription ({ name, description }) {
    // Stato per controllare se il testo è espanso o compresso
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = (e) => {
        e.preventDefault();  // Blocca il comportamento di navigazione
        e.stopPropagation();  // Impedisce la propagazione del click al link padre
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex-1">
            <span className="block font-semibold pb-1.5">{name}</span>
            <p className="text-sm text-gray-500">
                {isExpanded ? description : `${description.substring(0, 73)}...`}
            </p>
            <button
                className="text-blue-500 hover:underline text-sm"
                onClick={toggleDescription}
            >
                {isExpanded ? 'Leggi meno' : 'Leggi di più'}
            </button>
        </div>
    );
};
