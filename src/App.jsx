import { useMemo, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import mammoth from 'mammoth/mammoth.browser'
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileText,
  Github,
  Globe2,
  Linkedin,
  Loader2,
  Paperclip,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const SKILL_BANK = [
  { label: 'React', aliases: ['react', 'react.js', 'reactjs'] },
  { label: 'Angular', aliases: ['angular', 'angular.js'] },
  { label: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs'] },
  { label: 'JavaScript', aliases: ['javascript'] },
  { label: 'TypeScript', aliases: ['typescript'] },
  { label: 'Node.js', aliases: ['node.js', 'nodejs', 'node'] },
  { label: 'Express.js', aliases: ['express.js', 'expressjs', 'express'] },
  { label: 'Python', aliases: ['python'] },
  { label: 'Java', aliases: ['java'] },
  { label: 'C++', aliases: ['c++'] },
  { label: 'C', aliases: [' c ', ' c,', ' c\n', ' c\r'] },
  { label: 'Go', aliases: ['go', 'golang'] },
  { label: 'PHP', aliases: ['php'] },
  { label: 'Dart', aliases: ['dart'] },
  { label: 'Kotlin', aliases: ['kotlin'] },
  { label: 'SQL', aliases: ['sql'] },
  { label: 'MySQL', aliases: ['mysql'] },
  { label: 'PostgreSQL', aliases: ['postgresql', 'postgres'] },
  { label: 'MongoDB', aliases: ['mongodb', 'mongo'] },
  { label: 'NoSQL', aliases: ['nosql'] },
  { label: 'Firebase', aliases: ['firebase', 'firestore'] },
  { label: 'AWS', aliases: ['aws'] },
  { label: 'GCP', aliases: ['gcp', 'google cloud'] },
  { label: 'Azure', aliases: ['azure'] },
  { label: 'Docker', aliases: ['docker'] },
  { label: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { label: 'Terraform', aliases: ['terraform'] },
  { label: 'Jenkins', aliases: ['jenkins'] },
  { label: 'GitHub Actions', aliases: ['github actions'] },
  { label: 'ArgoCD', aliases: ['argocd'] },
  { label: 'Argo Workflows', aliases: ['argo workflows'] },
  { label: 'Grafana', aliases: ['grafana'] },
  { label: 'Linux', aliases: ['linux'] },
  { label: 'GraphQL', aliases: ['graphql'] },
  { label: 'REST APIs', aliases: ['rest api', 'rest apis', 'rest'] },
  { label: 'JWT', aliases: ['jwt'] },
  { label: 'Socket.io', aliases: ['socket.io', 'socketio'] },
  { label: 'Microservices', aliases: ['microservice', 'microservices'] },
  { label: 'Spring Boot', aliases: ['spring boot'] },
  { label: 'Django', aliases: ['django'] },
  { label: 'Sanic', aliases: ['sanic'] },
  { label: 'FastAPI', aliases: ['fastapi', 'fast api'] },
  { label: 'Redis', aliases: ['redis'] },
  { label: 'Flutter', aliases: ['flutter'] },
  { label: 'HTML', aliases: ['html'] },
  { label: 'CSS', aliases: ['css'] },
  { label: 'Bootstrap', aliases: ['bootstrap'] },
  { label: 'ETL Pipelines', aliases: ['etl pipeline', 'etl pipelines', 'etl'] },
  { label: 'Data Structures & Algorithms', aliases: ['data structures', 'algorithms', 'dsa'] },
  { label: 'OOP', aliases: ['oop', 'oops', 'object oriented'] },
  { label: 'DBMS', aliases: ['dbms'] },
  { label: 'Operating Systems', aliases: ['operating systems'] },
  { label: 'Computer Networks', aliases: ['computer networks'] },
  { label: 'Distributed Systems', aliases: ['distributed systems'] },
  { label: 'Machine Learning', aliases: ['machine learning', 'ml'] },
  { label: 'TensorFlow', aliases: ['tensorflow'] },
  { label: 'OpenCV', aliases: ['opencv'] },
  { label: 'NumPy', aliases: ['numpy'] },
  { label: 'Pandas', aliases: ['pandas'] },
  { label: 'Scikit-learn', aliases: ['scikit-learn', 'sklearn'] },
  { label: 'Vertex AI', aliases: ['vertex ai'] },
  { label: 'RAG', aliases: ['rag', 'retrieval augmented generation'] },
  { label: 'NLP', aliases: ['nlp', 'natural language processing'] },
  { label: 'TF-IDF', aliases: ['tf-idf', 'tfidf'] },
  { label: 'System Design', aliases: ['system design'] },
]

const ROLE_CATEGORIES = {
  technical: [
    'software',
    'engineer',
    'developer',
    'backend',
    'frontend',
    'full stack',
    'full-stack',
    'api',
    'microservices',
    'cloud',
    'devops',
    'data',
    'machine learning',
    'etl',
    'database',
    'kubernetes',
    'docker',
    'python',
    'java',
    'javascript',
    'react',
  ],
  hospitality: [
    'hospitality',
    'venue',
    'guest',
    'front-of-house',
    'front desk',
    'customer complaints',
    'event setup',
    'catering',
    'cleaning',
    'facility',
    'facilities',
    'maintenance',
    'inventory',
    'vendor',
    'physical stamina',
    'floor',
    'public-facing',
    'check-in',
    'retail',
    'hotel',
  ],
  operations: [
    'operations',
    'coordinator',
    'logistics',
    'supplier',
    'vendor management',
    'inventory',
    'schedule',
    'coordination',
  ],
}

const SAMPLE_RESUME = `Aarav Mehta
Full Stack Engineer
Email: aarav@example.com
LinkedIn: https://linkedin.com/in/aarav-mehta
GitHub: https://github.com/gaearon
LeetCode: https://leetcode.com/problemset

Experience
Built React, Node.js, PostgreSQL and AWS products for B2B SaaS teams. Led dashboard performance work, designed REST APIs, owned Docker based deployments and mentored junior developers.

Projects
Candidate analytics platform with React, TypeScript, FastAPI, PostgreSQL and Redis. Real time collaboration tool with WebSocket architecture.

Education
B.Tech Computer Science`

const SAMPLE_JOB = `Senior Full Stack Engineer
We need a product-minded engineer with React, TypeScript, Node.js, PostgreSQL, AWS, REST APIs, CI/CD, testing practices, and strong ownership. Bonus for system design, Redis, Docker and mentoring experience.`

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_THINKING_BUDGET = Number(import.meta.env.VITE_GEMINI_THINKING_BUDGET ?? 0)

const extractUrls = (text) => {
  const links = text.match(/https?:\/\/[^\s),\]}>"']+/gi) || []
  return {
    linkedin: links.find((url) => url.toLowerCase().includes('linkedin.com')) || '',
    github: links.find((url) => url.toLowerCase().includes('github.com')) || '',
    leetcode: links.find((url) => url.toLowerCase().includes('leetcode.com')) || '',
  }
}

const extractGithubHandle = (urlOrHandle) => {
  const value = urlOrHandle.trim()
  const match = value.match(/github\.com\/([^/?#\s]+)/i)
  return match?.[1] || value.replace('@', '')
}

const extractLeetcodeHandle = (urlOrHandle) => {
  const value = urlOrHandle.trim()
  const match = value.match(/leetcode\.com\/(?:u\/)?([^/?#\s]+)/i)
  return match?.[1] || value.replace('@', '')
}

const getSkills = (text) => {
  const normalized = ` ${text.toLowerCase().replace(/[^\w+#.-]+/g, ' ')} `
  return SKILL_BANK.filter((skill) =>
    skill.aliases.some((alias) => normalized.includes(` ${alias.toLowerCase()} `))
  ).map((skill) => skill.label)
}

const countCategorySignals = (text, category) => {
  const normalized = text.toLowerCase()
  return ROLE_CATEGORIES[category].filter((signal) => normalized.includes(signal)).length
}

const getRoleCategory = (text) => {
  const scores = Object.keys(ROLE_CATEGORIES).map((category) => ({
    category,
    score: countCategorySignals(text, category),
  }))
  const best = scores.sort((a, b) => b.score - a.score)[0]
  return best.score ? best.category : 'general'
}

const getCandidateName = (text) => {
  const cleanedLines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^(https?:|tel:|mailto:)/i.test(line))

  const explicitNameLine = cleanedLines.find((line) => {
    if (line.length > 80) return false
    if (/[|@]/.test(line)) return false
    if (/\b(education|experience|skills|projects|engineer|developer|intern)\b/i.test(line)) return false
    return /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(line)
  })

  if (explicitNameLine) return explicitNameLine

  const openingText = cleanedLines.join(' ').slice(0, 180)
  const beforeContact = openingText
    .split(/\b(?:hyderabad|bengaluru|bangalore|delhi|mumbai|pune|india|email|linkedin|github|leetcode|education)\b/i)[0]
    .replace(/[^\w\s.'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const nameMatch = beforeContact.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/)
  if (nameMatch) return nameMatch[1]

  return 'Candidate'
}

const unique = (values) => [...new Set(values.filter(Boolean))]

const clamp = (value) => Math.min(100, Math.max(0, value))

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsText(file)
  })

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })

const parsePdf = async (file) => {
  const buffer = await readFileAsArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const pageTexts = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, index) => {
      const page = await pdf.getPage(index + 1)
      const content = await page.getTextContent()
      const annotations = await page.getAnnotations()
      const links = annotations
        .map((annotation) => annotation.url || annotation.unsafeUrl)
        .filter(Boolean)
      return `${content.items.map((item) => item.str).join(' ')}\n${links.join('\n')}`
    })
  )
  return pageTexts.join('\n\n')
}

const parseDocx = async (file) => {
  const buffer = await readFileAsArrayBuffer(file)
  const [rawResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ arrayBuffer: buffer.slice(0) }),
    mammoth.convertToHtml({ arrayBuffer: buffer.slice(0) }),
  ])
  const hyperlinkTargets = unique(
    Array.from(htmlResult.value.matchAll(/href="([^"]+)"/gi)).map((match) => match[1])
  )
  return `${rawResult.value}\n\n${hyperlinkTargets.join('\n')}`
}

