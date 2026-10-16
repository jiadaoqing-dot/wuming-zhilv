# 菜单按钮 + 宠物技能像素图标(模块 MENI,2026-10-13 第十五轮)
# 素材:496 pixel art icons for medieval/fantasy RPG(Henrique Lazarini / 7Soul1,CC0,https://opengameart.org/node/39455,raw/icons/7soul1/x)
# 改动:原样挑图(34×34),排成一行;「声音」喇叭图标原包没有,按同一画风(黑描边 + 两档明暗)自画。
# 同时下载了 RPG UI Icons(OwlishMedia,CC0,https://opengameart.org/content/rpg-ui-icons,raw/icons/owlish)备用,目前没用到。
# 用法:python art_src/ui/build_meni.py <raw/icons/7soul1/x> <输出 png>
# 顺序(和源码 MENI.K 一致):声音 GM 签到 任务 宠物 精灵 商城 技能 背包 | 小鸡 攻 守 回旋扇 迟缓之风 | 仓鼠 嗑瓜子 护盾 拍打 丢壳
# 第十九轮追加(17 起):低级 / 中级属性石 合成添加剂 小礼袋(小宝箱)宠物饲料(面包)低级 / 中级 / 高级幸运宝石 双倍爆率卡
# 「owlish:名字」= RPG UI Icons(OwlishMedia,CC0)里的图
import sys,os
from PIL import Image,ImageDraw
D=sys.argv[1];C=34
PICK=[None,'W_Mace003','I_Clock','I_Scroll','I_Feather02','S_Holy08','I_GoldCoin','W_Book02','I_Chest01',
      'S_Buff14','S_Holy09','S_Wind02','S_Wind03','I_C_Nut','I_SolidShell','S_Physic01','S_Physic02',
      'I_Sapphire','I_Amethist','P_Green03','I_Chest01','I_C_Bread','I_Agate','I_Opal','I_Diamond','I_Scroll02',
      # 第三十三轮追加(26 起):低碳钢 犀牛皮 绢帛 金丝线 亚麻 动物皮胶 洗脸券 | 增幅宝石 暴击 攻击 HP 防御 | 制作书 锻造石
      'I_SilverBar','I_WolfFur','I_Fabric','I_GoldBar','I_Leaf','I_Bottle03','I_Map','I_Ruby','I_Crystal01','I_Jade','I_Crystal03','I_Book','I_Rock03',
      # 第四十轮追加(39 起):上帝卡牌 暴击升级 / 来个好伙计
      'S_Light02','S_Buff01',
      # 第四十一轮追加(41 起):怪物技能石
      'I_Crystal02',
      # 第四十二轮追加(42 起):360 小鸟碎片(鸟喙)/ 武器幻化券(镜子)
      'I_BirdsBeak','I_Mirror',
      # 第四十六轮追加(44 起):高级属性石(I_Sapphire 色相转成橙金)/ 星界财宝(I_Chest01 色相转成紫色)
      'hue:I_Sapphire:110','hue:I_Chest01:180']
def speaker():
  im=Image.new('RGBA',(C,C));d=ImageDraw.Draw(im)
  # 喇叭:灰蓝箱体 + 喇叭口,三道黄白声波;最后统一加 1 像素黑描边
  d.rectangle((6,13,11,21),fill=(150,160,190));d.rectangle((6,13,11,14),fill=(205,212,232))
  d.polygon([(11,13),(19,6),(19,28),(11,21)],fill=(120,128,160));d.polygon([(11,13),(19,6),(19,9),(12,15)],fill=(190,198,222))
  for r,c in [(5,(255,236,140)),(9,(255,214,90)),(13,(255,186,60))]:
    d.arc((19-r,17-r,19+r,17+r),-50,50,fill=c,width=2)
  px=im.load();o=im.copy();po=o.load()
  for y in range(C):
    for x in range(C):
      if px[x,y][3]==0 and any(0<=x+dx<C and 0<=y+dy<C and px[x+dx,y+dy][3]>0 for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):po[x,y]=(20,16,24,255)
  return o
out=Image.new('RGBA',(C*len(PICK),C))
for i,n in enumerate(PICK):
  if n and n.startswith('hue:'):
    _,nm,h=n.split(':');t=Image.open(os.path.join(D,nm+'.png')).convert('RGBA');hs=t.convert('HSV');H,S_,V=hs.split();H=H.point(lambda v:(v+int(h))%256);t2=Image.merge('HSV',(H,S_,V)).convert('RGBA');t2.putalpha(t.getchannel('A'));t=t2
  else:
   t=speaker() if n is None else Image.open(os.path.join(D,'..','..','owlish','x',n[7:]+'.png') if n.startswith('owlish:') else os.path.join(D,n+'.png')).convert('RGBA')
  if t.width>C or t.height>C:t.thumbnail((C,C),Image.NEAREST)
  out.alpha_composite(t,(i*C+(C-t.width)//2,(C-t.height)//2))
out.save(sys.argv[2]);print('meni',out.size)
