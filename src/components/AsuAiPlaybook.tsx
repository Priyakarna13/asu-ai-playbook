import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, Check, Heart, HeartHandshake, Users2, School, Wand2, Code2, Image as ImageIcon, Bot, Video, Sparkles, Sun, Moon, Filter, ChevronRight } from "lucide-react";

// =====================
// ASU AI Playbook — Interactive Next.js Ready
// TailwindCSS available. Minimal, playful, accessible.
// Theme: ASU Maroon & Gold via Tailwind extend colors
// =====================

const TOOLS = [
  { id: "chatgpt", label: "ChatGPT", icon: Bot },
  { id: "copilot", label: "Microsoft Copilot", icon: Code2 },
  { id: "firefly", label: "Adobe Firefly", icon: ImageIcon },
  { id: "gemini", label: "Google Gemini", icon: Sparkles },
  { id: "zoom", label: "Zoom AI Companion", icon: Video },
];

const ROLES = [
  { id: "student", label: "Students", icon: Users2 },
  { id: "faculty", label: "Faculty", icon: School },
];

// ---------- Helpers
const useLocal = (key, init) => {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV];
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1200);} catch {}
      }}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm bg-asu-gold text-asu-maroon hover:bg-yellow-400 transition"
      aria-label="Copy prompt"
    >
      {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const Pill = ({ active, children, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${active ?
      'bg-asu-maroon text-white border-asu-maroon shadow' :
      'bg-white/70 dark:bg-zinc-900/60 backdrop-blur border-zinc-200 dark:border-zinc-700 hover:border-asu-gold'}`}
  >
    {Icon && <Icon className="h-4 w-4"/>}
    {children}
  </button>
);

// ---------- Data (10 student + 10 faculty per tool)
// Each item: {tool, role, title, prompt, tags, details}
const DATA = (() => {
  const s = (tool, title, prompt, tags=[], details="") => ({ tool, role: "student", title, prompt, tags, details });
  const f = (tool, title, prompt, tags=[], details="") => ({ tool, role: "faculty", title, prompt, tags, details });
  const P = (t) => `You are an expert academic assistant. ${t} Keep it concise and actionable.`;

  // --- ChatGPT
  const chatgpt = [
    s('chatgpt','Thesis Builder', P('Given my topic, propose 3 clear thesis statements with pros/cons.'), ['writing','planning']),
    s('chatgpt','Paper Summarizer', P('Summarize this paper into key claims, evidence, and 3 open questions.'), ['research']),
    s('chatgpt','Study Plan Coach', P('Create a 2-week study plan for [course] with daily goals and checkpoints.'), ['planning']),
    s('chatgpt','Code Explainer', P('Explain this code like I am 15 and suggest clearer variable names.'), ['coding']),
    s('chatgpt','Flashcard Generator', P('Turn these notes into 20 active-recall flashcards with answers.'), ['memory']),
    s('chatgpt','Project Ideas', P('Brainstorm 5 project ideas for [course topic] with scope and datasets.'), ['ideation']),
    s('chatgpt','Email Polisher', P('Rewrite this email to a professor: concise, respectful, specific ask.'), ['communication']),
    s('chatgpt','Essay Outline', P('Outline a 1500-word essay with sections, key sources, and transitions.'), ['writing']),
    s('chatgpt','Mock Interview', P('Ask me 8 questions for a [role] interview and give feedback after.'), ['career']),
    s('chatgpt','Step-by-step Math', P('Solve this problem step-by-step, showing the reasoning and final answer.'), ['math']),

    f('chatgpt','Rubric Designer', P('Draft a rubric for a 100-point assignment with criteria and levels.'), ['teaching']),
    f('chatgpt','Syllabus Outline', P('Create a 15-week syllabus skeleton for [course], weekly topics + outcomes.'), ['planning']),
    f('chatgpt','Question Bank', P('Generate 15 quiz questions across Bloom levels for [topic], with keys.'), ['assessment']),
    f('chatgpt','Submission Summaries', P('Summarize 10 student reflections into themes and 3 action items.'), ['grading']),
    f('chatgpt','Feedback Templates', P('Create reusable feedback snippets for common writing issues.'), ['grading']),
    f('chatgpt','Office Hours FAQ', P('Draft a Q&A cheat-sheet for frequent course questions.'), ['ops']),
    f('chatgpt','Translation Assist', P('Translate this announcement to [language] with friendly tone.'), ['accessibility']),
    f('chatgpt','Rec Letter Draft', P('Draft a recommendation letter given the bullet points below.'), ['admin']),
    f('chatgpt','Lecture Outline', P('Outline a 50-minute lecture on [topic] with examples and demos.'), ['teaching']),
    f('chatgpt','Standards Alignment', P('Map course outcomes to ABET-style learning outcomes.'), ['accreditation']),
  ];

  // --- Copilot
  const copilot = [
    s('copilot','Code Completion', P('Suggest idiomatic code for this function and explain the changes.'), ['coding']),
    s('copilot','Unit Tests', P('Generate unit tests for this module using [framework].'), ['testing']),
    s('copilot','Explain Suggestion', P('Explain why this Copilot suggestion is correct or risky.'), ['learning']),
    s('copilot','Refactor Helper', P('Refactor for readability and add comments/docs.'), ['clean-code']),
    s('copilot','Language X↔Y', P('Translate this snippet from Python to C++ with notes.'), ['translation']),
    s('copilot','Docstrings', P('Write docstrings in Google style for these functions.'), ['docs']),
    s('copilot','Starter App', P('Create a minimal CRUD example for [stack].'), ['starter']),
    s('copilot','SQL Assistant', P('Propose an efficient SQL query for this question, then explain.'), ['data']),
    s('copilot','Bug Fixer', P('Given this stack trace, propose fixes and tests.'), ['debug']),
    s('copilot','Git Messages', P('Generate conventional commit messages for these diffs.'), ['git']),

    f('copilot','Starter Assignments', P('Create assignment starter code + TODOs for [topic].'), ['teaching']),
    f('copilot','Autograder Scripts', P('Draft a simple autograder for test cases with clear errors.'), ['assessment']),
    f('copilot','Legacy Refactor', P('Refactor legacy lab code to modern patterns with comments.'), ['maintenance']),
    f('copilot','Exercise Variants', P('Create 5 difficulty-graded exercise variants for [concept].'), ['teaching']),
    f('copilot','Peer Review Hints', P('Generate code review checklist tailored to this assignment.'), ['quality']),
    f('copilot','Template Library', P('Produce reusable code templates with placeholders.'), ['reusability']),
    f('copilot','Pseudocode→Code', P('Translate pseudocode to runnable [language] with tests.'), ['teaching']),
    f('copilot','Data Cleanup', P('Write a script to normalize CSVs and validate schema.'), ['data']),
    f('copilot','Demo Prototypes', P('Spin up a tiny demo app for lecture using [framework].'), ['demo']),
    f('copilot','Docs Pages', P('Generate a README and lab handout with steps and screenshots.'), ['docs']),
  ];

  // --- Firefly
  const firefly = [
    s('firefly','Slide Hero Art', P('Generate a clean, license-safe hero image for slides on [topic].'), ['visuals']),
    s('firefly','Background Removal', P('Remove backgrounds and export PNGs for a poster.'), ['editing']),
    s('firefly','Custom Icons', P('Create a simple icon set with 2 colors, SVG export.'), ['branding']),
    s('firefly','Headshot Cleanup', P('Retouch headshot: lighting, crop, subtle color match.'), ['photo']),
    s('firefly','Poster Template', P('Design an academic poster grid with headings and color tokens.'), ['layout']),
    s('firefly','Infographic', P('Turn stats into a 3-panel infographic with captions.'), ['visuals']),
    s('firefly','Club Social Post', P('Create square + story graphics for club announcements.'), ['social']),
    s('firefly','Style Transfer', P('Apply cohesive color style for slides + poster.'), ['branding']),
    s('firefly','Color Palette', P('Propose 3 palettes and show contrast ratios.'), ['accessibility']),
    s('firefly','Upscale & Denoise', P('Upscale low-res diagram for print.'), ['quality']),

    f('firefly','Lecture Visuals', P('Create 3 simple diagrams to illustrate [concept].'), ['teaching']),
    f('firefly','Course Banner', P('Design a course banner image with readable typography.'), ['branding']),
    f('firefly','Assignment Visuals', P('Generate small visuals for assignment PDFs.'), ['teaching']),
    f('firefly','Alt Text Helper', P('Suggest alt text for 10 images; keep descriptive.'), ['accessibility']),
    f('firefly','Rubric Icons', P('Create tiny rubric icons for criteria categories.'), ['assessment']),
    f('firefly','Brand Consistency', P('Apply consistent style across slides and handouts.'), ['branding']),
    f('firefly','Call-for-Posters', P('Produce flyer/poster templates for a symposium.'), ['ops']),
    f('firefly','Lab Mockups', P('Mock up experimental setup illustrations.'), ['visuals']),
    f('firefly','Quick Thumbnails', P('Generate thumbnails for recorded lectures.'), ['video']),
    f('firefly','Print Prep', P('Export CMYK, margins/bleeds checklist.'), ['production']),
  ];

  // --- Gemini
  const gemini = [
    s('gemini','Research Buddy', P('Brainstorm angles and key sources on [topic]; cite links to start.'), ['research']),
    s('gemini','PDF Key Points', P('Extract key points and glossary from this PDF.'), ['docs']),
    s('gemini','Code + Image', P('Given this diagram image, write code that implements it.'), ['multimodal']),
    s('gemini','Slides from Outline', P('Turn this outline into slide bullets with speaker notes.'), ['slides']),
    s('gemini','Data Explorer', P('Answer questions about this CSV and propose charts.'), ['data']),
    s('gemini','Translate', P('Translate this draft to [language], keep tone neutral.'), ['language']),
    s('gemini','Map/Timeline', P('Create a study timeline and calendar milestones.'), ['planning']),
    s('gemini','YouTube Summary', P('Summarize this YouTube lecture and key timestamps.'), ['video']),
    s('gemini','Schedule Helper', P('Propose a weekly schedule syncing with Google Calendar.'), ['productivity']),
    s('gemini','Apps Script', P('Draft a Google Apps Script to auto-format a Sheet.'), ['automation']),

    f('gemini','Gmail + Docs Drafts', P('Draft a kind announcement email, then a Docs version.'), ['comms']),
    f('gemini','Slides Generator', P('Create 10-slide outline with images suggestions.'), ['slides']),
    f('gemini','Sheets Insights', P('Analyze survey results in Sheets; give top 5 insights.'), ['data']),
    f('gemini','Rubrics from Standards', P('Create rubric aligned with course outcomes.'), ['assessment']),
    f('gemini','Grading Aid', P('Suggest feedback buckets and common comments.'), ['grading']),
    f('gemini','Apps Script Automations', P('Write Apps Script to move files + rename by pattern.'), ['automation']),
    f('gemini','Docs Summarizer', P('Summarize meeting notes and extract action items.'), ['ops']),
    f('gemini','Lesson Plans', P('Create a lesson plan aligned to outcomes + activities.'), ['teaching']),
    f('gemini','Citation Seeds', P('Propose 10 authoritative sources to investigate.'), ['research']),
    f('gemini','Google Sites Hub', P('Draft site structure for a course resource hub.'), ['ops']),
  ];

  // --- Zoom
  const zoom = [
    s('zoom','Meeting Notes', P('Generate concise notes and action items from the recording.'), ['notes']),
    s('zoom','Ask About Call', P('Answer questions I ask about the meeting content.'), ['qa']),
    s('zoom','Agenda Draft', P('Draft a focused agenda for the next study meeting.'), ['planning']),
    s('zoom','Chapters', P('Create chapter markers with titles + timestamps.'), ['video']),
    s('zoom','Translate Captions', P('Translate captions and provide glossary of technical terms.'), ['accessibility']),
    s('zoom','Follow-up Email', P('Draft an email summarizing decisions and next steps.'), ['comms']),
    s('zoom','Clarify Mid-call', P('Real-time clarification questions during lecture.'), ['support']),
    s('zoom','Chat Summaries', P('Summarize the Zoom chat thread by theme.'), ['ops']),
    s('zoom','Highlights Reel', P('Collect highlights with timestamps for revision.'), ['study']),
    s('zoom','Task Extractor', P('Extract tasks with owners and due dates.'), ['productivity']),

    f('zoom','Attendance & Notes', P('Summarize attendance trends and key takeaways.'), ['ops']),
    f('zoom','Poll Recaps', P('Summarize poll results with quick charts.'), ['assessment']),
    f('zoom','Office Hours Digest', P('Produce a digest of student Q&A with links.'), ['support']),
    f('zoom','Lecture Summary', P('Create a post-lecture summary for LMS announcement.'), ['teaching']),
    f('zoom','Action Items', P('List action items for TAs with owners + dates.'), ['ops']),
    f('zoom','Quiz Seeds', P('Suggest quiz questions from the lecture content.'), ['assessment']),
    f('zoom','Accessibility Boost', P('Improve captions, terminology, and provide glossary.'), ['accessibility']),
    f('zoom','Stakeholder Brief', P('Produce 5-bullet summary for department heads.'), ['comms']),
    f('zoom','Committee Minutes', P('Draft minutes with motions and votes.'), ['admin']),
    f('zoom','Clip Generator', P('Identify 5 moments to clip as micro-lectures.'), ['video']),
  ];

  return [...chatgpt, ...copilot, ...firefly, ...gemini, ...zoom];
})();

// ---------- UI Components
const Header = ({ role, setRole, dark, setDark }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/90 dark:bg-zinc-950/60 border-b border-asu-maroon">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div initial={{rotate:-10, scale:0.9}} animate={{rotate:0, scale:1}} transition={{type:'spring', stiffness:220, damping:14}} className="h-10 w-10 rounded-2xl bg-asu-maroon flex items-center justify-center shadow-md">
            <img src="/asu-logo.png" alt="ASU Logo" className="h-7 w-7" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-asu-maroon">ASU AI Playbook</h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Practical ways to use AI — Students & Faculty</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ROLES.map(r => (
            <Pill key={r.id} active={role===r.id} onClick={()=>setRole(r.id)} icon={r.icon}>{r.label}</Pill>
          ))}
          <button aria-label="Toggle theme" onClick={()=>setDark(d=>!d)} className="ml-2 rounded-xl p-2 border border-asu-maroon hover:bg-asu-gold hover:text-asu-maroon">
            {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>
        </div>
      </div>
    </header>
  );
};

const HeroBanner = ({ role }) => (
  <section className="relative pt-12 pb-10">
    <div className="absolute inset-0 bg-gradient-to-r from-asu-maroon to-asu-gold opacity-90 -z-10"></div>
    <div className="max-w-7xl mx-auto px-6 text-center text-white">
      <motion.h2 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-3xl md:text-5xl font-extrabold mb-4">
        {role === 'student' ? 'Do more, stress less.' : 'Teach smarter, not harder.'}
      </motion.h2>
      <p className="max-w-2xl mx-auto text-lg md:text-xl">
        {role === 'student' ? 'Explore AI workflows for studying, projects, and career prep.' : 'Design and deliver learning with responsibly applied AI.'}
      </p>
    </div>
  </section>
);

const ToolBar = ({ tool, setTool, query, setQuery }) => (
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-2">
    <div className="flex items-center gap-2 overflow-x-auto">
      <Pill active={!tool} onClick={()=>setTool(null)} icon={Filter}>All tools</Pill>
      {TOOLS.map(t => (
        <Pill key={t.id} active={tool===t.id} onClick={()=>setTool(t.id)} icon={t.icon}>{t.label}</Pill>
      ))}
    </div>
    <div className="ml-auto relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
      <input
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="Search use cases, e.g. rubric, flashcards, Apps Script"
        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-asu-maroon"
      />
    </div>
  </div>
);

const Card = ({ item, onOpen, favorite, setFavorite }) => {
  const ToolIcon = TOOLS.find(t=>t.id===item.tool)?.icon ?? Bot;
  const roleChip = item.role === 'student' ? 'Students' : 'Faculty';
  const fav = favorite(item);
  return (
    <motion.div layout initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-asu-maroon text-white flex items-center justify-center">
          <ToolIcon className="h-5 w-5"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{TOOLS.find(t=>t.id===item.tool)?.label}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-asu-gold/80 text-asu-maroon border border-yellow-300">{roleChip}</span>
          </div>
          <h3 className="mt-2 font-semibold tracking-tight truncate">{item.title}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">{item.prompt}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {item.tags?.slice(0,3).map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={item.prompt}/>
          <button
            onClick={()=>setFavorite(item, !fav)}
            aria-label={fav? 'Unfavorite' : 'Favorite'}
            className={`rounded-xl p-2 border transition ${fav? 'bg-rose-500 text-white border-rose-500' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <Heart className="h-4 w-4"/>
          </button>
          <button onClick={()=>onOpen(item)} className="rounded-xl px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">Details</button>
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ open, onClose, item }) => {
  if (!open || !item) return null;
  const ToolIcon = TOOLS.find(t=>t.id===item.tool)?.icon ?? Bot;
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{scale:0.95, y:12, opacity:0}} animate={{scale:1, y:0, opacity:1}} exit={{scale:0.95, opacity:0}} className="max-w-2xl w-full rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-asu-maroon text-white flex items-center justify-center"><ToolIcon className="h-5 w-5"/></div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg tracking-tight">{item.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{TOOLS.find(t=>t.id===item.tool)?.label} · {item.role === 'student'? 'Students' : 'Faculty'}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronRight className="rotate-90 h-4 w-4"/></button>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900">
              <div className="text-xs mb-1 text-zinc-500">Sample prompt</div>
              <div className="text-sm">{item.prompt}</div>
              <div className="mt-2"><CopyButton text={item.prompt}/></div>
            </div>
            {item.details && (
              <div className="text-sm text-zinc-700 dark:text-zinc-300">{item.details}</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="mt-10 border-t border-asu-maroon">
    <div className="max-w-7xl mx-auto px-4 py-8 grid gap-4 sm:grid-cols-2 items-center">
      <div className="space-y-2">
        <h4 className="font-semibold tracking-tight text-asu-maroon">ASU • Learn to thrive.</h4>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Innovation lives here. Be bold, be curious, be Sun Devil strong.</p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Use AI responsibly: verify outputs, cite sources, respect privacy & academic integrity.</p>
      </div>
      <div className="flex justify-start sm:justify-end">
        <a href="#top" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-asu-maroon bg-asu-gold text-asu-maroon font-semibold hover:bg-yellow-400">Back to top</a>
      </div>
    </div>
  </footer>
);

// ---------- Main App
export default function App() {
  const [role, setRole] = useLocal('asuai-role', 'student');
  const [dark, setDark] = useLocal('asuai-dark', false);
  const [tool, setTool] = useLocal('asuai-tool', null);
  const [query, setQuery] = useLocal('asuai-query', '');
  const [favorites, setFavorites] = useLocal('asuai-favs', []);
  const [open, setOpen] = useState(null);

  useEffect(()=>{
    const root = document.documentElement;
    dark ? root.classList.add('dark') : root.classList.remove('dark');
  }, [dark]);

  const favorite = (item) => favorites.some(f=>f.title===item.title && f.tool===item.tool && f.role===item.role);
  const setFavorite = (item, on) => {
    setFavorites(prev => on ? [...prev, item] : prev.filter(f=>!(f.title===item.title && f.tool===item.tool && f.role===item.role)));
  };

  const filtered = useMemo(()=>{
    return DATA.filter(d => d.role===role)
      .filter(d => !tool || d.tool===tool)
      .filter(d => !query || (d.title+" "+d.prompt+" "+(d.tags||[]).join(' ')).toLowerCase().includes(query.toLowerCase()));
  }, [role, tool, query]);

  return (
    <div id="top" className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header role={role} setRole={setRole} dark={dark} setDark={setDark} />
      <HeroBanner role={role} />

      <ToolBar tool={tool} setTool={setTool} query={query} setQuery={setQuery} />
      <div className="px-4 md:px-6 max-w-7xl mx-auto mb-2 text-sm text-zinc-600 dark:text-zinc-400">{filtered.length} use cases</div>

      <section className="max-w-7xl mx-auto px-4 md:px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <Card key={item.title+item.tool+item.role+i} item={item} onOpen={setOpen} favorite={favorite} setFavorite={setFavorite} />
          ))}
        </AnimatePresence>
      </section>

      {favorites.filter(f=>f.role===role).length>0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
          <h3 className="font-semibold mb-3 tracking-tight">Favorites</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.filter(f=>f.role===role).map((item, i)=> (
              <Card key={'fav'+i} item={item} onOpen={setOpen} favorite={()=>true} setFavorite={(it)=>setFavorite(it,false)} />
            ))}
          </div>
        </section>
      )}

      <Footer />

      <Modal open={!!open} onClose={()=>setOpen(null)} item={open} />
    </div>
  );
}

// Notes:
// - Ensure Tailwind has custom colors in tailwind.config.ts: asu-maroon #8C1D40, asu-gold #FFC627
// - Place asu-logo.png in /public
// - Page file: src/app/page.tsx imports this component and renders it
