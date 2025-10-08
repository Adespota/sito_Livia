
// --- 1. Tipi di Azione ---
// Sono stringhe uniche che identificano l'azione che è stata dispatchata.
export const FETCH_AUDIT_REQUEST = 'FETCH_AUDIT_REQUEST';
export const FETCH_AUDIT_SUCCESS = 'FETCH_AUDIT_SUCCESS';
export const FETCH_AUDIT_FAILURE = 'FETCH_AUDIT_FAILURE';
export const CLEAR_AUDIT = 'CLEAR_AUDIT'; // Azione opzionale per resettare lo stato dell'audit

// --- 2. Creatori di Azione ---
// Sono funzioni che ritornano un oggetto azione con un 'type' e un 'payload' (se necessario).
export const fetchAuditRequest = () => ({
    type: FETCH_AUDIT_REQUEST,
});

export const fetchAuditSuccess = (auditData) => ({
    type: FETCH_AUDIT_SUCCESS,
    payload: auditData, // Questo sarà il tuo oggetto 'seoAudit' completo
});

export const fetchAuditFailure = (error) => ({
    type: FETCH_AUDIT_FAILURE,
    payload: error,
});

export const clearAudit = () => ({
    type: CLEAR_AUDIT,
});

// --- 3. Stato Iniziale ---
// Definisce la struttura e i valori iniziali dello stato gestito da questo reducer.
const initialState = {
    currentAudit: null,   // Qui verrà salvato l'oggetto completo dell'audit SEO
    isLoading: false,     // Indica se una chiamata API di audit è in corso
    error: null,          // Contiene eventuali messaggi di errore
};

// --- 4. Funzione Reducer ---
// Prende lo stato attuale e un'azione, e ritorna il nuovo stato.
const auditSlice = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_AUDIT_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null, // Pulisce eventuali errori precedenti
            };
        case FETCH_AUDIT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentAudit: action.payload, // Salva l'oggetto audit completo
                error: null,
            };
        case FETCH_AUDIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload, // Salva il messaggio di errore
                currentAudit: null,    // Pulisce i dati dell'audit in caso di fallimento
            };
        case CLEAR_AUDIT:
            return {
                ...state,
                currentAudit: null,
                error: null,
            };
        default:
            return state;
    }
};

export default auditSlice;
