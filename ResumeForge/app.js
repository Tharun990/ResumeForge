/**
 * ResumeForge — Core Application Script
 * Upload handling · Mock AI Analysis Engine · Dashboard Rendering
 * Toast Notifications · Theme Toggle · PDF Export
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   0. CONSTANTS & MOCK DATA POOLS
═══════════════════════════════════════════════════════════════ */

const STRENGTHS_POOL = [
  {
    title: 'Strong quantified achievements',
    desc:  'You use numbers and metrics to demonstrate impact (e.g., "increased sales by 30%"), which makes your experience concrete and credible.'
  },
  {
    title: 'Clear career progression',
    desc:  'Your work history shows steady advancement in responsibility and seniority, signaling ambition and reliability to hiring managers.'
  },
  {
    title: 'Relevant technical skills section',
    desc:  'Your skills section is well-organized and includes technologies that are currently in high demand by employers in your target field.'
  },
  {
    title: 'Professional summary is compelling',
    desc:  'Your opening summary clearly communicates your value proposition and gives recruiters an immediate sense of your expertise.'
  },
  {
    title: 'Education section is well-presented',
    desc:  'Your academic credentials are clearly listed with institution, degree, year and relevant honors — easy to parse by both humans and ATS.'
  },
  {
    title: 'Good use of action verbs',
    desc:  'You lead bullet points with strong verbs like "developed", "architected", and "optimized" which convey initiative and ownership.'
  },
  {
    title: 'Consistent formatting throughout',
    desc:  'The visual structure of your resume is uniform — consistent fonts, spacing, and bullet styles make it easy for recruiters to skim.'
  },
  {
    title: 'Relevant certifications included',
    desc:  'Including industry certifications demonstrates commitment to professional development and validates your claimed skills.'
  },
  {
    title: 'Contact information is complete',
    desc:  'You have included email, phone, LinkedIn, and location — all the touch-points a recruiter needs to move forward quickly.'
  },
  {
    title: 'Project experience demonstrates depth',
    desc:  'Your projects section shows hands-on application of skills beyond just listing them, which adds authenticity to your profile.'
  },
];

const WEAKNESSES_POOL = [
  {
    title: 'Summary lacks specificity',
    desc:  'Your professional summary uses generic phrases ("passionate", "team player") without industry-specific context or unique differentiators.'
  },
  {
    title: 'Bullet points too vague',
    desc:  'Several bullet points describe duties rather than achievements. Recruiters want to know outcomes, not just tasks performed.'
  },
  {
    title: 'Missing measurable impact metrics',
    desc:  'Many experience entries lack quantified results. Adding numbers (%, $, volume) dramatically increases credibility and memorability.'
  },
  {
    title: 'Skills section is unstructured',
    desc:  'Your skills are listed as a flat comma-separated block. Grouping them by category (e.g., Languages, Frameworks, Tools) improves scanability.'
  },
  {
    title: 'Resume length is not optimized',
    desc:  'At this career stage, a one-page resume is generally preferred. Consider trimming older or less relevant experience.'
  },
  {
    title: 'Employment gaps not addressed',
    desc:  'There are unexplained time gaps between positions. Consider adding freelance, volunteer, or continuing education activities for that period.'
  },
  {
    title: 'No GitHub or portfolio link',
    desc:  'For technical roles, recruiters and hiring managers expect to see a portfolio or code repository. Add a GitHub profile or personal site URL.'
  },
  {
    title: 'Weak objective/summary placement',
    desc:  'Your summary is buried or missing. Move it to the top as the first thing recruiters see — it sets the tone for everything that follows.'
  },
  {
    title: 'Overuse of passive language',
    desc:  'Phrases like "was responsible for" and "helped with" are passive and weak. Rewrite with active ownership language.'
  },
  {
    title: 'Irrelevant experience included',
    desc:  'Some listed experience is too unrelated to your target role and may cause recruiters to question your focus. Trim or reframe it.'
  },
];

const SKILLS_POOL = [
  'Docker', 'Kubernetes', 'CI/CD Pipelines', 'TypeScript', 'GraphQL',
  'Redis', 'PostgreSQL', 'AWS Lambda', 'Terraform', 'REST APIs',
  'System Design', 'Microservices', 'Unit Testing', 'Agile/Scrum',
  'Data Structures', 'Cloud Architecture', 'React Hooks', 'Node.js',
  'Python', 'Machine Learning', 'SQL Optimization', 'Monitoring/Observability',
  'Security Best Practices', 'Performance Optimization', 'Technical Writing',
];

