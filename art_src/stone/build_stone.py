# 强化石像素图标(自绘):4 级 × 4 品质,每格 16×16;级别越高宝石越大(10 / 12 / 14 / 16 宽),品质换颜色
#   品质:普通 = 蓝白 · 精良 = 绿 · 史诗 = 紫 · 卓越 = 金黄;光芒由游戏运行时按品质画(品质越高越亮)
# 用法:python art_src/stone/build_stone.py <输出 png>   图集 64×64:列 = 等级 1~4,行 = 品质 0~3
import sys
from PIL import Image
PAL=[['#22365c','#5f8fcf','#a9cdf5','#dcefff','#ffffff'],['#174a24','#2b8a3e','#51cf66','#b2f2bb','#ffffff'],
     ['#371556','#862e9c','#cc5de8','#eebefa','#ffffff'],['#5a3800','#d9480f','#fab005','#ffe066','#ffffff']]
hx=lambda h:tuple(int(h[i:i+2],16) for i in (1,3,5))+(255,)
def gem(w,pal):
  # 宝石:上面梯形冠部(高 h1)+ 下面倒三角亭部(高 h2);左半亮、右半暗,冠部顶面最亮,左上一个高光
  O,D,M,L,H=[hx(c) for c in pal];h1=max(3,w//3);h2=round(w*.62);im=Image.new('RGBA',(16,16));px=im.load()
  ox=(16-w)//2;oy=(16-(h1+h2))//2;rows=[]
  for j in range(h1):                       # 冠部:从 w-2*(h1-j) 宽到 w 宽
    ww=w-2*(h1-1-j);rows.append(ww)
  for j in range(h2):                       # 亭部:从 w 收到 1
    ww=max(1,round(w*(1-(j+1)/h2)));rows.append(ww if ww%2==w%2 else ww+1)
  for j,ww in enumerate(rows):
    y=oy+j;a=ox+(w-ww)//2
    for i in range(ww):
      xx=a+i
      if i==0 or i==ww-1 or j==0 or j==len(rows)-1:c=O
      elif j<h1:c=L if j==1 else (M if i<ww/2 else D)
      else:c=M if i<ww*0.45 else (L if abs(i-ww/2)<1 else D)
      px[xx,y]=c
  if w>=12:px[ox+3,oy+2]=H;px[ox+4,oy+2]=H
  else:px[ox+2,oy+1]=H
  return im
at=Image.new('RGBA',(64,64))
for q in range(4):
  for lv,w in enumerate((10,12,14,16)):at.alpha_composite(gem(w,PAL[q]),(lv*16,q*16))
at.save(sys.argv[1]);print('stone',at.size)
