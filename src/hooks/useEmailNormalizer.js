import { useCallback } from 'react';

// Questo hook è utili per normalizzare la mail.
// Trasforma una email da esempio@hotmail.it in esempio_hotmail.it


export const useEmailNormalizer = () => {
    const normalizeEmail = useCallback((email) => {
        if (email) {
            return email.replace(/[.#$[\]/@]/g, '_');
        }
        return '';
    }, []);

    return { normalizeEmail };
};



