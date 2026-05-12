import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════
   DESIGN SYSTEM — NASA-inspired, YaHei, Space
   ═══════════════════════════════════════════ */
const DS = {
  font: `"Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif`,
  mono: `"Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif`,
  // Light, airy palette
  bg: "#EDF5FF",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F8FE",
  accent: "#3B82F6",
  accentSoft: "#DCEBFF",
  accentDeep: "#18355C",
  accentLavender: "#DCCEFF",
  accentPink: "#FFD7EB",
  text: "#1A2840",
  textSec: "#536A89",
  textMuted: "#8AA0BC",
  border: "#D7E4F3",
  borderLight: "#ECF3FB",
  heroGrad1: "#070B14",
  heroGrad2: "#0D1B2E",
  heroGrad3: "#102440",
  cardShadow: "0 12px 34px rgba(80,122,188,0.08)",
  cardHover: "0 18px 42px rgba(80,122,188,0.14)",
};

const MOBILE_BREAKPOINT = 980;

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "home", label: "首页" },
  { id: "projects", label: "项目" },
  { id: "knowledge", label: "知识库" },
  { id: "fragments", label: "碎语" },
  { id: "about", label: "关于" },
];

function getPageFromHash() {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash || "home";
}

function setInteractiveSurfaceState(element, active, config = {}) {
  const {
    idleShadow = "",
    activeShadow = idleShadow,
    idleBorder = "",
    activeBorder = idleBorder,
    translateY = 4,
    scale = 1.008,
  } = config;

  if (!element) return;
  element.style.boxShadow = active ? activeShadow : idleShadow;
  element.style.transform = active ? `translateY(-${translateY}px) scale(${scale})` : "translateY(0) scale(1)";
  if (activeBorder) element.style.borderColor = active ? activeBorder : idleBorder;
}

function interactiveSurfaceProps(config = {}) {
  return {
    onMouseEnter: (e) => setInteractiveSurfaceState(e.currentTarget, true, config),
    onMouseLeave: (e) => setInteractiveSurfaceState(e.currentTarget, false, config),
  };
}

function normalizeMaterialName(value) {
  return value.toLowerCase().replace(/[._\s]+/g, "-");
}

