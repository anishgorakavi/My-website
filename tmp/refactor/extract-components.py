from pathlib import Path
import re, textwrap, json
src=Path('tmp/refactor/before.jsx').read_text()
components=Path('src/components'); components.mkdir(exist_ok=True)
data=Path('src/data'); data.mkdir(exist_ok=True)

def extract(start,end):
    a=src.index(start); b=src.index(end,a)+len(end);return src[a:b]

def pretty_jsx(s,depth=2):
    tokens=[];i=0
    while i<len(s):
        if s[i]=='<':
            j=i+1; braces=0; quote=None
            while j<len(s):
                c=s[j]
                if quote:
                    if c=='\\':j+=2;continue
                    if c==quote:quote=None
                elif c in '\"\'':quote=c
                elif c=='{':braces+=1
                elif c=='}':braces-=1
                elif c=='>' and braces==0:break
                j+=1
            tokens.append(('tag',s[i:j+1]));i=j+1
        elif s[i]=='{':
            j=i+1;level=1;quote=None
            while level:
                c=s[j]
                if quote:
                    if c=='\\':j+=2;continue
                    if c==quote:quote=None
                elif c in '\"\'`':quote=c
                elif c=='{':level+=1
                elif c=='}':level-=1
                j+=1
            tokens.append(('expr',s[i:j]));i=j
        else:
            j=i
            while j<len(s) and s[j] not in '<{':j+=1
            tokens.append(('text',s[i:j]));i=j
    lines=[]
    for kind,value in tokens:
        if kind=='tag':
            if value.startswith('</'):depth-=1
            value=re.sub(r'(?<! )/>',' />',value)
            lines.append('  '*depth+value)
            if not value.startswith('</') and not value.endswith('/>'):depth+=1
        elif kind=='expr':lines.append('  '*depth+value)
        else:
            if not value.strip():
                # Whitespace from existing source line breaks never rendered.
                if '\n' not in value and value:lines.append('  '*depth+"{' '}")
                continue
            leading=value.startswith(' ');trailing=value.endswith(' ')
            if leading:lines.append('  '*depth+"{' '}")
            lines.extend('  '*depth+l for l in textwrap.wrap(value.strip(),width=max(60,100-depth*2)))
            if trailing:lines.append('  '*depth+"{' '}")
    return '\n'.join(lines)

def component(name,jsx,imports='',extra=''):
    (components/(name+'.jsx')).write_text(imports+('\n' if imports else '')+'export default function '+name+'() {\n  return (\n'+pretty_jsx(jsx)+'\n  );\n}\n'+extra)

(data/'links.js').write_text("export const github = 'https://github.com/anishgorakavi/';\nexport const email = 'anish.gorakavi@my.utexas.edu';\nexport const linkedin = 'https://www.linkedin.com/in/anish-gorakavi-0a3390104';\nexport const amazonBook = 'https://www.amazon.com/dp/B0FH1SCD16';\n")
projects=extract('const projects = [','\n];').replace('const projects','export const projects')
(data/'projects.js').write_text(projects+'\n')
frames=json.loads(extract('const bevoFrames = [','];')[len('const bevoFrames = '):-1])
(data/'bevoFrames.js').write_text('// Keep each frame’s spaces and line breaks: the animation uses fixed-width text.\nexport const bevoFrames = [\n'+',\n'.join('  String.raw`'+f+'`' for f in frames)+'\n];\n')
hero=extract('<section className="hero"','</section>')
terminal=hero[hero.index('<div className="hero-machine"'):-len('</section>')]
hero=hero.replace(terminal,'<HeroTerminal />')
component('Hero',hero,"import { linkedin } from '../data/links.js';\nimport { Arrow } from './Shared.jsx';", '\nfunction HeroTerminal() {\n  return (\n'+pretty_jsx(terminal)+'\n  );\n}\n\nexport function InterestStrip() {\n  return (\n'+pretty_jsx(extract('<div className="interest-strip"','</div>'))+'\n  );\n}\n')
component('AboutSection',extract('<section id="about"','</section>'),"import { SectionLabel } from './Shared.jsx';")
component('AcademicSection',extract('<section id="academics"','</section>').split("  <div className={'bevo-terminal'")[0]+'<BevoTerminal /></section>',"import BevoTerminal from './BevoTerminal.jsx';")
component('PublicationSection',extract('<section id="writing"','</section>').replace('href="https://www.amazon.com/dp/B0FH1SCD16"','href={amazonBook}'),"import { amazonBook } from '../data/links.js';\nimport { Arrow, SectionLabel } from './Shared.jsx';")
component('ContactSection',extract('<section id="connect"','</section>').replace('{"mailto:"+email}', '{`mailto:${email}`}'),"import { email, github, linkedin } from '../data/links.js';\nimport { Arrow } from './Shared.jsx';")
footer=extract('<footer>','</footer>');footer=re.sub(r'<a className="brand".*?</a>','<Brand />',footer, count=1).replace('{"mailto:"+email}', '{`mailto:${email}`}')
component('Footer',footer,"import { email, github, linkedin } from '../data/links.js';\nimport { Brand } from './Shared.jsx';")
journey=extract('<section id="journey"','</section>')
pattern=r'<div className="journey-row"><span className="journey-type">(.*?)</span><h3>(.*?)</h3><div><h4>(.*?)</h4><p>(.*?)</p></div></div>'
journey=re.sub(pattern,lambda m:f'<JourneyEntry type="{m[1]}" title="{m[2]}" role="{m[3]}">{m[4]}</JourneyEntry>',journey)
component('JourneySection',journey,"import { SectionLabel } from './Shared.jsx';",'\nfunction JourneyEntry({ type, title, role, children }) {\n  return (\n'+pretty_jsx('<div className="journey-row"><span className="journey-type">{type}</span><h3>{title}</h3><div><h4>{role}</h4><p>{children}</p></div></div>')+'\n  );\n}\n')
