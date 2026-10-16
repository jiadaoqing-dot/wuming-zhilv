function skStep(dt,S,all){const k=P.sk;if(!k)return;k.t+=dt;const f=P.f;if(k.id=='mc'){mcStep(k,dt,S);return}if(advStep(k,dt,S,all))return;
  if(k.id=='up'){if(k.t<.18){const hb={x:f>0?P.x+P.w-6:P.x-38,y:P.y-44,w:44,h:76};for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);dealt(e,Math.round(S.atk*1.1*rnd(.9,1.1)));launch(e)}}if(k.t>.3)P.sk=null;return}
  if(k.id=='smash'){if(k.t>=.28&&!k.done){k.done=1;shake=.25;hitstop(.06);const ix=P.x+12+f*34;slash(P.x+12,P.y+10,42,-2.7,.9,f,'#ffd43b',.24,6);ring(ix,GY-2,6,70,'#ffd43b',.35,5,.25);crack(ix,2,50);
      for(let n=0;n<10;n++)pt({x:ix+rnd(-20,20),y:GY-4,vx:rnd(-160,160),vy:rnd(-320,-120),g:1400,c:pick(['#8d5524','#adb5bd']),ad:0,s:rnd(2,4),l:.7,bn:1});
      const hb={x:f>0?P.x+4:P.x-60,y:P.y-14,w:80,h:P.h+14};hitFx='heavy';for(const e of all)if(ov(hb,e)){dealt(e,Math.round(S.atk*1.8*rnd(.9,1.1)));knock(e,f)}hitFx=null}
    if(k.t>.55)P.sk=null;return}
  if(k.id=='zap'){// 雷霆连斩(2026-10-13 第十轮):放招后主角隐身,只剩一团雷球,固定在身前斜上方(比一段跳略高);天上不再落雷,只有雷球附近的敌人受伤
    if(k.fs){zapFs(k,dt,all,S);return}  // 第三十三轮:放过 O / WW+空格后的下一次 U = 全屏雷霆(旧版:瞬间打全屏所有怪物多段伤害)
    P.vy=0;k.hid=1;zapBall(k,dt);if(k.t<.045)return;  // 2026-10-13 第十二轮:持续时间减半(间隔 .07 → .035,收尾 .25 → .13);第十三轮再 -25%(.035 → .026,收尾 .13 → .1)
    if(k.n<ZAPN){k.tk-=dt;if(k.tk<=0){k.tk=.026;if(k.n%2==0)psx('zap');const c=all.filter(e=>e.hp>0&&!e.ug&&zapNear(e,k));
        for(const e of c){if(!k.tg.includes(e)){k.tg.push(e);if(zapGd(e))k.gd.add(e)}if(!isBig(e)){if(!e.air){e.air=1;e.ay0=GY-e.h;e.hang=0;e.s=null;e.vy=0}e.hold=Math.max(e.hold||0,.3);e.avy=0}}
        hitFx='thunder';for(const o of c)dealt(o,Math.round(skD('sword',1,S)*ZAPK*rnd(.9,1.1)),{ns:isBig(o)?0:1});hitFx=null;k.n++;if(k.n>=ZAPN)k.fin=k.t}return}
    // 结束:雷球炸开,雷球附近的敌人受终结伤害并被打落
    const ft=k.t-k.fin;
    if(!k.done){k.done=1;flash('200,225,255',.45);hitstop(.08);shake=.35;psx('thunder','boom');ring(k.bx,k.by,8,ZAPB[2]*1.3,'#74c0fc',.45,7);ring(k.bx,k.by,4,ZAPB[2],'#fff',.3,3);burst(k.bx,k.by,30,['#a5d8ff','#fff','#74c0fc'],420,{sh:1,s:2.5,l:.45,dr:3});VFX.spawn('electric-impact',k.bx,k.by,{s:3,add:1});
      hitFx='slam';for(const e of all)if(e.hp>0&&!e.ug&&(k.tg.includes(e)||zapNear(e,k))){dealt(e,Math.round(skD('sword',1,S)*2.5*rnd(.9,1.1)));if(!isBig(e)){e.hold=0;e.hang=0;e.avy=1100}}hitFx=null}
    if(ft>.1){k.hid=0;P.sk=null}return}
  if(k.id=='giant'){// 苍蓝巨剑:1 秒蓄力(身后 45° 幻化)→ 0.3 秒抡下 → 砸地
    const T=GCH,ph=Math.min(1,k.t/T);FX.dk=Math.max(FX.dk,Math.min(.5,k.t*.3));if(!k.c1&&k.t>.35){k.c1=1;psx('zap')}if(!k.c2&&k.t>.7){k.c2=1;psx('zap')}
    if(k.t<T){for(let n=0;n<2;n++){const G=gGeo(k),d=rnd(0,GL+30),px=G.hx+f*Math.cos(G.a)*d,py=G.hy+Math.sin(G.a)*d,r=rnd(30,70),b=Math.random()*6.283;
          pt({x:px+Math.cos(b)*r,y:py+Math.sin(b)*r,vx:-Math.cos(b)*r/.3,vy:-Math.sin(b)*r/.3,c:pick(['#7b2cbf','#9d4edd','#ff4d6d']),sh:2,s:rnd(4,7),l:.3});if(Math.random()<.5)pt({x:px+rnd(-20,20),y:py+rnd(-20,20),vx:rnd(-20,20),vy:rnd(-40,-10),c:'rgba(20,6,30,.6)',ad:0,s:rnd(5,9),gr:1.4,l:.5})}
      return}
    if(!k.formed){k.formed=1;k.ft=k.t;psx('thunder');flash('40,0,60',.35);P.inv=Math.max(P.inv,.8);ring(P.x+12,P.y-60,6,90,'#9d4edd',.35,5)}
    const st=k.t-k.ft;
    if(st>=.3&&!k.done){k.done=1;const x0=P.x+12;flash('30,0,45',.6);hitstop(.13);shake=.6;psx('boom','slam');
      for(let d=40;d<=420;d+=70){ring(x0+f*d,GY-2,6,90,'#7b2cbf',.55,6,.22);pillar(x0+f*d,16,'rgba(157,78,221,.85)',.45)}crack(x0+f*120,6,170);crack(x0+f*300,5,140);
      for(let n=0;n<40;n++)pt({x:x0+f*rnd(20,400),y:GY-4,vx:rnd(-200,200),vy:rnd(-620,-200),g:1400,c:pick(['#8d5524','#6b3f1a','#2b1a3a','#c77dff']),ad:0,s:rnd(3,6),l:rnd(.7,1.1),bn:1});
      burst(x0+f*200,GY-20,40,['#c77dff','#ff4d6d','#7b2cbf'],460,{sh:1,s:2.5,l:.55,dr:1.5,g:300});
      const lo=Math.min(x0-30*f,x0+f*420),hi=Math.max(x0-30*f,x0+f*420);hitFx='slam';for(const e of all)if(!e.ug&&e.x+e.w>lo&&e.x<hi&&e.y+e.h>GY-170){const h0=e.hp;e.sc=0;dealt(e,Math.round(skD('sword',3,S)*rnd(.95,1.05)*(e.bld>0?1.3:1)),{nm:1});if(e.hp<h0)bigStun(e)}hitFx=null}  // 裂伤目标 +30%
    if(st>.3&&st<.36)for(let n=0;n<6;n++){const d=rnd(40,GL);pt({x:P.x+12+f*d*.8,y:GY-rnd(4,20),vx:rnd(-80,80),vy:rnd(-200,-40),g:300,c:pick(['#c77dff','#ff4d6d']),s:rnd(3,5),l:.6})}
    if(st>.75)P.sk=null;return}
  if(k.id=='rstab'){// 冲刺直戳:0.06 秒收剑预备 → 0.26 秒高速前冲(约 120 像素)→ 收招
    if(k.t>.06&&k.t<.32){const sp=570*(1-(k.t-.06)/.26*.5);P.x=Math.max(bossOn?2570:0,Math.min(xMax(),P.x+f*sp*dt));
      k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.03;ghost('rgba(165,216,255,.8)',.22)}
      for(let n=0;n<2;n++)pt({x:P.x+12-f*rnd(4,14),y:P.y+P.h-rnd(1,4),vx:-f*rnd(60,140),vy:rnd(-50,-10),c:'rgba(205,195,175,.7)',ad:0,s:rnd(3,5),gr:1,l:.35});
      const hb={x:f>0?P.x+P.w-4:P.x-58,y:P.y-2,w:62,h:P.h};
      for(const e of all)if(!k.hit.has(e)&&!e.ug&&ov(hb,e)){k.hit.add(e);hitFx='dash';dealt(e,Math.round(S.atk*1.6*rnd(.9,1.1)));hitFx=null;knock(e,f);if(!isBig(e))e.kbv=f*520;burst(e.x+e.w/2,e.y+e.h/2,10,['#a5d8ff','#fff'],260,{sh:1,s:2,l:.25,dr:4})}}
    if(k.t>.48)P.sk=null;return}
  if(k.id=='dash'){const ph=k.t<.22?1:(!k.one&&k.t<.4)?-1:0;if(!ph){P.sk=null;return}
    if(!k.a){k.a=1;slash(P.x+12+f*18,P.y+16,36,-1.35,1.35,f,'#74c0fc',.3,5)}
    if(ph==-1&&!k.b){k.b=1;k.hit=new Set();slash(P.x+12-f*18,P.y+16,36,1.35,-1.35,-f,'#b197fc',.3,5)}
    k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.022;ghost(ph>0?'#339af0':'#845ef7',.3)}
    for(let n=0;n<2;n++)pt({x:P.x+12+rnd(-14,14),y:P.y+rnd(2,30),vx:-f*ph*rnd(260,520),c:pick(['#74c0fc','#d0ebff']),sh:1,s:rnd(1.5,3),l:.2});
    P.x=Math.max(bossOn?2570:0,Math.min(xMax(),P.x+f*ph*900*dt));
    const hb={x:P.x-12,y:P.y,w:P.w+24,h:P.h};for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);hitFx='dash';dealt(e,Math.round(skD('sword',0,S)*(.9+Math.random()*.2)));hitFx=null;if(e.hp>0){e.bld=BLDT;tx('裂伤',e.x+e.w/2,e.y-26,'#ff8787')}}}
  else if(k.id=='bolt'){if(k.t>.5){P.sk=null;return}FX.dk=Math.max(FX.dk,.35);k.tk=(k.tk||0)-dt;if(k.tk<=0){k.tk=.1;const hb={x:f>0?P.x-10:P.x-70,y:P.y-80,w:104,h:130};
      for(let n=0;n<2;n++){const a0=rnd(-3.1,3.1);slash(hb.x+rnd(20,hb.w-20),hb.y+rnd(30,hb.h-20),rnd(16,30),a0,a0+rnd(2,3),pick([1,-1]),pick(['#74c0fc','#a5d8ff','#d0bfff']),.2,3)}
      ghost('#a5d8ff',.15);burst(P.x+12,P.y+16,8,['#a5d8ff','#fff'],280,{sh:1,s:2,l:.2,dr:3});
      hitFx='thunder';for(const e of all)if(ov(hb,e))dealt(e,Math.round(skD('sword',1,S)*(.9+Math.random()*.2)));hitFx=null}}
  else if(k.id=='slam'){// 天崩地裂·第一段(2026-10-12 第六轮):巨剑竖在身前格挡(霸体)→ 0.32 秒时用力推出,金色光爆在身前炸开:一个普攻距离内的敌人被击退到 1.5 倍距离处;整段都会消除身前的怪物飞弹
    P.ar=Math.max(P.ar||0,.05);gdEat(f);
    if(k.t<.32){if(Math.random()<.7)pt({x:P.x+12+f*rnd(4,14),y:P.y-30+rnd(0,58),vx:rnd(-20,20),vy:rnd(-70,-20),c:pick(['#ffe066','#fff3bf','#ffd43b','#fff']),sh:2,s:rnd(2,3.5),l:.3});return}
    if(!k.done){k.done=1;psx('heavy','wave');shake=.4;hitstop(.08);flash('255,236,170',.5);const x0=P.x+12,bx=x0+f*38;
      SFX5('g-burst',bx,P.y+4,{s:1.45,life:.5,gr:.5,f});SFX5('g-orb',bx,P.y+4,{s:1.2,life:.3,gr:1});ring(bx,P.y+4,10,96,'#ffe066',.42,7);ring(bx,P.y+4,6,64,'#fff',.3,4);
      burst(bx,P.y+4,40,['#fff','#fff3bf','#ffe066','#ffd43b','#ff922b'],560,{sh:1,s:2.6,l:.5,dr:2});
      const hb={x:f>0?x0-8:x0+8-GDA,y:P.y-56,w:GDA,h:GY-P.y+56};hitFx='dash';
      for(const e of all)if(!e.ug&&ov(hb,e)){dealt(e,Math.round(skD('sword',2,S)*rnd(.9,1.1)));if(isBig(e))continue;knock(e,f);
        const d=(x0+f*GDR-(e.x+e.w/2))*f;e.kbv=f*(Math.max(0,d)*6+16);e.st=Math.max(e.st||0,.8)}  // 击退到 1.5 倍普攻距离(kbv 每秒减小 6 倍,总位移约 kbv/6)
      hitFx=null;P.gd2=GDW;CD.sword[2]=0;tx('再按 I:拉回!',P.x-24,P.y-50,'#ffe066')}
    if(k.t>.62)P.sk=null}
  else if(k.id=='slam2'){// 第二段:巨剑高举 → 0.26 秒劈在地上 → 1.5 倍普攻距离处落下一道又高又宽的深蓝 / 白 / 紫色斜光束,往回卷,把路上的敌人拖到身边
    const f=k.f,x0=P.x+12,far=x0+f*GDR,stop=x0+f*24;
    if(k.t<.26)return;
    if(!k.done){k.done=1;psx('slam','boom');shake=.55;hitstop(.1);flash('190,200,255',.45);crack(x0+f*32,5,60);ring(x0+f*32,GY-2,6,90,'#748ffc',.45,5,.25);
      burst(x0+f*32,GY-6,22,['#fff','#91a7ff','#b197fc'],360,{sh:1,s:2,g:600,l:.5,dr:1});
      for(let n=0;n<14;n++)pt({x:x0+f*rnd(8,56),y:GY-4,vx:rnd(-160,160),vy:rnd(-380,-120),g:1400,c:pick(['#8d5524','#6b3f1a','#adb5bd']),ad:0,s:rnd(2,4),l:rnd(.5,.8),bn:1});
      k.qx=far;SFX5('b-orb',far,GY-40,{s:1.6,life:.35,gr:.8});SFX5('v-ring',far,GY-46,{s:1.3,life:.4,gr:.6});burst(far,GY-60,26,['#fff','#91a7ff','#b197fc','#4c6ef5'],360,{sh:1,s:2.4,l:.4,dr:2});pillar(far,30,'rgba(145,167,255,.85)',.3)}
    const q=cl01((k.t-.34)/.45);k.qx=far+(stop-far)*eio(q);
    if(k.t>=.34&&q<1){if(!k.w){k.w=1;psx('wave','dash')}
      for(let n=0;n<5;n++){const h=rnd(4,GDH);pt({x:k.qx+f*(h*.35)+rnd(-8,8),y:GY-h,vx:f*rnd(140,320),vy:rnd(-20,20),c:pick(['#fff','#bac8ff','#748ffc','#b197fc','#7048e8']),sh:1,s:rnd(1.5,3),l:.28})}
      for(const e of all){if(e.ug||e.hp<=0||e.y+e.h<GY-GDH-20||e.y>GY)continue;const c=e.x+e.w/2,d=(c-x0)*f;
        if(!k.gr.has(e)&&d>0&&d<=GDR+30&&d>=(k.qx-x0)*f-12){k.gr.add(e);hitFx=null;dealt(e,Math.round(skD('sword',2,S)*.6*rnd(.9,1.1)));hitFx=null;burst(c,e.y+e.h/2,10,['#fff','#91a7ff','#b197fc'],260,{sh:1,s:2,l:.25,dr:3})}
        if(k.gr.has(e)&&!isBig(e)){e.kbv=0;e.st=Math.max(e.st||0,.5);const nc=f>0?Math.max(k.qx-f*e.w/2,stop+e.w/2):Math.min(k.qx-f*e.w/2,stop-e.w/2);if((nc-c)*f<0)e.x=nc-e.w/2}}}
    if(q>=1&&!k.e){k.e=1;for(const e of k.gr)if(!isBig(e)&&e.hp>0){e.st=Math.max(e.st||0,.8);tx('拉回!',e.x+e.w/2,e.y-18,'#91a7ff')}ring(stop,P.y+16,4,60,'#91a7ff',.35,4);SFX5('v-ring',stop,P.y+6,{s:.9,life:.3})}
    if(k.t>.95)P.sk=null}}
