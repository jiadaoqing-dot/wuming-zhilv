# 神秘地带 / 神秘副本像素图集 MYST(2026-10-13 第十二轮)
# 全部自画(像素):石砌大厅背景(竖纹石墙板 + 粗石柱 + 顶部石檐 + 石像鬼)、地砖、张嘴石狮头(嘴里的光球和 W 在游戏里画)、
#   石灯柱、铁火盆 + 4 帧火焰、首领「瓜子大王」仓鼠 11 帧(宠物仓鼠缩小复用)、小王冠、瓜子 / 瓜子壳 / 大瓜子壳、宠物蛋
# 参考:用户给的页游截图(神秘地带的石狮入口);仓鼠造型参考 World's Strongest Hamster in The Underground Empire GFX
#   (mutantleg,CC0,https://opengameart.org/content/worlds-strongest-hamster-in-the-underground-empire-gfx,raw/hamster;只看了配色,没有直接取图)
# 用法:python art_src/myst/build_myst.py → assets/myst_atlas.png,打印 meta(贴进源码 MYST.M:[x, y, 帧宽, 帧高, 帧数])
import os,json,math,random
from PIL import Image,ImageDraw
import numpy as np
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
random.seed(7);np.random.seed(7)
OL=(14,12,20,255)
def C(h,a=255):h=h.lstrip('#');return (int(h[0:2],16),int(h[2:4],16),int(h[4:6],16),a)
def outline(im,col=OL):
  a=np.array(im);m=a[...,3]>0;e=np.zeros_like(m)
  e[1:]|=m[:-1];e[:-1]|=m[1:];e[:,1:]|=m[:,:-1];e[:,:-1]|=m[:,1:];e&=~m;a[e]=col;return Image.fromarray(a)
def new(w,h):return Image.new('RGBA',(w,h),(0,0,0,0))
B4=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]])/16
def noise(w,h,s=1.0):return np.random.rand(h,w)*s

# ---------------- 石砌大厅背景(768 × 300,底边 = 地面) ----------------
ST=[C('#121118'),C('#1a1922'),C('#22212c'),C('#2b2a36'),C('#363542'),C('#43424f'),C('#53525f'),C('#666572')]
def hall(W=768,H=300):
  a=np.zeros((H,W,4),np.uint8);a[...]=ST[1]
  n=noise(W,H)
  def rect(x0,y0,x1,y1,c):a[max(0,y0):y1,max(0,x0):x1]=c
  # 墙板:竖向凹槽(每 8 像素一条暗槽 + 一条亮边)
  for x in range(W):
    k=x%8;c=ST[0] if k==0 else ST[3] if k==1 else ST[2]
    a[40:236,x]=c
  # 横向分段(石板接缝)
  for y in (96,160):rect(0,y,W,y+2,ST[0]);rect(0,y+2,W,y+3,ST[4])
  # 顶部石檐:大石块一排 + 下沿线脚
  for x0 in range(0,W,48):
    rect(x0,0,x0+47,34,ST[3]);rect(x0,0,x0+47,2,ST[5]);rect(x0+47,0,x0+48,34,ST[0]);rect(x0+2,30,x0+47,34,ST[2])
    rect(x0+14,10,x0+33,24,ST[2]);rect(x0+14,10,x0+33,11,ST[1]);rect(x0+14,23,x0+33,24,ST[4]);rect(x0+20,14,x0+27,20,ST[4])  # 方形雕饰
  rect(0,34,W,36,ST[5]);rect(0,36,W,40,ST[1]);rect(0,40,W,41,ST[0])
  # 下部护墙:暗色砖
  rect(0,236,W,300,ST[2])
  for r,y in enumerate(range(236,300,10)):
    rect(0,y,W,y+1,ST[0]);rect(0,y+1,W,y+2,ST[3])
    for x in range((r%2)*12,W,24):rect(x,y,x+1,y+10,ST[0]);rect(x+1,y+1,x+2,y+10,ST[3])
  rect(0,232,W,236,ST[4]);rect(0,232,W,233,ST[6])
  # 粗石柱(和截图一样贴着墙板):柱身 + 柱头 + 柱础
  for cx in (36,264,504,732):
    x0,x1=cx-22,cx+22
    for x in range(x0,x1):
      u=(x-x0)/(x1-x0);c=ST[5] if u<.18 else ST[4] if u<.5 else ST[3] if u<.82 else ST[2]
      a[52:236,x]=c
    for x in range(x0+6,x1-4,7):a[60:228,x]=ST[1]  # 凹槽
    rect(x0-6,40,x1+6,52,ST[4]);rect(x0-6,40,x1+6,42,ST[6]);rect(x0-6,50,x1+6,52,ST[1]);rect(x0-4,52,x1+4,56,ST[3])
    rect(x0-6,228,x1+6,240,ST[4]);rect(x0-6,228,x1+6,230,ST[6]);rect(x0-6,238,x1+6,240,ST[1])
  # 墙板上方的尖拱(暗)
  for cx in (150,384,618):
    for y in range(44,96):
      hw=int(46*math.sqrt(max(0,1-((96-y)/52)**2)))
      a[y,cx-hw:cx+hw]=ST[1]
      if hw>4 and y%8==0:a[y,cx-hw+2:cx+hw-2]=ST[0]
      a[y,cx-hw-1:cx-hw+1]=ST[4]
  # 纹理噪点(石头颗粒)
  m=(n>.93)&(a[...,0]>20);a[m,:3]=np.clip(a[m,:3].astype(int)+10,0,255)
  m=(n<.06);a[m,:3]=np.clip(a[m,:3].astype(int)-8,0,255)
  return Image.fromarray(a)

