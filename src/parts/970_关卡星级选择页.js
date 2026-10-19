// ===== 关卡星级选择页(2026-10-13 第十六轮):点地图牌子 / 神秘副本石狮头后先进这里 =====
// 三张卡片 = 一星 / 二星 / 三星(通关一星才开二星、通关二星才开三星);下面左边是本关会掉的东西,右边是这一星的倍率说明
// LVS:i = 关卡下标(0 起,10 = 神秘副本 1)· s = 选中的星级 · m = 从神秘地带进来(返回时回大厅)
let LVS={i:0,s:1,m:0};
function openLvSel(i,m){const n=i+1;LVS={i,s:Math.min(3,starOf(n)+1),m:m?1:0};if(!starOpen(n,LVS.s))LVS.s=1;st='lvsel';msgU=0;keys.l=keys.r=0;ah=ar=0}
function lvsBack(){st='town';if(!LVS.m)st='map'}
function lvsGo(){const n=LVS.i+1;if(!starOpen(n,LVS.s)){say('先通关'+STARK[LVS.s-1].n+'才能挑战'+STARK[LVS.s].n);return}if(LVS.m){MYS=0;MYR=1}enterLv(n,LVS.s)}
const LVSC=[30,230,430],LVSY=36,LVSW=180,LVSH=150;
function lvsHit(mx,my){if(mx>582&&mx<622&&my>4&&my<32)return 'x';for(let s=0;s<3;s++){const cx=LVSC[s];if(mx>=cx&&mx<=cx+LVSW&&my>=LVSY&&my<=LVSY+LVSH)return s+1}return 0}
function lvsClick(mx,my){const h=lvsHit(mx,my);if(h=='x'){lvsBack();return}if(h){LVS.s=h;lvsGo()}}
function lvsKey(e){const k=e.key;if(k=='Escape'){lvsBack();return}if(KM[k]){if(!e.repeat)LVS.s=((LVS.s-1+(KM[k]=='l'?2:1))%3)+1;return}if(k=='Enter'||k==' '||k=='j'||k=='J'||k=='k'||k=='K'){if(!e.repeat)lvsGo();return}if(k.length==1&&'123'.includes(k))LVS.s=+k}
const lvsName=n=>isM2(n)?MAPS2.find(m=>m.cur==n).n:isMy(n)?'神秘副本 '+(myIdx(n)+1)+' · '+MYNM[myIdx(n)]:MAPS[n-1].n;
// 本关掉落预览:装备 6 个部位(按本关系列;一星画精良、二星稀有、三星史诗的图标)、首领的强化石、特殊掉落
function lvsDrops(n){const L=[],ser=n>=14?4:n==11?1:n<=2?0:n<=4?1:n<=7?2:3;
  for(const sl of ALL){const it=gen(sl,LVS.s>=3?3:LVS.s==2?2:1,null,ser,null,1);L.push({d:(cx,cy)=>eqDraw(it,cx,cy,22),n:SL[sl][0],c:TR[it.tier][1]})}
  for(const l of n>=8&&n<=10||n>=14?[1,2,3]:n>=7&&n<=10||n>=12?[1,2]:[1]){const q=0;L.push({d:(cx,cy)=>stnDraw(x,l,q,cx,cy,1.3),n:'Lv'+l+' 强化石',c:STQ[q].c})}
  for(const [k,nm_,c] of [['A0','属性石',ATSQ[0].c],['gift','小礼袋','#ffd43b']])L.push({d:(cx,cy)=>{if(MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[k]*34,0,34,34,Math.round(cx-11),Math.round(cy-11),22,22);x.restore()}},n:nm_,c})
  if(n==3)L.push({e:'🥚',n:'蛇蛋',c:'#ffe8a3'});if(n==6)L.push({e:'📜',n:'转职凭证',c:'#ffd43b'});if(SOULV[n])L.push({d:(cx,cy)=>soulDraw(x,cx,cy,performance.now()/1000),n:'女神碎片',c:'#d0bfff'});if(n==11)L.push({e:'🥚',n:'仓鼠宠物蛋',c:'#ffe8a3'});
  const mi=k=>(cx,cy)=>{if(MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[k]*34,0,34,34,Math.round(cx-11),Math.round(cy-11),22,22);x.restore()}};
  if(n==12)L.push({d:mi('gc1'),n:'上帝卡牌',c:'#ffe066'});if(MSS[n])L.push({d:mi('ms'+n),n:'怪物技能石',c:'#b197fc'});if(n>=13)L.push({d:mi('add'),n:'合成添加剂',c:'#96f2d7'});if(n==MY4)for(const s of ['sword','staff']){const it=fireW(s,1);L.push({d:(cx,cy)=>eqDraw(it,cx,cy,22),n:it.n,c:'#ff8787'})}if(n==16)L.push({d:mi('b360'),n:'360小鸟碎片',c:'#ffa94d'});  // 第四十轮
  return L}
