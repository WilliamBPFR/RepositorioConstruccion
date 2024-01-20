/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable camelcase */
// NUEVALINEA #11
// Espero que este cambio se ponga en QA #2
const express = require('express')
const nodemailer = require('nodemailer')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./../config.json')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
dotenv.config();
let server;
const { graphql, buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
// const Reminder = require('./../db/database')
const app = express()
app.set('view engine', 'html')
const { PrismaClient } = require('@prisma/client')
const { Server } = require('http')
const port = config.PORT;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    }
  }
})
// app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './../public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(req.method + ' : ' + req.url)
  next()
})
app.set('views', path.join(__dirname, 'public'))

// Define your GraphQL schema
const schema = buildSchema(`

  scalar DateTime
  type Reminder {
    id_recordatorio: Int!
    titulo_nota: String!
    email_nota: String!
    mensaje_nota: String!
    fecha_recordatorio: DateTime!
    id_usuario: Int!
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
    getReminder(_id: Int!): Reminder
    getAllReminders(_id_usuario: Int!): [Reminder]
    getUser(id_usuario: Int!): Usuario
  }

  type Mutation {
    createReminder(titulo_nota: String!, email_nota: String!, mensaje_nota: String!, fecha_recordatorio: DateTime!, id_usuario: Int!): Reminder
    createUser(nombre: String!, email: String!, hash_contrasena: String!, fecha_nacimiento: DateTime!): Usuario
    updateReminder(_id: Int!, titulo_nota: String!, email_nota: String!, mensaje_nota: String!, fecha_recordatorio: DateTime!): Reminder
    deleteReminder(_id: Int!): Boolean
  }
`);

// Define your resolvers
const root = {
  getReminder: async ({ _id }) => {
    return await prisma.recordatorios.findUnique({
      where: { id_recordatorio: _id },
      include: { Usuario: true },
    });
  },
  getAllReminders: async ({ _id_usuario }) => {
    return await prisma.recordatorios.findMany({
      where: { id_usuario: _id_usuario },
      include: { Usuario: true },
    });
  },
  getUser: async ({ id_usuario }) => {
    return await prisma.usuario.findUnique({
      where: { id_usuario },
      include: { recordatorios: true },
    });
  },
  getAllUsers: async () => {
    return await prisma.usuario.findMany({
      include: { recordatorios: true },
    });
  },
  createUser: async ({ nombre, email, hash_contrasena, fecha_nacimiento }) => {
    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        hash_contrasena,
        fecha_nacimiento,
      },
    });
    return user;
  },
  updateUser: async ({ id_usuario, nombre, email, hash_contrasena, fecha_nacimiento }) => {
    const user = await prisma.usuario.update({
      where: { id_usuario },
      data: {
        nombre,
        email,
        hash_contrasena,
        fecha_nacimiento,
      },
    });
    return user;
  },
  deleteUser: async ({ id_usuario }) => {
    return await prisma.usuario.delete({
      where: { id_usuario },
    });
  },
  createReminder: async ({ titulo_nota, email_nota, mensaje_nota, fecha_recordatorio, id_usuario }) => {
    const reminder = await prisma.recordatorios.create({
      data: {
        titulo_nota,
        email_nota,
        mensaje_nota,
        fecha_recordatorio,
        id_usuario,
      },
    });
    return reminder;
  },
  updateReminder: async ({ _id, titulo_nota, email_nota, mensaje_nota, fecha_recordatorio }) => {
    const reminder = await prisma.recordatorios.update({
      where: { id_recordatorio: _id },
      data: {
        titulo_nota,
        email_nota,
        mensaje_nota,
        fecha_creacion: fecha_recordatorio,
      },
    });
    return reminder;
  },
  deleteReminder: async ({ _id }) => {
    try {
      await prisma.recordatorios.delete({
        where: { id_recordatorio: _id },
      });
      return true; // Deletion successful
    } catch (error) {
      console.error(`Error deleting reminder with ID ${_id}:`, error);
      return false; // Deletion failed
    }
  },

};

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL for testing
}));

// Other app configurations...

server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

async function cerrarServidor() {
  await new Promise((resolve) => {
    server.close((err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Servidor Cerrado');
      }
      resolve();
    });
  })
}
// Lógica para cerrar el servidor
// eslint-disable-next-line space-before-function-paren

// Resto del código de la aplicación...

