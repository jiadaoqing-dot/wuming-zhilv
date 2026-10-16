// ===== 主角骨骼动画:头、躯干、左右大臂 / 小臂、左右大腿 / 小腿、武器 =====
// 关节:肩、肘、髋、膝。坐标原点在脚底中间,面朝右(+x 向前,+y 向下)。
// · 躯干绕髋部转动(lean,正 = 前倾);腿的角度从竖直向下算(正 = 向前),膝盖弯曲 k 让小腿向后折
// · 武器由「握把位置(躯干坐标 gx/gy)+ 角度 wa」决定,两只手用两段 IK 自动握到剑柄上;two = 1 双手持 / 0 单手持(可渐变)
// · 动作 = 关键帧插值(rSeq)+ 每帧平滑过渡(rigSmooth),站立、走、跑、跳、下落、攻击、技能、受击随时切换
// · 大剑:长剑柄,手握在剑柄中间偏上,大半截剑柄在手后面;剑刃又长又宽,和角色差不多大
// =====================================================================
const RIG={hipY:-12.5,thigh:6.2,shin:5.6,up:5.4,fore:5.2,hipX:2.2,shX:2.7,shY:-10.6,headX:1.2,headY:-22.6,headS:1.16};
const RBASE={x:0,y:0,lean:.04,head:0,hF:.26,kF:.16,hB:-.22,kB:.14,gx:3.5,gy:-4,wa:-.95,two:0,aF:.3,eF:.4,aB:.12,eB:.5,wb:0,sq:0};
const RKS=Object.keys(RBASE);
const angD=(a,b)=>{let d=(b-a)%6.2832;if(d>3.1416)d-=6.2832;if(d<-3.1416)d+=6.2832;return d};
const rP=(...o)=>Object.assign({},RBASE,...o);
function rMix(a,b,q){const o={};for(const k of RKS){const va=a[k],vb=b[k];o[k]=k=='wa'?va+angD(va,vb)*q:k=='wb'?(q<.5?va:vb):va+(vb-va)*q}return o}
// 关键帧序列:base 是当前站姿 / 移动姿势,keys = [[时间, 局部姿势 / null=回到 base], ...]
function rSeq(base,keys,t){const K=keys.map(([tt,p])=>[tt,p?{...base,...p}:base]);if(t<=K[0][0])return K[0][1];
  for(let i=1;i<K.length;i++)if(t<=K[i][0])return rMix(K[i-1][1],K[i][1],eio((t-K[i-1][0])/Math.max(.001,K[i][0]-K[i-1][0])));return K[K.length-1][1]}
// 大幅度挥砍用的关键帧:剑的角度按「原始数值」线性插值(可以一次转过 180° 以上,不会走近路),每段可选缓动
// keys = [[时间, 局部姿势 / null = 回到 base / 完整姿势(含 __f), 缓动 'io'|'in'|'out'|'lin'], ...]
function rSeqU(base,keys,t){const K=keys.map(([tt,p,e])=>[tt,p?(p.__f?p:{...base,...p}):base,e||'io']);
  if(keys[0][1]&&keys[0][1].__f&&K.length>1)K[0][1]={...K[0][1],wa:K[1][1].wa+angD(K[1][1].wa,K[0][1].wa)};
  for(let i=1;i<K.length;i++)if(!keys[i][1]||keys[i][1].wa==null){const pw=K[i-1][1].wa;K[i][1]={...K[i][1],wa:pw+angD(pw,K[i][1].wa)}}
  if(t<=K[0][0])return K[0][1];
  for(let i=1;i<K.length;i++)if(t<=K[i][0]){const a=K[i-1][1],b=K[i][1];let q=Math.max(0,Math.min(1,(t-K[i-1][0])/Math.max(.001,K[i][0]-K[i-1][0])));const e=K[i][2];
    q=e=='in'?q*q:e=='out'?1-(1-q)*(1-q):e=='lin'?q:eio(q);const o={};for(const k of RKS)o[k]=k=='wb'?(q<.5?a.wb:b.wb):a[k]+(b[k]-a[k])*q;return o}
  return K[K.length-1][1]}
// 剑士四段普攻的全身动作(想象真人双手抡一把巨剑):W 预备结束,E 出手结束(= 击中),R 收招时间
function atkKeys(c,W,E,R,from){const f0=from?{...from,__f:1}:null,K=[[0,f0]];
  if(c==0||c==3||c==-1){const h=c!=0;// 下劈:重心后移、上身后仰,双手把剑从头顶甩到背后(剑尖朝后下)→ 前脚跨步、腰背前压,剑从背后经过头顶一路劈到身前贴地(约 230°)→ 弓步下蹲收势
    if(c!=-1)K.push([W*.5,{gx:1,gy:-17,wa:-2.3,two:1,lean:-.14,x:-1,y:h?-3:0,hF:.3,kF:.4,hB:-.15,kB:.25,head:-.05}]);
    K.push([W,{gx:-3,gy:-16,wa:h?-3.8:-3.65,two:1,wb:1,lean:h?-.36:-.3,x:-2.5,y:h?-5:-.5,hF:.45,kF:.7,hB:-.1,kB:.35,head:-.12}],
      [W+(E-W)*.4,{gx:2,gy:-19,wa:-1.5,two:1,lean:.05,x:0,y:h?-4:-1.5,hF:.7,kF:.5,hB:-.5,kB:.2},'in'],
      [E,{gx:8,gy:h?1:-1,wa:h?.36:.28,two:1,lean:h?.62:.55,x:3,sq:h?.2:.15,head:.12,hF:1,kF:h?1.3:1.15,hB:-.88,kB:.15},'out'],
      [E+.07,{gx:8,gy:h?1.5:-.5,wa:h?.46:.38,two:1,lean:h?.64:.58,x:3,sq:h?.22:.17,head:.12,hF:1,kF:h?1.32:1.18,hB:-.88,kB:.15}])}
  else if(c==1)// 上挑:压低身体、把剑拖到身后下方 → 蹬腿起身、上身后仰,剑从身后下方经过身前一路挑到头顶(约 220°)
    K.push([W*.45,{gx:4,gy:-2,wa:1.2,two:1,lean:.2,sq:.05,x:-.5,hF:.5,kF:.6,hB:-.3,kB:.4}],
      [W,{gx:-4.5,gy:-1,wa:2.45,two:1,wb:1,lean:.32,x:-2,sq:.12,head:.06,hF:.6,kF:.95,hB:-.35,kB:.75}],
      [W+(E-W)*.45,{gx:6,gy:-1,wa:.4,two:1,lean:.18,x:1,sq:.06,hF:.75,kF:.6,hB:-.6,kB:.3},'in'],
      [E,{gx:6,gy:-17,wa:-1.25,two:1,lean:-.22,x:2.5,y:-3,head:-.12,hF:.55,kF:.1,hB:-.75,kB:.05},'out'],
      [E+.07,{gx:5,gy:-18,wa:-1.55,two:1,lean:-.26,x:2.5,y:-3.5,head:-.14,hF:.5,kF:.1,hB:-.75,kB:.05}]);
  else// 直戳:把剑整个收到身体后侧、重心压在后腿 → 前脚大跨步、后腿蹬直、双臂完全伸直平刺
    K.push([W*.5,{gx:-2,gy:-9,wa:-.25,two:1,lean:-.1,x:-1,hF:.35,kF:.3,hB:-.2,kB:.4}],
      [W,{gx:-7.5,gy:-8,wa:-.08,two:1,lean:-.24,x:-3,head:-.06,hF:.5,kF:.35,hB:-.15,kB:.75,sq:.05}],
      [E,{gx:13,gy:-8,wa:0,two:1,lean:.42,x:4,head:.12,hF:1.1,kF:.95,hB:-1,kB:.05,sq:.08},'out'],
      [E+.07,{gx:13,gy:-8,wa:.02,two:1,lean:.45,x:4,head:.12,hF:1.1,kF:1,hB:-1,kB:.05,sq:.09}]);
  K.push([E+R+.12,null]);return K}
