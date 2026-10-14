# 像素界面九宫格贴图:Kenney「UI Pack - Pixel Adventure」(CC0)。从 tilemap_packed 裁单格,按钮换色
# 用法:python3 art_src/ui/build_ui.py <ui 目录(…/kenney-ui-pack-pixel-adventure/ui)> <assets 目录>
import sys,colorsys
from PIL import Image
U=sys.argv[1].rstrip('/');A=sys.argv[2].rstrip('/')
Lg=Image.open(U+'/Tilesheets/Large tiles/Thick outline/tilemap_packed.png').convert('RGBA')   # 32×32,13 列
Sm=Image.open(U+'/Tilesheets/Small tiles/Thick outline/tilemap_packed.png').convert('RGBA')   # 16×16,23 列
def cut(im,t,n,cols):return im.crop((n%cols*t,n//cols*t,n%cols*t+t,n//cols*t+t))
def hue(im,dh,ds=1,dv=1):
  im=im.copy();p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      r,g,b,a=p[i,j]
      if a:h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);r,g,b=colorsys.hsv_to_rgb((h+dh)%1,min(1,s*ds),min(1,v*dv));p[i,j]=(int(r*255),int(g*255),int(b*255),a)
  return im
def card(im):
  # 小卡片:用面板格,内部换成稍浅的奶油色,和外层面板区分开
  p=im.load()
  for j in range(im.height):
    for i in range(im.width):
      if p[i,j]==(255,241,210,255):p[i,j]=(255,250,236,255)
  return im
OUT={'ui_panel':cut(Lg,32,0,13),'ui_head':cut(Lg,32,1,13),'ui_slot':cut(Lg,32,19,13),'ui_card':card(cut(Lg,32,0,13)),'ui_tip':hue(cut(Lg,32,3,13),0,1.1,.5),
     'ui_btn':hue(cut(Sm,16,3,23),.075,1.05,1.08),'ui_btn_on':hue(cut(Sm,16,3,23),.33,.9,.95),'ui_tab':cut(Sm,16,49,23)}
for k,im in OUT.items():
  if im.width==16:im=im.crop(im.getbbox())   # 小按钮:裁掉上下透明边(16×12)
  im.save(f'{A}/{k}.png')
print('ui',list(OUT))
