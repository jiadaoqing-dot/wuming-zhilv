# 装备图标图集(2026-10-13 第十八轮重做:每个系列一件不同造型,不再只是换色)
# 素材:496 pixel art icons for medieval/fantasy RPG(Henrique Lazarini / 7Soul1,CC0,https://opengameart.org/node/39455,raw/icons/7soul1/x)
#       CC0 Jewelry Icons(AntumDeluge 整理,CC0,https://opengameart.org/content/cc0-jewelry-icons,raw/icons/jewelry):
#       其中 7Soul1 的戒指 / 项链,和 Dungeon Crawl Stone Soup 的两枚戒指(urand_octoring 火焰戒、urand_robustness 银纹戒)
# 行 = 部位(sword staff head body ring ear),列 = 系列(0 旅者 1 林王 2 荒漠 3 雪原 4 机械,第四十轮),每格 34×34(图标居中);品质轮廓在运行时加
# 改动:机械系列(第四十轮)五件换成钢青色;林王的雷光剑 / 尖帽从金色 / 紫色换成翠绿;雪原的骑士盔 / 全身甲稍微偏冰蓝;其余保持原色
# 用法:python art_src/eqicon/build_eqicon.py → assets/eq_atlas.png
import os, colorsys
from PIL import Image
R = os.path.join(os.path.dirname(__file__), '..', '..')
S7 = os.path.join(R, 'raw/icons/7soul1/x'); J = os.path.join(R, 'raw/icons/jewelry')
PICK = {
  'sword': ['W_Sword009', 'W_Sword015:g', 'W_Sword016', 'W_Sword018', 'W_Sword021:m'],       # 铁剑 / 雷光剑 / 火焰剑 / 冰晶剑
  'staff': ['W_Staff01', 'W_Staff02', 'W_Staff05', 'W_Staff06', 'W_Staff07:m'],             # 木杖 / 翠叶杖 / 金环杖 / 冰晶杖
  'head':  ['C_Elm01', 'C_Hat01:g', 'C_Elm04', 'C_Elm03:i', 'C_Elm04:m'],                 # 皮盔 / 林间尖帽 / 金边重盔 / 骑士盔
  'body':  ['A_Armor04', 'A_Armour01', 'A_Armour03', 'A_Armour02:i', 'A_Armor05:m'],        # 板甲 / 皮甲 / 金甲 / 全身甲
  'ring':  ['J:x7/32x32/ring_02', 'J:x7/32x32/ring_03_green', 'J:xd/32x32/ring/urand_octoring', 'J:xd/32x32/ring/urand_robustness', 'J:xd/32x32/ring/ring_07_silver:m'],
  'ear':   ['J:x7/32x32/necklace_08', 'J:x7/32x32/necklace_06', 'J:x7/32x32/necklace_01', 'J:x7/32x32/necklace_03', 'J:x7/32x32/necklace_05:m'],
}
C = 34
def load(n):
    n, _, fx = n.partition(':') if not n.startswith('J:') else (n[:n.index(':', 2)] if n.count(':') > 1 else n, '', n.split(':')[2] if n.count(':') > 1 else '')
    p = os.path.join(J, n[2:] + '.png') if n.startswith('J:') else os.path.join(S7, n + '.png')
    im = Image.open(p).convert('RGBA'); px = im.load()
    for j in range(im.height):
        for i in range(im.width):
            r, g, b, a = px[i, j]
            if not a: continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if fx == 'g' and s > .08: h = .33 + (h - .12) * .3 if h < .2 else .36   # 金色 / 紫色 → 翠绿
            elif fx == 'i': h, s = .55, min(1, s * .6 + .18)                         # 偏冰蓝
            elif fx == 'm': h, s = .47, min(1, s * .45 + .12)                        # 机械系列:钢青色
            else: continue
            r2, g2, b2 = colorsys.hsv_to_rgb(h % 1, s, v); px[i, j] = (int(r2 * 255), int(g2 * 255), int(b2 * 255), a)
    return im
out = Image.new('RGBA', (C * 5, C * 6))
for r, k in enumerate(PICK):
    for g, n in enumerate(PICK[k]):
        im = load(n); out.alpha_composite(im, (g * C + (C - im.width) // 2, r * C + (C - im.height) // 2))
out.save(os.path.join(R, 'assets/eq_atlas.png')); print('eq', out.size)
