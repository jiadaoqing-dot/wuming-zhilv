# 关卡地面 / 浮空平台 / 大树像素图集(模块 LTL,像素化第 ③ 步,一关一张 assets/ltlN.png):
#   一~三关:SunnyLand - Forest(ansimuz,CC0)9 宫格地块 + 大橡树,SunnyLand Expansion Pack: Trees(ansimuz,CC0)弯干树 / 松树(按关换色调)
#   四关:Gothicvania Swamp(ansimuz,CC0)地块 + 草丛,大橡树换成毒绿色
#   五关:Desert Tilesets(AdebGameSoft,CC0)高清图块缩小后限色成像素风,仙人掌 / 石柱
#   六、七关:Seasonal Platformer Tiles(GrafxKid,CC0)冬季雪顶冰砖 + 雪松 / 雪球(Scale2x / Scale3x),七关调成夜色
# 用法:python art_src/lv/build_ltl.py <raw/lv 目录> <关卡号> <输出 png>   打印 meta(贴进源码 LTL.L[关卡].M)
# 图集布局:y=0 地面条(可左右平铺,草顶在 oy);y=64 平台 4 块(左端、中段、中段 2、右端,各 16 宽 ph 高);y=64+ph+2 起 大树
import sys,json,random,math
from PIL import Image
R=sys.argv[1].rstrip('/\\');LV=int(sys.argv[2]);OUT=sys.argv[3]
FO=R+'/sunny-land-forest-files/Sunny-land-forest-files/PNG/environment/'
TR=R+'/sunnyland_trees_expansion_files/Sunnyland Trees Expansion Files/Sprites/Sliced Trees/'
SW=R+'/swamp/Gothicvania Swamp files/Evironment/';DE=R+'/desert/';SE=R+'/season/Tiles_4.png'
L=lambda p:Image.open(p).convert('RGBA')
def mul(im,k):
  r,g,b,a=im.split();return Image.merge('RGBA',(r.point(lambda v:int(v*k[0])),g.point(lambda v:int(v*k[1])),b.point(lambda v:int(v*k[2])),a))
