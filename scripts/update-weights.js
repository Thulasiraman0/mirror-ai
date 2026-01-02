const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CognitiveTypes and weights (matching lib files)
const DEFAULT_MEMORY_WEIGHTS = {
  GOAL_LONG_TERM: 1.0,
  GOAL_SHORT_TERM: 0.8,
  FRICTION_ACTIVE: 0.9,
  FRICTION_RECURRING: 0.85,
  PREFERENCE_COMMUNICATION: 0.6,
  PREFERENCE_ROUTINE: 0.7,
  IDENTITY_CORE: 1.0,
  VALUE_SYSTEM: 0.95,
};

async function updateWeights() {
  try {
    // Update primary_goal
    const r1 = await prisma.memory.updateMany({
      where: { cognitiveType: 'GOAL_LONG_TERM' },
      data: { weight: DEFAULT_MEMORY_WEIGHTS.GOAL_LONG_TERM }
    });
    console.log('Updated GOAL_LONG_TERM weight:', r1.count);

    // Update current_challenge
    const r2 = await prisma.memory.updateMany({
      where: { cognitiveType: 'FRICTION_ACTIVE' },
      data: { weight: DEFAULT_MEMORY_WEIGHTS.FRICTION_ACTIVE }
    });
    console.log('Updated FRICTION_ACTIVE weight:', r2.count);

    // Update preferred_feedback_style
    const r3 = await prisma.memory.updateMany({
      where: { cognitiveType: 'PREFERENCE_COMMUNICATION' },
      data: { weight: DEFAULT_MEMORY_WEIGHTS.PREFERENCE_COMMUNICATION }
    });
    console.log('Updated PREFERENCE_COMMUNICATION weight:', r3.count);

    // Verify
    const all = await prisma.memory.findMany();
    console.log('\nAll memories after update:');
    all.forEach(m => {
      console.log(`  - ${m.key}: cognitiveType="${m.cognitiveType}", weight=${m.weight}, confidence=${m.confidence}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWeights();
