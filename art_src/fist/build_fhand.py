# 格斗家 I「鬼手」的魔力假肢(第七十二轮):Demon hand animation(cptx032,CC0)
#   https://opengameart.org/content/demon-hand-animation(raw/fhand/demonhand.png,15 帧 100×88 的黑色手臂剪影)
# 改动:只取两帧 —— 第 4 帧(张开的手)和第 7 帧(握拳);裁掉手肘以下,转正成「手朝上、手臂竖直」;
#       透明度二值化,外面加 1 像素暗紫色描边(游戏里背景偏暗,纯黑看不清);不改形状
# 游戏里把手腕以下的那段沿手臂方向拉长(手本身不拉伸),画成从主角手上伸出去的长胳膊
# 用法:python art_src/fist/build_fhand.py → assets/fhand.png(两帧横排)+ 打印 meta [帧宽, 帧高, 手腕 y, 手臂中线 x](贴进源码 FHD.M)
import os, math
import numpy as np
from PIL import Image

R = os.path.join(os.path.dirname(__file__), '..', '..')
src = Image.open(os.path.join(R, 'raw/fhand/demonhand.png')).convert('RGBA')
OUT = (112, 72, 232, 255); INK = (8, 4, 14, 255)


def frame(i, y1):
    fr = src.crop((i * 100, 0, i * 100 + 100, y1))
    a = np.array(fr)[..., 3] > 100
    ys = np.nonzero(a.any(1))[0]; top = ys[0]
    rows = lambda y0, y2: [np.nonzero(a[y])[0].mean() for y in range(y0, y2) if a[y].any()]
    hx = np.mean(rows(top, top + 12)); bx = np.mean(rows(y1 - 12, y1))
    ang = math.degrees(math.atan2(bx - hx, (y1 - 6) - (top + 6)))  # 手臂偏离竖直的角度
    fr = fr.rotate(-ang, resample=Image.BICUBIC, expand=True)
    fr = fr.crop(fr.getbbox())
    a = np.array(fr)[..., 3] > 100
    return a


def outline(a):
    H, W = a.shape; p = np.zeros((H + 2, W + 2), bool); p[1:-1, 1:-1] = a
    d = p.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            d |= np.roll(np.roll(p, dy, 0), dx, 1)
    im = np.zeros((H + 2, W + 2, 4), np.uint8); im[d] = OUT; im[p] = INK
    return im


F = [outline(frame(3, 76)), outline(frame(6, 76))]
W = max(f.shape[1] for f in F); H = max(f.shape[0] for f in F)
out = Image.new('RGBA', (W * len(F), H))
meta = []
for n, f in enumerate(F):
    h, w = f.shape[:2]; ox = n * W + (W - w) // 2; oy = H - h
    out.alpha_composite(Image.fromarray(f), (ox, oy))
    a = f[..., 3] > 0
    wid = a.sum(1); top = int(np.nonzero(wid)[0][0])
    # 手腕 = 手掌下面最细的那一行(从顶端往下 12 ~ 40 像素里找)
    wy = top + 12 + int(np.argmin(wid[top + 12: top + 40]))
    cx = float(np.nonzero(a[h - 4])[0].mean())
    meta.append([w, h, oy + wy, round((W - w) // 2 + cx, 1)])
out.save(os.path.join(R, 'assets/fhand.png'))
print('FHD.M =', {'W': W, 'H': H, 'f': meta})
