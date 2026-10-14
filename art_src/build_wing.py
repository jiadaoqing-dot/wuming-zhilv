# 飞行翅膀:LPC Feathered Wings(ElizaWy;JaidynReiman 补帧;OGA-BY 3.0,https://opengameart.org/content/lpc-wings-new-animations)
# 第三十一轮改成展开扇动:取 jump 动画朝右一行(第 1、2、4 帧是张开的羽翼,第 3 帧是下扇),排成 8 帧循环
# (以前用 run 动画,翅膀一直收着;wings/run_*.png 留着备用)
# 输入 wings/jump_bg.png、jump_fg.png(ULPC 生成器里 body/wings/feathered/adult/{bg,fg}/jump/white.png)
# 输出 wing_fly.png(再复制到 assets/):第 0 行 = 身后那只(bg),第 1 行 = 身前那只(fg),每帧 64×64
import os,shutil
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
SEQ=[2,2,4,1,3,3,1,4]  # 张开 → 下扇 → 再张开
out=Image.new('RGBA',(64*8,128),(0,0,0,0))
for r,l in enumerate(['bg','fg']):
  im=Image.open(os.path.join(D,'wings','jump_%s.png'%l)).convert('RGBA')
  for k,j in enumerate(SEQ):out.alpha_composite(im.crop((j*64,192,j*64+64,256)),(k*64,r*64))
out.save(os.path.join(D,'wing_fly.png'));print(out.getbbox())
shutil.copy(os.path.join(D,'wing_fly.png'),os.path.join(D,'..','assets','wing_fly.png'))
