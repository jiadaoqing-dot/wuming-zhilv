// ===== 战败 / 通关后的选择页:返回城镇 / 继续关卡(战败时还可以喝复活药水原地站起来)=====
let CHI=1;
const chOn=()=>st=='dead'||st=='won';
function chBtns(){const L=st=='dead'?[{l:'🏠 返回城镇',s:'回到晨曦镇',go:()=>toTown()},{l:'⚔️ 重新挑战',s:'从本关开头重新挑战',go:()=>{init();st='play';lvT=performance.now()}},{l:'✚ 复活药水',s:POT.rev>0?'原地复活 · 持有 '+POT.rev+' 瓶':'没有复活药水',dis:!(POT.rev>0),go:()=>reviveP()}]
    :isTw(cur)?[...(TWF<TWOPEN?[{l:'前往第 '+(TWF+1)+' 层',s:'生命 / 魔力保留,继续往上闯',go:()=>twNext()}]:[]),{l:'🏠 返回城镇',s:'带着战利品回到晨曦镇',go:()=>toTown()}]  // 第五十六轮:暗黑炼狱
    :[{l:'🏠 返回城镇',s:'带着战利品回到晨曦镇',go:()=>toTown()},{l:'⚔️ 重新挑战',s:'从本关开头再打一次',go:()=>{init();st='play';lvT=performance.now()}}];
  const n=L.length,w=n==3?148:170,gp=n==3?10:14,x0=320-(n*w+(n-1)*gp)/2;L.forEach((b,i)=>{b.x=x0+i*(w+gp);b.y=204;b.w=w;b.h=50});return L}
function chGo(i){const b=chBtns()[i];if(!b)return;if(b.dis){sfx('hurt');return}b.go()}
function chKey(e){const k=e.key,L=chBtns();if(KM[k]){e.preventDefault();if(!e.repeat)CHI=(CHI+(KM[k]=='l'?L.length-1:1))%L.length;return 1}
  if(['Enter',' ','j','J'].includes(k)){e.preventDefault();if(!e.repeat)chGo(Math.min(CHI,L.length-1));return 1}return 0}
function chClick(mx,my){const L=chBtns();for(let i=0;i<L.length;i++){const b=L[i];if(mx>=b.x&&mx<=b.x+b.w&&my>=b.y&&my<=b.y+b.h){CHI=i;chGo(i);return}}}
function drawChoice(){const dead=st=='dead',L=chBtns(),t=performance.now()/1000;CHI=Math.min(CHI,L.length-1);
  x.fillStyle=dead?'rgba(20,10,30,.6)':'rgba(10,16,40,.5)';x.fillRect(0,0,VW,VH);
  const px=PUI.on();
  if(px)PUI.ns(x,'pC',28,28,28,28,66,92,508,190);else{RR(x,66,92,508,190,22,LG(x,0,92,0,282,['#3d3352','#1e1829']),2.2);x.beginPath();x.roundRect(71,97,498,180,18);x.strokeStyle='rgba(255,212,59,.5)';x.lineWidth=1.4;x.stroke()}
  if(dead)CTG('无名倒下了',320,136,30,['#ffe3e3','#ff6b6b','#c92a2a']);else CTG(isTw(cur)?'第 '+TWF+' 层通关!':'关卡通关!',320,136,30);
  CT(dead?'接下来怎么办?':'接下来去哪里?',320,160,12,'#fff3bf','center',3);
  if(!dead&&GD.length)CT('背包满了,有 '+GD.length+' 件装备没能捡起(已经留在关卡里)',320,184,10,'#ffd43b','center',2.6,'#1e1030');
  if(dead&&!(POT.rev>0))CT('复活药水可以在晨曦镇的药剂师那里购买(每天限购 1 瓶)',320,184,10,'#adb5bd','center',2.6,'#1e1030');
  // 像素按钮:Mana Soul 箭头按钮放大 2 倍(选中 = 绿色,普通 = 蓝色,不可用 = 灰色)
  if(px){L.forEach((b,i)=>{const on=i==CHI,cx=b.x+b.w/2,[n,cap]=b.dis?['btn3',12]:on?['btn1',16]:['btn0',14],h=PUI.M[n][3]*2;
      PUI.ns(x,n,cap,0,cap,0,b.x,b.y+25-h/2,b.w,h,2);
      CT(b.l,cx,b.y+23,15,'#fff','center',3,b.dis?'#343a40':'#1e2a5a');CT(b.s,cx,b.y+38,8,b.dis?'#dee2e6':'#fff8e6','center',2,b.dis?'#343a40':'#1e2a5a')})}
  else L.forEach((b,i)=>{const on=i==CHI,cx=b.x+b.w/2;if(on){x.save();x.shadowColor='#ffd43b';x.shadowBlur=14}
    RR(x,b.x,b.y,b.w,b.h,13,b.dis?LG(x,0,b.y,0,b.y+b.h,['#868e96','#495057']):LG(x,0,b.y,0,b.y+b.h,i==0?['#ffd08a','#e8890c']:i==1?['#ffb88a','#e8590c']:['#fff3bf','#f59f00']),on?2.6:1.8);if(on)x.restore();
    if(on){x.beginPath();x.roundRect(b.x-3,b.y-3,b.w+6,b.h+6,15);x.strokeStyle='rgba(255,236,153,'+(.6+.4*Math.sin(t*6))+')';x.lineWidth=2;x.stroke()}
    CT(b.l,cx,b.y+23,15,'#fff','center',3,b.dis?'#343a40':'#7a3a08');CT(b.s,cx,b.y+40,9,b.dis?'#dee2e6':'#fff8e6','center',2.4,b.dis?'#343a40':'#7a3a08')});
  CT('← → 选择 · Enter 确认 · 也可以直接点击按钮'+(dead&&POT.rev>0&&QS.includes('rev')?' · 按 '+(QS.indexOf('rev')+1)+' 喝复活药水':''),320,272,9,'#d0bfff','center',2.2,'#1e1030')}
