const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
prisma.passwordResetToken.findMany({ include: { user: true } }).then(console.log).finally(() => prisma.$disconnect());
