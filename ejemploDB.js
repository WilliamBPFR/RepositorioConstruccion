const DATABASE = require('./database')

async function example () {
  const Nota = new DATABASE({})

  Nota.title = 'Juego'
  Nota.email = 'johnny.ventura@gmail.com'
  Nota.message = 'palomo'
  Nota.fecha = '08/07/2023'

  try {
    const product = await Nota.save()
    console.log(product)
  } catch (error) {
    console.log(error)
  }
}

example()
