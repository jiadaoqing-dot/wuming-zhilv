# 怪物 / 首领特效图集(第三张特效图,VFX 里 im:3)
# 素材:Magic Pack 9(ansimuz,可商用、可修改、可再分发,署名非必须)· Pixel Art Spells(DevWizard,CC0)
#      Ardentryst Magic Sprite Effects(Elle Trudgett,CC-BY 3.0):缩小、透明度阈值化(像素化)、毒液溅射换成绿色
# 用法:python3 art_src/bfx/build_bfx.py <素材根目录> <输出 png> <输出 json>
import sys,json,glob,colorsys
from PIL import Image
R,OUT,OJ=sys.argv[1:4]
MP=R+'/3f6b36d7-magic_pack_9_files/Magic Pack 9 files/sprites/';DW=R+'/8a632464-pixelart_spells/Pixelart Spells/PNG Files/';AR=R+'/ardentryst/Ardentryst-MagicSpriteEffects_v2/'
def L(p):return Image.open(p).convert('RGBA')
def strip(p,fw,fh=None):
  im=L(p);fh=fh or im.height;return [im.crop((i*fw,0,i*fw+fw,fh)) for i in range(im.width//fw)]
def seq(d,n,a,b):return [L(f'{MP}{d}/{n}{i}.png') for i in range(a,b+1)]
def thr(im,t=90,sc=None):
  if sc:im=im.resize((max(1,round(im.width*sc)),max(1,round(im.height*sc))),Image.LANCZOS)
  p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j];p[i,j]=(r,g,b,0) if a<t else (r,g,b,255 if a>200 else 170)
  return im
def hue(im,h,sm=1.):
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a:hh,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);r,g,b=colorsys.hsv_to_rgb(h,min(1,s*sm),v);p[i,j]=(int(r*255),int(g*255),int(b*255),a)
  return im
def gmap(im,cols):
  # 按亮度映射到渐变色(暗影法球原本接近纯黑,在夜晚关卡里看不清,换成紫色调)
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a:
        l=min(1,(r*.3+g*.59+b*.11)/255*2.2+.15);k=l*(len(cols)-1);n=min(int(k),len(cols)-2);u=k-n;c0,c1=cols[n],cols[n+1]
        p[i,j]=tuple(int(c0[q]+(c1[q]-c0[q])*u) for q in range(3))+(a,)
  return im
PU=[(40,10,70),(110,40,190),(200,120,255),(250,225,255)]
# 名字:[帧, 锚点(相对原帧), 帧率, 循环]
items=[
 ('b-dorb',[gmap(f,PU) for f in strip(DW+'Darkness Orb.png',16)],(8,8),12,True),
 ('b-dbolt',[gmap(f,PU) for f in strip(DW+'Darkness Bolt.png',16)],(8,8),12,True),
 ('b-darkhit',seq('DarkBolt','Dark-Bolt',6,11),(32,80),18,False),
 ('b-firebomb',seq('FireBomb','Fire-bomb',8,15),(32,40),18,False),
 ('b-spark',seq('spark','spark',1,8),(16,16),18,False),
 ('b-light',seq('Lightning','Lightning',1,11),(32,124),20,False),
 ('b-shield',strip(DW+'Pixelart Shield.png',48),(24,24),10,True),
 ('b-vsplash',[hue(f,.3,1.2) for f in strip(DW+'Splash.png',32)],(16,24),16,False),
 ('b-slime',[thr(L(AR+'Ardentryst-slimeball.png'),90,.8)],(13,13),1,True),
 ('b-gas',[thr(L(AR+'Ardentryst-poisongas.png'),60,.3)],(36,24),1,True),
 ('b-ice',[thr(L(AR+'Ardentryst-ice2.png'),70,.5)],(20,20),1,True),
 ('b-icel',strip(DW+'Ice Lance.png',16),(8,8),10,True),
 ('b-iorb',[hue(f,.55,.6) for f in strip(DW+'Water Orb.png',16)],(8,8),12,True),
 ('b-flame',[thr(L(AR+f'Ardentryst-m_fire1_{i}.png'),90) for i in range(1,6)],(11,34),12,True),
]
rows=[];meta={};y=0
for n,fr,pv,fps,loop in items:
  bb=None
  for f in fr:
    b=f.getbbox()
    if b:bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
  w,h=bb[2]-bb[0],bb[3]-bb[1];row=Image.new('RGBA',(w*len(fr),h))
  for i,f in enumerate(fr):row.alpha_composite(f.crop(bb),(i*w,0))
  meta[n]={'y':y,'w':w,'h':h,'n':len(fr),'px':pv[0]-bb[0],'py':pv[1]-bb[1],'fps':fps,'loop':loop,'im':3};rows.append(row);y+=h
W=max(r.width for r in rows);at=Image.new('RGBA',(W,y));yy=0
for r in rows:at.alpha_composite(r,(0,yy));yy+=r.height
at.save(OUT,optimize=True);json.dump(meta,open(OJ,'w'),separators=(',',':'));print(at.size,{k:(v['w'],v['h'],v['n']) for k,v in meta.items()})