// 卡片缩略图(全部用已有的外部图集,不自己画):背景 = 该关的像素天空层(LBG / CITY8 / VOL9 / SHIP10 / MYST 大厅),前景 = 该关首领的像素形象
function lvsArt(n,X,Y,W,H,t){x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();x.imageSmoothingEnabled=false;x.fillStyle=['#1a2140','#9bd0f0','#2b1f4a','#9ee07a','#123524','#ffd8a8','#c2e0fa','#2b3a67','#1a1428','#6e1410','#0b1a2e','#2b2440'][n]||'#1a2140';x.fillRect(X,Y,W,H);
  try{if(n<=7&&LBG.I){const m=LBG.M[n];if(m.top){x.fillStyle=m.top;x.fillRect(X,Y,W,H)}if(m.sky)x.drawImage(LBG.I,0,m.sky[0],m.sky[1],m.sky[2],X,Y,W,H);
      const L=m.layers[m.layers.length-1],k=.5;for(let px=X;px<X+W;px+=L[1]*k)x.drawImage(LBG.I,0,L[0],L[1],L[2],px,Y+H-L[2]*k+2,L[1]*k,L[2]*k)}
    else if(n==8&&CITY8.I){const m=CITY8.M.sky;x.drawImage(CITY8.I,m[0],m[1],m[2],m[3],X,Y,W,H)}
    else if(n==9&&VOL9.I){const m=VOL9.M.sky;x.drawImage(VOL9.I,0,m[0],m[1],m[2],X,Y,W,H)}
    else if(n==10&&SHIP10.I){const m=SHIP10.M.sky;x.drawImage(SHIP10.I,0,m[0],m[1],m[2],X,Y,W,H)}
    else if(n==20&&RBT.I){const m=RBT.M.back;x.fillStyle='#061820';x.fillRect(X,Y,W,H);x.drawImage(RBT.I,m[0],m[1]+30,m[2],m[3]-60,X,Y,W,H);const t2=RBT.M.middle;x.drawImage(RBT.I,t2[0],t2[1]+30,t2[2],t2[3]-60,X,Y,W,H)}
    else if(n==19&&ALC.I){const m=ALC.M.p0;x.fillStyle='#272638';x.fillRect(X,Y,W,H);x.drawImage(ALC.I,m[0],m[1]+20,m[2],m[3]-20,X,Y,W,H)}
    else if(n==18&&NJA.I){const m=NJA.M.bg;x.drawImage(NJA.I,m[0],m[1]+30,m[2],m[3]-70,X,Y,W,H)}
    else if(n==16&&FIRE.I){const m=FIRE.M.bg;x.fillStyle='#2a0d08';x.fillRect(X,Y,W,H);x.drawImage(FIRE.I,m[0]+200,m[1],300,m[3],X,Y,W,H)}
    else if(n==15&&CST.I){const m=CST.M.bg;x.fillStyle='#0f1f2a';x.fillRect(X,Y,W,H);x.drawImage(CST.I,m[0]+300,m[1],360,m[3],X,Y,W,H)}
    else if(n==14&&MECH.I){const m=MECH.M.bg,b=MECH.M.bld;x.drawImage(MECH.I,m[0],m[1],m[2],m[3],X,Y,W,H);x.drawImage(MECH.I,b[0],b[1],b[2],b[3],X,Y+H-b[3]*W/b[2],W,b[3]*W/b[2])}
    else if(n==12&&GP.I){const m=GP.M.bg2;x.drawImage(GP.I,m[0]+250,m[1],460,m[3],X,Y,W,H)}
    else if(n==13&&GP.I){const m=GP.M.n_twn;x.fillStyle='#0d1f22';x.fillRect(X,Y,W,H);x.drawImage(GP.I,m[0],m[1],m[2],m[3],X,Y+H-m[3]*.6,W,m[3]*.6)}
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
  else if(n==20)RBT.draw(x,{k:'rgn',h:70,max:1,bsz:1,act:null,mv:0,st:0,aim:0},t);
  else if(n==19)ALC.draw(x,{k:'alm',form:3,h:70,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==18)NJA.draw(x,{k:'nb',h:70,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==16)FIRE.draw(x,{k:'fk',h:78,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==14)MECH.draw(x,{k:'mech',h:66,max:1,bsz:1,act:null,mv:0,st:0},t);
  else if(n==12){x.scale(.9,.9);GP.draw(x,{k:'nmr',act:null,at:0,run:0},t)}
  else if(n==13){x.scale(.75,.75);GP.draw(x,{k:'dmn',act:null,at:0},t)}
  else if(n==90||n==91){x.scale(1.5,1.5);CANT.x=cam-12;CANT.y=-32;const s0=st;st='town';try{drawMir(CANT,.7)}finally{st=s0}}  // 第四十七轮:灿灿技能石的虚影
  else if(n==MY4){x.scale(1.5,1.5);MIRT.x=cam-12;MIRT.y=-32;MIRT.wm=P.mode||LMODE;const s0=st;st='town';try{drawMir(MIRT,.55+.25*Math.sin(t*2.1))}finally{st=s0}}  // 纸娃娃只在 town / play 画
  else MYST.draw(x,{k:'ham',h:62,bsz:1,act:null,at:0,st:0,mv:0},t)}catch(err){}FLW=fl0;x.restore()}
function drawLvSel(){const t=performance.now()/1000,n=LVS.i+1,px=PUI.on(),hv=lvsHit(MX_,MY_),K=STARK[LVS.s];
  if(LVS.m)drawTown();else drawMap();x.fillStyle='rgba(8,8,20,.92)';x.fillRect(0,0,VW,VH);
  if(px)PUI.ns(x,'tD1',12,8,14,9,170,4,300,26);else RR(x,170,4,300,26,13,LG(x,0,4,0,30,['#8a5428','#4a2a12']),1.8);CTG('请选择关卡 · '+lvsName(n),320,23,14);
  if(px)PUI.ns(x,'pC',6,6,6,6,586,6,32,24);else RR(x,586,6,32,24,6,'#2a1f3c',1.4);CT('✕',602,23,14,hv=='x'?'#fff':'#ffd43b','center',0);
  for(let s=1;s<=3;s++){const cx=LVSC[s-1],cy=LVSY,open=starOpen(n,s),on=LVS.s==s,Q=STARK[s];
    if(px)PUI.ns(x,'pC',6,6,6,6,cx,cy,LVSW,LVSH);else RR(x,cx,cy,LVSW,LVSH,8,'#1e1829',1.6);
    lvsArt(n,cx+4,cy+26,LVSW-8,110,t);
    if(!open){x.fillStyle='rgba(10,8,18,.74)';x.fillRect(cx+4,cy+26,LVSW-8,110);CT('🔒',cx+LVSW/2,cy+86,22,'#fff','center',0);CT('通关'+STARK[s-1].n+'后解锁',cx+LVSW/2,cy+108,9,'#ced4da','center',2.2,'#120d18')}
    else if(starOf(n)>=s)CT('✔ 已通关',cx+LVSW-10,cy+40,9,'#69db7c','right',2.2,'#0b3a1e');
    CT('难度:',cx+44,cy+19,12,'#fff','left',2.6,'#3a1d0a');for(let k=0;k<3;k++)CT('★',cx+90+k*16,cy+20,14,k<s?Q.c:'#555b66','center',2.4,'#2b1a12');
    if(on||hv===s){x.save();x.strokeStyle=on?'rgba(255,212,59,'+(.7+.3*Math.sin(t*6))+')':'rgba(255,255,220,.5)';x.lineWidth=on?3:1.5;x.strokeRect(cx+1.5,cy+1.5,LVSW-3,LVSH-3);x.restore()}
    CT(['正常推进','满强化 / 高一级装备','挑战 · 刷史诗装备'][s-1],cx+LVSW/2,cy+LVSH-6,8,'#fff3bf','center',2,'#120d18')}
  if(px)PUI.ns(x,'pA',20,14,20,14,30,194,380,146);else RR(x,30,194,380,146,10,LG(x,0,194,0,340,['#3d3352','#1e1829']),1.8);
  CTG('掉落物品',74,214,13);CT('星级越高,越容易掉高品质装备',256,214,8,'#dee2e6','center',2,'#120d18');
  lvsDrops(n).forEach((q,i)=>{const gx=54+(i%8)*45,gy=250+Math.floor(i/8)*46;if(px)PUI.ns(x,'pC',6,6,6,6,gx-17,gy-17,34,34);else RR(x,gx-17,gy-17,34,34,6,'#120d18',1.2);
    if(q.d)q.d(gx,gy);else CT(q.e,gx,gy+6,16,'#fff','center',0);CT(q.n,gx,gy+27,7,q.c,'center',2,'#120d18')});
  if(px)PUI.ns(x,'pA',20,14,20,14,418,194,194,146);else RR(x,418,194,194,146,10,LG(x,0,194,0,340,['#3d3352','#1e1829']),1.8);
  CTG(K.n+'难度',515,214,13);
  const rl=[['怪物生命','×'+K.hp],['怪物攻击','×'+K.atk],['怪物防御','+'+K.def],['动作速度','+'+Math.round((K.sp-1)*100)+'%'],['经验 / 金币','×'+K.xp],['掉落率','×'+K.dr]];  // 第十九轮补充:装备 / 强化石 / 属性石的掉落概率不在游戏里显示
  rl.forEach((r,i)=>{const yy=232+i*12;CT(r[0],432,yy,8,'#ffe066','left',2,'#120d18');CT(r[1],604,yy,8,'#fff','right',2,'#120d18')});
  CT('← → 或 1 2 3 选择星级 · Enter / 点击卡片进入 · Esc 返回',320,352,8,'#fff','center',2.2,'#0b3a6b');
  if(performance.now()<msgU)CT(msg,320,190,11,'#ffe3e3','center',2.6,'#7a1f1f')}

// =====================================================================