// 站姿:剑 = 双臂自然下垂,双手握剑柄在下体前,剑身朝前、略微向下倾斜,长剑柄露在身后;法杖 = 单手斜握
// 第二十六轮:法师普攻的两个关键姿势(双手横握法杖中段):STFR 收回贴胸、重心在后腿;STFT 双臂伸直前推、前腿弓步
const STFR={gx:-1.5,gy:-9.5,wa:-.06,two:1,lean:-.15,x:-1.8,head:-.06,hF:.2,kF:.4,hB:-.2,kB:.5,sq:.04},STFT={gx:15,gy:-8.5,wa:0,two:1,lean:.32,x:3.5,head:.08,hF:.95,kF:.3,hB:-.85,kB:.15,sq:.05};
const STANCE={sword:{gx:3.6,gy:-.6,wa:.13,two:1,aB:.12,eB:.5},staff:{gx:9,gy:-2.2,wa:-1.05,two:0,aB:.25,eB:.45}};
// 剑的四段普攻 + 蓄力重击(双手持巨剑,剑和身体高度重合):w = 预备,s = 出手结束
const SWK={
  // ① 下劈:剑举到脑后 → 向前下方劈到贴地水平,身体压低前扑(剑光是从头顶划到前方地面的大月牙)
  0:{w:{gx:-1,gy:-14,wa:-2.4,wb:1,two:1,lean:-.16,y:-1,hF:.25,hB:-.3},s:{gx:6,gy:0,wa:.1,two:1,lean:.46,sq:.15,hF:.95,kF:1.2,hB:-.75,kB:.3}},
  // ② 上挑:剑在前下方 → 向上挑到斜前上方,身体挺直
  1:{w:{gx:4,gy:0,wa:.85,two:1,lean:.22,sq:.08,hF:.55,kF:.7,hB:-.35,kB:.4},s:{gx:5,gy:-13,wa:-1.0,two:1,lean:-.1,y:-1,hF:.3,kF:.15,hB:-.35,kB:.1}},
  // ③ 直戳:剑往回收到腰侧 → 双臂伸直向前平刺(胸口高度)
  2:{w:{gx:-3,gy:-8,wa:-.04,two:1,lean:-.12,hF:.15,hB:-.2},s:{gx:10,gy:-9,wa:0,two:1,lean:.18,hF:.7,kF:.2,hB:-.65,kB:.15}},
  // ④ 下劈(更重):举得更高、劈得更低,落地下蹲
  3:{w:{gx:-1,gy:-16,wa:-2.5,wb:1,two:1,lean:-.22,y:-2,hF:.3,hB:-.35},s:{gx:6,gy:1,wa:.14,two:1,lean:.5,sq:.18,hF:1,kF:1.3,hB:-.8,kB:.3}},
  '-1':{w:{gx:-2.5,gy:-16,wa:-3.5,wb:1,two:1,lean:-.3,x:-2,sq:.06,hF:.45,kF:.55,hB:-.15,kB:.35},s:{gx:7,gy:-1,wa:1.02,two:1,lean:.46,sq:.15,hF:.9,kF:.95,hB:-.8,kB:.6}}};
const HURT={lean:-.32,head:-.2,gx:2,gy:-2,wa:.35,two:0,aB:2.5,eB:.7,hF:.45,kF:.6,hB:-.3,kB:.4};
// 走 / 跑的循环。跑步(拖剑跑):双手把剑拖在身后,头和上身明显前倾,手臂甩在后面;
// 往前迈的腿屈膝抬起、蹬地的腿斜着伸直,屁股有前后的过冲晃动
function rigCycle(kind,ph,m){const a=ph*6.2832,s=Math.sin(a),c=Math.cos(a),fwdF=Math.max(0,s),fwdB=Math.max(0,-s);
  if(kind=='run')return {y:-Math.abs(c)*2.4+.6,x:Math.sin(a*2)*.9,lean:.5+Math.abs(c)*.05,head:.14,
    hF:s*1.15,kF:.12+fwdF*1.7,hB:-s*1.15,kB:.12+fwdB*1.7,
    ...(m=='sword'?{gx:-3.6,gy:-2.2,wa:2.82,two:1}:{gx:-2,gy:-2,wa:2.9,two:0,aB:-s*1.1+.6,eB:1})};
  // 走路:全身都在动——身体一上一下(每步一次)、屁股前后移、上身前后轻晃、头跟着点;后手和前腿反向大幅摆臂(往前摆时屈肘),
  // 拿剑的前手和后腿反向摆,剑跟着手前后晃;往前迈的腿屈膝抬起、支撑腿伸直
  const bob=Math.abs(c),swingF=Math.max(0,Math.cos(a+.9)),swingB=Math.max(0,Math.cos(a+.9+Math.PI));
  return {y:-bob*1.7+.5,x:s*.7,lean:.1+bob*.05+s*.03,head:-.04+bob*.05,
    hF:s*.62,kF:.1+swingF*1.0,hB:-s*.62,kB:.1+swingB*1.0,
    aB:-s*.85+.15,eB:.3+Math.max(0,-s)*.7,
    ...(m=='sword'?{gx:3.6-s*1.3,gy:-.6+bob*.5,wa:.13-s*.07+bob*.03}:{gx:9-s*2.2,gy:-2.2+bob*.7,wa:-1.05-s*.15})}}
