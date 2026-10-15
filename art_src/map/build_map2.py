# 第二张世界地图「暗黑大陆」(用户用 GPT 画的定制插画,raw/map/map2_user.webp,1614×974)→ assets/map2_bg.jpg(16:9)
# 改动:左下角原图写错的「浮岛城镇」擦掉(游戏里按用户要求重写成「返回城镇」);整张纵向压扁约 7% 变成 16:9(不裁,四角的字都留着);其余保持原样。
# 左下角的机械城 = 第十一关「齿轮要塞」入口(第四十轮);其他地点以后再开。
# 用法:python art_src/map/build_map2.py → assets/map2_bg.jpg
import os
import numpy as np
from PIL import Image
from scipy import ndimage
R = os.path.join(os.path.dirname(__file__), '..', '..')
im = np.asarray(Image.open(os.path.join(R, 'raw/map/map2_user.webp')).convert('RGB')).astype(np.float32)
# 擦字:「浮岛城镇」= 白字 + 深色描边。白 / 很亮的像素当字,向外扩 4 像素包住描边,再用周围像素一圈圈往里填
x0, y0, x1, y1 = 30, 872, 250, 952
a = im[y0:y1, x0:x1]; lum = a @ np.array([.3, .59, .11], np.float32)
m = ndimage.binary_dilation(lum > 175, iterations=5)
f = a.copy(); known = ~m
for _ in range(60):
    if known.all(): break
    s = np.zeros_like(f); c = np.zeros(known.shape, np.float32)
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
        kk = np.roll(np.roll(known, dy, 0), dx, 1); ff = np.roll(np.roll(f, dy, 0), dx, 1)
        s += ff * kk[..., None]; c += kk
    nw = (~known) & (c > 0); f[nw] = s[nw] / c[nw][:, None]; known = known | nw
im[y0:y1, x0:x1] = f
out = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((1125, 633), Image.LANCZOS)  # 不裁剪(上下的标题、挑战模式都要留着),纵向压扁约 7%
out.save(os.path.join(R, 'assets/map2_bg.jpg'), quality=88, optimize=True); print('map2', out.size)