const parseResumeFile = async (file) => {
  const name = file.name.toLowerCase()
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    return parsePdf(file)
  }
  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    return parseDocx(file)
  }
  if (name.endsWith('.doc')) {
    throw new Error('Legacy .doc files are not supported in the browser. Please upload .docx, .pdf, or paste the text.')
  }
  return readFileAsText(file)
}

// Helper: Extract years of experience from resume (looks for date ranges in Professional Experience only)
const extractYearsOfExperience = (resumeText) => {
  // Extract ONLY the Professional Experience section, exclude Education section
  const experienceMatch = resumeText.match(/(?:professional\s+experience|experience)([\s\S]*?)(?:(?:technical\s+skills|skills|education|projects|$))/i)
  const experienceSection = experienceMatch ? experienceMatch[1] : ''
  
  if (!experienceSection) return 0
  
  // Find all date patterns in the experience section only
  const datePattern = /(\w+\s+\d{4})\s*–\s*(\w+\s+\d{4}|present)/gi
  const matches = experienceSection.match(datePattern) || []
  
  if (matches.length === 0) return 0
  
  const monthMap = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
  let totalMonths = 0
  
  matches.forEach((range) => {
    const [startStr, endStr] = range.split('–').map((s) => s.trim())
    const startMatch = startStr.match(/(\w+)\s+(\d{4})/)
    const endMatch = endStr.match(/(\w+)\s+(\d{4})/)
    
    if (startMatch && endMatch) {
      const startMonth = monthMap[startMatch[1].toLowerCase().slice(0, 3)] || 1
      const startYear = parseInt(startMatch[2], 10)
      const endMonth = endStr.toLowerCase().includes('present') ? new Date().getMonth() + 1 : monthMap[endMatch[1].toLowerCase().slice(0, 3)] || 1
      const endYear = endStr.toLowerCase().includes('present') ? new Date().getFullYear() : parseInt(endMatch[2], 10)
      
      const months = (endYear - startYear) * 12 + (endMonth - startMonth)
      totalMonths += Math.max(0, months)
    }
  })
  
  return Math.round(totalMonths / 12 * 10) / 10 // Round to 1 decimal
}