// 第二十七轮:法师施法动作(用户参考图)。H 落雷 0.5 秒:法杖从身后下方抡起 → 举过头顶、微微向脑后倾 → 指向敌人,雷落下;
// I 火球 1 秒:法杖指向敌人 → 杖头画两圈 → 火球出现在身前 → 收一下再双手推出;O 乌云 0.5 秒:单手把法杖竖着举过头顶 → 收回
function mcPose(base,k){const t=k.t;
  if(k.i==0){const U={gx:1,gy:-20,wa:-2.1,two:0,lean:-.2,head:-.12,y:-1.5,aB:-.8,eB:.6,hF:.2,kF:.2,hB:-.25,kB:.3},A={gx:14,gy:-11,wa:-.08,two:0,lean:.22,head:.08,aB:-.5,eB:.4,hF:.7,kF:.35,hB:-.6,kB:.2};
    return {g:'rgba(165,216,255,.95)',p:rSeq(base,[[0,null],[.1,{gx:0,gy:-5,wa:2.3,two:0,lean:.06,aB:-.4,eB:.5,hF:.4,kF:.3,hB:-.3,kB:.3}],[.28,U],[.36,{...U,wa:-2.25,lean:-.24}],[.48,A],[.62,A]],t)}}
  if(k.i==2||k.i==5){const g=k.i==2?'rgba(255,146,43,.95)':'rgba(255,224,102,.95)',A={gx:13,gy:-11,wa:-.15,two:0,lean:.15,aB:-.4,eB:.5,hF:.5,kF:.3,hB:-.5,kB:.25},T={gx:16,gy:-10,wa:-.1,two:.6,lean:.32,x:3,hF:.95,kF:.3,hB:-.85,kB:.15};
    if(t>.14&&t<.62){const a=(t-.14)/.48*6.283;return {g,p:rP(base,{...A,gx:A.gx+(Math.cos(a)-1)*4,gy:A.gy+Math.sin(a)*4,wa:A.wa+Math.sin(a)*.5})}}
    return {g,p:rSeq(base,[[0,null],[.14,A],[.62,A],[.76,{gx:5,gy:-10,wa:-.25,two:.6,lean:-.06,hF:.3,kF:.3,hB:-.3,kB:.35}],[.85,T],[1.05,T]],t)}}
  const U={gx:3,gy:-22,wa:-1.57,two:0,lean:-.12,head:-.15,y:-1.5,aB:-.6,eB:.5};
  return {g:k.i==6?'rgba(255,146,43,.95)':k.i==7?'rgba(165,216,255,.95)':'rgba(229,153,247,.95)',p:rSeq(base,[[0,null],[.18,U],[.36,{...U,gy:-22.5}],[.55,null]],t)}}