const PRESENT_KEYWORDS_POOL = [
  'JavaScript', 'React', 'Python', 'Git', 'HTML/CSS', 'SQL',
  'API Integration', 'Problem Solving', 'Team Collaboration',
  'Project Management', 'Communication', 'Agile', 'Testing',
  'Database', 'Linux', 'JSON', 'OOP', 'Version Control',
  'Documentation', 'Debugging',
];

const MISSING_KEYWORDS_POOL = [
  'Kubernetes', 'Docker', 'CI/CD', 'Cloud Native', 'Infrastructure as Code',
  'DevSecOps', 'Observability', 'SLO/SLA', 'Data Pipeline', 'Feature Flags',
  'A/B Testing', 'System Design', 'Distributed Systems', 'Event-Driven',
  'Serverless', 'Multi-threading', 'Scalability', 'Load Balancing',
  'Service Mesh', 'Zero-downtime Deployment',
];

const GRAMMAR_ISSUES_POOL = [
  {
    severity: 'high',
    title: 'Inconsistent verb tense in experience section',
    suggestion: 'Use past tense for all previous roles and present tense only for your current position.',
    fix: 'Change "develop" → "developed"',
  },
  {
    severity: 'high',
    title: 'Missing Oxford comma in skills list',
    suggestion: 'Consistent punctuation in lists ensures professional presentation.',
    fix: 'Add comma before final "and"',
  },
  {
    severity: 'medium',
    title: 'Bullet points don\'t start with action verbs',
    suggestion: 'Begin each bullet with a strong past-tense action verb to convey ownership and impact.',
    fix: 'Start with: "Led", "Built", "Designed"',
  },
  {
    severity: 'medium',
    title: 'Overly long bullet points (3+ lines)',
    suggestion: 'Keep bullets to 1-2 lines for easy skimming. Split longer bullets into two separate points.',
    fix: 'Split into two concise bullets',
  },
  {
    severity: 'medium',
    title: 'Passive voice detected in multiple entries',
    suggestion: '"Was responsible for managing" → "Managed". Active voice is clearer, more direct, and more impactful.',
    fix: 'Rewrite in active voice',
  },
  {
    severity: 'low',
    title: 'Inconsistent date formatting',
    suggestion: 'Use a consistent date format throughout (e.g., "Jan 2022 – Mar 2024" or "01/2022 – 03/2024").',
    fix: 'Standardize to "Mon YYYY" format',
  },
  {
    severity: 'low',
    title: 'Personal pronouns found (I, me, my)',
    suggestion: 'Resumes are written in implied first-person. Remove all "I", "me", and "my" references.',
    fix: 'Remove "I" → omit or restructure',
  },
  {
    severity: 'medium',
    title: 'Overused buzzwords detected',
    suggestion: 'Words like "synergy", "leverage", and "thought leader" are clichéd. Replace with specific, concrete language.',
    fix: 'Replace with specific accomplishments',
  },
  {
    severity: 'low',
    title: 'Inconsistent capitalization of job titles',
    suggestion: 'Either capitalize all job titles ("Software Engineer") or none — be consistent throughout the document.',
    fix: 'Capitalize all job titles consistently',
  },
  {
    severity: 'high',
    title: 'Spelling error detected in skills section',
    suggestion: 'A misspelled skill name will cause ATS mismatches and reflects poorly on attention to detail.',
    fix: 'Check and correct all skill spellings',
  },
  {
    severity: 'medium',
    title: 'Numbers under ten not written out',
    suggestion: 'Standard writing convention: spell out numbers one through nine (e.g., "led a team of five engineers").',
    fix: 'Spell out: "3" → "three"',
  },
  {
    severity: 'low',
    title: 'Missing period consistency in bullets',
    suggestion: 'Either end all bullet points with periods or none — inconsistency signals lack of attention to detail.',
    fix: 'Remove trailing periods from all bullets',
  },
];