# ---------------- 地砖(64 × 60,可平铺,顶边 = 地面) ----------------
def floor():
  a=np.zeros((60,64,4),np.uint8);a[...]=ST[2];n=noise(64,60)
  a[0:2]=ST[6];a[2:4]=ST[4]
  for r,y in enumerate(range(4,60,14)):
    a[y:y+1]=ST[0];a[y+1:y+2]=ST[3]
    for x in range((r%2)*16,64,32):a[y:y+14,x:x+1]=ST[0];a[y+1:y+14,x+1:x+2]=ST[4]
  m=n>.9;a[m,:3]=np.clip(a[m,:3].astype(int)+12,0,255)
  return Image.fromarray(a)

# ---------------- 石狮头(96 × 104):张大嘴,嘴里空出来(光球在游戏里画) ----------------
SG=[C('#2a2930'),C('#3d3c46'),C('#55545f'),C('#6e6d79'),C('#8a8995'),C('#a6a5b0')]
def lion():
  W,H=96,104;im=new(W,H);d=ImageDraw.Draw(im);cx=48
  # 鬃毛:一圈尖簇
  # 鬃毛:外圈一簇簇圆卷毛(上亮下暗),里圈再一圈
  for ring_,(r,n,rr) in enumerate(((38,18,10),(30,14,9))):
    for i in range(n):
      ang=(i+.5*ring_)/n*2*math.pi;x_,y_=cx+math.cos(ang)*r,50+math.sin(ang)*r*1.02
      sh=SG[2] if math.sin(ang)>.3 else SG[3]
      d.ellipse((x_-rr,y_-rr,x_+rr,y_+rr),fill=sh)
      d.arc((x_-rr+2,y_-rr+2,x_+rr-2,y_+rr-2),190,330,fill=SG[4]);d.arc((x_-rr+1,y_-rr+1,x_+rr-1,y_+rr-1),20,150,fill=SG[1])
  # 脸
  d.ellipse((cx-27,22,cx+27,90),fill=SG[3])
  d.ellipse((cx-22,24,cx+22,52),fill=SG[4])  # 额头高光
  # 眉骨 + 眼睛(刻出来的深槽,眼珠亮一点)
  for s in (-1,1):
    d.polygon([(cx+s*4,36),(cx+s*22,32),(cx+s*24,38),(cx+s*6,42)],fill=SG[1])
    d.ellipse((cx+s*14-5,40,cx+s*14+5,47),fill=SG[0]);d.point((cx+s*14+s*1,43),fill=SG[5])
  # 鼻梁 + 鼻头
  d.rectangle((cx-5,40,cx+5,54),fill=SG[4]);d.polygon([(cx-10,52),(cx+10,52),(cx+7,59),(cx-7,59)],fill=SG[1]);d.line([(cx-6,53),(cx+6,53)],fill=SG[5])
  # 胡须垫
  for s in (-1,1):d.ellipse((cx+s*10-10,56,cx+s*10+10,68),fill=SG[3]);[d.point((cx+s*(6+k*4),61+(k%2)*2),fill=SG[1]) for k in range(3)]
  # 大嘴:黑洞
  d.ellipse((cx-20,58,cx+20,96),fill=SG[0])
  d.ellipse((cx-17,62,cx+17,93),fill=(8,7,12,255))
  # 上下獠牙
  for s in (-1,1):
    d.polygon([(cx+s*14,62),(cx+s*9,62),(cx+s*12,75)],fill=SG[5]);d.polygon([(cx+s*13,92),(cx+s*8,92),(cx+s*11,81)],fill=SG[5])
    d.polygon([(cx+s*5,64),(cx+s*2,64),(cx+s*3.5,70)],fill=SG[4])
  # 下巴 + 底座
  d.rectangle((cx-30,94,cx+30,104),fill=SG[2]);d.line([(cx-30,94),(cx+30,94)],fill=SG[4]);d.line([(cx-30,103),(cx+30,103)],fill=SG[0])
  im=outline(im)
  # 颗粒
  a=np.array(im);n=noise(W,H);m=(a[...,3]>0)&(n>.9)&(a[...,0]>40);a[m,:3]=np.clip(a[m,:3].astype(int)+14,0,255)
  return Image.fromarray(a)

