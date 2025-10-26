import Dexie from "dexie";

// 1) Istanza del database “ArticlesDB”
export const db = new Dexie("ArticlesDB");


// 2) Definizione della versione e degli object store
db.version(1).stores({
    //     “articles” conterrà gli articoli pubblicati sincronizzati da Firestore
    //   - chiave primaria = “id”
    //   - indice secondario = “dataArticolo” (per ordinare cronologicamente)
    //   - indice secondario = “categoria” (se serve filtrare per categoria)
    publishedArticles: "id, dataArticolo, slug, categoria",

    //     “drafts” conterrà le bozze salvate localmente dal client
    //   - chiave primaria = “idBozza” (scegli tu: potrebbe essere un uuid o un timestamp univoco)
    //   - indice secondario = “dataBozza” (per mostrare le bozze ordinate per data)
    draftsArticles: "id, dataArticolo",

    categoriesBlog: "id, categoria, description"
});



db.version(22).stores({
    publishedArticles: "id, dataArticolo, slug, categoria",
    draftsArticles: "id, dataArticolo",
    categoriesBlog: "id, categoria, description"
}).upgrade(async tx => {
    // Questo codice viene eseguito solo durante l'upgrade
    //console.log("⚠️ [IndexedDB] Aggiornamento alla versione 22. Svuotamento della tabella degli articoli pubblicati...");

    // Svuota completamente la tabella 'publishedArticles'
    await tx.table('publishedArticles').clear();

    //console.log("✅ [IndexedDB] Tabella 'publishedArticles' svuotata. I dati verranno riscaricati.");
});


let needReopen = false;

// chiudi pulito quando un'altra tab aggiorna lo schema
db.on('versionchange', () => {
    try { db.close(); } catch {}
    needReopen = true;
});

// opzionale: avvisa se bloccato (puoi rimuovere l'alert se non lo vuoi)
db.on('blocked', () => {
    // alert("Impossibile aprire il database. Chiudi le altre schede del blog.");
    needReopen = true;
});

// riapri alla prima occasione utile (ritorno focus sulla scheda)
export const reopenDb = async () => {
    if (db.isOpen()) return true;
    try {
        await db.open();
        return true;
    } catch (e) {
        const recoverable = ["DatabaseClosedError", "OpenFailedError", "VersionError", "InvalidStateError"].includes(e?.name);
        if (!recoverable) return false;
        await new Promise(r => setTimeout(r, 300));
        try {
            await db.open();
            return true;
        } catch {
            return false;
        }
    }
};

if (typeof window !== "undefined") {
    window.addEventListener('focus', () => {
        if (needReopen) reopenDb().then(ok => { if (ok) needReopen = false; });
    });
}

async function ensureOpen() {
    if (db.isOpen()) return true;
    return await reopenDb();
}


// 3) Riferimento alle due tabelle
export const articlesPublishedTable = db.table("publishedArticles");
export const draftsTable   = db.table("draftsArticles");
export const categoriesTable = db.table("categoriesBlog");

/**
 * Salva o aggiorna un array di articoli pubblicati in IndexedDB (object store “articles”).
 * Ogni oggetto DEV’ESSERE un record sincrono proveniente da Firestore, ad esempio:
 *   {id, categoria, titolo, dataArticolo, immagine, … }
 */
export async function savePublished(articlesArray) {
    try {
        await ensureOpen();
        //console.log("💾 [IndexedDB] bulkPut di", articlesArray.length, "articoli pubblicati…");
        await articlesPublishedTable.bulkPut(articlesArray);
        console.log("✅ [IndexedDB] Articoli pubblicati salvati");
    } catch (err) {
        console.error("❌ Errore in savePublished:", err);
    }
}

/**
 * Elimina un singolo articolo pubblicato per ID.
 */
export async function deletePublished(id) {
    try {
        console.log(`💾 [IndexedDB] delete articolo pubblicato ${id}…`);
        await articlesPublishedTable.delete(id);
        console.log(`✅ [IndexedDB] Articolo pubblicato ${id} cancellato`);
    } catch (err) {
        console.error("❌ Errore in deletePublished:", err);
    }
}

/**
 * Salva o aggiorna un array di bozze in IndexedDB (object store “drafts”).
 * Ogni oggetto DEV’ESSERE del tipo:
 *   { id, dataArticolo, titolo, sottotitolo, immagine, contenuto, … }
 */
export async function saveDrafts(articlesArray) {
    try {
        console.log("💾 [IndexedDB] bulkPut di", articlesArray.length, "bozze…");
        await draftsTable.bulkPut(articlesArray);
        console.log("✅ [IndexedDB] Bozze salvate");
    } catch (err) {
        console.error("❌ Errore in saveDrafts:", err);
    }
}

/**
 * Elimina una singola bozza per id.
 */
export async function deleteDraft(id) {
    try {
        console.log(`💾 [IndexedDB] delete bozza ${id}…`);
        await draftsTable.delete(id);
        console.log(`✅ [IndexedDB] Bozza ${id} cancellata`);
    } catch (err) {
        console.error("❌ Errore in deleteDraft:", err);
    }
}




export async function syncCategories(firestoreCategories) {
    try {
        console.log("🔄 [IndexedDB] Avvio sincronizzazione categorie...");

        // Ottieni l'elenco di tutti gli ID attualmente in Dexie
        const existingIds = await categoriesTable.toCollection().primaryKeys();
        const firestoreIds = new Set(firestoreCategories.map(c => c.id));

        // Trova gli ID delle categorie che sono state eliminate su Firestore
        const idsToDelete = existingIds.filter(id => !firestoreIds.has(id));

        // Usa una transazione per rendere l'operazione atomica
        await db.transaction('rw', categoriesTable, async () => {
            if (idsToDelete.length > 0) {
                console.log(`🗑️ [IndexedDB] Eliminazione di ${idsToDelete.length} categorie...`);
                await categoriesTable.bulkDelete(idsToDelete);
            }

            // bulkPut aggiorna i record esistenti e aggiunge quelli nuovi
            await categoriesTable.bulkPut(firestoreCategories);
        });

        console.log("✅ [IndexedDB] Sincronizzazione categorie completata.");

    } catch (err) {
        console.error("❌ Errore durante la sincronizzazione delle categorie:", err);
    }
}

/**
 * Recupera tutte le categorie da IndexedDB.
 */
export async function getCategories() {
    try {
        console.log("🔍 [IndexedDB] Caricamento categorie...");
        const categories = await categoriesTable.toArray();
        console.log(`✅ [IndexedDB] Trovate ${categories.length} categorie`);
        return categories;
    } catch (err) {
        console.error("❌ Errore in getCategories:", err);
        return [];
    }
}

