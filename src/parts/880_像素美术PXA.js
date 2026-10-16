// ===== 晨曦镇:静态背景预渲染 + NPC / 传送门 / 女神像每帧绘制 =====
// =====================================================================
// 晨曦镇像素地图 TWN(2026-10-12 扩大版,art_src/town/build_town2.py):宽 1600(普通关卡的一半),镜头跟着主角;
// 分层视差:far 天空大海(静止)· hill 远山树林(.35)· back 后排房子(.7)· main 主层(1)· fg 前景草丛 / 叶丛(画在人物前面);
// 高台和木栈台是平台(pl),可以跳上去。素材:Sunny Land、Seasonal Tilesets、16x16 RPG Item Pack(均 CC0),熔炉 LPC Blacksmith(bluecarrot16,OGA-BY 3.0)
const TWN={w:1600,spawn:130,chief:70,forge:1265,shelf:1325,portal:[1500,252],statue:820,
  pl:[{x:0,y:GY,w:1600},{x:200,y:252,w:240},{x:640,y:224,w:96},{x:1380,y:252,w:220}],
  lamps:[150,470,760,880,1080,1360],
  D:{far:'@@A:town2_far@@',hill:'@@A:town2_hill@@',back:'@@A:town2_back@@',main:'@@A:town2_main@@',fg:'@@A:town2_fg@@',forge:'@@A:town2_forge@@'},I:{},n:0,
  ready(){return this.n>=6}};
