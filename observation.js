const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");

console.log(
    "Observation ID =",
    id
);

async function chargerObservation() {

    const {
        data,
        error
    } = await supabaseClient
        .from("observations")
        .select("*")
        .eq("id", id)
        .single();

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

    document.getElementById(
        "observation-contenu"
    ).textContent = data.contenu;

    document.getElementById(
        "observation-image"
    ).src = data.image_url;

    document.getElementById(
        "source-nom"
    ).textContent = data.source_nom;

    document.getElementById(
        "source-lien"
    ).href = data.source_url;

    /* THÉMATIQUE */

    const themeElement =
        document.getElementById(
            "observation-thematique"
        );

    themeElement.textContent =
        data.thematique;

    themeElement.href =
        `thematique.html?theme=${encodeURIComponent(
            data.thematique
        )}`;

    /* COLLECTIVITÉ */

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

    if (
        !erreurCollectivite
        && collectivite
    ) {

        const collectiviteElement =
            document.getElementById(
                "observation-collectivite"
            );

        collectiviteElement.textContent =
            collectivite.nom;

        collectiviteElement.addEventListener(
            "click",
            () => {

                window.location.href =
                    `collectivite.html?id=${data.collectivite_id}`;

            }
        );

    }

}

chargerObservation();