const FLYWA=.5;  // 第二十七轮:法师浮空飞行时法杖杖头朝前下方斜垂(原来 -.75 朝前上方)
// 根据游戏状态算出主角此刻的目标姿势
function heroRig(){const k=P.sk,m=P.mode,tm=performance.now()/1000,sw0=STANCE.sword;  // 第二十六轮:法师站姿 / 走路和剑士一样(STANCE.staff 只给 LPC 整帧用)
  const air=!P.gr&&!P.fly,walk=P.gr&&Math.abs(P.vx)>1&&!(P.frz>0),run=walk&&P.run;
  const br=Math.sin(tm*2.6);let po=rP(sw0,{y:-(br+1)*.32,gy:sw0.gy+br*.35,wa:sw0.wa+br*.025,aB:sw0.aB+br*.04});
  let glow=null,mouth=null,closed=0;
  if(P.fly){po=WEAR.wing=='xyw'?rP(po,{hF:1.45,kF:1.65,hB:1.25,kB:1.6,lean:-.04}):rP(po,{lean:.22,hF:-.3,kF:.9,hB:-.6,kB:.7,y:-1})}
  else if(air)po=P.vy<0?rP(po,{hF:1.15,kF:1.8,hB:.5,kB:1.4,lean:-.06,aB:1.5,eB:.5,...(m=='sword'?{gx:4,gy:-10,wa:-1.05}:{gy:-8,wa:-1.6})}):rP(po,{hF:.42,kF:.35,hB:-.32,kB:.55,lean:.03,aB:1.1,eB:.4,...(m=='sword'?{gx:4,gy:-8,wa:-.9}:{gy:-6})});
  // 法师跑步 = 浮空飞行:离地一小段、身体不动只轻轻上下浮,双腿并拢微屈垂着,法杖斜握在身前,后手往后展开
  else if(run)po=m=='staff'?rP(po,{y:-9+Math.sin(tm*3.2)*1.2,lean:.16,head:.04,hF:.28,kF:.7,hB:.08,kB:.85,gx:8,gy:-4,wa:FLYWA,aB:-.55,eB:.35}):rP(po,rigCycle('run',P.an*1.45,m));
  else if(walk)po=rP(po,rigCycle('walk',P.an*1.55,'sword'));
  const base=po;
  if(m=='staff'){const cs=P.cs,sw=P.swT!=null&&P.swT<P.swR+.15?P.swT:null;
    if(k&&k.id=='mc'){const r=mcPose(base,k);po=r.p;glow=r.g}
    else if(cs&&cs.t<.8){const t=cs.t;glow='rgba(229,153,247,.95)';
      if(cs.id=='staff1')po=rSeq(base,[[0,{lean:.38,gx:-2,gy:-3,wa:2.6,aB:2.3,eB:.3,hF:1,kF:.4,hB:-.8,kB:.5}],[.3,null]],t);
      else if(cs.id=='staff0')po=rSeq(base,[[0,null],[.1,{gx:6,gy:-19,wa:-1.5,aB:2.8,eB:.3,lean:-.12,y:-2}],[.45,{gx:6,gy:-18,wa:-1.5,aB:2.7,eB:.4,lean:-.1,y:-2}],[.7,null]],t);
      else if(cs.id=='staff2')po=rSeq(base,[[0,null],[.1,{gx:0,gy:-5,wa:-2.1,lean:-.12,aB:-.4}],[.2,{gx:12,gy:-8,wa:-.35,two:.7,lean:.22,hF:.6,kF:.3,hB:-.5}],[.5,{gx:11,gy:-8,wa:-.4,two:.5,lean:.15}],[.75,null]],t);
      else if(cs.id=='staff3')po=rSeq(base,[[0,null],[.18,{gx:5,gy:-20,wa:-1.55,aB:2.9,eB:.2,lean:-.16,y:-1.5}],[.6,{gx:5,gy:-19,wa:-1.55,aB:2.9,eB:.25,lean:-.14,y:-1.5}],[.8,null]],t);
      else if(cs.id=='staff4')po=rSeq(base,[[0,null],[.1,{gx:-2,gy:-6,wa:-2.1,lean:-.14,aB:-.6}],[.2,{gx:12,gy:-12,wa:-.6,lean:.24,aB:2.2,eB:.2,hF:.6,kF:.3,hB:-.5}],[.5,null]],t);
      else if(cs.id=='staff7'){glow='rgba(255,107,107,.95)';po=rSeq(base,[[0,null],[.12,{gx:3,gy:-6,wa:-1.6,lean:.1,sq:.12,hF:.7,kF:1,hB:-.6,kB:.8,aB:-.4}],[.3,{gx:5,gy:-20,wa:-1.55,aB:3,eB:.1,lean:-.2,y:-3}],[.7,null]],t)}
      else po=rSeq(base,[[0,null],[.12,{gx:8,gy:-14,wa:-1.2,aB:2,eB:.5,lean:-.08}],[.45,null]],t)}
    else if(sw!=null){const hv=P.swC=='sh';glow=hv?'rgba(204,93,232,.95)':'rgba(229,153,247,.85)';  // 第二十六轮:双手横握法杖中段,双臂前推(发出魔法球)→ 收回贴胸 → 再推,全身跟着前后移重心
      const T={...STFT,...(hv?{gx:16.5,lean:.4,x:4.5,sq:.08,hF:1.05,kF:.45,hB:-.95}:{})};
      po=rSeq(base,[[0,STFR],[P.swD,T],[P.swD+(hv?.14:.08),{...T,gx:T.gx-.5,lean:T.lean+.03}],[Math.max(P.swD+.2,P.swR-.04),STFR],[P.swR+.15,null]],sw)}  // 第二十七轮:推到最前(swD)才发魔法球,整段放慢
    if(P.ch>.15&&!(cs&&cs.t<.8)){const q=eo(P.ch/.3);po=rMix(po,rP(base,{...STFR,gx:-.5,lean:-.16,x:-1.5,sq:.06}),q);glow='rgba(229,153,247,.9)';if(P.ch>=.7)po.y+=Math.sin(tm*60)*.4}
    {const tg=(sw!=null||P.ch>.15)&&!(cs&&cs.t<.8)?.5:P.run&&P.gr&&!P.fly&&!k?.42:.25;P.stg=P.stg==null?tg:P.stg+(tg-P.stg)*.3}}
  else{
    if(k&&k.id=='up'){glow='rgba(165,216,255,.85)';po=rSeq(base,[[0,{gx:5,gy:-1,wa:.7,two:1,sq:.14,lean:.14,hF:.6,kF:.9,hB:-.4,kB:.7}],[.05,{gx:5,gy:-1,wa:.7,two:1,sq:.14,lean:.14,hF:.6,kF:.9,hB:-.4,kB:.7}],[.18,{gx:4,gy:-16,wa:-1.75,two:1,lean:-.22,y:-3,hF:-.2,kF:.4,hB:.5,kB:.9}],[.3,{gx:4,gy:-15,wa:-1.7,two:1,lean:-.16,y:-2}]],k.t)}
    else if(k&&k.id=='smash'){glow=k.t<.3?'rgba(255,224,102,.9)':null;po=rSeq(base,[[0,null],[.18,{gx:-1,gy:-16,wa:-2.35,wb:1,two:1,lean:-.22,y:-3,hF:.6,kF:1,hB:.2,kB:.9}],[.28,{gx:-1,gy:-16,wa:-2.4,wb:1,two:1,lean:-.24,y:-3}],[.34,{gx:7,gy:-1,wa:1.05,two:1,lean:.42,sq:.15,hF:.85,kF:.95,hB:-.75,kB:.6}],[.55,{gx:6,gy:-2,wa:.95,two:1,lean:.28,sq:.08}]],k.t)}
    else if(k&&k.id=='giant'){glow='rgba(199,125,255,.9)';if(!k.formed)po=rP(base,{gx:-3,gy:-12,wa:-2.45,wb:1,two:1,lean:-.17-Math.sin(tm*30)*.01,sq:.06,hF:.55,kF:.3,hB:-.5,kB:.2});
      else po=rSeq(base,[[0,{gx:-3,gy:-12,wa:-2.45,wb:1,two:1,lean:-.17,sq:.06,hF:.55,kF:.3,hB:-.5,kB:.2}],[.3,{gx:7,gy:-1,wa:1.02,two:1,lean:.44,sq:.14,hF:.9,kF:.95,hB:-.8,kB:.6}],[.7,{gx:6,gy:-2,wa:.9,two:1,lean:.24,sq:.06}]],k.t-k.ft)}
    else if(k&&k.id=='slam'){glow=k.t<.32?'rgba(255,192,214,.9)':null;// 第一段(用户示意图):提剑 → 弯腰把巨剑斜插进身前地面,双手压住剑柄(霸体)→ 拔剑起身、弓步前冲,双臂伸直把剑向前推出
      const S1={gx:9,gy:-12,wa:.9,two:1,lean:.42,head:.24,sq:.12,x:1,hF:.95,kF:1.3,hB:-.55,kB:.65},S2={gx:15,gy:-3,wa:.12,two:1,lean:.62,x:4,head:.12,sq:.16,hF:1.25,kF:1.15,hB:-1.15,kB:.08};
      po=rSeq(base,[[0,null],[.06,{gx:4,gy:-12,wa:-1.3,two:1,lean:-.1,head:-.08,y:-1,hF:.4,kF:.5,hB:-.3,kB:.4}],[.14,S1],[.32,{...S1,lean:.54,head:.25,sq:.16,y:Math.sin(tm*45)*.3}],
        [.37,{gx:5,gy:-9,wa:.55,two:1,lean:.25,head:.05,sq:.08,hF:.8,kF:1,hB:-.7,kB:.5}],[.44,S2],[.62,{...S2,lean:.55,sq:.12}]],k.t)}
    else if(k&&k.id=='slam2'){glow=k.t<.26?'rgba(165,216,255,.9)':null;// 第二段(用户示意图):下蹲蓄力 → 跳起后仰、巨剑举过头顶 → 整个人扑下去,剑身整片砸在地上,深蹲弯腰压住剑 → 抬头看剑气卷回
      const D={gx:10,gy:3,wa:.04,two:1,lean:.85,head:.28,x:3,sq:.3,hF:1.2,kF:1.8,hB:-.55,kB:.95};
      po=rSeq(base,[[0,null],[.06,{gx:3,gy:-6,wa:-1,two:1,lean:.25,sq:.12,head:.1,hF:.7,kF:1,hB:-.4,kB:.7}],[.17,{gx:-2,gy:-18,wa:-2.6,wb:1,two:1,lean:-.3,head:-.2,y:-4,hF:.3,kF:.3,hB:-.25,kB:.3}],
        [.26,D],[.31,{...D,lean:.92,head:.32,sq:.34}],[.75,{...D,lean:.78,head:.05,sq:.26}],[.95,null]],k.t)}
    else if(k&&k.id=='rstab'){mouth='o';po=rSeq(base,[[0,{gx:-3,gy:-8,wa:-.03,two:1,lean:.2,hF:.4,kF:.5,hB:-.5,kB:.6,sq:.06}],[.06,{gx:-4,gy:-8,wa:-.03,two:1,lean:.24,hF:.45,kF:.6,hB:-.55,kB:.6,sq:.08}],[.12,{gx:11,gy:-8,wa:0,two:1,lean:.42,head:.08,hF:1.1,kF:.35,hB:-1.05,kB:.25,y:-1}],[.32,{gx:11,gy:-8,wa:0,two:1,lean:.4,head:.06,hF:1,kF:.4,hB:-1,kB:.3}],[.48,null]],k.t)}
    else if(k&&k.id=='dash'){mouth='o';po=k.t<.18?rP(base,{gx:9,gy:-6,wa:-.02,two:1,lean:.46,head:.08,hF:1.1,kF:.3,hB:-1.1,kB:.35,y:-1}):rP(base,{gx:-4,gy:-4,wa:3.0,two:1,lean:-.14,hF:-.5,kF:.4,hB:.7,kB:.5})}
    else if(k&&k.id=='zap'){glow='rgba(165,216,255,.9)';po=rP(base,{gx:6,gy:-11,wa:-.6,two:1,lean:.28,hF:.6,hB:-.5})}
    else if(k&&k.id=='tw'){mouth='o';glow='rgba(195,250,232,.9)';const t=k.t;
      if(t<.16)po=rP(base,{gx:9,gy:-6,wa:-.02,two:1,lean:.46,head:.08,hF:1.1,kF:.3,hB:-1.1,kB:.35,y:-1});
      else if(t<.26)po=rSeq(base,[[0,{gx:-6,gy:-8,wa:2.6,two:1,lean:-.1,sq:.1,hF:.5,kF:.7,hB:-.4,kB:.6}],[.1,{gx:6,gy:-4,wa:.4,two:1,lean:.3,sq:.12,hF:.8,kF:.9,hB:-.6,kB:.6}]],t-.16);
      else if(t<.62){const sp=(t-.26)/.12;po=rP(base,{gx:6*Math.cos(sp*6.283),gy:-10+4*Math.sin(sp*6.283),wa:-1.4+sp*6.283,two:1,lean:-.08+.12*Math.sin(sp*6.283),hF:.7,kF:1.5,hB:.4,kB:1.3,y:-1})}
      else if(t<1.1){const c=Math.min(1,((t-.72)%.18+.18)%.18/.12);po=rMix(rP(base,{gx:-2,gy:-17,wa:-2.2,two:1,lean:-.22,hF:.6,kF:1.4,hB:.3,kB:1.2}),rP(base,{gx:9,gy:-2,wa:1.0,two:1,lean:.38,hF:1,kF:1.2,hB:-.4,kB:1}),t<.72?0:eo(c))}
      else if(t<1.32)po=rP(base,{gx:6,gy:2,wa:1.45,two:1,lean:.32,hF:.9,kF:1.3,hB:-.2,kB:1.1,y:-2});
      else po=rSeq(base,[[0,{gx:7,gy:-1,wa:1.1,two:1,lean:.42,sq:.18,hF:.95,kF:1,hB:-.8,kB:.6}],[.12,{gx:6,gy:-2,wa:.95,two:1,lean:.28,sq:.08}],[.28,null]],t-1.32)}
    else if(k&&k.id=='ls'){mouth='o';glow='rgba(195,250,232,.9)';const ph=(k.n||0)%3;po=k.done?rP(base,{gx:7,gy:-1,wa:1.1,two:1,lean:.46,sq:.15,hF:.95,kF:1,hB:-.8,kB:.6}):rP(base,ph==0?{gx:8,gy:-6,wa:.2,two:1,lean:.3,hF:.9,kF:1.2,hB:-.6,kB:1}:ph==1?{gx:-2,gy:-16,wa:-2,two:1,lean:-.2,hF:.4,kF:1.3,hB:.3,kB:1.1}:{gx:6,gy:-1,wa:1.2,two:1,lean:.36,hF:1,kF:1.1,hB:-.5,kB:.9})}
    else if(k&&k.id=='yr'){const t=k.t,iai={gx:-6,gy:-5,wa:2.75,two:1,lean:.3,sq:.14,hF:.75,kF:.95,hB:-.65,kB:.7};glow=t<.4||(t>1.2&&t<1.45)?'rgba(229,153,247,.95)':null;
      po=rSeq(base,[[0,{gx:-6,gy:-6,wa:2.6,two:1,lean:.2,sq:.08,hF:.6,kF:.8,hB:-.5,kB:.6}],[.36,iai],[.42,{gx:11,gy:-8,wa:.05,two:1,lean:.44,hF:1.1,kF:.35,hB:-1.05,kB:.25}],[.6,{gx:10,gy:-7,wa:.15,two:1,lean:.4,hF:1,kF:.4,hB:-1,kB:.3}],[.66,{gx:-4,gy:-2,wa:2.9,two:0,lean:.02,sq:.04}],[1.18,{gx:-4,gy:-2,wa:2.9,two:0,lean:.02,sq:.04}],[1.3,iai],[1.35,iai],[1.42,{gx:4,gy:-16,wa:-1.75,two:1,lean:-.22,y:-3,hF:-.2,kF:.4,hB:.5,kB:.9}],[1.6,{gx:4,gy:-15,wa:-1.7,two:1,lean:-.16,y:-2}],[1.8,{gx:-3,gy:-3,wa:2.8,two:0,lean:.04}]],t)}
    else if(P.ch>.15){const q=eo((P.ch-.15)/.25),mid=rP(base,{gx:1,gy:-17,wa:-1.6,two:1,lean:-.12,x:-1});po=q<.5?rMix(base,mid,q*2):rMix(mid,rP(base,SWK['-1'].w),(q-.5)*2);glow=P.ch>=.7?'rgba(255,224,102,.95)':'rgba(255,255,255,.55)';if(P.ch>=.7)po.y+=Math.sin(tm*70)*.45}
    else if(P.swT!=null&&P.swT<P.swD+P.swR+.12){const c=P.swC;mouth='o';po=rSeqU(base,atkKeys(c,P.swW||.06,P.swD,P.swR,P.swFrom),P.swT);if(c==-1||c==3)glow='rgba(255,224,102,.75)'}}
  if(P.stun>0&&!P.grab){po=rMix(po,rP(po,HURT),.85);mouth='o';closed=1}
  return {p:po,glow,mouth,closed}}
