# 主城像素道具图集 TPX(像素化计划第 ② 步):传送门、女神像、宠物钢盔小鸡、小鸡扔出的扇子
#  · 传送门:Portals(LetargicDev,CC0)portalRings2 的 5 帧漩涡,绿色换成原版的白 / 蓝 / 紫,Scale3x 放大到 96×96(仍是 1 像素密度)
#  · 女神像:render_statue.py 渲染的原版矢量石像 → 限色(石头 5 阶 + 金色裂纹 + 青色符文)+ 外描边,保持原设计
#  · 钢盔小鸡:Chick(AntumDeluge,CC0,改自 Shepardskin 的 Chicken Sprites)侧面帧,白色换成黄色,翻成朝右,自加钢盔和红扇子
# 用法:python art_src/town/build_tpx.py <raw 目录> <statue_geo.png> <输出 png>   打印 meta(贴进源码 TPX.M)
import sys,json
from PIL import Image
RAW=sys.argv[1].rstrip('/\\');GEO=sys.argv[2];OUT=sys.argv[3]
def scale3x(im):
  w,h=im.size;s=im.load();o=Image.new('RGBA',(w*3,h*3));d=o.load()
  P=lambda x,y:s[min(w-1,max(0,x)),min(h-1,max(0,y))]
  for y in range(h):
    for x in range(w):
      A,B,C,D,E,F,G,H,I=P(x-1,y-1),P(x,y-1),P(x+1,y-1),P(x-1,y),P(x,y),P(x+1,y),P(x-1,y+1),P(x,y+1),P(x+1,y+1)
      e=[E]*9
      if B!=H and D!=F:
        e[0]=D if D==B else E;e[1]=B if (D==B and E!=C) or (B==F and E!=A) else E;e[2]=F if B==F else E
        e[3]=D if (D==B and E!=G) or (D==H and E!=A) else E;e[5]=F if (B==F and E!=I) or (H==F and E!=C) else E
        e[6]=D if D==H else E;e[7]=H if (D==H and E!=I) or (H==F and E!=G) else E;e[8]=F if H==F else E
      for k in range(9):d[x*3+k%3,y*3+k//3]=e[k]
  return o
atlas=Image.new('RGBA',(512,320));M={}
# —— 传送门
pr=Image.open(RAW+'/town_portal/portalRings2.png').convert('RGBA')
PMAP={(158,223,138):(231,245,255),(53,169,72):(116,192,252),(27,148,95):(132,94,247),(12,137,109):(95,61,196)}
for i in range(5):
  f=pr.crop((i*32,0,i*32+32,32));px=f.load()
  for y in range(32):
    for x in range(32):
      r,g,b,a=px[x,y]
      if a and (r,g,b) in PMAP:px[x,y]=PMAP[(r,g,b)]+(255,)
  atlas.alpha_composite(scale3x(f),(i*96,0))
M['portal']={'x':0,'y':0,'w':96,'h':96,'n':5,'fps':8,'ax':48,'ay':96}
# —— 女神像
g=Image.open(GEO).convert('RGBA');g=g.crop(g.getbbox());W,H=g.size;s=g.load()
OL=(59,51,64,255);STONE=[(244,240,242),(221,213,219),(189,180,189),(149,140,154),(110,101,117)];GOLD=[(255,236,153),(252,196,25),(230,140,0)];CY=[(227,250,252),(102,217,232)]
q=Image.new('RGBA',(W,H));o=q.load()
for y in range(H):
  for x in range(W):
    r,gg,b,a=s[x,y]
    if a<110:continue
    if a<255:r,gg,b=[int(v*255/a) if a else v for v in (r,gg,b)]  # 去掉预乘
    lum=.3*r+.59*gg+.11*b
    if r-b>55 and r>150:c=GOLD[0] if lum>215 else GOLD[1] if lum>165 else GOLD[2]
    elif b-r>25 and gg-r>15:c=CY[0] if lum>200 else CY[1]
    elif lum<95:c=OL[:3]
    else:c=STONE[min(4,max(0,int((236-lum)/22)))]
    o[x,y]=c+(255,)
# 外描边:贴着透明的像素换成描边色(金色裂纹也压一圈描边,保持原版轮廓)
B=[(x,y) for y in range(H) for x in range(W) if o[x,y][3] and any(not (0<=x+dx<W and 0<=y+dy<H) or not o[x+dx,y+dy][3] for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))]
for x,y in B:o[x,y]=OL
# 去掉孤立的单个像素
for y in range(H):
  for x in range(W):
    if o[x,y][3] and sum(1 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)) if 0<=x+dx<W and 0<=y+dy<H and o[x+dx,y+dy][3])==0:o[x,y]=(0,0,0,0)
