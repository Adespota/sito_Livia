import Dexie from "dexie";


// 1) Istanza del database “DocsDB”
export const db = new Dexie("DocsDB");

// 2) Definizione della versione e degli object store
db.version(1).stores({
    // “docs” conterrà le versioni ufficiali della documentazione
    //  - chiave primaria = “order”
    // id = primary key, order = indice secondario
    docs: "id,order"
});

// 3) Riferimento alla tabella
export const docsTable   = db.table("docs");




export async function savePublishedDocs(docsArray) {
    await db.transaction('rw', docsTable, async () => {
        await docsTable.clear();
        await docsTable.bulkAdd(docsArray);
    });
}


/**
 * Elimina un singolo documento pubblicato per ID.
 */
export async function deletePublishedDoc(id) {
    try {
        console.log(`💾 [IndexedDB] delete documento ${id}…`);
        await docsTable.delete(id);
        console.log(`✅ [IndexedDB] Documento ${id} cancellato`);
    } catch (err) {
        console.error("❌ Errore in deletePublishedDoc:", err);
    }
}
