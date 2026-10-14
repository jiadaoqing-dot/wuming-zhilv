# 像素 HUD / 技能栏 / 名牌 / 通关面板 图集(模块 PUI):Tiny RPG - Mana Soul GUI(tiopalada,CC0,https://opengameart.org/content/tiny-rpg-mana-soul-gui)
# 改动:挑选 9 宫格面板 A / C、标签 D / G、血条框 A / B / C、按钮 A、菱形格、羊皮纸标题 A,拼成一张图集;原图不改色
# 用法:python art_src/ui/build_pui.py <tinyrpg_manasoulgui_v_1_0 目录> <输出 png>
# 输出:打印 meta(JSON,{名字:[x,y,w,h]}),贴进 src 里的 PUI.M
import sys,json,glob,os
from PIL import Image
S,OUT=sys.argv[1],sys.argv[2]
def ld(n):return Image.open(glob.glob(os.path.join(S,f'*{n}-Sheet.png'))[0]).convert('RGBA')
P={}   # 名字 → 图
P['pA']=ld('manaSoul9SlicesA');P['pC']=ld('manaSoul9SlicesC')
# 标签图的各帧不是按 96 对齐的(按整列透明分段量出来的范围)
for i,(a,b) in enumerate([(10,90),(106,192),(199,286),(298,377)]):P[f'tD{i}']=ld('manaTabD').crop((a,0,b,32))
for i,(a,b) in enumerate([(0,90),(96,192),(200,286),(288,376)]):P[f'tG{i}']=ld('manaTabG').crop((a,0,b,32))
P['bA']=ld('barA');P['bB']=ld('barB');P['bC']=ld('barC')
for i in range(4):P[f'btn{i}']=ld('manaSoulButtonA').crop((i*96,0,i*96+96,22))
for i in range(5):P[f'dia{i}']=ld('emptyFrame').crop((i*32,0,i*32+32,32))
P['hdr']=ld('manaSoulHeaderA')
for i in range(5):P[f'cur{i}']=ld('verticalCursorB').crop((i*13,0,i*13+13,37))
for i in range(5):P[f'hc{i}']=ld('horizontalCursorB').crop((i*37,0,i*37+37,14))   # 横向羽毛指针(通关面板选中按钮)
P={k:im.crop(im.getbbox()) for k,im in P.items()}   # 每块裁掉透明边
# 简单装箱:按高度从大到小排,一行一行放
W=400;x=y=rh=0;M={};items=sorted(P.items(),key=lambda kv:-kv[1].height);pos=[]
for k,im in items:
  if x+im.width>W:x=0;y+=rh+1;rh=0
  pos.append((k,im,x,y));M[k]=[x,y,im.width,im.height];x+=im.width+1;rh=max(rh,im.height)
o=Image.new('RGBA',(W,y+rh));[o.alpha_composite(im,(px,py)) for k,im,px,py in pos]
o.save(OUT,optimize=True);print(json.dumps(M,separators=(',',':')))
