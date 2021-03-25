import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function init() {
    await prisma.$connect();
}
