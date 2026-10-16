// ===== 法师进阶技能:影分身 / 岩盾陨石 / 高天之歌 / 战意爆发 =====
// CLN:影分身(CLNT 6 秒,再按一次互换位置);P.shd/P.shdT/P.met:岩盾(8 秒)和待放的陨石;MET:下落中的陨石;WE:风眼;P.wy:战意爆发剩余秒数
// =====================================================================
let CLN=null,WE=[],MET=[];
const CLNT=6;  // 第三十一轮:影分身持续 6 秒(原 4 秒)
const pLo=()=>bossOn?2570:10;
const clX=v=>Math.max(pLo(),Math.min(xMax(),v));
function smoke(cx,cy){VFX.spawn('smoke-puff',cx,cy+6);burst(cx,cy,18,['#5f3dc4','#9775fa','#d0bfff','#495057'],170,{s:6,l:.5,dr:4,gr:.6});ring(cx,cy,6,40,'#9775fa',.35,4)}
function magStart(i,S){const f=P.f,cx=P.x+12;
  if(i==4){CD.staff[4]=0;CLN={x:clX(P.x+f*36),y:P.y,vy:0,vx:0,f,t:0,land:P.gr&&!P.fly?1:0,ak:.35,an:0,sw:0,cs:0};smoke(CLN.x+12,CLN.y+16);  // 第二十七轮:分身直接出现在身前(不再抛出去)
    tx('影分身!',P.x-10,P.y-30,'#b197fc')}
  else if(i==5){CD.staff[5]=0;P.shd=P.shdM=Math.round(S.hp*.25);P.shdT=8;P.met=1;ring(cx,P.y+16,6,46,'#a0703a',.4,6);burst(cx,P.y+16,20,['#8d6e4a','#c9a27a','#5c4a3a'],200,{s:4,l:.5,g:400,dr:4});shake=Math.max(shake,.15);
    tx('岩盾 +'+P.shd+'(再按一次召唤陨石)',P.x-50,P.y-34,'#e0b984');VFX.spawn('arcane-parry',cx,P.y+P.h,{s:1})}
  else if(i==6){for(const w of WE)if(w.vq)w.vq.life=.01;WE=[{x:Math.max(pLo()+40,Math.min(xMax()+P.w-10,cx+f*150)),y:GY-72,t:10,tk:.5,a:0,el:{}}];ring(WE[0].x,WE[0].y,4,70,'#96f2d7',.4,5);tx('高天之歌',P.x-14,P.y-30,'#96f2d7');VFX.spawn('rift-portal',WE[0].x,WE[0].y,{s:1.5,life:10,add:1,a:.55,at:null});WE[0].vq=SFX5('t-swirl',WE[0].x,WE[0].y,{s:2.4,life:10,rs:2,a:.75,fi:.3})}
  else if(i==7){P.wy=10;for(const w in CD)for(let j=0;j<CD[w].length;j++)if(!(w=='staff'&&j==7))CD[w][j]=0;
    flash('255,120,90',.35);shake=Math.max(shake,.2);ring(cx,P.y+16,6,70,'#ff6b6b',.45,7);burst(cx,P.y+16,30,['#ff6b6b','#ffa94d','#ffe066'],320,{sh:1,s:3,l:.5,dr:3});pillar(cx,22,'rgba(255,107,107,.85)',.4);
    tx('战意爆发!攻击 +30%,技能冷却已重置',P.x-70,P.y-34,'#ff8787');VFX.spawn('mass-release',cx,P.y+P.h,{s:1.3});SFX5('r-wing',cx,P.y+2,{s:1.6,life:.8});SFX5('r-burst',cx,P.y+8,{s:2,life:.6,gr:.4})}}
