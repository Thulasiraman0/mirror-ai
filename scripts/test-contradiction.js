const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testContradiction() {
  try {
    console.log('=== TEST 3: CONTRADICTION HANDLING ===\n');

    // 1️⃣ Get existing memory
    const existing = await prisma.memory.findFirst({
      where: { key: 'primary_goal', status: 'ACTIVE' },
    });

    if (!existing) {
      console.log('No active primary_goal memory found!');
      return;
    }

    console.log('1️⃣ EXISTING Memory:');
    console.log(`   ID: ${existing.id}`);
    console.log(`   Key: ${existing.key}`);
    console.log(`   Value: ${JSON.stringify(existing.value)}`);
    console.log(`   Confidence: ${existing.confidence}`);
    console.log(`   Status: ${existing.status}`);
    console.log(`   ProfileId: ${existing.profileId}`);

    // 2️⃣ Simulate contradiction - new memory with higher confidence
    const newConfidence = 1.0; // Equal to existing, should trigger replacement
    console.log('\n2️⃣ NEW Contradictory Memory:');
    console.log(`   Key: primary_goal`);
    console.log(`   Value: "I don't care about startups anymore"`);
    console.log(`   Confidence: ${newConfidence}`);

    // 3️⃣ Apply contradiction logic
    console.log('\n3️⃣ Applying Contradiction Logic...');
    
    // Check if new confidence >= existing confidence
    if (newConfidence >= existing.confidence) {
      // Archive the old memory
      await prisma.memory.update({
        where: { id: existing.id },
        data: { status: 'ARCHIVED' },
      });
      console.log(`   → Old memory ARCHIVED`);

      // Create new memory
      const newMemory = await prisma.memory.create({
        data: {
          profileId: existing.profileId,
          key: 'primary_goal',
          value: "I don't care about startups anymore",
          cognitiveType: existing.cognitiveType,
          source: 'contradiction_test',
          weight: 1.0,
          confidence: newConfidence,
          status: 'ACTIVE',
        },
      });
      console.log(`   → New memory CREATED (ID: ${newMemory.id})`);

      // 4️⃣ Verify
      console.log('\n4️⃣ VERIFICATION:');
      
      const archivedMemory = await prisma.memory.findUnique({
        where: { id: existing.id },
      });
      
      const activeMemory = await prisma.memory.findFirst({
        where: { key: 'primary_goal', status: 'ACTIVE' },
      });

      const allMemoriesWithKey = await prisma.memory.findMany({
        where: { key: 'primary_goal' },
      });

      const oldArchived = archivedMemory?.status === 'ARCHIVED';
      const newActive = activeMemory?.status === 'ACTIVE';
      const sameProfileId = archivedMemory?.profileId === activeMemory?.profileId;
      const noDeletions = allMemoriesWithKey.length >= 2; // Both exist

      console.log(`   ✔ Old memory → ARCHIVED: ${oldArchived ? '✅ PASS' : '❌ FAIL'} (status=${archivedMemory?.status})`);
      console.log(`   ✔ New memory → ACTIVE: ${newActive ? '✅ PASS' : '❌ FAIL'} (status=${activeMemory?.status})`);
      console.log(`   ✔ Same profileId: ${sameProfileId ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   ✔ No deletions: ${noDeletions ? '✅ PASS' : '❌ FAIL'} (found ${allMemoriesWithKey.length} memories with key)`);

      console.log('\n   All memories with key "primary_goal":');
      allMemoriesWithKey.forEach(m => {
        console.log(`     - ID: ${m.id.substring(0, 10)}..., Status: ${m.status}, Value: ${JSON.stringify(m.value).substring(0, 40)}...`);
      });

      const allPassed = oldArchived && newActive && sameProfileId && noDeletions;
      console.log(`\n=== TEST 3 RESULT: ${allPassed ? '✅ ALL PASS' : '❌ FAILED'} ===`);

      // 5️⃣ Cleanup - restore original state
      console.log('\n5️⃣ Cleanup (restoring original state)...');
      await prisma.memory.delete({ where: { id: newMemory.id } });
      await prisma.memory.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE' },
      });
      console.log('   → Original memory restored to ACTIVE');
      console.log('   → Test memory deleted');

    } else {
      console.log(`   → New memory REJECTED (confidence ${newConfidence} < ${existing.confidence})`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContradiction();
