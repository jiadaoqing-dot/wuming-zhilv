# 第十二关「永夜王城」像素图集 CST(第四十一轮,第二张地图「暗黑大陆」右上角的紫晶城堡,cur = 15)
# 素材(全部外部,只用 CC0):
#   场景:Old Dark Castle Interior Tileset(Luis Zuno / ansimuz,CC0,Gothicvania Patreon Collection,https://ansimuz.itch.io/gothicvania-patreon-collection,
#         raw/gothic_pc)—— 背景原样;地面用石柱块横向拼接,浮空平台用小石块
#   首领 夜王:Medieval King Pack 2(LuizMelo,CC0,https://luizmelo.itch.io/medieval-king-pack-2,raw/castle12/king)
#   精英 夜巫:EVil Wizard 2(LuizMelo,CC0,https://luizmelo.itch.io/evil-wizard-2,raw/castle12/wizard2)
#   小怪 骷髅卫兵 / 哥布林投弹手:Monsters Creatures Fantasy(LuizMelo,CC0,https://luizmelo.itch.io/monsters-creatures-fantasy,raw/castle12/monsters)
# 每个角色的所有帧按「同一个包围盒」裁掉空白(帧内相对位置不变),A = [身体中心 x, 身体高, 脚底 y](按待机第 0 帧算)
# 用法:python art_src/castle/build_castle.py → assets/cst_atlas.png,打印的 meta 贴进源码 CST.M / CST.A
import os, json
from PIL import Image
R = os.path.join(os.path.dirname(__file__), '..', '..')
RAW = os.path.join(R, 'raw')
def op(p): return Image.open(os.path.join(RAW, p)).convert('RGBA')
GC = 'gothic_pc/x/Old-dark-Castle-tileset-Files/PNG/'
KG = 'castle12/king/Medieval King Pack 2/Medieval King Pack 2/Sprites/'
WZ = 'castle12/wizard2/evil-wizard-2-2648971/EVil Wizard 2/Sprites/'
MO = 'castle12/monsters/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/'
M2 = 'castle12/monsters/Monster_Creatures_Fantasy(Version 1.2)/Monster_Creatures_Fantasy(Version 1.2)/'
M3 = 'castle12/monsters/Monster_Creatures_Fantasy(Version 1.3)/Monster_Creatures_Fantasy(Version 1.3)/'
items = []  # (名字, 图, 帧宽)
META = {}
def chars(name, fw, fh, anims):
    """anims: [(动作名, 路径)];所有帧取同一个包围盒"""
    sheets = [(a, op(p)) for a, p in anims]
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
items.append(('bg', op(GC + 'old-dark-castle-interior-background.png'), 0))
T = op(GC + 'old-dark-castle-interior-tileset.png')
pil = T.crop((320, 152, 352, 224))           # 带青苔顶的石柱 32×72
g = Image.new('RGBA', (256, 64))
for xx in range(0, 256, 32): g.alpha_composite(pil.crop((0, 0, 32, 64)), (xx, 0))
items.append(('gnd', g, 0))
items.append(('plat', T.crop((64, 88, 112, 112)), 0))   # 浮空小石块:左 / 中 / 右各 16
# ---- 角色 ----
chars('kg', 160, 111, [(a.lower().replace(' ', ''), KG + a + '.png') for a in ('Idle', 'Run', 'Attack1', 'Attack2', 'Attack3', 'Take Hit', 'Death', 'Jump', 'Fall')])
chars('wz', 250, 250, [('idle', WZ + 'Idle.png'), ('run', WZ + 'Run.png'), ('attack1', WZ + 'Attack1.png'), ('attack2', WZ + 'Attack2.png'), ('hurt', WZ + 'Take hit.png'), ('death', WZ + 'Death.png')])
chars('skl', 150, 150, [('idle', MO + 'Skeleton/Idle.png'), ('walk', MO + 'Skeleton/Walk.png'), ('attack', MO + 'Skeleton/Attack.png'), ('shield', MO + 'Skeleton/Shield.png'), ('hurt', MO + 'Skeleton/Take Hit.png'), ('death', MO + 'Skeleton/Death.png')])
chars('gob', 150, 150, [('idle', MO + 'Goblin/Idle.png'), ('run', MO + 'Goblin/Run.png'), ('attack', MO + 'Goblin/Attack.png'), ('throw', M3 + 'Goblin/Attack3.png'), ('hurt', MO + 'Goblin/Take Hit.png'), ('death', MO + 'Goblin/Death.png')])
chars('bomb', 100, 100, [('f', M3 + 'Goblin/Bomb_sprite.png')])
# ---- 排版:按高度从大到小一行一行摆,宽 2048 ----
W = 2048; x = y = rowh = 0; M = {}; pos = []
for k, im, fw in sorted(items, key=lambda q: -q[1].height):
    if x + im.width > W: x = 0; y += rowh + 1; rowh = 0
    pos.append((k, im, x, y)); M[k] = [x, y, im.width, im.height] + ([fw, im.width // fw] if fw else [])
    x += im.width + 1; rowh = max(rowh, im.height)
out = Image.new('RGBA', (W, y + rowh))
for k, im, px, py in pos: out.alpha_composite(im, (px, py))
out.save(os.path.join(R, 'assets/cst_atlas.png'), optimize=True)
print('cst', out.size); print(json.dumps(M, separators=(',', ':'))); print(json.dumps(META, separators=(',', ':')))
