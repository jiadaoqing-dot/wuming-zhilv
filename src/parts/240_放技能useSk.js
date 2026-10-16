function useSk(i,S){const m=P.mode,df=SKD[m][i];if(i>=4&&JOB!=m){tx('转职为'+JOBN[m]+'后才能使用进阶技能',P.x-40,P.y-30,'#adb5bd');return}if(!df||!LN[m][i]){if(i>=4)tx('还没有学会这个进阶技能',P.x-30,P.y-30,'#adb5bd');return}
  if(m=='sword'&&i==2&&P.gd2>0){if(!P.sk)gdPull();return}  // 天崩地裂第二段
  if(m=='staff'){if(i==4&&CLN&&!CLN.sw){cloneSwap();return}}
  // 剑士 U(雷霆连斩)可以取消 W+J 上挑 / S+J 重击的收招,直接接上(击飞时间很短,不取消就来不及)
  if(CD[m][i]>0||(P.sk&&!(m=='sword'&&i==1&&(P.sk.id=='up'||P.sk.id=='smash'))))return;
  if(m=='sword'&&i==5&&!lsTargets().length){tx('附近没有浮空的敌人或大型敌人(先用疾风踏斩等把敌人击飞)',P.x-80,P.y-30,'#a5d8ff');return}
  const mc=skMp(m,i,S.mp);if(P.mp<mc){tx('魔力不足',P.x-10,P.y-8,'#74c0fc');return}
  P.mp-=mc;CD[m][i]=skCdA(m,i);P.ch=0;ah=0;const f=P.f;P.cs={id:m+i,t:0};P.swT=null;fashCast(S);
  if(m=='sword'&&(P.qi|0)>=QIMAX){P.qi=0;P.qiKE=GT+2.2;flash('255,230,150',.2);ring(P.x+12,P.y+16,6,48,'#ffe066',.35,5);burst(P.x+12,P.y+16,16,['#ffe066','#fff3bf','#fff'],240,{sh:1,s:2,l:.3,dr:3})}  // 剑势全开(第十六轮)
  psx((m=='sword'?['dash','thunder','blink','wave','dash','zap','heavy','cloud']:['zap','blink','fire','cloud','blink','buff','wave','buff'])[i]);  // 旧版合成音(2026-10-11 版):放技能时一声,命中 / 终结时再一声(剑 I 两段的声音在 skStep 里)
  if(m=='sword'){
    if(i==0){P.sk={id:'dash',t:0,inv:1,hit:new Set(),one:1};flash('170,210,255',.15)}  // 第十六轮:只冲一段,命中上裂伤
    else if(i==1){P.sk={id:'zap',t:0,inv:1,n:0,tk:0,tg:[],gd:new Set(),bx:P.x+12+f*ZAPB[0],by:P.y+P.h-ZAPB[1],fs:P.uFs?1:0};if(P.uFs){P.uFs=0;flash('210,230,255',.5);shake=.3}flash('140,190,255',.35);FX.dk=Math.max(FX.dk,.45);hitstop(.05);burst(P.x+12,P.y+16,20,['#a5d8ff','#fff','#74c0fc'],320,{sh:1,s:2.5,l:.3,dr:3})}
    else if(i==2){P.sk={id:'slam',t:0,inv:0};P.ar=Math.max(P.ar||0,.7);CD.sword[2]=0}
    else if(i==3){P.uFs=1;P.sk={id:'giant',t:0,inv:0};psx('buff');tx('蓄力中……',P.x-10,P.y-40,'#c77dff')}
    else advStart(i,S);
  }else{
    if(i==1){const ox=P.x+12,oy=P.y+16;ghost('#be4bdb',.6);ring(ox,oy,44,3,'#be4bdb',.32,5);P.x=Math.max(bossOn?2570:0,Math.min(xMax(),P.x+f*170));P.inv=.5;pdMark();const nx=P.x+12;
      {const lo=Math.min(ox,nx)-20,hi=Math.max(ox,nx)+20;hitFx='thunder';for(const e of E.concat(bossOn&&B.hp>0?[B]:[]))if(!e.ug&&e.hp>0&&(e.mkT>0||e.mkF>0)&&e.x+e.w>lo&&e.x<hi&&Math.abs(e.y+e.h/2-oy)<90){tx('引爆!',e.x+e.w/2,e.y-28,'#e599f7');if(!(e.mkT>0&&e.mkF>0)){e.mkT=e.mkF=0}dealt(e,Math.round(S.atk*1.2*rnd(.9,1.1)),{ns:1})}hitFx=null}  // 第十六轮:闪现引爆印记(两种都有 → dealt 末尾的 elemChk 触发爆燃)
      for(let j=0;j<16;j++){const k=j/15;pt({x:ox+(nx-ox)*k,y:oy+rnd(-10,10),vx:rnd(-20,20),vy:rnd(-30,10),c:pick(['#e599f7','#d0bfff','#fff']),sh:2,s:rnd(4,7),l:rnd(.3,.5)})}
      ring(nx,oy,4,56,'#be4bdb',.42,6);VFX.spawn('foldstep',ox,oy);VFX.spawn('foldstep',nx,oy);SFX5('m-swirl',ox,oy,{s:1.3,life:.4,rs:4});SFX5('m-swirl',nx,oy,{s:1.6,life:.5,rs:-4,gr:.4});ring(nx,oy,2,32,'#e599f7',.3,3);pillar(ox,14,'rgba(204,93,232,.8)',.3);pillar(nx,18,'rgba(229,153,247,.9)',.35);burst(nx,oy,22,['#be4bdb','#e599f7','#f3d9fa'],260,{sh:1,s:2.5,l:.38,dr:3});flash('200,150,255',.18)}
    else if(MCT[i]){P.cs=null;P.sk={id:'mc',i,t:0,T:MCT[i][0],end:MCT[i][1]};mcFx(i)}  // 第二十七轮:先做施法动作(施法中霸体,hurt 里判断),到时间才放出来(mcStep)
    else magStart(i,S);
    if(i==1)cloneCast(i,S)}
}
// 第二十七轮:法师技能先施法再放出。MCT[i] = [技能出现的时间, 动作结束的时间];I / W空 = [出现, 结束, 推出]
// 动作:H 落雷 = 抡杖指向;I 火球 / W空 圣光禁域 = 指向 → 画一圈(身前出现法阵)→ 推出;O 乌云 / S空 火鸟图腾 / WW空 苍穹光柱 = 单手举杖过头顶
const MCT={0:[.5,.62],2:[.62,1.05,.85],3:[.2,.6],5:[.62,1.05,.85],6:[.2,.6],7:[.2,.6]};
const MCIR={2:'mc-fire',5:'mc-gold'};  // 画圈时身前的魔法图腾
// 进阶技能施法时身上的特效
function mcFx(i){const cx=P.x+12,cy=P.y+16;
  if(i==5){SFX5('g-orb',cx,cy,{s:.7,life:1,at:P,gr:.2,a:.55});ring(cx,cy,4,40,'#ffd43b',.35,4)}
  else if(i==6){SFX5('r-wing',cx,cy-4,{s:1.1,life:.6,at:P,dy:-4,a:.85});burst(cx,cy,14,['#ff922b','#ffd43b','#ff6b35'],160,{sh:2,s:5,l:.4})}
  else if(i==7){SFX5('b-orb',cx,cy,{s:.8,life:.6,at:P,gr:.2,a:.6});VFX.spawn('x-midnight',cx,cy-6,{s:1.2,life:.6,at:P,add:1,dy:-6});SFX5('v-ring',cx,P.y+P.h,{s:1.2,life:.6,sy:.4});ring(cx,cy,4,44,'#cc5de8',.35,4)}}
