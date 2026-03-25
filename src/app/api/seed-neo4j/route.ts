import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

const FALLBACK_SKILLS = [
  { name: 'JavaScript', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'Programming' },
  { name: 'SQL', category: 'Database' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Git', category: 'Tools' },
];

const FALLBACK_JOBS = [
  { title: 'Full Stack Developer', required: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'], preferred: ['TypeScript', 'AWS', 'Docker'] },
  { title: 'Frontend Developer', required: ['JavaScript', 'React', 'Git'], preferred: ['TypeScript'] },
  { title: 'Backend Engineer', required: ['Python', 'Node.js', 'SQL', 'Docker'], preferred: ['AWS'] },
];

export async function GET() {
  try {
    // 1. Clear the existing database (Be careful, this wipes everything!)
    await runQuery(`MATCH (n) DETACH DELETE n`);

    // 2. Insert Skills
    for (const skill of FALLBACK_SKILLS) {
      await runQuery(
        `MERGE (s:Skill {name: $name}) SET s.category = $category`,
        { name: skill.name, category: skill.category }
      );
    }

    // 3. Insert Jobs & Create Relationships
    for (const job of FALLBACK_JOBS) {
      // Create the Job Node
      await runQuery(
        `MERGE (j:Job {title: $title})`,
        { title: job.title }
      );

      // Link Required Skills
      for (const reqSkill of job.required) {
        await runQuery(
          `
          MATCH (j:Job {title: $title})
          MATCH (s:Skill {name: $skillName})
          MERGE (j)-[:REQUIRES_SKILL]->(s)
          `,
          { title: job.title, skillName: reqSkill }
        );
      }

      // Link Preferred Skills
      for (const prefSkill of job.preferred) {
        await runQuery(
          `
          MATCH (j:Job {title: $title})
          MATCH (s:Skill {name: $skillName})
          MERGE (j)-[:PREFERS_SKILL]->(s)
          `,
          { title: job.title, skillName: prefSkill }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Neo4j Graph successfully seeded with Skills and Jobs!' 
    });

  } catch (error: any) {
    console.error("Neo4j Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}