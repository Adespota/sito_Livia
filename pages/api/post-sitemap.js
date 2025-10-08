const fetch = require('node-fetch');


// Funzione Serverless su Vercel che chiama la cloud function di Google postSitemap che restituisce
// gli url degli articoli
export default async function handler(req, res) {
    console.log("Vercel function invoked now");

    const firebaseFunctionURL = 'https://us-central1-seomatrix-c00e5.cloudfunctions.net/postSitemap';

    try {
        const response = await fetch(firebaseFunctionURL);
        const xml = await response.text();
        console.log("Response from Firebase function received");

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error fetching data from Firebase function:", error);
        res.status(500).send("Internal Server Error");
    }
}
