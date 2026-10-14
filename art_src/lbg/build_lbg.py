# 关卡像素背景图集(LBG):每关若干视差图层,一层一行叠在图集里;meta 记录 [图集 y, 宽, 高, 放大倍数, 屏幕底边 y, 视差系数, 自动飘移速度]
# 素材(全部 CC0,除注明):
#  一关 ansimuz「Mountain at Dusk」· 二关 ansimuz「Gothicvania Night Town」(色相转成紫色)· 三关 ansimuz「Forest Background」
#  四关 ansimuz「Gothicvania Swamp」· 五关 GrafxKid「Rocky Roads」天空 + 山 / 树换成沙色当远山和沙丘
#  六关 CraftPix「Winter Pixel Art Background With Mountain」(OGA-BY 3.0)· 七关 同上调成夜色 + dlsxjvb1「Dark winter background」的枯树雾气层(调成蓝色、减色)
# 用法:python3 art_src/lbg/build_lbg.py <素材目录 bg> <用户贴的枯树图> <输出 png> <输出 json>
import sys,json,colorsys
import numpy as np
from PIL import Image
R,TREES,OUT,OJ=sys.argv[1:5]
L=lambda p:Image.open(R+'/'+p).convert('RGBA')
def hue(im,dh,sm=1.,vm=1.):
  a=np.array(im).astype(float)/255;out=a.copy()
  for j in range(a.shape[0]):
    for i in range(a.shape[1]):
      if a[j,i,3]>0:
        h,s,v=colorsys.rgb_to_hsv(*a[j,i,:3]);out[j,i,:3]=colorsys.hsv_to_rgb((h+dh)%1,min(1,s*sm),min(1,v*vm))
  return Image.fromarray((out*255).astype(np.uint8),'RGBA')
def flat(im,col):
  a=np.array(im);m=a[...,3]>0;a[m,:3]=col;return Image.fromarray(a,'RGBA')
def night(im):
  a=np.array(im).astype(float);l=(a[...,0]*.3+a[...,1]*.59+a[...,2]*.11)/255
  pal=np.array([[14,18,40],[38,48,92],[78,96,150],[150,172,214],[214,226,246]],float)
  k=np.clip(l*1.05,0,.999)*(len(pal)-1);n=k.astype(int);u=(k-n)[...,None]
  a[...,:3]=pal[n]+(pal[np.minimum(n+1,len(pal)-1)]-pal[n])*u;return Image.fromarray(a.astype(np.uint8),'RGBA')
def hcat(*ims):
  w=sum(i.width for i in ims);o=Image.new('RGBA',(w,max(i.height for i in ims)));x=0
  for i in ims:o.alpha_composite(i,(x,0));x+=i.width
  return o
