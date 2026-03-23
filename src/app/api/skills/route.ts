import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all skills
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      include: {
        _count: {
          select: { userSkills: true, jobSkills: true }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST create a new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, icon } = body;

    const skill = await db.skill.create({
      data: {
        name,
        category,
        description,
        icon
      }
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
