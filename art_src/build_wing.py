# 飞行翅膀:LPC Feathered Wings(ElizaWy;JaidynReiman 补帧;OGA-BY 3.0),取 run 动画朝右一行的 8 帧
# 输入 wings/run_bg.png、run_fg.png(ULPC 生成器里 body/wings/feathered/adult/{bg,fg}/run/white.png)
# 输出 wing_fly.png:第 0 行 = 身后那只(bg),第 1 行 = 身前那只(fg),每帧 64×64
import os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
out=Image.new('RGBA',(64*8,128),(0,0,0,0))
for r,l in enumerate(['bg','fg']):
  im=Image.open(os.path.join(D,'wings','run_%s.png'%l)).convert('RGBA')
  out.alpha_composite(im.crop((0,192,512,256)),(0,r*64))
out.save(os.path.join(D,'wing_fly.png'));print(out.getbbox())
