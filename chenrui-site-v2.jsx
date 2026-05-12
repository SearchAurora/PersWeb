import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   DESIGN SYSTEM — NASA-inspired, YaHei, Space
   ═══════════════════════════════════════════ */
const DS = {
  font: `"Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif`,
  mono: `"JetBrains Mono", "Consolas", "Microsoft YaHei", monospace`,
  // Light theme palette
  bg: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceAlt: "#EAF0F8",
  accent: "#2B7AE0",
  accentSoft: "#D4E6FA",
  accentDeep: "#0F2A4A",
  text: "#1B2838",
  textSec: "#5E7185",
  textMuted: "#94A3B5",
  border: "#D8E2EE",
  borderLight: "#EBF1F8",
  heroGrad1: "#070B14",
  heroGrad2: "#0D1B2E",
  heroGrad3: "#102440",
  cardShadow: "0 2px 12px rgba(43,122,224,0.06)",
  cardHover: "0 8px 32px rgba(43,122,224,0.12)",
};

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "knowledge", label: "Knowledge" },
  { id: "about", label: "About" },
];

const PROJECTS = [
  {
    id: "eureka-tra",
    title: "EUREKA-TRA",
    tagline: "Trajectory-Aware Reward Optimization",
    status: "Active Research",
    cover: "linear-gradient(135deg, #0D1B2E 0%, #1E3A5F 50%, #2B7AE0 100%)",
    icon: "🤖",
    brief: "Extending NVIDIA EUREKA with temporal trajectory analysis for robotics reinforcement learning. Targeting top-tier venue submission.",
    tags: ["Reinforcement Learning", "Reward Shaping", "LLM", "Isaac Sim"],
    // Full page content
    fullContent: {
      hero: "Teaching robots to learn through intelligent reward design",
      sections: [
        {
          title: "Overview",
          content: "EUREKA-TRA extends NVIDIA's EUREKA framework (ICLR 2024) by replacing scalar reward feedback with structured trajectory analysis. The core innovation is the Trajectory Event Summarizer (TES) — a three-layer temporal attribution module that provides the LLM with rich, structured understanding of *why* a policy succeeded or failed, not just *how much*.",
        },
        {
          title: "Architecture",
          content: "TES operates at three granularity levels: L1 performs crash and event detection on raw trajectories, L2 analyzes component-level variance to identify which reward terms drive behavior, and L3 aggregates phase-level failure statistics across training episodes. This multi-resolution feedback replaces the single scalar that vanilla EUREKA provides to the LLM backbone.",
        },
        {
          title: "Engineering",
          content: "The system runs on a subprocess architecture with an orchestrator coordinating independent training processes via JSON communication. Zero-intrusion reward injection through EurekaRewardWrapper ensures compatibility with existing Isaac Sim environments. 16-candidate evolutionary search with 4-GPU parallel training enables efficient exploration of the reward function space.",
        },
        {
          title: "Variants & Ablations",
          content: "Three main variants: EUREKA (baseline with dict reward), EUREKA-TRA (rules-based trajectory analysis), and EUREKA-TRALLM (raw TES data for LLM self-analysis). Full ablation study covers 6 TES layer combinations to isolate contribution of each attribution level.",
        },
        {
          title: "Current Status",
          content: "Full-scale experiments running on 4×RTX 4090 cluster. Experiment matrix: 4 methods × 3 tasks (Lift-Cube, Cabinet, Anymal) × 5 seeds = 90 runs + 30 ablation runs. Preliminary results show TRA consistently outperforming baseline EUREKA across seeds and tasks.",
        },
      ],
    },
  },
  {
    id: "future-project",
    title: "Next Mission",
    tagline: "Coming Soon",
    status: "Planning",
    cover: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    icon: "🚀",
    brief: "The next research frontier. Stay tuned.",
    tags: ["TBD"],
    fullContent: {
      hero: "Something is brewing in the lab",
      sections: [
        { title: "Status", content: "This project is in the early planning phase. Check back for updates." },
      ],
    },
  },
];

