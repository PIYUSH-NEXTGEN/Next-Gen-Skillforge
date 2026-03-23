import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all jobs with required skills
export async function GET() {
  try {
    const jobs = await db.job.findMany({
      include: {
        jobSkills: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { postedAt: "desc" }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, company, location, type, salary, description, requirements, skills } = body;

    const job = await db.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements,
        jobSkills: skills ? {
          create: skills.map((s: { skillId: string; importance: number }) => ({
            skillId: s.skillId,
            importance: s.importance || 1.0
          }))
        } : undefined
      },
      include: {
        jobSkills: {
          include: { skill: true }
        }
      }
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
