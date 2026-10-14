# 首领巢穴像素图集 LAIR(2026-10-12):七关的巢穴 + 第五关洞穴(墙壁 / 洞顶 / 钟乳石 / 栅门)
# 原始素材(都在 raw/):
#  一关牛魔古堡、二关暗影高塔:Pixel Art Castle Tileset(rubberduck,CC0)raw/lair/ 的石块、拱门、窗、旗帜、火把;尖顶、牛头骨、旗子自画
#  三关蛇王树洞:Sunny Land Woods(ansimuz,CC0)的树皮、树洞和叶丛
#  四关毒雾岩洞:Desert Tilesets(AdebGameSoft,CC0)rock_veget 的圆顶岩石换成暗苔色;Gothicvania Swamp(ansimuz,CC0)的骷髅堆
#  五关沙蛇洞穴:Desert Tilesets 的深色土墙 / 沙檐土块(倒过来当洞顶);钟乳石、栅门(城堡木梁)
#  六关雪屋:自画冰砖雪屋(配色取自 Seasonal Platformer Tiles,GrafxKid,CC0)
#  七关积雪岩石:Desert Tilesets rock_veget 的裂纹巨石换成冷灰色 + 自画积雪
# 用法:python art_src/lv/build_lair.py → assets/lair_atlas.png,打印 meta(贴进源码 LAIR.M:[x,y,w,h])
import os,json,math
from PIL import Image,ImageDraw
import numpy as np
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));R=D+'/raw/'
OL=(30,24,36,255)
def rgba(c,a=255):return tuple(c[:3])+(a,)
def load(p):return Image.open(R+p).convert('RGBA')
def amap(im,th=128):
  a=np.array(im);a[...,3]=np.where(a[...,3]>th,255,0);return Image.fromarray(a)
def quant(im,n):
  a=im.split()[3];q=im.convert('RGB').quantize(n,method=Image.Quantize.MEDIANCUT).convert('RGBA');q.putalpha(a);return q
def small(im,w,h=None,n=16):  # 高清 → 像素:缩小、限色、二值透明
  h=h or round(im.height*w/im.width);return quant(amap(im.resize((w,h),Image.LANCZOS),110),n)
def recol(im,pal):  # 按亮度映射到调色板(暗 → 亮)
  a=np.array(im).astype(float);l=(a[...,0]*.3+a[...,1]*.59+a[...,2]*.11)/255
  lo,hi=np.percentile(l[a[...,3]>0],2),np.percentile(l[a[...,3]>0],98);l=np.clip((l-lo)/max(1e-3,hi-lo),0,.999)
  P=np.array(pal);o=P[(l*len(pal)).astype(int)];a[...,:3]=o;return Image.fromarray(a.astype('uint8'))
def outline(im,col=OL):
  a=np.array(im);m=a[...,3]>0;e=np.zeros_like(m)
  e[1:]|=m[:-1];e[:-1]|=m[1:];e[:,1:]|=m[:,:-1];e[:,:-1]|=m[:,1:];e&=~m;a[e]=col;return Image.fromarray(a)
def texfill(dst,mask,tex,ox=0,oy=0):  # 在 mask(L 图)里平铺贴图
  t=np.array(tex);d=np.array(dst);m=np.array(mask)>0;ys,xs=np.nonzero(m)
  d[ys,xs]=t[(ys+oy)%t.shape[0],(xs+ox)%t.shape[1]];return Image.fromarray(d)
def shade(im,mask,x0,x1,k=.72,dither=True):  # x0..x1 之间从不变暗渐变到乘 k(右侧背光),Bayer 抖动
  a=np.array(im).astype(float);m=np.array(mask)>0;B=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]])/16
  H,W=m.shape;X=np.arange(W)[None,:].repeat(H,0);Y=np.arange(H)[:,None].repeat(W,1)
  f=np.clip((X-x0)/max(1,x1-x0),0,1);sel=m&((f>B[Y%4,X%4]) if dither else (f>.5))
  a[sel,:3]*=k;return Image.fromarray(a.clip(0,255).astype('uint8'))
