# 狼人 / 沙暴巨蜥 / 海豹 像素图
# 素材:d36williams「Bloody Werewolf」(OpenGameArt,多授权可选,这里选 CC0)https://opengameart.org/content/bloody-werewolf
#      Monster Logix Studio「Pixel Bosses. Yes!」(CC0)https://opengameart.org/content/pixel-bosses-yes 里的独角蜥蜴
#      CFKaligula「Pico 8 Penguin/Arctic Arcade Stuff」(CC0)https://opengameart.org/node/70132 里的海豹
# 改动:狼人只取朝右的 4 帧走路,棕毛换成银灰;蜥蜴用拼好的整只 + 两种张嘴的头,紫色换成沙黄色(普通)和橙红色(狂暴),另存舌头和泡泡;
#      海豹取 4 帧游动,精英换成深蓝灰,追加进 mob 图集(S=2)
# 用法:python3 art_src/boss/build_bos.py <狼人图> <首领图> <企鹅海豹图> <输出 bos_atlas.png> <mob_atlas.png> <mob_meta.json>
import sys,json,colorsys
import numpy as np
from PIL import Image
WW,BS,PG,OUT,MA,MJ=sys.argv[1:7]
def recol(im,fn):
  a=np.array(im.convert('RGBA')).astype(float)
  for j in range(a.shape[0]):
    for i in range(a.shape[1]):
      if a[j,i,3]>0:a[j,i,:3]=fn(*a[j,i,:3])
  a[...,3]=np.where(a[...,3]>0,255,0);return Image.fromarray(a.astype(np.uint8),'RGBA')
def grad(cols,l):
  k=min(.999,max(0,l))*(len(cols)-1);n=int(k);u=k-n;c0,c1=cols[n],cols[n+1];return [c0[q]+(c1[q]-c0[q])*u for q in range(3)]
# 狼人:银灰毛,红色保留,衣服灰色压暗
SIL=[(46,52,66),(108,118,138),(176,188,206),(236,242,250)]
def wolfc(r,g,b):
  h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
  if r>150 and g<60:return (r,g,b)
  if s>.35 and .03<h<.17:return grad(SIL,v*1.45)
  return (r*.75,g*.75,b*.85)
ww=Image.open(WW).convert('RGBA');wolf=[recol(ww.crop((i*24,64,i*24+24,96)),wolfc) for i in range(4)]
# 蜥蜴
bs=Image.open(BS).convert('RGBA')
def lizc(pal):
  def f(r,g,b):
    h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
    if s>.25 and .55<h<.96:return grad(pal,v*.68+(.14 if b>200 and g>100 else 0))
    return (r,g,b)
  return f
SAND=[(60,38,16),(138,104,58),(201,160,106),(241,220,176)];RAGE=[(70,18,6),(138,47,15),(232,89,12),(255,192,120)]
comp=Image.new('RGBA',(94,24));comp.alpha_composite(bs.crop((362,272,456,292)),(0,4))
hB=bs.crop((337,199,367,222));hC=bs.crop((339,229,369,253))
def openf(h):
  f=comp.copy();a=np.array(f);a[:,:27]=0;f=Image.fromarray(a);f.alpha_composite(h,(0,1 if h.height<23 else 0));return f
hA=bs.crop((351,167,381,189));lz=[openf(hA),openf(hB),openf(hC)]
tongue=bs.crop((319,181,347,186));bub=[bs.crop(b) for b in [(343,120,349,127),(352,116,362,127),(367,111,381,127),(389,111,403,127),(406,111,420,127),(423,111,437,127)]]
# 海豹
pg=Image.open(PG).convert('RGBA');seal=[pg.crop((i*32,33,i*32+32,50)) for i in range(4)]
DS=lambda r,g,b:(r*.62,g*.68,b*.9)
# 图集:第 0 行狼人 4 帧(24×32);第 1 行蜥蜴沙色 3 帧(94×24);第 2 行狂暴 3 帧;第 3 行舌头 + 6 个泡泡(16×16 格)
at=Image.new('RGBA',(300,32+24+24+16))
for i,f in enumerate(wolf):at.alpha_composite(f,(i*24,0))
for r,pal in enumerate((SAND,RAGE)):
  for i,f in enumerate(lz):at.alpha_composite(recol(f,lizc(pal)),(i*94,32+r*24))
at.alpha_composite(tongue,(0,80))
for i,b in enumerate(bub):at.alpha_composite(b,(28+i*16+(16-b.width)//2,80+(16-b.height)//2))
at.save(OUT,optimize=True)
# 海豹追加进 mob 图集
A=Image.open(MA).convert('RGBA');meta=json.load(open(MJ))
for k in('seal','seal2'):meta.pop(k,None)
H=max(r[0]+v['h'] for v in meta.values() for r in v['A'].values());A=A.crop((0,0,A.width,H));rows=[];y=H
fr={'seal':seal,'seal2':[recol(f,DS) for f in seal]}
for k,fs in fr.items():
  bb=None
  for f in fs:
    b=f.getbbox();bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
  w,h=bb[2]-bb[0],bb[3]-bb[1];m={'w':w,'h':h,'ax':round(w/2),'S':2,'fl':1,'A':{}}
  for a,ix,fps in (('idle',[0,1],3),('walk',[0,1,2,3],8),('atk',[1,2],8),('hit',[3],4)):
    row=Image.new('RGBA',(w*len(ix),h))
    for n,i in enumerate(ix):row.alpha_composite(fs[i].crop(bb),(n*w,0))
    rows.append((row,y));m['A'][a]=[y,len(ix),fps];y+=h
  meta[k]=m
out=Image.new('RGBA',(max(A.width,max(r.width for r,_ in rows)),y));out.alpha_composite(A,(0,0))
for r,yy in rows:out.alpha_composite(r,(0,yy))
out.save(MA,optimize=True);json.dump(meta,open(MJ,'w'),separators=(',',':'));print('ok',at.size,out.size)
