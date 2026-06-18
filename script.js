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

    console.log(data);
}

chargerCollectivites();

