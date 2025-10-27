import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.task.deleteMany();
  console.log('✅ Cleared existing data');

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        name: 'Complete project documentation',
        description:
          'Write comprehensive README and API documentation for the project',
      },
    }),
    prisma.task.create({
      data: {
        name: 'Setup CI/CD pipeline',
        description:
          'Configure GitHub Actions for automated testing and deployment',
      },
    }),
    prisma.task.create({
      data: {
        name: 'Implement user authentication',
        description:
          'Add JWT-based authentication and authorization to the API',
      },
    }),
    prisma.task.create({
      data: {
        name: 'Design database schema',
        description: 'Plan and create the database schema for all entities',
      },
    }),
    prisma.task.create({
      data: {
        name: 'Write unit tests',
        description:
          'Achieve 80% code coverage with unit and integration tests',
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} sample tasks`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
