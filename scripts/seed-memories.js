const { PrismaClient } = require('@prisma/client');

// CognitiveTypes constants (matching lib/memoryTypes.ts)
const CognitiveTypes = {
  GOAL_LONG_TERM: "GOAL_LONG_TERM",
  GOAL_SHORT_TERM: "GOAL_SHORT_TERM",
  FRICTION_ACTIVE: "FRICTION_ACTIVE",
  FRICTION_RECURRING: "FRICTION_RECURRING",
  PREFERENCE_COMMUNICATION: "PREFERENCE_COMMUNICATION",
  PREFERENCE_ROUTINE: "PREFERENCE_ROUTINE",
  IDENTITY_CORE: "IDENTITY_CORE",
  VALUE_SYSTEM: "VALUE_SYSTEM",
};

const prisma = new PrismaClient();

async function seedMemories() {
  try {
    // Find the first user
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No user found. Please sign in first.');
      return;
    }
    
    console.log('User found:', user.email);
    
    // Get or create MirrorProfile
    let profile = await prisma.mirrorProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (!profile) {
      profile = await prisma.mirrorProfile.create({
        data: { userId: user.id }
      });
      console.log('Created MirrorProfile:', profile.id);
    } else {
      console.log('MirrorProfile exists:', profile.id);
    }
    
    // Create memory entries with CognitiveTypes
    const memories = [
      {
        profileId: profile.id,
        key: 'primary_goal',
        value: 'Become mentally disciplined and build Mirror AI',
        cognitiveType: CognitiveTypes.GOAL_LONG_TERM,
        source: 'onboarding'
      },
      {
        profileId: profile.id,
        key: 'current_challenge',
        value: 'Consistency and focus',
        cognitiveType: CognitiveTypes.FRICTION_ACTIVE,
        source: 'onboarding'
      },
      {
        profileId: profile.id,
        key: 'preferred_feedback_style',
        value: 'Direct and honest',
        cognitiveType: CognitiveTypes.PREFERENCE_COMMUNICATION,
        source: 'onboarding'
      }
    ];
    
    await prisma.memory.createMany({ data: memories });
    console.log('Created 3 memory entries!');
    
    // Verify
    const count = await prisma.memory.count();
    console.log('Total memories in DB:', count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMemories();
