# 晨曦镇像素背景(640×360,地面线 GY=300):Sunny Land(ansimuz,CC0)+ Seasonal Tilesets(GrafxKid,CC0)+ 16x16 RPG Item Pack(Alex's Assets,CC0)
# 用法:python3 art_src/town/build_town.py <素材目录(fetch_assets.sh 的 jra)> <输出 png>
# NPC / 女神像 / 传送门的 x 坐标和源码一致:村长 36、技能导师 104、药剂师 186、装备商人 262、强化师 380、女神像 470、传送门 540
import sys
from PIL import Image,ImageDraw,ImageEnhance
R=sys.argv[1].rstrip('/');OUT=sys.argv[2]
SL=R+'/ansimuz-sunnyland/2D/platformer/environment/';GK=R+'/grafxkid-seasonal-tilesets/2D/platformer/';IT=R+'/16x16-rpg-item-pack/2D/top-down-rpg/Sheet.png'
W,H,GY=640,360,300
def L(p):return Image.open(p).convert('RGBA')
c=Image.new('RGBA',(W,H))
# —— 远景:Sunny Land 天空 + 大海(384×240,左右可平铺);海平线放在 y≈170,上面补天空顶色
back=L(SL+'Background/back.png');top=back.getpixel((0,0));c.paste(top,(0,0,W,H))
by=24
for x0 in range(0,W,back.width):c.alpha_composite(back,(x0,by))
sea=back.getpixel((0,back.height-1));c.paste(sea,(0,by+back.height,W,H))
# —— 中景:GrafxKid 草原的远山 + 树林带(288×208,可平铺),底边对齐地面上方
hills=L(GK+'1 - Grassland/Background parts/2 - Hills.png');hb=hills.getbbox()
hills=hills.crop((0,hb[1],hills.width,hb[3]))
for x0 in range(0,W,hills.width):c.alpha_composite(hills,(x0,GY+8-hills.height))
fg=L(GK+'1 - Grassland/Background parts/1 - Foreground_scenery.png');fb=fg.getbbox()
if fb:
  fg=fg.crop((0,fb[1],fg.width,fb[3]))
  for x0 in range(0,W,fg.width):c.alpha_composite(fg,(x0,GY+8-fg.height))
def P(name,cx,bot=GY,flip=False,src=SL+'Props/'):
  im=L(src+name+'.png');im=im.crop(im.getbbox())
  if flip:im=im.transpose(Image.FLIP_LEFT_RIGHT)
  c.alpha_composite(im,(int(cx-im.width/2),bot-im.height));return im
# —— 建筑 / 树(在 NPC 身后;位置跟着 NPC 走)
P('pine',-6);P('tree',22)                      # 左边:村长身后的大树
P('tree-house',92)                            # 技能导师:树屋
P('straw-house',186)                           # 药剂师:草屋
P('wooden-house',286)                          # 装备商人:木屋
P('plant-house',394)                           # 强化师:带烟囱的石屋(当铁匠铺)
P('house',640);P('palm',614,flip=True)         # 右边:小屋 + 棕榈
P('bush',446);P('bush',500,flip=True)
# —— 传送门石拱(用 tileset 的紫色石砖拼):两根柱子 x 510~522 / 558~570,拱顶圆心 (540,216) 半径 32
#    第 11 步起传送门改成运行时画的像素精灵(TPX,art_src/town/build_tpx.py),背景里不再画石拱;加第三个参数 arch 可以画回来
ARCH=len(sys.argv)>3 and sys.argv[3]=='arch'
ts=L(SL+'tileset.png');brick=ts.crop((176,256,192,272));cap=ts.crop((176,256,192,272))
d=Image.new('RGBA',(W,H));
for cx in ((508,556) if ARCH else ()):
  for y0 in range(216,GY,16):d.alpha_composite(brick,(cx,y0))
  d.alpha_composite(cap,(cx,200))
import math
for k in range(0,19 if ARCH else 0):
  a=math.pi+k*math.pi/18;px=int(540+math.cos(a)*32-8);py=int(214+math.sin(a)*32-8);d.alpha_composite(brick,(px,py))
c.alpha_composite(d)
# —— 地面:Sunny Land 草皮 + 泥土(16×16)
grass=ts.crop((48,16,64,32));dirt=ts.crop((48,48,64,64));rock=[ts.crop((16,80,32,96)),ts.crop((48,80,64,96)),ts.crop((80,80,96,96))]
gy0=GY-4
for x0 in range(0,W,16):
  c.alpha_composite(grass,(x0,gy0))
  for j,y0 in enumerate(range(gy0+16,H,16)):c.alpha_composite(rock[(x0//16*7+j*3)%3],(x0,y0))
# —— 摊位小道具:药剂师的木箱 + 药水,装备商人的长桌 + 剑盾,铁匠铺的铁砧
it=L(IT);ic=lambda r,q:it.crop((q*16,r*16,q*16+16,r*16+16))
P('big-crate',160);P('crate',176);
for i,(r,q) in enumerate([(3,5),(3,7),(3,4)]):c.alpha_composite(ic(r,q),(150+i*9,GY-32-14))
c.alpha_composite(ic(3,6),(170,GY-16-14))
tb=P('platform-long',236,GY-10);P('platform-long',236+0,GY-10)
for q,(r,qq) in enumerate([(0,1),(3,1),(7,1)]):c.alpha_composite(ic(r,qq),(222+q*12-4,GY-10-tb.height-12))
dr=ImageDraw.Draw(c)
for y0,x1,x2,col in [(GY-14,404,428,(73,80,87,255)),(GY-15,404,428,(33,37,41,255)),(GY-10,410,422,(52,58,64,255)),(GY-6,406,426,(52,58,64,255))]:dr.rectangle((x1,y0,x2,y0+3),fill=col)
dr.rectangle((404,GY-15,428,GY-15),fill=(134,142,150,255))
c.save(OUT);print('town',c.size)
