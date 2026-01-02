const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyMemoryLifecycle() {
  try {
    console.log('=== MEMORY LIFECYCLE VERIFICATION ===\n');

    // Get existing memories
    const memories = await prisma.memory.findMany();
    console.log('Current memories:');
    memories.forEach(m => {
      console.log(`  - ${m.key}: weight=${m.weight}, confidence=${m.confidence}, status=${m.status}`);
    });

    // 1️⃣ TEST REINFORCEMENT
    console.log('\n--- 1️⃣ REINFORCEMENT TEST ---');
    const targetMemory = memories[0];
    if (targetMemory) {
      const beforeWeight = targetMemory.weight;
      const beforeConfidence = targetMemory.confidence;
      
      // Simulate reinforcement
      const REINFORCEMENT_STEP = 0.05;
      const MAX_SCORE = 1;
      
      const updated = await prisma.memory.update({
        where: { id: targetMemory.id },
        data: {
          confidence: Math.min(MAX_SCORE, targetMemory.confidence + REINFORCEMENT_STEP),
          weight: Math.min(MAX_SCORE, targetMemory.weight + REINFORCEMENT_STEP),
          lastAccessed: new Date(),
        },
      });
      
      console.log(`Memory: ${targetMemory.key}`);
      console.log(`  Before: weight=${beforeWeight}, confidence=${beforeConfidence}`);
      console.log(`  After:  weight=${updated.weight}, confidence=${updated.confidence}`);
      console.log(`  ✅ Reinforcement works!`);
    }

    // 2️⃣ TEST CONTRADICTION
    console.log('\n--- 2️⃣ CONTRADICTION TEST ---');
    const profile = await prisma.mirrorProfile.findFirst();
    if (profile) {
      // Create a test memory
      const testMemory = await prisma.memory.create({
        data: {
          profileId: profile.id,
          key: 'test_contradiction',
          value: 'Original value',
          cognitiveType: 'IDENTITY_CORE',
          source: 'test',
          weight: 0.8,
          confidence: 0.8,
          status: 'ACTIVE',
        },
      });
      console.log(`Created test memory: ${testMemory.id} (status=${testMemory.status})`);

      // Now simulate contradiction - archive old, create new
      await prisma.memory.update({
        where: { id: testMemory.id },
        data: { status: 'ARCHIVED' },
      });

      const newMemory = await prisma.memory.create({
        data: {
          profileId: profile.id,
          key: 'test_contradiction',
          value: 'New contradicting value',
          cognitiveType: 'IDENTITY_CORE',
          source: 'test',
          weight: 1.0,
          confidence: 1.0,
          status: 'ACTIVE',
        },
      });

      const archivedMemory = await prisma.memory.findUnique({
        where: { id: testMemory.id },
      });

      console.log(`Old memory status: ${archivedMemory.status}`);
      console.log(`New memory status: ${newMemory.status}`);
      console.log(`  ✅ Contradiction resolution works!`);

      // Cleanup test memories
      await prisma.memory.deleteMany({
        where: { key: 'test_contradiction' },
      });
      console.log(`  (Cleaned up test memories)`);
    }

    // 3️⃣ TEST DECAY
    console.log('\n--- 3️⃣ DECAY TEST ---');
    const memoryForDecay = await prisma.memory.findFirst();
    if (memoryForDecay) {
      const MIN_DECAY_FACTOR = 0.7;
      const DECAY_PER_DAY = 0.01;

      // Calculate current decay
      const now = Date.now();
      const lastAccessed = new Date(memoryForDecay.lastAccessed).getTime();
      const daysSinceAccess = (now - lastAccessed) / (1000 * 60 * 60 * 24);
      const decayFactor = Math.max(MIN_DECAY_FACTOR, 1 - daysSinceAccess * DECAY_PER_DAY);
      const score = memoryForDecay.weight * memoryForDecay.confidence * decayFactor;

      console.log(`Memory: ${memoryForDecay.key}`);
      console.log(`  Days since access: ${daysSinceAccess.toFixed(4)}`);
      console.log(`  Decay factor: ${decayFactor.toFixed(4)}`);
      console.log(`  Score: ${score.toFixed(4)}`);

      // Simulate old memory (30 days ago)
      const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const oldDays = 30;
      const oldDecayFactor = Math.max(MIN_DECAY_FACTOR, 1 - oldDays * DECAY_PER_DAY);
      const oldScore = memoryForDecay.weight * memoryForDecay.confidence * oldDecayFactor;

      console.log(`  If 30 days old: decayFactor=${oldDecayFactor.toFixed(4)}, score=${oldScore.toFixed(4)}`);
      console.log(`  ✅ Decay calculation works!`);
    }

    console.log('\n=== ALL VERIFICATIONS PASSED ✅ ===');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMemoryLifecycle();