const RECRUITER_PERSONAS = [
  {
    name: 'Jessica M.',
    role: 'Senior Technical Recruiter · 8 yrs exp.',
    avatar: 'J',
    quote: (score) => score >= 75
      ? `Strong technical foundation — your resume communicates relevant experience effectively. The ATS score is solid, and I can see you have real-world project experience. Where I'd want to see improvement is in the quantification of your achievements. Statements like "improved system performance" need the number behind them to be compelling. I'd move this forward to the first interview round, but the hiring manager will likely probe for specifics. Sharpen those bullet points.`
      : `This resume needs work before it reaches my desk for a senior role. The skills are there, but the way they're presented isn't competitive. The ATS score is lower than the threshold most of our clients use, which means it's getting filtered out automatically at many companies. The biggest issue is the lack of measurable impact. Every bullet point should answer: "so what?" Additionally, the summary doesn't differentiate you at all — I could apply it to a hundred other candidates. Start there.`,
    ratings: { tone: 7.2, clarity: 6.8, impact: 5.9 },
  },
  {
    name: 'Marcus T.',
    role: 'Engineering Hiring Lead · FAANG Alumni',
    avatar: 'M',
    quote: (score) => score >= 75
      ? `From a hiring manager's perspective, this is a resume I'd take seriously. The technical skills align well with what we look for, and the project experience shows hands-on competence beyond just listing buzzwords. One pattern I see often: candidates undersell their contributions. If you built something, don't say "contributed to" — say what YOU built specifically. Also, I want to see more evidence of cross-functional collaboration. Modern engineering roles require strong communication, not just coding chops. Show that too.`
      : `I've reviewed thousands of engineering resumes, and this one has several patterns that would cause me to pass in under 10 seconds. The skills section is fine, but there's almost no evidence of impact. What did your work actually accomplish? Beyond that, the structure makes it hard to quickly extract your years of experience or your most impressive accomplishment. Recruiters scan resumes in 6-7 seconds on average. Restructure so the most impressive content is visible immediately.`,
    ratings: { tone: 8.1, clarity: 7.5, impact: 7.0 },
  },
  {
    name: 'Priya K.',
    role: 'Talent Acquisition Manager · Series B Startup',
    avatar: 'P',
    quote: (score) => score >= 75
      ? `I really appreciate a clean, well-organized resume — yours hits that mark. The experience is relevant and the skill set maps well to today's engineering landscape. For a startup environment specifically, I'd love to see more evidence of scrappiness and initiative: times you built something from scratch, moved fast under constraints, or wore multiple hats. Startup hiring managers value autonomy. Use your summary and bullet points to tell that story. The bones of this resume are good — a few targeted revisions would make it excellent.`
      : `Honestly, for the startup space, this resume doesn't quite convey the energy and breadth we look for. The experience sections feel passive and task-focused. In a startup, every hire needs to punch above their weight, and the resume needs to reflect that. What problems did you solve? What did you build independently? The ATS score also concerns me — with applicant volumes as high as they are, many roles won't even see this resume unless the score improves. Focus on tailoring keywords to each specific job description.`,
    ratings: { tone: 7.8, clarity: 8.0, impact: 6.5 },
  },
];

const IMPROVEMENT_TIPS_POOL = [
  {
    title: 'Quantify every achievement',
    desc:  'Add specific numbers to all experience bullets. "Reduced load time by 40%", "managed 12-person team", or "processed 50K daily transactions" are far more compelling than vague descriptions.',
    priority: 'high',
  },
  {
    title: 'Tailor keywords to each job description',
    desc:  'Before applying, scan the job posting and mirror its language in your resume. ATS systems score exact keyword matches heavily.',
    priority: 'high',
  },
  {
    title: 'Rewrite your professional summary',
    desc:  'Your summary is prime real estate. Lead with your title, years of experience, and your single most impressive achievement in 2-3 sentences. Make it role-specific.',
    priority: 'high',
  },
  {
    title: 'Add a GitHub or portfolio link',
    desc:  'For technical roles, a GitHub profile with active projects dramatically increases hiring chances. Ensure it shows your best, most relevant work.',
    priority: 'medium',
  },
  {
    title: 'Use strong action verbs throughout',
    desc:  'Lead every bullet with a powerful, specific verb: Architected, Spearheaded, Launched, Automated, Reduced, Optimized. Avoid weak openers like "Helped with" or "Worked on".',
    priority: 'high',
  },
  {
    title: 'Organize skills into logical categories',
    desc:  'Group your skills by type: Languages, Frameworks, Cloud/DevOps, Databases, Tools. This dramatically improves scanability for both ATS and human readers.',
    priority: 'medium',
  },
  {
    title: 'Keep bullet points to 1-2 lines',
    desc:  'Long bullets get skipped. Trim each bullet to its essential impact statement. If needed, split into two concise bullets rather than one long one.',
    priority: 'medium',
  },
  {
    title: 'Add relevant certifications',
    desc:  'AWS, GCP, Azure, PMP, CKAD, and similar certifications signal validated expertise. Even in-progress certs can be listed as "In Progress – Expected [Month]".',
    priority: 'medium',
  },
  {
    title: 'Use a single-column layout for ATS',
    desc:  'Multi-column and table-based layouts confuse many ATS parsers. A clean single-column format ensures your content is read in the right order.',
    priority: 'high',
  },
  {
    title: 'Include impact in your project descriptions',
    desc:  'For each project, answer: What was the problem? What did you build? What was the result? Even personal projects benefit from this framing.',
    priority: 'medium',
  },
  {
    title: 'Trim irrelevant work experience',
    desc:  'For roles older than 10 years or completely unrelated to your target position, condense to one brief line or remove entirely to keep focus.',
    priority: 'low',
  },
  {
    title: 'Verify consistent formatting details',
    desc:  'Check that date formats, capitalization, bullet styles, and spacing are identical throughout. Inconsistencies signal low attention to detail.',
    priority: 'low',
  },
];


