
export function correggiSlug(parolaChiave, slug) {
    const paroleChiave = Object.fromEntries(
        parolaChiave.split(" ").map((parola) => [parola.toLowerCase().replace("'", "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""), parola])
    );

    const paroleSlug = slug.split(" ");

    const slugCorretto = paroleSlug.map(parola => paroleChiave[parola] ?? parola);

    console.log("Slug corretto: ", slugCorretto.join(" "));

    return slugCorretto.join(" ");
}

