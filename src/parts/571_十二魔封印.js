// ===== 第五十五轮:十二魔封印(第二张地图「暗黑大陆」右上方、四根封魔柱围着的浮空石台,cur 22 ~ 33)=====
// 点地图上的石台 → 恶魔选择页(st 'dms'):12 张肖像卡 + 名字;选一个 → 星级选择页(LVS.m = 2,返回时回恶魔选择页)→ 单独的首领战(和神秘副本一样直接在首领场地开打)
// 这一轮先开放前 3 个:cur 22 巴尔 / 23 达贡 / 24 摩洛克(第十七关通关后解锁);其余 9 个显示封印法阵 + 名字(「尚未开放」)
// 名字取自现实神话 / 宗教传说里的恶魔;暗线:远古时女神用十二根封魔柱镇住十二魔王,无名一路击倒首领、女神的力量流回人间,封印反而松动了——
//   魔王们都说自己是被「司名者」夺走名字之后才堕落的(和主线里写着「无」字的铭牌、司名身边的小暗星接在一起,以后的主线再展开)
// 图集 DMN(art_src/demon/build_dmn.py):巴尔 = Boss: Demon Slime · 达贡 = FREE Cthulu(深海青蓝配色)· 摩洛克 = Boss: Minotaur(焦黑赤铜配色),都是 chierit 的 CC-BY 4.0 素材
// 场地借已有图集:巴尔 = GP 夜镇(压暗红)· 达贡 = GP 古堡室内(压深海蓝)· 摩洛克 = FIRE 火山;地上的火 / 水 / 冲击 = BFX 的 b-flame / b-firebomb / b-vsplash、FX29 的 x-bubble、earth-rupture
// BGM:bgm22b ~ bgm30b(build_audio.py r55 / r56 / r61,只有首领曲,590 里 isDm 直接用 'bgm'+cur+'b');恶魔选择页用神秘地带的 bgm11
// 数值(第五十六轮,用户):十二魔不分星级,默认按三星进(dmsGo 直接 enterLv(…,3));前 6 个(一阶)比三星忍者首领强、比一星闹钟首领弱 = DMHP / DMDM 固定值,
//   让玩家先刷一阶诅咒之力变强、再去打闹钟之后的三关;后 6 个(二阶)以后再定。没有魔力(esnm),一半生命以下进入二阶段
// 掉落:「诅咒之力」(每个恶魔一种,必掉 1 个,再按掉落率多掉 1 个)+ 首领装备照常
// 第六十一轮开放 7 ~ 9(二阶):别西卜(暴食 —— 张嘴吸人要跑远、蝇卵孵蛆)· 玛门(贪婪 —— 打中你就回血叠攻,踩金堆夺回)· 利维坦(嫉妒 —— 逆鳞:正面只吃 35% 伤害,绕到背后 ×1.5)
// 第五十六轮开放 4 ~ 6:阿斯莫德(魅惑 —— 左右颠倒、锁链吸血要拉开距离)· 贝利亚(谎言 —— 看光的颜色分辨真假、举盾时停手)· 阿斯塔罗特(腐息 —— 腐蚀层数要去净化光圈清掉、预知落点要临时变向)
// 第六十二轮开放 10 ~ 12(十二魔全部开放):贝尔芬格(怠惰 —— 中箭叠「怠惰」越走越慢、叠满睡着;打瞌睡时回血但受伤 ×1.5)· 阿撒兹勒(锻造 —— 岩刺拳、静坐淬火要打断、铁壁反击)·
//   路西法(傲慢 —— 「跪下」的 3 秒里出手会让他更强,忍住就露出破绽;二阶段晨星坠落:只有光圈里是安全的)
const DM0=22,DMOPEN=12,isDm=c=>c>=DM0&&c<DM0+12,dmI=()=>cur-DM0;
// 12 个恶魔:n 名字 · en 原名 · k 图集名(null = 还没做)· sl 诅咒的部位(第五十六轮用户定:武器 / 头饰 / 战甲 / 时装翅膀(共用)/ 项链 / 戒指,前 6 个一阶,后 6 个二阶同样顺序)· lg 传说 + 本作暗线
const DMD=[
 {n:'巴尔',en:'Baal',k:'baal',sl:'wpn',lg:'所罗门七十二柱的第一位魔王,统领东方的六十六个军团。传说他三首同体,能让人隐身;封印里的他只剩一把烧红的屠刀,一直念叨「我的名字是被拿走的」。'},
 {n:'达贡',en:'Dagon',k:'dagon',sl:'head',lg:'古代海边民族供奉的鱼神,后来被当成地狱的恶魔。它从深海里伸出触手,把潮水卷成柱子;封印松动后,石台下面整夜都能听见浪声。'},
 {n:'摩洛克',en:'Moloch',k:'molo',sl:'body',lg:'迦南传说里牛头人身的火神,信徒把祭品投进它铜像腹中的烈火。它举着巨斧守在祭坛前,说只要烧掉足够多的名字,自己的名字就能回来。'},
 {n:'阿斯莫德',en:'Asmodeus',k:'asmo',sl:'cos',lg:'《托比传》里的色欲魔王。封印里的她化作玫红长袍的女祭司,一个飞吻就能让人分不清左右;她说名字被夺走以后,只剩「被爱」能证明自己存在。'},
 {n:'贝利亚',en:'Belial',k:'beli',sl:'ear',lg:'「无价值者」,谎言与背叛的王子,外表是驾着火焰战车的俊美天使。他的光有真有假,举盾时谁砍他谁就会被反噬;他说司名者也对他撒过谎。'},
 {n:'阿斯塔罗特',en:'Astaroth',k:'asta',sl:'ring',lg:'地狱的大公爵,吐息带着腐臭,知晓过去与未来。腐蚀会一层层叠在身上,只有女神残留的光能洗掉;他总能算到你下一步站在哪里。'},
 {n:'别西卜',en:'Beelzebub',k:'belz',sl:'wpn',lg:'「苍蝇之王」,暴食的魔王,一声令下就是遮天的蝇群。封印里的他饿得只剩一张大嘴,连地上的蛆都吞;他张嘴的时候千万别靠近。他说被夺走的名字,是他唯一没吃到的东西。'},
 {n:'玛门',en:'Mammon',k:'mamm',sl:'head',lg:'贪婪的化身,据说地狱里所有的金子都是它挖出来的。他每打中一个人就多攥一把金子、越打越凶;把地上的金子抢回来,他就会愣住。他说司名者拿走他的名字,就像随手拿走一枚金币。'},
 {n:'利维坦',en:'Leviathan',k:'levi',sl:'body',lg:'深渊里的海中巨兽,嫉妒的魔王,鳞甲连刀剑都刺不穿,只有背后的逆鳞是软的;它转身很慢。它嫉妒每一个还有名字的人,连你也不例外。'},
 {n:'贝尔芬格',en:'Belphegor',k:'belp',sl:'cos',lg:'怠惰的魔王,传说她用奇巧的发明诱惑人放下一切、只想睡觉。封印里的她化作紫衣弓手,箭上带着让人发困的毒;她打瞌睡的时候最好别吵醒她——除非你能一口气把她打疼。她说名字被夺走以后,连做梦都梦不到自己。'},
 {n:'阿撒兹勒',en:'Azazel',k:'azaz',sl:'ear',lg:'把锻造武器的技艺教给人类的堕天使,被锁在荒野的巨石下。他的拳头像铁锤,一拳下去岩刺从地里冒出来;他静坐「淬火」时要赶紧打断,不然会越打越凶。他说自己教会了人类打铁,司名者却把他的名字也一起熔掉了。'},
 {n:'路西法',en:'Lucifer',k:'luci',sl:'ring',lg:'曾经的「晨星」,傲慢的魔王。十二根封魔柱的最后一根,镇的就是他。他会命令你「跪下」——那几秒里对他出手只会让他更傲慢;忍住不动,他反而会露出破绽。他说司名者夺走的不只是名字,还有他曾经发出的光。'}];