// 天崩地裂(2026-10-12 第六轮):GDA = 第一段范围 = 一个普攻距离(从身体中心算,约等于普攻判定的最远处);GDR = 1.5 倍普攻距离(第一段击退到这里,第二段剑气从这里出现);
// GDW = 第一段后等第二段的秒数;GDH = 第二段光束高度
const GDA=72,GDR=108,GDW=4,GDH=150;
function gdPull(){P.gd2=0;CD.sword[2]=skCdA('sword',2);P.sk={id:'slam2',t:0,inv:1,f:P.f,gr:new Set()};P.ch=0;ah=0;P.swT=null;psx('heavy')}
// 第一段消弹:身前一个普攻距离(略放宽)内的怪物飞弹直接消失
function gdEat(f){const x0=P.x+12,a=f>0?x0-14:x0-GDA-20,b=f>0?x0+GDA+20:x0+14;
  for(let i=F.length-1;i>=0;i--){const o=F[i];if(o.x>a&&o.x<b&&o.y>P.y-70&&o.y<GY+4){F.splice(i,1);burst(o.x,o.y,8,['#fff','#ffe066','#ffd43b'],200,{sh:1,s:2,l:.25,dr:3});VFX.spawn('solar-shrapnel',o.x,o.y,{s:.5})}}}
