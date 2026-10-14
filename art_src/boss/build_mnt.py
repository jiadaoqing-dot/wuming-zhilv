# 第一关首领「铁角牛魔」像素图集(MNT):Animated Minotaur(Calciumtrice,CC-BY 3.0)
# 原图 raw/boss1/minotaur_calciumtrice.png:48×48 一格,10 列 × 5 行 = 待机 / 示威 / 走路 / 挥锤攻击 / 倒下,原图面朝左
# 改动:水平翻转成面朝右,Scale3x 放大 3 倍(144×144 一格,脚底中心 = (72,144)),其余不变
# 用法:python art_src/boss/build_mnt.py  → assets/mnt_atlas.png
import os,sys
from PIL import Image
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def scale3x(im):   # 同 art_src/town/build_tpx.py
  w,h=im.size;s=im.load();o=Image.new('RGBA',(w*3,h*3));d=o.load()
  P=lambda x,y:s[min(w-1,max(0,x)),min(h-1,max(0,y))]
  for y in range(h):
    for x in range(w):
      A,B,C,D_,E,F,G,H,I=P(x-1,y-1),P(x,y-1),P(x+1,y-1),P(x-1,y),P(x,y),P(x+1,y),P(x-1,y+1),P(x,y+1),P(x+1,y+1)
      e=[E]*9
      if B!=H and D_!=F:
        e[0]=D_ if D_==B else E;e[1]=B if (D_==B and E!=C) or (B==F and E!=A) else E;e[2]=F if B==F else E
        e[3]=D_ if (D_==B and E!=G) or (D_==H and E!=A) else E;e[5]=F if (B==F and E!=I) or (H==F and E!=C) else E
        e[6]=D_ if D_==H else E;e[7]=H if (D_==H and E!=I) or (H==F and E!=G) else E;e[8]=F if H==F else E
      for k in range(9):d[x*3+k%3,y*3+k//3]=e[k]
  return o
src=Image.open(D+'/raw/boss1/minotaur_calciumtrice.png').convert('RGBA')
C=48;S=3;out=Image.new('RGBA',(10*C*S,5*C*S))
for r in range(5):
  for c in range(10):
    f=src.crop((c*C,r*C,c*C+C,r*C+C)).transpose(Image.FLIP_LEFT_RIGHT)
    out.paste(scale3x(f),(c*C*S,r*C*S))
out.save(D+'/assets/mnt_atlas.png',optimize=True);print('mnt_atlas',out.size,os.path.getsize(D+'/assets/mnt_atlas.png'))
