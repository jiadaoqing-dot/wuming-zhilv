# 第十五关「不眠钟楼」图集 ALC(第四十八轮,cur 19)
# 场景:GothicVania Church Pack(ansimuz,CC0,https://opengameart.org/content/gothicvania-church-pack,raw/clock19/church)背景面板 / 石柱 / 地砖,原样;
#   落地钟 = [LPC] Clock Animation(Lanea Zimmerman (Sharm) / William.Thompsonj,CC-BY 3.0,https://opengameart.org/content/lpc-clock-animation,raw/clock19/lpc_clock),原样
# 素材:Cute Sprites Pack 1(Master484,CC-BY 3.0 / OGA-BY 3.0,https://opengameart.org/content/cute-sprites-pack-1,raw/clock19/Monsters2.zip)
#  闹钟怪 AlarmClock 蓝 / 红(站立、行走 4 帧、响铃 2 帧、受伤、倒地、睡觉)· 睡觉的 Z(SleepZ)· 子弹 Electro(电铃弹)/ Fireball(火铃雨)
# 改动:原图的灰紫底色抠成透明;只用朝右的帧(朝左在游戏里翻转);第三套「绿色毒钟」= 红色闹钟色相旋转成毒绿(首领第三形态);其他原样
# 用法:python art_src/clock19/build_clock19.py <raw> <输出 png>   打印 M / A(贴进 src/parts/567_第十五关不眠钟楼.js 的 ALC)
import sys,os,json
from PIL import Image
R=sys.argv[1];D=os.path.join(R,'clock19','x','Monsters 2')
def key(im):  # 原图带不透明的灰紫底色(左上角像素),抠成透明
    im=im.convert('RGBA');bg=im.getpixel((0,0));px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            if px[x,y][:3]==bg[:3]:px[x,y]=(0,0,0,0)
    return im
_open=Image.open
Image.open=lambda p:key(_open(p))
def hue(im,h):
    hs=im.convert('HSV');H,S,V=hs.split();H=H.point(lambda v:(v+h)%256);o=Image.merge('HSV',(H,S,V)).convert('RGBA');o.putalpha(im.getchannel('A'));return o
AN=['stand','walk','alarm','damage','death','sleep']
rows=[]
for c,src,h in [('b','blue',0),('r','red',0),('g','red',85)]:
    for a in AN:
        im=Image.open(os.path.join(D,'AlarmClock',f'AlarmClock_32x32_{src}_{a}_R.png')).convert('RGBA')
        if h:im=hue(im,h)
        rows.append((c+'_'+a,im,32))
rows.append(('z',Image.open(os.path.join(D,'AlarmClock','SleepZ_8x8.png')).convert('RGBA'),8))
rows.append(('el',Image.open(os.path.join(D,'Bullets','Electro_16x16.png')).convert('RGBA'),16))
rows.append(('fb',Image.open(os.path.join(D,'Bullets','Fireball_16x16.png')).convert('RGBA'),16))
# 第四十八轮(用户:找钟楼背景):钟楼内部 = GothicVania Church(ansimuz,CC0)的背景面板 / 石柱 / 地砖 + LPC 落地钟(摆锤 3 帧)
CH=os.path.join(R,'clock19','church','x','gothicvania church files','ENVIRONMENT');bgs=_open(os.path.join(CH,'backgrounds.png')).convert('RGBA')
for i,(a,b) in enumerate([(0,160),(176,304),(320,448),(464,544),(560,624)]):rows.append(('p%d'%i,bgs.crop((a,0,b,192)),b-a))
rows.append(('col',_open(os.path.join(CH,'column.png')).convert('RGBA'),114))
ts=_open(os.path.join(CH,'tileset.png')).convert('RGBA');rows.append(('gnd',ts.crop((0,168,48,208)),48));rows.append(('gnd2',ts.crop((64,167,112,208)),48))
rows.append(('gclk',_open(os.path.join(R,'clock19','lpc_clock','animated_clock.png')).convert('RGBA').crop((0,0,96,96)),32))
W=max(r[1].width for r in rows);H=sum(r[1].height+1 for r in rows)
out=Image.new('RGBA',(W,H));M={};y=0
for k,im,fw in rows:
    out.alpha_composite(im,(0,y));M[k]=[0,y,im.width,im.height,fw,im.width//fw];y+=im.height+1
b=Image.open(os.path.join(D,'AlarmClock','AlarmClock_32x32_blue_stand_R.png')).convert('RGBA').getbbox()
A=[(b[0]+b[2])/2,b[3]-b[1],b[3]]  # 身体中心 x / 身体高 / 脚底 y
out.save(sys.argv[2]);print('M',json.dumps(M,separators=(',',':')));print('A',A,out.size)
