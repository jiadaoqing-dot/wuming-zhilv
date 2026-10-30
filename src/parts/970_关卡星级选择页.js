// ===== 关卡星级选择页(2026-10-13 第十六轮):点地图牌子 / 神秘副本石狮头后先进这里 =====
// 三张卡片 = 一星 / 二星 / 三星(通关一星才开二星、通关二星才开三星);下面左边是本关会掉的东西,右边是这一星的倍率说明
// LVS:i = 关卡下标(0 起,10 = 神秘副本 1)· s = 选中的星级 · m = 从神秘地带进来(返回时回大厅)
let LVS={i:0,s:1,m:0};
function openLvSel(i,m){const n=i+1;if(c4Map(n,()=>{LVS={i,s:4,m:m==2?2:m?1:0};lvsGo()}))return;  /* 第六十七轮:挑战模式直接四星 */LVS={i,s:Math.min(3,starOf(n)+1),m:m==2?2:m?1:0};if(!starOpen(n,LVS.s))LVS.s=1;st='lvsel';msgU=0;keys.l=keys.r=0;ah=ar=0}
function lvsBack(){st='town';if(!LVS.m)st='map';if(LVS.m==2)st='dms'}
function lvsGo(){const n=LVS.i+1;if(!starOpen(n,LVS.s)){say('先通关'+STARK[LVS.s-1].n+'才能挑战'+STARK[LVS.s].n);return}if(LVS.m==1){MYS=0;MYR=1}enterLv(n,LVS.s)}
const LVSY=36,LVSH=150,lvsN=()=>c4OK(LVS.i+1)?4:3,lvsCX=s=>lvsN()==4?14+(s-1)*156:30+(s-1)*200,lvsW=()=>lvsN()==4?144:180;  // 第六十五轮:能开四星的关卡显示四张卡(第六十六轮:神秘副本 / 十二魔也开)
function lvsHit(mx,my){if(mx>582&&mx<622&&my>4&&my<32)return 'x';if(sweepHit(mx,my))return 'sw';const W=lvsW();for(let s=1;s<=lvsN();s++){const cx=lvsCX(s);if(mx>=cx&&mx<=cx+W&&my>=LVSY&&my<=LVSY+LVSH)return s}return 0}
function lvsClick(mx,my){const h=lvsHit(mx,my);if(h=='x'){lvsBack();return}if(h=='sw'){sweepGo();return}if(h){LVS.s=h;lvsGo()}}
function lvsKey(e){const k=e.key;if(k=='Escape'){lvsBack();return}if(KM[k]){if(!e.repeat){const N=lvsN();LVS.s=((LVS.s-1+(KM[k]=='l'?N-1:1))%N)+1}return}if(k=='Enter'||k==' '||k=='j'||k=='J'||k=='k'||k=='K'){if(!e.repeat)lvsGo();return}if(k.length==1&&'1234'.slice(0,lvsN()).includes(k))LVS.s=+k;if((k=='s'||k=='S')&&!e.repeat&&sweepOK(LVS.i+1))sweepGo()}  // 第五十九轮:S = 一键扫荡
const lvsName=n=>isTw(n)?'暗黑炼狱 · 第 '+TWF+' 层':isDm(n)?'十二魔封印 '+(n-DM0+1)+' · '+DMD[n-DM0].n:isM2(n)?MAPS2.find(m=>m.cur==n).n:isMy(n)?'神秘副本 '+(myIdx(n)+1)+' · '+MYNM[myIdx(n)]:MAPS[n-1].n;
// 本关掉落预览:装备 6 个部位(按本关系列;一星画精良、二星稀有、三星史诗的图标)、首领的强化石、特殊掉落
function lvsDrops(n){const L=[],ser=n>=14?4:n==11?1:n<=2?0:n<=4?1:n<=7?2:3;
  for(const sl of ALL){const it=gen(sl,LVS.s>=3?3:LVS.s==2?2:1,null,ser,null,1);L.push({d:(cx,cy)=>eqDraw(it,cx,cy,22),n:SL[sl][0],c:TR[it.tier][1]})}
  for(const l of n>=16?[1,2,3,4]:n>=8&&n<=10||n>=14?[1,2,3]:n>=7&&n<=10||n>=12?[1,2]:[1]){const q=0;L.push({d:(cx,cy)=>stnDraw(x,l,q,cx,cy,1.3),n:'Lv'+l+' 强化石',c:STQ[q].c})}
  for(const [k,nm_,c] of [['A0','属性石',ATSQ[0].c],['gift','小礼袋','#ffd43b']])L.push({d:(cx,cy)=>{if(MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[k]*34,0,34,34,Math.round(cx-11),Math.round(cy-11),22,22);x.restore()}},n:nm_,c})
  if(n==3)L.push({e:'🥚',n:'蛇蛋',c:'#ffe8a3'});if(n==6)L.push({e:'📜',n:'转职凭证',c:'#ffd43b'});if(SOULV[n])L.push({d:(cx,cy)=>soulDraw(x,cx,cy,performance.now()/1000),n:'女神碎片',c:'#d0bfff'});if(n==11)L.push({e:'🥚',n:'仓鼠宠物蛋',c:'#ffe8a3'});
  const mi=k=>(cx,cy)=>{if(MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[k]*34,0,34,34,Math.round(cx-11),Math.round(cy-11),22,22);x.restore()}};
  if(n==12)L.push({d:mi('gc1'),n:'上帝卡牌',c:'#ffe066'});if(MSS[n])L.push({d:mi('ms'+n),n:'怪物技能石',c:'#b197fc'});if(n>=13)L.push({d:mi('add'),n:'合成添加剂',c:'#96f2d7'});if(n==MY4)for(const s of WMODES){const it=fireW(s,1);L.push({d:(cx,cy)=>eqDraw(it,cx,cy,22),n:it.n,c:'#ff8787'})}if(n==MY5)for(const s of WMODES){const it=fireW(s,3);L.push({d:(cx,cy)=>eqDraw(it,cx,cy,22),n:(s=='sword'?'紫焰大剑':'紫焰法杖')+'★3',c:'#e599f7'})}if(n==16)L.push({d:mi('b360'),n:'360小鸟碎片',c:'#ffa94d'});if(isDm(n)&&MISC['cz'+(n-DM0)])L.push({d:mi('cz'+(n-DM0)),n:'诅咒之力',c:'#ff6b6b'});  // 第四十轮
  return L}
