import { useState, useEffect } from 'react';

export function useTrimmedState(state) {
    const [trimmedState, setTrimmedState] = useState({});

    useEffect(() => {
        let newTrimmedState = {};
        for (const [key, value] of Object.entries(state)) {
            newTrimmedState[key] = typeof value === 'string' ? value.trim() : value;
        }
        setTrimmedState(newTrimmedState);
    }, [state]);

    return trimmedState;
}