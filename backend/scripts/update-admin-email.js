const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oldEmail = 'admin@thegrandfitness.com';
  const newEmail = 'ankuraniladarsh@gmail.com';

  console.log(`Checking user count...`);
  const countBefore = await prisma.user.count();
  console.log(`Total users before update: ${countBefore}`);

  console.log(`Checking if new email already exists...`);
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail }
  });

  if (existingUser) {
    console.error(`Error: User with email ${newEmail} already exists! Aborting.`);
    process.exit(1);
  }

  console.log(`Looking for admin user...`);
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN', email: oldEmail }
  });

  if (!adminUser) {
    console.error(`Error: Could not find admin user with email ${oldEmail}!`);
    process.exit(1);
  }

  console.log(`Found admin user: ID=${adminUser.id}, Email=${adminUser.email}, Role=${adminUser.role}`);

  console.log(`Updating email to ${newEmail}...`);
  const updatedUser = await prisma.user.update({
    where: { id: adminUser.id, email: oldEmail },
    data: { email: newEmail }
  });

  console.log(`Successfully updated admin user: ID=${updatedUser.id}, Email=${updatedUser.email}, Role=${updatedUser.role}`);

  const countAfter = await prisma.user.count();
  console.log(`Total users after update: ${countAfter}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
