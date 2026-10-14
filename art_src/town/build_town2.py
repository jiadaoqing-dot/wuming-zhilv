# 晨曦镇(2026-10-12 扩大版):宽 1600(普通关卡 3200 的一半),镜头跟随;分层视差 + 高台 / 木栈台,NPC 分散
# 用法:python art_src/town/build_town2.py     素材:raw/town_jra(Sunny Land、Seasonal Tilesets、16x16 RPG Item Pack,均 CC0)、
#      raw/lv/sunny-land-woods-files(叶丛,CC0)、raw/forge(LPC Blacksmith,bluecarrot16,OGA-BY 3.0 / CC-BY 3.0)
# 输出(assets/):town2_far.png 天空大海(静止)· town2_hill.png 远山树林(视差 .35)· town2_back.png 后排房子(视差 .7)
#      town2_main.png 主层 1600×360(建筑、地面、高台、装饰)· town2_fg.png 前景(画在人物前面:草丛、垂下的叶丛)· town2_forge.png 熔炉 3 帧 + 铁砧 / 水槽
# 坐标和源码 TWN 一致(改这里也要改源码):高台 A x 200~440 顶面 252;木栈台 x 640~736 顶面 224;高台 B x 1380~1600 顶面 252
import os
from PIL import Image,ImageDraw,ImageEnhance
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
R=D+'/raw/town_jra/';SL=R+'ansimuz-sunnyland/2D/platformer/environment/';GK=R+'grafxkid-seasonal-tilesets/2D/platformer/1 - Grassland/Background parts/'
IT=R+'16x16-rpg-item-pack/2D/top-down-rpg/Sheet.png';WD=D+'/raw/lv/sunny-land-woods-files/Sunny-land-woods-files/ENVIRONMENT/props-sliced/'
FG_=D+'/raw/forge/x/lpc-blacksmith/blacksmith-smelter.png';O=D+'/assets/'
TW,H,GY=1600,360,300;VW=640
def L(p):return Image.open(p).convert('RGBA')
def crop(im):return im.crop(im.getbbox())
ts=L(SL+'tileset.png');T=lambda c,r:ts.crop((c*16,r*16,c*16+16,r*16+16))
it=L(IT);ic=lambda r,q:it.crop((q*16,r*16,q*16+16,r*16+16))
def tint(im,col,k):
  a=im.split()[3];c=Image.blend(im.convert('RGB'),Image.new('RGB',im.size,col),k).convert('RGBA');c.putalpha(a);return c
# —— 远景:天空 + 大海(静止一张)
back=L(SL+'Background/back.png');far=Image.new('RGBA',(VW,H),back.getpixel((0,0)))
for x0 in range(0,VW,back.width):far.alpha_composite(back,(x0,24))
far.paste(back.getpixel((0,back.height-1)),(0,24+back.height,VW,H));far.save(O+'town2_far.png')
# —— 远山 + 树林带(视差 .35):宽 = 640 + (1600-640)*.35
hw=VW+int((TW-VW)*.35)+2;hill=Image.new('RGBA',(hw,H))
hl=crop(L(GK+'2 - Hills.png'));fs=crop(L(GK+'1 - Foreground_scenery.png'))
for x0 in range(0,hw,hl.width):hill.alpha_composite(hl,(x0,GY-10-hl.height))
for x0 in range(-60,hw,fs.width):hill.alpha_composite(fs,(x0,GY-4-fs.height))
hill.save(O+'town2_hill.png')
# —— 后排房子(视差 .7,偏蓝灰,显得远):站在一条矮坡上
bw=VW+int((TW-VW)*.7)+2;bk=Image.new('RGBA',(bw,H))
props={n:crop(L(SL+'Props/'+n+'.png')) for n in ['house','wooden-house','straw-house','plant-house','tree','pine','palm','bush','tree-house','crate','big-crate','platform-long']}
def put(c,im,cx,bot,flip=False):
  if flip:im=im.transpose(Image.FLIP_LEFT_RIGHT)
  c.alpha_composite(im,(int(cx-im.width/2),int(bot-im.height)))
for i,(n,cx,fl) in enumerate([('pine',30,0),('house',120,0),('tree',230,1),('wooden-house',360,1),('pine',470,0),('straw-house',600,0),('tree',720,0),('house',850,1),('pine',950,0),('wooden-house',1080,0),('tree',1200,1),('house',1300,0)]):
  im=props[n];im=im.resize((int(im.width*.75),int(im.height*.75)),Image.NEAREST);put(bk,tint(im,(150,185,225),.45),cx,GY-22,fl)
