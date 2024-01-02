const request = require('supertest');
const mongooseClient = require('mongoose');
const app = require('./src/main');
const config = require('./config.json');

let server;

jest.setTimeout(60000)
beforeAll(async () => {
  await mongooseClient.connect(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Conexión exitosa a la base de datos');

  // Iniciar el servidor antes de todas las pruebas
  server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
});

afterAll(async () => {
  await mongooseClient.disconnect();

  // Close the server and handle errors
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
  it('Debería abrir el historia sin problemas', async () => {
    const response = await request(server).get('/historial.html');

    expect(response.statusCode).toBe(200);
    // expect(response.header.location).toBe('historial.html');

    // Puedes realizar otras verificaciones según tus necesidades

    // Verifica si se ha enviado el correo electrónico correctamente

    // Llama a la función `done` para finalizar la prueba
    return Promise.resolve();
  });
});
