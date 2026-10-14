# 黑棘巨蝎(第四关首领)像素图:madameberry「Scorpy Scorp」(CC0,https://opengameart.org/content/scorpy-scorp-side-scroller-enemy)
# 改动:原尺寸(小怪是缩小一半),按亮度映射成暗紫黑 → 暗红高光;第 0 行走路 4 帧,第 1 行攻击 3 帧,格子按并集裁切,脚底 = 底边
# 用法:python3 art_src/boss/build_scob.py <sco_a.gif> <sco_b.gif> <输出 png>
import sys,json
from PIL import Image
A,Bp,OUT=sys.argv[1:4]
def gif(p):
  im=Image.open(p);fr=[]
  for i in range(im.n_frames):im.seek(i);fr.append(im.convert('RGBA'))
  return fr
C=[(8,5,12),(26,20,36),(58,44,74),(140,40,52),(236,110,100)]
def gmap(im):
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a<110:p[i,j]=(0,0,0,0);continue
      l=min(.999,(r*.3+g*.59+b*.11)/255*1.05);k=l*(len(C)-1);n=int(k);u=k-n;c0,c1=C[n],C[n+1]
      p[i,j]=tuple(int(c0[q]+(c1[q]-c0[q])*u) for q in range(3))+(255,)
  return im
walk=[gmap(f) for f in gif(Bp)];atk=[gmap(f) for f in gif(A)]
bb=None
for f in walk+atk:
  b=f.getbbox();bb=b if not bb else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
w,h=bb[2]-bb[0],bb[3]-bb[1];o=Image.new('RGBA',(w*4,h*2))
for i,f in enumerate(walk):o.alpha_composite(f.crop(bb),(i*w,0))
for i,f in enumerate(atk):o.alpha_composite(f.crop(bb),(i*w,h))
o.save(OUT,optimize=True);print(json.dumps({'w':w,'h':h}))
