// Funzione di utilità per gestire le classi CSS condizionali
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default classNames;