// 平滑过渡:每帧把当前姿势往目标姿势靠拢(攻击时更快,保证打击感)
function rigSmooth(cur,tg,dt,fast){if(!cur)return {...tg};const q=1-Math.exp(-dt*(fast?95:22));for(const k of RKS){if(k=='wb'){cur.wb=tg.wb;continue}cur[k]=k=='wa'?cur.wa+angD(cur.wa,tg.wa)*q:cur[k]+(tg[k]-cur[k])*q}return cur}
// —— 两段 IK:肩膀 S 到目标 T,返回肘 E 和手 H(肘尽量朝下)
function ik2(Sx,Sy,Tx,Ty,a,b){const dx=Tx-Sx,dy=Ty-Sy,d0=Math.hypot(dx,dy)||.001,d=Math.max(Math.abs(a-b)+.05,Math.min(a+b-.05,d0)),ph=Math.atan2(dy,dx),al=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));
  const e1=[Sx+a*Math.cos(ph+al),Sy+a*Math.sin(ph+al)],e2=[Sx+a*Math.cos(ph-al),Sy+a*Math.sin(ph-al)],E=e1[1]>=e2[1]?e1:e2,tx=Sx+dx/d0*d,ty=Sy+dy/d0*d,ex=tx-E[0],ey=ty-E[1],el=Math.hypot(ex,ey)||1;
  return {E,H:[E[0]+ex/el*b,E[1]+ey/el*b]}}
