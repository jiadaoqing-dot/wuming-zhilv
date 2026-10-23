// ===== 统一像素管线(T1 = P2 分层):技能特效、飞弹、剑光、粒子先画到 640×360 的低分辨率图层,
// 再按整数倍最近邻放大叠到画面上,和像素主角是同一套像素网格。背景、怪物、界面、文字保持高清。
// 设置里切回「原版几何」时不走这一层,特效和原来完全一样。图层里调用的 CT(文字)会推迟到图层叠上去之后用高清画
var PXL={cv:null,g:null,act:0,q:[],
  on(){return SET.art!==0},
  // need=false 表示这一层这一帧肯定没有东西要画,直接跳过(省掉一次清屏和放大叠加)
  // 第五十一轮(卡顿优化):R = [x0,y0,x1,y1](屏幕逻辑坐标)时只把这一块放大贴回去(宠物 / 小仙子这种小东西不用整屏贴一次);PXL.bb 按点算范围
  bb(pts,pad){let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const [px,py] of pts){if(px<a)a=px;if(py<b)b=py;if(px>c)c=px;if(py>d)d=py}return [a-pad,b-pad,c+pad,d+pad]},
  run(fn,need,R){if(need===false)return;if(!this.on()||this.act){fn();return}
    if(!this.cv){this.cv=document.createElement('canvas');this.cv.width=VW;this.cv.height=VH;this.g=this.cv.getContext('2d')}
    const m=x,g=this.g;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,VW,VH);
    this.act=1;x=g;try{fn()}finally{x=m;this.act=0}
    m.save();m.globalAlpha=1;m.globalCompositeOperation='source-over';m.imageSmoothingEnabled=false;
    if(R){const x0=Math.max(0,Math.floor(R[0])),y0=Math.max(0,Math.floor(R[1])),x1=Math.min(VW,Math.ceil(R[2])),y1=Math.min(VH,Math.ceil(R[3]));if(x1>x0&&y1>y0)m.drawImage(this.cv,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0)}else m.drawImage(this.cv,0,0,VW,VH);m.restore();
    if(this.q.length){const q=this.q;this.q=[];for(const a of q)CT(...a)}}};
function draw(){
  x.save();if(shake>0)x.translate((Math.random()-.5)*6,(Math.random()-.5)*6);
  bg();PXL.run(drawFXBack,DEC.length+CRK.length+GH.length>0);
  drawPickups();drawRP();drawCP();drawGate();
  PXL.run(()=>{if(cur==8)g8Back();if(isTw(cur))twBack();E.forEach(twDE);if(bossOn&&B.hp>0)twDE(B);if(isTw(cur))twFx();if(cur==8)g8Fx();if(cur==9)v9Fx();if(cur==10)s10Fx();if(cur>=8&&cur<=10)nbFx();if(isMy(cur))myFx();if(cur==14)m14Fx();if(cur==15)c15Fx();if(cur==16)f16Fx();if(cur==18)n18Fx();if(cur==19)a19Fx();if(cur==20)a20Fx();if(cur==21)i21Fx();if(isDm(cur))dmFx();palDraw();mscDraw()});drawSM();PXL.run(drawTor,TOR.length>0||!!LCK);drawPet();drawHamPet();
  if(FX.dk>0){x.fillStyle='rgba(8,12,28,'+FX.dk+')';x.fillRect(0,0,VW,VH)}
  PXL.run(drawShots,F.length+PB.length>0);
  drawGD();drawStarF(cam);PXL.run(trailDraw,SWTR.length>1);drawClone();if(cur==MY4&&bossOn&&B&&B.k=='mir'&&B.hp>0&&st=='play')drawMir(B,mirAlpha(B));drawP();drawHamShd();PXL.run(thrDraw,THR.length>0);drawGDHint();PXL.run(()=>drawFairy(x,SPRP.x-cam,SPRP.y,performance.now()/1000,1,P.f),!!(SPR.own&&SPR.on),PXL.bb([[SPRP.x-cam,SPRP.y]],48));
  if(P.sand>0){const k=Math.min(1,P.sand/.3),px=P.x+12-cam,py=P.y+16,g=x.createRadialGradient(px,py,36,px,py,150);g.addColorStop(0,'rgba(110,80,35,0)');g.addColorStop(1,'rgba(110,80,35,'+.94*k+')');x.fillStyle=g;x.fillRect(0,0,VW,VH)}
  PXL.run(()=>{drawSk();drawFX();VFX.draw()});if(cur==MY4)mwDraw();drawSkBar();  // 第四十五轮:镜中无名的技能画面
  if(cur==6){blizDraw();if(P.frz>0){x.fillStyle='rgba(165,216,255,.18)';x.fillRect(0,0,VW,VH)}}
  if(cur==5&&B.stm>0){const k=B.stm,t=performance.now()/1000;x.fillStyle='rgba(222,160,60,'+.38*k+')';x.fillRect(0,0,VW,VH);x.fillStyle='rgba(255,236,190,'+.5*k+')';for(let i=0;i<28;i++)x.fillRect(((i*97+t*520)%(VW+80))-80,(i*37)%GY,40+(i%3)*20,2)}
  if(FX.fl>0){x.fillStyle='rgba('+FX.fc+','+FX.fl+')';x.fillRect(-10,-10,VW+20,VH+20)}
  if(cur==8&&CITY8.I)CITY8.dark();
  if(cur==9&&VOL9.I)VOL9.over();if(cur==10&&SHIP10.I)SHIP10.over();
  if(isTw(cur))twOver();hud();if(cur==9)VOL9.hud();if(isTw(cur))twHud();godHud();mscHud();drawBanner();if(performance.now()-lvT<2600){const k=Math.min(1,(performance.now()-lvT)/250);x.globalAlpha=Math.min(1,(2600-(performance.now()-lvT))/400);PG(x,[[150,64],[490,64],[476,82],[490,100],[150,100],[164,82]],LG(x,0,64,0,100,['#ffb84d','#e8590c']),2);CTG(lvName(),320,90,19*k+1);x.globalAlpha=1}
  drawTX();x.globalAlpha=1;x.restore();
}

