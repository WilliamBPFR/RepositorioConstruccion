/* eslint-disable camelcase */
document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault()

  const nombre = document.getElementById('nombre').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const fechaNacimiento = document.getElementById('fechaNacimiento').value
  const fechaNacimientoDate = new Date(fechaNacimiento)
  const fechaNacimientoISO = fechaNacimientoDate.toISOString()

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, email, contrasena: password, fecha_nacimiento: fechaNacimientoISO })
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) })
      }
      return response.json()
    })
    .then(data => {
      console.log('Registro exitoso:', data)
      window.location.href = 'login.html'
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('Error en el registro: ' + error.message)
    })
})
