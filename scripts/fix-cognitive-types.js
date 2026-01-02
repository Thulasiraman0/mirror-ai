const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCognitiveTypes() {
  try {
    // Update primary_goal
    const r1 = await prisma.memory.updateMany({
      where: { key: 'primary_goal' },
      data: { cognitiveType: 'GOAL_LONG_TERM' }
    });
    console.log('Updated primary_goal:', r1.count);

    // Update current_challenge
    const r2 = await prisma.memory.updateMany({
      where: { key: 'current_challenge' },
      data: { cognitiveType: 'FRICTION_ACTIVE' }
    });
    console.log('Updated current_challenge:', r2.count);

    // Update preferred_feedback_style
    const r3 = await prisma.memory.updateMany({
      where: { key: 'preferred_feedback_style' },
      data: { cognitiveType: 'PREFERENCE_COMMUNICATION' }
    });
    console.log('Updated preferred_feedback_style:', r3.count);

    // Verify
    const all = await prisma.memory.findMany();
    console.log('\nAll memories after fix:');
    all.forEach(m => {
      console.log(`  - ${m.key}: cognitiveType = "${m.cognitiveType}"`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCognitiveTypes();
