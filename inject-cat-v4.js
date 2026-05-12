const fs = require('fs');
const filePath = 'd:\\CRWEB\\backup\\chenrui-site-v2.zh-backup.jsx';
let src = fs.readFileSync(filePath, 'utf8');

// ── Cat component code ──────────────────────────────────────────────
const CAT_CODE = `
const CAT_W = 60;
const CAT_H = 78;
const EYE_LX = 25, EYE_LY = 21;
const EYE_RX = 35, EYE_RY = 21;
const PUPIL_MAX = 2.0;

function CatSvg({ catState, eyeLRef, eyeRRef, blinkLRef, blinkRRef }) {
  const run   = catState === 'run';
  const move  = catState === 'wander' || run;
  const idle  = catState === 'idle';
  const sleep = catState === 'sleep';
  const sp    = run ? '0.19s' : '0.43s';
  const legL  = move ? ('catLegL ' + sp + ' ease-in-out infinite') : 'none';
  const legR  = move ? ('catLegR ' + sp + ' ease-in-out infinite') : 'none';
  const bob   = move ? ('catBob4 '  + sp + ' ease-in-out infinite') : 'none';
  const tail  = sleep ? 'catTail4 3.8s ease-in-out infinite'
              : idle  ? 'catTail4 1.5s ease-in-out infinite'
              : move  ? ('catTail4 ' + sp + ' ease-in-out infinite') : 'none';
  const brt   = (sleep || idle) ? 'catBrt4 2.8s ease-in-out infinite' : 'none';
  return (
    <svg width={CAT_W} height={CAT_H} viewBox='0 0 60 78' style={{ overflow: 'visible' }}>
      {/* Tail */}
      <g style={{ transformOrigin: '43px 51px', transformBox: 'view-box', animation: tail }}>
        <path d='M 43,51 C 55,41 59,61 46,69' fill='none' stroke='#5a5a5a' strokeWidth='6.8' strokeLinecap='round' opacity='0.13'/>
        <path d='M 43,51 C 55,41 59,61 46,69' fill='none' stroke='#c8c8c8' strokeWidth='5.8' strokeLinecap='round'/>
      </g>
      {/* Back legs */}
      <g style={{ animation: legR }}>
        <rect x='14' y='56' width='7.5' height='16' rx='3.8' fill='#b6b6b6' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='17.8' cy='73' rx='5' ry='2.8' fill='#b6b6b6' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      <g style={{ animation: legL }}>
        <rect x='38' y='56' width='7.5' height='16' rx='3.8' fill='#b6b6b6' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='41.5' cy='73' rx='5' ry='2.8' fill='#b6b6b6' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      {/* Front legs */}
      <g style={{ animation: legL }}>
        <rect x='19' y='56' width='7.5' height='16' rx='3.8' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='22.8' cy='73' rx='5' ry='2.8' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      <g style={{ animation: legR }}>
        <rect x='33' y='56' width='7.5' height='16' rx='3.8' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.8'/>
        <ellipse cx='36.8' cy='73' rx='5' ry='2.8' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.8'/>
      </g>
      {/* Body */}
      <g style={{ transformOrigin: '30px 62px', transformBox: 'view-box', animation: brt }}>
        <ellipse cx='30' cy='46' rx='15' ry='16' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='1'/>
        <ellipse cx='30' cy='48' rx='8.5' ry='11' fill='#f4f4f4'/>
      </g>
      {/* Collar + bell */}
      <rect x='18' y='32' width='24' height='5' rx='2.5' fill='#cc2222'/>
      <circle cx='30' cy='38.5' r='2.8' fill='#ffcc00' stroke='#bb8800' strokeWidth='0.7'/>
      {/* Head group */}
      <g style={{ animation: bob }}>
        <polygon points='15,16 10,4 24,12' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.9'/>
        <polygon points='15,15 12,7 22,12' fill='#f0a0a0'/>
        <polygon points='45,16 50,4 36,12' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='0.9'/>
        <polygon points='45,15 48,7 38,12' fill='#f0a0a0'/>
        <circle cx='30' cy='21' r='14' fill='#d4d4d4' stroke='#5a5a5a' strokeWidth='1'/>
        {sleep ? (
          <>
            <path d='M 21,21 Q 25,25 29,21' fill='none' stroke='#5a5a5a' strokeWidth='1.5' strokeLinecap='round'/>
            <path d='M 31,21 Q 35,25 39,21' fill='none' stroke='#5a5a5a' strokeWidth='1.5' strokeLinecap='round'/>
          </>
        ) : (
          <>
            <ellipse cx='25' cy='21' rx='4' ry='4.2' fill='#f8f4ec' stroke='#5a5a5a' strokeWidth='0.5'/>
            <ellipse cx='25' cy='21' rx='2.9' ry='3.2' fill='#e07218'/>
            <g ref={eyeLRef} style={{ transform: 'translate(25px,21px)' }}>
              <circle cx='0' cy='0' r='1.8' fill='#1a1a1a'/>
              <circle cx='0.7' cy='-0.7' r='0.6' fill='white'/>
            </g>
            <ellipse ref={blinkLRef} cx='25' cy='21' rx='4' ry='4.2' fill='#d4d4d4'
              style={{ transform: 'scaleY(0)', transformBox: 'fill-box', transformOrigin: 'center', transition: 'transform 0.09s ease-in-out' }}/>
            <ellipse cx='35' cy='21' rx='4' ry='4.2' fill='#f8f4ec' stroke='#5a5a5a' strokeWidth='0.5'/>
            <ellipse cx='35' cy='21' rx='2.9' ry='3.2' fill='#e07218'/>
            <g ref={eyeRRef} style={{ transform: 'translate(35px,21px)' }}>
              <circle cx='0' cy='0' r='1.8' fill='#1a1a1a'/>
              <circle cx='0.7' cy='-0.7' r='0.6' fill='white'/>
            </g>
            <ellipse ref={blinkRRef} cx='35' cy='21' rx='4' ry='4.2' fill='#d4d4d4'
              style={{ transform: 'scaleY(0)', transformBox: 'fill-box', transformOrigin: 'center', transition: 'transform 0.09s ease-in-out' }}/>
          </>
        )}
        <polygon points='30,27 28,29.5 32,29.5' fill='#ffaaaa'/>
        <path d='M 28,29.5 Q 30,31.5 32,29.5' fill='none' stroke='#999' strokeWidth='0.8'/>
        <line x1='6'  y1='25' x2='24' y2='26.5' stroke='#c8c8c8' strokeWidth='0.65'/>
        <line x1='6'  y1='28' x2='24' y2='28'   stroke='#c8c8c8' strokeWidth='0.65'/>
        <line x1='54' y1='25' x2='36' y2='26.5' stroke='#c8c8c8' strokeWidth='0.65'/>
        <line x1='54' y1='28' x2='36' y2='28'   stroke='#c8c8c8' strokeWidth='0.65'/>
      </g>
      {catState === 'notice' && (
        <text x='44' y='10' fontSize='13' fill='#ff4444' fontWeight='bold' fontFamily='monospace'
          style={{ animation: 'catExclaim4 0.28s ease-in-out infinite alternate' }}>!</text>
      )}
      {sleep && (
        <g>
          <text x='44' y='14' fontSize='7'  fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz4 2.3s ease-in-out infinite 0s'    }}>z</text>
          <text x='48' y='8'  fontSize='9'  fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz4 2.3s ease-in-out infinite 0.77s'  }}>z</text>
          <text x='52' y='1'  fontSize='11' fill='#8899ee' fontFamily='monospace' style={{ animation: 'catZzz4 2.3s ease-in-out infinite 1.54s' }}>Z</text>
        </g>
      )}
    </svg>
  );
}

function CatPet() {
  const [catState, setCatState] = useState('idle');

  const containerRef  = useRef(null);
  const innerRef      = useRef(null);
  const eyeLRef       = useRef(null);
  const eyeRRef       = useRef(null);
  const blinkLRef     = useRef(null);
  const blinkRRef     = useRef(null);
  const posRef        = useRef({ x: 0, y: 0 });
  const mouseRef      = useRef({ x: -999, y: -999 });
  const stateRef      = useRef('idle');
  const facingRef     = useRef(1);
  const destRef       = useRef(null);
  const stateTimerRef = useRef(0);
  const idleCountRef  = useRef(0);
  const resumeRef     = useRef('idle');
  const lastSpeedRef  = useRef(0);
  const lastMouseRef  = useRef({ x: 0, y: 0 });
  const initialized   = useRef(false);
  const frameRef      = useRef(0);
  const blinkTimerRef = useRef(150);
  const isBlinkRef    = useRef(false);

  function floorY() { return window.innerHeight - CAT_H * 0.22; }

  function pickDest() {
    const m = 72;
    return { x: m + Math.random() * (window.innerWidth - m * 2), y: floorY() + Math.random() * 20 - 10 };
  }

  function enterState(next) {
    const prev = stateRef.current;
    stateRef.current = next;
    setCatState(next);
    if (next === 'idle') {
      stateTimerRef.current = Math.round(120 + Math.random() * 200);
      if (prev !== 'notice') idleCountRef.current++;
    } else if (next === 'wander' || next === 'run') {
      destRef.current = pickDest();
    } else if (next === 'sleep') {
      stateTimerRef.current = Math.round(700 + Math.random() * 900);
    } else if (next === 'notice') {
      stateTimerRef.current = Math.round(90 + Math.random() * 60);
    }
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const sx = window.innerWidth * 0.25 + Math.random() * window.innerWidth * 0.5;
      const sy = floorY();
      posRef.current = { x: sx, y: sy };
      destRef.current = pickDest();
      lastMouseRef.current = mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (containerRef.current) {
        containerRef.current.style.left = (sx - CAT_W / 2) + 'px';
        containerRef.current.style.top  = (sy - CAT_H * 0.88) + 'px';
      }
    }

    const onMouseMove = function(e) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      lastSpeedRef.current = Math.sqrt(dx * dx + dy * dy);
      lastMouseRef.current = mouseRef.current = { x: e.clientX, y: e.clientY };
      if (stateRef.current === 'sleep' && lastSpeedRef.current > 22) enterState('idle');
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId;
    function loop() {
      var f = ++frameRef.current;
      var cat = posRef.current;
      var st  = stateRef.current;
      var MARGIN = 70, WALK = 1.9, RUN = 3.9;

      // Eye tracking (every frame, direct DOM, no React re-render)
      if (st !== 'sleep' && eyeLRef.current && eyeRRef.current) {
        var hx  = cat.x;
        var hy  = cat.y - CAT_H * 0.88 + EYE_LY;
        var mx  = mouseRef.current.x, my = mouseRef.current.y;
        var ang = Math.atan2(my - hy, mx - hx);
        var t   = Math.min(Math.sqrt((mx-hx)*(mx-hx)+(my-hy)*(my-hy)) / 130, 1);
        var ox  = Math.cos(ang) * PUPIL_MAX * t * facingRef.current;
        var oy  = Math.sin(ang) * PUPIL_MAX * t;
        eyeLRef.current.style.transform = 'translate(' + (EYE_LX + ox) + 'px,' + (EYE_LY + oy) + 'px)';
        eyeRRef.current.style.transform = 'translate(' + (EYE_RX + ox) + 'px,' + (EYE_RY + oy) + 'px)';
      }

      // Blinking
      if (st !== 'sleep' && !isBlinkRef.current) {
        blinkTimerRef.current--;
        if (blinkTimerRef.current <= 0) {
          isBlinkRef.current = true;
          blinkTimerRef.current = Math.round(200 + Math.random() * 280);
          if (blinkLRef.current) blinkLRef.current.style.transform = 'scaleY(1)';
          if (blinkRRef.current) blinkRRef.current.style.transform = 'scaleY(1)';
          setTimeout(function() {
            if (blinkLRef.current) blinkLRef.current.style.transform = 'scaleY(0)';
            if (blinkRRef.current) blinkRRef.current.style.transform = 'scaleY(0)';
            isBlinkRef.current = false;
          }, 130);
        }
      }

      // Movement
      if (st === 'wander' || st === 'run') {
        var dest  = destRef.current;
        var speed = st === 'run' ? RUN : WALK;
        if (!dest) { destRef.current = pickDest(); }
        else {
          var ddx  = dest.x - cat.x, ddy = dest.y - cat.y;
          var dist = Math.sqrt(ddx*ddx + ddy*ddy);
          if (dist < 8) {
            enterState('idle');
          } else {
            var ang2 = Math.atan2(ddy, ddx);
            cat.x += Math.cos(ang2) * speed;
            cat.y += Math.sin(ang2) * speed;
            cat.x = Math.max(MARGIN, Math.min(window.innerWidth - MARGIN, cat.x));
            cat.y = Math.max(80, Math.min(window.innerHeight - 30, cat.y));
            var nf = ddx >= 0 ? 1 : -1;
            if (nf !== facingRef.current) facingRef.current = nf;
            var bobAmt = st === 'run' ? 5.5 : 3.0;
            var bobSpd = st === 'run' ? 0.48 : 0.22;
            var bobY   = Math.sin(f * bobSpd) * bobAmt;
            var tilt   = st === 'run' ? (facingRef.current * -7) : 0;
            if (containerRef.current) {
              containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
              containerRef.current.style.top  = (cat.y - CAT_H * 0.88 + bobY) + 'px';
            }
            if (innerRef.current) {
              innerRef.current.style.transform = 'scaleX(' + facingRef.current + ') rotate(' + tilt + 'deg)';
            }
          }
        }
        if (f % 10 === 0 && lastSpeedRef.current > 18) {
          var cdx = mouseRef.current.x - cat.x, cdy = mouseRef.current.y - cat.y;
          if (Math.sqrt(cdx*cdx+cdy*cdy) < 380) {
            facingRef.current = cdx >= 0 ? 1 : -1;
            resumeRef.current = 'wander'; enterState('notice'); lastSpeedRef.current = 0;
          }
        }
      } else if (st === 'idle') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        if (innerRef.current) innerRef.current.style.transform = 'scaleX(' + facingRef.current + ') rotate(0deg)';
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) {
          if (idleCountRef.current >= 3 && Math.random() < 0.45) {
            enterState('sleep');
          } else {
            enterState(Math.random() < 0.3 ? 'run' : 'wander');
          }
        }
        if (f % 10 === 0 && lastSpeedRef.current > 18) {
          var cdx2 = mouseRef.current.x - cat.x, cdy2 = mouseRef.current.y - cat.y;
          if (Math.sqrt(cdx2*cdx2+cdy2*cdy2) < 320) {
            facingRef.current = cdx2 >= 0 ? 1 : -1;
            resumeRef.current = 'idle'; enterState('notice'); lastSpeedRef.current = 0;
          }
        }
      } else if (st === 'sleep') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) { idleCountRef.current = 0; enterState('wander'); }
      } else if (st === 'notice') {
        if (containerRef.current) {
          containerRef.current.style.left = (cat.x - CAT_W / 2) + 'px';
          containerRef.current.style.top  = (cat.y - CAT_H * 0.88) + 'px';
        }
        stateTimerRef.current--;
        if (stateTimerRef.current <= 0) enterState(resumeRef.current === 'idle' ? 'idle' : 'wander');
      }

      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    return function() {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position:'fixed', left:200, top:400, width:CAT_W, height:CAT_H, zIndex:9998, pointerEvents:'none', userSelect:'none' }}>
      <div ref={innerRef} style={{ width:'100%', height:'100%', transformOrigin:'center center',
        filter: catState==='sleep' ? 'drop-shadow(0 4px 10px rgba(60,60,100,0.12)) brightness(0.88) saturate(0.7)' : 'drop-shadow(0 6px 16px rgba(60,60,100,0.18))',
        transition: 'filter 0.6s ease' }}>
        <CatSvg catState={catState} eyeLRef={eyeLRef} eyeRRef={eyeRRef} blinkLRef={blinkLRef} blinkRRef={blinkRRef}/>
      </div>
    </div>
  );
}
`;

