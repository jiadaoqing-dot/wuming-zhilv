# 第六关地图像素图集 ICE6P(2026-10-12):原来矢量画的冰面、冰墙、裂冰裂纹、落雪雪团、海豹雪洞、首领场地冰墙
# 素材:Seasonal Platformer Tiles(GrafxKid,CC0)raw/lv/season/Season_sets.png 冬季那一格的星纹冰块(提亮成冰)和雪檐;
#      裂纹、雪团、雪堆、雪洞、冰柱是按同一套配色自画的像素
# 用法:python art_src/lv/build_ice6.py → assets/ice6_atlas.png,打印 meta(贴进源码 ICE6P.M:[x,y,w,h])
import os,json,math
import numpy as np
from PIL import Image,ImageDraw
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SS=Image.open(D+'/raw/lv/season/Season_sets.png').convert('RGBA')
OL=(40,56,92,255);W0=(255,255,255,255);S1=(231,245,255,255);S2=(196,226,250,255);S3=(150,196,236,255);S4=(96,150,210,255)
def lift(im,k=.45):  # 提亮:往白色混 k
  a=np.array(im).astype(float);a[...,:3]=a[...,:3]*(1-k)+255*k;return Image.fromarray(a.astype('uint8'))
def outline(im,col=OL):
  a=np.array(im);m=a[...,3]>0;e=np.zeros_like(m);e[1:]|=m[:-1];e[:-1]|=m[1:];e[:,1:]|=m[:,:-1];e[:,:-1]|=m[:,1:];e&=~m;a[e]=col;return Image.fromarray(a)
P={}
# 冰块贴图 16×16(冰墙、首领场地冰墙用,平铺;取星纹的一个周期,避开边框)
ice=lift(SS.crop((264,104,280,120)),.42);P['iceb']=ice
# 冰墙顶上的雪檐 32×8
P['cap']=SS.crop((256,96,288,104))
# 地面冰面条 32×9:最上一行白色高光,下面是提得更亮的冰块
st=Image.new('RGBA',(32,9));st.paste(lift(SS.crop((264,104,280,113)),.6),(0,0));st.paste(lift(SS.crop((264,104,280,113)),.6),(16,0));d=ImageDraw.Draw(st);d.line([(0,0),(31,0)],fill=W0);d.line([(0,8),(31,8)],fill=S3)
for x in(5,6,20):d.point((x,2),fill=W0)
P['strip']=st
# 冰面上滑过的反光 16×1
g=Image.new('RGBA',(16,2));ImageDraw.Draw(g).line([(0,0),(15,0)],fill=W0);P['glint']=g
# 裂纹三档 24×16(深蓝像素折线,越来越多)
def crack(n):
  im=Image.new('RGBA',(24,16));d=ImageDraw.Draw(im)
  paths=[[(12,0),(14,4),(10,8),(13,12),(11,16)],[(5,0),(7,5),(4,9),(6,14)],[(19,0),(17,4),(21,9),(18,15)]]
  for p in paths[:n]:
    for a,b in zip(p,p[1:]):d.line([a,b],fill=(28,79,128,255))
    for a in p[1:-1]:d.point((a[0]+1,a[1]),fill=(255,255,255,255))
  return im
for n in(1,2,3):P[f'crk{n}']=crack(n)
# 落下的雪团 76×36 / 落地雪堆 88×30:半圆团块,左上亮右下暗 + Bayer 抖动
B=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]])/16
def mound(w,h,bumps):
  im=Image.new('RGBA',(w,h));a=np.array(im)
  for y in range(h):
    for x in range(w):
      top=min(h-1-(h-2)*max(0,1-((x-cx)/r)**2)**.5*hk for cx,r,hk in bumps)
      if y>=top:
        u=(x/w)*.6+((y-top)/max(1,h-top))*.6;c=S1 if u<.45 else S2 if u<.75 else S3
        if u<.3 and y-top<2:c=W0
        if .7<u<.8 and B[y%4,x%4]<.5:c=S2
        a[y,x]=c
  return outline(Image.fromarray(a))
P['clump']=mound(76,36,[(38,30,1),(20,16,.75),(56,18,.8)])
P['pile']=mound(88,30,[(44,40,1),(18,18,.6),(70,18,.65)])
# 海豹雪洞 44×16:小雪包 + 深色洞口
h=mound(44,16,[(22,22,1)]);d=ImageDraw.Draw(h);d.ellipse([18,6,30,12],fill=(43,52,72,255),outline=OL);P['hole']=h
# 冰柱 8×16
ic=Image.new('RGBA',(8,16));d=ImageDraw.Draw(ic)
for k in range(14):hw=max(0,round(3*(1-k/14)));d.line([(4-hw,k),(4+hw-1 if hw else 4,k)],fill=W0 if k<4 else S2)
P['icl']=outline(ic)
# 雪花 2×2 / 3×3
for n,s in(('sf1',2),('sf2',3)):im=Image.new('RGBA',(s,s),W0);P[n]=im
x=y=rowh=0;M={}
for k,im in P.items():
  if x+im.width>256:x=0;y+=rowh+1;rowh=0
  M[k]=[x,y,im.width,im.height];x+=im.width+1;rowh=max(rowh,im.height)
A=Image.new('RGBA',(256,y+rowh))
for k,(px,py,w,hh) in M.items():A.alpha_composite(P[k],(px,py))
A.save(D+'/assets/ice6_atlas.png',optimize=True);print(A.size);print(json.dumps(M,separators=(',',':')))
