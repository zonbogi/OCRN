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
        "lien-whatsapp"
    ).href =
        data.whatsapp;

    document.getElementById(
        "lien-instagram"
    ).href =
        data.instagram;

    document.getElementById(
        "lien-email"
    ).href =
        "mailto:" + data.email;

}

fetch("participer.json")
    .then(response => response.json())
    .then(data => {

        document.getElementById(
            "lien-formulaire"
        ).href = data.formulaire;

        document.getElementById(
            "lien-whatsapp"
        ).href = data.whatsapp;

        document.getElementById(
            "lien-instagram"
        ).href = data.instagram;

        document.getElementById(
            "lien-email"
        ).href =
            "mailto:" + data.email;

    });

    
chargerLiens();