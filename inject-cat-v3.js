const fs = require('fs');
const filePath = 'd:\\CRWEB\\backup\\chenrui-site-v2.zh-backup.jsx';
let src = fs.readFileSync(filePath, 'utf8');

// ============================================================
// PART 1: New SVG pixel-art cat component
// Replaces the image-based CatPet from PET_SRC to end of old CatPet
// ============================================================
const NEW_CAT = `const CAT_W = 56;
const CAT_H = 74;

function CatSvg({ catState }) {
  const walk  = catState === 'wander' || catState === 'notice';
  const idle  = catState === 'idle';
  const sleep = catState === 'sleep';
  const legL  = walk ? 'catLegL 0.42s ease-in-out infinite' : 'none';
  const legR  = walk ? 'catLegR 0.42s ease-in-out infinite' : 'none';
  const bob   = walk ? 'catBob3  0.42s ease-in-out infinite' : 'none';
  const tail  = sleep ? 'catTail3 3.6s ease-in-out infinite'
              : idle  ? 'catTail3 1.5s ease-in-out infinite'
              : walk  ? 'catTail3 0.42s ease-in-out infinite' : 'none';
  const brt   = (sleep || idle) ? 'catBrt3 2.6s ease-in-out infinite' : 'none';
  return (
    <svg width={CAT_W} height={CAT_H} viewBox='0 0 56 74' style={{ overflow: 'visible' }}>
      {/* Tail — drawn first so it sits behind body */}
      <g style={{ transformOrigin: '40px 48px', transformBox: 'view-box', animation: tail }}>
        <path d='M 40,48 C 52,38 56,58 43,66' fill='none' stroke='#5a5a5a' strokeWidth='6.4' strokeLinecap='round' opacity='0.15'/>
        <path d='M 40,48 C 52,38 56,58 43,66' fill='none' stroke='#c4c4c4' strokeWidth='5.5' strokeLinecap='round'/>
      </g>
      {/* Back legs — drawn before body so body covers the tops */}
      <g style={{ animation: legR }}>
        <rect x='14' y='54' width='7' height='14' rx='3.5' fill='#b4b4b4' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='17.5' cy='69' rx='4.8' ry='2.6' fill='#b4b4b4' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      <g style={{ animation: legL }}>
        <rect x='35' y='54' width='7' height='14' rx='3.5' fill='#b4b4b4' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='38.5' cy='69' rx='4.8' ry='2.6' fill='#b4b4b4' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      {/* Front legs */}
      <g style={{ animation: legL }}>
        <rect x='18' y='54' width='7' height='14' rx='3.5' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='21.5' cy='69' rx='4.8' ry='2.6' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      <g style={{ animation: legR }}>
        <rect x='31' y='54' width='7' height='14' rx='3.5' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='34.5' cy='69' rx='4.8' ry='2.6' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      {/* Body with breathing */}
      <g style={{ transformOrigin: '28px 58px', transformBox: 'view-box', animation: brt }}>
        <ellipse cx='28' cy='44' rx='13' ry='14' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='1'/>
        <ellipse cx='28' cy='46' rx='7.5' ry='10' fill='#f3f3f3'/>
      </g>
      {/* Collar + bell */}
      <rect x='17' y='30' width='22' height='5' rx='2.5' fill='#cc2222'/>
      <circle cx='28' cy='36.5' r='2.5' fill='#ffcc00' stroke='#bb8800' strokeWidth='0.7'/>
      {/* Head group — bobs during walk */}
      <g style={{ animation: bob }}>
        {/* Ears */}
        <polygon points='14,15 10,4 23,11' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.9'/>
        <polygon points='14,14 12,7 21,11' fill='#e8a0a0'/>
        <polygon points='42,15 46,4 33,11' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='0.9'/>
        <polygon points='42,14 44,7 35,11' fill='#e8a0a0'/>
        {/* Head */}
        <circle cx='28' cy='20' r='13' fill='#d2d2d2' stroke='#5a5a5a' strokeWidth='1'/>
        {/* Eyes: closed when sleeping, open otherwise */}
        {sleep ? (
          <>
            <path d='M 20,19 Q 23,22 26,19' fill='none' stroke='#5a5a5a' strokeWidth='1.5' strokeLinecap='round'/>
            <path d='M 30,19 Q 33,22 36,19' fill='none' stroke='#5a5a5a' strokeWidth='1.5' strokeLinecap='round'/>
          </>
        ) : (
          <>
            <g style={{ transformOrigin: '23px 20px', transformBox: 'view-box', animation: idle ? 'catBlink3 5s ease-in-out infinite' : 'none' }}>
              <ellipse cx='23' cy='20' rx='3.5' ry='3.5' fill='#e07218'/>
              <ellipse cx='23' cy='20.5' rx='2' ry='3' fill='#2a2a2a'/>
              <circle cx='24.5' cy='18.5' r='1' fill='white'/>
            </g>
            <g style={{ transformOrigin: '33px 20px', transformBox: 'view-box', animation: idle ? 'catBlink3 5s ease-in-out infinite 2.5s' : 'none' }}>
              <ellipse cx='33' cy='20' rx='3.5' ry='3.5' fill='#e07218'/>
              <ellipse cx='33' cy='20.5' rx='2' ry='3' fill='#2a2a2a'/>
              <circle cx='34.5' cy='18.5' r='1' fill='white'/>
            </g>
          </>
        )}
        {/* Nose */}
        <polygon points='28,25 26,27.5 30,27.5' fill='#ffaaaa'/>
        {/* Mouth */}
        <path d='M 26,27.5 Q 28,29.5 30,27.5' fill='none' stroke='#999' strokeWidth='0.8'/>
        {/* Whiskers */}
        <line x1='7'  y1='23' x2='24' y2='24.5' stroke='#bbb' strokeWidth='0.6'/>
        <line x1='7'  y1='26' x2='24' y2='26'   stroke='#bbb' strokeWidth='0.6'/>
        <line x1='49' y1='23' x2='32' y2='24.5' stroke='#bbb' strokeWidth='0.6'/>
        <line x1='49' y1='26' x2='32' y2='26'   stroke='#bbb' strokeWidth='0.6'/>
      </g>
      {/* Notice ! */}
      {catState === 'notice' && (
        <text x='41' y='10' fontSize='13' fill='#ff4444' fontWeight='bold' fontFamily='monospace'
          style={{ animation: 'catExclaim3 0.28s ease-in-out infinite alternate' }}>!</text>
      )}
      {/* Sleeping Zzz */}
      {sleep && (
        <g>
          <text x='41' y='14' fontSize='7'  fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz3 2.2s ease-in-out infinite 0s' }}>z</text>
          <text x='45' y='8'  fontSize='9'  fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz3 2.2s ease-in-out infinite 0.75s' }}>z</text>
          <text x='49' y='1'  fontSize='11' fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz3 2.2s ease-in-out infinite 1.5s' }}>Z</text>
        </g>
      )}
    </svg>
  );
}

function CatPet() {
  const [catState, setCatState] = useState('wander');
  const [facing, setFacing] = useState(1);

  const containerRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef('wander');
  const facingRef = useRef(1);
  const destRef = useRef(null);
  const stateTimerRef = useRef(0);
  const idleCountRef = useRef(0);
  const resumeStateRef = useRef('wander');
  const lastMouseSpeedRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const frameRef = useRef(0);

  function floorY() { return window.innerHeight - CAT_H * 0.22; }

  function pickDest() {
    const margin = 70;
    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const y = floorY() + (Math.random() * 24 - 12);
    return { x, y };
  }

  function enterState(next) {
    const prev = stateRef.current;
    stateRef.current = next;
    setCatState(next);
    if (next === 'idle') {
      stateTimerRef.current = Math.round(100 + Math.random() * 200);
      if (prev !== 'notice') idleCountRef.current++;
    } else if (next === 'wander') {
      destRef.current = pickDest();
    } else if (next === 'sleep') {
      stateTimerRef.current = Math.round(800 + Math.random() * 1000);
    } else if (next === 'notice') {
      stateTimerRef.current = Math.round(80 + Math.random() * 70);
    }
  }

  useEffect(() => {
    const WALK_SPEED = 1.9;
    const MARGIN = 65;
    if (!initialized.current) {
      initialized.current = true;
      const sx = window.innerWidth * 0.22 + Math.random() * window.innerWidth * 0.56;
      const sy = floorY();
      posRef.current = { x: sx, y: sy };
      destRef.current = pickDest();
      lastMousePosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (containerRef.current) {
        containerRef.current.style.left = (sx - CAT_W / 2) + 'px';
        containerRef.current.style.top  = (sy - CAT_H * 0.88) + 'px';
      }
    }
    const onMouseMove = (e) => {
      const ddx = e.clientX - lastMousePosRef.current.x;
      const ddy = e.clientY - lastMousePosRef.current.y;
      lastMouseSpeedRef.current = Math.sqrt(ddx * ddx + ddy * ddy);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (stateRef.current === 'sleep' && lastMouseSpeedRef.current > 22) {
        enterState('idle');
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    let animId;
    function loop() {
      const f = ++frameRef.current;
      const cat = posRef.current;
      const st = stateRef.current;
      if (st === 'wander') {
        const dest = destRef.current;
        if (!dest) { destRef.current = pickDest(); }
        else {
          const ddx = dest.x - cat.x;
          const ddy = dest.y - cat.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 8) {
            enterState('idle');
          } else {
            const angle = Math.atan2(ddy, ddx);
            cat.x += Math.cos(angle) * WALK_SPEED;
            cat.y += Math.sin(angle) * WALK_SPEED;
            cat.x = Math.max(MARGIN, Math.min(window.innerWidth - MARGIN, cat.x));
            cat.y = Math.max(80, Math.min(window.innerHeight - 30, cat.y));
            const nf = ddx >= 0 ? 1 : -1;
            if (nf !== facingRef.current) { facingRef.current = nf; setFacing(nf); }
            const walkBob = Math.sin(f * 0.22) * 3.5;
            if (containerRef.current) {
              containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
              containerRef.current.style.top  = (cat.y - CAT_H * 0.88 + walkBob) + 'px';
            }
          }
        }
        if (f % 10 === 0 && lastMouseSpeedRef.current > 18) {
          const cdx = mouseRef.current.x - cat.x;
          const cdy = mouseRef.current.y - cat.y;
          if (Math.sqrt(cdx * cdx + cdy * cdy) < 380) {
            const nf = cdx >= 0 ? 1 : -1;
            facingRef.current = nf; setFacing(nf);
            resumeStateRef.current = 'wander';
            enterState('notice');
            lastMouseSpeedRef.current = 0;
          }
        }
      } else if (st === 'idle') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) {
          if (idleCountRef.current >= 3 && Math.random() < 0.45) {
            enterState('sleep');
          } else {
            enterState('wander');
          }
        }
        if (f % 10 === 0 && lastMouseSpeedRef.current > 18) {
          const cdx = mouseRef.current.x - cat.x;
          const cdy = mouseRef.current.y - cat.y;
          if (Math.sqrt(cdx * cdx + cdy * cdy) < 300) {
            const nf = cdx >= 0 ? 1 : -1;
            facingRef.current = nf; setFacing(nf);
            resumeStateRef.current = 'idle';
            enterState('notice');
            lastMouseSpeedRef.current = 0;
          }
        }
      } else if (st === 'sleep') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) {
          idleCountRef.current = 0;
          enterState('wander');
        }
      } else if (st === 'notice') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) {
          enterState(resumeStateRef.current === 'idle' ? 'idle' : 'wander');
        }
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: 200,
        top: 400,
        width: CAT_W,
        height: CAT_H,
        zIndex: 9998,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        transform: 'scaleX(' + facing + ')',
        transformOrigin: 'center center',
        filter: catState === 'sleep'
          ? 'drop-shadow(0 4px 10px rgba(60,60,100,0.12)) brightness(0.88) saturate(0.7)'
          : 'drop-shadow(0 6px 16px rgba(60,60,100,0.18))',
        transition: 'filter 0.6s ease',
      }}>
        <CatSvg catState={catState} />
      </div>
    </div>
  );
}

`;

