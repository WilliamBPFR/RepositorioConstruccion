// logout.js
// eslint-disable-next-line space-before-function-paren
function obtenerValorCookie(nombre) {
  const valor = `; ${document.cookie}`
  const partes = valor.split(`; ${nombre}=`)
  if (partes.length === 2) return partes.pop().split(';').shift()
  return null
}

// eslint-disable-next-line space-before-function-paren
function cerrarSesion() {
  // Borrar las cookies
  document.cookie = 'token=; Max-Age=0; path=/;'
  document.cookie = 'nombreUsuario=; Max-Age=0; path=/;'

  window.location.href = 'login.html'
}

document.addEventListener('DOMContentLoaded', function () {
  const nombreUsuario = obtenerValorCookie('nombreUsuario')
  const logoutBtn = document.getElementById('logoutBtn')
  if (nombreUsuario && logoutBtn) {
    logoutBtn.textContent = `Cerrar sesión (${decodeURIComponent(nombreUsuario)})`
    logoutBtn.addEventListener('click', cerrarSesion)
  }
})
