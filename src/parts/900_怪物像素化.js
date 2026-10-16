// ===== 像素挂件(翅膀不飞行时跟在身后):第 0 行风华剑仙丝带,第 1 行学院法师四角星;自绘,每帧 20×20,6 帧 =====
const PEND={I:null,D:'@@A:pend@@',init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  draw(c,row,x0,y0,t,f){if(!this.I)return;const fr=Math.floor(t*8)%6;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x0),Math.round(y0));if(f<0)c.scale(-1,1);c.drawImage(this.I,fr*20,row*20,20,20,-10,-10,20,20);c.restore()}};
PEND.init();
// ===== 城镇 NPC 的 LPC 形象(和 LPC 主角统一画风):每个 NPC 一行 = 待机朝右 2 帧 + 待机正面 2 帧(64×64,脚底在第 62 行)=====
// 艾琳 女 · 紫色长发紫袍;小葵 少女 · 绿色双马尾 + 白围裙;铁叔 中年 · 寸头大胡子 + 皮围裙;老金 老年 · 秃顶灰发 + 八字胡 + 橙马甲 + 背包;村长 老年 · 白发白胡子 + 拐杖
// 设置里「人物形象」选 Ars / 旧版时,回到原来的 Sara / Trevor / Old Man
const LNPC={I:null,D:'@@A:npc_lpc@@',M:{"技能导师":{"row":0,"top":14},"药剂师":{"row":1,"top":13},"强化师":{"row":2,"top":15},"装备商人":{"row":3,"top":15},"村长":{"row":4,"top":15},"仓库管理员":{"row":5,"top":10}},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(k){return SET.art!==0&&SET.hero!=='ars'&&!!this.I&&!!this.M[k]},
  // 玩家走到 44 像素内转成正面,否则侧身朝向玩家;待机 2 帧缓慢交替(各 NPC 错开)
  npc(c,k,a,t,f){const g=this.M[k],dx=(P?P.x+12:a)-a,fr=Math.floor((t+a*.37)*1.6)%2,front=Math.abs(dx)<44;
    c.save();c.translate(Math.round(a),GY);SHD(c,0,0,12);c.imageSmoothingEnabled=false;if(!front&&f<0)c.scale(-1,1);
    c.drawImage(this.I,((front?2:0)+fr)*64,g.row*64,64,64,-32,-62,64,64);c.restore();return true},
  // 对话框头像:侧身朝右,放大 2 倍,头部对准圆心
  port(c,k,cx,cy){const g=this.M[k];c.save();c.imageSmoothingEnabled=false;c.translate(cx,cy);c.scale(2,2);c.drawImage(this.I,0,g.row*64,64,64,-33,-(g.top+15),64,64);c.restore();return true}};