atlas.alpha_composite(q,(0,96))
gb=Image.open(GEO).getbbox()   # 底稿里 sx=100、地面 GY=150
M['statue']={'x':0,'y':96,'w':W,'h':H,'ax':100-gb[0],'ay':150-gb[1]}
# —— 钢盔小鸡:侧面 7 帧(0、1 啄地 · 2 抬头 · 3~6 走路),翻成朝右,白 → 黄
ck=Image.open(RAW+'/town_chick/zip/PNG/chick_24x24.png').convert('RGBA')
CMAP={(255,255,255):(255,243,191),(231,228,223):(255,224,102),(231,219,202):(252,196,25),(119,119,119):(201,128,6)}
HL,HM,HD,HK=(222,226,230,255),(173,181,189,255),(116,122,130,255),(52,58,64,255)   # 钢盔亮 / 中 / 暗 / 帽檐描边
FR,FD,FW,FH=(240,62,62,255),(176,24,24,255),(255,255,255,255),(141,85,36,255)       # 扇子红 / 暗红 / 白骨 / 木柄
def scale2x(im):
  w,h=im.size;s=im.load();o=Image.new('RGBA',(w*2,h*2));d=o.load()
  P=lambda x,y:s[min(w-1,max(0,x)),min(h-1,max(0,y))]
  for y in range(h):
    for x in range(w):
      B,D,E,F,H=P(x,y-1),P(x-1,y),P(x,y),P(x+1,y),P(x,y+1);e=[E]*4
      if B!=H and D!=F:e=[D if D==B else E,F if B==F else E,D if D==H else E,F if H==F else E]
      for k in range(4):d[x*2+k%2,y*2+k//2]=e[k]
  return o
def helmet(o,cx,bot):
  # 钢盔(原版:灰色圆顶 + 深灰帽檐 + 顶上小钮 + 左上高光):圆顶 15 宽 7 高,帽檐 19 宽 2 高,bot = 帽檐最下一行
  for j in range(7):
    hw=[3,5,6,7,7,7,7][j];y=bot-2-7+j
    for xx in range(cx-hw,cx+hw+1):
      e=xx in (cx-hw,cx+hw) or j==0
      o.putpixel((xx,y),HK if e else HL if (xx-cx)<-2 and j<5 else HM if xx-cx<3 else HD)
  for xx in range(cx-5,cx-2):o.putpixel((xx,bot-7),(248,249,250,255))
  for j in (0,1):
    for xx in range(cx-9,cx+10):o.putpixel((xx,bot-1+j),HK if j or xx in (cx-9,cx+9) else (73,80,87,255))
  for xx in (cx-1,cx,cx+1):o.putpixel((xx,bot-10),HK)
  o.putpixel((cx,bot-11),HK)
import math
def fanimg(R):
  # 半圆红扇(原点在扇骨中心 (R,R)):暗红描边、白色扇骨、木色扇轴
  im=Image.new('RGBA',(2*R+1,R+1));d=im.load()
  for y in range(R+1):
    for xx in range(2*R+1):
      dx,dy=xx-R,R-y;r=math.hypot(dx,dy)
      if r<=R+.4:
        a=math.atan2(dy,dx);rib=any(abs(a-b)<.09 for b in (.55,1.0,1.57,2.14,2.6))
        d[xx,y]=FD if r>R-.9 or dy==0 else FW if rib and r>2 else FH if r<2 else FR
  return im
def fan(o,hx,hy,ang,R=9):
  # 手里的扇子(原版:木柄 + 约 100° 的红扇面 + 白扇骨):手在 (hx,hy),扇轴在手的 ang 方向(数学角,y 朝上)4 像素处
  qx,qy=hx+math.cos(ang)*4,hy-math.sin(ang)*4
  for k in range(6):o.putpixel((round(hx+math.cos(ang)*k),round(hy-math.sin(ang)*k)),(110,62,24,255) if k<2 else FH)
  for y in range(-R-1,R+2):
    for xx in range(-R-1,R+2):
      r=math.hypot(xx,y);a=math.atan2(-y,xx);da=(a-ang+math.pi)%(2*math.pi)-math.pi
      if 2<r<=R+.3 and abs(da)<=.9:
        px_,py_=round(qx+xx),round(qy+y)
        if 0<=px_<o.width and 0<=py_<o.height:o.putpixel((px_,py_),FD if r>R-.8 or abs(da)>.78 else FW if min(abs(da-b) for b in (-.45,0,.45))<.07 else FR)
CK=[]
for k in range(7):
  f=ck.crop((k*24,0,k*24+24,24)).transpose(Image.FLIP_LEFT_RIGHT);px=f.load()
  for y in range(24):
    for x in range(24):
      r,gg,b,a=px[x,y]
      if not a:px[x,y]=(0,0,0,0)
      elif (r,gg,b) in CMAP:px[x,y]=CMAP[(r,gg,b)]+(255,)
  # 头的位置按眼睛(纯黑像素)找:眼睛所在那一行连着的不透明像素就是头的宽度(尾巴尖比头高,不能用整张图的最高点)
  ex,ey=next((x,y) for y in range(24) for x in range(24) if px[x,y][:3]==(0,0,0) and px[x,y][3])
  a=ex
  while a>0 and px[a-1,ey][3]:a-=1
  b=ex
  while b<23 and px[b+1,ey][3] and px[b+1,ey][:3] not in ((239,150,0),(190,100,0)):b+=1   # 不算鸟喙
  a=max(a,ex-4)
  CK.append((scale2x(f),a+b+1,ey*2))   # 放大 2 倍后的头中心 x、眼睛 y
# 帧(48×56,脚底在 y=56):0~6 原样(0、1 啄地 · 2 抬头 · 3~6 走路)+ 扇子拿在胸前;7、8 = 抬头帧扇子往前扇 / 往后扬(放技能时挥扇)
fr=[];OY=8
for k,(f,cx,ey) in enumerate(CK):
  im=Image.new('RGBA',(48,56));im.alpha_composite(f,(0,OY));helmet(im,cx,ey+OY-1);fan(im,22,45,1.6);fr.append(im)
for ang in (.95,2.4):
  f,cx,ey=CK[2];im=Image.new('RGBA',(48,56));im.alpha_composite(f,(0,OY));helmet(im,cx,ey+OY-1);fan(im,26,42,ang);fr.append(im)
for i,im in enumerate(fr):atlas.alpha_composite(im,((i%5)*48,200+(i//5)*56))
M['chick']={'x':0,'y':200,'w':48,'h':56,'cols':5,'ax':22,'ay':56,'peck':[0,1],'stand':2,'walk':[3,4,5,6],'wave':[7,8]}# —— 飞出去的扇子(半径 10 的半圆,原点在扇骨中心)
fz=fanimg(10)
atlas.alpha_composite(fz,(240,200))
M['fan']={'x':240,'y':200,'w':21,'h':11,'ax':10,'ay':10}
bb=atlas.getbbox();atlas=atlas.crop((0,0,bb[2],bb[3]));atlas.save(OUT)
print(json.dumps(M,separators=(',',':')));print('atlas',atlas.size)
