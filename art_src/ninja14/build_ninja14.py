# 第十四关「月影忍里」图集 NJA(第四十七轮,cur 18)
# 素材:
#  首领 影主·胧 = Martial Hero(LuizMelo,CC0,https://luizmelo.itch.io/martial-hero)
#  小怪 影忍 / 飞镖忍 = Martial Hero 2(LuizMelo,CC0,https://luizmelo.itch.io/martial-hero-2;飞镖忍在游戏里用 filter 换色)
#  精英 浪人 = Martial Hero 3(LuizMelo,CC0,https://luizmelo.itch.io/martial-hero-3)
#  飞镖 = Shuriken pixel art(Loel,CC0,https://opengameart.org/content/shuriken-pixel-art)· 苦无 = Ninja Throwing Items Kit 32x32(kungfu4000,CC0,https://opengameart.org/content/ninja-throwing-items-kit-32x32)
#  替身术的木头 = 32x32 Dark Forest Combat Pack 的 Nature_Logs_01(Gothul,OGA-BY 4.0,https://opengameart.org/content/32x32-dark-forest-combat-pack)
#  远景 = 用户提供的「夜色中的蓝瓦城郭」像素图(raw/ninja14/user_bg_castle.png,第四十七轮任务附图)
# 改动:人物帧只裁掉上下空白(帧宽不变);飞镖从 Loel 的图里裁出一枚;其他原样
# 用法:python art_src/ninja14/build_ninja14.py <raw> <输出 png>   打印 M / A(贴进 src/parts/565_第十四关月影忍里.js 的 NJA)
import sys,os,json
from PIL import Image
R=sys.argv[1];N=os.path.join(R,'ninja14')
MH={'nb':('martial-hero/x/Martial Hero/Sprites',200,{'idle':'Idle','run':'Run','a1':'Attack1','a2':'Attack2','jump':'Jump','fall':'Fall','hit':'Take Hit','death':'Death'}),
    'nj':('martial-hero-2/x/Martial Hero 2/Sprites',200,{'idle':'Idle','run':'Run','a1':'Attack1','a2':'Attack2','jump':'Jump','fall':'Fall','hit':'Take hit','death':'Death'}),
    'rn':('martial-hero-3/x/Martial Hero 3/Sprite',126,{'idle':'Idle','run':'Run','a1':'Attack1','a2':'Attack2','a3':'Attack3','jump':'Going Up','fall':'Going Down','hit':'Take Hit','death':'Death'})}
rows=[];A={}
for p,(d,fw,an) in MH.items():
    ims={k:Image.open(os.path.join(N,d,f+'.png')).convert('RGBA') for k,f in an.items()}
    y0=min(i.getbbox()[1] for i in ims.values());y1=max(i.getbbox()[3] for i in ims.values())
    y0=max(0,y0-2);y1=min(fw,y1+2)
    b=ims['idle'].crop((0,0,fw,fw)).getbbox()
    A[p]=[(b[0]+b[2])/2,b[3]-b[1],b[3]-y0]  # 身体中心 x / 身体高 / 脚底 y(裁剪后)
    for k,im in ims.items():rows.append((p+'_'+k,im.crop((0,y0,im.width,y1)),fw))
# 小物件
sh=Image.open(os.path.join(N,'shuriken pixel art.png')).convert('RGBA').crop((0,0,21,21));sh=sh.crop(sh.getbbox())
ku=Image.open(os.path.join(N,'Kunai_Pixel.png')).convert('RGBA');ku=ku.crop(ku.getbbox())
lg=Image.open(os.path.join(R,'darkforest32','x','OGA 32x32 Dark Forest Combat Pack','03. Props','Nature_Logs_01.png')).convert('RGBA');lg=lg.crop(lg.getbbox())
bg=Image.open(os.path.join(N,'user_bg_castle.png')).convert('RGBA')
W=max(max(r[1].width for r in rows),bg.width+sh.width+ku.width+lg.width+8)
H=sum(r[1].height+1 for r in rows)+max(bg.height,sh.height,ku.height,lg.height)+1
out=Image.new('RGBA',(W,H));M={};y=0
for n,im,fw in rows:out.alpha_composite(im,(0,y));M[n]=[0,y,im.width,im.height,fw,im.width//fw];y+=im.height+1
x=0
for n,im in [('bg',bg),('shu',sh),('kun',ku),('log',lg)]:out.alpha_composite(im,(x,y));M[n]=[x,y,im.width,im.height];x+=im.width+2
out.save(sys.argv[2])
print(json.dumps(M,separators=(',',':')))
print(json.dumps(A,separators=(',',':')))
print('size',out.size)
