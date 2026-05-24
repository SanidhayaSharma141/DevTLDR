import { useMemo, useState } from 'react'
import {
  Loader2,
  Github,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Link2,
  ArrowRight,
  Code2,
  Linkedin,
} from 'lucide-react'

const KEYWORDS = [
  'Kubernetes',
  'Docker',
  'React',
  'AWS',
  'CI/CD',
  'Machine Learning',
  'Django',
  'GraphQL',
  'TypeScript',
  'Node.js',
  'SQL',
  'Terraform',
  'Microservices',
  'Serverless',
  'FastAPI',
  'Redis',
  'PostgreSQL',
]

const LANGUAGE_COLOR = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#cc342d',
  HCL: '#7b42f6',
  YAML: '#ff5722',
  default: '#8b5cf6',
}

const getLanguageColor = (language) => LANGUAGE_COLOR[language] || LANGUAGE_COLOR.default

const parseLeetcodePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const totalSolved = payload.totalSolved ?? payload.totalSolvedCount ?? 0
  const easySolved = payload.easySolved ?? payload.easySolvedCount ?? 0
  const mediumSolved = payload.mediumSolved ?? payload.mediumSolvedCount ?? 0
  const hardSolved = payload.hardSolved ?? payload.hardSolvedCount ?? 0

  if (!totalSolved && !easySolved && !mediumSolved && !hardSolved) {
    return null
  }

  return {
    totalSolved: totalSolved || easySolved + mediumSolved + hardSolved,
    easySolved,
    mediumSolved,
    hardSolved,
  }
}

