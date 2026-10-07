const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'ankuraniladarsh@gmail.com';
  const newPassword = 'admin'; // simple password
  
  const hash = await argon2.hash(newPassword);
  
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hash }
  });
  
  console.log(`Password for ${email} has been reset to: ${newPassword}`);
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
