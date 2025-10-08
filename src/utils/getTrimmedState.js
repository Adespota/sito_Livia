/**
 * Rimuove gli spazi bianchi all'inizio e alla fine delle stringhe in un oggetto stato.
 * @param {Object} state - Lo stato da elaborare.
 * @returns {Object} - Nuovo stato con le stringhe "trimmate".
 */
export function getTrimmedState(state) {
    let newTrimmedState = {};
    for (const [key, value] of Object.entries(state)) {
        if (typeof value === 'string') {
            newTrimmedState[key] = value.trim();
        } else if (Array.isArray(value)) {
            newTrimmedState[key] = value.map(item => typeof item === 'string' ? item.trim() : item);
        } else {
            newTrimmedState[key] = value;
        }
    }
    return newTrimmedState;
}
