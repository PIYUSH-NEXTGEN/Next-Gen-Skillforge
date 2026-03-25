import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userSkills = body.userSkillNames || []; // e.g., ['JavaScript', 'React']

    if (!userSkills || userSkills.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    // Extract just the string names from the frontend payload if they are objects
    const skillNames = userSkills.map((s: any) => typeof s === 'string' ? s : s.name);

    // The Magic Cypher Query
    const cypher = `
      // 1. Get all Jobs and their Required Skills
      MATCH (j:Job)-[:REQUIRES_SKILL]->(req:Skill)
      WITH j, collect(req.name) as requiredSkills

      // 2. Get all Preferred Skills for those Jobs (if any)
      OPTIONAL MATCH (j)-[:PREFERS_SKILL]->(pref:Skill)
      WITH j, requiredSkills, collect(pref.name) as preferredSkills

      // 3. Compare User Skills against the Job's Skills
      WITH j, requiredSkills, preferredSkills,
           [s IN requiredSkills WHERE s IN $skillNames] as matchedReq,
           [s IN requiredSkills WHERE NOT s IN $skillNames] as missingReq,
           [s IN preferredSkills WHERE s IN $skillNames] as matchedPref

      // 4. Calculate Match Score (70% Required, 30% Preferred)
      WITH j, requiredSkills, missingReq,
           CASE WHEN size(requiredSkills) > 0 THEN (toFloat(size(matchedReq)) / size(requiredSkills)) * 70 ELSE 70 END as reqScore,
           CASE WHEN size(preferredSkills) > 0 THEN (toFloat(size(matchedPref)) / size(preferredSkills)) * 30 ELSE 0 END as prefScore

      // 5. Return the final formatted data
      RETURN j.title as title,
             (reqScore + prefScore) as matchScore,
             missingReq as gaps
      ORDER BY matchScore DESC
    `;

    const results = await runQuery(cypher, { skillNames });

    // Format the Neo4j records into clean JSON for our Next.js frontend
    const matches = results.map((record: any) => ({
      job: { title: record.get('title') },
      matchScore: Math.round(record.get('matchScore')),
      gaps: record.get('gaps').map((gap: string) => ({ skillName: gap }))
    }));

    return NextResponse.json({ matches });

  } catch (error: any) {
    console.error("Neo4j Matching Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}