const fk=(a)=>[Math.sin(a),Math.cos(a)];
// 剑刃配色(按品质):[高光, 主色, 暗边, 剑光颜色]
const WPAL=[['#ffffff','#cfdbe8','#6f86a3','#a5d8ff'],['#f4fff0','#8ce99a','#2b8a3e','#69db7c'],['#e7f5ff','#74c0fc','#1864ab','#4dabf7'],['#fbefff','#e599f7','#862e9c','#f783ac']];
const SWL=55,SWB=9;  // 剑尖 / 剑刃起点到握把的距离
// 第十七轮:纸娃娃手里的大剑 = Fantasy Sword Set(melle,CC0)像素化(art_src/lpc/build_hsw.py);一行一把,按系列 0 旅者 / 1 林王 / 2 荒漠 / 3 雪原
// M = [y, 宽, 高, 握把 x, 中线 y],剑尖朝右
const HSW={D:'@@A:hsw_atlas@@',M:[[0,72,21,19,10],[21,72,21,20,10],[42,74,19,22,9],[61,79,23,22,11],[84,72,21,19,10],[105,74,19,22,9],[124,74,19,22,9]],I:null,  // 第四十二轮:5 火之大剑 / 6 真~火之大剑
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D}};
HSW.init();
// 第二十六轮:纸娃娃手里的法杖 = Staff [64x64](LordNeo,CC0);一格 64×64 一把(杖头朝左上),M = [杖尾 x, 杖尾 y, 杖头 x, 杖头 y],按系列 0 旅者 / 1 林王 / 2 荒漠 / 3 雪原
const STF={D:'@@A:stf_atlas@@',C:76,E:12,M:[[72,71,4,3],[73,72,11,12],[72,71,4,3],[73,72,11,12],[73,73,8,6],[66,69,7,6],[66,69,7,6]],I:null,  // 第四十二轮:5 火之法杖 / 6 真~火之法杖  // 第二十七轮:杖尾加长 E 像素(格子 C×C),握持位置仍按加长前的杖身算
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D}};
STF.init();
// —— 武器:原点在握把(前手)处,沿 +x 方向。剑柄从 -14 到 +6(手握在中间偏上),护手 6~9,剑刃 9~55
function drawWpn(c,wk,tier,glow,t,g){const pal=WPAL[tier||0];g=g||0;
  if(wk=='staff'){if(glow){c.save();c.globalCompositeOperation='lighter';C_(c,40,0,15,RGD(c,40,0,15,[glow,'rgba(0,0,0,0)']),0);c.restore()}
    if(g==1){// 林王法杖:弯曲的树枝,长着叶子,顶端两根细枝托着绿色宝珠
      TUBE(c,[[-18,0],[-4,1.6],[10,-1.2],[24,1],[33,0]],3.4,'#6b4a2e');for(const [a,b,r] of [[-8,1.4,-.7],[6,-1,.8],[20,.8,-.6]]){c.save();c.translate(a,b);c.rotate(r);E_(c,0,-3.4,1.9,3.8,LG(c,0,-7,0,0,['#d3f9d8','#2f9e44']),.8);c.restore()}
      TUBE(c,[[33,0],[37,-5],[41,-7]],1.6,'#6b4a2e');TUBE(c,[[33,0],[37,5],[41,7]],1.6,'#6b4a2e');
      C_(c,41,0,5,RGD(c,40,-1.4,6,['#ffffff',tier?pal[1]:'#8ce99a','#1e6b30']),1.2);return}
    if(g==2){// 荒漠法杖:金色杖身 + 金箍,顶端新月托着宝石
      TUBE(c,[[-18,0],[32,0]],3,'#e0b04a');for(const k of [-14,-2,10,22])RR(c,k-1,-2.4,2.4,4.8,1,'#a8701a',.7);
      c.beginPath();c.arc(40,0,8.4,-2.3,2.3);c.arc(36.6,0,6.4,1.85,-1.85,true);c.closePath();FS_(c,LG(c,0,-8,0,8,['#fff3bf','#f0b93a','#a8701a']),1.1);
      C_(c,38.6,0,3.6,RGD(c,37.8,-1,4.4,['#ffffff',tier?pal[1]:'#ff6b6b','#862e2e']),1);RR(c,30,-3,3,6,1.2,'#a8701a',.8);return}
    // 旅者法杖:木杖 + 金色圆环 + 宝珠
    TUBE(c,[[-18,0],[34,0]],3.2,'#8a5a2e');for(const k of [-15,-5,5,15])LN_(c,[[k,-1.5],[k+1.6,1.5]],'#5c3a1e',.9);RR(c,-19.5,-2.2,3,4.4,1.2,'#ffd43b',.9);
    c.beginPath();c.arc(40,0,7.6,-2.6,2.6);c.strokeStyle=OL;c.lineWidth=4.4;c.stroke();c.strokeStyle='#ffd43b';c.lineWidth=2.6;c.stroke();
    C_(c,40,0,5,RGD(c,39,-1.4,6,['#ffffff',pal[1]==WPAL[0][1]?'#cc5de8':pal[1],'#6a1fae']),1.2);PG(c,[[32.5,-3.4],[35.4,0],[32.5,3.4],[30.8,0]],'#ffd43b',.9);return}
  const gl=glow||(tier>=2?pal[3]+'55':null);
  if(gl){c.save();c.globalCompositeOperation='lighter';E_(c,32,0,28,11,RGD(c,32,0,28,[gl,'rgba(0,0,0,0)']),0);c.restore()}
  let bp;
  if(g==0){// 旅者剑:直身阔剑,十字护手,皮革缠柄,圆形剑首
    C_(c,-15.4,0,2.6,LG(c,0,-2.6,0,2.6,['#f1f3f5','#868e96']),1.1);RR(c,-13,-2,19.4,4,1.8,'#6b4423',1.1);for(let k=-11.5;k<5;k+=2.4)LN_(c,[[k,-1.9],[k+1.6,1.9]],'#a0703a',.9);
    RR(c,5.2,-9,3.8,18,1.6,LG(c,0,-9,0,9,['#f8f9fa','#adb5bd','#6c757d']),1.2);C_(c,7.1,0,1.5,pal[2],.6);
    bp=()=>{c.beginPath();c.moveTo(SWB,-4.8);c.lineTo(SWL-8,-4.4);c.lineTo(SWL,0);c.lineTo(SWL-8,4.4);c.lineTo(SWB,4.8);c.closePath()};
    bp();c.fillStyle=fc(LG(c,0,-5,0,5,[pal[0],pal[1],pal[2]]));c.fill();c.strokeStyle=OL;c.lineWidth=1.3;c.lineJoin='round';c.stroke();
    LN_(c,[[SWB+3,0],[SWL-12,0]],pal[2],1.4);LN_(c,[[SWB+3,-.9],[SWL-12,-.8]],'rgba(255,255,255,.75)',.8);LN_(c,[[SWB+1,3.6],[SWL-9,3.2]],'rgba(255,255,255,.9)',.8)}
  else if(g==1){// 林王剑:叶形剑身(中间有叶脉)、两片叶子做护手、木柄缠着藤蔓、橡果剑首
    E_(c,-15.2,0,2.6,2.9,LG(c,0,-3,0,3,['#c08a52','#6b4423']),1.1);RR(c,-13,-2,19.4,4,1.8,'#7a5226',1.1);for(let k=-11.5;k<5;k+=3.2)LN_(c,[[k,-2],[k+2.4,2]],'#69db7c',1);
    for(const d of [-1,1]){c.save();c.translate(7,d*2);c.rotate(d*.55);E_(c,0,d*4,2.2,5.2,LG(c,0,-5,0,5,['#d3f9d8','#2f9e44']),1);c.restore()}
    bp=()=>{c.beginPath();c.moveTo(SWB,-2.6);c.bezierCurveTo(SWB+12,-10.5,SWL-14,-8,SWL,0);c.bezierCurveTo(SWL-14,8,SWB+12,10.5,SWB,2.6);c.closePath()};
    bp();c.fillStyle=fc(LG(c,0,-8,0,8,[pal[0],pal[1],pal[2]]));c.fill();c.strokeStyle=OL;c.lineWidth=1.3;c.lineJoin='round';c.stroke();
    LN_(c,[[SWB+1,0],[SWL-3,0]],'#2b8a3e',1.2);for(let i=0;i<5;i++){const px=SWB+6+i*7.5,h=5.4-Math.abs(i-1.5)*.9;LN_(c,[[px,0],[px+3.4,-h]],'rgba(43,138,62,.65)',.8);LN_(c,[[px,0],[px+3.4,h]],'rgba(43,138,62,.65)',.8)}}
  else{// 荒漠剑:火焰形护手,刀背是火焰状锯齿的宽刃,长剑柄末端宝石
    PG(c,[[-17.5,0],[-14.6,-2.8],[-12.6,0],[-14.6,2.8]],LG(c,0,-3,0,3,['#fff3bf','#e8a400']),1.1);C_(c,-15,0,1.2,pal[2],0);
    RR(c,-13,-2,19.4,4,1.8,'#3d2410',1.1);for(let k=-11.5;k<5;k+=2.4)LN_(c,[[k,-1.9],[k+1.6,1.9]],'#a0703a',.9);for(const k of [-12.6,-1,5.2])RR(c,k-.6,-2.3,1.6,4.6,.6,'#ffd43b',.7);
    SMO(c,[[6,-11],[10.4,-6.4],[9.4,0],[10.4,6.4],[6,11],[7.6,4.4],[5.4,0],[7.6,-4.4]],LG(c,0,-11,0,11,['#fff3bf','#ff922b','#c2410c']),1.2);C_(c,8,0,2.2,RGD(c,7.4,-.6,2.6,['#fff',pal[1],pal[2]]),.9);
    bp=()=>{c.beginPath();c.moveTo(SWB,-5.4);for(let i=0;i<4;i++){const px=SWB+2+i*10.5,h=4.4-i*.55;c.quadraticCurveTo(px+2,-6-h*.3,px-1.5,-6-h);c.quadraticCurveTo(px+6,-6.4-h*.4,px+10,-5.6+i*.2)}c.lineTo(SWL-7,-4.4);c.lineTo(SWL,0);c.lineTo(SWL-8,4.6);c.lineTo(SWB,5.6);c.closePath()};
    bp();c.fillStyle=fc(LG(c,0,-9,0,6,[pal[0],pal[1],pal[2]]));c.fill();c.strokeStyle=OL;c.lineWidth=1.3;c.lineJoin='round';c.stroke();
    PG(c,[[SWB+2,-1.6],[SWL-9,-.8],[SWL-4,.2],[SWB+2,1.8]],'rgba(255,255,255,.62)',0);LN_(c,[[SWB+1,4.4],[SWL-9,3.6]],'rgba(255,255,255,.9)',.8)}
  if(glow||tier>=3){bp();c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.35+.25*Math.sin((t||0)*6);c.strokeStyle=pal[3];c.lineWidth=2.6;c.stroke();c.restore()}}
