// Compile the site's existing utility classes without a network dependency.
// The generated stylesheet is committed so GitHub Pages can serve it directly.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const colors = {
  white: '#ffffff', black: '#000000',
  gray: { 200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827',950:'#030712' },
  slate: { 100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617' },
  stone: { 900:'#1c1917',950:'#0c0a09' },
  sky: { 200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1' },
  purple: { 200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce' },
  pink: { 200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777' },
  red: { 300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626' },
  green: { 300:'#86efac',400:'#4ade80',500:'#22c55e' },
  fuchsia: { 300:'#f0abfc',400:'#e879f9',500:'#d946ef' },
  indigo: { 200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5' },
  cyan: { 300:'#67e8f9',400:'#22d3ee',500:'#06b6d4' },
  amber: { 300:'#fcd34d',400:'#fbbf24',500:'#f59e0b' }
};

function color(value, opacityOverride) {
  const [token, opacity] = value.split('/');
  const [family, shade] = token.split('-');
  const hex = shade ? colors[family]?.[shade] : colors[family];
  if (typeof hex !== 'string') return null;
  const alpha = opacityOverride ?? (opacity === undefined ? 1 : Number(opacity) / 100);
  if (alpha === 1) return hex;
  const channels = [1,3,5].map(start => parseInt(hex.slice(start,start+2),16));
  return `rgb(${channels.join(' ')} / ${alpha})`;
}
const transform = 'transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));';
const shadow = 'box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);';
const direct = {
  'scroll-smooth':'scroll-behavior:smooth;',
  'sr-only':'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;',
  hidden:'display:none;', block:'display:block;', flex:'display:flex;', grid:'display:grid;', 'inline-block':'display:inline-block;', 'inline-flex':'display:inline-flex;',
  relative:'position:relative;', absolute:'position:absolute;', fixed:'position:fixed;', sticky:'position:sticky;',
  'flex-col':'flex-direction:column;', 'flex-row':'flex-direction:row;', 'flex-wrap':'flex-wrap:wrap;', 'flex-grow':'flex-grow:1;', 'flex-1':'flex:1 1 0%;', 'flex-shrink-0':'flex-shrink:0;', 'shrink-0':'flex-shrink:0;',
  'items-center':'align-items:center;', 'items-start':'align-items:flex-start;', 'items-end':'align-items:flex-end;', 'items-baseline':'align-items:baseline;', 'justify-center':'justify-content:center;', 'justify-between':'justify-content:space-between;', 'justify-end':'justify-content:flex-end;',
  'font-normal':'font-weight:400;', 'font-medium':'font-weight:500;', 'font-semibold':'font-weight:600;', 'font-bold':'font-weight:700;', 'font-extrabold':'font-weight:800;',
  'leading-relaxed':'line-height:1.625;', 'leading-tight':'line-height:1.25;', 'tracking-tight':'letter-spacing:-.025em;',
  uppercase:'text-transform:uppercase;', underline:'text-decoration-line:underline;', 'no-underline':'text-decoration-line:none;',
  'text-left':'text-align:left;', 'text-center':'text-align:center;', 'text-right':'text-align:right;',
  'overflow-hidden':'overflow:hidden;', 'overflow-x-auto':'overflow-x:auto;', 'object-cover':'object-fit:cover;', 'object-contain':'object-fit:contain;',
  'list-disc':'list-style-type:disc;', 'list-inside':'list-style-position:inside;', 'pointer-events-none':'pointer-events:none;',
  border:'border-width:1px;', 'border-0':'border-width:0;', 'border-t':'border-top-width:1px;',
  'rounded-sm':'border-radius:.125rem;', rounded:'border-radius:.25rem;', 'rounded-md':'border-radius:.375rem;', 'rounded-lg':'border-radius:.5rem;', 'rounded-xl':'border-radius:.75rem;', 'rounded-2xl':'border-radius:1rem;', 'rounded-3xl':'border-radius:1.5rem;', 'rounded-full':'border-radius:9999px;',
  'transition-all':'transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms;',
  'transition-colors':'transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms;',
  'transition-transform':'transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms;',
  transform,
  'shadow-lg':`--tw-shadow:0 10px 15px -3px rgb(0 0 0 / .1),0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);${shadow}`,
  'shadow-md':`--tw-shadow:0 4px 6px -1px rgb(0 0 0 / .1),0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);${shadow}`,
  'shadow-xl':`--tw-shadow:0 20px 25px -5px rgb(0 0 0 / .1),0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);${shadow}`,
  'bg-gradient-to-r':'background-image:linear-gradient(to right,var(--tw-gradient-stops));',
  'bg-gradient-to-b':'background-image:linear-gradient(to bottom,var(--tw-gradient-stops));',
  'bg-gradient-to-br':'background-image:linear-gradient(to bottom right,var(--tw-gradient-stops));'
};
const textSizes = { xs:['.75rem','1rem'],sm:['.875rem','1.25rem'],base:['1rem','1.5rem'],lg:['1.125rem','1.75rem'],xl:['1.25rem','1.75rem'],'2xl':['1.5rem','2rem'],'3xl':['1.875rem','2.25rem'],'4xl':['2.25rem','2.5rem'],'5xl':['3rem','1'],'6xl':['3.75rem','1'],'7xl':['4.5rem','1'] };
const maxWidths = { xs:20,sm:24,md:28,lg:32,xl:36,'2xl':42,'3xl':48,'4xl':56,'5xl':64,'6xl':72,'7xl':80 };
const breakpoints = { sm:640,md:768,lg:1024,xl:1280,'2xl':1536 };
function utility(token) {
  if (direct[token]) return direct[token];
  let match;
  if ((match = token.match(/^text-(.+)$/))) {
    if (textSizes[match[1]]) { const [size,line] = textSizes[match[1]]; return `font-size:${size};line-height:${line};`; }
    const value = color(match[1]); if (value) return `color:${value};`;
  }
  if ((match = token.match(/^(bg|border|decoration)-(.+)$/))) {
    const value = color(match[2]); if (value) return `${{ bg:'background-color',border:'border-color',decoration:'text-decoration-color' }[match[1]]}:${value};`;
  }
  if ((match = token.match(/^(from|via|to)-(.+)$/))) {
    const value = color(match[2]); if (!value) return null;
    if (match[1] === 'from') return `--tw-gradient-from:${value};--tw-gradient-to:${color(match[2],0)};--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to);`;
    if (match[1] === 'to') return `--tw-gradient-to:${value};`;
    return `--tw-gradient-to:${color(match[2],0)};--tw-gradient-stops:var(--tw-gradient-from),${value},var(--tw-gradient-to);`;
  }
  if ((match = token.match(/^shadow-(.+)$/))) { const value = color(match[1]); if (value) return `--tw-shadow-color:${value};--tw-shadow:var(--tw-shadow-colored);${shadow}`; }
  if ((match = token.match(/^(-?)(m|p)([xytrbl]?)-(auto|\d+(?:\.\d+)?)$/))) {
    const [,negative,kind,axis,amount] = match;
    if (kind === 'p' && (negative || amount === 'auto')) return null;
    const value = amount === 'auto' ? 'auto' : `${negative ? '-' : ''}${Number(amount)/4}rem`;
    const property = kind === 'm' ? 'margin' : 'padding';
    const sides = { x:['left','right'],y:['top','bottom'],t:['top'],r:['right'],b:['bottom'],l:['left'] }[axis];
    return sides ? sides.map(side => `${property}-${side}:${value};`).join('') : `${property}:${value};`;
  }
  if ((match = token.match(/^gap-(\d+(?:\.\d+)?)$/))) return `gap:${Number(match[1])/4}rem;`;
  if ((match = token.match(/^(w|h|min-w|min-h|max-w|max-h)-(\d+(?:\.\d+)?|full|auto|screen|\d+\/\d+|.+)$/))) {
    const [,size,amount] = match;
    const prop = size.replace(/^w$/, 'width').replace(/^h$/, 'height').replace(/-w$/, '-width').replace(/-h$/, '-height');
    if (size === 'max-w' && maxWidths[amount]) return `${prop}:${maxWidths[amount]}rem;`;
    if (amount === 'full') return `${prop}:100%;`;
    if (amount === 'auto') return `${prop}:auto;`;
    if (amount === 'screen') return `${prop}:${size.endsWith('w') ? '100vw' : '100vh'};`;
    if (/^\d+(\.\d+)?$/.test(amount)) return `${prop}:${Number(amount)/4}rem;`;
    if (/^\d+\/\d+$/.test(amount)) { const [n,d] = amount.split('/'); return `${prop}:${Number(n)/Number(d)*100}%;`; }
  }
  if ((match = token.match(/^grid-cols-(\d+)$/))) return `grid-template-columns:repeat(${match[1]},minmax(0,1fr));`;
  if ((match = token.match(/^col-span-(\d+)$/))) return `grid-column:span ${match[1]} / span ${match[1]};`;
  if ((match = token.match(/^z-(\d+)$/))) return `z-index:${match[1]};`;
  if ((match = token.match(/^duration-(\d+)$/))) return `transition-duration:${match[1]}ms;`;
  if ((match = token.match(/^opacity-(\d+)$/))) return `opacity:${Number(match[1])/100};`;
  if ((match = token.match(/^scale-(\d+)$/))) return `--tw-scale-x:${Number(match[1])/100};--tw-scale-y:${Number(match[1])/100};${transform}`;
  if ((match = token.match(/^(-?)rotate-(\d+)$/))) return `--tw-rotate:${match[1]}${match[2]}deg;${transform}`;
  if ((match = token.match(/^tracking-\[([\d.]+(?:em|px|rem))\]$/))) return `letter-spacing:${match[1]};`;
  return null;
}
function htmlFiles(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    const filename = path.join(directory,entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith('.html') ? [filename] : [];
  });
}
const classes = new Set();
const sources = [fs.readFileSync(path.join(root,'main.js'),'utf8')];
for (const filename of htmlFiles(root)) {
  const html = fs.readFileSync(filename,'utf8');
  sources.push(html);
  for (const match of html.matchAll(/\bclass\s*=\s*["']([^"']*)["']/g)) for (const token of match[1].split(/\s+/)) if (token) classes.add(token);
}
for (const source of sources) {
  for (const match of source.matchAll(/classList\.(?:add|remove|toggle|contains)\(([^)]*)\)/g)) {
    for (const argument of match[1].split(',')) {
      const quoted = argument.trim().match(/^["']([\w-]+)["']$/);
      if (quoted) classes.add(quoted[1]);
    }
  }
  for (const match of source.matchAll(/className\s*=\s*["']([^"']*)["']/g)) for (const token of match[1].split(/\s+/)) if (token) classes.add(token);
}
const customClasses = new Set([...fs.readFileSync(path.join(root,'style.css'),'utf8').matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(match => match[1]));
const markers = new Set(['group','peer']);
const containers = [], base = [], variants = [], unsupported = [];
const rank = token => {
  const name = token.split(':').pop();
  if (name.startsWith('from-')) return 0;
  if (name.startsWith('via-')) return 1;
  if (name.startsWith('to-')) return 2;
  if (/^transition-/.test(name)) return 3;
  if (/^duration-/.test(name)) return 4;
  if (/^shadow-(sm|md|lg|xl|2xl|inner|none)$/.test(name)) return 5;
  if (/^shadow-/.test(name)) return 6;
  const spacing = name.match(/^-?[mp]([xytrbl]?)-/);
  if (spacing) return spacing[1] === '' ? 7 : ['x','y'].includes(spacing[1]) ? 8 : 9;
  return 10;
};
for (const token of [...classes].sort((a,b) => rank(a)-rank(b) || (a < b ? -1 : a > b ? 1 : 0))) {
  const parts = token.split(':');
  const name = parts.pop();
  if (name === 'container') {
    const selector = '.container';
    containers.push(`${selector}{width:100%;}`);
    for (const width of Object.values(breakpoints)) containers.push(`@media(min-width:${width}px){${selector}{max-width:${width}px;}}`);
    continue;
  }
  let declarations = utility(name);
  const spacing = name.match(/^space-y-(\d+(?:\.\d+)?)$/);
  if (spacing) declarations = `--tw-space-y-reverse:0;margin-top:calc(${Number(spacing[1])/4}rem * (1 - var(--tw-space-y-reverse)));margin-bottom:calc(${Number(spacing[1])/4}rem * var(--tw-space-y-reverse));`;
  if (!declarations) {
    // Structural and JavaScript state classes need no generated rule.
    const looksLikeUtility = /^(bg|text|border|decoration|shadow|font|tracking|transition|duration|rounded|space-[xy]|gap|grid-cols|col-span|scale|rotate|opacity|z|from|via|to|min-[wh]|max-[wh]|[wh]|[mp][xytrbl]?)-/.test(name);
    if (!customClasses.has(token) && !markers.has(token) && (parts.length || looksLikeUtility)) unsupported.push(token);
    continue;
  }
  let selector = '.' + token.replace(/([^a-zA-Z0-9_-])/g,'\\$1');
  let media;
  for (const variant of parts) {
    if (breakpoints[variant]) media = breakpoints[variant];
    else if (variant === 'group-open') selector = `.group[open] ${selector}`;
    else if (variant === 'group-hover') selector = `.group:hover ${selector}`;
    else if (['hover','focus','focus-visible','active','disabled'].includes(variant)) selector += ':' + variant;
    else { unsupported.push(token); declarations = null; break; }
  }
  if (!declarations) continue;
  if (spacing) selector += ' > :not([hidden]) ~ :not([hidden])';
  let rule = `${selector}{${declarations}}`;
  if (media) rule = `@media(min-width:${media}px){${rule}}`;
  if (parts.length) variants.push({ media:media || 0, rule });
  else base.push(rule);
}
const preflight = `*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:Manrope,'Segoe UI',sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}small{font-size:80%}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}button,[role=button]{cursor:pointer}:disabled{cursor:default}progress{vertical-align:baseline}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`;
fs.mkdirSync(path.join(root,'assets'),{recursive:true});
fs.writeFileSync(path.join(root,'assets','utilities.css'),`/* Generated by npm run build. Site utility styles; no external dependencies. */\n${preflight}${containers.join('')}${base.join('')}${variants.sort((a,b)=>a.media-b.media).map(variant=>variant.rule).join('')}\n`);
console.log(`Built assets/utilities.css: ${containers.length + base.length + variants.length} utility rules from ${classes.size} class tokens.`);
if (unsupported.length) {
  console.error('Unsupported utility classes: ' + unsupported.join(', '));
  process.exitCode = 1;
}