// 第三十轮:影分身自己打 —— 不再跟着主角放技能;自己找最近的敌人,走过去,用球形闪电普攻,隔 1.2~1.8 秒随机放一个攻击技能
// (H 落雷 / I 火球 / O 乌云 / W空 圣光禁域 / S空 火鸟图腾 / WW空 苍穹光柱,伤害 CLK 60%,不耗魔力;分身自己的火鸟 / 光柱还在时不选;第三十一轮起和主角的共存)
const CLSK=[0,2,3,5,6,7];
function cloneAI(c,dt,S){const tg=allTg().filter(e=>!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-(c.x+12))<480).sort((a,b)=>Math.abs(a.x+a.w/2-c.x)-Math.abs(b.x+b.w/2-c.x))[0];
  c.mv=0;c.ak=(c.ak||0)-dt;c.scd=(c.scd==null?.3:c.scd)-dt;
  if(c.sk){const k=c.sk;k.t+=dt;cloneSkStep(c,k,S);if(k.t>=k.end){c.sk=null;c.scd=rnd(1.2,1.8)}return}
  if(c.swT!=null){c.swT+=dt;if(!c.mbd&&c.swT>=c.swD){c.mbd=1;const q=MGA[0];PB.push({x:c.f>0?c.x+P.w:c.x-10,y:c.y+14,vx:c.f*MGV,dmg:Math.round(S.atk*q[2]*CLK),r:12,lb:1,hit:new Set(),rg:MAGR})}if(c.swT>=c.swR+.15)c.swT=null;return}
  if(!tg)return;const dx=tg.x+tg.w/2-(c.x+12);c.f=sgn(dx)||c.f;
  if(Math.abs(dx)>220){c.x=clX(c.x+c.f*150*dt);c.mv=1;return}
  if(c.scd<=0){const ok=CLSK.filter(i=>!(i==6&&MGTc)&&!(i==7&&MGPc)),i=pick(ok);c.sk={id:'mc',i,t:0,T:MCT[i][0],end:MCT[i][1]};c.cs=.3;return}
  if(c.ak<=0){c.ak=MGA[0][1]+.1;c.swT=0;c.swC='s';c.swD=MGA[0][0];c.swR=MGA[0][1];c.mbd=0}}
function cloneSkStep(c,k,S){const f=c.f,i=k.i,ox=c.x+12+f*30,oy=c.y+12,dm=j=>Math.round(skD('staff',j,S)*CLK);
  if(MCIR[i]&&!k.c&&k.t>=.12){k.c=1;VFX.spawn(MCIR[i],ox,oy,{s:.62,gr:.75,life:.72,rs:f*1.6,add:1,hold:1,fi:.15})}
  if(k.a||k.t<k.T)return;k.a=1;const near=(w)=>allTg().filter(e=>!e.ug&&e.hp>0&&(e.x+e.w/2-(c.x+12))*f>-40&&Math.abs(e.x+e.w/2-(c.x+12))<w).sort((a,b)=>Math.abs(a.x-c.x)-Math.abs(b.x-c.x))[0];
  if(i==0){const t=near(340),bx=t?t.x+t.w/2:c.x+12+f*160;bolt(bx,dm(0),34,0,0)}
  else if(i==2)PB.push({x:ox,y:oy,vx:f*220,dmg:dm(2),r:26,fs:3,col:'#ff6b35',sl:1,fb:1,pierce:1,hit:new Set()});
  else if(i==3)CL2={x:c.x+12,t:5,k:0,fk:0,dm:CLK};
  else if(i==5)PB.push({x:ox,y:oy,vx:f*260,dmg:dm(5),r:20,gl:1,rg:360,hit:new Set()});
  else if(i==6&&!MGTc){MGTc={x:clX(c.x+12),y:GY-112,f,t:5,tk:.3,an:0,dmg:dm(6)};SFX5('r-burst',MGTc.x,MGTc.y,{s:1.6,life:.5,gr:.4});psx('fire')}
  else if(i==7&&!MGPc){const t=near(360);MGPc={x:clX(t?t.x+t.w/2:c.x+12+f*150),t:5.3,tk:.3,a:0,dmg:dm(7),bs:new Set()};psx('thunder')}
  burst(ox,oy,10,['#b197fc','#e5dbff','#fff'],150,{s:2.5,l:.3})}