LNPC.init();
// =====================================================================
// ===== 像素特效素材(VFX):PVFX Foundry(nerijs,CC0)、Pixel Art Spells(DevWizard,CC0)、Spell Effects(StarsteelGaming,CC0) =====
// spawn(名字, x, y, {s 缩放, f 朝向, r 旋转, at 跟随的对象, loop 秒数}):一次性动画,画在像素特效层里(VFX.draw 由 drawFX 调用)
// =====================================================================
// ===== 怪物像素化(像素美术第 7 步)=====
// 1) 所有怪物和首领画进 640×360 像素层(PXL),原来的矢量画法自动变成像素风;
// 2) 有素材的小怪换成像素精灵(MOB,art_src/mob/build_mob.py):史莱姆、蛇(Calciumtrice)、蝙蝠、狗(Admurin Enemy Galore I)、蜘蛛([LPC] Spider)、黄 / 黑蝎子(Scorpy Scorp)、骷髅兵(ULPC);
//    动作按状态选:受击 / 出招(前摇放前半段、出手放后半段)/ 移动 / 待机,姿态(前倾、压扁)沿用 monPose;
// 3) 怪物攻击特效(Ninja Adventure FX,CC0,art_src/mob/build_mfx.py):出手瞬间在身前放挥砍 / 爪击 / 尘土,主角被打中时按最近的怪物放爪痕 / 冰 / 毒 / 爆炸。
// 设置切回「原版几何」时全部回到矢量画法。
const MFXD='@@A:mfx_atlas@@',MFXM={"m-claw":{"y":0,"w":32,"h":32,"n":4,"px":16,"py":16,"fps":16,"loop":false,"im":1},"m-claw2":{"y":32,"w":32,"h":32,"n":4,"px":16,"py":16,"fps":16,"loop":false,"im":1},"m-cut":{"y":64,"w":32,"h":32,"n":4,"px":16,"py":16,"fps":18,"loop":false,"im":1},"m-slash":{"y":96,"w":32,"h":32,"n":4,"px":16,"py":16,"fps":18,"loop":false,"im":1},"m-explo":{"y":128,"w":40,"h":40,"n":9,"px":20,"py":20,"fps":18,"loop":false,"im":1},"m-flam":{"y":168,"w":25,"h":30,"n":8,"px":12,"py":30,"fps":16,"loop":false,"im":1},"m-ice":{"y":198,"w":32,"h":32,"n":10,"px":16,"py":16,"fps":20,"loop":false,"im":1},"m-ice2":{"y":230,"w":32,"h":32,"n":9,"px":16,"py":16,"fps":18,"loop":false,"im":1},"m-spike":{"y":262,"w":54,"h":48,"n":10,"px":27,"py":48,"fps":18,"loop":false,"im":1},"m-thunder":{"y":310,"w":20,"h":28,"n":8,"px":10,"py":28,"fps":18,"loop":false,"im":1},"m-water":{"y":338,"w":30,"h":41,"n":9,"px":15,"py":41,"fps":16,"loop":false,"im":1},"m-smoke":{"y":379,"w":32,"h":32,"n":6,"px":16,"py":16,"fps":14,"loop":false,"im":1},"m-dust":{"y":411,"w":60,"h":14,"n":4,"px":30,"py":14,"fps":12,"loop":false,"im":1},"m-spark":{"y":425,"w":27,"h":35,"n":10,"px":13,"py":17,"fps":20,"loop":false,"im":1},"m-poison":{"y":460,"w":20,"h":28,"n":12,"px":10,"py":14,"fps":16,"loop":false,"im":1}};
const MOB={I:null,D:'@@A:mob_atlas@@',M:{"slime":{"w":22,"h":15,"ax":15,"S":2,"fl":0,"A":{"idle":[0,10,8],"walk":[15,10,12],"atk":[30,10,14],"hit":[45,2,8]}},"snake":{"w":20,"h":13,"ax":12,"S":2,"fl":1,"A":{"idle":[60,10,8],"walk":[73,10,12],"atk":[86,10,16],"hit":[99,2,8]}},"bat":{"w":19,"h":21,"ax":10,"S":1,"fl":1,"A":{"idle":[112,4,10],"walk":[133,4,12],"atk":[154,7,14],"hit":[175,5,12]}},"dog":{"w":45,"h":26,"ax":18,"S":1,"fl":1,"A":{"idle":[196,4,6],"walk":[222,6,12],"atk":[248,7,14],"hit":[274,4,12]}},"spi":{"w":46,"h":37,"ax":19,"S":1,"fl":0,"A":{"idle":[300,2,2],"walk":[337,6,12],"atk":[374,4,12],"hit":[411,1,4]}},"ysco":{"w":50,"h":35,"ax":24,"S":1,"fl":1,"A":{"idle":[448,1,2],"walk":[483,4,8],"atk":[518,3,10],"hit":[553,1,4]}},"bsco":{"w":50,"h":35,"ax":24,"S":1,"fl":1,"A":{"idle":[588,1,2],"walk":[623,4,8],"atk":[658,3,10],"hit":[693,1,4]}},"skel":{"w":40,"h":48,"ax":15,"S":1,"fl":0,"A":{"idle":[728,2,3],"walk":[776,8,12],"atk":[824,6,14],"hit":[872,1,4]}},"pen":{"w":34,"h":42,"ax":12,"S":1,"fl":1,"A":{"idle":[920,12,8],"walk":[962,12,14],"hit":[1004,4,12],"atk":[1046,5,12],"th":[1088,8,14],"wind":[1130,2,6],"dz":[1172,10,12],"slide":[1214,3,8]}},"pen2":{"w":39,"h":48,"ax":14,"S":1,"fl":1,"A":{"idle":[1256,12,8],"walk":[1304,12,14],"hit":[1352,4,12],"atk":[1400,5,12],"th":[1448,8,14],"wind":[1496,2,6],"dz":[1544,10,12],"slide":[1592,3,8]}},"seal":{"w":29,"h":15,"ax":14,"S":2,"fl":1,"A":{"idle":[1640,2,3],"walk":[1655,4,8],"atk":[1670,2,8],"hit":[1685,1,4]}},"seal2":{"w":29,"h":15,"ax":14,"S":2,"fl":1,"A":{"idle":[1700,2,3],"walk":[1715,4,8],"atk":[1730,2,8],"hit":[1745,1,4]}},"dog2":{"w":49,"h":31,"ax":21,"S":1,"fl":1,"A":{"idle":[1760,6,6],"walk":[1807,12,12],"atk":[1854,5,14],"hit":[1760,1,4]}}},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){if((e.k=='seal'||e.k=='seal2')&&(e.s=='hid'||e.s=='ball'||e.s=='dig'&&e.t>.3))return false;return SET.art!==0&&!!this.I&&!!this.M[e.k]},
  draw(c,e,t){const m=this.M[e.k],now=performance.now()/1000;let a='idle',i=0;
    if(e.st>0&&!e._sk){a='hit';i=Math.floor(now*m.A.hit[2])}
    else if(m.A.dz&&e.s&&e.s!='pk'){const q={dz:'dz',sl:'slide',tkl:'slide',sw:'wind',tk:'wind',th:'th'}[e.s]||'idle';a=q;i=q=='th'?Math.min(m.A.th[1]-1,Math.floor(e.t*m.A.th[2])):q=='wind'?Math.min(1,Math.floor(e.t*4)):Math.floor(now*m.A[q][2])}
    else if(e._sk){if(!e._ska)e._ska=now;const A=m.A.atk,h=Math.ceil(A[1]/2);a='atk';i=Math.min(A[1]-1,h+Math.floor((now-e._ska)*A[2]))}
    else if(e._wu){e._ska=0;a='atk';i=Math.floor(now*6)%Math.max(1,Math.ceil(m.A.atk[1]/2))}
    else{e._ska=0;if(e.mvs>.3||e.k=='bat'){a='walk';i=Math.floor(now*m.A.walk[2]+(e.ph||0)*3)}else i=Math.floor(now*m.A.idle[2]+(e.ph||0)*3)}
    const A=m.A[a],base=(e.k=='ysco'||e.k=='bsco')?1:MSC,k=m.S/base;
    if(e.k!='bat')SHD(c,0,0,m.w*.32*k);
    c.save();c.scale(k*(m.fl?-1:1),k);c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.6)';
    c.drawImage(this.I,(i%A[1])*m.w,A[0],m.w,m.h,-m.ax,-m.h+(e.k=='bat'?6:0),m.w,m.h);c.restore();
    if(e.s=='dz'&&m.A.dz){const q=now*7;for(let j=0;j<3;j++)CT('★',Math.cos(q+j*2.1)*10,-m.h*.85+Math.sin(q+j*2.1)*3,8,'#ffd43b','center',2)}}};
