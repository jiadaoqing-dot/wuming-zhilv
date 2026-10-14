# 武器图集:Shade「16x16 Weapon RPG Icons」(CC0)
# 1) 只拉长刃部 / 杖身(沿对角线复制一段中间带)2) RotSprite(scale2x×3 → 旋转 → 取中心)生成 16 个方向
# 输出:wpn_atlas.png(每格 WC×WC,握把在格子中心),并打印每把武器的刃 / 杖头长度
import sys,math,json,os
D=os.path.dirname(os.path.abspath(__file__))
import numpy as np
from PIL import Image
SRC=os.path.join(D,'weapons','')  # bronze/iron/steel/gold-weapons.png
WC=56;C=WC//2;N=16
# (名字, 素材表, 列, 行, 握把(格内 x,y), 复制带起点 s0(x+y), 带宽 w, 份数 n, 换色)
W=[('sw0','steel',3,2,(13,13),10,2,9,None),
   ('sw1','steel',9,1,(13,13),12,2,9,'jade'),     # 林王:武士刀(换青绿)
   ('sw2','gold',12,6,(12,13),20,0,1.9,None),     # 荒漠:金色弯刀(w=0 表示整体拉长 n 倍)
   ('st0','steel',19,7,(12,12),17,2,9,None),
   ('st1','iron',20,5,(12,13),22,2,9,'jade'),
   ('st2','gold',19,5,(12,12),18,2,9,None)]
def recolor(a,mode):
  if mode!='jade':return a
  out=a.copy();rgb=a[...,:3].astype(int)
  grey=(abs(rgb[...,0]-rgb[...,1])<26)&(abs(rgb[...,1]-rgb[...,2])<26)&(rgb.sum(-1)>90)&(a[...,3]>0)
  L=rgb.mean(-1)/255.
  g=np.stack([40+L*150,90+L*165,50+L*120],-1).clip(0,255)
  out[...,:3][grey]=g[grey].astype(np.uint8)
  return out
def lengthen(t,s0,w,n):
  H=16+n*w;big=np.zeros((H+16,H+16,4),np.uint8);o=n*w//2+4
  ys,xs=np.nonzero(t[...,3])
  for y,x in zip(ys,xs):
    s=x+y
    if s>=s0+w:big[y+o,x+o]=t[y,x]                     # 握把一侧不动
    else:big[y+o-n*w//2,x+o-n*w//2]=t[y,x]              # 刃尖一侧整体往左上移
    if s0<=s<s0+w:
      for k in range(0,n):                                # 复制中间带(k=0 是原位置)
        d=k*w//2;big[y+o-d,x+o-d]=t[y,x]
  return big,o
def s2x(a):
  h,w=a.shape[:2];v=a.view(np.uint32).reshape(h,w)
  p=np.pad(v,1,mode='edge');A=p[:-2,1:-1];B=p[1:-1,2:];Cc=p[1:-1,:-2];D=p[2:,1:-1];E=v
  o=np.zeros((h*2,w*2),np.uint32)
  c1=(Cc==A)&(Cc!=D)&(A!=B);c2=(A==B)&(A!=Cc)&(B!=D);c3=(D==Cc)&(D!=B)&(Cc!=A);c4=(B==D)&(B!=A)&(D!=Cc)
  o[0::2,0::2]=np.where(c1,A,E);o[0::2,1::2]=np.where(c2,B,E);o[1::2,0::2]=np.where(c3,Cc,E);o[1::2,1::2]=np.where(c4,D,E)
  return o.view(np.uint8).reshape(h*2,w*2,4)
def stretch8(t,sg,k):
  # 弯刀这种弯曲的刃不能复制中间带:把护手(x+y=sg)以外的刃沿对角线整体拉长 k 倍(在 8 倍放大图上做,再交给旋转)
  b=s2x(s2x(s2x(t)));O=int(math.ceil((k-1)*sg/2))+2;H=16+O;out=np.zeros((H*8,H*8,4),np.uint8);ug=sg/2
  for Y in range(H*8):
    for X in range(H*8):
      x=(X+.5)/8-O;y=(Y+.5)/8-O;u=(x+y)/2;v=(x-y)/2
      if u<ug:u=ug-(ug-u)/k
      sx=(u+v)*8;sy=(u-v)*8
      ix,iy=int(sx),int(sy)
      if 0<=ix<b.shape[1] and 0<=iy<b.shape[0] and sx>=0 and sy>=0:out[Y,X]=b[iy,ix]
  return out,O
def rot(a,gx,gy,ang,pre=False):
  b=a if pre else s2x(s2x(s2x(a)));K=8;out=np.zeros((WC,WC,4),np.uint8)
  ca,sa=math.cos(-ang),math.sin(-ang)
  for oy in range(WC):
    for ox in range(WC):
      dx=ox+.5-C;dy=oy+.5-C
      sx=(dx*ca-dy*sa+gx+.5)*K;sy=(dx*sa+dy*ca+gy+.5)*K
      ix,iy=int(math.floor(sx)),int(math.floor(sy))
      if 0<=ix<b.shape[1] and 0<=iy<b.shape[0]:out[oy,ox]=b[iy,ix]
  return out
atlas=Image.new('RGBA',(WC*N,WC*len(W)),(0,0,0,0));info={}
for r,(nm,sh,q,row,(gx,gy),s0,w,n,rc) in enumerate(W):
  t=np.array(Image.open(SRC+sh+'-weapons.png').convert('RGBA'))[row*16:row*16+16,q*16:q*16+16]
  t=recolor(t,rc)
  if w==0:big,o=stretch8(t,s0,n);pre=True;GX,GY=gx+o,gy+o;info[nm]='stretch x%.1f'%n
  else:
    big,o=lengthen(t,s0,w,n);pre=False;GX,GY=gx+o,gy+o
    ys,xs=np.nonzero(big[...,3]);info[nm]=round(max(math.hypot(x-GX,y-GY) for x,y in zip(xs,ys) if x+y<GX+GY),1)
  for k in range(N):
    th=k*2*math.pi/N;src=-3*math.pi/4;R=rot(big,GX,GY,th-src,pre)
    atlas.paste(Image.fromarray(R),(k*WC,r*WC))
atlas.save(os.path.join(D,'wpn_atlas.png'));print(json.dumps(info))
