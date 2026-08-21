const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE Producto ADD COLUMN descripcion TEXT;');
    console.log('Column added successfully');
  } catch (e) {
    if (e.message.includes('Duplicate column name')) {
      console.log('Column already exists');
    } else {
      console.error(e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