# 石灯柱(14 × 66):顶上小石碗(火焰在游戏里画,颜色跟光球一样)
def post():
  im=new(16,66);d=ImageDraw.Draw(im)
  d.rectangle((4,10,11,62),fill=SG[2]);d.line([(4,10),(4,62)],fill=SG[4]);d.line([(11,10),(11,62)],fill=SG[1])
  for y in (20,34,48):d.line([(4,y),(11,y)],fill=SG[1])
  d.polygon([(1,4),(14,4),(12,10),(3,10)],fill=SG[3]);d.line([(1,4),(14,4)],fill=SG[5])
  d.rectangle((2,60,13,65),fill=SG[3])
  return outline(im)

# 铁链(6 × 8 一节,竖着平铺)
def chain():
  im=new(6,8);d=ImageDraw.Draw(im);d.ellipse((1,0,4,5),outline=C('#55545f'));d.point((2,1),fill=C('#8a8995'));d.line([(3,5),(3,7)],fill=C('#3d3c46'))
  return im

# ---------------- 铁火盆(40 × 52)+ 火焰 4 帧(32 × 40) ----------------
def brazier():
  im=new(40,52);d=ImageDraw.Draw(im);I=[C('#1b1a20'),C('#2c2b33'),C('#43424c'),C('#5c5b66')]
  d.line([(8,14),(4,51)],fill=I[2],width=2);d.line([(32,14),(36,51)],fill=I[2],width=2);d.line([(20,16),(20,51)],fill=I[1],width=2)
  d.line([(6,36),(34,36)],fill=I[1])
  d.pieslice((2,-10,38,22),0,180,fill=I[1]);d.rectangle((1,4,39,7),fill=I[2]);d.line([(1,4),(39,4)],fill=I[3])
  for x in range(6,36,6):d.point((x,10),fill=I[3])
  d.rectangle((6,2,34,4),fill=C('#5a1d0e'));d.line([(8,2),(32,2)],fill=C('#ff8a2a'))  # 炭火
  return outline(im)
def flames():
  out=new(32*4,40)
  P=[C('#7a1d0b'),C('#c2410c'),C('#f76707'),C('#ff922b'),C('#ffd43b'),C('#fff3bf')]
  for f in range(4):
    a=np.zeros((40,32,4),np.uint8)
    for x in range(32):
      for y in range(40):
        u=(x-16)/14;v=(39-y)/38
        h=(1-u*u)*(.75+.25*math.sin(f*1.7+x*.55))-v*1.0+.18*math.sin(y*.45+f*1.9+x*.3)
        if h>0:
          k=min(5,int(h*7));a[y,x]=P[k]
    out.alpha_composite(Image.fromarray(a),(f*32,0))
  return out

