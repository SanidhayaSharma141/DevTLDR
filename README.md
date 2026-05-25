# HireSignal AI

HireSignal AI is a recruiter-focused resume intelligence dashboard. It helps a recruiter upload a candidate resume, extract useful profile signals, compare the candidate against an optional job description, and generate a clear hiring recommendation.

The goal is simple: make it easier to decide whether a candidate should move forward, needs manual review, or is not a fit for the supplied role.

## Screenshots

Add your screenshots inside an `assets/` or `docs/` folder and update these paths.

![Candidate intake screen](./assets/candidate-intake.png)
![Recruiter brief screen](./assets/recruiter-brief.png)
![Job match analysis](./assets/job-match.png)

## Features

- Upload resumes in PDF, DOCX, TXT, MD, or CSV format.
- Extract visible resume text and embedded PDF/DOCX hyperlinks.
- Detect LinkedIn, GitHub, and LeetCode profile links from the resume.
- Fetch public GitHub profile and repository signals.
- Fetch LeetCode problem-solving metrics when a public handle is available.
- Upload or paste a job description for role-fit analysis.
- Score the candidate only after the recruiter clicks `Analyze candidate`.
- Detect major role mismatches, such as a software resume for a hospitality operations role.
- Generate a recruiter-facing candidate brief with recommendation, risks, strengths, and next steps.
- Optionally use Gemini for richer AI-written recruiter guidance.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React
- PDF.js via `pdfjs-dist`
- Mammoth for DOCX parsing
- Optional Gemini API integration

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DevTLDR
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Copy the example env file:

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Gemini is optional. Without this key, the app still works using the local recruiter brief generator.

### 4. Run locally

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## Deploying to Vercel

### Option A: Deploy from GitHub

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com).
3. Click `Add New Project`.
4. Import your GitHub repository.
5. Vercel should auto-detect Vite.
6. Use these settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Add the environment variable in Vercel:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: your Gemini API key
8. Click `Deploy`.

### Option B: Deploy with Vercel CLI

Install the Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel
```

For production:

```bash
vercel --prod
```

## Keeping API Keys Safe

Do not commit real API keys to GitHub.

This project includes:

- `.env.example`, which is safe to commit.
- `.env.local`, which should contain your real key and is ignored by Git.
- `.gitignore` rules that prevent env files from being committed.

Important: because this is a frontend-only Vite app, any `VITE_` environment variable is included in the browser app at build time. That keeps it off GitHub, but it does not fully hide it from users of the deployed site.

For a production-grade app, move the Gemini request to a backend or serverless function and store the API key only on the server.

## How It Works

1. The recruiter uploads or pastes a resume.
2. The app parses resume text and hidden links.
3. GitHub and LeetCode signals are fetched when handles are available.
4. The recruiter optionally uploads or pastes a job description.
5. The app compares candidate evidence against job requirements.
6. The recruiter clicks `Analyze candidate`.
7. The dashboard shows a score, recommendation, risks, strengths, and recruiter guidance.

## Current Limitations

- Legacy `.doc` files are not supported. Use `.docx`, PDF, TXT, or paste the content.
- Some LeetCode/GitHub calls may fail due to public API availability, rate limits, or browser/network restrictions.
- The Gemini key is safer on a backend than directly in a frontend app.
- PDF extraction works best with text-based PDFs. Scanned image resumes need OCR, which is not included yet.

## Future Improvements

- Add backend/serverless Gemini proxy for safer API key handling.
- Add OCR support for scanned resumes.
- Add downloadable recruiter reports.
- Add structured candidate history.
- Add better job taxonomy and domain-specific scoring.
- Add authentication for team usage.
