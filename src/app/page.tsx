'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/use-toast'
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  Github,
  Menu,
  Moon,
  Network,
  Plus,
  Sparkles,
  Sun,
  Target,
  Upload,
  User,
  X,
} from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { signIn, signOut, useSession } from "next-auth/react"

type SkillSource = 'manual' | 'resume' | 'github' | 'assessment'
type UserSkill = { skill: string; confidence: number; source: SkillSource }
type SkillCatalogItem = { id: number; name: string; category: string }
type JobItem = {
  id: number
  title: string
  company: string
  location: string
  salary: string
  requiredSkills: string[]
  preferredSkills: string[]
}

const FALLBACK_SKILLS: SkillCatalogItem[] = [
  { id: 1, name: 'JavaScript', category: 'Programming' },
  { id: 2, name: 'TypeScript', category: 'Programming' },
  { id: 3, name: 'React', category: 'Frontend' },
  { id: 4, name: 'Node.js', category: 'Backend' },
  { id: 5, name: 'Python', category: 'Programming' },
  { id: 6, name: 'SQL', category: 'Database' },
  { id: 7, name: 'AWS', category: 'Cloud' },
  { id: 8, name: 'Docker', category: 'DevOps' },
  { id: 9, name: 'Git', category: 'Tools' },
]

const FALLBACK_JOBS: JobItem[] = [
  { id: 1, title: 'Full Stack Developer', company: 'TechCorp', location: 'Remote', salary: '$80k - $120k', requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'], preferredSkills: ['TypeScript', 'AWS', 'Docker'] },
  { id: 2, title: 'Frontend Developer', company: 'Design Studio', location: 'New York', salary: '$70k - $100k', requiredSkills: ['JavaScript', 'React', 'Git'], preferredSkills: ['TypeScript'] },
  { id: 3, title: 'Backend Engineer', company: 'FinTech Inc', location: 'London', salary: '$90k - $130k', requiredSkills: ['Python', 'Node.js', 'SQL', 'Docker'], preferredSkills: ['AWS'] },
]

const LEARNING_RESOURCES = [
  { skill: 'TypeScript', title: 'TypeScript Fundamentals', platform: 'Coursera', duration: '2 weeks', level: 'Beginner' },
  { skill: 'AWS', title: 'AWS Certified Developer', platform: 'Udemy', duration: '4 weeks', level: 'Intermediate' },
  { skill: 'Docker', title: 'Docker Mastery', platform: 'Udemy', duration: '2 weeks', level: 'Beginner' },
  { skill: 'Python', title: 'Python for Everybody', platform: 'Coursera', duration: '3 weeks', level: 'Beginner' },
  { skill: 'Node.js', title: 'Node.js Complete Guide', platform: 'Udemy', duration: '3 weeks', level: 'Beginner' },
  { skill: 'React', title: 'React - The Complete Guide', platform: 'Udemy', duration: '4 weeks', level: 'Beginner' },
]

const LANGUAGE_TO_SKILLS: Record<string, string[]> = {
  JavaScript: ['JavaScript', 'Node.js', 'React'],
  TypeScript: ['TypeScript', 'JavaScript', 'React'],
  Python: ['Python'],
  HTML: ['HTML/CSS'],
  CSS: ['HTML/CSS'],
  Go: ['Go'],
  Java: ['Java'],
  'C++': ['C++'],
  Shell: ['Linux', 'DevOps'],
  Dockerfile: ['Docker'],
}

const normalize = (v: string) => v.toLowerCase().trim()

function mergeSkills(current: UserSkill[], incoming: UserSkill[]): UserSkill[] {
  const map = new Map<string, UserSkill>()
  for (const s of current) map.set(normalize(s.skill), s)
  for (const s of incoming) {
    const key = normalize(s.skill)
    const existing = map.get(key)
    if (!existing) {
      map.set(key, s)
      continue
    }
    map.set(key, {
      ...existing,
      confidence: Math.max(existing.confidence, s.confidence),
      source: s.source === 'manual' ? existing.source : s.source,
    })
  }
  return Array.from(map.values()).sort((a, b) => a.skill.localeCompare(b.skill))
}

// Navigation
function Navigation({ theme, toggleTheme, mounted }: { theme: 'light' | 'dark'; toggleTheme: () => void; mounted: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">NXT-GEN SKILLFORGE</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm">
            <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">My Skills</a>
            <a href="#matching" className="text-muted-foreground hover:text-foreground transition-colors">Job Matching</a>
            <a href="#gaps" className="text-muted-foreground hover:text-foreground transition-colors">Skill Gaps</a>
            <a href="#learning" className="text-muted-foreground hover:text-foreground transition-colors">Learning Path</a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="text-foreground hover:bg-muted transition-colors"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:bg-muted transition-colors"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-2 border-t border-border space-y-2">
            <a href="#skills" className="block py-1 text-muted-foreground hover:text-foreground">My Skills</a>
            <a href="#matching" className="block py-1 text-muted-foreground hover:text-foreground">Job Matching</a>
            <a href="#gaps" className="block py-1 text-muted-foreground hover:text-foreground">Skill Gaps</a>
            <a href="#learning" className="block py-1 text-muted-foreground hover:text-foreground">Learning Path</a>
          </div>
        )}
      </div>
    </nav>
  )
}

