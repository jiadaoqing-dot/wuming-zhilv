// ===== HUD:头像 + 血蓝条 + 金币 + 连击 + 状态 + Boss 血条 =====
// =====================================================================
let HHC={k:'',cv:null};
function heroHeadC(cx,cy,s){const lk=heroLook(),k=JSON.stringify(lk)+P.ps;if(HHC.k!=k){HHC.k=k;HHC.cv=mkL(48,48,c=>heroHead(c,24,24,s,0))}x.drawImage(HHC.cv,cx-24,cy-24,48,48)}
function heroHead(c,cx,cy,s,tt){c.save();c.beginPath();c.arc(cx,cy,22,0,7);c.clip();c.fillStyle=LG(c,0,cy-22,0,cy+22,['#8fd0ff','#3b6fd6']);c.fillRect(cx-22,cy-22,44,44);c.translate(cx-1*s,cy+33*s);c.scale(s,s);drawChibi(c,{...heroLook(),wing:null,ps:P.ps>0,t:tt==null?performance.now()/1000:tt});c.restore()}
// 像素 HUD:左上角 = 紫金头像框 + 菱形等级 + 深蓝金花面板上的血条(金边华丽框)/ 魔力条(箭头框)/ 经验细条 + 菱形武器格 + 金币牌
function hudPx(S){const P_=PUI;
  P_.ns(x,'pA',20,14,20,14,40,4,200,48);
  P_.bar(x,'bA',56,9,150,P.hp/S.hp,['#ff8a8a','#e03131','#8a1414']);CT('HP '+Math.ceil(Math.max(0,P.hp))+'/'+S.hp,62,17,8,'#fff','left',2,'#120d18');
  P_.bar(x,'bB',56,27,138,P.mp/S.mp,['#8fd0ff','#1c7ed6','#123d82']);CT('MP '+Math.floor(P.mp)+'/'+S.mp,64,34,8,'#fff','left',2,'#120d18');
  x.fillStyle='#120d18';x.fillRect(62,44,128,4);x.fillStyle='#ffd43b';x.fillRect(63,45,Math.round(126*Math.min(1,exp/expNeed(lvl))),2);
  P_.ns(x,'pC',6,6,6,6,4,4,48,48);x.fillStyle='#1b1533';x.fillRect(10,10,36,36);P_.head(28,28);
  P_.img(x,'dia1',-2,32);CT(String(lvl),13,52,lvl>99?8:12,'#fffbe6','center',2,'#3a1d0a');
  if(isVip()){P_.ns(x,'tG1',8,6,8,7,30,48,30,15);CT('VIP',45,59,8,'#7a2e00','center',0)}
  P_.img(x,'dia1',198,9);if(EQ[P.mode])eqDraw(EQ[P.mode],213,24,17);else CT(SL[P.mode][1],213,29,12,'#fff','center',0);
  P_.ns(x,'tD1',12,8,14,9,4,62,94,20);P_.coin(x,16,72);CT(String(gold),25,76,12,'#ffe066','left',2,'#1e1829')}
