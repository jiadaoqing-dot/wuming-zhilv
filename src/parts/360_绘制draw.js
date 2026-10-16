// ===== 统一像素管线(T1 = P2 分层):技能特效、飞弹、剑光、粒子先画到 640×360 的低分辨率图层,
// 再按整数倍最近邻放大叠到画面上,和像素主角是同一套像素网格。背景、怪物、界面、文字保持高清。
// 设置里切回「原版几何」时不走这一层,特效和原来完全一样。图层里调用的 CT(文字)会推迟到图层叠上去之后用高清画
var PXL={cv:null,g:null,act:0,q:[],
  on(){return SET.art!==0},
  // need=false 表示这一层这一帧肯定没有东西要画,直接跳过(省掉一次清屏和放大叠加)
  run(fn,need){if(need===false)return;if(!this.on()||this.act){fn();return}
    if(!this.cv){this.cv=document.createElement('canvas');this.cv.width=VW;this.cv.height=VH;this.g=this.cv.getContext('2d')}
    const m=x,g=this.g;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,VW,VH);
    this.act=1;x=g;try{fn()}finally{x=m;this.act=0}
    m.save();m.globalAlpha=1;m.globalCompositeOperation='source-over';m.imageSmoothingEnabled=false;m.drawImage(this.cv,0,0,VW,VH);m.restore();
    if(this.q.length){const q=this.q;this.q=[];for(const a of q)CT(...a)}}};
function draw(){
  x.save();if(shake>0)x.translate((Math.random()-.5)*6,(Math.random()-.5)*6);
  bg();PXL.run(drawFXBack,DEC.length+CRK.length+GH.length>0);
  drawPickups();drawRP();drawCP();drawGate();
  PXL.run(()=>{if(cur==8)g8Back();E.forEach(drawE);if(bossOn&&B.hp>0)drawE(B);if(cur==8)g8Fx();if(cur==9)v9Fx();if(cur==10)s10Fx();if(cur>=8&&cur<=10)nbFx();if(isMy(cur))myFx();if(cur==14)m14Fx();if(cur==15)c15Fx();if(cur==16)f16Fx();palDraw();mscDraw()});drawSM();PXL.run(drawTor,TOR.length>0||!!LCK);drawPet();drawHamPet();
  if(FX.dk>0){x.fillStyle='rgba(8,12,28,'+FX.dk+')';x.fillRect(0,0,VW,VH)}
  PXL.run(drawShots);
  drawGD();drawStarF(cam);PXL.run(trailDraw,SWTR.length>1);drawClone();if(cur==MY4&&bossOn&&B&&B.k=='mir'&&B.hp>0&&st=='play')drawMir(B,mirAlpha(B));drawP();drawHamShd();PXL.run(thrDraw,THR.length>0);drawGDHint();PXL.run(()=>drawFairy(x,SPRP.x-cam,SPRP.y,performance.now()/1000,1,P.f),!!(SPR.own&&SPR.on));
  if(P.sand>0){const k=Math.min(1,P.sand/.3),px=P.x+12-cam,py=P.y+16,g=x.createRadialGradient(px,py,36,px,py,150);g.addColorStop(0,'rgba(110,80,35,0)');g.addColorStop(1,'rgba(110,80,35,'+.94*k+')');x.fillStyle=g;x.fillRect(0,0,VW,VH)}
  PXL.run(()=>{drawSk();drawFX();VFX.draw()});drawSkBar();
  if(cur==6){blizDraw();if(P.frz>0){x.fillStyle='rgba(165,216,255,.18)';x.fillRect(0,0,VW,VH)}}
  if(cur==5&&B.stm>0){const k=B.stm,t=performance.now()/1000;x.fillStyle='rgba(222,160,60,'+.38*k+')';x.fillRect(0,0,VW,VH);x.fillStyle='rgba(255,236,190,'+.5*k+')';for(let i=0;i<28;i++)x.fillRect(((i*97+t*520)%(VW+80))-80,(i*37)%GY,40+(i%3)*20,2)}
  if(FX.fl>0){x.fillStyle='rgba('+FX.fc+','+FX.fl+')';x.fillRect(-10,-10,VW+20,VH+20)}
  if(cur==8&&CITY8.I)CITY8.dark();
  if(cur==9&&VOL9.I)VOL9.over();if(cur==10&&SHIP10.I)SHIP10.over();
  hud();if(cur==9)VOL9.hud();godHud();mscHud();drawBanner();if(performance.now()-lvT<2600){const k=Math.min(1,(performance.now()-lvT)/250);x.globalAlpha=Math.min(1,(2600-(performance.now()-lvT))/400);PG(x,[[150,64],[490,64],[476,82],[490,100],[150,100],[164,82]],LG(x,0,64,0,100,['#ffb84d','#e8590c']),2);CTG(lvName(),320,90,19*k+1);x.globalAlpha=1}
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
 {n:'⚔️ 首领猎人',t:'接取后击败任意 2 个首领,任何关卡的 Boss 都算。',need:2,prog:()=>QD.d[2].p,rw:'金币 ×800 · 普通 Lv2 强化石 ×6',give(){gold+=800;STN[2][0]+=6}},
 {n:'👾 小怪清扫',t:'接取后击败 20 只小怪,任何关卡都算(Boss 不算)。',need:20,prog:()=>QD.d[3].p,rw:'技能点 ×1',give(){sp++}}];
function qDay(){const t=today();if(QD.day!=t&&!timeBad()){QD.day=t;QD.d=QDEF.map(()=>({s:0,p:0}))}while(QD.d.length<QDEF.length)QD.d.push({s:0,p:0})}
function qKill(){qDay();const d=QD.d[3];if(d.s==1&&d.p<20){d.p++;if(d.p==20)tx('小怪清扫 20/20 完成!',P.x-30,P.y-62,'#ffd43b')}}
function qBoss(){qDay();const d=QD.d[2];if(d.s==1&&d.p<2){d.p++;tx('首领猎人 '+d.p+'/2',P.x-20,P.y-62,'#ffd43b')}}
// =====================================================================
