# 首领攻击特效第二张图集 BFX2(2026-10-12,替换上一版用 PVFX / Ninja Adventure / Magic Pack 凑的特效)
# 原始素材在 raw/bossfx/:
#  z-rune  地面预警魔法阵:Earth Impact - Magic Effect(Cethiel,CC0)第 2 组第 4 帧的符文圆环 → 缩到 64、换成红色、二值透明,旋转出 8 帧
#  z-rock  巨蜥落石:Floor Effects(hernandack,CC0)里最大的灰石块 → 换成沙岩色、Scale2x
#  s-tor   沙浪:Tornado(devnewton,CC0)6 帧 → 换成沙黄色
#  i-cry0~2 冰刺(北极熊 / 狼人):Freeze Spell(Clint Bellanger,CC-BY 3.0)三种冰晶各 4 帧 → 缩到 40、限色、加深蓝描边
#  p-gey   蝎王毒柱:Pixel FX Pack(CodeManu,CC0)第 5 张(上冲的水柱)→ 换成毒绿色,隔帧取 24 帧
#  w-ring  狼人冲击波:Pixel FX Pack 第 10 张(扩散圆环)→ 换成银蓝色;游戏里竖着压扁成「( )」形的音爆环
# 用法:python art_src/bfx/build_bfx2.py  → assets/bfx2_atlas.png,并打印 meta(贴进源码 BFX2.M)
import os,json,colorsys
from PIL import Image
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));R=D+'/raw/bossfx/'
def scale2x(im):
  w,h=im.size;s=im.load();o=Image.new('RGBA',(w*2,h*2));d=o.load();P=lambda x,y:s[min(w-1,max(0,x)),min(h-1,max(0,y))]
  for y in range(h):
    for x in range(w):
      B,Dd,E,F,H=P(x,y-1),P(x-1,y),P(x,y),P(x+1,y),P(x,y+1);e=[E]*4
      if B!=H and Dd!=F:e=[Dd if Dd==B else E,F if B==F else E,Dd if Dd==H else E,F if H==F else E]
      for k in range(4):d[x*2+k%2,y*2+k//2]=e[k]
  return o
def amap(im,th):  # 透明度二值化
  a=im.split()[3].point(lambda v:255 if v>th else 0);im=im.copy();im.putalpha(a);return im
def recol(im,pal):  # 按亮度映射到调色板(暗 → 亮)
  im=im.convert('RGBA');px=im.load();n=len(pal)
  for y in range(im.height):
    for x in range(im.width):
      r,g,b,a=px[x,y]
      if a:l=(r*.3+g*.59+b*.11)/255;px[x,y]=pal[min(n-1,int(l*n))]+(a,)
  return im
def outline(im,col):
  o=im.copy();s=im.load();d=o.load();w,h=im.size
  for y in range(h):
    for x in range(w):
      if not s[x,y][3] and any(0<=x+dx<w and 0<=y+dy<h and s[x+dx,y+dy][3] for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))):d[x,y]=col+(255,)
  return o
def quant(im,n):
  a=im.split()[3];q=im.convert('RGB').quantize(n,method=Image.Quantize.MEDIANCUT).convert('RGBA');q.putalpha(a);return q
F={}  # 名字 → 帧列表
# 1. 符文圆环
ru=Image.open(R+'earth_impact/2/Earth-Impact_09.png').convert('RGBA');ru=ru.crop(ru.getbbox())
RED=[(110,8,16),(176,18,24),(232,44,36),(255,112,88),(255,196,170)]
fr=[]
for k in range(8):
  r=ru.rotate(k*45/8*2,resample=Image.BICUBIC,expand=False).resize((64,64),Image.LANCZOS)
  # 先把很淡的辉光提亮一点再二值化,让细线条留下来
  r=amap(r,40);fr.append(recol(r,RED))
