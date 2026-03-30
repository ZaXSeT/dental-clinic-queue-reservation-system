require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const doctors = await prisma.doctor.findMany();
  console.log('DOCTORS:', doctors);
}
main().catch(console.error).finally(()=>prisma.$disconnect());