// 一阶 6 个的生命 / 伤害倍率(三星忍者首领 ≈ 63 万 / 90.6,一星闹钟首领 = 27.4 万 × 3 条命 ≈ 82 万 / 55 ~ 112)
const DMHP=[690000,705000,720000,740000,755000,770000,6000000,6300000,6600000,6900000,7200000,8000000],DMDM=[86,87,88,90,91,92,250,256,262,268,274,290];  // 第六十一轮:二阶 7~9 = 300 ~ 330 万 / 125 ~ 131(擎天魔神三星 300 万那一档)→ 第六十二轮(用户:有点简单,加一倍)600 ~ 660 万 / 250 ~ 262;10~12 接着往上,路西法最强
const DMHK=[1,1.08,1.16],DMAK=[1,1.05,1.1],DMZS={baal:[96,200],dagon:[110,172],molo:[116,186],asmo:[44,105],beli:[50,115],asta:[110,165],belz:[50,108],mamm:[64,112],levi:[56,112],belp:[46,104],azaz:[50,100],luci:[44,112]},DMDK={asmo:2.34,beli:2.33,belz:2.8,mamm:2.3,levi:1.9,belp:2.3,azaz:1.68,luci:1.25};  // DMDK:图集帧比身体高很多(外框含法术特效),画的时候放大
const DMN={I:null,D:'@@A:dmn_atlas@@',M:  {"baal_i":[0,369,195,114,6,66,114],"baal_w":[0,484,195,114,12,66,114],"baal_a":[0,599,195,114,15,66,114],"baal_h":[1171,369,195,114,5,66,114],"dagon_i":[0,2490,148,76,15,53,76],"dagon_w":[1657,2316,148,76,6,53,76],"dagon_a":[2080,2407,148,76,7,53,76],"dagon_b":[0,2567,148,76,9,53,76],"dagon_h":[2546,2316,148,76,5,53,76],"molo_i":[0,0,204,122,16,134,119],"molo_w":[0,123,204,122,12,134,119],"molo_a":[0,246,204,122,16,134,119],"asmo_i":[0,1952,138,90,8,30,89],"asmo_w":[1105,1952,138,90,10,30,89],"asmo_a":[0,2043,138,90,7,30,89],"asmo_b":[967,2043,138,90,11,30,89],"asmo_c":[0,2134,138,90,14,30,89],"asmo_s":[0,2225,138,90,16,30,89],"asmo_h":[0,2316,138,90,12,30,89],"asmo_t":[2486,1952,138,90,6,30,89],"beli_i":[1951,823,158,106,8,54,105],"beli_w":[0,932,158,106,8,54,105],"beli_a":[1265,932,158,106,11,54,105],"beli_b":[0,1039,158,106,10,54,105],"beli_c":[0,1146,158,106,14,54,105],"beli_s":[0,1253,158,106,18,54,105],"beli_r":[1581,1039,158,106,8,54,105],"beli_d":[0,1360,158,106,10,54,105],"asta_i":[1202,1569,147,93,6,52,93],"asta_w":[0,1671,147,93,10,52,93],"asta_a":[0,1765,147,93,14,52,93],"asta_h":[2085,1569,147,93,7,52,93],"belz_i":[2147,369,40,108,8,20,107],"belz_w":[2468,369,45,108,8,24,107],"belz_a":[2341,484,69,108,8,32,107],"belz_b":[0,714,89,108,9,32,107],"belz_c":[802,714,139,108,13,34,107],"belz_s":[0,823,195,108,10,100,107],"belz_r":[2829,369,43,108,6,22,107],"belz_h":[2894,484,46,108,6,26,107],"mamm_i":[2845,1253,43,92,8,16,92],"mamm_w":[1471,1671,48,92,8,20,92],"mamm_a":[1856,1671,68,92,7,28,92],"mamm_b":[2333,1671,72,92,7,36,92],"mamm_c":[0,1859,161,92,9,24,92],"mamm_s":[1450,1859,196,92,8,56,92],"mamm_j":[2059,1765,61,92,11,30,92],"mamm_h":[3004,932,42,92,6,18,92],"levi_i":[2838,1671,46,82,8,17,82],"levi_w":[2731,1765,44,82,8,24,82],"levi_a":[2486,2043,73,82,6,20,82],"levi_b":[1933,2134,75,82,8,20,82],"levi_c":[2534,2134,85,82,9,23,82],"levi_s":[0,2407,189,82,11,77,82],"levi_p":[2209,2225,63,82,7,20,82],"levi_t":[3019,1859,53,82,5,23,82],"levi_r":[2925,2043,50,82,7,21,82],"levi_d":[3084,1765,37,82,6,18,82],"fx_egg":[0,2768,32,32,9,16,32],"fx_mag":[289,2768,32,32,4,16,32],"fx_blob":[418,2768,32,32,7,16,32],"fx_splat":[2921,2490,64,64,6,32,64],"fx_blade":[643,2768,80,32,6,40,32],"fx_trap":[1124,2768,80,32,9,40,32],"belp_i":[2926,599,49,101,6,25,101],"belp_w":[2610,714,51,101,10,25,101],"belp_a":[2213,1146,106,101,10,24,101],"belp_b":[1581,1360,74,101,8,23,101],"belp_c":[2174,1360,69,101,12,32,101],"belp_s":[0,1467,195,101,17,50,101],"belp_d":[0,1569,71,101,10,21,101],"belp_r":[711,1569,70,101,7,36,101],"belp_h":[2846,1039,55,101,6,31,101],"azaz_i":[2478,2567,25,61,6,11,57],"azaz_w":[2629,2567,27,61,8,14,57],"azaz_a":[2846,2567,53,61,6,13,57],"azaz_b":[0,2644,59,61,6,13,57],"azaz_c":[355,2644,106,61,12,13,57],"azaz_s":[1628,2644,93,61,13,12,57],"azaz_m":[2838,2644,25,61,8,12,57],"azaz_d":[0,2706,24,61,13,11,57],"azaz_h":[3039,2644,27,61,6,14,57],"luci_i":[2221,2490,37,66,10,14,66],"luci_w":[2592,2490,41,66,8,16,66],"luci_a":[1333,2567,88,66,13,20,66],"luci_h":[3117,2407,37,66,3,18,66],"fx_arw":[121,2801,32,3,1,16,3],"fx_arwh":[3126,2768,28,12,6,14,12],"fx_shower":[2449,123,91,122,9,45,122],"fx_beam":[1845,2768,256,15,5,128,15],"fx_orb":[0,2801,30,11,4,15,11],"fx_orbx":[313,2706,44,47,7,22,47]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&!!this.M[e.k+'_i']},
  // 第 i 帧:脚底中间画在 (X, Y),高度按「脚底以上 m[6] 像素」= h
  fr(c,n,i,X,Y,h,a){const m=this.M[n];if(!m||!this.I)return;const s=h/m[6];i=Math.max(0,Math.min(m[4]-1,Math.floor(i)));c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;
    c.drawImage(this.I,m[0]+i*m[2],m[1],m[2],m[3],Math.round(X-m[5]*s),Math.round(Y-m[6]*s),m[2]*s,m[3]*s);c.restore()},
  // 首领:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const vs=e.max?1.1*(e.bsz||1):(e.vs||1),H=e.h/vs*(DMDK[e.k]||1),k=e.k,a=e.act,T=e.at||0,w=e.pz=='w';let n='i',i=Math.floor(t*8)%this.M[k+'_i'][4];
    if(k=='baal'){if(a=='cleave'){n='a';i=T<.75?T/.75*8:8+(T-.75)/.08}else if(a=='leap'){n='a';i=w?2:T<1.05?9:12}else if(a=='meteor'||a=='crown'||a=='wave'){n='a';i=w?Math.min(5,T*8):10}else if(e.mv){n='w';i=Math.floor(t*12)%12}}
    else if(k=='dagon'){if(a=='beam'){n='a';i=T<.6?T/.6*2:2+(T-.6)/.12}else if(a=='lash'){n='b';i=T<.55?T/.55*2:2+(T-.55)/.1}else if(a=='dive'||e.mv){n='w';i=Math.floor(t*(a=='dive'?14:9))%6}else if(a){n='a';i=w?Math.min(1,T*3):0}}
    else if(k=='molo'){if(a=='chop'){n='a';i=T<.8?T/.8*9:9+(T-.8)/.09}else if(a=='charge'&&!w||e.mv){n='w';i=Math.floor(t*(a=='charge'?18:10))%12}else if(a){n='a';i=w?Math.min(3,T*6):2}}
    else if(k=='asmo'){if(a=='kiss'){n='b';i=w?Math.min(4,T/.6*4):4+(T-.6)/.08}else if(a=='tether'){n='h';i=Math.floor(t*10)%12}else if(a=='tide'){n='s';i=T/1.6*16}else if(a=='combo'){n='c';i=T/1.4*14}
      else if(a=='step'){n='t';i=T/.45*6}else if(a=='rain'){n='a';i=w?Math.min(3,T*6):3+(T-.7)/.1}else if(e.mv){n='w';i=Math.floor(t*10)%10}}
    else if(k=='beli'){if(a=='lie'){n='a';i=w?Math.min(3,T*5):3+(T-1)/.08}else if(a=='guard'){n='d';i=T<.3?T/.1:3+Math.floor(t*8)%4}else if(a=='ride'){n=w?'r':'w';i=w?Math.min(2,T*5):Math.floor(t*16)%8}
      else if(a=='judge'){n='s';i=T/1.8*18}else if(a=='combo'){n='c';i=T/1.4*14}else if(e.mv){n='w';i=Math.floor(t*10)%8}}
    else if(k=='asta'){if(a=='sweep'){n='a';i=T<.55?T/.55*6:6+(T-.55)/.08}else if(a=='breath'){n='a';i=w?Math.min(4,T*6):4+Math.floor(t*6)%2}else if(a=='fore'){n='a';i=w?Math.min(10,9+T*2):11+Math.floor(t*4)%2}
      else if(a=='quake'){n='a';i=w?Math.min(12,T*20):12+(T-.5)/.1}else if(a=='daze'){n='h';i=Math.floor(t*8)%7}else if(e.mv){n='w';i=Math.floor(t*8)%10}}
    else if(k=='belz'){if(a=='slash'){n='c';i=T/1.35*13}else if(a=='spit'){n='a';i=w?Math.min(3,T*6):3+(T-.5)/.1}else if(a=='egg'){n='b';i=T/1.1*9}else if(a=='blink'){n='s';i=T/1.25*10}
      else if(a=='dash'){n=w?'a':'r';i=w?Math.min(2,T*6):Math.floor(t*14)%6}else if(a=='devour'){n='h';i=Math.floor(t*(T<1.2?6:12))%6}else if(e.mv){n='w';i=Math.floor(t*12)%8}}
    else if(k=='mamm'){if(a=='swing'){n='a';i=T/.95*7}else if(a=='smash'){n='b';i=T/1.1*7}else if(a=='burst'){n='c';i=T/1.25*9}else if(a=='ramp'){n='s';i=T/1.45*8}else if(a=='leap'){n='j';i=T/1.35*11}
      else if(a=='rain'){n='a';i=w?Math.min(2,T*4):2+(T-.6)/.12}else if(a=='daze'){n='h';i=Math.floor(t*8)%6}else if(e.mv){n='w';i=Math.floor(t*10)%8}}
    else if(k=='levi'){if(a=='combo'){n=T<.65?'a':'b';i=T<.65?T/.65*6:(T-.65)/.65*8}else if(a=='arc'){n='c';i=T/1.2*9}else if(a=='blade'){n='p';i=T/.9*7}else if(a=='trap'){n='t';i=T/.85*5}
      else if(a=='roll'){n='r';i=T/.6*7}else if(a=='abyss'){n='s';i=w?Math.min(3,T*3):3+(T-1)/.08}else if(e.mv){n='w';i=Math.floor(t*10)%8}}
    // 第六十二轮:贝尔芬格 / 阿撒兹勒 / 路西法
    else if(k=='belp'){if(a=='shot'){n='a';i=T/.95*10}else if(a=='volley'){n='b';i=T/.9*8}else if(a=='rain'){n='c';i=T/1.3*12}else if(a=='beam'){n='s';i=T/1.8*17}else if(a=='thorn'){n='d';i=T/1.2*10}
      else if(a=='slide'){n='r';i=T/.6*7}else if(a=='nap'){n='i';i=Math.floor(t*2.5)%6}else if(a=='wake'){n='h';i=T/.5*6}else if(e.mv){n='w';i=Math.floor(t*12)%10}}
    else if(k=='azaz'){if(a=='jab'){n='a';i=T/.55*6}else if(a=='combo'||a=='boulder'){n='b';i=T/(a=='combo'?.75:.9)*6}else if(a=='blast'||a=='counter'){n='c';i=T/(a=='counter'?.9:1.4)*12}else if(a=='spike'){n='s';i=T/1.6*13}
      else if(a=='forge'){n='m';i=T<.5?T/.5*4:4+Math.floor(t*6)%4}else if(a=='guard'){n='d';i=Math.min(12,T/1.3*13)}else if(a=='daze'){n='h';i=Math.floor(t*8)%6}else if(e.mv){n='w';i=Math.floor(t*12)%8}}
    else if(k=='luci'){if(a=='orb'||a=='star'||a=='pillar'||a=='pride'){n='a';i=Math.min(12,T/(a=='pride'?1:1.3)*13)}else if(a=='daze'){n='h';i=Math.floor(t*6)%3}else if(e.mv){n='w';i=Math.floor(t*10)%8}}
    const al=e.fa!=null?e.fa:null;  // 淡入淡出(路西法瞬移)
    c.save();if(FLW)c.filter='brightness(2.6)';if(e.od){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.35+.15*Math.sin(t*6);this.fr(c,k+'_'+n,i,0,0,H*1.02,al);c.restore()}
    this.fr(c,k+'_'+n,i,0,0,H,al);c.restore()},
  // 肖像(恶魔选择页 / 关卡卡片):idle 动画,脚底在 (cx, by),高 h
  pt(c,k,cx,by,h,t){const m=this.M[k+'_i'];if(m)this.fr(c,k+'_i',Math.floor(t*8)%m[4],cx,by,DMDK[k]?h*DMDK[k]*.8:h)}};
DMN.init();
// 场地:借已有图集,再整体压一层颜色
function dmBg(){const t=performance.now()/1000,k=DMD[dmI()].k;
  if(k=='baal'){GP.arena3(t);x.fillStyle='rgba(110,8,0,.32)';x.fillRect(0,0,VW,VH)}
  else if(k=='dagon'){GP.arena2(t);x.fillStyle='rgba(0,36,64,.4)';x.fillRect(0,0,VW,VH)}
  else if(k=='asmo'){ALC.bg();x.fillStyle='rgba(96,0,64,.36)';x.fillRect(0,0,VW,VH)}  // 第五十六轮:钟楼教堂(GothicVania Church)压玫红
  else if(k=='beli'){CST.bg();x.fillStyle='rgba(90,64,10,.26)';x.fillRect(0,0,VW,VH)}  // 永夜王城压一层金
  else if(k=='asta'){NJA.bg();x.fillStyle='rgba(22,40,6,.42)';x.fillRect(0,0,VW,VH)}  // 月影忍城压腐绿
  else if(k=='belz'){CITY8.bg();x.fillStyle='rgba(44,48,0,.42)';x.fillRect(0,0,VW,VH)}  // 第六十一轮:第八关鬼城压腐黄
  else if(k=='mamm'){RBT.bg();x.fillStyle='rgba(120,80,0,.3)';x.fillRect(0,0,VW,VH)}  // 金核机库压金
  else if(k=='levi'){SHIP10.bg();x.fillStyle='rgba(0,40,64,.25)';x.fillRect(0,0,VW,VH)}  // 幽灵船压深海
  else if(k=='belp'){MECH.bg();x.fillStyle='rgba(60,20,96,.4)';x.fillRect(0,0,VW,VH)}  // 第六十二轮:齿轮要塞(「发明」)压昏睡紫
  else if(k=='azaz'){IFN.bg();x.fillStyle='rgba(24,22,30,.3)';x.fillRect(0,0,VW,VH)}  // 炎狱熔岩洞(锻炉)压铁灰
  else if(k=='luci'){VOL9.bg();x.fillStyle='rgba(56,10,90,.38)';x.fillRect(0,0,VW,VH)}  // 火山地狱压堕天紫
  else{FIRE.bg();x.fillStyle='rgba(30,6,0,.25)';x.fillRect(0,0,VW,VH)}}
// ---- 场上的东西:地面火 / 深渊水洼 DMZ · 火柱 / 水柱 DMP · 天降火球 / 水球 DMM · 贴地冲击波 DMW(跳过去)----
//   第五十六轮:DMK 魅惑之吻(飞行)· DML 贝利亚的真假光圈 · DMC 净化光圈 · DMT 阿斯莫德的锁链;P.chm 魅惑(左右颠倒,340 update 里用)· P.rot 腐蚀层数(150 hurt 里每层受伤 +6%)
let DMZ=[],DMP=[],DMM=[],DMW=[],DMK=[],DML=[],DMC=[],DMT=null;
function dmClr(){dm3Clr();DMZ=[];DMP=[];DMM=[];DMW=[];DMK=[];DML=[];DMC=[];DMT=null;if(typeof P!='undefined'&&P){P.chm=0;P.rot=0;P.slp=0}}
// 颜色 c:fire 火 · rock 岩 · sea 水 · love 魅惑(粉紫星)· holy 伪光(金)· rot 腐息(绿)—— 后三种的特效:DMSP 爆开 / DMZF 地面 [名字, 间距, 大小, y] / DMPF 光柱 [名字, 间距, 大小, y]
const DMSP={love:'x-star',holy:'b-light',rot:'x-fel',gold:'b-light',acid:'b-gas',sleep:'x-bubble'},DMZF={love:['x-star',24,.36,-10],holy:['b-light',22,.5,-12],rot:['b-gas',30,.62,-10],gold:['b-light',20,.42,-10],acid:['b-gas',26,.5,-8],sleep:['x-bubble',24,.55,-10]},DMPF={love:['x-star',40,.85,-20],holy:['b-light',46,1.5,-22],rot:['x-fel',44,.75,-22],gold:['b-light',46,1.5,-22],acid:['b-gas',44,.8,-22],sleep:['x-bubble',40,1,-22]};  // 第六十一轮:gold 金 · acid 酸液 · 第六十二轮:sleep 怠惰(催眠泡泡)
const vfn=n=>(VFX.M[n]||{}).n||1;
const dmCX=v=>Math.max(ARL+20,Math.min(ARR-20,v));
const dmZone=(x0,x1,life,dm,d,c)=>{x0=Math.max(ARL,x0);x1=Math.min(ARR,x1);if(x1-x0<8)return;DMZ.push({x0,x1,t:0,life,dm,d,c});if(DMZ.length>36)DMZ.shift()};
const dmPil=(px,dm,d,dl,c)=>DMP.push({x:dmCX(px),t:-(dl||0),dm,d,c});
const dmMet=(px,dm,d,dl,zl,c)=>DMM.push({x:dmCX(px),y:-30-rnd(0,40),vy:120,t:-(dl||0),dm,d,zl,c});
const dmWave=(px,v,dm,d,c,dl)=>DMW.push({x:px,lx:px,v,t:-(dl||0),life:2.4,dm,d,c});
const dmSplash=(px,py,s)=>VFX.spawn('x-bubble',px,py,{s,life:.7,add:1});  // 水花:FX29 的蓝白光泡(BFX 的 b-vsplash 是绿色毒液)
function dmBoom(bx,r,dm,d,c){if(c=='sea')dmSplash(bx,GY-20,r/22);else if(DMSP[c])VFX.spawn(DMSP[c],bx,GY-r*.45,{s:r/(c=='holy'?28:c=='rot'?62:36),life:.7,add:1});else VFX.spawn(c=='rock'?'earth-rupture':'b-firebomb',bx,c=='rock'?GY:GY-12,{s:c=='rock'?r/55:r/30});syn('boom');shake=Math.max(shake,.25);const pc=P.x+12;return Math.abs(pc-bx)<r&&P.y+P.h>GY-r*.9&&hurt(d*dm,{kb:sgn(pc-bx)*320})}
function dmStep(dt){const pc=P.x+12,onG=P.y+P.h>=GY-4;P.dmT=(P.dmT||0)-dt;
  if(P.chm>0)P.chm-=dt;
  for(const z of DMZ){z.t+=dt;const inz=onG&&z.t>.15&&z.t<z.life-.2&&pc>z.x0&&pc<z.x1;if(inz&&z.c=='love')P.chm=Math.max(P.chm||0,.6);if(inz&&P.dmT<=0&&hurt(z.d*z.dm,{kb:0})){P.dmT=.45;if(z.c=='rot')dmRot(1);if(z.c=='sleep')dmSlp(1)}}DMZ=DMZ.filter(z=>z.t<z.life);
  dmStep2(dt,pc,onG);dm3Step(dt,pc,onG);dm4Step(dt,pc,onG);
  for(const p of DMP){p.t+=dt;if(p.t>=0&&!p.w0){p.w0=1;syn('blink')}if(p.t>=.8&&!p.sn){p.sn=1;syn('boom');shake=Math.max(shake,.25)}if(p.t>=.8&&p.t<2&&Math.abs(pc-p.x)<26&&P.dmT<=0&&hurt(p.d*p.dm,{kb:sgn(pc-p.x)*260}))P.dmT=.45}DMP=DMP.filter(p=>p.t<2.2);
  for(const m of DMM){m.t+=dt;if(m.t<0)continue;m.vy+=520*dt;m.y+=m.vy*dt;if(m.y>=GY-14){m.dd=1;dmBoom(m.x,50,m.dm,m.d,m.c);if(m.zl)dmZone(m.x-55,m.x+55,m.zl,m.dm,5,m.c)}}DMM=DMM.filter(m=>!m.dd);
  for(const w of DMW){w.t+=dt;if(w.t<0)continue;w.x+=w.v*dt;if(Math.abs(w.x-w.lx)>=34){w.lx=w.x;if(w.c=='sea')dmSplash(w.x,GY-18,1.1);else if(DMSP[w.c])VFX.spawn(DMSP[w.c],w.x,GY-16,{s:w.c=='holy'?1.1:.7,life:.5,add:1});else VFX.spawn(w.c=='rock'?'earth-rupture':'b-firebomb',w.x,w.c=='rock'?GY:GY-10,{s:w.c=='rock'?1.1:.9})}
    if(!w.hit&&onG&&Math.abs(pc-w.x)<24&&hurt(w.d*w.dm,{kb:sgn(w.v)*380})){w.hit=1;if(w.c=='love')dmCharm(1.2);if(w.c=='rot')dmRot(1);if(w.c=='sleep')dmSlp(2)}}DMW=DMW.filter(w=>w.t<w.life&&w.x>ARL-20&&w.x<ARR+20);
  if(bossOn&&!(B&&B.hp>0)){DMP=[];DMM=[];DMW=[];DMK=[];DML=[];DMT=null;P.chm=0;P.slp=0;dm3Clr()}}
