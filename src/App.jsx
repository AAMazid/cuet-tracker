import { useState, useEffect, useCallback } from "react";

const FONT = "Outfit, sans-serif";
const GOOGLE_FONT = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
// AI Teacher powered by Claude API (same as AI Coach - works from browser)

const TEACHER_SYSTEM = "You are Sir Alam, a warm and expert AI Teacher for AAM (Md. Ashraful Alam Mazid), a new Mechanical Engineering student at CUET (Chittagong University of Engineering and Technology) in Bangladesh. " +
  "AAM is following a 60-day pre-campus preparation plan with 3 tracks: " +
  "1. AI Automation - n8n, Make.com, Claude Code, Python, FastAPI, Streamlit, RAG, AI Agents. " +
  "2. Mechanical Engineering - Calculus (derivatives, integrals, ODEs, Laplace), Statics, Dynamics, FBD, Work-Energy-Momentum, Vibrations, Engineering Drawing, FreeCAD. " +
  "3. English and Prompt Engineering - Technical vocabulary, writing, scholarship essays, prompt techniques. " +
  "Your teaching style: Explain concepts in very simple clear language first then go deeper if asked. " +
  "Use real-world analogies and examples relevant to Bangladesh and engineering life. " +
  "For math and physics: always show step-by-step solutions with clear working. " +
  "For coding: provide clean well-commented code examples. " +
  "For engineering drawing: describe clearly what to draw step by step. " +
  "Be encouraging and patient - AAM is a beginner. " +
  "Ask follow-up questions to check understanding. " +
  "Keep responses focused and not too long (under 300 words unless solving a detailed problem). " +
  "Use emojis naturally to make learning fun. " +
  "If AAM shares what day of the plan he is on, tailor your help to that day topics.";
// ── Theme ────────────────────────────────────────────────────────
const T = {
  dark:  { bg:"#0A0F1E", surface:"#0F172A", card:"#131C2E", border:"#1E293B", border2:"#334155", text:"#E2E8F0", sub:"#94A3B8", muted:"#475569", aiGrad:"linear-gradient(135deg,#1A1035,#0F172A)", aiBorder:"#4C1D9566", aiTxt:"#C4B5FD", hero:"linear-gradient(160deg,#0F172A 0%,#1A1035 60%,#0A0F1E 100%)", toggleBg:"#1E293B", toggleIcon:"☀️", toggleLabel:"Light" },
  light: { bg:"#F0F4FF", surface:"#FFFFFF", card:"#F8FAFC", border:"#E2E8F0", border2:"#CBD5E1", text:"#0F172A", sub:"#334155", muted:"#64748B", aiGrad:"linear-gradient(135deg,#F5F3FF,#EEF2FF)", aiBorder:"#7C3AED44", aiTxt:"#5B21B6", hero:"linear-gradient(160deg,#EEF2FF 0%,#F5F3FF 60%,#F0F4FF 100%)", toggleBg:"#E2E8F0", toggleIcon:"🌙", toggleLabel:"Dark" },
};

// ── Phases ───────────────────────────────────────────────────────
const PHASES = [
  { id:1, weeks:"Weeks 1-2", label:"Foundation",    color:"#3B82F6" },
  { id:2, weeks:"Weeks 3-4", label:"Skill Building",color:"#8B5CF6" },
  { id:3, weeks:"Weeks 5-6", label:"Projects",      color:"#10B981" },
  { id:4, weeks:"Weeks 7-8", label:"Mastery",       color:"#F59E0B" },
];

const pc = (pid) => (PHASES[pid-1] || PHASES[0]).color;

// ── Block meta ───────────────────────────────────────────────────
const BM = {
  ai:   { icon:"🤖", color:"#3B82F6", label:"AI Automation" },
  mech: { icon:"⚙️", color:"#10B981", label:"Mechanics" },
  eng:  { icon:"🗣️", color:"#F59E0B", label:"English & Prompting" },
};

// ── Resource type config ─────────────────────────────────────────
const TC = {
  video:   { label:"Video",   icon:"▶",  color:"#EF4444", dbg:"#7F1D1D33", lbg:"#FEF2F2" },
  article: { label:"Article", icon:"📝", color:"#3B82F6", dbg:"#1E3A5F33", lbg:"#EFF6FF" },
  docs:    { label:"Docs",    icon:"📄", color:"#64748B", dbg:"#33415533", lbg:"#F1F5F9" },
  course:  { label:"Course",  icon:"🎓", color:"#8B5CF6", dbg:"#4C1D9533", lbg:"#F5F3FF" },
  pdf:     { label:"PDF",     icon:"📑", color:"#F97316", dbg:"#7C2D1233", lbg:"#FFF7ED" },
  website: { label:"Website", icon:"🌐", color:"#10B981", dbg:"#06402433", lbg:"#ECFDF5" },
  tool:    { label:"Tool",    icon:"🔧", color:"#EAB308", dbg:"#71350133", lbg:"#FEFCE8" },
};

