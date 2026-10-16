# 源码分块(第四十四轮,用户同意):src/parts/ 下几十个小文件按文件名顺序拼起来 = 完整的游戏源码(原来的 src/game.src.html)
#   000_页面与样式.html(HTML 头 + CSS + <script>)… 各系统 / 各关卡 / 各首领一个 .js … 最后一个 .html(</script></body></html>)
#   .js 只是同一个 <script> 里的片段(不是模块),全部共用全局变量;拼接时原样相连,不加任何东西
# 用法:
#   python tools/srcparts.py join [输出路径]   拼成一个完整源码(默认 out/game.src.html,只给人看 / 对比用,构建不需要)
#   python tools/srcparts.py split <完整源码>  按下面的规则重新切块(会清空 src/parts/;tools/split.py 拆单文件后用)
# 规则:在「// =====」小节标题处切开,另外在 ANCHOR 里这些大函数前切开(update / draw / 设置页…),太小的块(< MINK)并进下一块;
# 文件名 = 三位序号(间隔 10,中间可以插新文件)+ 小节标题的前几个字。新加系统 / 关卡时:新建一个文件,序号放在相邻两块之间即可
import os,re,sys,glob
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PD=os.path.join(D,'src','parts')
def files():return sorted((f for f in os.listdir(PD) if re.match(r'\d{3,}_.*\.(js|html)$',f)),key=lambda f:(int(f.split('_')[0]),f))
def load():
    """返回 (完整源码, spans);spans = [(文件名, 起始行号 0 起, 行数)]"""
    txt=[];spans=[];n=0
    for f in files():
        s=open(os.path.join(PD,f),encoding='utf8',newline='').read();txt.append(s)
        k=s.count('\n');spans.append((f,n,k));n+=k
    return ''.join(txt),spans
def loc(spans,i):
    """完整源码第 i 行(0 起)→ (文件名, 文件里的行号 1 起)"""
    for f,a,k in spans:
        if a<=i<a+k:return f,i-a+1
    return spans[-1][0],i-spans[-1][1]+1
# 额外切点:大函数 / 大表(名字 → 文件名里的中文)
ANCHOR={'function update(dt)':'主循环update','function draw()':'绘制draw','function init(full)':'进关卡init','function rSet()':'设置页','function mallAct(':'商城操作',
        'function rGM(':'GM面板','const KM=':'键盘输入','function loop(':'游戏循环','function renderBag(':'背包界面','function hamNew(':'宠物仓鼠','const MAPS=':'关卡表与进关',
        'const MVK=':'小怪招式表','function dealt(':'伤害结算dealt','function useSk(':'放技能useSk','function skStep(':'技能推进skStep','function hud(':'HUD',
        'function hurt(':'主角受伤hurt','const C15B=':'第十二关永夜王城','function cvClick(':'画布点击','const SET=':'设置存储','function toggleBag(':'背包开关',
        'function rSpr(':'精灵宠物界面','const NPCS=':'主城NPC','function mageStep(':'第二三关首领','function lvUp(':'升级','function rShop(':'商店',
        'function rPot(':'药剂师','function rForge(':'熔炉强化界面','const EXPT=':'经验表','function strike(':'普攻strike','function threat(':'首领闪避',
        'function save(':'存档','const GAMEV=':'核心常量'}
MINK=2500
BAD=re.compile(r'[\\/:*?"<>|\s·・,,、()()「」『』《》:;;!!??—–\~~+=-]+')
def anchor(l):
    for a,n in ANCHOR.items():
        if l.startswith(a):return n
def title(l):
    t=l.strip('/= ').strip().replace('~','至')
    t=re.sub(r'^第[一二三四五六七八九十]+轮\s*([((][^))]*[))])?\s*[::]?\s*','',t)
    t=re.split(r'[:(:(,,;;—/]|(?<=\S) ·',t)[0]
    t=BAD.sub('',t)[:14] or 'part'
    return {'加中文像素字体FusionP':'像素界面与字体','怪物':'怪物首领特效BFX'}.get(t,t)
def isHead(l):return l.startswith('// =====') and len(l.strip('/= '))>2
def plan(src):
    L=src.split('\n');cut=[]
    for i,l in enumerate(L):
        if isHead(l):cut.append(i)
        elif anchor(l):
            j=i  # 把紧挨着的上方注释一起带走
            while j>0 and L[j-1].startswith('//') and not isHead(L[j-1]):j-=1
            cut.append(j)
    s0=next(i for i,l in enumerate(L) if l.strip()=='<script>')+1;e0=next(i for i in range(len(L)-1,-1,-1) if L[i].strip()=='</script>')
    cut=sorted(set(c for c in cut if s0<c<e0))
    b=[0,s0]+cut+[e0,len(L)];ch=[]
    for k in range(len(b)-1):
        a,z=b[k],b[k+1]
        if z>a:ch.append([a,z])
    # 太小的并进下一块(第一块 / 最后一块是 HTML,不合并)
    sz=lambda c:sum(len(x)+1 for x in L[c[0]:c[1]])
    out=[ch[0]];i=1
    while i<len(ch)-1:
        c=ch[i]
        while sz(c)<MINK and i+1<len(ch)-1:i+=1;c=[c[0],ch[i][1]]
        out.append(c);i+=1
    out.append(ch[-1])
    return L,out
def name_of(L,c,k,n):
    if k==0:return '000_页面与样式.html'
    if k==n-1:return f'{k*10:03d}_结尾.html'
    # 标题:块里最大的一个小节(小节标题 / ANCHOR 切点)的名字
    sub=[]
    for i in range(c[0],c[1]):
        l=L[i];n=anchor(l) or (title(l) if isHead(l) else None)
        if n:sub.append((i,n))
    if not sub:return f'{k*10:03d}_part.js'
    sz=lambda a,b:sum(len(x)+1 for x in L[a:b])
    best=max(range(len(sub)),key=lambda j:sz(sub[j][0],sub[j+1][0] if j+1<len(sub) else c[1]))
    return f'{k*10:03d}_{sub[best][1]}.js'
def split(src,write=True):
    L,ch=plan(src);n=len(ch);names=[];seen=set()
    for k,c in enumerate(ch):
        nm=name_of(L,c,k,n)
        while nm in seen:nm=nm.replace('.js','_2.js')
        seen.add(nm);names.append(nm)
    if write:
        os.makedirs(PD,exist_ok=True)
        for f in glob.glob(os.path.join(PD,'*')):os.remove(f)
        for nm,c in zip(names,ch):
            part='\n'.join(L[c[0]:c[1]])+('\n' if c[1]<len(L) else '')
            open(os.path.join(PD,nm),'w',encoding='utf8',newline='').write(part)
    return [(nm,c[0]+1,c[1]-c[0],sum(len(x)+1 for x in L[c[0]:c[1]])) for nm,c in zip(names,ch)]
if __name__=='__main__':
    a=sys.argv[1:] or ['join']
    if a[0]=='join':
        s,_=load();dst=a[1] if len(a)>1 else os.path.join(D,'out','game.src.html');os.makedirs(os.path.dirname(dst),exist_ok=True)
        open(dst,'w',encoding='utf8',newline='').write(s);print('joined',dst,len(s))
    elif a[0] in('split','plan'):
        src=open(a[1],encoding='utf8',newline='').read()
        for r in split(src,a[0]=='split'):print(f'{r[0]:40s} 第{r[1]:5d}行起 {r[2]:5d}行 {r[3]//1024:4d}K')