// ---- 第五十六轮:魅惑 / 腐蚀 / 魅惑之吻 / 真假光圈 / 净化光圈 / 锁链 ----
function dmCharm(s){if(!(P.chm>0)){tx('魅惑!左右颠倒',P.x-30,P.y-30,'#f783ac');syn('blink')}P.chm=Math.max(P.chm||0,s)}
function dmRot(n){const o=P.rot||0;P.rot=Math.min(10,o+n);if(P.rot>o)tx('☠ 腐蚀 ×'+P.rot,P.x-16,P.y-24,'#a9e34b')}
const dmKiss=(px,py,v,dm,dl,hm)=>DMK.push({x:px,y:py,vx:v,t:-(dl||0),dm,hm:hm==null?1:hm});
function dmStep2(dt,pc,onG){const S=stats();
  for(const k of DMK){k.t+=dt;if(k.t<0)continue;if(k.hm&&k.t<2.2){const v=sgn(pc-k.x)*170;k.vx+=(v-k.vx)*Math.min(1,dt*1.4)}k.x+=k.vx*dt;k.y0=k.y0||k.y;k.y=k.y0+Math.sin(k.t*5)*5;
    if(Math.abs(pc-k.x)<16&&P.y<k.y+8&&P.y+P.h>k.y-8&&hurt(10*k.dm,{kb:sgn(k.vx)*160})){k.dd=1;dmCharm(B&&B.od?3.5:2.5);VFX.spawn('x-star',k.x,k.y,{s:.7,life:.5,add:1})}}
  DMK=DMK.filter(k=>!k.dd&&k.t<6&&k.x>ARL-30&&k.x<ARR+30);
  for(const m of DML){m.t+=dt;if(m.t>=1.3&&!m.go){m.go=1;if(m.real){VFX.spawn('b-light',m.x,GY-40,{s:2.2,life:.7,add:1});syn('boom');shake=Math.max(shake,.3);if(Math.abs(pc-m.x)<62)hurt(18*m.dm,{kb:sgn(pc-m.x)*300})}else VFX.spawn('smoke-puff',m.x,GY-10,{s:1.2})}}DML=DML.filter(m=>m.t<1.8);
  // 腐蚀:每层每秒掉 0.3% 生命(不会致死),净化光圈里站满 0.8 秒清空
  if(P.rot>0){P.rtT=(P.rtT||0)+dt;if(P.rtT>=1){P.rtT=0;const d=Math.max(1,Math.round(S.hp*.003*P.rot));if(!GM.god){P.hp=Math.max(1,P.hp-d);tx('-'+d,P.x+6,P.y-6,'#a9e34b')}}}
  for(const c of DMC){c.t+=dt;if(c.t>.4&&Math.abs(pc-c.x)<34&&onG){c.st=(c.st||0)+dt;if(c.st>=.8&&!c.dd){c.dd=1;if(P.rot>0)tx('✨ 腐蚀清除',P.x-24,P.y-30,'#ffe066');P.rot=0;VFX.spawn('radiant-heal',c.x,GY-30,{s:1.2,life:.8,add:1});syn('buff')}}}DMC=DMC.filter(c=>!c.dd&&c.t<c.life);
  const T=DMT;if(T&&B&&B.hp>0){T.t+=dt;const bx=B.x+B.w/2,dd=Math.abs(pc-bx);
    if(dd>T.r){DMT=null;banner('锁链挣断了!阿斯莫德失去平衡');syn('slam');VFX.spawn('void-implosion',bx,B.y+B.h*.4,{s:1});if(B.act=='tether'){B.act='daze';B.at=0;B.pz=null}}
    else{T.k-=dt;if(T.k<=0){T.k=.5;if(!GM.god&&!DECOY){const d=Math.max(1,Math.round(S.hp*(B.od?.03:.022)));P.hp=Math.max(1,P.hp-d);tx('-'+d,P.x+6,P.y-6,'#f783ac')}const h=Math.round(B.max*.012);B.hp=Math.min(B.max,B.hp+h);tx('+'+h,bx-10,B.y-10,'#f783ac')}if(T.t>=T.life)DMT=null}}else if(T)DMT=null}
function dmFx(){const t=performance.now()/1000;if(!VFX.ok())return;x.imageSmoothingEnabled=false;
  for(const z of DMZ){const a=Math.min(1,z.t/.2,(z.life-z.t)/.4),Q=DMZF[z.c];if(a<=0)continue;for(let px=z.x0+6,i=0;px<z.x1-2;px+=Q?Q[1]:z.c=='sea'?18:12,i++){const sx=px-cam;if(sx<-20||sx>VW+20)continue;
    if(Q)VFX.frame(x,Q[0],Math.floor(t*12+i*3)%vfn(Q[0]),sx,GY+Q[3],Q[2]+(i%3)*.06,i%2?-1:1,0,a*.85);else if(z.c=='sea')VFX.frame(x,'x-bubble',Math.floor(t*12+i*3)%16,sx,GY-6,.42+(i%3)*.06,1,0,a*.85);else VFX.frame(x,'b-flame',Math.floor(t*12+i*1.7)%5,sx,GY+2,1.05+(i%3)*.18,1,0,a)}}
  for(const p of DMP){const sx=p.x-cam;if(p.t<0)continue;const sea=p.c=='sea',Q=DMPF[p.c];
    if(Q){const n=vfn(Q[0]);if(p.t<.8){for(let k=-1;k<=1;k++)VFX.frame(x,Q[0],Math.floor(t*14+k*4)%n,sx+k*10,GY-8,Q[2]*(.35+p.t*.4),1,0,.75)}else{const a=Math.min(1,(2-p.t)/.3);x.save();x.globalCompositeOperation='lighter';for(let y=GY+2,k=0;y>-20;y-=Q[1],k++)VFX.frame(x,Q[0],Math.floor(t*14+k*5)%n,sx,y+Q[3],Q[2],k%2?-1:1,0,a);x.restore()}continue}
    if(p.t<.8){for(let k=-1;k<=1;k++)sea?VFX.frame(x,'x-bubble',Math.floor(t*14+k*4)%16,sx+k*10,GY-8,.35+p.t*.3,1,0,.75):VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx+k*9,GY+2,.6+p.t*.5,1,0,.7)}
    else{const a=Math.min(1,(2-p.t)/.3);x.save();x.globalCompositeOperation='lighter';for(let y=GY+2,k=0;y>-20;y-=sea?40:52,k++)sea?VFX.frame(x,'x-bubble',Math.floor(t*14+k*5)%16,sx,y-20,1.1,k%2?-1:1,0,a):VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx,y,2.4,k%2?-1:1,0,a,1.75);x.restore()}}
  for(const m of DMM)if(m.t>=0){if(DMSP[m.c])VFX.frame(x,DMSP[m.c],Math.floor(t*14)%vfn(DMSP[m.c]),m.x-cam,m.y,m.c=='holy'?1:.6,1,0,1);else if(m.c=='sea')VFX.frame(x,'x-bubble',Math.floor(t*14)%16,m.x-cam,m.y,.7,1,0,1);else IFN.fr(x,'fb',1,m.x-cam-16,m.y-16,2.2,1,Math.PI/2)}
  // 第五十六轮:魅惑之吻 / 锁链 / 真假光圈 / 净化光圈 / 主角身上的魅惑和腐蚀
  for(const k of DMK)if(k.t>=0)VFX.frame(x,'x-star',Math.floor(t*16)%16,k.x-cam,k.y,.55,1,0,1);
  if(DMT&&B&&B.hp>0){const bx=B.x+B.w/2-cam,by=B.y+B.h*.45,px=P.x+12-cam,py=P.y+14,n=Math.max(3,Math.floor(Math.hypot(px-bx,py-by)/18)),fr=Math.abs(P.x+12-B.x-B.w/2)/DMT.r;for(let i=1;i<n;i++){const u=i/n;VFX.frame(x,'x-star',(Math.floor(t*16)+i*3)%16,bx+(px-bx)*u,by+(py-by)*u+Math.sin(t*8+i)*3,.22,1,0,fr>.8?.5+.5*Math.sin(t*30):.9)}}
  for(const m of DML){const sx=m.x-cam,gold=m.sh,a=m.t<1.3?Math.min(1,m.t/.25):Math.max(0,1-(m.t-1.3)/.4);if(m.t<1.3)VFX.frame(x,gold?'mc-gold':'rift-portal',gold?0:Math.floor(t*12)%16,sx,GY-4,gold?.5:.85,1,0,Math.min(1,a*(gold?.7:1)+.3*Math.sin(t*10)),gold?.32:.4)}
  for(const c of DMC){const sx=c.x-cam,a=Math.min(1,c.t/.4,(c.life-c.t)/.5);VFX.frame(x,'mc-gold',0,sx,GY-4,.42,1,0,a*.85,.3);VFX.frame(x,'radiant-heal',Math.floor(t*12)%14,sx,GY-30,.85,1,0,a*.8);if(c.st)CT(Math.round(c.st/.8*100)+'%',sx,GY-62,8,'#ffe066','center',2,'#2a2008')}
  if(B&&B.k=='asta'&&B.act=='fore'&&B.mk!=null&&B.hp>0){const u=B.at%1.25,lk=u>=.75;VFX.frame(x,'x-vortex',Math.floor(t*16)%16,B.mk-cam,GY-14,lk?.75:.55,1,0,lk?.75+.25*Math.sin(t*30):.55)}  // 预知落点(锁定后闪烁)
  dm3Fx(t);dm4Fx(t);
  if(P.chm>0)VFX.frame(x,'b-darkhit',Math.floor(t*12)%6,P.x+12-cam,P.y-6,.45,1,0,.85);
  if(P.rot>0){VFX.frame(x,'b-gas',0,P.x+12-cam,P.y+18,.42+P.rot*.03,1,0,.5);CT('☠×'+P.rot,P.x+12-cam,P.y-12,8,'#a9e34b','center',2,'#14200a')}
  x.imageSmoothingEnabled=true}
// ---- 三个恶魔共用 ----
function dmEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.hd=0;e.fa=null;e.cd=(e.od?.75:1.1)+Math.random()*.4+(x_||0)}
function dmOdChk(e,s){if(!e.od&&e.hp<e.max*.5){e.od=1;flash('255,80,60',.35);shake=.5;syn('boom');banner(DMD[dmI()].n+' · '+s)}}
const dmHit=(e,x0,x1,top,d,kb)=>{const pc=P.x+12;if(pc>Math.min(x0,x1)&&pc<Math.max(x0,x1)&&P.y+P.h>top)hurt(d*e.dm,{kb})};
function dmNew(LM,b){const d=DMD[dmI()],z=DMZS[d.k];return {k:d.k,x:2860,y:GY-z[1]-(d.k=='dagon'?18:0),w:z[0],h:z[1],...b,fl:0,f:-1,cd:2,act:null,dm:1,lm:LM}}
function dmInit(){const i=dmI(),K=STK();B.esnm=1;if(i<DMHP.length){B.hp=B.max=DMHP[i];B.dm=DMDM[i]}else{B.hp=B.max=Math.round(IGHP*DMHK[Math.min(2,i%3)]*K.hp);B.dm=IGDM*DMAK[Math.min(2,i%3)]*K.atk}B.od=0;B.avT=7;B.gy=B.y;B.ccT=6}  // 第五十六轮:一阶固定数值(不再乘星级)
// ---- 巴尔:屠刀斩 cleave · 跃击 leap · 业火陨落 meteor · 炎浪 wave(往两边推开)· 王冠烈焰 crown(二阶段:五根火柱)----
function baalStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('巴尔 · 东方之王从封印里醒来了');bsfx('l9_roar')}
  dmOdChk(e,'王之烈焰!地火烧得更久');
  if(od&&!e.act){e.avT-=dt;if(e.avT<=0){e.avT=7;dmBoom(cx,110,dm,10,'fire');dmZone(cx-150,cx+150,zl,dm,6,'fire')}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?62:50)*dt)}
    if(e.cd>0)return;const Q=['cleave','cleave','leap','meteor','wave'];if(ad<e.w/2+150)Q.push('cleave');if(ad>240)Q.push('leap','meteor');if(od)Q.push('crown','wave');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='cleave'){if(T<.75){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.35;syn('slam');dmHit(e,cx-e.f*20,cx+e.f*210,GY-160,24,e.f*460);VFX.spawn('earth-rupture',cx+e.f*130,GY,{s:2});dmZone(Math.min(cx+e.f*30,cx+e.f*220),Math.max(cx+e.f*30,cx+e.f*220),zl,dm,6,'fire')}
    if(T>1.3)dmEnd(e);return}
  if(a=='leap'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;e.x0=e.x;e.jx=gpCl(e,pc-e.w/2);return}e.pz='s';const u=Math.min(1,(T-.45)/.6);e.x=e.x0+(e.jx-e.x0)*u;e.y=e.gy-Math.sin(u*Math.PI)*130;
    if(u>=1&&!e.hd){e.hd=1;e.y=e.gy;const fx=e.x+e.w/2;dmBoom(fx,120,dm,20,'fire');dmZone(fx-140,fx+140,zl,dm,6,'fire');VFX.spawn('earth-rupture',fx,GY,{s:2.2})}if(T>1.4){e.y=e.gy;dmEnd(e)}return}
  if(a=='meteor'){if(T<.8){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.25;syn('boom');const n=od?11:7;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-280,280),dm,14,.13*i,zl-1,'fire')}if(T>1.6)dmEnd(e,.2);return}
  if(a=='wave'){if(T<.6){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.4;syn('boom');for(const sd of [-1,1]){dmWave(cx+sd*e.w/2,sd*270,dm,16,'fire');if(od)dmWave(cx+sd*e.w/2,sd*200,dm,16,'fire',.55)}}if(T>1.2)dmEnd(e,.1);return}
  if(a=='crown'){if(T<.7){e.pz='w';return}e.pz='s';const k=Math.floor((T-.7)/.25);if(e.n<=k&&k<5){e.n=k+1;dmPil(pc+[0,-90,90,-180,180][k],dm,15,0,'fire')}if(T>2.2)dmEnd(e,.3);return}
  dmEnd(e)}
