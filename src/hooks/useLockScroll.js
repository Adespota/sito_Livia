import { useEffect } from 'react';

const useLockScroll = () => {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // Blocca lo scroll
        document.body.style.overflow = 'hidden';
        return () => {
            // Riporta lo scroll al suo stato originale quando il componente si smonta
            document.body.style.overflow = originalStyle;
        };
    }, []);
};

export default useLockScroll;
