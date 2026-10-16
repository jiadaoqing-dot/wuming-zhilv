// ===== 第四十轮:第十一关「齿轮要塞」(第二张地图「暗黑大陆」左下角的机械城,cur = 14)=====
// 图集 MECH(art_src/mech/build_mech.py):背景 Industrial Parallax Background(ansimuz,CC0)· 地面 / 传送带 16x16 Industrial Tileset(0x72,CC0,换成青绿色)·
//   小怪 / 首领 CraftPix.net(OGA-BY 3.0):齿轮巡逻兵 gbot · 电击无人机 zdr(飞行)· 穹顶坦克 tank(精英,炮弹)· 首领 钢铁暴君 mech(机甲步行坦克)· 爆炸 Warped City(ansimuz,CC0)
// 场景:三段地面传送带 BELT14(站在上面会被慢慢推走,跳起来不受影响)。数值约 = 第十关 ×1.2(LM 21 · MHK 64 · BHN 10800 · BDF 38)
// 首领招式:导弹齐射 msl(落点有预警,二阶段更多)· 机枪扫射 gun(贴地子弹,跳过去;二阶段高低交替,高的要站着别跳)· 喷射践踏 jmp(跳到主角头上砸地 + 两道冲击波)·
//   呼叫支援 call(仅二阶段:叫来 2 架电击无人机)。半血以下二阶段:动作快 20%
const PL14=[{x:0,y:GY,w:WW},{x:330,y:226,w:96},{x:620,y:208,w:128},{x:1010,y:222,w:96},{x:1380,y:204,w:128},{x:1760,y:220,w:96},{x:2140,y:208,w:128},{x:2460,y:224,w:96}];
const E14=[['gbot',360],['gbot',500],['zdr',640],['tank',840],['gbot',1060],['zdr',1180],['gbot',1300],['tank',1500],['zdr',1700],['gbot',1820],['gbot',1980],['tank',2120],['zdr',2260],['gbot',2380],['tank',2520]];
const BELT14=[[700,900,1],[1420,1600,-1],[2050,2230,1]];  // [起点, 终点, 方向]
const MECH={I:null,D:'@@A:mech_atlas@@',M:{"bg":[0,0,272,160],"bld":[273,0,272,150],"far":[546,0,213,142],"fg":[0,161,272,104],"mb_idle":[273,161,288,72,72,4],"mb_walk":[562,161,432,72,72,6],"mb_attack1":[0,266,576,72,72,8],"mb_attack2":[577,266,432,72,72,6],"mb_attack3":[0,339,288,72,72,4],"mb_attack4":[289,339,432,72,72,6],"mb_sneer":[0,412,432,72,72,6],"mb_hurt":[433,412,144,72,72,2],"mb_death":[578,412,432,72,72,6],"gnd":[0,485,256,64],"boom":[257,485,330,52,55,6],"gbot_idle":[588,485,192,48,48,4],"gbot_walk":[781,485,192,48,48,4],"gbot_attack":[0,550,192,48,48,4],"gbot_hurt":[193,550,96,48,48,2],"gbot_death":[290,550,192,48,48,4],"zdr_idle":[483,550,192,48,48,4],"zdr_walk":[676,550,192,48,48,4],"zdr_attack":[0,599,192,48,48,4],"zdr_hurt":[193,599,96,48,48,2],"zdr_death":[290,599,192,48,48,4],"tank_idle":[483,599,192,48,48,4],"tank_walk":[676,599,192,48,48,4],"tank_attack":[0,648,192,48,48,4],"tank_hurt":[193,648,96,48,48,2],"tank_death":[290,648,192,48,48,4],"plat":[483,648,64,16],"belt":[548,648,64,16],"bullet":[613,648,12,6],"ball":[626,648,11,4]},
  // 帧里身体的位置(素材靠左摆):[身体中心 x, 身体高, 脚底 y]
  A:{gbot:[15.5,24,48],zdr:[15,21,35],tank:[17,34,48],mb:[35.5,52,72]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(e.k=='gbot'||e.k=='zdr'||e.k=='tank'||e.k=='mech')},
  // m = [x, y, 宽, 高, 帧宽, 帧数];第 i 帧画到 (X,Y) 左上角,放大 s,f<0 水平翻转
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;const fw=m[4]||m[2],n=m[5]||1;i=((Math.floor(i)%n)+n)%n;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(fw*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],0,0,fw*s,m[3]*s);c.restore()},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右);素材本来就朝右
  draw(c,e,t){const k=e.k,H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1));let row,fi;c.save();if(FLW)c.filter='brightness(2.6)';
    if(k=='mech'){const a=e.act,T=e.at||0,A=this.A.mb,s=H/A[1];row='mb_idle';fi=t*6;
      if(a=='msl'){row='mb_attack1';fi=Math.min(7,T/.12)}
      else if(a=='gun'){row='mb_attack3';fi=T<.6?0:1+Math.floor(t*14)%3}
      else if(a=='jmp'){row='mb_attack4';fi=T<.55?Math.min(1,T/.3):e.lt==null?2:Math.min(5,3+(T-e.lt)/.12)}
      else if(a=='call'){row='mb_sneer';fi=Math.min(5,T/.15)}
      else if(e.st>0){row='mb_hurt';fi=0}else if(e.mv){row='mb_walk';fi=t*10}
      this.fr(c,row,fi,-A[0]*s,-A[2]*s,s,1)}
    else{const A=this.A[k],s=H/A[1],st=e.s;row=k+'_idle';fi=t*8+(e.ph||0)*3;
      if(st&&st!='rec'){row=k+'_attack';fi=e.pz=='w'?0:1+Math.floor(t*12)%3}else if(e.st>0){row=k+'_hurt';fi=0}else if(e.mv)row=k+'_walk';
      this.fr(c,row,fi,-A[0]*s,-A[2]*s,s,1)}
    c.restore()},
  shot(f,fx,fy,t){if(f.c!=24||!this.I)return false;this.fr(x,'ball',0,fx-11,fy-4,2,f.vx<0?-1:1);return true},
  // 场景:四层视差(图集原尺寸,放大 2 倍画)+ 菱纹钢板地面 + 传送带 + 浮空传送带平台
  bg(){x.fillStyle='#16261f';x.fillRect(0,0,VW,VH);const I=this.I,M=this.M,t=performance.now()/1000;if(!I)return;x.imageSmoothingEnabled=false;
    const par=(k,p,bot,sc)=>{const m=M[k],w=m[2]*sc,h=m[3]*sc;for(let px=-(((cam*p)%w)+w)%w;px<VW;px+=w)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),Math.round(bot-h),Math.ceil(w),h)};
    par('bg',.03,VH,2.25);par('far',.12,GY+4,2);par('bld',.25,GY+6,2);par('fg',.45,GY+10,2);
    {const m=M.gnd;for(let px=Math.floor((cam-4)/m[2])*m[2];px<cam+VW+4;px+=m[2])x.drawImage(I,m[0],m[1],m[2],m[3],Math.round(px-cam),GY-4,m[2],m[3])}
    for(const [a,b,d] of BELT14){if(b<cam-20||a>cam+VW+20)continue;const m=M.belt,sh=((t*70*d)%16+16)%16;x.save();x.beginPath();x.rect(Math.round(a-cam),GY-6,b-a,18);x.clip();
      for(let px=a-16;px<b+16;px+=16){const q=px<a+16?0:px>=b-16?48:16+(((px-a)>>4)%2)*16;x.drawImage(I,m[0]+q,m[1],16,16,Math.round(px+(q==16||q==32?sh:0)-cam),GY-6,16,16)}x.restore()}
    for(const p of PL)if(p.y<GY&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20){const m=M.plat,px=Math.round(p.x-cam),y=Math.round(p.y-2),w=Math.round(p.w);
      x.drawImage(I,m[0],m[1],16,16,px,y,16,16);for(let q=16;q<w-16;q+=16){const c=Math.min(16,w-16-q);x.drawImage(I,m[0]+16+((q>>4)%2)*16,m[1],c,16,px+q,y,c,16)}x.drawImage(I,m[0]+48,m[1],16,16,px+w-16,y,16,16)}},
  // 画在角色之后:淡淡的青绿工业雾
  over(){x.fillStyle='rgba(20,60,40,.08)';x.fillRect(0,0,VW,VH)}};
