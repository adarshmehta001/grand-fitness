const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'ankuraniladarsh@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }
  
  const favCount = await prisma.favorite.count({ where: { userId: user.id } });
  const enqCount = await prisma.enquiry.count({ where: { userId: user.id } });
  
  console.log(`Favorites found: ${favCount}`);
  console.log(`Enquiries found: ${enqCount}`);
  
  if (enqCount > 0) {
    console.log(`Nullifying userId for ${enqCount} enquiries...`);
    await prisma.enquiry.updateMany({
      where: { userId: user.id },
      data: { userId: null }
    });
  }
  
  console.log(`Deleting user ${email}...`);
  await prisma.user.delete({ where: { id: user.id } });
  console.log('User deleted successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
