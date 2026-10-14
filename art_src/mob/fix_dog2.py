# 双头狗(dog2)在雪地上看不清:给 mob_atlas.png 里 dog2 那几行(y 1760~1948)加深色描边、整体压暗一档
# 只需运行一次(重复运行会跳过:检测到描边色就退出)。build_dog2.py 重新生成图集后要再跑一次
# 用法:python art_src/mob/fix_dog2.py
import os
import numpy as np
from PIL import Image
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));P=D+'/assets/mob_atlas.png'
OL=(20,28,52)
im=Image.open(P).convert('RGBA');a=np.array(im);r=a[1760:1948]
if ((r[...,0]==OL[0])&(r[...,1]==OL[1])&(r[...,2]==OL[2])&(r[...,3]==255)).any():print('已经处理过,跳过');raise SystemExit
m=r[...,3]>0
r[m,:3]=(r[m,:3].astype(float)*[.78,.82,.9]).astype('uint8')   # 压暗,偏钢蓝
# 每一帧单独描边(按格子 49 宽,避免描到相邻帧)
for y0,n in [(0,6),(47,12),(94,5),(141,1)]:
  for i in range(n):
    c=r[y0:y0+47,i*49:i*49+49];mm=c[...,3]>0;e=np.zeros_like(mm)
    e[1:]|=mm[:-1];e[:-1]|=mm[1:];e[:,1:]|=mm[:,:-1];e[:,:-1]|=mm[:,1:];e&=~mm
    c[e]=OL+(255,)
a[1760:1948]=r;Image.fromarray(a).save(P,optimize=True);print('ok')
