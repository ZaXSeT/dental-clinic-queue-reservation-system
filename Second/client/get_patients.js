require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const patients = await prisma.patient.findMany({ select: { id: true, name: true, email: true }});
  console.log('PATIENTS:', patients);
}
main().catch(console.error).finally(()=>prisma.$disconnect());