// 分身 = 和主角同一套纸娃娃(把主角的状态临时换成分身的画一遍),画在离屏画布上再整体染紫、半透明
const CLC={cv:null},CLK_P=['x','y','f','vx','vy','gr','fly','run','an','sk','cs','swT','swR','swD','swC','ch','stg','rc','rT','inv','stun','frz','ps','ar','mode'];
function drawClone(){const c=CLN;if(!c)return;const a=Math.min(1,(CLNT-c.t)*3,.82),W=cv.width,H=cv.height;let o=CLC.cv;if(!o||o.width!=W||o.height!=H){o=CLC.cv=document.createElement('canvas');o.width=W;o.height=H}
  const g=o.getContext('2d');g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.filter='none';g.clearRect(0,0,W,H);g.setTransform(x.getTransform());g.imageSmoothingEnabled=false;
  const sv={};for(const k of CLK_P)sv[k]=P[k];
  Object.assign(P,{x:c.x,y:c.y,f:c.f,vx:c.mv?c.f*150:0,vy:c.vy||0,gr:!!c.land,fly:0,run:0,an:c.an,sk:c.sk,cs:null,swT:c.swT,swR:c.swR,swD:c.swD,swC:c.swC,ch:0,stg:c.stg,rc:c.rc,rT:c.rT,inv:0,stun:0,frz:0,ps:0,ar:0,mode:'staff'});
  const m=x;x=g;try{drawPBody()}finally{x=m;c.rc=P.rc;c.rT=P.rT;c.stg=P.stg;Object.assign(P,sv)}
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(130,80,255,.5)';g.fillRect(0,0,W,H);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=a;x.drawImage(o,0,0);x.globalCompositeOperation='lighter';x.globalAlpha=a*.3;x.drawImage(o,0,0);x.restore()}
// 影分身:再按一次互换位置(0.3 秒无敌),冷却从互换时开始算
function cloneSwap(){const c=CLN,ox=P.x,oy=P.y;smoke(ox+12,oy+16);smoke(c.x+12,c.y+16);psx('blink');P.x=c.x;P.y=c.y;P.vy=0;c.x=ox;c.y=oy;c.land=0;c.vx=0;c.vy=0;c.sw=1;
  P.inv=Math.max(P.inv||0,.3);CD.staff[4]=skCdA('staff',4);ghost('#7048e8',.3);tx('互换!',P.x-6,P.y-24,'#b197fc')}
// 陨石:护盾存在时再按一次,砸向面前
function metCast(S){const f=P.f;MET.push({x:Math.max(pLo()+40,Math.min(xMax()+P.w+60,P.x+12+f*140)),f,t:0,dmg:skD('staff',5,S)});P.met=0;CD.staff[5]=skCdA('staff',5);psx('fire');tx('陨石!',P.x-6,P.y-30,'#ffa94d')}
// 风眼吸收元素:火球、落雷 / 雷云打进风眼
function weAbs(x0,y0,k){for(const w of WE)if(!w.el[k]&&Math.abs(x0-w.x)<120&&(y0==null||Math.abs(y0-w.y)<130)){w.el[k]=1;psx('buff');ring(w.x,w.y,6,90,k=='fire'?'#ff922b':'#74c0fc',.45,6);tx(k=='fire'?'风眼吸收了火焰!':'风眼吸收了雷电!',w.x-50,w.y-80,k=='fire'?'#ffa94d':'#a5d8ff')}}
function magStep(dt,S,all){
  if(P.wy>0){P.wy-=dt;if(Math.random()<dt*30)pt({x:P.x+12+rnd(-12,12),y:P.y+rnd(4,30),vx:rnd(-20,20),vy:rnd(-90,-40),c:pick(['#ff6b6b','#ff922b','#ffd43b']),s:rnd(2,3.5),l:rnd(.3,.5),sh:2})}
  if(P.gd2>0){P.gd2-=dt;if(P.gd2<=0){P.gd2=0;CD.sword[2]=skCdA('sword',2)}}  // 天崩地裂:4 秒内没放第二段就开始冷却
  if(P.shdT>0){P.shdT-=dt;if(P.shd<=0||P.shdT<=0){if(P.shd<=0){burst(P.x+12,P.y+16,18,['#8d6e4a','#c9a27a'],220,{s:4,l:.5,g:500});tx('护盾破了',P.x-10,P.y-30,'#c9a27a')}P.shdT=0;P.shd=0;if(P.met){P.met=0;CD.staff[5]=skCdA('staff',5)}}}
  if(CLN){const c=CLN;c.t+=dt;c.an+=dt;
    if(!c.land){const fy0=c.y+P.h;c.vy+=1100*dt;c.x=clX(c.x+c.vx*dt);c.y+=c.vy*dt;const fy=c.y+P.h;let sy=null;
      if(c.vy>0){for(const p of PL)if(!p.gone&&fy0<=p.y+1&&fy>=p.y&&c.x+12>p.x&&c.x+12<p.x+p.w){sy=p.y;break}if(sy==null&&fy>=GY)sy=GY}
      if(sy!=null){c.y=sy-P.h;c.land=1;c.vx=0;burst(c.x+12,sy-2,10,['#d0bfff','#9775fa'],120,{s:3,l:.35})}}
    else{cloneAI(c,dt,S);
      // 走出平台就落下
      const fy=c.y+P.h;if(fy<GY-1&&!PL.some(p=>!p.gone&&Math.abs(p.y-fy)<2&&c.x+12>p.x&&c.x+12<p.x+p.w)){c.land=0;c.vy=0;c.vx=0}}
    if(Math.random()<dt*12)pt({x:c.x+12+rnd(-10,10),y:c.y+rnd(6,30),vx:rnd(-10,10),vy:rnd(-40,-10),c:pick(['#5f3dc4','#9775fa']),s:rnd(2,3),l:.4,sh:2});
    if(c.t>=CLNT){smoke(c.x+12,c.y+16);if(!c.sw)CD.staff[4]=skCdA('staff',4);CLN=null}}
  for(const m of MET){m.t+=dt;if(m.t>=.55&&!m.h){m.h=1;VFX.spawn('warm-explosion',m.x,GY-4,{s:2.6});SFX5('r-cross',m.x,GY-50,{s:2.6,life:.6,gr:.3});SFX5('r-burst',m.x,GY-60,{s:2.6,life:.7,gr:.3});VFX.spawn('earth-rupture',m.x,GY,{s:1.5});psx('boom','slam');shake=.5;hitstop(.08);flash('255,170,90',.4);ring(m.x,GY-4,8,130,'#ff922b',.5,7,.25);ring(m.x,GY-4,5,80,'#ffe066',.35,4,.25);crack(m.x,5,120);
      burst(m.x,GY-12,34,['#8d6e4a','#5c4a3a','#ff922b','#ffd43b'],420,{s:4,l:.7,g:700,dr:3});for(let n=0;n<14;n++)pt({x:m.x+rnd(-30,30),y:GY-6,vx:rnd(-260,260),vy:rnd(-420,-160),g:1400,c:pick(['#8d6e4a','#5c4a3a','#a0703a']),ad:0,s:rnd(3,5),l:.8,bn:1});
      hitFx='slam';for(const e of all)if(!e.ug&&Math.abs(e.x+e.w/2-m.x)<e.w/2+170&&e.y+e.h>GY-220){mkF(e);dealt(e,Math.round(m.dmg*rnd(.9,1.1)));e.ms=3;tx('减速',e.x+e.w/2,e.y-22,'#c9a27a')}hitFx=null}}
  MET=MET.filter(m=>m.t<1.1);
  for(const w of WE){w.t-=dt;w.a+=dt*7;
    const wz=(()=>{let z=ZB.findIndex(b=>w.x<b);return z<0?ZB.length:z})();
    for(const e of all){if(e.ug||e.hp<=0||isBig(e))continue;const dx=w.x-(e.x+e.w/2),ad=Math.abs(dx);if(e.zi===wz||(!(e.zi>=0)&&ad<600)||ad<140&&e.y+e.h>w.y-120&&e.y<w.y+120){e.x+=sgn(dx)*Math.min(ad,Math.max(110,ad*1.3)*dt);if(e.by!=null)e.by+=(w.y-10-e.by)*Math.min(1,dt*1.2);if(ad<60&&Math.random()<dt*6)pt({x:e.x+e.w/2,y:e.y+e.h/2,vx:sgn(dx)*60,vy:-30,c:'#c3fae8',s:2,l:.3})}}
    if(Math.random()<dt*40){const a=rnd(0,6.28),r=rnd(80,130);pt({x:w.x+Math.cos(a)*r,y:w.y+Math.sin(a)*r*.6,vx:-Math.cos(a)*120,vy:-Math.sin(a)*70,c:w.el.fire&&Math.random()<.4?'#ffa94d':w.el.th&&Math.random()<.4?'#a5d8ff':pick(['#c3fae8','#e6fcf5','#fff']),s:rnd(1.5,2.5),l:.6})}
    w.tk-=dt;if(w.tk<=0){w.tk+=.5;let any=0;
      for(const e of all){if(e.ug||e.hp<=0)continue;if(Math.abs(e.x+e.w/2-w.x)<e.w/2+160&&e.y+e.h>w.y-140&&e.y<w.y+140){any=1;const b=Math.round(skD('staff',6,S)*rnd(.9,1.1));hitFx=null;dealt(e,b,{ns:1});
        if(w.el.fire)dealt(e,Math.max(1,Math.round(b*.2)),{ns:1});if(w.el.th)dealt(e,Math.max(1,Math.round(b*.2)),{ns:1})}}
      if(any){psx('swing');if(w.el.fire)tx('🔥 火',w.x-24,w.y-60,'#ffa94d');if(w.el.th)tx('⚡ 雷',w.x+8,w.y-60,'#a5d8ff')}}}
  WE=WE.filter(w=>w.t>0)}
function drawMag(){const t=performance.now()/1000;
  for(const w of WE){const wx=w.x-cam,al=Math.min(1,w.t*2,(10-w.t)*3);if(wx<-160||wx>VW+160)continue;x.save();x.globalAlpha=al;x.globalCompositeOperation='lighter';
    C_(x,wx,w.y,120,RGD(x,wx,w.y,120,[w.el.fire?'rgba(255,150,70,.32)':w.el.th?'rgba(120,180,255,.32)':'rgba(150,242,215,.28)','rgba(0,0,0,0)']),0);
    for(let k=0;k<5;k++){const r=22+k*20,q=w.a*(1.4-k*.18)+k;x.strokeStyle=k%2?'rgba(195,250,232,.75)':(w.el.fire&&k==2?'rgba(255,169,77,.85)':w.el.th&&k==4?'rgba(165,216,255,.9)':'rgba(230,252,245,.6)');x.lineWidth=3-k*.3;x.beginPath();x.ellipse(wx,w.y,r,r*.55,0,q,q+3.6);x.stroke()}
    C_(x,wx,w.y,9,RGD(x,wx,w.y,9,['#fff','rgba(150,242,215,.5)']),0);x.restore();
    if(w.el.th&&Math.random()<.2){x.save();x.globalCompositeOperation='lighter';poly(zline(w.x-30,w.y-20,w.x+30,w.y+15),2,'#e7f5ff');x.restore()}}
  for(const m of MET){const p=Math.min(1,m.t/.55),gx=m.x-cam;
    if(!m.h){x.save();x.globalAlpha=.25+.3*p;E_(x,gx,GY-2,110*p,10*p,'rgba(255,80,40,.5)',0);x.restore();
      const sx=gx-m.f*200*(1-p),sy=-90+(GY-80)*p;x.save();x.globalCompositeOperation='lighter';for(let k=1;k<7;k++){const q=Math.max(0,p-k*.05);C_(x,gx-m.f*200*(1-q),-90+(GY-80)*q,52-k*6,'rgba(255,'+(130-k*12)+',50,'+(.4-k*.05)+')',0)}
      C_(x,sx,sy,80,RGD(x,sx,sy,80,['rgba(255,110,40,.75)','rgba(255,50,20,.3)','rgba(0,0,0,0)']),0);x.restore();VFX.frame(x,'met-rock',0,sx,sy,1.3,m.f,t*2.5*m.f,1)}  // 陨石:Pixel Art 2D Asteroid Pack(Cayden Franklin,CC-BY 4.0)压成焦黑色
    else{x.globalAlpha=Math.max(0,1-(m.t-.55)/.55);E_(x,gx,GY-2,90,9,'rgba(60,40,30,.5)',0);x.globalAlpha=1}}}
// 身上的岩盾 / 战意气焰(画在角色前后)
function drawPAura(back){const cx=P.x+12-cam,t=performance.now()/1000;
  if(back&&P.wy>0){x.save();for(let i=0;i<7;i++){const ph=t*6+i*.9,h=36+Math.sin(ph)*8-Math.abs(i-3)*4,ox=(i-3)*6;x.globalAlpha=.42+.14*Math.sin(ph*1.3);PG(x,[[cx+ox-8,P.y+P.h],[cx+ox+Math.sin(ph)*4,P.y+P.h-h-10],[cx+ox+8,P.y+P.h]],i%2?'#e03131':'#ff6b35',0)}
    x.globalCompositeOperation='lighter';x.globalAlpha=.4;C_(x,cx,P.y+16,30,RGD(x,cx,P.y+16,30,['rgba(255,90,90,.7)','rgba(0,0,0,0)']),0);x.restore()}
  if(!back&&P.shdT>0&&P.shd>0){const k=P.shd/P.shdM;x.save();x.globalAlpha=.55+.15*Math.sin(t*5);for(let i=0;i<8;i++){const a=t*1.2+i*.785,rx=cx+Math.cos(a)*22,ry=P.y+16+Math.sin(a)*24;PG(x,[[rx-5,ry-3],[rx,ry-6],[rx+5,ry-2],[rx+3,ry+5],[rx-4,ry+4]],i%2?'#a0703a':'#8d6e4a',1)}
    x.strokeStyle='rgba(224,185,132,.7)';x.lineWidth=2;x.beginPath();x.ellipse(cx,P.y+16,24,27,0,0,6.283*k);x.stroke();x.restore()}}

function zStep(dt,S,all){VFX.step(dt);stmStep(dt,S,all);magStep(dt,S,all);mgStep(dt,all);for(const z of Z)z.t-=dt;Z=Z.filter(z=>z.t>0);
  CL=clStep(CL,dt,S,all);CL2=clStep(CL2,dt,S,all)}
// 雷云(主角的 CL、分身的 CL2,dm = 伤害倍率)
function clStep(C,dt,S,all){if(!C)return null;C.t-=dt;C.k-=dt;C.fk=Math.max(0,(C.fk||0)-dt);FX.dk=Math.max(FX.dk,Math.min(.38,C.t*.4));if(C.k<=0){C.k=.5;C.fk=.12;for(let n=0;n<3;n++){const c=all.filter(e=>e.x+e.w>cam&&e.x<cam+VW),e=c[Math.random()*c.length|0];C.fx=(e?e.x+e.w/2:cam+rnd(30,VW-30))-cam;bolt(e?e.x+e.w/2:cam+rnd(30,VW-30),Math.round(skD('staff',3,S)*(C.dm||1)),30,58)}}return C.t<=0?null:C}