function autoPlan(){const sc=it=>it.pr*EM(it),out=[];
  // 每个「部位 + 特性」只保留最好的一件,方便凑特性套装;已穿戴的同特性装备更好时,该组背包里的全卖
  const grp={};BAG.forEach((it,i)=>{const k=it.slot+'|'+(it.tr||'');(grp[k]=grp[k]||[]).push(i)});
  for(const k in grp){const ids=grp[k],[slot,tr]=k.split('|');let b=ids[0];for(const i of ids)if(sc(BAG[i])>sc(BAG[b]))b=i;
    const e=EQ[slot],same=e&&(e.tr||'')==tr,keep=!same||sc(BAG[b])>sc(e)?b:-1;for(const i of ids)if(i!=keep)out.push(i)}
  return out}

function qNew(){return {on:1,talk:0,mi:0,ms:0,mp:0,day:'',d:[{s:0,p:0},{s:0,p:0},{s:0,p:0}]}}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const QDEF=[
 {n:'🥚 蛇蛋收集',t:'在第三关「迷雾森林」收集 10 个蛇蛋(每条小蛇必掉 1 个)。交任务时上交 10 个蛇蛋。',need:10,prog:()=>Math.min(MAT.egg||0,10),rw:'金币 ×500 · 经验 ×300',give(){MAT.egg-=10;gold+=500;exp+=300;lvUp()}},
 {n:'❓ 镜中的自己',t:'击败「神秘副本 4」的首领「镜中无名」(拥有 4 块女神碎片后开放)。',need:1,prog:()=>QD.d[1].p,rw:'高级幸运宝石 ×1(强化成功率 +50%)',give(){LUCK++}},
 {n:'⚔️ 首领猎人',t:'接取后击败任意 2 个首领,任何关卡的 Boss 都算。',need:2,prog:()=>QD.d[2].p,rw:'金币 ×300 · 普通 Lv2 强化石 ×2',give(){gold+=300;STN[2][0]+=2}},
 {n:'👾 小怪清扫',t:'接取后击败 20 只小怪,任何关卡都算(Boss 不算)。',need:20,prog:()=>QD.d[3].p,rw:'技能点 ×1',give(){sp++}},
 {n:'🤖 人造人灿灿一号',t:'神秘副本 4 打倒镜中无名之后别急着走……在场地里等一等。击败隐藏首领「人造人·灿灿一号」。',need:1,prog:()=>QD.d[4].p,rw:'星界财宝 ×1(在主城部落图腾开启)',give(){MAT.astr=(MAT.astr|0)+1}}];  // 第四十六轮