// [出招时身前的特效, 主角被打中时的特效]
const MFXK={slime:['','m-smoke'],skel:['m-slash','m-cut'],bat:['','m-claw'],snake:['','m-claw2'],ape:['m-dust','m-claw'],ysco:['m-cut','m-claw2'],bsco:['m-cut','m-poison'],sco:['m-slash','m-poison'],
  spi:['','m-poison'],ost:['m-dust','m-cut'],pen:['','m-ice'],pen2:['','m-ice'],seal:['','m-ice2'],seal2:['','m-ice2'],dog:['m-claw','m-claw2'],dog2:['m-claw2','m-claw2'],gfly:['','m-claw'],gfly2:['','m-claw2'],gland:['','m-claw2'],gland2:['m-claw','m-claw2'],yin:['','m-spark'],
  bear:['m-dust','m-claw2'],king:['m-slash','m-claw2'],mage:['','m-spark'],boss:['','m-explo']};
function mfxSwing(e){const q=MFXK[e.k];if(!q||!q[0]||e.ug)return;const dust=q[0]=='m-dust',fx=e.f>0?e.x+e.w+(dust?0:4):e.x-(dust?0:4);
  VFX.spawn(q[0],fx,dust?e.y+e.h:e.y+e.h*.5,{f:e.f,s:e.max?1.6:1})}
function mfxHit(){if(!VFX.ok())return;const px=P.x+12;let b=null,bd=1e9;for(const e of (bossOn&&B&&B.hp>0?E.concat([B]):E)){const d=Math.abs(e.x+e.w/2-px);if(d<bd){bd=d;b=e}}
  const q=b&&MFXK[b.k],n=q?q[1]:'m-cut';VFX.spawn(n,px,P.y+16,{f:b?sgn(px-(b.x+b.w/2))||1:1,s:n=='m-explo'?1.2:1})}
