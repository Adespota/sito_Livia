// Hook per ottenere la larghezza della finestra
'use client'

import { useState, useEffect } from 'react';

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        handleResize(); // Imposta subito la larghezza della finestra

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
};

export default useWindowWidth;
