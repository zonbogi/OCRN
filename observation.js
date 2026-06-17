const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");

console.log("Observation ID =", id);

async function chargerObservation() {

    const {
    data,
    error
} = await supabaseClient
    .from("observations")
    .select("*")
    .eq("id", id)
    .single();

    console.log(data);
    console.log(error);

    if (error) {

        console.error(error);

        return;

    }

    document.getElementById(
        "observation-titre"
    ).textContent = data.titre;

    document.getElementById(
        "observation-date"
    ).textContent = data.date;

    const {
    data: collectivite,
    error: erreurCollectivite
} = await supabaseClient
    .from("collectivités")
    .select("nom")
    .eq(
        "id",
        data.collectivite_id
    )
    .single();

    document.getElementById(
    "observation-collectivite"
).textContent =
    collectivite.nom;

    document.getElementById(
    "observation-collectivite"
).addEventListener(
    "click",
    () => {

        window.location.href =
            `collectivite.html?id=${data.collectivite_id}`;

    }
);

    document.getElementById(
    "observation-contenu"
).textContent = data.contenu;

document.getElementById(
    "observation-image"
).src = data.image_url;

document.getElementById(
    "observation-thematique"
).textContent = data.thematique;

document.getElementById(
    "source-nom"
).textContent = data.source_nom;

document.getElementById(
    "source-lien"
).href = data.source_url;

}

chargerObservation();