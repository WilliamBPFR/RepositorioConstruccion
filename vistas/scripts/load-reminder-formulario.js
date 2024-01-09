function obtenerValorCookie(nombre) {
  const valor = `; ${document.cookie}`
  const partes = valor.split(`; ${nombre}=`)
  if (partes.length === 2) return partes.pop().split(';').shift()
  return null
}

document.addEventListener('DOMContentLoaded', function () {
  const idUsuario = obtenerValorCookie('idUsuario')
  const idInput = document.getElementById('id_usuario')
  idInput.value = decodeURIComponent(idUsuario)
})



const urlParams = new URLSearchParams(window.location.search)
const encodedData = urlParams.get('data')
if (encodedData) {
  const decodedData = JSON.parse(decodeURIComponent(encodedData))
  console.log("decodedData",decodedData)
  const titulo = document.getElementById('titulo')
  const descripcion = document.getElementById('descripcion')
  const id = document.getElementById('iddatos')
  const fecha = document.getElementById('fecha')
  const email = document.getElementById('email')
  id.value = decodedData._id
  titulo.value = decodedData.title
  descripcion.value = decodedData.message
  fecha.value = decodedData.fecha.split('T')[0]
  email.value = decodedData.email
} else {
  console.log('No data found')
  console.log("encodedData",encodedData)
}


