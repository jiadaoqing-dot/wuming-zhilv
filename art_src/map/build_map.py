# 世界地图(用户定制的插画,raw/map/world_map_custom.webp,1125×663)→ assets/map_bg.jpg(1125×633,16:9)
# 牌子上原本写死的地名 / 推荐等级和游戏数据不一致(幽沙荒漠、雪原狼群、虎宾都市、Lv10 起……),
# 这里把这些牌子里的白字和描边擦掉(按牌子底色往里扩散填补),游戏运行时按 MAPS 的真实关卡名、推荐等级、锁定 / 通关状态重新写字。
# 顶部「请选择关卡」横幅和「??? 尚未开放」保留原样。
# 用法:python art_src/map/build_map.py <world_map_custom.webp> <输出 jpg>
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
im=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32)
# 要擦字的区域(原图坐标 x0,y0,x1,y1):第 1~7 关牌子 + 晨曦镇(原图写的虎宾都市)牌子
BOX=[(246,492,382,547),(233,352,367,405),(233,228,367,281),(588,546,727,601),(518,194,652,244),(698,82,832,133),(828,178,968,229),(608,360,717,388)]
for x0,y0,x1,y1 in BOX:
  a=im[y0:y1,x0:x1];lum=a@np.array([.3,.59,.11],np.float32)
  # 牌子底色基本是上下渐变、左右一致:每一行取「不像字」的像素的中位数当底色,和底色差得多的就是字(白字 / 深色描边)
  base=np.zeros((a.shape[0],3),np.float32)
  ch=a.max(-1)-a.min(-1);good=np.zeros(a.shape[0],bool)
  for r in range(a.shape[0]):
    ok=(ch[r]>28)&(lum[r]>60)&(lum[r]<185)   # 牌子底色有颜色(绿 / 棕),字和描边是白 / 灰 / 黑
    if ok.sum()>6:base[r]=np.median(a[r][ok],0);good[r]=True
  gi=np.where(good)[0]
  for q in range(3):base[:,q]=np.interp(np.arange(a.shape[0]),gi,base[gi,q])
  d=np.abs(a-base[:,None,:]).sum(-1)
  m=ndimage.binary_dilation(d>60,iterations=2)
  # 底色上加一点原图的细微纹理(用整块的平滑噪声),避免一片死平
  f=a.copy();rng=np.random.default_rng(1);nz=ndimage.uniform_filter(rng.normal(0,3,a.shape[:2]).astype(np.float32),3)
  f[m]=(base[:,None,:]+nz[...,None])[m]
  im[y0:y1,x0:x1]=f
out=Image.fromarray(np.clip(im,0,255).astype(np.uint8)).crop((0,15,1125,648))
out.save(sys.argv[2],quality=88,optimize=True);print('map',out.size)
