# 第十一关「齿轮要塞」像素图集 MECH(第四十轮,第二张地图「暗黑大陆」左下角的机械城)
# 素材(全部外部,只用 CC0 / OGA-BY):
#   背景:Industrial Parallax Background(Luis Zuno / ansimuz,CC0,https://opengameart.org/content/industrial-parallax-background,raw/mech/parallax-industrial-pack_0)
#   地面 / 平台 / 场景道具:16x16 Industrial Tileset(0x72,CC0,https://0x72.itch.io/16x16-industrial-tileset,raw/mech/industrial_0x72)—— 原图是单色,这里按亮度换成青绿色调配合背景
#   小怪:Enemies for Platformer Pixel Art(CraftPix.net,OGA-BY 3.0,https://opengameart.org/content/enemies-for-platformer-pixel-art,raw/mech/enemies_for_platformer_pixel_art)第 4 / 5 / 6 号机器人
#   首领:Bosses Pixel Art Sprite Sheet(CraftPix.net,OGA-BY 3.0,https://opengameart.org/content/bosses-pixel-art-sprite-sheet,raw/mech/bosses-pixel-art-sprite-sheet-pack)第 2 号机甲步行坦克 + 子弹
#   爆炸:Warped City(ansimuz,CC0,raw/city/warped_city_files)enemy-explosion
# 用法:python art_src/mech/build_mech.py → assets/mech_atlas.png,打印的 meta 贴进源码 MECH.M
import os, json, colorsys
from PIL import Image
R = os.path.join(os.path.dirname(__file__), '..', '..')
RAW = os.path.join(R, 'raw')
def op(p): return Image.open(os.path.join(RAW, p)).convert('RGBA')
items = []  # (名字, 图, 帧宽)
# ---- 背景四层(原样)----
BG = 'mech/parallax-industrial-pack_0/parallax-industrial-pack/layers/skill-desc_000%d_%s.png'
for k, (i, n) in {'bg': (3, 'bg'), 'far': (2, 'far-buildings'), 'bld': (1, 'buildings'), 'fg': (0, 'foreground')}.items():
    items.append((k, op(BG % (i, n)), 0))
# ---- 地面 / 平台 / 道具:0x72 工业图块换成青绿色 ----
T = op('mech/industrial_0x72/industrial_564154.png')
RAMP = [(20, 38, 42), (36, 66, 66), (56, 98, 92), (84, 138, 122), (134, 194, 170), (206, 244, 222)]
def tint(im):
    im = im.copy(); px = im.load()
    for j in range(im.height):
        for i in range(im.width):
            r, g, b, a = px[i, j]
            if not a: continue
            if r > 200 and b > 200 and g < 60: px[i, j] = (0, 0, 0, 0); continue   # 洋红底
            if r > g + 60 and r > b + 20:                                         # 红色指示灯 → 橙黄警示灯
                px[i, j] = (255, 170, 60, a); continue
            l = (r * .3 + g * .59 + b * .11) / 255; q = min(len(RAMP) - 1, int(l * len(RAMP) * 1.15))
            px[i, j] = RAMP[q] + (a,)
    return im
def tc(x, y, w, h): return tint(T.crop((x, y, x + w, y + h)))
# 地面条 256×64:顶上一排桁架(192,0 起 4 块),下面铺 32×32 的菱纹钢板(80,208)
g = Image.new('RGBA', (256, 64))
tr = tc(192, 0, 64, 16); pl = tc(80, 208, 32, 32)
for xx in range(0, 256, 32):
    g.alpha_composite(pl, (xx, 16)); g.alpha_composite(pl.crop((0, 0, 32, 16)), (xx, 48))
for xx in range(0, 256, 64): g.alpha_composite(tr, (xx, 0))
items.append(('gnd', g, 0))
items.append(('plat', tc(0, 128, 64, 16), 0))      # 传送带:左端 / 中段 / 中段 / 右端各 16
items.append(('belt', tc(0, 144, 64, 16), 0))      # 地面传送带(另一种花纹)
PROPS = {}  # 图块里的锅炉 / 罐子只有轮廓线,不用;场景道具用背景的前景层
for k, b in PROPS.items(): items.append(('p_' + k, tc(*b), 0))
# ---- 小怪(CraftPix 机器人,48×48 一帧)----
EN = 'mech/enemies_for_platformer_pixel_art/'
for k, n in (('gbot', 4), ('zdr', 5), ('tank', 6)):
    for a in ('Idle', 'Walk', 'Attack', 'Hurt', 'Death'):
        items.append((k + '_' + a.lower(), op(EN + '%d/%s.png' % (n, a)), 48))
items.append(('ball', op(EN + '6/Ball1.png'), 0))
# ---- 首领(CraftPix 2 号机甲,72×72 一帧)----
BO = 'mech/bosses-pixel-art-sprite-sheet-pack/2/'
for a in ('Idle', 'Walk', 'Attack1', 'Attack2', 'Attack3', 'Attack4', 'Sneer', 'Hurt', 'Death'):
    items.append(('mb_' + a.lower(), op(BO + a + '.png'), 72))
items.append(('bullet', op(BO + 'Bullet.png'), 0))
# ---- 爆炸(Warped City)----
EX = 'city/warped_city_files/warped city files/SPRITES/misc/enemy-explosion/enemy-explosion-%d.png'
ex = [op(EX % i) for i in range(1, 7)]; s = Image.new('RGBA', (ex[0].width * 6, ex[0].height))
for i, e in enumerate(ex): s.alpha_composite(e, (i * ex[0].width, 0))
items.append(('boom', s, ex[0].width))
# ---- 排版:按高度从大到小一行一行摆,宽 1024 ----
W = 1024; x = y = rowh = 0; M = {}; pos = []
for k, im, fw in sorted(items, key=lambda q: -q[1].height):
    if x + im.width > W: x = 0; y += rowh + 1; rowh = 0
    pos.append((k, im, x, y)); M[k] = [x, y, im.width, im.height] + ([fw, im.width // fw] if fw else [])
    x += im.width + 1; rowh = max(rowh, im.height)
out = Image.new('RGBA', (W, y + rowh))
for k, im, px, py in pos: out.alpha_composite(im, (px, py))
out.save(os.path.join(R, 'assets/mech_atlas.png'))
print('mech', out.size); print(json.dumps(M, separators=(',', ':')))
