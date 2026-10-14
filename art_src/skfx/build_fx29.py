# 第二十九轮特效图集 FX29(2026-10-14):怪物飞弹换成花样特效、火鸟图腾吐火、苍穹光柱深色光柱、第二关首领粗激光、圣光禁域光球
# 素材(都是 CC0):
#   Free Pixel Effects Pack(CodeManu / Davit Masia,CC0 公有领域)https://codemanu.itch.io/pixelart-effect-pack
#     raw/skfx/codemanu_fx/x/*_spritesheet.png(每帧 100×100)
#   Lasers and beams(Rawdanitsu,CC0)https://opengameart.org/content/lasers-and-beams
#     raw/skfx/beams_rawdanitsu/beams.png
# 改动:特效每隔几帧取一帧、裁掉空白;激光取紫色光弹的横截面拉成光束段;深色光柱 = 蓝色光弹横截面反相上色(中间深紫黑、边缘亮紫)
# 用法:python art_src/skfx/build_fx29.py <raw/skfx> <输出 png>,打印 meta(贴进源码 FX29.M)
import sys,json
from PIL import Image
import numpy as np
RAW,OUT=sys.argv[1],sys.argv[2]
def fxs(name,step,keep=None):
    im=Image.open(f'{RAW}/codemanu_fx/x/{name}_spritesheet.png').convert('RGBA');n=im.width//100;cells=[]
    for j in range(n*n):
        c=im.crop((j%n*100,j//n*100,j%n*100+100,j//n*100+100))
        if c.getbbox():cells.append(c)
    cells=cells[::step]
    if keep:cells=cells[:keep]
    bb=[c.getbbox() for c in cells];x0=min(b[0] for b in bb);y0=min(b[1] for b in bb);x1=max(b[2] for b in bb);y1=max(b[3] for b in bb)
    w,h=x1-x0,y1-y0;st=Image.new('RGBA',(w*len(cells),h))
    for i,c in enumerate(cells):st.paste(c.crop((x0,y0,x1,y1)),(i*w,0))
    return st,len(cells),w//2,h//2
def xsec(box,th):  # 光弹最宽处的一行(横截面)
    im=Image.open(f'{RAW}/beams_rawdanitsu/beams.png').convert('RGBA');x,y,w,h=box
    sub=np.array(im.crop((x,y,x+w,y+h)),float);a=sub[...,3].sum(1);r=int(a.argmax())
    return np.array(im.crop((x,y+r,x+w,y+r+1)).resize((th,1),Image.BOX),float)[0]  # th×4
def bar(row,ln):  # 横截面竖着放、沿长度方向平铺:宽 ln、高 th 的光束段
    th=len(row);A=np.repeat(row[:,None,:],ln,1);return Image.fromarray(A.clip(0,255).astype('uint8'),'RGBA')
def dark(row):  # 深色光柱:亮度越高越深(中心深紫黑),边缘亮紫,不透明度加大
    a=row[:,3]/255;l=row[:,:3].max(1)/255*a;l=l/l.max();out=np.zeros_like(row)
    c0=np.array([22,4,40]);c1=np.array([150,40,220]);c2=np.array([255,120,255])
    for i,v in enumerate(l):
        out[i,:3]=c0*(v>.82)+(c1*(1-(v-.35)/.47)+c0*((v-.35)/.47))*((v>.35)&(v<=.82))+(c2*(v/.35)+c1*(1-v/.35)*0)*(v<=.35)
        out[i,3]=255*min(1,v*2.2)
    return out
# 1_magicspell(紫白)/ 3_bluefire(青色彗星)/ 6_flamelash(火焰甩尾)/ 11_fire(火苗)/ 12_nebula(白蓝冰花)/ 13_vortex(红色漩涡)/ 14_phantom(旋转星镖)/ 16_sunburn(大火团)/ 17_felspell(绿色魔焰)/ 18_midnight(紫色魔焰)/ 20_magicbubbles(彩色泡泡)
parts=[('x-sun',fxs('16_sunburn',4)),('x-vortex',fxs('13_vortex',4)),('x-nebula',fxs('12_nebula',4)),('x-midnight',fxs('18_midnight',4)),
       ('x-fel',fxs('17_felspell',6)),('x-bluefire',fxs('3_bluefire',4)),('x-fire',fxs('11_fire',4)),('x-phantom',fxs('14_phantom',4)),
       ('x-bubble',fxs('20_magicbubbles',4)),('x-lash',fxs('6_flamelash',3)),('x-spell',fxs('1_magicspell',5))]
# 第三十轮追加:法师普攻球形闪电(Mikodrak 2D Spell Effects,CC0,raw/skfx/mikodrak_fx/x/fx8_lighteningBall)、
#   Lots of game effects(Soluna Software,CC0,https://opengameart.org/content/lots-of-game-effects,raw/skfx/soluna_fx):
#   Fire01 火焰喷流(火鸟吐火)、Explosion25 爆炸、Effect36 蓝色魔光球(重击外层)、Effect51 星花爆开(重击命中);改动:隔帧取、缩小一半
import glob,re
def mko(d,step,sc=1):
    fs=sorted(glob.glob(f'{RAW}/mikodrak_fx/x/{d}/*.png'),key=lambda p:int(re.findall(r'(\d+)\.png$',p)[0]))[::step]
    cells=[Image.open(p).convert('RGBA') for p in fs];return pack(cells,sc)
def sol(name,cw,ch,step,sc,keep=None):
    im=Image.open(f'{RAW}/soluna_fx/{name}.png').convert('RGBA');n=im.width//cw;m=im.height//ch
    cells=[im.crop((j%n*cw,j//n*ch,j%n*cw+cw,j//n*ch+ch)) for j in range(n*m)];cells=[c for c in cells if c.getbbox()][::step]
    if keep:cells=cells[:keep]
    return pack(cells,sc)
def pack(cells,sc):
    W0=max(c.width for c in cells);H0=max(c.height for c in cells);cells=[c.crop((0,0,W0,H0)) for c in cells]
    bb=[c.getbbox() for c in cells];x0=min(b[0] for b in bb);y0=min(b[1] for b in bb);x1=max(b[2] for b in bb);y1=max(b[3] for b in bb)
    w,h=round((x1-x0)*sc),round((y1-y0)*sc);st=Image.new('RGBA',(w*len(cells),h))
    for i,c in enumerate(cells):st.paste(c.crop((x0,y0,x1,y1)).resize((w,h),Image.BOX),(i*w,0))
    return st,len(cells),w//2,h//2
parts+=[('x-lball',mko('fx8_lighteningBall',1)),('x-flame',sol('Fire01',128,256,2,.5)),('x-boom',sol('Explosion25',128,128,1,.75)),
        ('x-arc',sol('Effect36',128,128,1,.6)),('x-star',sol('Effect51',128,128,1,.6))]
pr=xsec((232,215,40,70),24);bl=xsec((300,30,58,106),40)
beams=[('bm-purp',bar(pr,64)),('bm-dark',bar(dark(bl),16))]
W=max(max(p[0].width for _,p in parts),max(b.width for _,b in beams));H=sum(p[0].height for _,p in parts)+sum(b.height for _,b in beams)
at=Image.new('RGBA',(W,H));M={};y=0
for k,(im,n,px,py) in parts:
    at.paste(im,(0,y));M[k]={'y':y,'w':im.width//n,'h':im.height,'n':n,'px':px,'py':py,'fps':15,'loop':True,'im':7};y+=im.height
for k,im in beams:
    at.paste(im,(0,y));M[k]={'y':y,'w':im.width,'h':im.height,'n':1,'px':im.width//2,'py':im.height//2,'fps':12,'loop':False,'im':7};y+=im.height
M['x-flame']['py']=M['x-flame']['h']-6  # 火焰喷流的原点在火源(底部)
at.save(OUT,optimize=True);print(json.dumps(M,separators=(',',':')))
