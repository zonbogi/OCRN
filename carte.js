const map = L.map("map");

const franceBounds = L.latLngBounds(
    [41.8, -5.3],   // Southwest
    [50.9, 8.4]     // Northeast
);

map.fitBounds(franceBounds, {
    padding: [20, 20]
});

map.fitBounds(franceBounds, {
    padding: [20, 20]
});

let toutesLesCollectivites = [];
let tousLesMarkers = [];
let toutesLesObservations = [];

const groupesDeMarkers = {};

L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
        subdomains: "abcd",
        maxZoom: 20,
        attribution:
            "&copy; OpenStreetMap contributors &copy; CARTO"
    }
).addTo(map);

async function chargerCollectivites() {

    const { data, error } = await supabaseClient
        .from("collectivités")
        .select("*");

    const {
    data: observations
} = await supabaseClient
    .from("observations")
    .select("*");

toutesLesObservations =
    observations;

    if (error) {
        console.error(error);
        return;
    }

    toutesLesCollectivites = data.map(
    ville => {

        const nbObservations =
            observations.filter(
                obs =>
                    obs.collectivite_id === ville.id
            ).length;

        return {

            ...ville,

            nbObservations

        };

    }
);

console.log(
    toutesLesCollectivites
);

    toutesLesCollectivites.forEach(ville => {

        const taille = Math.max(
            20,
            Math.min(60, ville.population / 2500)
        );
        radius: taille * 2

        const lumiereIcon = L.divIcon({
    className: "lumiere-marker",
    html: `
        <img
            src="assets/lumiere.png"
            class="lumiere-img"
            style="width:${taille}px;height:${taille}px;"
        >
    `,
    iconSize: [taille, taille]
});

        const marker = L.marker(
            [ville.latitude, ville.longitude],
            {
                icon: lumiereIcon
            }
        ).addTo(map);

        tousLesMarkers.push(marker);

        const cle =
    `${ville.latitude.toFixed(3)}-${ville.longitude.toFixed(3)}`;

if (!groupesDeMarkers[cle]) {
    groupesDeMarkers[cle] = [];
}

groupesDeMarkers[cle].push(marker);

marker.bindTooltip(ville.nom);
marker.on("mouseover", () => {
    marker.getElement()
        ?.querySelector(".lumiere-img")
        ?.classList.add("hover");

});


marker.on("mouseout", () => {

    marker.getElement()
        ?.querySelector(".lumiere-img")
        ?.classList.remove("hover");

});



        marker.on("click", async () => {

            const fiche = document.querySelector(".fiche-zone");

            const { data: observations, error } = await supabaseClient
                .from("observations")
                .select("*")
                .eq("collectivite_id", ville.id)
                .order("id", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }
            data.sort((a, b) => a.population - b.population);

            const thematiques = {};

            observations.forEach(obs => {

                if (!thematiques[obs.thematique]) {
                    thematiques[obs.thematique] = 0;
                }

                thematiques[obs.thematique]++;

            });

            const listeThematiques = Object.entries(thematiques)
                .map(([nom, nombre]) => `
                    <div class="thematique-ligne">
                        ${nom} (${nombre})
                    </div>
                `)
                .join("");

            const derniereObservation = observations[0];

            fiche.style.display = "block";

            fiche.innerHTML = `
                <div class="fiche-fermer">×</div>

                <div class="fiche-header">

                    <h2>${ville.nom}</h2>

                    <p class="maire-ligne">
                        ${ville.maire} • ${ville.parti}
                    </p>

                </div>

                <div class="fiche-infos">

                    <div class="info-bloc">
                        👥 ${ville.population.toLocaleString("fr-FR")} habitants
                    </div>

                    <div class="info-bloc">
                        📍 ${ville.region}
                    </div>

                </div>

                <div class="separateur"></div>

                <div class="observations-zone">

                    <h3>
                        ${observations.length} observations recensées
                    </h3>

                    <div class="thematiques-zone">
                        ${listeThematiques}
                    </div>

                </div>

                <div class="separateur"></div>

                <div class="derniere-observation">

                    ${
                        derniereObservation
                        ? `
                            <div class="observation-card">

                                <div class="observation-theme">
                                    ${derniereObservation.thematique}
                                </div>

                                <h4>
                                    ${derniereObservation.titre}
                                </h4>

                            </div>
                        `
                        : `
                            <p>Aucune observation enregistrée.</p>
                        `
                    }

                </div>
            `;

            fiche
    .querySelector(".fiche-fermer")
    .addEventListener("click", () => {

        fiche.style.display = "none";

    });

        });

        const hitbox = L.circleMarker(
            [ville.latitude, ville.longitude],
            {
                radius: taille * 1.3,
                opacity: 0,
                fillOpacity: 0
            }
        ).addTo(map);

        hitbox.on("click", () => {
            marker.fire("click");
        });

    });

}

chargerCollectivites();

document
    .querySelectorAll(
        '#filtre-population input[type="checkbox"]'
    )
    .forEach(cb => {

        cb.addEventListener(
            "change",
            filtrerPopulation
        );

    });

    document
    .getElementById(
        "filtre-theme"
    )
    .addEventListener(
        "change",
        filtrerPopulation
    );

document
    .getElementById(
        "filtre-documentation"
    )
    .addEventListener(
        "change",
        filtrerPopulation
    );

