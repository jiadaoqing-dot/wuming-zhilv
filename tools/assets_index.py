# 生成两份素材清单(build.py 每次构建时自动调用,也可以单独运行:python tools/assets_index.py)
#   docs/素材清单.txt     assets/ 里每个文件:大小、源码哪一行引用(所在函数 / 对象)、由哪个 art_src 脚本生成;没被引用的单独列出;
#                         最后附各 art_src 生成脚本开头的说明(素材来源、作者、授权)
#   docs/原始素材索引.txt raw/ 里每个素材包的目录结构摘要(文件名按「前缀 + 编号」合并)、zip、被哪个 art_src 脚本用到
# 目的:找素材 / 换素材时先读这两份文件,不用再列目录、不用打开图片或音频
import os,re,glob,collections
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J=lambda *p:os.path.join(D,*p)
rel=lambda p:os.path.relpath(p,D).replace('\\','/')
def kb(n):return f'{n/1024:.0f}KB' if n<1024*1024 else f'{n/1048576:.1f}MB'
EXT={'A':'png','O':'ogg','J':'jpg','F':'woff2'}

def scripts():
    S={}
    for p in sorted(glob.glob(J('art_src','**','*.py'),recursive=True)):
        try:S[rel(p)]=open(p,encoding='utf8').read()
        except Exception:pass
    return S

def header(t):  # 脚本开头连续的注释行
    out=[]
    for l in t.split('\n'):
        s=l.strip()
        if s.startswith('#'):out.append(s.lstrip('#').strip())
        elif s=='' and not out:continue
        else:break
    return out

# 没有生成脚本的素材(早期手工处理),按文件名前缀写来源;新增这类素材时在这里补一行
NOTE={'ars_':'无脚本:Hero spritesheets - Ars Notoria(Balmer,CC0)换色分层,旧主角选项,见源码 PXA 注释',
      'npc_':'无脚本:PXA 早期 NPC 像素图(来源见源码 PXA 注释)'}
def asset_list(src,S):
    L=src.split('\n')
    # 每行所在的顶层定义(和 CODEMAP 同一规则)
    defs=[];cur='';
    for i,l in enumerate(L):
        m=re.match(r'(?:async )?function ([\w$]+)\(|(?:const|let|var) ([\w$]+)\s*=',l)
        if m:cur=m.group(1) or m.group(2)
        defs.append(cur)
    refs=collections.defaultdict(list)
    for i,l in enumerate(L):
        for m in re.finditer(r'@@([AOJF]):([\w$]+)@@',l):
            pre=l[max(0,m.start()-60):m.start()]
            km=re.search(r"([\w$]+)\s*:\s*['\"`]?$",pre)
            refs[(m.group(2),m.group(1))].append(f'L{i+1} {defs[i]}'+(f'.{km.group(1)}' if km else ''))
    # 生成脚本:在脚本里找文件名(音频按去掉 au_ 的键名找)
    def gen(name,t):
        hit=[p for p,s in S.items() if name+'.'+EXT[t] in s or f"'{name}'" in s or f'"{name}"' in s]
        if not hit:
            for k,v in NOTE.items():
                if name.startswith(k):return [v]
        if not hit and name.startswith('au_'):
            k=name[3:];hit=[p for p,s in S.items() if f"'{k}'" in s]
        if not hit:  # 文件名是拼出来的(如 ltl%d.png):找去掉数字后的前缀
            b=re.sub(r'\d+$','',name)
            if b!=name:hit=[p for p,s in S.items() if b in s]
        if not hit:  # 源码引用处往上 12 行内的注释写了生成脚本
            for r in refs[(name,t)][:1]:
                i=int(r.split()[0][1:])-1
                for l in reversed(L[max(0,i-12):i+1]):
                    m=re.search(r'art_src/[\w/]+\.py',l)
                    if m:hit=[m.group(0)];break
        if not hit:  # 输出路径是命令行参数:按前缀找同名脚本(kb_atlas → build_kb.py)
            b=re.split(r'[_\d]',name)[0].lower()
            hit=[p for p in S if re.search(r'/(build_)?'+re.escape(b)+r'\w*\.py$',p)]
        return hit
    # 音频:从 build_audio.py 里取这个键用到的素材路径
    au=S.get('art_src/audio/build_audio.py','')
    def ausrc(k):
        m=re.search(r"\n\s*'"+re.escape(k)+r"'\s*:(.*)",au)
        if not m:return ''
        fs=re.findall(r"'([^']+\.(?:wav|ogg|mp3|flac|aif))'",m.group(1))
        fs+=[x for x in re.findall(r"\b(hiss|rattle|scrape|rumble|wind)\(",m.group(1))]
        return ', '.join(dict.fromkeys(os.path.basename(f) for f in fs))
    files={}
    for p in glob.glob(J('assets','*')):
        n,e=os.path.splitext(os.path.basename(p));files[(n,e[1:])]=os.path.getsize(p)
    out=['assets/ 素材清单(tools/assets_index.py 自动生成,build.py 每次构建时更新;不要手改)',
         '格式:文件  大小  源码引用(行号 所在函数/对象.键)  ← 生成脚本  [音频:用到的原始素材]','']
    used=set()
    for t,title in [('A','图片 PNG(@@A:)'),('J','图片 JPEG(@@J:)'),('F','字体(@@F:)'),('O','音频 OGG(@@O:)')]:
        ks=sorted(k for k in refs if k[1]==t);out.append(f'== {title}  {len(ks)} 个 ==')
        for n,_ in ks:
            e=EXT[t];used.add((n,e));sz=files.get((n,e))
            g=gen(n,t);r=refs[(n,t)]
            line=f'{n}.{e}  {kb(sz) if sz is not None else "缺文件!"}  {"; ".join(r[:3])}{" …" if len(r)>3 else ""}  ← {", ".join(g) if g else "?"}'
            if t=='O':
                s=ausrc(n[3:]);line+=f'  [{s}]' if s else ''
            out.append(line)
        out.append('')
    un=sorted(k for k in files if k not in used)
    out.append(f'== 没被源码引用的文件 {len(un)} 个(可能是生成脚本的中间产物,或可以删)==')
    out+= [f'{n}.{e}  {kb(files[(n,e)])}  ← {", ".join(gen(n,"A" if e=="png" else "O" if e=="ogg" else "J")) or "?"}' for n,e in un]
    out+=['','== art_src 各生成脚本的说明(脚本开头注释:素材来源 / 作者 / 授权 / 用法)==']
    for p,s in S.items():
        h=header(s)
        if h:out.append(f'-- {p}');out+=['   '+x for x in h]
    open(J('docs','素材清单.txt'),'w',encoding='utf8').write('\n'.join(out)+'\n')
    return len(refs),len(un)

