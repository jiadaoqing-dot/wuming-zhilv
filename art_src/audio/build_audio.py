# 音效 / BGM:从 raw/audio 的开源素材裁剪、归一化,转成单声道 OGG,输出 assets/au_<名字>.ogg(源码里用 @@O:au_名字@@ 占位)
# 用法:python art_src/audio/build_audio.py   (需要 pip install soundfile scipy numpy)
# 素材(都在 raw/audio,zip 已解压):
#   RPG Sound Pack(artisticdude,CC0)· Swishes Sound Pack(artisticdude,CC0)· 80 CC0 creature SFX / 100 CC0 SFX / 75 CC0 breaking-falling-hit SFX(rubberduck,CC0)
#   Fantasy Sound Effects Library(Little Robot Sound Factory,CC-BY 3.0)
#   BGM:Happy Adventure Loop(fluffrabbit,CC0)、Battle Theme A(cynicmusic,CC0)、Dark Shrine Loop(yd / qubodup,CC0)、Battle RPG Theme Var(CleytonRX,CC0)
import os,numpy as np,soundfile as sf
from scipy.signal import resample_poly
D=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));A=D+'/raw/audio/';O=D+'/assets/'
FS='fantasy/Fantasy Sound Library/Wav/';RP='rpg_sound_pack/RPG Sound Pack/';SW='swishes/swishes/'
# 名字: (文件, 最长秒数, 音量)
SFX={
 # 2026-10-12 第四轮:关卡里除首领外全部改回旧版 WebAudio 合成音,这里只留首领出招 / 熔炼用到的
 'swing':(RP+'battle/swing.wav',.4,.8),'dash':(SW+'swish-9.wav',.5,.8),'zap':(FS+'Spell_01.wav',1.2,.6),'blink':(RP+'battle/magic1.wav',.9,.7),'buff':(RP+'battle/spell.wav',1.5,.7),
 'slam':('100sfx/slam_03.ogg',.6,1),'boom':('100sfx/explosion.ogg',.6,.9),'fuse':(RP+'inventory/metal-ringing.wav',1.2,.7),'step':(FS+'Footsteps/Footstep_Dirt_00.wav',.4,.8),
 'eatk':('creature/grunt_03.ogg',.7,.7),'peck':(RP+'NPC/beetle/bite-small.wav',.4,.7),'proj':('creature/spit_02.ogg',.7,.7),'roar':('creature/roar_02.ogg',.9,.9),
 'tongue':('creature/weird_03.ogg',.6,.7),'sand':('hit/bfh1_rock_falling_01.ogg',.8,.8),'storm':(FS+'Ambience_Cave_00.wav',2.5,.9),
 'howl':('creature/howl.ogg',1.2,.9),'breath':('creature/breath.ogg',.8,1),
 'v_shade':(RP+'NPC/shade/shade11.wav',1.1,.8)}
