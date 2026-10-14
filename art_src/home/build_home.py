# 主页面美术(第二十一轮,模块 HOMEUI):全部来自外部 CC0 素材,不自己画
# ① 背景 home_bg.png(640×360):Magic Cliffs Environment(ansimuz,CC0,https://opengameart.org/content/magic-cliffs-environment)
#    用预览合成图 magic-cliffs-PREVIEWx1.png 左边 640×304 的一段(浮空小岛 + 大树悬崖 + 海),上面 56 行用 sky.png 顶端的天空色补齐
# ② 边框 home_frame.png / home_btn.png / home_div.png(CSS border-image 不能取图集里的一块,所以分成三张):Fantasy UI Borders(Kenney,CC0,https://kenney.nl/assets/fantasy-ui-borders)
#    home_frame 48×48 = panel-border-003(双线 + 四角结)染成金色、加 1 像素深棕描影,框内填半透明深紫(参考图「游戏内容」面板);
#    home_btn 48×48 = 同一个框的按钮版(填橙色);home_div 192×12 = divider-fade-002 染金(标题下的分隔线)
# 用法:python art_src/home/build_home.py   (素材 zip 在 raw/home/,输出到 assets/)
import zipfile,io,os
from PIL import Image
R=os.path.join(os.path.dirname(__file__),'..','..');RAW=os.path.join(R,'raw','home');OUT=os.path.join(R,'assets')
zk=zipfile.ZipFile(os.path.join(RAW,'kenney_fantasy-ui-borders.zip'));zm=zipfile.ZipFile(os.path.join(RAW,'Magic-Cliffs-Environment.zip'))
ld=lambda z,n:Image.open(io.BytesIO(z.read(n))).convert('RGBA')
# ① 背景
pv=ld(zm,'Magic-Cliffs-Environment/PREVIEWS/magic-cliffs-PREVIEWx1.png');sky=ld(zm,'Magic-Cliffs-Environment/PNG/sky.png')
bg=Image.new('RGBA',(640,360),sky.getpixel((0,0)));bg.alpha_composite(pv.crop((0,0,640,304)),(0,56));bg.convert('RGB').save(os.path.join(OUT,'home_bg.png'))
# ② 边框
GOLD=(242,196,107,255);DARK=(74,40,16,255)
def tint(im,col,fill=None):
  a=im.getchannel('A');o=Image.new('RGBA',im.size,(0,0,0,0))
  sh=Image.new('RGBA',im.size,DARK);sh.putalpha(a);o.alpha_composite(sh,(1,1))
  if fill:  # 框内填色:从中心洪水填充到边框线为止
    m=Image.new('L',im.size,0);px=a.load();w,h=im.size;st=[(w//2,h//2)];seen=set()
    while st:
      x,y=st.pop()
      if (x,y) in seen or not(0<=x<w and 0<=y<h) or px[x,y]>0:continue
      seen.add((x,y));m.putpixel((x,y),255);st+=[(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
    f=Image.new('RGBA',im.size,fill);f.putalpha(m.point(lambda v:fill[3] if v else 0));o=Image.alpha_composite(f,o)
  c=Image.new('RGBA',im.size,col);c.putalpha(a);o.alpha_composite(c);return o
b=ld(zk,'PNG/Default/Border/panel-border-003.png');dv=ld(zk,'PNG/Default/Divider Fade/divider-fade-002.png')
tint(b,GOLD,(36,18,62,214)).save(os.path.join(OUT,'home_frame.png'));tint(b,GOLD,(232,119,12,255)).save(os.path.join(OUT,'home_btn.png'))
tint(dv,GOLD).resize((192,12),Image.NEAREST).save(os.path.join(OUT,'home_div.png'));print('home',bg.size,b.size,dv.size)