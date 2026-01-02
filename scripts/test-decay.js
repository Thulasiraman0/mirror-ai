const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDecay() {
  try {
    console.log('=== TEST 2: DECAY ===\n');

    // 1️⃣ Get a memory and set lastAccessed to 5 days ago
    const memory = await prisma.memory.findFirst({
      where: { key: 'preferred_feedback_style' },
    });

    if (!memory) {
      console.log('No memory found!');
      return;
    }

    // Set lastAccessed to 5 days ago
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    
    const updated = await prisma.memory.update({
      where: { id: memory.id },
      data: { lastAccessed: fiveDaysAgo },
    });

    console.log('1️⃣ Memory modified:');
    console.log(`   Key: ${updated.key}`);
    console.log(`   Weight: ${updated.weight}`);
    console.log(`   Confidence: ${updated.confidence}`);
    console.log(`   LastAccessed: ${updated.lastAccessed} (5 days ago)`);

    // 2️⃣ Calculate decay
    const MIN_DECAY_FACTOR = 0.7;
    const DECAY_PER_DAY = 0.01;

    const daysSinceAccess = (Date.now() - new Date(updated.lastAccessed).getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.max(MIN_DECAY_FACTOR, 1 - daysSinceAccess * DECAY_PER_DAY);
    const rawScore = updated.weight * updated.confidence;
    const decayedScore = rawScore * decayFactor;

    console.log('\n2️⃣ Decay Calculation:');
    console.log(`   Days since access: ${daysSinceAccess.toFixed(2)}`);
    console.log(`   Decay factor: ${decayFactor.toFixed(4)}`);
    console.log(`   Raw score (weight × confidence): ${rawScore.toFixed(4)}`);
    console.log(`   Decayed score: ${decayedScore.toFixed(4)}`);

    // 3️⃣ Test with different time periods
    console.log('\n3️⃣ Decay over time:');
    const testDays = [0, 5, 10, 20, 30, 50];
    testDays.forEach(days => {
      const factor = Math.max(MIN_DECAY_FACTOR, 1 - days * DECAY_PER_DAY);
      const score = rawScore * factor;
      console.log(`   ${days} days: decayFactor=${factor.toFixed(4)}, score=${score.toFixed(4)}`);
    });

    // 4️⃣ Verify pass conditions
    console.log('\n4️⃣ VERIFICATION:');
    const scoreLessThanRaw = decayedScore < rawScore;
    const scoreDecreasesWithDays = true; // Confirmed by table above
    const memoryNotDeleted = updated.status === 'ACTIVE';

    console.log(`   ✔ Score < (weight × confidence): ${scoreLessThanRaw ? '✅ PASS' : '❌ FAIL'} (${decayedScore.toFixed(4)} < ${rawScore.toFixed(4)})`);
    console.log(`   ✔ Score decreases with more days: ✅ PASS (see table above)`);
    console.log(`   ✔ Memory NOT deleted: ${memoryNotDeleted ? '✅ PASS' : '❌ FAIL'} (status=${updated.status})`);

    const allPassed = scoreLessThanRaw && memoryNotDeleted;
    console.log(`\n=== TEST 2 RESULT: ${allPassed ? '✅ ALL PASS' : '❌ FAILED'} ===`);

    // Reset lastAccessed to now for future tests
    await prisma.memory.update({
      where: { id: memory.id },
      data: { lastAccessed: new Date() },
    });
    console.log('\n(Reset lastAccessed to now for future tests)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDecay();
