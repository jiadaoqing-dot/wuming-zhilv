# 中文像素字体:Fusion Pixel Font(缝合像素字体,TakWolf,SIL OFL 1.1,https://github.com/TakWolf/fusion-pixel-font)
# 只保留游戏源码里出现过的字(+ 全部 ASCII),输出 woff2,由 build.py 的 @@F:名字@@ 内嵌。
# 改动:按游戏用字裁剪字符集(OFL 允许),字体名改成 FPX12 / FPX8(保留字体名的规定:修改版不能用原名)。
# 用法:python art_src/font/build_font.py <fusion-pixel-12px-proportional-zh_hans.ttf> <fusion-pixel-8px-proportional-zh_hans.ttf>
# 源码新增文字后要重新运行(build.py 会提示缺哪些字)
import sys,os
from fontTools import subset
from fontTools.ttLib import TTFont
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src=open(D+'/src/game.src.html',encoding='utf8').read()
import re;src=re.sub(r'/\*NOFONT\{\*/.*?/\*\}NOFONT\*/','',src,flags=re.S)  # 书的正文等只在网页面板里显示的字,不进像素字体
chars=sorted(set(c for c in src if ord(c)>=0x20)|set(chr(i) for i in range(0x20,0x7f))|set('…·—「」『』、。,!?:;()【】《》'))
open(D+'/art_src/font/chars.txt','w',encoding='utf8').write(''.join(chars))
for path,name in zip(sys.argv[1:3],['FPX12','FPX8']):
  f=TTFont(path);o=subset.Options();o.flavor='woff2';o.layout_features=['*'];o.name_IDs=['*'];o.notdef_outline=True
  s=subset.Subsetter(o);s.populate(text=''.join(chars));s.subset(f)
  for r in f['name'].names:
    if r.nameID in (1,3,4,6,16):r.string=name
  f.flavor='woff2';f.save(f'{D}/assets/{name.lower()}.woff2')
  print(name,len(chars),'chars',os.path.getsize(f'{D}/assets/{name.lower()}.woff2'),'bytes')