// ── Resources ────────────────────────────────────────────────────
const RMAP = [
  { kw:["llm","how llm","karpathy","language model","gpt"], res:[
    { title:"Intro to Large Language Models - Andrej Karpathy", url:"https://www.youtube.com/watch?v=zjkBMFhNj_g", type:"video", note:"The exact video recommended in the roadmap" },
    { title:"But what is a GPT? - 3Blue1Brown", url:"https://www.youtube.com/watch?v=wjZofJX0v4M", type:"video", note:"Visual deep-dive into transformers" },
    { title:"What is ChatGPT doing? - Stephen Wolfram", url:"https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/", type:"article" },
  ]},
  { kw:["install: python","vs code","virtual environment","python 3.11"], res:[
    { title:"Python Download Page", url:"https://www.python.org/downloads/", type:"website" },
    { title:"VS Code Python Setup Guide", url:"https://code.visualstudio.com/docs/python/python-tutorial", type:"docs" },
    { title:"Python Virtual Environments - Real Python", url:"https://realpython.com/python-virtual-environments-a-primer/", type:"article" },
  ]},
  { kw:["prompt engineering","zero-shot","few-shot","chain-of-thought","role-context-task","prompt pattern","meta-prompt","output primer","system prompt","prompting"], res:[
    { title:"Anthropic Prompt Engineering Guide", url:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type:"docs", note:"Official - most up-to-date" },
    { title:"Prompt Engineering Guide (Dair.ai)", url:"https://www.promptingguide.ai/", type:"website" },
    { title:"OpenAI Prompt Engineering Best Practices", url:"https://platform.openai.com/docs/guides/prompt-engineering", type:"docs" },
    { title:"Learn Prompting", url:"https://learnprompting.org/", type:"course" },
  ]},
  { kw:["n8n"], res:[
    { title:"n8n Official Documentation", url:"https://docs.n8n.io/", type:"docs" },
    { title:"n8n YouTube Channel (Tutorials)", url:"https://www.youtube.com/@n8n-io", type:"video" },
    { title:"n8n Cloud (Free Account)", url:"https://app.n8n.cloud/", type:"tool" },
    { title:"n8n Community Forum", url:"https://community.n8n.io/", type:"website" },
  ]},
  { kw:["make.com","make scenario","make:"], res:[
    { title:"Make.com Official Documentation", url:"https://www.make.com/en/help", type:"docs" },
    { title:"Make.com YouTube Tutorials", url:"https://www.youtube.com/@Make", type:"video" },
    { title:"Make Academy (Free Courses)", url:"https://www.make.com/en/academy", type:"course" },
  ]},
  { kw:["claude api","claude code","anthropic api","token","temperature","model parameter"], res:[
    { title:"Anthropic API Documentation", url:"https://docs.anthropic.com/", type:"docs" },
    { title:"Claude Code Documentation", url:"https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview", type:"docs" },
    { title:"Anthropic Cookbook (Examples)", url:"https://github.com/anthropics/anthropic-cookbook", type:"website" },
  ]},
  { kw:["python: variables","python: lists","python: dictionaries","python: functions","python basics","python: string","python: file","print statements","data types","code: python"], res:[
    { title:"Python Official Tutorial", url:"https://docs.python.org/3/tutorial/", type:"docs" },
    { title:"CS50P - Python (Harvard, Free)", url:"https://cs50.harvard.edu/python/2022/", type:"course", note:"Best free Python course" },
    { title:"Corey Schafer - Python Tutorials (YouTube)", url:"https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgY7", type:"video" },
    { title:"Real Python - Beginners Guide", url:"https://realpython.com/python-first-steps/", type:"article" },
  ]},
  { kw:["oop","class","__init__","inheritance","object-oriented"], res:[
    { title:"Python OOP - Real Python", url:"https://realpython.com/python3-object-oriented-programming/", type:"article" },
    { title:"Corey Schafer - OOP Playlist (YouTube)", url:"https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc", type:"video" },
    { title:"Python OOP Official Docs", url:"https://docs.python.org/3/tutorial/classes.html", type:"docs" },
  ]},
  { kw:["pandas","dataframe","csv"], res:[
    { title:"pandas Official Documentation", url:"https://pandas.pydata.org/docs/getting_started/index.html", type:"docs" },
    { title:"pandas Tutorial - Real Python", url:"https://realpython.com/pandas-python-explore-dataset/", type:"article" },
    { title:"pandas in 10 min - YouTube (Corey Schafer)", url:"https://www.youtube.com/watch?v=vmEHCJofslg", type:"video" },
  ]},
  { kw:["requests library","http request","api call","python: http"], res:[
    { title:"requests Library Docs", url:"https://docs.python-requests.org/en/latest/", type:"docs" },
    { title:"HTTP Requests in Python - Real Python", url:"https://realpython.com/python-requests/", type:"article" },
    { title:"Working with REST APIs in Python - YouTube", url:"https://www.youtube.com/watch?v=tb8gHvYlCFs", type:"video" },
  ]},
  { kw:["fastapi","rest api endpoint","pydantic"], res:[
    { title:"FastAPI Official Documentation", url:"https://fastapi.tiangolo.com/", type:"docs", note:"Excellent, beginner-friendly docs" },
    { title:"FastAPI Crash Course - YouTube (Traversy)", url:"https://www.youtube.com/watch?v=0sOvCWFmrtA", type:"video" },
    { title:"Python Type Hints and Pydantic", url:"https://docs.pydantic.dev/", type:"docs" },
  ]},
  { kw:["streamlit"], res:[
    { title:"Streamlit Official Documentation", url:"https://docs.streamlit.io/", type:"docs" },
    { title:"Streamlit Crash Course - YouTube", url:"https://www.youtube.com/watch?v=JwSS70SZdyM", type:"video" },
    { title:"Streamlit Gallery (Examples)", url:"https://streamlit.io/gallery", type:"website" },
  ]},
  { kw:["docker","dockerfile","container"], res:[
    { title:"Docker Official Getting Started", url:"https://docs.docker.com/get-started/", type:"docs" },
    { title:"Docker Tutorial for Beginners - YouTube", url:"https://www.youtube.com/watch?v=3c-iBn73dDE", type:"video" },
  ]},
  { kw:["rag","retrieval-augmented","vector database","pinecone","qdrant","embedding"], res:[
    { title:"RAG Explained - IBM Technology (YouTube)", url:"https://www.youtube.com/watch?v=T-D1OfcDW1M", type:"video" },
    { title:"LangChain RAG Tutorial", url:"https://python.langchain.com/docs/tutorials/rag/", type:"docs" },
    { title:"What is RAG? - Pinecone", url:"https://www.pinecone.io/learn/retrieval-augmented-generation/", type:"article" },
  ]},
  { kw:["beautifulsoup","web scraping","scrape"], res:[
    { title:"BeautifulSoup Docs", url:"https://www.crummy.com/software/BeautifulSoup/bs4/doc/", type:"docs" },
    { title:"Web Scraping with Python - Real Python", url:"https://realpython.com/beautiful-soup-web-scraper-python/", type:"article" },
    { title:"Web Scraping Crash Course - YouTube (Corey Schafer)", url:"https://www.youtube.com/watch?v=ng2o98k983k", type:"video" },
  ]},
  { kw:["limit","calculus basics","x to 0","x to infinity"], res:[
    { title:"Limits - Khan Academy", url:"https://www.khanacademy.org/math/calculus-1/cs1-limits-and-continuity", type:"course", note:"Exactly as recommended in the roadmap" },
    { title:"Introduction to Limits - 3Blue1Brown", url:"https://www.youtube.com/watch?v=WUvTyaaNkzM", type:"video" },
    { title:"Limits - Paul's Online Math Notes", url:"https://tutorial.math.lamar.edu/Classes/CalcI/limitsIntro.aspx", type:"article" },
  ]},
  { kw:["derivative","power rule","chain rule","product rule","implicit differentiation","related rates","differentiat"], res:[
    { title:"Derivatives - Khan Academy", url:"https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules", type:"course" },
    { title:"Derivative Rules - 3Blue1Brown", url:"https://www.youtube.com/watch?v=S0_qX4VJhMQ", type:"video" },
    { title:"Chain Rule Explained - Professor Leonard (YouTube)", url:"https://www.youtube.com/watch?v=H-ybCx8gt-8", type:"video" },
    { title:"Derivatives - Paul's Online Math Notes", url:"https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx", type:"article" },
  ]},
  { kw:["integral","antiderivative","definite integral","integration","area under","integration by parts","integration by substitution"], res:[
    { title:"Integrals - Khan Academy", url:"https://www.khanacademy.org/math/calculus-1/cs1-integrals", type:"course" },
    { title:"Integration and the Fundamental Theorem - 3Blue1Brown", url:"https://www.youtube.com/watch?v=rfG8ce4nNh0", type:"video" },
    { title:"Integration by Parts - Professor Leonard", url:"https://www.youtube.com/watch?v=jSB49a5AbGE", type:"video" },
    { title:"Paul's Online Math Notes - Integrals", url:"https://tutorial.math.lamar.edu/Classes/CalcI/IntegralsIntro.aspx", type:"article" },
  ]},
  { kw:["differential equation","ode","first-order","second-order","laplace transform","separable","homogeneous","undetermined coefficients"], res:[
    { title:"Differential Equations - Khan Academy", url:"https://www.khanacademy.org/math/differential-equations", type:"course" },
    { title:"MIT OCW - Differential Equations (18.03)", url:"https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/", type:"course", note:"Free MIT lectures" },
    { title:"Professor Leonard - Differential Equations Playlist", url:"https://www.youtube.com/playlist?list=PLDesaqWTN6ESPaHy2QUKVaXNZuQNxkYQ_", type:"video", note:"Best free video series for ODEs" },
    { title:"Paul's Online Math Notes - ODEs", url:"https://tutorial.math.lamar.edu/Classes/DE/DE.aspx", type:"article" },
  ]},
  { kw:["taylor series","fourier series","fourier transform"], res:[
    { title:"Taylor Series - 3Blue1Brown", url:"https://www.youtube.com/watch?v=3d6DsjIBzJ4", type:"video" },
    { title:"Fourier Series - 3Blue1Brown", url:"https://www.youtube.com/watch?v=r6sGWTCMz2k", type:"video" },
    { title:"Taylor Series - Khan Academy", url:"https://www.khanacademy.org/math/calculus-bc/bc-series-new/bc-10-14/v/maclaurin-and-taylor-series-intuition", type:"course" },
  ]},
  { kw:["fbd","free body diagram","newton","draw fbd","friction","normal force","resultant","force vector","equilibrium","statics"], res:[
    { title:"Free Body Diagrams - Khan Academy", url:"https://www.khanacademy.org/science/physics/forces-newtons-laws", type:"course" },
    { title:"Engineering Statics - Jeff Hanson (YouTube)", url:"https://www.youtube.com/playlist?list=PLMrMeBcqXCJHOmHxFXyB4i60oKBNQ4wVS", type:"video", note:"Highly recommended for CUET prep" },
    { title:"Statics - Dr. Structure (YouTube)", url:"https://www.youtube.com/playlist?list=PLO_JKNOhK1HHiSnnCuEBhJ8dQf8OWHG6C", type:"video" },
  ]},
  { kw:["truss","method of joints","method of sections"], res:[
    { title:"Truss Analysis (Method of Joints) - YouTube", url:"https://www.youtube.com/watch?v=vNL3bbn1T0M", type:"video" },
    { title:"Method of Sections - YouTube", url:"https://www.youtube.com/watch?v=Ci_J0JZFZQA", type:"video" },
  ]},
  { kw:["bending moment","shear force","simply supported beam","distributed load"], res:[
    { title:"Shear Force and Bending Moment Diagrams - Dr. Structure (YouTube)", url:"https://www.youtube.com/watch?v=C-FEVzI8oe8", type:"video" },
    { title:"SFD and BMD Tutorial - YouTube", url:"https://www.youtube.com/watch?v=ZaVM1CnQ5j4", type:"video" },
  ]},
  { kw:["kinematics","suvat","free fall","angular velocity","rotational kinematics","circular motion","centripetal"], res:[
    { title:"Kinematics - Khan Academy", url:"https://www.khanacademy.org/science/physics/one-dimensional-motion", type:"course" },
    { title:"Engineering Dynamics - Jeff Hanson (YouTube)", url:"https://www.youtube.com/playlist?list=PLMrMeBcqXCJHzAg4yA6CyzVTf7Ge9IXKX", type:"video" },
    { title:"Rotational Kinematics - Khan Academy", url:"https://www.khanacademy.org/science/physics/torque-angular-momentum", type:"course" },
  ]},
  { kw:["work-energy","kinetic energy","potential energy","conservation of energy","momentum","impulse","collision"], res:[
    { title:"Work, Energy and Power - Khan Academy", url:"https://www.khanacademy.org/science/physics/work-and-energy", type:"course" },
    { title:"Momentum and Impulse - Khan Academy", url:"https://www.khanacademy.org/science/physics/linear-momentum", type:"course" },
    { title:"Work-Energy Theorem - Michel van Biezen (YouTube)", url:"https://www.youtube.com/watch?v=Ml8oCqXNPMM", type:"video" },
  ]},
  { kw:["vibration","damping","spring-mass","overdamped","underdamped","natural frequency","forced vibration","resonance"], res:[
    { title:"Mechanical Vibrations - NPTEL (Free Course)", url:"https://nptel.ac.in/courses/112106224", type:"course", note:"Free IIT lecture series" },
    { title:"Vibrations Intro - YouTube", url:"https://www.youtube.com/watch?v=JBnRE-qNhD4", type:"video" },
    { title:"Free Vibration - Wikipedia Reference", url:"https://en.wikipedia.org/wiki/Harmonic_oscillator", type:"article" },
  ]},
  { kw:["stress","strain","torsion","bending stress","deflection","moment of inertia","section modulus","shear modulus","polar moment"], res:[
    { title:"Mechanics of Materials - NPTEL (Free)", url:"https://nptel.ac.in/courses/112107146", type:"course", note:"Free IIT course" },
    { title:"Mechanics of Materials - YouTube (Jeff Hanson)", url:"https://www.youtube.com/playlist?list=PLMrMeBcqXCJH7RCDe8sVFDFPvJ3aTlF3w", type:"video" },
  ]},
  { kw:["engineering drawing","orthographic","isometric","section view","gd&t","freecad","title block","dimension","hidden lines","assembly drawing","bom","bill of materials"], res:[
    { title:"Engineering Drawing - NPTEL (Free Course)", url:"https://nptel.ac.in/courses/112107214", type:"course", note:"Indian engineering curriculum - perfect for CUET" },
    { title:"FreeCAD Official Tutorials", url:"https://wiki.freecad.org/Tutorials", type:"docs" },
    { title:"Engineering Drawing Basics - YouTube (The Efficient Engineer)", url:"https://www.youtube.com/watch?v=IDtpQR5T9RM", type:"video" },
    { title:"Isometric Drawing - YouTube", url:"https://www.youtube.com/watch?v=EFLJi8HFP_U", type:"video" },
    { title:"GD and T Basics (Free Resource)", url:"https://www.gdandtbasics.com/", type:"website" },
  ]},
  { kw:["heat transfer","conduction","fourier","fluid mechanics","bernoulli","pressure","viscosity"], res:[
    { title:"Heat Transfer - NPTEL (Free)", url:"https://nptel.ac.in/courses/112105123", type:"course" },
    { title:"Fluid Mechanics - NPTEL (Free)", url:"https://nptel.ac.in/courses/112104118", type:"course" },
    { title:"Bernoulli's Equation - Khan Academy", url:"https://www.khanacademy.org/science/physics/fluids", type:"course" },
  ]},
  { kw:["lagrangian","generalized coordinate","degree of freedom"], res:[
    { title:"Lagrangian Mechanics - YouTube (Michel van Biezen)", url:"https://www.youtube.com/watch?v=KpLno70oYHE", type:"video" },
    { title:"Classical Mechanics - MIT OCW (8.01)", url:"https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/", type:"course", note:"Free MIT lectures" },
  ]},
  { kw:["eigenvalue","eigenvector","matrix","determinant","linear algebra"], res:[
    { title:"Eigenvalues and Eigenvectors - 3Blue1Brown", url:"https://www.youtube.com/watch?v=PFDu9oVAE-g", type:"video", note:"Best visual explanation" },
    { title:"Linear Algebra - MIT OCW (18.06)", url:"https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", type:"course" },
    { title:"Linear Algebra - Khan Academy", url:"https://www.khanacademy.org/math/linear-algebra", type:"course" },
  ]},
  { kw:["upwork","fiverr","freelance","gig","profile","proposal","outreach"], res:[
    { title:"Upwork Getting Started Guide", url:"https://www.upwork.com/resources/getting-started-on-upwork", type:"article" },
    { title:"Fiverr Academy", url:"https://www.fiverr.com/resources/guides/business/sell-on-fiverr", type:"article" },
    { title:"How to Land Your First Client - YouTube", url:"https://www.youtube.com/watch?v=3FmTgWHbU3E", type:"video" },
  ]},
  { kw:["github","readme","portfolio","notion","git commit"], res:[
    { title:"GitHub Docs - Getting Started", url:"https://docs.github.com/en/get-started", type:"docs" },
    { title:"How to Make a Great GitHub README - YouTube", url:"https://www.youtube.com/watch?v=E6NO0rgFub4", type:"video" },
    { title:"Notion Official Templates", url:"https://www.notion.so/templates", type:"website" },
  ]},
  { kw:["grammar","passive voice","writing","cover letter","scholarship","technical writing","vocabulary","speaking"], res:[
    { title:"Grammarly Writing Tips", url:"https://www.grammarly.com/blog/category/writing-tips/", type:"website" },
    { title:"Technical Writing - Google (Free Course)", url:"https://developers.google.com/tech-writing", type:"course", note:"Free, beginner-friendly" },
    { title:"IEEE Spectrum (Engineering Articles)", url:"https://spectrum.ieee.org/", type:"website" },
  ]},
  { kw:["research paper","abstract","ieee","paper","mit news"], res:[
    { title:"Google Scholar", url:"https://scholar.google.com/", type:"website", note:"Search for any engineering paper for free" },
    { title:"arXiv.org (Free Preprints)", url:"https://arxiv.org/", type:"website" },
    { title:"MIT News - Engineering", url:"https://news.mit.edu/topic/mitengineeringnews", type:"website" },
  ]},
  { kw:["ai agent","react pattern","multi-agent","tool use","agent loop","orchestrator"], res:[
    { title:"What are AI Agents? - IBM (YouTube)", url:"https://www.youtube.com/watch?v=F8NKVhkZZWI", type:"video" },
    { title:"Building AI Agents with LangChain", url:"https://python.langchain.com/docs/concepts/agents/", type:"docs" },
  ]},
  { kw:["pytest","unit test","testing"], res:[
    { title:"pytest Official Docs", url:"https://docs.pytest.org/en/stable/", type:"docs" },
    { title:"Pytest Tutorial - Real Python", url:"https://realpython.com/pytest-python-testing/", type:"article" },
  ]},
  { kw:["sqlalchemy","sqlite","postgresql","database node","supabase"], res:[
    { title:"SQLAlchemy Docs", url:"https://docs.sqlalchemy.org/en/20/tutorial/", type:"docs" },
    { title:"SQLite Tutorial", url:"https://www.sqlitetutorial.net/", type:"article" },
  ]},
  { kw:["euler method","runge-kutta","numerical","trapezoidal","simpson"], res:[
    { title:"Numerical Methods - NPTEL (Free)", url:"https://nptel.ac.in/courses/111107105", type:"course" },
    { title:"Euler Method Explained - YouTube", url:"https://www.youtube.com/watch?v=NfLGmjQdvKg", type:"video" },
  ]},
  { kw:["finite element","fea","fem workbench","mesh"], res:[
    { title:"FEA Explained - YouTube (The Efficient Engineer)", url:"https://www.youtube.com/watch?v=GHjopp47vvQ", type:"video" },
    { title:"FreeCAD FEM Workbench Tutorial", url:"https://wiki.freecad.org/FEM_tutorial", type:"docs" },
  ]},
  { kw:["thermodynamics","entropy","1st law","2nd law","cycle"], res:[
    { title:"Thermodynamics - Khan Academy", url:"https://www.khanacademy.org/science/physics/thermodynamics", type:"course" },
    { title:"Thermodynamics - NPTEL (Free)", url:"https://nptel.ac.in/courses/112104113", type:"course" },
  ]},
  { kw:["langchain","flowise"], res:[
    { title:"LangChain Python Docs", url:"https://python.langchain.com/docs/introduction/", type:"docs" },
    { title:"Flowise - No-Code LLM Apps", url:"https://flowiseai.com/", type:"tool" },
    { title:"LangChain Crash Course - YouTube (freeCodeCamp)", url:"https://www.youtube.com/watch?v=lG7Uxts9SXs", type:"video" },
  ]},
  { kw:["matplotlib","seaborn","chart","visualization"], res:[
    { title:"Matplotlib Official Tutorials", url:"https://matplotlib.org/stable/tutorials/index.html", type:"docs" },
    { title:"Data Visualization with Python - YouTube (Corey Schafer)", url:"https://www.youtube.com/watch?v=UO98lJQ3QGI", type:"video" },
  ]},
  { kw:["asyncio","aiohttp","async","celery","redis"], res:[
    { title:"Asyncio - Python Docs", url:"https://docs.python.org/3/library/asyncio.html", type:"docs" },
    { title:"Async Python - Real Python", url:"https://realpython.com/async-io-python/", type:"article" },
  ]},
  { kw:["optimization","maximize","minimize"], res:[
    { title:"Optimization - Khan Academy", url:"https://www.khanacademy.org/math/calculus-1/cs1-applications-of-derivatives", type:"course" },
    { title:"Optimization Problems - Paul's Notes", url:"https://tutorial.math.lamar.edu/Classes/CalcI/Optimization.aspx", type:"article" },
  ]},
];

function getRes(task) {
  const low = task.toLowerCase();
  const found = []; const seen = new Set();
  for (const t of RMAP) {
    if (t.kw.some(k => low.includes(k))) {
      for (const r of t.res) {
        if (!seen.has(r.url)) { seen.add(r.url); found.push(r); }
      }
    }
  }
  return found;
}

