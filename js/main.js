//Main javascript//
const menuBtn = document.getElementById('menuBtn');

 const navLinks = document.getElementById('nav-links');

//mobile navigation//
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle("mobile-active");

});

//scroll effect//
window.addEventListener('scroll', () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50 ){
        navbar.style.background = "rgba(6, 11, 22, 0.96)";
    } else {

        navbar.style.background =
            "rgba(6, 11, 22, 0.85)";

    }
});