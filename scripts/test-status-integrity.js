const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testStatusIntegrity() {
  try {
    console.log('=== TEST 4: STATUS INTEGRITY ===\n');

    // 1️⃣ Query all memories
    const memories = await prisma.memory.findMany({
      select: {
        id: true,
        key: true,
        status: true,
        weight: true,
        confidence: true,
        lastAccessed: true,
        cognitiveType: true,
      },
    });

    console.log('1️⃣ All Memory Statuses:');
    console.log('   ' + '-'.repeat(80));
    console.log('   | ID (short)       | Key                        | Status       |');
    console.log('   ' + '-'.repeat(80));
    
    const validStatuses = ['ACTIVE', 'ARCHIVED', 'CONTRADICTED'];
    let nullCount = 0;
    let invalidCount = 0;

    memories.forEach(m => {
      const idShort = m.id.substring(0, 15) + '...';
      const keyPadded = m.key.padEnd(26).substring(0, 26);
      const statusPadded = (m.status || 'NULL').padEnd(12);
      
      let statusIcon = '✅';
      if (!m.status) {
        nullCount++;
        statusIcon = '❌ NULL';
      } else if (!validStatuses.includes(m.status)) {
        invalidCount++;
        statusIcon = '❌ INVALID';
      }
      
      console.log(`   | ${idShort} | ${keyPadded} | ${statusPadded} | ${statusIcon}`);
    });
    console.log('   ' + '-'.repeat(80));

    // 2️⃣ Verification
    console.log('\n2️⃣ VERIFICATION:');
    const allHaveValidStatus = memories.every(m => validStatuses.includes(m.status));
    const noNulls = memories.every(m => m.status !== null && m.status !== undefined);
    const noUnexpectedStrings = memories.every(m => validStatuses.includes(m.status));

    console.log(`   ✔ All rows have valid status: ${allHaveValidStatus ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✔ No nulls: ${noNulls ? '✅ PASS' : '❌ FAIL'} (found ${nullCount} nulls)`);
    console.log(`   ✔ No unexpected strings: ${noUnexpectedStrings ? '✅ PASS' : '❌ FAIL'} (found ${invalidCount} invalid)`);

    // 3️⃣ Status distribution
    console.log('\n3️⃣ Status Distribution:');
    const statusCounts = {
      ACTIVE: memories.filter(m => m.status === 'ACTIVE').length,
      ARCHIVED: memories.filter(m => m.status === 'ARCHIVED').length,
      CONTRADICTED: memories.filter(m => m.status === 'CONTRADICTED').length,
    };
    console.log(`   ACTIVE: ${statusCounts.ACTIVE}`);
    console.log(`   ARCHIVED: ${statusCounts.ARCHIVED}`);
    console.log(`   CONTRADICTED: ${statusCounts.CONTRADICTED}`);
    console.log(`   Total: ${memories.length}`);

    // 4️⃣ Full memory snapshot (simulate /api/memory response)
    console.log('\n4️⃣ FINAL SYSTEM HEALTH CHECK - Memory Snapshot:');
    
    const MIN_DECAY_FACTOR = 0.7;
    const DECAY_PER_DAY = 0.01;

    const activeMemories = memories.filter(m => m.status === 'ACTIVE');
    
    activeMemories.forEach(m => {
      const days = m.lastAccessed 
        ? (Date.now() - new Date(m.lastAccessed).getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      const decayFactor = Math.max(MIN_DECAY_FACTOR, 1 - days * DECAY_PER_DAY);
      const score = m.weight * m.confidence * decayFactor;

      console.log(`\n   {`);
      console.log(`     "id": "${m.id}",`);
      console.log(`     "key": "${m.key}",`);
      console.log(`     "status": "${m.status}",`);
      console.log(`     "weight": ${m.weight},`);
      console.log(`     "confidence": ${m.confidence},`);
      console.log(`     "score": ${score.toFixed(4)},`);
      console.log(`     "lastAccessed": "${m.lastAccessed}",`);
      console.log(`     "cognitiveType": "${m.cognitiveType}"`);
      console.log(`   }`);
    });

    // 5️⃣ Shape validation
    console.log('\n5️⃣ Shape Validation:');
    const requiredFields = ['id', 'status', 'weight', 'confidence', 'lastAccessed', 'cognitiveType'];
    const allHaveRequiredFields = activeMemories.every(m => 
      requiredFields.every(field => m[field] !== undefined)
    );
    console.log(`   ✔ All memories have required fields: ${allHaveRequiredFields ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Required: ${requiredFields.join(', ')}`);

    const allPassed = allHaveValidStatus && noNulls && noUnexpectedStrings && allHaveRequiredFields;
    console.log(`\n=== TEST 4 RESULT: ${allPassed ? '✅ ALL PASS' : '❌ FAILED'} ===`);
    console.log(`\n=== SYSTEM HEALTH: ${allPassed ? '✅ HEALTHY' : '❌ UNHEALTHY'} ===`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStatusIntegrity();
