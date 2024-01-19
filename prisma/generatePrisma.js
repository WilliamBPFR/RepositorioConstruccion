// generateSchema.js

const fs = require('fs');
const path = require('path');
const config = require('./../config.json')


// Lee la configuración desde config.json
// const configFile = path.join(__dirname, 'config.json');
// const configFileContent = fs.readFileSync(configFile, 'utf-8');
// const configJson = JSON.parse(configFileContent);

// Construye el contenido del archivo schema.prisma
const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = "${config.DATABASE_URL || 'mada'}"
}

model Usuario {
    id_usuario       Int             @id @default(autoincrement())
    nombre           String
    email            String          @unique
    hash_contrasena  String
    fecha_nacimiento DateTime
    fecha_creacion   DateTime        @default(now())
    Recordatorios    Recordatorios[]
  }
  
  model Recordatorios {
    id_recordatorio    Int      @id @default(autoincrement())
    titulo_nota        String
    mensaje_nota       String   @db.VarChar(1000)
    email_nota         String
    fecha_recordatorio DateTime
    fecha_creacion     DateTime @default(now())
    id_usuario         Int
    Usuario            Usuario  @relation(fields: [id_usuario], references: [id_usuario])
  }
  
`;

// Escribe el contenido en el archivo schema.prisma
const schemaFile = path.join(__dirname, 'schema.prisma');
fs.writeFileSync(schemaFile, schemaContent);

console.log('Generated schema.prisma with databaseUrl:', config.DATABASE_URL || 'fallback');