const VFX={I:null,D:'@@A:vfx_atlas@@',M:{"crescent-slash":{"y":0,"w":72,"h":36,"n":10,"px":30,"py":28,"fps":20,"loop":false},"electric-impact":{"y":36,"w":76,"h":51,"n":14,"px":37,"py":29,"fps":20,"loop":false},"earth-rupture":{"y":87,"w":88,"h":59,"n":20,"px":43,"py":43,"fps":20,"loop":false},"warm-explosion":{"y":146,"w":69,"h":70,"n":15,"px":34,"py":47,"fps":20,"loop":false},"frost-nova":{"y":216,"w":75,"h":53,"n":13,"px":37,"py":36,"fps":20,"loop":false},"foldstep":{"y":269,"w":54,"h":57,"n":18,"px":25,"py":29,"fps":20,"loop":false},"smoke-puff":{"y":326,"w":63,"h":46,"n":14,"px":31,"py":17,"fps":20,"loop":false},"leaf-gust":{"y":372,"w":78,"h":49,"n":14,"px":46,"py":31,"fps":20,"loop":false},"solar-shrapnel":{"y":421,"w":77,"h":67,"n":14,"px":38,"py":29,"fps":20,"loop":false},"mass-release":{"y":488,"w":81,"h":77,"n":30,"px":40,"py":69,"fps":20,"loop":false},"arcane-parry":{"y":565,"w":85,"h":78,"n":16,"px":45,"py":59,"fps":20,"loop":false},"rift-portal":{"y":643,"w":69,"h":69,"n":16,"px":34,"py":34,"fps":20,"loop":true},"landing-dust":{"y":712,"w":81,"h":45,"n":14,"px":40,"py":19,"fps":20,"loop":false},"radiant-heal":{"y":757,"w":61,"h":67,"n":14,"px":30,"py":49,"fps":20,"loop":false},"void-implosion":{"y":824,"w":69,"h":52,"n":14,"px":34,"py":27,"fps":20,"loop":false},"resonant-break":{"y":876,"w":73,"h":75,"n":34,"px":36,"py":36,"fps":20,"loop":false},"spectral-bloom":{"y":951,"w":69,"h":57,"n":16,"px":34,"py":41,"fps":20,"loop":false},"focus-charge":{"y":1008,"w":69,"h":57,"n":14,"px":34,"py":28,"fps":20,"loop":false},"dw-arcane":{"y":1065,"w":16,"h":11,"n":6,"px":8,"py":6,"fps":12,"loop":true},"dw-orb":{"y":1076,"w":16,"h":16,"n":6,"px":8,"py":8,"fps":12,"loop":true},"dw-wind":{"y":1092,"w":16,"h":13,"n":6,"px":8,"py":6,"fps":12,"loop":true},"ss-fireball":{"y":1105,"w":62,"h":25,"n":9,"px":40,"py":12,"fps":14,"loop":false},"ss-thunder":{"y":1130,"w":39,"h":32,"n":8,"px":20,"py":16,"fps":14,"loop":false}},L:[],
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D;Object.assign(this.M,MFXM);const i2=new Image();i2.onload=()=>{this.I2=i2};i2.src=MFXD},
  ok(){return SET.art!==0&&!!this.I},
  spawn(n,x0,y0,o){if(!this.ok()||!this.M[n])return null;if(this.L.length>60)this.L.shift();o=o||{};const q={n,x:x0,y:y0,t:0,s:o.s||1,f:o.f||1,r:o.r||0,at:o.at||null,dx:o.dx||0,dy:o.dy||0,life:o.life||0,a:o.a==null?1:o.a,add:o.add||0,hold:o.hold||0,gr:o.gr||0,rs:o.rs||0,fi:o.fi==null?.2:o.fi,sy:o.sy||1,fps:o.fps||0};this.L.push(q);return q},
  step(dt){for(const q of this.L)q.t+=dt;this.L=this.L.filter(q=>{const m=this.M[q.n];return q.life?q.t<q.life:(m.loop||q.t<m.n/(q.fps||m.fps))})},
  frame(c,n,i,x0,y0,s,f,r,a,sy){const m=this.M[n],I=m&&(m.im==7?this.I7:m.im==6?this.I6:m.im==5?this.I5:m.im==4?this.I4:m.im==3?this.I3:m.im?this.I2:this.I);if(!m||!I)return;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x0),Math.round(y0));if(r)c.rotate(r);c.scale(f*s,s*(sy||1));if(a!=null)c.globalAlpha*=a;
    c.drawImage(I,(i%m.n)*m.w,m.y,m.w,m.h,-m.px,-m.py,m.w,m.h);c.restore()},
  draw(){if(!this.ok())return;for(const q of this.L){const m=this.M[q.n];let i=Math.floor(q.t*(q.fps||m.fps));if(m.loop)i%=m.n;else if(i>=m.n){if(q.hold)i=m.n-1;else continue}
      const X=(q.at?q.at.x+(q.at.w||0)/2:q.x)+q.dx-cam,Y=(q.at?q.at.y+(q.at.h||0)/2:q.y)+q.dy;let a=q.a;if(q.life)a*=Math.min(1,(q.life-q.t)/.3,q.fi?q.t/q.fi:1);const s=q.s*(1+q.gr*q.t),r=q.r+q.rs*q.t;
      if(q.add){x.save();x.globalCompositeOperation='lighter';this.frame(x,q.n,i,X,Y,s,q.f,r,a,q.sy);x.restore()}else this.frame(x,q.n,i,X,Y,s,q.f,r,a,q.sy)}},
  // 命中特效:按招式类型(hitFx)和形态选素材,同一个敌人 0.06 秒内只出一次
  hit(e,k,cr){if(!this.ok())return;const now=GT||0;if(e._vx&&now-e._vx<.06)return;e._vx=now;const cx=e.x+e.w/2,cy=e.y+e.h/2,f=sgn(cx-(P.x+12))||1;
    if(k=='thunder')this.spawn('electric-impact',cx,cy,{s:.8});
    else if(k=='heavy'||k=='slam'){this.spawn('earth-rupture',cx,Math.min(GY,e.y+e.h),{s:.8});this.spawn('crescent-slash',cx,cy,{s:1,f,r:.6*f})}
    else if(k=='wave')this.spawn('leaf-gust',cx,cy,{s:.8,f});
    else if(k=='dash')this.spawn('crescent-slash',cx,cy,{s:1.1,f});
    else if(P.mode=='sword')this.spawn('crescent-slash',cx,cy,{s:.8,f,r:rnd(-.5,.5)});
    else this.spawn('spectral-bloom',cx,cy,{s:.6});
    if(cr)this.spawn('solar-shrapnel',cx,cy,{s:.7})},
  // 玩家飞弹:火球、分身魔弹、法师普攻光球、剑气以外的都用素材画;返回 true 表示已经画过
  shot(b,bx,d,t){if(!this.ok())return false;
    if(b.gl){x.save();x.globalCompositeOperation='lighter';this.frame(x,'x-nebula',Math.floor(t*15),bx,b.y,.95,d,t*2,1);this.frame(x,'g-orb',2+Math.floor(t*12)%3,bx,b.y,1.2,d,0,.85);this.frame(x,'x-bubble',Math.floor(t*15),bx,b.y,1.4,d,0,1);x.restore();return true}  // 第二十九轮:圣光球放大一圈,外面一层白蓝冰花 + 彩色光泡
    if(b.fb){const m=this.M['ss-fireball'];this.frame(x,'ss-fireball',4+Math.floor(t*14)%5,bx,b.y,b.fs||2,d,0);return true}
    if(b.wv)return false;
    if(b.lb){x.save();x.globalCompositeOperation='lighter';const k_=b.big?1.45:1;if(b.big)this.frame(x,'x-arc',Math.floor(t*15),bx,b.y,1.15,d,t*3,1);this.frame(x,'x-lball',Math.floor(t*15)+7,bx,b.y,k_,-d,0,.85);this.frame(x,'x-lball',Math.floor(t*15)+13,bx,b.y,k_*.9,d,1.6,.7);this.frame(x,'x-lball',Math.floor(t*15),bx,b.y,k_,d,0,1);x.restore();return true}  // 第三十轮:法师普攻球形闪电(Mikodrak,CC0);重击外层蓝色魔光(Soluna,CC0)
    if(b.col=='#9775fa'){this.frame(x,'dw-arcane',Math.floor(t*12)%6,bx,b.y,1.6,d,0);return true}
    this.frame(x,'dw-orb',Math.floor(t*12)%6,bx,b.y,b.big?2.2:1.2,d,0);return true}};
VFX.init();MOB.init();