def squash(names):  # bug_01 bug_02 bug_03 → bug_01~03
    g=collections.OrderedDict()
    for n in sorted(names):
        m=re.match(r'^(.*?)(\d+)(\.\w+)$',n)
        key=(m.group(1),m.group(3)) if m else (n,'')
        g.setdefault(key,[]).append(m.group(2) if m else None)
    out=[]
    for (a,e),v in g.items():
        if v[0] is None:out.append(a)
        elif len(v)==1:out.append(f'{a}{v[0]}{e}')
        else:out.append(f'{a}{v[0]}~{v[-1]}{e}')
    return out

# raw 里通过命令行参数传给脚本的目录(脚本里找不到目录名),手写对应关系
RAWN={'font':'art_src/font/build_font.py(参数)','town_chick':'art_src/town/build_tpx.py(参数)','ui':'art_src/ui/build_pui.py(参数)'}
def raw_index(S):
    R=J('raw');out=['raw/ 原始素材索引(tools/assets_index.py 自动生成;不打包进游戏)',
        '每个目录:文件数、文件名摘要(编号合并);「用到」= 哪个 art_src 脚本引用了这个目录。作者 / 授权见 docs/素材清单.txt 末尾的脚本说明','']
    skip=lambda n:n.startswith('.') or n=='__MACOSX' or n.lower() in('thumbs.db','desktop.ini')
    for top in sorted(os.listdir(R)):
        tp=os.path.join(R,top)
        if skip(top):continue
        if os.path.isfile(tp):out.append(f'{top}  {kb(os.path.getsize(tp))}');continue
        out.append(f'## raw/{top}')
        for dp,dn,fn in os.walk(tp):
            dn[:]=sorted(d for d in dn if not skip(d));fn=[f for f in fn if not skip(f)]
            if not fn:continue
            r=rel(dp)[4:]  # 去掉 raw/
            us=set()
            for c in reversed(r.split('/')[1:]):  # 脚本里的路径是拼出来的:从最深一级目录名往上找,找到就算用到
                if len(c)>=4:us={p for p,t in S.items() if c in t}
                if us:break
            if not us:us={p for p,t in S.items() if 'raw/'+r in t or any(f in t for f in fn if len(f)>=6)}
            if not us and r.split('/')[0] in RAWN:us={RAWN[r.split('/')[0]]}
            us=sorted(us)
            zips=[f for f in fn if f.lower().endswith('.zip')];oth=[f for f in fn if f not in zips]
            sz=sum(os.path.getsize(os.path.join(dp,f)) for f in fn)
            line=f'  {r}/  {len(fn)} 个 {kb(sz)}'+(f'  用到:{", ".join(us)}' if us else '')
            out.append(line)
            if zips:out.append('    zip: '+', '.join(f'{z}({kb(os.path.getsize(os.path.join(dp,z)))})' for z in zips))
            sq=squash(oth)
            if sq:
                s=', '.join(sq)
                out.append('    '+(s if len(s)<=600 else s[:600]+f' …(共 {len(sq)} 组)'))
        out.append('')
    open(J('docs','原始素材索引.txt'),'w',encoding='utf8').write('\n'.join(out)+'\n')

def main(src=None):
    src=src or open(J('src','game.src.html'),encoding='utf8').read()
    S=scripts();n,u=asset_list(src,S);raw_index(S)
    return n,u
if __name__=='__main__':print('assets index',*main())
