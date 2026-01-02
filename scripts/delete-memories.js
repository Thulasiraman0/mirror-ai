const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteMemories() {
  const result = await prisma.memory.deleteMany();
  console.log('Deleted', result.count, 'memories');
  await prisma.$disconnect();
}

deleteMemories();
