import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Calculate job match based on user skills
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userSkills } = body; // Array of { skillId, confidence }

    // Get all jobs with their required skills
    const jobs = await db.job.findMany({
      include: {
        jobSkills: {
          include: {
            skill: true
          }
        }
      }
    });

    // Calculate match score for each job
    const matches = jobs.map(job => {
      const requiredSkills = job.jobSkills;
      let matchedSkills = 0;
      let totalWeight = 0;
      let weightedScore = 0;

      const skillMatches = requiredSkills.map(js => {
        const userSkill = userSkills.find((us: { skillId: string; confidence: number }) => us.skillId === js.skillId);
        const hasSkill = !!userSkill;
        const confidence = userSkill?.confidence || 0;
        
        if (hasSkill) {
          matchedSkills++;
          weightedScore += confidence * js.importance;
        }
        totalWeight += js.importance;

        return {
          skill: js.skill,
          required: js.required,
          importance: js.importance,
          hasSkill,
          confidence
        };
      });

      const matchPercentage = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
      const coveragePercentage = requiredSkills.length > 0 ? (matchedSkills / requiredSkills.length) * 100 : 0;

      return {
        job,
        matchScore: Math.round(matchPercentage),
        coverageScore: Math.round(coveragePercentage),
        matchedSkillsCount: matchedSkills,
        totalSkillsCount: requiredSkills.length,
        skillMatches,
        gaps: skillMatches.filter((sm: { hasSkill: boolean }) => !sm.hasSkill).map((sm: { skill: { id: string; name: string; category: string | null } }) => ({
          skillId: sm.skill.id,
          skillName: sm.skill.name,
          category: sm.skill.category
        }))
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error calculating matches:", error);
    return NextResponse.json(
      { error: "Failed to calculate matches" },
      { status: 500 }
    );
  }
}

// GET - Get skill gap analysis for demo
export async function GET() {
  try {
    // Return demo skill gap analysis
    const gapAnalysis = {
      currentSkills: [
        { name: "JavaScript", confidence: 0.85, category: "Programming" },
        { name: "React", confidence: 0.75, category: "Frontend" },
        { name: "Python", confidence: 0.60, category: "Programming" },
        { name: "SQL", confidence: 0.70, category: "Database" }
      ],
      gaps: [
        { skill: "TypeScript", priority: 5, reason: "Required for 78% of React jobs" },
        { skill: "Node.js", priority: 4, reason: "Backend integration skills needed" },
        { skill: "AWS", priority: 3, reason: "Cloud deployment is increasingly required" },
        { skill: "Docker", priority: 3, reason: "Containerization is standard practice" }
      ],
      recommendedPath: [
        { step: 1, skill: "TypeScript", resource: "TypeScript Fundamentals", duration: "2 weeks" },
        { step: 2, skill: "Node.js", resource: "Node.js Complete Guide", duration: "3 weeks" },
        { step: 3, skill: "AWS", resource: "AWS Certified Developer", duration: "4 weeks" },
        { step: 4, skill: "Docker", resource: "Docker Mastery", duration: "2 weeks" }
      ]
    };

    return NextResponse.json(gapAnalysis);
  } catch (error) {
    console.error("Error fetching gap analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch gap analysis" },
      { status: 500 }
    );
  }
}
