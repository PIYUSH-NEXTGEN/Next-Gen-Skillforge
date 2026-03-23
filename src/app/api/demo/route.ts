import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Demo data for the landing page
const demoSkills = [
  { name: "JavaScript", category: "Programming", users: 1250 },
  { name: "Python", category: "Programming", users: 1180 },
  { name: "React", category: "Frontend", users: 980 },
  { name: "Node.js", category: "Backend", users: 870 },
  { name: "TypeScript", category: "Programming", users: 750 },
  { name: "SQL", category: "Database", users: 690 },
  { name: "AWS", category: "Cloud", users: 620 },
  { name: "Machine Learning", category: "AI/ML", users: 540 },
  { name: "Docker", category: "DevOps", users: 480 },
  { name: "Git", category: "Tools", users: 1420 }
];

const demoJobs = [
  {
    title: "Full Stack Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $120k",
    matchScore: 92,
    skills: ["React", "Node.js", "TypeScript", "SQL", "AWS"]
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Startup",
    location: "San Francisco",
    type: "Full-time",
    salary: "$120k - $180k",
    matchScore: 78,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Docker"]
  },
  {
    title: "Frontend Developer",
    company: "Design Studio",
    location: "New York",
    type: "Full-time",
    salary: "$70k - $100k",
    matchScore: 85,
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Git"]
  },
  {
    title: "Backend Engineer",
    company: "FinTech Inc",
    location: "London",
    type: "Full-time",
    salary: "$90k - $130k",
    matchScore: 72,
    skills: ["Node.js", "Python", "SQL", "AWS", "Docker"]
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $150k",
    matchScore: 68,
    skills: ["AWS", "Docker", "Kubernetes", "Python", "Git"]
  }
];

const demoGraphData = {
  nodes: [
    { id: "user", label: "You", type: "user", x: 400, y: 300 },
    { id: "js", label: "JavaScript", type: "skill", x: 250, y: 200 },
    { id: "react", label: "React", type: "skill", x: 350, y: 150 },
    { id: "python", label: "Python", type: "skill", x: 450, y: 200 },
    { id: "node", label: "Node.js", type: "skill", x: 550, y: 150 },
    { id: "ts", label: "TypeScript", type: "skill", x: 300, y: 350 },
    { id: "job1", label: "Full Stack Dev", type: "job", x: 600, y: 350 },
    { id: "job2", label: "ML Engineer", type: "job", x: 700, y: 250 }
  ],
  edges: [
    { from: "user", to: "js", strength: 0.85 },
    { from: "user", to: "react", strength: 0.75 },
    { from: "user", to: "python", strength: 0.60 },
    { from: "user", to: "node", strength: 0.70 },
    { from: "js", to: "react", strength: 0.9 },
    { from: "js", to: "node", strength: 0.8 },
    { from: "react", to: "ts", strength: 0.85 },
    { from: "node", to: "ts", strength: 0.75 },
    { from: "python", to: "job2", strength: 0.7 },
    { from: "react", to: "job1", strength: 0.9 },
    { from: "node", to: "job1", strength: 0.85 },
    { from: "ts", to: "job1", strength: 0.8 }
  ]
};

// GET demo data
export async function GET() {
  try {
    // Check if we have data in the database
    const existingSkills = await db.skill.count();
    
    if (existingSkills === 0) {
      // Seed initial data
      await db.skill.createMany({
        data: [
          { name: "JavaScript", category: "Programming", icon: "code" },
          { name: "Python", category: "Programming", icon: "code" },
          { name: "React", category: "Frontend", icon: "layout" },
          { name: "Node.js", category: "Backend", icon: "server" },
          { name: "TypeScript", category: "Programming", icon: "code" },
          { name: "SQL", category: "Database", icon: "database" },
          { name: "AWS", category: "Cloud", icon: "cloud" },
          { name: "Machine Learning", category: "AI/ML", icon: "brain" },
          { name: "Docker", category: "DevOps", icon: "container" },
          { name: "Git", category: "Tools", icon: "git-branch" },
          { name: "TensorFlow", category: "AI/ML", icon: "brain" },
          { name: "Kubernetes", category: "DevOps", icon: "container" },
          { name: "CSS", category: "Frontend", icon: "palette" },
          { name: "MongoDB", category: "Database", icon: "database" },
          { name: "GraphQL", category: "API", icon: "share-2" }
        ],
        skipDuplicates: true
      });

      // Create sample jobs
      await db.job.createMany({
        data: [
          {
            title: "Full Stack Developer",
            company: "TechCorp",
            location: "Remote",
            type: "Full-time",
            salary: "$80k - $120k",
            description: "Build and maintain web applications"
          },
          {
            title: "Machine Learning Engineer",
            company: "AI Startup",
            location: "San Francisco",
            type: "Full-time",
            salary: "$120k - $180k",
            description: "Develop ML models and pipelines"
          },
          {
            title: "Frontend Developer",
            company: "Design Studio",
            location: "New York",
            type: "Full-time",
            salary: "$70k - $100k",
            description: "Create beautiful user interfaces"
          }
        ],
        skipDuplicates: true
      });
    }

    return NextResponse.json({
      skills: demoSkills,
      jobs: demoJobs,
      graph: demoGraphData,
      stats: {
        totalUsers: 2847,
        totalSkills: 156,
        totalJobs: 423,
        totalMatches: 12847,
        avgMatchScore: 76.5
      }
    });
  } catch (error) {
    console.error("Error fetching demo data:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo data" },
      { status: 500 }
    );
  }
}
