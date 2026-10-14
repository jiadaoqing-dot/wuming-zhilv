# 城镇 NPC 的 LPC 形象:从 ULPC 仓库合成,每个 NPC 一行:待机朝右 2 帧 + 待机正面 2 帧(每帧 64×64)
# 用法:python3 build_npc_lpc.py <ULPC 仓库目录> <ulpc_files.txt>  → npc_lpc.png、npc_lpc.json(每个 NPC 的头部位置,给对话框头像用)
import json,os,sys,subprocess
from PIL import Image
R=sys.argv[1].rstrip('/')+'/';FILES=set(open(sys.argv[2]).read().split('\n'))
D=os.path.dirname(os.path.abspath(__file__))
PAL={}
def hx(c):return tuple(int(c[i:i+2],16) for i in (1,3,5))
def recolor(im,mat,name):
    if mat not in PAL:
        d=json.load(open(R+f'palette_definitions/{mat}/{mat}_ulpc.json'));m=json.load(open(R+f'palette_definitions/{mat}/meta_{mat}.json'));PAL[mat]=(d,m['base'])
    d,base=PAL[mat];mp={hx(a):hx(b) for a,b in zip(d[base],d[name])};px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            p=px[x,y]
            if p[3] and p[:3] in mp:px[x,y]=mp[p[:3]]+(p[3],)
    return im
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
def get(paths):
    need=[p for p in paths if p and not os.path.exists(R+p)]
    if need:subprocess.run(['git','-C',R,'sparse-checkout','add']+['/'+p for p in need],check=True,capture_output=True)
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
}
out=Image.new('RGBA',(64*4,64*len(NPC)));meta={}
for r,(name,(body,spec)) in enumerate(NPC.items()):
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
out.save(os.path.join(D,'npc_lpc.png'),optimize=True);json.dump(meta,open(os.path.join(D,'npc_lpc.json'),'w'),ensure_ascii=False)
big=Image.new('RGBA',out.size,(70,80,100,255));big.alpha_composite(out);big.resize((out.width*3,out.height*3),Image.NEAREST).save('/home/claude/wm/npc_prev.png');print(meta)
