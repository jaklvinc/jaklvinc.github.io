/* ============================================================
   Halka Jaklová — Rodinná mediace v Praze
   Chování webu: mobilní menu, scroll efekty, animace, formulář
   ============================================================ */

// === Mobile nav toggle ===
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// === Navbar scroll effect ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// === Scroll animations (Intersection Observer) ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animation slightly
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// === Contact form handling (Google Sheets + email) ===
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// URL web app z Google Apps Script (Extensions → Apps Script → Deploy → Web app)
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwP-uzjJlXpvJI_12Ep929Tg83W8qVO5tXVKE698lyMNAmqrgvmn-XTi2U0Kb1TNUvL/exec';

// [ANTI-SPAM] Čas načtení stránky — pro "time trap" (viz doPost v Apps Script)
const PAGE_LOADED_AT = Date.now();

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        // [ANTI-SPAM] honeypot — lidé to nevyplní, boti ano
        website: document.getElementById('website').value,
        // [ANTI-SPAM] time trap — server porovná oba časy (musí uplynout min. 5 s)
        pageLoadedAt: PAGE_LOADED_AT,
        submittedAt: Date.now()
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // Pozor: Content-Type musí být text/plain (ne application/json),
    // jinak prohlížeč pošle CORS preflight (OPTIONS) a Apps Script ho nezvládne.
    fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
    })
    .then(() => {
        contactForm.reset();
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Děkuji za zprávu! Ozvu se vám co nejdříve.';
    })
    .catch(err => {
        console.error('Odeslání zprávy selhalo:', err);
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Omlouváme se, odeslání se nepodařilo. Zkuste to prosím znovu nebo napište na email.';
    })
    .finally(() => {
        submitBtn.disabled = false;
    });
});

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
