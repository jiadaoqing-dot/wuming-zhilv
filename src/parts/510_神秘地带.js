// ===== 神秘地带 · 神秘副本(2026-10-13 第十二轮)=====
// 晨曦镇技能导师树屋高台右端的「神秘光柱」(拿到第一块女神灵魂碎片后出现)→ 神秘地带大厅(st 仍是 'town',MYS=1):石砌大厅里五个张嘴石狮头,
//   嘴里各有一团不同颜色的光球。拥有 N 块碎片就开放前 N 个(第三十九轮做到第 3 个,没开放的不显示);站在石狮嘴前按 W 进入 = cur 11 起,直接首领战
// 神秘副本 1「瓜子大王」(仓鼠,数值和第四关首领一样):嗑瓜子(随机增减属性)· 吃瓜子壳(护盾 + 减伤)· 瓜子拍打(两片大瓜子壳罩住主角)· 丢瓜子壳
//   击败必掉「仓鼠宠物蛋」,在 🐤 宠物界面花 10 分钟孵化 → 宠物仓鼠(技能同上,嗑瓜子给自己永久加属性,每关叠加;多余的蛋孵化 = 多嗑 3 次瓜子)
// 图集 MYST(art_src/myst/build_myst.py,自画);BGM bgm11(大厅)/ bgm11b(首领);首领音效 h_*
let MYS=0,MYR=0;  // MYS:在神秘地带大厅;MYR:从神秘副本回城时回到大厅
const MYW=1200,MYLX=[250,440,630,820,1010],MYOC=[['105,219,124','#d3f9d8'],['255,169,77','#ffe8cc'],['218,119,242','#f3d9fa'],['77,171,247','#d0ebff'],['255,107,107','#ffe3e3']],MYNM=['瓜子大王','梦魇幽驹','深渊炎魔','镜中无名'],MYTP=[408,252];
const twW=()=>MYS?MYW:TWN.w;
const soulN=()=>{soulHas(0);return MAT.sl.length};
const myOpen=()=>Math.min(soulN(),MYNM.length);
const myIdx=c=>c==MY4?3:c-11,myCur=i=>i==3?MY4:11+i;  // 第四十三轮:神秘副本 4 用 cur 17(14~16 已是第二张地图)
const lvName=()=>lvsName(cur);
function mystIn(){MYS=1;PL=[{x:0,y:GY,w:MYW}];P.x=70;P.y=GY-P.h;P.vy=0;P.f=1;P.fly=0;cam=0;say(myOpen()?'神秘地带 · 每拥有一块女神灵魂碎片,就会多开放一个神秘副本':'神秘地带')}
function mystOut(){MYS=0;MYR=0;toTown();P.x=MYTP[0]-12;P.y=MYTP[1]-P.h;P.f=-1}
function mystGo(i){openLvSel(myCur(i)-1,1)}  // 第十六轮:先进星级选择页(确认后 MYS=0、MYR=1 再进关)
// ---- 首领:瓜子大王 ----
let HSH=[],HCL=[];  // 首领丢出的瓜子壳 / 合拢的大瓜子壳
const HBN={atk:'攻击',def:'防御',spd:'速度'};
const hamAtkM=e=>e.bf_&&e.bf_.k=='atk'?1+e.bf_.v:1;
function hamEnd(e){e.act=null;e.cd=(e.p2?.75:1.15)+Math.random()*.5}
function hamStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),hp=e.hp/e.max;e.pz=null;if(e.def0==null)e.def0=e.def;
  if(!e.intro){e.intro=1;banner('瓜子大王 · 腮帮子里藏着吃不完的瓜子');bsfx('h_squeak')}
  if(!e.p2&&hp<=.4){e.p2=1;banner('瓜子大王气鼓鼓地把腮帮子塞满了!');flash('255,200,120',.25);bsfx('h_angry')}
  const b=e.bf_;if(b){b.t-=dt;if(b.t<=0){e.bf_=null;e.def=e.def0;tx('属性恢复了',cx-20,e.y-24,'#dee2e6')}}
  if(e.hdrT>0){e.hdrT-=dt;if(e.hdrT<=0){e.hdr=0;e.hsd=0}}
  const sp=(e.bf_&&e.bf_.k=='spd'?1+e.bf_.v:1)*(e.p2?1.2:1);e.at=(e.at||0)+dt*sp;
  if(!e.act){e.cd-=dt*sp;e.f=sgn(dx)||e.f;const want=ad>190?1:ad<80?-1:0;e.mv=want;
    if(want)e.x=Math.max(ARL+10,Math.min(ARR-10-e.w,e.x+e.f*want*(want>0?95:60)*sp*dt));
    if(e.cd>0)return;const r=Math.random();
    e.act=!e.bf_&&r<.24?'eat':!(e.hdrT>0)&&r<.42?'shell':r<.7?'trap':'throw';e.at=0;e.hd=0;e.tx=pc;
    if(e.act=='eat'||e.act=='shell'){tx(e.act=='eat'?'嗑瓜子……':'嚼瓜子壳……',cx-20,e.y-24,'#ffe066');bsfx('h_eat')}
    return}
  const T=e.at;
  if(e.act=='eat'){if(T>=1.3){const k=pick(['atk','def','spd']);let v=Math.round(rnd(-.25,.4)*100)/100;if(Math.abs(v)<.06)v=v<0?-.06:.06;
      e.bf_={k,v,t:12};if(k=='def')e.def=Math.max(0,Math.round(e.def0*(1+v)));
      const up=v>0;tx(HBN[k]+(up?' +':' ')+Math.round(v*100)+'%',cx-24,e.y-30,up?'#ff8787':'#8ce99a');burst(cx+e.f*20,e.y+e.h*.4,12,['#3a3640','#e9e4dc'],160,{s:2,l:.4,g:400});
      if(up){bsfx('h_squeak');ring(cx,e.y+e.h/2,6,e.w*.8,'#ff8787',.4,4)}else ring(cx,e.y+e.h/2,6,e.w*.8,'#8ce99a',.4,4);hamEnd(e)}return}
  if(e.act=='shell'){if(T>=.9&&!e.hd){e.hd=1;e.hsd=Math.round(e.max*.06);e.hdr=.35;e.hdrT=6;bsfx('h_shell');tx('瓜子壳护盾!减伤 35%',cx-40,e.y-30,'#ffe066');ring(cx,e.y+e.h/2,8,e.w*.9,'#e9e4dc',.45,5)}if(T>=1.2)hamEnd(e);return}
  if(e.act=='trap'){if(T<.85){e.pz='w';if(T<.55)e.tx+=(pc-e.tx)*Math.min(1,dt*6);return}
    if(!e.hd){e.hd=1;HCL.push({x:e.tx,t:0,dm:e.dm*hamAtkM(e)});if(e.p2)HCL.push({x:Math.max(ARL+30,Math.min(ARR-30,e.tx+(Math.random()<.5?-1:1)*rnd(80,120))),t:-.35,dm:e.dm*hamAtkM(e)})}
    if(T>=1.3)hamEnd(e);return}
  if(e.act=='throw'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}
    if(!e.hd){e.hd=1;bsfx('h_throw');const n=e.p2?5:3,x0=cx+e.f*e.w*.3,y0=e.y+e.h*.3;
      for(let i=0;i<n;i++){const tx_=pc+(i-(n-1)/2)*46,ft=.75+i*.04,vy=(GY-6-y0-.5*650*ft*ft)/ft;HSH.push({x:x0,y:y0,vx:(tx_-x0)/ft,vy,a:0,dm:e.dm*hamAtkM(e)})}}
    if(T>=.9)hamEnd(e);return}
  hamEnd(e)}
