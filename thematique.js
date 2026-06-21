const params =
    new URLSearchParams(
        window.location.search
    );

const theme =
    params.get("theme");

document.getElementById(
    "titre-thematique"
).textContent = theme;

document.title =
    theme + " | OCRN";



chargerObservations();

async function chargerObservations() {

    const {
        data: observations,
        error
    } = await supabaseClient
        .from("observations")
        .select("*")
        .eq(
            "thematique",
            theme
        );

    if (error) {

        console.error(error);

        return;
    }

    document.getElementById(
        "compteur-observations"
    ).textContent =
        observations.length
        + " observation(s)";

    const zone =
        document.getElementById(
            "observations-zone"
        );

    zone.innerHTML = "";

    observations.forEach(obs => {

        zone.innerHTML += `

<a
    class="observation-card"
    href="observation.html?id=${obs.id}"
>

    ${obs.image_url ? `
<img
    src="${obs.image_url}"
    class="observation-image"
    alt="${obs.titre}"
>
` : ""}

    <div class="observation-content">

        <div class="observation-date">
            ${obs.date}
        </div>

        <h2>
            ${obs.titre}
        </h2>

        <div class="observation-lire-plus">
            Lire l'observation →
        </div>

    </div>

</a>

`;

    });

}