function hud(){const S=stats(),t=performance.now()/1000,px=PUI.on();
  if(px)hudPx(S);else{
  // 血蓝条底板
  PG(x,[[40,10],[218,10],[206,48],[40,48]],LG(x,0,10,0,48,['#3d3352','#1e1829']),1.8);LN_(x,[[44,13],[214,13]],'rgba(255,212,59,.5)',1);
  const hb=(by,h,wd,v,cols,label)=>{RR(x,58,by,wd,h,h/2,'#120d18',0);if(v>0)RR(x,58,by,Math.max(h,wd*Math.min(1,v)),h,h/2,LG(x,0,by,0,by+h,cols),0);RR(x,60,by+1,Math.max(0,wd*Math.min(1,v)-4),h*.35,h/4,'rgba(255,255,255,.35)',0);CT(label,64,by+h-2.2,h-2,'#fff','left',2.4,'#120d18')};
  hb(16,12,138,P.hp/S.hp,['#ff8a8a','#e03131','#a61e1e'],'HP:'+Math.ceil(Math.max(0,P.hp))+'/'+S.hp);
  hb(31,10,126,P.mp/S.mp,['#8fd0ff','#1c7ed6','#174ea6'],'MP:'+Math.floor(P.mp)+'/'+S.mp);
  RR(x,58,43,118,3,1.5,'#120d18',0);RR(x,58,43,118*Math.min(1,exp/expNeed(lvl)),3,1.5,'#ffd43b',0);
  // 头像
  C_(x,30,30,25,LG(x,0,5,0,55,['#ffe066','#f08c00','#b35c00']),1.8);heroHeadC(30,30,1.05);x.beginPath();x.arc(30,30,22,0,7);x.strokeStyle=OL;x.lineWidth=1.6;x.stroke();
  RR(x,4,40,26,18,6,LG(x,0,40,0,58,['#ffe066','#e8890c']),1.6);CTG(String(lvl),17,55,lvl>9?13:15,['#fffbe6','#ffffff','#ffe3a3']);
  if(isVip()){RR(x,36,47,32,13,6.5,LG(x,0,47,0,60,['#fff3bf','#fab005','#e8590c']),1.4);CT('VIP',52,57.4,9,'#fff','center',2.2,'#7a2e00')}
  C_(x,222,28,11,LG(x,0,17,0,39,['#5c4a7a','#2a1f3c']),1.6);if(EQ[P.mode])eqDraw(EQ[P.mode],222,28,19);else CT(SL[P.mode][1],222,33,12,'#fff','center',0);
  RR(x,8,62,86,16,8,'rgba(30,20,40,.82)',1.4);C_(x,18,70,5.4,LG(x,0,64,0,76,['#fff3bf','#fab005']),1.1);CT('¥',18,73,7,'#b35c00','center',0);CT(String(gold),27,74.5,11,'#ffe066','left',2.6,'#1e1829');}
  // 连击
  if((P.combo||0)>=3&&st=='play'){const j=(setTr().ji||0)>=2,pop=1+Math.max(0,(P.cbT||0)-1.85)*2.6;x.save();x.translate(46,104);x.scale(pop,pop);
    PG(x,Array.from({length:24},(_,i)=>{const r=i%2?11:19,a=i*Math.PI/12+t;return [-18+Math.cos(a)*r,Math.sin(a)*r]}),LG(x,0,-19,0,19,['#fff9db','#ffd43b','#ff922b']),1.6);
    CTG(String(P.combo),-18,10,26,['#fffbe6','#ffd43b','#ff6b35'],'center');x.restore()}  // 第十三轮:只留连击数字,不再写「连击」「神技 攻击+」
  if(P.ch>.15){const k=Math.min(1,P.ch/.7);RR(x,P.x-cam-6,P.y-24,36,6,3,'#1e1829',1.2);RR(x,P.x-cam-5,P.y-23,34*k,4,2,P.ch>=.7?LG(x,0,0,34,0,['#ffe066','#ff922b']):'#fff',0)}
  if(st!='play'){const tg=[];if(P.ps>0)tg.push(['☠ 中毒 '+Math.ceil(P.ps)+'s','#2b8a3e']);if(P.slw>0||P.wz)tg.push(['🕸 减速','#868e96']);if(P.sand>0)tg.push(['🌪 沙尘','#b08d57']);if(P.ar>0)tg.push(['🛡 霸体','#e67700']);
   if(P.fly)tg.push(['🎀 飞行中','#d6336c']);if(P.spdT>0)tg.push(['💨 御风 '+Math.ceil(P.spdT)+'s','#0ca678']);if(P.apen>0)tg.push(['🗡 破甲 '+Math.ceil(P.apen)+'s','#1098ad']);if(P.wy>0)tg.push(['🔥 战意 '+Math.ceil(P.wy)+'s','#e03131']);if(P.shdT>0&&P.shd>0)tg.push(['🪨 岩盾 '+P.shd+' · '+Math.ceil(P.shdT)+'s','#a0703a']);if(P.pAtk>0)tg.push(['⚔ 攻击+ '+Math.ceil(P.pAtk)+'s','#e8590c']);if(P.pDef>0)tg.push(['🛡 防御+ '+Math.ceil(P.pDef)+'s','#1971c2']);
   tg.forEach((g,i)=>{const gx=100+(i%4)*68,gy=62+Math.floor(i/4)*18;if(px)PUI.box(x,gx,gy,64,15,g[1]);else RR(x,gx,gy,64,15,7.5,g[1],1.3);CT(g[0],gx+32,gy+11,9,'#fff','center',2.2,'#1e1829')})}
  {const q=mqCur();if(q&&QD.ms==1&&st=='play'){const dn=QD.mp>=q.need,s_='📜 '+q.n+(dn?' · 完成!'+'按 Q 领奖':q.lv!=cur?' · 前往第 '+mqCh(q)+' 关':' '+QD.mp+'/'+q.need);x.font='900 10px '+CTF;const w=x.measureText(s_).width+16,yy=bossOn&&B.hp>0?(isTw(cur)&&E.some(e=>e.twb&&e.hp>0)?60:40):8;
    if(px)PUI.ns(x,'tD1',12,8,14,9,VW-10-w,yy-1,w+6,21);else RR(x,VW-6-w,yy,w,18,9,'rgba(30,20,40,.82)',1.3);CT(s_,VW-14,yy+13,10,dn?'#69db7c':'#ffe066','right',2.2,'#120d18')}}
  if(st=='play')hudTop(px);
  if(bossOn&&B.hp>0){const bx=250,by=14,bw=300;
    if(px){PUI.bar(x,'bA',bx-6,by+1,bw+12,B.hp/B.max,['#ff8a8a','#e03131','#8a1414']);if(B.sh>0){x.fillStyle='#74c0fc';x.fillRect(bx-2,by+3,Math.round(Math.min(bw,bw*B.sh/B.max)),2)}for(let k=1;k<10;k++){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(Math.round(bx+k*bw/10),by+3,1,6)}}
    else{RR(x,bx-4,by-4,bw+8,22,10,LG(x,0,by-4,0,by+18,['#3d3352','#1e1829']),1.8);RR(x,bx,by+4,bw,10,5,'#120d18',0);RR(x,bx,by+4,bw*B.hp/B.max,10,5,LG(x,0,by+4,0,by+14,['#ff8a8a','#e03131','#8a1414']),0);
    if(B.sh>0)RR(x,bx,by+4,Math.min(bw,bw*B.sh/B.max),5,2.5,'#74c0fc',0);for(let k=1;k<10;k++)LN_(x,[[bx+k*bw/10,by+5],[bx+k*bw/10,by+13]],'rgba(0,0,0,.35)',1)}
    if(B.k!='mir'&&BLN[cur])for(let j=0;j<BSAH.length;j++){x.fillStyle=(B.saN|0)>j?'rgba(255,107,107,.55)':'#ffe066';x.fillRect(Math.round(bx+bw*BSAH[j])-1,by+(px?1:3),2,px?10:12)}  // 第四十四轮:霸体线刻度(已触发的变暗红)
    if(B.saT>0){const yy=by+(px?13:17);x.fillStyle='rgba(20,12,24,.85)';x.fillRect(bx,yy,bw,3);x.fillStyle='rgba(255,70,70,'+(.6+.35*Math.sin(t*14))+')';x.fillRect(bx,yy,Math.round(bw*B.saT/BSAT),3)}  // 霸体剩余时间(红色闪烁)
    else if(B.pzm){const k=B.pim>0?1:Math.max(0,B.po/B.pzm),yy=by+(px?13:17);x.fillStyle='rgba(20,12,24,.85)';x.fillRect(bx,yy,bw,3);x.fillStyle=B.pim>0?'rgba(173,181,189,'+(.45+.25*Math.sin(t*10))+')':'#ffc038';x.fillRect(bx,yy,Math.round(bw*k),3)}
    if(B.emp!=null){const yy=by+(px?17:21);x.fillStyle='rgba(20,12,24,.85)';x.fillRect(bx,yy,bw,3);x.fillStyle=B.erg?'rgba(116,192,252,'+(.45+.25*Math.sin(t*8))+')':'#4dabf7';x.fillRect(bx,yy,Math.round(bw*B.emp/100),3);x.fillStyle='rgba(255,255,255,.6)';x.fillRect(Math.round(bx+bw*ESRT/100),yy,1,3)}  // 第三十五轮:首领魔力条(蓝色,回蓝中闪烁;白色刻度 = 15%)
  // 韧性条(第十五轮):金色 = 剩余韧性,灰色闪烁 = 破韧后的免疫期
    if(px)PUI.img(x,'dia1',bx-20,by-6);else RR(x,bx-14,by-8,30,30,15,LG(x,0,by-8,0,by+22,['#ff6b6b','#a61e1e']),1.8);CT('👑',px?bx-5:bx+1,by+12,13,'#fff','center',0);CT(((B.can?'人造人·灿灿一号':cur==MY5?'擎天魔神':isTw(cur)?twNm(B.k):isDm(cur)?DMD[dmI()].n:['铁角牛魔','面具法师','金色蛇王','黑棘巨蝎','沙渊古神','北极熊','血月巫王','怨婴·银太郎','熔狱魔神','归蝇','瓜子大王','梦魇幽驹','深渊炎魔','钢铁暴君','夜王','焚天炎君','镜中无名','影主·胧',ALNM[Math.min(2,((B&&B.form)||1)-1)],'金核炮神','炎狱巨像'][cur-1])||'')+(isTw(cur)?' · 第 '+TWF+' 层':' '+'★'.repeat(LVSTAR)),bx+22,by+2,10,B.bf>0?'#ff8787':'#fff3bf','left',2.6,'#1e1829')}}  // 第十六轮:名字后面画本次的星级  // 第十三轮:首领名后面不再写阶段 / 状态文字
