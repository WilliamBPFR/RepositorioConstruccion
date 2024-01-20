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
  const id = document.getElementById('id')
  const fecha = document.getElementById('fecha')
  const email = document.getElementById('email')
  console.log("decodedData",decodedData)
  id.value = decodedData.id_recordatorio
  titulo.value = decodedData.titulo_nota
  descripcion.value = decodedData.mensaje_nota
  fecha.value = decodedData.fecha_recordatorio.split('T')[0]
  email.value = decodedData.email_nota
} else {
  console.log('No data found')
  console.log("encodedData",encodedData)
}