// Helper: Detect if a skill has proof/evidence in the resume (not just listed in skills section)
const hasSkillProof = (skillLabel, resumeText) => {
  const skill = skillLabel.toLowerCase()
  
  // Action verbs that indicate actual use of a skill
  const actionVerbs = ['built', 'developed', 'used', 'worked', 'implemented', 'designed', 'architected', 'led', 'owned', 'shipped', 'deployed', 'managed', 'optimized', 'engineered', 'spearheaded']
  
  // Extract ONLY the Professional Experience and Projects sections (not Skills or Education)
  const experienceSection = resumeText.match(/(?:professional\s+experience|experience|projects)([\s\S]*?)(?=(?:technical\s+skills|skills|education|$))/i)?.[1] || ''
  
  if (!experienceSection) return false
  
  const normalized = ` ${experienceSection.toLowerCase().replace(/[^\w+#.-]+/g, ' ')} `
  const skillNormalized = ` ${skill} `
  
  // Strict check: skill must appear within the same "bullet point" (marked by dashes) as an action verb
  const bullets = experienceSection.split(/[-•]\s+/).map((b) => ` ${b.toLowerCase().replace(/[^\w+#.-]+/g, ' ')} `)
  
  return bullets.some((bullet) =>
    bullet.includes(skillNormalized) &&
    actionVerbs.some((verb) => bullet.includes(` ${verb} `))
  )
}

