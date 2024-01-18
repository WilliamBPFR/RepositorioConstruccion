const http = require('http');
const { shutdown } = require('./src/main'); // Replace 'your-file-name' with the actual file name
const { describe, it, beforeEach, afterEach } = require('jest');

describe('shutdown', () => {
  let server;

  beforeEach(() => {
    server = http.createServer();
  });

  afterEach(() => {
    server.close();
  });

  it('should close the HTTP server and exit the process', (done) => {
    const mockPrismaDisconnect = jest.fn();
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
      expect(code).toBe(0); // Assert that the process.exit is called with code 0
      expect(mockPrismaDisconnect).toHaveBeenCalled(); // Assert that Prisma disconnect is called
      done();
    });

    // Mock the PrismaClient instance and its disconnect method
    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn(() => ({
        $disconnect: mockPrismaDisconnect,
      })),
    }));

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    shutdown(server, prisma);

    // Simulate the server close event
    server.emit('close');
    
    expect(mockExit).toHaveBeenCalled(); // Assert that process.exit is called
  });
});