// Skill Input Section
function SkillInputSection({ 
  userSkills, 
  onUserSkillsChange,
  allSkills,
  onResumeUpload,
  onGithubImport,
  onAssessment
}: {
  userSkills: UserSkill[]
  onUserSkillsChange: (skills: UserSkill[]) => void
  allSkills: SkillCatalogItem[]
  onResumeUpload: () => void
  onGithubImport: () => void
  onAssessment: () => void
}) {
  const { data: session } = useSession()
  const [selectedSkill, setSelectedSkill] = useState('')
  const [confidence, setConfidence] = useState(50)
  const [source, setSource] = useState('manual')

  const addSkill = () => {
    if (!selectedSkill) return
    if (userSkills.find(s => s.skill === selectedSkill)) return
    
    onUserSkillsChange([...userSkills, { skill: selectedSkill, confidence: confidence / 100, source: source as SkillSource }])
    setSelectedSkill('')
    setConfidence(50)
  }

  const removeSkill = (skillName: string) => {
    onUserSkillsChange(userSkills.filter(s => s.skill !== skillName))
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.7) return 'text-[#4ADE80]' // Mint Green
    if (conf >= 0.4) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSourceBadge = (src: string) => {
    switch(src) {
      case 'resume': return { label: 'Resume', color: 'bg-blue-900/40 text-blue-200 border border-blue-800' }
      case 'github': return { label: 'GitHub', color: 'bg-purple-900/40 text-purple-200 border border-purple-800' }
      case 'assessment': return { label: 'Assessment', color: 'bg-green-900/40 text-green-200 border border-green-800' }
      default: return { label: 'Manual', color: 'bg-muted text-muted-foreground border border-border' }
    }
  }

  const skillsByCategory = allSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, SkillCatalogItem[]>)

  return (
    <section id="skills" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            My Skills
          </CardTitle>
          <CardDescription>Add your skills manually, from resume, or GitHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Input Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={onResumeUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
           {session ? (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onGithubImport} className="bg-green-900/20 text-green-400 border-green-800 hover:bg-green-900/40">
              <Github className="w-4 h-4 mr-2" />
              Import from {session?.user?.name}
            </Button>
            <Button 
             variant="outline" 
             size="sm" 
             onClick={() => signOut()} 
             className="px-2 text-muted-foreground hover:text-red-400 hover:bg-red-900/20 hover:border-red-900"
             title="Disconnect GitHub"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn("github")}>
              <Github className="w-4 h-4 mr-2" />
              Connect GitHub
            </Button>
          )}
            <Button variant="outline" size="sm" onClick={onAssessment}>
              <FileText className="w-4 h-4 mr-2" />
              Take Assessment
            </Button>
          </div>

          {/* Add Skill Form */}
          <div className="grid sm:grid-cols-4 gap-4 p-4 bg-background border border-border rounded-lg transition-colors">
            <div>
              <Label className="text-xs text-foreground">Select Skill</Label>
              <select 
                className="w-full mt-1 p-2 border rounded text-sm bg-card border-border text-foreground focus:ring-primary focus:border-primary outline-none"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">Choose skill...</option>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <optgroup key={category} label={category} className="bg-background">
                    {skills.map(skill => (
                      <option key={skill.id} value={skill.name}>{skill.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs text-foreground">Confidence: {confidence}%</Label>
              <Input 
                type="range" 
                min="10" 
                max="100" 
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="mt-2 accent-primary"
              />
            </div>
            <div>
              <Label className="text-xs text-foreground">Source</Label>
              <select 
                className="w-full mt-1 p-2 border rounded text-sm bg-card border-border text-foreground focus:ring-primary focus:border-primary outline-none"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="manual" className="bg-background">Manual Entry</option>
                <option value="resume" className="bg-background">From Resume</option>
                <option value="github" className="bg-background">From GitHub</option>
                <option value="assessment" className="bg-background">Assessment</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addSkill} size="sm" className="w-full bg-primary text-primary-foreground shadow-cyber-glow hover:opacity-90">
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>
          </div>

          {/* Current Skills */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">Your Skills ({userSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((s, i) => {
                const badge = getSourceBadge(s.source)
                return (
                  <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-background border border-border rounded-full transition-colors">
                    <span className="font-medium text-sm text-foreground">{s.skill}</span>
                    <span className={`text-xs ${getConfidenceColor(s.confidence)}`}>
                      {Math.round(s.confidence * 100)}%
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    <button onClick={() => removeSkill(s.skill)} className="ml-1 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
              {userSkills.length === 0 && (
                <p className="text-muted-foreground text-sm">No skills added yet. Add your first skill above.</p>
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
  userSkills, jobs, matches
}: { 
  userSkills: UserSkill[]
  jobs: JobItem[]
  matches: Array<{ title: string; matchScore: number }>
}) {
  const calculateMatch = (job: JobItem) => {
    const apiMatch = matches.find((m) => m.title === job.title)
    if (apiMatch) return apiMatch.matchScore
    const userSkillNames = userSkills.map(s => s.skill)
    const requiredPool = job.requiredSkills.length > 0 ? job.requiredSkills : job.preferredSkills
    
    // Required skills match
    const requiredMatch = requiredPool.filter(s => userSkillNames.includes(s)).length
    const requiredScore = requiredPool.length > 0 ? (requiredMatch / requiredPool.length) * 70 : 0
    
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
    if (score >= 80) return 'text-[#4ADE80] bg-green-900/20 border border-green-800'
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20 border border-yellow-800'
    return 'text-red-400 bg-red-900/20 border border-red-800'
  }

  const sortedJobs = [...jobs].sort((a, b) => calculateMatch(b) - calculateMatch(a))

  return (
    <section id="matching" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job Matching
          </CardTitle>
          <CardDescription>Jobs ranked by skill match percentage</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Add your skills to see job matches</p>
          ) : (
            <div className="space-y-3">
              {sortedJobs.map((job) => {
                const matchScore = calculateMatch(job)
                const userSkillNames = userSkills.map(s => s.skill)
                
                return (
                  <div key={job.id} className="border border-border bg-background rounded-lg p-4 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                        <p className="text-sm text-primary mt-1">{job.salary}</p>
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
                            className={`text-xs px-2 py-0.5 rounded border ${
                              userSkillNames.includes(skill) 
                                ? 'bg-green-900/20 text-[#4ADE80] border-green-800/50' 
                                : 'bg-red-900/20 text-red-400 border-red-800/50'
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
  userSkills, 
  matches 
}: { 
  userSkills: UserSkill[]
  matches: any[] 
}) {
  
const getMissingSkills = () => {
    const missingMap = new Map<string, { count: number; jobs: string[] }>()
    
    matches.forEach(match => {
      match.gaps?.forEach((gap: any) => {
        const skillName = typeof gap === 'string' ? gap : gap.skillName; 
        const existing = missingMap.get(skillName)
        
        if (existing) {
          existing.count++
          if (!existing.jobs.includes(match.title)) {
             existing.jobs.push(match.title)
          }
        } else {
          missingMap.set(skillName, { count: 1, jobs: [match.title] })
        }
      })
    })
    
    return Array.from(missingMap.entries())
      .map(([skill, data]) => ({ skill, ...data }))
      .sort((a, b) => b.count - a.count)
  }

  const missingSkills = getMissingSkills();

  return (
    <section id="gaps" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Skill Gap Analysis
          </CardTitle>
          <CardDescription>Skills you're missing for better job matches (Powered by Neo4j)</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Add your skills to see gap analysis</p>
          ) : missingSkills.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-[#4ADE80] mx-auto mb-2" />
              <p className="text-[#4ADE80] font-medium">Great! You have all the key skills!</p>
            </div>
          ) : (
             <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
                <div className="col-span-4">Missing Skill</div>
                <div className="col-span-2 text-center">Priority</div>
                <div className="col-span-6">Required For</div>
              </div>
              {missingSkills.slice(0, 8).map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 bg-background border border-border rounded-lg transition-colors">
                  <div className="col-span-4 font-medium text-sm text-foreground">{item.skill}</div>
                  <div className="col-span-2 text-center">
                    <Badge variant={item.count >= 3 ? 'destructive' : item.count >= 2 ? 'default' : 'secondary'}>
                      {item.count} jobs
                    </Badge>
                  </div>
                  <div className="col-span-6 text-xs text-muted-foreground">
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
  userSkills, jobs, prioritizedSkills
}: { 
  userSkills: UserSkill[]
  jobs: JobItem[]
  prioritizedSkills: string[]
}) {
  const userSkillNames = userSkills.map(s => s.skill)
  
  const getRecommendedLearning = () => {
    const missingSkills = new Set<string>()
    
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        if (!userSkillNames.includes(skill)) {
          missingSkills.add(skill)
        }
      })
    })
    
    const base = LEARNING_RESOURCES.filter(resource => missingSkills.has(resource.skill))
    if (prioritizedSkills.length === 0) return base
    return base.sort((a, b) => prioritizedSkills.indexOf(a.skill) - prioritizedSkills.indexOf(b.skill))
  }

  const urgentLearning = getRecommendedLearning().slice(0, 4)
  const urgentSkillSet = new Set(urgentLearning.map((c) => c.skill))
  const futureLearning = LEARNING_RESOURCES
    .filter((resource) => !urgentSkillSet.has(resource.skill))
    .slice(0, 4)

  return (
    <section id="learning" className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Personalized Learning Path
          </CardTitle>
          <CardDescription>Recommended courses based on your skill gaps</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Add your skills to get learning recommendations</p>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-red-400">Urgent (close critical gaps)</p>
                  <Badge variant="destructive">{urgentLearning.length} items</Badge>
                </div>
                {urgentLearning.length === 0 ? (
                  <div className="text-center py-6 border border-border bg-background rounded-lg">
                    <CheckCircle2 className="w-10 h-10 text-[#4ADE80] mx-auto mb-2" />
                    <p className="text-[#4ADE80] font-medium text-sm">No urgent gaps found right now.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {urgentLearning.map((course, i) => (
                      <div key={`u-${i}`} className="flex items-center gap-4 p-3 border border-border bg-background rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-red-900/40 text-red-400 border border-red-800 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{course.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {course.platform} • {course.duration} • {course.level}
                          </p>
                        </div>
                        <Badge variant="outline">{course.skill}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-primary">Future (growth roadmap)</p>
                  <Badge variant="secondary">{futureLearning.length} items</Badge>
                </div>
                <div className="space-y-2">
                  {futureLearning.map((course, i) => (
                    <div key={`f-${i}`} className="flex items-center gap-4 p-3 border border-border bg-background rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {course.platform} • {course.duration} • {course.level}
                        </p>
                      </div>
                      <Badge variant="outline">{course.skill}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

// Skill Spider Analysis
function SkillGraphSection({ userSkills, jobs }: { userSkills: UserSkill[]; jobs: JobItem[] }) {
  const categoryRadar = useMemo(() => {
    const categories = ['Frontend', 'Backend', 'Programming', 'Database', 'Cloud', 'DevOps', 'AI/ML', 'Tools']
    return categories.map((category) => {
      const related = userSkills.filter((s) => {
        const skillCategory = FALLBACK_SKILLS.find((k) => normalize(k.name) === normalize(s.skill))?.category ?? 'Programming'
        return skillCategory === category
      })
      return {
        metric: category,
        score: Math.round((related.reduce((acc, item) => acc + item.confidence, 0) / Math.max(1, related.length)) * 100),
        max: 100,
      }
    })
  }, [userSkills])

  const topJob = useMemo(() => {
    if (jobs.length === 0) return null
    return jobs[0]
  }, [jobs])

  const readinessRadar = useMemo(() => {
    if (!topJob) return []
    const skillNames = userSkills.map((x) => normalize(x.skill))
    return topJob.requiredSkills.slice(0, 6).map((skill) => ({
      metric: skill,
      score: skillNames.includes(normalize(skill))
        ? Math.round((userSkills.find((x) => normalize(x.skill) === normalize(skill))?.confidence ?? 0.6) * 100)
        : 10,
      max: 100,
    }))
  }, [topJob, userSkills])

  const marketRadar = useMemo(() => {
    const demand = new Map<string, number>()
    for (const job of jobs) {
      for (const skill of [...job.requiredSkills, ...job.preferredSkills]) {
        demand.set(skill, (demand.get(skill) ?? 0) + 1)
      }
    }
    const skillNames = userSkills.map((x) => normalize(x.skill))
    return Array.from(demand.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill, hits]) => ({
        metric: skill,
        demand: Math.min(100, hits * 20),
        user: skillNames.includes(normalize(skill))
          ? Math.round((userSkills.find((x) => normalize(x.skill) === normalize(skill))?.confidence ?? 0.7) * 100)
          : 5,
      }))
  }, [jobs, userSkills])

  return (
    <section className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Skill Spider Analysis
          </CardTitle>
          <CardDescription>Radar charts for strengths, job readiness, and market demand alignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-background border border-border rounded-lg p-3 h-64">
              <p className="text-xs mb-2 text-muted-foreground">Category confidence</p>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={categoryRadar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar dataKey="score" fill="#4ADE80" fillOpacity={0.35} stroke="#4ADE80" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 h-64">
              <p className="text-xs mb-2 text-muted-foreground">Top-role readiness</p>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={readinessRadar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar dataKey="score" fill="#38BDF8" fillOpacity={0.3} stroke="#38BDF8" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 h-64">
              <p className="text-xs mb-2 text-muted-foreground">Demand vs your confidence</p>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={marketRadar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar dataKey="demand" fill="#8b5cf6" fillOpacity={0.2} stroke="#8b5cf6" />
                  <Radar dataKey="user" fill="#EAB308" fillOpacity={0.3} stroke="#EAB308" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// Main Page
export default function Home() {
  const { theme, toggleTheme, mounted } = useTheme()
  const { toast } = useToast()
  const { data: session } = useSession()
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [userSkills, setUserSkills] = useState<UserSkill[]>([
    { skill: 'JavaScript', confidence: 0.8, source: 'github' },
    { skill: 'React', confidence: 0.7, source: 'manual' },
    { skill: 'Python', confidence: 0.5, source: 'resume' },
    { skill: 'Git', confidence: 0.9, source: 'github' },
  ])
  const [skillsCatalog, setSkillsCatalog] = useState<SkillCatalogItem[]>(FALLBACK_SKILLS)
  const [jobs, setJobs] = useState<JobItem[]>(FALLBACK_JOBS)
  const [matches, setMatches] = useState<Array<{ title: string; matchScore: number; gaps: string[] }>>([])
  const [loadingData, setLoadingData] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const ensureDemoData = async () => {
      try {
        await fetch('/api/demo')
      } catch {
        // silent fallback
      }
    }

    const fetchPlatformData = async () => {
      try {
        await ensureDemoData()
        const [skillsRes, jobsRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/jobs')
        ])

        if (!skillsRes.ok || !jobsRes.ok) {
          throw new Error('API request failed')
        }

        const [skillsData, jobsData] = await Promise.all([
          skillsRes.json(),
          jobsRes.json()
        ])

        if (Array.isArray(skillsData.skills) && skillsData.skills.length > 0) {
          const mappedSkills: SkillCatalogItem[] = skillsData.skills.map(
            (skill: { id: string; name: string; category?: string | null }, idx: number) => ({
              id: idx + 1,
              name: skill.name,
              category: skill.category || 'General'
            })
          )
          setSkillsCatalog(mappedSkills)
        }

        if (Array.isArray(jobsData.jobs) && jobsData.jobs.length > 0) {
          const mappedJobs: JobItem[] = jobsData.jobs.map(
            (
              job: {
                title: string
                company?: string | null
                location?: string | null
                salary?: string | null
                jobSkills?: Array<{ required?: boolean; skill?: { name?: string } }>
              },
              idx: number
            ) => ({
              id: idx + 1,
              title: job.title,
              company: job.company || 'Unknown Company',
              location: job.location || 'Not specified',
              salary: job.salary || 'Not disclosed',
              requiredSkills: (job.jobSkills || [])
                .filter((js) => js.required !== false && js.skill?.name)
                .map((js) => js.skill!.name!),
              preferredSkills: (job.jobSkills || [])
                .filter((js) => js.required === false && js.skill?.name)
                .map((js) => js.skill!.name!)
            })
          )
          setJobs(mappedJobs)
        }
      } catch {
        setApiError('Showing demo data. API data is currently unavailable.')
      } finally {
        setLoadingData(false)
      }
    }

    void fetchPlatformData()
  }, [])

  useEffect(() => {
    const runMatch = async () => {
      if (userSkills.length === 0) {
        setMatches([])
        return
      }
      try {
        const payload = {
          userSkillNames: userSkills.map((s) => ({ name: s.skill, confidence: s.confidence })),
        }
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data.matches)) {
          setMatches(
            data.matches.map((m: { job: { title: string }; matchScore: number; gaps: Array<{ skillName: string }> }) => ({
              title: m.job.title,
              matchScore: m.matchScore,
              gaps: (m.gaps || []).map((x) => x.skillName),
            }))
          )
        }
      } catch {
        // no-op fallback
      }
    }
    void runMatch()
  }, [userSkills, jobs])

  const extractSkillCandidates = (text: string): string[] => {
    const dict = skillsCatalog.map((s) => s.name)
    const lower = text.toLowerCase()
    return dict.filter((skill) => lower.includes(skill.toLowerCase()))
  }

  const handleResumeUploadClick = () => resumeInputRef.current?.click()

 const onResumeFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Read the text from the uploaded file
    const text = await file.text()
    
    try {
      // 1. Send the text to our Python AI Microservice
      const response = await fetch('http://127.0.0.1:8000/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('AI Engine failed to parse');
      
      const data = await response.json();
      const extracted = data.skills; // This is the array from Python

      // 2. Check if AI actually found anything
      if (!extracted || extracted.length === 0) {
        toast({ 
          title: 'No skills found', 
          description: "The AI scanned the document but didn't find matching tech keywords." 
        });
        return;
      }
      
      // 3. Update state (Using setUserSkills to match your defined state)
      setUserSkills((prev) => {
        const combined = [...prev, ...extracted];
        // Use a Map to filter duplicates by skill name
        return Array.from(new Map(combined.map(s => [s.skill.toLowerCase(), s])).values());
      });

      toast({ 
        title: 'AI Parsing Complete', 
        description: `Successfully extracted ${extracted.length} skills.` 
      });
      
    } catch (error) {
      console.error("Connection Error:", error);
      toast({ 
        title: 'Connection Error', 
        description: 'Could not reach Python server. Ensure it is running on port 8000.' 
      });
    } finally {
      if (event.target) event.target.value = '';
    }
  }; 

  const handleGithubImport = async () => {
    // We ask for the exact handle because the session name is a Display Name (e.g., "Divyan Shakya" instead of "divyanshakya966")
    const exactUsername = window.prompt("To scan your repositories, please enter your exact GitHub username :");
    
    if (!exactUsername) {
      return // User cancelled the prompt
    }

    try {
      toast({ title: 'Scanning GitHub...', description: `Looking for skills in ${exactUsername}'s repositories.` })
      
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(exactUsername)}/repos?per_page=100`)
      if (!reposRes.ok) throw new Error('GitHub request failed')
      
      const repos = (await reposRes.json()) as Array<{ language: string | null }>
      const merged: UserSkill[] = []
      const seen = new Set<string>()
      
      for (const repo of repos) {
        const lang = repo.language
        if (!lang) continue
        const mapped = LANGUAGE_TO_SKILLS[lang] ?? [lang]
        for (const skill of mapped) {
          const key = normalize(skill)
          if (seen.has(key)) continue
          seen.add(key)
          merged.push({ skill, confidence: 0.72, source: 'github' })
        }
      }
      
      if (merged.length === 0) {
        toast({ title: 'No skills imported', description: `No recognizable languages found in ${exactUsername}'s public repositories.` })
        return
      }
      
      setUserSkills((prev) => mergeSkills(prev, merged))
      toast({ title: 'Skills Imported!', description: `Successfully imported ${merged.length} skills from ${exactUsername}.` })
    } catch {
      toast({ title: 'GitHub import failed', description: 'Could not fetch repositories. Please double-check the username.', variant: "destructive" })
    }
  }

  const handleAssessment = () => {
    const existing = new Set(userSkills.map((s) => normalize(s.skill)))
    const missingTop = jobs
      .flatMap((j) => j.requiredSkills)
      .filter((s, i, arr) => arr.findIndex((x) => normalize(x) === normalize(s)) === i)
      .filter((s) => !existing.has(normalize(s)))
      .slice(0, 4)
      .map((skill) => ({ skill, confidence: 0.58, source: 'assessment' as const }))
    if (missingTop.length === 0) {
      toast({ title: 'Assessment complete', description: 'You already cover the top required skills.' })
      return
    }
    setUserSkills((prev) => mergeSkills(prev, missingTop))
    toast({ title: 'Assessment complete', description: `${missingTop.length} validated skills added.` })
  }

  const computedSkillGaps = useMemo(() => {
    const uniqueJobSkills = new Set(jobs.flatMap(job => [...job.requiredSkills, ...job.preferredSkills]))
    return Math.max(0, uniqueJobSkills.size - userSkills.length)
  }, [jobs, userSkills.length])

  const prioritizedGaps = useMemo(() => {
    const all = matches.flatMap((m) => m.gaps)
    const count = new Map<string, number>()
    for (const gap of all) count.set(gap, (count.get(gap) ?? 0) + 1)
    return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name)
  }, [matches])

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <Navigation theme={theme} toggleTheme={toggleTheme} mounted={mounted} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">NXT-GEN SKILLFORGE</h1>
          <p className="text-muted-foreground text-sm mt-1">Skill-intelligence platform for job matching & upskilling</p>
          {loadingData && (
            <p className="text-xs mt-2 text-primary">Loading platform data...</p>
          )}
          {apiError && (
            <p className="text-xs mt-2 text-red-400">{apiError}</p>
          )}
        </div>

       {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Your Skills', value: userSkills.length },
            { label: 'Job Matches', value: userSkills.length > 0 ? jobs.length : 0 },
            { label: 'Skill Gaps', value: computedSkillGaps },
            { label: 'Learning', value: userSkills.length > 0 ? 4 : 0 }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-card border border-border rounded-lg p-3 text-center transition-all hover:border-primary/50"
            >
              <div className="text-xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <SkillInputSection
          userSkills={userSkills}
          onUserSkillsChange={setUserSkills}
          allSkills={skillsCatalog}
          onResumeUpload={handleResumeUploadClick}
          onGithubImport={handleGithubImport}
          onAssessment={handleAssessment}
        />
        <input ref={resumeInputRef} type="file" accept=".txt,.md,.json" className="hidden" onChange={onResumeFileSelected} />
        <SkillGraphSection userSkills={userSkills} jobs={jobs} />
        <JobMatchingSection userSkills={userSkills} jobs={jobs} matches={matches} />
        <SkillGapSection userSkills={userSkills} matches={matches} />
        <LearningPathSection userSkills={userSkills} jobs={jobs} prioritizedSkills={prioritizedGaps} />
        
        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border mt-8">
          © 2024 NXT-GEN SKILLFORGE - Next Gen Builders
        </footer>
      </div>
    </main>
  )
}