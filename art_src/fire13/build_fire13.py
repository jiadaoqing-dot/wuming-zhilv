# 第十三关「熔心火山」像素图集 FIRE(第四十二轮,第二张地图「暗黑大陆」左上角的火山(用户截图指定),cur = 16)
# 素材(全部外部):
#   远景:Volcano Background(cubbic,CC-BY 3.0 / CC-BY-SA 3.0 双授权,这里按 CC-BY 3.0 使用)https://opengameart.org/content/volcano-background,raw/fire13/VulcanBack1.png
#         —— 缩小一半;蓝天 / 白云换成暗红烟尘天空(只改色相和亮度)
#   地面:2D Platformer Volcano Pack 1.1(Tio Aimar,CC0)https://opengameart.org/content/2d-platformer-volcano-pack-11 的地表 / 填充块(和第九关同一套,缩到 1/4)
#   首领 焚天炎君:Evil Wizard(LuizMelo,CC0)https://luizmelo.itch.io/evil-wizard,raw/fire13/evil-wizard —— 原样(红袍火焰法师)
#   精英 炎术士:Wizard Pack(LuizMelo,CC0)https://luizmelo.itch.io/wizard-pack,raw/fire13/wizard-pack —— 紫色法袍换成焦黑 + 橙红
#   小怪 火蠕虫:Fire Worm(LuizMelo,CC0)https://luizmelo.itch.io/fire-worm,raw/fire13/fire-worm —— 原样,火球 / 火球爆炸也用它的
#   小怪 熔岩牛头人:Molten Tileset 里的 molten minotaur(zaphgames,CC-BY 3.0)https://opengameart.org/content/molten-tileset,raw/fire13/molten_minotaur_spritesheet.png
#         —— 只取朝右的那一行:前 4 帧走路、后 4 帧熔岩化出火拳
# 每个角色的所有帧按「同一个包围盒」裁掉空白,A = [身体中心 x, 身体高, 脚底 y](按待机第 0 帧算);所有角色统一面朝右
# 用法:python art_src/fire13/build_fire13.py → assets/fire13_atlas.png,打印的 meta 贴进源码 FIRE.M / FIRE.A
import os, json, colorsys
import numpy as np
from PIL import Image
R = os.path.join(os.path.dirname(__file__), '..', '..')
RAW = os.path.join(R, 'raw')
def op(p): return Image.open(os.path.join(RAW, p)).convert('RGBA')
EW = 'fire13/evil-wizard/x/Evil Wizard/Sprites/'
WP = 'fire13/wizard-pack/x/Wizard Pack/'
FW = 'fire13/fire-worm/x/Fire Worm/Sprites/'
TV = 'volcano/tio_volcano/x/PNG/'
items, META = [], {}
def recolor(im, fn):
    a = np.array(im).astype(np.float32)
    for y, x in zip(*np.nonzero(a[..., 3])):
        r, g, b = a[y, x, :3] / 255; h, l, s = colorsys.rgb_to_hls(r, g, b); v = fn(h * 360, l, s)
        if v: a[y, x, :3] = [c * 255 for c in colorsys.hls_to_rgb(*v)]
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))
def chars(name, fw, fh, anims, flip=False, fn=None):
    sheets = [(a, op(p) if isinstance(p, str) else p) for a, p in anims]
    if fn: sheets = [(a, recolor(s, fn)) for a, s in sheets]
    if flip: sheets = [(a, Image.fromarray(np.concatenate([np.array(s.crop((i * fw, 0, i * fw + fw, fh)))[:, ::-1] for i in range(s.width // fw)], 1))) for a, s in sheets]
    box = None
    for a, s in sheets:
        for i in range(s.width // fw):
            b = s.crop((i * fw, 0, i * fw + fw, fh)).getbbox()
            if b: box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    box = (max(0, box[0] - 1), max(0, box[1] - 1), min(fw, box[2] + 1), min(fh, box[3] + 1))
    w, h = box[2] - box[0], box[3] - box[1]
    for a, s in sheets:
        n = s.width // fw; out = Image.new('RGBA', (w * n, h))
        for i in range(n): out.alpha_composite(s.crop((i * fw + box[0], box[1], i * fw + box[2], box[3])), (i * w, 0))
        items.append((name + '_' + a, out, w))
    idle = sheets[0][1].crop((box[0], box[1], box[2], box[3])).getbbox()
    META[name] = [round((idle[0] + idle[2]) / 2, 1), idle[3] - idle[1], idle[3]]
# ---- 场景 ----
bg = op('fire13/VulcanBack1.png'); bg = bg.resize((bg.width // 2, bg.height // 2), Image.NEAREST)
def sky(H, l, s):   # 蓝天 → 暗红烟尘;白云 → 灰红烟
    if 180 <= H <= 250: return ((4 + 20 * l) / 360, l * .55, .55 if s > .2 else .25)
items.append(('bg', recolor(bg, sky), 0))
def tile(n):
    im = op(TV + 'volcano_pack_%s.png' % n); return im.resize((im.width // 4, im.height // 4), Image.LANCZOS)
gt, gf = tile('05'), tile('34')
g = Image.new('RGBA', (256, gt.height + gf.height))
for xx in range(0, 256, gt.width): g.alpha_composite(gt, (xx, 0)); g.alpha_composite(gf, (xx, gt.height))
a = np.array(g); a[..., 3] = np.where(a[..., 3] > 110, 255, 0); items.append(('gnd', Image.fromarray(a), 0))
# ---- 角色 ----
chars('ew', 150, 150, [('idle', EW + 'Idle.png'), ('move', EW + 'Move.png'), ('attack', EW + 'Attack.png'), ('hurt', EW + 'Take Hit.png'), ('death', EW + 'Death.png')])
def ember(H, l, s):  # 炎术士:紫袍 → 焦黑底 + 橙红
    if s > .15 and (H >= 230 or H < 10): return ((8 + 30 * l) / 360, l * .9, min(1, s * 1.1))
chars('wp', 231, 190, [('idle', WP + 'Idle.png'), ('run', WP + 'Run.png'), ('attack1', WP + 'Attack1.png'), ('attack2', WP + 'Attack2.png'), ('hurt', WP + 'Hit.png'), ('death', WP + 'Death.png')], fn=ember)
chars('fw', 90, 90, [('idle', FW + 'Worm/Idle.png'), ('walk', FW + 'Worm/Walk.png'), ('attack', FW + 'Worm/Attack.png'), ('hurt', FW + 'Worm/Get Hit.png'), ('death', FW + 'Worm/Death.png')])
chars('fb', 46, 46, [('move', FW + 'Fire Ball/Move.png'), ('boom', FW + 'Fire Ball/Explosion.png')])
mt = op('fire13/molten_minotaur_spritesheet.png').crop((0, 256, 1024, 384))
chars('mt', 128, 128, [('walk', mt.crop((0, 0, 512, 128))), ('atk', mt.crop((512, 0, 1024, 128)))])
# ---- 拼图集:一行一个条带,宽度不够就换行 ----
W = 2048; x = y = rh = 0; M = {}; pos = []
for nm, im, fw in items:
    if x + im.width > W: x = 0; y += rh + 1; rh = 0
    pos.append((nm, im, fw, x, y)); x += im.width + 1; rh = max(rh, im.height)
out = Image.new('RGBA', (W, y + rh))
for nm, im, fw, px, py in pos:
    out.alpha_composite(im, (px, py)); M[nm] = [px, py, im.width, im.height] + ([fw, im.width // fw] if fw else [])
out.save(os.path.join(R, 'assets/fire13_atlas.png'), optimize=True)
print('M:', json.dumps(M, separators=(',', ':')))
print('A:', json.dumps(META, separators=(',', ':')))