function qDay(){const t=today();if(QD.day!=t&&!timeBad()){QD.day=t;QD.d=QDEF.map(()=>({s:0,p:0}))}while(QD.d.length<QDEF.length)QD.d.push({s:0,p:0})}
function qKill(){qDay();const d=QD.d[3];if(d.s==1&&d.p<20){d.p++;if(d.p==20)tx('小怪清扫 20/20 完成!',P.x-30,P.y-62,'#ffd43b')}}
function qBoss(){qDay();const d=QD.d[2];if(d.s==1&&d.p<2){d.p++;tx('首领猎人 '+d.p+'/2',P.x-20,P.y-62,'#ffd43b')}}
// ===== 第五十三轮(用户要求):第二张地图「暗黑大陆」的每日任务 7 个(QD.d[5]~[11]),奖励丰富;对应关卡没解锁时显示「未开放」=====
// 第五十四轮(用户:金币一共 80 万):七个关卡任务各 9 万 + 讨伐 17 万 = 80 万,其他奖励不变;第十七关的任务排在讨伐后面(不打乱已存的任务序号)
// 小怪任务在 qM2(击败小怪时)计数,讨伐任务在 qM2B(第二张地图的关卡首领倒下时)计数
const M2Q=[[14,'⚙️ 齿轮清障','齿轮要塞','金币 ×90000',()=>{gold+=90000}],[15,'🌙 夜巡王城','永夜王城','中级幸运宝石 ×1 · 金币 ×90000',()=>{MAT.lk2=(MAT.lk2|0)+1;gold+=90000}],
 [16,'🌋 熔岩降温','熔心火山','普通 Lv3 强化石 ×3 · 金币 ×90000',()=>{STN[3][0]+=3;gold+=90000}],[18,'🌕 月下除影','月影忍城','中级属性石 ×1 · 金币 ×90000',()=>{R19.ats.push(atsNew(1));gold+=90000}],
 [19,'⏰ 叫醒钟楼','不眠钟楼','普通 Lv3 强化石 ×3 · 普通 Lv4 强化石 ×1 · 金币 ×90000',()=>{STN[3][0]+=3;STN[4][0]+=1;gold+=90000}],[20,'🤖 拆解机库','金核机库','高级属性石 ×1 · 金币 ×90000',()=>{R19.ats.push(atsNew(2));gold+=90000}]];
const m2qAdd=([lv,n,nm,rw,g])=>{const i=QDEF.length;QDEF.push({n,t:`接取后在暗黑大陆「${nm}」击败 15 只小怪。`,need:15,lv,prog:()=>QD.d[i].p,rw,give:g,lock:()=>MAPS2.find(m=>m.cur==lv).lock()})};M2Q.forEach(m2qAdd);
{const i=QDEF.length;QDEF.push({n:'👑 暗黑大陆讨伐',t:'接取后在暗黑大陆的关卡里击败 3 个首领(同一关打多次也算,神秘副本不算)。',need:3,prog:()=>QD.d[i].p,rw:'双倍爆率卡 ×1 · 金币 ×170000',give(){MAT.dbl=(MAT.dbl|0)+1;gold+=170000},lock:()=>!map2Open(),boss:1})}
m2qAdd([21,'🔥 熔渊灭火','炎狱熔渊','普通 Lv3 强化石 ×3 · 普通 Lv4 强化石 ×1 · 金币 ×90000',()=>{STN[3][0]+=3;STN[4][0]+=1;gold+=90000}]);  // 第六十一轮:加 Lv4  // 第五十四轮
function qM2(e){if(e.sum||!isM2(cur))return;qDay();QDEF.forEach((q,i)=>{const d=QD.d[i];if(q.lv==cur&&d.s==1&&d.p<q.need){d.p++;if(d.p==q.need)tx(q.n+' '+q.need+'/'+q.need+' 完成!',P.x-40,P.y-70,'#ffd43b')}})}
function qM2B(){if(!isM2(cur))return;qDay();QDEF.forEach((q,i)=>{const d=QD.d[i];if(q.boss&&d.s==1&&d.p<q.need){d.p++;tx(q.n+' '+d.p+'/'+q.need,P.x-40,P.y-70,'#ffd43b')}})}
// =====================================================================
