# 药水像素图标(模块 POTI):Pixel Potion Set 16x16(yafarida,CC0,raw/potion/PotionSet16x16.png)
# 原图 4 列颜色(蓝 / 红 / 黄 / 绿)× 3 种瓶型(小瓶 / 中瓶 / 大圆瓶,最后一行 17 高);这里统一成 16×17 的格子(上面补 1 行透明)
# 用法:python art_src/potion/build_pot.py <PotionSet16x16.png> <输出 png>
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA');o=Image.new('RGBA',(64,51))
for r,(y0,y1) in enumerate([(0,16),(16,32),(32,49)]):
  for q in range(4):
    c=im.crop((q*16,y0,q*16+16,y1));o.alpha_composite(c,(q*16,r*17+17-c.height))
o.save(sys.argv[2]);print('pot',o.size)