// ---- 达贡(低空浮游):潮刃 beam(往前横扫一道水刃)· 触手鞭 lash(超长距离贴地横抽)· 潮柱 tide(主角脚下接连涌出水柱)·
//      深渊雨 rain(天上落水球,落地留下水洼)· 俯冲 dive(贴地横冲到墙,沿路留水洼)· 二阶段「深渊涨潮」:每 6 秒脚下涌一根水柱 ----
function dagStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5,by=e.gy;e.pz=null;
  if(e.act!='dive')e.y+=(by+Math.sin(GT*2.2)*6-e.y)*Math.min(1,dt*6);
  if(!e.intro){e.intro=1;banner('达贡 · 深海之神浮出了水面');bsfx('lz_growl')}
  dmOdChk(e,'深渊涨潮!水柱更多');
  if(od){e.avT-=dt;if(e.avT<=0){e.avT=6;dmPil(pc,dm,13,0,'sea')}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>200){e.mv=1;e.x=gpCl(e,e.x+e.f*72*dt)}else if(ad<90){e.mv=1;e.x=gpCl(e,e.x-e.f*48*dt)}
    if(e.cd>0)return;const Q=['beam','lash','tide','rain','dive'];if(ad<300)Q.push('lash','beam');if(od)Q.push('tide','dive');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='beam'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('zap');dmHit(e,cx-e.f*30,cx+e.f*300,GY-120,20,e.f*380);for(let k=1;k<=4;k++)dmSplash(cx+e.f*k*70,GY-60,1.3)}if(T>1.15)dmEnd(e);return}
  if(a=='lash'){if(T<.55){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd&&T>=.65){e.hd=1;shake=.3;syn('slam');dmHit(e,cx,cx+e.f*340,GY-70,18,e.f*520);dmSplash(cx+e.f*320,GY-24,1.8)}if(T>1.35)dmEnd(e);return}
  if(a=='tide'){if(T<.7){e.pz='w';return}e.pz='s';const n=od?6:4,k=Math.floor((T-.7)/.35);if(e.n<=k&&k<n){e.n=k+1;dmPil(pc+(k%2?rnd(-60,60):0),dm,15,0,'sea')}if(T>.7+n*.35+.5)dmEnd(e,.3);return}
  if(a=='rain'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?13:9;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-300,300),dm,12,.12*i,zl-.5,'sea')}if(T>1.5)dmEnd(e,.2);return}
  if(a=='dive'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';e.y+=(GY-e.h+4-e.y)*Math.min(1,dt*10);const ox=e.x;e.x=gpCl(e,e.x+e.f*330*dt);const back=cx-e.f*e.w/2;
    if(!e.hd||Math.abs(back-e.lz)>70){e.hd=1;e.lz=back;dmZone(back-34,back+34,zl,dm,5,'sea')}if(!e.rh&&ov(P,e)&&hurt(22*dm,{kb:e.f*520}))e.rh=1;
    if(T>2.2||e.x==ox&&T>.7){e.rh=0;shake=.3;dmBoom(cx+e.f*e.w/2,80,dm,12,'sea');dmEnd(e,.2)}return}
  dmEnd(e)}
// ---- 摩洛克:焚祭巨斧 chop(二阶段连砍两下)· 蛮牛冲撞 charge(撞墙为止)· 焚祭之火 altar(主角脚下接连喷火柱)·
//      震地 quake(冲击波往两边推开,跳过去)· 烙印 brand(二阶段:天降火球)· 二阶段「狂怒」:走得更快 ----
function moloStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('摩洛克 · 祭坛上的火又烧起来了');bsfx('b_moo')}
  dmOdChk(e,'狂怒!巨斧连砍两下');
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?60:46)*dt)}
    if(e.cd>0)return;const Q=['chop','chop','charge','altar','quake'];if(ad<e.w/2+170)Q.push('chop');if(ad>260)Q.push('charge','altar');if(od)Q.push('brand','quake');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='chop'){if(T<.8){e.pz='w';if(T<.5)e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd&&T>=.85){e.hd=1;shake=.45;syn('slam');bsfx('b_axe');dmHit(e,cx-e.f*40,cx+e.f*230,GY-170,26,e.f*520);VFX.spawn('earth-rupture',cx+e.f*150,GY,{s:2.2});dmZone(Math.min(cx+e.f*40,cx+e.f*230),Math.max(cx+e.f*40,cx+e.f*230),zl,dm,6,'fire')}
    if(T>1.45){if(od&&!e.n){e.n=1;e.at=.45;e.hd=0;return}dmEnd(e)}return}
  if(a=='charge'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';e.mv=1;const ox=e.x;e.x=gpCl(e,e.x+e.f*300*dt);if(!e.rh&&ov(P,e)&&hurt(22*dm,{kb:e.f*560}))e.rh=1;
    if(T>2.2||e.x==ox&&T>.8){e.rh=0;shake=.4;bsfx('b_stomp');dmBoom(cx+e.f*e.w/2,90,dm,12,'fire');dmZone(cx-90,cx+90,zl,dm,6,'fire');dmEnd(e,.2)}return}
  if(a=='altar'){if(T<.7){e.pz='w';return}e.pz='s';const n=od?5:3,k=Math.floor((T-.7)/.4);if(e.n<=k&&k<n){e.n=k+1;dmPil(pc,dm,16,0,'fire')}if(T>.7+n*.4+.6)dmEnd(e,.3);return}
  if(a=='quake'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.5;bsfx('b_stomp');dmBoom(cx,e.w/2+40,dm,14,'rock');for(const sd of [-1,1]){dmWave(cx+sd*e.w/2,sd*240,dm,16,'rock');if(od)dmWave(cx+sd*e.w/2,sd*240,dm,16,'rock',.45)}}if(T>1.2)dmEnd(e,.1);return}
  if(a=='brand'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('boom');for(let i=0;i<7;i++)dmMet(i==0?pc:pc+rnd(-260,260),dm,14,.15*i,zl-1,'fire')}if(T>1.6)dmEnd(e,.2);return}
  dmEnd(e)}
// ---- 第五十六轮 · 阿斯莫德「魅惑」:魅惑之吻 kiss(追踪的粉色星,跳过去;中了左右颠倒)· 欲望锁链 tether(连上以后每 0.5 秒吸血回血,跑远挣断 → 她失衡 1.6 秒)·
//      爱潮 tide(贴地的粉浪,跳过去)· 心碎连舞 combo(近身三连)· 退步 step(往后翻滚拉开距离,接一个飞吻)· 心雨 rain(天上落粉星,落地留下魅惑地面:站在上面会被魅惑)·
//      二阶段「色欲之域」:每 8 秒从场地两边各飞来一个魅惑之吻,锁链吸得更多 ----
function asmoStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('阿斯莫德 · 「看着我……你还分得清左右吗?」');syn('blink')}
  dmOdChk(e,'色欲之域!两边都会飞来魅惑之吻');
  if(od){e.avT-=dt;if(e.avT<=0){e.avT=8;dmKiss(ARL+20,GY-30,150,dm,0,0);dmKiss(ARR-20,GY-30,-150,dm,0,0)}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>280){e.mv=1;e.x=gpCl(e,e.x+e.f*70*dt)}else if(ad<110){e.mv=1;e.x=gpCl(e,e.x-e.f*55*dt)}
    if(e.cd>0)return;const Q=['kiss','kiss','tether','tide','rain'];if(ad<170)Q.push('combo','step');if(od)Q.push('rain','tide');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);if(a=='tether'&&(DMT||ad>320))a='kiss';
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='kiss'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?3:1;for(let i=0;i<n;i++)dmKiss(cx+e.f*30,GY-30-i*6,e.f*(150+i*30),dm,i*.35)}if(T>1.2)dmEnd(e);return}
  if(a=='tether'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;if(ad<320){DMT={t:0,life:od?4:3,r:340,k:.5};syn('zap');tx('欲望锁链!快跑远挣断',P.x-50,P.y-40,'#f783ac')}}if(!DMT&&T>.6||T>4.6){DMT=null;dmEnd(e,.2)}return}
  if(a=='daze'){e.mv=0;if(T>1.6)dmEnd(e,.4);return}  // 锁链被挣断:站着发呆 1.6 秒(白打)
  if(a=='tide'){if(T<.9){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.3;syn('boom');dmWave(cx+e.f*30,e.f*290,dm,16,'love');if(od)dmWave(cx-e.f*30,-e.f*290,dm,16,'love')}if(T>1.6)dmEnd(e,.1);return}
  if(a=='combo'){e.pz=T<.4?'w':'s';const k=T<.45?0:T<.8?1:T<1.15?2:3;if(k>e.n&&k<=3){e.n=k;syn('swing');dmHit(e,cx-e.f*20,cx+e.f*150,GY-120,9,e.f*(k==3?420:180));VFX.spawn('x-star',cx+e.f*90,GY-50,{s:.7,life:.4,add:1})}if(T>1.4)dmEnd(e);return}
  if(a=='step'){e.pz='s';e.x=gpCl(e,e.x-e.f*360*dt);if(T>.45){e.act='kiss';e.at=.3;e.hd=0}return}
  if(a=='rain'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?10:7;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-280,280),dm,12,.13*i,zl-1.5,'love')}if(T>1.6)dmEnd(e,.2);return}
  dmEnd(e)}
// ---- 贝利亚「谎言」:真假之光 lie(地上同时亮起金光和紫光两个光圈,一阶段金光是真的、二阶段反过来紫光才是真的,真的那个 1.3 秒后落下光柱)·
//      背叛之盾 guard(举盾 2.4 秒,这时打他会被格挡并反噬一记光爆)· 战车冲锋 ride(冲到墙为止,沿路留下伪光地面)·
//      天罚 judge(往前一大片光爆 + 主角身边三根光柱)· 连斩 combo · 二阶段「谎言之王」:光圈颜色颠倒、一次三个 ----
function beliStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('贝利亚 · 「相信金色的光吧……我从不说谎」');syn('buff')}
  dmOdChk(e,'谎言之王!现在紫光才是真的');
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+70){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?66:56)*dt)}
    if(e.cd>0)return;const Q=['lie','lie','guard','ride','judge'];if(ad<e.w/2+150)Q.push('combo','guard');if(ad>260)Q.push('ride','lie');if(od)Q.push('lie','judge');let a=pick(Q);if(a==e.la&&Math.random()<.7)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='lie'){if(T<1){e.pz='w';if(!e.hd){e.hd=1;syn('blink');const n=od?3:2,r=Math.floor(Math.random()*n),xs=[pc+rnd(-30,30)];xs.push(dmCX(xs[0]+(Math.random()<.5?-1:1)*rnd(140,200)));if(n>2)xs.push(dmCX(xs[0]+(xs[1]>xs[0]?-1:1)*rnd(140,200)));
      xs.forEach((q,i)=>DML.push({x:dmCX(q),t:0,real:i==r,sh:(i==r)!=!!od,dm}))}return}e.pz='s';if(T>1.5)dmEnd(e);return}
  if(a=='guard'){e.pz=T<.3?'w':'s';if(T<.05)e.ghp=e.hp;else if(e.hp<e.ghp&&!e.cn){e.hp=e.ghp;e.cn=1;e.cnT=T;tx('格挡!',cx-14,e.y-10,'#ffe066');banner('背叛之盾!打他的人会被反噬');syn('zap')}
    if(e.cn==1&&T-e.cnT>=.25){e.cn=2;VFX.spawn('void-implosion',pc,P.y+10,{s:1.2});dmBoom(pc,od?110:85,dm,od?22:18,'holy')}if(e.cn)e.hp=Math.max(e.hp,e.ghp);
    if(T>2.4||e.cn==2&&T-e.cnT>.8){e.cn=0;dmEnd(e,.2)}return}
  if(a=='ride'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';const ox=e.x;e.x=gpCl(e,e.x+e.f*340*dt);const back=cx-e.f*e.w/2;
    if(!e.hd||Math.abs(back-e.lz)>70){e.hd=1;e.lz=back;dmZone(back-34,back+34,zl,dm,5,'holy')}if(!e.rh&&ov(P,e)&&hurt(20*dm,{kb:e.f*540}))e.rh=1;
    if(T>2.2||e.x==ox&&T>.8){e.rh=0;shake=.35;dmBoom(cx+e.f*e.w/2,80,dm,12,'holy');dmEnd(e,.2)}return}
  if(a=='judge'){if(T<.9){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.4;syn('boom');dmHit(e,cx-e.f*20,cx+e.f*260,GY-150,22,e.f*460);VFX.spawn('b-light',cx+e.f*150,GY-50,{s:2.6,life:.6,add:1});for(const [o,dl] of [[0,0],[-120,.3],[120,.3]])dmPil(pc+o,dm,14,dl,'holy')}if(T>1.9)dmEnd(e,.2);return}
  if(a=='combo'){e.pz=T<.4?'w':'s';const k=T<.45?0:T<.8?1:T<1.15?2:3;if(k>e.n&&k<=3){e.n=k;syn('swing');dmHit(e,cx-e.f*20,cx+e.f*170,GY-130,10,e.f*(k==3?440:200))}if(T>1.4)dmEnd(e);return}
  dmEnd(e)}
