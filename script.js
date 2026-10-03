let newsletters = [];

// 페이지가 열리면 뉴스레터 불러오기
document.addEventListener("DOMContentLoaded", loadNewsletters);

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

// JSON 불러오기
async function loadNewsletters() {
    const list = document.getElementById("newsletterList");

    try {
        const response = await fetch("./newsletters.json");

        if (!response.ok) {
            throw new Error(
                `newsletters.json을 불러올 수 없습니다. (${response.status})`
            );
        }

        newsletters = await response.json();

        renderNewsletters();

    } catch (error) {
        console.error("뉴스레터 불러오기 오류:", error);

        list.innerHTML = `
            <div class="loading">
                <p>뉴스레터를 불러오지 못했습니다.</p>
                <p style="font-size: 13px; margin-top: 10px;">
                    newsletters.json 파일과 파일 경로를 확인해주세요.
                </p>
            </div>
        `;
    }
}


// 뉴스레터 카드 만들기
function renderNewsletters() {
    const list = document.getElementById("newsletterList");

    if (!list) {
        console.error("newsletterList를 찾을 수 없습니다.");
        return;
    }

    list.innerHTML = "";

    newsletters.forEach((newsletter, index) => {

        const card = document.createElement("article");

        card.className = "newsletter-card";

        card.innerHTML = `
            <div class="newsletter-number">
                NO. ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="newsletter-date">
                ${newsletter.date || ""}
            </div>

            <h3>
                ${newsletter.title || "제목 없음"}
            </h3>

            <div class="read-more">
                READ MORE →
            </div>
        `;

        card.addEventListener("click", function () {
            openNewsletter(index);
        });

        list.appendChild(card);
    });
}


// 뉴스레터 전문 열기
function openNewsletter(index) {

    const newsletter = newsletters[index];

    if (!newsletter) {
        console.error("해당 뉴스레터를 찾을 수 없습니다.");
        return;
    }

    const detail = document.getElementById("newsletterDetail");
    const content = document.getElementById("detailContent");
    const newsletterSection = document.querySelector(".newsletter-section");

    content.innerHTML = `
        <div class="detail-category">
            ${newsletter.category || "NEWSLETTER"}
        </div>

        <h1 class="detail-title">
            ${newsletter.title || ""}
        </h1>

        <div class="detail-date">
            ${newsletter.date || ""}
        </div>

        ${
            newsletter.image
                ? `<img 
                    class="detail-image"
                    src="${newsletter.image}"
                    alt="${newsletter.title || ""}"
                >`
                : ""
        }

        <div class="detail-body">
            ${newsletter.content || ""}
        </div>
    `;

    newsletterSection.classList.add("hidden");
    detail.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 뉴스레터 목록으로 돌아가기
function showNewsletterList() {

    const detail = document.getElementById("newsletterDetail");
    const newsletterSection = document.querySelector(".newsletter-section");

    detail.classList.add("hidden");
    newsletterSection.classList.remove("hidden");

    document.getElementById("newsletter").scrollIntoView({
        behavior: "smooth"
    });
}


// 맨 위로
function showHome() {

    const detail = document.getElementById("newsletterDetail");
    const newsletterSection = document.querySelector(".newsletter-section");

    detail.classList.add("hidden");
    newsletterSection.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 모바일 메뉴
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");

    if (menu) {
        menu.classList.toggle("active");
    }
}


// 모바일 메뉴 닫기
function closeMenu() {
    const menu = document.getElementById("mobileMenu");

    if (menu) {
        menu.classList.remove("active");
    }
}

document.querySelectorAll('.dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();

            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});