def scale2x(im):
  w,h=im.size;s=im.load();o=Image.new('RGBA',(w*2,h*2));d=o.load();P=lambda x,y:s[min(w-1,max(0,x)),min(h-1,max(0,y))]
  for y in range(h):
    for x in range(w):
      B,D,E,F,H=P(x,y-1),P(x-1,y),P(x,y),P(x+1,y),P(x,y+1);e=[E]*4
      if B!=H and D!=F:e=[D if D==B else E,F if B==F else E,D if D==H else E,F if H==F else E]
      for k in range(4):d[x*2+k%2,y*2+k//2]=e[k]
  return o
def pix(im,w,cols=24):
  # 高清图 → 像素风:缩小、限色、透明度二值化
  h=round(im.height*w/im.width);im=im.resize((w,h),Image.LANCZOS);a=im.split()[3].point(lambda v:255 if v>110 else 0)
  q=im.convert('RGB').quantize(cols,method=Image.Quantize.MEDIANCUT).convert('RGBA');q.putalpha(a);return q
def stack(top,bot):
  o=Image.new('RGBA',(16,top.height+bot.height));o.alpha_composite(top,(0,0));o.alpha_composite(bot,(0,top.height));return o
def closebot(im,col=(20,16,20,255)):
  # 平台底边补一条深色描边(素材是整块地,切出来的底是平的)
  px=im.load()
  for x in range(im.width):
    for y in range(im.height-1,-1,-1):
      if px[x,y][3]:px[x,y]=col;break
  return im
random.seed(LV);TINT=(1,1,1);trees=[]
if LV in (1,2,3,4):
  ts=L(FO+'layers/tileset.png');T=lambda x,y:ts.crop((x,y,x+16,y+16))
  TL,T1,T2,TRc,F,ROOT,VINE,BL,BR=T(112,48),T(128,48),T(144,48),T(160,48),T(144,80),T(128,64),T(144,96),T(112,112),T(160,112)
  BM=Image.new('RGBA',(16,16));BM.alpha_composite(BL.crop((8,0,16,16)),(0,0));BM.alpha_composite(BR.crop((0,0,8,16)),(8,0))
  if LV==4:
    s=L(SW+'tileset.png');A,PL,SK,EL,ER=s.crop((32,0,112,64)),s.crop((224,0,304,64)),s.crop((128,0,208,64)),s.crop((0,0,16,64)),s.crop((320,0,336,64))
    g=Image.new('RGBA',(400,64))
    for i,b in enumerate([A,PL,A,SK,PL]):g.alpha_composite(b,(i*80,0))
    GND,OY=g,8
    PT=[stack(EL.crop((0,4,16,20)),EL.crop((0,20,16,36))),stack(PL.crop((16,4,32,20)),PL.crop((16,20,32,36))),stack(A.crop((32,4,48,20)),A.crop((32,20,48,36))),stack(ER.crop((0,4,16,20)),ER.crop((0,20,16,36)))]
    PT=[closebot(p) for p in PT];POY=4
  else:
    g=Image.new('RGBA',(256,64))
    for i in range(16):
      t1=random.random()<.35;g.alpha_composite(T1 if t1 else T2,(i*16,0))
      for j in (1,2,3):g.alpha_composite(ROOT if (t1 and j==1) else (VINE if (j==2 and random.random()<.15) else F),(i*16,j*16))
    GND,OY=g,3;PT=[stack(TL,BL),stack(T2,BM),stack(T1,BM),stack(TRc,BR)];POY=3
  oak=L(FO+'props/tree.png');tw=mul(L(TR+'tree.png'),(.82,.82,.82));pn=mul(L(TR+'pine.png'),(.82,.82,.82))
  trees=[('oak',oak),('twist',tw),('pine',pn)]
  if LV==4:
    s=L(SW+'tileset.png');trees=[('oak',mul(oak,(.7,.95,.75))),('weed',s.crop((27,72,65,106))),('bush',s.crop((165,76,210,108)))]
  TINT={1:(.86,.76,.9),2:(.6,.55,.85),3:(.92,1,.92),4:(.8,.85,.8)}[LV]
elif LV==5:
  dt=L(DE+'desert_tile.png');top=pix(dt.crop((132,296,260,424)),48,16)
  g=Image.new('RGBA',(192,64))
  for i in range(4):g.alpha_composite(top,(i*48,0));g.alpha_composite(top.crop((0,32,48,48)),(i*48,48))
  GND,OY=g,4
  pl=pix(dt.crop((2,68,138,132)),52,16);ph=pl.height
  PT=[pl.crop((0,0,16,ph)),pl.crop((18,0,34,ph)),pl.crop((18,0,34,ph)),pl.crop((pl.width-16,0,pl.width,ph))];POY=3
  rv=L(DE+'rock_veget.png')
  trees=[('cactus',pix(rv.crop((2,781,159,967)),60)),('pillar',pix(rv.crop((509,405,675,630)),64)),('cacti',pix(rv.crop((665,659,775,779)),44))]
else:
  s=L(SE);px=s.load()
  for yy in range(s.height):
    for xx in range(s.width):
      if px[xx,yy][:3]==(253,77,211):px[xx,yy]=(0,0,0,0)   # 抠掉品红底色
  T=lambda x,y:s.crop((x,y,x+16,y+16))
  TL,TT,TRc,ML,MM,MR=T(400,112),T(416,112),T(432,112),T(400,128),T(416,128),T(432,128)
  g=Image.new('RGBA',(192,64))
  for i in range(12):
    g.alpha_composite(TT,(i*16,0))
    for j in (1,2,3):g.alpha_composite(MM,(i*16,j*16))
  GND,OY=g,3
  PT=[closebot(stack(TL,ML)),closebot(stack(TT,MM)),closebot(stack(TT,MM)),closebot(stack(TRc,MR))];POY=3
  pine=s.crop((401,64,431,96));ball=s.crop((432,82,448,96))
  pine=pine.crop(pine.getbbox());ball=ball.crop(ball.getbbox())
  trees=[('bigpine',scale2x(scale2x(pine))),('pine',scale2x(pine)),('ball',scale2x(ball))]
  TINT={6:(1,1,1),7:(.62,.66,.9)}[LV]
ph=PT[0].height
at=Image.new('RGBA',(640,400));at.alpha_composite(GND,(0,0))
for i,p in enumerate(PT):at.alpha_composite(p,(i*16,64))
M={'gnd':{'x':0,'y':0,'w':GND.width,'h':GND.height,'oy':OY},'plat':{'y':64,'h':ph,'oy':POY},'tree':{}}
x0,y0=0,64+ph+2
for k,im in trees:
  im=im.crop(im.getbbox());px=im.load();xs=[x for y in range(im.height-4,im.height) for x in range(im.width) if px[x,y][3]]
  if x0+im.width>640:x0=0;y0=max(v['y']+v['h'] for v in M['tree'].values())+2
  at.alpha_composite(im,(x0,y0));M['tree'][k]={'x':x0,'y':y0,'w':im.width,'h':im.height,'ax':round(sum(xs)/len(xs))};x0+=im.width+2
at=mul(at,TINT);bb=at.getbbox();at=at.crop((0,0,bb[2],bb[3]));at.save(OUT)
print(json.dumps(M,separators=(',',':')));print('ltl',LV,at.size)
