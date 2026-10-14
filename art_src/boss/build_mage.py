# 面具法师(第二关首领)像素形象:从 ULPC 仓库按图层合成(只选 OGA-BY / CC-BY 授权的图层)
# 图层:男性身体 + 人类男性头(bluecarrot16 等)· 黑色长袖 Longsleeve 2(ElizaWy 等)· 紫色长裙 Plain skirt(bluecarrot16 等)· 腰带 Robe Belt
#      紫色破旧披风 Tattered cape(Nila122、JaidynReiman)· 黑色兜帽 Hood(wulax、JaidynReiman)· 白色面具 Plain Mask(Nila122)· 扭曲法杖 Gnarled staff(bluecarrot16)
# 输出 mage_atlas.png:每行一个动作(朝右),64×64:第 0 行待机 2 帧,第 1 行施法 7 帧,第 2 行受击 6 帧
# 用法:python3 build_mage.py <ULPC 仓库目录> <ulpc_files.txt> <输出 png>
import json,os,sys,subprocess
from PIL import Image
R=sys.argv[1].rstrip('/')+'/';FILES=set(open(sys.argv[2]).read().split('\n'));OUT=sys.argv[3]
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
SPEC=[('body/body.json',None,'light'),('head/heads/human/heads_human_male.json',None,None),('torso/shirts/longsleeve/torso_clothes_longsleeve2.json',None,'black'),
      ('legs/skirts/legs_skirts_plain.json',None,'purple'),('torso/waist/belt_robe.json','white',None),('torso/cape/cape_tattered.json',None,'purple'),
      ('headwear/coverings/hoods/hat_hood_cloth.json',None,'black'),('headwear/accessories/facial_mask_plain.json','white',None),('weapons/magic/weapon_magic_gnarled.json','dark',None)]
Ls=[];[Ls.extend(layers(dp,'male',v,c)) for dp,v,c in SPEC];Ls.sort(key=lambda L:L['z'])
ANI=[('idle',3,2),('spellcast',3,7),('hurt',0,6)]
get([find(L,a) for L in Ls for a,_,_ in ANI]+[find(L,'walk') for L in Ls])
out=Image.new('RGBA',(64*7,64*len(ANI)))
for r,(a,row,n) in enumerate(ANI):
    for L in Ls:
        p=find(L,a);fb=False
        if not p:p=find(L,'walk');fb=True
        if not p:print('missing',a,L['dir']);continue
        im=Image.open(R+p).convert('RGBA');rr=3 if fb else row
        for k in range(n):
            q=0 if fb else min(k,im.width//64-1);fr=im.crop((q*64,rr*64,q*64+64,rr*64+64))
            if L['rec'] and L['col']:fr=recolor(fr,L['rec'],L['col'])
            out.alpha_composite(fr,(k*64,r*64))
out.save(OUT,optimize=True);print('mage',out.size)