// Eliminar un recordatorio por su ID
app.get('/eliminar-recordatorio/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const response = await graphql(schema, `mutation { deleteReminder(_id: ${_id}) }`, root);
    if (response.data.deleteReminder === false) {
      alert('No se pudo eliminar el recordatorio')
    } else {
      alert('Recordatorio eliminado')
    }
    console.log('Recordatorio eliminado:', _id);
    res.redirect('/historial.html');
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
// eslint-disable-next-line space-before-function-paren
async function sendEmail(asunto, mensaje, destinatario) {
  const mailOptions = {
    from: process.env.USER,
    to: destinatario,
    subject: asunto,
    text: mensaje
  }

    try{
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
      } else {
      }
    })
  } catch (error) {
  }
}
// Crear o actualizar un recordatorio
app.post('/posted-new-reminder', async (req, res, next) => {
  const { titulo, email, descripcion, fecha, id, id_usuario } = req.body;
  console.log(req.body)

  const idUsuario = parseInt(id_usuario, 10)
  const fechaDate = new Date(fecha)
  const fechaDateIso = fechaDate.toISOString()

  try {
    if (!id) {
      // Crear nuevo recordatorio
      const result = await graphql(schema, `mutation { createReminder(titulo_nota: "${titulo}", email_nota: "${email}", mensaje_nota: "${descripcion}", fecha_recordatorio: "${fechaDateIso}", id_usuario: ${idUsuario}) { id_recordatorio } }`, root);
      console.log('Nuevo recordatorio creado:', result.data.createReminder);
      sendEmail(titulo, descripcion, email);
    } else {
      // Actualizar un recordatorio existente
      const result = await graphql(schema, `mutation { updateReminder(_id: ${id}, titulo_nota: "${titulo}", email_nota: "${email}", mensaje_nota: "${descripcion}", fecha_recordatorio: "${fechaDateIso}" ) { id_recordatorio, titulo_nota, email_nota, mensaje_nota, fecha_recordatorio } }`, root);
      console.log(result)
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
app.get('/historial-data/:_id_usuario', async (req, res, next) => {
  try {
    const { _id_usuario } = req.params;
    const result = await graphql(schema, `query { getAllReminders (_id_usuario:${_id_usuario}) { id_recordatorio, titulo_nota, email_nota, mensaje_nota, fecha_recordatorio } }`, root);
    console.log(result)
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
    // const result = await graphql(schema, `query { getReminder(_id: "${_id}") { _id } }`, root);
    const result = await graphql(schema, `query { getReminder(_id: ${parseInt(_id)}) { id_recordatorio, titulo_nota, email_nota, mensaje_nota, fecha_recordatorio } }`, root);
    console.log('llegue');
    console.log(result);
    const encodedData = encodeURIComponent(JSON.stringify(result.data.getReminder));
    const url = '/cargar-recordatorio/' + _id;
    const redirectUrl = req.originalUrl.replace(url, '');
    res.redirect('/' + redirectUrl + 'formulario.html?data=' + encodedData);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// registro del usuario
app.post('/register', async (req, res) => {
  try {
    console.log('llegue')
    console.log(req.body)
    const { nombre, email, contrasena, fecha_nacimiento } = req.body;

    // Validar los datos de entrada
    if (!nombre || !email || !contrasena || !fecha_nacimiento) {
      throw new Error('Faltan datos necesarios para el registro');
    }

    console.log(fecha_nacimiento)

    const hash_contrasena = await bcrypt.hash(contrasena, 10);

    // Usar la mutación GraphQL para crear el usuario
    const mutation = `
      mutation {
         createUser(nombre: "${nombre}", email: "${email}", hash_contrasena: "${hash_contrasena}", fecha_nacimiento: "${fecha_nacimiento}") {
          id_usuario
        }
      }
    `;

    const result = await graphql(schema, mutation, root);
    if (result.errors) {
      throw new Error('Error GraphQL al crear el usuario: ' + JSON.stringify(result.errors));
    }

    res.json({ message: 'Usuario creado con éxito', usuario: result.data.CreateUser });
  } catch (error) {
    console.error(error);
    let errorMessage = 'Error en el registro de usuario';

    if (error.message.startsWith('Error GraphQL')) {
      errorMessage = error.message
    } else if (error.message.includes('Faltan datos necesarios')) {
      errorMessage = error.message
    }

    res.status(500).send(errorMessage);
  }
});

// login
app.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuario && await bcrypt.compare(contrasena, usuario.hash_contrasena)) {
      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email
        }
      });
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Middleware para token y ruta
// const verificarToken = (req, res, next) => {
//   const bearerHeader = req.headers.authorization;

//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];

//     try {
//       // Verificar el token
//       const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
//       req.usuario = decoded;
//       next()
//     } catch (error) {
//       res.status(403).json({ message: 'Token inválido o expirado' });
//     }
//   } else {
//     res.status(401).json({ message: 'Acceso no autorizado' });
//   }
// };

// ejemplo de ruta privada

// app.get('/ruta-protegida', verificarToken, (req, res) => {
//    Ruta protegida
//  res.send('Acceso concedido a la ruta protegida');
// });

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

module.exports = {app, cerrarServidor};