# BGM(都是 OpenGameArt 的 CC0):(文件, 最长秒数, 音量)。0 = 主城;N = 第 N 关;Nb = 第 N 关首领战
# 主城 Town Theme RPG(cynicmusic)· 一关 Happy Adventure Loop(fluffrabbit)/ Battle Theme A(cynicmusic)· 二关 Dark Shrine Loop(yd)/ Battle RPG Theme Var(CleytonRX)
# 三关 Forest Whisper Theme(CleytonRX)/ Final Hour(isaiah658)· 四关 Tribal(Of Far Different Nature)/ Fast Fight Battle Music looped(xcvg)
# 五关 Desert Theme caravan(yd)/ Battle Theme B(cynicmusic)· 六关 Snow Theme(CleytonRX)/ Determined Pursuit(emmama)· 七关 Rising Moon(RandomMind)/ Epic Boss Battle(Juhani Junkala)
# 九关(2026-10-13)Lava Area Theme「LavaLand - One Loop」(wolfgang,CC-BY 4.0,https://opengameart.org/content/lava-area-theme)/ Heavy Boss Battle 2(mintodog,CC0,https://opengameart.org/content/heavy-boss-battle-2)
# 十关(2026-10-13)Airship Thunderchild(Otto Halmén,OGA-BY 3.0,https://opengameart.org/content/airship-thunderchild)/ Blackmoor Tides(Matthew Pablo,CC-BY 3.0,https://opengameart.org/content/blackmoor-tides-epic-pirate-battle-theme)
# 神秘地带 / 神秘副本(2026-10-13 第十二轮)Mysterious Ambience song21(cynicmusic,CC-BY 3.0,https://opengameart.org/content/mysterious-ambience-song21)/ Hard Dungeon(mintodog,CC0,https://opengameart.org/content/hard-dungeon)
# 第十一关齿轮要塞(第四十轮,cur 14)Factory ambiance(yd,CC0,https://opengameart.org/node/16130)/ Short Industrial Style Techno Loop「hardwar」(cinameng,CC0,https://opengameart.org/content/hardwar)
# 八关(2026-10-13)EmptyCity(yd,CC0,https://opengameart.org/content/emptycity-background-music)/ Dark Rooms and Scary Things(isaiah658,CC0,https://opengameart.org/content/dark-rooms-and-scary-things)
G='bgm/'
BGM={'bgm0':(G+'town.mp3',None,1),'bgm1':('happy_adventure.mp3',None,1),'bgm1b':('battleThemeA.mp3',None,1),'bgm2':('DarkShrineLoop.ogg',None,1),'bgm2b':('BattleRPGTheme.ogg',None,1),
 'bgm3':(G+'forest_whisper/Forest Whisper Theme/Forest Whisper.ogg',None,1),'bgm3b':(G+'final_hour.ogg',None,1),'bgm4':(G+'tribal.mp3',120,1),'bgm4b':(G+'fight_looped.ogg',None,1),
 'bgm5':(G+'caravan.ogg',None,1),'bgm5b':(G+'battleThemeB.mp3',None,1),'bgm6':(G+'snow.ogg',None,1),'bgm6b':(G+'determined_pursuit.wav',None,1),'bgm7':(G+'rising_moon.mp3',120,1),'bgm7b':(G+'epic_boss.wav',None,1),
 'bgm8':(G+'EmptyCity.ogg',None,1),'bgm8b':(G+'Dark Rooms and Scary Things - isaiah658_1.ogg',120,1),
 'bgm9':(G+'LavaLand - One Loop.ogg',None,1),'bgm9b':(G+'heavy_boss_battle_2_bpm110.ogg',120,1),
 'bgm10':(G+'thunderchild.ogg',120,1),'bgm10b':(G+'Blackmoor Tides.mp3',120,1),
 'bgm11':(G+'song21_mysterious.mp3',None,1),'bgm11b':(G+'hard_dungeon_bpm140.ogg',120,1),
 'bgm14':(G+'mech/Factory.ogg',120,1),'bgm14b':(G+'mech/hardwar.mp3',None,1),
 # 第十二关永夜王城(第四十一轮,cur 15)Abandoned Castle Music (Loop)(StarNinjas,CC0,https://opengameart.org/node/122922)/ Boss Battle #2 [Symphonic Metal](nene,CC0,https://opengameart.org/node/84428;
 #   包里的文件名写反了,真正的循环段是 opening.wav)
 'bgm15':(G+'castle12/abandoned_castle.ogg',None,1),'bgm15b':(G+'castle12/boss2/boss_battle_#2_metal_opening.wav',120,1),
 # 第四十七轮(用户:每一关都要有专属 BGM;raw/audio/bgm/r47):
 #   神秘副本 2(cur 12)A Wonderful Nightmare(SpiderDave,CC0,https://opengameart.org/content/a-wonderful-nightmare)/ Endless Pain of Nightmares(nene,CC0,https://opengameart.org/content/endless-pain-of-nightmares)
 #   神秘副本 3(cur 13)The 9th Circle(Joth,CC0,https://opengameart.org/content/the-9th-circle)/ Demon Lord(Scrabbit,CC-BY 4.0,https://opengameart.org/content/demon-lord)
 #   第十三关熔心火山(cur 16)Shrine to the Smoldering Volcano(Mega Pixel Music Lab,CC-BY 3.0,https://opengameart.org/content/shrine-to-the-smoldering-volcano)/ The Demon King(congusbongus,CC-BY 4.0,https://opengameart.org/content/the-demon-king)
 #   神秘副本 4(cur 17)Reflections Upon the Black Mirror(HitCtrl,CC-BY 3.0,https://opengameart.org/content/reflections-upon-the-black-mirror)/ 镜中无名 Determination(HydroGene,CC0,https://opengameart.org/content/determination-anime-style-music)
 #     / 灿灿 bgm17c = Welcome to Com-Mecha(Matthew Pablo,CC-BY 3.0,https://opengameart.org/content/theme-of-com-mecha)
 #   第十四关月影忍城(cur 18)Samurai Nights(Majadroid,CC-BY 4.0,https://opengameart.org/content/samurai-nights,用 Demo 整曲)/ Japanese Samurai Ninja Battle Trailer(ISAo,OGA-BY 3.0,https://opengameart.org/content/japanese-samurai-ninja-battle-trailer)
 'bgm12':(G+'r47/46b.ogg',120,1),'bgm12b':(G+'r47/Endless Pain of Nightmares.WAV',120,1),'bgm13':(G+'r47/The 9th Circle V2.mp3',120,1),'bgm13b':(G+'r47/demon lord_0.mp3',120,1),
 'bgm16':(G+'r47/Shrine to the Smoldering Volcano_0.mp3',120,1),'bgm16b':(G+'r47/the_demon_king_loop_0.ogg',120,1),'bgm17':(G+'r47/Reflections Upon the Black Mirror.ogg',None,1),'bgm17b':(G+'r47/determination_1.mp3',None,1),
 'bgm17c':(G+'r47/Welcome to Com-Mecha.mp3',120,1),'bgm18':(G+'r47/samurai/Samurai-Nights-Demo.mp3',None,1),'bgm18b':(G+'r47/oga_japanese_hacks_0.mp3',None,1),
 # 第四十八轮 第十五关不眠钟楼(cur 19,raw/audio/bgm/r48)Clockwork Jester(Arold Valda,CC-BY 4.0,https://opengameart.org/content/clockwork-jester)/ Heart of Machine(Alexandr Zhelanov,CC-BY 3.0,https://opengameart.org/content/heart-of-machine)
 'bgm19':(G+'r48/clockwork_jester.flac',150,1),'bgm19b':(G+'r48/Heart of Machine.ogg',150,1),
 # 第五十三轮 第十六关金核机库(cur 20,raw/audio/bgm/r53)Cyborg Factory Fight Theme(GTDStudio aka Palrom,OGA-BY 3.0,https://opengameart.org/content/cyborg-factory-fight-theme)/ Return of the Omega Droid(Umplix,CC0,https://opengameart.org/content/return-of-the-omega-droid)
 'bgm20':(G+'r53/Cyborg_Factory_Fight.ogg',150,1),'bgm20b':(G+'r53/return_of_the_omega_droid.wav',None,1)}
