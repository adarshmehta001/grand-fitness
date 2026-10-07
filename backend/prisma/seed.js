"use strict";

var _client = require("@prisma/client");
const prisma = new _client.PrismaClient();
async function main() {
  console.log('Seeding database...');

  // Create an initial admin user
  const adminEmail = 'ankuraniladarsh@gmail.com';
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail
    }
  });
  if (!existingAdmin) {
    const argon2 = require('argon2');
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.error("FATAL ERROR: ADMIN_PASSWORD environment variable is not set. A secure admin password must be provided via the environment for seeding.");
      process.exit(1);
    }
    const passwordHash = await argon2.hash(password);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'System Admin',
        role: 'ADMIN'
      }
    });
  }

  // Trainers
  const trainers = [{
    name: "Marcus Thorne",
    specialty: "Strength & Conditioning",
    bio: "Former Olympic weightlifter with 10 years of coaching experience.",
    imageUrl: "https://images.unsplash.com/photo-1567013127542-490d143c2f89"
  }, {
    name: "Sarah Chen",
    specialty: "HIIT & Endurance",
    bio: "An ultra-marathoner and high-intensity specialist.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
  }, {
    name: "David Rodriguez",
    specialty: "Mobility & Recovery",
    bio: "With a background in sports physiotherapy.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"
  }];
  const createdTrainers = [];
  for (const trainer of trainers) {
    let t = await prisma.trainer.findFirst({
      where: {
        name: trainer.name
      }
    });
    if (!t) {
      t = await prisma.trainer.create({
        data: trainer
      });
    }
    createdTrainers.push(t);
  }

  // Programs
  const programs = [{
    slug: "grand-strength",
    title: "Grand Strength",
    category: "Strength",
    description: "A 12-week progressive overload block.",
    intensity: "High",
    experienceLevel: "Intermediate to Advanced",
    duration: "12 Weeks (4 days/week)",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
  }, {
    slug: "hiit-burn",
    title: "HIIT Burn",
    category: "Cardio",
    description: "High-intensity intervals.",
    intensity: "Very High",
    experienceLevel: "All Levels",
    duration: "8 Weeks (3 days/week)",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  }];
  for (const program of programs) {
    await prisma.program.upsert({
      where: {
        slug: program.slug
      },
      update: {},
      create: program
    });
  }

  // Link Trainers to Programs
  const grandStrength = await prisma.program.findUnique({
    where: {
      slug: 'grand-strength'
    }
  });
  const hiitBurn = await prisma.program.findUnique({
    where: {
      slug: 'hiit-burn'
    }
  });
  if (grandStrength && hiitBurn && createdTrainers.length >= 2) {
    // Avoid duplicate relations
    await prisma.trainerProgram.deleteMany({});
    await prisma.trainerProgram.create({
      data: {
        trainerId: createdTrainers[0].id,
        programId: grandStrength.id
      }
    });
    await prisma.trainerProgram.create({
      data: {
        trainerId: createdTrainers[1].id,
        programId: hiitBurn.id
      }
    });
  }

  // Membership Plans
  const plans = [{
    id: "plan_base",
    name: "Base Tier",
    description: "Access to the gym during regular hours.",
    prices: {
      monthly: 600,
      quarterly: 1620,
      annual: 6120
    },
    inclusions: ["Full gym access", "Locker room access"],
    highlight: false,
    stripePriceIdMonthly: "price_mock_base_monthly",
    stripePriceIdQuarterly: "price_mock_base_quarterly",
    stripePriceIdAnnual: "price_mock_base_annual"
  }, {
    id: "plan_pro",
    name: "Pro Tier",
    description: "Unlimited classes and gym access.",
    prices: {
      monthly: 1000,
      quarterly: 2700,
      annual: 10200
    },
    inclusions: ["Full gym access", "Unlimited classes", "1 PT session/mo"],
    highlight: false,
    // strictly false per requirements
    stripePriceIdMonthly: "price_mock_pro_monthly",
    stripePriceIdQuarterly: "price_mock_pro_quarterly",
    stripePriceIdAnnual: "price_mock_pro_annual"
  }];
  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan
    });
  }

  // Schedule Classes
  const classes = [
  // Monday
  {
    title: "Morning HIIT",
    day: "Monday",
    startTime: "06:00",
    durationMins: 60,
    category: "Cardio",
    intensity: "High",
    trainerId: createdTrainers[1]?.id || createdTrainers[0]?.id
  }, {
    title: "Strength Foundations",
    day: "Monday",
    startTime: "18:00",
    durationMins: 60,
    category: "Strength",
    intensity: "Medium",
    trainerId: createdTrainers[0]?.id
  },
  // Tuesday
  {
    title: "Endurance Row",
    day: "Tuesday",
    startTime: "07:00",
    durationMins: 45,
    category: "Cardio",
    intensity: "High",
    trainerId: createdTrainers[1]?.id || createdTrainers[0]?.id
  }, {
    title: "Evening Recovery",
    day: "Tuesday",
    startTime: "19:00",
    durationMins: 45,
    category: "Mobility",
    intensity: "Low",
    trainerId: createdTrainers[2]?.id || createdTrainers[0]?.id
  },
  // Wednesday
  {
    title: "Lunchtime Mobility",
    day: "Wednesday",
    startTime: "12:00",
    durationMins: 45,
    category: "Mobility",
    intensity: "Low",
    trainerId: createdTrainers[2]?.id || createdTrainers[0]?.id
  }, {
    title: "Powerlifting Basics",
    day: "Wednesday",
    startTime: "18:30",
    durationMins: 60,
    category: "Strength",
    intensity: "Medium",
    trainerId: createdTrainers[0]?.id
  },
  // Thursday
  {
    title: "Sprint Intervals",
    day: "Thursday",
    startTime: "06:30",
    durationMins: 45,
    category: "Cardio",
    intensity: "High",
    trainerId: createdTrainers[1]?.id || createdTrainers[0]?.id
  }, {
    title: "Functional Flow",
    day: "Thursday",
    startTime: "17:30",
    durationMins: 60,
    category: "Functional",
    intensity: "Medium",
    trainerId: createdTrainers[2]?.id || createdTrainers[0]?.id
  },
  // Friday
  {
    title: "Advanced Lifting",
    day: "Friday",
    startTime: "17:30",
    durationMins: 90,
    category: "Strength",
    intensity: "High",
    trainerId: createdTrainers[0]?.id
  }, {
    title: "Friday Burnout",
    day: "Friday",
    startTime: "19:00",
    durationMins: 45,
    category: "Cardio",
    intensity: "High",
    trainerId: createdTrainers[1]?.id || createdTrainers[0]?.id
  }];
  for (const cls of classes) {
    const existing = await prisma.scheduleClass.findFirst({
      where: {
        title: cls.title,
        day: cls.day,
        startTime: cls.startTime
      }
    });
    if (!existing && cls.trainerId) {
      await prisma.scheduleClass.create({
        data: cls
      });
    }
  }

  // Gallery Images
  const images = [{
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    alt: "Main floor",
    category: "Facility",
    caption: "Main floor"
  }, {
    src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
    alt: "Dumbbell Rack",
    category: "Equipment",
    caption: "Free weights area"
  }, {
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
    alt: "Squat Racks",
    category: "Equipment",
    caption: "Heavy lifting zone"
  }, {
    src: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    alt: "Rowing Machines",
    category: "Equipment",
    caption: "Cardio section"
  }, {
    src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
    alt: "Locker Rooms",
    category: "Facility",
    caption: "Premium locker rooms"
  }, {
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    alt: "Group Class",
    category: "Classes",
    caption: "Morning HIIT class"
  }, {
    src: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3",
    alt: "Personal Training",
    category: "Classes",
    caption: "1-on-1 coaching"
  }];
  for (const img of images) {
    const existing = await prisma.galleryImage.findFirst({
      where: {
        src: img.src
      }
    });
    if (!existing) {
      await prisma.galleryImage.create({
        data: img
      });
    }
  }
  console.log('Database seeded successfully.');
}
main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});