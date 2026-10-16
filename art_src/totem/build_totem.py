# 主城部落图腾 + 星界财宝宝箱(模块 TOTEM,第四十七轮)
# 素材:
#  图腾 = 32x32 Dark Forest Combat Pack(Gothul,OGA-BY 4.0,https://opengameart.org/content/32x32-dark-forest-combat-pack,raw/darkforest32)的 Totem_Off_01 / Totem_On_01~03
#  宝箱 = Sunny Land Forest(Ansimuz,CC0,raw/lv/sunny-land-forest-files)的 chest-1 / chest-2
# 改动:原样拼图,不改像素(游戏里画的时候放大 2 倍,宝箱用 filter 染成星空蓝紫)
# 用法:python art_src/totem/build_totem.py <raw> <输出 png>
# 布局:y=0 一排图腾 4 帧 32×32(x = 0 / 32 / 64 / 96:熄灭 / 亮 1~3);y=32 宝箱 36×25(x = 0 关 / 36 开)
import sys,os
from PIL import Image
R=sys.argv[1]
T=os.path.join(R,'darkforest32','x','OGA 32x32 Dark Forest Combat Pack','03. Props')
C=os.path.join(R,'lv','sunny-land-forest-files','Sunny-land-forest-files','PNG','sprites','misc','chest')
out=Image.new('RGBA',(128,57))
for i,f in enumerate(['Totem_Off_01','Totem_On_01','Totem_On_02','Totem_On_03']):out.alpha_composite(Image.open(os.path.join(T,f+'.png')).convert('RGBA'),(i*32,0))
for i in range(2):out.alpha_composite(Image.open(os.path.join(C,'chest-%d.png'%(i+1))).convert('RGBA'),(i*36,32))
out.save(sys.argv[2])
print('totem',out.size)
