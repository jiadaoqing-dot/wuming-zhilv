// ===== 精灵:跟随在身边;宠物:钢盔小鸡,自动放技能 =====
function sprStep(dt){if(!(SPR.own&&SPR.on))return;const t=performance.now()/1000,k=Math.min(1,dt*7);SPRP.x+=(P.x+12-P.f*26-SPRP.x)*k;SPRP.y+=(P.y-20+Math.sin(t*3)*4-SPRP.y)*k;
  if(st=='play'&&Math.random()<dt*10)pt({x:SPRP.x+rnd(-3,3),y:SPRP.y+rnd(-2,4),vx:rnd(-10,10),vy:rnd(5,20),c:pick(['#c3fae8','#fff','#a5d8ff']),s:rnd(1,2),l:.5})}
function drawFairy(c,cx,cy,t,s,f){SMN.fr(c,'f',Math.floor(t*8)%4,cx,cy,Math.max(1,Math.round(s||1)),f||1)}  // 第十九轮:小仙子像素图(GrafxKid,CC0)
function petStep(dt,S,all){if(!petOn())return;const p=PETS;p.an+=dt;p.g-=dt;p.wv-=dt;
  const lo=bossOn&&st=='play'?2570:0,hi=st=='play'?WW-22:VW-22,tx_=P.x+12-P.f*34,dx=tx_-(p.x+11),ad=Math.abs(dx);
  if(ad>520){p.x=tx_-11;p.y=GY-20}
  const mv=ad>8;if(mv){p.f=sgn(dx);p.x+=sgn(dx)*Math.min(ad,(ad>140?330:160)*dt)}else p.f=P.f;p.x=Math.max(lo,Math.min(hi,p.x));p.mv=mv;
  p.vy+=1200*dt;p.y+=p.vy*dt;if(p.y>=GY-20){p.y=GY-20;p.vy=mv?-150:0}
  for(let i=PF.length-1;i>=0;i--){const q=PF[i];q.t+=dt;q.a+=dt*25;
    if(q.st=='out'){q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t>.6){q.st='back';q.hit=new Set()}}
    else{const ddx=p.x+11-q.x,ddy=p.y+8-q.y,d=Math.hypot(ddx,ddy)||1,m=Math.min(d,440*dt);q.x+=ddx/d*m;q.y+=ddy/d*m;if(d<14||q.t>3){PF.splice(i,1);continue}}
    for(const e of all)if(!e.ug&&e.hp>0&&!q.hit.has(e)&&ov({x:q.x-10,y:q.y-10,w:20,h:20},e)){q.hit.add(e);pDeal(e,Math.round(q.dmg*rnd(.9,1.1)));sfx('peck')}}
  if(st!='play')return;for(const k in p.cd)p.cd[k]-=dt;if(p.g>0)return;
  const near=all.filter(e=>!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-(P.x+12))<360);if(!near.length)return;
  for(const k of PET.sk){if(p.cd[k]>0)continue;p.cd[k]=petCd(k);p.g=1.2;p.wv=.5;const cx=P.x+12,cy=P.y+16;
    if(k=='atk'){P.pAtk=8;ring(cx,cy,4,44,'#ff922b',.4,4);burst(cx,cy,12,['#ffd43b','#ff922b'],180,{sh:1,s:2,l:.35});tx('攻击 +'+Math.round(petAtk()*100)+'%',P.x-10,P.y-30,'#ff922b');sfx('buff')}
    else if(k=='def'){P.pDef=8;ring(cx,cy,4,44,'#4dabf7',.4,4);burst(cx,cy,12,['#a5d8ff','#4dabf7'],180,{sh:1,s:2,l:.35});tx('防御 +'+Math.round(petDef()*100)+'%',P.x-10,P.y-30,'#4dabf7');sfx('buff')}
    else if(k=='fan'){const e=nearE(near,p.x+11,p.y+8,400)||near[0],ex=e.x+e.w/2,ey=e.y+e.h/2,d=sgn(ex-(p.x+11));p.f=d;PF.push({x:p.x+11,y:p.y+6,vx:d*Math.max(260,Math.abs(ex-p.x-11)/.6),vy:(ey-p.y-6)/.6,t:0,a:0,st:'out',hit:new Set(),dmg:S.atk*fanM()});sfx('swing')}
    else{const vis=all.filter(e=>!e.ug&&e.hp>0&&e.x+e.w>cam&&e.x<cam+VW),e=pick(vis.length?vis:near);e.sl=Math.max(e.sl||0,5);e.psl=1;ring(e.x+e.w/2,e.y+e.h/2,4,34,'#74c0fc',.4,3);tx('减速!',e.x+e.w/2,e.y-20,'#74c0fc');sfx('cloud')}
    break}}
// 钢盔小鸡(单位坐标 22×20,面朝右)