function getArchiveMaterials(archive) {
  const keywords = [archive.id, ...(archive.keywords || [])].map(normalizeMaterialName);

  const scored = MATERIAL_LIBRARY.map((item) => {
    const name = normalizeMaterialName(item.baseName);
    let score = 0;

    keywords.forEach((keyword) => {
      if (name === keyword) score += 8;
      if (name.startsWith(`${keyword}-`) || name.startsWith(`${keyword}_`)) score += 7;
      if (name.includes(`-${keyword}-`) || name.includes(`_${keyword}_`)) score += 6;
      if (name.includes(keyword)) score += 4;
    });

    if (archive.preferredTypes?.includes(item.type)) score += 1;

    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.fileName.localeCompare(b.fileName, "zh-CN"));

  return scored.length ? scored : MATERIAL_LIBRARY;
}

function pickMaterialByType(materials, type) {
  return materials.find((item) => item.type === type) || MATERIAL_LIBRARY.find((item) => item.type === type) || null;
}

const PROJECTS = [
  {
    id: "eureka-tra",
    title: "Title",
    tagline: "标签",
    status: "本科",
    cover: "linear-gradient(135deg, #0D1B2E 0%, #1E3A5F 50%, #2B7AE0 100%)",
    icon: "🤖",
    brief: "占位(主题)",
    tags: ["强化学习", "奖励塑造", "大语言模型", "Isaac Lab"],
    // Full page content
    fullContent: {
      hero: "用智能奖励设计教会机器人学习",
      sections: [
        {
          title: "概览",
          content: "balabala",
        },
        {
          title: "架构",
          content: "架构",
        },
        {
          title: "实现",
          content: "具体实现",
        },
        {
          title: "变体与消融",
          content: "实验设置",
        },
        {
          title: "当前进展",
          content: "当前进展",
        },
      ],
    },
  },
  {
    id: "future-project",
    title: "running...",
    tagline: "敬请期待",
    status: "懒得写",
    cover: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    icon: "🚀",
    brief: "Wandering...",
    tags: ["Tag"],
    fullContent: {
      hero: "酝酿中...",
      sections: [
        { title: "State", content: "主播累了，明天再写" },
      ],
    },
  },
];

const KNOWLEDGE = [
  {
    id: "debug-stories",
    title: "debug手记",
    tagline: "生产与实验环境的踩坑与解法",
    icon: "🔧",
    cover: "linear-gradient(135deg, #2D1B0E 0%, #4A2E1A 50%, #D4963A 100%)",
    readingProtocol: [
      "先看问题陈述，再看解法，不急着下结论。",
      "把条目当案例而不是答案，它们更像复盘记录。",
      "如果某条看起来过于朴素，通常说明它真的来自现场。",
    ],
    marginNote: "学术感来自证据链，幽默感只负责缓解排查时的人类损耗，不负责替代方法论。",
    entries: [
      {
        title: "服务器上Vulkan ICD死锁",
        problem: "Isaac Sim卡死：显存约占用低于正常值、SM 利用率 0% —— GPU已分配但完全空闲。",
        solution: "Reason: 尝试启动显示服务，但训练无需可视化。处理：unset DISPLAY并校正 LD_LIBRARY_PATH。恢复：对Vulkan死锁典型模式实施kill -9大法。",
        tags: ["GPU", "Isaac Sim", "Vulkan"],
      },
      // {
      //   title: "奖励组件命名静默不一致",
      //   problem: "训练看似正常，策略却学不到有效行为——无报错、无告警。",
      //   solution: "多任务脚本中变量名不一致：reward_components_batch 与 components_batch。已补充断言检查与命名规范以防复发。",
      //   tags: ["Python", "强化学习", "静默 Bug"],
      // },
      {
        title: "批处理脚本「进程风暴」",
        problem: "启动脚本一次性拉起大量并发进程而非预期的进程数——服务器近乎无响应。",
        solution: "Bash 子 shell 中 PID 捕获错误。重写为带锁文件、PID 校验、错峰启动，并启用set -uo pipefail。",
        tags: ["Bash", "进程管理"],
      },
      // {
      //   title: "写这个",
      //   problem: "写这个页面的时候，进行修改，npm run dev未正确渲染",
      //   solution: "Reason: 尝试启动显示服务，但训练无需可视化。处理：unset DISPLAY并校正 LD_LIBRARY_PATH。恢复：对Vulkan死锁典型模式实施kill -9大法。",
      //   tags: ["GPU", "Isaac Sim", "Vulkan"],
      // },
    ],
  },
  {
    id: "protocols",
    title: "运维守则",
    tagline: "教训换来的规矩(骂骂咧咧)",
    icon: "📋",
    cover: "linear-gradient(135deg, #0E2D1B 0%, #1A4A2E 50%, #2D9B6A 100%)",
    readingProtocol: [
      "规则不是教条，是上了血税之后写下来的。",
      "执行比理解优先——不确定时先照做，再追问为什么。",
      "如果某条守则看起来小题大做，说明你没见过它缺席的后果。",
    ],
    marginNote: "纪律的价值不在于限制了什么，而在于保护了什么。",
    entries: [
      {
        title: "服务器纪律",
        problem: "行为守则",
        solution: "一卡一主进程；习惯用 screen；启动前ps aux；不要被nvidia-smi蒙蔽了双眼——结合进程树交叉核对。",
        tags: ["GPU", "最佳实践"],
      },
      // {
      //   title: "实验可复现性",
      //   problem: "不同批次间配置漂移，导致跨随机种子对比失效。",
      //   solution: "每批实验全局配置锁定；不要把预实验数据（候选数/环境数不同）与完整配置跑法混用；记录每一次配置差异。",
      //   tags: ["实验设计", "方法论"],
      // },
    ],
  },
  {
    id: "tech-notes",
    title: "技术札记",
    tagline: "架构取舍与设计模式",
    icon: "📝",
    cover: "linear-gradient(135deg, #1B0E2D 0%, #2E1A4A 50%, #7B3AE0 100%)",
    readingProtocol: [
      "先看取舍，再看方案——每个架构决策背后都有它放弃的东西。",
      "与其问「为什么这样做」，不如问「为什么不那样做」。",
      "理论上更优的方案，往往败给了工程上更可控的方案。",
    ],
    marginNote: "架构没有最优解，只有在当时约束下最合适的解。这句话不是在为妥协辩护。",
    entries: [
      {
        title: "强化训练的子进程架构",
        problem: "同一进程内多环境并行时 PhysX 冲突。",
        solution: "用 AppLauncher 而非直接 SimulationApp，避免 PhysX 初始化冲突；独立 run_one_iter.py 子进程通过 JSON 文件通信；跨 conda 环境 GLIBCXX 不兼容时用 LD_PRELOAD 规避。",
        tags: ["架构", "Isaac Sim", "设计模式"],
      },
    ],
  },
];

const ABOUT_DATA = {
  role: "本科",
  focus: "机器人强化学习",
  interests: ["奖励函数设计", "大模型驱动的优化", "仿真到真机迁移", "自主操作"],
  tools: [
    { name: "Python / PyTorch", level: 90 },
    { name: "强化学习", level: 88 },
    { name: "Isaac Sim / Gym", level: 82 },
    { name: "Linux", level: 85 },
    { name: "大语言模型", level: 78 },
    { name: "科研与写作", level: 75 },
  ],
};

const HOME_FRAGMENT_DATA = {
  note: "我偏爱那些克制、准确、长期有效的东西。比起热闹，我更倾向结构、节奏与留白。",
  whispers: [
    "享受深夜高速带来的静谧",
    "葬在墓里的污浊不需要多好的泥土，路人踢了一堆尘土，便是最好的安息",
    "一起躺在雪原，极光在头顶舞动，冰块碎裂的声音绘制成依偎相伴两人的心跳",
    "眼眸镶钻，暗面浓妆，精致清纯，光影斑驳，漠视无心",
    "心河旁的小木屋，关着一颗曾经炽热的心",
    "将玫瑰藏于身后，像藏起一份体面的告白",
    "分别是爱情曾经存在的象征",
    "欭惗",
    "我们终将落俗，但浪漫至死不渝",
    "天在将黑尾黑时最美，情在将离未离时最伤",
    "你记得花，花就不会枯萎；你记得我，我就一直在",
    "我梦见我们看海，也梦见我们相爱",
  ],
  hobbies: ["科幻", "赛车", "在路上", "音乐", "射击", "拍照记录"],
};

// 修改这里的密码
const FRAGMENTS_PASSWORD = "cr2024";

const INTERESTS_CATEGORIES = [
  {
    id: "f1",
    title: "F1",
    en: "Formula One",
    desc: "速度、策略、极限工程，每个赛季都是新故事。",
    color: "rgba(255,60,0,0.08)",
    accent: "rgba(255,60,0,0.72)",
    border: "rgba(255,100,60,0.22)",
  },
  {
    id: "cars",
    title: "爱车",
    en: "Automobiles",
    desc: "对机械美学和个人归属感的执念。",
    color: "rgba(40,80,180,0.07)",
    accent: "rgba(40,80,180,0.72)",
    border: "rgba(80,120,220,0.2)",
  },
  {
    id: "scenery",
    title: "风景",
    en: "Landscape",
    desc: "走过的路、看过的天，用镜头留住那一刻。",
    color: "rgba(30,160,100,0.07)",
    accent: "rgba(30,140,90,0.72)",
    border: "rgba(60,160,110,0.2)",
  },
  {
    id: "movies",
    title: "电影",
    en: "Cinema",
    desc: "光影造梦，深夜的小世界。",
    color: "rgba(120,60,160,0.07)",
    accent: "rgba(110,50,150,0.72)",
    border: "rgba(150,90,200,0.2)",
  },
];

const MATERIAL_IMPORTS = import.meta.glob("../material/*", {
  eager: true,
  import: "default",
  query: "?url",
});

const MATERIAL_LIBRARY = Object.entries(MATERIAL_IMPORTS)
  .map(([path, url]) => {
    const fileName = path.split("/").pop() || path;
    const ext = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const prettyName = baseName
      .split(/[-_]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    let type = "other";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) type = "image";
    if (ext === "md") type = "markdown";
    if (ext === "docx") type = "docx";
    if (ext === "xlsx") type = "xlsx";

    return {
      id: baseName,
      fileName,
      baseName,
      prettyName,
      ext,
      type,
      url,
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName, "zh-CN"));

const PROJECT_ARCHIVES = [
  {
    id: "research-archive",
    label: "研究档案",
    mono: "Research Archive",
    title: "研究档案",
    desc: "研究目标、问题定义、阶段性摘要、论文草稿和核心叙事。",
    keywords: ["research", "archive", "paper", "summary", "论文", "摘要", "研究", "档案"],
    preferredTypes: ["markdown", "docx", "image"],
    notes: ["论文摘要、课题路线、阶段规划。", "biu~"],
  },
  {
    id: "method-design",
    label: "方法设计",
    mono: "Method Design",
    title: "方法设计",
    desc: "算法流程、模块解释、推导思路、结构图和版本演进记录。",
    keywords: ["method", "design", "architecture", "algorithm", "方法", "设计", "结构", "流程", "算法"],
    preferredTypes: ["markdown", "image", "docx"],
    notes: ["方法框图、设计原则、消融思路。", "biu~"],
  },
  {
    id: "experiment-record",
    label: "实验记录",
    mono: "Experiment Record",
    title: "实验记录",
    desc: "实验设置、结果摘要、异常样本、阶段性复盘。",
    keywords: ["experiment", "record", "result", "ablation", "metric", "实验", "记录", "结果", "消融", "指标"],
    preferredTypes: ["xlsx", "markdown", "image"],
    notes: ["实验日志、表格截图、关键结果。", "biu~"],
  },
  {
    id: "engineering-implementation",
    label: "工程实现",
    mono: "Engineering",
    title: "工程实现",
    desc: "系统架构、脚本组织、目录设计、接口说明和部署笔记。",
    keywords: ["engineering", "implementation", "deploy", "system", "script", "工程", "实现", "部署", "系统", "脚本"],
    preferredTypes: ["docx", "markdown", "image"],
    notes: ["架构说明、部署步骤、模块依赖。", "biu~"],
  },
];

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
      // Orbital bodies — restrained mission-display style
      const coreColor = "#DCE7F6";
      orbitsRef.current = [
        { radius: 0, size: 3, color: coreColor, glow: "#A7BFE2", speed: 0, angle: 0, isSun: true },
        { radius: 88, size: 1.4, color: "#E3ECF8", glow: "#A7BFE2", speed: 0.0032, angle: Math.random() * Math.PI * 2 },
        { radius: 150, size: 1.8, color: "#CBD9EB", glow: "#89A7CF", speed: 0.0022, angle: Math.random() * Math.PI * 2 },
        { radius: 236, size: 1.2, color: "#A8BDD7", glow: "#7F98B9", speed: 0.0014, angle: Math.random() * Math.PI * 2 },
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
          ctx.strokeStyle = "rgba(200,220,255,0.05)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw bodies
      orbitsRef.current.forEach((body) => {
        body.angle += body.speed;
        const bx = body.isSun ? cx : cx + Math.cos(body.angle) * body.radius;
        const by = body.isSun ? cy : cy + Math.sin(body.angle) * body.radius * 0.4; // Perspective ellipse

        // Glow
        const glowGrad = ctx.createRadialGradient(bx, by, 0, bx, by, body.size * (body.isSun ? 7 : 3));
        glowGrad.addColorStop(0, body.glow + (body.isSun ? "35" : "22"));
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bx, by, body.size * (body.isSun ? 4 : 2.5), 0, Math.PI * 2);
        ctx.fill();

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
function NavBar({ currentPage, onNavigate, isHeroVisible, isMobile }) {
  const dark = currentPage === "home" && isHeroVisible;

  return (
    <nav
      className="nav-shell"
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
          height: isMobile ? 52 : 56,
          padding: isMobile ? "0 14px" : "0 32px",
          gap: isMobile ? 10 : 0,
        }}
      >
        <div
          className="nav-brand interactive-node"
          onClick={() => onNavigate("home")}
          style={{
            fontFamily: DS.font,
            fontSize: isMobile ? 13 : 15,
            fontWeight: 700,
            color: dark ? "#fff" : DS.accentDeep,
            cursor: "pointer",
            letterSpacing: isMobile ? "0.08em" : "0.18em",
            textTransform: "uppercase",
            transition: "color 0.4s",
            whiteSpace: "nowrap",
          }}
        >
          My Aurora
        </div>

        <div style={{ display: "flex", gap: isMobile ? 6 : 10, overflowX: isMobile ? "auto" : "visible", paddingBottom: isMobile ? 2 : 0 }}>
          {NAV_ITEMS.map((item) => (
            <button
              className="nav-pill interactive-node"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: currentPage === item.id
                  ? (dark ? "rgba(255,255,255,0.08)" : DS.accentSoft)
                  : "none",
                border: currentPage === item.id
                  ? (dark ? "1px solid rgba(255,255,255,0.12)" : `1px solid ${DS.border}`)
                  : "1px solid transparent",
                fontFamily: DS.mono,
                fontSize: isMobile ? 10 : 11,
                fontWeight: 500,
                color: dark
                  ? (currentPage === item.id ? "#fff" : "rgba(255,255,255,0.65)")
                  : (currentPage === item.id ? DS.accent : DS.textSec),
                cursor: "pointer",
                padding: isMobile ? "6px 10px" : "7px 14px",
                borderRadius: 999,
                transition: "all 0.3s ease",
                letterSpacing: isMobile ? "0.06em" : "0.12em",
                whiteSpace: "nowrap",
                flexShrink: 0,
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
function HomePage({ onNavigate, isMobile }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 200); }, []);

  return (
    <div>
      <section
        id="hero-section"
        style={{
          position: "relative",
          height: isMobile ? "88vh" : "100vh",
          minHeight: isMobile ? 620 : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <StarfieldCanvas />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05), transparent 22%),
              radial-gradient(circle at 50% 115%, rgba(61,120,186,0.18), transparent 42%),
              linear-gradient(180deg, rgba(4,7,12,0.28) 0%, rgba(4,8,14,0.82) 100%)
            `,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: isMobile ? 10 : 24,
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: isMobile ? 18 : 30,
            zIndex: 2,
            pointerEvents: "none",
            boxShadow: "inset 0 0 120px rgba(255,255,255,0.02)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: 820,
            padding: isMobile ? "0 16px" : "0 32px",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(22px)",
            transition: "all 1.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <div
            style={{
              fontFamily: DS.mono,
              fontSize: isMobile ? 9 : 10,
              color: "rgba(255,255,255,0.34)",
              letterSpacing: isMobile ? "0.22em" : "0.34em",
              textTransform: "uppercase",
              marginBottom: isMobile ? 16 : 26,
            }}
          >
            Personal Archive
          </div>

          <div
            style={{
              width: isMobile ? 124 : 150,
              margin: isMobile ? "0 auto 22px" : "0 auto 34px",
              padding: isMobile ? "8px 12px" : "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
              boxShadow: "0 20px 60px rgba(0,0,0,0.26)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                top: "50%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: DS.mono,
                fontSize: 10,
                color: "rgba(255,255,255,0.78)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              {/* <span>Archive</span>
              <span>01</span> */}
            </div>
          </div>

          <div
            style={{
              fontFamily: DS.mono,
              fontSize: isMobile ? 10 : 11,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: isMobile ? "0.22em" : "0.38em",
              textTransform: "uppercase",
              marginBottom: isMobile ? 14 : 20,
            }}
          >
            Aurora / Personal Station
          </div>

          <h1
            style={{
              fontFamily: DS.font,
              fontSize: isMobile ? 38 : 56,
              color: "#FFFFFF",
              lineHeight: isMobile ? 1.08 : 1.02,
              margin: isMobile ? "0 0 12px" : "0 0 16px",
              letterSpacing: isMobile ? "0.06em" : "0.12em",
              fontWeight: 700,
            }}
          >
            Aurora
          </h1>

          <div
            style={{
              fontFamily: DS.mono,
              fontSize: isMobile ? 10 : 11,
              color: "rgba(255,255,255,0.52)",
              letterSpacing: isMobile ? "0.14em" : "0.24em",
              textTransform: "uppercase",
              marginBottom: isMobile ? 16 : 22,
            }}
          >
            Research / Notes / Preferences / Fragments
          </div>

          <div
            style={{
              width: 110,
              height: 1,
              margin: "0 auto",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 20 : 34,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: entered ? 0.42 : 0,
            transition: "opacity 1.5s ease 0.8s",
          }}
        >
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(255,255,255,0.34)", letterSpacing: "0.24em", textTransform: "uppercase" }}>
            Scroll
          </div>
          <div
            style={{
              width: 1,
              height: isMobile ? 30 : 42,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              animation: "scrollPulse 2s infinite",
            }}
          />
        </div>
      </section>

      <section style={{ padding: "82px 32px 96px", background: "#08111B" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: "0.28em", marginBottom: 16, textTransform: "uppercase" }}>
            Archive Access
          </div>
          <h2 style={{ fontFamily: DS.font, fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "0.06em" }}>
            Search Aurora
          </h2>
          <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(255,255,255,0.52)", margin: "0 0 38px", maxWidth: 560, lineHeight: 1.8 }}>
            一间档案馆，一个信息小家
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1.05fr",
              gridTemplateRows: "auto auto",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            <div
              className="interactive-node editorial-card"
              onClick={() => onNavigate("projects")}
              style={{
                gridColumn: "1 / 3",
                gridRow: "1 / 2",
                background: "linear-gradient(150deg, rgba(255,255,255,0.97) 0%, rgba(232,244,255,0.92) 55%, rgba(212,232,255,0.86) 100%)",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: 28,
                padding: "30px 32px 28px",
                cursor: "pointer",
                boxShadow: "0 22px 54px rgba(102,140,196,0.1)",
                transition: "all 0.35s ease",
                position: "relative",
                overflow: "hidden",
              }}
              {...interactiveSurfaceProps({
                idleShadow: "0 22px 54px rgba(102,140,196,0.1)",
                activeShadow: "0 30px 66px rgba(102,140,196,0.16)",
                idleBorder: DS.borderLight,
                activeBorder: "rgba(94,144,227,0.3)",
                translateY: 4,
                scale: 1.008,
              })}
            >
              <div style={{ position: "absolute", top: -50, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,170,230,0.2), transparent 70%)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,214,255,0.16), transparent 72%)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
                <div>
                  <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(80,116,167,0.68)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
                    Research Section
                  </div>
                  <h3 style={{ fontFamily: DS.font, fontSize: 28, fontWeight: 700, color: DS.accentDeep, margin: 0 }}>
                    研究项目
                  </h3>
                </div>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(78,114,168,0.54)", letterSpacing: "0.16em", textTransform: "uppercase", paddingTop: 2 }}>
                  Research Index
                </div>
              </div>

              <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(63,84,115,0.86)", lineHeight: 1.85, margin: "0 0 14px", position: "relative", maxWidth: 720 }}>
                具体作品、代表项目和更深入的研究叙事。
              </p>

              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${DS.borderLight}, transparent)`, margin: "14px 0", position: "relative" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["RL", "Reward Design", "LLM", "Isaac Sim", "Project Dossier"].map((tag) => (
                    <span key={tag} style={{ fontFamily: DS.mono, fontSize: 10, color: DS.accentDeep, background: "rgba(239,246,255,0.88)", border: `1px solid ${DS.borderLight}`, padding: "5px 10px", borderRadius: 999 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(65,101,154,0.84)", letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap", paddingLeft: 16 }}>
                  进入档案 →
                </div>
              </div>
            </div>

            <div
              className="interactive-node editorial-card"
              onClick={() => onNavigate("fragments")}
              style={{
                gridColumn: "3 / 4",
                gridRow: "1 / 3",
                background: "linear-gradient(160deg, rgba(255,230,241,0.78) 0%, rgba(211,235,255,0.76) 42%, rgba(255,255,255,0.92) 100%)",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: 28,
                padding: "28px 24px 26px",
                boxShadow: "0 22px 56px rgba(130,149,190,0.12)",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(18px)",
                cursor: "pointer",
                transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              }}
              {...interactiveSurfaceProps({
                idleShadow: "0 22px 56px rgba(130,149,190,0.12)",
                activeShadow: "0 28px 62px rgba(130,149,190,0.16)",
                idleBorder: DS.borderLight,
                activeBorder: "rgba(199,153,212,0.34)",
                translateY: 4,
                scale: 1.01,
              })}
            >
              <div style={{ position: "absolute", width: 220, height: 220, right: -48, top: -26, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,191,230,0.38), rgba(255,191,230,0.08) 42%, transparent 72%)", filter: "blur(22px)", animation: "blobFloatA 14s ease-in-out infinite" }} />
              <div style={{ position: "absolute", width: 180, height: 180, left: -40, top: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(177,224,255,0.34), rgba(177,224,255,0.08) 44%, transparent 72%)", filter: "blur(18px)", animation: "blobFloatB 16s ease-in-out infinite" }} />
              <div style={{ position: "absolute", width: 150, height: 150, right: 26, bottom: -28, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,238,244,0.2), rgba(255,238,244,0.06) 38%, transparent 72%)", filter: "blur(16px)", animation: "blobFloatC 18s ease-in-out infinite" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)", transform: "translateX(-100%)", animation: "shineSweep 10s linear infinite" }} />
              <div style={{ position: "absolute", left: 22, right: 22, top: 76, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }} />
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(134,104,145,0.76)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 18, position: "relative" }}>
                Fragments
              </div>
              <div style={{ fontFamily: DS.font, fontSize: 20, fontWeight: 700, color: DS.accentDeep, marginBottom: 18, position: "relative" }}>
                随言碎语
              </div>
              <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(73,83,112,0.88)", lineHeight: 1.95, margin: "0 0 28px", position: "relative" }}>
                {HOME_FRAGMENT_DATA.note}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(126,97,144,0.72)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(126,97,144,0.84)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Private · Enter
                </div>
              </div>
            </div>

            <div
              className="interactive-node editorial-card"
              onClick={() => onNavigate("knowledge")}
              style={{
                gridColumn: "1 / 2",
                gridRow: "2 / 3",
                background: "linear-gradient(150deg, rgba(255,255,255,0.96), rgba(231,244,255,0.88) 60%, rgba(227,241,237,0.82) 100%)",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: "26px 18px 26px 18px",
                padding: "26px 24px",
                cursor: "pointer",
                boxShadow: "0 18px 48px rgba(108,143,190,0.1)",
                transition: "all 0.35s ease",
              }}
              {...interactiveSurfaceProps({
                idleShadow: "0 18px 48px rgba(108,143,190,0.1)",
                activeShadow: "0 24px 56px rgba(108,143,190,0.14)",
                idleBorder: DS.borderLight,
                activeBorder: "rgba(114,165,214,0.32)",
                translateY: 4,
                scale: 1.01,
              })}
            >
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(80,116,167,0.72)", letterSpacing: "0.2em", marginBottom: 14, textTransform: "uppercase" }}>
                Knowledge Base
              </div>
              <h3 style={{ fontFamily: DS.font, fontSize: 24, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px" }}>
                知识库
              </h3>
              <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(63,84,115,0.86)", lineHeight: 1.78, margin: "0 0 18px" }}>
                踩坑、排障、协议、工程经验。比起展示结论，这里更重视过程里的判断和代价。
              </p>
              <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(65,101,154,0.86)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Open Notes
              </div>
            </div>

            <div
              className="interactive-node editorial-card"
              onClick={() => onNavigate("interests")}
              style={{
                gridColumn: "2 / 3",
                gridRow: "2 / 3",
                background: "linear-gradient(150deg, rgba(255,243,250,0.94), rgba(238,232,255,0.88) 52%, rgba(255,255,255,0.96) 100%)",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: "18px 28px 18px 28px",
                padding: "24px 24px 26px",
                cursor: "pointer",
                boxShadow: "0 16px 42px rgba(130,112,170,0.1)",
                transition: "all 0.35s ease",
                position: "relative",
                overflow: "hidden",
              }}
              {...interactiveSurfaceProps({
                idleShadow: "0 16px 42px rgba(130,112,170,0.1)",
                activeShadow: "0 24px 56px rgba(130,112,170,0.15)",
                idleBorder: DS.borderLight,
                activeBorder: "rgba(192,154,230,0.3)",
                translateY: 4,
                scale: 1.01,
              })}
            >
              <div style={{ position: "absolute", top: -28, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,230,0.28), transparent 72%)", filter: "blur(12px)" }} />
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(130,98,158,0.72)", letterSpacing: "0.2em", marginBottom: 14, textTransform: "uppercase", position: "relative" }}>
                Interests
              </div>
              <h3 style={{ fontFamily: DS.font, fontSize: 22, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px", position: "relative" }}>
                兴趣小窝
              </h3>
              <p style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(72,82,116,0.84)", lineHeight: 1.78, margin: "0 0 16px", position: "relative" }}>
                一些小偏好，组成我的小世界
              </p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", position: "relative" }}>
                {HOME_FRAGMENT_DATA.hobbies.map((item) => (
                  <span key={item} style={{ fontFamily: DS.font, fontSize: 12, color: "rgba(96,72,130,0.88)", padding: "5px 10px", borderRadius: 999, background: "rgba(245,238,255,0.82)", border: `1px solid ${DS.borderLight}` }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageActions({ onNavigate, dark = false, backTarget = "home", backLabel = "返回首页", onBack, showHome = true }) {
  const baseButtonStyle = {
    fontFamily: DS.mono,
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    borderRadius: 999,
    padding: "9px 14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  };

  const secondaryStyle = dark
    ? {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.78)",
      }
    : {
        background: DS.surface,
        border: `1px solid ${DS.border}`,
        color: DS.textSec,
      };

  const homeStyle = dark
    ? {
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.16)",
        color: "#fff",
      }
    : {
        background: "transparent",
        border: `1px solid ${DS.border}`,
        color: DS.accentDeep,
      };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
      {backTarget && backTarget !== "home" && (
        <button
          onClick={() => (onBack ? onBack() : onNavigate(backTarget))}
          style={{ ...baseButtonStyle, ...secondaryStyle }}
        >
          {backLabel}
        </button>
      )}
      {showHome && (
        <button
          onClick={() => onNavigate("home")}
          style={{ ...baseButtonStyle, ...homeStyle }}
        >
          {backTarget === "home" ? backLabel : "首页"}
        </button>
      )}
    </div>
  );
}

function ThemeBackground({ theme = "default" }) {
  const configMap = {
    default: {
      base: "radial-gradient(circle at 14% 8%, rgba(120,177,255,0.42), transparent 26%), radial-gradient(circle at 86% 10%, rgba(255,207,233,0.3), transparent 22%), linear-gradient(180deg, #F5FAFF 0%, #EAF3FF 58%, #F8FBFF 100%)",
      glowA: "rgba(107,170,255,0.28)",
      glowB: "rgba(255,195,230,0.22)",
      line: "rgba(72,112,170,0.08)",
    },
    projects: {
      base: "radial-gradient(circle at 14% 6%, rgba(123,187,255,0.46), transparent 26%), radial-gradient(circle at 84% 12%, rgba(194,228,255,0.36), transparent 22%), linear-gradient(180deg, #F7FBFF 0%, #E8F2FF 46%, #DDEBFF 100%)",
      glowA: "rgba(92,164,255,0.3)",
      glowB: "rgba(175,213,255,0.24)",
      line: "rgba(84,120,170,0.08)",
    },
    projectDetail: {
      base: "radial-gradient(circle at 50% -10%, rgba(171,212,255,0.36), transparent 24%), radial-gradient(circle at 10% 18%, rgba(132,170,242,0.28), transparent 20%), linear-gradient(180deg, #F6FAFF 0%, #E4EEFF 48%, #D9E7FF 100%)",
      glowA: "rgba(153,203,255,0.28)",
      glowB: "rgba(130,172,255,0.2)",
      line: "rgba(82,118,168,0.08)",
    },
    knowledge: {
      base: "radial-gradient(circle at 12% 10%, rgba(146,197,255,0.34), transparent 22%), radial-gradient(circle at 84% 18%, rgba(255,225,191,0.28), transparent 18%), linear-gradient(180deg, #F8FBFF 0%, #ECF6FF 44%, #EAF4F1 100%)",
      glowA: "rgba(145,194,255,0.24)",
      glowB: "rgba(255,214,170,0.22)",
      line: "rgba(88,128,154,0.08)",
    },
    knowledgeDetail: {
      base: "radial-gradient(circle at 18% 0%, rgba(255,213,163,0.28), transparent 24%), radial-gradient(circle at 82% 14%, rgba(165,215,244,0.28), transparent 20%), linear-gradient(180deg, #FBFDFF 0%, #EEF7FF 46%, #F3F8F4 100%)",
      glowA: "rgba(255,211,164,0.2)",
      glowB: "rgba(154,209,244,0.2)",
      line: "rgba(90,130,160,0.08)",
    },
    fragments: {
      base: "radial-gradient(circle at 16% 10%, rgba(255,216,235,0.38), transparent 24%), radial-gradient(circle at 84% 14%, rgba(176,223,255,0.34), transparent 22%), linear-gradient(180deg, #FFF9FC 0%, #EEF7FF 48%, #F7F4FF 100%)",
      glowA: "rgba(255,198,226,0.28)",
      glowB: "rgba(173,221,255,0.26)",
      line: "rgba(133,126,174,0.08)",
    },
    interests: {
      base: "radial-gradient(circle at 18% 8%, rgba(245,220,255,0.38), transparent 24%), radial-gradient(circle at 80% 12%, rgba(255,226,195,0.3), transparent 22%), linear-gradient(180deg, #FDF8FF 0%, #F4EEFF 46%, #FFF6F0 100%)",
      glowA: "rgba(230,190,255,0.28)",
      glowB: "rgba(255,210,170,0.24)",
      line: "rgba(148,118,174,0.08)",
    },
    about: {
      base: "radial-gradient(circle at 20% 6%, rgba(193,214,255,0.36), transparent 26%), radial-gradient(circle at 80% 16%, rgba(221,198,255,0.24), transparent 20%), linear-gradient(180deg, #F8FBFF 0%, #EAF2FF 44%, #F6F3FF 100%)",
      glowA: "rgba(192,215,255,0.26)",
      glowB: "rgba(218,194,255,0.2)",
      line: "rgba(102,120,170,0.08)",
    },
  };

  const config = configMap[theme] || configMap.default;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: config.base }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.02) 36%, rgba(255,255,255,0.18) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          left: -120,
          top: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${config.glowA}, transparent 70%)`,
          animation: "floatDrift 16s ease-in-out infinite",
          filter: "blur(18px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          right: -90,
          top: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${config.glowB}, transparent 70%)`,
          animation: "floatDrift 22s ease-in-out infinite reverse",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: 120,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(124,160,214,0.22), transparent)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${config.line} 1px, transparent 1px), linear-gradient(90deg, ${config.line} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.74))",
          opacity: 0.42,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 260,
          background: "linear-gradient(180deg, rgba(255,255,255,0.42), transparent)",
          opacity: 0.58,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: 220,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.22))",
          opacity: 0.65,
        }}
      />
      {theme === "fragments" && (
        <>
          <div
            style={{
              position: "absolute",
              width: 360,
              height: 360,
              left: "-6%",
              top: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,194,226,0.34), rgba(255,194,226,0.12) 38%, transparent 72%)",
              filter: "blur(34px)",
              animation: "blobFloatA 18s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              right: "4%",
              top: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(173,221,255,0.3), rgba(173,221,255,0.12) 40%, transparent 72%)",
              filter: "blur(30px)",
              animation: "blobFloatB 20s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 240,
              height: 240,
              left: "38%",
              bottom: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,238,245,0.24), rgba(255,238,245,0.1) 36%, transparent 72%)",
              filter: "blur(26px)",
              animation: "blobFloatC 22s ease-in-out infinite",
            }}
          />
        </>
      )}
      {theme === "projects" && (
        <>
          <div style={{ position: "absolute", width: 640, height: 640, left: -180, top: 160, border: "1px solid rgba(113,154,220,0.18)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 460, height: 460, right: 120, top: 40, border: "1px solid rgba(145,188,245,0.16)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 90, bottom: 120, width: 280, height: 180, borderRadius: 36, background: "linear-gradient(135deg, rgba(255,255,255,0.28), rgba(194,221,255,0.08))", filter: "blur(8px)" }} />
        </>
      )}
      {theme === "knowledge" && (
        <>
          <div style={{ position: "absolute", left: 120, top: 170, width: 220, height: 60, borderRadius: 999, background: "linear-gradient(90deg, rgba(132,192,255,0.18), transparent)", filter: "blur(4px)" }} />
          <div style={{ position: "absolute", right: 120, top: 340, width: 280, height: 60, borderRadius: 999, background: "linear-gradient(90deg, rgba(255,214,170,0.18), transparent)", filter: "blur(4px)" }} />
          <div style={{ position: "absolute", right: 60, top: 120, width: 320, height: 200, borderRadius: 42, background: "linear-gradient(135deg, rgba(255,255,255,0.24), rgba(213,232,255,0.08))" }} />
        </>
      )}
      {theme === "about" && (
        <>
          <div style={{ position: "absolute", left: -40, top: 220, width: 420, height: 180, borderRadius: 40, background: "linear-gradient(135deg, rgba(210,220,255,0.18), transparent)" }} />
          <div style={{ position: "absolute", right: 60, top: 120, width: 320, height: 140, borderRadius: 32, background: "linear-gradient(135deg, rgba(223,198,255,0.18), transparent)" }} />
          <div style={{ position: "absolute", right: "8%", bottom: 140, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,240,0.24), transparent 70%)", filter: "blur(10px)" }} />
        </>
      )}
      {theme === "projectDetail" && (
        <>
          <div style={{ position: "absolute", top: 150, left: "-8%", width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(150,188,245,0.18)" }} />
          <div style={{ position: "absolute", top: 210, left: "4%", width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(180,212,255,0.16)" }} />
          <div style={{ position: "absolute", right: 80, top: 120, width: 260, height: 260, borderRadius: 34, background: "linear-gradient(135deg, rgba(255,255,255,0.24), rgba(196,221,255,0.08))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 320, height: 1, background: "linear-gradient(90deg, transparent, rgba(124,167,228,0.24), transparent)" }} />
        </>
      )}
      {theme === "knowledgeDetail" && (
        <>
          <div style={{ position: "absolute", left: 80, top: 180, width: 320, height: 180, borderRadius: 26, background: "linear-gradient(135deg, rgba(255,238,205,0.24), transparent)" }} />
          <div style={{ position: "absolute", right: 60, top: 280, width: 420, height: 1, background: "linear-gradient(90deg, rgba(132,192,255,0.08), rgba(255,222,186,0.24), transparent)" }} />
          <div style={{ position: "absolute", left: "18%", bottom: 120, width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,224,190,0.16)" }} />
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECTS LIST PAGE
   ═══════════════════════════════════════════ */
function ProjectsPage({ onNavigate, isMobile }) {
  const featuredProject = PROJECTS[0];
  const projectCount = PROJECTS.length;
  const activeCount = PROJECTS.filter((item) => item.status === "本科").length;

  return (
    <PageShell theme="projects">
      <PageHeader mono="Research Department" title="研究项目" desc="哈基米打灰档案库。" onNavigate={onNavigate} />

      <section style={{ marginBottom: isMobile ? 20 : 28, background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0.22))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 22 : 30, padding: isMobile ? 14 : 20, boxShadow: "0 18px 48px rgba(115,145,190,0.08)", backdropFilter: "blur(18px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? 14 : 24 }}>
        <div className="editorial-surface" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(242,248,255,0.8))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 16 : "28px 18px 18px 18px", padding: isMobile ? "18px 16px 20px" : "28px 28px 30px", boxShadow: "0 16px 42px rgba(98,132,180,0.09)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(74,108,156,0.82)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Overview
          </div>
          <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: DS.accentDeep, marginBottom: 14 }}>
            总览
          </div>
          <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(62,84,116,0.88)", lineHeight: 1.85, margin: "0 0 18px" }}>
            方法、实验、论文叙事和工程细节。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {PROJECT_ARCHIVES.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(`archive-${item.id}`)}
                className="interactive-node"
                style={{
                  fontFamily: DS.mono,
                  fontSize: 10,
                  color: DS.accentDeep,
                  background: "linear-gradient(180deg, rgba(224,238,255,0.86), rgba(255,255,255,0.92))",
                  border: `1px solid ${DS.border}`,
                  padding: "6px 11px",
                  borderRadius: 999,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  transition: "all 0.28s ease",
                }}
                {...interactiveSurfaceProps({
                  idleShadow: "0 8px 20px rgba(0,0,0,0)",
                  activeShadow: "0 12px 22px rgba(101,140,197,0.14)",
                  idleBorder: DS.border,
                  activeBorder: "rgba(77,131,217,0.35)",
                  translateY: 2,
                  scale: 1.01,
                })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>
          {[
            { label: "项目总数", value: `${projectCount}`.padStart(2, "0") },
            { label: "在研项目", value: `${activeCount}`.padStart(1, "1") },
            { label: "核心方向", value: "RL LLM" },
            { label: "当前重点", value: "RL" },
          ].map((stat) => (
            <div key={stat.label} className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(240,247,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: isMobile ? "16px 14px" : "22px 20px", boxShadow: "0 12px 30px rgba(107,140,188,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,120,164,0.78)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>{stat.label}</div>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: DS.accentDeep }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
      </section>

      <section style={{ marginBottom: isMobile ? 22 : 30, background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.18))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 22 : 32, padding: isMobile ? 14 : 20, boxShadow: "0 18px 46px rgba(108,142,189,0.08)", backdropFilter: "blur(18px)" }}>
      <div
        className="interactive-node editorial-card"
        onClick={() => onNavigate(`project-${featuredProject.id}`)}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(237,246,255,0.92) 52%, rgba(223,236,255,0.9) 100%)",
          border: `1px solid ${DS.borderLight}`,
          borderRadius: 28,
          padding: isMobile ? "20px 16px 22px" : "34px 34px 36px",
          boxShadow: "0 20px 52px rgba(104,140,192,0.12)",
          cursor: "pointer",
          transition: "all 0.35s ease",
          position: "relative",
          overflow: "hidden",
        }}
        {...interactiveSurfaceProps({
          idleShadow: "0 20px 52px rgba(104,140,192,0.12)",
          activeShadow: "0 28px 62px rgba(104,140,192,0.16)",
          idleBorder: DS.borderLight,
          activeBorder: "rgba(96,145,228,0.34)",
          translateY: 4,
          scale: 1.01,
        })}
      >
        <div style={{ position: "absolute", right: -40, top: -30, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(157,204,255,0.34), transparent 70%)" }} />
        <div style={{ position: "absolute", left: 34, right: 34, top: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(131,174,235,0.34), transparent)" }} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: isMobile ? 16 : 24, position: "relative" }}>
          <div>
            <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(78,116,170,0.78)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>
              Featured Research
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: isMobile ? 28 : 36 }}>{featuredProject.icon}</span>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 26 : 34, fontWeight: 700, color: DS.accentDeep }}>{featuredProject.title}</div>
            </div>
            <p style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(55,76,108,0.9)", lineHeight: 1.9, margin: "0 0 22px", maxWidth: 620 }}>
              {featuredProject.brief}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {featuredProject.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: DS.mono, fontSize: 10, color: DS.accentDeep, background: "rgba(232,241,255,0.9)", border: `1px solid ${DS.border}`, padding: "5px 10px", borderRadius: 999 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {featuredProject.fullContent.sections.slice(0, 3).map((section, index) => (
              <div key={section.title} className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(243,248,255,0.68))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: "16px 18px" }}>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(89,124,173,0.7)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
                  Section {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 16, fontWeight: 700, color: DS.accentDeep, marginBottom: 6 }}>
                  {section.title}
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(67,88,120,0.82)", lineHeight: 1.7 }}>
                  {section.content.slice(0, 58)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>

      <section style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0.18))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 22 : 32, padding: isMobile ? 14 : 20, boxShadow: "0 18px 44px rgba(110,143,190,0.08)", backdropFilter: "blur(18px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "end", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 0, marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(82,118,166,0.78)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
            Project Index
          </div>
          <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DS.accentDeep }}>
            全部作品
          </div>
        </div>
        <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(76,100,132,0.74)" }}>
          每个项目都有更下一层的独立详情页
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 14 : 24 }}>
        {PROJECTS.map((p, index) => (
          <div
            className="interactive-node editorial-card"
            key={p.id}
            onClick={() => onNavigate(`project-${p.id}`)}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              cursor: "pointer",
              background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.8))",
              border: `1px solid ${DS.borderLight}`,
              boxShadow: "0 14px 36px rgba(108,141,190,0.1)",
              transition: "all 0.35s ease",
              position: "relative",
            }}
            {...interactiveSurfaceProps({
              idleShadow: "0 14px 36px rgba(108,141,190,0.1)",
              activeShadow: "0 20px 44px rgba(108,141,190,0.14)",
              idleBorder: DS.borderLight,
              activeBorder: "rgba(93,142,224,0.32)",
              translateY: 4,
              scale: 1.01,
            })}
          >
            <div style={{ height: isMobile ? 128 : 152, background: p.cover, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 26px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(17,42,74,0.18))" }} />
              <div style={{ position: "absolute", left: 22, top: 18, fontFamily: DS.mono, fontSize: 10, color: "rgba(255,255,255,0.88)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                File {String(index + 1).padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", left: 26, right: 26, bottom: 18, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.22), transparent)" }} />
              <span style={{ fontSize: isMobile ? 30 : 38 }}>{p.icon}</span>
              <span style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(255,255,255,0.88)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{p.status}</span>
            </div>
            <div style={{ padding: isMobile ? "16px 16px 18px" : "24px 26px 26px" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.7)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                Research Project
              </div>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 20 : 22, fontWeight: 700, color: DS.accentDeep, marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(78,102,136,0.88)", marginBottom: 14 }}>{p.tagline}</div>
              <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(68,88,120,0.86)", lineHeight: 1.8, margin: "0 0 18px" }}>{p.brief}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(54,85,132,0.86)", background: "rgba(232,240,255,0.8)", padding: "4px 10px", borderRadius: 999, border: `1px solid ${DS.borderLight}` }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: `1px solid ${DS.borderLight}` }}>
                <span style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(72,97,130,0.78)" }}>进入任务卷宗</span>
                <span style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(52,93,154,0.84)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Open Dossier</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   PROJECT DETAIL PAGE
   ═══════════════════════════════════════════ */
