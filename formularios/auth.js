// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background-color: #10B981;' : ''}
        ${type === 'error' ? 'background-color: #EF4444;' : ''}
        ${type === 'info' ? 'background-color: #3B82F6;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Cerrar al hacer click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Función actualizada para el registro
async function handleRegister(userData) {
    try {
        showNotification('Registrando usuario...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('¡Registro exitoso! Redirigiendo...', 'success');
            
            setTimeout(() => {
                if (data.user.userType === 'admin') {
                    window.location.href = '../dashboard/dashboard.html';
                } else {
                    window.location.href = '../dashboard/dashboard.html';
                }
            }, 1500);
        } else {
            showNotification(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión con el servidor', 'error');
    }
}

// Función actualizada para el login
async function handleLogin(email, password, userType) {
    try {
        showNotification('Iniciando sesión...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
                // Remover user_type del body ya que el backend no lo procesa
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Verificar que el tipo de usuario coincida con el solicitado
            // CORREGIR: user_Type -> user_type
            if (data.user.user_type !== userType) {
                showNotification('Tipo de usuario incorrecto para este acceso', 'error');
                return;
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('loginTime', new Date().getTime());
            
            showNotification('¡Login exitoso! Redirigiendo...', 'success');
            
            setTimeout(() => {
                // CORREGIR: user_Type -> user_type
                if (data.user.user_type === 'admin') {
                    window.location.href = '../dashboard/dashboard.html';
                } else {
                    window.location.href = '../dashboard/dashboard.html';
                }
            }, 1500);
        } else {
            showNotification(data.error || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión con el servidor', 'error');
    }
}

// Función para validar formulario
function validateForm(formData) {
    const errors = [];
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.push('El nombre completo debe tener al menos 2 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email inválido');
    }
    
    if (!formData.password || formData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (formData.password !== formData.confirmPassword) {
        errors.push('Las contraseñas no coinciden');
    }
    
    if (formData.userType === 'business') {
        if (!formData.companyName || formData.companyName.trim().length < 2) {
            errors.push('El nombre de la empresa es requerido');
        }
        
        if (!formData.businessCategory) {
            errors.push('La categoría de negocio es requerida');
        }
    }
    
    return errors;
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Manejo de selección de tipo de cuenta
    const businessTypeBtn = document.getElementById('business-type');
    const adminTypeBtn = document.getElementById('admin-type');
    const businessFields = document.getElementById('business-fields');
    const submitBtn = document.getElementById('submit-btn');
    
    let selectedAccountType = 'business'; // Por defecto
    
    // Función para actualizar selección de tipo de cuenta
    function updateAccountType(type) {
        selectedAccountType = type;
        
        // Remover clase selected de ambos botones
        businessTypeBtn.classList.remove('selected');
        adminTypeBtn.classList.remove('selected');
        
        // Agregar clase selected al botón correspondiente
        if (type === 'business') {
            businessTypeBtn.classList.add('selected');
            businessFields.style.display = 'block';
            submitBtn.textContent = 'Crear Cuenta Usuario Empresarial';
        } else {
            adminTypeBtn.classList.add('selected');
            businessFields.style.display = 'none';
            submitBtn.textContent = 'Crear Cuenta Administrador';
        }
    }
    
    // Event listeners para tipo de cuenta
    if (businessTypeBtn) {
        businessTypeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateAccountType('business');
        });
    }
    
    if (adminTypeBtn) {
        adminTypeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateAccountType('admin');
        });
    }
    
    // Manejo de toggles de contraseña
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
            } else {
                targetInput.type = 'password';
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
            }
        });
    });
    
    // Manejo del formulario de registro
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Deshabilitar botón de submit
            const submitButton = document.getElementById('submit-btn');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Registrando...';
            
            try {
                // Recopilar datos del formulario
                const formData = {
                    userType: selectedAccountType
                };
                
                if (selectedAccountType === 'business') {
                    const nombre = document.getElementById('nombre').value.trim();
                    const apellido = document.getElementById('apellido').value.trim();
                    formData.fullName = `${nombre} ${apellido}`.trim();
                    formData.email = document.getElementById('email').value.trim();
                    formData.companyName = document.getElementById('company-name').value.trim();
                    formData.businessCategory = document.getElementById('business-category').value;
                    formData.phone = document.getElementById('phone').value.trim();
                } else {
                    // Para admin, solo necesitamos email y password
                    formData.fullName = 'Administrador';
                    formData.email = document.getElementById('email').value.trim();
                }
                
                formData.password = document.getElementById('password').value;
                formData.confirmPassword = document.getElementById('confirm-password').value;
                
                // Validar formulario
                const errors = validateForm(formData);
                if (errors.length > 0) {
                    showNotification(errors[0], 'error');
                    return;
                }
                
                // Remover confirmPassword antes de enviar
                delete formData.confirmPassword;
                
                // Enviar datos
                await handleRegister(formData);
                
            } catch (error) {
                console.error('Error en el formulario:', error);
                showNotification('Error procesando el formulario', 'error');
            } finally {
                // Rehabilitar botón
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
    
    // Manejo de botones sociales (placeholder)
    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Función de registro social próximamente disponible', 'info');
        });
    });
});

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token || !user || !loginTime) {
        return false;
    }
    
    // Verificar si la sesión ha expirado (24 horas)
    const currentTime = new Date().getTime();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
    
    if (currentTime - parseInt(loginTime) > sessionDuration) {
        logout();
        return false;
    }
    
    return true;
}

// Función para verificar permisos de administrador
function isAdmin() {
    const user = getCurrentUser();
    return user && user.userType === 'admin';
}

// Función para obtener datos del usuario
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Función para logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login_prueba.html';
}

// Exportar funciones para uso global
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.showNotification = showNotification;
window.isAdmin = isAdmin;