// ── CSS keyframes ───────────────────────────────────────────────────
const CAT_CSS = `        @keyframes catLegL {
          0%,100% { transform: translateX(-4px) translateY(0); }
          50%      { transform: translateX(4px)  translateY(-2px); }
        }
        @keyframes catLegR {
          0%,100% { transform: translateX(4px)  translateY(0); }
          50%      { transform: translateX(-4px) translateY(-2px); }
        }
        @keyframes catBob4 {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-3.5px); }
        }
        @keyframes catTail4 {
          0%,100% { transform: rotate(0deg); }
          40%      { transform: rotate(24deg); }
          80%      { transform: rotate(-18deg); }
        }
        @keyframes catBrt4 {
          0%,100% { transform: scaleY(1); }
          50%      { transform: scaleY(1.05); }
        }
        @keyframes catZzz4 {
          0%   { transform: translate(0,0);       opacity: 0; }
          18%  { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translate(8px,-16px); opacity: 0; }
        }
        @keyframes catExclaim4 {
          from { transform: translateY(0); }
          to   { transform: translateY(-4px); }
        }
        `;

// ── Insert component before "export default function App()" ─────────
const COMP_ANCHOR = '\nexport default function App()';
const ci = src.indexOf(COMP_ANCHOR);
if (ci < 0) { console.error('Component anchor not found'); process.exit(1); }
src = src.slice(0, ci) + '\n' + CAT_CODE.trim() + '\n' + src.slice(ci);

// ── Insert CSS before @media ────────────────────────────────────────
const CSS_ANCHOR = '        @media (max-width: 980px)';
const xi = src.indexOf(CSS_ANCHOR);
if (xi < 0) { console.error('CSS anchor not found'); process.exit(1); }
src = src.slice(0, xi) + CAT_CSS + src.slice(xi);

// ── Insert <CatPet /> before <NavBar ───────────────────────────────
src = src.replace(/(\s+)(<NavBar currentPage={activeNav})/, '\n      <CatPet />\n$1$2');

fs.writeFileSync(filePath, src, 'utf8');
console.log('Done — CatPet v4 (eye-tracking, run, blink) injected.');
