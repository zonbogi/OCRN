console.log("Supabase connecté !");

const supabaseUrl = "https://rxblxrdeudzmmwhsirhx.supabase.co";

const supabaseKey = "sb_publishable_o16eSFLlKQ03KC_6CLWMHw_AMa5rabk";

window.supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function testDatabase() {

    const { data, error } = await supabaseClient
        .from("collectivités")
        .select("*");

    console.log("DATA :", data);
    console.log("ERROR :", error);

}

async function chargerCollectivites() {

    const { data, error } = await supabaseClient
    .from("collectivités")
    .select("*");

const { data: observations, error: observationsError } =
    await supabaseClient
        .from("observations")
        .select("id");

if (error || observationsError) {
    console.error(error || observationsError);
    return;
}

console.log(data);

    const compteurAccueil = document.getElementById("home-nb-collectivites");

if (compteurAccueil) {
    compteurAccueil.textContent = data.length;
}

    const compteurObservations = document.getElementById("home-nb-observations");

if (compteurObservations) {
    compteurObservations.textContent = observations.length;
}

    const populationTotale = data.reduce(
    (total, collectivite) => total + (collectivite.population || 0),
    0
);

// Round down to the nearest 100,000
const populationArrondie = Math.floor(populationTotale / 100000) * 100000;

// Convert to "1.7M+"
const textePopulation = (populationArrondie / 1000000).toFixed(1) + "M+";

const populationAccueil = document.getElementById("home-population");
if (populationAccueil) {
    populationAccueil.textContent = textePopulation;
}
}

chargerCollectivites();

const arrow = document.querySelector(".scroll-indicator");

if (arrow) {

    window.addEventListener("scroll", () => {

        const hero = document.querySelector(".hero");

        if (!hero) return;

        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollBottom = window.scrollY + window.innerHeight;

        if (scrollBottom >= heroBottom - 50) {
            arrow.classList.add("hidden");
        } else {
            arrow.classList.remove("hidden");
        }

    });

}

