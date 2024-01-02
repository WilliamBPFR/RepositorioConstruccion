const mongooseClient = require('mongoose')
const config = require('./../config.json')
mongooseClient.connect(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos')
    // Resto de tu código aquí
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err)
  })

const ReminderSchema = mongooseClient.Schema({
  title: String,
  email: String,
  message: String,
  fecha: Date
})

const Reminder = mongooseClient.model('Reminder', ReminderSchema)

module.exports = Reminder