function App() {
  // Separate states for distinct platform profiles
  const [githubHandle, setGithubHandle] = useState('')
  const [leetcodeHandle, setLeetcodeHandle] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [aboutText, setAboutText] = useState('')
  
  const [showHighlights, setShowHighlights] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [leetcode, setLeetcode] = useState(null)

  const keywords = useMemo(() => {
    if (!aboutText.trim()) return []
    const normalized = aboutText.toLowerCase()
    return KEYWORDS.filter((keyword) => normalized.includes(keyword.toLowerCase()))
  }, [aboutText])

  const languageDistribution = useMemo(() => {
    const count = repos.reduce((acc, repo) => {
      if (!repo.language) return acc
      acc[repo.language] = (acc[repo.language] || 0) + 1
      return acc
    }, {})

    const total = Object.values(count).reduce((sum, value) => sum + value, 0)

    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([language, value]) => ({
        language,
        percentage: total ? Math.round((value / total) * 100) : 0,
        color: getLanguageColor(language),
      }))
  }, [repos])

  const totalStars = useMemo(
    () => repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    [repos]
  )

  const totalForks = useMemo(
    () => repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    [repos]
  )

  const topRepos = useMemo(
    () =>
      [...repos]
        .sort((a, b) => {
          const starsA = a.stargazers_count || 0
          const starsB = b.stargazers_count || 0
          if (starsA !== starsB) return starsB - starsA
          return new Date(b.updated_at) - new Date(a.updated_at)
        })
        .slice(0, 3),
    [repos]
  )

  const skillClassification = useMemo(() => {
    const counts = repos.reduce((acc, repo) => {
      if (!repo.language) return acc
      const language = repo.language
      acc[language] = (acc[language] || 0) + 1
      return acc
    }, {})

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
    const jsCount = (counts.JavaScript || 0) + (counts.TypeScript || 0)
    const pyCount = counts.Python || 0
    const goCount = counts.Go || 0
    const backendTotal = pyCount + goCount

    if (!total) {
      return 'Versatile Software Developer'
    }

    if (jsCount / total > 0.5) {
      return 'Frontend / Full-stack Specialist'
    }

    if (backendTotal / total > 0.45) {
      return 'Backend / Systems Architect'
    }

    return 'Versatile Software Engineer'
  }, [repos])

  const problemSolverBadge = useMemo(() => {
    if (!leetcode) return null
    if (leetcode.hardSolved > 30) return 'Deep Algorithmic Focus'
    if (leetcode.totalSolved > 300) return 'Strong Problem Solver'
    return null
  }, [leetcode])

  const activeContributor = useMemo(() => {
    const activeRepoCount = repos.filter((repo) => {
      const stars = repo.stargazers_count || 0
      const updatedAt = new Date(repo.updated_at)
      const recentlyUpdated = updatedAt > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      return stars > 2 || recentlyUpdated
    }).length

    if (activeRepoCount >= 5) return 'Active Open-Source Contributor'
    if (activeRepoCount >= 2) return 'Reliable GitHub Maintainer'
    return 'Emerging GitHub Contributor'
  }, [repos])

  const summaryBullets = useMemo(() => {
    const bullets = []
    bullets.push(`Classified as ${skillClassification} based on repository language mix.`)

    if (problemSolverBadge) {
      bullets.push(`Problem skills flagged: ${problemSolverBadge}.`)
    } else if (leetcode) {
      bullets.push('Problem solving shows solid volume with a balanced LeetCode portfolio.')
    } else {
      bullets.push('LeetCode profile not loaded; recruiter summary may be incomplete.')
    }

    bullets.push(`${activeContributor} with ${repos.length} public repositories and an active contribution pulse.`)
    return bullets
  }, [skillClassification, problemSolverBadge, leetcode, activeContributor, repos.length])

  const handleAnalyzeProfile = async (event) => {
    event.preventDefault()
    
    if (!githubHandle.trim() && !leetcodeHandle.trim()) {
      setError('Please provide at least a GitHub or LeetCode handle to analyze.')
      return
    }

    setError('')
    setLoading(true)

    // Reset current telemetry display before fetching fresh data
    setProfile(null)
    setRepos([])
    setLeetcode(null)

    // 1. GitHub Data Fetch Stream
    if (githubHandle.trim()) {
      try {
        const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(githubHandle.trim())}`)
        if (!userResponse.ok) {
          if (userResponse.status === 404) throw new Error('GitHub profile not found.')
          throw new Error('GitHub profile fetch failed.')
        }

        const repoResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(githubHandle.trim())}/repos?per_page=100`)
        if (!repoResponse.ok) throw new Error('Unable to fetch GitHub repositories.')

        const [userData, repoData] = await Promise.all([userResponse.json(), repoResponse.json()])

        setProfile({
          login: userData.login,
          name: userData.name || userData.login,
          avatar_url: userData.avatar_url,
          bio: userData.bio,
          company: userData.company,
          location: userData.location,
          blog: userData.blog,
          html_url: userData.html_url,
          followers: userData.followers,
          public_repos: userData.public_repos,
        })

        setRepos(repoData.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
        })))
      } catch (githubError) {
        setError(githubError.message)
      }
    }

    // 2. LeetCode Data Fetch Stream
    if (leetcodeHandle.trim()) {
      try {
        const leetResponse = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(leetcodeHandle.trim())}`)
        if (!leetResponse.ok) throw new Error('LeetCode metrics unavailable.')

        const leetPayload = await leetResponse.json()
        const parsed = parseLeetcodePayload(leetPayload)
        if (!parsed) throw new Error('LeetCode payload format not recognized.')
        
        setLeetcode(parsed)
      } catch (leetError) {
        setError((prev) => (prev ? `${prev} | LeetCode details unavailable.` : 'LeetCode details unavailable.'))
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        
        <header className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-950/80 via-zinc-950 to-slate-950/95 p-6 shadow-[0_0_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300 ring-1 ring-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400" /> DevScore
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
                  Recruiter-ready engineering profiles, scored instantly.
                </h1>
                <p className="mt-4 max-w-2xl text-zinc-400 sm:text-lg">
                  Automatically blend GitHub telemetry, LeetCode proficiency, and recruiter-friendly highlights into a fast, visual scorecard.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Focus</p>
                <p className="mt-3 text-2xl font-semibold text-zinc-100">Hiring managers get fast clarity</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Ready for review</p>
                <p className="mt-3 text-2xl font-semibold text-zinc-100">Profiles, scorecards, and keyword matches</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_60px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <form onSubmit={handleAnalyzeProfile} className="space-y-6">
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400" htmlFor="github-handle">
                  <Github size={16} className="text-zinc-400" /> GitHub Username
                </label>
                <input
                  id="github-handle"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="w-full rounded-[1.4rem] border border-white/10 bg-zinc-950/90 px-5 py-4 text-zinc-100 placeholder:text-zinc-600 shadow-[inset_0_0_30px_rgba(15,23,42,0.4)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400" htmlFor="leetcode-handle">
                  <Code2 size={16} className="text-zinc-400" /> LeetCode Username
                </label>
                <input
                  id="leetcode-handle"
                  value={leetcodeHandle}
                  onChange={(e) => setLeetcodeHandle(e.target.value)}
                  placeholder="Enter LeetCode username"
                  className="w-full rounded-[1.4rem] border border-white/10 bg-zinc-950/90 px-5 py-4 text-zinc-100 placeholder:text-zinc-600 shadow-[inset_0_0_30px_rgba(15,23,42,0.4)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400" htmlFor="linkedin-url">
                  <Linkedin size={16} className="text-zinc-400" /> LinkedIn Profile Link
                </label>
                <input
                  id="linkedin-url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="Enter LinkedIn profile URL"
                  className="w-full rounded-[1.4rem] border border-white/10 bg-zinc-950/90 px-5 py-4 text-zinc-100 placeholder:text-zinc-600 shadow-[inset_0_0_30px_rgba(15,23,42,0.4)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {showHighlights && (
              <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Paste Professional Summary or Profile About Text
                </p>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={4}
                  placeholder="Enter or paste resume background / profile highpoints"
                  className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-4 text-zinc-100 placeholder:text-zinc-600 shadow-[inset_0_0_24px_rgba(15,23,42,0.35)] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[3.5rem] w-full sm:w-auto items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 text-sm font-semibold text-zinc-950 shadow-[0_18px_50px_rgba(16,185,129,0.18)] transition hover:from-emerald-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-950" /> : <Terminal className="h-5 w-5" />}
                Analyze Profiles
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_60px_rgba(15,23,42,0.35)]">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_0_30px_rgba(15,23,42,0.2)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300">
                <Github className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-100">1. Enter handles</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Add a public GitHub handle and optional LeetCode username, then paste recruiter-friendly summary notes.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_0_30px_rgba(15,23,42,0.2)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-100">2. Analyze profile</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Fetch GitHub and LeetCode metrics, then surface repo health, strengths, and matched keywords.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_0_30px_rgba(15,23,42,0.2)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-100">3. Review scorecard</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Read recruiter-ready insights and compare technical readiness at a glance.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Example workflow</p>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Example: enter `gaearon` for GitHub, add a LeetCode handle if available, paste a short profile summary, and click Analyze. The dashboard then shows repo metrics, algorithmic depth, and recruiter keyword signals together.
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/5 px-6 py-4 text-sm text-rose-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-300" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {(profile || leetcode) && (
          <main className="grid gap-8">
            <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 p-[1px] shadow-[0_0_60px_rgba(15,23,42,0.35)]">
              <div className="rounded-[2rem] bg-zinc-950/95 p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Recruiter TL;DR</p>
                    <h2 className="mt-3 text-3xl font-semibold text-zinc-100">Executive summary for fast screening</h2>
                  </div>
                  {profile && (
                    <div className="inline-flex items-center gap-3 rounded-full bg-zinc-900/80 px-4 py-2 text-sm uppercase tracking-[0.24em] text-zinc-300 ring-1 ring-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      {skillClassification}
                    </div>
                  )}
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {summaryBullets.map((bullet, index) => (
                    <div key={index} className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_0_30px_rgba(15,23,42,0.2)]">
                      <p className="text-sm text-zinc-400">Insight {index + 1}</p>
                      <p className="mt-3 text-base leading-7 text-zinc-100">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_0.8fr]">
              <article className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_0_50px_rgba(15,23,42,0.28)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">GitHub Deep Telemetry</p>
                    <h3 className="mt-2 text-2xl font-semibold text-zinc-100">Public repository health</h3>
                  </div>
                  <div className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-500/15">
                    {repos.length} repositories
                  </div>
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_0.6fr]">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Total stars</p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-100">{totalStars}</p>
                      </div>
                      <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Total forks</p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-100">{totalForks}</p>
                      </div>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/60 p-5">
                      <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Top languages</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {languageDistribution.length ? (
                          languageDistribution.map((item) => (
                            <div key={item.language} className="flex min-w-[130px] flex-col gap-2 rounded-3xl bg-zinc-950/90 px-4 py-3">
                              <span className="text-sm font-semibold text-zinc-100">{item.language}</span>
                              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                              </div>
                              <span className="text-xs text-zinc-400">{item.percentage}% of repos</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-zinc-500">No languages indexed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-900/60 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Top repositories</p>
                    <div className="mt-5 space-y-4">
                      {topRepos.length ? (
                        topRepos.map((repo) => (
                          <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-3xl border border-white/5 bg-zinc-950/85 p-4 transition hover:border-cyan-500/40 hover:bg-zinc-900/95"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <p className="text-lg font-semibold text-zinc-100">{repo.name}</p>
                                <p className="text-sm text-zinc-400 line-clamp-2">{repo.description || 'No description provided.'}</p>
                              </div>
                              <ArrowRight className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                              <span className="rounded-full bg-zinc-900/75 px-2.5 py-1">{repo.language || 'Unknown'}</span>
                              <span className="rounded-full bg-zinc-900/75 px-2.5 py-1">★ {repo.stargazers_count}</span>
                            </div>
                          </a>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">No public repositories discovered.</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_0_50px_rgba(15,23,42,0.28)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">LeetCode Assessment</p>
                    <h3 className="mt-2 text-2xl font-semibold text-zinc-100">Problem solving distribution</h3>
                  </div>
                  <div className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-300 ring-1 ring-cyan-500/15">
                    {leetcode ? `${leetcode.totalSolved} solved` : 'Not loaded'}
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  {leetcode ? (
                    <>
                      <div className="space-y-5">
                        {[
                          { label: 'Easy', value: leetcode.easySolved, color: 'bg-emerald-500' },
                          { label: 'Medium', value: leetcode.mediumSolved, color: 'bg-sky-500' },
                          { label: 'Hard', value: leetcode.hardSolved, color: 'bg-violet-500' },
                        ].map((item) => {
                          const ratio = leetcode.totalSolved ? Math.round((item.value / leetcode.totalSolved) * 100) : 0
                          return (
                            <div key={item.label} className="space-y-2">
                              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-zinc-400">
                                <span>{item.label}</span>
                                <span>{item.value} solved</span>
                              </div>
                              <div className="h-4 overflow-hidden rounded-full bg-zinc-900/80">
                                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${ratio}%` }} />
                              </div>
                              <p className="text-xs text-zinc-500">{ratio}% of aggregate solutions</p>
                            </div>
                          )
                        })}
                      </div>
                      <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-4 text-sm text-zinc-400 leading-relaxed">
                        Medium and Hard problem capacities indicate strategic technical grit. High target focus in these indexes maps to robust system engineering roles.
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-black/30 p-6 text-center text-sm text-zinc-500">
                      Provide a valid handle to stream live algorithmic metrics.
                    </div>
                  )}
                </div>
              </article>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_0_50px_rgba(15,23,42,0.28)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Professional Keywords Matcher</p>
                  <h3 className="mt-2 text-2xl font-semibold text-zinc-100">Highlighted core competencies</h3>
                </div>
                <div className="rounded-full bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-500/15">
                  {keywords.length} matched
                </div>
              </div>
              <div className="mt-6 min-h-[100px] rounded-[1.75rem] border border-white/10 bg-black/40 p-5 flex items-center">
                {keywords.length ? (
                  <div className="flex flex-wrap gap-3">
                    {keywords.map((keyword) => (
                      <span key={keyword} className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/15">
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-zinc-500">
                    Industry-specific tags will update here automatically when custom profile summary content matches tracking signatures.
                  </p>
                )}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App