// ---- 阿斯塔罗特「腐息」:腐蚀吐息 breath(往前喷 1.8 秒毒雾,站在里面叠腐蚀)· 预知 fore(落点标记会预判你接下来的位置,最后 0.35 秒锁定 —— 临时变向 / 停下)·
//      横扫 sweep · 腐土震 quake(冲击波往两边推开,跳过去)· 腐蚀层数(每层受伤 +6%、每秒掉 0.3% 生命)只能在场上的净化光圈里站 0.8 秒清掉(每 10 秒出现一个)·
//      二阶段「知晓过去与未来」:预知连落三次,吐息留下腐土 ----
function astaStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('阿斯塔罗特 · 「你的下一步,我早就看见了」');bsfx('l9_roar')}
  dmOdChk(e,'知晓过去与未来!预知连落三次');
  e.ccT-=dt;if(e.ccT<=0){e.ccT=od?9:10;let q=0;for(let i=0;i<6&&(!q||Math.abs(q-cx)<200);i++)q=rnd(ARL+60,ARR-60);DMC.push({x:q,t:0,life:7})}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+50){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?44:36)*dt)}
    if(e.cd>0)return;const Q=['breath','fore','fore','sweep','quake'];if(ad<e.w/2+170)Q.push('sweep','breath');if(ad>240)Q.push('fore');if(od)Q.push('fore','quake');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='breath'){if(T<.7){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';const x0=cx+e.f*30,x1=cx+e.f*290;
    if(Math.floor(T/.12)>e.n){e.n=Math.floor(T/.12);VFX.spawn(e.n%2?'b-gas':'x-fel',x0+e.f*rnd(10,60),GY-rnd(40,90),{s:e.n%2?.9:.5,dx:e.f*rnd(150,230),life:.9,a:.85,add:e.n%2?0:1})}
    if(P.dmT<=0&&pc>Math.min(x0,x1)&&pc<Math.max(x0,x1)&&P.y+P.h>GY-120&&hurt(4*dm,{kb:0})){P.dmT=.45;dmRot(1)}
    if(od&&!e.hd&&T>1.6){e.hd=1;dmZone(Math.min(x0,x1),Math.max(x0,x1),zl,dm,4,'rot')}if(T>2.5)dmEnd(e,.2);return}
  if(a=='fore'){const n=od?3:1,k=Math.floor(T/1.25);if(k>=n){e.mk=null;dmEnd(e,.2);return}const u=T-k*1.25;e.pz=u<1.1?'w':'s';
    if(u<.75)e.mk=dmCX(pc+(P.vx||0)*(1.1-u)*1.1);  // 预判:按主角现在的速度推算 1.1 秒后的位置,最后 0.35 秒锁定
    if(u>=1.1&&e.n<=k){e.n=k+1;syn('slam');VFX.spawn('earth-rupture',e.mk,GY,{s:1.6});if(dmBoom(e.mk,64,dm,20,'rot'))dmRot(2)}return}
  if(a=='sweep'){if(T<.55){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.35;syn('slam');dmHit(e,cx-e.f*30,cx+e.f*250,GY-140,24,e.f*480);VFX.spawn('x-fel',cx+e.f*160,GY-50,{s:1.4,life:.4,add:1})}if(T>1.3)dmEnd(e);return}
  if(a=='quake'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.5;bsfx('b_stomp');if(dmBoom(cx,e.w/2+40,dm,14,'rot'))dmRot(1);for(const sd of [-1,1]){dmWave(cx+sd*e.w/2,sd*230,dm,16,'rot');if(od)dmWave(cx+sd*e.w/2,sd*230,dm,16,'rot',.5)}}if(T>1.2)dmEnd(e,.1);return}
  dmEnd(e)}
// ===== 第六十一轮:十二魔封印 7 ~ 9(二阶)—— 别西卜 belz · 玛门 mamm · 利维坦 levi =====
// 场上的东西:DMB 酸液弹(抛物线,落地留酸液地面)· DMG 蝇卵(2 秒后炸开、爬出一条蛆)· DMQ 蛆虫(朝主角爬,碰到就咬)· DMBL 飞刃(水平飞)· DMTR 陷阱(落地 1.4 秒后炸开)· DMGP 金堆(站满 0.8 秒夺回金子)
let DMB=[],DMG=[],DMQ=[],DMBL=[],DMTR=[],DMGP=[];
function dm3Clr(){DMB=[];DMG=[];DMQ=[];DMBL=[];DMTR=[];DMGP=[];dm4Clr()}
const dmHitR=(e,x0,x1,top,d,kb,dm)=>{const pc=P.x+12;return pc>Math.min(x0,x1)&&pc<Math.max(x0,x1)&&P.y+P.h>top&&hurt(d*(dm||e.dm),{kb})};
const dmFind=k=>[B,...E].find(q=>q&&q.k==k&&q.hp>0);  // 第六十二轮:暗黑炼狱里同一层可能有两个恶魔(第二个在 E 里)
const dmInv=()=>P.inv>0||(P.sk&&P.sk.inv)||DECOY||GM.god;
function dm3Step(dt,pc,onG){const e=dmFind('mamm');
  for(const b of DMB){b.t+=dt;if(b.t<0)continue;b.vy+=420*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(Math.abs(pc-b.x)<14&&P.y<b.y+10&&P.y+P.h>b.y-10&&hurt(10*b.dm,{kb:sgn(b.vx)*160})){b.dd=1;VFX.spawn('b-gas',b.x,b.y,{s:.6,life:.5})}
    else if(b.y>=GY-6){b.dd=1;syn('boom');dmZone(b.x-40,b.x+40,b.zl,b.dm,5,'acid');DMG.push({x:b.x,t:0,sp:1});if(Math.abs(pc-b.x)<40&&onG)hurt(8*b.dm,{kb:sgn(pc-b.x)*200})}}
  DMB=DMB.filter(b=>!b.dd);
  for(const g of DMG){if(g.sp){g.t+=dt;if(g.t>.6)g.dd=1;continue}g.t+=dt;if(g.t>=2&&!g.bm){g.bm=1;syn('boom');VFX.spawn('b-gas',g.x,GY-14,{s:.9,life:.6});if(Math.abs(pc-g.x)<46&&P.y+P.h>GY-60)hurt(14*g.dm,{kb:sgn(pc-g.x)*260});DMQ.push({x:g.x,t:0,dm:g.dm,f:sgn(pc-g.x)||1})}if(g.t>2.5)g.dd=1}
  DMG=DMG.filter(g=>!g.dd);
  for(const q of DMQ){q.t+=dt;q.f=sgn(pc-q.x)||q.f;q.x=dmCX(q.x+q.f*(B&&B.od?58:46)*dt);if(onG&&Math.abs(pc-q.x)<14&&hurt(9*q.dm,{kb:q.f*140})){q.dd=1;VFX.spawn('b-gas',q.x,GY-8,{s:.5,life:.4})}}
  DMQ=DMQ.filter(q=>!q.dd&&q.t<7);
  for(const b of DMBL){b.t+=dt;if(b.t<0)continue;if(b.ld){if(b.t-b.ld>.5)b.dd=1;continue}b.x+=b.v*dt;if(!b.hit&&Math.abs(pc-b.x)<22&&P.y<b.y+8&&P.y+P.h>b.y-6&&hurt(14*b.dm,{kb:sgn(b.v)*260})){b.hit=1;b.ld=b.t}if(b.x<ARL+10||b.x>ARR-10||b.t>1.6)b.ld=b.t}
  DMBL=DMBL.filter(b=>!b.dd);
  for(const r of DMTR){r.t+=dt;if(r.t<0)continue;if(r.t>=1.4&&!r.bm){r.bm=1;syn('boom');shake=Math.max(shake,.25);dmSplash(r.x,GY-14,1.6);if(Math.abs(pc-r.x)<48&&P.y+P.h>GY-90)hurt(18*r.dm,{kb:sgn(pc-r.x)*320})}if(r.t>1.9)r.dd=1}
  DMTR=DMTR.filter(r=>!r.dd);
  for(const g of DMGP){g.t+=dt;if(e&&e.k=='mamm'&&g.t>.4&&onG&&Math.abs(pc-g.x)<34){g.st=(g.st||0)+dt;if(g.st>=.8&&!g.dd){g.dd=1;mmTake(e,g)}}}DMGP=DMGP.filter(g=>!g.dd&&g.t<g.life)}
function dm3Fx(t){const F=(n,i,X,Y,h,a)=>DMN.fr(x,'fx_'+n,i,X-cam,Y,h,a);
  for(const g of DMG){if(g.sp){F('splat',g.t/.6*6,g.x,GY+6,64);continue}F('egg',g.t<2?Math.min(4,g.t/.4):5+(g.t-2)/.13,g.x,GY+2,40)}
  for(const q of DMQ){x.save();x.translate(q.x-cam,GY+2);if(q.f<0)x.scale(-1,1);DMN.fr(x,'fx_mag',Math.floor(t*8)%4,0,0,30);x.restore()}
  for(const b of DMB)if(b.t>=0)F('blob',Math.floor(t*12)%7,b.x,b.y+12,24);
  for(const b of DMBL)if(b.t>=0){x.save();x.translate(b.x-cam,b.y+10);if(b.v<0)x.scale(-1,1);DMN.fr(x,'fx_blade',b.ld?1+(b.t-b.ld)/.1:0,0,0,26);x.restore()}
  for(const r of DMTR)if(r.t>=0)F('trap',r.t<.3?1+r.t/.1:r.t<1.4?3:4+(r.t-1.4)/.1,r.x,GY+4,28,r.t<1.4&&r.t>.9?.6+.4*Math.sin(t*30):1);
  for(const g of DMGP){const sx=g.x-cam,a=Math.min(1,g.t/.4,(g.life-g.t)/.5);VFX.frame(x,'mc-gold',0,sx,GY-4,.46,1,0,a*.9,.3);VFX.frame(x,'b-light',Math.floor(t*12)%vfn('b-light'),sx,GY-22,.7,1,0,a*.7);if(g.st)CT(Math.round(g.st/.8*100)+'%',sx,GY-60,8,'#ffe066','center',2,'#2a2008')}
  let e=dmFind('mamm');if(e&&e.gd)CT('💰×'+e.gd,e.x+e.w/2-cam,e.y-8,9,'#ffd43b','center',2.2,'#3a2208');
  e=dmFind('belz');if(e&&e.act=='devour'){const cx=e.x+e.w/2-cam;VFX.frame(x,'x-vortex',Math.floor(t*16)%16,cx+e.f*20,e.y+e.h*.45,e.at<1.2?.5+e.at*.3:.95,1,0,.85)}}
// ---- 别西卜「暴食」:斩风连击 slash · 酸液 spit(抛出酸液弹,落地留酸液地面)· 蝇卵 egg(主角周围产卵,2 秒后炸开爬出蛆)· 瞬袭 blink(消失后出现在主角背后斩击)· 冲刺 dash ·
//      暴食 devour(每 12 秒,张开大嘴 1.2 秒后把主角往身边吸 1.5 秒,最后一口咬下:离他 100 以内受重伤,他回复 3% 生命;场上的蛆被吃掉,每条再回 1%)·
//      二阶段「暴食之宴」:蝇卵和酸液翻倍,每 8 秒暴食一次 ----
function belzStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od;e.pz=null;
  if(!e.intro){e.intro=1;banner('别西卜 · 「饿……好饿……把你的名字也给我吃掉」');bsfx('l9_roar');e.dvT=8}
  dmOdChk(e,'暴食之宴!蝇卵和酸液翻倍');
  e.dvT-=dt;
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?78:66)*dt)}
    if(e.dvT<=0){e.dvT=od?8:12;e.act='devour';e.la='devour';e.at=0;e.hd=0;e.n=0;return}
    if(e.cd>0)return;const Q=['spit','spit','egg','blink','slash'];if(ad<e.w/2+150)Q.push('slash','slash');if(ad>260)Q.push('dash','spit');if(od)Q.push('egg','blink');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='slash'){e.pz=T<.4?'w':'s';const k=T<.45?0:T<.8?1:T<1.1?2:3;if(k>e.n&&k<=3){e.n=k;syn('swing');dmHit(e,cx-e.f*20,cx+e.f*170,GY-130,10,e.f*(k==3?420:180));VFX.spawn('x-fel',cx+e.f*100,GY-50,{s:.8,life:.35,add:1})}if(T>1.35)dmEnd(e);return}
  if(a=='spit'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?5:3;for(let i=0;i<n;i++){const tx_=dmCX(pc+(i-(n-1)/2)*rnd(60,90)),fl=.9+i*.08,vx=(tx_-cx)/fl,y0=e.y+e.h*.4;DMB.push({x:cx+e.f*20,y:y0,vx,vy:(GY-6-y0-210*fl*fl)/fl,t:-i*.08,dm,zl:od?4:3})}}if(T>1.1)dmEnd(e,.1);return}
  if(a=='egg'){if(T<.6){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('blink');const n=od?4:2;for(let i=0;i<n;i++){let q=pc+(i%2?1:-1)*rnd(50,150)*(1+Math.floor(i/2)*.8);DMG.push({x:dmCX(q),t:-i*.15,dm})}}if(T>1.1)dmEnd(e,.2);return}
  if(a=='blink'){e.pz=T<.5?'w':'s';if(T>=.55&&!e.hd){e.hd=1;const nx=dmCX(pc-(P.f||1)*90);e.x=gpCl(e,nx-e.w/2);e.f=sgn(pc-(e.x+e.w/2))||1;VFX.spawn('b-darkhit',nx,GY-40,{s:1.2,life:.4});syn('blink')}
    if(T>=.9&&e.n<1){e.n=1;syn('swing');const c2=e.x+e.w/2;dmHit(e,c2-e.f*20,c2+e.f*150,GY-130,18,e.f*380)}if(T>1.25)dmEnd(e,.2);return}
  if(a=='dash'){if(T<.35){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';const ox=e.x;e.x=gpCl(e,e.x+e.f*360*dt);if(!e.rh&&ov(P,e)&&hurt(14*dm,{kb:e.f*420}))e.rh=1;if(T>.9||e.x==ox&&T>.5){e.rh=0;dmEnd(e)}return}
  if(a=='devour'){e.mv=0;if(T<1.2){e.pz='w';if(!e.hd){e.hd=1;banner('暴食!别西卜张开了大嘴 —— 快跑远!');syn('zap')}return}e.pz='s';
    if(T<2.7){if(!dmInv()&&ad<380&&ad>30)P.x+=sgn(cx-pc)*(od?175:150)*dt;if(Math.random()<dt*20)VFX.spawn('b-gas',pc+sgn(cx-pc)*-10,P.y+20,{s:.4,dx:sgn(cx-pc)*200,life:.4});return}
    if(!e.n){e.n=1;syn('boom');shake=.45;VFX.spawn('b-darkhit',cx+e.f*40,GY-40,{s:2,life:.5});let h=0;if(ad<100&&hurt(30*dm,{kb:sgn(dx)*300}))h+=.03;for(const q of DMQ)if(Math.abs(q.x-cx)<220){q.dd=1;h+=.01}
      if(h){const v=Math.round(e.max*h);e.hp=Math.min(e.max,e.hp+v);tx('暴食 +'+v,cx-20,e.y-14,'#c0eb75')}}if(T>3.2)dmEnd(e,.3);return}
  dmEnd(e)}
// ---- 玛门「贪婪」:锤击 swing · 砸地 smash(冲击 + 落下金币)· 金晶爆 burst(身前一团金矿)· 黄金尖峰 ramp(身前 300 像素的金色尖刺)· 跃击 leap · 金币雨 rain ·
//      贪婪:每打中你一次,他回复 1.5% 生命并叠一层贪婪(每层伤害 +6%,最多 5 层);场上每 11 秒冒出一堆金子,站在上面 0.8 秒「夺回金子」:清空贪婪并让他发呆 1.6 秒 ·
//      二阶段「黄金之国」:尖峰后面留下金色地面,跃击落地往两边推冲击波 ----
function mmGreed(e){if(!e||e.k!='mamm')return;e.gd=Math.min(5,(e.gd||0)+1);const v=Math.round(e.max*.015);e.hp=Math.min(e.max,e.hp+v);tx('贪婪 +'+v,e.x+e.w/2-20,e.y-22,'#ffd43b')}
function mmTake(e,g){const n=e.gd||0;e.gd=0;VFX.spawn('radiant-heal',g.x,GY-30,{s:1.2,life:.8,add:1});sfx('coin');tx('💰 夺回金子!',P.x-24,P.y-30,'#ffe066');if(!e.act||e.act!='leap'){e.act='daze';e.at=0;e.pz=null;e.mv=0}banner(n?'玛门的贪婪被清空了!他愣住了':'玛门愣住了!')}
function mammStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),od=e.od,dm=e.dm*(1+.06*(e.gd||0)),zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('玛门 · 「地上的金子都是我挖的……你身上的,也是我的」');bsfx('l9_roar');e.gpT=6}
  dmOdChk(e,'黄金之国!尖峰会留下金色地面');
  e.gpT-=dt;if(e.gpT<=0){e.gpT=od?9:11;let q=0;for(let i=0;i<6&&(!q||Math.abs(q-cx)<220);i++)q=rnd(ARL+60,ARR-60);DMGP.push({x:q,t:0,life:7})}
  const H=(x0,x1,top,d,kb)=>{if(dmHitR(e,x0,x1,top,d,kb,dm))mmGreed(e)};
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+50){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?60:50)*dt)}
    if(e.cd>0)return;const Q=['swing','smash','burst','ramp','rain'];if(ad<e.w/2+160)Q.push('swing','burst');if(ad>260)Q.push('leap','ramp');if(od)Q.push('ramp','leap');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tx=pc;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='daze'){e.mv=0;if(T>1.6)dmEnd(e,.4);return}
  if(a=='swing'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('swing');H(cx-e.f*20,cx+e.f*150,GY-130,16,e.f*380)}if(T>.95)dmEnd(e);return}
  if(a=='smash'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.4;bsfx('b_stomp');if(dmBoom(cx+e.f*60,80,dm,16,'gold'))mmGreed(e);for(let i=0;i<(od?5:3);i++)dmMet(pc+rnd(-160,160),dm,12,.2+i*.15,0,'gold')}if(T>1.1)dmEnd(e,.1);return}
  if(a=='burst'){if(T<.55){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.35;syn('slam');H(cx+e.f*50,cx+e.f*230,GY-110,20,e.f*420)}if(T>1.25)dmEnd(e);return}
  if(a=='ramp'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.5;syn('boom');H(cx+e.f*20,cx+e.f*310,GY-120,24,e.f*460);if(od)dmZone(Math.min(cx+e.f*40,cx+e.f*300),Math.max(cx+e.f*40,cx+e.f*300),zl,dm,5,'gold')}if(T>1.45)dmEnd(e,.2);return}
  if(a=='leap'){e.pz=T<.3?'w':'s';if(T>=.3&&T<.9){const tx_=dmCX(e.tx);e.x=gpCl(e,e.x+(tx_-cx)*Math.min(1,dt*5));e.y=e.gy-Math.sin((T-.3)/.6*Math.PI)*90}
    if(T>=.9&&!e.hd){e.hd=1;e.y=e.gy;shake=.55;bsfx('b_stomp');if(dmBoom(e.x+e.w/2,90,dm,22,'gold'))mmGreed(e);if(od)for(const sd of [-1,1])dmWave(e.x+e.w/2+sd*e.w/2,sd*260,dm,14,'gold')}if(T>1.35){e.y=e.gy;dmEnd(e,.2)}return}
  if(a=='rain'){if(T<.6){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;sfx('coin');const n=od?9:6;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-260,260),dm,13,.12*i,od?3:0,'gold')}if(T>1.4)dmEnd(e,.2);return}
  dmEnd(e)}
