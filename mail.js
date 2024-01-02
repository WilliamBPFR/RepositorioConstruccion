const nodemailer = require('nodemailer')
const config = require('./config')
// Configura la información de tu cuenta de correo electrónico
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.user,
    pass: config.pass
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Función para enviar el correo electrónico
async function sendEmail (asunto, mensaje, destinatario) {
  const mailOptions = {
    from: config.user,
    to: destinatario,
    subject: asunto,
    text: mensaje
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo electrónico:', error)
    } else {
      console.log('Correo electrónico enviado:', info.response)
    }
  })
}

sendEmail('Hola', 'HOLA', 'HOLA')
