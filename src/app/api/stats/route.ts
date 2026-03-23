import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET platform statistics
export async function GET() {
  try {
    const [
      totalUsers,
      totalSkills,
      totalJobs,
      totalMatches,
      skillsByCategory
    ] = await Promise.all([
      db.user.count(),
      db.skill.count(),
      db.job.count(),
      db.userSkill.count(),
      db.skill.groupBy({
        by: ['category'],
        _count: { id: true }
      })
    ]);

    // Get skill distribution
    const skillDistribution = await db.skill.findMany({
      include: {
        _count: {
          select: { userSkills: true }
        }
      },
      orderBy: {
        userSkills: { _count: 'desc' }
      },
      take: 10
    });

    return NextResponse.json({
      totalUsers,
      totalSkills,
      totalJobs,
      totalMatches,
      skillsByCategory: skillsByCategory.map(s => ({
        category: s.category || 'Uncategorized',
        count: s._count.id
      })),
      topSkills: skillDistribution.map(s => ({
        name: s.name,
        users: s._count.userSkills
      }))
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