const KNOWLEDGE = [
  {
    id: "debug-stories",
    title: "Debug War Stories",
    tagline: "Battle-tested solutions from production systems",
    icon: "🔧",
    cover: "linear-gradient(135deg, #2D1B0E 0%, #4A2E1A 50%, #D4963A 100%)",
    entries: [
      {
        title: "Vulkan ICD Deadlock on Headless Server",
        problem: "Isaac Sim hangs with 908MiB VRAM, 0% SM utilization — GPU allocated but completely idle",
        solution: "Root cause: display server attempted on headless machine. Fix: unset DISPLAY + correct LD_LIBRARY_PATH. Recovery: kill -9 for Vulkan deadlock pattern (908MiB / 0%SM).",
        tags: ["GPU", "Isaac Sim", "Vulkan"],
      },
      {
        title: "Silent Reward Component Mismatch",
        problem: "Training runs normally but policy learns nothing useful — no errors, no warnings",
        solution: "Variable naming inconsistency: reward_components_batch vs components_batch in multi-task scripts. Added assertion checks and naming conventions to prevent recurrence.",
        tags: ["Python", "RL", "Silent Bug"],
      },
      {
        title: "Batch Script Fork Bomb",
        problem: "Launch script spawns 59 concurrent processes instead of expected 4 — server goes unresponsive",
        solution: "Subshell PID capture error in bash. Rewrote with lock files, PID validation, staggered launches, and set -uo pipefail.",
        tags: ["Bash", "Process Management"],
      },
    ],
  },
  {
    id: "protocols",
    title: "Operational Protocols",
    tagline: "Rules forged from painful experience",
    icon: "📋",
    cover: "linear-gradient(135deg, #0E2D1B 0%, #1A4A2E 50%, #2D9B6A 100%)",
    entries: [
      {
        title: "GPU Server Discipline",
        problem: "Multi-user GPU contention, orphan processes consuming VRAM",
        solution: "One GPU one process. Always use screen. Check ps aux before launching. Never trust nvidia-smi alone — cross-reference with process trees.",
        tags: ["GPU", "Best Practice"],
      },
      {
        title: "Experiment Reproducibility",
        problem: "Config drift between runs invalidates cross-seed comparisons",
        solution: "Global config lock for each experiment batch. Never mix preliminary data (different candidate count / env count) with full-config runs. Document every config delta.",
        tags: ["Experiment Design", "Methodology"],
      },
    ],
  },
  {
    id: "tech-notes",
    title: "Technical Notes",
    tagline: "Architecture decisions and design patterns",
    icon: "📝",
    cover: "linear-gradient(135deg, #1B0E2D 0%, #2E1A4A 50%, #7B3AE0 100%)",
    entries: [
      {
        title: "Subprocess Architecture for RL Training",
        problem: "PhysX conflicts when running multiple environments in one process",
        solution: "AppLauncher over SimulationApp avoids physx initialization conflicts. Independent run_one_iter.py subprocesses communicate via JSON file I/O. LD_PRELOAD fix for GLIBCXX incompatibility across conda environments.",
        tags: ["Architecture", "Isaac Sim", "Design Pattern"],
      },
    ],
  },
];

const ABOUT_DATA = {
  role: "Graduate Researcher",
  focus: "Robotics Reinforcement Learning",
  interests: ["Reward Function Design", "LLM-driven Optimization", "Sim-to-Real Transfer", "Autonomous Manipulation"],
  tools: [
    { name: "Python / PyTorch", level: 90 },
    { name: "Reinforcement Learning", level: 88 },
    { name: "Isaac Sim / Gym", level: 82 },
    { name: "Linux / Bash / GPU Ops", level: 85 },
    { name: "LLM Integration", level: 78 },
    { name: "Research & Writing", level: 75 },
  ],
};

/* ═══════════════════════════════════════════
   STARFIELD CANVAS
   ═══════════════════════════════════════════ */
