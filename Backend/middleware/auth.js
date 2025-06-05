// Función para verificar si el usuario está autenticado
async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:3000/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return false;
  }
}

// Función para actualizar la UI basada en el estado de autenticación
async function updateAuthUI() {
  const isAuthenticated = await checkAuth();
  const profileDropdown = document.getElementById('profileDropdown');
  const loginButton = document.getElementById('loginButton');

  if (isAuthenticated) {
    if (profileDropdown) profileDropdown.classList.remove('hidden');
    if (loginButton) loginButton.classList.add('hidden');
  } else {
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (loginButton) loginButton.classList.remove('hidden');
  }
}

// Función para proteger rutas que requieren autenticación
async function protectRoute() {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    window.location.href = '/login.html';
  }
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

// Exportar funciones
window.auth = {
  checkAuth,
  updateAuthUI,
  protectRoute,
  logout
};
