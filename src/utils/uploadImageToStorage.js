import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase";

/**
 * Carica un file o blob su Firebase Storage e restituisce l'URL pubblico
 * @param {File|Blob} fileOrBlob - L'immagine da caricare
 * @param {string} folder - La sottocartella di destinazione (es. 'immagini_articoli')
 */
export async function uploadImageToStorage(fileOrBlob, folder = "immagini_articoli") {
    if (!fileOrBlob) throw new Error("Nessun file da caricare.");

    // 🔹 Crea un nome univoco (timestamp + nome file)
    const fileName = `${folder}/${Date.now()}_${fileOrBlob.name || "image.png"}`;

    // 🔹 Crea il riferimento nel bucket
    const imageRef = ref(storage, fileName);

    // 🔹 Carica e ottieni l’URL pubblico
    const snapshot = await uploadBytes(imageRef, fileOrBlob);
    const url = await getDownloadURL(snapshot.ref);

    return url;
}
