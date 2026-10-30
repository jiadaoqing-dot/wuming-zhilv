# 把 src/parts/*(按序号拼成完整源码,见 tools/srcparts.py)+ assets/* 拼成单文件游戏,并生成 CODEMAP.txt(每个分块文件里的函数 / 全局对象 → 行号)
# 用法:python3 tools/build.py [输出路径,默认 out/无名之旅_v版本.html,版本号取源码里的 GAMEV]
# 默认输出时会删掉 out/ 里旧版本的 无名之旅*.html,并生成 GitHub Pages 分享版(第四十四轮:代码和素材分开):
#   根目录 index.html = 同一份游戏,但图片 / 音频 / 字体不内嵌,改成引用 assets/ 里的文件(每次发版 git 只多存约 1 MB 代码,素材没变就不重复存)
import re,sys,os,base64
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,D+'/tools');import srcparts
src,SPANS=srcparts.load()
MIME={'A':('png','image/png'),'J':('jpg','image/jpeg'),'F':('woff2','font/woff2'),'O':('ogg','audio/ogg')}
def inline(m):e,mt=MIME[m.group(1)];return f'data:{mt};base64,'+base64.b64encode(open(f'{D}/assets/{m.group(2)}.{e}','rb').read()).decode()
# 分享版的素材地址带上内容哈希(?v=…):素材换了内容但文件名不变时(第七十轮:主城新 BGM、拳套图标、字体),浏览器缓存不会继续用旧文件
import hashlib
def link(m):f=f'assets/{m.group(2)}.{MIME[m.group(1)][0]}';return f+'?v='+hashlib.md5(open(D+'/'+f,'rb').read()).hexdigest()[:8]
PH=r'@@([AJFO]):([\w$]+)@@'
out=re.sub(PH,inline,src)
# 像素字体是按源码用字裁剪的:源码里出现了字体里没有的字就提醒(要重新运行 art_src/font/build_font.py)
if os.path.exists(D+'/art_src/font/chars.txt'):
    miss=sorted(set(c for c in re.sub(r'/\*NOFONT\{\*/.*?/\*\}NOFONT\*/','',src,flags=re.S) if ord(c)>=0x20)-set(open(D+'/art_src/font/chars.txt',encoding='utf8').read()))
    if miss:print('提醒:像素字体缺这些字,请重新运行 art_src/font/build_font.py:',''.join(miss))
GV=re.search(r"const GAMEV='([\w.]+)'",src).group(1)
TT=lambda s:s.replace('<title>无名之旅</title>','<title>无名之旅 v'+GV+'</title>',1)
out=TT(out)
if len(sys.argv)>1:dst=sys.argv[1]
else:
    dst=D+'/out/无名之旅_v'+GV+'.html';os.makedirs(D+'/out',exist_ok=True)
    for f in os.listdir(D+'/out'):
        if f.startswith('无名之旅') and f.endswith('.html') and D+'/out/'+f!=dst:os.remove(D+'/out/'+f)
    open(D+'/index.html','w',encoding='utf8').write(TT(re.sub(PH,link,src)))
os.makedirs(os.path.dirname(dst),exist_ok=True);open(dst,'w',encoding='utf8').write(out)
# 代码地图:按分块文件列出顶层 function / const / let 定义(行号 = 该文件里的行号),带上一行的注释(作为说明)
L=src.split('\n');cm=[];last=None
for i,l in enumerate(L):
    f,ln=srcparts.loc(SPANS,i)
    if f!=last:cm.append(f'== src/parts/{f}');last=f
    if l.startswith('// =====') and len(l.strip('/= '))>2:cm.append(f'{ln:5d}  ■ {l.strip("/= ")[:80]}');continue
    m=re.match(r'(?:async )?function ([\w$]+)\(|(?:const|let|var) ([\w$]+)\s*=\s*[\[{(]',l)
    if m:
        n=m.group(1) or m.group(2);c=L[i-1].strip() if i and L[i-1].strip().startswith('//') else ''
        cm.append(f'{ln:5d}  {n:18s} {c[2:].strip()[:70]}')
open(D+'/CODEMAP.txt','w',encoding='utf8').write('源码代码地图(build.py 自动生成):源码分成 src/parts/ 下的小文件,「== 文件名」下面是该文件里的定义,行号 = 该文件里的行号\n'+'\n'.join(cm)+'\n')
# 素材清单:docs/素材清单.txt(assets 引用 / 生成脚本)+ docs/原始素材索引.txt(raw 目录摘要),见 tools/assets_index.py
import assets_index;na,nu=assets_index.main(src,SPANS)
print('built',dst,len(out.encode()),'codemap',len(cm),'assets',na,'unused',nu)