function StarfieldCanvas() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const orbitsRef = useRef([]);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, animId;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function initStars() {
      starsRef.current = Array.from({ length: 280 }, () => ({
        x: Math.random() * 2000 - 500,
        y: Math.random() * 2000 - 500,
        z: Math.random() * 1000,
        size: Math.random() * 1.8 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
      // Orbital bodies — sun + planets
      const sunColor = "#FDB813";
      orbitsRef.current = [
        { radius: 0, size: 28, color: sunColor, glow: sunColor, speed: 0, angle: 0, name: "Sun", isSun: true },
        { radius: 70, size: 4, color: "#A0A0A0", glow: "#C0C0C0", speed: 0.012, angle: Math.random() * Math.PI * 2, name: "Mercury" },
        { radius: 110, size: 6, color: "#E8C56D", glow: "#F0D890", speed: 0.008, angle: Math.random() * Math.PI * 2, name: "Venus" },
        { radius: 160, size: 7, color: "#4A90D9", glow: "#6CB0FF", speed: 0.006, angle: Math.random() * Math.PI * 2, name: "Earth" },
        { radius: 210, size: 5, color: "#C1440E", glow: "#E06030", speed: 0.004, angle: Math.random() * Math.PI * 2, name: "Mars" },
        { radius: 290, size: 14, color: "#C88B3A", glow: "#E0A050", speed: 0.002, angle: Math.random() * Math.PI * 2, name: "Jupiter" },
        { radius: 370, size: 12, color: "#E8D5A0", glow: "#F0E0B0", speed: 0.0012, angle: Math.random() * Math.PI * 2, name: "Saturn", hasRing: true },
      ];
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      grad.addColorStop(0, DS.heroGrad3);
      grad.addColorStop(0.5, DS.heroGrad2);
      grad.addColorStop(1, DS.heroGrad1);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow
      const nebula = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, 300);
      nebula.addColorStop(0, "rgba(43,122,224,0.04)");
      nebula.addColorStop(1, "transparent");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      const nebula2 = ctx.createRadialGradient(w * 0.75, h * 0.6, 0, w * 0.75, h * 0.6, 250);
      nebula2.addColorStop(0, "rgba(100,60,180,0.03)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      // Parallax offset from mouse
      const mx = (mouseRef.current.x - w / 2) * 0.015;
      const my = (mouseRef.current.y - h / 2) * 0.015;

      // Stars
      starsRef.current.forEach((star) => {
        const depth = star.z / 1000;
        const px = (star.x - mx * depth) % w;
        const py = (star.y - my * depth) % h;
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = (0.3 + 0.7 * (1 - depth)) * twinkle;

        ctx.beginPath();
        ctx.arc(px < 0 ? px + w : px, py < 0 ? py + h : py, star.size * (1 - depth * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });

      // Solar system center
      const cx = w * 0.5 + mx * 0.5;
      const cy = h * 0.5 + my * 0.5;

      // Draw orbit lines
      orbitsRef.current.forEach((body) => {
        if (body.isSun) return;
        ctx.beginPath();
        ctx.arc(cx, cy, body.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200,220,255,0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw bodies
      orbitsRef.current.forEach((body) => {
        body.angle += body.speed;
        const bx = body.isSun ? cx : cx + Math.cos(body.angle) * body.radius;
        const by = body.isSun ? cy : cy + Math.sin(body.angle) * body.radius * 0.4; // Perspective ellipse

        // Glow
        const glowGrad = ctx.createRadialGradient(bx, by, 0, bx, by, body.size * (body.isSun ? 4 : 2.5));
        glowGrad.addColorStop(0, body.glow + (body.isSun ? "40" : "25"));
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bx, by, body.size * (body.isSun ? 4 : 2.5), 0, Math.PI * 2);
        ctx.fill();

        // Saturn ring
        if (body.hasRing) {
          ctx.beginPath();
          ctx.ellipse(bx, by, body.size * 2, body.size * 0.5, 0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(232,213,160,0.3)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Body
        ctx.beginPath();
        ctx.arc(bx, by, body.size, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    animId = requestAnimationFrame(draw);

    const handleResize = () => resize();
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   NAV BAR
   ═══════════════════════════════════════════ */
function NavBar({ currentPage, onNavigate, isHeroVisible }) {
  const dark = currentPage === "home" && isHeroVisible;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: dark ? "rgba(7,11,20,0.6)" : "rgba(244,247,251,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${DS.borderLight}`,
        transition: "all 0.5s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          padding: "0 32px",
        }}
      >
        <div
          onClick={() => onNavigate("home")}
          style={{
            fontFamily: DS.font,
            fontSize: 18,
            fontWeight: 700,
            color: dark ? "#fff" : DS.accentDeep,
            cursor: "pointer",
            letterSpacing: "0.06em",
            transition: "color 0.4s",
          }}
        >
          CHENRUI
          <span style={{ color: DS.accent, marginLeft: 2 }}>.</span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: currentPage === item.id
                  ? (dark ? "rgba(43,122,224,0.2)" : DS.accentSoft)
                  : "none",
                border: "none",
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: currentPage === item.id ? 600 : 400,
                color: dark
                  ? (currentPage === item.id ? "#fff" : "rgba(255,255,255,0.65)")
                  : (currentPage === item.id ? DS.accent : DS.textSec),
                cursor: "pointer",
                padding: "6px 16px",
                borderRadius: 6,
                transition: "all 0.3s ease",
                letterSpacing: "0.03em",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
function HomePage({ onNavigate }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 200); }, []);

  return (
    <div>
      {/* Hero */}
      <section
        id="hero-section"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <StarfieldCanvas />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: 700,
            padding: "0 32px",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(40px)",
            transition: "all 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div
            style={{
              fontFamily: DS.mono,
              fontSize: 11,
              color: "rgba(43,122,224,0.9)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Graduate Researcher · Robotics RL
          </div>

          <h1
            style={{
              fontFamily: DS.font,
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: "0.02em",
            }}
          >
            ChenRui
          </h1>

          <p
            style={{
              fontFamily: DS.font,
              fontSize: 17,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              margin: "0 0 40px",
              fontWeight: 300,
            }}
          >
            Building intelligent reward systems that teach robots to learn.
            <br />
            Bridging large language models and reinforcement learning
            <br />
            for autonomous manipulation.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              onClick={() => onNavigate("projects")}
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: DS.accent,
                border: "none",
                padding: "12px 28px",
                borderRadius: 6,
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#1E6AC8")}
              onMouseLeave={(e) => (e.target.style.background = DS.accent)}
            >
              Explore Projects
            </button>
            <button
              onClick={() => onNavigate("about")}
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "12px 28px",
                borderRadius: 6,
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.14)";
                e.target.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              About Me
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: entered ? 0.5 : 0,
            transition: "opacity 1.5s ease 0.8s",
          }}
        >
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
            SCROLL
          </div>
          <div
            style={{
              width: 1,
              height: 32,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              animation: "scrollPulse 2s infinite",
            }}
          />
        </div>
      </section>

      {/* Quick overview cards below hero */}
      <section style={{ padding: "80px 32px", background: DS.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 11, color: DS.accent, letterSpacing: "0.2em", marginBottom: 12 }}>
            EXPLORE
          </div>
          <h2 style={{ fontFamily: DS.font, fontSize: 28, fontWeight: 700, color: DS.accentDeep, margin: "0 0 40px" }}>
            What I Do
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                icon: "🤖",
                title: "Research Projects",
                desc: "Reinforcement learning, reward function optimization, and robotics — from concept to full-scale experiments.",
                page: "projects",
              },
              {
                icon: "🔧",
                title: "Knowledge Base",
                desc: "Battle-tested debug solutions, operational protocols, and architectural insights from real engineering.",
                page: "knowledge",
              },
              {
                icon: "👤",
                title: "About & Skills",
                desc: "Technical DNA, research focus, and the tools I work with daily.",
                page: "about",
              },
            ].map((card) => (
              <div
                key={card.page}
                onClick={() => onNavigate(card.page)}
                style={{
                  background: DS.surface,
                  border: `1px solid ${DS.border}`,
                  borderRadius: 10,
                  padding: "32px 28px",
                  cursor: "pointer",
                  boxShadow: DS.cardShadow,
                  transition: "all 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = DS.cardHover;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = DS.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = DS.cardShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = DS.border;
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontFamily: DS.font, fontSize: 17, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px" }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: DS.font, fontSize: 14, color: DS.textSec, lineHeight: 1.6, margin: "0 0 16px" }}>
                  {card.desc}
                </p>
                <span
                  style={{
                    fontFamily: DS.mono,
                    fontSize: 11,
                    color: DS.accent,
                    letterSpacing: "0.05em",
                  }}
                >
                  Explore →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured project highlight */}
      <section style={{ padding: "60px 32px 80px", background: DS.surfaceAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 11, color: DS.accent, letterSpacing: "0.2em", marginBottom: 12 }}>
            FEATURED
          </div>
          <div
            onClick={() => onNavigate("project-eureka-tra")}
            style={{
              background: "linear-gradient(135deg, #0D1B2E 0%, #1E3A5F 60%, #2B7AE0 100%)",
              borderRadius: 14,
              padding: "48px 56px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
            }}
          >
            <div>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(43,122,224,0.8)", letterSpacing: "0.2em", marginBottom: 8 }}>
                ACTIVE RESEARCH
              </div>
              <h3 style={{ fontFamily: DS.font, fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
                EUREKA-TRA
              </h3>
              <p style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
                Trajectory-aware reward optimization for robotics reinforcement learning. Extending NVIDIA EUREKA with temporal analysis.
              </p>
            </div>
            <div style={{ fontFamily: DS.font, fontSize: 32, color: "rgba(255,255,255,0.3)" }}>→</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECTS LIST PAGE
   ═══════════════════════════════════════════ */
function ProjectsPage({ onNavigate }) {
  return (
    <PageShell>
      <PageHeader mono="RESEARCH & ENGINEERING" title="Projects" desc="Each project opens into its own deep-dive page. Click to explore." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            onClick={() => onNavigate(`project-${p.id}`)}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              boxShadow: DS.cardShadow,
              transition: "all 0.35s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = DS.cardHover;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = DS.cardShadow;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Cover */}
            <div
              style={{
                height: 140,
                background: p.cover,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 40 }}>{p.icon}</span>
            </div>
            {/* Info */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontFamily: DS.font, fontSize: 20, fontWeight: 700, color: DS.accentDeep, margin: 0 }}>
                  {p.title}
                </h3>
                <span
                  style={{
                    fontFamily: DS.mono,
                    fontSize: 9,
                    color: p.status === "Active Research" ? "#2D9B6A" : DS.textMuted,
                    background: p.status === "Active Research" ? "#E8F5EE" : DS.surfaceAlt,
                    padding: "3px 10px",
                    borderRadius: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {p.status}
                </span>
              </div>
              <p style={{ fontFamily: DS.font, fontSize: 14, color: DS.textSec, lineHeight: 1.6, margin: "0 0 16px" }}>
                {p.brief}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: DS.mono,
                      fontSize: 10,
                      color: DS.textSec,
                      background: DS.surfaceAlt,
                      padding: "4px 10px",
                      borderRadius: 10,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   PROJECT DETAIL PAGE
   ═══════════════════════════════════════════ */
function ProjectDetailPage({ project, onNavigate }) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div>
      {/* Hero banner */}
      <div
        style={{
          background: project.cover,
          padding: "120px 32px 60px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => onNavigate("projects")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: DS.font,
              fontSize: 12,
              padding: "6px 16px",
              borderRadius: 6,
              cursor: "pointer",
              marginBottom: 24,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.18)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
          >
            ← Back to Projects
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>{project.icon}</span>
            <h1 style={{ fontFamily: DS.font, fontSize: 40, fontWeight: 700, color: "#fff", margin: 0 }}>
              {project.title}
            </h1>
          </div>
          <p style={{ fontFamily: DS.font, fontSize: 18, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            {project.fullContent.hero}
          </p>
        </div>
      </div>

      {/* Content with sidebar nav */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
        {/* Section tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${DS.border}`,
            marginBottom: 36,
            overflowX: "auto",
          }}
        >
          {project.fullContent.sections.map((sec, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              style={{
                background: "none",
                border: "none",
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: activeSection === i ? 600 : 400,
                color: activeSection === i ? DS.accent : DS.textMuted,
                padding: "12px 20px",
                cursor: "pointer",
                borderBottom: activeSection === i ? `2px solid ${DS.accent}` : "2px solid transparent",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Active section content */}
        <div
          key={activeSection}
          style={{
            fontFamily: DS.font,
            fontSize: 15,
            color: DS.text,
            lineHeight: 1.85,
            animation: "fadeIn 0.35s ease",
          }}
        >
          {project.fullContent.sections[activeSection].content}
        </div>

        {/* Tags */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${DS.borderLight}` }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: DS.mono,
                  fontSize: 10,
                  color: DS.accent,
                  background: DS.accentSoft,
                  padding: "5px 14px",
                  borderRadius: 12,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   KNOWLEDGE PAGE
   ═══════════════════════════════════════════ */
function KnowledgePage({ onNavigate }) {
  return (
    <PageShell>
      <PageHeader
        mono="KNOWLEDGE BASE"
        title="Field Notes"
        desc="Bugs conquered, patterns discovered, lessons crystallized. Click a category to dive deep."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {KNOWLEDGE.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`knowledge-${cat.id}`)}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              boxShadow: DS.cardShadow,
              transition: "all 0.35s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = DS.cardHover;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = DS.cardShadow;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                height: 100,
                background: cat.cover,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 32 }}>{cat.icon}</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <h3 style={{ fontFamily: DS.font, fontSize: 17, fontWeight: 700, color: DS.accentDeep, margin: "0 0 6px" }}>
                {cat.title}
              </h3>
              <p style={{ fontFamily: DS.font, fontSize: 13, color: DS.textSec, margin: "0 0 10px", lineHeight: 1.5 }}>
                {cat.tagline}
              </p>
              <span style={{ fontFamily: DS.mono, fontSize: 11, color: DS.textMuted }}>
                {cat.entries.length} {cat.entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   KNOWLEDGE DETAIL PAGE
   ═══════════════════════════════════════════ */
function KnowledgeDetailPage({ category, onNavigate }) {
  const [expandedEntry, setExpandedEntry] = useState(null);

  return (
    <div>
      <div style={{ background: category.cover, padding: "120px 32px 50px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => onNavigate("knowledge")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: DS.font,
              fontSize: 12,
              padding: "6px 16px",
              borderRadius: 6,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            ← Back to Knowledge
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>{category.icon}</span>
            <h1 style={{ fontFamily: DS.font, fontSize: 36, fontWeight: 700, color: "#fff", margin: 0 }}>
              {category.title}
            </h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px 80px" }}>
        {category.entries.map((entry, i) => (
          <div
            key={i}
            style={{
              background: DS.surface,
              border: `1px solid ${DS.border}`,
              borderRadius: 10,
              marginBottom: 16,
              overflow: "hidden",
              transition: "box-shadow 0.3s",
              boxShadow: expandedEntry === i ? DS.cardHover : DS.cardShadow,
            }}
          >
            <div
              onClick={() => setExpandedEntry(expandedEntry === i ? null : i)}
              style={{
                padding: "20px 28px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontFamily: DS.font, fontSize: 16, fontWeight: 600, color: DS.accentDeep, margin: 0 }}>
                  {entry.title}
                </h3>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {entry.tags.map((t) => (
                    <span key={t} style={{ fontFamily: DS.mono, fontSize: 9, color: DS.textMuted, background: DS.surfaceAlt, padding: "3px 8px", borderRadius: 8 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span
                style={{
                  fontFamily: DS.mono,
                  fontSize: 16,
                  color: DS.accent,
                  transform: expandedEntry === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s",
                }}
              >
                +
              </span>
            </div>

            {expandedEntry === i && (
              <div style={{ padding: "0 28px 24px", animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ background: "#FFF8F6", padding: "18px 20px", borderRadius: 8, borderLeft: "3px solid #D9756A" }}>
                    <div style={{ fontFamily: DS.mono, fontSize: 9, color: "#B85C5C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                      Problem
                    </div>
                    <div style={{ fontFamily: DS.font, fontSize: 13, color: DS.text, lineHeight: 1.7 }}>{entry.problem}</div>
                  </div>
                  <div style={{ background: "#F2FAF6", padding: "18px 20px", borderRadius: 8, borderLeft: "3px solid #2D9B6A" }}>
                    <div style={{ fontFamily: DS.mono, fontSize: 9, color: "#2D9B6A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                      Solution
                    </div>
                    <div style={{ fontFamily: DS.font, fontSize: 13, color: DS.text, lineHeight: 1.7 }}>{entry.solution}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════ */
function AboutPage() {
  const [barsVisible, setBarsVisible] = useState(false);
  const barsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarsVisible(true); },
      { threshold: 0.2 }
    );
    if (barsRef.current) observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <PageShell>
      <PageHeader mono="ABOUT" title="ChenRui" desc="Graduate researcher focused on making robots learn better, faster, and more reliably." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>
        <div>
          <h3 style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep, marginBottom: 16 }}>
            Research Focus
          </h3>
          <p style={{ fontFamily: DS.font, fontSize: 14, color: DS.textSec, lineHeight: 1.8, marginBottom: 20 }}>
            I work at the intersection of reinforcement learning and large language models, designing systems that automatically
            generate and optimize reward functions for robotic manipulation tasks. My current project, EUREKA-TRA, introduces
            structured trajectory analysis to replace the scalar feedback loop in LLM-driven reward optimization.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ABOUT_DATA.interests.map((i) => (
              <span
                key={i}
                style={{
                  fontFamily: DS.mono,
                  fontSize: 10,
                  color: DS.accent,
                  background: DS.accentSoft,
                  padding: "5px 14px",
                  borderRadius: 12,
                }}
              >
                {i}
              </span>
            ))}
          </div>
        </div>

        <div ref={barsRef}>
          <h3 style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep, marginBottom: 20 }}>
            Technical DNA
          </h3>
          {ABOUT_DATA.tools.map((tool, i) => (
            <div key={tool.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: DS.font, fontSize: 13, color: DS.text, fontWeight: 500 }}>{tool.name}</span>
                <span style={{ fontFamily: DS.mono, fontSize: 11, color: DS.textMuted }}>{tool.level}%</span>
              </div>
              <div style={{ height: 5, background: DS.borderLight, borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: barsVisible ? `${tool.level}%` : "0%",
                    background: `linear-gradient(90deg, ${DS.accent}, ${DS.accentDeep})`,
                    borderRadius: 3,
                    transition: `width 0.9s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact placeholder */}
      <div
        style={{
          background: DS.surfaceAlt,
          borderRadius: 12,
          padding: "36px 40px",
          border: `1px solid ${DS.border}`,
          textAlign: "center",
        }}
      >
        <h3 style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep, marginBottom: 8 }}>
          Get in Touch
        </h3>
        <p style={{ fontFamily: DS.font, fontSize: 14, color: DS.textSec, margin: 0 }}>
          Interested in collaboration or want to learn more? Reach out via email or GitHub.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
          {["GitHub", "Email", "Google Scholar"].map((link) => (
            <span
              key={link}
              style={{
                fontFamily: DS.mono,
                fontSize: 12,
                color: DS.accent,
                cursor: "pointer",
                padding: "8px 18px",
                borderRadius: 6,
                border: `1px solid ${DS.border}`,
                background: DS.surface,
                transition: "all 0.2s",
              }}
            >
              {link}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */
function PageShell({ children }) {
  return (
    <div
      style={{
        paddingTop: 80,
        paddingBottom: 60,
        paddingLeft: 32,
        paddingRight: 32,
        minHeight: "100vh",
        background: DS.bg,
        animation: "pageEnter 0.45s ease",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function PageHeader({ mono, title, desc }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: DS.mono, fontSize: 11, color: DS.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
        {mono}
      </div>
      <h1 style={{ fontFamily: DS.font, fontSize: 32, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px" }}>
        {title}
      </h1>
      {desc && (
        <p style={{ fontFamily: DS.font, fontSize: 15, color: DS.textSec, margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "40px 32px",
        background: DS.accentDeep,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 6 }}>
        CHENRUI
      </div>
      <div style={{ fontFamily: DS.font, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
        Graduate Researcher · Robotics RL · Building intelligent reward systems
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP — Router
   ═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const navigate = useCallback((target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Detect hero visibility for nav theming
  useEffect(() => {
    if (page !== "home") {
      setIsHeroVisible(false);
      return;
    }
    const heroEl = document.getElementById("hero-section");
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      ([e]) => setIsHeroVisible(e.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [page]);

  // Determine active nav tab
  const activeNav = page.startsWith("project") ? "projects" : page.startsWith("knowledge") ? "knowledge" : page;

  // Route to page
  function renderPage() {
    if (page === "home") return <HomePage onNavigate={navigate} />;
    if (page === "projects") return <ProjectsPage onNavigate={navigate} />;
    if (page === "knowledge") return <KnowledgePage onNavigate={navigate} />;
    if (page === "about") return <AboutPage />;

    // Project detail
    if (page.startsWith("project-")) {
      const id = page.replace("project-", "");
      const project = PROJECTS.find((p) => p.id === id);
      if (project) return <ProjectDetailPage project={project} onNavigate={navigate} />;
    }

    // Knowledge detail
    if (page.startsWith("knowledge-")) {
      const id = page.replace("knowledge-", "");
      const cat = KNOWLEDGE.find((k) => k.id === id);
      if (cat) return <KnowledgeDetailPage category={cat} onNavigate={navigate} />;
    }

    return <HomePage onNavigate={navigate} />;
  }

  return (
    <div style={{ fontFamily: DS.font, background: DS.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${DS.accentSoft}; color: ${DS.accentDeep}; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.6; transform: scaleY(1.2); }
        }
      `}</style>

      <NavBar currentPage={activeNav} onNavigate={navigate} isHeroVisible={isHeroVisible} />
      {renderPage()}
      <Footer />
    </div>
  );
}