// ---- 利维坦「嫉妒」:逆鳞 —— 鳞甲刀剑难入,正面受到的伤害只有 35%,打它背后 ×1.5;它转身很慢(你绕到背后 0.9 秒后才转过来)·
//      连斩 combo · 月牙斩 arc · 飞刃 blade(水平飞,跳过去)· 潮雷 trap(主角身边落下陷阱,1.4 秒后炸开)· 翻滚 roll(滚到你身后)· 深渊 abyss(1 秒蓄力后身边一大圈触手)·
//      二阶段「嫉妒之潮」:每 10 秒海水漫上你所在的半边场地,转身更快 ----
const levK=e=>{if(!(e.hp>0))return 1;const b=sgn(P.x+12-(e.x+e.w/2))!=e.f;e.scT=(e.scT||0);if(GT-e.scT>.8){e.scT=GT;tx(b?'逆鳞!×1.5':'鳞甲 -65%',e.x+e.w/2-24,e.y-10,b?'#ffe066':'#74c0fc')}return b?1.5:.35};
function leviStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od;e.pz=null;e.dmK=levK;
  if(!e.intro){e.intro=1;banner('利维坦 · 鳞甲刀剑难入 —— 绕到它身后!');bsfx('l9_roar');e.tdT=6}
  dmOdChk(e,'嫉妒之潮!海水会漫上你所在的半边');
  if(od){e.tdT-=dt;if(e.tdT<=0&&e.tdW==null){e.tdW=.9;e.tdS=pc<(ARL+ARR)/2?-1:1;banner('海水要漫上来了!');syn('zap')}if(e.tdW!=null){e.tdW-=dt;if(e.tdW<=0){e.tdW=null;e.tdT=10;const m=(ARL+ARR)/2;e.tdS<0?dmZone(ARL,m,3,dm,6,'sea'):dmZone(m,ARR,3,dm,6,'sea')}}}
  const bh=sgn(dx)!=e.f;e.tT=bh?(e.tT||0)+dt:0;
  if(!e.act){e.cd-=dt;e.mv=0;if(bh&&e.tT>=(od?.55:.9)){e.f=sgn(dx)||e.f;e.tT=0}if(!bh&&ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?64:54)*dt)}
    if(e.cd>0)return;const Q=['combo','arc','blade','trap','abyss'];if(ad<e.w/2+150&&!bh)Q.push('combo','arc');if(ad>260)Q.push('blade','trap');if(bh)Q.push('roll','abyss');if(od)Q.push('trap','abyss');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='combo'){e.pz=T<.3?'w':'s';const k=T<.35?0:T<.95?1:2;if(k>e.n){e.n=k;syn('swing');dmHit(e,cx-e.f*20,cx+e.f*150,GY-130,k==2?16:12,e.f*(k==2?400:200))}if(T>1.3)dmEnd(e);return}
  if(a=='arc'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.35;syn('slam');dmHit(e,cx-e.f*40,cx+e.f*230,GY-160,22,e.f*460);if(od)dmWave(cx+e.f*60,e.f*300,dm,14,'sea')}if(T>1.2)dmEnd(e);return}
  if(a=='blade'){if(T<.45){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');DMBL.push({x:cx+e.f*30,y:GY-30,v:e.f*340,t:0,dm});if(od)DMBL.push({x:cx+e.f*30,y:GY-30,v:e.f*340,t:-.45,dm})}if(T>.9)dmEnd(e,.1);return}
  if(a=='trap'){if(T<.45){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?3:2;for(let i=0;i<n;i++)DMTR.push({x:dmCX(i==0?pc:pc+(i%2?1:-1)*rnd(70,130)),t:-i*.2,dm})}if(T>.85)dmEnd(e,.2);return}
  if(a=='roll'){e.pz='s';const ox=e.x;e.x=gpCl(e,e.x+sgn(dx||e.f)*380*dt);if(T>.6||e.x==ox){dmEnd(e,.1)}return}  // 滚过去以后还面朝原来的方向(背后又露出来)
  if(a=='abyss'){if(T<1){e.pz='w';if(!e.hd){e.hd=1;tx('深渊!',cx-14,e.y-20,'#74c0fc');syn('zap')}return}e.pz='s';if(!e.n){e.n=1;shake=.55;syn('boom');dmHit(e,cx-200,cx+200,GY-150,24,sgn(dx)*480);for(const q of [-140,-70,70,140])dmSplash(cx+q,GY-20,1.4);if(od)for(const sd of [-1,1])dmWave(cx+sd*e.w/2,sd*260,dm,14,'sea')}if(T>1.75)dmEnd(e,.2);return}
  dmEnd(e)}
// ===== 第六十二轮:十二魔封印 10 ~ 12(二阶)—— 贝尔芬格 belp · 阿撒兹勒 azaz · 路西法 luci =====
// 场上的东西:DMAR 箭(水平飞)· DMRN 箭雨(落点先闪 0.8 秒,再扎一下)· DMOR 晨星法球(慢慢追主角,碰到 / 落地 / 2.6 秒后炸开)
// 怠惰 P.slp:最多 5 层,2 层起减速;叠满 5 层睡着 1.6 秒(P.stun);3 秒没再叠就掉一层
let DMAR=[],DMRN=[],DMOR=[];
function dm4Clr(){DMAR=[];DMRN=[];DMOR=[]}
function dmSlp(n){if(GM.god)return;P.slp=Math.min(5,(P.slp||0)+n);P.slpT=3;if(P.slp>=5){P.slp=0;P.stun=Math.max(P.stun||0,1.6);P.sk=null;tx('💤 睡着了……',P.x-20,P.y-30,'#d0bfff');syn('zap')}}
function dm4Step(dt,pc,onG){
  if(P.slp>0){P.slpT=(P.slpT||0)-dt;if(P.slpT<=0){P.slp--;P.slpT=3}if(P.slp>=2)P.slw=Math.max(P.slw||0,.1)}
  for(const a of DMAR){a.t+=dt;if(a.t<0)continue;if(a.ld){if(a.t-a.ld>.4)a.dd=1;continue}a.x+=a.v*dt;
    if(Math.abs(pc-a.x)<16&&P.y<a.y+6&&P.y+P.h>a.y-6&&hurt(a.d*a.dm,{kb:sgn(a.v)*160})){a.ld=a.t;dmSlp(1)}else if(a.x<ARL+6||a.x>ARR-6||a.t>2.2)a.ld=a.t}
  DMAR=DMAR.filter(a=>!a.dd);
  for(const s of DMRN){s.t+=dt;if(s.t>=.8&&!s.sn){s.sn=1;syn('swing')}if(s.t>=.8&&s.t<1.3&&!s.hit&&Math.abs(pc-s.x)<55&&hurt(s.d*s.dm,{kb:0})){s.hit=1;dmSlp(s.sl||1)}}
  DMRN=DMRN.filter(s=>s.t<1.6);
  const ty=P.y+P.h/2;
  for(const o of DMOR){o.t+=dt;if(o.t<0)continue;if(o.bx!=null){if(o.t-o.bx>.45)o.dd=1;continue}
    o.vx+=sgn(pc-o.x)*o.hm*dt;o.vy+=sgn(ty-o.y)*o.hm*dt;const sp=Math.hypot(o.vx,o.vy);if(sp>o.sp){o.vx*=o.sp/sp;o.vy*=o.sp/sp}o.x+=o.vx*dt;o.y+=o.vy*dt;
    if(Math.abs(pc-o.x)<16&&Math.abs(ty-o.y)<22){o.bx=o.t;syn('boom');hurt(o.d*o.dm,{kb:sgn(o.vx)*240})}
    else if(o.y>=GY-6||o.t>2.6||o.x<ARL||o.x>ARR){o.bx=o.t;syn('boom');if(Math.abs(pc-o.x)<40&&Math.abs(ty-o.y)<40)hurt(o.d*.6*o.dm,{kb:sgn(pc-o.x)*200})}}
  DMOR=DMOR.filter(o=>!o.dd)}
function dm4Fx(t){
  for(const a of DMAR)if(a.t>=0){x.save();x.translate(a.x-cam,a.y+3);if(a.v<0)x.scale(-1,1);if(a.ld)DMN.fr(x,'fx_arwh',(a.t-a.ld)/.4*6,0,0,24);else DMN.fr(x,'fx_arw',0,0,0,6);x.restore()}
  for(const s of DMRN){const sx=s.x-cam;if(s.t<.9)VFX.frame(x,'x-vortex',Math.floor(t*16)%16,sx,GY-14,.6,1,0,s.t>.5?.6+.4*Math.sin(t*30):.6);if(s.t>=.45)DMN.fr(x,'fx_shower',(s.t-.45)/1.15*9,sx,GY+4,190)}
  for(const o of DMOR)if(o.t>=0){if(o.bx!=null){DMN.fr(x,'fx_orbx',(o.t-o.bx)/.45*7,o.x-cam,o.y+28,56);continue}x.save();x.translate(o.x-cam,o.y);x.rotate(Math.atan2(o.vy,o.vx));DMN.fr(x,'fx_orb',Math.floor(t*12)%4,0,11,22);x.restore()}
  let e=dmFind('belp');if(e){const cx=e.x+e.w/2-cam;if(e.act=='nap')CT('Zzz…',cx+12,e.y-4-6*Math.sin(t*2),10,'#d0bfff','center',2.4,'#1a1030');
    if(e.act=='beam'&&e.at>=.55&&e.at<.9){x.save();x.translate(cx+e.f*290,e.y+e.h*.47);if(e.f<0)x.scale(-1,1);DMN.fr(x,'fx_beam',(e.at-.55)/.35*5,256,15,30);x.restore()}}
  e=dmFind('azaz');if(e&&e.qf)CT('🔥×'+e.qf,e.x+e.w/2-cam,e.y-8,9,'#ff922b','center',2.2,'#2a1006');
  e=dmFind('luci');if(e){const cx=e.x+e.w/2-cam;if(e.kn>0){CT('跪下!'+Math.ceil(e.kn),P.x+12-cam,P.y-40,12,'#e599f7','center',2.6,'#200830');VFX.frame(x,'b-darkhit',Math.floor(t*12)%6,P.x+12-cam,P.y-6,.45,1,0,.7)}
    if(e.exT>0)CT('破绽 ×1.6',cx,e.y-10,9,'#ffe066','center',2.2,'#2a2008');if(e.pd)CT('👑×'+e.pd,cx,e.y-22,8,'#e599f7','center',2,'#200830');
    if(e.sfX!=null){const sx=e.sfX-cam;x.fillStyle='rgba(255,244,214,'+Math.max(0,(3-e.sfT)/3*.2)+')';x.fillRect(0,0,VW,VH);VFX.frame(x,'mc-gold',0,sx,GY-4,.5,1,0,.9,.32);VFX.frame(x,'radiant-heal',Math.floor(t*12)%14,sx,GY-30,.85,1,0,.8);CT(Math.ceil(e.sfT)+'',sx,GY-62,11,'#ffe066','center',2.4,'#2a2008')}}
  if(P.slp>0)CT('💤×'+P.slp,P.x+12-cam,P.y-12,8,'#d0bfff','center',2,'#1a1030')}
// ---- 贝尔芬格「怠惰」:射箭 shot · 三连箭 volley(低 / 高 / 低,跳过低的、站着让过高的)· 箭雨 rain(主角脚下)· 催眠光束 beam(身前一长条,中了叠 2 层怠惰)·
//      荆棘 thorn(身边长出荆棘,留下催眠泡泡地面)· 滑步 slide(拉开距离)·
//      打瞌睡 nap(每 13 秒,4 秒里每秒回 1.5% 生命,受到的伤害 ×1.5;这 4 秒里被打掉 4% 生命就被吵醒,马上放光束)·
//      二阶段「永眠之歌」:每 9 秒往两边推出催眠波(中了叠 2 层),箭雨三处,光束叠 3 层,打瞌睡回得更多 ----
const belpK=e=>e.act=='nap'?1.5:1;
function belpStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od;e.pz=null;e.dmK=belpK;
  if(!e.intro){e.intro=1;banner('贝尔芬格 · 「好困……陪我一起睡吧,永远地」');bsfx('l9_roar');e.npT=10;e.wvT=9}
  dmOdChk(e,'永眠之歌!催眠波会往两边推开');
  if(e.act!='nap'){e.npT-=dt;if(od){e.wvT-=dt;if(e.wvT<=0){e.wvT=9;syn('zap');for(const sd of [-1,1])dmWave(cx+sd*e.w/2,sd*230,dm,12,'sleep')}}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>420){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?66:56)*dt)}
    if(e.npT<=0&&e.cd<=0){e.npT=od?11:13;e.act='nap';e.la='nap';e.at=0;e.hd=0;e.n=0;e.npH=e.hp;banner('贝尔芬格打起了瞌睡……趁现在狠狠打她!');return}
    if(e.cd>0)return;const Q=['shot','shot','volley','rain','beam'];if(ad<150)Q.push('slide','thorn','thorn');if(ad>280)Q.push('shot','rain');if(od)Q.push('rain','beam');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;if(a=='slide')e.f=-sgn(dx)||-e.f;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='nap'){e.mv=0;const hv=e.max*(od?.025:.015)*dt;e.hp=Math.min(e.max,e.hp+hv);e.npH+=hv;e.nhA=(e.nhA||0)+hv;if(e.nhA>e.max*.01){tx('+'+Math.round(e.nhA),cx-14,e.y-14,'#b197fc');e.nhA=0}
    if(e.npH-e.hp>=e.max*.04){e.act='wake';e.at=0;shake=.3;banner('贝尔芬格被吵醒了!她很生气……');return}if(T>4)dmEnd(e,.2);return}
  if(a=='wake'){if(T<.5){e.pz='w';return}e.act='beam';e.at=.3;e.hd=0;e.n=0;e.f=sgn(dx)||e.f;return}
  if(a=='shot'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');DMAR.push({x:cx+e.f*30,y:GY-34,v:e.f*400,t:0,dm,d:12});if(od)DMAR.push({x:cx+e.f*30,y:GY-34,v:e.f*400,t:-.25,dm,d:12})}if(T>.95)dmEnd(e);return}
  if(a=='volley'){if(T<.4){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');for(const [y,d] of [[GY-22,0],[GY-84,.24],[GY-22,.48]])DMAR.push({x:cx+e.f*30,y,v:e.f*380,t:-d,dm,d:11})}if(T>.9)dmEnd(e,.1);return}
  if(a=='rain'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('swing');const n=od?3:1;for(let i=0;i<n;i++)DMRN.push({x:dmCX(i==0?pc:pc+(i%2?1:-1)*rnd(110,170)),t:-i*.15,dm,d:16,sl:1})}if(T>1.3)dmEnd(e,.1);return}
  if(a=='beam'){if(T<.55){e.pz='w';if(T<.3)e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.3;syn('zap')}
    if(T<.9&&!e.n&&dmHitR(e,cx+e.f*20,cx+e.f*560,GY-80,20,e.f*300)){e.n=1;dmSlp(od?3:2)}if(T>1.8)dmEnd(e,.2);return}
  if(a=='thorn'){e.pz=T<.35?'w':'s';if(T>=.4&&!e.hd){e.hd=1;syn('slam');shake=.3;if(dmHitR(e,cx-110,cx+110,GY-150,16,sgn(dx)*360))dmSlp(1);dmZone(cx-130,cx+130,od?4:3,dm,5,'sleep')}if(T>1.2)dmEnd(e,.1);return}
  if(a=='slide'){e.pz='s';const ox=e.x;e.x=gpCl(e,e.x+e.f*340*dt);if(T>.6||e.x==ox&&T>.15){e.f=sgn(dx)||e.f;dmEnd(e,-.4)}return}
  dmEnd(e)}
// ---- 阿撒兹勒「锻造」:直拳 jab · 连拳 combo · 崩拳 blast(两段,第二段打得远)· 岩刺 spike(往前一路冒出岩刺,二阶段再在你身边喷炉火柱)· 落石 boulder ·
//      淬火 forge(每 12 秒静坐 2.5 秒:这期间被打掉 4% 生命就被打断、发呆 1.6 秒;没打断 → 淬火 +1 层,每层伤害 +15%,身边留下炉火)·
//      铁壁 guard(1.3 秒,受到的伤害只有 20%;被打中就马上反击 counter)· 二阶段「荒野之链」:每 9 秒满场落巨石,淬火最多 5 层 ----
const azazK=e=>{if(e.act=='guard'&&e.at>.15){e.ctr=1;return .2}return 1};
function azazStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),od=e.od,dm=e.dm*(1+.15*(e.qf||0));e.pz=null;e.dmK=azazK;
  if(!e.intro){e.intro=1;banner('阿撒兹勒 · 「这双拳头,打出过人类的第一把剑」');bsfx('l9_roar');e.fgT=9;e.bdT=9}
  dmOdChk(e,'荒野之链!巨石会满场落下');
  if(e.act!='forge')e.fgT-=dt;
  if(od){e.bdT-=dt;if(e.bdT<=0){e.bdT=9;banner('巨石要落下来了!');for(let i=0;i<6;i++)dmMet(dmCX(ARL+60+i*(ARR-ARL-120)/5+rnd(-30,30)),dm,18,.25*i,0,'rock')}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+50){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?84:72)*dt)}
    if(e.fgT<=0&&e.cd<=0&&(e.qf||0)<(od?5:3)){e.fgT=od?10:12;e.act='forge';e.la='forge';e.at=0;e.hd=0;e.n=0;e.fgH=e.hp;banner('阿撒兹勒开始淬火!快打断他!');return}
    if(e.cd>0)return;const Q=['jab','combo','blast','spike','boulder','guard'];if(ad<e.w/2+120)Q.push('jab','combo','blast');if(ad>240)Q.push('spike','boulder');if(od)Q.push('spike','guard');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.ctr=0;if(a=='guard')tx('铁壁!',cx-12,e.y-20,'#adb5bd');return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='daze'){e.mv=0;if(T>1.6)dmEnd(e,.3);return}
  if(a=='forge'){e.mv=0;if(Math.random()<dt*6)VFX.spawn('b-flame',cx+rnd(-30,30),GY-10,{s:.7,life:.5});
    if(e.fgH-e.hp>=e.max*.04){e.act='daze';e.at=0;e.pz=null;shake=.3;syn('boom');banner('淬火被打断了!阿撒兹勒愣住了');return}
    if(T>2.5){e.qf=Math.min(od?5:3,(e.qf||0)+1);flash('255,140,40',.25);syn('boom');banner('淬火完成!阿撒兹勒的拳头更烫了(第 '+e.qf+' 层)');dmZone(cx-120,cx+120,4,dm,6,'fire');dmEnd(e,.2)}return}
  if(a=='jab'){if(T<.3){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('swing');dmHitR(e,cx-e.f*10,cx+e.f*130,GY-120,14,e.f*300,dm)}if(T>.55)dmEnd(e,-.2);return}
  if(a=='combo'){e.pz=T<.2?'w':'s';const k=T<.25?0:T<.5?1:2;if(k>e.n){e.n=k;syn('swing');dmHitR(e,cx-e.f*10,cx+e.f*140,GY-120,k==2?14:10,e.f*(k==2?380:160),dm)}if(T>.75)dmEnd(e);return}
  if(a=='blast'){if(T<.4){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';const k=T<.45?0:T<.9?1:2;if(k>e.n){e.n=k;syn('slam');shake=.3;dmHitR(e,cx-e.f*10,cx+e.f*(k==2?230:150),GY-130,k==2?20:14,e.f*(k==2?480:200),dm);VFX.spawn('earth-rupture',cx+e.f*(k==2?150:90),GY,{s:1.2})}if(T>1.4)dmEnd(e,.1);return}
  if(a=='spike'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(e.n<4&&T>=.45+e.n*.15){const px=cx+e.f*(50+e.n*50);e.n++;syn('slam');shake=.2;dmHitR(e,px-34,px+34,GY-140,16,e.f*200,dm)}
    if(od&&T>1.2&&!e.hd){e.hd=1;for(let i=0;i<3;i++)dmPil(pc+(i-1)*80,dm,14,i*.15,'fire')}if(T>1.6)dmEnd(e,.1);return}
  if(a=='boulder'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.3;syn('boom');const n=od?7:5;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-240,240),dm,15,.12*i,0,'rock')}if(T>.9)dmEnd(e,.2);return}
  if(a=='guard'){e.mv=0;if(e.ctr&&T>.2){e.act='counter';e.at=0;e.n=0;e.f=sgn(dx)||e.f;tx('铁壁反击!',cx-24,e.y-20,'#ff922b');syn('zap');return}if(T>1.3)dmEnd(e);return}
  if(a=='counter'){if(T<.25){e.pz='w';return}e.pz='s';if(!e.n){e.n=1;shake=.45;syn('slam');dmHitR(e,cx-e.f*20,cx+e.f*220,GY-140,26,e.f*520,dm);VFX.spawn('earth-rupture',cx+e.f*130,GY,{s:1.8})}if(T>.9)dmEnd(e,.2);return}
  dmEnd(e)}
