# 法师技能特效图集 MG27(2026-10-14 第二十七轮补充:火球魔法图腾、圣光禁域、火鸟图腾激光、苍穹光柱)
# 素材(都是 CC0):
#   4 summoning circles(Luke.RUSTLTD,CC0)https://opengameart.org/content/4-summoning-circles
#     raw/skfx/summoning_circles/circle4~7.png(1000×1000 黑色线稿)
#   Lasers and beams(Rawdanitsu,CC0)https://opengameart.org/content/lasers-and-beams
#     raw/skfx/beams_rawdanitsu/beams.png
# 改动:法阵线稿加粗后缩到 112×112,透明度分 4 档,按亮度上色(火 = 橙、金 = 金黄、蓝 = 天蓝)并加一圈外发光;
#   激光 / 光柱:取红色 / 蓝色光弹最宽处的一条横截面,缩小后沿长度方向平铺成可以任意拉长的光束段
# 用法:python art_src/skfx/build_mg27.py <raw/skfx> <输出 png>,打印 meta(贴进源码 MG27.M)
import sys,json
from PIL import Image,ImageFilter
import numpy as np
RAW,OUT=sys.argv[1],sys.argv[2]
S=112
def hx(c):return np.array([int(c[i:i+2],16) for i in (1,3,5)],float)
def circle(n,core,mid,glow):
    a=Image.open(f'{RAW}/summoning_circles/circle{n}.png').convert('L').point(lambda v:255-v)  # 白底黑线 → 线条当透明度
    a=a.filter(ImageFilter.MaxFilter(11)).resize((S,S),Image.BOX)
    A=np.array(a,float)/255;A=np.clip(A*1.6,0,1);Q=np.round(A*4)/4          # 4 档透明度
    G=np.array(Image.fromarray((A*255).astype('uint8')).filter(ImageFilter.GaussianBlur(3)),float)/255
    G=np.round(np.clip(G*1.4,0,1)*3)/3*.55                                   # 外发光 3 档
    out=np.zeros((S,S,4));c0,c1,c2=hx(core),hx(mid),hx(glow)
    core=np.array(Image.fromarray((Q>.9).astype('uint8')*255).filter(ImageFilter.MinFilter(3)),float)>0  # 粗线条的中心才用最亮色
    col=np.where(core[...,None],c0,c1)
    al=np.maximum(Q,G);rgb=np.where(Q[...,None]>0,col,c2)
    out[...,:3]=rgb;out[...,3]=al*255
    return Image.fromarray(out.astype('uint8'),'RGBA')
def beam(box,horiz,th,ln):
    im=Image.open(f'{RAW}/beams_rawdanitsu/beams.png').convert('RGBA');x,y,w,h=box
    if horiz:  # 竖着的光弹:取中间一行(横截面)→ 转成竖条当激光的厚度方向
        row=im.crop((x,y+h//2,x+w,y+h//2+1)).resize((th,1),Image.BOX).rotate(90,expand=True)  # 1×th
        return row.resize((ln,th),Image.NEAREST)
    row=im.crop((x,y+h//2,x+w,y+h//2+1)).resize((th,1),Image.BOX)
    return row.resize((th,ln),Image.NEAREST)
parts=[('mc-fire',circle(7,'#fff3bf','#ffa94d','#ff6b35')),('mc-gold',circle(6,'#fffbe6','#ffd43b','#f59f00')),('mc-blue',circle(4,'#e7f5ff','#74c0fc','#1c7ed6')),
       ('bm-red',beam((208,308,52,94),1,18,64)),('bm-blue',beam((300,30,58,106),0,40,16))]
W=max(p.width for _,p in parts);H=sum(p.height for _,p in parts)
at=Image.new('RGBA',(W,H));M={};y=0
for k,p in parts:
    at.paste(p,(0,y));M[k]={'y':y,'w':p.width,'h':p.height,'n':1,'px':p.width//2,'py':p.height//2,'fps':12,'loop':False,'im':6};y+=p.height
at.save(OUT);print(json.dumps(M,separators=(',',':')))