const calculateAssessment = ({ resumeText, github, repos, leetcode, jobText }) => {
  const candidateSkills = getSkills(resumeText)
  const jobSkills = getSkills(jobText)
  const matchedJobSkills = jobSkills.filter((skill) => candidateSkills.includes(skill))
  const provenJobSkills = matchedJobSkills.filter((skill) => hasSkillProof(skill, resumeText))
  const resumeCategory = getRoleCategory(resumeText)
  const jobCategory = jobText.trim() ? getRoleCategory(jobText) : 'general'
  const hasJob = Boolean(jobText.trim())
  
  // Extract candidate's actual years of experience
  const candidateYearsExp = extractYearsOfExperience(resumeText)
  
  // Extract required years of experience from job description (e.g., "10+ years", "5 years")
  const jobYearsMatch = jobText.match(/(\d+)\+?\s*years/i)
  const requiredYears = jobYearsMatch ? parseInt(jobYearsMatch[1], 10) : 0
  const experienceMismatch = requiredYears > 0 && candidateYearsExp < requiredYears
  
  const categoryCompatible =
    !hasJob ||
    jobCategory === 'general' ||
    resumeCategory === jobCategory ||
    (resumeCategory === 'technical' && jobCategory === 'operations' && countCategorySignals(jobText, 'technical') > 2)

  // Experience keywords for evaluating leadership and ownership
  const experienceKeywords = [
    'led', 'owned', 'architected', 'designed', 'built', 'developed', 'shipped',
    'managed', 'scaled', 'optimized', 'mentored', 'delivered', 'implemented',
  ]
  const resumeLower = resumeText.toLowerCase()

  // ============================================================================
  // STRUCTURED 3-TIER SCORING FORMULA (Total: 100 points)
  // ============================================================================
  // Tier 1: Foundation & Candidate Quality (25 points max)
  // Tier 2: Job Alignment & Fit (50 points max) ← HIGH PRIORITY TIER
  // Tier 3: External Evidence & Depth (25 points max)
  // ============================================================================

  // TIER 1: FOUNDATION (Resume quality + Skill breadth) — 25 points max
  const resumePresence = resumeText.trim().length > 50 ? 15 : resumeText.trim().length > 0 ? 8 : 0
  const skillBreadth = Math.min(candidateSkills.length * 2, 10) // 1 point per 2 skills, capped at 10
  const tier1Score = resumePresence + skillBreadth

  // TIER 2: JOB MATCH (Role fit + Skill alignment + Experience signals) — 50 points max
  let tier2Score = 0

  if (hasJob && categoryCompatible) {
    // Role category alignment: 10 points
    const categoryBonus = resumeCategory === jobCategory ? 10 : resumeCategory === 'technical' ? 8 : 5

    // Skill match as primary driver with PROOF weighting
    // Base score from matched skills, bonus for skills with proof (evidence of actual use)
    const totalJobSkills = Math.max(jobSkills.length, 1)
    const baseSkillMatchPercent = matchedJobSkills.length / totalJobSkills
    const provenSkillPercent = provenJobSkills.length / totalJobSkills
    
    // Skill score: 15 points for raw match + 10 points for proven skills
    const baseSkillScore = Math.round(baseSkillMatchPercent * 15)
    const provenSkillBonus = Math.round(provenSkillPercent * 10)
    const skillMatchScore = baseSkillScore + provenSkillBonus // 0–25 points
    
    const extraSkillBonus = Math.min(candidateSkills.length - jobSkills.length, 5) * 0.8 // 1 extra skill ≈ 0.8 points

    // Experience signal alignment: 10 points
    // Count relevant keywords (e.g., "led", "owned", "architected" for technical roles)
    // BUT: Scale down if candidate doesn't meet required experience level
    const experienceCount = experienceKeywords.filter((kw) => resumeLower.includes(kw)).length
    let experienceSignalScore = Math.min(experienceCount * 1.2, 10)
    
    // Heavy penalty if job requires years of experience candidate doesn't have
    if (experienceMismatch) {
      const experienceGap = requiredYears - candidateYearsExp
      const experiencePenalty = Math.min(experienceGap * 3, 15) // Up to 15 point penalty
      experienceSignalScore = Math.max(0, experienceSignalScore - experiencePenalty)
    }

    tier2Score = categoryBonus + skillMatchScore + Math.min(extraSkillBonus, 5) + experienceSignalScore
  } else if (hasJob && !categoryCompatible) {
    // Hard fail: role mismatch is a blocker
    tier2Score = 0
  } else {
    // No job description provided: base score on skill strength alone
    tier2Score = Math.min(candidateSkills.length * 4, 35)
  }

  // Apply experience level penalty to overall tier2Score if mismatch is severe
  if (hasJob && experienceMismatch && requiredYears > 5) {
    tier2Score = Math.max(0, tier2Score - 20) // Additional 20 point penalty for senior role with junior candidate
  }

  tier2Score = Math.min(tier2Score, 50) // Cap at 50

  // TIER 3: EXTERNAL EVIDENCE (GitHub + LeetCode) — 25 points max
  const githubScore = github ? Math.min(12, 6 + Math.floor((github.public_repos || repos.length) / 4)) : 0
  
  // LeetCode scoring: Include easy problems for breadth + hard problems for depth
  let leetcodeScore = 0
  if (leetcode) {
    const totalSolved = leetcode.totalSolved || 0
    const easySolved = leetcode.easySolved || 0
    const hardSolved = leetcode.hardSolved || 0
    
    // Base score from total solved: 0–6 points
    const totalScore = Math.min(6, Math.floor(totalSolved / 30))
    
    // Bonus for easy problems (breadth/foundation): 0–4 points
    const easyBonus = Math.min(4, Math.floor(easySolved / 15))
    
    // Bonus for hard problems (depth): 0–3 points
    const hardBonus = Math.min(3, Math.floor(hardSolved / 10))
    
    leetcodeScore = Math.min(13, totalScore + easyBonus + hardBonus)
  }
  
  const tier3Score = githubScore + leetcodeScore

  // FINAL SCORE: Sum all tiers, clamped to 0–100
  const score = clamp(tier1Score + tier2Score + tier3Score)

  // RECOMMENDATION THRESHOLDS
  const recommendation =
    hasJob && !categoryCompatible
      ? 'Not a role fit'
      : score >= 80
        ? 'Strong proceed'
        : score >= 60
          ? 'Proceed with focused screen'
          : 'Hold for manual review'

  return {
    score,
    recommendation,
    candidateSkills,
    jobSkills,
    matchedJobSkills,
    provenJobSkills, // Skills with evidence of actual use
    resumeCategory,
    jobCategory,
    categoryCompatible,
    candidateYearsExp, // Extracted years of experience
    requiredYears, // Required years from job
    experienceMismatch, // Whether candidate meets experience requirement
    tier1Score, // Foundation
    tier2Score, // Job alignment
    tier3Score, // External evidence
    risks: [
      hasJob && !categoryCompatible && `Role mismatch: resume appears ${resumeCategory}, while the job appears ${jobCategory}.`,
      experienceMismatch && `Experience gap: job requires ${requiredYears}+ years, but candidate has ~${candidateYearsExp} years.`,
      hasJob && matchedJobSkills.length === 0 && 'No skill overlap with the supplied job requirements.',
      hasJob && matchedJobSkills.length < Math.ceil(jobSkills.length * 0.5) && `Skill match is weak: only ${matchedJobSkills.length}/${jobSkills.length} required skills found.`,
      hasJob && provenJobSkills.length < matchedJobSkills.length && `Only ${provenJobSkills.length}/${matchedJobSkills.length} matched skills have evidence of actual use in experience/projects.`,
      !github && 'GitHub evidence is missing or unavailable.',
      !leetcode && 'LeetCode signal is not verified.',
      candidateSkills.length < 5 && 'Resume has limited explicit skill density.',
    ].filter(Boolean),
    strengths: [
      candidateSkills.length >= 6 && 'Broad technical skill coverage detected.',
      hasJob && categoryCompatible && provenJobSkills.length >= Math.ceil(jobSkills.length * 0.6) && `Strong proven skill alignment: ${provenJobSkills.length} required skills demonstrated with evidence.`,
      github && `${github.public_repos || repos.length} public repositories demonstrate hands-on portfolio work.`,
      leetcode && `${leetcode.totalSolved} solved problems (including ${leetcode.easySolved || 0} easy) support problem-solving capability and foundation knowledge.`,
      !experienceMismatch && candidateYearsExp > 0 && `Candidate has ${candidateYearsExp} years of relevant experience matching job requirements.`,
      experienceKeywords.some((kw) => resumeLower.includes(kw)) && 'Resume shows leadership and ownership in delivery.',
    ].filter(Boolean),
  }
}