// ============================================================
// PART 2: New CSS keyframes (replaces orphaned old frames + catPet frames)
// ============================================================
const NEW_CSS = `        @keyframes catLegL {
          0%,100% { transform: translateX(-3.5px) translateY(0); }
          50%      { transform: translateX(3.5px)  translateY(-1.5px); }
        }
        @keyframes catLegR {
          0%,100% { transform: translateX(3.5px)  translateY(0); }
          50%      { transform: translateX(-3.5px) translateY(-1.5px); }
        }
        @keyframes catBob3 {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes catTail3 {
          0%,100% { transform: rotate(0deg); }
          40%      { transform: rotate(22deg); }
          80%      { transform: rotate(-16deg); }
        }
        @keyframes catBrt3 {
          0%,100% { transform: scaleY(1); }
          50%      { transform: scaleY(1.045); }
        }
        @keyframes catBlink3 {
          0%,88%,100% { transform: scaleY(1); }
          94%          { transform: scaleY(0.1); }
        }
        @keyframes catZzz3 {
          0%   { transform: translate(0,0);       opacity: 0; }
          18%  { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translate(7px,-15px); opacity: 0; }
        }
        @keyframes catExclaim3 {
          from { transform: translateY(0); }
          to   { transform: translateY(-4px); }
        }
        `;

// ─── Replace component section ────────────────────────────────────────
const COMP_START = '/* ─── PET CONFIG';
const COMP_END   = '\nexport default function App()';
const ci = src.indexOf(COMP_START);
const ce = src.indexOf(COMP_END);
if (ci < 0 || ce < 0) { console.error('Component markers not found', ci, ce); process.exit(1); }
src = src.slice(0, ci) + NEW_CAT + src.slice(ce + 1); // +1 skips the leading \n

// ─── Replace CSS section (orphaned bodies + catPet keyframes) ─────────
// Range: the orphaned '25% {' fragment lines up to (not including) @media
const CSS_START = '          25% { transform: rotate(20deg); }';
const CSS_END   = '        @media (max-width: 980px)';
const xi = src.indexOf(CSS_START);
const xe = src.indexOf(CSS_END);
if (xi < 0 || xe < 0) { console.error('CSS markers not found', xi, xe); process.exit(1); }
src = src.slice(0, xi) + NEW_CSS + src.slice(xe);

fs.writeFileSync(filePath, src, 'utf8');
console.log('Done — CatPet v3 (SVG pixel cat) injected, old keyframes cleaned up.');