F['z-rune']=fr
# 2. 落石
fl=Image.open(R+'floors_fx1.png').convert('RGBA');p=fl.load()
for yy in range(fl.height):  # 白底 → 透明
  for xx in range(fl.width):
    if p[xx,yy][:3]==(255,255,255):p[xx,yy]=(0,0,0,0)
def blob(x0,y0):  # 从 (x0,y0) 出发的连通块包围盒
  seen={(x0,y0)};q=[(x0,y0)]
  while q:
    a,b=q.pop()
    for c,d in ((a+1,b),(a-1,b),(a,b+1),(a,b-1)):
      if 64<=c<100 and 0<=d<128 and (c,d) not in seen and p[c,d][3]:seen.add((c,d));q.append((c,d))
  xs=[s[0] for s in seen];ys=[s[1] for s in seen];return len(seen),(min(xs),min(ys),max(xs)+1,max(ys)+1)
bl=max(blob(xx,yy) for yy in range(32,100,2) for xx in range(64,100,2) if p[xx,yy][3])
st=fl.crop(bl[1])  # 灰石里最大的一块
SAND=[(74,48,30),(122,84,48),(170,124,72),(212,170,110),(240,214,160)]
F['z-rock']=[scale2x(recol(st,SAND))]
# 3. 沙浪(龙卷)
tor=Image.open(R+'tornado-sheet_48x64.png').convert('RGBA')
TS=[(120,84,44),(168,122,70),(206,164,104),(232,204,150),(250,236,200)]
F['s-tor']=[recol(tor.crop((i*48,0,i*48+48,64)),TS) for i in range(6)]
# 4. 冰晶:freeze.png 64×64 一格,前 3 行是冰(4 帧,由小到大)
fz=Image.open(R+'freeze.png').convert('RGBA')
for v in range(3):
  fr=[]
  for i in range(4):
    c=fz.crop((i*64,v*64,i*64+64,v*64+64)).resize((40,40),Image.LANCZOS)
    fr.append(outline(quant(amap(c,100),10),(28,61,90)))
  F[f'i-cry{v}']=fr
# 5. 毒柱:CodeManu 第 5 张,100×100 一格 7×7,柱子在 x 41~56、底在 y≈81
gy=Image.open(R+'pixel_effects/5.png').convert('RGBA')
GRN=[(20,70,30),(46,140,50),(116,214,72),(200,250,120),(240,255,210)]
F['p-gey']=[recol(amap(gy.crop((k%7*100+28,k//7*100+4,k%7*100+72,k//7*100+86)),60),GRN) for k in range(1,49,2)]
# 6. 冲击波圆环:第 10 张 100×100 一格 6×6
rg=Image.open(R+'pixel_effects/10.png').convert('RGBA')
SIL=[(76,110,160),(116,192,252),(208,235,255),(240,248,255),(255,255,255)]
F['w-ring']=[recol(amap(rg.crop((k%6*100+20,k//6*100+20,k%6*100+80,k//6*100+80)),60),SIL) for k in range(1,36,2)]
# 拼图集:每种一行
W=max(sum(f.width for f in fr) for fr in F.values());H=sum(max(f.height for f in fr) for fr in F.values())
A=Image.new('RGBA',(W,H));M={};y=0
for n,fr in F.items():
  w=max(f.width for f in fr);h=max(f.height for f in fr)
  for i,f in enumerate(fr):A.paste(f,(i*w+(w-f.width)//2,y+h-f.height))
  M[n]={'y':y,'w':w,'h':h,'n':len(fr),'px':w//2,'py':h if n in('s-tor','i-cry0','i-cry1','i-cry2','p-gey') else h//2,'fps':{'z-rune':10,'s-tor':14,'p-gey':40,'w-ring':30}.get(n,12),'loop':n in('z-rune','s-tor'),'im':4}
  y+=h
A.save(D+'/assets/bfx2_atlas.png',optimize=True)
print(A.size,os.path.getsize(D+'/assets/bfx2_atlas.png'));print(json.dumps(M,separators=(',',':')))
