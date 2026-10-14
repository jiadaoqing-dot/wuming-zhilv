# 双头狗(第七关精英)像素精灵:ansimuz「Hell Hound Character」(CC-BY 3.0,https://opengameart.org/content/hell-hound-character)
# 改动:暗紫身体 + 熔岩橙换成冰蓝 / 雪白配色;把头部复制一份错位贴在后上方,做成双头;追加到 mob 图集(dog2)
# 用法:python3 art_src/mob/build_dog2.py <Hell-Hound PNG 目录> <mob_atlas.png> <mob_meta.json>
import sys,json,colorsys
import numpy as np
from PIL import Image
D,MA,MJ=sys.argv[1:4]
def frames(n,k):im=Image.open(f'{D}/{n}.png').convert('RGBA');w=im.width//k;return [im.crop((i*w,0,i*w+w,im.height)) for i in range(k)]
ICE=[(18,26,46),(52,74,112),(110,150,196),(196,224,246),(250,252,255)]
def grad(l):
  k=min(.999,max(0,l))*(len(ICE)-1);n=int(k);u=k-n;return [ICE[n][q]+(ICE[n+1][q]-ICE[n][q])*u for q in range(3)]
def recol(im):
  a=np.array(im).astype(float)
  for j in range(a.shape[0]):
    for i in range(a.shape[1]):
      r,g,b,al=a[j,i]
      if not al:continue
      h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
      if b>150 and g>150 and r<120:continue          # 青色眼睛保留
      if .02<h<.16 and s>.4:a[j,i,:3]=grad(.5+v*.3)  # 熔岩 → 冰霜高光
      else:a[j,i,:3]=grad(.28+v*1.5)
  a[...,3]=np.where(a[...,3]>0,255,0);return Image.fromarray(a.astype(np.uint8),'RGBA')
def twohead(im):
  # 头在左侧(面朝左):找最左边不透明列,取 14×13 的头部区域,复制到右上方 5、-5 处,画在原图后面
  a=np.array(im);cols=np.where(a[...,3].max(0)>0)[0]
  if not len(cols):return im
  x0=cols[0];rows=np.where(a[:,x0:x0+14,3].max(1)>0)[0];y0=max(0,rows[0]-1)
  head=im.crop((x0,y0,x0+15,y0+13));o=Image.new('RGBA',im.size);o.alpha_composite(head,(x0+6,max(0,y0-5)));o.alpha_composite(im,(0,0));return o
A={'idle':(frames('idle',6),6),'walk':(frames('walk',12),12),'atk':(frames('run',5),14),'hit':(frames('jump',6)[1:2],4)}
fr={a:[twohead(recol(f)) for f in fs] for a,(fs,_) in A.items()}
at=Image.open(MA).convert('RGBA');meta=json.load(open(MJ));meta.pop('dog2',None)
H=max(r[0]+v['h'] for v in meta.values() for r in v['A'].values());at=at.crop((0,0,at.width,H))
bb=None
for fs in fr.values():
  for f in fs:
    b=f.getbbox();bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
ib=None
for f in fr['idle']:
  b=f.getbbox();ib=b if not ib else (min(ib[0],b[0]),min(ib[1],b[1]),max(ib[2],b[2]),max(ib[3],b[3]))
w,h=bb[2]-bb[0],bb[3]-bb[1];m={'w':w,'h':h,'ax':round((ib[0]+ib[2])/2-bb[0]),'S':1,'fl':1,'A':{}};rows=[];y=H
for a,fs in fr.items():
  row=Image.new('RGBA',(w*len(fs),h))
  for i,f in enumerate(fs):row.alpha_composite(f.crop(bb),(i*w,0))
  rows.append((row,y));m['A'][a]=[y,len(fs),A[a][1]];y+=h
meta['dog2']=m
out=Image.new('RGBA',(max(at.width,max(r.width for r,_ in rows)),y));out.alpha_composite(at,(0,0))
for r,yy in rows:out.alpha_composite(r,(0,yy))
out.save(MA,optimize=True);json.dump(meta,open(MJ,'w'),separators=(',',':'));print('dog2',w,h,out.size)
