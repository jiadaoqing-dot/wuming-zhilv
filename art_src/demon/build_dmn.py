# 十二魔封印 · 恶魔首领图集 DMN(第五十五轮,cur 22~24)
# 恶魔 1「巴尔」:Boss: Demon Slime(chierit,CC-BY 4.0,https://chierit.itch.io/boss-demon-slime,免费版,raw/demon/slime)
#   —— 原图朝左,每帧左右翻转成面朝右;用 idle / walk / cleave / take_hit
# 恶魔 2「达贡」:FREE Cthulu(chierit,CC-BY 4.0,https://chierit.itch.io/free-cthulu,raw/demon/cthulu)
#   —— 原图朝右;按亮度换成深海青蓝配色(原来是绿色,和第三关蛇王 / 毒雾撞色);用 idle / fly / 1atk / 2atk / hurt
# 恶魔 3「摩洛克」:Boss: Minotaur(chierit,CC-BY 4.0,https://chierit.itch.io/boss-minotaur,免费版,raw/demon/mino)
#   —— 原图朝右;皮肤按亮度换成焦黑赤铜配色(献祭之火);用 idle / walk / atk_1
# 每个恶魔所有帧取同一个外框裁掉透明边,帧横排;M[名字] = [x, y, 帧宽, 帧高, 帧数, 脚底 x, 脚底 y](脚底 = 外框里最下面一行不透明像素的中点)
# 用法:python art_src/demon/build_dmn.py <raw> <输出 png>   打印 M(贴进 src/parts/571_十二魔封印.js 的 DMN.M)
import sys,os,json
import numpy as np
from PIL import Image
R=sys.argv[1]
def op(p):return Image.open(p).convert('RGBA')
def seq(d,pat,n):return [op(os.path.join(d,pat%i)) for i in range(1,n+1)]
def gmap(im,stops):
    a=np.array(im).astype(np.float32);rgb=a[...,:3]/255;L=(rgb*[.3,.55,.15]).sum(-1)
    m=a[...,3]>0
    if not m.any():return im
    lo,hi=np.percentile(L[m],[2,98]);u=np.clip((L-lo)/(hi-lo+1e-6),0,1)
    xs=[s[0] for s in stops];out=np.stack([np.interp(u,xs,[s[1][i] for s in stops]) for i in range(3)],-1)
    a[...,:3]=np.where(m[...,None],out,a[...,:3]);return Image.fromarray(a.astype(np.uint8))
SL=os.path.join(R,'demon','slime','x','boss_demon_slime_FREE_v1.0','individual sprites')
CT=os.path.join(R,'demon','cthulu','x','free_cthulu','animations','PNG')
MI=os.path.join(R,'demon','mino','x','mino_v1.1_free','animations')
SEA=[(0,(6,14,26)),(.35,(18,52,78)),(.65,(40,128,150)),(.85,(110,214,206)),(1,(220,255,240))]
EMB=[(0,(16,6,4)),(.4,(70,26,16)),(.7,(150,64,30)),(.88,(222,140,70)),(1,(255,226,170))]
D={
 'baal':{'i':seq(os.path.join(SL,'01_demon_idle'),'demon_idle_%d.png',6),'w':seq(os.path.join(SL,'02_demon_walk'),'demon_walk_%d.png',12),
         'a':seq(os.path.join(SL,'03_demon_cleave'),'demon_cleave_%d.png',15),'h':seq(os.path.join(SL,'04_demon_take_hit'),'demon_take_hit_%d.png',5)},
 'dagon':{'i':seq(os.path.join(CT,'idle'),'idle_%d.png',15),'w':seq(os.path.join(CT,'fly'),'fly_%d.png',6),'a':seq(os.path.join(CT,'1atk'),'1atk_%d.png',7),
          'b':seq(os.path.join(CT,'2atk'),'2atk_%d.png',9),'h':seq(os.path.join(CT,'hurt'),'hurt_%d.png',5)},
 'molo':{'i':seq(os.path.join(MI,'idle'),'idle_%d.png',16),'w':seq(os.path.join(MI,'walk'),'walk_%d.png',12),'a':seq(os.path.join(MI,'atk_1'),'atk_1_%d.png',16)}}
FLIP={'baal'};TINT={'dagon':SEA,'molo':EMB}
rows=[]
for k,an in D.items():
    fr=[f for v in an.values() for f in v]
    box=None
    for f in fr:
        b=f.getbbox()
        if b:box=b if box is None else (min(box[0],b[0]),min(box[1],b[1]),max(box[2],b[2]),max(box[3],b[3]))
    # 脚底:待机第一帧最下面一行不透明像素的中点
    a=np.array(an['i'][0])[...,3];ys=np.where(a.max(1)>0)[0];yb=ys[-1];xs=np.where(a[yb]>0)[0];fx=(xs[0]+xs[-1])/2
    for n,v in an.items():
        out=[]
        for f in v:
            c=f.crop(box)
            if k in TINT:c=gmap(c,TINT[k])
            if k in FLIP:c=c.transpose(Image.FLIP_LEFT_RIGHT)
            out.append(c)
        w,h=out[0].size;strip=Image.new('RGBA',(w*len(out),h))
        for i,c in enumerate(out):strip.alpha_composite(c,(i*w,0))
        ax=(box[2]-fx) if k in FLIP else fx-box[0]
        rows.append((k+'_'+n,strip,w,h,len(out),int(round(ax)),int(yb-box[1]+1)))
W=max(r[1].width for r in rows);H=sum(r[3]+1 for r in rows)
atl=Image.new('RGBA',(W,H));M={};y=0
for n,im,w,h,c,ax,ay in rows:
    atl.alpha_composite(im,(0,y));M[n]=[0,y,w,h,c,ax,ay];y+=h+1
atl.save(sys.argv[2],optimize=True);print('M',json.dumps(M,separators=(',',':')));print(atl.size,os.path.getsize(sys.argv[2]))
