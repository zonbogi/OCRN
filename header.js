fetch("header.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("header").innerHTML = data;

        const navbar = document.querySelector(".navbar");

        if (navbar) {
            navbar.classList.add("intro");

            setTimeout(() => {
                navbar.classList.remove("intro");
            }, 1000);
        }

        const page = window.location.pathname.split("/").pop();

        document.querySelectorAll(".menu-item").forEach(item => {

            if (item.getAttribute("href") === page) {
                item.classList.add("actif");
            }

        });

        if (
            page === "" ||
            page === "index.html"
        ) {

            const logo = document.querySelector(".logo-container");

            if (logo) {
                logo.classList.add("home-active");
            }

        }

        const burger = document.getElementById("burger");
        const menu = document.getElementById("menu");

        if (burger && menu) {

            burger.addEventListener("click", () => {

                menu.classList.toggle("mobile-open");

            });

        }

    });