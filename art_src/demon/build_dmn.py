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
# 第五十六轮(cur 25~27):
# 恶魔 4「阿斯莫德」:Elementals: Water Priestess(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-water-priestess,免费版,raw/demon/water)
#   —— 原图朝右;色相整体转 +95°(深蓝水系 → 玫红 / 紫红「魅惑」);长动作隔一帧取一帧
# 恶魔 5「贝利亚」:Elementals: Fire Knight(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-fire-knight,免费版,raw/demon/fireknight)
#   —— 原图朝右;按亮度换成苍白金色(「伪光」,和巴尔 / 摩洛克的红火区分开);长动作隔一帧取一帧
# 恶魔 6「阿斯塔罗特」:Boss: Frost Guardian(chierit,CC-BY 4.0,https://chierit.itch.io/boss-frost-guardian,免费版,raw/demon/frost)
#   —— 原图朝左,每帧左右翻转;冰蓝按亮度换成腐绿 / 暗紫(「腐息」)
WP=os.path.join(R,'demon','water','x','Elementals_water_priestess_FREE_v1.1','png')
FK=os.path.join(R,'demon','fireknight','x','Elementals_fire_knight_FREE_v1.1','png','fire_knight')
FG=os.path.join(R,'demon','frost','x','Frost_Guardian_FREE_v1.0','PNG files')
def sub(v,k=2):return v[::k]
def hue(im,deg,sk=1.0):
    a=np.array(im).astype(np.float32);rgb=a[...,:3]/255;mx=rgb.max(-1);mn=rgb.min(-1);df=mx-mn+1e-9
    r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
    h=np.where(mx==r,((g-b)/df)%6,np.where(mx==g,(b-r)/df+2,(r-g)/df+4))/6;s=np.where(mx>0,(mx-mn)/(mx+1e-9),0);v=mx
    h=(h+deg/360)%1;s=np.clip(s*sk,0,1);i=np.floor(h*6);f=h*6-i;p=v*(1-s);q=v*(1-f*s);t=v*(1-(1-f)*s);i=i.astype(int)%6
    out=np.select([i[...,None]==j for j in range(6)],[np.stack(c,-1) for c in [(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]])
    a[...,:3]=out*255;return Image.fromarray(a.astype(np.uint8))
SEA=[(0,(6,14,26)),(.35,(18,52,78)),(.65,(40,128,150)),(.85,(110,214,206)),(1,(220,255,240))]
EMB=[(0,(16,6,4)),(.4,(70,26,16)),(.7,(150,64,30)),(.88,(222,140,70)),(1,(255,226,170))]
D={
 'baal':{'i':seq(os.path.join(SL,'01_demon_idle'),'demon_idle_%d.png',6),'w':seq(os.path.join(SL,'02_demon_walk'),'demon_walk_%d.png',12),
         'a':seq(os.path.join(SL,'03_demon_cleave'),'demon_cleave_%d.png',15),'h':seq(os.path.join(SL,'04_demon_take_hit'),'demon_take_hit_%d.png',5)},
 'dagon':{'i':seq(os.path.join(CT,'idle'),'idle_%d.png',15),'w':seq(os.path.join(CT,'fly'),'fly_%d.png',6),'a':seq(os.path.join(CT,'1atk'),'1atk_%d.png',7),
          'b':seq(os.path.join(CT,'2atk'),'2atk_%d.png',9),'h':seq(os.path.join(CT,'hurt'),'hurt_%d.png',5)},
 'molo':{'i':seq(os.path.join(MI,'idle'),'idle_%d.png',16),'w':seq(os.path.join(MI,'walk'),'walk_%d.png',12),'a':seq(os.path.join(MI,'atk_1'),'atk_1_%d.png',16)},
 'asmo':{'i':seq(os.path.join(WP,'01_idle'),'idle_%d.png',8),'w':seq(os.path.join(WP,'02_walk'),'walk_%d.png',10),'a':seq(os.path.join(WP,'07_1_atk'),'1_atk_%d.png',7),
         'b':sub(seq(os.path.join(WP,'08_2_atk'),'2_atk_%d.png',21)),'c':sub(seq(os.path.join(WP,'09_3_atk'),'3_atk_%d.png',27)),'s':sub(seq(os.path.join(WP,'10_sp_atk'),'sp_atk_%d.png',32)),
         'h':seq(os.path.join(WP,'11_heal'),'heal_%d.png',12),'t':seq(os.path.join(WP,'06_tumble'),'tumble_%d.png',6)},
 'beli':{'i':seq(os.path.join(FK,'01_idle'),'idle_%d.png',8),'w':seq(os.path.join(FK,'02_run'),'run_%d.png',8),'a':seq(os.path.join(FK,'05_1_atk'),'1_atk_%d.png',11),
         'b':sub(seq(os.path.join(FK,'06_2_atk'),'2_atk_%d.png',19)),'c':sub(seq(os.path.join(FK,'07_3_atk'),'3_atk_%d.png',28)),'s':seq(os.path.join(FK,'08_sp_atk'),'sp_atk_%d.png',18),
         'r':seq(os.path.join(FK,'04_roll'),'roll_%d.png',8),'d':seq(os.path.join(FK,'09_defend'),'defend_%d.png',10)},
 'asta':{'i':seq(os.path.join(FG,'idle'),'idle_%d.png',6),'w':seq(os.path.join(FG,'walk'),'walk_%d.png',10),'a':seq(os.path.join(FG,'1_atk'),'1_atk_%d.png',14),'h':seq(os.path.join(FG,'take_hit'),'take_hit_%d.png',7)}}
HOLY=[(0,(34,22,30)),(.35,(120,84,52)),(.65,(214,170,86)),(.85,(250,226,150)),(1,(255,252,236))]
ROT=[(0,(18,10,26)),(.3,(52,30,64)),(.55,(70,104,40)),(.8,(148,196,70)),(1,(230,250,170))]
FLIP={'baal','asta'};TINT={'dagon':SEA,'molo':EMB,'beli':HOLY,'asta':ROT};HUE={'asmo':95}
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
            if k in HUE:c=hue(c,HUE[k],1.1)
            if k in FLIP:c=c.transpose(Image.FLIP_LEFT_RIGHT)
            out.append(c)
        w,h=out[0].size;strip=Image.new('RGBA',(w*len(out),h))
        for i,c in enumerate(out):strip.alpha_composite(c,(i*w,0))
        ax=(box[2]-fx) if k in FLIP else fx-box[0]
        rows.append((k+'_'+n,strip,w,h,len(out),int(round(ax)),int(yb-box[1]+1)))
# 第六十一轮(cur 28~30,二阶):
# 恶魔 7「别西卜」:Elementals: Wind Hashashin(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-wind-hashashin,免费版,raw/demon/wind)
#   —— 原图朝右;按亮度换成「蝇王」的黑褐 / 腐黄绿;长动作隔一帧取一帧
# 恶魔 8「玛门」:Elementals: Crystal Mauler(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-crystal-mauler,免费版,raw/demon/crystal)
#   —— 原图朝右;按亮度换成金色(水晶 → 金矿尖刺)
# 恶魔 9「利维坦」:Elementals: Metal Bladekeeper(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-metal-bladekeeper,免费版,raw/demon/metal)
#   —— 原图朝右;按亮度换成深海青(鳞甲);飞刃 / 陷阱(projectile_and_trap)同样换色
# 别西卜的蝇卵 / 蛆虫 / 酸液:Animated insect enemy assets(ponkpixels,CC-BY 4.0,https://ponkpixels.itch.io/insect-enemies,raw/demon/insect)—— 原色(本来就是腐绿)
# 这三个恶魔每个动作单独左右裁边(上下仍用同一个外框,脚底高度一致),图集不会太宽
WH=os.path.join(R,'demon','wind','x','elementals_wind_hashashin_FREE_v1.1','PNG')
CM=os.path.join(R,'demon','crystal','x','Elementals_Crystal_Mauler_Free_v1.0','animations','PNG')
MB=os.path.join(R,'demon','metal','x','Elementals_metal_bladekeeper_FREE_v1.1','PNG animations')
IN=os.path.join(R,'demon','insect','x')
FLYC=[(0,(14,10,6)),(.35,(52,40,18)),(.62,(104,110,30)),(.85,(182,204,64)),(1,(244,255,170))]
GOLD=[(0,(34,16,4)),(.35,(112,64,12)),(.62,(204,148,36)),(.85,(255,214,92)),(1,(255,250,214))]
DEEP=[(0,(24,52,78)),(.3,(44,108,146)),(.6,(78,176,204)),(.85,(150,230,238)),(1,(236,255,255))]
D2={
 'belz':{'i':seq(os.path.join(WH,'idle'),'idle_%d.png',8),'w':seq(os.path.join(WH,'run'),'run_%d.png',8),'a':seq(os.path.join(WH,'1_atk'),'1_atk_%d.png',8),
         'b':sub(seq(os.path.join(WH,'2_atk'),'2_atk_%d.png',18)),'c':sub(seq(os.path.join(WH,'3_atk'),'3_atk_%d.png',26)),'s':sub(seq(os.path.join(WH,'sp_atk'),'sp_atk_%d.png',30),3),
         'r':seq(os.path.join(WH,'roll'),'roll_%d.png',6),'h':seq(os.path.join(WH,'take_hit'),'take_hit_%d.png',6)},
 'mamm':{'i':seq(os.path.join(CM,'idle'),'idle_%d.png',8),'w':seq(os.path.join(CM,'run'),'run_%d.png',8),'a':seq(os.path.join(CM,'1_atk'),'1_atk_%d.png',7),
         'b':seq(os.path.join(CM,'2_atk'),'2_atk_%d.png',7),'c':sub(seq(os.path.join(CM,'3_atk'),'3_atk_%d.png',17)),'s':sub(seq(os.path.join(CM,'sp_atk'),'sp_atk_%d.png',15)),
         'j':sub(seq(os.path.join(CM,'jump_full'),'jump_full_%d.png',21)),'h':seq(os.path.join(CM,'take_hit'),'take_hit_%d.png',6)},
 'levi':{'i':seq(os.path.join(MB,'01_idle'),'01_idle_%d.png',8),'w':seq(os.path.join(MB,'02_run'),'02_run_%d.png',8),'a':seq(os.path.join(MB,'07_1_atk'),'07_1_atk_%d.png',6),
         'b':seq(os.path.join(MB,'08_2_atk'),'08_2_atk_%d.png',8),'c':sub(seq(os.path.join(MB,'09_3_atk'),'09_3_atk_%d.png',18)),'s':seq(os.path.join(MB,'10_sp_atk'),'10_sp_atk_%d.png',11),
         'p':seq(os.path.join(MB,'05_projectile_cast'),'05_projectile_cast_%d.png',7),'t':sub(seq(os.path.join(MB,'06_trap_cast'),'06_trap_cast_%d.png',10)),
         'r':seq(os.path.join(MB,'04_roll'),'04_roll_%d.png',7),'d':sub(seq(os.path.join(MB,'11_defend'),'11_defend_%d.png',12))}}
TINT2={'belz':FLYC,'mamm':GOLD,'levi':DEEP}
for k,an in D2.items():
    fr=[f for v in an.values() for f in v];top=min(f.getbbox()[1] for f in fr if f.getbbox());bot=max(f.getbbox()[3] for f in fr if f.getbbox())
    a=np.array(an['i'][0])[...,3];ys=np.where(a.max(1)>0)[0];yb=ys[-1];xs=np.where(a[yb]>0)[0];fx=(xs[0]+xs[-1])/2
    for n,v in an.items():
        bs=[f.getbbox() for f in v if f.getbbox()];l=min(min(b[0] for b in bs),int(fx)-2);r=max(max(b[2] for b in bs),int(fx)+2)
        out=[gmap(f.crop((l,top,r,bot)),TINT2[k]) for f in v]
        w,h=out[0].size;strip=Image.new('RGBA',(w*len(out),h))
        for i,c in enumerate(out):strip.alpha_composite(c,(i*w,0))
        rows.append((k+'_'+n,strip,w,h,len(out),int(round(fx-l)),int(yb-top+1)))
# 特效小图:fx_名字,脚底 = 底边中点
def grid(p,fw,fh,row=None,n=None):
    im=op(p);cols=im.width//fw;rs=[row] if row is not None else range(im.height//fh)
    v=[im.crop((c*fw,r*fh,c*fw+fw,r*fh+fh)) for r in rs for c in range(cols)];return v[:n] if n else v
def fxrow(n,v,tint=None):
    if tint:v=[gmap(f,tint) for f in v]
    w,h=v[0].size;strip=Image.new('RGBA',(w*len(v),h))
    for i,c in enumerate(v):strip.alpha_composite(c,(i*w,0))
    rows.append(('fx_'+n,strip,w,h,len(v),w//2,h))
fxrow('egg',grid(os.path.join(IN,'EggCluster.png'),32,32)+grid(os.path.join(IN,'Eggsplosion.png'),32,32))
fxrow('mag',grid(os.path.join(IN,'MaggotWalk.png'),32,32,2))
fxrow('blob',grid(os.path.join(IN,'AcidBlob.png'),32,32,0))
fxrow('splat',grid(os.path.join(IN,'AcidSplat.png'),64,64))
PT=os.path.join(MB,'projectile_and_trap')
fxrow('blade',[op(os.path.join(PT,'projectile_throw','projectile_throw.png'))]+seq(os.path.join(PT,'projectile_land'),'projectile_land_%d.png',5),DEEP)
fxrow('trap',[op(os.path.join(PT,'trap_throw','trap_throw.png'))]+seq(os.path.join(PT,'trap_land'),'trap_land_%d.png',3)+seq(os.path.join(PT,'trap_detonate'),'trap_detonate_%d.png',5),DEEP)
# 第六十二轮(cur 31~33,二阶最后三个):
# 恶魔 10「贝尔芬格」:Elementals: Leaf Ranger(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-leaf-ranger,免费版,raw/demon/leaf)
#   —— 原图朝右;按亮度换成昏睡的淡紫(「怠惰」);箭 / 箭雨 / 光束延长段同样换色;长动作隔一帧取一帧
# 恶魔 11「阿撒兹勒」:Elementals: Ground Monk(chierit,CC-BY 4.0,https://chierit.itch.io/elementals-ground-monk,免费版,raw/demon/monk)
#   —— 原图朝右;按亮度换成铁黑 + 炉火橙(「锻造」,地刺 = 荒野的岩石);长动作隔一帧取一帧
# 恶魔 12「路西法」:Evil Wizard 3(LuizMelo,CC0,https://luizmelo.itch.io/evil-wizard-3,raw/demon/wiz3)
#   —— 原图朝右,140×140 横排帧;按亮度换成白金 + 堕天紫(「晨星」);法球 Moving / Explode 同样换色
LR=os.path.join(R,'demon','leaf','x','Elementals_Leaf_ranger_Free_v1.0','animations','PNG')
GM=os.path.join(R,'demon','monk','x','Elementals_ground_monk_FREE_v1.3','png')
W3=os.path.join(R,'demon','wiz3','x','Evil Wizard 3','Sprites')
SLOTH=[(0,(22,12,34)),(.35,(66,42,96)),(.62,(132,100,176)),(.85,(208,184,238)),(1,(252,244,255))]
FORGE=[(0,(10,10,14)),(.35,(48,46,56)),(.58,(100,92,98)),(.8,(214,112,40)),(1,(255,222,140))]
LUCI=[(0,(18,8,32)),(.3,(64,32,100)),(.55,(152,112,204)),(.8,(242,214,140)),(1,(255,255,242))]
def nseq(d,pre,n):return [op(os.path.join(d,pre+'%d.png'%i)) for i in range(1,n+1)]
def ld(d):  # 文件夹里按数字排序的全部帧
    fs=[f for f in os.listdir(d) if f.endswith('.png')];fs.sort(key=lambda f:int(''.join(c for c in f if c.isdigit()) or 0));return [op(os.path.join(d,f)) for f in fs]
def sheet(n,fw=140):im=op(os.path.join(W3,n+'.png'));return [im.crop((i*fw,0,i*fw+fw,im.height)) for i in range(im.width//fw)]
D3={
 'belp':{'i':sub(ld(os.path.join(LR,'idle'))),'w':ld(os.path.join(LR,'run')),'a':ld(os.path.join(LR,'1_atk')),'b':sub(ld(os.path.join(LR,'2_atk'))),
         'c':ld(os.path.join(LR,'3_atk')),'s':ld(os.path.join(LR,'sp_atk')),'d':sub(ld(os.path.join(LR,'defend'))),'r':sub(ld(os.path.join(LR,'slide'))),'h':ld(os.path.join(LR,'take_hit'))},
 'azaz':{'i':ld(os.path.join(GM,'idle')),'w':ld(os.path.join(GM,'run')),'a':ld(os.path.join(GM,'1_atk')),'b':sub(ld(os.path.join(GM,'2_atk'))),'c':sub(ld(os.path.join(GM,'3_atk'))),
         's':sub(ld(os.path.join(GM,'sp_atk'))),'m':sub(ld(os.path.join(GM,'meditate'))),'d':ld(os.path.join(GM,'defend')),'h':ld(os.path.join(GM,'take_hit'))},
 'luci':{'i':sheet('Idle'),'w':sheet('Walk'),'a':sheet('Attack'),'h':sheet('Get hit')}}
TINT3={'belp':SLOTH,'azaz':FORGE,'luci':LUCI}
for k,an in D3.items():
    fr=[f for v in an.values() for f in v];top=min(f.getbbox()[1] for f in fr if f.getbbox());bot=max(f.getbbox()[3] for f in fr if f.getbbox())
    a=np.array(an['i'][0])[...,3];ys=np.where(a.max(1)>0)[0];yb=ys[-1];xs=np.where(a[yb]>0)[0];fx=(xs[0]+xs[-1])/2
    for n,v in an.items():
        bs=[f.getbbox() for f in v if f.getbbox()];l=min(min(b[0] for b in bs),int(fx)-2);r=max(max(b[2] for b in bs),int(fx)+2)
        out=[gmap(f.crop((l,top,r,bot)),TINT3[k]) for f in v]
        w,h=out[0].size;strip=Image.new('RGBA',(w*len(out),h))
        for i,c in enumerate(out):strip.alpha_composite(c,(i*w,0))
        rows.append((k+'_'+n,strip,w,h,len(out),int(round(fx-l)),int(yb-top+1)))
PE=os.path.join(LR,'projectiles_and_effects')
def tight(v):  # 特效帧统一裁掉透明边
    bs=[f.getbbox() for f in v if f.getbbox()];b=(min(q[0] for q in bs),min(q[1] for q in bs),max(q[2] for q in bs),max(q[3] for q in bs));return [f.crop(b) for f in v]
fxrow('arw',tight(ld(os.path.join(PE,'arrow'))),SLOTH)
fxrow('arwh',tight(ld(os.path.join(PE,'arrow_hit'))),SLOTH)
fxrow('shower',tight(sub(ld(os.path.join(PE,'arrow_shower_effect')))),SLOTH)
fxrow('beam',tight(ld(os.path.join(PE,'beam_extension_effect'))),SLOTH)
fxrow('orb',tight(grid(os.path.join(W3,'Projectile','Moving.png'),50,50)),LUCI)
fxrow('orbx',tight(grid(os.path.join(W3,'Projectile','Explode.png'),50,50)),LUCI)
# 第六十一轮:货架式排布(窄的行并排放,图集不再一行一个动作)
W=max(r[1].width for r in rows);P={};sh=[]  # sh = [y, 高, 已用宽]
for r in sorted(rows,key=lambda r:-r[3]):
    s=next((s for s in sh if s[1]>=r[3] and s[1]-r[3]<=20 and s[2]+r[1].width<=W),None)
    if s is None:s=[sum(q[1]+1 for q in sh),r[3],0];sh.append(s)
    P[r[0]]=(s[2],s[0]);s[2]+=r[1].width+1
H=sum(q[1]+1 for q in sh)
atl=Image.new('RGBA',(W,H));M={}
for n,im,w,h,c,ax,ay in rows:
    X,Y=P[n];atl.alpha_composite(im,(X,Y));M[n]=[X,Y,w,h,c,ax,ay]
atl.save(sys.argv[2],optimize=True);print('M',json.dumps(M,separators=(',',':')));print(atl.size,os.path.getsize(sys.argv[2]))