function ProjectDetailPage({ project, onNavigate, isMobile }) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div style={{ background: "linear-gradient(180deg, #F7FBFF 0%, #ECF5FF 100%)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <ThemeBackground theme="projectDetail" />
      <div
        className="route-slide"
        style={{ "--enter-delay": "0.02s" }}
      >
      <div
        style={{
          background: project.cover,
          padding: isMobile ? "92px 14px 48px" : "120px 32px 72px",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(238,246,255,0.78))" }} />
        <div style={{ position: "absolute", right: 80, top: 36, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(214,232,255,0.42), transparent 70%)", filter: "blur(8px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <PageActions onNavigate={onNavigate} backTarget="projects" backLabel="返回项目列表" />

          <div style={{ position: "relative", zIndex: 1 }} className="route-slide" >
            <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(84,118,166,0.78)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>
              Mission Dossier / Active Research File
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? 14 : 24, alignItems: "end" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                  <span style={{ fontSize: isMobile ? 30 : 38 }}>{project.icon}</span>
                  <h1 style={{ fontFamily: DS.font, fontSize: isMobile ? 30 : 42, fontWeight: 700, color: DS.accentDeep, margin: 0 }}>
                    {project.title}
                  </h1>
                </div>
                <p style={{ fontFamily: DS.font, fontSize: isMobile ? 15 : 18, color: "rgba(62,84,116,0.88)", margin: "0 0 22px", lineHeight: 1.8, maxWidth: 620 }}>
                  {project.fullContent.hero}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {project.tags.map((t) => (
                    <span key={t} style={{ fontFamily: DS.mono, fontSize: 10, color: DS.accentDeep, background: "rgba(236,243,255,0.9)", padding: "5px 12px", borderRadius: 999, border: `1px solid ${DS.borderLight}` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
                {[
                  { label: "状态", value: project.status },
                  { label: "章节", value: String(project.fullContent.sections.length).padStart(2, "0") },
                  { label: "类型", value: "Mission" },
                  { label: "审阅", value: "Ongoing" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(240,247,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: "16px 16px 18px", backdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(103,141,190,0.08)" }}>
                    <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{item.label}</div>
                    <div style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "28px 14px 58px" : "42px 32px 88px", position: "relative", zIndex: 1 }} className="route-slide" >
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.74fr 1.26fr", gap: isMobile ? 16 : 24 }}>
          <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <div className="route-slide" style={{ "--enter-delay": "0.08s", background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: "26px 18px 18px 18px", padding: "24px 22px 24px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
                Mission Summary
              </div>
              <div style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(64,84,114,0.88)", lineHeight: 1.85, marginBottom: 16 }}>
                {project.brief}
              </div>
              <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(96,116,146,0.72)", lineHeight: 1.8 }}>
                如果一切都一次成功(希望如此)，这份档案通常不会写得这么长。
              </div>
            </div>

            <div className="route-slide" style={{ "--enter-delay": "0.12s", background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 20, padding: "22px 20px 24px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
                Dossier Index
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {project.fullContent.sections.map((sec, i) => (
                  <button
                    key={sec.title}
                    onClick={() => setActiveSection(i)}
                    style={{
                      textAlign: "left",
                      background: activeSection === i ? "linear-gradient(135deg, rgba(191,219,255,0.8), rgba(255,255,255,0.96))" : "linear-gradient(180deg, rgba(241,247,255,0.9), rgba(255,255,255,0.84))",
                      border: `1px solid ${activeSection === i ? "rgba(98,143,224,0.34)" : DS.borderLight}`,
                      fontFamily: DS.font,
                      borderRadius: 16,
                      padding: "14px 14px 15px",
                      cursor: "pointer",
                      color: activeSection === i ? DS.accentDeep : "rgba(66,86,116,0.86)",
                      boxShadow: activeSection === i ? "0 12px 28px rgba(104,140,190,0.1)" : "0 8px 18px rgba(104,140,190,0.04)",
                    }}
                  >
                    <div style={{ fontFamily: DS.mono, fontSize: 10, color: activeSection === i ? "rgba(74,108,160,0.78)" : "rgba(100,118,146,0.68)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                      Section {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{sec.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="route-slide" style={{ "--enter-delay": "0.16s", background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 20, padding: "20px 20px 22px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                Research Notes
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  "关键词越少越好，但实验变量通常不会这么配合。",
                  "先讲清楚假设，再讲清楚结果。",
                ].map((item) => (
                  <div key={item} style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(66,86,116,0.84)", lineHeight: 1.8, padding: "10px 12px", background: "linear-gradient(180deg, rgba(241,247,255,0.9), rgba(255,255,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 14 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }} className="route-slide">
              {project.fullContent.sections.slice(0, 3).map((section, index) => (
                <div key={section.title} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: "18px 18px 20px", boxShadow: "0 14px 34px rgba(104,140,190,0.08)" }}>
                  <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
                    Module {String(index + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: DS.font, fontSize: 16, fontWeight: 700, color: DS.accentDeep, marginBottom: 8 }}>
                    {section.title}
                  </div>
                  <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(66,86,116,0.82)", lineHeight: 1.7 }}>
                    {section.content.slice(0, 52)}...
                  </div>
                </div>
              ))}
            </div>

            <div
              key={activeSection}
              style={{
                animation: "slideFadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(243,248,255,0.86))",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: 26,
                padding: isMobile ? "20px 18px 24px" : "28px 30px 32px",
                boxShadow: "0 18px 44px rgba(104,140,190,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", right: -60, top: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,210,255,0.22), transparent 72%)" }} />
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, position: "relative" }}>
                Active Section / {String(activeSection + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: DS.accentDeep, marginBottom: 14, position: "relative" }}>
                {project.fullContent.sections[activeSection].title}
              </div>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 14 : 15, color: "rgba(64,84,114,0.88)", lineHeight: isMobile ? 1.82 : 1.95, position: "relative", whiteSpace: "pre-wrap" }}>
                {project.fullContent.sections[activeSection].content}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: 16 }} className="route-slide">
              <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 20, padding: "20px 22px", boxShadow: "0 14px 34px rgba(104,140,190,0.08)" }}>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                  Mission Interpretation
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(66,86,116,0.84)", lineHeight: 1.85 }}>
                  它更像研究卷宗，而非宣传海报。
                </div>
              </div>
              <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 20, padding: "20px 22px", boxShadow: "0 14px 34px rgba(104,140,190,0.08)" }}>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                  Status Remark
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(66,86,116,0.84)", lineHeight: 1.85 }}>
                  如果它看起来仍在演化，那通常意味着研究还活着，而不是页面没写完。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   KNOWLEDGE PAGE
   ═══════════════════════════════════════════ */
function KnowledgePage({ onNavigate, isMobile }) {
  const totalEntries = KNOWLEDGE.reduce((sum, item) => sum + item.entries.length, 0);

  return (
    <PageShell theme="knowledge">
      <PageHeader
        mono="Field Notes"
        title="知识库"
        desc="问题、判断与解决方案"
        onNavigate={onNavigate}
      />

      <section style={{ marginBottom: isMobile ? 20 : 28, background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0.2))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 22 : 30, padding: isMobile ? 14 : 20, boxShadow: "0 18px 44px rgba(111,145,190,0.08)", backdropFilter: "blur(18px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.92fr 1.08fr", gap: isMobile ? 14 : 24 }}>
        <div className="editorial-surface" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(244,249,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 16 : "18px 28px 18px 18px", padding: isMobile ? "18px 16px 20px" : "28px 28px 30px", boxShadow: "0 14px 36px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(91,125,174,0.8)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Reading Guide
          </div>
          <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: DS.accentDeep, marginBottom: 14 }}>
            Knowledge Base
          </div>
          <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(64,84,114,0.88)", lineHeight: 1.85, margin: "0 0 18px" }}>
            What | Why | How
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {["先定位问题，再抽象模式", "记录失败案例，而不只记录答案", "把经验沉淀成可复用模板"].map((item) => (
              <div key={item} style={{ padding: "12px 14px", borderRadius: 14, background: "linear-gradient(180deg, rgba(240,247,255,0.92), rgba(255,255,255,0.86))", border: `1px solid ${DS.borderLight}`, color: "rgba(63,82,112,0.9)", fontFamily: DS.font, fontSize: 14 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
          {[
            { label: "分类", value: `${KNOWLEDGE.length}`.padStart(2, "0") },
            { label: "条目", value: `${totalEntries}`.padStart(2, "0") },
            { label: "关键词", value: "经验" },
            { label: "问题导向", value: "Yes" },
            { label: "方法沉淀", value: "Yes" },
            { label: "更新状态", value: "Live" },
          ].map((item) => (
            <div key={item.label} className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: isMobile ? "14px 12px" : "20px 18px", boxShadow: "0 12px 30px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(90,123,171,0.78)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>{item.label}</div>
              <div style={{ fontFamily: DS.font, fontSize: isMobile ? 20 : 24, fontWeight: 700, color: DS.accentDeep }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      </section>

      <section style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.18))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 22 : 32, padding: isMobile ? 14 : 20, boxShadow: "0 18px 44px rgba(110,143,190,0.08)", backdropFilter: "blur(18px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "end", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 0, marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.8)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
            Knowledge Index
          </div>
          <div style={{ fontFamily: DS.font, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: DS.accentDeep }}>
            分类档案
          </div>
        </div>
        <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(78,104,138,0.74)" }}>
          {/* 从问题分类进入，再展开具体案例与方法笔记 */}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(12, 1fr)", gap: isMobile ? 14 : 22 }}>
        {KNOWLEDGE.map((cat, index) => (
          <div
            className="interactive-node editorial-card"
            key={cat.id}
            onClick={() => onNavigate(`knowledge-${cat.id}`)}
            style={{
              gridColumn: isMobile ? "span 1" : index === 0 ? "span 7" : index === 1 ? "span 5" : "span 12",
              borderRadius: isMobile ? 18 : index === 2 ? "18px 28px 18px 18px" : "24px",
              overflow: "hidden",
              cursor: "pointer",
              background: index === 2
                ? "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(246,250,255,0.82))"
                : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(243,248,255,0.82))",
              border: `1px solid ${DS.borderLight}`,
              boxShadow: "0 14px 36px rgba(108,141,190,0.1)",
              transition: "all 0.35s ease",
              position: "relative",
            }}
            {...interactiveSurfaceProps({
              idleShadow: "0 14px 36px rgba(108,141,190,0.1)",
              activeShadow: "0 20px 46px rgba(108,141,190,0.14)",
              idleBorder: DS.borderLight,
              activeBorder: "rgba(96,145,228,0.3)",
              translateY: 4,
              scale: 1.01,
            })}
          >
            <div style={{ position: "absolute", inset: 0, background: cat.cover, opacity: 0.22 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.46), rgba(238,246,255,0.84))" }} />
            <div style={{ position: "relative", padding: isMobile ? "16px 14px 18px" : index === 2 ? "26px 28px" : "24px 24px 26px", minHeight: isMobile ? 0 : index === 2 ? 220 : 280, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(90,123,171,0.78)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
                  Archive {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: isMobile ? 26 : index === 2 ? 34 : 30 }}>{cat.icon}</span>
                  <span style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(65,96,142,0.74)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    {cat.entries.length} 条
                  </span>
                </div>
                <h3 style={{ fontFamily: DS.font, fontSize: isMobile ? 20 : index === 2 ? 24 : 22, fontWeight: 700, color: DS.accentDeep, margin: "0 0 8px" }}>
                  {cat.title}
                </h3>
                <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(63,84,114,0.86)", margin: "0 0 14px", lineHeight: 1.75 }}>
                  {cat.tagline}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {cat.entries.slice(0, index === 2 ? 3 : 2).map((entry) => (
                    <span key={entry.title} style={{ fontFamily: DS.font, fontSize: 12, color: "rgba(54,82,121,0.88)", background: "rgba(232,240,255,0.88)", padding: "6px 10px", borderRadius: 999, border: `1px solid ${DS.borderLight}` }}>
                      {entry.title}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${DS.borderLight}` }}>
                  <span style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(72,98,132,0.78)" }}>进入案例档案</span>
                  <span style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(51,95,158,0.84)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Open Category
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   KNOWLEDGE DETAIL PAGE
   ═══════════════════════════════════════════ */
function KnowledgeDetailPage({ category, onNavigate }) {
  const [expandedEntry, setExpandedEntry] = useState(null);
  const dryNotes = [
    "这类问题通常不致命，但很擅长悄悄吃掉一个下午。",
    "当日志看起来很冷静时，问题往往正在别处发脾气。",
    "经验的价值之一，是让下一次排查少一点神学，多一点证据。",
  ];

  return (
    <div style={{ background: "linear-gradient(180deg, #F7FBFF 0%, #ECF5FF 100%)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <ThemeBackground theme="knowledgeDetail" />
      <div style={{ background: category.cover, padding: "120px 32px 64px", position: "relative", zIndex: 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(244,249,255,0.82))" }} />
        <div style={{ position: "absolute", right: 120, top: 26, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,240,255,0.28), transparent 70%)", filter: "blur(8px)" }} />
        <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <PageActions onNavigate={onNavigate} backTarget="knowledge" backLabel="返回知识库" />

          <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(60,94,148,0.78)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>
            Case Archive / Experimental Notes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 24, alignItems: "end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{category.icon}</span>
                <h1 style={{ fontFamily: DS.font, fontSize: 38, fontWeight: 700, color: DS.accentDeep, margin: 0 }}>
                  {category.title}
                </h1>
              </div>
              <p style={{ fontFamily: DS.font, fontSize: 17, color: "rgba(50,72,108,0.86)", lineHeight: 1.85, margin: "0 0 18px", maxWidth: 620 }}>
                {category.tagline}
              </p>
              <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(72,94,130,0.82)", lineHeight: 1.8 }}>
                这里记录的是问题、判断、解法和复盘，不追求戏剧性，但尽量保证下一次再遇到时不需要从头相信玄学。
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                { label: "Cases", value: String(category.entries.length).padStart(2, "0") },
                { label: "Category", value: "Archive" },
                { label: "Method", value: "Field" },
                { label: "Tone", value: "Calm" },
              ].map((item) => (
                <div key={item.label} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(242,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 18, padding: "16px 16px 18px", backdropFilter: "blur(10px)" }}>
                  <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(82,116,164,0.72)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{item.label}</div>
                  <div style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "42px 32px 88px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.72fr 1.28fr", gap: 24 }}>
          <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
            <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: "26px 18px 18px 18px", padding: "24px 22px 24px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
                Reading Protocol
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {category.readingProtocol.map((item) => (
                  <div key={item} style={{ padding: "11px 12px", borderRadius: 14, background: "linear-gradient(180deg, rgba(241,247,255,0.9), rgba(255,255,255,0.84))", border: `1px solid ${DS.borderLight}`, fontFamily: DS.font, fontSize: 13, color: "rgba(64,86,120,0.88)", lineHeight: 1.8 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 20, padding: "20px 20px 22px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
                Margin Note
              </div>
              <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(64,86,120,0.88)", lineHeight: 1.85 }}>
                {category.marginNote}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {category.entries.map((entry, i) => {
              const isOpen = expandedEntry === i;

              return (
                <div
                  key={entry.title}
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(243,248,255,0.86))",
                    border: `1px solid ${isOpen ? "rgba(96,143,224,0.28)" : DS.borderLight}`,
                    borderRadius: i % 2 === 0 ? "24px 18px 18px 18px" : "18px 24px 18px 18px",
                    overflow: "hidden",
                    boxShadow: isOpen ? "0 20px 50px rgba(104,140,190,0.12)" : "0 12px 32px rgba(104,140,190,0.08)",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                  }}
                >
                  <div
                    onClick={() => setExpandedEntry(isOpen ? null : i)}
                    style={{
                      padding: "22px 26px",
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.62)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
                        Case {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 style={{ fontFamily: DS.font, fontSize: 18, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px" }}>
                        {entry.title}
                      </h3>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {entry.tags.map((t) => (
                          <span key={t} style={{ fontFamily: DS.mono, fontSize: 9, color: "rgba(72,104,148,0.78)", background: "rgba(232,241,255,0.88)", padding: "4px 8px", borderRadius: 999, border: `1px solid ${DS.borderLight}` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${DS.borderLight}`, display: "grid", placeItems: "center", color: DS.accent, fontFamily: DS.mono, fontSize: 16, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
                      +
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "0 26px 26px", animation: "fadeIn 0.35s ease forwards" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <div style={{ background: "#FFF8F6", padding: "18px 18px 20px", borderRadius: 14, borderLeft: "3px solid rgba(218,118,90,0.72)" }}>
                          <div style={{ fontFamily: DS.mono, fontSize: 9, color: "#C06040", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                            Observation
                          </div>
                          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(70,82,100,0.9)", lineHeight: 1.8 }}>
                            {entry.problem}
                          </div>
                        </div>
                        <div style={{ background: "#F2FAF6", padding: "18px 18px 20px", borderRadius: 14, borderLeft: "3px solid rgba(60,168,116,0.72)" }}>
                          <div style={{ fontFamily: DS.mono, fontSize: 9, color: "#2D9B6A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                            Intervention
                          </div>
                          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(70,82,100,0.9)", lineHeight: 1.8 }}>
                            {entry.solution}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14 }}>
                        <div style={{ background: "linear-gradient(180deg, rgba(241,247,255,0.9), rgba(255,255,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 14, padding: "16px 16px 18px" }}>
                          <div style={{ fontFamily: DS.mono, fontSize: 9, color: "rgba(88,122,170,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                            Case Comment
                          </div>
                          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(64,86,120,0.88)", lineHeight: 1.8 }}>
                            这条记录的重点不是"找到神奇答案"，而是把判断路径固定下来。这样下次遇到相似问题时，至少能少一点随机游走。
                          </div>
                        </div>
                        <div style={{ background: "linear-gradient(180deg, rgba(241,247,255,0.9), rgba(255,255,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 14, padding: "16px 16px 18px" }}>
                          <div style={{ fontFamily: DS.mono, fontSize: 9, color: "rgba(88,122,170,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                            Dry Humor
                          </div>
                          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(64,86,120,0.88)", lineHeight: 1.8 }}>
                            {dryNotes[i % dryNotes.length]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════ */
function AboutPage({ onNavigate, isMobile }) {
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
    <PageShell theme="about">
      <PageHeader mono="Profile Sheet" title="陈睿" desc="desc" onNavigate={onNavigate} />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.08fr 0.92fr", gap: isMobile ? 14 : 24, marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(244,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 18 : "30px 18px 18px 18px", padding: isMobile ? "18px 16px 20px" : "30px 30px 32px", boxShadow: "0 16px 40px rgba(106,139,187,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Identity
          </div>
          <div style={{ fontFamily: DS.font, fontSize: isMobile ? 24 : 30, fontWeight: 700, color: DS.accentDeep, marginBottom: 12 }}>
            搭建自己的叙事方式。
          </div>
          <p style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(65,85,116,0.88)", lineHeight: 1.9, margin: "0 0 20px" }}>
            {/* 我的工作位于强化学习与大语言模型的交叉点：设计能自动生成并优化机器人操控任务奖励函数的系统。当前重点是通过结构化轨迹分析，让奖励优化不再只依赖单一标量反馈。 */}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
            {[
              ["身份", "大学生 / Researcher"],
              ["方向", "RL  LLM"],
              ["偏好", "干净、准确、可解释"],
              ["状态", "持续迭代中"],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: "14px 16px", borderRadius: 16, background: "linear-gradient(180deg, rgba(243,248,255,0.92), rgba(255,255,255,0.86))", border: `1px solid ${DS.borderLight}` }}>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.72)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: DS.font, fontSize: 14, color: DS.accentDeep }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(244,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: isMobile ? 18 : "18px 30px 18px 18px", padding: isMobile ? "18px 16px 20px" : "28px 26px 30px", boxShadow: "0 16px 40px rgba(106,139,187,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Working Style
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
            {[
              "先定义问题结构，再选技术路线。",
              "偏爱长期有效的方法，而不是短期热闹。",
              "界面、表达和研究内容一样，都需要秩序。",
            ].map((item) => (
              <div key={item} style={{ padding: "12px 14px", borderRadius: 14, background: "linear-gradient(180deg, rgba(243,248,255,0.92), rgba(255,255,255,0.86))", border: `1px solid ${DS.borderLight}`, fontFamily: DS.font, fontSize: 14, color: "rgba(65,85,116,0.88)", lineHeight: 1.75 }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.74)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Focus
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ABOUT_DATA.interests.map((i) => (
              <span key={i} style={{ fontFamily: DS.mono, fontSize: 10, color: DS.accentDeep, background: "rgba(232,241,255,0.88)", padding: "5px 12px", borderRadius: 999, border: `1px solid ${DS.borderLight}` }}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.95fr 1.05fr", gap: isMobile ? 14 : 24, marginBottom: isMobile ? 20 : 28 }}>
        <div ref={barsRef} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(244,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: isMobile ? "18px 16px 20px" : "28px 28px 30px", boxShadow: "0 16px 40px rgba(106,139,187,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 18 }}>
            Tooling
          </div>
          {ABOUT_DATA.tools.map((tool, i) => (
            <div key={tool.name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(57,80,114,0.9)", fontWeight: 500 }}>{tool.name}</span>
                <span style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(96,116,146,0.72)" }}>{tool.level}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(214,226,241,0.78)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: barsVisible ? `${tool.level}%` : "0%",
                    background: "linear-gradient(90deg, rgba(126,158,236,0.94), rgba(229,236,255,0.9))",
                    borderRadius: 999,
                    transition: `width 0.9s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
          {[
            { title: "研究路径", text: "" },
            // 从问题定义、奖励设计到实验闭环，尽量保证每一步都能解释清楚。
            { title: "工程习惯", text: "" },
            // 不追求堆功能，更看重结构是否稳定、维护成本是否可控。
            { title: "表达方式", text: "" },
            // 喜欢把复杂东西讲得更干净，哪怕因此多做几层信息分级。
            { title: "审美取向", text: "" },
            // 偏好冷静、简洁、节制的界面，但也允许少量柔软的人味。
          ].map((card, index) => (
            <div key={card.title} style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(244,248,255,0.84))", border: `1px solid ${DS.borderLight}`, borderRadius: index % 2 === 0 ? "24px 18px 18px 18px" : "18px 24px 18px 18px", padding: "22px 20px 24px", boxShadow: "0 14px 34px rgba(106,139,187,0.08)" }}>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.7)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{card.title}</div>
              <div style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(65,85,116,0.88)", lineHeight: 1.8 }}>{card.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(244,248,255,0.86))", borderRadius: isMobile ? 18 : 26, padding: isMobile ? "18px 16px" : "34px 38px", border: `1px solid ${DS.borderLight}`, boxShadow: "0 16px 40px rgba(106,139,187,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(86,118,164,0.76)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              Contact
            </div>
            <h3 style={{ fontFamily: DS.font, fontSize: isMobile ? 20 : 22, fontWeight: 700, color: DS.accentDeep, margin: "0 0 8px" }}>
              Contact Me
            </h3>
            <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(65,85,116,0.86)", margin: 0, lineHeight: 1.8 }}>
              {/* 欢迎学术合作或技术交流，随时可以通过以下方式联系。 */}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "GitHub", href: "https://github.com/SearchAurora", isLink: true },
              { label: "邮箱", href: "mailto:cr2392637785@gmail.com", isLink: true },
              { label: "微信  19012750358", href: null, isLink: false },
              { label: "QQ  2392637785", href: null, isLink: false },
            ].map(({ label, href, isLink }) =>
              isLink ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: DS.mono, fontSize: 12, color: DS.accentDeep, cursor: "pointer", padding: "10px 18px", borderRadius: 999, border: `1px solid ${DS.borderLight}`, background: "rgba(232,241,255,0.84)", textDecoration: "none", transition: "all 0.2s ease" }}
                >
                  {label}
                </a>
              ) : (
                <span
                  key={label}
                  style={{ fontFamily: DS.mono, fontSize: 12, color: DS.textSec, padding: "10px 18px", borderRadius: 999, border: `1px solid ${DS.borderLight}`, background: "rgba(246,248,252,0.84)", userSelect: "text" }}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function FragmentsPage({ onNavigate }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [error, setError] = useState(false);

  function handleUnlock() {
    if (pwInput === FRAGMENTS_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPwInput('');
    }
  }

  if (!unlocked) {
    return (
      <PageShell theme="fragments">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{
            background: 'linear-gradient(160deg, rgba(255,226,240,0.72) 0%, rgba(214,232,255,0.72) 42%, rgba(255,255,255,0.88) 100%)',
            border: `1px solid ${DS.borderLight}`,
            borderRadius: 32,
            padding: '52px 48px',
            boxShadow: '0 24px 60px rgba(126,150,191,0.12)',
            backdropFilter: 'blur(18px)',
            textAlign: 'center',
            maxWidth: 380,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', width: 200, height: 200, right: -40, top: -30, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,196,226,0.3), transparent 70%)', filter: 'blur(22px)', animation: 'blobFloatA 16s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: 160, height: 160, left: -30, bottom: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(176,219,255,0.24), transparent 72%)', filter: 'blur(18px)', animation: 'blobFloatB 18s ease-in-out infinite' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>
                🔒
              </div>
              <div style={{ fontFamily: DS.mono, fontSize: 10, color: 'rgba(124,99,140,0.72)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                Private Space
              </div>
              <h2 style={{ fontFamily: DS.font, fontSize: 24, fontWeight: 700, color: DS.accentDeep, margin: '0 0 8px' }}>
                随言碎语
              </h2>
              <p style={{ fontFamily: DS.font, fontSize: 13, color: 'rgba(73,83,112,0.78)', lineHeight: 1.8, margin: '0 0 32px' }}>
                私人空间，需要密码才能进入。
              </p>
              <input
                type="password"
                placeholder="输入密码"
                value={pwInput}
                onChange={(e) => { setPwInput(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${error ? 'rgba(220,80,80,0.6)' : DS.borderLight}`,
                  background: 'rgba(255,255,255,0.72)',
                  fontFamily: DS.font,
                  fontSize: 15,
                  color: DS.text,
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  boxSizing: 'border-box',
                  marginBottom: 8,
                  transition: 'border-color 0.2s',
                }}
                autoFocus
              />
              {error && (
                <div style={{ fontFamily: DS.font, fontSize: 12, color: 'rgba(200,60,60,0.88)', marginBottom: 16 }}>
                  密码不对，再试一次
                </div>
              )}
              {!error && <div style={{ height: 24 }} />}
              <button
                onClick={handleUnlock}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(135deg, rgba(180,130,200,0.88), rgba(140,100,190,0.92))',
                  color: '#fff',
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.86'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                进入
              </button>
              <div
                onClick={() => onNavigate('home')}
                style={{ fontFamily: DS.mono, fontSize: 11, color: 'rgba(124,99,140,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 20, cursor: 'pointer' }}
              >
                ← Back
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell theme="fragments">
      <PageHeader
        mono="Fragments"
        title="随言碎语"
        desc="一些不那么需要证明、却能说明我是谁的偏好、碎念和审美取向。"
        onNavigate={onNavigate}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 24, marginBottom: 28 }}>
        <div
          style={{
            background: 'linear-gradient(160deg, rgba(255,226,240,0.72) 0%, rgba(214,232,255,0.72) 42%, rgba(255,255,255,0.88) 100%)',
            border: `1px solid ${DS.borderLight}`,
            borderRadius: 26,
            padding: '30px 30px 32px',
            boxShadow: '0 16px 40px rgba(126,150,191,0.1)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(18px)',
          }}
        >
          <div style={{ position: 'absolute', width: 180, height: 180, right: -26, top: -12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,196,226,0.3), transparent 70%)', filter: 'blur(18px)', animation: 'blobFloatA 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 140, height: 140, left: -18, bottom: -18, borderRadius: '50%', background: 'radial-gradient(circle, rgba(176,219,255,0.24), transparent 72%)', filter: 'blur(16px)', animation: 'blobFloatB 18s ease-in-out infinite' }} />
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: 'rgba(124,99,140,0.78)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18, position: 'relative' }}>
            Note
          </div>
          <div style={{ fontFamily: DS.font, fontSize: 24, fontWeight: 700, color: DS.accentDeep, lineHeight: 1.65, position: 'relative' }}>
            {HOME_FRAGMENT_DATA.note}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(250,245,255,0.82))',
            border: `1px solid ${DS.borderLight}`,
            borderRadius: 24,
            padding: '26px 24px 28px',
            boxShadow: '0 16px 38px rgba(126,150,191,0.08)',
          }}
        >
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: 'rgba(124,99,140,0.74)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
            Whispers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HOME_FRAGMENT_DATA.whispers.slice(0, 4).map((line, i) => (
              <div key={i} style={{ fontFamily: DS.font, fontSize: 13, color: 'rgba(73,83,112,0.88)', lineHeight: 1.9, padding: '8px 0', borderBottom: `1px solid ${DS.borderLight}` }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(250,245,255,0.82))',
          border: `1px solid ${DS.borderLight}`,
          borderRadius: 26,
          padding: '26px 28px 32px',
          boxShadow: '0 16px 38px rgba(126,150,191,0.08)',
        }}
      >
        <div style={{ fontFamily: DS.mono, fontSize: 10, color: 'rgba(124,99,140,0.74)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
          All Whispers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
          {HOME_FRAGMENT_DATA.whispers.map((line, i) => (
            <div key={i} style={{ fontFamily: DS.font, fontSize: 15, color: 'rgba(73,83,112,0.88)', lineHeight: 1.95, marginBottom: 16 }}>
              &ldquo;{line}&rdquo;
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function InterestsPage({ onNavigate }) {
  return (
    <PageShell theme="interests">
      <PageHeader
        mono="Interests"
        title="兴趣小窝"
        desc="一些小偏好，组成我的舒适小隔间。"
        onNavigate={onNavigate}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {INTERESTS_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            style={{
              background: `linear-gradient(160deg, ${cat.color} 0%, rgba(255,255,255,0.94) 100%)`,
              border: `1.5px solid ${cat.border}`,
              borderRadius: 26,
              padding: '32px 30px',
              boxShadow: '0 16px 40px rgba(120,120,180,0.08)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 52px rgba(120,120,180,0.13)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(120,120,180,0.08)'; }}
          >
            <div style={{ position: 'absolute', width: 180, height: 180, right: -36, top: -36, borderRadius: '50%', background: `radial-gradient(circle, ${cat.color}, transparent 72%)`, filter: 'blur(22px)', opacity: 2 }} />
            <div style={{ fontFamily: DS.mono, fontSize: 10, color: cat.accent, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12, position: 'relative' }}>
              {cat.en}
            </div>
            <h3 style={{ fontFamily: DS.font, fontSize: 28, fontWeight: 700, color: DS.accentDeep, margin: '0 0 14px', position: 'relative' }}>
              {cat.title}
            </h3>
            <p style={{ fontFamily: DS.font, fontSize: 14, color: 'rgba(63,84,115,0.84)', lineHeight: 1.8, margin: 0, position: 'relative' }}>
              {cat.desc}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function ArchiveDetailPage({ archive, onNavigate }) {
  const matchedMaterials = useMemo(() => getArchiveMaterials(archive), [archive]);
  const markdownFile = useMemo(() => pickMaterialByType(matchedMaterials, "markdown"), [matchedMaterials]);
  const docxFile = useMemo(() => pickMaterialByType(matchedMaterials, "docx"), [matchedMaterials]);
  const xlsxFile = useMemo(() => pickMaterialByType(matchedMaterials, "xlsx"), [matchedMaterials]);
  const imageFile = useMemo(() => pickMaterialByType(matchedMaterials, "image"), [matchedMaterials]);
  const [markdownContent, setMarkdownContent] = useState("正在载入 Markdown 说明...");
  const [docxHtml, setDocxHtml] = useState("<p>正在解析 Word 文档...</p>");
  const [xlsxHtml, setXlsxHtml] = useState("<p>正在解析 Excel 表格...</p>");

  useEffect(() => {
    let cancelled = false;

    if (!markdownFile) {
      setMarkdownContent("当前还没有匹配到 Markdown 文件。你可以在 `material` 目录里继续加入 `.md` 文件。");
    } else {
      fetch(markdownFile.url)
        .then((res) => res.text())
        .then((text) => {
          if (!cancelled) setMarkdownContent(text);
        })
        .catch(() => {
          if (!cancelled) setMarkdownContent("Markdown 内容暂时无法读取。");
        });
    }

    if (!docxFile) {
      setDocxHtml("<p>当前还没有匹配到 Word 文档。你可以继续往 `material` 里放入 `.docx` 文件。</p>");
    } else {
      fetch(docxFile.url)
        .then((res) => res.arrayBuffer())
        .then(async (buffer) => {
          const mammothModule = await import("mammoth");
          const mammoth = mammothModule.default || mammothModule;
          return mammoth.convertToHtml({ arrayBuffer: buffer });
        })
        .then((result) => {
          if (!cancelled) setDocxHtml(result.value || "<p>Word 文档为空。</p>");
        })
        .catch(() => {
          if (!cancelled) setDocxHtml("<p>Word 文档预览失败，但文件入口仍然可用。</p>");
        });
    }

    if (!xlsxFile) {
      setXlsxHtml("<p>当前还没有匹配到 Excel 文件。你可以继续往 `material` 里放入 `.xlsx` 文件。</p>");
    } else {
      fetch(xlsxFile.url)
        .then((res) => res.arrayBuffer())
        .then(async (buffer) => {
          const xlsxModule = await import("xlsx");
          const XLSX = xlsxModule.default || xlsxModule;
          const workbook = XLSX.read(buffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) return "<p>Excel 文件没有可用工作表。</p>";
          return XLSX.utils.sheet_to_html(workbook.Sheets[firstSheetName], { id: `sheet-${archive.id}` });
        })
        .then((html) => {
          if (!cancelled) setXlsxHtml(html);
        })
        .catch(() => {
          if (!cancelled) setXlsxHtml("<p>Excel 表格预览失败，但文件入口仍然可用。</p>");
        });
    }

    return () => {
      cancelled = true;
    };
  }, [archive.id, docxFile, markdownFile, xlsxFile]);

  const materialCounts = useMemo(
    () =>
      MATERIAL_LIBRARY.reduce(
        (acc, item) => {
          acc.total += 1;
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        },
        { total: 0, markdown: 0, docx: 0, xlsx: 0, image: 0, other: 0 }
      ),
    []
  );

  return (
    <PageShell theme="projects">
      <PageHeader
        mono={archive.mono}
        title={archive.title}
        desc={archive.desc}
        onNavigate={onNavigate}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: 24, marginBottom: 28 }}>
        <div className="editorial-surface" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: "28px 18px 18px 18px", padding: "30px 30px 32px", boxShadow: "0 16px 42px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Archive Notes
          </div>
          <div style={{ fontFamily: DS.font, fontSize: 28, fontWeight: 700, color: DS.accentDeep, marginBottom: 14 }}>
            塞入文档、表格、说明和图片。
          </div>
          <p style={{ fontFamily: DS.font, fontSize: 14, color: "rgba(65,85,116,0.86)", lineHeight: 1.85, margin: "0 0 18px" }}>
            {/* 这一页已经改成自动素材页。你后续只需要继续往 `material` 目录里加文件，重新构建后页面就会自动把它们列出来。 */}
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {archive.notes.map((item) => (
              <div key={item} style={{ padding: "12px 14px", borderRadius: 14, background: "linear-gradient(180deg, rgba(243,248,255,0.92), rgba(255,255,255,0.86))", border: `1px solid ${DS.borderLight}`, fontFamily: DS.font, fontSize: 14, color: "rgba(66,85,116,0.88)", lineHeight: 1.75 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: "18px 28px 18px 18px", padding: "26px 26px 28px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Material Snapshot
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "总素材", value: materialCounts.total },
              { label: "Markdown", value: materialCounts.markdown },
              { label: "Word", value: materialCounts.docx },
              { label: "Excel", value: materialCounts.xlsx },
            ].map((item) => (
              <div key={item.label} className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(243,248,255,0.92), rgba(255,255,255,0.86))", border: `1px solid ${DS.borderLight}`, borderRadius: 16, padding: "16px 14px" }}>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 24, fontWeight: 700, color: DS.accentDeep }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {matchedMaterials.map((file) => (
              <a
                key={file.fileName}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="interactive-node editorial-card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))",
                  border: `1px solid ${DS.borderLight}`,
                  borderRadius: 16,
                  padding: "16px 16px 18px",
                  boxShadow: "0 12px 30px rgba(104,140,190,0.08)",
                  transition: "all 0.3s ease",
                }}
                {...interactiveSurfaceProps({
                  idleShadow: "0 12px 30px rgba(104,140,190,0.08)",
                  activeShadow: "0 16px 36px rgba(104,140,190,0.12)",
                  idleBorder: DS.borderLight,
                  activeBorder: "rgba(96,145,228,0.3)",
                  translateY: 3,
                  scale: 1.008,
                })}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontFamily: DS.font, fontSize: 15, fontWeight: 700, color: DS.accentDeep }}>{file.prettyName}</div>
                  <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{file.ext || file.type}</div>
                </div>
                <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(69,89,119,0.82)", lineHeight: 1.75 }}>
                  占位符
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 24, marginBottom: 24 }}>
        <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: "26px 26px 28px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Markdown Preview
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: DS.font, fontSize: 14, color: "rgba(62,84,116,0.88)", lineHeight: 1.85 }}>
            {markdownContent}
          </pre>
        </div>

        <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: "22px 22px 24px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Image Preview
          </div>
          {imageFile ? (
            <a href={imageFile.url} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none" }}>
              <img
                src={imageFile.url}
                alt={archive.title}
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.14)",
                }}
              />
            </a>
          ) : (
            <div style={{ height: 280, borderRadius: 18, border: `1px solid ${DS.borderLight}`, background: "rgba(243,248,255,0.84)", display: "grid", placeItems: "center", fontFamily: DS.font, fontSize: 14, color: "rgba(74,98,132,0.72)" }}>
              还没有图片素材
            </div>
          )}
          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(69,89,119,0.82)", lineHeight: 1.75, marginTop: 14 }}>
            这里会优先显示当前分类匹配到的图片。如果暂时只有一张图，它会作为默认视觉素材先展示。
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: "24px 24px 26px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Word Preview
          </div>
          <div className="office-preview" dangerouslySetInnerHTML={{ __html: docxHtml }} />
        </div>

        <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: "24px 24px 26px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
          <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Excel Preview
          </div>
          <div className="office-preview excel-preview" dangerouslySetInnerHTML={{ __html: xlsxHtml }} />
        </div>
      </div>

      <div className="editorial-surface" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(242,248,255,0.82))", border: `1px solid ${DS.borderLight}`, borderRadius: 24, padding: "24px 24px 26px", boxShadow: "0 16px 40px rgba(104,140,190,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.78)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
              Auto Material Library
            </div>
            <div style={{ fontFamily: DS.font, fontSize: 22, fontWeight: 700, color: DS.accentDeep }}>所有素材都会从 `material` 自动列出</div>
          </div>
          <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(69,89,119,0.82)", maxWidth: 360, textAlign: "right", lineHeight: 1.75 }}>
            新增文件后重新构建或刷新开发服务器，这里的素材卡片会自动更新，不需要再手改文件名映射。
          </div>
        </div>
        <div className="archive-library-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {MATERIAL_LIBRARY.map((file) => (
            <a
              key={file.fileName}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="interactive-node editorial-card"
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(243,248,255,0.84))",
                border: `1px solid ${DS.borderLight}`,
                borderRadius: 18,
                padding: "16px 16px 18px",
                boxShadow: "0 12px 30px rgba(104,140,190,0.08)",
                transition: "all 0.3s ease",
              }}
              {...interactiveSurfaceProps({
                idleShadow: "0 12px 30px rgba(104,140,190,0.08)",
                activeShadow: "0 16px 36px rgba(104,140,190,0.12)",
                idleBorder: DS.borderLight,
                activeBorder: "rgba(96,145,228,0.3)",
                translateY: 3,
                scale: 1.008,
              })}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div style={{ fontFamily: DS.font, fontSize: 15, fontWeight: 700, color: DS.accentDeep, lineHeight: 1.5 }}>{file.prettyName}</div>
                <div style={{ fontFamily: DS.mono, fontSize: 10, color: "rgba(88,122,170,0.72)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{file.ext}</div>
              </div>
              <div style={{ fontFamily: DS.font, fontSize: 13, color: "rgba(69,89,119,0.82)", lineHeight: 1.75 }}>
                {file.fileName}
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */
function PageShell({ children, theme = "default" }) {
  return (
    <div
      className="page-shell"
      style={{
        paddingTop: 80,
        paddingBottom: 60,
        paddingLeft: 32,
        paddingRight: 32,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F7FBFF 0%, #EDF5FF 100%)",
        animation: "pageEnter 0.45s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ThemeBackground theme={theme} />
      <div className="page-content" style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function PageHeader({ mono, title, desc, onNavigate }) {
  return (
    <div className="section-header" style={{ marginBottom: 48 }}>
      {onNavigate && <PageActions onNavigate={onNavigate} />}
      <div style={{ fontFamily: DS.mono, fontSize: 11, color: "rgba(70,108,160,0.82)", letterSpacing: "0.18em", marginBottom: 10, textTransform: "uppercase" }}>
        {mono}
      </div>
      <h1 style={{ fontFamily: DS.font, fontSize: 34, fontWeight: 700, color: DS.accentDeep, margin: "0 0 10px", letterSpacing: "0.04em" }}>
        {title}
      </h1>
      {desc && (
        <p style={{ fontFamily: DS.font, fontSize: 15, color: "rgba(53,78,112,0.82)", margin: 0, maxWidth: 560, lineHeight: 1.75 }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="footer-shell"
      style={{
        padding: "40px 32px",
        background: "linear-gradient(180deg, rgba(244,249,255,0.92), rgba(233,243,255,0.96))",
        textAlign: "center",
        borderTop: `1px solid ${DS.borderLight}`,
      }}
    >
      <div style={{ fontFamily: DS.mono, fontSize: 12, color: "rgba(48,82,126,0.82)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Search Aurora
      </div>
      <div style={{ fontFamily: DS.font, fontSize: 12, color: "rgba(78,104,138,0.62)", letterSpacing: "0.04em" }}>
        Minimal front page. Detailed layers underneath.
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP — Router
   ═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState(() => getPageFromHash());
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 1200;
    return window.innerWidth;
  });

  const navigate = useCallback((target) => {
    setPage(target);
    if (typeof window !== "undefined" && window.location.hash !== `#${target}`) {
      window.location.hash = target;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const syncPageWithHash = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", syncPageWithHash);
    syncPageWithHash();
    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
  const activeNav = page.startsWith("project")
    ? "projects"
    : page.startsWith("knowledge")
      ? "knowledge"
      : page.startsWith("archive")
        ? "projects"
      : page;

  // Route to page
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;

  function renderPage() {
    if (page === "home") return <HomePage onNavigate={navigate} isMobile={isMobile} />;
    if (page === "projects") return <ProjectsPage onNavigate={navigate} isMobile={isMobile} />;
    if (page === "knowledge") return <KnowledgePage onNavigate={navigate} isMobile={isMobile} />;
    if (page === "fragments") return <FragmentsPage onNavigate={navigate} />;
    if (page === "interests") return <InterestsPage onNavigate={navigate} />;
    if (page === "about") return <AboutPage onNavigate={navigate} isMobile={isMobile} />;

    if (page.startsWith("archive-")) {
      const id = page.replace("archive-", "");
      const archive = PROJECT_ARCHIVES.find((item) => item.id === id);
      if (archive) return <ArchiveDetailPage archive={archive} onNavigate={navigate} />;
    }

    // Project detail
    if (page.startsWith("project-")) {
      const id = page.replace("project-", "");
      const project = PROJECTS.find((p) => p.id === id);
      if (project) return <ProjectDetailPage project={project} onNavigate={navigate} isMobile={isMobile} />;
    }

    // Knowledge detail
    if (page.startsWith("knowledge-")) {
      const id = page.replace("knowledge-", "");
      const cat = KNOWLEDGE.find((k) => k.id === id);
      if (cat) return <KnowledgeDetailPage category={cat} onNavigate={navigate} />;
    }

    return <HomePage onNavigate={navigate} isMobile={isMobile} />;
  }

  return (
    <div style={{ fontFamily: DS.font, background: DS.bg, minHeight: "100vh" }} data-layout={isMobile ? "mobile" : "desktop"}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${DS.bg}; color: ${DS.text}; }
        ::selection { background: ${DS.accentSoft}; color: ${DS.accentDeep}; }
        .interactive-node { will-change: transform, box-shadow, border-color, opacity; }
        .page-shell { transition: background 0.5s ease; }
        .page-content { animation: slideFadeIn 0.72s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .section-header { animation: slideFadeIn 0.65s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .route-slide {
          opacity: 0;
          animation: slideFadeIn 0.62s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          animation-delay: var(--enter-delay, 0s);
          will-change: transform, opacity;
        }
        .nav-shell { box-shadow: 0 8px 28px rgba(0,0,0,0.04); }
        .nav-brand { will-change: transform, filter, letter-spacing; }
        .nav-brand:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .nav-pill { position: relative; overflow: hidden; }
        .nav-pill:hover { transform: translateY(-2px); }
        .nav-pill::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
          opacity: 0;
          transform: translateX(-120%);
          transition: opacity 0.35s ease, transform 0.55s ease;
          pointer-events: none;
        }
        .nav-pill:hover::after { opacity: 1; transform: translateX(120%); }
        .editorial-surface,
        .editorial-card,
        .footer-shell {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .editorial-surface::before,
        .editorial-card::before,
        .footer-shell::before {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          opacity: 0.35;
          pointer-events: none;
        }
        .editorial-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 18%, rgba(255,255,255,0.06) 48%, transparent 82%);
          opacity: 0;
          transform: translateX(-18%);
          transition: opacity 0.45s ease, transform 0.55s ease;
          pointer-events: none;
        }
        .editorial-card:hover::after { opacity: 1; transform: translateX(12%); }
        .office-preview {
          color: rgba(60,82,115,0.88);
          font-family: ${DS.font};
          font-size: 14px;
          line-height: 1.8;
        }
        .office-preview p,
        .office-preview li {
          margin: 0 0 10px;
        }
        .office-preview table {
          width: 100%;
          border-collapse: collapse;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }
        .office-preview th,
        .office-preview td {
          padding: 10px 12px;
          border: 1px solid rgba(215,228,243,0.88);
          color: rgba(60,82,115,0.88);
          font-size: 13px;
        }
        .office-preview th {
          background: rgba(232,241,255,0.88);
          font-weight: 700;
        }
        .excel-preview {
          overflow-x: auto;
        }
        .footer-shell::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 120px;
          background: radial-gradient(circle at center bottom, rgba(255,255,255,0.08), transparent 62%);
          pointer-events: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes contentRise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes headerRise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18px, -14px, 0) scale(1.04); }
        }
        @keyframes blobFloatA {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(22px, -18px, 0) scale(1.08); }
          66% { transform: translate3d(-14px, 20px, 0) scale(0.96); }
        }
        @keyframes blobFloatB {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          40% { transform: translate3d(-20px, -14px, 0) scale(1.06); }
          70% { transform: translate3d(16px, 18px, 0) scale(0.95); }
        }
        @keyframes blobFloatC {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(12px, -22px, 0) scale(1.1); }
        }
        @keyframes shineSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.6; transform: scaleY(1.2); }
        }
        @media (max-width: 980px) {
          .archive-library-grid {
            grid-template-columns: 1fr !important;
          }
        }
        ${isMobile ? `
        [data-layout="mobile"] .section-header {
          margin-bottom: 28px !important;
        }
        [data-layout="mobile"] .page-content {
          padding-left: 14px !important;
          padding-right: 14px !important;
        }
        [data-layout="mobile"] div[style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }
        [data-layout="mobile"] div[style*="padding: 42px 32px 88px"] {
          padding: 24px 14px 56px !important;
        }
        [data-layout="mobile"] div[style*="padding: 0 32px"] {
          padding-left: 14px !important;
          padding-right: 14px !important;
        }
        [data-layout="mobile"] h1 {
          letter-spacing: 0.04em !important;
        }
        ` : ""}
      `}</style>


      <NavBar currentPage={activeNav} onNavigate={navigate} isHeroVisible={isHeroVisible} isMobile={isMobile} />
      {renderPage()}
      <Footer />
    </div>
  );
}
