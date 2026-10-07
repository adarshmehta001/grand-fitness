"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        datasourceUrl: config_1.config.NODE_ENV === 'test' ? config_1.config.DATABASE_URL_TEST : config_1.config.DATABASE_URL,
    });
};
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? prismaClientSingleton();
if (config_1.config.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
