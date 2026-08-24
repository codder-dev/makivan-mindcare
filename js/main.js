//Main javascript//
const menuBtn = document.getElementById("menuBtn");

const navLinks = document.querySelector(".nav-links");


//mobile navigation//
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-active");

});

// Close menu when a link is clicked
document.addEventListener('DOMContentLoaded', function() {
    const navLink = document.querySelectorAll("header .nav-link a");
    navLink.forEach(link => {
        link.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            const menuBtn = document.getElementById('menuBtn');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (menuBtn) {
                menuBtn.classList.remove('active');
            }
            document.body.style.overflow = '';
        });
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