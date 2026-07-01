async function chargerLiens() {

    const response =
        await fetch(
            "participer.json"
        );

    const data =
        await response.json();

    document.getElementById(
        "lien-formulaire"
    ).href =
        data.formulaire;

    document.getElementById(
        "lien-instagram"
    ).href =
        data.instagram;

}

fetch("participer.json")
    .then(response => response.json())
    .then(data => {

        document.getElementById(
            "lien-formulaire"
        ).href = data.formulaire;

        document.getElementById("lien-signal").href = data.signal;

        document.getElementById(
            "lien-instagram"
        ).href = data.instagram;

        document.getElementById(
            "lien-email"
        ).href =
            "mailto:" + data.email;

    });

    
chargerLiens();