# ---------------- 石像鬼(64 × 72):蹲在石台上,翅膀收起 ----------------
def gargoyle():
  im=new(64,72);d=ImageDraw.Draw(im);g=SG
  d.rectangle((6,60,58,71),fill=g[2]);d.line([(6,60),(58,60)],fill=g[4]);d.line([(6,71),(58,71)],fill=g[0])
  d.polygon([(10,58),(4,22),(16,10),(24,30)],fill=g[1]);d.polygon([(54,58),(60,22),(48,10),(40,30)],fill=g[1])  # 翅膀
  for k in range(3):d.line([(8+k*3,52-k*8),(14+k*2,18+k*6)],fill=g[2]);d.line([(56-k*3,52-k*8),(50-k*2,18+k*6)],fill=g[2])
  d.ellipse((16,30,48,62),fill=g[2])   # 身体
  d.ellipse((20,34,40,52),fill=g[3])
  d.rectangle((18,52,28,60),fill=g[2]);d.rectangle((36,52,46,60),fill=g[2])  # 腿
  for x in (18,22,26,36,40,44):d.point((x,60),fill=g[4])
  d.ellipse((22,12,42,34),fill=g[3])   # 头
  d.polygon([(23,16),(17,2),(27,13)],fill=g[2]);d.polygon([(41,16),(47,2),(37,13)],fill=g[2])  # 角
  d.rectangle((26,20,29,23),fill=g[0]);d.rectangle((35,20,38,23),fill=g[0])
  d.polygon([(26,27),(38,27),(36,33),(28,33)],fill=g[1]);d.point((29,31),fill=g[5]);d.point((35,31),fill=g[5])
  d.line([(22,40),(16,50)],fill=g[1],width=3);d.line([(42,40),(48,50)],fill=g[1],width=3)  # 手臂
  im=outline(im);a=np.array(im);n=noise(64,72);m=(a[...,3]>0)&(n>.88)&(a[...,0]>40);a[m,:3]=np.clip(a[m,:3].astype(int)+12,0,255)
  return Image.fromarray(a)

