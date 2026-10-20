# 第五十九轮:神秘副本 5「擎天魔神」+ 紫焰魅影武器的图集 PPF(assets/ppf_atlas.png)
# 素材(全部来自外部开源素材 / 已有图集,只做重新配色和缩放):
#   首领 = Boss: Minotaur(chierit,CC-BY 4.0,https://chierit.itch.io/boss-minotaur)—— 取已有 DMN 图集里摩洛克的 idle / walk / atk 三行,按亮度换成紫焰配色
#   紫色火焰 = N64 Fire(n64guy,CC0,https://opengameart.org/content/n64-fire,raw/n64fire/n64_fire.zip)—— Frames/Round/Purple 与 Frames/Faded/Purple 每隔一帧取一帧(15 帧),Round 缩到 16×16
#   紫焰魅影大剑 = 已有 HSW 图集第 7 行(真~火之大剑,Fantasy Sword Set,melle,CC0)按亮度换成紫色
#   紫焰魅影法杖 = 已有 STF 图集第 7 格(真~火之法杖,Staff [64x64],LordNeo,CC0)按亮度换成紫色
#   装备图标 = 已有 eq_atlas 第 7 列的剑 / 法杖(7Soul1 496 RPG icons,CC0)按亮度换成紫色
# 用法:python art_src/ppf/build_ppf.py → assets/ppf_atlas.png,并打印 M(贴进 src/parts/536_神秘副本5擎天魔神.js 的 PPF.M)
# M[名字] = [x, y, 帧宽, 帧高, 帧数, 脚底 x, 脚底 y](首领三行沿用 DMN.M 的锚点;其他条目脚底 = 0)
import os,io,json,zipfile
import numpy as np
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
A=lambda p:Image.open(os.path.join(R,'assets',p)).convert('RGBA')
def gmap(im,stops):
    a=np.array(im).astype(np.float32);rgb=a[...,:3]/255;L=(rgb*[.3,.55,.15]).sum(-1);m=a[...,3]>0
    if not m.any():return im
    lo,hi=np.percentile(L[m],[2,98]);u=np.clip((L-lo)/(hi-lo+1e-6),0,1)
    xs=[s[0] for s in stops];out=np.stack([np.interp(u,xs,[s[1][i] for s in stops]) for i in range(3)],-1)
    a[...,:3]=np.where(m[...,None],out,a[...,:3]);return Image.fromarray(a.astype(np.uint8))
PUR=[(0,(34,10,62)),(.12,(78,28,140)),(.35,(132,58,210)),(.65,(190,110,250)),(.85,(232,180,255)),(1,(255,242,255))]   # 首领:暗紫 → 亮紫 → 近白
WPN=[(0,(40,8,70)),(.35,(120,40,190)),(.7,(196,110,255)),(1,(250,225,255))]                    # 武器 / 图标
rows=[]  # (名字, [帧], 锚点)
dm=A('dmn_atlas.png')
for n,(y,cnt,ax,ay) in {'g_i':(845,16,134,119),'g_w':(968,12,134,119),'g_a':(1091,16,134,119)}.items():
    fr=[dm.crop((i*204,y,i*204+204,y+122)) for i in range(cnt)]
    # 整行一起算亮度范围(各帧颜色一致)
    strip=Image.new('RGBA',(204*cnt,122));[strip.paste(f,(i*204,0)) for i,f in enumerate(fr)];strip=gmap(strip,PUR)
    rows.append((n,[strip.crop((i*204,0,i*204+204,122)) for i in range(cnt)],ax,ay))
rows.append(('sw',[gmap(A('hsw_atlas.png').crop((0,124,74,143)),WPN)],0,0))
rows.append(('st',[gmap(A('stf_atlas.png').crop((6*76,0,7*76,76)),WPN)],0,0))
eq=A('eq_atlas.png');rows.append(('ic',[gmap(eq.crop((6*34,r*34,7*34,r*34+34)),WPN) for r in (0,1)],0,0))
z=zipfile.ZipFile(os.path.join(R,'raw','n64fire','n64_fire.zip'))
rd=lambda p:Image.open(io.BytesIO(z.read(p))).convert('RGBA')
rows.append(('fr',[rd('Frames/Round/Purple/%04d.png'%i).resize((16,16),Image.LANCZOS) for i in range(0,30,2)],0,0))
rows.append(('ff',[rd('Frames/Faded/Purple/%04d.png'%i) for i in range(0,30,2)],0,0))
W=max(sum(f.width for f in fr) for _,fr,_,_ in rows);H=sum(fr[0].height+1 for _,fr,_,_ in rows)
out=Image.new('RGBA',(W,H));M={};y=0
for n,fr,ax,ay in rows:
    fw,fh=fr[0].size
    for i,f in enumerate(fr):out.paste(f,(i*fw,y))
    M[n]=[0,y,fw,fh,len(fr),ax,ay];y+=fh+1
out.save(os.path.join(R,'assets','ppf_atlas.png'),optimize=True)
print(json.dumps(M,separators=(',',':')))
