import fs from 'node:fs/promises';
import postcss from 'postcss';
const root = postcss.parse(await fs.readFile('src/style.css', 'utf8'));
const key = rule => rule.selector?.replace(/\s+/g, ' ').trim();
const base = selector => root.nodes.filter(n => n.type === 'rule' && key(n) === selector);
const removeProps = (rule, props) => rule.walkDecls(d => { if (props.includes(d.prop)) d.remove(); });
const set = (rule, values) => {
  for (const [prop, value] of Object.entries(values)) {
    removeProps(rule, [prop]);
    rule.append({ prop, value });
  }
};
for (const selector of ['.primary', '.secondary', '.publication-mark i', '.publication-mark>span', 'footer>a:last-child']) base(selector).forEach(r => r.remove());
base('.button:hover')[0].remove();
removeProps(base('.button')[0], ['border-radius', 'font-weight', 'transition']);
removeProps(base('.nav-contact')[0], ['border', 'border-radius', 'color', 'background', 'box-shadow']);
// These final values formerly lived after the responsive rules.
for (const selector of ['.filters', '.filters button', '.filters button.active', '.writing-panel', 'footer']) {
  const [first, ...later] = base(selector);
  for (const rule of later) {
    for (const d of [...rule.nodes]) { removeProps(first, [d.prop]); first.append(d.clone()); }
    rule.remove();
  }
}
set(base('.filters')[0], {border: '1px solid #223144'});
removeProps(base('.filters')[0], ['border-color']);
// Hover must remain after active: equal-specificity hover wins on active filters.
base('.filters button:hover')[0].remove();
const [oldCover, cover] = base('.publication-mark');
set(cover, {'justify-content': 'space-between'}); oldCover.remove();
base('.publication-mark strong')[0].remove();
root.walkAtRules('media', media => {
  if (media.params === '(max-width: 700px)') {
    for (const rule of [...media.nodes]) {
      if (key(rule) === '.menu-toggle') removeProps(rule, ['background', 'border', 'border-radius', 'color']);
      if (key(rule) === 'footer') removeProps(rule, ['flex-wrap', 'gap']);
      if (key(rule) === '.publication-mark strong' && rule.nodes[0].value === '37px') rule.remove();
      if (key(rule) === '.publication-mark .book-system') removeProps(rule, ['font-size']);
      if (key(rule) === '.book-subtitle' || key(rule) === '.section-heading>p' || key(rule) === '.journey-type') rule.remove();
    }
  }
});
// The terminal paragraph needs specificity, not !important, for its font size.
const terminalBottom = base('.terminal-bottom')[0];
terminalBottom.selector = '.terminal-content .terminal-bottom';
terminalBottom.walkDecls(d => {d.important = false});
// Collect media rules in their existing per-breakpoint order.
const mediaGroups = new Map();
const keyframes = [];
for (const node of [...root.nodes]) {
  if (node.type === 'comment') node.remove();
  if (node.type === 'atrule' && node.name === 'media') {
    const group = mediaGroups.get(node.params) || [];
    group.push(...node.nodes.map(n => n.clone()));
    mediaGroups.set(node.params, group); node.remove();
  }
  if (node.type === 'atrule' && node.name === 'keyframes') {keyframes.push(node);node.remove();}
}
for (const [params, rules] of mediaGroups) {
  const seen = new Map();
  for (const rule of rules) {
    const previous = seen.get(key(rule));
    if (previous) {
      for (const d of [...rule.nodes]) {removeProps(previous,[d.prop]);previous.append(d.clone());}
    } else seen.set(key(rule), rule);
  }
  mediaGroups.set(params, [...seen.values()]);
}
// Shared tokens only for exact repeated values; distinct shades stay distinct.
const tokens = {'--font-sans':'Arial, Helvetica, sans-serif','--font-mono':"'Courier New', monospace",'--page-background':'#080c13','--link-hover':'#70c6ff','--bevo-divider':'#257ab0','--bevo-chrome':'linear-gradient(90deg, #091522, #17110d)'};
root.walkDecls(d=>{
  for(const [name,value] of Object.entries(tokens)) d.value=d.value.replaceAll(value,`var(${name})`);
});
for(const rules of mediaGroups.values())for(const rule of rules)rule.walkDecls(d=>{
  for(const [name,value] of Object.entries(tokens))d.value=d.value.replaceAll(value,`var(${name})`);
});
for(const [prop,value] of Object.entries(tokens).reverse())base(':root')[0].prepend({prop,value});
// Keep foundational and shared selectors first; then group independent page sections.
const sections = new Map([
  ['Foundations and shared typography',[]],['Header and navigation',[]],['Shared buttons and interaction states',[]],['Hero and workstation terminal',[]],['Interest strip',[]],['Section headings',[]],['Selected work and project filters',[]],['About',[]],['Academics and ASCII Bevo',[]],['Journey',[]],['Publication and book cover',[]],['Contact',[]],['Footer',[]]
]);
for(const rule of [...root.nodes]) {
 const s=key(rule);let section='Foundations and shared typography';
 if(s.includes('.button')||s.startsWith('.nav-contact')||s.startsWith('.menu-toggle'))section='Shared buttons and interaction states';
 else if(s==='.header'||s.startsWith('.brand')||s.startsWith('nav'))section='Header and navigation';
 else if(/^\.(hero|cursor|machine|screw|terminal|window|prompt|system-map|map-|orbit|node-|cross-|vents)/.test(s))section='Hero and workstation terminal';
 else if(s.startsWith('.interest-strip'))section='Interest strip';
 else if(s.startsWith('.section'))section='Section headings';
 else if(/^\.(filters|project|tags)/.test(s))section='Selected work and project filters';
 else if(/^\.(about|badge|philosophy)/.test(s))section='About';
 else if(/^\.(academic|bevo|frame-|paused)/.test(s))section='Academics and ASCII Bevo';
 else if(s.startsWith('.journey'))section='Journey';
 else if(/^\.(writing|publication|book)/.test(s))section='Publication and book cover';
 else if(s.startsWith('.connect')||s.startsWith('.contact'))section='Contact';
 else if(s.startsWith('footer')||s.startsWith('.footer'))section='Footer';
 // This combined rule is shared typography; do not move it to the hero section.
 if(s.startsWith('.eyebrow,')||s==='.header, main, footer')section='Foundations and shared typography';
 sections.get(section).push(rule);rule.remove();
}
for(const [title,rules] of sections){root.append(postcss.comment({text:title}));root.append(rules)}
root.append(postcss.comment({text:'Animation keyframes'}));root.append(keyframes);
root.append(postcss.comment({text:'Responsive layouts — retain the original 1500, 1300, 950, and 700px breakpoints'}));
for(const params of ['(min-width: 1500px)','(max-width: 1300px)','(max-width: 950px)','(max-width: 700px)','(prefers-reduced-motion: reduce)']) {
 if(params.includes('reduced-motion'))root.append(postcss.comment({text:'Reduced motion — keep the first Bevo frame visible and hide its pause control'}));
 root.append(postcss.atRule({name:'media',params,nodes:mediaGroups.get(params)}));
}
function format(container, depth=0){
 const indent='  '.repeat(depth);
 container.nodes?.forEach((node,index)=>{
  node.raws.before=index===0&&depth===0?'':'\n'+(index>0&&node.type!=='decl'?'\n':'')+indent;
  if(node.type==='decl'){node.raws.between=': ';if(!node.important)delete node.raws.important;}
  else if(node.type==='comment'){node.raws.left=' ';node.raws.right=' ';}
  else if(node.nodes){node.raws.between=' ';node.raws.after='\n'+indent;node.raws.semicolon=true;if(node.type==='atrule')node.raws.afterName=' ';format(node,depth+1);}
  if(node.type==='rule')node.selector=postcss.list.comma(node.selector).map(s=>s.replace(/\s*>\s*/g,' > ')).join(',\n'+indent);
 });
}
format(root);root.raws.after='\n';
await fs.writeFile('src/style.css',root.toString());
console.log('Consolidated CSS and grouped sections and media queries.');
