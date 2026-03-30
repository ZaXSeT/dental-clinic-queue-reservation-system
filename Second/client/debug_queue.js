require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const start = new Date(now); start.setHours(0,0,0,0);
  const end = new Date(now); end.setHours(23,59,59,999);
  console.log('NOW (local):', now.toString());
  console.log('NOW (UTC):', now.toISOString());
  console.log('START (local):', start.toString());
  console.log('START (UTC):', start.toISOString());

  const queues = await prisma.queue.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  console.log('\n=== QUEUES ===');
  queues.forEach(q => console.log(JSON.stringify(q)));

  const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log('\n=== APPOINTMENTS ===');
  appointments.forEach(a => console.log(JSON.stringify(a)));

  const todayQueues = await prisma.queue.findMany({
    where: { date: { gte: start, lte: end } }
  });
  console.log('\n=== TODAY QUEUES (gte start, lte end) ===');
  todayQueues.forEach(q => console.log(JSON.stringify(q)));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
