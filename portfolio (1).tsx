import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Instagram,
  Mail, 
  ExternalLink, 
  Download, 
  ChevronRight, 
  Menu, 
  X,
  Moon,
  Sun,
  Code2,
  Database,
  BrainCircuit,
  Terminal,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';


// Utility for merging tailwind classes (simulating clsx/tailwind-merge used in shadcn)
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Hook for dark mode
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check local storage or system preference on mount
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  return { theme, toggleTheme };
};

// Hook for reduced motion preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return prefersReducedMotion;
};


const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    const variants = {
      default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 border border-transparent",
      outline: "border-2 border-slate-200/50 hover:bg-slate-100 text-slate-900 dark:border-slate-700/50 dark:text-slate-100 dark:hover:bg-slate-800 hover:shadow-md",
      ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-12 rounded-full px-8 text-base",
      icon: "h-10 w-10",
    };
    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:placeholder:text-slate-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:placeholder:text-slate-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

const Card = ({ className, children, ...props }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={cn("rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]", className)}
    {...props}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'outline', className?: string }) => {
  const variants = {
    default: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50",
    secondary: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50",
    outline: "bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 cursor-default", variants[variant], className)}>
      {children}
    </span>
  );
};


const BlackHoleScene = ({ isLightMode }: { isLightMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      distance: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * Math.max(canvasWidth, canvasHeight);
        this.speed = (Math.random() * 0.002) + 0.001;
        this.radius = Math.random() * 1.5 + 0.5;
        this.x = canvasWidth / 2 + Math.cos(this.angle) * this.distance;
        this.y = canvasHeight / 2 + Math.sin(this.angle) * this.distance;
        
        // Premium AI aesthetics colors (blues, purples, cyans)
        const colors = isLightMode 
          ? ['rgba(59, 130, 246, 0.4)', 'rgba(139, 92, 246, 0.4)', 'rgba(99, 102, 241, 0.4)']
          : ['rgba(96, 165, 250, 0.6)', 'rgba(167, 139, 250, 0.6)', 'rgba(129, 140, 248, 0.6)', 'rgba(255, 255, 255, 0.3)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        // Spiral inwards
        this.angle += this.speed;
        this.distance -= this.distance * 0.002;

        // Reset if too close to center
        if (this.distance < 10) {
           this.distance = Math.max(canvasWidth, canvasHeight);
           this.angle = Math.random() * Math.PI * 2;
        }

        this.x = canvasWidth / 2 + Math.cos(this.angle) * this.distance;
        this.y = canvasHeight / 2 + Math.sin(this.angle) * this.distance;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = window.innerWidth < 768 ? 150 : 400; // Optimize for mobile
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };
    initParticles();

    const render = () => {
      // Trail effect
      ctx.fillStyle = isLightMode ? 'rgba(248, 250, 252, 0.1)' : 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

      // Draw center "Event Horizon" glow
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
      gradient.addColorStop(0, isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.8)');
      gradient.addColorStop(0.5, isLightMode ? 'rgba(59, 130, 246, 0.02)' : 'rgba(30, 58, 138, 0.1)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLightMode, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10 transition-colors duration-700" />;
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 -z-10 transition-opacity duration-1000 opacity-60 dark:opacity-100"
      style={{ background: isLightMode ? '#f8fafc' : '#020617' }}
    />
  );
};


const LINKEDIN_URL = "https://www.linkedin.com/in/prakash-subhanje-452656330";
const INSTAGRAM_URL = "https://www.instagram.com/prakash_subhanje?stkn=MW91N2NnNjhzMnppbA==";

const SKILLS = {
  programming: ["Python", "C", "SQL"],
  ai_data: ["Artificial Intelligence", "Machine Learning", "Data Analytics", "Exploratory Data Analysis", "Data Visualization", "Generative AI"],
  software: ["HTML", "CSS", "JavaScript", "React", "Git/GitHub", ".NET fundamentals"]
};

const INITIAL_CERTIFICATIONS = [
  {
    id: "vturesults",
    title: "1st Semester Results (VTU)",
    issuer: "Visvesvaraya Technological University",
    date: "March 2026",
    description: "Provisional results for the 1st semester of B.E. in Artificial Intelligence & Data Science.",
    topics: ["Calculus & Linear Algebra", "Quantum Physics", "C Programming", "Engineering Drawing", "Innovation & Design Thinking"],
    type: "marksheet",
    marks: [
      { code: "1BMATS101", title: "CALCULUS AND LINEAR ALGEBRA", int: 28, ext: 28, total: 56, res: "P" },
      { code: "1BPHYS102", title: "QUANTUM PHYSICS AND APPLICATIONS", int: 22, ext: 43, total: 65, res: "P" },
      { code: "1BCEDS103", title: "COMPUTER-AIDED ENGG DRAWING", int: 40, ext: 45, total: 85, res: "P" },
      { code: "1BEIT105", title: "PROGRAMMING IN C", int: 43, ext: 23, total: 66, res: "P" },
      { code: "1BSKS106", title: "SOFT SKILLS", int: 100, ext: 0, total: 100, res: "P" },
      { code: "1BPOPL107", title: "C PROGRAMMING LAB", int: 37, ext: 36, total: 73, res: "P" },
      { code: "1BIDTL158", title: "INNOVATION & DESIGN THINKING LAB", int: 48, ext: 48, total: 96, res: "P" },
      { code: "1BKSK109", title: "SAMSKRUTIKA KANNADA", int: 44, ext: 31, total: 75, res: "P" },
      { code: "1BESC104D", title: "INTRO TO MECHANICAL ENGG", int: 50, ext: 29, total: 79, res: "P" }
    ],
    studentInfo: { usn: "4SN25AD019", name: "PRAKASH" }
  },
  {
    id: "inv-banking",
    title: "Investment Banking Job Simulation",
    issuer: "Bank of America / Forage",
    date: "September 12, 2026",
    description: "Completed practical tasks involving historical financial performance and SWOT analysis, strategic alternatives, financial modeling, communication, and long-term relationship building.",
    topics: ["Historical financial performance", "SWOT analysis", "Strategic alternatives", "Financial modeling", "Communication", "Long-term relationship building"],
    type: "certificate",
    verificationCodes: { enrollment: "6aa5862f707c12e17fcc4229", user: "6aa449af166082799d5d3059" }
  },
  {
    id: "genai-data",
    title: "GenAI Powered Data Analytics Job Simulation",
    issuer: "TATA / Forage",
    date: "September 12, 2026",
    description: "Completed practical tasks involving exploratory data analysis and risk profiling, predicting delinquency with AI, business reporting and data storytelling, and an AI-driven collections strategy.",
    topics: ["Exploratory data analysis", "Risk profiling", "Predicting delinquency with AI", "Business reporting", "Data storytelling", "AI-driven collections strategy"],
    type: "certificate",
    verificationCodes: { enrollment: "6aa44a41166082799d5d508c", user: "6aa449af166082799d5d3059" }
  },
  {
    id: "swe",
    title: "Software Engineering Job Simulation",
    issuer: "Commonwealth Bank / Forage",
    date: "September 12, 2026",
    description: "Completed practical tasks involving .NET backend modification, React/Redux frontend modification, client requests, code coverage, and pull request creation.",
    topics: [".NET backend modification", "React/Redux frontend modification", "Client requests", "Code coverage", "Pull request creation"],
    type: "certificate",
    verificationCodes: { enrollment: "6aa5902c166082799d8b3956", user: "6aa449af166082799d5d3059" }
  }
];

const PROJECTS = [
  {
    title: "Project details coming soon",
    problem: "Identifying practical use cases for applied machine learning.",
    tech: ["Python", "Placeholder API"],
    description: "Actively exploring problem spaces to develop hands-on projects that demonstrate proficiency in AI and data pipelines.",
    features: ["Feature extraction planning", "Model evaluation strategy"],
  }
];


// Section Wrapper with animation
const Section = ({ id, className, children, title }: { id: string, className?: string, children: React.ReactNode, title?: string }) => (
  <section id={id} className={cn("py-20 md:py-32 relative px-4 md:px-8", className)}>
    <div className="max-w-6xl mx-auto">
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-4">
            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
            {title}
          </h2>
        </motion.div>
      )}
      {children}
    </div>
  </section>
);

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["About", "Education", "Skills", "Certifications", "Projects", "Resume", "Contact"];

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={cn(
      "fixed top-4 w-full z-50 transition-all duration-500 px-4",
    )}>
      <div className={cn(
        "max-w-6xl mx-auto rounded-full transition-all duration-500",
        scrolled ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-lg" : "bg-transparent border border-transparent"
      )}>
        <div className="flex justify-between items-center h-14 px-6">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              P.S.
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button 
                key={link} 
                onClick={() => scrollTo(link)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {link}
              </button>
            ))}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400" aria-label="Toggle Theme">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map(link => (
                <button 
                  key={link} 
                  onClick={() => scrollTo(link)}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                >
                  {link}
                </button>
              ))}
              <a 
                href={LINKEDIN_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 py-3 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
              >
                <Linkedin className="w-5 h-5" /> Connect on LinkedIn
              </a>
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 py-3 text-base font-medium text-pink-600 dark:text-pink-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
              >
                <Instagram className="w-5 h-5" /> Follow on Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const CertificateModal = ({ cert, onClose }: { cert: typeof CERTIFICATIONS[0] | null, onClose: () => void }) => {
  if (!cert) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-8"
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 truncate pr-4">{cert.title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-0 sm:p-6 bg-slate-100/50 dark:bg-slate-950/50">
            {cert.type === 'marksheet' ? (
              <div className="bg-white dark:bg-white text-black p-4 sm:p-8 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
                 <div className="text-center mb-6 border-b-2 border-black pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold uppercase">Visvesvaraya Technological University</h2>
                    <p className="text-sm">"Jnana Sangama" Belagavi-590018, Karnataka, India</p>
                    <h3 className="text-lg font-bold mt-2 uppercase underline">VTU PROVISIONAL RESULTS OF UG/PG December-2025/January-2026 EXAMINATION</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-sm">
                    <div>
                      <span className="font-bold">USN:</span> {cert.studentInfo?.usn}
                    </div>
                    <div>
                       <span className="font-bold">Student Name:</span> {cert.studentInfo?.name}
                    </div>
                    <div className="col-span-2">
                       <span className="font-bold">Semester:</span> 1
                    </div>
                 </div>

                 <table className="w-full text-sm font-mono border-collapse border border-black mb-6">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-black p-2 text-left">Subject Code</th>
                        <th className="border border-black p-2 text-left">Subject Title</th>
                        <th className="border border-black p-2 text-center">Int Marks</th>
                        <th className="border border-black p-2 text-center">Ext Marks</th>
                        <th className="border border-black p-2 text-center">Total</th>
                        <th className="border border-black p-2 text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cert.marks?.map((mark, i) => (
                        <tr key={i}>
                          <td className="border border-black p-2">{mark.code}</td>
                          <td className="border border-black p-2">{mark.title}</td>
                          <td className="border border-black p-2 text-center">{mark.int}</td>
                          <td className="border border-black p-2 text-center">{mark.ext}</td>
                          <td className="border border-black p-2 text-center font-bold">{mark.total}</td>
                          <td className="border border-black p-2 text-center font-bold">{mark.res}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
                 <div className="text-xs text-gray-600 mt-8">
                    <p>Nomenclature / Abbreviations: P -&gt; PASS | F -&gt; FAIL | A -&gt; ABSENT | W -&gt; WITHHELD | X, NE -&gt; NOT ELIGIBLE</p>
                    <p className="mt-2 text-right">Sd/- REGISTRAR (EVALUATION)</p>
                 </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-white text-black p-8 sm:p-12 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                  {/* Watermark-style logo approximation */}
                  <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                     <Award className="w-[300px] h-[300px]" />
                  </div>
                  
                  <div className="relative z-10 text-center w-full max-w-2xl">
                     <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 mb-2 uppercase tracking-wide">Certificate of Completion</h2>
                     <p className="text-slate-500 uppercase tracking-widest text-sm mb-12">Issued by Forage</p>
                     
                     <div className="text-xl sm:text-2xl font-serif italic text-slate-600 mb-2">This is to certify that</div>
                     <h1 className="text-4xl sm:text-5xl font-serif font-bold text-black border-b-2 border-black inline-block pb-2 px-8 mb-6">{cert.studentInfo?.name || "Prakash Subhanje"}</h1>
                     
                     <div className="text-lg text-slate-700 mb-8 max-w-lg mx-auto">
                        has completed practical tasks in the <br/>
                        <strong className="text-xl text-black mt-2 block">{cert.title}</strong>
                     </div>
                     
                     <div className="text-sm font-bold text-slate-800 mb-12">
                        {cert.issuer} • {cert.date}
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 border-t border-slate-200 pt-6">
                        <div className="text-left">
                           <strong>Enrolment Verification:</strong><br/>
                           <span className="font-mono">{cert.verificationCodes?.enrollment}</span>
                        </div>
                        <div className="text-right">
                           <strong>User Verification:</strong><br/>
                           <span className="font-mono">{cert.verificationCodes?.user}</span>
                        </div>
                     </div>
                  </div>
              </div>
            )}
            
            <div className="mt-6 space-y-4 px-2 sm:px-0">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {cert.description}
              </p>
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {cert.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">{topic}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button className="gap-2" onClick={() => window.print()}><Download className="w-4 h-4" /> Save / Print</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AddCertificateModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (cert: any) => void }) => {
  const [type, setType] = useState<'certificate' | 'marksheet'>('certificate');
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [topicsStr, setTopicsStr] = useState('');
  
  // Certificate fields
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [userCode, setUserCode] = useState('');

  // Marksheet fields
  const [studentName, setStudentName] = useState('');
  const [usn, setUsn] = useState('');
  const [marks, setMarks] = useState([{ code: '', title: '', int: '', ext: '', total: '', res: '' }]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: any = {
      id: Date.now().toString(),
      title,
      issuer,
      date,
      description,
      topics: topicsStr.split(',').map(t => t.trim()).filter(t => t),
      type
    };

    if (type === 'certificate') {
      newCert.verificationCodes = { enrollment: enrollmentCode, user: userCode };
    } else {
      newCert.studentInfo = { name: studentName, usn: usn };
      newCert.marks = marks.map(m => ({
        code: m.code, title: m.title, int: Number(m.int) || 0, ext: Number(m.ext) || 0, total: Number(m.total) || 0, res: m.res.toUpperCase()
      }));
    }

    onAdd(newCert);
    
    // Reset form
    setTitle(''); setIssuer(''); setDate(''); setDescription(''); setTopicsStr('');
    setEnrollmentCode(''); setUserCode(''); setStudentName(''); setUsn('');
    setMarks([{ code: '', title: '', int: '', ext: '', total: '', res: '' }]);
    onClose();
  };

  const addMarkRow = () => setMarks([...marks, { code: '', title: '', int: '', ext: '', total: '', res: '' }]);
  const removeMarkRow = (index: number) => setMarks(marks.filter((_, i) => i !== index));
  const updateMark = (index: number, field: string, value: string) => {
    const newMarks = [...marks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    // Auto calculate total
    if (field === 'int' || field === 'ext') {
       const intVal = field === 'int' ? Number(value) : Number(newMarks[index].int);
       const extVal = field === 'ext' ? Number(value) : Number(newMarks[index].ext);
       if (!isNaN(intVal) && !isNaN(extVal)) {
           newMarks[index].total = String(intVal + extVal);
       }
    }
    setMarks(newMarks);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Upload className="w-5 h-5" /> Add New Record
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-grow">
            <form id="add-cert-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={type === 'certificate'} onChange={() => setType('certificate')} className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium">Certificate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={type === 'marksheet'} onChange={() => setType('marksheet')} className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium">Marksheet</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Title</label>
                  <Input required placeholder="e.g. Software Engineering" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Issuer / University</label>
                  <Input required placeholder="e.g. Forage / VTU" value={issuer} onChange={e => setIssuer(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Date</label>
                  <Input required placeholder="e.g. September 2026" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Topics (Comma separated)</label>
                  <Input required placeholder="React, APIs, Data" value={topicsStr} onChange={e => setTopicsStr(e.target.value)} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Description</label>
                  <Textarea required placeholder="Brief description..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </div>

              {type === 'certificate' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Enrollment Verification Code</label>
                    <Input placeholder="Optional" value={enrollmentCode} onChange={e => setEnrollmentCode(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">User Verification Code</label>
                    <Input placeholder="Optional" value={userCode} onChange={e => setUserCode(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Student Name</label>
                      <Input required placeholder="Student Name" value={studentName} onChange={e => setStudentName(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">USN</label>
                      <Input required placeholder="e.g. 4SN25AD019" value={usn} onChange={e => setUsn(e.target.value)} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-500">Subject Marks</label>
                      <Button type="button" variant="outline" size="sm" onClick={addMarkRow} className="h-7 text-xs gap-1">
                        <Plus className="w-3 h-3" /> Add Subject
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {marks.map((mark, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                          <Input required placeholder="Code" className="w-20" value={mark.code} onChange={e => updateMark(index, 'code', e.target.value)} />
                          <Input required placeholder="Subject Title" className="flex-1" value={mark.title} onChange={e => updateMark(index, 'title', e.target.value)} />
                          <Input required placeholder="Int" className="w-16" value={mark.int} onChange={e => updateMark(index, 'int', e.target.value)} />
                          <Input required placeholder="Ext" className="w-16" value={mark.ext} onChange={e => updateMark(index, 'ext', e.target.value)} />
                          <Input required placeholder="Total" className="w-16 bg-slate-100 dark:bg-slate-800" readOnly value={mark.total} />
                          <Input required placeholder="P/F" className="w-14" value={mark.res} onChange={e => updateMark(index, 'res', e.target.value)} />
                          <button type="button" onClick={() => removeMarkRow(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors disabled:opacity-50" disabled={marks.length === 1}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="add-cert-form" className="gap-2">
              <Upload className="w-4 h-4" /> Add Record
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCert, setSelectedCert] = useState<typeof INITIAL_CERTIFICATIONS[0] | null>(null);
  const [certifications, setCertifications] = useState(INITIAL_CERTIFICATIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCert = (newCert: any) => {
    setCertifications([newCert, ...certifications]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
      
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BlackHoleScene isLightMode={theme === 'light'} />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden">
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto z-10"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 backdrop-blur-md text-sm font-semibold shadow-sm hover:scale-105 transition-transform cursor-default"
            >
              <BrainCircuit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">B.E. AI & Data Science Student</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-400 leading-tight pb-2">
              Prakash <br className="md:hidden" /> Subhanje
            </h1>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-10 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Building intelligent systems and extracting actionable insights from data. <br className="hidden md:block"/> 
              Passionate about the intersection of <span className="text-blue-600 dark:text-blue-400 font-semibold">Machine Learning</span> and Software Engineering.
            </motion.h2>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto gap-2">
                View My Work <ChevronRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm" onClick={() => window.open(LINKEDIN_URL, '_blank')}>
                <Linkedin className="w-5 h-5" /> Connect on LinkedIn
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500" />
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <Section id="about" title="About Me">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
              <p>
                Hello! I'm Prakash Subhanje, a dedicated student pursuing my Bachelor of Engineering in 
                <strong className="text-slate-900 dark:text-slate-100 font-semibold"> Artificial Intelligence and Data Science </strong> 
                at Srinivas Institute of Technology, Mangalore.
              </p>
              <p>
                I am deeply fascinated by the potential of data to drive decision-making and the power of AI to automate and innovate. 
                My academic journey is focused on building a strong foundation in machine learning, data analytics, and software engineering principles.
              </p>
              <p>
                Currently, I am expanding my practical skills through job simulations and hands-on projects, aiming to bridge the gap between theoretical knowledge and real-world application.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative group">
                <Terminal className="w-32 h-32 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />
                
                {/* Decorative floating badges */}
                <div className="absolute top-4 left-4">
                  <Badge className="shadow-lg backdrop-blur-md bg-white/80 dark:bg-slate-900/80">AI Enthusiast</Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-white/80 dark:bg-slate-900/80">Data Miner</Badge>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* EDUCATION SECTION */}
        <Section id="education" title="Education" className="bg-slate-100/50 dark:bg-slate-900/20">
          <Card className="p-8 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  B.E. in Artificial Intelligence & Data Science
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">Srinivas Institute of Technology, Mangalore</p>
              </div>
              <Badge variant="outline" className="w-fit text-sm py-1 px-3">2025 - 2029 (Expected)</Badge>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Core Coursework Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Machine Learning", "Data Structures", "Database Management", "Statistical Analysis", "Deep Learning Fundamentals", "Software Engineering"].map(course => (
                  <Badge key={course} variant="secondary">{course}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </Section>

        {/* SKILLS SECTION */}
        <Section id="skills" title="Technical Arsenal">
          <div className="grid md:grid-cols-3 gap-6">
            
            <Card className="p-8 flex flex-col h-full border-t-4 border-t-blue-500 group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
              <div className="mb-8 bg-blue-500/10 dark:bg-blue-400/10 w-14 h-14 rounded-xl flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
                <Terminal className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Programming</h3>
              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {SKILLS.programming.map(skill => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-8 flex flex-col h-full border-t-4 border-t-indigo-500 group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
              <div className="mb-8 bg-indigo-500/10 dark:bg-indigo-400/10 w-14 h-14 rounded-xl flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
                <BrainCircuit className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6">AI & Data</h3>
              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {SKILLS.ai_data.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-8 flex flex-col h-full border-t-4 border-t-cyan-500 group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
              <div className="mb-8 bg-cyan-500/10 dark:bg-cyan-400/10 w-14 h-14 rounded-xl flex items-center justify-center border border-cyan-200/50 dark:border-cyan-800/50">
                <Code2 className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Software Tools</h3>
              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {SKILLS.software.map(skill => (
                  <Badge key={skill} variant="outline" className="border-cyan-200 dark:border-cyan-800/50 text-cyan-800 dark:text-cyan-300 bg-cyan-500/5 dark:bg-cyan-400/5">{skill}</Badge>
                ))}
              </div>
            </Card>

          </div>
        </Section>

        {/* CERTIFICATIONS SECTION */}
        <Section id="certifications" title="Simulations & Certifications" className="bg-slate-100/50 dark:bg-slate-900/20">
          <div className="flex justify-end mb-6">
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-md">
              <Plus className="w-4 h-4" /> Add Certificate / Marksheet
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {cert.type === 'marksheet' ? <GraduationCap className="w-6 h-6 text-slate-700 dark:text-slate-300" /> : <Award className="w-6 h-6 text-slate-700 dark:text-slate-300" />}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cert.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 leading-tight">{cert.title}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{cert.issuer}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-full">
                        {topic}
                      </span>
                    ))}
                    {cert.topics.length > 3 && (
                       <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">+{cert.topics.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group"
                    onClick={() => setSelectedCert(cert)}
                  >
                    {cert.type === 'marksheet' ? 'View Results' : 'View Certificate'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* PROJECTS SECTION */}
        <Section id="projects" title="Featured Projects">
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((project, idx) => (
              <Card key={idx} className="overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="aspect-[2/1] bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden flex items-center justify-center p-6">
                  {/* Abstract visualization representing a project */}
                  <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}/>
                  <Database className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.tech.map(tech => (
                      <Badge key={tech} variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80">{tech}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">Problem Focus</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 border-l-2 border-blue-500 pl-3">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wider">Planned Features</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {project.features.map(f => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                    <Button variant="outline" disabled className="gap-2">
                      <Github className="w-4 h-4" /> Code (WIP)
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* "More coming soon" card */}
            <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Code2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">More Projects Brewing</h3>
              <p className="text-slate-500 max-w-sm">
                Currently working on applying machine learning concepts to structured datasets. Check back soon for updates.
              </p>
            </Card>
          </div>
        </Section>

        {/* RESUME & CONTACT SECTION */}
        <Section id="resume" className="bg-slate-100/50 dark:bg-slate-900/20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Resume Download */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Resume</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Get a detailed overview of my academic background, skills, and certifications.
                </p>
              </div>
              
              <Card className="p-6 md:p-8 bg-white dark:bg-slate-950 border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <FileText className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Prakash Subhanje - Resume</h3>
                    <p className="text-sm text-slate-500">PDF Document • 1 Page</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="gap-2" onClick={() => alert("In a production environment, this would trigger a download of the resume PDF.")}>
                      <Download className="w-4 h-4" /> Download Resume
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => alert("In a production environment, this would open the resume PDF in a new tab.")}>
                      <ExternalLink className="w-4 h-4" /> View Online
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Info */}
            <div id="contact">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Let's Connect</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  I'm currently open to internship opportunities, collaborations, or just a chat about AI and data.
                </p>
              </div>
              
              <div className="space-y-4">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="p-6 flex items-center gap-4 hover:border-blue-500 transition-colors group">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Linkedin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">LinkedIn</h4>
                      <p className="text-slate-500 text-sm">Connect with me professionally</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Card>
                </a>

                {/* Instagram Contact */}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="p-6 flex items-center gap-4 hover:border-pink-500 transition-colors group">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Instagram</h4>
                      <p className="text-slate-500 text-sm">Follow my journey</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-pink-500 transition-colors" />
                  </Card>
                </a>

                {/* Email Contact */}
                <Card className="p-6 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group" onClick={() => window.location.href = 'mailto:prakashsubhanje4@gmail.com'}>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                     <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email Me</h4>
                    <p className="text-slate-500 text-sm">prakashsubhanje4@gmail.com</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </Card>
              </div>
            </div>

          </div>
        </Section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              P.S.
            </span>
            <p className="text-sm text-slate-500 mt-2">
              B.E. Student • AI & Data Science
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Prakash Subhanje. Built with React & Tailwind.</p>
        </div>
      </footer>

      <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      <AddCertificateModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCert} />
    </div>
  );
}