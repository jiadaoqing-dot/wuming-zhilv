# 主城书架 + 四本书的图标(模块 BOOK,2026-10-14 第三十一轮)
# 素材:
#  书架 = Bookshelf(AlejandroHaibi,CC0,https://opengameart.org/node/147450,raw/books/bookshelf_2.png)
#  书 = CC0 Book Icons(AntumDeluge 整理,https://opengameart.org/content/cc0-book-icons)里 Dungeon Crawl Stone Soup 的书(CC0,raw/books/x/book-dcss/32x32)
# 改动:书架只裁掉透明边;书原样使用。
# 用法:python art_src/book/build_book.py <raw/books> <输出 png>
# 布局:书架在 (0,0);四本书 32×32 依次排在 x = 40 / 72 / 104 / 136,y = 0
import sys,os
from PIL import Image
D=sys.argv[1]
sh=Image.open(os.path.join(D,'bookshelf_2.png')).convert('RGBA');sh=sh.crop(sh.getbbox())
B=os.path.join(D,'x','book-dcss','32x32')
bk=['book_01/book_01_light_brown.png','book_02_metal/metal_02_gold.png','book_02_misc/book_02_glittering.png','book_01_metal/metal_01_green.png']
out=Image.new('RGBA',(168,max(sh.height,32)))
out.alpha_composite(sh,(0,0))
for i,f in enumerate(bk):out.alpha_composite(Image.open(os.path.join(B,f)).convert('RGBA'),(40+i*32,0))
out.save(sys.argv[2])
print('book',out.size,'shelf',sh.size)
