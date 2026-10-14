# 企鹅像素精灵(追加到 mob_atlas.png / mob_meta.json 末尾;重复运行会先删掉旧的 pen / pen2 行)
# 素材:Segel「Cute Penguin Character」(OpenGameArt,CC0)https://opengameart.org/node/182737
# 改动:缩小到约 44 像素高、阈值化透明度、减色;精英企鹅(pen2)换成深红色并放大一点
# 用法:python3 art_src/mob/build_pen.py <企鹅素材 NUDE 目录> <mob_atlas.png> <mob_meta.json>
import sys,json,glob,colorsys
from PIL import Image
R,AT,MJ=sys.argv[1:4]
def seq(sub):return [Image.open(f).convert('RGBA') for f in sorted(glob.glob(R+'/'+sub+'/*.png'))]
def px(im,sc,shift=None):
  w,h=round(im.width*sc),round(im.height*sc);im=im.resize((w,h),Image.LANCZOS);p=im.load()
  for j in range(h):
    for i in range(w):
      r,g,b,a=p[i,j]
      if a<100:p[i,j]=(0,0,0,0);continue
      if shift and b>r+25 and b>g:  # 只给蓝色羽毛换色
        hh,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);r2,g2,b2=colorsys.hsv_to_rgb(shift[0],min(1,s*shift[1]),v*shift[2]);r,g,b=int(r2*255),int(g2*255),int(b2*255)
      p[i,j]=(r,g,b,255)
  return im
A={'idle':(seq('01-Idle/02-Idle_Blink'),8),'walk':(seq('03-Walk'),14),'hit':(seq('07-Hurt/01-Hurt')[:4],12),
   'atk':(seq('06-Jump/03-Jump_Throw')[2:7],12),'th':(seq('02-Throw'),14),'wind':(seq('06-Jump/01-Jump_Up')[:2],6),
   'dz':(seq('07-Hurt/02-Hurt_Dizzy'),12),'slide':([f.transpose(Image.FLIP_LEFT_RIGHT) for f in seq('08-Dead')[7:10]],8)}
at=Image.open(AT).convert('RGBA');meta=json.load(open(MJ))
# 去掉旧的企鹅行
old=[v['A'] for k,v in meta.items() if k in('pen','pen2')]
for k in ('pen','pen2'):meta.pop(k,None)
H=max([0]+[r[0]+v['h'] for v in meta.values() for r in v['A'].values()]);at=at.crop((0,0,at.width,H))
rows=[];y=H
for k,sc,sh in (('pen',.083,None),('pen2',.097,(0.98,1.1,.8))):
  fr={a:[px(f,sc,sh) for f in fs] for a,(fs,_) in A.items()}
  bb=None
  for fs in fr.values():
    for f in fs:
      b=f.getbbox();bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
  ib=None
  for f in fr['idle']:
    b=f.getbbox();ib=b if not ib else (min(ib[0],b[0]),min(ib[1],b[1]),max(ib[2],b[2]),max(ib[3],b[3]))
  w,h=bb[2]-bb[0],bb[3]-bb[1];m={'w':w,'h':h,'ax':round((ib[0]+ib[2])/2-bb[0]),'S':1,'fl':1,'A':{}}
  for a,fs in fr.items():
    row=Image.new('RGBA',(w*len(fs),h))
    for i,f in enumerate(fs):row.alpha_composite(f.crop(bb),(i*w,0))
    rows.append((row,y));m['A'][a]=[y,len(fs),A[a][1]];y+=h
  meta[k]=m
W=max([at.width]+[r.width for r,_ in rows]);out=Image.new('RGBA',(W,y));out.alpha_composite(at,(0,0))
for r,yy in rows:out.alpha_composite(r,(0,yy))
out.save(AT,optimize=True);json.dump(meta,open(MJ,'w'),separators=(',',':'));print('atlas',out.size,{k:(meta[k]['w'],meta[k]['h']) for k in('pen','pen2')})