def mask(W,H,fn):m=Image.new('L',(W,H));fn(ImageDraw.Draw(m));return m
def paste(dst,src,x,y):dst.alpha_composite(src,(int(x),int(y)))
def stamp(dst,col,pts):
  d=ImageDraw.Draw(dst)
  for p in pts:d.point(p,fill=rgba(col))
OUT={}
# ---------- 城堡素材 ----------
C3=load('lair/castle_tileset_part3_0.png')
STONE=C3.crop((352,224,480,288)).resize((64,32),Image.BOX);STONE=quant(STONE,10)       # 灰石块,缩成 16 像素一块
DOOR=quant(C3.crop((100,32,188,160)).resize((44,64),Image.BOX),14)                    # 大拱门
WIN=quant(C3.crop((3,5,30,63)).resize((13,29),Image.BOX),8)                            # 拱窗
BAN=quant(C3.crop((19,197,43,241)).resize((12,22),Image.BOX),8)                         # 红旗帜
FLAME=C3.crop((44,3,53,15))                                                             # 火把火苗(原尺寸)
def cone(img,x0,x1,yb,yt,pal):  # 尖顶:左亮右暗 + 横向瓦片线
  W=img.width;d=ImageDraw.Draw(img);cx=(x0+x1)/2
  for y in range(yt,yb+1):
    k=(y-yt)/max(1,yb-yt);hw=(x1-x0)/2*k
    for x in range(int(cx-hw),int(cx+hw)+1):
      u=(x-(cx-hw))/max(1,2*hw);c=pal[0] if u<.3 else pal[1] if u<.62 else pal[2]
      if (y-yb)%5==0:c=pal[3]
      d.point((x,y),fill=rgba(c))
def flag(img,x,y,col):  # 旗杆 + 小三角旗
  d=ImageDraw.Draw(img);d.line([(x,y),(x,y+18)],fill=OL)
  for i in range(6):d.line([(x+1,y+i),(x+1+(6-i)*2,y+i)],fill=rgba(col))
  for i in range(6):d.line([(x+1,y+11-i),(x+1+(6-i)*2-2,y+11-i)],fill=rgba(col)) if False else None
def merlons(img,x0,x1,y,w,gap,h,tex):
  m=mask(img.width,img.height,lambda d:[d.rectangle([x,y,x+w-1,y+h-1],fill=255) for x in range(x0,x1-w+1,w+gap)])
  return texfill(img,m,tex)
def skull(img,cx,y):  # 牛头骨:象牙色骨头 + 两只大弯角
  d=ImageDraw.Draw(img);bone=(236,226,200);dk=(150,132,104)
  d.ellipse([cx-5,y,cx+5,y+9],fill=rgba(bone),outline=OL);d.rectangle([cx-3,y+8,cx+3,y+12],fill=rgba(bone),outline=OL)
  d.point((cx-2,y+4),fill=OL);d.point((cx+2,y+4),fill=OL);d.point((cx-1,y+10),fill=rgba(dk));d.point((cx+1,y+10),fill=rgba(dk))
  for s in(-1,1):
    pts=[(cx+s*(5+i),y+3-int(4*math.sin(i/9*math.pi*.9))) for i in range(11)]
    for i,p in enumerate(pts):d.rectangle([p[0],p[1]-(1 if i<7 else 0),p[0],p[1]+1],fill=rgba(bone))
    d.point(pts[-1],fill=rgba(dk))
# ---------- 一关:牛魔古堡 ----------
def lair1():
  W,H=184,216;im=Image.new('RGBA',(W,H))
  red=[(250,98,98),(224,49,49),(168,24,36),(120,16,28)]
  st=recol(STONE,[(70,78,96),(104,114,134),(138,150,170),(170,182,200),(205,214,228)])  # 原版城堡是浅灰蓝色
  body=mask(W,H,lambda d:(d.rectangle([6,H-150,45,H-1],fill=255),d.rectangle([136,H-150,175,H-1],fill=255),d.rectangle([36,H-118,145,H-1],fill=255)))
  im=texfill(im,body,st,0,(H-118)%32)
  im=merlons(im,38,146,H-128,12,6,10,st)
  for x in(6,136):im=shade(im,body,x+20,x+44,.7)
  im=shade(im,body,100,146,.8)
  im=outline(im)
  for x in(6,136):cone(im,x-6,x+46,H-151,H-196,red);flag(im,x+20,H-214,(255,212,59))
  paste(im,DOOR,69,H-64)
  for x in(18,148):paste(im,WIN,x,H-120)
  for x in(44,126):paste(im,BAN,x,H-110)
  skull(im,91,H-84)
  for x in(56,120):
    d=ImageDraw.Draw(im);d.rectangle([x+2,H-38,x+5,H-32],fill=rgba((90,64,40)),outline=OL);paste(im,FLAME,x,H-50)
  return outline(im)
