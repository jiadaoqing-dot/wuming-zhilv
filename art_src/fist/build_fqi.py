# 格斗家「八门」的红色气拳(第七十三轮):Energy Sprite Sheets(fzeeshan,CC0)
#   https://opengameart.org/content/energy-sprite-sheets(raw/fist72/energy_fzeeshan/energy2_0.png,8×8 格每格 400×400,共 60 帧的尖刺状能量团)
# 改动:每隔 5 帧取 1 帧(12 帧),裁到中间 340×340 缩成 48×48;按亮度(γ 2.6)换成红色(白芯 → 浅橙红,黄 → 红,橙 → 暗红);
#       透明度分 5 档、颜色限 6 级,像素块更干净。不改形状(尖刺本来就是不规则的,游戏里每帧再随机旋转 / 翻转 / 拉伸)
# 用法:python art_src/fist/build_fqi.py → assets/fqi.png(12 帧横排,每帧 48×48)
import os
import numpy as np
from PIL import Image

R = os.path.join(os.path.dirname(__file__), '..', '..')
src = Image.open(os.path.join(R, 'raw/fist72/energy_fzeeshan/energy2_0.png')).convert('RGBA')
N, C, FR = 48, 400, list(range(0, 60, 5))
PAL = [(96, 6, 14), (150, 14, 24), (204, 28, 34), (240, 56, 52), (255, 104, 88), (255, 176, 150)]  # 暗红 → 亮红,芯是浅橙红

out = Image.new('RGBA', (N * len(FR), N), (0, 0, 0, 0))
for j, i in enumerate(FR):
    cx, cy = (i % 8) * C, (i // 8) * C
    fr = src.crop((cx + 30, cy + 30, cx + 370, cy + 370)).resize((N, N), Image.LANCZOS)
    a = np.array(fr).astype(float)
    lum = (a[..., 0] * .3 + a[..., 1] * .59 + a[..., 2] * .11) / 255
    al = a[..., 3] / 255
    o = np.zeros((N, N, 4), np.uint8)
    lv = np.clip((lum ** 2.6 * len(PAL)).astype(int), 0, len(PAL) - 1)  # 亮度压低,大部分落在红色几级,只有最中心是淡粉白
    for k, c in enumerate(PAL):
        o[lv == k, :3] = c
    o[..., 3] = (np.clip(np.round(al * 5), 0, 5) * 51).astype(np.uint8)
    o[o[..., 3] < 51] = 0
    out.paste(Image.fromarray(o, 'RGBA'), (j * N, 0))
out.save(os.path.join(R, 'assets/fqi.png'))
print('fqi', len(FR), 'frames', N)