document
    .getElementById(
        "reset-filtres"
    )
    .addEventListener(
        "click",
        resetFiltres
    );

function resetFiltres() {

    document
        .querySelectorAll(
            '#filtre-population input[type="checkbox"]'
        )
        .forEach(cb => {

            cb.checked = false;

        });

    document
        .getElementById(
            "filtre-documentation"
        ).value = "all";

    document
        .getElementById(
            "filtre-theme"
        ).value = "all";

    filtrerPopulation();

}

function filtrerPopulation() {

    const populationsSelectionnees =
    Array.from(
        document.querySelectorAll(
            '#filtre-population input:checked'
        )
    )
    .map(cb => cb.value);

    const documentationFiltre =
    document.getElementById(
        "filtre-documentation"
    ).value;
        let compteur = 0;

    const themeFiltre =
    document.getElementById(
        "filtre-theme"
    ).value;

    toutesLesCollectivites.forEach(
        (ville, index) => {

            let afficher = true;
            let afficherDocumentation = true;
            let afficherTheme = true;

            if (
    themeFiltre !== "all"
) {

    afficherTheme =
    toutesLesObservations.some(
        obs =>
            obs.collectivite_id === ville.id
            &&
            obs.thematique === themeFiltre
    );

}

            if (
    populationsSelectionnees.length > 0
) {

    afficher = false;

    if (
        populationsSelectionnees.includes(
            "moins1000"
        )
        &&
        ville.population < 1000
    ) {
        afficher = true;
    }

    if (
        populationsSelectionnees.includes(
            "1000-10000"
        )
        &&
        ville.population >= 1000
        &&
        ville.population < 10000
    ) {
        afficher = true;
    }

    if (
        populationsSelectionnees.includes(
            "10000-100000"
        )
        &&
        ville.population >= 10000
        &&
        ville.population < 100000
    ) {
        afficher = true;
    }

    if (
        populationsSelectionnees.includes(
            "plus100000"
        )
        &&
        ville.population >= 100000
    ) {
        afficher = true;
    }

}

            if (
    documentationFiltre === "1-5"
) {

    afficherDocumentation =
        ville.nbObservations >= 1
        &&
        ville.nbObservations <= 5;

}

else if (
    documentationFiltre === "6-10"
) {

    afficherDocumentation =
        ville.nbObservations >= 6
        &&
        ville.nbObservations <= 10;

}

else if (
    documentationFiltre === "11-25"
) {

    afficherDocumentation =
        ville.nbObservations >= 11
        &&
        ville.nbObservations <= 25;

}

else if (
    documentationFiltre === "25plus"
) {

    afficherDocumentation =
        ville.nbObservations > 25;

}


const marker =
    tousLesMarkers[index];

const element =
    marker.getElement();

if (
    afficher
    &&
    afficherDocumentation
    &&
    afficherTheme
) {

    if (element) {
        element.style.opacity = "1";
    }

    compteur++;

} else {

    if (element) {
        element.style.opacity = "0";
    }

}


        }
    );

    document.getElementById(
    "nb-resultats"
).textContent =
    compteur +
    " collectivités affichées";

}

const boite =
    document.querySelector(
        ".filtres-zone"
    );

const handle =
    document.getElementById(
        "filtres-drag-handle"
    );

if (!boite || !handle) {
    console.log("Drag disabled");
} else {

let estEnTrainDeGlisser = false;

let offsetX = 0;
let offsetY = 0;

boite.addEventListener(
    "mousedown",
    e => {

        if (
            e.target.closest(
                "select, input, button, label"
            )
        ) {
            return;
        }

        estEnTrainDeGlisser = true;

        offsetX =
            e.clientX
            - boite.offsetLeft;

    }
);

document.addEventListener(
    "mousemove",
    e => {

        if (!estEnTrainDeGlisser) return;

        const container =
            document.querySelector(".carte-page");

        const containerRect =
            container.getBoundingClientRect();

        let nouvelleGauche =
            e.clientX
            - offsetX
            - containerRect.left;

        let nouveauHaut =
            e.clientY
            - offsetY
            - containerRect.top;

        const marge = 20;

        const maxLeft =
            container.offsetWidth
            - boite.offsetWidth
            - marge;

        const maxTop =
            container.offsetHeight
            - boite.offsetHeight
            - marge;

        nouvelleGauche = Math.max(
            marge,
            Math.min(
                nouvelleGauche,
                maxLeft
            )
        );

        nouveauHaut = Math.max(
            marge,
            Math.min(
                nouveauHaut,
                maxTop
            )
        );

        boite.style.left =
            nouvelleGauche + "px";

    }
);

document.addEventListener(
    "mouseup",
    () => {

        estEnTrainDeGlisser = false;

    }
);

}

const boutonFiltres = document.getElementById("ouvrir-filtres");
const panneauFiltres = document.querySelector(".filtres-zone");

if (boutonFiltres && panneauFiltres) {

    boutonFiltres.addEventListener("click", () => {

        if (window.innerWidth <= 900) {

            // Mobile
            panneauFiltres.classList.toggle("mobile-open");

        } else {

            // Desktop
            if (panneauFiltres.style.display === "none") {

                panneauFiltres.style.display = "block";

            } else {

                panneauFiltres.style.display = "none";

            }

        }

    });

}

const fermerFiltres = document.querySelector(".filtres-fermer");

fermerFiltres?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    panneauFiltres.classList.remove("mobile-open");

});