# ---------- 二关:暗影高塔 ----------
def lair2():
  W,H=148,304;im=Image.new('RGBA',(W,H))
  PUR=[(26,18,48),(46,32,84),(72,52,124),(104,82,168),(150,128,212)]
  st=recol(STONE,PUR)
  body=mask(W,H,lambda d:d.rectangle([14,H-230,133,H-1],fill=255))
  im=texfill(im,body,st,0,0);im=shade(im,body,70,134,.62);im=outline(im)
  cone(im,2,146,H-231,H-300,[(132,94,247),(95,61,196),(64,40,140),(40,24,96)])
  gw=recol(WIN,[(20,10,30),(60,30,90),(190,75,219),(250,160,255),(255,230,255)])
  for k in range(3):
    wx,wy=67,H-200+k*50
    for r,a in((9,60),(6,110)):  # 窗口的紫光(抖动的光晕)
      d=ImageDraw.Draw(im)
      for yy in range(wy-r,wy+29+r):
        for xx in range(wx-r,wx+13+r):
          if (xx+yy)%2==0 and 0<=xx<W and abs(xx-(wx+6))<=6+r and im.getpixel((xx,yy))[3]:
            p=im.getpixel((xx,yy));im.putpixel((xx,yy),(min(255,p[0]+a//2),p[1],min(255,p[2]+a//2),255))
    paste(im,gw,wx,wy)
  dd=recol(DOOR,[(10,6,20),(30,20,48),(56,40,90),(90,70,130),(130,110,170)]);paste(im,dd,52,H-64)
  return outline(im)
# ---------- 三关:蛇王树洞 ----------
def lair3():
  W,H=232,342;im=Image.new('RGBA',(W,H))
  WT=load('lv/sunny-land-woods-files/Sunny-land-woods-files/ENVIRONMENT/tileset.png')
  bark=WT.crop((240,96,336,144));hol=WT.crop((352,144,402,192))
  leaves=load('lv/sunny-land-woods-files/Sunny-land-woods-files/ENVIRONMENT/props-sliced/leaves.png')
  tr=mask(W,H,lambda d:(d.rounded_rectangle([54,H-200,123,H-1],radius=14,fill=255),d.polygon([(40,H-1),(54,H-30),(54,H-1)],fill=255),d.polygon([(137,H-1),(123,H-30),(123,H-1)],fill=255)))
  im=texfill(im,tr,bark,10,0);im=shade(im,tr,92,124,.75);im=outline(im)
  # 叶丛:叶子图按树冠的几个圆排开(后面的暗一点)
  for i,(cx,cy,s) in enumerate([(44,112,.95),(176,118,1),(84,70,1.05),(150,64,1.05),(118,40,.95),(116,98,1.1),(30,150,.75),(204,152,.75)]):
    lf=leaves.resize((round(151*s),round(105*s)),Image.NEAREST)
    if i<5:lf=Image.fromarray((np.array(lf)*[.8,.85,.8,1]).astype('uint8'))
    paste(im,lf,cx-lf.width//2,cy-lf.height//2)
  h2=hol.resize((50,62),Image.NEAREST);paste(im,h2,64,H-64)   # 树洞
  d=ImageDraw.Draw(im)
  for ex in(82,93):d.rectangle([ex,H-40,ex+2,H-39],fill=rgba((250,176,5)))  # 树洞里一双金色的眼睛
  return im
# ---------- 四关:毒雾岩洞 ----------
def lair4():
  W,H=214,172;RV=load('lv/desert/rock_veget.png')
  dome=small(RV.crop((677,405,1003,657)),W,H,12)
  MOSS=[(46,50,36),(60,66,46),(68,74,52),(76,84,58),(96,106,72)]   # 对比压低,免得岩石上的坑变成大黑斑
  im=recol(dome,MOSS);a=np.array(im);m=a[...,3]>0;top=np.argmax(m,axis=0)
  for x in range(W):  # 顶上一层苔藓(抖动)
    if m[:,x].any():
      for y in range(top[x],min(H,top[x]+14)):
        if (x+y)%2==0 or y<top[x]+6:a[y,x]=rgba((72,120,48) if y<top[x]+4 else (58,96,40))
  im=Image.fromarray(a);im=shade(im,Image.fromarray((m*255).astype('uint8')),110,214,.72);d=ImageDraw.Draw(im)
  d.rounded_rectangle([79,H-82,134,H+20],radius=26,fill=rgba((14,12,10)),outline=OL)   # 洞口
  for y in range(H-82,H):
    for x in range(80,134):
      if im.getpixel((x,y))[:3]==(14,12,10) and (x+y)%3==0 and y>H-40:im.putpixel((x,y),(28,40,24,255))  # 洞里的绿色毒雾
  for cx in(40,168):  # 洞口两边的骨头堆(自画)
    d.ellipse([cx-7,H-11,cx+7,H-1],fill=rgba((214,206,180)),outline=OL);d.point((cx-3,H-7),fill=OL);d.point((cx+2,H-7),fill=OL)
    d.line([(cx+8,H-3),(cx+18,H-6)],fill=rgba((214,206,180)),width=2)
  return outline(im)
# ---------- 六关:冰砖雪屋 ----------
def lair6():
  W,H=234,192;im=Image.new('RGBA',(W,H));cx=118
  SN=[(255,255,255),(231,245,255),(196,226,250),(150,196,236),(104,156,214)]
  dm=mask(W,H,lambda d:d.pieslice([cx-116,H-188,cx+116,H+188],180,360,fill=255))
  a=np.array(im);m=np.array(dm)>0;a[m]=rgba(SN[1]);im=Image.fromarray(a)
  d=ImageDraw.Draw(im)
  for row,y in enumerate(range(H-1,H-188,-16)):  # 冰砖缝
    for xx in range(0,W):
      if m[y][xx] and im.getpixel((xx,y))[3]:im.putpixel((xx,y),rgba(SN[3]))
    off=0 if row%2 else 14
    for xx in range(off,W,28):
      for yy in range(max(0,y-15),y):
        if m[yy][xx]:im.putpixel((xx,yy),rgba(SN[3]))
    for xx in range(W):
      if y-1>=0 and m[y-1][xx] and im.getpixel((xx,y-1))[:3]==SN[1]:im.putpixel((xx,y-1),rgba(SN[0]))  # 砖块上沿高光
  im=shade(im,dm,cx-10,cx+116,.78);im=outline(im,(52,82,128,255))
  d=ImageDraw.Draw(im);d.rounded_rectangle([cx-42,H-90,cx+21,H+30],radius=30,fill=rgba((28,58,94)),outline=rgba((52,82,128)))
  d.rounded_rectangle([cx-36,H-82,cx+15,H+30],radius=26,fill=rgba((16,34,58)))
  for i in range(7):  # 洞口冰柱
    x=cx-36+i*8;l=6+(i%2)*5
    for k in range(l):d.line([(x+k//4,H-84+k),(x+3-k//4,H-84+k)],fill=rgba(SN[0] if k<l-2 else SN[2]))
  for x0 in(0,190):d.ellipse([x0,H-9,x0+40,H+4],fill=rgba(SN[0]),outline=rgba((150,196,236)))
  return im
# ---------- 七关:积雪岩石 ----------
def lair7():
  W,H=152,164;RV=load('lv/desert/rock_veget.png')
  rk=small(RV.crop((2,2,339,281)),W,H,12)
  ROCK=[(34,38,54),(58,64,86),(86,94,118),(122,132,156),(160,170,190)]
  im=recol(rk,ROCK);a=np.array(im);m=a[...,3]>0
  top=np.argmax(m,axis=0)
  for x in range(W):  # 积雪:每一列最上面 6~10 像素
    if m[:,x].any():
      t=top[x];dep=7+int(3*math.sin(x*.37))
      for y in range(t,min(H,t+dep)):a[y,x]=rgba((255,255,255) if y<t+dep-2 else (208,235,255))
  im=Image.fromarray(a);d=ImageDraw.Draw(im)
  d.rounded_rectangle([54,H-40,97,H+20],radius=20,fill=rgba((20,22,37)),outline=OL)
  return outline(im)
# ---------- 五关洞穴 ----------
def cave():
  DT=load('lv/desert/desert_tile.png')
  wall=quant(DT.crop((12,178,112,278)).resize((32,32),Image.BOX),10);wall=Image.fromarray((np.array(wall)*[.55,.5,.48,1]).astype('uint8'))
  ceil=quant(DT.crop((131,425,256,550)).resize((32,32),Image.BOX),10).transpose(Image.FLIP_TOP_BOTTOM)
  ceil=Image.fromarray((np.array(ceil)*[.62,.56,.52,1]).astype('uint8'))
  # 洞顶条(宽 160,可横向平铺):土块(上面 CY=56 高)+ 钟乳石
  CT=Image.new('RGBA',(160,84));m=mask(160,84,lambda d:d.rectangle([0,0,159,55],fill=255));CT=texfill(CT,m,ceil,0,32-56%32)
  d=ImageDraw.Draw(CT);dk=(61,40,21);md=(92,62,34);lt=(140,98,56)
  for i,x in enumerate(range(6,160,40)):
    L=12+(i*7)%16
    for k in range(L):
      hw=max(0,int(5*(1-k/L)+.5))
      for xx in range(x-hw,x+hw+1):CT.putpixel((xx,55+k),rgba(lt if xx<x-hw/3 else md if xx<x+hw/2 else dk))
    CT.putpixel((x,55+L),rgba((180,220,255)))  # 尖上的水滴
  CT=outline(CT);CT=CT.crop((0,0,160,84))
  # 侧墙(34 宽,竖向平铺):浅一点的土墙 + 左右描边
  SD=Image.fromarray((np.array(quant(DT.crop((12,178,112,278)).resize((32,32),Image.BOX),10))*[.75,.7,.66,1]).astype('uint8'))
  SW=Image.new('RGBA',(34,64));SW=texfill(SW,mask(34,64,lambda d:d.rectangle([1,0,32,63],fill=255)),SD);SW=shade(SW,mask(34,64,lambda d:d.rectangle([0,0,33,63],fill=255)),10,33,.7)
  dd=ImageDraw.Draw(SW);dd.line([(0,0),(0,63)],fill=OL);dd.line([(33,0),(33,63)],fill=OL)
  # 栅门(首领战时封住入口):城堡木梁 + 铁条
  wood=quant(C3.crop((480,0,512,256)).resize((16,128),Image.BOX),10)
  G=Image.new('RGBA',(26,120))
  for x in(0,9,18):paste(G,wood.crop((4,0,12,120)),x,0)
  dg=ImageDraw.Draw(G)
  for y in(8,40,72,104):dg.rectangle([0,y,25,y+5],fill=rgba((84,84,92)),outline=OL)
  return {'c5wall':wall,'c5ceil':CT,'c5side':SW,'c5gate':outline(G)}
parts={'l1':lair1(),'l2':lair2(),'l3':lair3(),'l4':lair4(),'l6':lair6(),'l7':lair7(),**cave()}
# 拼图集(按高度从高到低,一行排满 1024 换行)
order=sorted(parts,key=lambda k:-parts[k].height);x=y=rowh=0;M={}
for k in order:
  im=parts[k]
  if x+im.width>1024:x=0;y+=rowh+2;rowh=0
  M[k]=[x,y,im.width,im.height];x+=im.width+2;rowh=max(rowh,im.height)
A=Image.new('RGBA',(1024,y+rowh))
for k,(px,py,w,h) in M.items():A.alpha_composite(parts[k],(px,py))
A.save(D+'/assets/lair_atlas.png',optimize=True)
print(A.size,os.path.getsize(D+'/assets/lair_atlas.png'));print(json.dumps(M,separators=(',',':')))