// ── Compact 60-day data ──────────────────────────────────────────
// Format: [day, week, phase, title, {ai:[...tasks], mech:[...tasks], eng:[...tasks]}, flags]
// flags: r=review, g=graduation
const RAW = [
 [1,1,1,"LLM Basics & First Workflow",{ai:["Read: How LLMs work (Andrej Karpathy intro notes)","Install: Python 3.11, VS Code, set up virtual environment","Exercise: Write 5 prompts using Role-Context-Task-Format","Practice: Open n8n cloud account; explore the dashboard","Journal: Write what you learned today (3 sentences)"],mech:["Read: Calculus basics - what is a limit? (Khan Academy)","Exercise: Evaluate 10 limit problems (x to 0, x to infinity)","Draw: Sketch your desk as a simple orthographic front view","Read: Engineering Drawing basics - line types and conventions"],eng:["Learn 5 words: algorithm, iteration, derivative, vector, magnitude","Read 1 short engineering article (Engineering.com or IEEE Spectrum)","Write 3 sentences using today's vocabulary"]}],
 [2,1,1,"Prompt Techniques & Derivatives",{ai:["Study: zero-shot vs few-shot vs chain-of-thought prompting","Exercise: Write 10 prompts (2 per technique) in a notebook","Code: Python basics - variables, data types, print statements (1h)","n8n: Create first workflow: Manual Trigger - Set Node - Email","Debug: Intentionally break your n8n workflow; fix it"],mech:["Derivatives: Power rule - derive x3, x5, 3x2+2x+1 (10 problems)","Read: Scalar vs Vector quantities; unit vectors i, j, k","Exercise: Resolve 5 force vectors into x and y components","Draw: Draw 3 basic objects (cube, cylinder, L-bracket) in front view"],eng:["Learn 5 words: stress, strain, torque, equilibrium, constraint","Grammar: Review subject-verb agreement (15 min)","Prompt: Ask Claude to explain derivatives like you are 16"]}],
 [3,1,1,"Python Lists & FBD Basics",{ai:["Python: Lists, loops, functions - write a simple calculator function","Study: n8n nodes - HTTP Request, IF condition, Switch","Build: n8n workflow - fetch weather API then format then log to Google Sheet","Exercise: Write 5 system prompts for different AI assistant personas","Read: What is RAG? (15 min overview)"],mech:["Derivatives: Chain rule, product rule - 10 problems each","Read: Newton's 3 Laws; draw FBD of a block on a flat surface","Exercise: Draw FBD for 3 scenarios (inclined plane, hanging mass, pulley)","Practice: Find the resultant of two 2D force vectors"],eng:["Learn 5 words: resultant, friction, normal force, coefficient, trajectory","Read: 1 Wikipedia article on Newton's Laws; write 5-line summary","Prompt: Rewrite yesterday's prompt to get a better, cleaner answer"]}],
 [4,1,1,"Webhooks & Integration Basics",{ai:["Python: Dictionaries, file I/O - read/write .txt and .json files","n8n: Study webhook nodes - create a webhook that receives POST data","Build: Webhook - parse JSON - send formatted Telegram/email notification","Study: Make.com - create free account, explore modules and triggers","Exercise: Compare n8n vs Make.com - write a 10-line comparison"],mech:["Integration: Understand as reverse of differentiation; antiderivative rules","Exercise: Evaluate 10 basic integrals (x2, sin x, ex)","Engineering Drawing: Front, Top, Side views - draw a simple bracket","Read: Coplanar forces, concurrent forces - definitions and examples"],eng:["Learn 5 words: automation, workflow, node, trigger, integration","Write: 1 paragraph (150 words) about why you are studying AI automation","Prompt: Write a prompt to summarize a technical paper in bullet points"]}],
 [5,1,1,"Claude API & Statics Intro",{ai:["Python: pip packages - install requests, pandas; read a CSV file","Study: Claude API basics - token, model parameters, temperature","Exercise: Write 3 API-style system+user prompt pairs","Make.com: Build first scenario - Gmail new email - create Google Doc","n8n: Add error handling to yesterday's webhook workflow"],mech:["Statics: Equilibrium conditions (Sum Fx=0, Fy=0, M=0)","Exercise: Solve 5 static equilibrium problems (beams, pin joints)","Engineering Drawing: Dimension lines, title blocks, scale notation","Practice: FBD of a beam with 3 forces - find reactions"],eng:["Learn 5 words: concurrent, coplanar, equilibrium, reaction, support","Read: Engineering article from MIT News or IEEE","Speaking: Record yourself explaining Newton's 1st Law in 60 seconds"]}],
 [6,1,1,"pandas & Moments",{ai:["Python: pandas basics - create DataFrame, filter rows, compute stats","Study: Prompt patterns - persona, template, meta-prompt, output primer","Build: Make.com - RSS feed - filter keywords - send digest email","Exercise: Use Claude to debug a 20-line Python script with 3 planted bugs","Start Notion/GitHub portfolio page - add today's projects"],mech:["Calculus: Definite integrals - area under curve, 8 problems","Statics: Moment of a force - calculate moments about a point (5 problems)","Engineering Drawing: Isometric view basics - draw a cube isometrically","Review: Redo any FBD problems you found difficult this week"],eng:["Learn 5 words: moment, torque, couple, pivot, fulcrum","Writing: Draft a short cover-letter intro (3 sentences) for a freelance gig","Review Week 1 vocabulary - quiz yourself on all 30 words"]}],
 [7,1,1,"Week 1 Review",{ai:["Re-open all 5 workflows built this week; explain each step","List 3 things that confused you; ask Claude for clarity","Python: Write a mini-script that reads a CSV and prints column averages","Update your Notion/GitHub portfolio with Week 1 projects"],mech:["Re-solve 3 FBD problems from scratch without notes","Re-draw the bracket (Day 4) from memory","Calculus: Speed-run 10 derivative + 5 integral problems (timed)","Identify 2 topics to revisit in Week 2"],eng:["Quiz: Write definitions for all 30 words learned (from memory)","Read an article and highlight 5 new words; look them up","Prompt Challenge: Write a single prompt that produces a perfect FBD explanation"]},"r"],
 [8,2,1,"AI Agents & Trusses",{ai:["Python: Functions, *args, **kwargs; write reusable helper functions","n8n: Study Schedule Trigger, Cron jobs - automate daily data fetch","Build: Daily stock price fetcher - store in Google Sheet (n8n)","Study: What is an AI Agent? ReAct pattern, tool use, memory","Read: n8n documentation for Code Node (JS/Python execution)"],mech:["Calculus: Implicit differentiation - 8 problems","Statics: Truss analysis - method of joints; solve a 5-member truss","Engineering Drawing: Orthographic projections - 3-view drawing of L-bracket","Physics: Review unit conversions (N, kN, Pa, kPa, m, mm)"],eng:["Learn 5 words: truss, joint, member, compression, tension","Read: Article on structural engineering (skim + 3-sentence summary)","Prompt: Write a prompt to generate 10 truss analysis problems"]}],
 [9,2,1,"Error Handling & Friction",{ai:["Python: Error handling - try/except, logging, assert statements","Make.com: Study HTTP module, JSON parse, data store","Build: Make.com - form submission (Typeform) - format - add to Airtable","Claude: Practice few-shot prompting with examples for structured output","Exercise: Build a prompt that outputs JSON from unstructured text"],mech:["Integration: Applications - displacement from velocity, work from force","Problem set: 5 problems (area, displacement, work using integration)","Engineering Drawing: Hidden lines, centre lines - redraw bracket","Statics: Friction problems - block on incline, 4 problems"],eng:["Learn 5 words: displacement, velocity, acceleration, integral, convergence","Grammar: Passive voice in technical writing","Write: 1 paragraph explaining what you built today in simple English"]}],
 [10,2,1,"Regex & Centroids",{ai:["Python: String manipulation, regex basics - parse email addresses from text","n8n: Build a two-way sync: Airtable and Google Sheets using webhooks","Study: Prompt security - prompt injection, jailbreak awareness","Exercise: Red-team 3 of your own prompts; find weaknesses","Build: Simple CLI chatbot in Python using Anthropic API"],mech:["Derivatives: Related rates - 6 problems (ladder, shadow, balloon)","Statics: Centroid of simple shapes (rectangle, triangle, semicircle)","Engineering Drawing: Dimensioning practice - dimension a stepped shaft","FBD: Solve a 3D force problem (basic); identify x, y, z components"],eng:["Learn 5 words: centroid, shear, bending, deflection, stiffness","Prompt Engineering: Study chain-of-thought prompting; write 2 examples","Speaking: Record 90-sec explanation of what a centroid is"]}],
 [11,2,1,"APIs & Kinematics",{ai:["Python: List comprehensions, lambda functions, map/filter","Make.com: Iterator module, aggregator - process a list of items in a loop","Study: What is an API? REST vs GraphQL; HTTP verbs (GET/POST/PUT/DELETE)","Build: Python script that calls a free public API and processes the response","Exercise: Document your script with docstrings and comments"],mech:["Integration: Volumes of revolution (washer/disk method) - 4 problems","Dynamics intro: Kinematics - position, velocity, acceleration equations","Problem set: 5 kinematic problems (SUVAT equations, free fall)","Engineering Drawing: Section views - full section of a hollow cylinder"],eng:["Learn 5 words: kinematics, dynamics, inertia, momentum, impulse","Read: How Bridges Are Designed - any engineering blog article","Prompt: Write a teacher persona prompt; ask it to explain kinematics"]}],
 [12,2,1,"OOP & Expense Tracker",{ai:["Python: OOP basics - create a class with __init__, methods, properties","n8n: Study database nodes - SQLite, MongoDB basics in n8n","Build: Expense tracker - Google Form - n8n - log to SQLite + weekly email","Upwork/Fiverr: Create accounts; browse AI automation gigs - note 5 top services","Portfolio: Write a project README for your expense tracker on GitHub"],mech:["Calculus: Optimization problems - maximize/minimize area, cost (5 problems)","Statics: Pin-jointed frames - method of sections (3 problems)","Engineering Drawing: Half-section and offset section views","Review: Re-do 5 problems you found hardest in Weeks 1-2"],eng:["Learn 5 words: optimization, constraint, section, projection, scale","Write: 3-sentence bio for your Upwork/Fiverr freelancer profile","Prompt: Write a prompt that generates a professional project description"]}],
 [13,2,1,"Meeting Summarizer & Dynamics",{ai:["Python: File handling - read/write JSON, CSV, .env secrets","Make.com: Webhooks + custom app - build a Slack-to-task integration","Build: Meeting summarizer - paste notes - Claude - structured action items","Study: What is a vector database? (Pinecone, Qdrant) - 30 min overview","GitHub: Push all Week 2 code; write a brief commit message for each"],mech:["Dynamics: Newton's 2nd Law problems - F=ma, 8 problems","Engineering Drawing: Isometric section view - pipe with flange","Statics: Distributed loads on beams (uniform, triangular) - 4 problems","Problem: A 500N block on 30 degree incline - full FBD + equilibrium check"],eng:["Learn 5 words: distributed load, reaction, pin support, roller support, fixed support","Reading: Scan a research paper abstract; identify: problem, method, result","Prompt: Write a prompt that extracts key info from a paper abstract"]}],
 [14,2,1,"Week 2 Review",{ai:["Demo all 3 major workflows to yourself; identify any that break","Python: Write a script from scratch without notes (any small utility)","Reflect: What automation idea could solve a real problem for a local business?","Write: Week 2 progress update (5 sentences) for your portfolio"],mech:["Timed test: 10 calculus problems (5 derivatives, 5 integrals) - 45 min","Timed test: 5 FBD/statics problems - 45 min","Review Engineering Drawing: redraw Day 11 section view from memory","List topics for Week 3 focus"],eng:["Write: 1-paragraph summary of your 2 weeks of learning","Quiz: All 70 vocabulary words so far","Prompt: Write a chain-of-thought prompt for an engineering problem"]},"r"],
 [15,3,2,"Claude Code & Work-Energy",{ai:["Claude Code: Install Claude Code CLI; run first slash command","Study: How Claude Code works - context window, file editing, bash","Exercise: Use Claude Code to refactor a Python script (3 improvements)","n8n: Sub-workflows - split a large workflow into reusable child workflows","Build: n8n workflow - scrape webpage - extract text - summarize with Claude"],mech:["Calculus: Taylor series and approximations (intro) - 3 examples","Dynamics: Work done by constant force; Work-Energy theorem derivation","Problem set: 5 Work-Energy problems (block pushed up ramp, spring)","Engineering Drawing: Assembly drawing basics - 2-part assembly with fastener"],eng:["Learn 5 words: refactor, abstraction, modular, scalable, reusable","Read: How Claude Code Works blog or documentation (skim)","Prompt: Design a prompt template for code review with specific criteria"]}],
 [16,3,2,"OOP Advanced & Conservation",{ai:["Python: OOP advanced - inheritance, class methods, __str__, __repr__","Claude Code: Use it to write unit tests for a Python class","Make.com: Error handling - error routes, retry, filters, conditions","Build: Make.com - Smart contact form: classify intent - route to mailbox","Study: Prompt chaining - pass output of Prompt A as input to Prompt B"],mech:["Dynamics: Kinetic and Potential energy; conservation of energy (5 problems)","Engineering Drawing: Exploded view basics; label parts with balloons","Statics: 3D equilibrium - forces in x, y, z (2 problems)","Calculus: Integration by substitution - 8 problems"],eng:["Learn 5 words: conservation, potential, kinetic, elastic, inelastic","Writing: Write a 200-word technical explanation of Work-Energy theorem","Prompt: Build a 3-step chain prompt to explain a concept at 3 difficulty levels"]}],
 [17,3,2,"HTTP Requests & Momentum",{ai:["Python: HTTP requests with requests library - GET, POST, auth headers","n8n: OAuth2 authentication - connect n8n to Google Drive API","Build: Google Drive + n8n - when new file uploaded - extract name - log to Sheet","Claude Code: Open a project folder; ask Claude Code to explain the codebase","Exercise: Write a prompt that generates 10 n8n workflow ideas for freelance"],mech:["Momentum: Linear momentum, impulse-momentum theorem (5 problems)","Calculus: Integration by parts - 6 problems","Engineering Drawing: Detailed part drawing - draw a flanged pipe","FBD: Ladder against a wall - full analysis including friction"],eng:["Learn 5 words: momentum, impulse, elastic collision, inelastic, coefficient of restitution","Read: Engineering article; annotate 3 key points in your notebook","Speaking: Record 2-min explanation of what AI automation is"]}],
 [18,3,2,"Telegram AI Agent & Collisions",{ai:["Python: Decorators and context managers - write a timing decorator","Make.com: LinkedIn post drafter (input topic - Claude - formatted post)","Study: n8n AI nodes - LangChain Agent, OpenAI Chat, memory buffer","Build: n8n AI agent - user sends Telegram message - agent responds using Claude","Portfolio: Document this agent project with screenshots in Notion"],mech:["Collisions: Elastic and inelastic; coefficient of restitution (4 problems)","Calculus: Partial derivatives (intro) - f(x,y) - 5 problems","Engineering Drawing: Sectional view of a stepped shaft with keyway","Statics: Shear force and bending moment diagram for simply supported beam"],eng:["Learn 5 words: bending moment, shear force, simply supported, cantilever, deflection","Prompt: Write a structured output prompt - force JSON with specific keys","Write: 1 email to a potential freelance client describing your automation service"]}],
 [19,3,2,"Async Python & Batch Workflows",{ai:["Python: Async programming basics - asyncio, aiohttp for parallel API calls","Claude Code: Build a small CLI tool - prompt_helper.py that formats prompts","n8n: Merge node, batch processing - handle 100 rows from CSV in one workflow","Study: Zapier vs n8n vs Make.com - when to use each; pricing models","Build: Batch email personalizer - CSV of names - Claude - send personalized emails"],mech:["Dynamics: Circular motion - centripetal acceleration, angular velocity (4 problems)","Integration: Areas between curves - 5 problems","Engineering Drawing: Isometric drawing of a machine part (gear housing)","FBD problem set: 5 mixed problems (beams, pulleys, inclines) - timed 50 min"],eng:["Learn 5 words: angular velocity, centripetal, radial, tangential, rotational","Read: Wikipedia article on Mechanical Engineering - summarize in 5 bullets","Prompt: Write a meta-prompt that generates other prompts for a given task"]}],
 [20,3,2,"RAG & Rotational Kinematics",{ai:["Python: Environment variables, .env files, python-dotenv","Make.com: Build a content repurposing pipeline - blog post - tweet thread + LinkedIn","Study: Retrieval-Augmented Generation (RAG) - architecture, use cases","Build: Simple RAG demo - load a PDF - chunk - search - answer questions","GitHub: Organize your repositories; add README and badges"],mech:["Rotation: Rotational kinematics - alpha, omega, theta equations","Calculus: Differential equations intro - order, degree, solving dy/dx = f(x)","Problem: Solve 5 first-order separable ODEs","Engineering Drawing: Perspective drawing basics; 1-point perspective"],eng:["Learn 5 words: differential equation, separable, homogeneous, particular solution, boundary condition","Writing: Write a 150-word About Me for a freelance profile","Prompt: Build a system prompt for a Mechanical Engineering Tutor AI assistant"]}],
 [21,3,2,"Week 3 Review",{ai:["Open your Telegram AI agent (Day 18); add one new feature","Python challenge: Build a to-do list CLI app with file persistence","List 3 workflows you could sell on Fiverr right now; write descriptions","Review Claude Code outputs from this week; note best prompts"],mech:["Timed test: 5 Work-Energy-Momentum problems - 45 min","Re-draw the stepped shaft (Day 18) from memory with full dimensions","Re-solve 3 calculus problems (integration by parts) without notes","List weak areas; add to study queue"],eng:["Write a full paragraph about your biggest Week 3 achievement","Vocabulary quiz: all 105 words","Prompt: Share your best 3 prompts in a Notion Prompt Library"]},"r"],
 [22,4,2,"Web Scraping & ODEs",{ai:["Python: Web scraping with BeautifulSoup - scrape job titles from a public site","n8n: HTML extract node - parse scraped data; clean with Code Node","Study: Vector embeddings, cosine similarity - how semantic search works","Build: Job listing monitor - scrape site daily - filter keywords - alert via Telegram","Claude Code: Use to add features to your job monitor script"],mech:["Differential equations: First-order linear ODEs - integrating factor method","Problem set: 5 linear ODE problems","Engineering Drawing: Working drawing set - 3 views + dimensions + title block","Dynamics: Energy methods - virtual work principle (intro)"],eng:["Learn 5 words: scrape, parse, filter, embed, semantic","Reading: Skim a research paper intro on robotics or AI; note 3 key claims","Prompt: Write a prompt for structured literature review extraction"]}],
 [23,4,2,"pandas Advanced & Reports",{ai:["Python: pandas advanced - groupby, pivot table, merge dataframes","Make.com: Data transformation - JSON - CSV - formatted report","Build: Monthly expense report generator - Google Sheet - Claude analysis - PDF","Study: AI prompt compression - max info into minimum tokens","Exercise: Take a 200-word prompt; compress to 80 words; compare outputs"],mech:["Differential equations: Second-order ODEs - homogeneous (characteristic equation)","Problem set: 4 second-order ODE problems (spring-mass system)","Statics: Stress and strain basics - normal stress sigma = F/A (4 problems)","Engineering Drawing: Tolerance notation on a shaft-hole fit drawing"],eng:["Learn 5 words: tolerance, stress, strain, deformation, elasticity","Write: Compare two engineering tools (n8n vs Make.com) in 200 words","Prompt: Build a prompt optimizer - input a bad prompt, get improved version"]}],
 [24,4,2,"Data Visualization & Notion API",{ai:["Python: matplotlib + seaborn - create 3 charts from a dataset","n8n: Integrate with Notion API - create pages, update databases","Build: Daily study logger - Google Form - n8n - update Notion dashboard","Claude Code: Build a Python data visualization script for your study hours","Portfolio: Add data visualization project to Notion portfolio"],mech:["Statics: Bending stress sigma = Mc/I - 4 problems with I-section beams","Calculus: Taylor expansion of sin(x), cos(x), ex - error estimation","Engineering Drawing: Bill of Materials (BOM) - add to an assembly drawing","FBD: Truss with 7 members - full method of joints solution"],eng:["Learn 5 words: bending stress, neutral axis, moment of inertia, section modulus, beam","Speaking: Record 2-min video explaining your study logger project","Prompt: Write a prompt template for generating weekly progress reports"]}],
 [25,4,2,"FastAPI & Rotational Dynamics",{ai:["Python: FastAPI intro - create a simple REST API endpoint (GET + POST)","n8n: Connect n8n to your FastAPI endpoint; trigger from webhook","Make.com: Error notification system - if any scenario fails - send alert email","Build: Personal API - endpoint that returns your latest GitHub projects","Study: What is a chatbot? Intent, entities, slots - basic NLU concepts"],mech:["Differential equations: Non-homogeneous ODEs - undetermined coefficients","Problem set: 4 non-homogeneous ODE problems","Dynamics: Principle of work and energy for rotation","Engineering Drawing: CAD intro - install FreeCAD (free); draw a 3D cube"],eng:["Learn 5 words: endpoint, payload, request, response, API","Read: Medium article on Building APIs with FastAPI - skim headings","Prompt: Write a prompt that generates a FastAPI route from plain English"]}],
 [26,4,2,"Pydantic & Laplace Transforms",{ai:["Python: Pydantic for data validation; use in your FastAPI app","Claude Code: Open your FastAPI project; ask Claude Code to add input validation","n8n: Database node - store webhook data in a PostgreSQL/Supabase table","Build: Contact form backend - HTML form - webhook - validate - store - auto-reply","Fiverr: Draft your first gig: I will build a custom n8n automation workflow"],mech:["Dynamics: Angular momentum, conservation (3 problems)","Calculus: Laplace transform intro - definition, L{1}, L{t}, L{eat}","Problem: Solve 3 ODEs using Laplace transforms","Engineering Drawing: FreeCAD - extrude a 2D sketch into a 3D part"],eng:["Learn 5 words: Laplace transform, s-domain, eigenvalue, characteristic, resonance","Writing: Rewrite your Fiverr gig description for maximum clarity and appeal","Prompt: Write a prompt that turns a bullet list into a compelling service description"]}],
 [27,4,2,"Client Onboarding & Combined Loading",{ai:["Python: subprocess module - run shell commands from Python","n8n: SSH node + Execute Command - run a script on a remote server","Make.com: Complete client onboarding (form - welcome email - Notion - Slack alert)","Study: Anthropic's prompt engineering guide - advanced techniques","Exercise: Write 5 constrained output prompts (specific word count, format, tone)"],mech:["Statics: Combined loading - beam with axial + bending + shear (1 full problem)","Differential equations: Systems of ODEs - introduction","Engineering Drawing: FreeCAD - create and dimension an L-bracket 3D model","Problem set: Mixed bag - 5 problems covering FBD + calculus + energy"],eng:["Learn 5 words: combined loading, axial, transverse, lateral, longitudinal","Scholarship prep: Read a sample scholarship essay; identify its structure","Prompt: Write a scholarship application persona prompt for Claude"]}],
 [28,4,2,"Week 4 Review",{ai:["Test all 4 major builds from Week 4; fix any broken parts","Python: Timed challenge - build a working script in 30 min from scratch","Review Fiverr/Upwork gig descriptions; refine based on competitor research","Update portfolio with Week 3-4 projects; ensure GitHub is clean"],mech:["Timed test: 10 mixed problems (calculus + statics + dynamics) - 60 min","FreeCAD: Redraw Day 27 L-bracket from memory","Differential equations: Solve 4 ODEs (mixed types) without notes","Identify 3 topics to deepen in Weeks 5-6"],eng:["Vocabulary test: all 140 words","Write: 2-paragraph project summary for your portfolio","Speaking: Record 3-min walk-through of your best automation project"]},"r"],
 [29,5,3,"Smart Email Assistant",{ai:["PROJECT: Smart Email Assistant - Plan architecture","Build: Email inbox reader (Gmail API via n8n) - classify as: urgent/info/spam","Python: Write helper functions for email text cleaning","Claude: Design system prompt for email classification with few-shot examples","Portfolio: Create project page in Notion for Email Assistant"],mech:["Dynamics: Mechanical vibrations intro - free undamped vibration","ODE: Spring-mass equation - solve for x(t)","Engineering Drawing: Full drawing - shaft + bearing assembly (3 views + section)","Calculus: Fourier series intro - represent square wave as sum of sinusoids"],eng:["Learn 5 words: vibration, damping, amplitude, frequency, resonance","Read: Engineering article on mechanical vibrations","Prompt: Design a prompt template for explaining physics problems step-by-step"]}],
 [30,5,3,"Email Assistant Testing",{ai:["Build: Add urgency scoring (1-5) using Claude; route urgent - Slack alert","n8n: Store all emails + classifications in Airtable with timestamps","Test: Send 20 test emails; check classification accuracy","Python: Write a script to evaluate classification results (accuracy %)","Debug: Find and fix at least 2 workflow errors"],mech:["Dynamics: Damped vibrations - overdamped, underdamped, critically damped","Problem: Given k=500 N/m, m=2 kg, c=40 Ns/m - classify and solve","Engineering Drawing: Tolerance stack-up exercise - 3-part assembly","Calculus: Numerical integration - trapezoidal rule, Simpson's rule (3 problems)"],eng:["Learn 5 words: overdamped, underdamped, critical, natural frequency, period","Writing: Write a 250-word project description for the Email Assistant","Prompt: Build a prompt that generates test cases for an automation workflow"]}],
 [31,5,3,"Data Pipeline Automation",{ai:["PROJECT 2: Data Pipeline Automation","Build: n8n workflow - download CSV from URL - parse - calculate stats","Python: pandas - compute mean, median, std dev, trend for each column","Claude: Prompt that generates an executive summary from statistics","Portfolio: Add project plan to Notion"],mech:["Dynamics: Forced vibrations - steady-state response, magnification factor","Problem set: 3 forced vibration problems (varying excitation frequency)","Engineering Drawing: FreeCAD - fully constrained sketch with dimensions","Statics: Review all beam types; sketch SFD and BMD for 3 beam configurations"],eng:["Learn 5 words: forced vibration, magnification, excitation, steady-state, transient","Summarize: Write an abstract (150 words) for your Data Pipeline project","Prompt: Format raw data stats into a readable executive summary"]}],
 [32,5,3,"Google Slides Auto-Generator",{ai:["Build: Google Slides auto-generator using Google Slides API + n8n","Make.com: Parallel processing - handle multiple CSV files simultaneously","Python: matplotlib - auto-generate bar chart + line chart saved as PNG","Portfolio: Write case study for Data Pipeline (problem - solution - result)","GitHub: Commit all new code with descriptive messages"],mech:["Mechanics of Materials: Torsion - tau = Tr/J; twist angle phi = TL/GJ (4 problems)","Calculus: Applications of ODE - RC circuit equation","Engineering Drawing: FreeCAD - create threaded bolt (use standard library part)","FBD: Complex frame - 2 members, pin joints, external load - full solution"],eng:["Learn 5 words: torsion, shear modulus, polar moment, twist, shaft","Read: Abstract of a published engineering paper; rewrite in simpler language","Prompt: Build a case study writer prompt with specific sections"]}],
 [33,5,3,"Social Content Scheduler",{ai:["PROJECT 3: AI-Powered Social Content Scheduler","Build: Make.com - topic input (Typeform) - Claude draft - Google Sheet queue","Python: Rate-limit-aware API caller with retry logic","Test: Generate a week of posts for a fake engineering tips account","Portfolio: Add to Notion with screenshots"],mech:["Mechanics of Materials: Deflection of beams - double integration method","Problem: Find deflection at midspan for simply supported beam (UDL)","Engineering Drawing: Isometric drawing challenge - complex L-shaped part","ODE application: Beam deflection EI times y double prime = M(x) - solve for y(x)"],eng:["Learn 5 words: deflection, slope, curvature, elastic curve, boundary condition","Speaking: Record 3-min pitch: Here is a project I built and what it can do","Prompt: Write a prompt that turns a bullet list into 7 engaging social posts"]}],
 [34,5,3,"Claude Code Intermediate",{ai:["Claude Code intermediate: use /add to add multiple files to context","Build: Refactor your Email Assistant into a clean Python package with modules","n8n: Add monitoring dashboard - track workflow run counts, errors, durations","Make.com: Scenario versioning - save a version before making changes","Exercise: Write 5 advanced prompts using XML-tag structuring"],mech:["Structural analysis: Statically indeterminate beams - compatibility equations","Calculus: Multiple integrals (intro) - double integral over rectangular region","Engineering Drawing: FreeCAD - assemble bolt + nut + washer as an assembly","Problem set: 5 combined stress problems (bending + torsion)"],eng:["Learn 5 words: indeterminate, compatibility, redundant, superposition, integration","Write: A 300-word personal statement paragraph for a scholarship application","Prompt: Multi-turn prompt simulation - build a prompt conversation for interviews"]}],
 [35,5,3,"Halfway Checkpoint",{ai:["List all projects built (should be 6-8+ workflows)","Pick top 3; polish their README, screenshots, and case studies","Python: Code review all scripts; ensure clean formatting (PEP8 via flake8)","Freelance: Post your first Fiverr gig (or create draft if not ready)","Set Week 6-8 goals in writing"],mech:["Full timed test: 15 problems across all topics (60 min)","Review all Engineering Drawing exercises; identify weakest sketches","FreeCAD: Export a drawing sheet from your assembly model","List 3 ODE/calculus topics that need more practice"],eng:["Vocabulary: 175 words reviewed","Write: 1-page Learning Journey reflection (what worked, what to improve)","Prompt Library: Review and improve your top 10 prompts"]},"r"],
 [36,6,3,"Knowledge Base Bot",{ai:["Advanced n8n: Custom function nodes with full JS logic","Build: Knowledge Base Bot - load 10 FAQ pairs - n8n + Claude answers queries","Python: SQLAlchemy basics - ORM to interact with SQLite/PostgreSQL","Make.com: Build multi-branch flow - user type A - path 1, type B - path 2","Study: Prompt injection attacks and defenses in production AI systems"],mech:["Heat Transfer intro: Conduction - Fourier's law q = -kA(dT/dx)","ODE: Steady-state heat equation for a fin - solve the BVP","Engineering Drawing: FreeCAD - create a 3D threaded socket with holes","Calculus: Partial differential equations intro - heat equation"],eng:["Learn 5 words: conduction, convection, radiation, thermal, gradient","Read: Wikipedia on Mechanical Engineering curriculum - note CUET-relevant subjects","Prompt: Write a prompt to generate a study plan for a specific topic"]}],
 [37,6,3,"Document Analyzer",{ai:["Build: Document Analyzer - upload PDF - Claude extracts key info + summary","n8n: File handling - receive file attachment in webhook - process - store","Make.com: Google Drive - parse PDF - store extracted text in Notion","Claude Code: Build a PDF extraction CLI tool with argparse","Portfolio: Add Document Analyzer case study"],mech:["Fluid Mechanics intro: Pressure, Pascal's law, Bernoulli's equation","Problem: Water flows through pipe - calculate velocity using Bernoulli","Engineering Drawing: Pipe and fitting drawing with standard symbols","Calculus: Line integrals (intro) - work done by a force along a curve"],eng:["Learn 5 words: fluid, pressure, viscosity, flow rate, turbulent","Writing: Write a 200-word technical blog intro about AI document processing","Prompt: Document analyst system prompt with structured JSON output"]}],
 [38,6,3,"Deploy Email Assistant",{ai:["Python: Environment setup for deployment - Docker basics (Dockerfile, docker run)","Study: How to deploy n8n on a VPS (DigitalOcean/Railway) - read tutorial","Make.com: Webhook security - IP whitelisting, header authentication","Build: Deploy your Email Assistant to a free server (Railway or Render)","Portfolio: Update Notion with deployment details; add live demo link"],mech:["Dynamics: Gyroscopic motion and precession - conceptual + 1 problem","Calculus: Green's theorem and Stokes' theorem (conceptual overview)","Engineering Drawing: Full drawing set for a 3-part assembly in FreeCAD","ODE Review: Solve 5 mixed ODEs - first-order, second-order, Laplace"],eng:["Learn 5 words: deploy, container, server, host, environment","Speaking: Record 4-min technical presentation on how your Email Assistant works","Prompt: Build a prompt to generate a deployment README for a project"]}],
 [39,6,3,"Testing & Eigenvalues",{ai:["Python: Unit testing with pytest - write tests for your helper functions","Claude Code: Let it generate tests for your Email Assistant codebase","n8n: Monitor workflow health - add SLA tracking","Make.com: Build an AI research assistant - topic - search - Claude summary - email","Freelance: Search Upwork for AI automation jobs; analyze top 5 job descriptions"],mech:["Engineering Mathematics: Eigenvalues and eigenvectors - 3 examples","Application: Natural frequencies of a 2-DOF mass-spring system","Engineering Drawing: FreeCAD - drafting a worm gear from dimensions","FBD comprehensive: 3D space frame - identify all forces and moments"],eng:["Learn 5 words: eigenvalue, eigenvector, matrix, determinant, natural mode","Writing: Write a Upwork proposal for an automation job description you found","Prompt: Proposal writer - job description - professional Upwork proposal"]}],
 [40,6,3,"Week 6 Review",{ai:["Deploy at least 1 project publicly; share the link","Python: Refactor your best project; add comprehensive error handling","Review freelance strategy: what 1 service can you deliver in under 3 days?","Write: A services menu doc listing your 3 core automation offerings"],mech:["Timed test: 12 problems - dynamics + ODE + drawing interpretation - 60 min","FreeCAD challenge: Model a component you designed from scratch","Calculus: Speed-run 10 mixed integral problems - 30 min","Identify your top 3 engineering drawing weaknesses"],eng:["Review all 200+ words; test yourself on the last 60","Draft scholarship essay: Why I chose Mechanical Engineering (300 words)","Prompt Portfolio: Tag your prompts by category in Notion"]},"r"],
 [41,7,4,"Lead Capture System",{ai:["FREELANCE PROJECT: Client Lead Capture Automation System","Build: Typeform webhook - n8n - Claude lead scoring - Pipedrive CRM entry","Python: Write a lead scoring algorithm (rule-based + Claude verification)","Fiverr/Upwork: Publish or refine your gig with this project as portfolio piece","Plan: Define inputs, outputs, n8n + Claude architecture diagram"],mech:["Differential Equations deep dive: Solving systems of ODEs (matrix method)","Application: 2-DOF vibration system - write and solve matrix ODE","Engineering Drawing: Full GD&T basics - straightness, flatness, roundness symbols","Calculus: Fourier transforms (intro) - frequency domain interpretation"],eng:["Learn 5 words: qualify, prospect, pipeline, conversion, outreach","Writing: Write a client case study narrative for the lead system","Prompt: Build a lead qualifier system prompt with scoring rubric"]}],
 [42,7,4,"Lead Capture - SMS & CRM",{ai:["Add SMS via Twilio - instant alert to sales team for high-score leads","Make.com: Parallel path - simultaneously update CRM and send Slack notification","Python: Build a dashboard script - print daily lead counts, avg score, top source","Test: Run 20 mock leads; review accuracy; refine Claude scoring prompt","Portfolio: Document Lead Capture System with screenshots"],mech:["Engineering Mechanics: Lagrangian mechanics intro - generalized coordinates","Problem: Derive equation of motion for a pendulum using Lagrangian method","Engineering Drawing: Complete a full drawing set (3 parts + assembly + BOM) in FreeCAD","ODE Review: Laplace transform method for second-order system"],eng:["Learn 5 words: Lagrangian, generalized, constraint, degree of freedom, pendulum","Speaking: Record 5-min project walkthrough of the Lead Capture System","Prompt: Design a system prompt for a sales qualification assistant"]}],
 [43,7,4,"FastAPI Wrapper & Beam Buckling",{ai:["Python: Build a REST API wrapper for your Lead Capture System using FastAPI","Claude Code: Add API documentation with docstrings - auto-generate OpenAPI spec","n8n: Add retry and circuit-breaker logic for all external API calls","Study: AI pricing strategies for freelancing (hourly vs project vs retainer)","Portfolio: Write a 400-word case study for the Lead Capture System"],mech:["Differential equations: Boundary value problems (BVP) - shooting method concept","Application: Beam buckling - Euler column formula","Engineering Drawing: Geometric tolerance application - position tolerance","Calculus: Numerical methods - Euler method for ODE (solve by hand, 5 steps)"],eng:["Learn 5 words: buckling, critical load, slenderness ratio, column, Euler","Write: Technical presentation outline (5 slides) for your best project","Prompt: PowerPoint outline generator - topic - slide-by-slide structure"]}],
 [44,7,4,"Self-Critique Prompts",{ai:["Advanced Claude prompting: Constitutional AI, self-critique, chain-of-verification","Exercise: Take a complex task; write a self-critique prompt chain (5 steps)","n8n: Version control - export all workflows to JSON; commit to GitHub","Make.com: Build a personal productivity assistant - daily task emails + Pomodoro tracker","Freelance: Write 3 cold outreach messages for potential local clients"],mech:["Comprehensive problem: Full machine design problem (shaft under combined loading)","Engineering Drawing: FreeCAD - parametric model of a machine component","Calculus: Numerical methods - Runge-Kutta 4th order (concept + 1 worked example)","Review: Go through all ODE techniques; create a decision flowchart"],eng:["Learn 5 words: parametric, constraint, feature, sketch, extrude","Scholarship: Write a 300-word statement of purpose for a hypothetical scholarship","Prompt: Scholarship essay editor - paste draft - get feedback + improved version"]}],
 [45,7,4,"Streamlit Dashboard",{ai:["Python: Web app with Streamlit - build a frontend for your Lead Capture dashboard","Claude Code: Add a chat interface to your Streamlit app","n8n: Multi-tenant design - workflows that work for multiple clients with config","Build: Universal webhook dispatcher - one endpoint - route to right workflow","Portfolio: Record a 5-min screen-recording demo of your Streamlit dashboard"],mech:["Differential equations: Partial DEs - 1D wave equation intro","Engineering Drawing: Full CUET exam-style drawing problem (given problem + solve)","Calculus: Series solutions of ODEs - Frobenius method (1 example)","Dynamics: Energy method for finding natural frequencies (Rayleigh's method)"],eng:["Learn 5 words: wave equation, propagation, boundary, standing wave, node","Speaking: Present your Lead Capture System in 7 minutes to a camera","Prompt: Streamlit UI description to code - describe a UI, get working code"]}],
 [46,7,4,"Multi-Agent Architecture & FEA",{ai:["Study: Multi-agent architectures - orchestrator + worker agent pattern","Build: 2-agent system in n8n - Agent 1: research - Agent 2: write report","Python: Implement a simple agent loop (think - act - observe - repeat)","Make.com: Complex scenario with 15+ modules - event management pipeline","Freelance: Apply to 3 AI automation jobs on Upwork (write tailored proposals)"],mech:["Engineering applications: Finite Element Analysis (FEA) concept - nodes, elements, DOF","FreeCAD FEM Workbench: Run a simple stress analysis on your L-bracket model","Calculus: Green's functions (concept) - solving PDEs with specific BCs","Engineering Drawing: Final comprehensive drawing exercise - multi-part assembly"],eng:["Learn 5 words: finite element, mesh, node, DOF, simulation","Read: Article about FEA in engineering; write a 5-sentence summary","Prompt: Multi-agent task decomposer - complex task - subtask list + agents"]}],
 [47,7,4,"Week 7 Review",{ai:["Demo your Lead Capture System to yourself as if presenting to a client","Python test: Build a working chatbot CLI in 45 min from scratch","Review all Upwork proposals sent; iterate based on results","GitHub: Ensure 3 repositories have polished README files with screenshots"],mech:["Timed comprehensive exam: 18 problems (all topics) - 90 min","FreeCAD: Create a new part from scratch - no reference","ODE marathon: 8 ODEs in 60 min (all types)","Identify 2 final topics to master before Day 60"],eng:["Full vocabulary test: all 235 words","Write: A 500-word blog post about AI automation for beginners","Prompt Mastery: Can you write a prompt that reliably produces perfect outputs?"]},"r"],
 [48,8,4,"Capstone - Business Suite",{ai:["CAPSTONE: AI-Powered Business Operations Suite","Architecture: Design system diagram (blocks, data flows, tools used)","Build: Module 1 - Lead intake form - qualify - CRM (refine from Week 7)","Claude Code: Create a project workspace; add all modules as subfolders","Plan: Define all 4 modules with inputs/outputs"],mech:["Differential equations comprehensive review: All types - 60 min timed (12 ODEs)","Engineering Drawing: Complete CUET-style drawing exam paper (3 questions - 90 min)","Calculus review: Integrals, derivatives, optimization, series - 20-problem sprint","Review: Any remaining weak topics"],eng:["Learn 5 words: suite, modular, integrated, scalable, enterprise","Technical writing: Write an executive summary for your capstone project","Prompt: System architecture explainer - describe a system, get plain-English summary"]}],
 [49,8,4,"Capstone - Email Triage",{ai:["Capstone Module 2: Email triage + auto-responder for routine queries","Build: Classify incoming email - if FAQ match - Claude drafts reply - human approves","Python: Build an approval queue (pending replies stored in Airtable)","n8n: Human-in-the-loop pattern - workflow pauses and waits for human approval","Test Module 2 with 30 simulated emails"],mech:["Engineering Mechanics: Comprehensive statics review","Problem: Bridge truss - 10 members, find all member forces","Engineering Drawing: FreeCAD - create a technical drawing sheet with all standard views","Application: Design a simple bracket - choose dimensions to satisfy stress limit"],eng:["Learn 5 words: approval, escalate, triage, queue, protocol","Prompt: Email auto-responder system prompt - write for 3 different business types","Writing: Update LinkedIn bio (or draft one) to reflect your new skills"]}],
 [50,8,4,"Capstone - Report Generator",{ai:["Capstone Module 3: Weekly report generator (analytics + narrative)","Build: Pull data from 3 sources - Claude writes narrative summary - format as PDF/Slides","Python: Build a report template filler using Jinja2","Make.com: Trigger report every Sunday 8 AM; email to stakeholder list","Test: Run report generator for a simulated 4-week dataset"],mech:["Mechanical Engineering breadth review: Thermodynamics - 1st and 2nd law statements","Manufacturing: Common processes - casting, forging, machining, welding (brief)","Engineering Drawing: Full drawing of a machined component with GD&T symbols","Calculus: Applications in heat transfer and fluid flow - 3 worked examples"],eng:["Learn 5 words: thermodynamics, entropy, process, cycle, efficiency","Speaking: Record 6-min technical walkthrough of your capstone system","Prompt: Report narrative generator - statistics input - compelling business narrative"]}],
 [51,8,4,"Capstone - Social Media",{ai:["Capstone Module 4: Social media content pipeline","Build: Weekly blog topic - research - Claude writes post - format - schedule","Python: Automate post formatting for LinkedIn, Twitter, Instagram","Claude Code: Add a tone checker feature to ensure posts match brand voice","Integrate all 4 modules - test end-to-end with a complete week simulation"],mech:["Engineering Drawing: Final comprehensive exercise (exam simulation - 2 hrs)","ODE application: Model a real system (damped spring + force) - solve completely","Statics: 3D problem - space frame with 6 unknowns - solve completely","Topics: Orthographic, isometric, section, exploded, GD and T, FreeCAD export"],eng:["Learn 5 words: tone, brand voice, engagement, content calendar, scheduling","Writing: Write a 400-word product description for your Business Operations Suite","Prompt: Brand voice analyzer - paste text - identify tone + suggestions"]}],
 [52,8,4,"Client Docs & Exam Sim #1",{ai:["Capstone: Client documentation package - user manual, setup guide, FAQ, pricing sheet","Python: Auto-generate markdown docs from your code docstrings","Portfolio site: Publish capstone project as featured case study","Upwork/Fiverr: Add capstone to your profile; update skills and bio","Write your AI Automation Services one-page pitch document"],mech:["Pre-CUET exam simulation 1: Calculus 10 problems (40 min), Statics 6 problems (30 min), Dynamics 4 problems (20 min)","Review all answers; mark errors for Day 53 revision","Identify topics that need one final pass"],eng:["Learn 5 words: documentation, manual, FAQ, onboarding, user experience","Prompt: Write a prompt that generates a FAQ section from a product description","Write: Draft a thank-you email template for a completed freelance project"]}],
 [53,8,4,"Mock Freelance Day",{ai:["Mock freelance project: Treat yourself as a real client","Requirement: Build me an automation that saves 3 hours/week of manual work","Plan - Build - Test - Document - Deliver (simulate full workflow in 5 hours)","Time yourself: Can you deliver professional quality in one working day?","Review: What took longest? What would you do differently?"],mech:["Pre-CUET exam simulation 2: Engineering Drawing 2 problems (60 min), Differential Equations 6 problems (40 min), FBD + Work-Energy 4 problems (30 min)","Review errors; mark topics for final revision"],eng:["Learn 5 words: deliver, milestone, revision, feedback, approval","Scholarship: Finalize and polish your 500-word statement of purpose","Prompt: Final challenge - write a prompt that solves a complex real problem"]}],
 [54,8,4,"Final Portfolio Polish",{ai:["GitHub: All repos have README, screenshot, live demo link","Notion: Portfolio has 5+ projects with case studies","Fiverr/Upwork: Profile 100% complete - photo, bio, skills, samples","Write your AI Automation Services one-page pitch document","Record a 2-min profile video (or script) for your freelance profile"],mech:["FreeCAD: Export 5 technical drawings as PDF - your best work","Draw from memory: isometric + orthographic of a given part - 45 min each","Review all GD&T symbols; write example for each","Prepare a drawing notes cheat sheet for CUET reference"],eng:["Learn 5 words: portfolio, testimonial, deliverable, scope, retainer","Write: 3 LinkedIn posts about your 60-day learning journey","Prompt: LinkedIn post writer - personal achievement - professional narrative"]}],
 [55,8,4,"Prompt Testing Harness",{ai:["Advanced prompt mastery: LLM fine-tuning concepts (theory only)","Study: Constitutional AI, RLHF, system prompt best practices for production","Build: Prompt testing harness - run same task with 10 different prompts; compare","Python: Automate prompt A/B testing; log results to CSV + score with LLM judge","Document: Your top 20 prompts with labels, use cases, and output examples"],mech:["CUET prep - Calculus final review: Speed test 15 derivative + 10 integral problems (45 min)","Taylor series: Expand 3 functions around x=0","ODE: Solve 6 problems (mixed) - 40 min","Graph: Sketch solutions to 3 ODEs (qualitative understanding)"],eng:["Learn 5 words: fine-tuning, constitutional, alignment, inference, benchmark","Speaking: Record a 7-min AI Automation for Engineers mini-lecture","Prompt: Write the most refined version of your Mechanical Engineering Tutor prompt"]}],
 [56,8,4,"Prompt Library App",{ai:["Build: Prompt Library web app with Streamlit - search, filter, copy prompts","Python: Add prompt categories, tags, and rating system to the app","Claude Code: Full session - let Claude Code review and improve the Streamlit app","Deploy: Deploy the Prompt Library to Streamlit Community Cloud (free)","Share: Post your Prompt Library link in a relevant community (Reddit, Discord)"],mech:["CUET prep - Mechanics final review: Statics 8 problems (50 min), Dynamics 6 problems (40 min)","Combined: 3 problems requiring calculus + mechanics integration (30 min)","Self-grade everything; note remaining weak points"],eng:["Learn 5 words: deploy, community, share, open-source, contribution","Writing: Write a technical post: 5 AI Automation Tools Every Engineer Should Know","Prompt: Final prompt challenge - generate a full study plan from a topic description"]}],
 [57,8,4,"Catch-Up & Deep Dive",{ai:["Catch up day OR explore one new tool you are curious about","Option A: Try LangChain (Python) - build a basic document Q&A chain","Option B: Explore Flowise (visual LangChain) - build a PDF chatbot without code","Option C: Deep dive into Make.com AI modules - build an advanced scenario","GitHub: Final commit and push for all projects; ensure no broken files"],mech:["Engineering Drawing: Draw 3 complex problems from a past engineering textbook","Calculus: Work through a full Chapter Review (integrals, series, ODEs)","ODE comprehensive: 10 problems, all types, 60 min timed","FBD: 5 challenging problems - check answers and understand errors"],eng:["Learn 5 words: choose 5 words from any engineering field you find interesting","Read: An article about a CUET mechanical engineering research project","Prompt: Refine your best 5 prompts; add them to your Prompt Library app"]}],
 [58,8,4,"Final Review & Synthesis",{ai:["Final AI review: Can you explain LLMs, n8n, and prompt engineering clearly?","Can you build: A working automation in under 2 hours?","Can you sell: Do you have a portfolio and gig ready?","Write: My AI Automation Skills Summary - 1-page document","Reflect: What will you continue building during your first semester at CUET?"],mech:["Final review: Can you solve any FBD problem including 3D?","Can you draw: Full technical drawing with GD&T in FreeCAD?","Write: Mechanics Cheat Sheet - 2 pages covering all key formulas","Reflect: Which CUET subjects will be easiest/hardest based on your prep?"],eng:["Vocabulary log: 290 words collected over 60 days","Can you write: A professional email, cover letter, project summary?","Write: Final reflection: What I will bring to CUET on Day 1","Prompt Mastery: You have a personal Prompt Library with 20+ tested prompts"]}],
 [59,8,4,"Final Showcase Prep",{ai:["Select your 3 best projects for a final demo","Prepare a 10-min presentation (slides or demo walkthrough)","Record yourself presenting each project - watch it back critically","Polish GitHub profile: profile README, pinned repos","Set 30-day post-CUET goals: freelancing, new tools, first income target"],mech:["FINAL EXAM SIMULATION: Full 3-hour engineering paper","Calculus: 5 problems, Mechanics: 8 problems, Drawing: 2 problems","No notes allowed - simulate real exam conditions","Grade yourself honestly; write a score out of 100"],eng:["Write a 500-word cover letter for a prestigious engineering scholarship","Record a 5-min video: My 60-day journey to CUET","Final prompt: Write the best prompt you have ever written"]}],
 [60,8,4,"Graduation Day!",{ai:["Final showcase: Demo all 3 best projects (record for portfolio)","Celebrate: You are now an AI Automation Engineer with a live portfolio","Plan next 30 days: 1 freelance client, 2 new tool explorations, daily coding","Write a LinkedIn post: 60 days, 10+ projects, 1 goal - ready for CUET","Thank yourself for showing up every day"],mech:["Review your Mechanics Cheat Sheet - your CUET survival guide","Open your FreeCAD models - print or save your best drawings","Re-solve Day 1 FBD problems - see how far you have come","Write: Engineering concepts I am confident in vs Topics to continue","You enter CUET ahead of 90% of your batch on fundamentals"],eng:["Count your vocabulary notebook - you have 300 new technical words","Re-read your Day 1 writing - compare to today's writing quality","Review your Prompt Library - you are now a prompt engineer","Set one 60-day English goal for your first semester at CUET","You are ready. Go build. Go learn. Go succeed."]},"g"],
];