// 技能栏(左下角):金框技能格 + 图标 + 冷却扇形
const SKIMG={};function skImg(id){let m=SKIMG[id];if(!m){m=SKIMG[id]=new Image();m.src=ICON[id]}return m}
function drawSkBar(){const m=P.mode,px=PUI.on();if(px)PUI.ns(x,'pA',20,14,20,14,0,VH-50,166,50);else PG(x,[[2,VH-46],[160,VH-46],[170,VH-2],[2,VH-2]],LG(x,0,VH-46,0,VH,['#3d3352','#1e1829']),1.8);
  for(let i=0;i<4;i++){const bx=8+i*38,by=VH-42,ok=LN[m][i],im=skImg(m+i);if(px)PUI.ns(x,'pC',6,6,6,6,bx,by,34,34);else RR(x,bx,by,34,34,7,LG(x,0,by,0,by+34,['#ffe066','#c97a00']),1.4);
    if(im.complete&&im.naturalWidth){x.save();x.beginPath();x.roundRect(bx+3,by+3,28,28,5);x.clip();x.drawImage(im,bx+3,by+3,28,28);if(!ok){x.fillStyle='rgba(20,15,30,.7)';x.fillRect(bx+3,by+3,28,28)}x.restore()}
    if(ok&&CD[m][i]>0){const k=Math.min(1,CD[m][i]/skCdA(m,i));x.save();x.beginPath();x.roundRect(bx+3,by+3,28,28,5);x.clip();x.fillStyle='rgba(10,8,20,.62)';x.beginPath();x.moveTo(bx+17,by+17);x.arc(bx+17,by+17,24,-Math.PI/2,-Math.PI/2+k*6.2832);x.closePath();x.fill();x.restore();CT(CD[m][i]<10?CD[m][i].toFixed(1):Math.ceil(CD[m][i])+'',bx+17,by+22,10,'#fff','center',2.4)}
    if(!ok)CT('🔒',bx+17,by+22,11,'#fff','center',0);if(px){PUI.box(x,bx+23,by+24,11,10,'#2a1f3c');CT('HUIO'[i],bx+28.5,by+32,8,'#ffd43b','center',0)}else{RR(x,bx+22,by+23,13,12,4,'#1e1829',1);CT('HUIO'[i],bx+28.5,by+32.5,9,'#ffd43b','center',0)}
    if(m=='sword'&&i==2&&P.gd2>0){RR(x,bx+20,by-7,16,12,5,'#e8590c',1);CT('拉',bx+28,by+3,8,'#fff','center',0)}}
  if(jobOk(m))for(let i=4;i<8;i++){const bx=8+(i-4)*30,by=VH-76,ok=LN[m][i],im=skImg(m+i);if(px)PUI.ns(x,'pC',5,5,5,5,bx,by,25,25);else RR(x,bx,by,25,25,5,LG(x,0,by,0,by+25,m=='sword'?['#96f2d7','#0b7285']:['#d0bfff','#5f3dc4']),1.2);
    if(im.complete&&im.naturalWidth){x.save();x.beginPath();x.roundRect(bx+2,by+2,21,21,4);x.clip();x.drawImage(im,bx+2,by+2,21,21);if(!ok){x.fillStyle='rgba(20,15,30,.7)';x.fillRect(bx+2,by+2,21,21)}
      if(ok&&CD[m][i]>0){const k=Math.min(1,CD[m][i]/skCdA(m,i));x.fillStyle='rgba(10,8,20,.62)';x.beginPath();x.moveTo(bx+12.5,by+12.5);x.arc(bx+12.5,by+12.5,18,-Math.PI/2,-Math.PI/2+k*6.2832);x.closePath();x.fill()}x.restore()}
    if(ok&&CD[m][i]>0)CT(CD[m][i]<10?CD[m][i].toFixed(1):Math.ceil(CD[m][i])+'',bx+12.5,by+16,8,'#fff','center',2);{const pd=m=='staff'&&(i==4&&CLN&&!CLN.sw?'换':i==5&&P.shdT>0&&P.met?'☄':'');if(pd){RR(x,bx+14,by-6,14,12,5,'#e8590c',1);CT(pd,bx+21,by+3.5,8,'#fff','center',0)}}CT(['空','W空','S空','WW空'][i-4],bx+12.5,by+24,7,'#c3fae8','center',2.2,'#120d18')}
  if(m=='fist'&&st=='play'){fspHud(px);fkoDraw()}  // 第六十九轮:格斗家斗志 / K.O. 大字(275)
  if(m=='sword'&&st=='play'){const q=P.qi|0,full=P.qiKE>GT;for(let i=0;i<QIMAX;i++){const dx=292+i*11,dy=VH-14,on=i<q||full;x.save();x.globalAlpha=on?1:.28;if(px)PUI.img(x,'dia1',dx-5,dy-5,.34);else{x.translate(dx,dy);x.rotate(Math.PI/4);RR(x,-3.5,-3.5,7,7,1.5,'#ffd43b',1)}x.restore()}CT(full?'剑势全开':'剑势',314,VH-24,7,full?'#fff3bf':'#ffe066','center',2,'#120d18')}  // 第十六轮:剑势层数(Mana Soul GUI 的菱形)
  drawPotBar();drawPetBar();
  if(0&&WEAR.fash=='xy'&&st=='play'){const yo=jobOk(m)?-36:0,q=LCK?'⚡ 锁敌雷电 '+Math.ceil(LCK.t)+'s':'⚡ 雷印 '+XYN+'/8';RR(x,4,VH-68+yo,q.length*8+18,18,9,'rgba(30,20,40,.85)',1.3);CT(q,13,VH-55+yo,10,LCK?'#ffe066':'#a5d8ff','left',2.4,'#120d18')}}
