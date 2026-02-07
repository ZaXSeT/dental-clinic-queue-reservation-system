import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL;

    if (url && !url.includes('pgbouncer=true')) {
        url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
    }

    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// Force reload after schema update
