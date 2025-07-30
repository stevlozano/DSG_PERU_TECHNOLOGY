// Middleware de protección de autenticación
class AuthGuard {
    constructor() {
        this.init();
    }

    init() {
        // Verificar autenticación al cargar la página
        this.checkAuthentication();
        
        // Verificar periódicamente si el token sigue siendo válido
        setInterval(() => {
            this.validateToken();
        }, 300000); // Cada 5 minutos
    }

    checkAuthentication() {
        const token = localStorage.getItem('token');
        const user = this.getCurrentUser();
        const currentPath = window.location.pathname;

        // Si no hay token o usuario, redirigir al login
        if (!token || !user) {
            this.redirectToLogin();
            return false;
        }

        // Verificar si el usuario tiene permisos para la página actual
        if (!this.hasPermission(user, currentPath)) {
            this.showUnauthorizedError();
            this.redirectToLogin();
            return false;
        }

        return true;
    }

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    hasPermission(user, path) {
    // Temporalmente permitir acceso a todos los usuarios autenticados
    return true;
}

    async validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.redirectToLogin();
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/validate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token inválido');
            }

            const data = await response.json();
            if (!data.valid) {
                this.logout();
            }
        } catch (error) {
            console.error('Error validating token:', error);
            this.logout();
        }
    }

    showUnauthorizedError() {
        // Crear notificación de error
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: #EF4444;
            color: white;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <span>⚠️ Acceso denegado. No tienes permisos para acceder a esta página.</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    redirectToLogin() {
        // Limpiar datos de sesión
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir al login
        setTimeout(() => {
            window.location.href = '../formularios/login_prueba.html';
        }, 1000);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../formularios/login_prueba.html';
    }
}

// Protección contra manipulación del localStorage
(function() {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    // Detectar intentos de manipulación
    localStorage.setItem = function(key, value) {
        if (key === 'user' || key === 'token') {
            console.warn('Intento de manipulación detectado');
            // Opcional: reportar al servidor
            fetch('http://localhost:3001/api/security/report-manipulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'localStorage_manipulation',
                    key: key,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                })
            }).catch(err => console.error('Error reporting manipulation:', err));
        }
        return originalSetItem.apply(this, arguments);
    };
})();




// Exportar para uso global
window.AuthGuard = AuthGuard;