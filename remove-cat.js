const fs = require('fs');
const filePath = 'd:\\CRWEB\\backup\\chenrui-site-v2.zh-backup.jsx';
let src = fs.readFileSync(filePath, 'utf8');

// 1. Remove CatSvg + CatPet components (const CAT_W ... closing } before export default)
const compStart = 'const CAT_W = 56;';
const compEnd   = '\nexport default function App()';
const ci = src.indexOf(compStart);
const ce = src.indexOf(compEnd);
if (ci < 0 || ce < 0) { console.error('Component markers not found'); process.exit(1); }
src = src.slice(0, ci) + src.slice(ce + 1); // +1 skips the leading \n

// 2. Remove cat CSS keyframes (catLegL ... catExclaim3 closing })
//    Also clean up the leftover double-indented @media line
const cssStart = '        @keyframes catLegL {';
const cssEnd1  = '        }\n                @media'; // extra-indented @media from previous injection
const cssEnd2  = '        }\n        @media';           // normal indentation fallback
let xi = src.indexOf(cssStart);
let xe = src.indexOf(cssEnd1);
if (xi < 0) { console.error('CSS start not found'); process.exit(1); }
if (xe >= 0) {
  // Remove keyframes, restore correct @media indentation
  src = src.slice(0, xi) + '        @media' + src.slice(xe + '        }\n                @media'.length);
} else {
  xe = src.indexOf(cssEnd2);
  if (xe < 0) { console.error('CSS end not found'); process.exit(1); }
  src = src.slice(0, xi) + '        @media' + src.slice(xe + '        }\n        @media'.length);
}

// 3. Remove <CatPet /> usage line
src = src.replace(/\n      <CatPet \/>\n/, '\n');

fs.writeFileSync(filePath, src, 'utf8');
console.log('Done — CatPet removed.');
