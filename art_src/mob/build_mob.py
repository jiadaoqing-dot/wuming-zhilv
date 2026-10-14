# 怪物像素图集(小怪):每种怪一组行(idle / walk / atk / hit),格子按这种怪所有帧的并集裁切;脚底 = 格子底边
# 素材:Calciumtrice「Animated Slime / Animated Snake」(CC-BY 3.0)· Admurin「Enemy Galore I」蝙蝠 / 灰狼(CC-BY 4.0)
#      Redshrike & William.Thompsonj「[LPC] Spider」(OGA-BY 3.0)· madameberry「Scorpy Scorp」(CC0,缩小 + 换色)
#      ULPC 骷髅身体 + 骷髅头(bluecarrot16、Napsio、JaidynReiman、wulax、Redshrike,OGA-BY 3.0)
# 用法:python3 art_src/mob/build_mob.py <上传素材目录> <ULPC spritesheets 目录> <输出 png> <输出 json>
import sys,json,colorsys
from PIL import Image
U,LP,OUT,OJ=sys.argv[1:5]
def L(p):return Image.open(p).convert('RGBA')
def grid(im,fw,fh,idx,cols=None):
  cols=cols or im.width//fw;return [im.crop((i%cols*fw,i//cols*fh,i%cols*fw+fw,i//cols*fh+fh)) for i in idx]
def gif(p):
  im=Image.open(p);fr=[]
  for i in range(im.n_frames):im.seek(i);fr.append(im.convert('RGBA'))
  return fr
def thr(im):
  p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j];p[i,j]=(r,g,b,255 if a>=110 else 0)
  return im
def gmap(im,cols):
  # 按亮度映射到渐变色(保留明暗,统一换色)
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a:
        l=min(1,(r*.3+g*.59+b*.11)/255*1.35);k=l*(len(cols)-1);n=min(int(k),len(cols)-2);u=k-n;c0,c1=cols[n],cols[n+1]
        p[i,j]=tuple(int(c0[q]+(c1[q]-c0[q])*u) for q in range(3))+(a,)
  return im
YC=[(40,24,8),(150,96,24),(232,184,64),(255,244,180)];BC=[(10,8,16),(44,36,56),(96,84,112),(190,180,200)]
def half(im):return thr(im.resize((im.width//2,im.height//2),Image.LANCZOS))
def tint(im,dh,ds,dv):
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a:h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);r,g,b=colorsys.hsv_to_rgb((h+dh)%1,min(1,s*ds),min(1,v*dv));p[i,j]=(int(r*255),int(g*255),int(b*255),a)
  return im
EG=U+'/56b06586-enemy_galore_i/'
sl=L(U+'/slime.png');sn=L(U+'/snake.png')
bat=(L(EG+'Bat/Bat_Fly.png'),L(EG+'Bat/Bat_Attack.png'),L(EG+'Bat/Bat_Hit.png'))
dg=lambda n:L(EG+f'Canines/Canine_Gray_{n}.png')
sp=L(U+'/723d0d99-LPC_Spiders/LPC_Spiders/spider01.png')
sw=[half(f) for f in gif(U+'/sco_b.gif')];ss=[half(f) for f in gif(U+'/sco_a.gif')]
sk=lambda a:Image.alpha_composite(L(f'{LP}/body/bodies/skeleton/{a}.png'),L(f'{LP}/head/heads/skeleton/adult/{a}.png'))
# 每种怪:动画 → [帧列表, fps];S = 画面放大倍数(整数,画在 640×360 像素层);fl = 素材朝左
K={
 'slime':dict(S=2,fl=0,A={'idle':[grid(sl,32,32,range(0,10)),8],'walk':[grid(sl,32,32,range(20,30)),12],'atk':[grid(sl,32,32,range(30,40)),14],'hit':[grid(sl,32,32,range(40,42)),8]}),
 'snake':dict(S=2,fl=1,A={'idle':[grid(sn,32,32,range(0,10)),8],'walk':[grid(sn,32,32,range(20,30)),12],'atk':[grid(sn,32,32,range(30,40)),16],'hit':[grid(sn,32,32,range(40,42)),8]}),
 'bat':dict(S=1,fl=1,A={'idle':[grid(bat[0],64,64,range(4)),10],'walk':[grid(bat[0],64,64,range(4)),12],'atk':[grid(bat[1],64,64,range(7)),14],'hit':[grid(bat[2],64,64,range(5)),12]}),
 'dog':dict(S=1,fl=1,A={'idle':[grid(dg('Idle'),48,32,range(4)),6],'walk':[grid(dg('Run'),48,32,range(6)),12],'atk':[grid(dg('Attack'),48,32,range(7)),14],'hit':[grid(dg('Hit'),48,32,range(4)),12]}),
 'spi':dict(S=1,fl=0,A={'idle':[grid(sp,64,64,[34,34]),2],'walk':[grid(sp,64,64,range(34,40)),12],'atk':[grid(sp,64,64,range(30,34)),12],'hit':[grid(sp,64,64,[30]),4]}),
 'ysco':dict(S=1,fl=1,A={'idle':[[gmap(f,YC) for f in sw[:1]],2],'walk':[[gmap(f,YC) for f in sw],8],'atk':[[gmap(f,YC) for f in ss],10],'hit':[[gmap(f,YC) for f in ss[:1]],4]}),
 'bsco':dict(S=1,fl=1,A={'idle':[[gmap(f,BC) for f in sw[:1]],2],'walk':[[gmap(f,BC) for f in sw],8],'atk':[[gmap(f,BC) for f in ss],10],'hit':[[gmap(f,BC) for f in ss[:1]],4]}),
 'skel':dict(S=1,fl=0,A={'idle':[grid(sk('idle'),64,64,[6,7],2),3],'walk':[grid(sk('walk'),64,64,range(28,36),9),12],'atk':[grid(sk('slash'),64,64,range(18,24),6),14],'hit':[grid(sk('walk'),64,64,[27],9),4]}),
}
rows=[];meta={};y=0
for k,d in K.items():
  fr=[f for a in d['A'].values() for f in a[0]];bb=None
  for f in fr:
    b=f.getbbox()
    if b:bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
  w,h=bb[2]-bb[0],bb[3]-bb[1]
  ib=None
  for f in d['A']['idle'][0]:
    b=f.getbbox();ib=b if not ib else (min(ib[0],b[0]),min(ib[1],b[1]),max(ib[2],b[2]),max(ib[3],b[3]))
  ax=(ib[0]+ib[2])/2-bb[0];m={'w':w,'h':h,'ax':round(ax),'S':d['S'],'fl':d['fl'],'A':{}}
  for a,(fs,fps) in d['A'].items():
    row=Image.new('RGBA',(w*len(fs),h))
    for i,f in enumerate(fs):row.alpha_composite(f.crop(bb),(i*w,0))
    rows.append((row,y));m['A'][a]=[y,len(fs),fps];y+=h
  meta[k]=m
W=max(r.width for r,_ in rows);out=Image.new('RGBA',(W,y))
for r,yy in rows:out.alpha_composite(r,(0,yy))
out.save(OUT);json.dump(meta,open(OJ,'w'),separators=(',',':'));print('mob',out.size,{k:(v['w'],v['h']) for k,v in meta.items()})