def load(p,sr):
  d,s=sf.read(A+p,always_2d=True);m=d.mean(1)
  g=np.gcd(s,sr);return resample_poly(m,sr//g,s//g) if s!=sr else m
def out(n,m,sr,q):
  # 一次写入太长的数组 libsndfile 的 Vorbis 编码会崩溃,分块写
  with sf.SoundFile(O+'au_'+n+'.ogg','w',sr,1,format='OGG',subtype='VORBIS',compression_level=q) as f:
    m=m.astype(np.float32)
    for i in range(0,len(m),8192):f.write(m[i:i+8192])
  return os.path.getsize(O+'au_'+n+'.ogg')
tot=0
for n,(p,mx,v) in SFX.items():
  sr=22050;m=load(p,sr);k=np.argmax(np.abs(m)>.02*np.abs(m).max());m=m[k:]  # 去掉开头静音
  if mx:m=m[:int(mx*sr)]
  f=min(len(m),int(.06*sr));m[-f:]*=np.linspace(1,0,f)
  m=m/np.abs(m).max()*.9*v;tot+=out(n,m,sr,.7)
# ===== 混合音效(2026-10-12):多层素材叠加;法师的加混响;loop=1 的做成可循环的一段(游戏里按伤害持续时间循环播放)=====
# 新素材(raw/audio/dl2,OpenGameArt):
#   20 Sword Sound Effects(StarNinjas,CC0)· 80 CC0 RPG SFX(rubberduck,CC0)· wind whoosh loop(SketchMan3,CC0)
#   Sci-Fi Aliens and Cows Pack(qubodup,CC0)· 35 wooden cracks/hits/destructions(qubodup,CC0)· 3 Melee sounds(remaxim,CC0)
#   Magic Spell SFX(JaggedStone,CC0)· Chopping tree(kurt,CC-BY 3.0)· sfx_throw(Lamoot,CC-BY 3.0)
#   Fire & Evil Spell(qubodup,CC-BY 3.0)· Thunder(Jerimee,CC-BY 3.0)
from scipy.signal import fftconvolve,butter,lfilter
N2='dl2/';SN=N2+'sword_-_starninjas_1/sword - StarNinjas/sword.%d.ogg';SC=N2+'sword_clash_-_starninjas_0/sword_clash.%d.ogg';R8=N2+'80-CC0-RPG-SFX_0/'
WIND=N2+'wind woosh loop.ogg';CHOP=N2+'choppingtree.ogg';COW=N2+'qubodup-sci-fi-cow-alien-soundpack/qubodup-sci-fi-cow-alien-soundpack/'
WD=N2+'independent_nu_ljudbank-wood_crack_hit_destruction/wood_impact/';MEL=N2+'melee sounds/melee sounds/';MG=N2+'magical_%s.ogg'
THU=N2+'thunderclap_0.ogg';FIRE=N2+'spells/spells/Fire.aif';THR=N2+'sfx_throw/sfx_throw.wav'
SR=22050
def seg(p,a=None,n=None,rate=1):
  m=load(p,SR)
  if rate!=1:m=resample_poly(m,100,int(100*rate))  # rate<1 → 变低沉
  if a is None:m=m[np.argmax(np.abs(m)>.02*np.abs(m).max()):]
  else:m=m[int(a*SR):]
  if n:m=m[:int(n*SR)]
  return m/(np.abs(m).max()+1e-9)
def lp(m,f):b,a=butter(2,f/(SR/2));return lfilter(b,a,m)
def hp(m,f):b,a=butter(2,f/(SR/2),'high');return lfilter(b,a,m)
def rev(m,t=1.2,wet=.35):  # 简单混响:指数衰减噪声当冲激响应
  r=np.random.RandomState(7);L=int(t*SR);ir=r.randn(L)*np.exp(-6.9*np.arange(L)/L);ir=lp(ir,5000);ir/=np.abs(ir).sum()**.5*3
  y=np.concatenate([m,np.zeros(L)]);w=np.pad(fftconvolve(m,ir),(0,1))[:len(y)];w=w/(np.abs(w).max()+1e-9)*np.abs(m).max()
  return y*(1-wet)+w*wet
def mix(L,dur=None,r=None,loop=0,fi=.004,fo=.06):
  n=int((dur or max(o+len(s)/SR for s,o,g in L))*SR);y=np.zeros(n)
  for s,o,g in L:
    i=int(o*SR);k=min(len(s),n-i)
    if k>0:y[i:i+k]+=s[:k]*g
  if r:y=rev(y,*r)
  if dur:y=y[:int(dur*SR)]
  if loop:  # 首尾交叉淡化,循环播放时没有接缝
    c=int(.08*SR);y[:c]=y[:c]*np.linspace(0,1,c)+y[-c:]*np.linspace(1,0,c);y=y[:-c]
  else:
    a=int(fi*SR);y[:a]*=np.linspace(0,1,a);f=min(len(y),int(fo*SR));y[-f:]*=np.linspace(1,0,f)
  return y
ramp=lambda m:m*np.linspace(.15,1,len(m))
def wind(a,n,g=1):return seg(WIND,a,n)*g
CH=lambda n=.45:seg(CHOP,11.9,n)   # 劈树录音里的一下斧劈
MIX={
 # (主角技能的 p_* 混合音效 2026-10-12 第五轮删除:主角技能改回旧版合成音)
 # —— 第一关首领 铁角牛魔:牛叫 + 斧头 / 重锤打击 ——
 'b_moo':lambda:mix([(seg(COW+'moo-notification.wav',rate=.8),0,1),(seg(RP+'NPC/ogre/ogre2.wav'),.05,.5)],1.3),
 'b_axe':lambda:mix([(CH(.55),0,1),(seg('hit/bfh1_metal_hit_02.ogg'),0,.55),(seg('100sfx/explosion.ogg'),.02,.6),(seg(SW+'swish-7.wav'),0,.4)],.7),
 'b_stomp':lambda:mix([(seg('100sfx/explosion.ogg'),0,.9),(CH(.5),.02,.8),(seg('100sfx/slam_05.ogg'),0,.7)],.7),
 'b_ram':lambda:mix([(seg(WD+'crack04.mp3.flac',None,.6),0,.9),(seg('100sfx/explosion.ogg'),0,.8),(seg(COW+'moo-death.wav',rate=.8),.15,.6)],1.1),
 'b_gallop':lambda:mix([(lp(seg('100sfx/slam_0%d.ogg'%(i%3+1),None,.12),600),i*.14,.8) for i in range(6)]+[(wind(5.0,.84),0,.3)],.84,loop=1),
 # —— 第二关首领 面具法师:投掷 + 砸在墙上 / 身体上 / 木头上 ——
 'b_throw':lambda:mix([(seg(THR),0,1),(seg(MG%'2',None,.3),.05,.35)],.45),
 'b_imp1':lambda:mix([(seg(WD+'impactwood11.mp3.flac',None,.4),0,1),(seg('100sfx/hit_02.ogg'),0,.5)],.45),
 'b_imp2':lambda:mix([(seg(MEL+'melee sound.wav'),0,1),(seg('100sfx/slam_02.ogg'),0,.5)],.45),
 'b_imp3':lambda:mix([(seg('hit/bfh1_rock_hit_01.ogg',None,.4),0,.9),(seg(WD+'impactwood14.mp3.flac',None,.35),0,.6)],.45)}
# ===== 第三~七关首领(2026-10-12 第五轮):声音 = 动物本身(叫声 / 嘶嘶 / 甲壳)+ 攻击方式(咬、扫尾、砸地、冰裂……)=====
# 嘶嘶声 / 响尾 / 刮擦用滤波噪声合成;游戏里整体音量 ×0.75(BKV)
RS=np.random.RandomState(11)
def bp(m,lo,hi):b,a=butter(2,[lo/(SR/2),hi/(SR/2)],'band');return lfilter(b,a,m)
def shp(m,a,r):  # 包络:a 秒起音,r = 衰减快慢
  t=np.arange(len(m))/SR;return m*np.minimum(1,t/max(a,1e-3))*np.exp(-r*t)
def nrm(m):return m/(np.abs(m).max()+1e-9)
def hiss(n,lo=2600,hi=7500,a=.06,r=2.5):return nrm(shp(bp(RS.randn(int(n*SR)),lo,hi),a,r))
def rattle(n,hz=42):  # 响尾蛇摇尾:高频噪声被快速脉冲调制
  t=np.arange(int(n*SR))/SR;g=(np.sin(2*np.pi*hz*t)>.2).astype(float);g=lp(g,400)
  return nrm(bp(RS.randn(len(t)),3000,9000)*g*(.7+.3*np.sin(2*np.pi*1.3*t)))
def scrape(n,k=7):  # 爪子刮岩壁:几段短促的带通噪声
  y=np.zeros(int(n*SR))
  for i in range(k):
    s=shp(bp(RS.randn(int(.09*SR)),900+RS.rand()*800,4000),.01,25);o=int((i*n/k+RS.rand()*.03)*SR);y[o:o+len(s)]+=s[:len(y)-o]
  return nrm(y)
def rumble(n,f=180):return nrm(lp(RS.randn(int(n*SR)),f))
def cry(n,pt=1,seed=0):  # 婴儿哭:一声声「哇——」,音高先升后降,颤音 + 共振峰(a 元音)+ 气声
  r=np.random.RandomState(seed);t=np.arange(int(n*SR))/SR;y=np.zeros(len(t));o=0.05
  while o<n-.3:
    d=r.uniform(.55,.95);i0=int(o*SR);k=np.arange(int(d*SR))/SR;u=k/d
    f=(430+r.uniform(-30,40))*pt*(1+.22*np.sin(np.pi*np.minimum(1,u*1.3))-.12*u)*(1+.018*np.sin(2*np.pi*6.5*k))
    ph=2*np.pi*np.cumsum(f)/SR;s=2*((ph/(2*np.pi))%1)-1;s+=.5*np.sign(np.sin(ph*2))*.3
    env=np.minimum(1,u/.08)*np.minimum(1,(1-u)/.25)**1.5
    v=bp(s,700,1300)*1.0+bp(s,2300,3300)*.6+bp(s,250,500)*.5+bp(r.randn(len(k)),1500,5000)*.08
    e=min(len(v),len(y)-i0);y[i0:i0+e]+=(v*env)[:e];o+=d+r.uniform(.08,.3)
  return nrm(y)
def squeak(n,pt=1,seed=0):  # 仓鼠吱吱:高音短促上滑 + 颤音
  r=np.random.RandomState(seed);t=np.arange(int(n*SR))/SR;f=(2600+1400*np.sin(np.pi*t/n)**.7)*pt*(1+.04*np.sin(2*np.pi*38*t))
  ph=2*np.pi*np.cumsum(f)/SR;m=np.sin(ph)+.3*np.sin(2*ph)+.05*r.randn(len(t));return nrm(m*np.sin(np.pi*t/n)**.6)
def giggle(n,pt=1):  # 阴森的咯咯笑:短促的高音「嘿」
  t=np.arange(int(n*SR))/SR;y=np.zeros(len(t));o=0;r=np.random.RandomState(5)
  while o<n-.12:
    d=.09;k=np.arange(int(d*SR))/SR;f=(620+r.uniform(-40,60))*pt*(1-.25*k/d);ph=2*np.pi*np.cumsum(f)/SR
    v=bp(np.sign(np.sin(ph))*.6+np.sin(ph),800,3200)*np.sin(np.pi*k/d);i0=int(o*SR);e=min(len(v),len(y)-i0);y[i0:i0+e]+=v[:e];o+=d+r.uniform(.03,.07)
  return nrm(y)
CR='creature/';DG=FS+'Dragon_Growl_0%d.wav';GB=RP+'NPC/gutteral beast/mnstr%d.wav';GL='hit/bfh1_glass_breaking_0%d.ogg'
MIX.update({
 # —— 第三关 金色蛇王:嘶嘶 + 响尾;咬 / 喷毒 / 冲撞 ——
 'k_bite':lambda:mix([(hiss(.5),0,.8),(seg(RP+'NPC/beetle/bite-small2.wav',rate=.6),.38,1),(seg(CR+'eat_02.ogg',None,.3,rate=.8),.42,.6)],.85),
 'k_spit':lambda:mix([(hiss(.4,a=.02,r=5),0,.7),(seg(CR+'spit_01.ogg',rate=.8),.3,1),(seg(RP+'NPC/slime/slime3.wav'),.55,.5)],1.0),
 'k_rattle':lambda:mix([(rattle(1.6),0,.8),(lp(RS.randn(int(1.6*SR)),900),0,.25)],1.6,loop=1),
 'k_buff':lambda:mix([(rattle(1.0),0,.7),(hiss(1.2,a=.3,r=1.5),0,.9)],1.2,r=(.8,.25)),
 'k_bump':lambda:mix([(seg('100sfx/slam_02.ogg'),0,1),(seg('hit/bfh1_hit_05.ogg'),0,.6),(hiss(.35,a=.01,r=6),.05,.5)],.5),
 # —— 第四关 黑棘巨蝎:甲壳摩擦 / 钳子咔嚓;钳击 / 扫尾 / 毒针 ——
 'sc_claw':lambda:mix([(seg(CR+'bug_02.ogg',rate=.7),0,.8),(seg('100sfx/metal_03.ogg',None,.12),.3,.8),(seg(RP+'NPC/beetle/bite-small.wav',rate=.7),.45,1),(seg('100sfx/metal_05.ogg',None,.12),.5,.6)],.8),
 'sc_chit':lambda:mix([(seg(CR+'bug_01.ogg',rate=.65),0,1),(seg(CR+'bug_03.ogg',rate=.8),.1,.5)],.7),
 'sc_tail':lambda:mix([(seg(SW+'swish-7.wav',rate=.8),0,.8),(seg('hit/bfh1_rock_hit_01.ogg',None,.4),.05,1),(seg('100sfx/metal_02.ogg',None,.1),.05,.4)],.55),
 'sc_sting':lambda:mix([(seg(R8+'blade_03.ogg'),0,.9),(seg(CR+'spit_02.ogg',rate=.75),.04,.8),(hiss(.6,1500,5000,a=.05,r=3),.08,.5)],.75),
 'sc_buff':lambda:mix([(seg(CR+'bug_04.ogg',rate=.75),0,.9),(seg(RP+'inventory/metal-ringing.wav',None,.8,rate=.7),.1,.5)],1.0,r=(.8,.25)),
 # —— 第五关 沙暴巨蜥:低吼 + 嘶嘶;甩尾 / 吐舌 / 喷沙 / 爬墙 / 钻沙 / 沙暴 ——
 'lz_growl':lambda:mix([(seg(DG%0,rate=.85),0,1),(hiss(.6,1800,5000),0,.4)],1.0),
 'lz_tail':lambda:mix([(seg(SW+'swish-7.wav',rate=.75),0,.9),(seg('100sfx/slam_05.ogg'),.08,.8),(seg('hit/bfh1_rock_falling_01.ogg',None,.4),.1,.5)],.6),
 'lz_tongue':lambda:mix([(seg(CR+'weird_03.ogg'),0,.8),(seg(SW+'swish-3.wav',rate=1.2),.02,.6),(seg(RP+'NPC/slime/slime6.wav'),.12,.5)],.6),
 'lz_spray':lambda:mix([(seg(CR+'breath.ogg',None,.4),0,.6),(hiss(1.0,500,2600,a=.08,r=1.5),.35,1),(seg('hit/bfh1_rock_falling_03.ogg',None,.8),.4,.5)],1.4),
 'lz_climb':lambda:mix([(scrape(.8),0,.8),(seg(DG%1,None,.6,rate=.9),0,.6)],.8),
 'lz_land':lambda:mix([(lp(seg('100sfx/explosion.ogg'),1500),0,1),(seg('hit/bfh1_rock_falling_02.ogg',None,.7),.02,.7)],.75),
 'lz_dig':lambda:mix([(rumble(1.6),0,.7),(seg('hit/bfh1_rock_falling_05.ogg',None,1.0),0,.6),(hiss(1.6,400,1500,a=.3,r=.2),0,.4)],1.6,loop=1),
 'lz_rock':lambda:mix([(seg('hit/bfh1_rock_breaking_01.ogg',None,.6),0,1),(seg('100sfx/slam_04.ogg'),0,.5)],.6),
 'lz_storm':lambda:mix([(wind(1.0,2.0),0,.9),(hiss(2.0,700,3000,a=.5,r=.05),0,.5),(rumble(2.0,120),0,.4)],2.0,loop=1),
 # —— 第六关 北极熊:低吼 / 怒吼;熊掌 / 砸地冰裂 / 冲撞 / 滑冰 / 雪球 / 暴风雪 ——
 'br_growl':lambda:mix([(seg(RP+'NPC/giant/giant2.wav',rate=.8),0,1),(seg(GB%3,rate=.85),.05,.4)],.9),
 'br_roar':lambda:mix([(seg(CR+'roar_01.ogg',rate=.75),0,1),(seg(DG%1,rate=.8),.05,.6)],1.5,r=(1.0,.25)),
 'br_paw':lambda:mix([(seg(SW+'swish-7.wav',rate=.7),0,.8),(seg('hit/bfh1_hit_03.ogg'),.06,1),(lp(seg('100sfx/slam_01.ogg'),1200),.06,.6)],.55),
 'br_slam':lambda:mix([(seg('100sfx/explosion.ogg'),0,1),(seg(GL%2,None,.8),.03,.7),(seg('100sfx/slam_03.ogg'),0,.6)],.9),
 'br_crash':lambda:mix([(seg('100sfx/explosion.ogg'),0,.9),(seg(GL%4,None,.7),0,.8),(seg(RP+'NPC/giant/giant4.wav',rate=.8),.15,.5)],1.0),
 'br_skate':lambda:mix([(nrm(bp(RS.randn(int(1.5*SR)),2500,7000)*(.75+.25*np.sin(np.arange(int(1.5*SR))/SR*2*np.pi*3))),0,.6),(rumble(1.5,220),0,.6)],1.5,loop=1),
 'br_throw':lambda:mix([(seg(THR,rate=.8),0,.9),(seg(GB%5,None,.5,rate=.8),0,.5),(seg('hit/bfh1_falling_02.ogg',None,.4),.3,.4)],.8),
 'br_ice':lambda:mix([(seg(GL%1,None,.7),0,1),(seg('hit/bfh1_rock_breaking_02.ogg',None,.5),0,.5)],.7),
 'br_bliz':lambda:mix([(wind(2.0,2.4),0,1),(hiss(2.4,1200,5000,a=.6,r=.05),0,.4)],2.4,loop=1),
 # —— 第七关 银色狼人:咆哮 / 狼嚎;利爪 / 扑咬 / 落地 ——
 'w_snarl':lambda:mix([(seg(RP+'NPC/misc/wolfman.wav',None,.7),0,1),(seg(CR+'barking_02.ogg',None,.4,rate=.7),.05,.4)],.75),
 'w_growl':lambda:mix([(seg(CR+'monster_03.ogg',rate=.8),0,1),(seg(RP+'NPC/misc/wolfman.wav',None,.9,rate=.85),0,.6)],1.0),
 'w_claw':lambda:mix([(seg(SW+'swish-11.wav'),0,.9),(seg(R8+'blade_01.ogg',rate=.85),.03,.7),(seg('hit/bfh1_hit_08.ogg'),.05,.4)],.4),
 'w_bite':lambda:mix([(seg(CR+'barking_01.ogg',None,.35,rate=.75),0,.8),(seg(RP+'NPC/beetle/bite-small3.wav',rate=.6),.05,1)],.5),
 'w_lunge':lambda:mix([(wind(2.0,.45),0,.8),(seg(RP+'NPC/misc/wolfman.wav',None,.4),0,.6)],.5),
 'w_land':lambda:mix([(lp(seg('100sfx/explosion.ogg'),1800),0,1),(seg('100sfx/slam_06.ogg'),0,.6),(seg('hit/bfh1_falling_04.ogg',None,.4),.03,.4)],.65),
 'w_howl':lambda:mix([(seg(CR+'howl.ogg'),0,1),(seg(RP+'NPC/misc/wolfman.wav',rate=.9),0,.3)],2.2,r=(1.6,.35)),
 # —— 第八关 怨婴·银太郎(2026-10-13):婴儿哭声是合成的(锯齿波 + 颤音 + 元音共振峰 + 气声),叠混响;其余用现有素材 ——
 'y_cry':lambda:mix([(cry(2.6,1),0,1),(cry(2.6,1.5,7),.12,.35)],2.8,r=(1.4,.4)),
 'y_cryl':lambda:mix([(cry(4.2,1,3),0,1),(cry(4.2,1.4,9),.3,.3)],4.0,r=(1.6,.45),loop=1),
 'y_laugh':lambda:mix([(giggle(1.1),0,1)],1.3,r=(1.2,.45)),
 'y_tp':lambda:mix([(seg(SW+'swish-9.wav')[::-1],0,.7),(seg(MG%'5',None,.6,rate=.7),.1,.6),(giggle(.5,1.3),.25,.4)],1.0,r=(1.0,.35)),
 'y_claw':lambda:mix([(wind(1.0,.7),0,.8),(scrape(.6,5),.15,.7),(seg(CR+'monster_05.ogg',rate=.6),.1,.5)],.9,r=(.8,.3)),
 'y_hand':lambda:mix([(seg('hit/bfh1_rock_breaking_02.ogg',None,.5),0,.9),(seg(WD+'crack02.mp3.flac',None,.5),0,.6),(seg(CR+'breath.ogg',None,.5,rate=.7),.05,.5)],.7),
 'y_sum':lambda:mix([(seg(CR+'ooh.ogg',rate=.6),0,1),(seg(CR+'ooh.ogg',rate=.75),.2,.6),(cry(1.2,1.2,5),.1,.4)],1.6,r=(1.8,.5)),
 'y_crawl':lambda:mix([(scrape(2.0,16),0,.7),(seg(CR+'breath.ogg',None,1.0,rate=.6),0,.6),(rumble(2.0,150),0,.3)],2.0,loop=1),
 'y_ult':lambda:mix([(cry(4.0,1,1),0,.8)]+[(cry(3.4,.7+k*.18,k+2),.15*k,.35) for k in range(5)]+[(rumble(4.0,90),0,.4)],4.2,r=(2.4,.55)),
 'y_cradle':lambda:mix([(seg(WD+'crack07.mp3.flac',None,.5,rate=.6),0,.8),(seg(WD+'crack09.mp3.flac',None,.5,rate=.55),.5,.6)],1.1,r=(.9,.3)),
 # —— 第九关 熔狱魔神(2026-10-13):低沉的魔吼 + 熔岩轰鸣;火焰 / 锁链 / 重拳 / 火山爆发(游戏里按间隔随机播)——
 'l9_roar':lambda:mix([(seg(DG%1,rate=.68),0,1),(seg(GB%7,rate=.7),.08,.5),(rumble(1.8,110),0,.45)],1.9,r=(1.2,.3)),
 'l9_growl':lambda:mix([(seg(GB%2,rate=.72),0,1),(seg(CR+'breath.ogg',None,.6,rate=.6),.1,.5)],1.2,r=(.9,.25)),
 'l9_fire':lambda:mix([(seg(FIRE,None,1.1,rate=.85),0,1),(seg(R8+'spell_fire_03.ogg',rate=.8),.05,.6)],1.2),
 'l9_chain':lambda:mix([(seg(R8+'chain_01.ogg',rate=.8),0,1),(seg(R8+'chain_03.ogg',rate=.7),.12,.7),(seg(R8+'spell_fire_01.ogg',rate=.9),0,.4)],.9),
 'l9_punch':lambda:mix([(lp(seg('100sfx/explosion.ogg'),1400),0,1),(seg('100sfx/slam_02.ogg'),0,.7),(seg(R8+'spell_fire_05.ogg',None,.5),.05,.5)],.9),
 'l9_erupt':lambda:mix([(rumble(2.6,90),0,.8),(seg('100sfx/explosion.ogg'),.2,.8),(seg(R8+'spell_fire_06.ogg',rate=.75),.4,.7),(seg('hit/bfh1_rock_falling_04.ogg',None,1.0),.6,.5)],2.6,r=(1.0,.25)),
 'l9_laugh':lambda:mix([(seg(GB%4,rate=.6),0,1),(seg(DG%0,None,.8,rate=.6),.2,.4)],1.4,r=(1.2,.3)),
 # —— 第十关 归蝇(2026-10-13):尖啸 + 振翅 + 风;瞬移 / 魔法球 / 冷笑(游戏里按间隔随机播)——
 'g10_shriek':lambda:mix([(seg(RP+'NPC/shade/shade5.wav',rate=1.15),0,1),(seg(RP+'NPC/shade/shade9.wav',rate=.9),.1,.5),(hiss(.9,1800,6000,a=.05,r=2.5),0,.35)],1.3,r=(1.0,.3)),
 'g10_flap':lambda:mix([(lp(seg(SW+'swish-%d.wav'%(i%3+5),rate=.6),900),i*.22,.9) for i in range(4)]+[(wind(1.0,1.0),0,.4)],1.0),
 'g10_wind':lambda:mix([(wind(2.0,2.0),0,1),(hiss(2.0,300,1800,a=.4,r=.8),0,.4)],2.0,r=(1.2,.3)),
 'g10_tele':lambda:mix([(seg(RP+'battle/magic1.wav',rate=.7),0,1),(seg(RP+'NPC/shade/shade2.wav',rate=1.3),.05,.5)],.9),
 'g10_orb':lambda:mix([(seg(MG%'2',rate=.8),0,1),(seg(R8+'spell_01.ogg',None,.6,rate=.8),.05,.5)],.9),
 'g10_laugh':lambda:mix([(seg(RP+'NPC/shade/shade12.wav',rate=.8),0,1),(seg(GB%4,None,.6,rate=.9),.15,.3)],1.3,r=(1.0,.3)),
 # —— 神秘副本 1 · 瓜子大王(仓鼠,2026-10-13 第十二轮):吱吱叫(合成)+ 嗑瓜子(咬碎声)+ 瓜子壳(木头脆响)+ 投掷 / 合拢(游戏里按间隔随机播)——
 'h_squeak':lambda:mix([(squeak(.16,1),0,1),(squeak(.12,1.25,3),.2,.8),(seg(R8+'creature_misc_03.ogg',None,.4,rate=1.8),.05,.25)],.5),
 'h_angry':lambda:mix([(squeak(.3,.85,5),0,1),(squeak(.22,1.1,6),.32,.9),(seg(R8+'creature_hurt_01.ogg',None,.5,rate=1.7),0,.35)],.7),
 'h_eat':lambda:mix([(seg(RP+'NPC/beetle/bite-small%s.wav'%['','2','3'][i%3],rate=1.3),i*.13,.8) for i in range(7)]+[(seg(CR+'eat_02.ogg',None,.9,rate=1.4),0,.5)],1.0),
 'h_shell':lambda:mix([(seg(WD+'crack02.mp3.flac',None,.3,rate=1.6),0,1),(seg(WD+'crack05.mp3.flac',None,.3,rate=1.8),.12,.7),(seg(MG%'3',None,.6,rate=1.2),.15,.5)],.8),
 'h_throw':lambda:mix([(seg(THR,rate=1.2),0,1),(seg(SW+'swish-3.wav',rate=1.3),.02,.5)],.4),
 'h_clap':lambda:mix([(seg(WD+'impactwood11.mp3.flac',None,.4),0,1),(seg(WD+'impactwood14.mp3.flac',None,.35,rate=.8),.02,.8),(seg('100sfx/slam_02.ogg'),0,.5)],.5),
})
for n,f in MIX.items():
  m=f()
  m=m/np.abs(m).max()*.9;tot+=out(n,m,SR,.7)
for n,(p,mx,v) in BGM.items():
  # 按响度(RMS)对齐,峰值不超过 0.95;太长的截到 mx 秒,结尾 1.5 秒淡出(循环接回开头)
  sr=24000;m=load(p,sr)
  if mx:m=m[:int(mx*sr)];f=int(1.5*sr);m[-f:]*=np.linspace(1,0,f)
  m=m*(.13*v/np.sqrt(np.mean(m**2)));pk=np.abs(m).max()
  if pk>.95:m=m*.95/pk
  tot+=out(n,m,sr,.55)
print('audio',len(SFX)+len(BGM),'files',tot,'bytes')
