document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. MODAL LOGIC (Contact Popup) ---
    const modal = document.getElementById("contact-modal-overlay");
    const closeBtn = document.getElementById("close-contact-modal");
    const triggerBtns = document.querySelectorAll(".trigger-contact-modal");

    // Open Modal
    if (triggerBtns.length > 0) {
        triggerBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // Prevents default button/link behavior
                if (modal) {
                    modal.classList.add("is-visible");
                    document.body.style.overflow = "hidden"; // Stop background scrolling
                }
            });
        });
    }

    // Close Modal Button
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("is-visible");
            document.body.style.overflow = "auto";
        });
    }

    // Close if clicking outside the form
    if (modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("is-visible");
                document.body.style.overflow = "auto";
            }
        });
    }


    // --- 2. MOBILE HAMBURGER MENU ---
    const hamburger = document.querySelector(".hamburger");
    const navlinks = document.querySelector(".navlinks");

    if (hamburger && navlinks) {
        // Toggle Menu
        hamburger.addEventListener("click", () => {
            navlinks.classList.toggle("active");
            
            // Icon Toggle
            const icon = hamburger.querySelector("i");
            if (navlinks.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });

        // Close menu when a link is clicked (Better UX)
        navlinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navlinks.classList.remove("active");
                const icon = hamburger.querySelector("i");
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            });
        });
    }


    // --- 3. COUNTDOWN TIMER (Creative Con) ---
    const countdownElement = document.querySelector('.countdown');
    if (countdownElement) {
        const eventDate = new Date("December 31, 2025 00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const gap = eventDate - now;

            if (gap < 0) {
                // If elements exist, reset them
                if(document.getElementById("d-days")) {
                    document.getElementById("d-days").innerText = "00";
                    document.getElementById("d-hours").innerText = "00";
                    document.getElementById("d-mins").innerText = "00";
                    document.getElementById("d-secs").innerText = "00";
                }
                return;
            }

            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            // Update DOM only if elements exist
            if(document.getElementById("d-days")) {
                document.getElementById("d-days").innerText = Math.floor(gap / day).toString().padStart(2, '0');
                document.getElementById("d-hours").innerText = Math.floor((gap % day) / hour).toString().padStart(2, '0');
                document.getElementById("d-mins").innerText = Math.floor((gap % hour) / minute).toString().padStart(2, '0');
                document.getElementById("d-secs").innerText = Math.floor((gap % minute) / second).toString().padStart(2, '0');
            }
        };

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }


    // --- 4. TILT EFFECT ---
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length > 0) {
        tiltElements.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }


    // --- 5. GSAP ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Text Glitch Intro (Only if element exists)
        if (document.querySelector(".hero-left h1")) {
            gsap.from(".hero-left h1", {
                duration: 1.2,
                y: 50,
                opacity: 0,
                ease: "power3.out"
            });
        }

        // Fade in sections on scroll
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }
});

// --- 6. SERVICE SCROLL BUTTONS ---
// Defined globally so onclick="" in HTML works
function scrollServices(direction) {
    const container = document.querySelector('.services-container');
    if (!container) return; // Safety check if not on Home Page

    const scrollAmount = 340; // Width of card + gap
    
    if (direction === 'next') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}