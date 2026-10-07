"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prisma = void 0;
var _client = require("@prisma/client");
var _config = require("../config");
const prismaClientSingleton = () => {
  return new _client.PrismaClient({
    datasourceUrl: _config.config.NODE_ENV === 'test' ? _config.config.DATABASE_URL_TEST : _config.config.DATABASE_URL
  });
};
const globalForPrisma = globalThis;
const prisma = exports.prisma = globalForPrisma.prisma ?? prismaClientSingleton();
if (_config.config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;