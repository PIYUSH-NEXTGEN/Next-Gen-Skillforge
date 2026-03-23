'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Brain, 
  Briefcase, 
  Network,
  BarChart3,
  BookOpen,
  User,
  Upload,
  Github,
  FileText,
  Plus,
  Minus,
  Target,
  Sparkles,
  Menu,
  X
} from 'lucide-react'

// Sample Data
const ALL_SKILLS = [
  { id: 1, name: 'JavaScript', category: 'Frontend' },
  { id: 2, name: 'Python', category: 'Backend' },
  { id: 3, name: 'React', category: 'Frontend' },
  { id: 4, name: 'Node.js', category: 'Backend' },
  { id: 5, name: 'TypeScript', category: 'Frontend' },
  { id: 6, name: 'SQL', category: 'Database' },
  { id: 7, name: 'MongoDB', category: 'Database' },
  { id: 8, name: 'AWS', category: 'Cloud' },
  { id: 9, name: 'Docker', category: 'DevOps' },
  { id: 10, name: 'Git', category: 'Tools' },
  { id: 11, name: 'Machine Learning', category: 'AI/ML' },
  { id: 12, name: 'TensorFlow', category: 'AI/ML' },
  { id: 13, name: 'Java', category: 'Backend' },
  { id: 14, name: 'C++', category: 'Backend' },
  { id: 15, name: 'HTML/CSS', category: 'Frontend' },
]

const JOBS = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '$80k - $120k',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'AWS', 'Docker']
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Design Studio',
    location: 'New York',
    salary: '$70k - $100k',
    requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
    preferredSkills: ['TypeScript']
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    company: 'AI Startup',
    location: 'San Francisco',
    salary: '$120k - $180k',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    preferredSkills: ['Docker', 'AWS']
  },
  {
    id: 4,
    title: 'Backend Engineer',
    company: 'FinTech Inc',
    location: 'London',
    salary: '$90k - $130k',
    requiredSkills: ['Python', 'Node.js', 'SQL', 'MongoDB', 'Docker'],
    preferredSkills: ['AWS', 'Java']
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Solutions',
    location: 'Remote',
    salary: '$100k - $150k',
    requiredSkills: ['Docker', 'AWS', 'Python', 'Git'],
    preferredSkills: ['Kubernetes', 'Terraform']
  }
]

const LEARNING_RESOURCES = [
  { skill: 'TypeScript', title: 'TypeScript Fundamentals', platform: 'Coursera', duration: '2 weeks', level: 'Beginner' },
  { skill: 'AWS', title: 'AWS Certified Developer', platform: 'Udemy', duration: '4 weeks', level: 'Intermediate' },
  { skill: 'Docker', title: 'Docker Mastery', platform: 'Udemy', duration: '2 weeks', level: 'Beginner' },
  { skill: 'Machine Learning', title: 'ML Specialization', platform: 'Coursera', duration: '8 weeks', level: 'Intermediate' },
  { skill: 'TensorFlow', title: 'TensorFlow Developer', platform: 'Coursera', duration: '6 weeks', level: 'Intermediate' },
  { skill: 'Node.js', title: 'Node.js Complete Guide', platform: 'Udemy', duration: '3 weeks', level: 'Beginner' },
  { skill: 'MongoDB', title: 'MongoDB Basics', platform: 'MongoDB University', duration: '2 weeks', level: 'Beginner' },
  { skill: 'React', title: 'React - The Complete Guide', platform: 'Udemy', duration: '4 weeks', level: 'Beginner' },
]

// Navigation
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-gray-900">NXT-GEN SKILLFORGE</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm">
            <a href="#skills" className="text-gray-600 hover:text-gray-900">My Skills</a>
            <a href="#matching" className="text-gray-600 hover:text-gray-900">Job Matching</a>
            <a href="#gaps" className="text-gray-600 hover:text-gray-900">Skill Gaps</a>
            <a href="#learning" className="text-gray-600 hover:text-gray-900">Learning Path</a>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-2 border-t border-gray-200 space-y-2">
            <a href="#skills" className="block py-1 text-gray-600">My Skills</a>
            <a href="#matching" className="block py-1 text-gray-600">Job Matching</a>
            <a href="#gaps" className="block py-1 text-gray-600">Skill Gaps</a>
            <a href="#learning" className="block py-1 text-gray-600">Learning Path</a>
          </div>
        )}
      </div>
    </nav>
  )
}