const inferRole = (resumeText, skills) => {
  const lower = resumeText.toLowerCase()
  if (lower.includes('data scientist') || lower.includes('machine learning')) return 'machine learning / data candidate'
  if (lower.includes('frontend') || skills.some((skill) => ['React', 'Next.js', 'TypeScript'].includes(skill))) return 'frontend or full-stack candidate'
  if (lower.includes('backend') || skills.some((skill) => ['Node.js', 'FastAPI', 'Django', 'PostgreSQL'].includes(skill))) return 'backend or full-stack candidate'
  return 'software engineering candidate'
}

const buildCandidateNarrative = ({ candidateName, assessment, github, leetcode, resumeText }) => {
  if (!assessment) {
    return 'Run analysis to get recruiter-facing guidance on whether to proceed, what evidence to trust, what risks to probe, and which interview questions to ask first.'
  }

  const role = inferRole(resumeText, assessment.candidateSkills)
  const topSkills = assessment.candidateSkills.slice(0, 6)
  const skills = topSkills.join(', ') || 'general software delivery'
  const missingJobSkills = assessment.jobSkills.filter((skill) => !assessment.matchedJobSkills.includes(skill))
  const jobFit = assessment.jobSkills.length
    ? `Role fit is ${assessment.matchedJobSkills.length}/${assessment.jobSkills.length} tracked requirements, so the screen should focus on the missing requirements rather than re-checking the obvious matches.`
    : 'No job description was added, so this is a general candidate-quality read rather than a role-specific recommendation.'
  const profileEvidence = [
    github && `${github.public_repos || 0} public GitHub repositories`,
    leetcode && `${leetcode.totalSolved} LeetCode problems`,
  ].filter(Boolean)

  const proceedAdvice =
    assessment.recommendation === 'Not a role fit'
      ? 'Do not move this candidate forward for this specific role. The candidate may be strong, but the supplied job is materially different from the resume evidence.'
      : assessment.score >= 78
        ? 'You should consider moving this candidate forward to the next technical screening step.'
        : assessment.score >= 58
          ? 'You can consider this candidate, but only with a focused recruiter screen before committing technical interview time.'
          : 'You should not prioritize this candidate yet unless the role has flexibility or there is missing context outside the resume.'
  const roleMismatchNote = assessment.categoryCompatible
    ? ''
    : ` The main issue is role mismatch: the resume reads as ${assessment.resumeCategory}, while the job reads as ${assessment.jobCategory}.`

  return `Recommendation: ${assessment.recommendation.toLowerCase()} for ${candidateName}, with a confidence score of ${assessment.score}/100. ${proceedAdvice}${roleMismatchNote} The analyzed profile shows strongest visible evidence around ${skills}, placing the candidate closest to a ${role}. A strong general engineering profile should not be treated as a strong match when the supplied role is non-technical or operational.

The strongest candidate signals are the breadth of backend/full-stack skills, production-oriented experience, and external coding evidence${profileEvidence.length ? ` (${profileEvidence.join(' and ')})` : ''}. ${jobFit} ${assessment.categoryCompatible ? (missingJobSkills.length ? `The main concern is the weaker evidence around ${missingJobSkills.slice(0, 8).join(', ')}, so those areas should decide whether the candidate is a true fit.` : 'There are no major tracked skill gaps against the supplied job description, so the decision should depend more on depth, ownership, and communication quality.') : 'For this job, those strengths do not translate into core fit because the role requires hospitality, physical venue operations, customer-facing coordination, facilities handling, and manual vendor/logistics work rather than software engineering.'}

Suggested decision: ${assessment.categoryCompatible ? 'proceed if the role needs a hands-on engineer who can work across services, APIs, infrastructure, and product-facing delivery' : 'reject or redirect this candidate for this specific hospitality/venue role, and consider them only for software engineering roles'}. During any follow-up, validate the role alignment first. If the hiring need is truly on-site hospitality operations, this resume does not show the right evidence. If the hiring need changes to a technical product or platform role, then the candidate becomes worth screening.`
}

const buildGeminiPrompt = ({ candidateName, assessment, github, repos, leetcode, resumeText, jobText }) => `
You are an expert technical recruiter. Write a concise but useful candidate assessment.

Rules:
- Do not repeat the resume.
- Do not invent facts.
- Address the recruiter directly as "you".
- Make the output practical hiring advice for the recruiter using this app.
- Include proceed/no-proceed reasoning and what to verify before moving forward.
- Mention key strengths, risks, role fit, and interview probes.
- Write around 400 words.
- Use 3 short paragraphs followed by 4 recruiter action bullets.
- Do not mention API keys, environment variables, prompts, or implementation details.
- Do not write a generic candidate biography.

Candidate name: ${candidateName}
Score: ${assessment.score}/100
Recommendation: ${assessment.recommendation}
Detected skills: ${assessment.candidateSkills.join(', ') || 'None'}
Matched job skills: ${assessment.matchedJobSkills.join(', ') || 'None'}
Missing tracked job skills: ${assessment.jobSkills.filter((skill) => !assessment.matchedJobSkills.includes(skill)).join(', ') || 'None'}
GitHub: ${github ? `${github.public_repos || 0} public repos, ${github.followers || 0} followers` : 'Not verified'}
Recent repository names: ${repos.slice(0, 8).map((repo) => repo.name).join(', ') || 'None'}
LeetCode: ${leetcode ? `${leetcode.totalSolved} total solved, ${leetcode.mediumSolved} medium, ${leetcode.hardSolved} hard` : 'Not verified'}

Resume excerpt:
${resumeText.slice(0, 4500)}

Job description excerpt:
${jobText ? jobText.slice(0, 2500) : 'No job description provided.'}
`

