// Realizar una petición AJAX para obtener los datos
function obtenerValorCookie(nombre) {
  const valor = `; ${document.cookie}`
  const partes = valor.split(`; ${nombre}=`)
  if (partes.length === 2) return partes.pop().split(';').shift()
  return null
}

const xhr = new XMLHttpRequest()
const idUsuario = obtenerValorCookie('idUsuario')
const id_usuario = decodeURIComponent(idUsuario)
console.log("id_usuario",id_usuario)
xhr.open('GET', `/historial-data/${id_usuario}`, true)
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText)
    const parentElement = document.getElementById('lista')
    if(!data){
      const titulo = document.createElement('li')
      const tituloSpan = document.createElement('span')
      titulo.textContent = "No hay recordatorios"
      parentElement.appendChild(titulo)
      titulo.appendChild(tituloSpan)
    }
    else{
      data.forEach(function (element) {
        console.log("elemennntosss")
        console.log(element)
        const titulo = document.createElement('li')
        const tituloSpan = document.createElement('span')
        const divButtons = document.createElement('div')
        const editarButton = document.createElement('button')
        const eliminarButton = document.createElement('button')
        titulo.textContent = element.titulo_nota
        console.log(element.titulo_nota)
        titulo.className = 'list-group-item'
        divButtons.className = 'btn-group'
        divButtons.role = 'group'
        editarButton.className = 'btn btn-primary btn-action'
        editarButton.textContent = 'Editar'
        eliminarButton.className = 'btn btn-danger btn-action'
        eliminarButton.textContent = 'Eliminar'
        parentElement.appendChild(titulo)
        titulo.appendChild(tituloSpan)
        titulo.appendChild(divButtons)
        divButtons.appendChild(editarButton)
        divButtons.appendChild(eliminarButton)
        editarButton.addEventListener('click', function () {
          event.stopPropagation() // Evita que el evento de clic se propague al elemento padre (el título)
          window.location.href = 'cargar-recordatorio/' + element.id_recordatorio
        })
        eliminarButton.addEventListener('click', function () {
          event.stopPropagation()
          window.location.href = 'eliminar-recordatorio/' + element.id_recordatorio
        })
        titulo.addEventListener('click', function () {
          window.location.href = 'cargar-recordatorio/' + element._id_recordatorio
        })
      })

    }
    
  }
}
xhr.send()