MECH.init();
const m14In=()=>cur==14&&!INTOWN&&st=='play';
// ---- 齿轮巡逻兵:贴近后旋翼冲撞(短距离,撞墙就停)----
function gbotStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.6,1.4):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='spw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.45){e.s='spin';e.t=0;e.hd=0}return}
  if(s=='spin'){e.pz='s';e.x=cl(e.x+e.f*300*dt);if(Math.random()<dt*30)pt({x:cx,y:e.y+e.h*.3,vx:rnd(-80,80),vy:rnd(-80,-20),c:pick(['#ffd43b','#e9ecef']),s:2,l:.25});
    if(!e.hd&&ov(P,{x:e.x-6,y:e.y,w:e.w+12,h:e.h})&&hurt(10*dm,{kb:e.f*300}))e.hd=1;if(e.t>.45){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.45){e.s=null;e.cd=rnd(.8,1.4)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+30){e.x=cl(e.x+e.f*chV(62,ad)*dt);e.mv=1}
  if(e.cd<=0&&ad<150&&Math.abs(P.y+P.h-(e.y+e.h))<90){if(!tok(e)){e.cd=.3;return}e.s='spw';e.t=0;e.hd=0}}
// ---- 电击无人机(飞行):在主角斜上方盘旋 → 压到主角头顶放电(往旁边走开就躲掉)----
function zdrStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;e.gs=(e.gs||0)+dt;const s=e.s;if(s)e.t+=dt;e.f=sgn(dx)||e.f;
  if(s=='zw'){e.pz='w';if(e.t<.35)e.zx=pc;e.x=cl(e.x+(e.zx-e.w/2-e.x)*Math.min(1,dt*4));e.y+=(Math.min(GY-e.h-30,Math.max(e.by,P.y-e.h-2))-e.y)*Math.min(1,dt*5);if(e.t>=.7){e.s='zap';e.t=0;e.hd=0;syn('zap')}return}
  if(s=='zap'){e.pz='s';if(!e.hd&&e.t>.08&&ov(P,{x:e.x+4,y:e.y+e.h-6,w:e.w-8,h:46})){e.hd=1;hurt(9*dm,{kb:sgn(dx)*140})}if(e.t>.45){e.s='rec';e.t=0}return}
  if(s=='rec'){e.y+=(e.by-e.y)*Math.min(1,dt*2.5);if(e.t>.7){e.s=null;e.cd=rnd(1,1.8)}return}
  if(!e.side)e.side=Math.random()<.5?-1:1;const hx=pc+e.side*(80+20*Math.sin(e.gs*.9+e.ph));e.x=cl(e.x+(hx-e.w/2-e.x)*chL(Math.abs(dx),dt,1));e.y+=(e.by+Math.sin(e.gs*2.4+e.ph)*8-e.y)*Math.min(1,dt*2);e.mv=1;if(Math.random()<dt*.2)e.side*=-1;
  if(e.cd<=0&&Math.abs(dx)<230){if(!tok(e)){e.cd=.35;return}e.s='zw';e.t=0}}