// 卡片缩略图(全部用已有的外部图集,不自己画):背景 = 该关的像素天空层(LBG / CITY8 / VOL9 / SHIP10 / MYST 大厅),前景 = 该关首领的像素形象
function lvsArt(n,X,Y,W,H,t){x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.imageSmoothingEnabled=false;x.fillStyle=['#1a2140','#9bd0f0','#2b1f4a','#9ee07a','#123524','#ffd8a8','#c2e0fa','#2b3a67','#1a1428','#6e1410','#0b1a2e','#2b2440'][n]||'#1a2140';x.fillRect(X,Y,W,H);
  try{if(n<=7&&LBG.I){const m=LBG.M[n];if(m.top){x.fillStyle=m.top;x.fillRect(X,Y,W,H)}if(m.sky)x.drawImage(LBG.I,0,m.sky[0],m.sky[1],m.sky[2],X,Y,W,H);
      const L=m.layers[m.layers.length-1],k=.5;for(let px=X;px<X+W;px+=L[1]*k)x.drawImage(LBG.I,0,L[0],L[1],L[2],px,Y+H-L[2]*k+2,L[1]*k,L[2]*k)}
    else if(n==8&&CITY8.I){const m=CITY8.M.sky;x.drawImage(CITY8.I,m[0],m[1],m[2],m[3],X,Y,W,H)}
    else if(n==9&&VOL9.I){const m=VOL9.M.sky;x.drawImage(VOL9.I,0,m[0],m[1],m[2],X,Y,W,H)}
    else if(n==10&&SHIP10.I){const m=SHIP10.M.sky;x.drawImage(SHIP10.I,0,m[0],m[1],m[2],X,Y,W,H)}
    else if(isDm(n)){const k=DMD[n-DM0].k;if(k=='asmo'&&ALC.I){const m=ALC.M.p0;x.drawImage(ALC.I,m[0],m[1]+20,m[2],m[3]-20,X,Y,W,H);x.fillStyle='rgba(96,0,64,.4)';x.fillRect(X,Y,W,H)}else if(k=='beli'&&CST.I){const m=CST.M.bg;x.drawImage(CST.I,m[0]+300,m[1],360,m[3],X,Y,W,H);x.fillStyle='rgba(90,64,10,.3)';x.fillRect(X,Y,W,H)}else if(k=='asta'&&NJA.I){const m=NJA.M.bg;x.drawImage(NJA.I,m[0],m[1]+30,m[2],m[3]-70,X,Y,W,H);x.fillStyle='rgba(22,40,6,.45)';x.fillRect(X,Y,W,H)}else if(k=='belz'&&CITY8.I){x.drawImage(CITY8.I,2300,0,560,300,X,Y,W,H);x.fillStyle='rgba(44,48,0,.5)';x.fillRect(X,Y,W,H)}else if(k=='mamm'&&RBT.I){const m=RBT.M.back;x.drawImage(RBT.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.fillStyle='rgba(120,80,0,.35)';x.fillRect(X,Y,W,H)}else if(k=='levi'&&GP.I){const m=GP.M.bg2;x.drawImage(GP.I,m[0],m[1],250,m[3],X,Y,W,H);x.fillStyle='rgba(0,50,70,.5)';x.fillRect(X,Y,W,H)}else if(k=='belp'&&MECH.I){const m=MECH.M.bg;x.drawImage(MECH.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.fillStyle='rgba(60,20,96,.45)';x.fillRect(X,Y,W,H)}else if(k=='azaz'&&IFN.I){const m=IFN.M.bk;x.drawImage(IFN.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.fillStyle='rgba(24,22,30,.35)';x.fillRect(X,Y,W,H)}else if(k=='luci'&&VOL9.I){const m=VOL9.M.sky;x.drawImage(VOL9.I,m[4]||0,m[0],m[1],m[2],X,Y,W,H);x.fillStyle='rgba(56,10,90,.45)';x.fillRect(X,Y,W,H)}else if(k=='baal'&&GP.I){const m=GP.M.n_twn;x.fillStyle='#2a0806';x.fillRect(X,Y,W,H);x.drawImage(GP.I,m[0],m[1],m[2],m[3],X,Y+H-m[3]*.6,W,m[3]*.6)}else if(k=='dagon'&&GP.I){const m=GP.M.bg2;x.drawImage(GP.I,m[0]+250,m[1],460,m[3],X,Y,W,H);x.fillStyle='rgba(0,36,64,.45)';x.fillRect(X,Y,W,H)}else if(FIRE.I){const m=FIRE.M.bg;x.fillStyle='#2a0d08';x.fillRect(X,Y,W,H);x.drawImage(FIRE.I,m[0]+200,m[1],300,m[3],X,Y,W,H)}}  // 第五十五轮:十二魔封印
    else if(n==21&&IFN.I){const m=IFN.M.bk;x.drawImage(IFN.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.fillStyle='rgba(16,3,6,.62)';x.fillRect(X,Y,W,H);const t2=IFN.M.md;x.filter='brightness(.45)';x.drawImage(IFN.I,t2[0],t2[1]+40,t2[2],t2[3]-40,X,Y+H*.25,W,H*.75);x.filter='none'}
    else if(n==20&&RBT.I){const m=RBT.M.back;x.fillStyle='#061820';x.fillRect(X,Y,W,H);x.drawImage(RBT.I,m[0],m[1]+30,m[2],m[3]-60,X,Y,W,H);const t2=RBT.M.middle;x.drawImage(RBT.I,t2[0],t2[1]+30,t2[2],t2[3]-60,X,Y,W,H)}
    else if(n==19&&ALC.I){const m=ALC.M.p0;x.fillStyle='#272638';x.fillRect(X,Y,W,H);x.drawImage(ALC.I,m[0],m[1]+20,m[2],m[3]-20,X,Y,W,H)}
    else if(n==18&&NJA.I){const m=NJA.M.bg;x.drawImage(NJA.I,m[0],m[1]+30,m[2],m[3]-70,X,Y,W,H)}
    else if(n==16&&FIRE.I){const m=FIRE.M.bg;x.fillStyle='#2a0d08';x.fillRect(X,Y,W,H);x.drawImage(FIRE.I,m[0]+200,m[1],300,m[3],X,Y,W,H)}
    else if(n==15&&CST.I){const m=CST.M.bg;x.fillStyle='#0f1f2a';x.fillRect(X,Y,W,H);x.drawImage(CST.I,m[0]+300,m[1],360,m[3],X,Y,W,H)}
    else if(n==14&&MECH.I){const m=MECH.M.bg,b=MECH.M.bld;x.drawImage(MECH.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.drawImage(MECH.I,b[0],b[1],b[2],b[3],X,Y+H-b[3]*W/b[2],W,b[3]*W/b[2])}
    else if(n==12&&GP.I){const m=GP.M.bg2;x.drawImage(GP.I,m[0]+250,m[1],460,m[3],X,Y,W,H)}
    else if(n==13&&GP.I){const m=GP.M.n_twn;x.fillStyle='#0d1f22';x.fillRect(X,Y,W,H);x.drawImage(GP.I,m[0],m[1],m[2],m[3],X,Y+H-m[3]*.6,W,m[3]*.6)}
    else if(n==MY5)pfgArt(X,Y,W,H,t);  // 第五十九轮
    else if(n>=11&&MYST.I){const m=MYST.M.hall;x.drawImage(MYST.I,m[0]+220,m[1],330,m[3],X,Y,W,H)}}catch(err){}
  lvsBoss(n,X+W/2,Y+H-6,t);x.restore()}
function lvsBoss(n,bx,by,t){x.save();x.translate(bx,by);const fl0=FLW;FLW=0;try{
  if(n==1){x.scale(.72,.72);MNT.draw(x,{k:'boss',act:null,at:0,st:0,mvs:0,hp:2,max:2,dg:0},t)}
  else if(n==2){x.scale(1.2,1.2);BOS.mage(x,{fire:1,tpT:0,st:0,al:1},t)}
  else if(n==3){x.scale(.95,.95);KB.king(x,{act:null,at:0,mvs:0,bf:0},t)}
  else if(n==4){x.scale(1.4,1.4);BOS.scob(x,{act:null,mvs:0},t)}
  else if(n==5){x.scale(.85,.85);ARS.boss(x,{k:'andr',al:1},t)}
  else if(n==6){x.scale(.8,.8);KB.bear(x,{act:null,at:0,pz:null,rage:0,gs:null,dz:0,kn:0,mvs:0,n:0},t)}
  else if(n==7){x.scale(.8,.8);ARS.boss(x,{k:'wiz',fm:1,al:1},t)}
  else if(n==8)GH8.draw(x,{k:'yin',h:79,ug:0,act:null,pz:null,dz:0,fl:0,p3:0},t);
  else if(n==9)VOL9.draw(x,{k:'lava',max:1,bsz:1,h:70,pz:null,at:0,ph:0},t);
  else if(n==10)SHIP10.draw(x,{k:'gui',max:1,bsz:1,h:77,act:null,pz:null,hide:0,at:0},t);
  else if(n==15)CST.draw(x,{k:'nk',h:70,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(isDm(n))DMN.pt(x,DMD[n-DM0].k,0,4,DMD[n-DM0].k=='dagon'?80:90,t);
  else if(n==21)IFN.draw(x,{k:'ifg',h:76,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==20)RBT.draw(x,{k:'rgn',h:70,max:1,bsz:1,act:null,mv:0,st:0,aim:0},t);
  else if(n==19)ALC.draw(x,{k:'alm',form:3,h:70,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==18)NJA.draw(x,{k:'nb',h:70,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==16)FIRE.draw(x,{k:'fk',h:78,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==14)MECH.draw(x,{k:'mech',h:66,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==12){x.scale(.9,.9);GP.draw(x,{k:'nmr',act:null,at:0,run:0},t)}
  else if(n==13){x.scale(.75,.75);GP.draw(x,{k:'dmn',act:null,at:0},t)}
  else if(n==90||n==91){x.scale(1.5,1.5);CANT.x=cam-12;CANT.y=-32;const s0=st;st='town';try{drawMir(CANT,.7)}finally{st=s0}}  // 第四十七轮:灿灿技能石的虚影
  else if(n==MY5)PPF.pt(x,0,0,120,t);
  else if(n==MY4){x.scale(1.5,1.5);MIRT.x=cam-12;MIRT.y=-32;MIRT.wm=P.mode||LMODE;const s0=st;st='town';try{drawMir(MIRT,.55+.25*Math.sin(t*2.1))}finally{st=s0}}  // 纸娃娃只在 town / play 画
  else MYST.draw(x,{k:'ham',h:62,bsz:1,act:null,at:0,st:0,mv:0},t)}catch(err){}FLW=fl0;x.restore()}
function drawLvSel(){const t=performance.now()/1000,n=LVS.i+1,px=PUI.on(),hv=lvsHit(MX_,MY_),K=STARK[LVS.s];
  if(LVS.m==2)drawDms();else if(LVS.m)drawTown();else drawMap();x.fillStyle='rgba(8,8,20,.92)';x.fillRect(0,0,VW,VH);
  if(px)PUI.ns(x,'tD1',12,8,14,9,170,4,300,26);else RR(x,170,4,300,26,13,LG(x,0,4,0,30,['#8a5428','#4a2a12']),1.8);CTG('请选择关卡 · '+lvsName(n),320,23,14);
  if(px)PUI.ns(x,'pC',6,6,6,6,586,6,32,24);else RR(x,586,6,32,24,6,'#2a1f3c',1.4);CT('✕',602,23,14,hv=='x'?'#fff':'#ffd43b','center',0);sweepDraw(n,hv);
  const NS=lvsN(),LW=lvsW();for(let s=1;s<=NS;s++){const cx=lvsCX(s),cy=LVSY,open=starOpen(n,s),on=LVS.s==s,Q=STARK[s];
    if(px)PUI.ns(x,'pC',6,6,6,6,cx,cy,LW,LVSH);else RR(x,cx,cy,LW,LVSH,8,'#1e1829',1.6);
    lvsArt(n,cx+4,cy+26,LW-8,110,t);if(s==4&&open){x.fillStyle='rgba(60,10,80,.28)';x.fillRect(cx+4,cy+26,LW-8,110)}
    if(!open){x.fillStyle='rgba(10,8,18,.74)';x.fillRect(cx+4,cy+26,LW-8,110);CT('🔒',cx+LW/2,cy+86,22,'#fff','center',0);CT('通关'+STARK[s-1].n+'后解锁',cx+LW/2,cy+108,9,'#ced4da','center',2.2,'#120d18')}
    else if(starOf(n)>=s)CT('✔ 已通关',cx+LW-10,cy+40,9,'#69db7c','right',2.2,'#0b3a1e');
    CT('难度:',cx+LW/2-46,cy+19,12,'#fff','left',2.6,'#3a1d0a');for(let k=0;k<NS;k++)CT('★',cx+LW/2+k*(NS==4?13:16),cy+20,14,k<s?Q.c:'#555b66','center',2.4,'#2b1a12');
    if(on||hv===s){x.save();x.strokeStyle=on?'rgba(255,212,59,'+(.7+.3*Math.sin(t*6))+')':'rgba(255,255,220,.5)';x.lineWidth=on?3:1.5;x.strokeRect(cx+1.5,cy+1.5,LW-3,LVSH-3);x.restore()}
    CT(['正常推进','满强化 / 高一级装备','挑战 · 刷史诗装备','魂类试炼 · 只看技巧'][s-1],cx+LW/2,cy+LVSH-6,8,'#fff3bf','center',2,'#120d18')}
  if(px)PUI.ns(x,'pA',20,14,20,14,30,194,380,146);else RR(x,30,194,380,146,10,LG(x,0,194,0,340,['#3d3352','#1e1829']),1.8);
  CTG('掉落物品',74,214,13);CT(LVS.s==4?'四星没有掉落,首领倒下得挑战积分':'星级越高,越容易掉高品质装备',256,214,8,'#dee2e6','center',2,'#120d18');
  (LVS.s==4?c4Drops(n):lvsDrops(n)).forEach((q,i)=>{const gx=54+(i%8)*45,gy=250+Math.floor(i/8)*46;if(px)PUI.ns(x,'pC',6,6,6,6,gx-17,gy-17,34,34);else RR(x,gx-17,gy-17,34,34,6,'#120d18',1.2);
    if(q.d)q.d(gx,gy);else CT(q.e,gx,gy+6,16,'#fff','center',0);CT(q.n,gx,gy+27,7,q.c,'center',2,'#120d18')});
  if(px)PUI.ns(x,'pA',20,14,20,14,418,194,194,146);else RR(x,418,194,194,146,10,LG(x,0,194,0,340,['#3d3352','#1e1829']),1.8);
  CTG(K.n+'难度',515,214,13);
  const rl=LVS.s==4?[['伤害','按最大生命 %'],['装备 / 等级','不起作用'],['怪物一下','约 10%~34%'],['暴击 / 闪避','10% / 0'],['生命药水','每关 '+C4Q+' 瓶'],['复活 / 掉落','没有']]:[['怪物生命','×'+K.hp],['怪物攻击','×'+K.atk],['怪物防御','+'+K.def],['动作速度','+'+Math.round((K.sp-1)*100)+'%'],['经验 / 金币','×'+K.xp],['掉落率','×'+K.dr]];  // 第十九轮补充:装备 / 强化石 / 属性石的掉落概率不在游戏里显示
  rl.forEach((r,i)=>{const yy=232+i*12;CT(r[0],432,yy,8,'#ffe066','left',2,'#120d18');CT(r[1],604,yy,8,'#fff','right',2,'#120d18')});
  CT('← → 或 1 2 3'+(lvsN()==4?' 4':'')+' 选择星级 · Enter / 点击卡片进入'+(sweepOK(n)?' · S 一键扫荡(三星)':'')+' · Esc 返回',320,352,8,'#fff','center',2.2,'#0b3a6b');
  if(performance.now()<msgU)CT(msg,320,190,11,'#ffe3e3','center',2.6,'#7a1f1f')}

// =====================================================================
