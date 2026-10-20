// ===== 怪物统一绘制:状态光环 → 预警(世界坐标)→ 身体(局部坐标)→ 血条 =====
const TELE={
 king(e){const a=e.act;if(e.bf>0){x.fillStyle='rgba(255,107,107,'+(.25+.1*Math.sin(performance.now()/80))+')';x.beginPath();x.ellipse(e.x+e.w/2-cam,e.y+34,62,44,0,0,7);x.fill()}
   if(a=='charge'&&e.at>=.6){x.globalAlpha=.35;for(let i=1;i<4;i++)LN_(x,[[e.x+e.w/2-cam-e.f*(30+i*14),e.y+20+i*9],[e.x+e.w/2-cam-e.f*(60+i*14),e.y+20+i*9]],'#fab005',3);x.globalAlpha=1}
   if((a=='bite'&&e.at<.5)||(a=='charge'&&e.at<.6)||(a=='spit'&&e.at<.5)||(a=='tail'&&e.at<.5)||(a=='shed'&&e.at<.8))WARN(x,e.x+e.w/2-cam,e.y-22);
   if(a=='tail'&&e.at<.5){const r=60*BRNG,c=e.x+e.w/2;DZ.zone(c-r-e.w/2-cam,2*r+e.w)}if(e.shd>0){x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.35+.1*Math.sin(performance.now()/120);E_(x,e.x+e.w/2-cam,e.y+e.h/2,e.w*.55,e.h*.55,'rgba(140,233,154,.5)',0);x.restore()}  // 第十六轮:尾鞭预警、蜕皮后的绿色护体
   if(a=='bite'&&e.at>=.5&&e.at<.75){const bw=50*BRNG;VFX.frame(x,'m-claw2',Math.min(3,Math.floor((e.at-.5)/.06)),(e.f>0?e.x+e.w-30+bw/2:e.x+30-bw/2)-cam,e.y+14,bw/32,e.f,0,1)}},
 sco(e){const a0=e.act,a=a0=='combo'?e.cact:a0,at=a0=='combo'?e.cat:e.at,t=performance.now()/1000;
   if(e.bf>0){x.fillStyle='rgba(201,42,42,'+(.18+.08*Math.sin(t*12))+')';x.beginPath();x.ellipse(e.x+e.w/2-cam,e.y+24,76,50,0,0,7);x.fill()}
   if(e.ug){mvUgDraw(e);return}
   if(a=='sweep'){const r=50*BRNG;if(at<.4)DZ.zone(e.x-r-cam,e.w+2*r);else if(at<.65){const i=Math.min(9,Math.floor((at-.4)/.025));VFX.frame(x,'crescent-slash',i,e.x-r/2-cam,GY-14,1.5,-1,0,1);VFX.frame(x,'crescent-slash',i,e.x+e.w+r/2-cam,GY-14,1.5,1,0,1)}}
   if(a=='claw'&&at<.4)WARN(x,e.x+e.w/2-cam,e.y-28);
   if(a=='claw'&&at>=.4&&at<.6){const r=40*BRNG;VFX.frame(x,'m-claw',Math.min(3,Math.floor((at-.4)/.05)),(e.f>0?e.x+e.w-10+r/2:e.x+10-r/2)-cam,e.y+e.h/2,r/32,e.f,0,1)}
   if(a=='sting'){const r=15*BRNG,sx=e.tx-cam;if(at<.6){DZ.zone(sx-r,2*r);WARN(x,sx,GY-16,.9)}
     else if(at<.75){const i=Math.min(23,Math.floor((at-.6)/.15*24));VFX.frame(x,'p-gey',i,sx,GY+2,1.4,1,0,1);VFX.frame(x,'m-poison',Math.floor(t*16)%12,sx,GY-10,1.4,1,0,.9)}}
   if((a=='buff'||a=='burrow')&&at<.5)WARN(x,e.x+e.w/2-cam,e.y-28)},
 ost(e){if(e.s=='cw'){const k=performance.now()/60;for(let i=0;i<3;i++)C_(x,(e.f>0?e.x-6-i*7:e.x+e.w+i*7)-cam,GY-4-((k+i)%3)*3,2.6,'#e6cc98',0)}
   if(e.s=='ch'){x.globalAlpha=.25;x.save();x.translate(e.x+e.w/2-cam-e.f*22,e.y+e.h);x.scale(e.f,1);E_(x,-2,-25,13,9,'#343a40',0);x.restore();x.globalAlpha=1}},
 spi(e){if(e.s=='pw')WARN(x,e.x+e.w/2-cam,e.y-12,.7)},
 mage(e){const t=performance.now()/1000;if(e.fire<.55&&!(e.tpT>0)){const sx=e.x+e.w/2-cam+e.f*13,sy=e.y+e.h-64;x.save();x.globalCompositeOperation='lighter';C_(x,sx,sy,22,RGD(x,sx,sy,22,['rgba(229,153,247,.9)','rgba(0,0,0,0)']),0);x.restore();WARN(x,e.x+e.w/2-cam,e.y-14)}
   // 第十六轮:暗影锁链的预警线 / 光束,黑暗领域的魔法阵,镜像
   if(e.act=='chain'&&e.tx!=null){const ox0=e.f>0?e.x+e.w:e.x,ox=ox0-cam,oy=e.y+18,vx=e.tx-ox0,vy=e.ty-oy,n=Math.hypot(vx,vy)||1;
     if(e.at<.7){if(!bwSkip()){x.save();x.strokeStyle='rgba(190,120,255,'+(e.at>=.4?.6+.4*Math.sin(t*40):.4)+')';x.lineWidth=2;x.setLineDash([6,6]);x.lineDashOffset=-t*40;x.beginPath();x.moveTo(ox,oy);x.lineTo(ox+vx/n*600,oy+vy/n*600);x.stroke();x.restore()}}
     else if(e.at<1.05){const q=Math.min(1,(1.05-e.at)/.2),g=Math.min(1,(e.at-.7)/.06),an=Math.atan2(vy,vx),mx=ox+vx/n*300,my=oy+vy/n*300,th=Math.floor(t*15);x.save();x.globalCompositeOperation='lighter';  // 第二十九轮:激光加粗(判定半宽 26)+ 紫色光束素材 + 魔焰
       VFX.frame(x,'bm-purp',0,mx,my,600/64,1,an,q*.7,(70*g+Math.sin(t*50)*4)/24/(600/64));VFX.frame(x,'bm-purp',0,mx,my,600/64,1,an,q,(40*g)/24/(600/64));VFX.frame(x,'bm-purp',0,mx,my,600/64,1,an,q,(14*g)/24/(600/64));
       for(let i=0;i<6;i++){const d=((t*500+i*100)%600);VFX.frame(x,'x-spell',th+i*4,ox+vx/n*d,oy+vy/n*d,1.1,1,an,q*.8)}VFX.frame(x,'x-midnight',th,ox,oy,1.4,1,0,q);x.restore()}}
   for(const z of e.zn||[])if(z.t<1.1)DZ.zone(z.x-40-cam,80);
   for(const c of e.cl||[]){x.save();x.globalAlpha=.5;x.translate(c.x-cam,c.y+42);x.scale(sgn(P.x+12-c.x)||1,1);BOS.mage(x,{fire:Math.max(.01,.55-c.t*.6),tpT:0,st:0,al:.6},t);x.restore()}},
 boss(e){const a=e.act,t=performance.now()/1000;
   if(a=='charge'&&e.at<.8){const c=e.x+e.w/2,w=e.f>0?WW-10-c:c-2620;DZ.zone((e.f>0?c:2620)-cam,w);for(let i=0;i<3;i++)VFX.frame(x,'m-dust',(Math.floor(t*12)+i)%4,(e.f>0?e.x+10:e.x+e.w-10)-cam-e.f*i*12,GY,.7,-e.f,0,1-i*.25)}
   if(a=='slam'&&e.at<.7){const r=120;DZ.zone((e.f>0?e.x+e.w-20:e.x+20-r)-cam,r)}
   if(a=='slam'&&e.at>=.72&&e.at<1.02){const r=e.hp<e.max/2?130:90;DZ.zone((e.f>0?e.x+20-r:e.x+e.w-20)-cam,r)}  // 第十六轮:流星锤荡回来扫身后的预警
   if(a=='stomp'&&e.at<1.8&&e.at%.6<.4){const c=e.x+e.w/2,r=e.w/2+70;DZ.zone(c-r-cam,2*r)}
   if(a=='roar'&&e.at<1)WARN(x,e.x+e.w/2-cam,e.y-24,1.1);
   for(const w of e.wv||[]){const wx=w.x-cam,q=Math.min(1,(360-w.tr)/60);VFX.frame(x,'earth-rupture',Math.floor(t*16+w.x*.05)%(VFX.M['earth-rupture']?VFX.M['earth-rupture'].n:4),wx,GY,1.25,w.d,0,q);VFX.frame(x,'m-dust',Math.floor(t*14+w.x*.05)%4,wx-w.d*14,GY,1.5,w.d,0,q)}  // 第二十六轮:原来是半透明小烟尘,看不清
   if(a=='leap'&&e.at<1.2){const r=e.hp<e.max/2?150:110,c=e.lx+e.w/2;DZ.zone(c-r-e.w/2-cam,2*r+e.w)}}};
