/* =========================
   SLIDER
========================= */

let currentSlide = 0;

const slidesWrapper = document.querySelector(".slides-wrapper");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slidesWrapper.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(index) {
    showSlide(index);
}


// 모바일 메뉴 열기 / 닫기
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    const button = document.querySelector(".menu-button");

    const isOpen = menu.classList.toggle("active");

    button.setAttribute("aria-expanded", isOpen);
    button.setAttribute(
        "aria-label",
        isOpen ? "메뉴 닫기" : "메뉴 열기"
    );
}

// 모바일 메뉴 닫기
function closeMenu() {
    const menu = document.getElementById("mobileMenu");
    const button = document.querySelector(".menu-button");
    const aboutButton = document.querySelector(
        ".mobile-dropdown-button"
    );
    const submenu = document.getElementById("aboutSubmenu");

    menu.classList.remove("active");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "메뉴 열기");

    submenu.classList.remove("active");
    aboutButton.classList.remove("active");
    aboutButton.setAttribute("aria-expanded", "false");
}

// ABOUT 하위 메뉴 열기 / 닫기
function toggleAboutMenu() {
    const submenu = document.getElementById("aboutSubmenu");
    const button = document.querySelector(
        ".mobile-dropdown-button"
    );

    const isOpen = submenu.classList.toggle("active");

    button.classList.toggle("active", isOpen);
    button.setAttribute("aria-expanded", isOpen);
}

// 화면이 PC 크기로 바뀌면 모바일 메뉴 닫기
window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});