// 天崩地裂的画面:第一段 = 竖剑上的金色光柱 → 身前炸开的金色光爆(比人大,弧形剑光 + 放射光线);第二段 = 贴地的剑光 + 又高又宽的深蓝卷浪月牙(紫边)往回卷
function drawGd(){const k=P.sk;if(!k||(k.id!='slam'&&k.id!='slam2'))return;const t=performance.now()/1000;x.save();x.globalCompositeOperation='lighter';
  if(k.id=='slam'){const f=P.f,x0=P.x+12-cam;
    if(k.t<.32){const a=Math.min(1,k.t/.08),hx=Math.round(x0+f*10),top=P.y-62,h=GY-top,fl=.85+.15*Math.sin(t*40);
      x.fillStyle=`rgba(255,180,40,${.22*a*fl})`;x.fillRect(hx-10,top,20,h);x.fillStyle=`rgba(255,224,102,${.45*a})`;x.fillRect(hx-5,top-4,10,h+4);x.fillStyle=`rgba(255,255,235,${.85*a})`;x.fillRect(hx-2,top-8,4,h+8);
      const r=10+k.t*40;x.fillStyle=RGD(x,hx,P.y+4,r,[`rgba(255,240,180,${.5*a})`,'rgba(0,0,0,0)']);x.fillRect(hx-r,P.y+4-r,2*r,2*r);
      const sy=P.y-10+Math.sin(t*9)*18;x.fillStyle=`rgba(255,255,255,${a})`;x.fillRect(hx-9,sy,18,1);x.fillRect(hx-.5,sy-9,1,18)}
    else{const q=(k.t-.32)/.34;if(q<1){const al=1-q,bx=x0+f*38,y0=P.y+4,R0=30+70*eo(Math.min(1,q*2.2));
      x.fillStyle=RGD(x,bx,y0,R0,[`rgba(255,255,240,${al})`,`rgba(255,224,102,${.8*al})`,`rgba(255,146,43,${.35*al})`,'rgba(0,0,0,0)']);x.fillRect(bx-R0,y0-R0,2*R0,2*R0);
      // 放射光线
      for(let i=0;i<14;i++){const a0=(i/14)*6.283+i*.37,L=R0*(1.1+((i*7)%5)*.18),w=i%3?1:2;x.save();x.translate(bx,y0);x.rotate(a0);x.fillStyle=i%2?`rgba(255,240,170,${al})`:`rgba(255,212,59,${.8*al})`;x.fillRect(R0*.3,-w/2,L*(.5+.5*eo(q*2)),w);x.restore()}
      // 弧形剑光:向前上方甩出的几道月牙(示意图上方的金色弧线)
      x.save();x.translate(bx-f*30,y0+18);x.scale(f,1);for(let i=0;i<5;i++){const r=50+i*16+q*44;x.strokeStyle=i%2?`rgba(255,240,170,${.9*al})`:`rgba(255,192,40,${.85*al})`;x.lineWidth=Math.max(1,4-i*.6);x.beginPath();x.arc(0,0,r,-1.55+i*.05,-.15-i*.06);x.stroke()}x.restore();
      // 地面金光
      x.fillStyle=`rgba(255,212,59,${.6*al})`;x.fillRect(Math.min(bx-60,bx+60)-0,GY-3,120,3);x.fillStyle=`rgba(255,255,230,${al})`;x.fillRect(bx-40,GY-2,80,1)}}}
  else if(k.t>=.26){const f=k.f,x0=P.x+12-cam,st=k.t-.26;
    if(st<.3){const al=1-st/.3;x.fillStyle=`rgba(116,143,252,${.6*al})`;x.fillRect(Math.min(x0+f*6,x0+f*62),GY-6,56,6);x.fillStyle=`rgba(255,255,255,${al})`;x.fillRect(Math.min(x0+f*6,x0+f*62),GY-3,56,2)}
    if(k.qx!=null&&k.t<.92){const qx=Math.round(k.qx-cam),ap=Math.min(1,(k.t-.26)/.08),al=k.t<.79?1:Math.max(0,1-(k.t-.79)/.13),H=GDH*(.55+.45*ap);
      // 2026-10-12 第七轮:按用户涂鸦改成卷浪月牙 —— 背面(远离主角)几乎竖直,顶部向主角方向卷出一个浪头,前沿内凹;实心深蓝,紫边,内侧浅蓝 / 白高光
      const b=-f,Wc=H*.5,crest=(s,c,op)=>{x.globalCompositeOperation=op;x.fillStyle=c;const Q=(u,h)=>[qx+b*u*s,GY-h];let p,q;x.beginPath();p=Q(-16,0);x.moveTo(p[0],p[1]);
        q=Q(-15,H*.55);p=Q(-12,H*.8);x.quadraticCurveTo(q[0],q[1],p[0],p[1]);q=Q(-4,H*1.06);p=Q(Wc*.55,H);x.quadraticCurveTo(q[0],q[1],p[0],p[1]);
        q=Q(Wc*1.08,H*.97);p=Q(Wc,H*.76);x.quadraticCurveTo(q[0],q[1],p[0],p[1]);q=Q(Wc*.5,H*.58);p=Q(Wc*.36,H*.16);x.quadraticCurveTo(q[0],q[1],p[0],p[1]);
        q=Q(Wc*.3,H*.05);p=Q(Wc*.32,0);x.quadraticCurveTo(q[0],q[1],p[0],p[1]);x.closePath();x.fill()};
      x.globalAlpha=al*.7;crest(1.12,'#7048e8','source-over');x.globalAlpha=al;crest(1,'#1c2f9e','source-over');crest(.82,'#2f4bd0','source-over');
      crest(.6,'rgba(116,143,252,.75)','lighter');crest(.38,'rgba(200,215,255,.8)','lighter');crest(.18,'rgba(255,255,255,.9)','lighter');
      // 前沿(内凹那一侧)向主角方向甩出的细光线
      for(let i=0;i<14;i++){const u=((i*37+((t*240)|0))%100)/100,hh=H*(.15+.75*u),ox=qx+b*(10+Wc*.9*u*u),len=14+((i*13)%5)*8;x.strokeStyle=['rgba(255,255,255,.95)','rgba(186,200,255,.85)','rgba(151,117,250,.8)','rgba(76,110,245,.8)'][i%4];x.lineWidth=i%3?1:2;
        x.beginPath();x.moveTo(ox,GY-hh);x.lineTo(ox+b*len,GY-hh+len*.2);x.stroke()}
      // 底部光团 + 往回卷的光痕
      const r=28;x.fillStyle=RGD(x,qx,GY-6,r,['rgba(255,255,255,.9)','rgba(116,143,252,.5)','rgba(0,0,0,0)']);x.fillRect(qx-r,GY-6-r,2*r,2*r);
      for(let i=0;i<6;i++){const yy=GY-8-((i*23+((t*90)|0))%Math.max(1,H*.7)),ln=20+((i*7)%3)*16;x.fillStyle=i%2?'rgba(151,117,250,.6)':'rgba(186,200,255,.65)';x.fillRect(Math.min(qx,qx+f*ln),yy,ln,2)}
      x.globalAlpha=1}}
  x.restore()}
// =====================================================================