# ---------------- 仓鼠「瓜子大王」(64 × 56 一帧,脚底 (32,55),面朝右) ----------------
HO=[C('#8a4a16'),C('#b8661f'),C('#d9852f'),C('#eba659'),C('#f6c98a')]   # 橙色毛:暗 → 亮
HW=[C('#c9b49a'),C('#eadcc6'),C('#fff8ec')]                              # 白肚皮
PK=C('#f497a9');PKD=C('#c9607a');EY=C('#141018')
def ham(pose):
  im=new(64,56);d=ImageDraw.Draw(im)
  sq={'idle1':(1.03,.96),'eat1':(1.05,.97),'hurt':(.96,1.02),'slap':(.98,1.04)}.get(pose,(1,1))
  bw,bh=44*sq[0],38*sq[1];bx=28;by=55-bh/2-2
  if pose=='dead':
    d.ellipse((10,30,54,54),fill=HO[2]);d.ellipse((16,34,48,54),fill=HW[1])
    for x in (18,26,38,46):d.ellipse((x-3,24,x+3,32),fill=PK)
    d.line([(40,38),(44,42)],fill=EY);d.line([(44,38),(40,42)],fill=EY)
    return outline(im)
  # 尾巴 + 后脚
  d.ellipse((bx-bw/2-3,by+6,bx-bw/2+5,by+12),fill=PK)
  fy=55;st=0
  if pose=='walk0':st=3
  if pose=='walk1':st=-3
  d.ellipse((bx-14+st,fy-6,bx-4+st,fy),fill=PK);d.ellipse((bx+8-st,fy-6,bx+18-st,fy),fill=PK)
  # 身体(背后深、前面亮)+ 白肚皮
  d.ellipse((bx-bw/2,by-bh/2,bx+bw/2,by+bh/2),fill=HO[1])
  d.ellipse((bx-bw/2+3,by-bh/2+1,bx+bw/2-2,by+bh/2-4),fill=HO[2])
  d.ellipse((bx-bw/2+8,by-bh/2+2,bx+bw/2-8,by-bh/2+14),fill=HO[3])
  d.ellipse((bx-2,by-6,bx+bw/2+1,by+bh/2),fill=HW[1]);d.ellipse((bx+2,by-2,bx+bw/2-3,by+bh/2-3),fill=HW[2])
  # 头(仓鼠头和身子连在一起,靠前上)
  hx,hy=bx+12,by-bh/2+12
  if pose=='hurt':hx-=3;hy+=1
  d.ellipse((hx-14,hy-12,hx+14,hy+12),fill=HO[2]);d.ellipse((hx-10,hy-11,hx+8,hy-2),fill=HO[3])
  # 腮帮子
  ck=9 if pose in('eat1',) else 6
  d.ellipse((hx-2,hy-1,hx+ck+8,hy+ck+5),fill=HW[1]);d.ellipse((hx,hy,hx+ck+6,hy+ck+3),fill=HW[2])
  if pose=='eat1':d.ellipse((hx-12,hy-1,hx,hy+10),fill=HW[1])  # 两边都鼓起来
  # 耳朵
  d.ellipse((hx-12,hy-17,hx-3,hy-8),fill=HO[1]);d.ellipse((hx-10,hy-15,hx-5,hy-10),fill=PK)
  d.ellipse((hx+1,hy-18,hx+10,hy-9),fill=HO[2]);d.ellipse((hx+3,hy-16,hx+8,hy-11),fill=PK)
  # 眼睛 / 鼻子 / 嘴
  if pose=='hurt':d.line([(hx+3,hy-5),(hx+7,hy-1)],fill=EY);d.line([(hx+7,hy-5),(hx+3,hy-1)],fill=EY)
  else:d.ellipse((hx+3,hy-6,hx+8,hy),fill=EY);d.point((hx+6,hy-5),fill=(255,255,255,255));d.point((hx+4,hy-2),fill=C('#4a4458'))
  d.ellipse((hx+12,hy-1,hx+15,hy+2),fill=PK);d.point((hx+13,hy-1),fill=(255,220,230,255))
  d.line([(hx+12,hy+3),(hx+11,hy+5)],fill=PKD)
  for k in (-1,1):d.line([(hx+12,hy+1),(hx+19,hy+1+k*2)],fill=HW[0])  # 胡须
  # 前爪
  if pose in('eat0','eat1'):
    d.ellipse((hx+6,hy+6,hx+12,hy+11),fill=PK);d.ellipse((hx+10,hy+5,hx+16,hy+10),fill=PK)
    d.polygon([(hx+10,hy+3),(hx+17,hy+5),(hx+12,hy+8)],fill=EY);d.line([(hx+11,hy+4),(hx+16,hy+5)],fill=(240,240,240,255))  # 瓜子
  elif pose=='throw0':d.ellipse((bx-6,by-bh/2-6,bx+1,by-bh/2+1),fill=PK)
  elif pose=='throw1':d.ellipse((hx+14,hy+6,hx+21,hy+12),fill=PK)
  elif pose=='slap':d.ellipse((bx-16,by-bh/2-4,bx-9,by-bh/2+3),fill=PK);d.ellipse((hx+12,hy-14,hx+19,hy-7),fill=PK)
  else:d.ellipse((bx+10,by+2,bx+16,by+7),fill=PK);d.ellipse((bx+16,by+3,bx+22,by+8),fill=PK)
  im=outline(im)
  return im
HP=['idle0','idle1','walk0','walk1','eat0','eat1','throw0','throw1','slap','hurt','dead']

def crown():
  im=new(16,11);d=ImageDraw.Draw(im);G=[C('#b8860b'),C('#f2c94c'),C('#fff3bf')]
  d.polygon([(1,10),(1,3),(5,6),(8,0),(11,6),(15,3),(15,10)],fill=G[1]);d.line([(1,9),(15,9)],fill=G[0]);d.point((8,3),fill=C('#e03131'));d.point((4,7),fill=G[2]);d.point((12,7),fill=C('#4dabf7'))
  return outline(im)
def seed(big=1):  # 瓜子:黑底白条
  w,h=12*big,7*big;im=new(w,h);d=ImageDraw.Draw(im)
  d.polygon([(0,h/2),(w*.35,0),(w-1,h*.3),(w-1,h*.7),(w*.35,h-1)],fill=C('#1c1a20'))
  for k in (.28,.5,.72):d.line([(w*.25,h*k),(w-2,h*.5+(k-.5)*h*.6)],fill=C('#e9e4dc'))
  return outline(im)