// Parse RAW into structured objects
const DD = RAW.map(r => ({
  day: r[0], week: r[1], phase: r[2], title: r[3],
  blocks: {
    ai:   { label: BM.ai.label,   hours: 5, tasks: r[4].ai },
    mech: { label: BM.mech.label, hours: 3, tasks: r[4].mech },
    eng:  { label: BM.eng.label,  hours: 1, tasks: r[4].eng },
  },
  isReview:     r[5] === "r",
  isGraduation: r[5] === "g",
}));

const TOTAL_TASKS = DD.reduce((s,d) => s + d.blocks.ai.tasks.length + d.blocks.mech.tasks.length + d.blocks.eng.tasks.length, 0);

// ── App ──────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]         = useState(true);
  const [prog, setProg]         = useState({});
  const [notes, setNotes]       = useState({});
  const [view, setView]         = useState("dash"); // dash | day | task | chat
  const [selDay, setSelDay]     = useState(null);
  const [selTask, setSelTask]   = useState(null);
  const [aiFb, setAiFb]         = useState({});
  const [aiLoad, setAiLoad]     = useState(false);
  const [startDate, setStart]   = useState(null);
  const [chatMsgs, setChatMsgs]       = useState([]);
  const [chatInput, setChatInput]     = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [geminiHist, setGeminiHist]   = useState([]);

  const th = dark ? T.dark : T.light;

  useEffect(() => {
    (async () => {
      try { const x = await window.storage.get("p4"); if(x) setProg(JSON.parse(x.value)); } catch{}
      try { const x = await window.storage.get("n4"); if(x) setNotes(JSON.parse(x.value)); } catch{}
      try { const x = await window.storage.get("s4"); if(x) setStart(x.value); } catch{}
      try { const x = await window.storage.get("f4"); if(x) setAiFb(JSON.parse(x.value)); } catch{}
      try { const x = await window.storage.get("t4"); if(x) setDark(x.value==="dark"); } catch{}
    })();
  }, []);

  const sv  = async (k,v) => { try { await window.storage.set(k,v); } catch{} };
  const toggleTheme = () => { const n=!dark; setDark(n); sv("t4", n?"dark":"light"); };
  const saveProg    = async (np) => { setProg(np); sv("p4", JSON.stringify(np)); };
  const saveNotes   = async (nn) => { setNotes(nn); sv("n4", JSON.stringify(nn)); };
  const toggleTask  = useCallback(async (dn,bl,i) => {
    const k = dn+"-"+bl+"-"+i;
    await saveProg({...prog, [k]: !prog[k]});
  }, [prog]);

  const getCnt = (dn) => {
    const d = DD[dn-1]; if(!d) return {done:0,total:0};
    let done=0, total=0;
    for(const [b,data] of Object.entries(d.blocks)) {
      total += data.tasks.length;
      data.tasks.forEach((_,i) => { if(prog[dn+"-"+b+"-"+i]) done++; });
    }
    return {done,total};
  };
  const getPct = (dn) => { const {done,total}=getCnt(dn); return total>0?Math.round(done/total*100):0; };

  const doneTasks = Object.values(prog).filter(Boolean).length;
  const daysDone  = DD.filter(d=>getPct(d.day)===100).length;
  const today     = startDate ? Math.min(60,Math.max(1,Math.floor((Date.now()-new Date(startDate).getTime())/86400000)+1)) : 1;

  const getAI = async (dn) => {
    setAiLoad(true);
    const d=DD[dn-1]; const {done,total}=getCnt(dn);
    const doneList = Object.entries(d.blocks).flatMap(([b,data])=>data.tasks.filter((_,i)=>prog[dn+"-"+b+"-"+i])).slice(0,4);
    try {
      const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
          system:"You are AAM's personal study coach. AAM (Md. Ashraful Alam Mazid) is a new CUET Mechanical Engineering student following a 60-day pre-campus preparation plan covering AI Automation, Engineering fundamentals, and English. He aims to earn freelance income on Upwork/Fiverr. Be warm, direct, specific. Under 160 words. Use emojis naturally.",
          messages:[{role:"user",content:"Day "+dn+" - "+d.title+" | "+done+"/"+total+" tasks done ("+Math.round(done/total*100)+"%)\nCompleted: "+doneList.join(" | ")+"\nNotes: "+(notes[dn]||"No notes")+"\nGive: 1) Progress assessment 2) Specific insight 3) Push for remaining 4) Tip for Day "+Math.min(60,dn+1)}]})});
      const data = await r.json();
      const txt = data.content?.[0]?.text || "Keep going! Every task counts.";
      const nf = {...aiFb,[dn]:{text:txt,time:new Date().toLocaleString("en-BD")}};
      setAiFb(nf); sv("f4",JSON.stringify(nf));
    } catch {
      const nf = {...aiFb,[dn]:{text:"Great work on Day "+dn+"! "+done+"/"+total+" tasks done. Stay consistent - you are building skills that will serve you for life!",time:new Date().toLocaleString("en-BD")}};
      setAiFb(nf); sv("f4",JSON.stringify(nf));
    }
    setAiLoad(false);
  };

  // ── Send chat to Claude (AI Teacher) ───────────────────────────
  const sendChat = async (inputText) => {
    if (!inputText.trim()) return;
    setChatMsgs(prev => [...prev, { role:"user", text: inputText.trim() }]);
    setChatInput("");
    setChatLoading(true);

    const dayCtx = startDate
      ? "AAM is currently on Day " + today + " of the 60-day plan (" + (DD[today-1]?.title||"") + "). Overall progress: " + Math.round(Object.values(prog).filter(Boolean).length / TOTAL_TASKS * 100) + "% complete."
      : "AAM has not started the plan yet.";

    // Build full multi-turn message history for Claude
    const claudeMessages = [
      ...geminiHist.map(m => ({ role: m.r, content: m.t })),
      { role:"user", content: inputText.trim() }
    ];

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: TEACHER_SYSTEM + " " + dayCtx,
          messages: claudeMessages
        })
      });
      const data = await r.json();
      const reply = data?.content?.[0]?.text || "Sorry, I could not get a response. Please try again!";
      setChatMsgs(prev => [...prev, { role:"ai", text: reply }]);
      setGeminiHist(prev => [
        ...prev,
        { r:"user",      t: inputText.trim() },
        { r:"assistant", t: reply }
      ]);
    } catch(e) {
      setChatMsgs(prev => [...prev, { role:"ai", text: "Connection error! Please check your internet and try again." }]);
    }
    setChatLoading(false);
  };

  // ── ThemeToggle component ────────────────────────────────────────
  const ThemeBtn = () => (
    <button onClick={toggleTheme}
      style={{background:th.toggleBg,border:"1px solid "+th.border2,borderRadius:"10px",padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>
      <span style={{fontSize:"17px"}}>{th.toggleIcon}</span>
      <span style={{fontSize:"12px",color:th.sub,fontFamily:FONT,fontWeight:"600"}}>{th.toggleLabel}</span>
    </button>
  );

  // ── AI TEACHER CHAT PAGE ─────────────────────────────────────────
  if (view === "chat") {
    const QUICK = [
      "Explain limits in calculus with a simple example",
      "How does n8n webhook work? Give me a beginner example",
      "What is a Free Body Diagram? Show me step by step",
      "Explain Python OOP with a real-world analogy",
      "What is the Work-Energy theorem? Solve a simple problem",
      "How does Claude Code work and how do I start?",
      "What is prompt engineering? Teach me the basics",
      "Explain differential equations with a simple example",
      "How do I draw an isometric view in engineering drawing?",
      "What is RAG in AI? Explain simply",
    ];
    return (
      <div style={{minHeight:"100vh",background:th.bg,fontFamily:FONT,color:th.text,display:"flex",flexDirection:"column"}}>
        <link href={GOOGLE_FONT} rel="stylesheet"/>
        {/* Header */}
        <div style={{background:th.surface,borderBottom:"1px solid "+th.border,padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",flexShrink:0,position:"sticky",top:0,zIndex:50}}>
          <button onClick={()=>setView("dash")} style={{background:th.card,border:"1px solid "+th.border2,color:th.sub,padding:"8px 14px",borderRadius:"10px",cursor:"pointer",fontFamily:FONT,fontSize:"15px",flexShrink:0}}>
            Home
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:"18px",fontWeight:"800",color:th.text}}>Sir Alam - AI Teacher</div>
            <div style={{fontSize:"12px",color:"#10B981",marginTop:"2px",display:"flex",alignItems:"center",gap:"5px"}}>
              <span style={{width:"7px",height:"7px",background:"#10B981",borderRadius:"50%",display:"inline-block"}}></span>
              Powered by Claude AI - Always ready to teach
            </div>
          </div>
          <ThemeBtn/>
        </div>

        {/* Chat messages area */}
        <div id="chat-scroll" style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:"14px",maxWidth:"720px",width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

          {/* Welcome message */}
          {chatMsgs.length === 0 && (
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div style={{background:"linear-gradient(135deg,#1A1035,#1E293B)",border:"1px solid #7C3AED44",borderRadius:"16px",padding:"20px"}}>
                <div style={{fontSize:"32px",marginBottom:"8px",textAlign:"center"}}>{String.fromCodePoint(128104,8205,127979)}</div>
                <div style={{fontSize:"18px",fontWeight:"700",color:th.text,textAlign:"center",marginBottom:"6px"}}>Assalamu Alaikum, AAM!</div>
                <div style={{fontSize:"15px",color:th.sub,lineHeight:"1.7",textAlign:"center"}}>
                  I am <strong style={{color:"#A78BFA"}}>Sir Alam</strong>, your personal AI Teacher. I am here to explain anything from your 60-day plan - Calculus, Python, n8n, FBD, ODEs, Engineering Drawing, Prompt Engineering, or anything else you need help with!
                </div>
              </div>
              <div style={{fontSize:"13px",fontWeight:"700",color:th.muted,letterSpacing:"1px",textAlign:"center",textTransform:"uppercase"}}>Quick Questions to Start</div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {QUICK.map((q,i) => (
                  <button key={i} onClick={()=>sendChat(q)}
                    style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"10px",padding:"12px 16px",cursor:"pointer",fontFamily:FONT,fontSize:"14px",color:th.text,textAlign:"left",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#7C3AED";e.currentTarget.style.background=dark?"#1E1B4B22":"#EDE9FE";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.background=th.surface;}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {chatMsgs.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:isUser?"flex-end":"flex-start",gap:"4px"}}>
                <div style={{fontSize:"11px",color:th.muted,marginBottom:"2px",paddingLeft:isUser?"0":"4px",paddingRight:isUser?"4px":"0"}}>
                  {isUser ? "You" : "Sir Alam"}
                </div>
                <div style={{
                  maxWidth:"88%",
                  background: isUser ? "linear-gradient(135deg,#7C3AED,#3B82F6)" : th.surface,
                  color: isUser ? "white" : th.text,
                  border: isUser ? "none" : "1px solid "+th.border,
                  borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  padding:"13px 16px",
                  fontSize:"15px",
                  lineHeight:"1.7",
                  whiteSpace:"pre-wrap",
                  wordBreak:"break-word",
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {chatLoading && (
            <div style={{display:"flex",alignItems:"flex-start",gap:"4px",flexDirection:"column"}}>
              <div style={{fontSize:"11px",color:th.muted,paddingLeft:"4px"}}>Sir Alam</div>
              <div style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"4px 16px 16px 16px",padding:"14px 18px",display:"flex",gap:"5px",alignItems:"center"}}>
                {[0,1,2].map(j=>(
                  <div key={j} style={{width:"8px",height:"8px",borderRadius:"50%",background:"#7C3AED",animation:"bounce 1.2s infinite",animationDelay:(j*0.2)+"s",opacity:0.7}}></div>
                ))}
                <style dangerouslySetInnerHTML={{__html:"@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}"}} />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{background:th.surface,borderTop:"1px solid "+th.border,padding:"14px 18px",flexShrink:0,position:"sticky",bottom:0}}>
          <div style={{maxWidth:"720px",margin:"0 auto",display:"flex",gap:"10px",alignItems:"flex-end"}}>
            <textarea
              value={chatInput}
              onChange={e=>setChatInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendChat(chatInput); } }}
              placeholder="Ask Sir Alam anything... (Press Enter to send, Shift+Enter for new line)"
              rows={2}
              style={{flex:1,background:th.card,border:"1px solid "+th.border2,borderRadius:"12px",padding:"12px 16px",fontFamily:FONT,fontSize:"15px",color:th.text,resize:"none",outline:"none",lineHeight:"1.5",boxSizing:"border-box"}}
            />
            <button onClick={()=>sendChat(chatInput)} disabled={chatLoading || !chatInput.trim()}
              style={{background: chatLoading||!chatInput.trim() ? th.card : "linear-gradient(135deg,#7C3AED,#3B82F6)",color: chatLoading||!chatInput.trim() ? th.muted : "white",border:"none",borderRadius:"12px",padding:"12px 18px",cursor: chatLoading||!chatInput.trim() ? "not-allowed":"pointer",fontFamily:FONT,fontSize:"22px",flexShrink:0,transition:"all 0.2s",minWidth:"52px"}}>
              {chatLoading ? "..." : "Send"}
            </button>
          </div>
          <div style={{maxWidth:"720px",margin:"6px auto 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:"12px",color:th.muted}}>Claude AI - Ask about any topic in your 60-day plan</div>
            {chatMsgs.length > 0 && (
              <button onClick={()=>{setChatMsgs([]);setGeminiHist([]);}}
                style={{background:"transparent",border:"none",color:th.muted,cursor:"pointer",fontFamily:FONT,fontSize:"12px",textDecoration:"underline"}}>
                Clear chat
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── TASK RESOURCE PAGE ───────────────────────────────────────────
  if (view==="task" && selTask) {
    const {task,block,idx,dayNum} = selTask;
    const resources = getRes(task);
    const bm = BM[block]||BM.ai;
    const done = !!prog[dayNum+"-"+block+"-"+idx];
    return (
      <div style={{minHeight:"100vh",background:th.bg,fontFamily:FONT,color:th.text}}>
        <link href={GOOGLE_FONT} rel="stylesheet"/>
        <div style={{background:th.surface,borderBottom:"1px solid "+th.border,padding:"14px 18px",position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={()=>setView("day")} style={{background:th.card,border:"1px solid "+th.border2,color:th.sub,padding:"8px 16px",borderRadius:"10px",cursor:"pointer",fontFamily:FONT,fontSize:"15px"}}>
            Back
          </button>
          <div style={{flex:1,overflow:"hidden"}}>
            <div style={{fontSize:"12px",color:th.muted}}>{bm.icon} {bm.label} - Day {dayNum}</div>
            <div style={{fontSize:"15px",fontWeight:"600",color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task}</div>
          </div>
          <ThemeBtn/>
        </div>
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"20px 16px 40px"}}>
          <div onClick={()=>toggleTask(dayNum,block,idx)}
            style={{background:th.surface,border:"2px solid "+(done?bm.color+"88":th.border),borderRadius:"14px",padding:"18px 20px",marginBottom:"18px",display:"flex",gap:"14px",alignItems:"flex-start",cursor:"pointer"}}>
            <div style={{width:"26px",height:"26px",borderRadius:"8px",border:"2.5px solid "+(done?bm.color:th.border2),background:done?bm.color:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",marginTop:"2px"}}>
              {done && <span style={{color:"white",fontSize:"13px",fontWeight:"800"}}>{String.fromCharCode(10003)}</span>}
            </div>
            <div>
              <div style={{fontSize:"17px",fontWeight:"600",color:th.text,lineHeight:"1.5",marginBottom:"4px"}}>{task}</div>
              <div style={{fontSize:"13px",color:done?bm.color:th.muted}}>{done?"Completed! Tap to undo.":"Tap to mark complete"}</div>
            </div>
          </div>

          {resources.length > 0 ? (
            <>
              <div style={{fontSize:"13px",fontWeight:"700",color:th.muted,letterSpacing:"2px",marginBottom:"12px",textTransform:"uppercase"}}>
                Learning Resources ({resources.length})
              </div>
              {resources.map((r,i) => {
                const tc = TC[r.type]||TC.website;
                return (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"flex-start",gap:"14px",background:th.surface,border:"1px solid "+th.border,borderRadius:"12px",padding:"16px 18px",marginBottom:"10px",textDecoration:"none",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=tc.color; e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border; e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{width:"42px",height:"42px",borderRadius:"10px",background:dark?tc.dbg:tc.lbg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"20px"}}>
                      {tc.icon}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{background:dark?tc.dbg:tc.lbg,color:tc.color,fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"20px",display:"inline-block",marginBottom:"5px"}}>
                        {tc.label.toUpperCase()}
                      </div>
                      <div style={{fontSize:"15px",fontWeight:"600",color:th.text,lineHeight:"1.4",marginBottom:r.note?"4px":"0"}}>{r.title}</div>
                      {r.note && <div style={{fontSize:"12px",color:th.muted,fontStyle:"italic"}}>Tip: {r.note}</div>}
                    </div>
                    <span style={{color:th.muted,fontSize:"18px",flexShrink:0}}>&#8599;</span>
                  </a>
                );
              })}
            </>
          ) : (
            <div style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"14px",padding:"28px",textAlign:"center",marginBottom:"18px"}}>
              <div style={{fontSize:"36px",marginBottom:"10px"}}>{String.fromCodePoint(128221)}</div>
              <div style={{fontSize:"17px",fontWeight:"600",color:th.text,marginBottom:"8px"}}>Practice Task</div>
              <div style={{fontSize:"15px",color:th.muted,lineHeight:"1.7",marginBottom:"16px"}}>This is a practice or review task. Use what you have already learned. If stuck, ask Claude directly!</div>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",background:"#7C3AED",color:"white",padding:"12px 24px",borderRadius:"10px",textDecoration:"none",fontWeight:"700",fontSize:"15px"}}>
                Ask Claude for Help
              </a>
            </div>
          )}
          <button onClick={()=>{toggleTask(dayNum,block,idx);setView("day");}}
            style={{width:"100%",background:done?th.card:bm.color,color:done?th.sub:"white",border:"2px solid "+(done?th.border2:bm.color),padding:"16px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"17px",fontWeight:"700",marginTop:"8px",transition:"all 0.2s"}}>
            {done?"Completed - Tap to Unmark":"Mark as Complete"}
          </button>
        </div>
      </div>
    );
  }

  // ── DAY PAGE ──────────────────────────────────────────────────────
  if (view==="day" && selDay) {
    const d   = DD[selDay-1];
    const pct = getPct(d.day);
    const {done,total} = getCnt(d.day);
    const fb  = aiFb[d.day];
    const phc = pc(d.phase);
    const nextPhc = DD[d.day] ? pc(DD[d.day].phase) : phc;
    return (
      <div style={{minHeight:"100vh",background:th.bg,fontFamily:FONT,color:th.text}}>
        <link href={GOOGLE_FONT} rel="stylesheet"/>
        <div style={{background:th.surface,borderBottom:"1px solid "+th.border,padding:"14px 18px",position:"sticky",top:0,zIndex:50}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <button onClick={()=>setView("dash")} style={{background:th.card,border:"1px solid "+th.border2,color:th.sub,padding:"8px 14px",borderRadius:"10px",cursor:"pointer",fontFamily:FONT,fontSize:"15px"}}>
              Home
            </button>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px",flexWrap:"wrap"}}>
                <span style={{background:phc,color:"white",padding:"2px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:"700"}}>DAY {d.day}</span>
                {d.isReview     && <span style={{background:"#7C3AED",color:"white",padding:"2px 8px",borderRadius:"10px",fontSize:"11px"}}>Review</span>}
                {d.isGraduation && <span style={{background:"#F59E0B",color:"white",padding:"2px 8px",borderRadius:"10px",fontSize:"11px"}}>Graduation</span>}
              </div>
              <div style={{fontSize:"17px",fontWeight:"700",color:th.text}}>{d.title}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"26px",fontWeight:"800",color:pct===100?"#10B981":phc}}>{pct}%</div>
              <div style={{fontSize:"11px",color:th.muted}}>{done}/{total}</div>
            </div>
            <button onClick={()=>setView("chat")}
              style={{background:"linear-gradient(135deg,#065F46,#047857)",color:"white",border:"none",borderRadius:"10px",padding:"8px 12px",cursor:"pointer",fontFamily:FONT,fontSize:"12px",fontWeight:"700",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}>
              <span style={{fontSize:"16px"}}>{String.fromCodePoint(128104,8205,127979)}</span>
              <span>Sir Alam</span>
            </button>
            <ThemeBtn/>
          </div>
          <div style={{height:"5px",background:th.card,borderRadius:"3px",overflow:"hidden",marginTop:"10px"}}>
            <div style={{height:"100%",width:pct+"%",background:pct===100?"#10B981":phc,borderRadius:"3px",transition:"width 0.4s"}}/>
          </div>
        </div>

        <div style={{maxWidth:"720px",margin:"0 auto",padding:"18px 16px 40px"}}>
          {Object.entries(d.blocks).map(([block,data]) => {
            const bm = BM[block]||BM.ai;
            return (
              <div key={block} style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"14px",marginBottom:"16px",overflow:"hidden"}}>
                <div style={{background:bm.color+"18",borderBottom:"1px solid "+th.border,padding:"14px 18px",display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{fontSize:"22px"}}>{bm.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"16px",fontWeight:"700",color:th.text}}>{data.label}</div>
                    <div style={{fontSize:"13px",color:th.muted}}>{data.hours} hours - {data.tasks.filter((_,i)=>prog[d.day+"-"+block+"-"+i]).length}/{data.tasks.length} done</div>
                  </div>
                </div>
                {data.tasks.map((task,i) => {
                  const isDone = !!prog[d.day+"-"+block+"-"+i];
                  const hasRes = getRes(task).length > 0;
                  return (
                    <div key={i} style={{borderBottom:"1px solid "+th.border,background:isDone?bm.color+"0A":"transparent"}}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"14px 18px"}}>
                        <div onClick={()=>toggleTask(d.day,block,i)}
                          style={{width:"24px",height:"24px",borderRadius:"7px",border:"2px solid "+(isDone?bm.color:th.border2),background:isDone?bm.color:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s",marginTop:"2px"}}>
                          {isDone && <span style={{color:"white",fontSize:"13px",fontWeight:"800"}}>{String.fromCharCode(10003)}</span>}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"15px",color:isDone?th.muted:th.text,lineHeight:"1.5",textDecoration:isDone?"line-through":"none",marginBottom:hasRes?"8px":"0"}}>{task}</div>
                          {hasRes && (
                            <button onClick={()=>{setSelTask({task,block,idx:i,dayNum:d.day});setView("task");}}
                              style={{background:bm.color+"18",border:"1px solid "+bm.color+"44",color:bm.color,padding:"5px 14px",borderRadius:"20px",cursor:"pointer",fontFamily:FONT,fontSize:"13px",fontWeight:"600"}}>
                              View Resources
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

          <div style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"14px",marginBottom:"16px",overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:"1px solid "+th.border,display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontSize:"18px"}}>{String.fromCodePoint(128221)}</span>
              <span style={{fontSize:"16px",fontWeight:"700",color:th.text}}>My Notes - Day {d.day}</span>
            </div>
            <textarea value={notes[d.day]||""} onChange={e=>saveNotes({...notes,[d.day]:e.target.value})}
              placeholder="Write your reflections, wins, struggles from today..."
              style={{width:"100%",minHeight:"88px",background:"transparent",border:"none",color:th.text,padding:"14px 18px",fontFamily:FONT,fontSize:"15px",lineHeight:"1.6",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
          </div>

          <div style={{background:th.aiGrad,border:"1px solid "+th.aiBorder,borderRadius:"16px",padding:"18px",marginBottom:"16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap",marginBottom:fb?"14px":"0"}}>
              <div>
                <div style={{fontSize:"16px",fontWeight:"700",color:th.text}}>AI Coach Feedback</div>
                <div style={{fontSize:"13px",color:"#7C3AED",marginTop:"2px"}}>Personalized progress analysis</div>
              </div>
              <button onClick={()=>getAI(d.day)} disabled={aiLoad}
                style={{background:"#7C3AED",color:"white",border:"none",padding:"10px 18px",borderRadius:"10px",cursor:aiLoad?"not-allowed":"pointer",fontFamily:FONT,fontSize:"15px",fontWeight:"700",opacity:aiLoad?0.6:1}}>
                {aiLoad?"Analysing...":fb?"Refresh":"Get Feedback"}
              </button>
            </div>
            {fb && (
              <div style={{background:dark?"#2D1B6933":"#EDE9FE",borderRadius:"10px",padding:"14px",border:"1px solid "+th.aiBorder}}>
                <div style={{fontSize:"15px",color:th.aiTxt,lineHeight:"1.8",whiteSpace:"pre-wrap"}}>{fb.text}</div>
                <div style={{fontSize:"11px",color:th.muted,marginTop:"8px"}}>Updated: {fb.time}</div>
              </div>
            )}
            {!fb && !aiLoad && <div style={{textAlign:"center",padding:"10px 0 0",color:th.muted,fontSize:"14px"}}>Complete some tasks first, then get your AI coaching feedback!</div>}
          </div>

          {/* Ask Sir Alam Banner */}
          <div onClick={()=>setView("chat")}
            style={{background:"linear-gradient(135deg,#065F46,#064E3B)",border:"1px solid #10B98144",borderRadius:"14px",padding:"16px 20px",marginBottom:"16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#10B981"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#10B98144"}>
            <span style={{fontSize:"28px",flexShrink:0}}>{String.fromCodePoint(128104,8205,127979)}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:"15px",fontWeight:"700",color:"white"}}>Ask Sir Alam</div>
              <div style={{fontSize:"13px",color:"#6EE7B7",marginTop:"2px"}}>Confused about anything on Day {d.day}? Your AI Teacher is here to explain!</div>
            </div>
            <span style={{color:"#10B981",fontSize:"20px"}}>&#8594;</span>
          </div>

          <div style={{display:"flex",gap:"10px"}}>
            {d.day>1  && <button onClick={()=>setSelDay(d.day-1)} style={{flex:1,background:th.surface,border:"1px solid "+th.border,color:th.sub,padding:"14px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"15px"}}>Day {d.day-1}</button>}
            {d.day<60 && <button onClick={()=>setSelDay(d.day+1)} style={{flex:1,background:nextPhc+"18",border:"1px solid "+nextPhc+"44",color:nextPhc,padding:"14px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"15px",fontWeight:"700"}}>Day {d.day+1}</button>}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:th.bg,fontFamily:FONT,color:th.text}}>
      <link href={GOOGLE_FONT} rel="stylesheet"/>
      <div style={{background:th.hero,padding:"22px 18px 18px",borderBottom:"1px solid "+th.border}}>
        <div style={{maxWidth:"720px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"16px"}}>
            <div>
              <div style={{fontSize:"11px",letterSpacing:"3px",color:"#7C3AED",fontWeight:"700",marginBottom:"6px",textTransform:"uppercase"}}>CUET Pre-Campus Roadmap</div>
              <h1 style={{margin:0,fontSize:"26px",fontWeight:"800",color:th.text,lineHeight:"1.2"}}>60-Day Master Tracker</h1>
              <p style={{color:th.muted,fontSize:"14px",margin:"4px 0 0"}}>Md. Ashraful Alam Mazid - Mechanical Engineering</p>
            </div>
            <ThemeBtn/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",marginBottom:"14px"}}>
            {[{l:"Days Done",v:daysDone,c:"#10B981"},{l:"Tasks Done",v:doneTasks,c:"#3B82F6"},{l:"Progress",v:Math.round(doneTasks/TOTAL_TASKS*100)+"%",c:"#8B5CF6"},{l:"Today",v:"D"+today,c:"#F59E0B"}].map(s=>(
              <div key={s.l} style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"12px",padding:"11px 8px",textAlign:"center"}}>
                <div style={{fontSize:"21px",fontWeight:"800",color:s.c}}>{s.v}</div>
                <div style={{fontSize:"11px",color:th.muted,marginTop:"2px"}}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{height:"7px",background:th.card,borderRadius:"4px",overflow:"hidden",marginBottom:"14px"}}>
            <div style={{height:"100%",width:Math.round(doneTasks/TOTAL_TASKS*100)+"%",background:"linear-gradient(90deg,#3B82F6,#8B5CF6,#10B981)",borderRadius:"4px",transition:"width 0.5s"}}/>
          </div>

          {!startDate ? (
            <button onClick={async()=>{const d=new Date().toISOString();setStart(d);sv("s4",d);}}
              style={{width:"100%",background:"#7C3AED",color:"white",border:"none",padding:"15px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"17px",fontWeight:"700"}}>
              Start My Journey - Day 1 Begins Now
            </button>
          ) : (
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>{setSelDay(today);setView("day");}}
                style={{flex:2,background:"linear-gradient(135deg,#7C3AED,#3B82F6)",color:"white",border:"none",padding:"15px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"16px",fontWeight:"700"}}>
                Open Day {today}: {DD[today-1]?.title}
              </button>
              <button onClick={()=>setView("chat")}
                style={{flex:1,background:"linear-gradient(135deg,#065F46,#047857)",color:"white",border:"none",padding:"15px",borderRadius:"12px",cursor:"pointer",fontFamily:FONT,fontSize:"15px",fontWeight:"700",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
                <span style={{fontSize:"20px"}}>{String.fromCodePoint(128104,8205,127979)}</span>
                <span>Sir Alam</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"20px 16px 40px"}}>
        {PHASES.map(phase => {
          const pDays = DD.filter(d=>d.phase===phase.id);
          const pTotal = pDays.reduce((s,d)=>s+d.blocks.ai.tasks.length+d.blocks.mech.tasks.length+d.blocks.eng.tasks.length,0);
          const pDone  = pDays.reduce((s,d)=>{
            return s+["ai","mech","eng"].reduce((ss,b)=>ss+d.blocks[b].tasks.filter((_,i)=>prog[d.day+"-"+b+"-"+i]).length,0);
          },0);
          const pPct = pTotal>0?Math.round(pDone/pTotal*100):0;
          return (
            <div key={phase.id} style={{marginBottom:"26px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
                <div style={{width:"4px",height:"38px",background:phase.color,borderRadius:"2px",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:"17px",fontWeight:"700",color:th.text}}>{phase.weeks}: {phase.label}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
                    <div style={{flex:1,height:"4px",background:th.card,borderRadius:"2px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:pPct+"%",background:phase.color,transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontSize:"13px",fontWeight:"700",color:phase.color,minWidth:"38px",textAlign:"right"}}>{pPct}%</span>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(88px,1fr))",gap:"7px"}}>
                {pDays.map(d => {
                  const pct   = getPct(d.day);
                  const isTdy = d.day===today && !!startDate;
                  return (
                    <div key={d.day} onClick={()=>{setSelDay(d.day);setView("day");}}
                      style={{background:isTdy?(dark?"linear-gradient(135deg,#1A1035,#2D1B69)":"linear-gradient(135deg,#EDE9FE,#DDD6FE)"):th.surface,border:"2px solid "+(isTdy?"#7C3AED":pct===100?phase.color+"88":th.border),borderRadius:"12px",padding:"11px 8px",cursor:"pointer",transition:"all 0.2s",position:"relative",textAlign:"center"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=phase.color;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=isTdy?"#7C3AED":pct===100?phase.color+"88":th.border;}}>
                      {pct===100 && <div style={{position:"absolute",top:-1,right:-1,width:"18px",height:"18px",background:"#10B981",borderRadius:"0 10px 0 8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{color:"white",fontSize:"10px"}}>{String.fromCharCode(10003)}</span>
                      </div>}
                      <div style={{fontSize:"13px",fontWeight:"800",color:isTdy?"#7C3AED":phase.color,marginBottom:"3px"}}>D{d.day}</div>
                      {isTdy && <div style={{fontSize:"9px",color:"#7C3AED",fontWeight:"700",marginBottom:"2px",letterSpacing:"1px"}}>TODAY</div>}
                      <div style={{fontSize:"10px",color:th.muted,lineHeight:"1.3",marginBottom:"7px",minHeight:"26px"}}>{d.title.length>16?d.title.slice(0,14)+"...":d.title}</div>
                      <div style={{height:"3px",background:th.card,borderRadius:"2px",overflow:"hidden"}}>
                        <div style={{height:"100%",width:pct+"%",background:pct===100?"#10B981":phase.color,transition:"width 0.4s"}}/>
                      </div>
                      <div style={{fontSize:"10px",color:th.muted,marginTop:"3px"}}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{background:th.surface,border:"1px solid "+th.border,borderRadius:"14px",padding:"16px 18px"}}>
          <div style={{fontSize:"13px",fontWeight:"700",color:th.muted,marginBottom:"12px",letterSpacing:"1px"}}>HOW TO USE</div>
          {[
            "Tap any day card to open that day's lesson",
            "Tap 'View Resources' on any task to get videos, websites and free courses",
            "Tap the checkbox to mark a task complete",
            "Get personalized AI coaching feedback after completing tasks",
            "Write daily notes to remember your wins and struggles",
            "Tap the theme button (top right) to switch between dark and light mode",
          ].map((txt,i,arr)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"8px 0",borderBottom:i<arr.length-1?"1px solid "+th.border:"none"}}>
              <span style={{fontSize:"16px",color:"#7C3AED",fontWeight:"700",minWidth:"20px"}}>{i+1}.</span>
              <span style={{fontSize:"15px",color:th.sub}}>{txt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