dr=ImageDraw.Draw(bk);dr.rectangle((0,GY-24,bw,GY-14),fill=(120,170,110,255));dr.rectangle((0,GY-25,bw,GY-25),fill=(150,200,130,255))
bk.save(O+'town2_back.png')
# —— 主层
c=Image.new('RGBA',(TW,H));fg=Image.new('RGBA',(TW,H))
rock=[ts.crop((16,80,32,96)),ts.crop((48,80,64,96)),ts.crop((80,80,96,96))]
def terrace(x0,x1,top):
  # 高台:草皮顶 + 泥土,左右是边缘图块(Sunny Land 3×3 图块:列 1/3/5,行 1/3)
  for x in range(x0,x1,16):
    col=1 if x==x0 else 5 if x+16>=x1 else 3
    c.alpha_composite(T(col,1),(x,top-4))
    for j,y in enumerate(range(top+12,GY+12,16)):c.alpha_composite(rock[(x//16*7+j*3)%3],(x,y))
# 远处大树 / 松树(在建筑后面)
put(c,props['pine'],-8,GY);put(c,props['tree'],40,GY);put(c,props['pine'],560,GY-40);put(c,props['tree'],1340,GY,True);put(c,props['pine'],1110,GY-30)
# 建筑
terrace(200,440,GY-48)
put(c,props['tree-house'],300,GY-48)                       # 技能导师:高台上的树屋
put(c,props['straw-house'],560,GY)                         # 药剂师:草屋
put(c,props['wooden-house'],1010,GY)                       # 装备商人:木屋
put(c,props['plant-house'],1170,GY)                        # 强化师:带烟囱的石屋
terrace(1380,1600,GY-48)
put(c,props['house'],1580,GY-48);put(c,props['palm'],1395,GY-48,True)
# 木栈台(x 640~736,顶面 224):木板 + 两根木桩 + 梯子
for x in range(640,736,32):c.alpha_composite(props['platform-long'],(x,224-2))
dr=ImageDraw.Draw(c)
for px_ in (648,724):dr.rectangle((px_,236,px_+3,GY),fill=(107,68,35,255));dr.rectangle((px_,236,px_,GY),fill=(140,94,52,255))
for y in range(238,GY,16):c.alpha_composite(T(7,10),(680,y))
# 栈台上的木箱和灯笼
put(c,props['crate'],660,224);put(c,props['big-crate'],714,224)
# 地面:草皮 + 石块
grass=T(3,1);rock=[ts.crop((16,80,32,96)),ts.crop((48,80,64,96)),ts.crop((80,80,96,96))]
for x0 in range(0,TW,16):
  c.alpha_composite(grass,(x0,GY-4))
  for j,y0 in enumerate(range(GY+12,H,16)):c.alpha_composite(rock[(x0//16*7+j*3)%3],(x0,y0))
# —— 自画的像素小物件
def lamp(x,bot):  # 路灯:黑铁杆 + 暖黄灯罩
  d=ImageDraw.Draw(c);d.rectangle((x-1,bot-40,x+1,bot),fill=(52,46,58,255));d.rectangle((x-3,bot-2,x+3,bot),fill=(52,46,58,255))
  d.rectangle((x-4,bot-48,x+4,bot-40),fill=(52,46,58,255));d.rectangle((x-3,bot-47,x+3,bot-41),fill=(255,212,96,255));d.rectangle((x-2,bot-46,x-1,bot-44),fill=(255,248,214,255));d.rectangle((x-5,bot-50,x+5,bot-49),fill=(52,46,58,255))
def fence(x0,x1,bot):  # 木栅栏
  d=ImageDraw.Draw(c)
  for x in range(x0,x1,8):d.rectangle((x,bot-14,x+2,bot),fill=(150,100,56,255));d.rectangle((x,bot-15,x+2,bot-15),fill=(190,140,80,255));d.rectangle((x+2,bot-14,x+2,bot),fill=(110,70,38,255))
  for y in (bot-11,bot-5):d.rectangle((x0,y,x1-6,y+1),fill=(170,118,64,255))
def bench(x,bot):
  d=ImageDraw.Draw(c);d.rectangle((x-12,bot-9,x+12,bot-7),fill=(160,108,58,255));d.rectangle((x-12,bot-14,x+12,bot-13),fill=(140,94,52,255))
  for k in (-10,9):d.rectangle((x+k,bot-7,x+k+1,bot),fill=(80,60,50,255))
def flowers(x0,x1,bot,seed):
  d=ImageDraw.Draw(c);cols=[(255,107,107),(255,212,59),(204,93,232),(255,255,255),(116,192,252)]
  for i,x in enumerate(range(x0,x1,5)):
    h=3+(i*7+seed)%4;d.rectangle((x,bot-h,x,bot),fill=(64,148,60,255));d.rectangle((x-1,bot-h-1,x+1,bot-h+1),fill=cols[(i+seed)%5]+(255,))
def sign(x,bot):
  d=ImageDraw.Draw(c);d.rectangle((x-1,bot-22,x+1,bot),fill=(110,70,38,255));d.rectangle((x-12,bot-24,x+10,bot-15),fill=(170,118,64,255));d.rectangle((x-12,bot-24,x+10,bot-24),fill=(200,150,90,255))
  d.polygon([(x+10,bot-24),(x+14,bot-20),(x+10,bot-15)],fill=(170,118,64,255))
def bunting(x0,x1,y0):  # 彩旗串
  d=ImageDraw.Draw(c);cols=[(255,107,107),(255,212,59),(81,207,102),(116,192,252),(204,93,232)]
  n=(x1-x0)//10
  for i in range(n+1):
    x=x0+i*10;y=y0+int(6*(1-((2*i/n)-1)**2))
    d.point((x,y),fill=(90,70,60,255))
    if i<n:
      x2=x0+(i+1)*10;y2=y0+int(6*(1-((2*(i+1)/n)-1)**2));d.line((x,y,x2,y2),fill=(90,70,60,255));d.polygon([(x+2,y+1),(x+8,y+1),(x+5,y+7)],fill=cols[i%5]+(255,))
def well(x,bot):  # 水井
  d=ImageDraw.Draw(c);d.rectangle((x-14,bot-16,x+14,bot),fill=(134,142,150,255))
  for yy in range(bot-16,bot,5):d.line((x-14,yy,x+14,yy),fill=(100,108,118,255))
  d.rectangle((x-12,bot-18,x+12,bot-16),fill=(60,90,140,255))
  for k in (-13,12):d.rectangle((x+k,bot-40,x+k+1,bot-16),fill=(110,70,38,255))
  d.polygon([(x-18,bot-40),(x,bot-50),(x+18,bot-40)],fill=(181,72,58,255));d.line((x-18,bot-40,x+18,bot-40),fill=(120,44,36,255))
  d.rectangle((x-1,bot-38,x,bot-24),fill=(200,200,200,255))
lamp(150,GY);lamp(470,GY);lamp(760,GY);lamp(880,GY);lamp(1080,GY);lamp(1360,GY)
fence(10,96,GY);fence(452,500,GY);fence(1420,1470,GY-48)
bench(720,GY);bench(920,GY);flowers(764,800,GY,1);flowers(840,876,GY,3);flowers(210,250,GY-48,2);flowers(600,632,GY,4)
sign(180,GY);sign(1350,GY);well(1300,GY)
bunting(760,880,198)
put(c,props['bush'],108,GY);put(c,props['bush'],1440,GY-48,True);put(c,props['bush'],940,GY)
# 摊位小道具:药剂师木箱 + 药水,装备商人长桌 + 剑盾
put(c,props['big-crate'],512,GY);put(c,props['crate'],530,GY)
for i,(r,q) in enumerate([(3,5),(3,7),(3,4)]):c.alpha_composite(ic(r,q),(500+i*9,GY-46))
for x in (950,982):c.alpha_composite(props['platform-long'],(x,GY-12))
for q,(r,qq) in enumerate([(0,1),(3,1),(7,1)]):c.alpha_composite(ic(r,qq),(952+q*20,GY-26))
# 熔炉一侧:铁砧、水槽、工具架(LPC Blacksmith,放在主层;熔炉本体每帧画火光动画)
sm=L(FG_)
anv=crop(sm.crop((256,416,320,448)));rack=crop(sm.crop((384,480,448,544)))
put(c,anv,1222,GY);put(c,rack,1112,GY)
# 熔炉帧:小熔炉 64×128,第 1~3 帧点火(第 0 帧熄火不用)
fr=Image.new('RGBA',(192,128))
for i in range(3):fr.alpha_composite(sm.crop((64*(i+1),0,64*(i+2),128)),(64*i,0))
fr.save(O+'town2_forge.png')
# —— 前景(画在人物前面):地面上零星的草丛 + 左右上角垂下的叶丛
gt=[T(1,7),T(3,7)]
for i,x in enumerate(range(30,TW,97)):
  if 1440<x<1600 or 200<x<440:continue
  fg.alpha_composite(gt[i%2],(x,GY-12))
lv=crop(L(WD+'leaves.png'))
for x,y,fl in [(-40,-30,0),(520,-50,1),(1180,-40,0),(1520,-34,1)]:fg.alpha_composite(lv.transpose(Image.FLIP_LEFT_RIGHT) if fl else lv,(x,y))
c.save(O+'town2_main.png');fg.save(O+'town2_fg.png')
print('town2',c.size,'forge',fr.size)
