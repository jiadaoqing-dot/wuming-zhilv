# 金色蛇王 / 北极熊 / 雪球 像素图(图集 KB):
#   King Cobra(Jordan Irwin / AntumDeluge,OGA-BY 3.0 / CC-BY 3.0,https://opengameart.org/content/king-cobra)
#     改动:只取 96×96 朝东一行 3 帧;暗红身体按亮度映射成金色、浅黄腹部改成淡金;头顶加自绘小王冠;格子按并集裁切,脚底 = 底边
#   [LPC] bears, deer, lions and more(tapatilorenzo,CC-BY 4.0,https://opengameart.org/content/lpc-bears-deer-lions-and-more)
#     改动:只取 polar bear 的朝右走路 5 帧、朝右攻击 3 帧、朝右倒地 4 帧、正面攻击(站起)4 帧、正面倒地 4 帧;洋红底色去掉
#   Snowball Pixel Art(alf0186,CC0,https://opengameart.org/content/snowball-pixel-art):原样
# 用法:python art_src/boss/build_kb.py <king_cobra-red.png(96x96)> <bear, polar.png> <snowball.png> <输出 png>
# 输出:打印 meta(JSON),贴进 src 里的 KB 模块
import sys,json
from PIL import Image,ImageDraw
CB,BR,SN,OUT=sys.argv[1:5]
lum=lambda r,g,b:r*.3+g*.59+b*.11
def ramp(C,k):
  k=max(0,min(.999,k))*(len(C)-1);n=int(k);u=k-n;c0,c1=C[n],C[n+1]
  return tuple(int(c0[q]+(c1[q]-c0[q])*u) for q in range(3))+(255,)
BODY=[(110,62,0),(200,128,6),(245,180,16),(255,214,58),(255,242,170)]
BELLY=[(196,130,30),(250,214,110),(255,246,206)]
def gold(im):
  im=im.copy();p=im.load();bl=[]
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a<110:p[i,j]=(0,0,0,0);continue
      if r>150 and g<70:continue                       # 红舌头保留
      L=lum(r,g,b)
      if L<22:p[i,j]=(48,26,0,255);continue             # 描边 → 深棕
      if g>110 and r>170:p[i,j]=ramp(BELLY,(L-120)/110);continue
      bl.append((i,j,L))
  if bl:
    lo=min(v[2] for v in bl);hi=max(v[2] for v in bl)
    for i,j,L in bl:p[i,j]=ramp(BODY,.38+.55*(L-lo)/max(1,hi-lo))
  return im
src=Image.open(CB).convert('RGBA');S=96
def pad(im):o=Image.new('RGBA',(S,S+10));o.alpha_composite(im,(0,10));return o   # 顶上留 10 像素放王冠
fr=[pad(gold(src.crop((i*S,S,i*S+S,2*S)))) for i in range(3)]   # 第 1 行 = 朝东
CROWN=["..W....W....W..",".yWy..yWy..yWy.",".yYy..yYy..yYy.","yYYYyyYYYyyYYYy","yWWYYYYYYYYYYYy","yYYrYYYbYYYrYYy","yYYYYYYYYYYYYYy","yyyyyyyyyyyyyyy"]   # 15×8,和蛇头差不多宽
CC={'y':(120,70,0,255),'Y':(255,212,40,255),'W':(255,250,210,255),'r':(224,49,49,255),'b':(77,171,247,255)}
for f in fr:
  p=f.load();top=min(j for j in range(f.height) for i in range(S) if p[i,j][3]);xs=[i for i in range(S) if p[i,top][3]];hx=(min(xs)+max(xs))//2
  for dy,row in enumerate(CROWN):
    for dx,ch in enumerate(row):
      if ch!='.':p[hx-7+dx,top-7+dy]=CC[ch]
bb=None
for f in fr:
  b=f.getbbox();bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
cw,ch=bb[2]-bb[0],bb[3]-bb[1]
# 熊:洋红底色 → 透明
bear=Image.open(BR).convert('RGBA');p=bear.load()
for j in range(bear.height):
  for i in range(bear.width):
    r,g,b,a=p[i,j]
    if r>240 and g<20 and b>240:p[i,j]=(0,0,0,0)
PICK=[(1,5),(5,3),(9,4),(7,4),(11,4)]   # (行, 帧数):走路右 / 攻击右 / 倒地右 / 正面站起攻击 / 正面倒地
bf=[bear.crop((i*64,r*64,i*64+64,r*64+64)) for r,n in PICK for i in range(n)]
snow=Image.open(SN).convert('RGBA')
W=max(cw*3,64*len(bf));o=Image.new('RGBA',(W,ch+64+32))
for i,f in enumerate(fr):o.alpha_composite(f.crop(bb),(i*cw,0))
for i,f in enumerate(bf):o.alpha_composite(f,(i*64,ch))
o.alpha_composite(snow,(0,ch+64))
o.save(OUT,optimize=True)
fb=[f.getbbox() for f in bf]
print(json.dumps({'cw':cw,'ch':ch,'by':ch,'sy':ch+64,'bot':max(b[3] for b in fb[:8])}))
