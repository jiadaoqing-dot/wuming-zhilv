# 第十六关「金核机库」图集 RBT(第五十三轮,cur 20,第二张地图下方正中的金色机器人)
# 首领 / 地面机器人:Mecha platformer / Pixelart(Shiv,CC0,https://opengameart.org/content/mecha-platformer-pixelart,raw/robot20/mecha_shiv)
#   Gunner(上半身 5 个瞄准角度 + 下半身走路 18 帧)= 首领「金核炮神」,蓝色色相旋转成金色;Shielder(上半身 3 帧 + 下半身 18 帧)= 地面机器人「盾卫机兵」,原色;
#   炮口火光 fx_shoot_1(7 帧)原样
# 倒挂机器人 / 子弹 / 爆炸:Warped City(ansimuz,CC0,https://opengameart.org/content/warped-city,raw/city/warped_city_files)
#   turret 6 帧上下翻转 = 倒挂在屋顶的「吊顶炮塔」;shot / shot-hit / enemy-explosion 原样;地砖取 ENVIRONMENT/tileset.png 的一块面板
# 场景:Warped Sci-Fi Lab(ansimuz,CC0,https://opengameart.org/content/warped-sci-fi-lab,raw/robot20/scifi_lab)back / middle / front 三层 + 支柱 / 培养舱,原样
# 用法:python art_src/robot20/build_robot20.py <raw> <输出 png>   打印 M(贴进 src/parts/568_第十六关金核机库.js 的 RBT.M)
import sys,os,json
from PIL import Image
R=sys.argv[1]
MS=os.path.join(R,'robot20','mecha_shiv','x');WC=os.path.join(R,'city','warped_city_files','warped city files')
LAB=os.path.join(R,'robot20','scifi_lab','x','Scifi lab Files','layers')
def op(*p):return Image.open(os.path.join(*p)).convert('RGBA')
def strip(fs):
    ims=[op(f) for f in fs];w,h=ims[0].size;o=Image.new('RGBA',(w*len(ims),h))
    for i,im in enumerate(ims):o.alpha_composite(im,(i*w,0))
    return o,w
def gold(im):  # 蓝 → 金:色相旋转 + 提亮
    hs=im.convert('HSV');H,S,V=hs.split();H=H.point(lambda v:(v+138)%256);S=S.point(lambda v:int(v*.85));V=V.point(lambda v:min(255,int(v*1.2+16)));o=Image.merge('HSV',(H,S,V)).convert('RGBA');o.putalpha(im.getchannel('A'));return o
rows=[]
def add(k,im,fw):rows.append((k,im,fw))
g,w=strip([os.path.join(MS,'Mech','Gunner_top_%03d.png'%i) for i in range(5)]);add('gt',gold(g),w)
g,w=strip([os.path.join(MS,'Mech','Gunner_bottom_%03d.png'%i) for i in range(18)]);add('gb',gold(g),w)
g,w=strip([os.path.join(MS,'Mech','Shielder_top_%03d.png'%i) for i in range(3)]);add('st',g,w)
g,w=strip([os.path.join(MS,'Mech','Shielder_bottom_%03d.png'%i) for i in range(18)]);add('sb',g,w)
g,w=strip([os.path.join(MS,'FX','fx_shoot_1-default-%03d.png'%i) for i in range(7)]);add('mz',g,w)
g,w=strip([os.path.join(WC,'SPRITES','misc','turret','turret-%d.png'%i) for i in range(1,7)]);add('tur',g.transpose(Image.FLIP_TOP_BOTTOM),w)
g,w=strip([os.path.join(WC,'SPRITES','misc','shot','shot-%d.png'%i) for i in range(1,4)]);add('bl',g,w)
g,w=strip([os.path.join(WC,'SPRITES','misc','shot-hit','shot-hit-%d.png'%i) for i in range(1,4)]);add('hit',g,w)
g,w=strip([os.path.join(WC,'SPRITES','misc','enemy-explosion','enemy-explosion-%d.png'%i) for i in range(1,7)]);add('ex',g,w)
for k in ['back','middle','front']:add(k,op(LAB,k+'.png'),320)
add('sup',op(LAB,'Props','support.png'),16)
for i in (1,2,3):add('tank%d'%i,op(LAB,'Props','tank-%d.png'%i),48)
ts=op(WC,'ENVIRONMENT','tileset.png');add('gnd',ts.crop((224,16,272,56)),48)
W=max(r[1].width for r in rows);H=sum(r[1].height+1 for r in rows)
out=Image.new('RGBA',(W,H));M={};y=0
for k,im,fw in rows:
    out.alpha_composite(im,(0,y));M[k]=[0,y,im.width,im.height,fw,im.width//fw];y+=im.height+1
out.save(sys.argv[2]);print('M',json.dumps(M,separators=(',',':')));print(out.size)