// ---- 路西法「傲慢」:晨星法球 orb(会慢慢追人)· 星落 star · 光柱 pillar(主角身边依次升起五道)· 瞬移 blink(淡出,出现在主角背后接一发法球)·
//      傲慢 pride(每 16 秒命令「跪下!」:之后 3 秒里打他不掉血,每打一下他回 3% 生命并叠一层傲慢(伤害 +8%,最多 5 层,宠物的攻击不算);
//        3 秒里一下都没打 → 他愣住 1.5 秒,接下来 5 秒受到的伤害 ×1.6)·
//      二阶段「堕天 · 晨星坠落」:每 14 秒场上亮起一个光圈,3 秒后整个场地被晨星砸中,只有站在光圈里安全;「跪下」变成每 12 秒 ----
const luciK=e=>{if(e.kn>0){if(PETX)return 0;e.pv=1;if(GT-(e.pkT||0)>.4){e.pkT=GT;e.pd=Math.min(5,(e.pd||0)+1);const v=Math.round(e.max*.03);e.hp=Math.min(e.max,e.hp+v);tx('傲慢 +'+v+'(×'+e.pd+')',e.x+e.w/2-30,e.y-24,'#e599f7')}return 0}return e.exT>0?1.6:1};
function luciStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),od=e.od,dm=e.dm*(1+.08*(e.pd||0));e.pz=null;e.dmK=luciK;
  if(!e.intro){e.intro=1;banner('路西法 · 「最后一根柱子……你也配走到这里?」');bsfx('l9_roar');e.pdT=10;e.msT=8}
  dmOdChk(e,'堕天 · 晨星坠落!只有光圈里是安全的');
  if(e.exT>0)e.exT-=dt;
  if(e.kn>0){e.kn-=dt;if(e.kn<=0){e.kn=0;if(!e.pv){e.act='daze';e.at=0;e.pz=null;e.mv=0;e.fa=null;e.exT=5;flash('255,240,200',.25);banner('你忍住了!路西法的傲慢露出了破绽(5 秒内伤害 ×1.6)')}else banner('路西法更傲慢了……')}}
  else if(e.act!='pride')e.pdT-=dt;
  if(od){if(e.sfX==null){e.msT-=dt;if(e.msT<=0){e.msT=14;e.sfX=dmCX(rnd(ARL+80,ARR-80));e.sfT=3;banner('晨星要坠落了!快站进光圈!');syn('zap')}}
    else{e.sfT-=dt;if(e.sfT<=0){const sx=e.sfX;e.sfX=null;flash('255,250,220',.5);shake=.7;syn('boom');for(let i=0;i<8;i++)VFX.spawn('b-light',ARL+60+i*(ARR-ARL-120)/7,GY-40,{s:1.6,life:.7,add:1});if(Math.abs(pc-sx)>54)hurt(36*dm,{kb:sgn(pc-sx)*300})}}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>300){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?70:58)*dt)}
    if(e.pdT<=0&&e.cd<=0){e.pdT=od?12:16;e.act='pride';e.la='pride';e.at=0;e.hd=0;e.n=0;return}
    if(e.cd>0)return;const Q=['orb','orb','star','pillar','blink'];if(ad<130)Q.push('blink','pillar');if(ad>260)Q.push('orb','star');if(od)Q.push('orb','pillar');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.fa=null;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='daze'){e.mv=0;if(T>1.5)dmEnd(e,.2);return}
  if(a=='pride'){e.mv=0;if(T<.7){e.pz='w';return}if(!e.hd){e.hd=1;e.kn=3;e.pv=0;flash('200,120,255',.3);shake=.3;syn('boom');banner('路西法:「跪下!」—— 3 秒内不要攻击他!')}if(T>1.2)dmEnd(e,.4);return}
  if(a=='orb'){if(T<.8){e.pz='w';if(T<.5)e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?5:3;for(let i=0;i<n;i++){const an=(i-(n-1)/2)*.35;DMOR.push({x:cx+e.f*30,y:e.y+e.h*.35,vx:e.f*Math.cos(an)*200,vy:Math.sin(an)*200,t:-i*.06,sp:od?230:200,hm:od?260:200,dm,d:14})}}if(T>1.3)dmEnd(e,.1);return}
  if(a=='star'){if(T<.8){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.25;syn('boom');const n=od?10:7;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-280,280),dm,14,.12*i,0,'holy')}if(T>1.3)dmEnd(e,.2);return}
  if(a=='pillar'){if(T<.7){e.pz='w';return}e.pz='s';const k=Math.floor((T-.7)/(od?.18:.25));if(e.n<=k&&k<5){e.n=k+1;dmPil(pc+[0,-80,80,-160,160][k],dm,15,0,'holy')}if(T>(od?1.7:2))dmEnd(e,.3);return}
  if(a=='blink'){e.mv=0;if(T<.35){e.fa=1-T/.35;return}if(!e.hd){e.hd=1;const nx=dmCX(pc-(P.f||1)*110);e.x=gpCl(e,nx-e.w/2);e.f=sgn(pc-(e.x+e.w/2))||1;VFX.spawn('b-light',nx,GY-40,{s:1.2,life:.4,add:1});syn('blink')}
    if(T<.7){e.fa=(T-.35)/.35;return}e.fa=null;e.act='orb';e.at=.55;e.hd=0;return}
  dmEnd(e)}
