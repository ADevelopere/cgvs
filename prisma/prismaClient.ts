import { PrismaClient } from "./generated/client";
import { drizzle } from "drizzle-orm/prisma/pg";
// import { drizzle } from 'drizzle-orm/prisma/mysql';

const prismaClient = new PrismaClient().$extends(drizzle());

export default prismaClient;
