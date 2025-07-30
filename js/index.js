// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Theme management
    initializeTheme();
    
    // Navbar functionality
    initializeNavbar();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Form handling
    initializeContactForm();
    
    // Animations
    initializeAnimations();
    
    // Mobile menu
    initializeMobileMenu();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply the theme
    setTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
    }
}

// Navbar Functionality
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Update active nav link based on scroll position
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span>Enviando...</span>';
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    contactForm.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    lucide.createIcons();
                }, 2000);
            }
        });
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'alert-circle';
        case 'warning': return 'alert-triangle';
        default: return 'info';
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card, .reason-card, .industry-card, .mv-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                const suffix = counter.textContent.replace(/[\d]/g, '');
                
                animateCounter(counter, 0, target, 2000, suffix);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, suffix = '') {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function requestDemo() {
    showNotification('¡Excelente! Te contactaremos pronto para programar tu demo gratuita.', 'success');
    
    // Scroll to contact form
    setTimeout(() => {
        scrollToSection('contacto');
    }, 1000);
}

function redirectToLogin() {
    // Check if we're on the about page or main page
    const isAboutPage = window.location.pathname.includes('about.html');
    
    // Redirect to the dashboard login
    if (isAboutPage) {
        window.location.href = '../../src/formularios/login_prueba.html'; // This would be your React app
    } else {
        window.location.href = '../../src/formularios/login_prueba.html'; // This would be your React app
    }
}

function redirectToContact() {
    if (window.location.pathname.includes('about.html')) {
        window.location.href = 'index.html#contacto';
    } else {
        scrollToSection('contacto');
    }
}

// Service card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.service-btn')) {
        const serviceCard = e.target.closest('.service-card');
        const serviceTitle = serviceCard.querySelector('.service-title').textContent;
        
        if (e.target.closest('.btn-primary')) {
            requestDemo();
        } else {
            showNotification(`Obtén más información sobre nuestras soluciones para ${serviceTitle}`, 'info');
            setTimeout(() => {
                scrollToSection('contacto');
            }, 1000);
        }
    }
});

// Pricing card interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.pricing-btn')) {
        const pricingCard = e.target.closest('.pricing-card');
        const planTitle = pricingCard.querySelector('.pricing-title').textContent;
        
        if (e.target.textContent.includes('Demo') || e.target.textContent.includes('Gratis')) {
            requestDemo();
        } else if (e.target.textContent.includes('Ventas')) {
            showNotification(`Te conectaremos con un especialista para el plan ${planTitle}`, 'info');
            setTimeout(() => {
                scrollToSection('contacto');
            }, 1000);
        } else {
            requestDemo();
        }
    }
});

// Add floating animation to hero cards
function startFloatingAnimation() {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
}

// Initialize floating animation when page loads
window.addEventListener('load', startFloatingAnimation);

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to cards
document.addEventListener('mouseenter', function(e) {
    if (e.target.closest('.service-card, .pricing-card, .reason-card, .feature-item')) {
        e.target.closest('.service-card, .pricing-card, .reason-card, .feature-item').style.transform = 'translateY(-8px)';
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target.closest('.service-card, .pricing-card, .reason-card, .feature-item')) {
        e.target.closest('.service-card, .pricing-card, .reason-card, .feature-item').style.transform = 'translateY(0)';
    }
}, true);

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn') && !e.target.closest('.theme-toggle, .nav-toggle, .notification-close')) {
        const button = e.target.closest('.btn');
        const originalContent = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span>Cargando...</span>';
        button.disabled = true;
        
        // Add spin animation to loader
        const loader = button.querySelector('[data-lucide="loader-2"]');
        if (loader) {
            loader.style.animation = 'spin 1s linear infinite';
        }
        
        lucide.createIcons();
        
        // Reset after 1 second (for demo purposes)
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
            lucide.createIcons();
        }, 1000);
    }
});

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--background);
            border-top: 1px solid var(--border);
            flex-direction: column;
            gap: 0;
            padding: var(--spacing-lg);
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
            opacity: 0;
            visibility: hidden;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-link {
            padding: var(--spacing-md) 0;
            border-bottom: 1px solid var(--border);
            display: block;
            width: 100%;
        }
        
        .nav-link:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Add smooth reveal animations for timeline items
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
}

// Initialize timeline animations if on about page
if (window.location.pathname.includes('about.html')) {
    initializeTimelineAnimations();
}

console.log('DSG PERU TECHNOLOGY Landing Page - Loaded Successfully! 🚀');