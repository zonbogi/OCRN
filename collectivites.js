let toutesLesCollectivites = [];
let triNomAsc = true;
let triPopulationAsc = false;
let triRegionAsc = true;
let triMaireAsc = true;

function afficherCollectivites(collectivites) {

    const zone = document.getElementById(
        "collectivites-table"
    );
    const mobile = window.innerWidth <= 900;

    zone.innerHTML = mobile ? `

<table class="collectivites-table">

    <thead>

        <tr>

            <th id="tri-nom" class="triable">
                Nom
            </th>

            <th id="tri-maire" class="triable">
                Maire
            </th>

            <th id="tri-observations">
                Obs.
            </th>

        </tr>

    </thead>

    <tbody>

        ${collectivites.map(ville => `

            <tr data-id="${ville.id}">

                <td>${ville.nom}</td>

                <td>${ville.maire}</td>

                <td>${ville.nbObservations}</td>

            </tr>

        `).join("")}

    </tbody>

</table>

`

:

zone.innerHTML = mobile ? `
    ...
`
:
`
<table class="collectivites-table">

    <thead>

        <tr>

            <th id="tri-nom" class="triable">
                Nom
            </th>

            <th id="tri-population" class="triable">
                Population
            </th>

            <th id="tri-region" class="triable">
                Région
            </th>

            <th id="tri-maire" class="triable">
                Maire
            </th>

            <th id="tri-observations" class="triable">
                Observations
            </th>

        </tr>

    </thead>

    <tbody>

        ${collectivites.map(ville => `

            <tr data-id="${ville.id}">

                <td>${ville.nom}</td>

                <td>${ville.population.toLocaleString("fr-FR")}</td>

                <td>${ville.region}</td>

                <td>${ville.maire}</td>

                <td>${ville.nbObservations}</td>

            </tr>

        `).join("")}

    </tbody>

</table>
`;
if (!mobile) {
    const boutonPopulation =
    document.getElementById(
        "tri-population"
    );

boutonPopulation.addEventListener(
    "click",
    () => {

        toutesLesCollectivites.sort(
            (a, b) => {

                if (triPopulationAsc) {
                    return a.population - b.population;
                }

                return b.population - a.population;

            }
        );

        triPopulationAsc =
            !triPopulationAsc;

        afficherCollectivites(
            toutesLesCollectivites
        );

    }
);

const boutonNom =
    document.getElementById(
        "tri-nom"
    );

boutonNom.addEventListener(
    "click",
    () => {

        toutesLesCollectivites.sort(
            (a, b) => {

                if (triNomAsc) {
                    return a.nom.localeCompare(
                        b.nom
                    );
                }

                return b.nom.localeCompare(
                    a.nom
                );

            }
        );

        triNomAsc =
            !triNomAsc;

        afficherCollectivites(
            toutesLesCollectivites
        );

    }
);

const boutonRegion =
    document.getElementById(
        "tri-region"
    );

boutonRegion.addEventListener(
    "click",
    () => {

        toutesLesCollectivites.sort(
            (a, b) => {

                if (triRegionAsc) {
                    return a.region.localeCompare(
                        b.region
                    );
                }

                return b.region.localeCompare(
                    a.region
                );

            }
        );

        triRegionAsc =
            !triRegionAsc;

        afficherCollectivites(
            toutesLesCollectivites
        );

    }
);

const boutonMaire =
    document.getElementById(
        "tri-maire"
    );

boutonMaire.addEventListener(
    "click",
    () => {

        toutesLesCollectivites.sort(
            (a, b) => {

                if (triMaireAsc) {
                    return a.maire.localeCompare(
                        b.maire
                    );
                }

                return b.maire.localeCompare(
                    a.maire
                );

            }
        );

        triMaireAsc =
            !triMaireAsc;

        afficherCollectivites(
            toutesLesCollectivites
        );

    }
);

const boutonObservations =
    document.getElementById(
        "tri-observations"
    );

boutonObservations.addEventListener(
    "click",
    () => {

        toutesLesCollectivites.sort(
            (a, b) => {

                if (triPopulationAsc) {
                    return (
                        a.nbObservations -
                        b.nbObservations
                    );
                }

                return (
                    b.nbObservations -
                    a.nbObservations
                );

            }
        );

        triPopulationAsc =
            !triPopulationAsc;

        afficherCollectivites(
            toutesLesCollectivites
        );

    }
);
}

document
    .querySelectorAll(
        ".collectivites-table tbody tr"
    )
    
    .forEach(row => {

        row.addEventListener(
            "click",
            () => {

                const id =
                    row.dataset.id;

                    console.log(id);

                window.location.href =
                    `collectivite.html?id=${id}`;

            }
        );

    });

}

async function chargerCollectivites() {

    const { data, error } = await supabaseClient
        .from("collectivités")
        .select("*");

    const {
    data: observations,
    error: erreurObs
} = await supabaseClient
    .from("observations")
    .select("collectivite_id");

    const compteurObservations = {};
    observations.forEach(obs => {

    if (!compteurObservations[
        obs.collectivite_id
    ]) {

        compteurObservations[
            obs.collectivite_id
        ] = 0;

    }

    compteurObservations[
        obs.collectivite_id
    ]++;

});

    if (error) {
        console.error(error);
        return;
    }

    toutesLesCollectivites = data;
    toutesLesCollectivites.forEach(ville => {

    ville.nbObservations =
        compteurObservations[
            ville.id
        ] || 0;

});
    toutesLesCollectivites.sort(
    (a, b) => b.population - a.population
);

    document.getElementById("nb-collectivites")
        .textContent = data.length;

    document.getElementById("population-totale")
        .textContent = data
            .reduce(
                (sum, ville) => sum + ville.population,
                0
            )
            .toLocaleString("fr-FR");

    document.getElementById(
    "nb-observations"
).textContent =
    observations.length;


    

    afficherCollectivites(data);

}

document
    .getElementById("recherche")
    .addEventListener("input", e => {

        const recherche = e.target.value
            .toLowerCase();

        const resultat =
            toutesLesCollectivites.filter(ville =>

                ville.nom
                    .toLowerCase()
                    .includes(recherche)

            );

        afficherCollectivites(resultat);

    });

chargerCollectivites();
