// Realizar una petición AJAX para obtener los datos
const xhr = new XMLHttpRequest()
xhr.open('GET', '/historial-data', true)
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText)
    const parentElement = document.getElementById('lista')
    data.forEach(function (element) {
      const titulo = document.createElement('li')
      const tituloSpan = document.createElement('span')
      const divButtons = document.createElement('div')
      const editarButton = document.createElement('button')
      const eliminarButton = document.createElement('button')
      titulo.textContent = element.title
      console.log(element.title)
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
        window.location.href = 'cargar-recordatorio/' + element._id
      })
      eliminarButton.addEventListener('click', function () {
        event.stopPropagation()
        window.location.href = 'eliminar-recordatorio/' + element._id
      })
      titulo.addEventListener('click', function () {
        window.location.href = 'cargar-recordatorio/' + element._id
      })
    })
  }
}
xhr.send()
