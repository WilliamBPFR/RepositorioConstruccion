document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, contrasena: password })
  })
    .then(response => {
      if (!response.ok) {
        // Manejar errores del servidor
        return response.text().then(text => { throw new Error(text) })
      }
      return response.json()
    })
    .then(data => {
      // Guardar el token en las cookies
      document.cookie = `token=${data.token};path=/;max-age=3600`
      document.cookie = `nombreUsuario=${encodeURIComponent(data.usuario.nombre)};path=/;max-age=3600`
      document.cookie = `idUsuario=${encodeURIComponent(data.usuario.id)};path=/;max-age=3600`
      console.log('Login exitoso:', data)
      window.location.href = 'index.html'
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('Error en el inicio de sesión: ' + error.message)
    })
})
