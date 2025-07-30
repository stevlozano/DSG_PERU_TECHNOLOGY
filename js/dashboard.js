const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');
const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

// Crear overlay para móvil
const overlay = document.createElement('div');
overlay.className = 'mobile-overlay';
document.body.appendChild(overlay);

// Navegación sidebar
sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
        
        // Cerrar sidebar en móvil después de seleccionar
        if (window.innerWidth <= 576) {
            sideBar.classList.remove('show');
            overlay.classList.remove('show');
        }
    });
});

// Toggle menú
menuBar.addEventListener('click', () => {
    if (window.innerWidth <= 576) {
        sideBar.classList.toggle('show');
        overlay.classList.toggle('show');
    } else {
        sideBar.classList.toggle('close');
    }
});

// Cerrar menú al hacer click en overlay
overlay.addEventListener('click', () => {
    sideBar.classList.remove('show');
    overlay.classList.remove('show');
});

// Búsqueda móvil
searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

// Responsive resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth <= 576) {
        sideBar.classList.remove('close');
        overlay.classList.remove('show');
        sideBar.classList.remove('show');
    } else if (window.innerWidth <= 768) {
        sideBar.classList.add('close');
        overlay.classList.remove('show');
    } else {
        sideBar.classList.remove('close');
        overlay.classList.remove('show');
    }
    
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

// Theme toggle
const toggler = document.getElementById('theme-toggle');
toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});