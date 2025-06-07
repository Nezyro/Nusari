export function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.className = 'bg-gray-800 shadow sticky top-0 z-50 w-full';
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  navbar.innerHTML = `
    <div class="max-w-screen-xl mx-auto flex items-center h-16 px-4 w-full overflow-visible flex-nowrap gap-4">
      <!-- Menú hamburguesa -->
      <button id="toggleSidebar" class="text-white text-2xl hover:text-teal-400 focus:outline-none w-10 flex justify-center transition-colors duration-300">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Logo -->
      <div class="w-32">
        <a href="/gallery.html" class="text-2xl font-bold text-teal-400 whitespace-nowrap hover:text-teal-300 transition-colors duration-300">Nusari</a>
      </div>

      <!-- Buscador -->
      <div class="flex-grow max-w-[500px] min-w-[200px] px-4">
        <div class="relative">
          <input type="text" placeholder="Buscar..." class="w-full bg-gray-700 text-white rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300">
            <i class="fas fa-search fa-lg"></i>
          </button>
        </div>
      </div>

      ${token ? `
        <!-- Perfil (visible cuando hay sesión) -->
        <div class="relative" id="profileDropdown">
          <button id="profileBtn" class="flex items-center space-x-2 focus:outline-none p-2">
            <img src="${user?.profileImage ? `/uploads/${user.profileImage}` : 'https://via.placeholder.com/32'}" alt="Perfil" 
              class="w-8 h-8 rounded-full border-2 border-teal-400" />
            <i class="fas fa-caret-down text-gray-400"></i>
          </button>

          <div id="profileMenu" class="hidden absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-50 divide-y divide-gray-600">
            <a href="/profile" class="block px-4 py-2 hover:bg-gray-600 transition-colors duration-300">
              <i class="fas fa-user mr-2"></i>Mi Perfil
            </a>
            <a href="/settings" class="block px-4 py-2 hover:bg-gray-600 transition-colors duration-300">
              <i class="fas fa-cog mr-2"></i>Configuración
            </a>
            <a href="#" id="logoutButton" class="block px-4 py-2 hover:bg-gray-600 transition-colors duration-300">
              <i class="fas fa-sign-out-alt mr-2"></i>Cerrar sesión
            </a>
          </div>
        </div>
      ` : `
        <!-- Botón de login (visible cuando no hay sesión) -->
        <a href="/login.html" id="loginButton" class="text-white hover:text-teal-400 transition-colors duration-300">
          Iniciar Sesión
        </a>
      `}
    </div>
  `;

  // Setup dropdown functionality
  const profileBtn = navbar.querySelector('#profileBtn');
  const profileMenu = navbar.querySelector('#profileMenu');
  
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        profileMenu.classList.add('hidden');
      }
    });
  }

  // Setup logout functionality
  const logoutButton = navbar.querySelector('#logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    });
  }

  return navbar;
} 