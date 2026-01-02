const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testReinforcement() {
  try {
    console.log('=== TEST 1: REINFORCEMENT ===\n');

    // 1️⃣ Get a memory (pick one that's not already at max)
    const memory = await prisma.memory.findFirst({
      where: { key: 'current_challenge' }, // This has weight 0.9
    });

    if (!memory) {
      console.log('No memory found!');
      return;
    }

    console.log('1️⃣ BEFORE Reinforcement:');
    console.log(`   ID: ${memory.id}`);
    console.log(`   Key: ${memory.key}`);
    console.log(`   Weight: ${memory.weight}`);
    console.log(`   Confidence: ${memory.confidence}`);
    console.log(`   LastAccessed: ${memory.lastAccessed}`);
    console.log(`   Status: ${memory.status}`);

    // 2️⃣ Apply reinforcement
    const REINFORCEMENT_STEP = 0.05;
    const MAX_SCORE = 1;

    const updated = await prisma.memory.update({
      where: { id: memory.id },
      data: {
        confidence: Math.min(MAX_SCORE, memory.confidence + REINFORCEMENT_STEP),
        weight: Math.min(MAX_SCORE, memory.weight + REINFORCEMENT_STEP),
        lastAccessed: new Date(),
      },
    });

    console.log('\n2️⃣ AFTER Reinforcement:');
    console.log(`   Weight: ${updated.weight}`);
    console.log(`   Confidence: ${updated.confidence}`);
    console.log(`   LastAccessed: ${updated.lastAccessed}`);
    console.log(`   Status: ${updated.status}`);

    // 3️⃣ Verify pass conditions
    console.log('\n3️⃣ VERIFICATION:');
    const weightIncreased = updated.weight > memory.weight || updated.weight === MAX_SCORE;
    const confidenceIncreased = updated.confidence > memory.confidence || updated.confidence === MAX_SCORE;
    const lastAccessedUpdated = updated.lastAccessed > memory.lastAccessed;
    const statusActive = updated.status === 'ACTIVE';

    console.log(`   ✔ Weight increased: ${weightIncreased ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✔ Confidence increased: ${confidenceIncreased ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✔ LastAccessed updated: ${lastAccessedUpdated ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✔ Status remains ACTIVE: ${statusActive ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = weightIncreased && confidenceIncreased && lastAccessedUpdated && statusActive;
    console.log(`\n=== TEST 1 RESULT: ${allPassed ? '✅ ALL PASS' : '❌ FAILED'} ===`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testReinforcement();