// Skill Input Section
function SkillInputSection({ 
  userSkills, 
  setUserSkills 
}: { 
  userSkills: { skill: string; confidence: number; source: string }[]
  setUserSkills: (skills: { skill: string; confidence: number; source: string }[]) => void 
}) {
  const [selectedSkill, setSelectedSkill] = useState('')
  const [confidence, setConfidence] = useState(50)
  const [source, setSource] = useState('manual')

  const addSkill = () => {
    if (!selectedSkill) return
    if (userSkills.find(s => s.skill === selectedSkill)) return
    
    setUserSkills([...userSkills, { skill: selectedSkill, confidence: confidence / 100, source }])
    setSelectedSkill('')
    setConfidence(50)
  }

  const removeSkill = (skillName: string) => {
    setUserSkills(userSkills.filter(s => s.skill !== skillName))
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.7) return 'text-green-600'
    if (conf >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSourceBadge = (src: string) => {
    switch(src) {
      case 'resume': return { label: 'Resume', color: 'bg-blue-100 text-blue-700' }
      case 'github': return { label: 'GitHub', color: 'bg-purple-100 text-purple-700' }
      case 'assessment': return { label: 'Assessment', color: 'bg-green-100 text-green-700' }
      default: return { label: 'Manual', color: 'bg-gray-100 text-gray-700' }
    }
  }

  const skillsByCategory = ALL_SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof ALL_SKILLS>)

  return (
    <section id="skills" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            My Skills
          </CardTitle>
          <CardDescription>Add your skills manually, from resume, or GitHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Input Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button variant="outline" size="sm">
              <Github className="w-4 h-4 mr-2" />
              Connect GitHub
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Take Assessment
            </Button>
          </div>

          {/* Add Skill Form */}
          <div className="grid sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-xs">Select Skill</Label>
              <select 
                className="w-full mt-1 p-2 border rounded text-sm"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">Choose skill...</option>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <optgroup key={category} label={category}>
                    {skills.map(skill => (
                      <option key={skill.id} value={skill.name}>{skill.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Confidence: {confidence}%</Label>
              <Input 
                type="range" 
                min="10" 
                max="100" 
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs">Source</Label>
              <select 
                className="w-full mt-1 p-2 border rounded text-sm"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="manual">Manual Entry</option>
                <option value="resume">From Resume</option>
                <option value="github">From GitHub</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addSkill} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>
          </div>

          {/* Current Skills */}
          <div>
            <h4 className="text-sm font-medium mb-3">Your Skills ({userSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((s, i) => {
                const badge = getSourceBadge(s.source)
                return (
                  <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-full">
                    <span className="font-medium text-sm">{s.skill}</span>
                    <span className={`text-xs ${getConfidenceColor(s.confidence)}`}>
                      {Math.round(s.confidence * 100)}%
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    <button onClick={() => removeSkill(s.skill)} className="ml-1 text-gray-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
              {userSkills.length === 0 && (
                <p className="text-gray-400 text-sm">No skills added yet. Add your first skill above.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// Job Matching Section
function JobMatchingSection({ 
  userSkills 
}: { 
  userSkills: { skill: string; confidence: number; source: string }[] 
}) {
  const calculateMatch = (job: typeof JOBS[0]) => {
    const userSkillNames = userSkills.map(s => s.skill)
    
    // Required skills match
    const requiredMatch = job.requiredSkills.filter(s => userSkillNames.includes(s)).length
    const requiredScore = (requiredMatch / job.requiredSkills.length) * 70
    
    // Preferred skills match
    const preferredMatch = job.preferredSkills.filter(s => userSkillNames.includes(s)).length
    const preferredScore = job.preferredSkills.length > 0 
      ? (preferredMatch / job.preferredSkills.length) * 30 
      : 0
    
    // Confidence boost
    const avgConfidence = userSkills.length > 0 
      ? userSkills.reduce((sum, s) => sum + s.confidence, 0) / userSkills.length 
      : 0
    const confidenceBoost = avgConfidence * 10
    
    return Math.min(100, Math.round(requiredScore + preferredScore + confidenceBoost))
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const sortedJobs = [...JOBS].sort((a, b) => calculateMatch(b) - calculateMatch(a))

  return (
    <section id="matching" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Matching
          </CardTitle>
          <CardDescription>Jobs ranked by skill match percentage</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Add your skills to see job matches</p>
          ) : (
            <div className="space-y-3">
              {sortedJobs.map((job) => {
                const matchScore = calculateMatch(job)
                const userSkillNames = userSkills.map(s => s.skill)
                
                return (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                        <p className="text-sm text-emerald-600">{job.salary}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-lg font-bold ${getMatchColor(matchScore)}`}>
                        {matchScore}%
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((skill) => (
                          <span 
                            key={skill} 
                            className={`text-xs px-2 py-0.5 rounded ${
                              userSkillNames.includes(skill) 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {userSkillNames.includes(skill) ? '✓' : '✗'} {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

// Skill Gap Analysis Section
function SkillGapSection({ 
  userSkills 
}: { 
  userSkills: { skill: string; confidence: number; source: string }[] 
}) {
  const userSkillNames = userSkills.map(s => s.skill)
  
  // Find missing skills from top jobs
  const getMissingSkills = () => {
    const missingMap = new Map<string, { count: number; jobs: string[] }>()
    
    JOBS.forEach(job => {
      [...job.requiredSkills, ...job.preferredSkills].forEach(skill => {
        if (!userSkillNames.includes(skill)) {
          const existing = missingMap.get(skill)
          if (existing) {
            existing.count++
            existing.jobs.push(job.title)
          } else {
            missingMap.set(skill, { count: 1, jobs: [job.title] })
          }
        }
      })
    })
    
    return Array.from(missingMap.entries())
      .map(([skill, data]) => ({ skill, ...data }))
      .sort((a, b) => b.count - a.count)
  }

  const missingSkills = getMissingSkills()

  return (
    <section id="gaps" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Skill Gap Analysis
          </CardTitle>
          <CardDescription>Skills you're missing for better job matches</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Add your skills to see gap analysis</p>
          ) : missingSkills.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Great! You have all the key skills!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2">
                <div className="col-span-4">Missing Skill</div>
                <div className="col-span-2 text-center">Priority</div>
                <div className="col-span-6">Required For</div>
              </div>
              {missingSkills.slice(0, 8).map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-4 font-medium text-sm">{item.skill}</div>
                  <div className="col-span-2 text-center">
                    <Badge variant={item.count >= 3 ? 'destructive' : item.count >= 2 ? 'default' : 'secondary'}>
                      {item.count} jobs
                    </Badge>
                  </div>
                  <div className="col-span-6 text-xs text-gray-500">
                    {item.jobs.slice(0, 2).join(', ')}
                    {item.jobs.length > 2 && ` +${item.jobs.length - 2} more`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

// Learning Path Section
function LearningPathSection({ 
  userSkills 
}: { 
  userSkills: { skill: string; confidence: number; source: string }[] 
}) {
  const userSkillNames = userSkills.map(s => s.skill)
  
  const getRecommendedLearning = () => {
    const missingSkills = new Set<string>()
    
    JOBS.forEach(job => {
      job.requiredSkills.forEach(skill => {
        if (!userSkillNames.includes(skill)) {
          missingSkills.add(skill)
        }
      })
    })
    
    return LEARNING_RESOURCES.filter(resource => missingSkills.has(resource.skill))
  }

  const recommendedLearning = getRecommendedLearning()

  return (
    <section id="learning" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Personalized Learning Path
          </CardTitle>
          <CardDescription>Recommended courses based on your skill gaps</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Add your skills to get learning recommendations</p>
          ) : recommendedLearning.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">You're all set! No urgent learning needed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedLearning.map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <p className="text-xs text-gray-500">
                      {course.platform} • {course.duration} • {course.level}
                    </p>
                  </div>
                  <Badge variant="outline">{course.skill}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

// Skill Graph Visualization
function SkillGraphSection({ 
  userSkills 
}: { 
  userSkills: { skill: string; confidence: number; source: string }[] 
}) {
  const userSkillNames = userSkills.map(s => s.skill)
  
  return (
    <section className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Skill Graph
          </CardTitle>
          <CardDescription>Visual representation of your skill connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 h-64 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 220">
              {/* Center - User */}
              <circle cx="250" cy="110" r="30" fill="#059669" />
              <text x="250" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">YOU</text>
              
              {/* Skill nodes */}
              {userSkills.slice(0, 6).map((s, i) => {
                const angle = (i / 6) * 2 * Math.PI - Math.PI / 2
                const x = 250 + 80 * Math.cos(angle)
                const y = 110 + 70 * Math.sin(angle)
                
                return (
                  <g key={i}>
                    <line x1="250" y1="110" x2={x} y2={y} stroke="#d1d5db" strokeWidth="2" />
                    <circle cx={x} cy={y} r="25" fill={s.confidence > 0.6 ? '#3b82f6' : '#9ca3af'} />
                    <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="9">
                      {s.skill.length > 10 ? s.skill.slice(0, 8) + '..' : s.skill}
                    </text>
                  </g>
                )
              })}
              
              {/* Job nodes */}
              {JOBS.slice(0, 3).map((job, i) => {
                const x = 450
                const y = 50 + i * 60
                
                return (
                  <g key={i}>
                    <line x1="280" y1="110" x2={x} y2={y} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4" />
                    <circle cx={x} cy={y} r="20" fill="#8b5cf6" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="7">
                      {job.title.split(' ')[0]}
                    </text>
                  </g>
                )
              })}
            </svg>
            
            {userSkills.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <p className="text-gray-400">Add skills to see graph</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>User</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Skills (High confidence)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span>Skills (Low confidence)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Jobs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// Team Section
function TeamSection() {
  const team = [
    { name: 'Divyansh Meena', role: 'Frontend & DevOps', college: 'Oriental College of Technology' },
    { name: 'Piyush Baraskar', role: 'Machine Learning', college: 'Technocrats Institute of Technology' },
    { name: 'Utkarsh Jain', role: 'ML/Graph Intelligence', college: 'Technocrats Institute of Technology' },
    { name: 'Vishal Vishwakarma', role: 'Backend (API)', college: 'Technocrats Institute of Technology' },
    { name: 'Ratnesh Amule', role: 'Database & Presenter', college: 'Oriental College of Technology' }
  ]

  return (
    <section className="py-8 border-t">
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-2">NEXT GEN BUILDERS</Badge>
        <h2 className="text-xl font-bold">Our Team</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {team.map((member, i) => (
          <div key={i} className="text-center p-3 border rounded-lg w-36">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm mb-2">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p className="font-medium text-sm">{member.name}</p>
            <p className="text-xs text-emerald-600">{member.role}</p>
            <p className="text-xs text-gray-400 mt-1">{member.college}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Main Page
export default function Home() {
  const [userSkills, setUserSkills] = useState<{ skill: string; confidence: number; source: string }[]>([
    { skill: 'JavaScript', confidence: 0.8, source: 'github' },
    { skill: 'React', confidence: 0.7, source: 'manual' },
    { skill: 'Python', confidence: 0.5, source: 'resume' },
    { skill: 'Git', confidence: 0.9, source: 'github' },
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">NXT-GEN SKILLFORGE</h1>
          <p className="text-gray-500 text-sm">Skill-intelligence platform for job matching & upskilling</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Your Skills', value: userSkills.length },
            { label: 'Job Matches', value: userSkills.length > 0 ? JOBS.length : 0 },
            { label: 'Skill Gaps', value: Math.max(0, 15 - userSkills.length) },
            { label: 'Learning', value: userSkills.length > 0 ? 4 : 0 }
          ].map((stat, i) => (
            <div key={i} className="bg-white border rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-600">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <SkillInputSection userSkills={userSkills} setUserSkills={setUserSkills} />
        <SkillGraphSection userSkills={userSkills} />
        <JobMatchingSection userSkills={userSkills} />
        <SkillGapSection userSkills={userSkills} />
        <LearningPathSection userSkills={userSkills} />
        
        {/* Footer */}
        <TeamSection />
        
        <footer className="text-center py-6 text-sm text-gray-400 border-t mt-8">
          © 2024 NXT-GEN SKILLFORGE - Next Gen Builders
        </footer>
      </div>
    </main>
  )
}
