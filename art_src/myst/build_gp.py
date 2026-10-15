# 神秘副本 2「梦魇幽驹」/ 神秘副本 3「深渊炎魔」图集 GP(2026-10-15 第三十九轮)
# 素材:Gothicvania Patreon's Collection(作者 ansimuz,CC0,https://opengameart.org/content/gothicvania-patreons-collection)
#   用到:Nightmare(待机 / 奔跑)、Flying Demon(待机 / 攻击含吐息)、breath-fire(爆炎)、Fire Skull(火颅)、Hell Hound(奔跑)、
#   Hell Beast 的 fire-ball(火球)、Old Dark Castle 室内背景(副本 2 场地)、Night Town 背景层 + Gothic Castle 预览图底部的金砖地面(副本 3 场地)
# 改动:火颅、爆炎另做一套按色相旋转成幽蓝色(给梦魇幽驹用);其余保持原样,按帧横排打包
# 用法:python art_src/myst/build_gp.py → assets/gp_atlas.png + 打印 meta(贴进源码 GP.M):名字 → [x, y, 帧宽, 帧高, 帧数]
import os, json
import numpy as np
from PIL import Image

R = os.path.join(os.path.dirname(__file__), '..', '..')
S = os.path.join(R, 'raw/gothic_pc/x')

def ld(p): return Image.open(os.path.join(S, p)).convert('RGBA')

def hue(im, deg):
    a = np.array(im); al = a[..., 3:].copy()
    hsv = np.array(Image.fromarray(a[..., :3]).convert('HSV')).astype(np.int32)
    hsv[..., 0] = (hsv[..., 0] + int(deg / 360 * 255)) % 256
    rgb = np.array(Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB'))
    return Image.fromarray(np.concatenate([rgb, al], -1))

ITEMS = [  # 名字, 图, 帧宽, 帧数
    ('nm_i', ld('Nightmare-Files/PNG/nightmare-idle.png'), 128, 4),
    ('nm_r', ld('Nightmare-Files/PNG/nightmare-galloping.png'), 144, 4),
    ('dm_i', ld('demon-Files/PNG/demon-idle.png'), 160, 6),
    ('dm_a', ld('demon-Files/PNG/demon-attack.png'), 240, 11),
    ('bf_o', ld('demon-Files/PNG/breath-fire.png'), 160, 5),
    ('bf_b', hue(ld('demon-Files/PNG/breath-fire.png'), 175), 160, 5),
    ('sk_o', ld('Fire-Skull-Files/PNG/fire-skull.png'), 96, 8),
    ('sk_b', hue(ld('Fire-Skull-Files/PNG/fire-skull.png'), 175), 96, 8),
    ('hh_r', ld('Hell-Hound-Files/PNG/hell-hound-run.png'), 67, 5),
    ('fb', ld('Hell-Beast-Files/PNG/fire-ball.png'), 19, 3),
    ('bg2', ld('Old-dark-Castle-tileset-Files/PNG/preview-old-dark-castle-interior-tileset.png'), 960, 1),
    ('n_sky', ld('night-town-background-files/layers/night-town-background-sky.png'), 96, 1),
    ('n_cld', ld('night-town-background-files/layers/night-town-background-clouds.png'), 288, 1),
    ('n_mnt', ld('night-town-background-files/layers/night-town-background-mountains.png'), 96, 1),
    ('n_twn', ld('night-town-background-files/layers/night-town-background-town.png'), 512, 1),
    ('n_flr', ld('Gothic-Castle-Files/PNG/gothic-castle-preview.png').crop((0, 304, 1024, 336)), 1024, 1),
]
W = max(im.width for _, im, _, _ in ITEMS)
# 简单装箱:按行放,一行放不下就换行
pos = {}; x = y = rh = 0
for n, im, fw, k in ITEMS:
    if x + im.width > W: x = 0; y += rh + 1; rh = 0
    pos[n] = (x, y); x += im.width + 1; rh = max(rh, im.height)
H = y + rh
out = Image.new('RGBA', (W, H))
M = {}
for n, im, fw, k in ITEMS:
    px, py = pos[n]; out.paste(im, (px, py)); M[n] = [px, py, fw, im.height, k]
dst = os.path.join(R, 'assets/gp_atlas.png'); out.save(dst, optimize=True)
print(out.size, os.path.getsize(dst)); print(json.dumps(M, separators=(',', ':')))
