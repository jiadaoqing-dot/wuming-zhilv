# 自绘像素挂件:第 0 行 风华剑仙丝带(蝴蝶结 + 两条飘带),第 1 行 学院法师四角星;每帧 20×20,6 帧
import math,os
from PIL import Image,ImageDraw
D=os.path.dirname(os.path.abspath(__file__))
W=20;N=6
OL=(58,28,52,255)
def px(im,x,y,c):
    if 0<=x<W and 0<=y<W:im.putpixel((int(x),int(y)),c)
def outline(im):
    a=im.copy();w,h=im.size
    for y in range(h):
        for x in range(w):
            if a.getpixel((x,y))[3]==0 and any(0<=x+dx<w and 0<=y+dy<h and a.getpixel((x+dx,y+dy))[3]>0 and a.getpixel((x+dx,y+dy))!=OL for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):
                im.putpixel((x,y),OL)
def ribbon(t):
    im=Image.new('RGBA',(W,W));P1=(247,131,172,255);P2=(255,222,235,255);P3=(214,51,108,255);WH=(255,255,255,255)
    ph=t/N*2*math.pi
    # 两条飘带(向左下飘)
    for k,(oy,amp,col) in enumerate([(0,1.6,P1),(3,1.3,P2)]):
        for i in range(10):
            x=9-i*0.8;y=11+oy*0.5+i*0.55+math.sin(ph+i*0.7+k)*amp*(i/9)
            px(im,round(x),round(y),col);px(im,round(x),round(y)+1,P3 if i>6 else col)
    # 蝴蝶结两个环 + 结
    for cx,cy in((7,8),(13,8)):
        for dy in range(-2,3):
            for dx in range(-3,4):
                if dx*dx/9+dy*dy/4.5<=1:px(im,cx+dx,cy+dy,P1)
        px(im,cx,cy,P2);px(im,cx+(1 if cx<10 else -1),cy-1,WH)
    for dy in range(-1,2):
        for dx in range(-1,2):px(im,10+dx,8+dy,P3)
    px(im,10,8,P2)
    outline(im);return im
def star(t):
    im=Image.new('RGBA',(W,W));G1=(255,212,59,255);G2=(255,243,191,255);G3=(240,140,0,255);WH=(255,255,255,255)
    s=[4,5,6,6,5,4][t];c=10
    for i in range(-s,s+1):
        w=max(0,round((s-abs(i))*0.45))
        for j in range(-w,w+1):px(im,c+i,c+j,G1);px(im,c+j,c+i,G1)
    for i in range(-2,3):px(im,c+i,c,G2);px(im,c,c+i,G2)
    px(im,c,c,WH)
    for i in range(1,3):px(im,c+i,c+i,G3);px(im,c-i,c-i,G3)
    outline(im)
    # 闪光点
    sp=[(3,4),(16,5),(15,15),(4,15)][t%4]
    if t%2==0:px(im,sp[0],sp[1],WH)
    return im
out=Image.new('RGBA',(W*N,W*2))
for t in range(N):out.alpha_composite(ribbon(t),(t*W,0));out.alpha_composite(star(t),(t*W,W))
out.save(os.path.join(D,'pend.png'))
big=Image.new('RGBA',out.size,(70,80,100,255));big.alpha_composite(out);big.resize((out.width*10,out.height*10),Image.NEAREST).save('/home/claude/work/t/pend_big.png')
