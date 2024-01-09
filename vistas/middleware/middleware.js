/* eslint-disable space-before-function-paren */
function verificarAutenticacion() {
  const token = obtenerTokenDeCookies('token')

  if (!token) {
    window.location.href = 'login.html'
    return
  }

  if (window.location.pathname.endsWith('login.html')) {
    window.location.href = 'index.html'
  }
}

function obtenerTokenDeCookies(nombre) {
  const valor = `; ${document.cookie}`
  const partes = valor.split(`; ${nombre}=`)
  if (partes.length === 2) return partes.pop().split(';').shift()
  return null
}

document.addEventListener('DOMContentLoaded', verificarAutenticacion)