// ---- 穹顶坦克(精英):慢,保持距离,瞄准后连发 3 颗贴地炮弹(跳过去)----
function tankStep(e,dt){const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.6){e.s='fire';e.t=0;e.n=0}return}
  if(s=='fire'){e.pz='s';if(e.n<3&&e.t>=e.n*.22){e.n++;F.push({x:cx+e.f*e.w*.5,y:e.y+e.h*.42,vx:e.f*250,vy:0,ng:1,c:24,dmg:9*e.dm,ht:9,s:1});syn('proj')}if(e.t>.9){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1.4,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>150){e.x=cl(e.x+e.f*chV(34,ad)*dt);e.mv=1}else if(ad<80){e.x=cl(e.x-e.f*24*dt);e.mv=1}
  if(e.cd<=0&&ad<MRNGR+10&&Math.abs(P.y+P.h-(e.y+e.h))<70){if(!tok(e,1)){e.cd=.4;return}e.s='aim';e.t=0}}
// ---- 首领:钢铁暴君 ----
let MKM=[],MKB=[],MKW=[],MKX=[];  // 落下的导弹 / 机枪子弹 / 地面冲击波 / 爆炸画面
function mkClr(){MKM=[];MKB=[];MKW=[];MKX=[]}
function mechEnd(e,x_){e.act=null;e.mv=0;e.cd=(e.p2?.8:1.1)+Math.random()*.5+(x_||0)}
function mkBoom(x_,y_,s,dm,r){MKX.push({x:x_,y:y_,s,t:0});shake=Math.max(shake,.2);syn('boom');if(dm&&Math.hypot(P.x+12-x_,P.y+P.h/2-y_)<r)hurt(dm,{kb:sgn(P.x+12-x_)*340})}
function mechStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1;e.pz=null;
  if(!e.intro){e.intro=1;banner('钢铁暴君 · 齿轮要塞的守门机甲')}
  if(lo&&!e.p2){e.p2=1;flash('120,255,200',.3)}
  if(!e.act){e.mv=0;e.y+=(e.gy-e.y)*Math.min(1,dt*10);e.cd-=dt*sp;e.f=sgn(dx)||e.f;if(ad>210){e.mv=1;e.x=gpCl(e,e.x+e.f*70*sp*dt)}else if(ad<80){e.mv=1;e.x=gpCl(e,e.x-e.f*50*dt)}
    if(e.cd>0)return;const Q=ad<150?['jmp','gun','msl']:['msl','gun','gun','jmp'];if(e.p2)Q.push('call','msl','jmp');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    if(a=='call'&&E.filter(o=>o.sum&&o.hp>0).length>=2)a='msl';
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tx=pc;e.jx0=null;e.lt=null;e.w2=0;return}
  e.at+=dt*sp;const T=e.at,a=e.act;
  if(a=='msl'){if(T<.5){e.pz='w';return}
    if(!e.hd){e.hd=1;syn('proj');const n=e.p2?9:6;for(let i=0;i<n;i++)MKM.push({x:i==0?pc:ARL+60+Math.random()*(ARR-ARL-120),y:-30,t:-(.45+i*.18),dm:e.dm})}
    if(T>1.6+(e.p2?.4:0))mechEnd(e,.2);return}
  if(a=='gun'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}
    e.pz='s';const n=e.p2?10:7;if(e.n<n&&T>=.6+e.n*.16){const h=e.p2&&e.n%2==1;MKB.push({x:cx+e.f*e.w*.48,y:h?GY-62:GY-20,vx:e.f*360,dm:e.dm,tr:0});e.n++;syn('proj')}
    if(T>.6+n*.16+.4)mechEnd(e);return}
  if(a=='jmp'){if(T<.55){e.pz='w';e.tx+=(pc-e.tx)*Math.min(1,dt*5);return}
    if(e.jx0==null)e.jx0=e.x;const k=Math.min(1,(T-.55)/.6),tx_=gpCl(e,e.tx-e.w/2);
    if(!e.hd){e.pz='s';e.x=e.jx0+(tx_-e.jx0)*k;e.y=e.gy-Math.sin(k*Math.PI)*150;if(Math.random()<dt*40)pt({x:e.x+e.w*rnd(.2,.8),y:e.y+e.h,vx:rnd(-30,30),vy:rnd(60,140),c:pick(['#96f2d7','#e6fcf5','#ffd43b']),s:2,l:.3})}
    if(k>=1&&!e.hd){e.hd=1;e.y=e.gy;e.lt=T;const c=e.x+e.w/2;mkBoom(c,GY-20,1.3,20*e.dm,e.w/2+30);shake=.4;for(const d of [-1,1])MKW.push({x:c,d,tr:0,hit:0,dm:e.dm});if(e.p2)e.w2=.4}
    if(e.w2>0){e.w2-=dt;if(e.w2<=0){const c=e.x+e.w/2;for(const d of [-1,1])MKW.push({x:c,d,tr:0,hit:0,dm:e.dm})}}
    if(T>1.9)mechEnd(e);return}
  if(a=='call'){if(T<.9){e.pz='w';return}
    if(!e.hd){e.hd=1;syn('zap');for(const d of [-1,1]){const o=mk('zdr',Math.max(ARL+20,Math.min(ARR-60,cx+d*170)),e.lm||21);o.sum=1;o.y=-40;E.push(o)}}
    if(T>1.3)mechEnd(e);return}
  mechEnd(e)}