/* ═══════════════════════════════════════════════════════════════
   1. UTILITIES
═══════════════════════════════════════════════════════════════ */

/** Simple string hash → deterministic integer */
function simpleHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/** Seeded pseudo-random number generator (mulberry32) */
function createRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s ^= s + Math.imul(s ^ (s >>> 7), 61 | s);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick `n` unique random items from an array using the rng */
function pickUnique(arr, n, rng) {
  const pool = [...arr];
  const out  = [];
  const count = Math.min(n, pool.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

/** Clamp a value between min and max */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Format file size */
function formatFileSize(bytes) {
  if (bytes < 1024)       return bytes + ' B';
  if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

/** Format relative time */
function relativeTime() {
  const now = new Date();
  return `Analyzed at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

/** Escape HTML */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ═══════════════════════════════════════════════════════════════
   2. MOCK AI ANALYSIS ENGINE
═══════════════════════════════════════════════════════════════ */

function getGrade(score) {
  if (score >= 90) return { grade: 'A+', label: 'Outstanding',  desc: 'Your resume is highly optimized. Expect strong recruiter interest.', badgeClass: 'badge-success' };
  if (score >= 80) return { grade: 'A',  label: 'Excellent',    desc: 'Great ATS compatibility with clear, compelling content.', badgeClass: 'badge-success' };
  if (score >= 70) return { grade: 'B+', label: 'Good',         desc: 'Solid resume with a few targeted improvements needed.', badgeClass: 'badge-info' };
  if (score >= 60) return { grade: 'B',  label: 'Above Average',desc: 'Decent foundation — optimizing keywords will unlock more opportunities.', badgeClass: 'badge-info' };
  if (score >= 50) return { grade: 'C+', label: 'Fair',         desc: 'Needs improvement. Several gaps are reducing your ATS compatibility.', badgeClass: 'badge-warning' };
  if (score >= 40) return { grade: 'C',  label: 'Needs Work',   desc: 'Significant improvements are needed to pass automated screening.', badgeClass: 'badge-warning' };
  return               { grade: 'D',  label: 'Poor',         desc: 'Major restructuring recommended to be competitive in today\'s market.', badgeClass: 'badge-danger' };
}

function getAtsVerdict(score) {
  if (score >= 80) return 'Your resume passes most ATS filters. Recruiters will see your application.';
  if (score >= 65) return 'Passes mid-level ATS. Adding missing keywords will push you into the top tier.';
  if (score >= 50) return 'Borderline ATS score. Many automated systems will filter this out. Prioritize keyword optimization.';
  return 'High risk of ATS rejection. Critical changes needed before applying to competitive roles.';
}

function generateAnalysis(filename, jobRole) {
  const seed = simpleHash(filename + (jobRole || ''));
  const rng  = createRng(seed);

  // ATS Score: weight towards mid-range for realism (45–90)
  const baseScore  = 45 + Math.floor(rng() * 46);
  const atsScore   = clamp(baseScore, 45, 94);
  const gradeInfo  = getGrade(atsScore);

  // Section scores — correlated loosely with ATS
  const variance = () => clamp(atsScore + Math.round((rng() - 0.5) * 30), 20, 98);

  const sectionScores = [
    { label: 'Work Experience',  value: variance() },
    { label: 'Skills & Keywords',value: variance() },
    { label: 'Education',        value: variance() },
    { label: 'Summary / Objective', value: variance() },
    { label: 'Formatting & ATS', value: variance() },
  ];

  // Recruiter persona
  const persona = RECRUITER_PERSONAS[Math.floor(rng() * RECRUITER_PERSONAS.length)];
  const recruiterRatings = {
    tone:    parseFloat((5 + rng() * 5).toFixed(1)),
    clarity: parseFloat((4 + rng() * 6).toFixed(1)),
    impact:  parseFloat((3 + rng() * 7).toFixed(1)),
  };

  // Grammar: between 3 and 7 issues, higher-severity ones more likely for low scores
  const issueCount = atsScore >= 75 ? 3 + Math.floor(rng() * 3) : 4 + Math.floor(rng() * 4);
  const grammarIssues = pickUnique(GRAMMAR_ISSUES_POOL, issueCount, rng);

  // Tip count: 5–7
  const tipCount = 5 + Math.floor(rng() * 3);

  return {
    filename,
    jobRole:    jobRole || 'General',
    atsScore,
    gradeInfo,
    atsVerdict: getAtsVerdict(atsScore),
    sectionScores,
    strengths:        pickUnique(STRENGTHS_POOL,      4, rng),
    weaknesses:       pickUnique(WEAKNESSES_POOL,     3 + Math.floor(rng() * 2), rng),
    missingSkills:    pickUnique(SKILLS_POOL,          5 + Math.floor(rng() * 4), rng),
    presentKeywords:  pickUnique(PRESENT_KEYWORDS_POOL, 8 + Math.floor(rng() * 5), rng),
    missingKeywords:  pickUnique(MISSING_KEYWORDS_POOL, 6 + Math.floor(rng() * 5), rng),
    grammarIssues,
    recruiter: {
      name:    persona.name,
      role:    persona.role,
      avatar:  persona.avatar,
      quote:   persona.quote(atsScore),
      ratings: recruiterRatings,
    },
    tips: pickUnique(IMPROVEMENT_TIPS_POOL, tipCount, rng),
  };
}


/* ═══════════════════════════════════════════════════════════════
   3. TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════════════ */

const toastContainer = document.getElementById('toast-container');

const TOAST_ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

const TOAST_TITLES = {
  success: 'Success',
  error:   'Error',
  warning: 'Warning',
  info:    'Info',
};

function showToast(message, type = 'info', title = null, duration = 4000) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true">${TOAST_ICONS[type] || 'ℹ'}</div>
    <div class="toast-body">
      <div class="toast-title">${escHtml(title || TOAST_TITLES[type])}</div>
      <div class="toast-message">${escHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss notification">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => dismissToast(toast));

  toastContainer.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => dismissToast(toast), duration);

  return toast;
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains('removing')) return;
  toast.classList.add('removing');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
  setTimeout(() => toast.remove(), 500);
}


/* ═══════════════════════════════════════════════════════════════
   4. THEME TOGGLE
═══════════════════════════════════════════════════════════════ */

(function initTheme() {
  const saved = localStorage.getItem('rf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rf-theme', next);

    // Re-draw donut if exists
    if (window._donutChart) window._donutChart.updateTheme();
  });
}


/* ═══════════════════════════════════════════════════════════════
   5. UPLOAD SCREEN
═══════════════════════════════════════════════════════════════ */

let selectedFile = null;

function setupUpload() {
  const dropZone  = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const analyzeBtn= document.getElementById('analyze-btn');
  const fileNameEl= document.getElementById('file-name-display');
  const fileSizeEl= document.getElementById('file-size-display');

  if (!dropZone || !fileInput || !analyzeBtn) return;

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const ALLOWED_EXTS  = ['.pdf', '.doc', '.docx', '.txt'];
  const MAX_SIZE      = 10 * 1024 * 1024; // 10 MB

  function validateFile(file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      showToast('Please upload a PDF, DOC, DOCX, or TXT file.', 'error', 'Invalid File Type');
      return false;
    }
    if (file.size > MAX_SIZE) {
      showToast(`File is too large (${formatFileSize(file.size)}). Max size is 10 MB.`, 'error', 'File Too Large');
      return false;
    }
    return true;
  }

  function setFile(file) {
    if (!validateFile(file)) return;
    selectedFile = file;

    // Update UI
    dropZone.classList.add('file-selected');
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = formatFileSize(file.size);
    analyzeBtn.disabled = false;

    showToast(`"${file.name}" is ready to analyze.`, 'success', 'File Loaded');
  }

  // Click on drop zone
  dropZone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });

  // Keyboard activation
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  });

  // Drag events
  dropZone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove('drag-over');
    }
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
  });

  // Analyze button
  analyzeBtn.addEventListener('click', () => {
    if (!selectedFile) {
      showToast('Please upload a resume file first.', 'warning', 'No File Selected');
      return;
    }
    const jobRole = document.getElementById('job-role')?.value || '';
    startAnalysis(selectedFile.name, jobRole);
  });
}


/* ═══════════════════════════════════════════════════════════════
   6. PROCESSING SCREEN
═══════════════════════════════════════════════════════════════ */

const PROCESSING_STEPS = [
  { id: 'step-0', duration: 700,  progress: 12 },
  { id: 'step-1', duration: 1000, progress: 28 },
  { id: 'step-2', duration: 900,  progress: 50 },
  { id: 'step-3', duration: 800,  progress: 68 },
  { id: 'step-4', duration: 700,  progress: 84 },
  { id: 'step-5', duration: 600,  progress: 100 },
];

function showScreen(id) {
  ['upload-screen', 'processing-screen', 'results-screen'].forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    if (sid === id) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startAnalysis(filename, jobRole) {
  showScreen('processing-screen');

  const progressFill  = document.getElementById('processing-progress-fill');
  const progressLabel = document.getElementById('processing-progress-label');
  const statusText    = document.getElementById('processing-status');

  let stepIndex = 0;
  let elapsed   = 0;

  function runStep(i) {
    if (i >= PROCESSING_STEPS.length) {
      // Done — generate & show results
      setTimeout(() => {
        const analysis = generateAnalysis(filename, jobRole);
        showResults(analysis);
      }, 300);
      return;
    }

    const step    = PROCESSING_STEPS[i];
    const stepEl  = document.getElementById(step.id);

    // Mark previous as done
    if (i > 0) {
      const prevEl = document.getElementById(PROCESSING_STEPS[i - 1].id);
      if (prevEl) {
        prevEl.classList.remove('active');
        prevEl.classList.add('done');
        const iconEl = prevEl.querySelector('.proc-step-icon');
        if (iconEl) iconEl.textContent = '✓';
      }
    }

    // Mark current as active
    if (stepEl) stepEl.classList.add('active');

    // Update progress bar
    if (progressFill) progressFill.style.width = step.progress + '%';
    if (progressLabel) progressLabel.textContent = step.progress + '% complete';

    // Update status text
    const texts = [
      'Scanning document structure…',
      'Running ATS compatibility check…',
      'Analyzing skills & keyword density…',
      'Reviewing grammar & formatting…',
      'Generating recruiter perspective…',
      'Finalizing recommendations…',
    ];
    if (statusText) statusText.textContent = texts[i] || 'Processing…';

    elapsed += step.duration;
    setTimeout(() => runStep(i + 1), step.duration);
  }

  // Reset step states
  PROCESSING_STEPS.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      el.classList.remove('active', 'done');
      const icon = el.querySelector('.proc-step-icon');
      if (icon) {
        const emojis = ['📄','🤖','🎯','✏️','💬','✨'];
        icon.textContent = emojis[PROCESSING_STEPS.indexOf(s)] || '•';
      }
    }
  });
  if (progressFill) progressFill.style.width = '0%';

  runStep(0);
}


/* ═══════════════════════════════════════════════════════════════
   7. RESULTS DASHBOARD RENDERING
═══════════════════════════════════════════════════════════════ */

let _donutChart = null;

function showResults(analysis) {
  // Populate header
  const filenameEl = document.getElementById('results-filename');
  const metaEl     = document.getElementById('results-meta');
  if (filenameEl) filenameEl.textContent = analysis.filename;
  if (metaEl)     metaEl.textContent     = `${relativeTime()} · ${analysis.jobRole}`;

  // Render all sections
  renderScoreHero(analysis);
  renderStrengths(analysis.strengths);
  renderWeaknesses(analysis.weaknesses);
  renderMissingSkills(analysis.missingSkills);
  renderKeywords(analysis.presentKeywords, analysis.missingKeywords);
  renderGrammarIssues(analysis.grammarIssues);
  renderRecruiterFeedback(analysis.recruiter);
  renderImprovementTips(analysis.tips);

  // Show results
  showScreen('results-screen');

  // Toast
  setTimeout(() => {
    showToast(
      `ATS Score: ${analysis.atsScore}/100 — ${analysis.gradeInfo.label}`,
      analysis.atsScore >= 75 ? 'success' : analysis.atsScore >= 55 ? 'info' : 'warning',
      'Analysis Complete'
    );
  }, 400);

  // Start donut animation after transition
  setTimeout(() => {
    if (_donutChart) {
      _donutChart.score = analysis.atsScore;
      _donutChart.animate();
    }
  }, 600);

  // Animate section score bars
  setTimeout(() => {
    const fills = document.querySelectorAll('#section-scores-chart .progress-fill');
    fills.forEach((fill, i) => {
      const val = analysis.sectionScores[i]?.value || 0;
      animateProgressBar(fill, val, i * 120);
    });
  }, 700);
}

/* ── Score Hero ── */
function renderScoreHero(analysis) {
  // ATS Donut
  const canvas = document.getElementById('ats-canvas');
  if (canvas) {
    if (_donutChart) _donutChart.destroy();
    _donutChart = new DonutChart(canvas, {
      score: analysis.atsScore,
      size:  160,
      lineWidth: 18,
      duration: 1800,
    });
    window._donutChart = _donutChart;
  }

  // Verdict
  const verdictEl = document.getElementById('ats-verdict');
  if (verdictEl) verdictEl.textContent = analysis.atsVerdict;

  // Grade
  const gradeEl = document.getElementById('grade-display');
  const descEl  = document.getElementById('grade-desc');
  const badgeEl = document.getElementById('grade-badge');
  if (gradeEl)  gradeEl.textContent  = analysis.gradeInfo.grade;
  if (descEl)   descEl.textContent   = analysis.gradeInfo.desc;
  if (badgeEl) {
    badgeEl.textContent  = analysis.gradeInfo.label;
    badgeEl.className    = `badge ${analysis.gradeInfo.badgeClass}`;
  }

  // Grade color
  const score = analysis.atsScore;
  const color = score >= 80 ? 'var(--clr-success)' : score >= 60 ? 'var(--clr-accent)' : score >= 40 ? 'var(--clr-warning)' : 'var(--clr-danger)';
  if (gradeEl) gradeEl.style.cssText = `background:${color};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;

  // Section Scores mini bar chart
  const chartContainer = document.getElementById('section-scores-chart');
  if (chartContainer) {
    new MiniBarChart(chartContainer, analysis.sectionScores.map(s => ({
      label: s.label,
      value: s.value,
    })));
  }
}

/* ── Strengths ── */
function renderStrengths(strengths) {
  const list = document.getElementById('strengths-list');
  const countEl = document.getElementById('strengths-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${strengths.length} found`;

  list.innerHTML = strengths.map(s => `
    <div class="sw-item" role="listitem">
      <div class="sw-icon sw-icon-strength" aria-hidden="true">✓</div>
      <div class="sw-content">
        <div class="sw-title">${escHtml(s.title)}</div>
        <div class="sw-desc">${escHtml(s.desc)}</div>
      </div>
    </div>
  `).join('');
}

/* ── Weaknesses ── */
function renderWeaknesses(weaknesses) {
  const list = document.getElementById('weaknesses-list');
  const countEl = document.getElementById('weaknesses-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${weaknesses.length} found`;

  list.innerHTML = weaknesses.map(w => `
    <div class="sw-item" role="listitem">
      <div class="sw-icon sw-icon-weakness" aria-hidden="true">!</div>
      <div class="sw-content">
        <div class="sw-title">${escHtml(w.title)}</div>
        <div class="sw-desc">${escHtml(w.desc)}</div>
      </div>
    </div>
  `).join('');
}

/* ── Missing Skills ── */
function renderMissingSkills(skills) {
  const grid = document.getElementById('skills-grid');
  const countEl = document.getElementById('skills-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `${skills.length} skills`;

  grid.innerHTML = skills.map(skill => `
    <span class="chip chip-missing" role="listitem" title="Missing skill: ${escHtml(skill)}">
      <span aria-hidden="true">✗</span> ${escHtml(skill)}
    </span>
  `).join('');
}

/* ── Keywords ── */
function renderKeywords(present, missing) {
  const presentEl  = document.getElementById('present-keywords');
  const missingEl  = document.getElementById('missing-keywords');
  const densityEl  = document.getElementById('keyword-density');

  if (densityEl) {
    renderKeywordDensityBar(densityEl, present.length, missing.length);
  }

  if (presentEl) {
    presentEl.innerHTML = present.map(kw => `
      <span class="chip chip-present" role="listitem">
        <span aria-hidden="true">✓</span> ${escHtml(kw)}
      </span>
    `).join('');
  }

  if (missingEl) {
    missingEl.innerHTML = missing.map(kw => `
      <span class="chip chip-missing" role="listitem">
        <span aria-hidden="true">✗</span> ${escHtml(kw)}
      </span>
    `).join('');
  }
}

/* ── Grammar Issues ── */
function renderGrammarIssues(issues) {
  const list    = document.getElementById('grammar-list');
  const countEl = document.getElementById('grammar-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${issues.length} issues`;

  const severityLabels = { high: 'High', medium: 'Medium', low: 'Low' };

  list.innerHTML = issues.map(issue => `
    <div class="grammar-item" role="listitem">
      <div class="grammar-severity severity-${issue.severity}" aria-label="Severity: ${issue.severity}"></div>
      <div class="grammar-content">
        <div class="grammar-title">
          ${escHtml(issue.title)}
          <span class="badge badge-${issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warning' : 'info'}"
                style="margin-left:8px;font-size:var(--fs-xs)"
                aria-label="Priority: ${severityLabels[issue.severity]}">
            ${severityLabels[issue.severity]}
          </span>
        </div>
        <div class="grammar-suggestion">${escHtml(issue.suggestion)}</div>
        <span class="grammar-fix" aria-label="Suggested fix">💡 ${escHtml(issue.fix)}</span>
      </div>
    </div>
  `).join('');
}

/* ── Recruiter Feedback ── */
function renderRecruiterFeedback(recruiter) {
  const container = document.getElementById('recruiter-feedback-content');
  if (!container) return;

  const ratingColor = (val) => {
    if (val >= 8) return 'var(--clr-success)';
    if (val >= 6) return 'var(--clr-accent)';
    if (val >= 4) return 'var(--clr-warning)';
    return 'var(--clr-danger)';
  };

  container.innerHTML = `
    <div class="recruiter-header">
      <div class="recruiter-avatar" aria-hidden="true">${escHtml(recruiter.avatar)}</div>
      <div class="recruiter-info">
        <div class="recruiter-name">${escHtml(recruiter.name)}</div>
        <div class="recruiter-role">${escHtml(recruiter.role)}</div>
      </div>
    </div>
    <blockquote class="recruiter-quote" aria-label="Recruiter feedback quote">
      ${escHtml(recruiter.quote)}
    </blockquote>
    <div class="recruiter-ratings" aria-label="Recruiter ratings">
      <div class="recruiter-rating">
        <div class="recruiter-rating-value" style="color:${ratingColor(recruiter.ratings.tone)}" aria-label="Tone score: ${recruiter.ratings.tone} out of 10">
          ${recruiter.ratings.tone}<span style="font-size:var(--fs-sm);opacity:.6">/10</span>
        </div>
        <div class="recruiter-rating-label">Tone</div>
      </div>
      <div class="recruiter-rating">
        <div class="recruiter-rating-value" style="color:${ratingColor(recruiter.ratings.clarity)}" aria-label="Clarity score: ${recruiter.ratings.clarity} out of 10">
          ${recruiter.ratings.clarity}<span style="font-size:var(--fs-sm);opacity:.6">/10</span>
        </div>
        <div class="recruiter-rating-label">Clarity</div>
      </div>
      <div class="recruiter-rating">
        <div class="recruiter-rating-value" style="color:${ratingColor(recruiter.ratings.impact)}" aria-label="Impact score: ${recruiter.ratings.impact} out of 10">
          ${recruiter.ratings.impact}<span style="font-size:var(--fs-sm);opacity:.6">/10</span>
        </div>
        <div class="recruiter-rating-label">Impact</div>
      </div>
    </div>
  `;
}

/* ── Improvement Tips ── */
function renderImprovementTips(tips) {
  const list    = document.getElementById('tips-list');
  const countEl = document.getElementById('tips-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${tips.length} tips`;

  list.innerHTML = tips.map((tip, i) => `
    <div class="tip-item" role="listitem">
      <div class="tip-number" aria-hidden="true">${i + 1}</div>
      <div class="tip-content">
        <div class="tip-title">${escHtml(tip.title)}</div>
        <div class="tip-desc">${escHtml(tip.desc)}</div>
      </div>
      <div class="tip-priority">
        <span class="badge priority-${tip.priority}" aria-label="Priority: ${tip.priority}">
          ${tip.priority.charAt(0).toUpperCase() + tip.priority.slice(1)}
        </span>
      </div>
    </div>
  `).join('');
}


/* ═══════════════════════════════════════════════════════════════
   8. PDF EXPORT
═══════════════════════════════════════════════════════════════ */

function setupPdfExport() {
  const btn = document.getElementById('download-pdf-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    showToast('Opening print dialog — save as PDF for best results.', 'info', 'Export Report');
    setTimeout(() => window.print(), 600);
  });
}


/* ═══════════════════════════════════════════════════════════════
   9. ANALYZE AGAIN
═══════════════════════════════════════════════════════════════ */

function setupAnalyzeAgain() {
  ['analyze-again-btn', 'analyze-again-btn-bottom'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      selectedFile = null;

      // Reset drop zone
      const dropZone = document.getElementById('drop-zone');
      if (dropZone) dropZone.classList.remove('file-selected', 'drag-over');

      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      const jobRole = document.getElementById('job-role');
      if (jobRole) jobRole.value = '';

      const analyzeBtn = document.getElementById('analyze-btn');
      if (analyzeBtn) analyzeBtn.disabled = true;

      showScreen('upload-screen');
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   10. BOOTSTRAP
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupUpload();
  setupPdfExport();
  setupAnalyzeAgain();
});
