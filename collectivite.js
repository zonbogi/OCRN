const params = new URLSearchParams(
    window.location.search
);

const id = params.get("id");

console.log("ID =", id);

async function chargerCollectivite() {

    // COLLECTIVITÉ

    const {
        data,
        error
    } = await supabaseClient
        .from("collectivités")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById(
        "nom-ville"
    ).textContent = data.nom;
    document.title = `${data.nom} | OCRN`;

    document.getElementById(
        "population"
    ).textContent =
        data.population.toLocaleString("fr-FR")
        + " habitants";

    document.getElementById(
        "region"
    ).textContent = data.region;

    document.getElementById(
        "maire"
    ).textContent = data.maire;


    // OBSERVATIONS

    const {
    data: observations,
    error: erreurObservations
} = await supabaseClient
    .from("observations")
    .select("*")
    .eq("collectivite_id", id)
    .order("date", {
        ascending: false
    });

    if (erreurObservations) {
        console.error(
            erreurObservations
        );
        return;
    }

    document.getElementById(
        "nb-observations"
    ).textContent =
        observations.length;


    // AFFICHAGE

    const zone =
        document.getElementById(
            "observations-zone"
        );

    if (observations.length === 0) {

        zone.innerHTML = `
            <p>
                Aucune observation enregistrée.
            </p>
        `;

        document
    .querySelectorAll(
        ".observation-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const id =
                    card.dataset.id;

                window.location.href =
                    `observation.html?id=${id}`;

            }
        );

    });

        return;
    }

    const principale =
        observations[0];

    console.log(principale.image_url);

    zone.innerHTML = `

<div
    class="observation-card observation-principale"
    data-id="${principale.id}"
>
        ${principale.image_url ? `
<div
    class="observation-image"
    style="
        background-image:url('${principale.image_url}');
        background-size:cover;
        background-position:center;
    "
></div>
` : ""}

        <div class="observation-content">

            <div class="observation-date">
                ${principale.date}
            </div>

            <h3>
                ${principale.titre}
            </h3>

            <div class="observation-tags">
                ${principale.thematique}
            </div>

            <p class="observation-resume">
                ${principale.resume}
            </p>

            <div class="observation-lire-plus">
                Lire l'observation →
            </div>

        </div>

    </div>

    ${observations.slice(1).map(obs => `

<div
    class="observation-card"
    data-id="${obs.id}"
>

            ${obs.image_url ? `
<div
    class="observation-image"
    style="
        background-image:url('${obs.image_url}');
        background-size:cover;
        background-position:center;
    "
></div>
` : ""}

            <div class="observation-content">

                <div class="observation-date">
                    ${obs.date}
                </div>

                <h3>
                    ${obs.titre}
                </h3>

            </div>

        </div>

    `).join("")}

`;

document
    .querySelectorAll(
        ".observation-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const id =
                    card.dataset.id;

                window.location.href =
                    `observation.html?id=${id}`;

            }
        );

    });

}

chargerCollectivite();