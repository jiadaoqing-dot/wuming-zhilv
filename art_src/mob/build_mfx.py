# 怪物攻击特效图集:Ninja Adventure(Pixel-boy & AAA,CC0)的 FX 横条,每条一行;输出 VFX.M 格式(im:1 = 用这张图)
# 用法:python3 art_src/mob/build_mfx.py <ninja-adventure/2D/top-down-rpg/FX 目录> <输出 png> <输出 json>
import sys,json
from PIL import Image
F,OUT,OJ=sys.argv[1:4]
# 名称: [文件, 帧数, fps, 锚点(0 中心 / 1 底部)]
S={'m-claw':['Attack/Claw/SpriteSheet.png',4,16,0],'m-claw2':['Attack/ClawDouble/SpriteSheet.png',4,16,0],'m-cut':['Attack/Cut/SpriteSheet.png',4,18,0],
   'm-slash':['Attack/SlashCurved/SpriteSheet.png',4,18,0],'m-explo':['Elemental/Explosion/SpriteSheet.png',9,18,0],'m-flam':['Elemental/Flam/SpriteSheet.png',8,16,1],
   'm-ice':['Elemental/Ice/SpriteSheet.png',10,20,0],'m-ice2':['Elemental/Ice/SpriteSheetB.png',9,18,0],'m-spike':['Elemental/RockSpike/SpriteSheet.png',10,18,1],
   'm-thunder':['Elemental/Thunder/SpriteSheet.png',8,18,1],'m-water':['Elemental/WaterPillar/SpriteSheet.png',9,16,1],'m-smoke':['Smoke/Smoke/SpriteSheet.png',6,14,0],
   'm-dust':['Smoke/SmokeCircular/SpriteSheet.png',4,12,1],'m-spark':['Magic/Spark/SpriteSheet.png',10,20,0],'m-poison':['Elemental/Plant/SpriteSheet.png',0,16,0]}
rows=[];M={};y=0
for k,(f,n,fps,an) in S.items():
  im=Image.open(F+'/'+f).convert('RGBA')
  if not n:n=next(c for c in range(12,1,-1) if im.width%c==0 and im.width//c<=im.height*1.6)
  w,h=im.width//n,im.height;rows.append((im,y));M[k]={'y':y,'w':w,'h':h,'n':n,'px':w//2,'py':h if an else h//2,'fps':fps,'loop':False,'im':1};y+=h
W=max(r.width for r,_ in rows);out=Image.new('RGBA',(W,y))
for r,yy in rows:out.alpha_composite(r,(0,yy))
out.save(OUT);json.dump(M,open(OJ,'w'),separators=(',',':'));print('mfx',out.size,{k:(v['n'],v['w'],v['h']) for k,v in M.items()})
