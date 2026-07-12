fetch("loader.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("loader-container").innerHTML = data;
    });

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.add("hidden");
    }
});