function drawE(e){const q=BWQ,qe=BWE;if(e.max){BWQ=1;BWE=e}try{drawE0(e)}finally{BWQ=q;BWE=qe}}  // 第二十四轮:画首领时屏蔽预警
function drawE0(e){if(e.k=='mir'||e.x+e.w<cam-200||e.x>cam+VW+200)return;  // 镜中无名在 draw 里用 drawMir 画
const t=performance.now()/1000,cx=e.x+e.w/2-cam;
  if(e.ug&&((e.s&&MVK[e.k]&&e.k!='seal'&&e.k!='seal2')||e.k=='sco')){mvUgDraw(e);return}  // 第十六轮:潜沙中的蝎子 / 蜘蛛 / 巨蝎只画沙痕
  if(e.ar>0&&!e.ug){x.strokeStyle='rgba(255,146,43,'+(.5+.3*Math.sin(performance.now()/70))+')';x.lineWidth=2.4;x.beginPath();x.ellipse(cx,e.y+e.h/2,e.w/2+8,e.h/2+8,0,0,7);x.stroke()}
  if(e.st>0&&(!e.max||e.st>.3)){const q=performance.now()/90,n=e.st>1?3:2,r=e.max?Math.min(30,e.w*.3):9;for(let i=0;i<n;i++)CT('★',cx+Math.cos(q+i*6.283/n)*r,e.y-6+Math.sin(q+i*6.283/n)*2,e.st>1?11:9,e.st>1?'#a5d8ff':'#ffd43b','center',2.2)}
  if(e.tnt>0&&!e.max&&!(e.st>0)){const q=performance.now()/1000;CT('?',cx+Math.sin(q*6)*2,e.y-8-Math.abs(Math.sin(q*5))*3,12,'#b2f2bb','center',2.6,'#1e5a2a')}
  if(e.psl&&e.sl>0&&!e.ug){x.strokeStyle='rgba(116,192,252,.85)';x.lineWidth=2;x.beginPath();x.ellipse(cx,e.y+e.h,e.w/2+6,4,0,t*3,t*3+4.5);x.stroke();CT('🐌',cx,e.y-10,10,'#74c0fc','center',0)}
  if((e.wu>0||e.wu2>0)&&!e.ug)WARN(x,cx,e.y-14,.75);
  if(!e.ug&&(e.bld>0||e.mkT>0||e.mkF>0)){const L=[];if(e.bld>0)L.push(['裂','#ff8787']);if(e.mkT>0)L.push(['雷','#a5d8ff']);if(e.mkF>0)L.push(['火','#ffa94d']);L.forEach((q,i)=>{const ix=cx+(i-(L.length-1)/2)*13,iy=e.y-(e.max?30:22);RR(x,ix-5.5,iy-5.5,11,11,2.5,'rgba(20,12,28,.85)',1);CT(q[0],ix,iy+3.5,8,q[1],'center',0)})}  // 第十六轮:裂伤 / 雷印 / 火印 标记
  if(e.pz=='w'&&!e.ug&&!(e.k=='bear'&&e.act=='hug'))WARN(x,cx+(e.k=='bear'?e.f*20:0),e.y-(e.k=='bear'?(e.act=='slam'||e.act=='roar'||e.act=='ball'||e.act=='bliz'||e.act=='combo'&&e.n>=2?100:30):14),e.k=='bear'?1.1:.75);
  if(e.k=='bear')bearFx(e);if(e.k=='andr'||e.k=='wiz')arsFx(e);if(e.k=='dog2')dogFx(e);
  const tk=e.k=='sco'?'sco':e.k;if(TELE[tk]&&(e.k=='king'||e.k=='sco'||e.k=='ost'||e.k=='spi'||e.k=='mage'||e.k=='boss'))TELE[tk](e);
  FLW=e.fl>0?1:0;x.save();x.translate(Math.round(cx*RS)/RS,e.y+e.h);{const vs=e.max?1.1*(e.bsz||1):(e.vs||1);x.scale(e.f*vs,vs)}
  {const q=monPose(e,t);if(q.dx)x.translate(q.dx,0);if(q.dy)x.translate(0,q.dy);if(q.lean)x.rotate(q.lean);if(q.sx!=1||q.sy!=1)x.scale(q.sx,q.sy)}
  if(e._sk&&!e._psk)mfxSwing(e);e._psk=e._sk;
  if(PPF.on(e))PPF.draw(x,e,t);else if(DMN.on(e))DMN.draw(x,e,t);else if(IFN.on(e))IFN.draw(x,e,t);else if(RBT.on(e))RBT.draw(x,e,t);else if(ALC.on(e))ALC.draw(x,e,t);else if(NJA.on(e))NJA.draw(x,e,t);else if(FIRE.on(e))FIRE.draw(x,e,t);else if(CST.on(e))CST.draw(x,e,t);else if(MECH.on(e))MECH.draw(x,e,t);else if(GP.on(e))GP.draw(x,e,t);else if(MYST.on(e))MYST.draw(x,e,t);else if(SHIP10.on(e))SHIP10.draw(x,e,t);else if(VOL9.on(e))VOL9.draw(x,e,t);else if(GH8.on(e))GH8.draw(x,e,t);else if(MNT.on(e))MNT.draw(x,e,t);else if(MOB.on(e))MOB.draw(x,e,t);else(e.k=='sco'?MON.sco_b:e.k=='ysco'||e.k=='bsco'?MON.sco:MON[e.k]||MON.boss)(x,e,t);x.restore();FLW=0;
  if(e.k=='sco'&&e.sh>0&&BFX.ok())VFX.frame(x,'b-shield',Math.floor(t*10)%6,cx,e.y+22,2.6,1,0,.35+.08*Math.sin(t*8));else if(e.k=='sco'&&e.sh>0){x.strokeStyle='rgba(116,192,252,'+(.65+.25*Math.sin(t*8))+')';x.lineWidth=3;x.beginPath();x.ellipse(cx,e.y+18,72,50,0,0,7);x.stroke();x.fillStyle='rgba(116,192,252,.12)';x.fill()}
  // 小怪血条(受伤后显示)
  if(!e.max&&!e.ug){if(e.mh==null)e.mh=e.hp;if(e.hp<e.mh){const bw=Math.max(22,e.w),bx=cx-bw/2,by=e.y-(e.k=='ost'?16:9);RR(x,bx-1,by-1,bw+2,5,2,'#2b1a12',0);RR(x,bx,by,bw*Math.max(0,e.hp)/e.mh,3,1.5,LG(x,0,by,0,by+3,['#ffb347','#e8590c']),0)}}}
