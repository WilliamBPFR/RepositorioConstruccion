const express = require('express')
const nodemailer = require('nodemailer')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./../config')
const dotenv = require('dotenv')
dotenv.config();
const { graphql, buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
//const Reminder = require('./../db/database')
const app = express()
app.set('view engine', 'html')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
//app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './../vistas')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(req.method + ' : ' + req.url)
  next()
})
app.set('views', path.join(__dirname, 'vistas'))

// Define your GraphQL schema
const schema = buildSchema(`

  scalar DateTime
  type Reminder {
    _id: ID!
    title: String!
    email: String!
    message: String!
    fecha: String!
    usuario: Usuario!
  }

  type Usuario {
    id_usuario: Int!
    nombre: String!
    email: String!
    hash_contrasena: String!
    fecha_nacimiento: DateTime
    fecha_creacion: DateTime!
    recordatorios: [Reminder!]!
  }

  type Query {
    getReminder(_id: ID!): Reminder
    getAllReminders: [Reminder]
    getUser(id_usuario: Int!): Usuario
  }

  type Mutation {
    createReminder(title: String!, email: String!, message: String!, fecha: String!, id_usuario: Int!): Reminder
    updateReminder(_id: ID!, title: String!, email: String!, message: String!, fecha: String!): Reminder
    deleteReminder(_id: ID!): Boolean
  }
`);

// Define your resolvers
const root = {
  getReminder: async ({ _id }) => {
    return await prisma.recordatorio.findUnique({
      where: { _id },
      include: { usuario: true },
    });
  },
  getAllReminders: async () => {
    return await prisma.recordatorio.findMany({
      include: { usuario: true },
    });
  },
  getUser: async ({ id_usuario }) => {
    return await prisma.usuario.findUnique({
      where: { id_usuario },
      include: { recordatorios: true },
    });
  },
  createReminder: async ({ title, email, message, fecha, id_usuario }) => {
    const reminder = await prisma.recordatorio.create({
      data: {
        title,
        email,
        message,
        fecha,
        usuario: { connect: { id: id_usuario } },
      },
    });
    return reminder;
  },
  updateReminder: async ({ _id, title, email, message, fecha }) => {
    const reminder = await prisma.recordatorio.update({
      where: { _id },
      data: {
        title,
        email,
        message,
        fecha,
      },
    });
    return reminder;
  },
  deleteReminder: async ({ _id }) => {
    return await prisma.recordatorio.delete({
      where: { _id },
    });
  },
};

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL for testing
}));

// Other app configurations...

const port = config.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Lógica para cerrar el servidor
function shutdown() {
  console.log('Cerrando el servidor HTTP...');
  server.close(() => {
    console.log('El servidor HTTP se ha cerrado correctamente.');
    process.exit(0); // Finalizar la ejecución del proceso
  });
}
process.on('SIGINT', shutdown);

// Resto del código de la aplicación...

// Eliminar un recordatorio por su ID
app.get('/eliminar-recordatorio/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    await graphql(schema, `mutation { deleteReminder(_id: "${_id}") }`, root);
    console.log('Recordatorio eliminado:', _id);
    res.redirect('historial.html');
  } catch (err) {
    console.log(err);
    next(err);
  }
});
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Función para enviar el correo electrónico
async function sendEmail (asunto, mensaje, destinatario) {
  const mailOptions = {
    from: process.env.USER,
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
// Crear o actualizar un recordatorio
app.post('/posted-new-reminder', async (req, res, next) => {
  const { titulo, email, descripcion, fecha, id } = req.body;
  console.log(req.body);
  try {
    if (id === undefined) {
      // Crear nuevo recordatorio
      const result = await graphql(schema, `mutation { createReminder(title: "${titulo}", email: "${email}", message: "${descripcion}", fecha: "${fecha}", id_usuario: ${id}) { _id } }`, root);
      console.log('Nuevo recordatorio creado:', result.data.createReminder);
      sendEmail(titulo, descripcion, email);
    } else {
      // Actualizar un recordatorio existente
      const result = await graphql(schema, `mutation { updateReminder(_id: "${id}", title: "${titulo}", email: "${email}", message: "${descripcion}", fecha: "${fecha}" ) { _id } }`, root);
      console.log('Recordatorio actualizado:', result.data.updateReminder._id);
    }
    
    res.redirect('historial.html');
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.get('/', (req, res, next) => {
  res.redirect('index.html')
})

// Obtener todos los recordatorios
app.get('/historial-data', async (req, res, next) => {
  try {
    
    const result = await graphql(schema, `query { getAllReminders { _id, title, email, message, fecha } }`, root);
    
    res.json(result.data.getAllReminders);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Obtener un recordatorio por su ID y redireccionar
app.get('/cargar-recordatorio/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = await graphql(schema, `query { getReminder(_id: "${_id}") { _id } }`, root);
    console.log("llegue");
    const encodedData = encodeURIComponent(JSON.stringify(result.data.getReminder));
    const url = '/cargar-recordatorio/' + _id;
    const redirectUrl = req.originalUrl.replace(url, '');
    res.redirect('/' + redirectUrl + 'formulario.html?data=' + encodedData);
  } catch (err) {
    console.log(err);
    next(err);
  }
});



/* app.route("/historial.html").get(async (req, res, next) => {
    try {
        const reminders = await Reminder.find({});
        console.log(reminders);
        res.render("historial", { reminders });
        const parentElement = document.getElementById('lista');

        const Data = document.map(value => value);
        Data.forEach(element => {
            const titulo = document.createElement("li");
            titulo.textContent = element.title;
            parentElement.appendChild(titulo);
        });
      } catch(err) {
        console.log(err);
        next(err);
      }
}); */

// TEXTO DE VISUALIZACION
/* app
  .route("/notes-add")
  .get((req, res, next) => {
    res.render("notes-add");
  })
  .post(async (req, res, next) => {
    console.log(req.body);
    const Note = new Notes({});

    Note.title = req.body.title;
    Note.description = req.body.description;
    //save notes first
    try {
      const product = await Note.save();
      console.log(product);
      res.redirect("/index");
    } catch(err) {
      console.log(err);
      next(err);
    }
  });

 // Esquema
  const ReminderSchema = mongooseClient.Schema({
    title: String,
    email: String,
    message: String,
    fecha: Date,
  }); */

  module.exports = app;