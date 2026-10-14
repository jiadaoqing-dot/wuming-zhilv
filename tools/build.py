# 把 src/game.src.html + assets/*.png 拼回单文件游戏,并生成 CODEMAP.txt(函数 / 全局对象 → 行号)
# 用法:python3 tools/build.py [输出路径,默认 out/无名之旅_v版本.html,版本号取源码里的 GAMEV]
# 默认输出时会删掉 out/ 里旧版本的 无名之旅*.html,并复制一份到仓库根目录 index.html(GitHub Pages 分享链接用)
import re,sys,os,base64
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src=open(D+'/src/game.src.html',encoding='utf8').read()
def sub(m):return 'data:image/png;base64,'+base64.b64encode(open(f'{D}/assets/{m.group(1)}.png','rb').read()).decode()
def subF(m):return 'data:font/woff2;base64,'+base64.b64encode(open(f'{D}/assets/{m.group(1)}.woff2','rb').read()).decode()
def subJ(m):return 'data:image/jpeg;base64,'+base64.b64encode(open(f'{D}/assets/{m.group(1)}.jpg','rb').read()).decode()
def subO(m):return 'data:audio/ogg;base64,'+base64.b64encode(open(f'{D}/assets/{m.group(1)}.ogg','rb').read()).decode()
out=re.sub(r'@@O:([\w$]+)@@',subO,src)
out=re.sub(r'@@J:([\w$]+)@@',subJ,re.sub(r'@@F:([\w$]+)@@',subF,re.sub(r'@@A:([\w$]+)@@',sub,out)))
# 像素字体是按源码用字裁剪的:源码里出现了字体里没有的字就提醒(要重新运行 art_src/font/build_font.py)
if os.path.exists(D+'/art_src/font/chars.txt'):
    miss=sorted(set(c for c in src if ord(c)>=0x20)-set(open(D+'/art_src/font/chars.txt',encoding='utf8').read()))
    if miss:print('提醒:像素字体缺这些字,请重新运行 art_src/font/build_font.py:',''.join(miss))
GV=re.search(r"const GAMEV='([\w.]+)'",src).group(1)
out=out.replace('<title>无名之旅</title>','<title>无名之旅 v'+GV+'</title>',1)
if len(sys.argv)>1:dst=sys.argv[1]
else:
    dst=D+'/out/无名之旅_v'+GV+'.html';os.makedirs(D+'/out',exist_ok=True)
    for f in os.listdir(D+'/out'):
        if f.startswith('无名之旅') and f.endswith('.html') and D+'/out/'+f!=dst:os.remove(D+'/out/'+f)
    open(D+'/index.html','w',encoding='utf8').write(out)
os.makedirs(os.path.dirname(dst),exist_ok=True);open(dst,'w',encoding='utf8').write(out)
# 代码地图:顶层 function / const / let 定义,带上一行的注释(作为说明)
L=src.split('\n');cm=[]
for i,l in enumerate(L):
    if l.startswith('// =====') and len(l.strip('/= '))>2:cm.append(f'{i+1:5d}  ■ {l.strip("/= ")[:80]}');continue
    m=re.match(r'(?:async )?function ([\w$]+)\(|(?:const|let|var) ([\w$]+)\s*=\s*[\[{(]',l)
    if m:
        n=m.group(1) or m.group(2);c=L[i-1].strip() if i and L[i-1].strip().startswith('//') else ''
        cm.append(f'{i+1:5d}  {n:18s} {c[2:].strip()[:70]}')
open(D+'/CODEMAP.txt','w',encoding='utf8').write('源码 src/game.src.html 的代码地图(build.py 自动生成;行号对应源码文件)\n'+'\n'.join(cm)+'\n')
# 素材清单:docs/素材清单.txt(assets 引用 / 生成脚本)+ docs/原始素材索引.txt(raw 目录摘要),见 tools/assets_index.py
sys.path.insert(0,D+'/tools');import assets_index;na,nu=assets_index.main(src)
print('built',dst,len(out.encode()),'codemap',len(cm),'assets',na,'unused',nu)