// —— 戒指 / 耳坠(只做图标,角色身上不显示)。原点在中心
const BANDC=[['#f3c98b','#b07a3a','#6b4423'],['#d8c08a','#8a6a3a','#5c3a1e'],['#fff3bf','#f0b93a','#a8701a'],['#ffffff','#a5d8ff','#4d8fcc']];
function drawRingIc(c,g,col){const b=BANDC[g],gem=RGD(c,-1.6,-10,8,['#ffffff',col,'#1a1a2e']);
  c.beginPath();c.ellipse(0,5,12.5,11.5,0,0,7);c.strokeStyle=OL;c.lineWidth=7.4;c.stroke();c.strokeStyle=fc(LG(c,0,-7,0,17,b));c.lineWidth=4.8;c.stroke();
  if(g==1){for(const k of [-.6,.9,2.4])LN_(c,[[Math.cos(k)*12.5,5+Math.sin(k)*11.5],[Math.cos(k+.3)*12.5+1.5,5+Math.sin(k+.3)*11.5]],'#40c057',1.4);for(const d of [-1,1])E_(c,d*6.6,-7.6,2.4,5,LG(c,0,-12,0,-3,['#d3f9d8','#2f9e44']),1,d*1.1)}
  else RR(c,-5.4,-5.4,10.8,3.4,1.4,b[1],1);
  C_(c,0,-9,g==2?7.2:5.4,gem,1.3);C_(c,-2,-11,g==2?2:1.5,'rgba(255,255,255,.85)',0);
  if(g==2){const s=(a,b2,r)=>PG(c,[[a,b2-r],[a+r*.28,b2-r*.28],[a+r,b2],[a+r*.28,b2+r*.28],[a,b2+r],[a-r*.28,b2+r*.28],[a-r,b2],[a-r*.28,b2-r*.28]],'#ffffff',0);s(10,-15,4.4);s(-11,-3,2.6)}}