// 场景里的东西:瓜子壳飞行 / 大瓜子壳合拢
function myStep(dt){const pc=P.x+12;if(cur>=12)gpStep(dt);if(cur==MY4){mirZStep(dt);canTick(dt)}
  for(const s of HSH){s.vy+=650*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.a+=dt*14;
    if(!s.d&&ov(P,{x:s.x-10,y:s.y-8,w:20,h:16})){s.d=1;hurt(8*s.dm,{kb:sgn(s.vx)*160})}
    if(s.y>=GY-4){s.d=1;burst(s.x,GY-4,5,['#3a3640','#e9e4dc'],100,{s:2,l:.3,g:500})}}HSH=HSH.filter(s=>!s.d);
  for(const c of HCL){c.t+=dt;if(c.t>=.25&&!c.h){c.h=1;bsfx('h_clap');shake=Math.max(shake,.15);burst(c.x,GY-34,10,['#e9e4dc','#3a3640'],140,{s:2,l:.35});
      if(Math.abs(pc-c.x)<30&&P.y+P.h>GY-74&&hurt(15*c.dm,{inv:1.4})){P.stun=1.25;P.vy=0;P.kbx=0;c.cap=1;tx('被瓜子壳罩住了!',P.x-30,P.y-40,'#ffe066')}}}
  HCL=HCL.filter(c=>c.t<1.6)}
