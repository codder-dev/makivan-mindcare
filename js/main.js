//Main javascript//
// =========================================
// MOBILE NAVIGATION
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.querySelector(".nav-links");


    if (!menuBtn || !navLinks) return;


    // =====================================
    // OPEN / CLOSE MENU WITH MENU BUTTON
    // =====================================

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("mobile-active");

        menuBtn.classList.toggle("active");

    });


    // =====================================
    // CLOSE MENU WHEN A LINK IS CLICKED
    // =====================================

    navLinks.addEventListener("click", function (e) {

        const link = e.target.closest("a");


        // Only continue if an actual link was clicked
        if (!link) return;


        // Close mobile menu
        navLinks.classList.remove("mobile-active");


        // Remove active state from hamburger
        menuBtn.classList.remove("active");

    });

});
//scroll effect//
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(6, 11, 22, 0.96)";
    } else {

        navbar.style.background =
            "rgba(6, 11, 22, 0.85)";

    }
});