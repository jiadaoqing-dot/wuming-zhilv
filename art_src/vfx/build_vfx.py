# 技能特效图集:PVFX Foundry(nerijs,CC0)+ Pixel Art Spells(DevWizard,CC0)+ Spell Effects(StarsteelGaming,CC0)
# 每个特效裁掉所有帧共同的空白,一行一个特效;meta 里记录帧宽高、帧数、锚点(pivot)、帧率、是否循环
import json,os,glob
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
X='/tmp/claude-0/-home-claude/07b62f7b-dc5c-51ee-b1fa-5469c51d5857/scratchpad/fx/'
PV=X+'4ccc77fb-pvfx-foundry-thirteen-spritesheets/effects/'
PVL=['crescent-slash','electric-impact','earth-rupture','warm-explosion','frost-nova','foldstep','smoke-puff','leaf-gust','solar-shrapnel','mass-release','arcane-parry','rift-portal','landing-dust','radiant-heal','void-implosion','resonant-break','spectral-bloom','focus-charge']
items=[]
for n in PVL:
    m=json.load(open(PV+n+'/grid/manifest.json'));im=Image.open(PV+n+'/grid/sprite-sheet.png').convert('RGBA')
    fr=[im.crop(((i%5)*96,(i//5)*96,(i%5)*96+96,(i//5)*96+96)) for i in range(len(m['frames']))]
    items.append((n,fr,m['pivot'],20,m['loop_mode']=='loop'))
def strip(path,n,fw,fh):
    im=Image.open(path).convert('RGBA');return [im.crop((i*fw,0,i*fw+fw,fh)) for i in range(n)]
DW=X+'7c6c0ec3-pixelart_spells/Pixelart Spells/PNG Files/'
items.append(('dw-arcane',strip(DW+'Arcane Bolt.png',6,16,16),[8,8],12,True))
items.append(('dw-orb',strip(DW+'Magic Orb.png',6,16,16),[8,8],12,True))
items.append(('dw-wind',strip(DW+'Wind Bolt.png',6,16,16),[8,8],12,True))
SS=X+'7a1d374c-Spell_Effects/'
items.append(('ss-fireball',[Image.open(SS+'Fireball%d.png'%i).convert('RGBA') for i in range(1,10)],[40,16],14,False))
items.append(('ss-thunder',[Image.open(SS+'Thundersphere%d.png'%i).convert('RGBA') for i in range(1,9)],[32,16],14,False))
rows=[];meta={}
y=0
for n,fr,pv,fps,loop in items:
    bb=None
    for f in fr:
        b=f.getbbox()
        if b:bb=b if bb is None else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
    w,h=bb[2]-bb[0],bb[3]-bb[1]
    row=Image.new('RGBA',(w*len(fr),h))
    for i,f in enumerate(fr):row.alpha_composite(f.crop(bb),(i*w,0))
    meta[n]={'y':y,'w':w,'h':h,'n':len(fr),'px':pv[0]-bb[0],'py':pv[1]-bb[1],'fps':fps,'loop':loop}
    rows.append(row);y+=h
W=max(r.width for r in rows)
at=Image.new('RGBA',(W,y));yy=0
for r in rows:at.alpha_composite(r,(0,yy));yy+=r.height
at.save(os.path.join(D,'vfx_atlas.png'),optimize=True);json.dump(meta,open(os.path.join(D,'vfx_meta.json'),'w'))
print(at.size,os.path.getsize(os.path.join(D,'vfx_atlas.png')))
for k,v in meta.items():print(k,v)
