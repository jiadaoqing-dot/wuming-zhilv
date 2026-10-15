import os
# 主角 LPC 图层图集:从 ULPC 仓库取朝右(第 4 行)的帧,按我们用到的颜色换色,每个子图层一行
# 输出 lpc_atlas.png(每行 64 高,66 帧 × 64 宽)和 lpc_meta.json(动画表、图层表:行号、zPos、有哪些动画)
import json,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from comp import *
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
A=[('idle',2),('walk',9),('run',8),('jump',5),('slash',6),('backslash',13),('halfslash',6),('thrust',8),('spellcast',7),('combat_idle',2)]
START={};s=0
for a,n in A:START[a]=s;s+=n
NF=s
L={
 'body':('body/body.json',None,'light'),
 'head':('head/heads/human/heads_human_male.json',None,None),
 'face':('head/faces/face_neutral.json',None,None),
 'hair0':('hair/spiky/hair_spiked.json',None,'chestnut'),
 'hair1':('hair/spiky/hair_spiked.json',None,'green'),
 'hair2':('hair/spiky/hair_spiked.json',None,'gold'),
 'hairX':('hair/spiky/hair_spiked.json',None,'dark_brown'),
 'hairP':('hair/braids/hair_high_ponytail.json',None,'black'),
 **{'shirt_'+c:('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,c) for c in ['navy','forest','maroon','white','blue','green','orange','black']},
 **{'pants_'+c:('legs/pants/legs_pants.json',None,c) for c in ['navy','forest','tan']},
 **{'skirt_'+c:('legs/skirts/legs_skirts_plain.json',None,c) for c in ['blue','forest','maroon','white','black']},
 **{'boots_'+c:('feet/boots/feet_boots_basic.json',None,c) for c in ['brown','black','white']},
 'plate':('torso/armour/torso_armour_plate.json',None,'steel'),
 'leather':('torso/armour/torso_armour_leather.json',None,None),
 'legion':('torso/armour/torso_armour_legion.json',None,'gold'),
 'helm0':('headwear/helmets/helmets/hat_helmet_barbuta.json',None,'steel'),
 'helm1':('headwear/coverings/hoods/hat_hood_cloth.json','forest','forest'),
 'helm2':('headwear/helmets/helmets/hat_helmet_legion.json',None,'gold'),
 **{'hat_'+c:('headwear/hats/magic/hat_magic_celestial.json',c,None) for c in ['black']},
 'cape':('torso/cape/cape_solid.json',None,'red'),
 # 2026-10-13 第十八轮:每个系列不同外观(只用 CC0 / CC-BY / OGA-BY 的图层)。雪原剑士 = 锁子甲 + 天蓝罩袍 + 维京盔 + 深蓝披风;
 # 法师 旅者 = 深蓝兜帽,林王 = 羽毛皮帽 + 森绿罩袍,荒漠 = 酒红天月帽 + 橙色腰带,雪原 = 天蓝星月帽 + 天蓝披风;雪原发色白金
 'hair3':('hair/spiky/hair_spiked.json',None,'platinum'),
 'pants_white':('legs/pants/legs_pants.json',None,'white'),
 'chain':('torso/torso_chainmail.json',None,'silver'),
 'tabard_sky':('torso/jacket/torso_jacket_tabard.json','sky',None),
 'tabard_forest':('torso/jacket/torso_jacket_tabard.json','forest',None),
 'helm3':('headwear/helmets/helmets/hat_helmet_spangenhelm_viking.json',None,'steel'),
 'cape_navy':('torso/cape/cape_solid.json',None,'navy'),
 'cape_sky':('torso/cape/cape_solid.json',None,'sky'),
 'hood_navy':('headwear/coverings/hoods/hat_hood_cloth.json',None,'navy'),
 'capf_forest':('headwear/hats/caps/hat_cap_leather.json','forest',None),
 'feather':('headwear/hats/caps/hat_cap_leather_feather.json','white',None),
 'hatm_maroon':('headwear/hats/magic/hat_magic_celestial_moon.json','maroon',None),
 'hat_sky':('headwear/hats/magic/hat_magic_celestial.json','sky',None),
 'sash_orange':('torso/waist/belt_sash.json','orange',None),
 'kimono':('torso/dresses/kimono/dress_kimono.json','white',None),
 'kimono2':('torso/dresses/kimono/dress_kimono_oversize.json','white',None),
 'obi':('torso/waist/obi/belt_obi.json','forest',None),
 # 第四十一轮:机械系列(4)外观 —— 剑士 黄铜板甲 + 黄铜腿甲 + Xeon 机甲盔(Redshrike,OGA-BY 3.0)+ 炭黑衬衣;法师 铁色腿甲当护胫 + 黑袍 + 铁色 Xeon 盔
 'plate_cu':('torso/armour/torso_armour_plate.json',None,'brass'),
 'legs_cu':('legs/legs_armour.json',None,'brass'),
 'legs_fe':('legs/legs_armour.json',None,'iron'),
 'helm4':('headwear/helmets/helmets/hat_helmet_xeon.json',None,'brass'),
 'helm5':('headwear/helmets/helmets/hat_helmet_xeon.json',None,'iron'),
}
rows=[];meta={'anims':[[a,START[a],n] for a,n in A],'nf':NF,'layers':{}}
for key,(dp,var,col) in L.items():
    ls,d=layers(dp,'teen',var,col)
    ls=[x for x in ls if not x['ca']]
    for j,Ly in enumerate(ls):
        strip=Image.new('RGBA',(NF*64,64));has=[]
        fetch([path(Ly,a) for a,_ in A])
        for a,n in A:
            p=path(Ly,a)
            if not p:continue
            im=Image.open(R+p).convert('RGBA')
            if im.height<256:continue
            r=im.crop((0,192,im.width,256))
            if Ly['rec'] and Ly['color']:r=recolor(r,Ly['rec'],Ly['color'])
            k=min(n,im.width//64)
            strip.alpha_composite(r.crop((0,0,k*64,64)),(START[a]*64,0));has.append(a)
        if not strip.getbbox():continue
        sub=key if len(ls)==1 else key+'#'+str(j)
        meta['layers'][sub]={'row':len(rows),'z':Ly['z'],'has':has,'def':dp}
        rows.append(strip)
at=Image.new('RGBA',(NF*64,64*len(rows)))
for i,r in enumerate(rows):at.alpha_composite(r,(0,i*64))
at.save(os.path.join(D,'lpc_atlas.png'),optimize=True)
json.dump(meta,open(os.path.join(D,'lpc_meta.json'),'w'),ensure_ascii=False,indent=0)
print(at.size,len(rows),os.path.getsize(os.path.join(D,'lpc_atlas.png')))
for k,v in meta['layers'].items():print(k,v['z'],len(v['has']),'' if len(v['has'])==len(A) else 'missing:'+','.join(a for a,_ in A if a not in v['has']))
