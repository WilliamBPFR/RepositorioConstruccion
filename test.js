const request = require('supertest');
require('dotenv').config(); // Cargar variables de entorno de .env
const { PrismaClient } = require('@prisma/client');
const { app, cerrarServidor } = require('./src/main');
const config = require('./config.json');

let server;
let prisma;
const fechaactual = new Date().toISOString().replace(/\s/g, '');
const nuevaPersona = {
  nombre: 'Nuevo Usuario',
  email: `nuevo${fechaactual}@usuario.com`,
  contrasena: 'contrasena123',
  fecha_nacimiento: new Date().toISOString(),
};


jest.setTimeout(60000);

beforeAll(async () => {
  console.log('Iniciando pruebas...');
  console.log(process.env.DATABASE_URL.split('@')[1] + " " + process.env.DATABASE_URL.split('@')[0]);
  prisma = new PrismaClient();
  await prisma.$connect();
  console.log('Conexión exitosa a la base de datos');

  // Iniciar el servidor antes de todas las pruebas
  server = app.listen(config.PORT+1, () => {
    console.log(`Server is running on port ${config.PORT+1}`);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  await cerrarServidor();

  // Cerrar el servidor y manejar errores
  await new Promise((resolve) => {
    server.close((err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Servidor Cerrado');
      }
      resolve();
    });
    
  });

});

describe('Pruebas de apertura de historial', () => {
  it('Debería abrir el historial sin problemas', async () => {
    const response = await request(server).get('/historial.html');

    expect(response.statusCode).toBe(200);
    // expect(response.header.location).toBe('historial.html');

    // Puedes realizar otras verificaciones según tus necesidades

    // Verificar si se ha enviado el correo electrónico correctamente

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });

  it('Debería traer un recordatorio existente', async () => {
    // Supongamos que tienes un ID válido de recordatorio
    const recordatorioId = 1;

    const response = await request(server).get(`/cargar-recordatorio/${recordatorioId}`);

    expect(response.statusCode).toBe(302); // Redirección esperada

    // Puedes realizar otras verificaciones según tus necesidades

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });

  it('Debería insertar un nuevo recordatorio', async () => {
    const nuevoRecordatorio = {
      titulo: 'Nuevo Recordatorio',
      email: 'correo@ejemplo.com',
      descripcion: 'Descripción del nuevo recordatorio',
      fecha: new Date().toISOString(),
      id_usuario: 1, // Supongamos que tienes un ID de usuario válido
    };

    const response = await request(server)
      .post('/posted-new-reminder')
      .send(nuevoRecordatorio);

    expect(response.statusCode).toBe(302); // Redirección esperada

    // Puedes realizar otras verificaciones según tus necesidades

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });

  it('Debería hacer el registro de una persona', async () => {


    const response = await request(server)
      .post('/register')
      .send(nuevaPersona);

    expect(response.statusCode).toBe(200);

    // Puedes realizar otras verificaciones según tus necesidades

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });

  it('Debería realizar el login del usuario creado', async () => {
    const credenciales = {
      email: nuevaPersona.email,
      contrasena: nuevaPersona.contrasena,
    };

    const response = await request(server)
      .post('/login')
      .send(credenciales);

    expect(response.statusCode).toBe(200);

    // Puedes realizar otras verificaciones según tus necesidades

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });
});