function mcStep(k,dt,S){const f=P.f,i=k.i,ox=P.x+12+f*30,oy=P.y+12;
  if(MCIR[i]&&!k.c&&k.t>=.12){k.c=1;VFX.spawn(MCIR[i],ox,oy,{s:.62,gr:.75,life:.72,rs:f*1.6,add:1,hold:1,fi:.15});psx('buff')}  // 画圈开始:法阵在身前慢慢转着变大
  if(MCIR[i]&&k.c&&k.t<.62&&Math.random()<dt*40){const a=rnd(0,6.283),r=rnd(30,46);pt({x:ox+Math.cos(a)*r,y:oy+Math.sin(a)*r,vx:-Math.cos(a)*50,vy:-Math.sin(a)*50,c:pick(i==2?['#ff922b','#ffd43b','#fff3bf']:['#ffd43b','#fff3bf','#fff']),sh:2,s:rnd(2,4),l:.4})}
  if(i==0&&!k.a&&k.t>=k.T){k.a=1;const t=E.concat(bossOn&&B.hp>0?[B]:[]).filter(e=>(e.x-P.x)*f>-40&&Math.abs(e.x-P.x)<340).sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x))[0];{const bx=t?t.x+t.w/2:P.x+f*160;bolt(bx,skD('staff',0,S),34,0,1);for(const o of[-90,90])bolt(bx+o,Math.round(skD('staff',0,S)*.4),26,0,0)}cloneCast(0,S)}
  if(i==2||i==5){// 火球(体积 ×1.5、速度 220)/ 圣光球:画完圈出现在身前,推出去时才飞
    if(!k.a&&k.t>=k.T){k.a=1;k.pb=i==2?{x:ox,y:oy,vx:f*.001,dmg:skD('staff',2,S),r:26,fs:3,col:'#ff6b35',sl:1,fb:1,pierce:1,hit:new Set(),mc:k}:{x:ox,y:oy,vx:f*.001,dmg:skD('staff',5,S),r:20,gl:1,rg:360,hit:new Set(),mc:k};PB.push(k.pb);
      burst(ox,oy,14,i==2?['#ff922b','#ffd43b','#fff']:['#ffd43b','#fff3bf','#fff'],150,{sh:2,s:6,l:.3,dr:4});ring(ox,oy,4,34,i==2?'#ff922b':'#ffd43b',.3,3);flash(i==2?'255,170,90':'255,236,170',.1)}
    if(k.pb&&!k.b&&k.t>=MCT[i][2]){k.b=1;if(PB.includes(k.pb))k.pb.vx=f*(i==2?220:260);if(i==2)cloneCast(2,S);burst(ox,oy,10,i==2?['#ff922b','#ffd43b']:['#ffd43b','#fff'],160,{sh:2,s:7,l:.3,dr:4})}}
  if(i==3&&!k.a&&k.t>=k.T){k.a=1;CL={x:P.x+P.w/2,t:5,k:.3,fk:0};FX.dk=Math.max(FX.dk,.4);cloneCast(3,S)}  // 乌云先出现,动作收回(0.5 秒)时第一道雷落下
  if(i==6&&!k.a&&k.t>=k.T){k.a=1;MGT={x:clX(P.x+12),y:GY-112,f,t:5,tk:.3,an:0,dmg:skD('staff',6,S)};SFX5('r-burst',MGT.x,MGT.y,{s:1.6,life:.5,gr:.4});flash('255,150,60',.15);psx('fire')}
  if(i==7&&!k.a&&k.t>=k.T){k.a=1;const t=allTg().filter(e=>(e.x+e.w/2-P.x)*f>-40&&Math.abs(e.x+e.w/2-P.x)<360).sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x))[0];
    MGP={x:clX(t?t.x+t.w/2:P.x+12+f*150),t:5.3,tk:.3,a:0,dmg:skD('staff',7,S),bs:new Set()};flash('200,110,255',.3);psx('thunder');shake=Math.max(shake,.2)}
  if(k.t>=k.end)P.sk=null}  // 被打断(P.sk 被清掉)时,停在身前的火球 / 圣光球由 PB 循环(b.mc)自己飞出去
