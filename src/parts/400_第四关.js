// ===== 第四关 · 毒棘密林 =====
function sEnd(e,lo){e.act=null;e.hd2=0;e.cd=(lo?.9:1.3)/bsp(e)}
// 第十六轮重做(黑棘巨蝎):钳击连段 combo(左钳 → 右钳 → 扫尾)/ 扫尾 sweep / 连环毒针 sting(两针,半血三针)/ 潜沙伏击 burrow(沙痕追踪 → 脚下预警 → 钻出顶飞)/ 毒雾领域 buff(防御 +100%、护盾、撒 3 片毒雾)
function scoBStep(e,dt){const lo=e.hp<e.max/2,A=2600,Bx=WW-e.w,cl=v=>Math.max(A,Math.min(Bx,v));
  e.bf=Math.max(0,(e.bf||0)-dt);e.vc=(e.vc||0)-dt;if(e.shT>0){e.shT-=dt;if(e.shT<=0){e.shT=0;e.sh=0}}
  if((e.dg>0||!e.act)&&bDodge(e,dt,lo,A,Bx,60))return;
  const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),K=LDM*STK().atk;
  if(!e.act){e.f=sgn(dx);e.x=cl(e.x+e.f*(ad>140?120:ad<70?-50:30)*dt);e.cd-=dt;
    if(e.cd<=0){const near=ad<e.w/2+40*BRNG;let o=!e.bf&&e.hp<e.max*.8&&!(e.vc>0)?'buff':near?(Math.random()<.55?'combo':'sweep'):Math.random()<.4?'burrow':'sting';if(lo&&!near&&Math.random()<.3)o='burrow';
      e.act=o;e.la=o;e.at=0;e.hd=0;e.hd2=0;e.n=0;e.lt=0;e.tx=pc;e.sg=null;e.cact=null}return}
  e.at+=dt;const a=e.act;
  if(a=='combo'){const S=['claw','claw','sweep'],D=[.75,.65,.9];if(e.n>=3){sEnd(e,lo);return}e.lt+=dt;const s=S[e.n];e.cact=s;e.cat=e.lt;
    if(s=='claw'){if(e.lt<.4)e.f=sgn(dx);else if(e.lt<.58){e.x=cl(e.x+e.f*260*dt);const r=40*BRNG,hb={x:e.f>0?e.x+e.w-10:e.x+10-r,y:e.y-4,w:r,h:e.h+4};if(!e.hd&&ov(P,hb)){e.hd=1;hurt(14*K,{kb:e.f*120,inv:.25})}}}
    else if(e.lt>=.4&&e.lt<.65){if(!e.hd2){e.hd2=1;shake=.15;sfx('boom')}const r=50*BRNG,hb={x:e.x-r,y:GY-26,w:e.w+2*r,h:26};if(!e.hd&&ov(P,hb)){e.hd=1;hurt(15*K,{kb:sgn(dx)*380})}}
    if(e.lt>=D[e.n]){e.n++;e.lt=0;e.hd=0;e.hd2=0}}
  else if(a=='sweep'){if(e.at>=.4&&e.at<.65){if(!e.hd2){e.hd2=1;shake=.15;sfx('boom')}const r=50*BRNG,hb={x:e.x-r,y:GY-26,w:e.w+2*r,h:26};if(!e.hd&&ov(P,hb)){e.hd=1;hurt(14*K)}}if(e.at>.9)sEnd(e,lo)}
  else if(a=='sting'){const R0=120*BRNG;if(e.at<.35){const t=pc+P.vx*.25;e.tx+=(t-e.tx)*Math.min(1,dt*10)}e.tx=Math.max(Math.max(A,cx-R0),Math.min(Math.min(WW,cx+R0),e.tx));e.f=sgn(e.tx-cx);
    if(e.at>=.6&&e.at<.75){if(!e.hd2){e.hd2=1;shake=.12;sfx('boom');VFX.spawn('b-gas',e.tx,GY-10,{life:1.3,a:.85,s:1.1})}const r=15*BRNG,hb={x:e.tx-r,y:GY-150,w:2*r,h:150};if(!e.hd&&ov(P,hb)){e.hd=1;if(hurt(12*K))poison(6,.03)}}
    if(e.at>.9){if(e.n<(lo?2:1)){e.n++;e.at=0;e.hd=0;e.hd2=0;e.tx=pc}else sEnd(e,lo)}}
  else if(a=='burrow'){if(!e.sg){e.pz='w';if(e.at>=.4){e.ug=1;e.ux=cx;e.sg='track';e.at=0;burst(cx,GY-4,12,['#e6cc98','#d9a961'],140,{ad:0,s:3,l:.4})}return}
    if(e.sg=='track'){e.pz=null;e.udir=sgn(pc-e.ux)||1;e.ux+=e.udir*Math.min(170*dt,Math.abs(pc-e.ux));e.ux=Math.max(A+40,Math.min(Bx+e.w-40,e.ux));e.x=cl(e.ux-e.w/2);if(e.at>1.4){e.sg='warn';e.at=0}return}
    e.pz='w';if(e.at>.4){e.ug=0;e.pz=null;e.sg=null;e.x=cl(e.ux-e.w/2);e.f=sgn(dx);shake=.3;sfx('boom');burst(e.ux,GY-6,18,['#e6cc98','#fff'],220,{ad:0,s:3,l:.4,g:500});const r=24*BRNG;if(ov(P,{x:e.ux-r,y:GY-100,w:2*r,h:100})&&hurt(18*K,{kb:sgn(pc-e.ux)*320}))P.vy=-460;sEnd(e,lo)}}
  else{if(e.at>=.5&&!e.hd){e.hd=1;e.bf=8;e.sh=Math.round(e.hp*.08);e.shT=8;e.vc=14;tx('毒雾领域:防御 +100% · 护盾 '+e.sh,e.x-30,e.y-24,'#74c0fc');shake=.25;const xs=[pc];for(let i=0;i<6&&xs.length<3;i++){const q=A+60+Math.random()*(Bx-A-60);if(xs.every(v=>Math.abs(v-q)>130))xs.push(q)}for(const q of xs)HZ.push({x:q-55,w:110,t:3.5,k:'poi'})}if(e.at>.8)sEnd(e,lo)}}