def shell():  # 瓜子壳(一片,灰白)
  im=new(12,7);d=ImageDraw.Draw(im);d.chord((0,0,11,12),180,360,fill=C('#3a3640'));d.line([(2,4),(9,4)],fill=C('#d9d2c5'));d.line([(4,2),(7,2)],fill=C('#d9d2c5'))
  return outline(im)
def bigshell():  # 大瓜子壳(罩人用,半片,平的一面朝左):48 × 64,尖头朝上,黑壳 + 白色竖纹
  W,H=48,64;a=np.zeros((H,W,4),np.uint8)
  for y in range(H):
    u=y/(H-1);hw=int((W-4)*(math.sin(math.pi*min(1,u*1.08))**.75)) if u<.97 else int((W-4)*.35)
    for x_ in range(hw+1):
      v=x_/max(1,hw);c=C('#1c1a20')
      if v>.82:c=C('#4a4652')
      for k in (.3,.58,.8):
        if abs(v-k)<.06 and .08<u<.95:c=C('#e9e4dc') if abs(v-k)<.035 else C('#8d8794')
      if x_<=1:c=C('#d9d2c5')
      a[y,x_]=c
  return outline(Image.fromarray(a))
def egg():  # 仓鼠宠物蛋(18 × 22,2026-10-13 第十三轮专属图标):奶白蛋 + 上半截仓鼠橙色毛 + 两只小耳朵 + 一颗瓜子花纹
  im=new(18,22);d=ImageDraw.Draw(im)
  d.ellipse((1,3,16,21),fill=C('#fff4dc'))
  a=np.array(im)
  for y in range(2,22):
    for x_ in range(18):
      if a[y,x_,3] and y<9+1.6*math.sin(x_*.9):a[y,x_]=HO[2] if y>4 or x_<7 else HO[3]   # 波浪形的橙色毛
  im=Image.fromarray(a);d=ImageDraw.Draw(im)
  for ex in (2,11):d.ellipse((ex,0,ex+4,5),fill=HO[1]);d.ellipse((ex+1,1,ex+3,4),fill=PK)   # 耳朵(画在毛上面,冒出蛋顶)
  d.ellipse((4,4,8,7),fill=HO[3]);d.point((5,5),fill=HO[4])   # 毛的高光
  d.ellipse((4,10,8,15),fill=(255,255,255,255))   # 蛋壳高光
  d.polygon([(12,11),(14,14),(13,18),(11,18),(10,14)],fill=C('#1c1a20'));d.line([(12,13),(12,17)],fill=C('#e9e4dc'))   # 瓜子花纹(尖头朝上)
  return outline(im)
# ---------------- 拼图集 ----------------
items=[]  # (key, image, 帧宽, 帧高, 帧数)
items.append(('hall',hall(),768,300,1))
items.append(('floor',floor(),64,60,1))
items.append(('lion',lion(),96,104,1))
hs=new(64*len(HP),56)
for i,p in enumerate(HP):hs.alpha_composite(ham(p),(i*64,0))
items.append(('ham',hs,64,56,len(HP)))
items.append(('gar',gargoyle(),64,72,1))
items.append(('fire',flames(),32,40,4))
items.append(('braz',brazier(),40,52,1))
items.append(('post',post(),16,66,1))
items.append(('bshell',bigshell(),48,64,1))
items.append(('crown',crown(),16,11,1))
items.append(('seed',seed(),12,7,1))
items.append(('shell',shell(),12,7,1))
items.append(('egg',egg(),18,22,1))
items.append(('chain',chain(),6,8,1))
# 简单的行打包
AW=1024;x0=y0=rowh=0;pos={}
for k,im,fw,fh,n in items:
  if x0+im.width>AW:x0=0;y0+=rowh+1;rowh=0
  pos[k]=(x0,y0,fw,fh,n);x0+=im.width+1;rowh=max(rowh,im.height)
A=new(AW,y0+rowh)
for k,im,fw,fh,n in items:A.alpha_composite(im,pos[k][:2])
A.save(D+'/assets/myst_atlas.png',optimize=True)
print(json.dumps({k:list(v) for k,v in pos.items()},separators=(',',':')))
print('frames ham:',HP)