// 伤害数字(页游风:粗描边、暴击放大)
// 第十三轮:关卡里的数字改成小号(6 = 像素字体 12px 一倍,不再挡住怪物),非暴击白色、暴击紫色,不再有「暴击」字样
function drawTX(){for(const t of TX){const q=String(t.s),a=Math.min(1,t.t*2);x.globalAlpha=a;
  if(t.k||st=='play')CT(q,Math.round(t.x-cam),Math.round(t.y),t.k=='m'?9:12,t.c,'center',2,t.k=='c'?'#2b0a40':'#1e1020');  // 第五十九轮(用户):伤害数字 6 → 12(放大 1 倍),描边 1 → 2
  else{x.save();x.translate(t.x-cam,t.y);CT(q,0,0,/^-?\d+$/.test(q)?14:11,t.c,'center',3.2,'#1e1020');x.restore()}}x.globalAlpha=1}
// 对话框:羊皮纸 + 名牌 + 头像
function drawDlg(){if(!DLG)return;const [who,s]=DLG.L[DLG.i],n=Math.min(s.length,Math.floor(DLG.t*40)),me=who=='无名',t=performance.now()/1000;
  RR(x,14,220,612,124,16,LG(x,0,220,0,344,['#fff7e3','#f3dcae']),2.2);x.beginPath();x.roundRect(20,226,600,112,12);x.strokeStyle='#c99a5b';x.lineWidth=1.4;x.stroke();
  C_(x,58,214,26,LG(x,0,188,0,240,me?['#8fd0ff','#3b6fd6']:['#ffe066','#e8890c']),2);x.save();x.beginPath();x.arc(58,214,23,0,7);x.clip();if(!(!me&&PXA.port(x,who,58,214))){x.translate(57,250);x.scale(1.15,1.15);
  drawChibi(x,me?{...heroLook(),wing:null,t}:NPCLOOK[who]?{...NPCLOOK[who],wpn:null,t}:{hs:'old',hair:'#f1f3f5',beard:'#f8f9fa',eye:'#5c3a1e',robe:1,top:'#5c7cfa',top2:'#364fc7',skin:'#f7d2b0',closed:1,t})}x.restore();
  RR(x,88,204,96,24,12,LG(x,0,204,0,228,me?['#5c8df6','#2a4fa8']:['#c08a52','#7a4a22']),1.8);CT(who+(GN[who]?'·'+GN[who]:''),136,221,who.length>3?11:13,'#fff','center',2.6);
  x.font='bold 16px '+CTF;x.fillStyle='#4a2c14';x.textAlign='left';let line='',ly=262;
  for(const ch of s.slice(0,n)){if(x.measureText(line+ch).width>570){x.fillText(line,34,ly);ly+=24;line=ch}else line+=ch}x.fillText(line,34,ly);
  if(n>=s.length&&Math.floor(performance.now()/400)%2)CT(DLG.i<DLG.L.length-1?'点击继续 ▶':'点击结束 ■',570,334,11,'#e8590c','center',2.4,'#fff7e3')}