for(const k in TWN.D){const im=new Image();im.onload=()=>{TWN.I[k]=im;TWN.n++};im.src=TWN.D[k]}
// 主城像素道具 TPX(art_src/town/build_tpx.py):传送门(Portals,LetargicDev,CC0)、女神像(自绘,原版石像转像素)、宠物钢盔小鸡(Chick,AntumDeluge,CC0)和它扔的扇子;小鸡在关卡里也用(TPX.on())
const TPX={I:null,D:'@@A:tpx_atlas@@',M:{"portal":{"x":0,"y":0,"w":96,"h":96,"n":5,"fps":8,"ax":48,"ay":96},"statue":{"x":0,"y":96,"w":136,"h":103,"ax":68,"ay":102},"chick":{"x":0,"y":200,"w":48,"h":56,"cols":5,"ax":22,"ay":56,"peck":[0,1],"stand":2,"walk":[3,4,5,6],"wave":[7,8]},"fan":{"x":240,"y":200,"w":21,"h":11,"ax":10,"ay":10}},
  on(){return SET.art!==0&&!!this.I},
  spr(c,k,i,dx,dy){const m=this.M[k],n=m.cols||m.n||1;c.drawImage(this.I,m.x+(i%n)*m.w,m.y+Math.floor(i/n)*m.h,m.w,m.h,Math.round(dx),Math.round(dy),m.w,m.h)},
  // 小鸡帧:挥扇 > 走路 > 待机(大多抬头站着,时不时低头啄两下)
  chickF(t,o){const m=this.M.chick;if(o.wave>0)return m.wave[Math.floor(t*12)%2];if(o.mv)return m.walk[Math.floor(t*12)%4];const k=Math.floor(t*5)%20;return k==14||k==16?m.peck[0]:k==15?m.peck[1]:m.stand}};
{const im=new Image();im.onload=()=>{TPX.I=im};im.src=TPX.D}
// ===== 像素美术 PXA(第 1 步:城镇 NPC · 第 2 步:城镇里的主角)=====
// 素材与授权(设置页「美术致谢」里有完整署名和链接):
//  · NPC 艾琳 / 小葵 / 铁叔 / 老金:Sara - Wizard、Trevor Fighter,作者 Mandi Paugh,CC-BY 3.0(去底色、换色,铁叔和老金加了胡须)
//  · 村长:Old Man 32x32 Overflow Sprite,作者 Syrsly(Josh Maines),CC0 / OGA-BY 3.0
//  · 主角与装备:Hero spritesheets - Ars Notoria,作者 Balmer,CC0(按发色和装备品质换色、分层合成)
//  · 手持武器:16x16 Weapon RPG Icons,作者 Shade,CC0(拉长刃部 / 杖身、换色、预转 16 个方向)
//  · 飞行翅膀:LPC Feathered Wings,ElizaWy / Redshrike / JaidynReiman,OGA-BY 3.0(取朝右 8 帧)
//  · 主角 LPC 形象:Universal LPC Spritesheet Character Generator 的分层素材(多位作者,OGA-BY / CC-BY,逐项署名见设置页)
//  · 技能特效:PVFX Foundry(nerijs)、Pixel Art Spells(DevWizard)、Spell Effects(StarsteelGaming),均为 CC0
// 设置里「美术」可以切回原来的几何绘制;某个角色没有素材时,自动用原来的几何绘制。
// (游戏里的「精灵」是伙伴系统,这里的 PXA 是像素角色图,两者无关。)
const PXA={I:{},HI:{},HN:0,LK:{},
  // 单帧尺寸:w×h;by 脚底所在行(画在地面线上);ax 脚底中心列;dirs=1 表示四个朝向(0 正面 1 左 2 右 3 背面)而不是站立 + 眨眼;
  // px / py 是头像里对准圆心的点;pm=1 头像水平翻转(素材面朝左,翻成面朝右);sh 是脚下影子的半径
  DF:{w:32,h:48,by:48,ax:15,px:13,py:12,pm:1,sh:14},
  M:{'村长':{w:20,h:37,by:36,ax:10,px:9,py:9,pm:0,sh:12,dirs:1}},
  D:{
  '技能导师':'@@A:npc_erin@@',
  '药剂师':'@@A:npc_kui@@',
  '强化师':'@@A:npc_tie@@',
  '装备商人':'@@A:npc_jin@@',
  '村长':'@@A:npc_chief@@'},
  // 主角分层素材(Ars Notoria):pl 底图,ar 护甲 ro 长袍 he 头盔 ha 帽子 sh 盾 bk 书(各 8 套),368×200,网格 8 列 × 4 行,单格 46×50
  HD:{
  pl:'@@A:ars_pl@@',
  ar1:'@@A:ars_ar1@@',
  ar2:'@@A:ars_ar2@@',
  ar3:'@@A:ars_ar3@@',
  ar4:'@@A:ars_ar4@@',
  ar5:'@@A:ars_ar5@@',
  ar6:'@@A:ars_ar6@@',
  ar7:'@@A:ars_ar7@@',
  ar8:'@@A:ars_ar8@@',
  ro1:'@@A:ars_ro1@@',
  ro2:'@@A:ars_ro2@@',
  ro3:'@@A:ars_ro3@@',
  ro4:'@@A:ars_ro4@@',
  ro5:'@@A:ars_ro5@@',
  ro6:'@@A:ars_ro6@@',
  ro7:'@@A:ars_ro7@@',
  ro8:'@@A:ars_ro8@@',
  he1:'@@A:ars_he1@@',
  he2:'@@A:ars_he2@@',
  he3:'@@A:ars_he3@@',
  he4:'@@A:ars_he4@@',
  he5:'@@A:ars_he5@@',
  he6:'@@A:ars_he6@@',
  he7:'@@A:ars_he7@@',
  he8:'@@A:ars_he8@@',
  ha1:'@@A:ars_ha1@@',
  ha2:'@@A:ars_ha2@@',
  ha3:'@@A:ars_ha3@@',
  ha4:'@@A:ars_ha4@@',
  ha5:'@@A:ars_ha5@@',
  ha6:'@@A:ars_ha6@@',
  ha7:'@@A:ars_ha7@@',
  ha8:'@@A:ars_ha8@@',
  sh1:'@@A:ars_sh1@@',
  sh2:'@@A:ars_sh2@@',
  sh3:'@@A:ars_sh3@@',
  sh4:'@@A:ars_sh4@@',
  sh5:'@@A:ars_sh5@@',
  sh6:'@@A:ars_sh6@@',
  sh7:'@@A:ars_sh7@@',
  sh8:'@@A:ars_sh8@@',
  bk1:'@@A:ars_bk1@@',
  bk2:'@@A:ars_bk2@@',
  bk3:'@@A:ars_bk3@@',
  bk4:'@@A:ars_bk4@@',
  bk5:'@@A:ars_bk5@@',
  bk6:'@@A:ars_bk6@@',
  bk7:'@@A:ars_bk7@@',
  bk8:'@@A:ars_bk8@@'},
  // 武器(Shade「16x16 Weapon RPG Icons」CC0,拉长刃部 / 杖身后用 RotSprite 预先转成 16 个方向):6 行 = 剑 旅者 / 林王 / 荒漠、法杖 旅者 / 林王 / 荒漠;
  // 每格 56×56,握把在格子正中;第 k 列 = 武器朝向 k×22.5°(0 = 朝前,顺时针)
  WPD:'@@A:wpn_atlas@@',
  // 飞行翅膀(LPC Feathered Wings,ElizaWy / JaidynReiman,OGA-BY 3.0,第三十一轮改用 jump 动画的展开羽翼):第 0 行身后那只、第 1 行身前那只,8 帧扇动,每帧 64×64
  WGD:'@@A:wing_fly@@',
  // 装备系列 → 图层编号(1~8)。系列:0 旅者 · 1 林王 · 2 荒漠;没穿 = 默认布衣 / 白袍
  AR:[2,1,4,3,5,6,7],RO:[2,3,7,4,1,5,6,8],HE:[2,1,4,3,5,6,7,8],HA:[2,3,7,4,1,5,6,8],SH:[3,1,4,2,5,6,7,8],BK:[1,6,4,2,5,3,7,8],
  init(){for(const k in this.D){const im=new Image();im.onload=()=>{this.I[k]=im};im.src=this.D[k]}
    this.HC=Object.keys(this.HD).length;for(const k in this.HD){const im=new Image();im.onload=()=>{this.HI[k]=im;this.HN++};im.src=this.HD[k]}
    for(const [k,u] of [['WI',this.WPD],['GI',this.WGD]]){const im=new Image();im.onload=()=>{this[k]=im};im.src=u}},
  C(k){return this.M[k]||this.DF},
  has(k){return SET.art!==0&&!!this.I[k]},
  // 帧:0 站立 1 眨眼;每 3.4 秒眨一次,每个 NPC 错开
  fr(a,t){const p=((t+a*.37)%3.4+3.4)%3.4;return p<.16?1:0},
  // 在世界里画 NPC:a 为脚底中心 x,f=1 面朝右、-1 面朝左;坐标取整,保证像素对齐。
  // 普通 NPC 素材本身面朝左,朝右时水平翻转;四朝向的 NPC(村长)按玩家的位置选正面 / 左 / 右
  npc(c,k,a,t,f){if(LNPC.on(k))return LNPC.npc(c,k,a,t,f);if(!this.has(k))return false;const g=this.C(k);c.save();c.translate(Math.round(a),GY);SHD(c,0,0,g.sh);c.imageSmoothingEnabled=false;let fi=0;
    if(g.dirs){const dx=(P?P.x+12:a)-a;fi=Math.abs(dx)<44?0:dx<0?1:2}else{fi=this.fr(a,t);if(f>0)c.scale(-1,1)}
    c.drawImage(this.I[k],fi*g.w,0,g.w,g.h,-g.ax,-g.by,g.w,g.h);c.restore();return true},
  // 对话框头像:放大 2 倍(整数倍),头部对准圆心
  port(c,k,cx,cy){if(LNPC.on(k))return LNPC.port(c,k,cx,cy);if(!this.has(k))return false;const g=this.C(k);c.save();c.imageSmoothingEnabled=false;c.translate(cx,cy);c.scale(g.pm?-2:2,2);
    c.drawImage(this.I[k],(g.dirs?0:this.fr(cx,performance.now()/1000))*g.w,0,g.w,g.h,-g.px,-g.py,g.w,g.h);c.restore();return true},
  // ---- 主角 ----
  // 穿着时装时继续用几何主角(时装还没有像素素材);翅膀、飞行、中毒都有像素画法
  heroOn(L){return SET.art!==0&&(st=='town'||st=='play')&&this.HN>=this.HC&&!L.look},
  hx(s){return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16))},
  pick(arr,g,def){return g<0?def:arr[g%arr.length]},
  // 品质轮廓:取身上所有装备(身体、头部、剑、法杖)里最高的品质 —— 剑士和法师两个形态的轮廓颜色始终一致
  tier(){let t=0;for(const k of ['body','head','sword','staff'])if(EQ[k])t=Math.max(t,EQ[k].tier||0);return t},
  // 合成当前外观的整张图集(缓存):底图(换发色)→ 身体(护甲 / 长袍)→ 头部(头盔 / 帽子)→ 副手(盾 / 书)→ 品质轮廓
  look(mm){const m=mm||P.mode,B=EQ.body,Hd=EQ.head,W=EQ[m],bg=B?Math.min(3,B.g||0):-1,hg=Hd?Math.min(3,Hd.g||0):-1,wg=W?Math.min(3,W.g||0):0,  // 机械系列(4)外观沿用雪原
      tier=this.tier(),key=m+'|'+bg+'|'+hg+'|'+wg+'|'+tier;
    if(this.LK[key])return this.LK[key];
    const S=368,H=200,cv=document.createElement('canvas');cv.width=S;cv.height=H;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(this.HI.pl,0,0);
    if(hg>=1&&HAIRS[hg]){const id=c.getImageData(0,0,S,H),d=id.data,m1=this.hx(HAIRS[hg][1]),dk=m1.map(v=>Math.round(v*.8)),lt=m1.map(v=>Math.min(255,Math.round(v*1.2+10)));
      for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const r=d[i],g=d[i+1],b=d[i+2];
        if(r==69&&g==40&&b==60){d[i]=dk[0];d[i+1]=dk[1];d[i+2]=dk[2]}else if(r==102&&g==57&&b==49){d[i]=lt[0];d[i+1]=lt[1];d[i+2]=lt[2]}}
      c.putImageData(id,0,0)}
    const Ly=n=>{const im=this.HI[n];if(im)c.drawImage(im,0,0)};
    if(m=='sword'){Ly('ar'+this.pick(this.AR,bg,8));if(hg>=0)Ly('he'+this.pick(this.HE,hg,1));Ly('sh'+this.pick(this.SH,wg,3))}
    else{Ly('ro'+this.pick(this.RO,bg,5));if(hg>=0)Ly('ha'+this.pick(this.HA,hg,1));Ly('bk'+this.pick(this.BK,wg,1))}
    let out=cv;
    if(tier>=1){const tmp=document.createElement('canvas');tmp.width=S;tmp.height=H;const tc=tmp.getContext('2d');tc.drawImage(cv,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle=TR[tier][1];tc.fillRect(0,0,S,H);
      out=document.createElement('canvas');out.width=S;out.height=H;const oc=out.getContext('2d');oc.imageSmoothingEnabled=false;oc.globalAlpha=.9;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])oc.drawImage(tmp,dx,dy);oc.globalAlpha=1;oc.drawImage(cv,0,0)}
    return this.LK[key]=out},
  // 格子编号 = 行 × 8 + 列:0 站立 · 2 出拳起手 · 3 出拳 · 6 / 7 起跳 / 下落 · 8 / 9 受击 · 10~13 空中出拳 · 16 击飞 · 18~21 低姿出拳 · 24~31 跑步
  // SF=1 表示这一帧临时水平翻转(疾风踏斩盘旋上升时的转身)
  hf(tm){const air=!P.gr,mv=Math.abs(P.vx)>1,k=P.sk;this.SF=0;
    if(P.stun>0)return air?16:(P.stun>.35?8:9);
    if(k){const id=k.id,t=k.t;
      if(id=='tw'){if(t<.16)return 3;if(t<.62){this.SF=Math.floor(t/.06)%2;return 11}if(t<1.1)return (k.cr||0)%2?12:11;if(t<1.32)return 12;return t<1.45?19:18}
      if(id=='ls')return k.n<30?[11,12,10][k.n%3]:19;
      if(id=='yr'){if(t<.4)return 2;if(t<.62)return 3;if(t<1.2)return 19;if(t<1.35)return 18;return t<1.55?19:18}
      if(id=='slam'||id=='slam2'||id=='smash')return air?12:19;if(id=='up')return 10;if(id=='dash')return 3;if(id=='rstab')return 4;return air?11:3}
    if(P.cs)return air?11:3;
    if(P.at>0){const w=P.swW||.1;if(P.swT!=null&&P.swT<w)return air?10:2;return air?11:3+Math.abs(P.swC||0)%3}
    if(P.ch>.12)return air?10:2;
    if(P.fly)return 6;
    if(air)return P.vy<0?6:7;if(mv)return 24+Math.floor(tm*(P.run?20:13))%8;return 0},
  // 每一帧前手(握武器的手)在格子里的位置;HB 里的帧手在身后,武器画在身体后面
  HA:{0:[31,28],1:[29,31],2:[28,17],3:[38,18],4:[35,21],5:[28,22],6:[29,23],7:[29,25],8:[34,25],9:[34,32],10:[27,13],11:[38,14],12:[34,17],13:[27,18],16:[28,17],17:[26,36],18:[29,25],19:[39,27],20:[35,26],21:[30,27],
      24:[19,21],25:[17,23],26:[22,24],27:[31,26],28:[34,24],29:[36,23],30:[29,26],31:[18,22]},
  HB:{24:1,25:1,26:1,31:1},WC:{},
  wrow(m){const W=EQ[m],g=W?(W.g||0):0;return (m=='staff'?3:0)+Math.max(0,Math.min(2,g))},
  wdir(wa){return ((Math.round(wa/(Math.PI/8))%16)+16)%16},
  // 武器图(带品质轮廓,缓存):row 武器,d 方向
  wc(row,d,tier){const key=row+'|'+d+'|'+tier;if(this.WC[key])return this.WC[key];const S=56,cv=document.createElement('canvas');cv.width=cv.height=S;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
    if(tier>=1){const t=document.createElement('canvas');t.width=t.height=S;const tc=t.getContext('2d');tc.drawImage(this.WI,d*S,row*S,S,S,0,0,S,S);tc.globalCompositeOperation='source-in';tc.fillStyle=TR[tier][1];tc.fillRect(0,0,S,S);
      c.globalAlpha=.9;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(t,dx,dy);c.globalAlpha=1}
    c.drawImage(this.WI,d*S,row*S,S,S,0,0,S,S);return this.WC[key]=cv},
  // 画手里的武器:c 已经平移到脚底中心并按朝向翻转;wa 是骨骼动画里武器的角度(朝前为 0),吸附到 16 个方向
  wpn(c,m,fr,wa,tier){if(!this.WI)return;const h=this.HA[fr]||[30,28];c.drawImage(this.wc(this.wrow(m),this.wdir(wa),tier),h[0]-23-28,h[1]-48-28)},
  // 武器的几何信息(主角坐标,和几何主角 drawHero 的返回值同一格式),给剑光 / 直戳剑气用
  wgeo(){const h=this.HA[this.LF||0]||[30,28],wa=P.rc?P.rc.wa:0,L=P.mode=='staff'?30:31,c=Math.cos(wa),s=Math.sin(wa),hx=(h[0]-23)/HSC,hy=(h[1]-48)/HSC,q=v=>[hx+c*v/HSC,hy+s*v/HSC];
    return {h:[hx,hy],b:q(4),m:q(16),tip:q(L),wa,px:1,b0:4,t0:L}},
  // 把一帧画到临时画布上并整体染色:mode 'source-atop' = 叠色(中毒),'source-in' = 纯色剪影(残影)
  tint(k,f,col,mode,cv){const t=cv||this.TT||(this.TT=document.createElement('canvas'));t.width=46;t.height=50;const g=t.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(k,(f%8)*46,((f/8)|0)*50,46,50,0,0,46,50);
    g.globalCompositeOperation=mode||'source-atop';g.fillStyle=col;g.fillRect(0,0,46,50);return t},
  // 翅膀挂件(不飞行时):风华剑仙丝带沿用程序绘制,画在像素主角身后;学院法师的四角星由 drawStarF 单独跟随
  pend(c,L,tm,fl){return;if(L.wing!='fhw')return;c.save();c.scale(fl*1.12,1.12);c.translate(-12,-34);drawRibbon(c,tm,0,.9);c.restore()},
  // 飞行翅膀:统一用 LPC 羽翼(两只都画在身后),8 帧扇动 12 帧/秒
  wings(c,tm,fl){if(!this.GI)return;const g=Math.floor(tm*12)%8;c.save();if(fl<0)c.scale(-1,1);c.drawImage(this.GI,g*64,0,64,64,-39,-71,64,64);c.drawImage(this.GI,g*64,64,64,64,-39,-71,64,64);c.restore()},
  cloneOn(){return SET.art!==0&&this.HN>=this.HC&&!heroLook().look},
  // 分身:法师外观(带法杖),半透明 + 紫色染色
  clone(c,cx,fy,f,face,a,tm,wa){const k=this.look('staff'),t=this.CT||(this.CT=document.createElement('canvas'));t.width=96;t.height=96;const g=t.getContext('2d');g.imageSmoothingEnabled=false;g.translate(48,72);
    g.drawImage(k,(f%8)*46,((f/8)|0)*50,46,50,-23,-48,46,50);this.wpn(g,'staff',f,wa==null?-1.05:wa,0);g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(151,117,250,.5)';g.fillRect(0,0,96,96);
    c.save();c.globalAlpha=a;c.imageSmoothingEnabled=false;c.translate(Math.round(cx),Math.round(fy));if(face<0)c.scale(-1,1);c.drawImage(t,-48,-72);c.restore()},
  // 残影:记录当时的帧,画成纯色剪影
  gf(){return this.heroOn(heroLook())?{f:this.LF||0,fl:P.f*(this.SF?-1:1)}:null},
  ghost(c,g){const t=this.tint(this.look(),g.pf.f,g.c,'source-in',this.GT||(this.GT=document.createElement('canvas')));c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(g.x+12-cam),Math.round(g.y+32));if(g.pf.fl<0)c.scale(-1,1);c.drawImage(t,-23,-48);c.restore()},
  hero(c,cx,fy,tm){const L=heroLook(),k=this.look(),f=this.hf(tm),tier=this.tier(),fl=P.f*(this.SF?-1:1),wa=P.rc?P.rc.wa:0,m=P.mode;this.LF=f;
    c.save();c.translate(Math.round(cx),Math.round(fy));c.imageSmoothingEnabled=false;
    if(P.fly)this.wings(c,tm,fl);else this.pend(c,L,tm,fl);
    if(fl<0)c.scale(-1,1);
    const back=this.HB[f];if(back)this.wpn(c,m,f,wa,tier);
    if(P.ps>0)c.drawImage(this.tint(k,f,'rgba(105,219,124,.45)'),-23,-48);else c.drawImage(k,(f%8)*46,((f/8)|0)*50,46,50,-23,-48,46,50);
    if(!back)this.wpn(c,m,f,wa,tier);c.restore()},
  // 背包纸娃娃:法师静态图(c 已经平移到脚底、放大 2 倍)
  doll(c,L){const m=P.mode,k=this.look(m);c.imageSmoothingEnabled=false;this.pend(c,L,0,1);c.drawImage(k,0,0,46,50,-23,-48,46,50);this.wpn(c,m,0,STANCE[m].wa,this.tier())},
  // 商城里翅膀的预览:像素主角 + 挂件
  pv(c,id,t){const k=this.look();c.imageSmoothingEnabled=false;if(id=='fhw')this.pend(c,{wing:'fhw'},t,1);c.drawImage(k,0,0,46,50,-23,-48,46,50);this.wpn(c,P.mode,0,STANCE[P.mode].wa,this.tier());
    if(id=='xyw')drawStar4(c,-20,-40,5,t)},
  ready(){return SET.art!==0&&this.HN>=this.HC}};
PXA.init();
// =====================================================================
