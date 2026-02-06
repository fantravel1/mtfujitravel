/**
 * MtFujiTravel.com - Main JavaScript
 * Mobile-first, performance-optimized interactions
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initMobileNav();
        initSmoothScroll();
        initHeaderScroll();
        initFaqAccessibility();
        initLazyImages();
        initCarouselSwipe();
    }

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = navMenu?.querySelectorAll('a');

        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('is-open');
            this.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks?.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('is-open') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    /**
     * Header Background on Scroll
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }

            // Hide/show header on scroll direction (optional, disabled by default)
            // if (currentScroll > lastScroll && currentScroll > 200) {
            //     header.style.transform = 'translateY(-100%)';
            // } else {
            //     header.style.transform = 'translateY(0)';
            // }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * FAQ Accessibility Enhancements
     */
    function initFaqAccessibility() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const summary = item.querySelector('summary');

            // Announce state changes
            summary?.addEventListener('click', () => {
                setTimeout(() => {
                    const isOpen = item.hasAttribute('open');
                    summary.setAttribute('aria-expanded', isOpen);
                }, 0);
            });

            // Keyboard navigation
            summary?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Native behavior handles this
                }
            });
        });
    }

    /**
     * Lazy Loading Images with Intersection Observer
     */
    function initLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Touch Swipe for Carousels
     */
    function initCarouselSwipe() {
        const carousels = document.querySelectorAll('.itinerary-cards');

        carousels.forEach(carousel => {
            let startX, startScrollLeft, isDragging = false;

            carousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.pageX - carousel.offsetLeft;
                startScrollLeft = carousel.scrollLeft;
                carousel.style.cursor = 'grabbing';
            });

            carousel.addEventListener('mouseleave', () => {
                isDragging = false;
                carousel.style.cursor = 'grab';
            });

            carousel.addEventListener('mouseup', () => {
                isDragging = false;
                carousel.style.cursor = 'grab';
            });

            carousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 1.5;
                carousel.scrollLeft = startScrollLeft - walk;
            });

            // Touch events for mobile
            let touchStartX;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            carousel.addEventListener('touchmove', (e) => {
                if (!touchStartX) return;
                const touchEndX = e.touches[0].clientX;
                const diff = touchStartX - touchEndX;
                carousel.scrollLeft += diff * 0.5;
                touchStartX = touchEndX;
            }, { passive: true });

            carousel.addEventListener('touchend', () => {
                touchStartX = null;
            }, { passive: true });
        });
    }

    /**
     * Animate on Scroll (optional enhancement)
     */
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animatedElements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Form Validation (Newsletter)
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('.newsletter-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]');

                if (email && isValidEmail(email.value)) {
                    // Success state
                    const btn = form.querySelector('button');
                    const originalText = btn.textContent;
                    btn.textContent = 'Subscribed!';
                    btn.disabled = true;
                    email.value = '';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 3000);
                }
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Language Selector
     */
    function initLanguageSelector() {
        const langSelect = document.querySelector('.lang-select');

        langSelect?.addEventListener('change', function() {
            const lang = this.value;
            if (lang === 'en') {
                window.location.href = '/';
            } else {
                window.location.href = '/' + lang + '/';
            }
        });
    }

    /**
     * Performance: Preload critical resources
     */
    function preloadResources() {
        // Preload fonts if not already loaded
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em "Noto Sans JP"'),
                document.fonts.load('700 1em "Noto Sans JP"'),
                document.fonts.load('700 1em "Playfair Display"')
            ]).then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        }
    }

    // Initialize additional features
    initFormValidation();
    initLanguageSelector();
    preloadResources();

})();