function drawEarIc(c,g,col){const b=BANDC[g],gem=RGD(c,-1,4,9,['#ffffff',col,'#1a1a2e']);
  c.beginPath();c.arc(0,-15,4.2,Math.PI*.85,Math.PI*2.15);c.strokeStyle=OL;c.lineWidth=3.6;c.stroke();c.strokeStyle=b[1];c.lineWidth=1.8;c.stroke();LN_(c,[[0,-11],[0,-5]],b[2],1.6);
  if(g==0){c.beginPath();c.arc(0,3,7.4,0,7);c.strokeStyle=OL;c.lineWidth=5;c.stroke();c.strokeStyle=fc(LG(c,0,-5,0,10,b));c.lineWidth=3;c.stroke();C_(c,0,11,3.8,gem,1.1)}
  else if(g==1){C_(c,0,-4,2.2,gem,.9);E_(c,0,7,5,10,LG(c,0,-3,0,17,['#d3f9d8','#40c057','#1e6b30']),1.2);LN_(c,[[0,-2],[0,15]],'#1e5a2a',.9);for(const y of [3,8,12])for(const d of [-1,1])LN_(c,[[0,y],[d*3.2,y-2.4]],'rgba(30,90,42,.6)',.7)}
  else{c.beginPath();c.arc(0,1,8,.3,Math.PI-.3);c.arc(0,-1.4,6,Math.PI-.5,.5,true);c.closePath();FS_(c,LG(c,0,-3,0,9,b),1.1);SMO(c,[[0,5],[3.6,11],[0,16.5],[-3.6,11]],gem,1.1);C_(c,-1,10,1.1,'rgba(255,255,255,.85)',0)}}
