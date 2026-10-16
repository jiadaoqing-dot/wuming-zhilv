// 2026-10-13 第十六轮:角色上限 50 级(第二张地图出来再提高);升级所需经验 = 150×等级^1.5 + 100(1 级 250 · 10 级 4843 · 25 级 18850 · 49 级 51560,1~50 共约 100 万);
// 每级 2 技能点(49 级共 98 点:8 个主动技能满级 64 点 + 8 个被动满级 40 点,不能全满,要取舍)
// 第三十六轮:经验曲线按目标反推(实测每关每星打一遍的实际经验):一星每关打一遍、不重刷 → 进第 2~10 关时 Lv4 / 8 / 12 / 16 / 20 / 24 / 28 / 31 / 34,打完第十关 Lv37;
// 二星十关各打一遍 → Lv50(满级);三星只为装备和金币。EXPT[l-1] = 从 l 级升到 l+1 级要的经验,1→50 共约 32.7 万(旧曲线约 40 万)
const EXPT=[50,70,100,130,160,210,260,330,410,500,610,730,870,1000,1200,1400,1600,1800,2100,2400,2700,3000,3300,3700,4000,4400,4800,5300,5700,6200,6700,7200,7700,8300,8900,9600,10300,11000,11800,12700,13600,14700,15900,17200,18600,20300,22100,24300,26700,29400,32300,35500,39000,43000];  // 第四十一轮:上限 55 级(50→55 约 18 万经验,主要在第二张地图练)
const LVMAX=55,SPLV=2,expNeed=l=>EXPT[Math.min(EXPT.length,Math.max(1,l))-1];  // 第二十二轮:升级经验 ×0.4(原 150·l^1.5+100):同关一星打一遍约升 0.8 级(原来 1/3 级,太长);1→50 级总经验约 40 万
function lvUp(){while(lvl<LVMAX&&exp>=expNeed(lvl)){exp-=expNeed(lvl);lvl++;sp+=SPLV;sfx('lvl');VFX.spawn('radiant-heal',P.x+12,P.y+P.h,{s:1.3});const S=stats();P.hp=S.hp;P.mp=S.mp;tx('升级! Lv'+lvl,P.x-10,P.y-34,'#fff3bf')}if(lvl>=LVMAX)exp=0}
// 第四十四轮(用户选 B):后期首领按「满套装」重新校准 —— 第八关起首领生命 / 攻击每关 ×1.25(第八关不变:生命 6300、攻击 = 第八关的 LDM 8.8);
// 一星不变,三星走完整的 ×1.25 曲线,二星取一半(几何平均)。BLN:cur → 关卡序号(神秘副本 2 / 3 = 第八 / 第十关 ×1.2,跟着走);镜中无名另算
// 三星倍率(相对原来):第九关 生命 ×1.02 攻击 ×1.10 · 第十关 ×1.09 / ×1.23 · 第十一关 ×1.14 / ×1.32 · 第十二关 ×1.24 / ×1.51 · 第十三关 ×1.35 / ×1.74
const BLN={8:8,9:9,10:10,12:8,13:10,14:11,15:12,16:13},BLW=[0,0,.5,1],BLH={8:6300,9:7700,10:9000,11:10800,12:12400,13:14200},BLA={8:8.8,9:10,10:11.2,11:13,12:14.2,13:15.4};
function bLate(c){const n=BLN[c];if(!n)return {hp:1,atk:1};const q=Math.pow(1.25,n-8),w=BLW[LVSTAR]||0;return {hp:Math.pow(6300*q/BLH[n],w),atk:Math.pow(8.8*q/BLA[n],w)}}
function init(full){
  if(full){lvl=1;exp=0;gold=0;sp=0;EQ={sword:gen('sword',0,'新手剑'),staff:gen('staff',0,'新手法杖')};BAG=[];LN={sword:[1,0,0,0,0,0,0,0],staff:[1,0,0,0,0,0,0,0]};JOB=null;STN=stnNew();CLR=[];STAR={};LVSTAR=1;QD=qNew();MAT={egg:0};LUCK=0;R19=r19New();PS={};KP=0;KPS=0;KPC=0;SIGN={day:'',n:0,str:0,last:0,prev:''};OWN=[];WEAR={fash:null,wing:null};SPR=sprNew();PET=petNew();HAM=hamNew();POT=potNew();QS=['hp1','mp1','rev'];RVD=''}
  if(full)LMODE='sword';
  P={x:60,y:GY-32,w:24,h:32,vx:0,vy:0,f:1,at:0,cd:0,inv:0,gr:true,an:0,py:0,hit:new Set(),mode:LMODE,cmb:0,ct:0,ch:0,hb:null,sk:null};
  sfxAll();const S=stats();P.hp=S.hp;P.mp=S.mp;
  const LM=[1,2.2,4,6,8,10,12,14,16,18,6,14,18,21,23,25,27][cur-1];PL=cur==16?[{x:0,y:GY,w:WW}]:cur==15?PL15.map(p=>({...p})):cur==14?PL14.map(p=>({...p})):cur>=11?[{x:0,y:GY,w:WW}]:cur==10?PL10.map(p=>({...p,x0:p.x,y0:p.y})):cur==9?PL9.map(p=>({...p})):cur==8?PL8.map(p=>({...p})):cur==7?PL7.map(p=>({...p})):cur==6?lv6Plats():[PL1,PL2,PL3,PL4,PL5][cur-1];if(![E1,E2,E3,E4,E5,E6,E7,E8,E9,E10,[],[],[],E14,E15,E16,[]][cur-1].some(a=>FLYK[a[0]]))PL=PL.filter(p=>p.y>=GY||p.blk||p.x>=ARL);/* 没有飞行小怪的关卡去掉浮空平台(冰墙、首领场地里的保留)*/LDM=1+(LM-1)*.6;MOONK=1;MOONR=0;DOOR7=0;HOWLT=9;{const W_=mkWQ([E1,E2,E3,E4,E5,E6,E7,E8,E9,E10,[],[],[],E14,E15,E16,[]][cur-1]);WQ=W_.q;WB=[];WT=1.2;WI=0;WLM=LM;E=W_.rest.map(a=>mk(a[0],a[1],LM))}WZ=[];HZ=[];SNW={t:3,L:[]};g8Init();g9Init();s10Init();if(cur==9){WQ[1].push('oni');WQ[2].push('oni')}if(cur==10){WQ[1].push('swing');WQ[2].push('swing');WQ[3].push('swing')}P.cryT=0;P.heat=0;P.ovh=0;P.burn=0;
  // 第十六轮:首领生命 BHN × EHP 7 × 星级倍率(按「同关精良 +5 装备打 60~90 秒」校准:1600 / 2000 / 2850 … 9000),防御 BDF + 星级加值;攻击 = 关卡倍率 × 星级倍率
  const BHN=[0,450,1000,1600,2000,2850,3850,4850,6300,7700,9000,2000,7560,10800,10800,12400,14200,14200],BDF=[0,0,0,10,15,18,22,25,28,30,32,15,34,38,38,42,46,0],ci=cur;  // [17] = 神秘副本 4 镜中无名(第四十三轮,生命 / 防御另算,见 mirNew)  // [16] = 第十三关熔心火山(第四十二轮)  // [15] = 第十二关永夜王城(第四十一轮)  // [14] = 第十一关齿轮要塞(第四十轮,约第十关 ×1.2)  // 第三十九轮:神秘副本 2 / 3 = 第八 / 第十关 ×1.2
  const bh=()=>({hp:Math.round(BHN[ci]*EHP*STK().hp),max:Math.round(BHN[ci]*EHP*STK().hp)});
  B=cur==MY4?mirNew(LM)  // 神秘副本 4:镜中无名(第四十三轮)
   :cur==16?{k:'fk',x:2940,y:GY-110,w:64,h:110,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,lm:LM}  // 第十三关:焚天炎君
   :cur==15?{k:'nk',x:2940,y:GY-100,w:70,h:100,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,lm:LM}  // 第十二关:夜王
   :cur==14?{k:'mech',x:2940,y:GY-110,w:130,h:110,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,lm:LM}  // 第十一关:钢铁暴君
   :cur==13?{k:'dmn',x:2960,y:GY-170,w:64,h:100,...bh(),fl:0,f:-1,cd:1.8,act:null,dm:1,lm:LM}  // 神秘副本 3:深渊炎魔(飞行)
   :cur==12?{k:'nmr',x:2940,y:GY-100,w:120,h:100,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,lm:LM}  // 神秘副本 2:梦魇幽驹
   :cur>=11?{k:'ham',x:2980,y:GY-48,w:56,h:48,...bh(),fl:0,f:-1,cd:1.8,act:null,dm:1,lm:LM}  // 神秘副本 1:瓜子大王(数值同第四关首领)
   :cur==10?{k:'gui',x:2960,y:60,w:56,h:84,...bh(),fl:0,f:-1,cd:2,act:null,dm:1,sa:1,lm:LM,miss:3}
   :cur==9?{k:'lava',x:2920,y:GY-110,w:70,h:110,...bh(),fl:0,f:-1,cd:1.8,act:null,dm:1,sa:1,lm:LM}
   :cur==8?{k:'yin',x:2960,y:GY-68,w:40,h:46,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,sa:0,lm:LM,pj:0}
   :cur==7?{k:'wiz',x:2960,y:GY-90,w:60,h:90,...bh(),fl:0,f:-1,cd:1.6,act:null,dm:1,sa:0,T:[],Z:[],R:[],S:[],q:[],al:1,fm:1,lm:LM}
   :cur==6?{k:'bear',x:2960,y:GY-80,w:110,h:80,...bh(),fl:0,f:-1,cd:1.4,act:null,dm:1,sa:1,wv:[],sp:[],zn:[],q:[],blz:0,bzc:0}
   :cur==5?{k:'andr',x:2960,y:GY-86,w:52,h:86,...bh(),fl:0,f:-1,cd:1.4,act:null,dm:1,sa:0,T:[],Z:[],R:[],q:[],stc:0}
   :cur==4?{k:'sco',x:2960,y:GY-56,w:120,h:56,...bh(),fl:0,f:-1,cd:1/BSP.sco,act:null,bf:0,sh:0,shT:0,dm:1}
   :cur==3?{k:'king',x:2960,y:GY-64,w:96,h:64,...bh(),fl:0,f:-1,cd:1.6/BSP.king,act:null,bf:0,dm:1}:cur==2?{k:'mage',x:2960,y:GY-72,w:34,h:60,...bh(),fl:0,f:-1,fire:1,tp:3.5,tpT:0,ph:0,al:1,cd:1.2,zn:[],cl:[]}:{k:'boss',x:2960,y:GY-92,w:64,h:92,...bh(),fl:0,f:-1,cd:1.5,act:null,pz:null,dm:1};
  B.gy=B.y;B.dm=LDM*STK().atk;B.def=BDF[ci]+STK().def;if(cur>=12&&cur<=13)B.dm*=1.2;{const L=bLate(cur);B.hp=B.max=Math.round(B.max*L.hp);B.dm*=L.atk}if(B.k=='mir'){B.def=0;B.dm=1;mirClr()}mkClr();c15Clr();f16Clr();MSTC={sword:0,staff:0};MSQ=[];MSG=null;palInit();B.star=LVSTAR;{const f=szF(B.k,1);if(f>1){const gap=GY-(B.y+B.h);B.w=Math.round(B.w*f);B.h=Math.round(B.h*f);B.y=GY-gap-B.h;B.gy=B.y;B.bsz=f}}
  F=[];I=[];PB=[];TX=[];Z=[];CL=null;CL2=null;PT=[];RG=[];SLS=[];GH=[];CRK=[];DEC=[];PIL=[];FX={fl:0,fc:'255,255,255',hs:0,dk:0};hitFx=null;GZ=0;CLRP=0;CD={sword:Array(8).fill(0),staff:Array(8).fill(0)};SM={bird:null,vine:null};GD=[];RTP=0;DECOY=0;uq=dq=0;P.run=0;sq=-1;skOpen=false;$('sk').hidden=true;bossOn=false;endT=0;cam=0;jq=ah=ar=lq=0;bagOpen=false;$('bag').hidden=true;
  TOR=[];STM=[];SQI=[];CLN=null;WE=[];MET=[];MGD=[];MGT=null;MGP=null;MGTc=null;MGPc=null;MGL=[];P.shd=P.shdT=P.met=P.wy=0;LCK=null;XYN=0;XYT=0;PF=[];SPRP={x:P.x-4,y:P.y-8};STARP={x:P.x-18,y:P.y+4};PETS={x:P.x-30,y:GY-20,vy:0,f:1,an:0,g:0,wv:0,cd:{atk:2,def:5,fan:1,slow:3}};
  HSH=[];HCL=[];HPS=[];HCP=[];HMP={x:P.x-40,y:GY-16,vy:0,f:1,g:0,wv:0,cd:{0:0,1:3,2:2,3:1},mv:0};P.hsh=P.hshT=P.hdr=0;if(isMy(cur)){P.x=2650;bossOn=true;cam=WW-VW}  // 神秘副本:直接在首领场地开打
}
const sgn=v=>v<0?-1:1;
// o 可选:{kb:水平击退速度, inv:受击后无敌时间(连击用短无敌)}
const CDMG={slime:6,bat:5,skel:8,boss:14,mage:10,snake:7,ape:9,king:12,ysco:7,bsco:8,sco:12,spi:6,ost:8,andr:12,pen:7,pen2:8,seal:8,seal2:9,bear:14,dog:9,dog2:10,wiz:15,gfly:8,gfly2:9,gland:9,gland2:10,yin:14,cradle:0,imp:10,fwisp:9,golem:12,oni:15,lava:16,lclone:0,wimp:9,eye:8,swing:12,gui:14,ham:14,nmr:18,dmn:16,gbot:10,zdr:8,tank:12,mech:18,skw:11,gob:9,nwz:13,nk:19,fwm:10,mmt:12,fsm:14,fk:20};
let noCombo=0;
// 防御(第十九轮重做):每 DEFP 点防御减伤 1%,最多 DEFMX(75%)。旧公式(递减减伤)删除
// 第二十轮重算 77 → 12:按「同关稀有 / 史诗 +3~+6 装备 + 等级 + 属性石」的防御,第一~二关约 1~2%,第五关约 15%,第七关约 25%,
// 第十关约 45%,满级满配(史诗雪原 +6、五颗防御石、精灵防御点满)才碰到 75% 上限。77 时全程只有 0~10%,防御形同虚设
const DEFP=12,DEFMX=.75,defR=def=>Math.min(DEFMX,Math.max(0,def)/DEFP/100),dmgIn=(raw,def)=>Math.max(1,Math.round(raw*(1-defR(def))));
// 第四十四轮(用户选 D):完美闪避 —— 首领战里,跳跃 / 二段跳 / 双击跑步 / 法师闪现之后 PDW 秒内本来要挨的一下改成闪开(之后 PDT 秒伤害 +PDK,金色粒子)
// 这样「看准首领出招的前一刻再跳 / 闪」最赚;一次闪避动作只算一次(P.dgT 用掉就清空)。闪现本身无敌,所以放在 P.inv 判断前面
const PDW=.2,PDT=3,PDK=.5;
function pdMark(){P.dgT=GT}
function pdChk(){if(!(bossOn&&B&&B.hp>0&&P.dgT!=null&&GT-P.dgT<=PDW))return false;P.dgT=null;P.pdT=PDT;P.inv=Math.max(P.inv,.35);
  ghost('#ffd43b',.45);ring(P.x+12,P.y+16,8,70,'#ffd43b',.4,4);burst(P.x+12,P.y+16,18,['#ffd43b','#fff3bf','#fff'],220,{sh:1,s:2,l:.4});flash('255,224,140',.18);hitstop(.12);syn('blink');return true}