const fetchGeminiNarrative = async ({ candidateName, assessment, github, repos, leetcode, resumeText, jobText }) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'replace_with_your_gemini_api_key') {
    console.info('[Gemini] Skipped: VITE_GEMINI_API_KEY is not configured.')
    return null
  }

  console.info('[Gemini] Request started.')
  console.info('[Gemini] Model:', GEMINI_MODEL)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildGeminiPrompt({
                  candidateName,
                  assessment,
                  github,
                  repos,
                  leetcode,
                  resumeText,
                  jobText,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1600,
          thinkingConfig: {
            thinkingBudget: GEMINI_THINKING_BUDGET,
          },
        },
      }),
    }
  )

  console.info('[Gemini] Response status:', response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.warn('[Gemini] Request failed:', errorText.slice(0, 500))
    throw new Error('Gemini request failed')
  }

  const payload = await response.json()
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim() || null
  console.info('[Gemini] Text generated:', Boolean(text), text ? `${text.length} characters` : 'no text')
  return text
}

const getBriefHighlights = (assessment) => {
  if (!assessment) return ['No completed analysis yet', 'Score locked until Analyze', 'Job match optional']

  return [
    assessment.recommendation,
    `${assessment.candidateSkills.length} skills detected`,
    assessment.jobSkills.length ? `${assessment.matchedJobSkills.length}/${assessment.jobSkills.length} job fit` : 'No job JD added',
  ]
}

const renderInlineMarkdown = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })

function CandidateBrief({ text }) {
  const blocks = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="max-w-3xl space-y-4 text-sm leading-7 text-stone-700">
      {blocks.map((block, index) => {
        const bullet = block.match(/^[-*]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={index} className="flex gap-3 rounded-lg bg-stone-50 px-4 py-3">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-700" />
              <p>{renderInlineMarkdown(bullet[1])}</p>
            </div>
          )
        }

        return <p key={index}>{renderInlineMarkdown(block)}</p>
      })}
    </div>
  )
}