// 场景 + 首领招式留在场上的东西:每帧推进 + 判定
function m14Step(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  if(gr&&!P.fly){const b=BELT14.find(r=>pc>r[0]&&pc<r[1]);if(b)P.x=Math.max(0,Math.min(WW-P.w,P.x+b[2]*70*dt))}  // 传送带
  for(const m of MKM){m.t+=dt;if(m.t<0)continue;m.y+=460*dt;if(m.y>=GY-10){m.d=1;mkBoom(m.x,GY-16,.7,14*m.dm,42)}}MKM=MKM.filter(m=>!m.d);
  for(const b of MKB){b.x+=b.vx*dt;b.tr+=Math.abs(b.vx)*dt;if(!b.d&&ov(P,{x:b.x-8,y:b.y-5,w:16,h:10})){b.d=1;hurt(9*b.dm,{kb:sgn(b.vx)*200})}}MKB=MKB.filter(b=>!b.d&&b.tr<BSHR*1.4&&b.x>ARL-20&&b.x<ARR+20);
  for(const w of MKW){w.x+=w.d*300*dt;w.tr+=300*dt;if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt(12*w.dm,{kb:w.d*300}))w.hit=1}MKW=MKW.filter(w=>w.tr<400&&w.x>ARL&&w.x<ARR);
  for(const b of MKX)b.t+=dt;MKX=MKX.filter(b=>b.t<.5)}
// 画面(PXL 层,怪物之后画):践踏落点预警、导弹落点预警 + 导弹、机枪子弹、冲击波、爆炸
function m14Fx(){const M=MECH;if(!M.I)return;const t=performance.now()/1000,e=B;
  if(e&&e.k=='mech'&&e.hp>0&&e.act=='jmp'&&(e.at||0)<1.15)DZ.zone(e.tx-80-cam,160);
  for(const m of MKM){DZ.zone(m.x-24-cam,48);if(m.t<0)continue;x.save();x.translate(Math.round(m.x-cam),Math.round(m.y));x.rotate(Math.PI/2);M.fr(x,'bullet',0,-12,-6,2,1);x.restore()}
  for(const b of MKB)M.fr(x,'bullet',0,b.x-cam-12,b.y-6,2,b.vx<0?-1:1);
  for(const w of MKW)M.fr(x,'boom',1+Math.floor(t*14)%3,w.x-cam-19,GY-36,.7,w.d);
  for(const b of MKX)M.fr(x,'boom',Math.min(5,b.t/.5*6),b.x-cam-27.5*b.s,b.y-26*b.s,b.s,1)}