G='jra/ansimuz-gothicvania-collection/2D/fantasy/night-town-background-files/layers/night-town-background-'
M='parallax_mountain_pack/parallax_mountain_pack/layers/parallax-mountain-'
F='parallax_forest_pack/parallax_forest_pack/layers/parallax-forest-'
SW='gothicvania_swamp_files/Gothicvania Swamp files/Evironment/'
RR='jra/grafxkid-rocky-roads/2D/platformer/Backgrounds/'
CW='winter_pixel_art_background_with_mountain/Plan '
# 枯树雾气层:亮度当透明度,减成 4 级,蓝白色
t=Image.open(TREES).convert('L');t=t.resize((t.width*3//5,t.height*3//5),Image.LANCZOS);a=np.array(t).astype(float)
al=np.clip((a-30)/150,0,1);al=np.round(al*4)/4;col=np.array([170,190,230],float)
tr=np.zeros(a.shape+(4,),np.uint8);tr[...,:3]=col;tr[...,3]=(al*235).astype(np.uint8);trees=Image.fromarray(tr,'RGBA')
trees=trees.crop(trees.getbbox() or (0,0,1,1))
NT=lambda n:hue(L(G+n+'.png'),.2,1.1)
# 每关:sky 是静态铺满的天空(宽度拉伸),layers 从远到近 [图, 放大, 屏幕底边 y, 视差, 飘移]
LV={
 1:dict(sky=L(M+'bg.png'),sk=2,layers=[(L(M+'montain-far.png'),2,312,.08,0),(L(M+'mountains.png'),2,312,.18,0),(L(M+'trees.png'),2,312,.35,0),(L(M+'foreground-trees.png'),2,318,.55,0)]),
 2:dict(sky=NT('sky'),sk=2,layers=[(NT('clouds'),2,306,.04,4),(NT('mountains'),2,300,.1,0),(NT('mountains-lights'),2,300,.1,0),(NT('far-buildings'),2,262,.22,0),(NT('forest'),2,306,.32,0),(NT('town'),2,306,.45,0)]),
 3:dict(sky=L(F+'back-trees.png'),sk=2,par=.06,layers=[(L(F+'lights.png'),2,318,.12,0),(L(F+'middle-trees.png'),2,318,.25,0),(L(F+'front-trees.png'),2,318,.5,0)]),
 4:dict(sky=None,top=(47,47,28),layers=[(hcat(L(SW+'mid-layer-01.png'),L(SW+'mid-layer-02.png')),2,318,.18,0),(L(SW+'trees.png'),2,318,.42,0)]),
 5:dict(sky=L(RR+'desert_a.png'),sk=2,layers=[(L(RR+'clouds.png').point(lambda v:v) ,2,200,.03,3),(flat(L(RR+'mountains_b.png'),(214,138,74)),2,292,.12,0),(flat(L(RR+'mountains_a.png'),(232,164,96)),2,300,.2,0),(flat(L(RR+'trees.png'),(240,190,120)),2,304,.32,0)]),
 6:dict(sky=L(CW+'5.png'),sk=1,ss=1.12,layers=[(L(CW+'4.png'),1,330,.02,5),(L(CW+'3.png'),1,330,.1,0),(L(CW+'2.png'),1,330,.22,0),(L(CW+'1.png'),1,330,.4,0)]),
 7:dict(sky=None,vsky=1,layers=[(night(L(CW+'3.png')),1,330,.08,0),(night(L(CW+'2.png')),1,330,.2,0),(trees,1,312,.32,0),(night(L(CW+'1.png')),1,330,.45,0)]),
}
# 云层只保留半透明白(沙漠云)
c5=np.array(LV[5]['layers'][0][0]);c5[...,3]=(c5[...,3]>0)*150;LV[5]['layers'][0]=(Image.fromarray(c5,'RGBA'),)+LV[5]['layers'][0][1:]
rows=[];meta={};y=0
def put(im):
  global y;bb=im.getbbox() or (0,0,1,1);top=bb[1];im2=im.crop((0,top,im.width,bb[3]));rows.append((im2,y));r=(y,im2.width,im2.height,top,im.height);y+=im2.height;return r
for lv,d in LV.items():
  m={'layers':[]}
  if d.get('sky') is not None:
    r=put(d['sky']);m['sky']=[r[0],r[1],r[2],d['sk'],d.get('ss',1),d.get('par',0)]
  if d.get('top'):m['top']='rgb(%d,%d,%d)'%d['top']
  if d.get('vsky'):m['vsky']=1
  for im,sc,bot,par,dr in d['layers']:
    r=put(im);# 屏幕底边 = bot,裁掉顶部空白后修正
    m['layers'].append([r[0],r[1],r[2],sc,bot-(r[4]-r[3]-r[2])*sc,par,dr])
  meta[lv]=m
W=max(r.width for r,_ in rows);at=Image.new('RGBA',(W,y))
for r,yy in rows:at.alpha_composite(r,(0,yy))
at.save(OUT,optimize=True);json.dump(meta,open(OJ,'w'),separators=(',',':'));print(at.size)
