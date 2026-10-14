# 法师召唤物 + 精灵像素图(模块 SMN,2026-10-13 第十九轮)
# 素材:
#  飞鸟 = Phoenix(Chasersgaming,CC0,https://opengameart.org/content/phoenix-reborn,raw/summon19/Phoenix_SpriteSheet_0.png)
#  藤蔓 = Pixel Predator Plant Mob Character(CraftPix.net,OGA-BY 3.0,https://opengameart.org/content/pixel-predator-plant-mob-character,raw/summon19/predator_plant)
#  精灵 = Super Random Sprites 里的小仙子(GrafxKid,CC0,https://opengameart.org/content/super-random-sprites,raw/summon19/super_random_sprites.png)
# 改动:只裁帧、去掉底色 / 格线,原样排进一张图;食人花取朝右的那一排(待机 4 帧、攻击 7 帧、死亡 10 帧)。
# 用法:python art_src/summon/build_smn.py <raw/summon19> <输出 png>
# 布局:第 0 行(高 32):凤凰飞行 6 帧 + 精灵 4 帧,每格 32;第 1~3 行(每行高 64):食人花 待机 / 攻击 / 死亡,每格 64
import sys,os
from PIL import Image
D=sys.argv[1]
out=Image.new('RGBA',(640,224))
def key(im,cols):
  im=im.convert('RGBA');px=im.load()
  for y in range(im.height):
    for x in range(im.width):
      if px[x,y][:3] in cols:px[x,y]=(0,0,0,0)
  return im
ph=key(Image.open(os.path.join(D,'Phoenix_SpriteSheet_0.png')),{(64,64,64)})
# 第三十一轮:去掉白眼睛和黄鸟喙(元素生物,只留鸟的轮廓),眼睛用下方的红色补,鸟喙黄色换成同亮度的红
pp=ph.load()
for k in range(6):
  for x,y in((26,14),(27,14)):pp[k*32+x,y]=pp[k*32+x,y+1]
  for y in range(32):
    for x in range(28,32):
      c=pp[k*32+x,y][:3]
      if c==(255,191,0):pp[k*32+x,y]=(255,63,0,255)
      elif c==(229,172,0):pp[k*32+x,y]=(204,51,0,255)
for k in range(6):out.alpha_composite(ph.crop((k*32,0,k*32+32,32)),(k*32,0))
fa=Image.open(os.path.join(D,'super_random_sprites.png')).convert('RGBA')
bgc=fa.getpixel((200,300))[:3];fa=key(fa,{bgc})
for k in range(4):out.alpha_composite(fa.crop((32+k*32,128,64+k*32,160)),(192+k*32,0))
P=os.path.join(D,'predator_plant','x')
for r,(a,n) in enumerate([('Idle',4),('Attack',7),('Death',10)]):
  im=Image.open(os.path.join(P,a,'Plant3_%s_full.png'%a)).convert('RGBA')
  for k in range(n):out.alpha_composite(im.crop((k*64,192,k*64+64,256)),(k*64,32+r*64))
out.save(sys.argv[2])
print('smn',out.size)
for r in range(3):
  bb=[out.crop((k*64,32+r*64,k*64+64,96+r*64)).getbbox() for k in range(10)]
  print(r,bb)
