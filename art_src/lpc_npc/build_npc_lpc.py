# 城镇 NPC 的 LPC 形象:从 ULPC 仓库合成,每个 NPC 一行:待机朝右 2 帧 + 待机正面 2 帧(每帧 64×64)
# 用法:python build_npc_lpc.py  → npc_lpc.png(同时复制到 assets/)、npc_lpc.json(每个 NPC 的头部位置,给对话框头像用)
# 2026-10-14 第三十二轮:改用 art_src/lpc/comp.py 的按需下载(raw/ulpc,本机没有 git);新增「仓库管理员」(第 6 行)
import json,os,sys
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,os.path.join(D,'..','lpc'))
from comp import R,FILES
def open(p,*a,**k):
    import builtins
    if p.endswith('.json') and 'encoding' not in k and not a:k['encoding']='utf8'
    return builtins.open(p,*a,**k)
from comp import recolor
def layers(defp,body,var,col):
    d=json.load(open(R+'sheet_definitions/'+defp));out=[]
    for k,v in d.items():
        if not k.startswith('layer_') or v.get('custom_animation'):continue
        dr=v.get(body) or v.get('male')
        if dr:out.append(dict(z=v.get('zPos',0),dir='spritesheets/'+dr,var=var,col=col,rec=(d.get('recolors') or {}).get('material')))
    return out
def find(L,a):
    b=L['dir']
    for c in ([b+a+'/'+L['var']+'.png',b+L['var']+'/'+a+'.png'] if L['var'] else [])+[b+a+'.png']:
        if c in FILES:return c
def get(paths):pass  # FILES 的 in 判断时已经按需下载
NPC={
 '技能导师':('female',[('body/body.json',None,'light'),('head/heads/human/heads_human_female.json',None,None),('hair/xlong/hair_sara.json',None,'purple'),
            ('torso/shirts/torso_clothes_tunic_sara.json','purple',None),('legs/skirts/legs_skirts_plain.json',None,'purple'),('torso/waist/belt_robe.json','white',None),('feet/boots/feet_boots_basic.json',None,'black')]),
 '药剂师':('teen',[('body/body.json',None,'light'),('head/heads/human/heads_human_female.json',None,None),('hair/braids/hair_bangs_bun.json',None,'green'),
            ('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'teal'),('legs/skirts/legs_skirts_plain.json',None,'green'),('torso/aprons/torso_aprons_apron.json','white',None),('feet/boots/feet_boots_basic.json',None,'brown')]),
 '强化师':('male',[('body/body.json',None,'olive'),('head/heads/human/heads_human_male.json',None,None),('hair/bald/hair_buzzcut.json',None,'dark_gray'),('hair/beards/beards_medium.json',None,'dark_gray'),
            ('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'forest'),('legs/pants/legs_pants.json',None,'brown'),('torso/aprons/torso_aprons_apron.json','leather',None),('feet/boots/feet_boots_basic.json',None,'black')]),
 '装备商人':('male',[('body/body.json',None,'light'),('head/heads/human/heads_human_male_elderly.json',None,None),('hair/bald/hair_balding.json',None,'gray'),('hair/mustaches/beards_handlebar.json',None,'chestnut'),
            ('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'orange'),('torso/waist/belt_leather.json','brown',None),('legs/pants/legs_pants.json',None,'brown'),('feet/boots/feet_boots_basic.json',None,'brown')]),
 '村长':('male',[('body/body.json',None,'light'),('head/heads/human/heads_human_male_elderly.json',None,None),('hair/bald/hair_balding.json',None,'white'),('hair/beards/beards_winter.json',None,'white'),
            ('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'tan'),('torso/jacket/torso_jacket_tabard.json','walnut',None),('torso/waist/belt_robe.json','white',None),('legs/pants/legs_pants.json',None,'charcoal'),('feet/boots/feet_boots_basic.json',None,'brown'),('weapons/magic/weapon_magic_simple.json','simple',None)]),
 # 第三十二轮:仓库管理员 桂婶(中年女性 · 棕色长辫 + 蓝衣 + 皮背心 + 长裙)
 '仓库管理员':('female',[('body/body.json',None,'light'),('head/heads/human/heads_human_female.json',None,None),('hair/braids/hair_long_tied.json',None,'chestnut'),
            ('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'navy'),('legs/skirts/legs_skirts_plain.json',None,'maroon'),('torso/waist/belt_leather.json','brown',None),('feet/boots/feet_boots_basic.json',None,'brown')]),
}
out=Image.new('RGBA',(64*4,64*len(NPC)));meta={}
# 已经合成过的行(npc_lpc.json 里有的)直接沿用旧图:ULPC 仓库后来改了目录,旧 NPC 的部分图层路径已经找不到
KEEP=('技能导师','药剂师','强化师','装备商人','村长')  # 这几行沿用旧图;其余每次重新合成
OLD={k:v for k,v in json.load(open(os.path.join(D,'npc_lpc.json'),encoding='utf-8-sig')).items() if k in KEEP}
if OLD:oi=Image.open(os.path.join(D,'npc_lpc.png')).convert('RGBA')
for r,(name,(body,spec)) in enumerate(NPC.items()):
    if name in OLD:out.alpha_composite(oi.crop((0,OLD[name]['row']*64,256,OLD[name]['row']*64+64)),(0,r*64));meta[name]={'row':r,'top':OLD[name]['top']};continue
    Ls=[];[Ls.extend(layers(dp,body,v,c)) for dp,v,c in spec];Ls.sort(key=lambda L:L['z'])
    get([find(L,'idle') or find(L,'walk') for L in Ls])
    for L in Ls:
        p=find(L,'idle');walk=False
        if not p:p=find(L,'walk');walk=True
        if not p:print('missing',name,L['dir']);continue
        im=Image.open(R+p).convert('RGBA')
        for col,row in ((0,3),(2,2)):
            for k in range(2):
                fr=im.crop(((0 if walk else k)*64,row*64,(0 if walk else k)*64+64,row*64+64))
                if L['rec'] and L['col']:fr=recolor(fr,L['rec'],L['col'])
                out.alpha_composite(fr,((col+k)*64,r*64))
    bb=out.crop((0,r*64,64,r*64+64)).getbbox();meta[name]={'row':r,'top':bb[1]}
out.save(os.path.join(D,'npc_lpc.png'),optimize=True);out.save(os.path.join(D,'..','..','assets','npc_lpc.png'),optimize=True);json.dump(meta,open(os.path.join(D,'npc_lpc.json'),'w',encoding='utf8'),ensure_ascii=False)
if len(sys.argv)>1:big=Image.new('RGBA',out.size,(70,80,100,255));big.alpha_composite(out);big.resize((out.width*3,out.height*3),Image.NEAREST).save(sys.argv[1])
print(meta)