function App() {
  const [resumeText, setResumeText] = useState(() => localStorage.getItem('candidate_resume') || '')
  const [fileName, setFileName] = useState('')
  const [githubHandle, setGithubHandle] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [leetcodeHandle, setLeetcodeHandle] = useState('')
  const [jobText, setJobText] = useState('')
  const [jobFileName, setJobFileName] = useState('')
  const [github, setGithub] = useState(null)
  const [repos, setRepos] = useState([])
  const [leetcode, setLeetcode] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const detectedLinks = useMemo(() => extractUrls(resumeText), [resumeText])
  const liveCandidateSkills = useMemo(() => getSkills(resumeText), [resumeText])
  const assessment = analysis?.assessment || null
  const candidateSkills = assessment?.candidateSkills || []
  const jobSkills = assessment?.jobSkills || []
  const matchedJobSkills = assessment?.matchedJobSkills || []

  const hydrateFromResume = (text) => {
    const links = extractUrls(text)
    if (links.github) setGithubHandle(extractGithubHandle(links.github))
    if (links.linkedin) setLinkedinUrl(links.linkedin)
    if (links.leetcode) setLeetcodeHandle(extractLeetcodeHandle(links.leetcode))
  }

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setStatus('Parsing resume and saving candidate content...')
    setFileName(file.name)

    try {
      const text = await parseResumeFile(file)
      if (!text.trim()) {
        throw new Error('No readable text was found in this resume.')
      }
      setResumeText(text)
      localStorage.setItem('candidate_resume', text)
      hydrateFromResume(text)
      setAnalysis(null)
      setStatus('Resume parsed and stored. Click Analyze candidate to refresh the score.')
    } catch (parseError) {
      setError(parseError.message || 'Could not read this file. Please upload a text-based PDF, DOCX, TXT, or paste the resume content.')
      setStatus('')
    }
  }

  const handleJobFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setStatus('Parsing job description file...')
    setJobFileName(file.name)

    try {
      const text = await parseResumeFile(file)
      if (!text.trim()) {
        throw new Error('No readable text was found in this job file.')
      }
      setJobText(text)
      setAnalysis(null)
      setStatus('Job description parsed. Click Analyze candidate to refresh fit scoring.')
    } catch (parseError) {
      setError(parseError.message || 'Could not read this job file. Upload PDF, DOCX, TXT, or paste the job description.')
      setStatus('')
    }
  }

  const fetchLeetcode = async (handle) => {
    const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(handle)}`)
    if (!response.ok) throw new Error('LeetCode fetch failed')
    const data = await response.json()
    const totalSolved = data.totalSolved ?? data.totalSolvedCount ?? 0
    return {
      totalSolved,
      easySolved: data.easySolved ?? data.easySolvedCount ?? 0,
      mediumSolved: data.mediumSolved ?? data.mediumSolvedCount ?? 0,
      hardSolved: data.hardSolved ?? data.hardSolvedCount ?? 0,
    }
  }

  const analyzeCandidate = async () => {
    setLoading(true)
    setError('')
    setStatus('Enriching candidate profile...')
    setGithub(null)
    setRepos([])
    setLeetcode(null)
    setAnalysis(null)

    const gh = githubHandle || (detectedLinks.github && extractGithubHandle(detectedLinks.github))
    const lc = leetcodeHandle || (detectedLinks.leetcode && extractLeetcodeHandle(detectedLinks.leetcode))
    let nextGithub = null
    let nextRepos = []
    let nextLeetcode = null

    try {
      if (gh) {
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(gh)}`),
          fetch(`https://api.github.com/users/${encodeURIComponent(gh)}/repos?per_page=100&sort=updated`),
        ])
        if (userResponse.ok && reposResponse.ok) {
          const [userData, repoData] = await Promise.all([userResponse.json(), reposResponse.json()])
          nextGithub = userData
          nextRepos = repoData
        }
      }

      if (lc) {
        nextLeetcode = await fetchLeetcode(lc)
      }

      setGithub(nextGithub)
      setRepos(nextRepos)
      setLeetcode(nextLeetcode)
      const nextAssessment = calculateAssessment({
        resumeText,
        github: nextGithub,
        repos: nextRepos,
        leetcode: nextLeetcode,
        jobText,
      })
      const candidateName = getCandidateName(resumeText)
      const fallbackNarrative = buildCandidateNarrative({
        candidateName,
        assessment: nextAssessment,
        github: nextGithub,
        leetcode: nextLeetcode,
        resumeText,
      })
      let geminiNarrative = null
      try {
        console.info('[Analyze] Calling Gemini for recruiter brief.')
        geminiNarrative = await fetchGeminiNarrative({
          candidateName,
          assessment: nextAssessment,
          github: nextGithub,
          repos: nextRepos,
          leetcode: nextLeetcode,
          resumeText,
          jobText,
        })
      } catch {
        console.warn('[Analyze] Gemini failed. Falling back to local recruiter brief.')
        setError('Gemini summary failed, so the app used the local recruiter brief instead.')
      }
      setAnalysis({
        assessment: nextAssessment,
        candidateName,
        github: nextGithub,
        leetcode: nextLeetcode,
        resumeText,
        narrative: geminiNarrative || fallbackNarrative,
        narrativeSource: geminiNarrative ? 'Gemini' : 'Local',
      })
      setStatus('Assessment generated from resume, public profile signals, and job context.')
    } catch {
      const nextAssessment = calculateAssessment({
        resumeText,
        github: nextGithub,
        repos: nextRepos,
        leetcode: nextLeetcode,
        jobText,
      })
      const candidateName = getCandidateName(resumeText)
      setAnalysis({
        assessment: nextAssessment,
        candidateName,
        github: nextGithub,
        leetcode: nextLeetcode,
        resumeText,
        narrative: buildCandidateNarrative({
          candidateName,
          assessment: nextAssessment,
          github: nextGithub,
          leetcode: nextLeetcode,
          resumeText,
        }),
        narrativeSource: 'Local',
      })
      setError('Some live enrichment failed. The assessment still uses the resume, job text, and available links.')
      setStatus('Partial assessment generated.')
    } finally {
      setLoading(false)
    }
  }

  const useSample = () => {
    setResumeText(SAMPLE_RESUME)
    setJobText(SAMPLE_JOB)
    localStorage.setItem('candidate_resume', SAMPLE_RESUME)
    hydrateFromResume(SAMPLE_RESUME)
    setAnalysis(null)
    setStatus('Sample candidate loaded. Click Analyze candidate to generate the score.')
  }

  const canAnalyze = resumeText.trim().length > 20
  const candidateName = analysis?.candidateName || getCandidateName(resumeText)
  const aiNarrative = buildCandidateNarrative({
    candidateName,
    assessment,
    github: analysis?.github,
    leetcode: analysis?.leetcode,
    resumeText: analysis?.resumeText || resumeText,
  })
  const displayedNarrative = analysis?.narrative || aiNarrative
  const briefHighlights = getBriefHighlights(assessment)

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-stone-950">
      <div className="border-b border-stone-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold">DevTLDR</p>
              <p className="text-xs text-stone-500">Resume intelligence for recruiters</p>
            </div>
          </div>
          <button onClick={useSample} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-emerald-500">
            Load sample
          </button>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <section className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Candidate intake</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight">Upload. Enrich. Decide.</h1>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Parse a resume, detect portfolio links, enrich public coding signals, and produce a recruiter-ready decision brief.
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-700" />
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 px-5 py-8 text-center transition hover:bg-emerald-50">
              <UploadCloud className="h-9 w-9 text-emerald-700" />
              <span className="mt-3 text-sm font-bold">Upload resume</span>
              <span className="mt-1 text-xs text-stone-500">Supports text-based PDF, DOCX, TXT, MD, and CSV files</span>
              <input type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx" onChange={handleFile} className="hidden" />
            </label>

            {fileName && <p className="mt-3 text-xs font-medium text-stone-500">Loaded: {fileName}</p>}

            <textarea
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value)
                localStorage.setItem('candidate_resume', event.target.value)
                hydrateFromResume(event.target.value)
                setAnalysis(null)
              }}
              rows={10}
              placeholder="Or paste resume content here..."
              className="mt-5 w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-emerald-700" />
              <h2 className="text-lg font-bold">Detected and editable sources</h2>
            </div>
            <div className="space-y-3">
              <SourceInput icon={Github} label="GitHub" value={githubHandle} setValue={setGithubHandle} placeholder="username or profile URL" />
              <SourceInput icon={Linkedin} label="LinkedIn" value={linkedinUrl || detectedLinks.linkedin} setValue={setLinkedinUrl} placeholder="profile URL" />
              <SourceInput icon={Code2} label="LeetCode" value={leetcodeHandle} setValue={setLeetcodeHandle} placeholder="username or profile URL" />
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-emerald-700" />
              <h2 className="text-lg font-bold">Optional job match</h2>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-4 transition hover:border-emerald-400 hover:bg-emerald-50">
              <div className="flex items-center gap-3">
                <Paperclip className="h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold">Upload job description</p>
                  <p className="text-xs text-stone-500">PDF, DOCX, TXT, MD, or CSV</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">Choose file</span>
              <input type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx" onChange={handleJobFile} className="hidden" />
            </label>
            {jobFileName && <p className="mt-3 text-xs font-medium text-stone-500">Loaded JD: {jobFileName}</p>}
            <textarea
              value={jobText}
              onChange={(event) => {
                setJobText(event.target.value)
                setAnalysis(null)
              }}
              rows={5}
              placeholder="Or paste the job description here..."
              className="mt-3 max-h-52 w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <button
            onClick={analyzeCandidate}
            disabled={!canAnalyze || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-emerald-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Analyze candidate
          </button>

          {(status || error) && (
            <div className={`rounded-lg border p-4 text-sm ${error ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
              <div className="flex items-center gap-2">
                {error ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <span>{error || status}</span>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Recruiter brief</p>
                <h2 className="mt-2 truncate text-3xl font-bold">{candidateName}</h2>
                <p className="mt-2 text-sm text-stone-500">
                  {assessment ? 'Generated from the last completed analysis.' : 'Upload a resume, add sources, then click Analyze candidate.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {briefHighlights.map((highlight) => (
                    <span key={highlight} className="rounded-md bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`grid h-24 w-24 place-items-center rounded-lg text-white ${assessment ? 'bg-stone-950' : 'bg-stone-300'}`}>
                <div className="text-center">
                  <p className="text-3xl font-black">{assessment?.score ?? '--'}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-300">score</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric icon={ClipboardCheck} label="Decision" value={assessment?.recommendation || 'Run analysis'} />
              <Metric icon={FileText} label="Skills found" value={assessment ? candidateSkills.length || 'None' : `${liveCandidateSkills.length} detected`} />
              <Metric icon={BarChart3} label="Job match" value={assessment ? (jobSkills.length ? `${matchedJobSkills.length}/${jobSkills.length}` : 'Optional') : 'Run analysis'} />
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-700" />
              <h3 className="text-xl font-bold">{'Candidate brief'}</h3>
            </div>
            <CandidateBrief text={displayedNarrative} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <InsightCard title="Strengths" tone="green" items={assessment?.strengths.length ? assessment.strengths : ['Run analysis to generate strengths.']} />
            <InsightCard title="Risks to probe" tone="amber" items={assessment?.risks.length ? assessment.risks : ['Run analysis to generate screening risks.']} />
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Skill evidence</h3>
                <p className="mt-1 text-sm text-stone-500">Extracted from resume and matched against the job brief.</p>
              </div>
              <BadgeCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div className="flex flex-wrap gap-2">
              {((assessment ? candidateSkills : liveCandidateSkills).length ? (assessment ? candidateSkills : liveCandidateSkills) : ['No skills detected yet']).map((skill) => (
                <span key={skill} className={`rounded-md px-3 py-2 text-sm font-semibold ${matchedJobSkills.includes(skill) ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-700'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ProfilePanel
              title="GitHub signal"
              icon={Github}
              rows={[
                ['Profile', github?.login || githubHandle || 'Not provided'],
                ['Public repos', github?.public_repos ?? repos.length ?? 'Pending'],
                ['Followers', github?.followers ?? 'Pending'],
                ['Recent repos loaded', repos.length],
              ]}
            />
            <ProfilePanel
              title="Coding signal"
              icon={Code2}
              rows={[
                ['LeetCode', leetcodeHandle || 'Not provided'],
                ['Total solved', leetcode?.totalSolved ?? 'Pending'],
                ['Medium solved', leetcode?.mediumSolved ?? 'Pending'],
                ['Hard solved', leetcode?.hardSolved ?? 'Pending'],
              ]}
            />
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Recruiter next steps</h3>
            <div className="mt-4 space-y-3">
              {[
                'Verify employment dates, ownership claims, and project depth during screening.',
                'Ask for one architecture walkthrough tied to the strongest resume project.',
                assessment && jobSkills.length ? 'Use unmatched job skills as targeted interview probes.' : 'Add or parse a job description, then run analysis to generate role-specific fit notes.',
              ].map((step) => (
                <div key={step} className="flex gap-3 rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-emerald-700" />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function SourceInput({ icon: Icon, label, value, setValue, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <Icon className="h-5 w-5 text-emerald-700" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}

function InsightCard({ title, items, tone }) {
  const isGreen = tone === 'green'
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className={`rounded-lg p-4 text-sm ${isGreen ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePanel({ title, icon: Icon, rows }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-emerald-700" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="mt-5 divide-y divide-stone-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-stone-500">{label}</span>
            <span className="max-w-[14rem] truncate font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