const DMST={baal:baalStep,dagon:dagStep,molo:moloStep,asmo:asmoStep,beli:beliStep,asta:astaStep,belz:belzStep,mamm:mammStep,levi:leviStep,belp:belpStep,azaz:azazStep,luci:luciStep,pfg:pfgStep};  // pfg = 神秘副本 5 擎天魔神(第五十九轮,update 的敌人循环按这张表找招式函数)
// 首领倒下:诅咒之力(必掉 1 个,再按掉落率多掉 1 个)
function dmDrop(e){const id='cz'+dmI();if(!MISC[id])return;gdDrop(e,{k:'gc',id,n:1});if(Math.random()<.3*STK().dr*DBLK())gdDrop(e,{k:'gc',id,n:1})}

// ===== 诅咒之力:诅咒装备(用户:增益相当于精良强化石 +12;每次诅咒随机一种属性;前 6 个恶魔一阶,后 6 个二阶 = 一阶 ×1.5;每个恶魔只能诅咒自己对应的部位)=====
// 一阶数值 = 精良强化石从 +1 强化到 +12 的累计值(+1~+3 每级 EQE 精良一档,+4~+12 每级 ×EQE2):攻击 / 防御 25.5×8 = 204 · 生命 25.5×48 = 1224 · 魔力 25.5×24 = 612 · 暴击 25.5×20 = 510(8.5%)
// 闪避单独压低(用户:闪避不能堆太高):90 点 = 3%,出现几率也最低
// 第五十六轮(用户):数值固定(= 精良 +12 满值,旧存档里随机出来的低值也按满值算 cuV);刷出新属性后让玩家选「换成新的 / 保留原来的」(R19.cuP 记着没选完的那次)
//   部位:wpn = 武器(剑 / 法杖各自可以诅咒)· cos = 时装 / 翅膀共用一个部位(同一时间只有一件带诅咒,诅咒另一件会把这件的诅咒移走)· 其余 = 头饰 / 战甲 / 项链 / 戒指
const CUNM={atk:'攻击',def:'防御',hp:'生命',mp:'魔力',cr:'暴击',dg:'闪避'},CUV={atk:204,def:204,hp:1224,mp:612,cr:510,dg:90},CUW=[['atk',20],['cr',18],['def',18],['hp',18],['mp',16],['dg',10]],CUN=['','一阶','二阶'],CUK=[0,1,1.5];
const CUG={wpn:['sword','staff'],cos:['fash','wing']},cuTs=g=>CUG[g]||[g],cuSN=g=>g=='wpn'?'武器':g=='cos'?'时装 / 翅膀':SL[g][0],cuTN=t=>SL[t]?SL[t][0]:t=='fash'?'时装':'翅膀';
const cuV=c=>Math.round(CUV[c.k]*CUK[c.t]);
const cuIt=t=>SL[t]?EQ[t]:WEAR[t]&&cosIt(WEAR[t]);  // 诅咒的对象:装备 = 身上穿着的那件;时装 / 翅膀 = 穿着的那件的强化数据(R19.cen,存档里一直跟着这件时装)
function cuRoll(t,not){let k='atk';for(let n=0;n<20;n++){let r=Math.random()*100;k='atk';for(const [q,w] of CUW){if(r<w){k=q;break}r-=w}if(k!=not)break}return {k,v:Math.round(CUV[k]*CUK[t])}}
const cuTxt=it=>it&&it.cu?`<span style="color:#e03131">😈 ${DMD[it.cu.d].n}之诅咒(${CUN[it.cu.t]}):${CUNM[it.cu.k]} +${cuV(it.cu)}</span>`:'';
const cuRng=(k,t)=>'固定值';
function curseUse(id,t){const i=+id.slice(2),d=DMD[i];if(!d||!(MAT[id]>0))return '';if(!cuTs(d.sl).includes(t))return '「'+d.n+'」只能诅咒'+cuSN(d.sl);const it=cuIt(t);if(!it)return '还没有穿'+cuTN(t);
  const tr=i>=6?2:1;if(tr==2&&!(it.cu&&it.cu.t>=1))return '二阶诅咒要先有一阶诅咒';
  if(tr==2){const o=it.cu;if(o.t>=2)return '这件'+cuTN(t)+'的诅咒已经是二阶了';MAT[id]--;sfx('fuse');flash('200,30,40',.2);const v0=cuV(o);const m=cuSet(t,{k:o.k,v:Math.round(CUV[o.k]*CUK[2]),t:2,d:i});
    return '😈 「'+d.n+'」把'+cuTN(t)+'的一阶诅咒强化成二阶:'+CUNM[o.k]+' +'+v0+' → +'+cuV(it.cu)+m}  // 第六十一轮(用户):二阶不随机,强化已有一阶诅咒的那条属性
  const old=it.cu,r=cuRoll(tr,old&&old.t==tr?old.k:null);MAT[id]--;sfx('fuse');flash('200,30,40',.2);
  if(!old){const m=cuSet(t,{k:r.k,v:r.v,t:tr,d:i});return '😈 '+cuTN(t)+'被「'+d.n+'」诅咒了:'+CUNM[r.k]+' +'+r.v+m}
  R19.cuP={t,k:r.k,v:r.v,tr,d:i};return '😈 刷出了「'+CUNM[r.k]+' +'+r.v+'」—— 换成新的,还是保留原来的「'+CUNM[old.k]+' +'+cuV(old)+'」?'}
function cuSet(t,c){const it=cuIt(t);if(!it)return '';it.cu=c;if(CUG.cos.includes(t)){const o=cuIt(t=='fash'?'wing':'fash');if(o&&o.cu){delete o.cu;return '(时装和翅膀共用一个诅咒部位,另一件的诅咒移走了)'}}return ''}
function cursePick(yes){const q=R19.cuP;R19.cuP=null;if(!q)return '';if(!yes)return '保留了原来的诅咒';const it=cuIt(q.t);if(!it)return '那件'+cuTN(q.t)+'已经脱下了,保留原来的诅咒';
  const m=cuSet(q.t,{k:q.k,v:q.v,t:q.tr,d:q.d});sfx('fuse');return '😈 '+cuTN(q.t)+'的诅咒换成了:'+CUNM[q.k]+' +'+q.v+m}
// 背包左键菜单(620 cmItems 调用):有没选完的那次 → 两个选项;否则 = 每个可以诅咒的部位一个按钮
function cuMenu(id){const i=+id.slice(2),d=DMD[i],q=R19.cuP;
  if(q&&cuIt(q.t)&&cuIt(q.t).cu){const o=cuIt(q.t).cu;return [['✅ 换成新的:'+CUNM[q.k]+' +'+q.v,'czy'],['保留原来的:'+CUNM[o.k]+' +'+cuV(o),'czn']]}
  if(q)R19.cuP=null;
  const L=cuTs(d.sl).filter(t=>cuIt(t)).map(t=>{const c=cuIt(t).cu;return ['😈 诅咒'+cuTN(t)+(c?'(现在:'+CUNM[c.k]+' +'+cuV(c)+')':''),'cz_'+t]});
  return L.length?L:[['(先穿上'+cuSN(d.sl)+'才能诅咒)','x']]}
for(let i=0;i<DMOPEN;i++){const d=DMD[i];MISC['cz'+i]=[d.n+'的诅咒之力',`十二魔封印「${d.n}」掉落的诅咒能量(${i>=6?'二阶':'一阶'})。在背包里左键点它 →「诅咒${cuSN(d.sl)}」:${i>=6?'把身上穿着的'+cuSN(d.sl)+'已有的一阶诅咒强化成二阶(同一种属性,数值 ×1.5,不随机;要先有一阶诅咒)':'给身上穿着的'+cuSN(d.sl)+'附上一条诅咒属性(攻击 / 暴击 / 防御 / 生命 / 魔力 / 闪避之一,数值固定 = 精良强化石 +12,闪避较低)。已经有诅咒时会刷出一条不同的属性,由你决定换成新的还是保留原来的'};装备的强化、锻造、属性石都不受影响。${d.sl=='cos'?'时装和翅膀共用一个诅咒部位。':''}<br>${CUN[i>=6?2:1]}:${['atk','cr','def','hp','mp','dg'].map(k=>CUNM[k]+' +'+Math.round(CUV[k]*CUK[i>=6?2:1])).join(' · ')}`,'',3000];MENI.P['cz'+i]=i>=6?52:51}

// ===== 恶魔选择页 st = 'dms' =====
let DMS={s:0};
const DMSX=20,DMSY=44,DMSW=96,DMSH=124,DMSG=100;
const dmsOpen=i=>i<DMOPEN&&!!DMD[i].k;
function openDms(){st='dms';msgU=0;keys.l=keys.r=0;ah=ar=0}
function dmsHit(mx,my){if(mx>582&&mx<622&&my>4&&my<32)return 'x';if(c4Open()&&inR(mx,my,C4MB))return '4';for(let i=0;i<12;i++){const X=DMSX+(i%6)*DMSG,Y=DMSY+Math.floor(i/6)*(DMSH+8);if(mx>=X&&mx<=X+DMSW&&my>=Y&&my<=Y+DMSH)return i}return -1}
function dmsGo(i){if(!dmsOpen(i)){say('「'+DMD[i].n+'」的封印还很牢固(尚未开放)');return}if(c4Map(DM0+i,()=>{LVS={i:DM0+i-1,s:4,m:2};enterLv(DM0+i,4)}))return;LVS={i:DM0+i-1,s:3,m:2};enterLv(DM0+i,3)}  // 第六十七轮:挑战模式开着 = 四星  // 第五十六轮(用户):十二魔不分星级,默认三星,直接开打(LVS 记着来源,战败 / 通关返回时回恶魔选择页)
function dmsClick(mx,my){const h=dmsHit(mx,my);if(h=='x'){st='map';MPG=1;return}if(h=='4'){c4Tog();return}if(h>=0){DMS.s=h;dmsGo(h)}}
function dmsKey(e){const k=e.key;if(k=='Escape'){st='map';MPG=1;return}if(e.repeat)return;if(k=='4'){c4Tog();return}if(KM[k]=='l')DMS.s=(DMS.s+11)%12;else if(KM[k]=='r')DMS.s=(DMS.s+1)%12;else if(k=='ArrowUp'||k=='ArrowDown')DMS.s=(DMS.s+6)%12;else if(k=='Enter'||k==' ')dmsGo(DMS.s)}
function drawDms(){const t=performance.now()/1000,px=PUI.on(),hv=dmsHit(MX_,MY_);drawMap2(t);x.fillStyle='rgba(8,4,14,.9)';x.fillRect(0,0,VW,VH);
  if(px)PUI.ns(x,'tD1',12,8,14,9,170,4,300,26);else RR(x,170,4,300,26,13,LG(x,0,4,0,30,['#8a2828','#4a1212']),1.8);CTG('十二魔封印 · 封魔石台',320,23,14);
  if(px)PUI.ns(x,'pC',6,6,6,6,586,6,32,24);else RR(x,586,6,32,24,6,'#2a1f3c',1.4);CT('✕',602,23,14,hv=='x'?'#fff':'#ffd43b','center',0);if(c4Open())c4Btn(C4MB,hv=='4',t,'#1a0808',1);
  CT('远古的女神用十二根封魔柱镇住了十二位魔王……如今,前'+['','一','二','三','四','五','六','七','八','九','十','十一','十二'][DMOPEN]+'根柱子的光已经熄灭',320,39,8,'#ffc9c9','center',2,'#1a0808');
  for(let i=0;i<12;i++){const X=DMSX+(i%6)*DMSG,Y=DMSY+Math.floor(i/6)*(DMSH+8),d=DMD[i],op=dmsOpen(i),on=DMS.s==i||hv===i,cx=X+DMSW/2;
    if(px)PUI.ns(x,'pC',6,6,6,6,X,Y,DMSW,DMSH);else RR(x,X,Y,DMSW,DMSH,8,'#1e1829',1.6);
    x.save();x.beginPath();x.rect(X+4,Y+4,DMSW-8,90);x.clip();x.fillStyle=op?'#2a0f12':'#0e0b16';x.fillRect(X+4,Y+4,DMSW-8,90);
    VFX.frame(x,op?'mc-fire':'mc-blue',0,cx,Y+82,.62,1,0,(op?.45:.75)+.15*Math.sin(t*2+i),.36);  // 封印法阵(MG27 已有的召唤法阵)
    if(op){x.save();x.translate(cx,Y+92);DMN.pt(x,d.k,0,0,d.k=='dagon'?72:78,t);x.restore()}
    else{CT('?',cx,Y+56,26,'#5c5470','center',0);CT('封印中',cx,Y+86,8,'#9775fa','center',2,'#0e0b16')}x.restore();
    CT((i+1)+' · '+d.n,cx,Y+106,10,op?'#fff3bf':'#868e96','center',2.4,'#1a0808');CT(d.en+(i>=6?' · 二阶':' · 一阶'),cx,Y+117,7,op?'#ffa8a8':'#5c5f66','center',2,'#1a0808');
    if(op){const sn=starOf(DM0+i);for(let k=0;k<sn;k++)CT('★',X+12+k*9,Y+14,9,STARK[sn].c,'center',2.2,'#5a2e08');CT(d.sl=='wpn'?'武器':d.sl=='cos'?'时装翅膀':SL[d.sl][0],X+DMSW-8,Y+14,8,'#ff8787','right',2,'#1a0808')}
    if(on){x.save();x.strokeStyle=DMS.s==i?'rgba(255,107,107,'+(.7+.3*Math.sin(t*6))+')':'rgba(255,230,220,.5)';x.lineWidth=DMS.s==i?3:1.5;x.strokeRect(X+1.5,Y+1.5,DMSW-3,DMSH-3);x.restore()}}
  const q=DMD[hv>=0?hv:DMS.s];if(q){const L=[];let s=q.lg;while(s.length){L.push(s.slice(0,48));s=s.slice(48)}L.slice(0,3).forEach((l,i)=>CT(l,320,310+i*11,8,'#ffe3e3','center',2,'#1a0808'))}
  if(C4M&&c4Open())CT('挑战模式:点击恶魔直接四星 · 伤害按最大生命 %,装备 / 等级不起作用 · 没有掉落,首通给挑战积分',320,352,8,'#f3d9fa','center',2.2,'#3a0b0b');else
  CT('点击恶魔肖像挑战 · 掉落「诅咒之力」可诅咒对应部位的装备 · Esc 返回地图',320,352,8,'#fff','center',2.2,'#3a0b0b');
  if(performance.now()<msgU)CT(msg,320,300,11,'#ffe3e3','center',2.6,'#7a1f1f')}
