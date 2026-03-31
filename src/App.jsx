import { useState, useEffect, useCallback } from "react";

// ─── Resource Library ─────────────────────────────────────────────
// Each task key maps to { videos, websites, pdfs, tips }
const RESOURCES = {
  // ── AI / n8n / Python ────────────────────────────────────────────
  "how-llms-work": {
    title: "How LLMs Work",
    videos: [
      { label: "Andrej Karpathy – Intro to LLMs (YouTube)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
      { label: "3Blue1Brown – But what is a GPT? (YouTube)", url: "https://www.youtube.com/watch?v=wjZofJX0v4M" },
    ],
    websites: [
      { label: "Anthropic – How Claude Works", url: "https://www.anthropic.com/claude" },
      { label: "Hugging Face – NLP Course (Free)", url: "https://huggingface.co/learn/nlp-course/chapter1/1" },
    ],
    tips: "Watch the 3Blue1Brown video first — it's the clearest visual explanation of transformers. Take notes on: tokens, embeddings, attention.",
  },
  "python-install": {
    title: "Python & VS Code Setup",
    videos: [
      { label: "Python Installation Guide 2024 (YouTube)", url: "https://www.youtube.com/watch?v=YYXdXT2l-Gg" },
      { label: "VS Code Setup for Python (YouTube)", url: "https://www.youtube.com/watch?v=W--_EOzdTHk" },
    ],
    websites: [
      { label: "Python Official Download", url: "https://www.python.org/downloads/" },
      { label: "VS Code Download", url: "https://code.visualstudio.com/" },
      { label: "Real Python – Virtual Environments Guide", url: "https://realpython.com/python-virtual-environments-a-primer/" },
    ],
    tips: "Install Python 3.11+. Always create a virtual environment before starting any project: python -m venv venv",
  },
  "prompt-engineering-basics": {
    title: "Prompt Engineering Basics",
    videos: [
      { label: "Prompt Engineering Full Course – Andrew Ng (YouTube)", url: "https://www.youtube.com/watch?v=dOxUroR57xs" },
      { label: "Zero-shot vs Few-shot Prompting Explained", url: "https://www.youtube.com/watch?v=v2gD8BHOaX4" },
    ],
    websites: [
      { label: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { label: "Learn Prompting – Free Course", url: "https://learnprompting.org/" },
      { label: "OpenAI Prompt Engineering Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" },
    ],
    tips: "The 4 signals to master first: Role, Context, Task, Format. Practice each one separately before combining them.",
  },
  "n8n-basics": {
    title: "n8n Basics",
    videos: [
      { label: "n8n Full Beginner Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=1MwSoB0gnM4" },
      { label: "n8n Crash Course 2024 (YouTube)", url: "https://www.youtube.com/watch?v=3ORfhGTnXUk" },
    ],
    websites: [
      { label: "n8n Cloud – Free Account", url: "https://app.n8n.cloud/register" },
      { label: "n8n Official Documentation", url: "https://docs.n8n.io/" },
      { label: "n8n Community Forum", url: "https://community.n8n.io/" },
    ],
    tips: "Start with n8n Cloud (free tier). Your first workflow: Manual Trigger → Set Node → see the output. Don't overcomplicate it on Day 1.",
  },
  "python-basics": {
    title: "Python Programming Basics",
    videos: [
      { label: "Python for Beginners – Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
      { label: "Python Crash Course in 1 Hour", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
    ],
    websites: [
      { label: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "W3Schools Python", url: "https://www.w3schools.com/python/" },
      { label: "Real Python – Beginner Tutorials", url: "https://realpython.com/tutorials/basics/" },
    ],
    tips: "Practice in VS Code. Write every example by hand — don't copy-paste. Understanding comes from typing the code yourself.",
  },
  "make-com-basics": {
    title: "Make.com (Integromat) Basics",
    videos: [
      { label: "Make.com Full Tutorial for Beginners (YouTube)", url: "https://www.youtube.com/watch?v=hy7XL6mIpUg" },
      { label: "Make.com vs n8n – Which to Use? (YouTube)", url: "https://www.youtube.com/watch?v=5ql0xqXaVbQ" },
    ],
    websites: [
      { label: "Make.com – Free Account", url: "https://www.make.com/en/register" },
      { label: "Make.com Academy (Free)", url: "https://academy.make.com/" },
      { label: "Make.com Documentation", url: "https://www.make.com/en/help" },
    ],
    tips: "Make.com calls workflows 'Scenarios'. Start with the Gmail → Google Sheets scenario — it teaches all the key concepts.",
  },
  "pandas-basics": {
    title: "pandas – Data Analysis",
    videos: [
      { label: "pandas Tutorial – Full Course (Keith Galli)", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
      { label: "pandas in 10 Minutes (Official)", url: "https://www.youtube.com/watch?v=_T8LGqJtuGc" },
    ],
    websites: [
      { label: "pandas Official Documentation", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/" },
      { label: "Kaggle – pandas Course (Free)", url: "https://www.kaggle.com/learn/pandas" },
      { label: "Real Python – pandas Tutorial", url: "https://realpython.com/pandas-dataframe/" },
    ],
    tips: "Install with: pip install pandas. The 3 things to master first: read_csv(), DataFrame filtering, groupby().",
  },
  "claude-code": {
    title: "Claude Code",
    videos: [
      { label: "Claude Code Getting Started (Official)", url: "https://www.youtube.com/watch?v=N9MRnGMVPpk" },
      { label: "Claude Code Full Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=7Q4_mNpKehs" },
    ],
    websites: [
      { label: "Claude Code Official Docs", url: "https://docs.anthropic.com/en/docs/claude-code/overview" },
      { label: "Claude Code GitHub", url: "https://github.com/anthropics/claude-code" },
      { label: "Anthropic – Claude Code Quickstart", url: "https://docs.anthropic.com/en/docs/claude-code/quickstart" },
    ],
    tips: "Install with: npm install -g @anthropic-ai/claude-code. Start by opening a Python project folder and typing /help to see all commands.",
  },
  "python-oop": {
    title: "Python OOP – Classes & Objects",
    videos: [
      { label: "Python OOP Tutorial – Corey Schafer (YouTube)", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
      { label: "Python Classes Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=Ej_02ICOIgs" },
    ],
    websites: [
      { label: "Real Python – OOP in Python", url: "https://realpython.com/python3-object-oriented-programming/" },
      { label: "W3Schools – Python Classes", url: "https://www.w3schools.com/python/python_classes.asp" },
    ],
    tips: "The key concepts: __init__ (constructor), self, inheritance, and methods. Build a simple 'BankAccount' class to practice all four.",
  },
  "fastapi": {
    title: "FastAPI – Building APIs with Python",
    videos: [
      { label: "FastAPI Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=0sOvCWFmrtA" },
      { label: "FastAPI in 1 Hour (YouTube)", url: "https://www.youtube.com/watch?v=SORiTsvnU28" },
    ],
    websites: [
      { label: "FastAPI Official Documentation", url: "https://fastapi.tiangolo.com/" },
      { label: "FastAPI Tutorial – Real Python", url: "https://realpython.com/fastapi-python-web-apis/" },
    ],
    tips: "FastAPI auto-generates docs at /docs. Always run your API and test it in the browser at localhost:8000/docs before connecting anything to it.",
  },
  "streamlit": {
    title: "Streamlit – Python Web Apps",
    videos: [
      { label: "Streamlit Full Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=VqgUkExPvLY" },
      { label: "Build AI Apps with Streamlit (YouTube)", url: "https://www.youtube.com/watch?v=ygkdFKP4cIY" },
    ],
    websites: [
      { label: "Streamlit Official Docs", url: "https://docs.streamlit.io/" },
      { label: "Streamlit Gallery – Examples", url: "https://streamlit.io/gallery" },
      { label: "Deploy Free on Streamlit Cloud", url: "https://streamlit.io/cloud" },
    ],
    tips: "Install with: pip install streamlit. Run with: streamlit run app.py. It auto-refreshes when you save — great for rapid prototyping.",
  },
  "web-scraping": {
    title: "Web Scraping with Python",
    videos: [
      { label: "Web Scraping with BeautifulSoup (YouTube)", url: "https://www.youtube.com/watch?v=XVv6mJpFOb0" },
      { label: "Python Web Scraping Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=XVv6mJpFOb0" },
    ],
    websites: [
      { label: "Real Python – Web Scraping Tutorial", url: "https://realpython.com/beautiful-soup-web-scraper-python/" },
      { label: "BeautifulSoup Documentation", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" },
    ],
    tips: "Install: pip install requests beautifulsoup4. Always check a website's robots.txt before scraping. Start with books.toscrape.com — a site made for practice scraping.",
  },
  "upwork-fiverr": {
    title: "Freelancing on Upwork & Fiverr",
    videos: [
      { label: "Upwork for Beginners – Complete Guide (YouTube)", url: "https://www.youtube.com/watch?v=HqLMQBSaXig" },
      { label: "Fiverr Tutorial for Beginners 2024 (YouTube)", url: "https://www.youtube.com/watch?v=Ly2pjB9dj-Q" },
      { label: "How to Get First Client on Upwork (YouTube)", url: "https://www.youtube.com/watch?v=WXVsVHxeoxA" },
    ],
    websites: [
      { label: "Upwork – Create Free Account", url: "https://www.upwork.com/signup/" },
      { label: "Fiverr – Create Free Account", url: "https://www.fiverr.com/join" },
      { label: "Upwork Success Guide", url: "https://www.upwork.com/resources/upwork-success-guide" },
    ],
    tips: "Your first gig title formula: 'I will [specific action] using [specific tool] for [specific result]'. Example: 'I will build a custom n8n automation workflow to save you 5 hours per week'.",
  },
  "rag": {
    title: "RAG – Retrieval Augmented Generation",
    videos: [
      { label: "RAG Explained in 10 Minutes (YouTube)", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M" },
      { label: "Build a RAG App from Scratch (YouTube)", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8" },
    ],
    websites: [
      { label: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/" },
      { label: "Pinecone – Learn RAG", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/" },
    ],
    tips: "RAG = Give the AI your own documents to search through. The pipeline: Load PDF → Split into chunks → Embed → Store → Search → Answer.",
  },
  // ── Calculus ────────────────────────────────────────────────────
  "limits": {
    title: "Calculus – Limits",
    videos: [
      { label: "Limits – Khan Academy (YouTube)", url: "https://www.youtube.com/watch?v=W0VWO4asgmk" },
      { label: "Introduction to Limits (Professor Leonard)", url: "https://www.youtube.com/watch?v=54_XRjHhZzI" },
    ],
    websites: [
      { label: "Khan Academy – Limits Course (Free)", url: "https://www.khanacademy.org/math/calculus-1/cs1-limits-and-continuity" },
      { label: "Paul's Online Math Notes – Limits", url: "https://tutorial.math.lamar.edu/Classes/CalcI/LimitsIntro.aspx" },
    ],
    tips: "The key idea: What value does f(x) approach as x gets close to a number? Always try direct substitution first, then factor or rationalize if you get 0/0.",
  },
  "derivatives": {
    title: "Calculus – Derivatives",
    videos: [
      { label: "Derivatives – Khan Academy (YouTube)", url: "https://www.youtube.com/watch?v=rAof9Ld5sOg" },
      { label: "Derivative Rules – Professor Leonard (YouTube)", url: "https://www.youtube.com/watch?v=EY6FHX6asU0" },
      { label: "Chain Rule Made Easy (YouTube)", url: "https://www.youtube.com/watch?v=H-ybCx8gt-8" },
    ],
    websites: [
      { label: "Khan Academy – Derivatives", url: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules" },
      { label: "Paul's Online Math Notes – Derivatives", url: "https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx" },
      { label: "Derivative Calculator (Practice Tool)", url: "https://www.derivative-calculator.net/" },
    ],
    tips: "Master rules in this order: Power Rule → Sum Rule → Product Rule → Chain Rule. Do 10 problems per rule before moving on.",
  },
  "integrals": {
    title: "Calculus – Integrals",
    videos: [
      { label: "Introduction to Integration – Khan Academy", url: "https://www.youtube.com/watch?v=rfG8ce4nNh0" },
      { label: "Integration by Parts (YouTube)", url: "https://www.youtube.com/watch?v=2I-_SV8cwsw" },
      { label: "Integration by Substitution (YouTube)", url: "https://www.youtube.com/watch?v=-EG10aI0rt0" },
    ],
    websites: [
      { label: "Khan Academy – Integrals", url: "https://www.khanacademy.org/math/calculus-1/cs1-integrals" },
      { label: "Integral Calculator (Practice Tool)", url: "https://www.integral-calculator.com/" },
      { label: "Paul's Online Math Notes – Integration", url: "https://tutorial.math.lamar.edu/Classes/CalcI/IntegralsIntro.aspx" },
    ],
    tips: "Think of integration as finding the area under a curve. The antiderivative of xⁿ is xⁿ⁺¹/(n+1). Always add the +C constant for indefinite integrals.",
  },
  "differential-equations": {
    title: "Differential Equations",
    videos: [
      { label: "Differential Equations Full Course (Professor Leonard)", url: "https://www.youtube.com/watch?v=xf-3ATzFyKA" },
      { label: "First Order ODEs Explained (YouTube)", url: "https://www.youtube.com/watch?v=6o7b9yyhH7k" },
      { label: "Laplace Transforms – Full Lecture (YouTube)", url: "https://www.youtube.com/watch?v=ofvkZXgbIxE" },
    ],
    websites: [
      { label: "Paul's Online Math Notes – ODEs (Best Free Resource)", url: "https://tutorial.math.lamar.edu/Classes/DE/DE.aspx" },
      { label: "Khan Academy – Differential Equations", url: "https://www.khanacademy.org/math/differential-equations" },
      { label: "MIT OpenCourseWare – 18.03 ODEs (Free)", url: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/" },
    ],
    tips: "Paul's Online Notes is the single best free resource for ODEs. Read it like a textbook — it's clearer than most textbooks. Start with separable equations.",
  },
  // ── Mechanics ───────────────────────────────────────────────────
  "fbd": {
    title: "Free Body Diagrams (FBD)",
    videos: [
      { label: "Free Body Diagrams – Engineering Explained (YouTube)", url: "https://www.youtube.com/watch?v=p7OBMlMq-dc" },
      { label: "FBD Complete Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=KRSmBnbufMM" },
      { label: "Statics – Full Course (Professor Leonard)", url: "https://www.youtube.com/watch?v=LcGMJOamWqg" },
    ],
    websites: [
      { label: "Khan Academy – Forces & Newton's Laws", url: "https://www.khanacademy.org/science/physics/forces-newtons-laws" },
      { label: "Engineering Statics – Free Textbook (OpenStax)", url: "https://openstax.org/books/university-physics-volume-1/pages/5-introduction" },
    ],
    tips: "FBD checklist: 1) Isolate the object 2) Draw all forces as arrows FROM the object 3) Label every force with magnitude and direction 4) Set up ΣFx=0 and ΣFy=0.",
  },
  "statics": {
    title: "Engineering Statics",
    videos: [
      { label: "Statics Full Course – Professor Leonard (YouTube)", url: "https://www.youtube.com/watch?v=LcGMJOamWqg" },
      { label: "Equilibrium of Rigid Bodies (YouTube)", url: "https://www.youtube.com/watch?v=Bba-0bDpQUc" },
      { label: "Truss Analysis – Method of Joints (YouTube)", url: "https://www.youtube.com/watch?v=6o7b9yyhH7k" },
    ],
    websites: [
      { label: "Engineering Mechanics Statics – OpenStax (Free PDF)", url: "https://openstax.org/books/university-physics-volume-1/pages/12-introduction" },
      { label: "SkyCiv – Free Statics Problems", url: "https://skyciv.com/docs/tutorials/beam-tutorials/" },
    ],
    tips: "For every statics problem: 1) Draw FBD 2) Write ΣFx=0, ΣFy=0, ΣM=0 3) Solve the system of equations. Never skip the FBD step.",
  },
  "dynamics": {
    title: "Engineering Dynamics",
    videos: [
      { label: "Dynamics Full Course (YouTube – Michel van Biezen)", url: "https://www.youtube.com/watch?v=4X4NRZ-ck08" },
      { label: "Work Energy Theorem Explained (YouTube)", url: "https://www.youtube.com/watch?v=2Ro-8MVGlsY" },
      { label: "Momentum and Impulse (Khan Academy)", url: "https://www.youtube.com/watch?v=nMUPKFGKnmA" },
    ],
    websites: [
      { label: "Khan Academy – Work & Energy", url: "https://www.khanacademy.org/science/physics/work-energy-and-power" },
      { label: "Khan Academy – Momentum", url: "https://www.khanacademy.org/science/physics/linear-momentum" },
      { label: "Physics Classroom – Dynamics", url: "https://www.physicsclassroom.com/class/newtlaws" },
    ],
    tips: "Work-Energy Theorem: Work done by all forces = Change in kinetic energy. W = ΔKE = ½mv² - ½mv₀². Use this when you know forces and distances, not time.",
  },
  "engineering-drawing": {
    title: "Engineering Drawing",
    videos: [
      { label: "Engineering Drawing Full Course (YouTube)", url: "https://www.youtube.com/watch?v=NsUbDRkMQ4s" },
      { label: "Orthographic Projection Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=Xz4A6yLJAjg" },
      { label: "Isometric Drawing Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=Hq4yYeZODpU" },
      { label: "FreeCAD Beginner Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=sxnij3CkkdU" },
    ],
    websites: [
      { label: "FreeCAD Download (Free)", url: "https://www.freecad.org/downloads.php" },
      { label: "Engineering Drawing Basics – MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/" },
      { label: "GD&T Basics Guide", url: "https://www.gdandtbasics.com/" },
    ],
    tips: "The three views to master first: Front, Top, Right Side. Always draw the front view first, then project the others. Use light construction lines before dark final lines.",
  },
  "vibrations": {
    title: "Mechanical Vibrations",
    videos: [
      { label: "Mechanical Vibrations – Full Lecture Series (YouTube)", url: "https://www.youtube.com/watch?v=9CqL7OBs5OA" },
      { label: "Free Undamped Vibration Explained (YouTube)", url: "https://www.youtube.com/watch?v=MCjBBDIITGk" },
      { label: "Damped Vibrations Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=IJ_rTk9Q2lw" },
    ],
    websites: [
      { label: "MIT OCW – Mechanical Vibrations (Free)", url: "https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/" },
      { label: "Vibration Calculator Tool", url: "https://www.vibrationresearch.com/university/lesson/free-vibration/" },
    ],
    tips: "The spring-mass equation is mẍ + kx = 0. Natural frequency ωₙ = √(k/m). This equation appears everywhere in mechanical engineering — understand it deeply.",
  },
  // ── English ─────────────────────────────────────────────────────
  "english-vocabulary": {
    title: "Technical English Vocabulary",
    videos: [
      { label: "Engineering English – Technical Vocabulary (YouTube)", url: "https://www.youtube.com/watch?v=cXy3BGRqhLk" },
      { label: "Academic Word List Practice (YouTube)", url: "https://www.youtube.com/watch?v=0KWCe_bNDgc" },
    ],
    websites: [
      { label: "Anki – Free Flashcard App", url: "https://apps.ankiweb.net/" },
      { label: "Quizlet – Engineering Vocabulary Sets", url: "https://quizlet.com/subject/engineering-vocabulary/" },
      { label: "Merriam-Webster – Technical Dictionary", url: "https://www.merriam-webster.com/" },
    ],
    tips: "Use Anki flashcard app to memorize your 5 daily words. Create a card for each: front = word, back = definition + example sentence. Review every morning.",
  },
  "prompt-engineering-advanced": {
    title: "Advanced Prompt Engineering",
    videos: [
      { label: "Advanced Prompt Engineering – Full Course (YouTube)", url: "https://www.youtube.com/watch?v=dOxUroR57xs" },
      { label: "Chain of Thought Prompting Explained (YouTube)", url: "https://www.youtube.com/watch?v=LE05AVSMG4s" },
    ],
    websites: [
      { label: "Anthropic – Advanced Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { label: "PromptingGuide.ai – Free Course", url: "https://www.promptingguide.ai/" },
      { label: "Learn Prompting – Advanced Techniques", url: "https://learnprompting.org/docs/intermediate/chain_of_thought" },
    ],
    tips: "The most powerful technique: Chain-of-Thought (CoT). Add 'Think step by step' to any reasoning task and the output quality improves dramatically.",
  },
  "scholarship-writing": {
    title: "Scholarship & Technical Writing",
    videos: [
      { label: "How to Write a Scholarship Essay (YouTube)", url: "https://www.youtube.com/watch?v=7QRzHpSP6Mk" },
      { label: "Statement of Purpose Writing Tips (YouTube)", url: "https://www.youtube.com/watch?v=fM9M3LtEH14" },
    ],
    websites: [
      { label: "Grammarly – Free Writing Assistant", url: "https://www.grammarly.com/" },
      { label: "Hemingway App – Clarity Checker", url: "https://hemingwayapp.com/" },
      { label: "Purdue OWL – Academic Writing Guide", url: "https://owl.purdue.edu/owl/general_writing/academic_writing/index.html" },
    ],
    tips: "Scholarship essay structure: Hook (1 sentence) → Your story → Why this field → Your goals → Why this scholarship. Keep sentences short and active voice.",
  },
};

// ── Task → Resource mapping ──────────────────────────────────────
function getResourceKey(task) {
  const t = task.toLowerCase();
  if (t.includes("llm") || t.includes("how llm") || t.includes("gpt")) return "how-llms-work";
  if (t.includes("install") && (t.includes("python") || t.includes("vs code"))) return "python-install";
  if (t.includes("zero-shot") || t.includes("few-shot") || t.includes("chain-of-thought") || (t.includes("prompt") && t.includes("technique"))) return "prompt-engineering-basics";
  if (t.includes("n8n") && (t.includes("first") || t.includes("basics") || t.includes("dashboard") || t.includes("workflow") && t.includes("create"))) return "n8n-basics";
  if ((t.includes("python") && (t.includes("variable") || t.includes("list") || t.includes("loop") || t.includes("basic") || t.includes("function") || t.includes("dict")))) return "python-basics";
  if (t.includes("make.com") && (t.includes("account") || t.includes("first") || t.includes("module") || t.includes("scenario") && t.includes("build"))) return "make-com-basics";
  if (t.includes("pandas")) return "pandas-basics";
  if (t.includes("claude code")) return "claude-code";
  if (t.includes("oop") || t.includes("class") || t.includes("__init__") || t.includes("inheritance")) return "python-oop";
  if (t.includes("fastapi")) return "fastapi";
  if (t.includes("streamlit")) return "streamlit";
  if (t.includes("scraping") || t.includes("beautifulsoup") || t.includes("scrape")) return "web-scraping";
  if (t.includes("upwork") || t.includes("fiverr") || t.includes("freelance") && t.includes("account")) return "upwork-fiverr";
  if (t.includes("rag") || t.includes("retrieval")) return "rag";
  if (t.includes("limit") && (t.includes("calculus") || t.includes("evaluate") || t.includes("khan"))) return "limits";
  if (t.includes("derivative") || t.includes("chain rule") || t.includes("power rule") || t.includes("differentiat")) return "derivatives";
  if (t.includes("integral") || t.includes("integration") || t.includes("antiderivative") || t.includes("∫")) return "integrals";
  if (t.includes("differential equation") || t.includes("ode") || t.includes("laplace") || t.includes("separable")) return "differential-equations";
  if (t.includes("fbd") || t.includes("free body") || t.includes("equilibrium") && t.includes("draw")) return "fbd";
  if (t.includes("statics") || t.includes("equilibrium") || t.includes("truss") || t.includes("moment") && t.includes("force")) return "statics";
  if (t.includes("dynamics") || t.includes("work-energy") || t.includes("momentum") || t.includes("kinematics") || t.includes("newton")) return "dynamics";
  if (t.includes("drawing") || t.includes("orthographic") || t.includes("isometric") || t.includes("freecad") || t.includes("section view") || t.includes("gd&t")) return "engineering-drawing";
  if (t.includes("vibration") || t.includes("damped") || t.includes("spring-mass") || t.includes("undamped")) return "vibrations";
  if (t.includes("word") || t.includes("vocabulary") || t.includes("learn 5")) return "english-vocabulary";
  if (t.includes("prompt") && (t.includes("advanced") || t.includes("chain") || t.includes("engineer") || t.includes("librar"))) return "prompt-engineering-advanced";
  if (t.includes("scholarship") || t.includes("cover letter") || t.includes("statement of purpose") || t.includes("essay")) return "scholarship-writing";
  return null;
}

// ─── Full 60-Day Data (condensed but complete) ───────────────────
const PHASES = [
  { id:1, weeks:"Weeks 1–2", label:"Foundation", days:[1,14], color:"#3B82F6", light:"#EFF6FF" },
  { id:2, weeks:"Weeks 3–4", label:"Skill Building", days:[15,28], color:"#8B5CF6", light:"#F5F3FF" },
  { id:3, weeks:"Weeks 5–6", label:"Projects", days:[29,42], color:"#10B981", light:"#ECFDF5" },
  { id:4, weeks:"Weeks 7–8", label:"Mastery", days:[43,60], color:"#F59E0B", light:"#FFFBEB" },
];

const DAYS_DATA = [
  {day:1,week:1,phase:1,title:"LLM Basics & First Workflow",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Read: How LLMs work (Andrej Karpathy intro notes)","Install: Python 3.11, VS Code, set up virtual environment","Exercise: Write 5 prompts using Role-Context-Task-Format","Practice: Open n8n cloud account; explore the dashboard","Journal: Write what you learned today (3 sentences)"]},mech:{label:"Mechanics",hours:3,tasks:["Read: Calculus basics — what is a limit? (Khan Academy)","Exercise: Evaluate 10 limit problems (x→0, x→∞)","Draw: Sketch your desk as a simple orthographic front view","Read: Engineering Drawing basics — line types and conventions"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: algorithm, iteration, derivative, vector, magnitude","Read 1 short engineering article (Engineering.com or IEEE Spectrum)","Write 3 sentences using today's vocabulary"]}}},
  {day:2,week:1,phase:1,title:"Prompt Techniques & Derivatives",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Study: zero-shot vs few-shot vs chain-of-thought prompting","Exercise: Write 10 prompts (2 per technique) in a notebook","Code: Python basics — variables, data types, print statements (1h)","n8n: Create first workflow: Manual Trigger → Set Node → Email","Debug: Intentionally break your n8n workflow; fix it"]},mech:{label:"Mechanics",hours:3,tasks:["Derivatives: Power rule — derive x³, x⁵, 3x²+2x+1 (10 problems)","Read: Scalar vs Vector quantities; unit vectors î, ĵ, k̂","Exercise: Resolve 5 force vectors into x and y components","Draw: Draw 3 basic objects (cube, cylinder, L-bracket) in front view"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: stress, strain, torque, equilibrium, constraint","Grammar: Review subject-verb agreement (15 min)","Prompt: Ask Claude to explain derivatives like you're 16"]}}},
  {day:3,week:1,phase:1,title:"Python Lists & FBD Basics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Lists, loops, functions — write a simple calculator function","Study: n8n nodes — HTTP Request, IF condition, Switch","Build: n8n workflow — fetch weather API → format → log to Google Sheet","Exercise: Write 5 system prompts for different AI assistant personas","Read: What is RAG? (15 min overview)"]},mech:{label:"Mechanics",hours:3,tasks:["Derivatives: Chain rule, product rule — 10 problems each","Read: Newton's 3 Laws; draw FBD of a block on a flat surface","Exercise: Draw FBD for 3 scenarios (inclined plane, hanging mass, pulley)","Practice: Find the resultant of two 2D force vectors"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: resultant, friction, normal force, coefficient, trajectory","Read: 1 Wikipedia article on Newton's Laws; write 5-line summary","Prompt: Rewrite yesterday's prompt to get a better, cleaner answer"]}}},
  {day:4,week:1,phase:1,title:"Webhooks & Integration Basics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Dictionaries, file I/O — read/write .txt and .json files","n8n: Study webhook nodes — create a webhook that receives POST data","Build: Webhook → parse JSON → send formatted Telegram/email notification","Study: Make.com — create free account, explore modules and triggers","Exercise: Compare n8n vs Make.com — write a 10-line comparison"]},mech:{label:"Mechanics",hours:3,tasks:["Integration: Understand as reverse of differentiation; antiderivative rules","Exercise: Evaluate 10 basic integrals (∫x², ∫sin x, ∫eˣ)","Engineering Drawing: Front, Top, Side views — draw a simple bracket","Read: Coplanar forces, concurrent forces — definitions and examples"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: automation, workflow, node, trigger, integration","Write: 1 paragraph (150 words) about why you are studying AI automation","Prompt: Write a prompt to summarize a technical paper in bullet points"]}}},
  {day:5,week:1,phase:1,title:"Claude API & Statics Intro",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: pip packages — install requests, pandas; read a CSV file","Study: Claude API basics — token, model parameters, temperature","Exercise: Write 3 API-style system+user prompt pairs","Make.com: Build first scenario — Gmail new email → create Google Doc","n8n: Add error handling to yesterday's webhook workflow"]},mech:{label:"Mechanics",hours:3,tasks:["Statics: Equilibrium conditions (ΣFx=0, ΣFy=0, ΣM=0)","Exercise: Solve 5 static equilibrium problems (beams, pin joints)","Engineering Drawing: Dimension lines, title blocks, scale notation","Practice: FBD of a beam with 3 forces — find reactions"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: concurrent, coplanar, equilibrium, reaction, support","Read: Engineering article from MIT News or IEEE","Speaking: Record yourself explaining Newton's 1st Law in 60 seconds"]}}},
  {day:6,week:1,phase:1,title:"pandas & Moments",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: pandas basics — create DataFrame, filter rows, compute stats","Study: Prompt patterns — persona, template, meta-prompt, output primer","Build: Make.com — RSS feed → filter keywords → send digest email","Exercise: Use Claude to debug a 20-line Python script with 3 planted bugs","Start Notion/GitHub portfolio page — add today's projects"]},mech:{label:"Mechanics",hours:3,tasks:["Calculus: Definite integrals — area under curve, 8 problems","Statics: Moment of a force — calculate moments about a point (5 problems)","Engineering Drawing: Isometric view basics — draw a cube isometrically","Review: Redo any FBD problems you found difficult this week"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: moment, torque, couple, pivot, fulcrum","Writing: Draft a short cover-letter intro (3 sentences) for a freelance gig","Review Week 1 vocabulary — quiz yourself on all 30 words"]}}},
  {day:7,week:1,phase:1,title:"Week 1 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Re-open all 5 workflows built this week; explain each step","List 3 things that confused you; ask Claude for clarity","Python: Write a mini-script that reads a CSV and prints column averages","Update your Notion portfolio with Week 1 projects"]},mech:{label:"Mech Review",hours:3,tasks:["Re-solve 3 FBD problems from scratch without notes","Re-draw the bracket (Day 4) from memory","Calculus: Speed-run 10 derivative + 5 integral problems (timed)","Identify 2 topics to revisit in Week 2"]},eng:{label:"Eng Review",hours:1,tasks:["Quiz: Write definitions for all 30 words learned (from memory)","Read an article and highlight 5 new words; look them up","Prompt Challenge: Write a single prompt that produces a perfect FBD explanation"]}}},
  {day:8,week:2,phase:1,title:"AI Agents & Trusses",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Functions, *args, **kwargs; write reusable helper functions","n8n: Study Schedule Trigger, Cron jobs — automate daily data fetch","Build: Daily stock price fetcher → store in Google Sheet (n8n)","Study: What is an AI Agent? ReAct pattern, tool use, memory","Read: n8n documentation for Code Node (JS/Python execution)"]},mech:{label:"Mechanics",hours:3,tasks:["Calculus: Implicit differentiation — 8 problems","Statics: Truss analysis — method of joints; solve a 5-member truss","Engineering Drawing: Orthographic projections — 3-view drawing of L-bracket","Physics: Review unit conversions (N, kN, Pa, kPa, m, mm)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: truss, joint, member, compression, tension","Read: Article on structural engineering (skim + 3-sentence summary)","Prompt: Write a prompt to generate 10 truss analysis problems"]}}},
  {day:9,week:2,phase:1,title:"Error Handling & Friction",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Error handling — try/except, logging, assert statements","Make.com: Study HTTP module, JSON parse, data store","Build: Make.com — form submission (Typeform) → format → add to Airtable","Claude: Practice 'few-shot' prompting with examples for structured output","Exercise: Build a prompt that outputs JSON from unstructured text"]},mech:{label:"Mechanics",hours:3,tasks:["Integration: Applications — displacement from velocity, work from force","Problem set: 5 problems (area, displacement, work using ∫)","Engineering Drawing: Hidden lines, centre lines — redraw bracket","Statics: Friction problems — block on incline, 4 problems"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: displacement, velocity, acceleration, integral, convergence","Grammar: Passive voice in technical writing","Write: 1 paragraph explaining what you built today in simple English"]}}},
  {day:10,week:2,phase:1,title:"Regex & Centroids",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: String manipulation, regex basics — parse email addresses from text","n8n: Build a two-way sync: Airtable ↔ Google Sheets using webhooks","Study: Prompt security — prompt injection, jailbreak awareness","Exercise: Red-team 3 of your own prompts; find weaknesses","Build: Simple CLI chatbot in Python using Anthropic API"]},mech:{label:"Mechanics",hours:3,tasks:["Derivatives: Related rates — 6 problems (ladder, shadow, balloon)","Statics: Centroid of simple shapes (rectangle, triangle, semicircle)","Engineering Drawing: Dimensioning practice — dimension a stepped shaft","FBD: Solve a 3D force problem (basic); identify x, y, z components"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: centroid, shear, bending, deflection, stiffness","Prompt Engineering: Study chain-of-thought prompting; write 2 examples","Speaking: Record 90-sec explanation of what a centroid is"]}}},
  {day:11,week:2,phase:1,title:"APIs & Kinematics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: List comprehensions, lambda functions, map/filter","Make.com: Iterator module, aggregator — process a list of items in a loop","Study: What is an API? REST vs GraphQL; HTTP verbs (GET/POST/PUT/DELETE)","Build: Python script that calls a free public API and processes the response","Exercise: Document your script with docstrings and comments"]},mech:{label:"Mechanics",hours:3,tasks:["Integration: Volumes of revolution (washer/disk method) — 4 problems","Dynamics intro: Kinematics — position, velocity, acceleration equations","Problem set: 5 kinematic problems (SUVAT equations, free fall)","Engineering Drawing: Section views — full section of a hollow cylinder"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: kinematics, dynamics, inertia, momentum, impulse","Read: 'How Bridges Are Designed' — any engineering blog article","Prompt: Write a 'teacher persona' prompt; ask it to explain kinematics"]}}},
  {day:12,week:2,phase:1,title:"OOP & Expense Tracker",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: OOP basics — create a class with __init__, methods, properties","n8n: Study database nodes — SQLite, MongoDB basics in n8n","Build: Expense tracker — Google Form → n8n → log to SQLite + weekly email","Upwork/Fiverr: Create accounts; browse AI automation gigs — note 5 top services","Portfolio: Write a project README for your expense tracker on GitHub"]},mech:{label:"Mechanics",hours:3,tasks:["Calculus: Optimization problems — maximize/minimize area, cost (5 problems)","Statics: Pin-jointed frames — method of sections (3 problems)","Engineering Drawing: Half-section and offset section views","Review: Re-do 5 problems you found hardest in Weeks 1–2"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: optimization, constraint, section, projection, scale","Write: 3-sentence bio for your Upwork/Fiverr freelancer profile","Prompt: Write a prompt that generates a professional project description"]}}},
  {day:13,week:2,phase:1,title:"Meeting Summarizer & Dynamics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: File handling — read/write JSON, CSV, .env secrets","Make.com: Webhooks + custom app — build a Slack-to-task integration","Build: 'Meeting summarizer' — paste notes → Claude → structured action items","Study: What is a vector database? (Pinecone, Qdrant) — 30 min overview","GitHub: Push all Week 2 code; write a brief commit message for each"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Newton's 2nd Law problems — F=ma, 8 problems","Engineering Drawing: Isometric section view — pipe with flange","Statics: Distributed loads on beams (uniform, triangular) — 4 problems","Problem: A 500N block on 30° incline — full FBD + equilibrium check"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: distributed load, reaction, pin support, roller support, fixed support","Reading: Scan a research paper abstract; identify: problem, method, result","Prompt: Write a prompt that extracts key info from a paper abstract"]}}},
  {day:14,week:2,phase:1,title:"Week 2 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Demo all 3 major workflows to yourself; identify any that break","Python: Write a script from scratch without notes (any small utility)","Reflect: What automation idea could solve a real problem for a local business?","Write: Week 2 progress update (5 sentences) for your portfolio"]},mech:{label:"Mech Review",hours:3,tasks:["Timed test: 10 calculus problems (5 derivatives, 5 integrals) — 45 min","Timed test: 5 FBD/statics problems — 45 min","Review Engineering Drawing: redraw Day 11 section view from memory","List topics for Week 3 focus"]},eng:{label:"Eng Review",hours:1,tasks:["Write: 1-paragraph summary of your 2 weeks of learning","Quiz: All 70 vocabulary words so far","Prompt: Write a 'chain-of-thought' prompt for an engineering problem"]}}},
  {day:15,week:3,phase:2,title:"Claude Code & Work-Energy",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Claude Code: Install Claude Code CLI; run first slash command","Study: How Claude Code works — context window, file editing, bash","Exercise: Use Claude Code to refactor a Python script (3 improvements)","n8n: Sub-workflows — split a large workflow into reusable child workflows","Build: n8n workflow — scrape webpage → extract text → summarize with Claude"]},mech:{label:"Mechanics",hours:3,tasks:["Calculus: Taylor series and approximations (intro) — 3 examples","Dynamics: Work done by constant force; Work-Energy theorem derivation","Problem set: 5 Work-Energy problems (block pushed up ramp, spring)","Engineering Drawing: Assembly drawing basics — 2-part assembly with fastener"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: refactor, abstraction, modular, scalable, reusable","Read: 'How Claude Code Works' blog or documentation (skim)","Prompt: Design a prompt template for code review with specific criteria"]}}},
  {day:16,week:3,phase:2,title:"OOP Advanced & Conservation",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: OOP advanced — inheritance, class methods, __str__, __repr__","Claude Code: Use it to write unit tests for a Python class","Make.com: Error handling — error routes, retry, filters, conditions","Build: Make.com — Smart contact form: classify intent → route to mailbox","Study: Prompt chaining — pass output of Prompt A as input to Prompt B"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Kinetic & Potential energy; conservation of energy (5 problems)","Engineering Drawing: Exploded view basics; label parts with balloons","Statics: 3D equilibrium — forces in x, y, z (2 problems)","Calculus: Integration by substitution — 8 problems"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: conservation, potential, kinetic, elastic, inelastic","Writing: Write a 200-word technical explanation of Work-Energy theorem","Prompt: Build a 3-step chain prompt to explain a concept at 3 difficulty levels"]}}},
  {day:17,week:3,phase:2,title:"HTTP Requests & Momentum",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: HTTP requests with 'requests' library — GET, POST, auth headers","n8n: OAuth2 authentication — connect n8n to Google Drive API","Build: Google Drive + n8n — when new file uploaded → extract name → log to Sheet","Claude Code: Open a project folder; ask Claude Code to explain the codebase","Exercise: Write a prompt that generates 10 n8n workflow ideas for freelance"]},mech:{label:"Mechanics",hours:3,tasks:["Momentum: Linear momentum, impulse-momentum theorem (5 problems)","Calculus: Integration by parts — 6 problems","Engineering Drawing: Detailed part drawing — draw a flanged pipe","FBD: Ladder against a wall — full analysis including friction"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: momentum, impulse, elastic collision, inelastic, coefficient of restitution","Read: Engineering article; annotate 3 key points in your notebook","Speaking: Record 2-min explanation of what AI automation is"]}}},
  {day:18,week:3,phase:2,title:"Telegram AI Agent & Collisions",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Decorators and context managers — write a timing decorator","Make.com: LinkedIn post drafter (input topic → Claude → formatted post)","Study: n8n AI nodes — LangChain Agent, OpenAI Chat, memory buffer","Build: n8n AI agent — user sends Telegram message → agent responds using Claude","Portfolio: Document this agent project with screenshots in Notion"]},mech:{label:"Mechanics",hours:3,tasks:["Collisions: Elastic and inelastic; coefficient of restitution (4 problems)","Calculus: Partial derivatives (intro) — f(x,y) — 5 problems","Engineering Drawing: Sectional view of a stepped shaft with keyway","Statics: Shear force and bending moment diagram for simply supported beam"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: bending moment, shear force, simply supported, cantilever, deflection","Prompt: Write a 'structured output' prompt — force JSON with specific keys","Write: 1 email to a potential freelance client describing your automation service"]}}},
  {day:19,week:3,phase:2,title:"Async Python & Batch Workflows",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Async programming basics — asyncio, aiohttp for parallel API calls","Claude Code: Build a small CLI tool — 'prompt_helper.py' that formats prompts","n8n: Merge node, batch processing — handle 100 rows from CSV in one workflow","Study: Zapier vs n8n vs Make.com — when to use each; pricing models","Build: Batch email personalizer — CSV of names → Claude → send personalized emails"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Circular motion — centripetal acceleration, angular velocity (4 problems)","Integration: Areas between curves — 5 problems","Engineering Drawing: Isometric drawing of a machine part (gear housing)","FBD problem set: 5 mixed problems (beams, pulleys, inclines) — timed 50 min"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: angular velocity, centripetal, radial, tangential, rotational","Read: Wikipedia article on 'Mechanical Engineering' — summarize in 5 bullets","Prompt: Write a meta-prompt that generates other prompts for a given task"]}}},
  {day:20,week:3,phase:2,title:"RAG & Rotational Kinematics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Environment variables, .env files, python-dotenv","Make.com: Build a 'content repurposing' pipeline — blog post → tweet thread + LinkedIn","Study: Retrieval-Augmented Generation (RAG) — architecture, use cases","Build: Simple RAG demo — load a PDF → chunk → search → answer questions","GitHub: Organize your repositories; add README and badges"]},mech:{label:"Mechanics",hours:3,tasks:["Rotation: Rotational kinematics — α, ω, θ equations","Calculus: Differential equations intro — order, degree, solving dy/dx = f(x)","Problem: Solve 5 first-order separable ODEs","Engineering Drawing: Perspective drawing basics; 1-point perspective"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: differential equation, separable, homogeneous, particular solution, boundary condition","Writing: Write a 150-word 'About Me' for a freelance profile","Prompt: Build a system prompt for a 'Mechanical Engineering Tutor' AI assistant"]}}},
  {day:21,week:3,phase:2,title:"Week 3 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Open your Telegram AI agent (Day 18); add one new feature","Python challenge: Build a to-do list CLI app with file persistence","List 3 workflows you could sell on Fiverr right now; write descriptions","Review Claude Code outputs from this week; note best prompts"]},mech:{label:"Mech Review",hours:3,tasks:["Timed test: 5 Work-Energy-Momentum problems — 45 min","Re-draw the stepped shaft (Day 18) from memory with full dimensions","Re-solve 3 calculus problems (integration by parts) without notes","List weak areas; add to study queue"]},eng:{label:"Eng Review",hours:1,tasks:["Write a full paragraph about your biggest Week 3 achievement","Vocabulary quiz: all 105 words","Prompt: Share your best 3 prompts in a Notion 'Prompt Library'"]}}},
  {day:22,week:4,phase:2,title:"Web Scraping & ODEs",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Web scraping with BeautifulSoup — scrape job titles from a public site","n8n: HTML extract node — parse scraped data; clean with Code Node","Study: Vector embeddings, cosine similarity — how semantic search works","Build: Job listing monitor — scrape site daily → filter keywords → alert via Telegram","Claude Code: Use to add features to your job monitor script"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations: First-order linear ODEs — integrating factor method","Problem set: 5 linear ODE problems","Engineering Drawing: Working drawing set — 3 views + dimensions + title block","Dynamics: Energy methods — virtual work principle (intro)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: scrape, parse, filter, embed, semantic","Reading: Skim a research paper intro on robotics or AI; note 3 key claims","Prompt: Write a prompt for structured literature review extraction"]}}},
  {day:23,week:4,phase:2,title:"pandas Advanced & Reports",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: pandas advanced — groupby, pivot table, merge dataframes","Make.com: Data transformation — JSON → CSV → formatted report","Build: Monthly expense report generator — Google Sheet → Claude analysis → PDF","Study: AI prompt compression — max info into minimum tokens","Exercise: Take a 200-word prompt; compress to 80 words; compare outputs"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations: Second-order ODEs — homogeneous (char. equation)","Problem set: 4 second-order ODE problems (spring-mass system)","Statics: Stress and strain basics — normal stress σ = F/A (4 problems)","Engineering Drawing: Tolerance notation on a shaft-hole fit drawing"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: tolerance, stress, strain, deformation, elasticity","Write: Compare two engineering tools (n8n vs Make.com) in 200 words","Prompt: Build a 'prompt optimizer' — input a bad prompt, get improved version"]}}},
  {day:24,week:4,phase:2,title:"Data Visualization & Notion API",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: matplotlib + seaborn — create 3 charts from a dataset","n8n: Integrate with Notion API — create pages, update databases","Build: Daily study logger — Google Form → n8n → update Notion dashboard","Claude Code: Build a Python data visualization script for your study hours","Portfolio: Add data visualization project to Notion portfolio"]},mech:{label:"Mechanics",hours:3,tasks:["Statics: Bending stress σ = Mc/I — 4 problems with I-section beams","Calculus: Taylor expansion of sin(x), cos(x), eˣ — error estimation","Engineering Drawing: Bill of Materials (BOM) — add to an assembly drawing","FBD: Truss with 7 members — full method of joints solution"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: bending stress, neutral axis, moment of inertia, section modulus, beam","Speaking: Record 2-min video explaining your study logger project","Prompt: Write a prompt template for generating weekly progress reports"]}}},
  {day:25,week:4,phase:2,title:"FastAPI & Rotational Dynamics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: FastAPI intro — create a simple REST API endpoint (GET + POST)","n8n: Connect n8n to your FastAPI endpoint; trigger from webhook","Make.com: Error notification system — if any scenario fails → send alert email","Build: Personal API — endpoint that returns your latest GitHub projects","Study: What is a chatbot? Intent, entities, slots — basic NLU concepts"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations: Non-homogeneous ODEs — undetermined coefficients","Problem set: 4 non-homogeneous ODE problems","Dynamics: Principle of work and energy for rotation (I·α)","Engineering Drawing: CAD intro — install FreeCAD (free); draw a 3D cube"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: endpoint, payload, request, response, API","Read: Medium article on 'Building APIs with FastAPI' — skim headings","Prompt: Write a prompt that generates a FastAPI route from plain English"]}}},
  {day:26,week:4,phase:2,title:"Pydantic & Laplace Transforms",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Pydantic for data validation; use in your FastAPI app","Claude Code: Open your FastAPI project; ask Claude Code to add input validation","n8n: Database node — store webhook data in a PostgreSQL/Supabase table","Build: Contact form backend — HTML form → webhook → validate → store → auto-reply","Fiverr: Draft your first gig: 'I will build a custom n8n automation workflow'"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Angular momentum, conservation (3 problems)","Calculus: Laplace transform intro — definition, L{1}, L{t}, L{eᵃᵗ}","Problem: Solve 3 ODEs using Laplace transforms","Engineering Drawing: FreeCAD — extrude a 2D sketch into a 3D part"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: Laplace transform, s-domain, eigenvalue, characteristic, resonance","Writing: Rewrite your Fiverr gig description for maximum clarity and appeal","Prompt: Write a prompt that turns a bullet list into a compelling service description"]}}},
  {day:27,week:4,phase:2,title:"Client Onboarding & Combined Loading",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: subprocess module — run shell commands from Python","n8n: SSH node + Execute Command — run a script on a remote server","Make.com: Complete client onboarding (form → welcome email → Notion → Slack alert)","Study: Anthropic's prompt engineering guide — advanced techniques","Exercise: Write 5 'constrained output' prompts (specific word count, format, tone)"]},mech:{label:"Mechanics",hours:3,tasks:["Statics: Combined loading — beam with axial + bending + shear (1 full problem)","Differential equations: Systems of ODEs — introduction","Engineering Drawing: FreeCAD — create and dimension an L-bracket 3D model","Problem set: Mixed bag — 5 problems covering FBD + calculus + energy"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: combined loading, axial, transverse, lateral, longitudinal","Scholarship prep: Read a sample scholarship essay; identify its structure","Prompt: Write a 'scholarship application' persona prompt for Claude"]}}},
  {day:28,week:4,phase:2,title:"Week 4 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Test all 4 major builds from Week 4; fix any broken parts","Python: Timed challenge — build a working script in 30 min from scratch","Review Fiverr/Upwork gig descriptions; refine based on competitor research","Update portfolio with Week 3–4 projects; ensure GitHub is clean"]},mech:{label:"Mech Review",hours:3,tasks:["Timed test: 10 mixed problems (calculus + statics + dynamics) — 60 min","FreeCAD: Redraw Day 27 L-bracket from memory","Differential equations: Solve 4 ODEs (mixed types) without notes","Identify 3 topics to deepen in Weeks 5–6"]},eng:{label:"Eng Review",hours:1,tasks:["Vocabulary test: all 140 words","Write: 2-paragraph project summary for your portfolio","Speaking: Record 3-min walk-through of your best automation project"]}}},
  {day:29,week:5,phase:3,title:"Smart Email Assistant",blocks:{ai:{label:"AI Automation",hours:5,tasks:["PROJECT: 'Smart Email Assistant' — Plan architecture","Build: Email inbox reader (Gmail API via n8n) → classify as: urgent/info/spam","Python: Write helper functions for email text cleaning","Claude: Design system prompt for email classification with few-shot examples","Portfolio: Create project page in Notion for Email Assistant"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Mechanical vibrations intro — free undamped vibration","ODE: Spring-mass equation mẍ + kx = 0; solve for x(t)","Engineering Drawing: Full drawing — shaft + bearing assembly (3 views + section)","Calculus: Fourier series intro — represent square wave as sum of sinusoids"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: vibration, damping, amplitude, frequency, resonance","Read: Engineering article on mechanical vibrations","Prompt: Design a prompt template for explaining physics problems step-by-step"]}}},
  {day:30,week:5,phase:3,title:"Email Assistant Testing",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Build: Add urgency scoring (1–5) using Claude; route urgent → Slack alert","n8n: Store all emails + classifications in Airtable with timestamps","Test: Send 20 test emails; check classification accuracy","Python: Write a script to evaluate classification results (accuracy %)","Debug: Find and fix at least 2 workflow errors"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Damped vibrations — overdamped, underdamped, critically damped","Problem: Given k=500 N/m, m=2 kg, c=40 Ns/m — classify and solve","Engineering Drawing: Tolerance stack-up exercise — 3-part assembly","Calculus: Numerical integration — trapezoidal rule, Simpson's rule (3 problems)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: overdamped, underdamped, critical, natural frequency, period","Writing: Write a 250-word project description for the Email Assistant","Prompt: Build a prompt that generates test cases for an automation workflow"]}}},
  {day:31,week:5,phase:3,title:"Data Pipeline Automation",blocks:{ai:{label:"AI Automation",hours:5,tasks:["PROJECT 2: 'Data Pipeline Automation'","Build: n8n workflow — download CSV from URL → parse → calculate stats","Python: pandas — compute mean, median, std dev, trend for each column","Claude: Prompt that generates an executive summary from statistics","Portfolio: Add project plan to Notion"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Forced vibrations — steady-state response, magnification factor","Problem set: 3 forced vibration problems (varying excitation frequency)","Engineering Drawing: FreeCAD — fully constrained sketch with dimensions","Statics: Review all beam types; sketch SFD and BMD for 3 beam configurations"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: forced vibration, magnification, excitation, steady-state, transient","Summarize: Write an abstract (150 words) for your Data Pipeline project","Prompt: Format raw data stats into a readable executive summary"]}}},
  {day:32,week:5,phase:3,title:"Google Slides Auto-Generator",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Build: Google Slides auto-generator using Google Slides API + n8n","Make.com: Parallel processing — handle multiple CSV files simultaneously","Python: Matplotlib — auto-generate bar chart + line chart saved as PNG","Portfolio: Write case study for Data Pipeline (problem → solution → result)","GitHub: Commit all new code with descriptive messages"]},mech:{label:"Mechanics",hours:3,tasks:["Mechanics of Materials: Torsion — τ = Tr/J; twist angle φ = TL/GJ (4 problems)","Calculus: Applications of ODE — RC circuit equation","Engineering Drawing: FreeCAD — create threaded bolt (use standard library part)","FBD: Complex frame — 2 members, pin joints, external load — full solution"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: torsion, shear modulus, polar moment, twist, shaft","Read: Abstract of a published engineering paper; rewrite in simpler language","Prompt: Build a 'case study writer' prompt with specific sections"]}}},
  {day:33,week:5,phase:3,title:"Social Content Scheduler",blocks:{ai:{label:"AI Automation",hours:5,tasks:["PROJECT 3: 'AI-Powered Social Content Scheduler'","Build: Make.com — topic input (Typeform) → Claude draft → Google Sheet queue","Python: Rate-limit-aware API caller with retry logic","Test: Generate a week of posts for a fake 'engineering tips' account","Portfolio: Add to Notion with screenshots"]},mech:{label:"Mechanics",hours:3,tasks:["Mechanics of Materials: Deflection of beams — double integration method","Problem: Find deflection at midspan for simply supported beam (UDL)","Engineering Drawing: Isometric drawing challenge — complex L-shaped part","ODE application: Beam deflection EI·y'' = M(x) — solve for y(x)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: deflection, slope, curvature, elastic curve, boundary condition","Speaking: Record 3-min pitch: 'Here is a project I built and what it can do'","Prompt: Write a prompt that turns a bullet list into 7 engaging social posts"]}}},
  {day:34,week:5,phase:3,title:"Claude Code Intermediate",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Claude Code intermediate: use /add to add multiple files to context","Build: Refactor your Email Assistant into a clean Python package with modules","n8n: Add monitoring dashboard — track workflow run counts, errors, durations","Make.com: Scenario versioning — save a version before making changes","Exercise: Write 5 advanced prompts using XML-tag structuring"]},mech:{label:"Mechanics",hours:3,tasks:["Structural analysis: Statically indeterminate beams — compatibility equations","Calculus: Multiple integrals (intro) — double integral over rectangular region","Engineering Drawing: FreeCAD — assemble bolt + nut + washer as an assembly","Problem set: 5 combined stress problems (bending + torsion)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: indeterminate, compatibility, redundant, superposition, integration","Write: A 300-word personal statement paragraph for a scholarship application","Prompt: Multi-turn prompt simulation — build a prompt conversation for interviews"]}}},
  {day:35,week:5,phase:3,title:"Halfway Checkpoint",isReview:true,blocks:{ai:{label:"AI Checkpoint",hours:5,tasks:["List all projects built (should be 6–8+ workflows)","Pick top 3; polish their README, screenshots, and case studies","Python: Code review all scripts; ensure clean formatting (PEP8 via flake8)","Freelance: Post your first Fiverr gig (or create draft if not ready)","Set Week 6–8 goals in writing"]},mech:{label:"Mech Checkpoint",hours:3,tasks:["Full timed test: 15 problems across all topics (60 min)","Review all Engineering Drawing exercises; identify weakest sketches","FreeCAD: Export a drawing sheet from your assembly model","List 3 ODE/calculus topics that need more practice"]},eng:{label:"Eng Checkpoint",hours:1,tasks:["Vocabulary: 175 words reviewed","Write: 1-page 'Learning Journey' reflection (what worked, what to improve)","Prompt Library: Review and improve your top 10 prompts"]}}},
  {day:36,week:6,phase:3,title:"Knowledge Base Bot",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Advanced n8n: Custom function nodes with full JS logic","Build: 'Knowledge Base Bot' — load 10 FAQ pairs → n8n + Claude answers queries","Python: SQLAlchemy basics — ORM to interact with SQLite/PostgreSQL","Make.com: Build multi-branch flow — user type A → path 1, type B → path 2","Study: Prompt injection attacks and defenses in production AI systems"]},mech:{label:"Mechanics",hours:3,tasks:["Heat Transfer intro: Conduction — Fourier's law q = -kA(dT/dx)","ODE: Steady-state heat equation for a fin — solve the BVP","Engineering Drawing: FreeCAD — create a 3D threaded socket with holes","Calculus: Partial differential equations intro — heat equation"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: conduction, convection, radiation, thermal, gradient","Read: Wikipedia on 'Mechanical Engineering curriculum' — note CUET-relevant subjects","Prompt: Write a prompt to generate a study plan for a specific topic"]}}},
  {day:37,week:6,phase:3,title:"Document Analyzer & Fluid Mechanics",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Build: 'Document Analyzer' — upload PDF → Claude extracts key info + summary","n8n: File handling — receive file attachment in webhook → process → store","Make.com: Google Drive → parse PDF → store extracted text in Notion","Claude Code: Build a PDF extraction CLI tool with argparse","Portfolio: Add Document Analyzer case study"]},mech:{label:"Mechanics",hours:3,tasks:["Fluid Mechanics intro: Pressure, Pascal's law, Bernoulli's equation","Problem: Water flows through pipe — calculate velocity using Bernoulli","Engineering Drawing: Pipe and fitting drawing with standard symbols","Calculus: Line integrals (intro) — work done by a force along a curve"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: fluid, pressure, viscosity, flow rate, turbulent","Writing: Write a 200-word technical blog intro about AI document processing","Prompt: 'Document analyst' system prompt with structured JSON output"]}}},
  {day:38,week:6,phase:3,title:"Deploy Email Assistant",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Environment setup for deployment — Docker basics (Dockerfile, docker run)","Study: How to deploy n8n on a VPS (DigitalOcean/Railway) — read tutorial","Make.com: Webhook security — IP whitelisting, header authentication","Build: Deploy your Email Assistant to a free server (Railway or Render)","Portfolio: Update Notion with deployment details; add live demo link"]},mech:{label:"Mechanics",hours:3,tasks:["Dynamics: Gyroscopic motion and precession — conceptual + 1 problem","Calculus: Green's theorem and Stokes' theorem (conceptual overview)","Engineering Drawing: Full drawing set for a 3-part assembly in FreeCAD","ODE Review: Solve 5 mixed ODEs — first-order, second-order, Laplace"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: deploy, container, server, host, environment","Speaking: Record 4-min technical presentation on how your Email Assistant works","Prompt: Build a prompt to generate a deployment README for a project"]}}},
  {day:39,week:6,phase:3,title:"Testing & Eigenvalues",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Unit testing with pytest — write tests for your helper functions","Claude Code: Let it generate tests for your Email Assistant codebase","n8n: Monitor workflow health — add SLA tracking","Make.com: Build an 'AI research assistant' — topic → search → Claude summary → email","Freelance: Search Upwork for AI automation jobs; analyze top 5 job descriptions"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering Mathematics: Eigenvalues and eigenvectors — 3 examples","Application: Natural frequencies of a 2-DOF mass-spring system","Engineering Drawing: FreeCAD — drafting a worm gear from dimensions","FBD comprehensive: 3D space frame — identify all forces and moments"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: eigenvalue, eigenvector, matrix, determinant, natural mode","Writing: Write a Upwork proposal for an automation job description you found","Prompt: 'Proposal writer' — job description → professional Upwork proposal"]}}},
  {day:40,week:6,phase:3,title:"Week 6 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Deploy at least 1 project publicly; share the link","Python: Refactor your best project; add comprehensive error handling","Review freelance strategy: what 1 service can you deliver in under 3 days?","Write: A 'services menu' doc listing your 3 core automation offerings"]},mech:{label:"Mech Review",hours:3,tasks:["Timed test: 12 problems — dynamics + ODE + drawing interpretation — 60 min","FreeCAD challenge: Model a component you designed from scratch","Calculus: Speed-run 10 mixed integral problems — 30 min","Identify your top 3 engineering drawing weaknesses"]},eng:{label:"Eng Review",hours:1,tasks:["Review all 200+ words; test yourself on the last 60","Draft scholarship essay: 'Why I chose Mechanical Engineering' (300 words)","Prompt Portfolio: Tag your prompts by category in Notion"]}}},
  {day:41,week:7,phase:4,title:"Lead Capture System",blocks:{ai:{label:"AI Automation",hours:5,tasks:["FREELANCE PROJECT: 'Client Lead Capture Automation System'","Build: Typeform webhook → n8n → Claude lead scoring → Pipedrive CRM entry","Python: Write a lead scoring algorithm (rule-based + Claude verification)","Fiverr/Upwork: Publish or refine your gig with this project as portfolio piece","Plan: Define inputs, outputs, n8n + Claude architecture diagram"]},mech:{label:"Mechanics",hours:3,tasks:["Differential Equations deep dive: Solving systems of ODEs (matrix method)","Application: 2-DOF vibration system — write and solve matrix ODE","Engineering Drawing: Full GD&T basics — straightness, flatness, roundness symbols","Calculus: Fourier transforms (intro) — frequency domain interpretation"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: qualify, prospect, pipeline, conversion, outreach","Writing: Write a client case study narrative for the lead system","Prompt: Build a 'lead qualifier' system prompt with scoring rubric"]}}},
  {day:42,week:7,phase:4,title:"Lead Capture — SMS & CRM",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Add SMS via Twilio — instant alert to sales team for high-score leads","Make.com: Parallel path — simultaneously update CRM and send Slack notification","Python: Build a dashboard script — print daily lead counts, avg score, top source","Test: Run 20 mock leads; review accuracy; refine Claude scoring prompt","Portfolio: Document Lead Capture System with screenshots"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering Mechanics: Lagrangian mechanics intro — generalized coordinates","Problem: Derive equation of motion for a pendulum using Lagrangian method","Engineering Drawing: Complete a full drawing set (3 parts + assembly + BOM) in FreeCAD","ODE Review: Laplace transform method for second-order system"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: Lagrangian, generalized, constraint, degree of freedom, pendulum","Speaking: Record 5-min project walkthrough of the Lead Capture System","Prompt: Design a system prompt for a 'sales qualification assistant'"]}}},
  {day:43,week:7,phase:4,title:"FastAPI Wrapper & Beam Buckling",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Build a REST API wrapper for your Lead Capture System using FastAPI","Claude Code: Add API documentation with docstrings → auto-generate OpenAPI spec","n8n: Add retry and circuit-breaker logic for all external API calls","Study: AI pricing strategies for freelancing (hourly vs project vs retainer)","Portfolio: Write a 400-word case study for the Lead Capture System"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations: Boundary value problems (BVP) — shooting method concept","Application: Beam buckling — Euler column formula Pcr = π²EI/L²","Engineering Drawing: Geometric tolerance application — position tolerance","Calculus: Numerical methods — Euler method for ODE (solve by hand, 5 steps)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: buckling, critical load, slenderness ratio, column, Euler","Write: Technical presentation outline (5 slides) for your best project","Prompt: 'PowerPoint outline generator' — topic → slide-by-slide structure"]}}},
  {day:44,week:7,phase:4,title:"Self-Critique Prompts & Machine Design",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Advanced Claude prompting: Constitutional AI, self-critique, chain-of-verification","Exercise: Take a complex task; write a self-critique prompt chain (5 steps)","n8n: Version control — export all workflows to JSON; commit to GitHub","Make.com: Build a 'personal productivity assistant' — daily task emails + Pomodoro tracker","Freelance: Write 3 cold outreach messages for potential local clients"]},mech:{label:"Mechanics",hours:3,tasks:["Comprehensive problem: Full machine design problem (shaft under combined loading)","Engineering Drawing: FreeCAD — parametric model of a machine component","Calculus: Numerical methods — Runge-Kutta 4th order (concept + 1 worked example)","Review: Go through all ODE techniques; create a decision flowchart"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: parametric, constraint, feature, sketch, extrude","Scholarship: Write a 300-word statement of purpose for a hypothetical scholarship","Prompt: 'Scholarship essay editor' — paste draft → get feedback + improved version"]}}},
  {day:45,week:7,phase:4,title:"Streamlit Dashboard & Wave Equations",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Python: Web app with Streamlit — build a frontend for your Lead Capture dashboard","Claude Code: Add a chat interface to your Streamlit app","n8n: Multi-tenant design — workflows that work for multiple 'clients' with config","Build: 'Universal webhook dispatcher' — one endpoint → route to right workflow","Portfolio: Record a 5-min screen-recording demo of your Streamlit dashboard"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations: Partial DEs — 1D wave equation intro","Engineering Drawing: Full CUET exam-style drawing problem (given problem + solve)","Calculus: Series solutions of ODEs — Frobenius method (1 example)","Dynamics: Energy method for finding natural frequencies (Rayleigh's method)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: wave equation, propagation, boundary, standing wave, node","Speaking: Present your Lead Capture System in 7 minutes to a camera","Prompt: 'Streamlit UI description to code' — describe a UI, get working code"]}}},
  {day:46,week:7,phase:4,title:"Multi-Agent Architecture & FEA",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Study: Multi-agent architectures — orchestrator + worker agent pattern","Build: 2-agent system in n8n — Agent 1: research → Agent 2: write report","Python: Implement a simple agent loop (think → act → observe → repeat)","Make.com: Complex scenario with 15+ modules — 'event management pipeline'","Freelance: Apply to 3 AI automation jobs on Upwork (write tailored proposals)"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering applications: Finite Element Analysis (FEA) concept — nodes, elements, DOF","FreeCAD FEM Workbench: Run a simple stress analysis on your L-bracket model","Calculus: Green's functions (concept) — solving PDEs with specific BCs","Engineering Drawing: Final comprehensive drawing exercise — multi-part assembly"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: finite element, mesh, node, DOF, simulation","Read: Article about FEA in engineering; write a 5-sentence summary","Prompt: 'Multi-agent task decomposer' — complex task → subtask list + agents"]}}},
  {day:47,week:7,phase:4,title:"Week 7 Review",isReview:true,blocks:{ai:{label:"AI Review",hours:5,tasks:["Demo your Lead Capture System to yourself as if presenting to a client","Python test: Build a working chatbot CLI in 45 min from scratch","Review all Upwork proposals sent; iterate based on results","GitHub: Ensure 3 repositories have polished README files with screenshots"]},mech:{label:"Mech Review",hours:3,tasks:["Timed comprehensive exam: 18 problems (all topics) — 90 min","FreeCAD: Create a new part from scratch — no reference","ODE marathon: 8 ODEs in 60 min (all types)","Identify 2 final topics to master before Day 60"]},eng:{label:"Eng Review",hours:1,tasks:["Full vocabulary test: all 235 words","Write: A 500-word blog post about AI automation for beginners","Prompt Mastery: Can you write a prompt that reliably produces perfect outputs?"]}}},
  {day:48,week:8,phase:4,title:"Capstone — Business Operations Suite",blocks:{ai:{label:"AI Automation",hours:5,tasks:["CAPSTONE: 'AI-Powered Business Operations Suite'","Architecture: Design system diagram (blocks, data flows, tools used)","Build: Module 1 — Lead intake form → qualify → CRM (refine from Week 7)","Claude Code: Create a project workspace; add all modules as subfolders","Plan: Define all 4 modules with inputs/outputs"]},mech:{label:"Mechanics",hours:3,tasks:["Differential equations comprehensive review: All types — 60 min timed (12 ODEs)","Engineering Drawing: Complete CUET-style drawing exam paper (3 questions — 90 min)","Calculus review: Integrals, derivatives, optimization, series — 20-problem sprint","Review: Any remaining weak topics"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: suite, modular, integrated, scalable, enterprise","Technical writing: Write an executive summary for your capstone project","Prompt: 'System architecture explainer' — describe a system, get plain-English summary"]}}},
  {day:49,week:8,phase:4,title:"Capstone — Email Triage Module",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Capstone Module 2: Email triage + auto-responder for routine queries","Build: Classify incoming email → if FAQ match → Claude drafts reply → human approves","Python: Build an approval queue (pending replies stored in Airtable)","n8n: Human-in-the-loop pattern — workflow pauses and waits for human approval","Test Module 2 with 30 simulated emails"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering Mechanics: Comprehensive statics review","Problem: Bridge truss — 10 members, find all member forces","Engineering Drawing: FreeCAD — create a technical drawing sheet with all standard views","Application: Design a simple bracket — choose dimensions to satisfy stress limit"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: approval, escalate, triage, queue, protocol","Prompt: 'Email auto-responder' system prompt — write for 3 different business types","Writing: Update LinkedIn bio (or draft one) to reflect your new skills"]}}},
  {day:50,week:8,phase:4,title:"Capstone — Report Generator",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Capstone Module 3: Weekly report generator (analytics + narrative)","Build: Pull data from 3 sources → Claude writes narrative summary → format as PDF/Slides","Python: Build a report template filler using Jinja2","Make.com: Trigger report every Sunday 8 AM; email to stakeholder list","Test: Run report generator for a simulated 4-week dataset"]},mech:{label:"Mechanics",hours:3,tasks:["Mechanical Engineering breadth review: Thermodynamics — 1st and 2nd law statements","Manufacturing: Common processes — casting, forging, machining, welding (brief)","Engineering Drawing: Full drawing of a machined component with GD&T symbols","Calculus: Applications in heat transfer and fluid flow — 3 worked examples"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: thermodynamics, entropy, process, cycle, efficiency","Speaking: Record 6-min technical walkthrough of your capstone system","Prompt: 'Report narrative generator' — statistics input → compelling business narrative"]}}},
  {day:51,week:8,phase:4,title:"Capstone — Social Media Module",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Capstone Module 4: Social media content pipeline","Build: Weekly blog topic → research → Claude writes post → format → schedule","Python: Automate post formatting for LinkedIn, Twitter, Instagram","Claude Code: Add a 'tone checker' feature to ensure posts match brand voice","Integrate all 4 modules — test end-to-end with a complete week simulation"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering Drawing: Final comprehensive exercise (exam simulation — 2 hrs)","Topics: Orthographic, isometric, section, exploded, GD&T, FreeCAD export","ODE application: Model a real system (damped spring + force) — solve completely","Statics: 3D problem — space frame with 6 unknowns — solve completely"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: tone, brand voice, engagement, content calendar, scheduling","Writing: Write a 400-word 'product description' for your Business Operations Suite","Prompt: 'Brand voice analyzer' — paste text → identify tone + suggestions"]}}},
  {day:52,week:8,phase:4,title:"Client Documentation & Exam Sim #1",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Capstone: Client documentation package — user manual, setup guide, FAQ, pricing sheet","Python: Auto-generate markdown docs from your code docstrings","Portfolio site: Publish capstone project as featured case study","Upwork/Fiverr: Add capstone to your profile; update skills and bio","Write your 'AI Automation Services' one-page pitch document"]},mech:{label:"Mechanics",hours:3,tasks:["Pre-CUET exam simulation #1: Calculus 10 problems (40 min), Statics 6 problems (30 min), Dynamics 4 problems (20 min)","Review all answers; mark errors for Day 53 revision","Identify topics that need one final pass"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: documentation, manual, FAQ, onboarding, user experience","Prompt: Write a prompt that generates a FAQ section from a product description","Write: Draft a thank-you email template for a completed freelance project"]}}},
  {day:53,week:8,phase:4,title:"Mock Freelance Day & Exam Sim #2",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Mock freelance project: Treat yourself as a real client","Requirement: 'Build me an automation that saves 3 hours/week of manual work'","Plan → Build → Test → Document → Deliver (simulate full workflow in 5 hours)","Time yourself: Can you deliver professional quality in one working day?","Review: What took longest? What would you do differently?"]},mech:{label:"Mechanics",hours:3,tasks:["Pre-CUET exam simulation #2: Engineering Drawing 2 problems (60 min), Differential Equations 6 problems (40 min), FBD + Work-Energy 4 problems (30 min)","Review errors; mark topics for final revision"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: deliver, milestone, revision, feedback, approval","Scholarship: Finalize and polish your 500-word statement of purpose","Prompt: Final challenge — write a prompt that solves a complex real problem"]}}},
  {day:54,week:8,phase:4,title:"Final Portfolio Polish",blocks:{ai:{label:"AI Automation",hours:5,tasks:["GitHub: All repos have README, screenshot, live demo link","Notion: Portfolio has 5+ projects with case studies","Fiverr/Upwork: Profile 100% complete — photo, bio, skills, samples","Write your 'AI Automation Services' one-page pitch document","Record a 2-min profile video (or script) for your freelance profile"]},mech:{label:"Mechanics",hours:3,tasks:["FreeCAD: Export 5 technical drawings as PDF — your best work","Draw from memory: isometric + orthographic of a given part — 45 min each","Review all GD&T symbols; write example for each","Prepare a 'drawing notes cheat sheet' for CUET reference"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: portfolio, testimonial, deliverable, scope, retainer","Write: 3 LinkedIn posts about your 60-day learning journey","Prompt: 'LinkedIn post writer' — personal achievement → professional narrative"]}}},
  {day:55,week:8,phase:4,title:"Prompt Testing Harness",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Advanced prompt mastery: LLM fine-tuning concepts (theory only)","Study: Constitutional AI, RLHF, system prompt best practices for production","Build: 'Prompt testing harness' — run same task with 10 different prompts; compare","Python: Automate prompt A/B testing; log results to CSV + score with LLM judge","Document: Your top 20 prompts with labels, use cases, and output examples"]},mech:{label:"Mechanics",hours:3,tasks:["CUET prep — Calculus final review: Speed test 15 derivative + 10 integral problems (45 min)","Taylor series: Expand 3 functions around x=0","ODE: Solve 6 problems (mixed) — 40 min","Graph: Sketch solutions to 3 ODEs (qualitative understanding)"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: fine-tuning, constitutional, alignment, inference, benchmark","Speaking: Record a 7-min 'AI Automation for Engineers' mini-lecture","Prompt: Write the most refined version of your 'Mechanical Engineering Tutor' prompt"]}}},
  {day:56,week:8,phase:4,title:"Prompt Library App & Mechanics Final",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Build: 'Prompt Library web app' with Streamlit — search, filter, copy prompts","Python: Add prompt categories, tags, and rating system to the app","Claude Code: Full session — let Claude Code review and improve the Streamlit app","Deploy: Deploy the Prompt Library to Streamlit Community Cloud (free)","Share: Post your Prompt Library link in a relevant community (Reddit, Discord)"]},mech:{label:"Mechanics",hours:3,tasks:["CUET prep — Mechanics final review: Statics 8 problems (50 min), Dynamics 6 problems (40 min)","Combined: 3 problems requiring calculus + mechanics integration (30 min)","Self-grade everything; note remaining weak points"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: deploy, community, share, open-source, contribution","Writing: Write a technical post: '5 AI Automation Tools Every Engineer Should Know'","Prompt: Final prompt challenge — generate a full study plan from a topic description"]}}},
  {day:57,week:8,phase:4,title:"Catch-Up & Deep Dive",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Catch up day OR explore one new tool you are curious about","Option A: Try LangChain (Python) — build a basic document Q&A chain","Option B: Explore Flowise (visual LangChain) — build a PDF chatbot without code","Option C: Deep dive into Make.com AI modules — build an advanced scenario","GitHub: Final commit and push for all projects; ensure no broken files"]},mech:{label:"Mechanics",hours:3,tasks:["Engineering Drawing: Draw 3 complex problems from a past engineering textbook","Calculus: Work through a full Chapter Review (integrals, series, ODEs)","ODE comprehensive: 10 problems, all types, 60 min timed","FBD: 5 challenging problems — check answers and understand errors"]},eng:{label:"English & Prompting",hours:1,tasks:["Learn 5 words: (choose 5 words from any engineering field you find interesting)","Read: An article about a CUET mechanical engineering research project","Prompt: Refine your best 5 prompts; add them to your Prompt Library app"]}}},
  {day:58,week:8,phase:4,title:"Final Review & Synthesis",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Final AI review: Can you explain LLMs, n8n, and prompt engineering clearly?","Can you build: A working automation in under 2 hours?","Can you sell: Do you have a portfolio and gig ready?","Write: 'My AI Automation Skills Summary' — 1-page document","Reflect: What will you continue building during your first semester at CUET?"]},mech:{label:"Mechanics",hours:3,tasks:["Final review: Can you solve any FBD problem including 3D?","Can you draw: Full technical drawing with GD&T in FreeCAD?","Can you apply: ODEs to real mechanical systems?","Write: 'Mechanics Cheat Sheet' — 2 pages covering all key formulas","Reflect: Which CUET subjects will be easiest/hardest based on your prep?"]},eng:{label:"English & Prompting",hours:1,tasks:["Vocabulary log: 290 words collected over 60 days","Can you write: A professional email, cover letter, project summary?","Can you speak: Present a technical project in 5+ minutes confidently?","Write: Final reflection: 'What I will bring to CUET on Day 1'","Prompt Mastery: You have a personal Prompt Library with 20+ tested prompts"]}}},
  {day:59,week:8,phase:4,title:"Final Showcase Prep",blocks:{ai:{label:"AI Automation",hours:5,tasks:["Select your 3 best projects for a final demo","Prepare a 10-min presentation (slides or demo walkthrough)","Record yourself presenting each project — watch it back critically","Polish GitHub profile: profile README, pinned repos","Set 30-day post-CUET goals: freelancing, new tools, first income target"]},mech:{label:"Mechanics",hours:3,tasks:["FINAL EXAM SIMULATION: Full 3-hour engineering paper","Calculus: 5 problems, Mechanics: 8 problems, Drawing: 2 problems","No notes allowed — simulate real exam conditions","Grade yourself honestly; write a score out of 100"]},eng:{label:"English & Prompting",hours:1,tasks:["Write a 500-word cover letter for a prestigious engineering scholarship","Record a 5-min video: 'My 60-day journey to CUET'","Final prompt: Write the best prompt you have ever written"]}}},
  {day:60,week:8,phase:4,title:"Graduation Day! 🎓",isGraduation:true,blocks:{ai:{label:"AI Graduation",hours:5,tasks:["Final showcase: Demo all 3 best projects (record for portfolio)","Celebrate: You are now an AI Automation Engineer with a live portfolio","Plan next 30 days: 1 freelance client, 2 new tool explorations, daily coding","Write a LinkedIn post: '60 days, 10+ projects, 1 goal — ready for CUET'","Thank yourself for showing up every day"]},mech:{label:"Mech Graduation",hours:3,tasks:["Review your Mechanics Cheat Sheet — your CUET survival guide","Open your FreeCAD models — print or save your best drawings","Re-solve Day 1 FBD problems — see how far you have come","Write: 'Engineering concepts I am confident in' vs 'Topics to continue'","You enter CUET ahead of 90% of your batch on fundamentals"]},eng:{label:"Eng Graduation",hours:1,tasks:["Count your vocabulary notebook — you have 300 new technical words","Re-read your Day 1 writing — compare to today's writing quality","Review your Prompt Library — you are now a prompt engineer","Set one 60-day English goal for your first semester at CUET","You are ready. Go build. Go learn. Go succeed. 🚀"]}}},
];

// ─── App ───────────────────────────────────────────────────────────
export default function App() {
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [view, setView] = useState("dashboard"); // dashboard | day | task
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // {task, block, idx}
  const [aiFeedback, setAiFeedback] = useState({});
  const [loadingAI, setLoadingAI] = useState(false);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    async function load() {
      try { const p = await window.storage.get("progress_v2"); if (p) setProgress(JSON.parse(p.value)); } catch {}
      try { const n = await window.storage.get("notes_v2"); if (n) setNotes(JSON.parse(n.value)); } catch {}
      try { const s = await window.storage.get("startDate_v2"); if (s) setStartDate(s.value); } catch {}
      try { const f = await window.storage.get("aiFeedback_v2"); if (f) setAiFeedback(JSON.parse(f.value)); } catch {}
    }
    load();
  }, []);

  const saveProgress = useCallback(async (np) => {
    setProgress(np);
    try { await window.storage.set("progress_v2", JSON.stringify(np)); } catch {}
  }, []);
  const saveNotes = useCallback(async (nn) => {
    setNotes(nn);
    try { await window.storage.set("notes_v2", JSON.stringify(nn)); } catch {}
  }, []);

  const toggleTask = useCallback(async (dayNum, block, idx) => {
    const key = `${dayNum}-${block}-${idx}`;
    const np = { ...progress, [key]: !progress[key] };
    await saveProgress(np);
  }, [progress, saveProgress]);

  const getTaskCount = (dayNum) => {
    const d = DAYS_DATA[dayNum - 1]; if (!d) return { done: 0, total: 0 };
    let done = 0, total = 0;
    for (const [block, data] of Object.entries(d.blocks)) {
      total += data.tasks.length;
      data.tasks.forEach((_, i) => { if (progress[`${dayNum}-${block}-${i}`]) done++; });
    }
    return { done, total };
  };
  const getDayPct = (dayNum) => { const { done, total } = getTaskCount(dayNum); return total > 0 ? Math.round(done / total * 100) : 0; };

  const totalTasks = DAYS_DATA.reduce((s, d) => s + Object.values(d.blocks).reduce((ss, b) => ss + b.tasks.length, 0), 0);
  const doneTasks = Object.values(progress).filter(Boolean).length;
  const totalDone = DAYS_DATA.filter(d => getDayPct(d.day) === 100).length;
  const today = startDate ? Math.min(60, Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1)) : 1;

  const getAIFeedback = async (dayNum) => {
    setLoadingAI(true);
    const d = DAYS_DATA[dayNum - 1];
    const { done, total } = getTaskCount(dayNum);
    const completedTasks = [];
    for (const [block, data] of Object.entries(d.blocks)) {
      data.tasks.forEach((t, i) => { if (progress[`${dayNum}-${block}-${i}`]) completedTasks.push(t); });
    }
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are a dedicated study coach for AAM (Md. Ashraful Alam Mazid), a new Mechanical Engineering student at CUET Bangladesh. He follows a 60-day pre-campus plan: AI Automation (n8n, Make.com, Claude Code, Python), Mechanical Engineering fundamentals, and English & Prompt Engineering. He wants to earn freelance income on Upwork/Fiverr. Be warm, specific, and motivating. Under 180 words. Use emojis naturally.`,
          messages: [{ role: "user", content: `Day ${dayNum} – "${d.title}"\nCompleted: ${done}/${total} tasks (${Math.round(done/total*100)}%)\nDone: ${completedTasks.slice(0,5).map(t=>`✓ ${t}`).join('\n')||'None yet'}\nNotes: "${notes[dayNum]||'No notes'}"\n\nGive: 1) Progress assessment 2) Specific insight on what was completed 3) Motivation for remaining 4) Tip for Day ${Math.min(60,dayNum+1)}` }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "Keep going! Every task counts. 💪";
      const nf = { ...aiFeedback, [dayNum]: { text, timestamp: new Date().toLocaleString("en-BD") } };
      setAiFeedback(nf);
      try { await window.storage.set("aiFeedback_v2", JSON.stringify(nf)); } catch {}
    } catch {
      const nf = { ...aiFeedback, [dayNum]: { text: `Great work on Day ${dayNum}! You've done ${done}/${total} tasks. Stay consistent — every day counts on your path to CUET and freelancing success! 🚀`, timestamp: new Date().toLocaleString("en-BD") } };
      setAiFeedback(nf);
    }
    setLoadingAI(false);
  };

  const pc = (phaseId) => PHASES[phaseId - 1]?.color || "#3B82F6";
  const blockMeta = { ai: { icon: "🤖", color: "#3B82F6", bg: "#EFF6FF", label: "AI Automation" }, mech: { icon: "⚙️", color: "#10B981", bg: "#ECFDF5", label: "Mechanics" }, eng: { icon: "🗣️", color: "#F59E0B", bg: "#FFFBEB", label: "English & Prompting" } };

  // ── TASK RESOURCE PAGE ──────────────────────────────────────────
  if (view === "task" && selectedTask) {
    const { task, block, idx, dayNum } = selectedTask;
    const rKey = getResourceKey(task);
    const res = rKey ? RESOURCES[rKey] : null;
    const bm = blockMeta[block] || blockMeta.ai;
    const isDone = !!progress[`${dayNum}-${block}-${idx}`];
    const d = DAYS_DATA[dayNum - 1];

    return (
      <div style={{ minHeight: "100vh", background: "#0A0F1E", fontFamily: "'Outfit', sans-serif", color: "#E2E8F0" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Header */}
        <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "14px 18px", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setView("day")} style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>← Back</button>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Day {dayNum} · {bm.icon} {bm.label}</div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task}</div>
          </div>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px 40px" }}>
          {/* Task card */}
          <div style={{ background: `linear-gradient(135deg, ${bm.color}22, ${bm.color}08)`, border: `1px solid ${bm.color}44`, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div onClick={() => { toggleTask(dayNum, block, idx); }} style={{ width: "28px", height: "28px", borderRadius: "8px", border: `2.5px solid ${isDone ? bm.color : "#475569"}`, background: isDone ? bm.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", marginTop: "2px" }}>
                {isDone && <span style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "white", lineHeight: "1.5", marginBottom: "8px" }}>{task}</div>
                <div style={{ fontSize: "14px", color: isDone ? bm.color : "#64748B" }}>{isDone ? "✅ Completed! Great job!" : "Tap the checkbox when you finish this task"}</div>
              </div>
            </div>
          </div>

          {res ? (
            <>
              {/* Pro Tip */}
              {res.tips && (
                <div style={{ background: "#1A1A2E", border: "1px solid #7C3AED44", borderRadius: "14px", padding: "18px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "13px", color: "#8B5CF6", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>💡 Pro Tip</div>
                  <div style={{ fontSize: "16px", color: "#C4B5FD", lineHeight: "1.7" }}>{res.tips}</div>
                </div>
              )}

              {/* Video Resources */}
              {res.videos?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#FF6B6B", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: "#FF6B6B22", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>▶ VIDEO TUTORIALS</span>
                  </div>
                  {res.videos.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "10px", textDecoration: "none", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#263548"; e.currentTarget.style.borderColor = "#FF6B6B66"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.borderColor = "#334155"; }}>
                      <div style={{ width: "44px", height: "44px", background: "#FF6B6B22", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px" }}>▶</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: "white", fontWeight: "500", lineHeight: "1.4" }}>{v.label}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px" }}>YouTube · Tap to open</div>
                      </div>
                      <span style={{ color: "#64748B", fontSize: "18px" }}>↗</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Website Resources */}
              {res.websites?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ADE80", marginBottom: "12px" }}>
                    <span style={{ background: "#4ADE8022", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>🌐 WEBSITES & COURSES</span>
                  </div>
                  {res.websites.map((w, i) => (
                    <a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "10px", textDecoration: "none", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#263548"; e.currentTarget.style.borderColor = "#4ADE8066"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.borderColor = "#334155"; }}>
                      <div style={{ width: "44px", height: "44px", background: "#4ADE8022", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px" }}>🌐</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: "white", fontWeight: "500", lineHeight: "1.4" }}>{w.label}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px" }}>Website · Free resource</div>
                      </div>
                      <span style={{ color: "#64748B", fontSize: "18px" }}>↗</span>
                    </a>
                  ))}
                </div>
              )}

              {/* PDF note */}
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px" }}>📚</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#94A3B8", marginBottom: "4px" }}>Textbook Tip</div>
                  <div style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6" }}>For Engineering Mechanics, use <span style={{ color: "#94A3B8", fontWeight: "600" }}>Engineering Mechanics by R.C. Hibbeler</span>. For Calculus, use <span style={{ color: "#94A3B8", fontWeight: "600" }}>Calculus by James Stewart</span>. Both are available as free PDFs online — search "{res.title} PDF" on Google.</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "14px", padding: "28px", textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
              <div style={{ fontSize: "17px", fontWeight: "600", color: "white", marginBottom: "8px" }}>Task Resource</div>
              <div style={{ fontSize: "15px", color: "#64748B", lineHeight: "1.7" }}>This is a practice/review task. Complete it using the knowledge and tools you've already learned. If you get stuck, ask Claude directly for help!</div>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "16px", background: "#7C3AED", color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Ask Claude for Help →</a>
            </div>
          )}

          {/* Mark complete button */}
          <button onClick={() => { toggleTask(dayNum, block, idx); setView("day"); }}
            style={{ width: "100%", background: isDone ? "#1E293B" : bm.color, color: isDone ? "#64748B" : "white", border: `2px solid ${isDone ? "#334155" : bm.color}`, padding: "16px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700", transition: "all 0.2s" }}>
            {isDone ? "✓ Completed — Tap to Unmark" : `Mark as Complete ✓`}
          </button>
        </div>
      </div>
    );
  }

  // ── DAY PAGE ─────────────────────────────────────────────────────
  if (view === "day" && selectedDay) {
    const d = DAYS_DATA[selectedDay - 1];
    const pct = getDayPct(d.day);
    const { done, total } = getTaskCount(d.day);
    const fb = aiFeedback[d.day];
    const phaseColor = pc(d.phase);

    return (
      <div style={{ minHeight: "100vh", background: "#0A0F1E", fontFamily: "'Outfit', sans-serif", color: "#E2E8F0" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Sticky header */}
        <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "14px 18px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setView("dashboard")} style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px" }}>← Home</button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                <span style={{ background: phaseColor, color: "white", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>DAY {d.day}</span>
                {d.isReview && <span style={{ background: "#7C3AED", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>Review</span>}
                {d.isGraduation && <span style={{ background: "#F59E0B", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>🎓 Graduation</span>}
              </div>
              <div style={{ fontSize: "17px", fontWeight: "700", color: "white" }}>{d.title}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "26px", fontWeight: "800", color: pct === 100 ? "#10B981" : phaseColor, fontFamily: "inherit" }}>{pct}%</div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>{done}/{total} done</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: "6px", background: "#1E293B", borderRadius: "3px", overflow: "hidden", marginTop: "12px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10B981" : phaseColor, borderRadius: "3px", transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "18px 16px 40px" }}>
          {/* Blocks */}
          {Object.entries(d.blocks).map(([block, data]) => {
            const bm = blockMeta[block] || blockMeta.ai;
            return (
              <div key={block} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
                {/* Block header */}
                <div style={{ background: `${bm.color}18`, borderBottom: "1px solid #1E293B", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{bm.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{data.label}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>{data.hours} hours today</div>
                  </div>
                  <div style={{ fontSize: "13px", color: bm.color, fontWeight: "600" }}>
                    {data.tasks.filter((_, i) => progress[`${d.day}-${block}-${i}`]).length}/{data.tasks.length}
                  </div>
                </div>
                {/* Tasks */}
                {data.tasks.map((task, i) => {
                  const isDone = !!progress[`${d.day}-${block}-${i}`];
                  const hasRes = !!getResourceKey(task);
                  return (
                    <div key={i} style={{ borderBottom: "1px solid #1E293B", background: isDone ? `${bm.color}08` : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 18px" }}>
                        {/* Checkbox */}
                        <div onClick={() => toggleTask(d.day, block, i)}
                          style={{ width: "24px", height: "24px", borderRadius: "7px", border: `2px solid ${isDone ? bm.color : "#475569"}`, background: isDone ? bm.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", marginTop: "1px" }}>
                          {isDone && <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>✓</span>}
                        </div>
                        {/* Task text + resource button */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", color: isDone ? "#64748B" : "#CBD5E1", lineHeight: "1.5", textDecoration: isDone ? "line-through" : "none", marginBottom: hasRes ? "8px" : "0" }}>{task}</div>
                          {hasRes && (
                            <button onClick={() => { setSelectedTask({ task, block, idx: i, dayNum: d.day }); setView("task"); }}
                              style={{ background: `${bm.color}18`, border: `1px solid ${bm.color}44`, color: bm.color, padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                              📚 View Resources →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Notes */}
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>📝</span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>My Notes</span>
            </div>
            <textarea value={notes[d.day] || ""} onChange={e => { saveNotes({ ...notes, [d.day]: e.target.value }); }}
              placeholder="Write your reflections, wins, struggles, or anything from today..."
              style={{ width: "100%", minHeight: "90px", background: "transparent", border: "none", color: "#CBD5E1", padding: "14px 18px", fontFamily: "inherit", fontSize: "15px", lineHeight: "1.6", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* AI Feedback */}
          <div style={{ background: "linear-gradient(135deg,#1A1035,#0F172A)", border: "1px solid #4C1D9566", borderRadius: "16px", padding: "18px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: fb ? "14px" : "0", gap: "10px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>🤖 AI Coach Feedback</div>
                <div style={{ fontSize: "13px", color: "#7C3AED", marginTop: "2px" }}>Personalized analysis of your progress</div>
              </div>
              <button onClick={() => getAIFeedback(d.day)} disabled={loadingAI}
                style={{ background: "#7C3AED", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", cursor: loadingAI ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", opacity: loadingAI ? 0.6 : 1 }}>
                {loadingAI ? "Analyzing…" : fb ? "Refresh" : "Get Feedback"}
              </button>
            </div>
            {fb && (
              <div style={{ background: "#2D1B6944", borderRadius: "10px", padding: "14px", border: "1px solid #7C3AED33" }}>
                <div style={{ fontSize: "15px", color: "#C4B5FD", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{fb.text}</div>
                <div style={{ fontSize: "12px", color: "#6D28D9", marginTop: "8px" }}>Updated: {fb.timestamp}</div>
              </div>
            )}
            {!fb && !loadingAI && (
              <div style={{ textAlign: "center", padding: "12px 0 0", color: "#4C1D95", fontSize: "14px" }}>Check off some tasks first, then get your AI feedback! 👆</div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "10px" }}>
            {d.day > 1 && <button onClick={() => setSelectedDay(d.day - 1)} style={{ flex: 1, background: "#0F172A", border: "1px solid #1E293B", color: "#64748B", padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px" }}>← Day {d.day - 1}</button>}
            {d.day < 60 && <button onClick={() => setSelectedDay(d.day + 1)} style={{ flex: 1, background: `${pc(DAYS_DATA[d.day]?.phase || d.phase)}18`, border: `1px solid ${pc(DAYS_DATA[d.day]?.phase || d.phase)}44`, color: pc(DAYS_DATA[d.day]?.phase || d.phase), padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "700" }}>Day {d.day + 1} →</button>}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1E", fontFamily: "'Outfit', sans-serif", color: "#E2E8F0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg,#0F172A 0%,#1A1035 60%,#0A0F1E 100%)", padding: "24px 18px 20px", borderBottom: "1px solid #1E293B" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#7C3AED", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>CUET Pre-Campus Roadmap</div>
          <h1 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: "white", lineHeight: "1.2" }}>60-Day Master Tracker</h1>
          <p style={{ color: "#475569", fontSize: "15px", margin: "0 0 20px" }}>Md. Ashraful Alam Mazid · Mechanical Engineering</p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            {[
              { label: "Days Done", val: totalDone, color: "#10B981" },
              { label: "Tasks Done", val: doneTasks, color: "#3B82F6" },
              { label: "Progress", val: `${Math.round(doneTasks / totalTasks * 100)}%`, color: "#8B5CF6" },
              { label: "Today", val: `D${today}`, color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "12px", padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div style={{ height: "8px", background: "#1E293B", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ height: "100%", width: `${Math.round(doneTasks / totalTasks * 100)}%`, background: "linear-gradient(90deg,#3B82F6,#8B5CF6,#10B981)", borderRadius: "4px", transition: "width 0.5s" }} />
          </div>

          {/* Start / Today button */}
          {!startDate ? (
            <button onClick={async () => { const d = new Date().toISOString(); setStartDate(d); try { await window.storage.set("startDate_v2", d); } catch {} }}
              style={{ width: "100%", background: "#7C3AED", color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700" }}>
              🚀 Start My Journey — Day 1 Begins Now
            </button>
          ) : (
            <button onClick={() => { setSelectedDay(today); setView("day"); }}
              style={{ width: "100%", background: `linear-gradient(135deg,#7C3AED,#3B82F6)`, color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700" }}>
              📅 Open Day {today}: {DAYS_DATA[today - 1]?.title} →
            </button>
          )}
        </div>
      </div>

      {/* Day Grid */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px 40px" }}>
        {PHASES.map(phase => {
          const phaseDays = DAYS_DATA.filter(d => d.phase === phase.id);
          const phTotal = phaseDays.reduce((s, d) => s + Object.values(d.blocks).reduce((ss, b) => ss + b.tasks.length, 0), 0);
          const phDone = phaseDays.reduce((s, d) => {
            return s + Object.values(d.blocks).reduce((ss, b, bi) => {
              const bk = Object.keys(d.blocks)[bi];
              return ss + b.tasks.filter((_, i) => progress[`${d.day}-${bk}-${i}`]).length;
            }, 0);
          }, 0);
          const phPct = phTotal > 0 ? Math.round(phDone / phTotal * 100) : 0;

          return (
            <div key={phase.id} style={{ marginBottom: "28px" }}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "4px", height: "40px", background: phase.color, borderRadius: "2px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "17px", fontWeight: "700", color: "white" }}>{phase.weeks}: {phase.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <div style={{ flex: 1, height: "5px", background: "#1E293B", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${phPct}%`, background: phase.color, borderRadius: "3px", transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: phase.color, minWidth: "36px", textAlign: "right" }}>{phPct}%</span>
                  </div>
                </div>
              </div>

              {/* Day cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
                {phaseDays.map(d => {
                  const pct = getDayPct(d.day);
                  const isToday = d.day === today && !!startDate;
                  return (
                    <div key={d.day} onClick={() => { setSelectedDay(d.day); setView("day"); }}
                      style={{ background: isToday ? `linear-gradient(135deg,#1A1035,#2D1B69)` : "#0F172A", border: `2px solid ${isToday ? "#7C3AED" : pct === 100 ? `${phase.color}88` : "#1E293B"}`, borderRadius: "12px", padding: "12px 10px", cursor: "pointer", transition: "all 0.2s", position: "relative", textAlign: "center" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = phase.color; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = isToday ? "#7C3AED" : pct === 100 ? `${phase.color}88` : "#1E293B"; }}>
                      {pct === 100 && <div style={{ position: "absolute", top: "-1px", right: "-1px", width: "18px", height: "18px", background: "#10B981", borderRadius: "0 10px 0 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: "10px" }}>✓</span>
                      </div>}
                      <div style={{ fontSize: "13px", fontWeight: "800", color: isToday ? "#A78BFA" : phase.color, marginBottom: "4px" }}>D{d.day}</div>
                      {isToday && <div style={{ fontSize: "9px", color: "#8B5CF6", fontWeight: "700", marginBottom: "3px", letterSpacing: "1px" }}>TODAY</div>}
                      <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.3", marginBottom: "8px", minHeight: "28px" }}>{d.title.length > 18 ? d.title.slice(0, 16) + "…" : d.title}</div>
                      {/* Mini progress bar */}
                      <div style={{ height: "3px", background: "#1E293B", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10B981" : phase.color, transition: "width 0.4s" }} />
                      </div>
                      <div style={{ fontSize: "11px", color: "#334155", marginTop: "4px" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "16px 18px" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#64748B", marginBottom: "12px" }}>HOW TO USE</div>
          {[
            { icon: "📅", text: "Tap any day card to open today's lesson" },
            { icon: "📚", text: "Tap 'View Resources' on any task to get videos, websites & tips" },
            { icon: "✅", text: "Tap the checkbox to mark a task complete" },
            { icon: "🤖", text: "Get AI coaching feedback after completing tasks" },
            { icon: "📝", text: "Write notes to remember your daily wins" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: i < 4 ? "1px solid #1E293B" : "none" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "15px", color: "#94A3B8" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