// 第五十九轮(用户):最上方中间显示增益倒计时 —— 双倍爆率卡(现实时间)、上帝卡牌(只在关卡里扣)、宠物装备幸运骰子摇到几点 / 掉落率加了多少
function hudTop(px){const L=[],hms=s=>Math.floor(s/3600)+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  if(dblOn())L.push(['📜 双倍爆率 '+hms(Math.ceil((R19.dbl-Date.now())/1000)),'#e8590c']);
  if(godOn('cr'))L.push(['🃏 暴击升级 '+godLeft('cr'),'#c2255c']);
  if(godOn('pal'))L.push(['🃏 好伙计 '+godLeft('pal'),'#5f3dc4']);
  if(DICEN)L.push(['🎲 骰子 '+DICEN+' 点 · 掉落 +'+Math.round(DICEB*100)+'%','#2b8a3e']);
  if(!L.length)return;if(L.length>1||DICEN)L.push(['总掉落率 ×'+(+DBLK().toFixed(2)),'#1971c2']);
  // 左边是血条面板(到 x≈236),右边是主线任务框:放在 242 ~ 494 之间,一行放不下就换行
  x.font='900 9px '+CTF;const X0=242,X1=494,R=[[]];let rw=0;
  for(const g of L){const w=Math.ceil(x.measureText(g[0]).width)+12;if(rw&&rw+4+w>X1-X0){R.push([]);rw=0}R[R.length-1].push([g,w]);rw+=(rw?4:0)+w}
  let gy=bossOn&&B.hp>0?(isTw(cur)&&E.some(e=>e.twb&&e.hp>0)?60:40):4;
  for(const r of R){const tw=r.reduce((a,q)=>a+q[1],0)+4*(r.length-1);let gx=Math.round((X0+X1)/2-tw/2);
    for(const [g,w] of r){if(px)PUI.box(x,gx,gy,w,15,g[1]);else RR(x,gx,gy,w,15,7.5,g[1],1.3);CT(g[0],gx+w/2,gy+11,9,'#fff','center',2.2,'#1e1829');gx+=w+4}gy+=17}}