# 第十七关「炎狱熔渊」图集 IFN(第五十四轮,cur 21,火焰元素关卡)
# 首领 炎狱巨像:Golem(Stephen "Redshrike" Challener / William.Thompsonj,CC-BY 4.0,经 Emcee Flesher 整理的
#   Dark Fantasy Platformer Bestiary https://opengameart.org/content/dark-fantasy-platformer-bestiary,raw/fire21/bestiary)
#   —— 灰紫色石像按亮度映射成「熔岩」配色(暗处焦黑、亮处橙黄),左右翻转成面朝右;去掉占位的蓝色方块
# 小怪 炎斧兽:同一合集里的 Wartaur(Redshrike,CC-BY 4.0)—— 毛皮按亮度映射成赤红火焰配色,斧头(低饱和度)只压暗,左右翻转
# 小怪 火灵 / 火球:同一合集里的 Sparky(surt / Emcee Flesher,CC-BY 4.0)—— 原样
# 场景:Warped Caves Pixel Art Pack(ansimuz,CC0,https://opengameart.org/content/warped-caves-pixel-art-pack,raw/fire21/caves)
#   background / middleground-no-fungus 两层 + tilesets 里的岩块,按亮度映射成熔岩洞配色(远景橙黄火光、岩壁焦黑暗红)
# 用法:python art_src/fire21/build_fire21.py <raw> <输出 png>   打印 M(贴进 src/parts/569_第十七关炎狱熔渊.js 的 IFN.M)
import sys,os,json,colorsys
import numpy as np
from PIL import Image
R=sys.argv[1]
BE=os.path.join(R,'fire21','bestiary');CV=os.path.join(R,'fire21','caves','x','warped-files','PNG','environment','layers')
def op(*p):return Image.open(os.path.join(*p)).convert('RGBA')
def noblue(im):
    a=np.array(im);m=(a[...,2]>200)&(a[...,0]<30)&(a[...,1]<30);a[m]=0;return Image.fromarray(a)
def gmap(im,stops,keepGray=0):  # 亮度 → 渐变色;keepGray:低饱和度(金属)只压暗
    a=np.array(im).astype(np.float32);rgb=a[...,:3]/255;L=(rgb*[.3,.55,.15]).sum(-1)
    lo,hi=np.percentile(L[a[...,3]>0],[2,98]);u=np.clip((L-lo)/(hi-lo+1e-6),0,1)
    xs=[s[0] for s in stops];out=np.stack([np.interp(u,xs,[s[1][i] for s in stops]) for i in range(3)],-1)
    if keepGray:
        sat=rgb.max(-1)-rgb.min(-1);g=(sat<.12)[...,None];out=np.where(g,a[...,:3]*.75,out)
    a[...,:3]=out;return Image.fromarray(a.astype(np.uint8))
def hue(im,deg,sk=1.1,vk=1.0):
    a=np.array(im).astype(np.float32)/255;o=a.copy()
    import colorsys as cs
    f=np.vectorize(lambda r,g,b:cs.rgb_to_hsv(r,g,b),otypes=[float,float,float]);h,s,v=f(a[...,0],a[...,1],a[...,2])
    h=(h+deg/360)%1;s=np.clip(s*sk,0,1);v=np.clip(v*vk,0,1)
    g=np.vectorize(lambda h,s,v:cs.hsv_to_rgb(h,s,v),otypes=[float,float,float]);r,gg,b=g(h,s,v)
    o[...,0],o[...,1],o[...,2]=r,gg,b;return Image.fromarray((o*255).astype(np.uint8))
LAVA=[(0,(22,8,8)),(.35,(78,24,18)),(.62,(170,58,24)),(.82,(244,128,36)),(1,(255,226,128))]
FUR=[(0,(30,6,6)),(.4,(120,22,16)),(.7,(220,74,28)),(1,(255,190,90))]
rows=[]
def add(k,im,fw):rows.append((k,im,fw))
def cells(im,cw,ch,lst):
    o=Image.new('RGBA',(cw*len(lst),ch))
    for i,(r,c) in enumerate(lst):o.alpha_composite(im.crop((c*cw,r*ch,(c+1)*cw,(r+1)*ch)),(i*cw,0))
    return o
def flipf(im,fw):  # 每一帧各自左右翻转
    o=Image.new('RGBA',im.size)
    for i in range(im.width//fw):o.alpha_composite(im.crop((i*fw,0,(i+1)*fw,im.height)).transpose(Image.FLIP_LEFT_RIGHT),(i*fw,0))
    return o
gm=gmap(noblue(op(BE,'redshrike-thompson-golem-pal2-alpha.png')),LAVA)
add('gi',flipf(cells(gm,64,72,[(0,0)]),64),64)
add('gw',flipf(cells(gm,64,72,[(1,i) for i in range(6)]),64),64)
add('ga',flipf(cells(gm,64,72,[(2,i) for i in range(6)]),64),64)
wt=gmap(noblue(op(BE,'redshrike-wartaur-alpha.png')),FUR,1)
add('ww',flipf(cells(wt,80,80,[(0,i) for i in range(4)]),80),80)
add('wa',flipf(cells(wt,80,80,[(1,0),(1,1),(1,2),(1,3),(2,1)]),80),80)
sp=op(BE,'sparky-surt-emceeflesher-alpha.png')
add('sp',cells(sp,16,16,[(0,i) for i in range(4)]),16)
add('fb',cells(sp,16,16,[(1,i) for i in range(5)]),16)
BGP=[(0,(46,10,12)),(.5,(150,40,20)),(.8,(238,116,38)),(1,(255,214,130))];ROCK=[(0,(18,7,9)),(.5,(58,20,18)),(.85,(118,40,26)),(1,(206,86,32))]
add('bk',gmap(op(CV,'background.png'),BGP),240)
add('md',gmap(op(CV,'middleground-no-fungus.png'),ROCK),272)
ts=gmap(op(CV,'tilesets.png'),ROCK)
add('gnd',ts.crop((224,104,256,136)),32)
add('plt',ts.crop((160,106,192,128)),32)
W=max(r[1].width for r in rows);H=sum(r[1].height+1 for r in rows)
out=Image.new('RGBA',(W,H));M={};y=0
for k,im,fw in rows:
    out.alpha_composite(im,(0,y));M[k]=[0,y,im.width,im.height,fw,im.width//fw];y+=im.height+1
out.save(sys.argv[2]);print('M',json.dumps(M,separators=(',',':')));print(out.size)
