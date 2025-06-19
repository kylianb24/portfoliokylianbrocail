// Variables globales
let isLoading = true;
let scrollPosition = 0;
let ticking = false;

// Initialisation du site
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Fonction d'initialisation principale
function initializeWebsite() {
    // Masquer le loading après le chargement
    setTimeout(() => {
        hideLoading();
    }, 1000);

    // Initialiser les fonctionnalités
    initializeNavigation();
    initializeScrollAnimations();
    initializeParticleSystem();
    initializeTypingEffect();
    initializeBackToTop();
    initializeLazyLoading();
    initializePageTransitions();
    
    // Animations spécifiques à la page d'accueil
    if (isHomePage()) {
        initializeHeroAnimations();
        initializeCounterAnimations();
    }
}

// Gestion du loading
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hide');
        setTimeout(() => {
            loading.remove();
        }, 500);
    }
    isLoading = false;
}

// Vérifier si on est sur la page d'accueil
function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname === '';
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    // Effet de scroll sur la navbar
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll(navbar);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Menu mobile
    if (mobileMenu && mobileNavMenu) {
        mobileMenu.addEventListener('click', () => {
            toggleMobileMenu(mobileNavMenu, mobileMenu);
        });
    }

    // Smooth scroll pour les liens internes
    initializeSmoothScroll();
}

function handleNavbarScroll(navbar) {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function toggleMobileMenu(mobileNavMenu, mobileMenu) {
    const isOpen = mobileNavMenu.style.display === 'flex';
    
    if (isOpen) {
        mobileNavMenu.style.display = 'none';
        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
        mobileNavMenu.style.display = 'flex';
        mobileMenu.innerHTML = '<i class="fas fa-times"></i>';
    }
}

function initializeSmoothScroll() {
    // Pour les liens internes sur la même page
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                smoothScrollTo(offsetTop, 1000);
            }
        });
    });
}

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// Animations au scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animation spéciale pour les listes
                if (entry.target.classList.contains('info-list')) {
                    animateListItems(entry.target);
                }
                
                // Animation spéciale pour les cartes
                if (entry.target.classList.contains('quick-access-grid')) {
                    animateCards(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function animateListItems(listContainer) {
    const items = listContainer.querySelectorAll('.animate-list-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
}

function animateCards(container) {
    const cards = container.querySelectorAll('.quick-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}

// Système de particules avancé
function initializeParticleSystem() {
    if (!isHomePage()) return;
    
    const hero = document.querySelector('.hero');
    if (!hero) return;

    createFloatingElements(hero);
    createMouseFollower();
}

function createFloatingElements(container) {
    const elements = ['💻', '🔒', '🌐', '⚡', '🚀', '💡'];
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            createFloatingElement(container, element);
        }, index * 500);
    });
}

function createFloatingElement(container, content) {
    const element = document.createElement('div');
    element.innerHTML = content;
    element.style.cssText = `
        position: absolute;
        font-size: 20px;
        opacity: 0.3;
        pointer-events: none;
        z-index: 1;
        animation: float 8s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    // Position aléatoire
    element.style.left = Math.random() * 100 + '%';
    element.style.top = Math.random() * 100 + '%';
    
    container.appendChild(element);
    
    // Retirer après animation
    setTimeout(() => {
        if (element.parentNode) {
            element.remove();
        }
    }, 8000);
}

function createMouseFollower() {
    const follower = document.createElement('div');
    follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX - 10 + 'px';
        follower.style.top = e.clientY - 10 + 'px';
        follower.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
    });
}

// Effet de frappe
function initializeTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing');
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        element.innerHTML = '';
        typeText(element, text, speed);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const cursor = '<span class="typing-cursor">|</span>';
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + cursor;
            i++;
            setTimeout(type, speed);
        } else {
            // Retirer le curseur après la frappe
            setTimeout(() => {
                element.innerHTML = text;
            }, 1000);
        }
    }
    
    type();
}

// Bouton retour en haut
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        smoothScrollTo(0, 800);
    });
}

// Lazy loading des images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
                
                // Ajouter effet de fade in
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Transitions entre pages
function initializePageTransitions() {
    // Ajouter effet de chargement lors des changements de page
    document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Vérifier si c'est un lien externe
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                return; // Laisser le comportement par défaut pour les liens externes
            }
            
            // Ajouter effet de transition
            if (!href.startsWith('#')) {
                createPageTransition();
            }
        });
    });
}

function createPageTransition() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #2563eb, #1d4ed8);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner" style="margin: 0 auto 1rem;"></div>
            <p>Chargement...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Afficher l'overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}

// Animations spécifiques à la page d'accueil
function initializeHeroAnimations() {
    const heroAvatar = document.querySelector('.hero-avatar');
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroAvatar) {
        // Animation de pulsation au survol
        heroAvatar.addEventListener('mouseenter', () => {
            heroAvatar.style.transform = 'scale(1.1)';
            heroAvatar.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.5)';
        });
        
        heroAvatar.addEventListener('mouseleave', () => {
            heroAvatar.style.transform = 'scale(1)';
            heroAvatar.style.boxShadow = 'none';
        });
    }
    
    // Effet de parallaxe sur le héro
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Animations de compteur
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, 0, target, 2000);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 16);
}

// Gestion des formulaires
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Animation de chargement
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;
    
    // Simulation d'envoi
    setTimeout(() => {
        showNotification('Message envoyé avec succès !', 'success');
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Couleurs selon le type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Retirer après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Gestion du mode sombre (optionnel)
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isNowDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDark);
    });
}

// Effets de particules interactifs
function initializeInteractiveParticles() {
    if (!isHomePage()) return;
    
    document.addEventListener('mousemove', (e) => {
        createTrailParticle(e.clientX, e.clientY);
    });
}

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${getRandomColor()};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
        animation: particleFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function getRandomColor() {
    const colors = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Animation CSS pour les particules
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-50px);
        }
    }
    
    .typing-cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);

// Gestion des erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Temps de chargement:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
}

// Initialiser le monitoring de performance
logPerformance();

// Export des fonctions pour usage externe
window.PortfolioJS = {
    showNotification,
    smoothScrollTo,
    createPageTransition,
    animateCounter
};
