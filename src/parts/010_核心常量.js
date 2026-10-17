// 游戏版本:build.py 按它给输出文件命名(out/无名之旅_v版本.html),设置页也显示;每次发新版改这里
const GAMEV='1.50';
// x 是当前的绘图上下文:平时是主画布;像素特效层(PXL,P2)绘制期间临时换成 640×360 的低分辨率图层
const cv=document.getElementById('c');let x=cv.getContext('2d');const VW=640,VH=360,WW=3200,GY=300;
// 渲染分辨率:电脑端 1920×1080(逻辑坐标仍是 640×360,整体放大 3 倍绘制,文字和像素都更清晰);手机端 1280×720
let RS=matchMedia('(pointer:fine)').matches?3:2;cv.width=VW*RS;cv.height=VH*RS;x.setTransform(RS,0,0,RS,0,0);
const PL1=[{x:0,y:GY,w:WW},{x:480,y:235,w:120},{x:780,y:200,w:110},{x:1080,y:235,w:150},{x:1480,y:210,w:120},{x:1780,y:180,w:110},{x:2080,y:230,w:150},{x:2380,y:200,w:120}];
const PL2=[{x:0,y:GY,w:WW},{x:420,y:240,w:100},{x:600,y:200,w:90},{x:780,y:160,w:90},{x:1020,y:225,w:140},{x:1260,y:190,w:100},{x:1480,y:150,w:100},{x:1700,y:210,w:130},{x:1950,y:175,w:110},{x:2200,y:230,w:140},{x:2420,y:195,w:100}];
const E1=[['slime',450],['slime',700],['slime',1000],['skel',1250],['bat',1400],['skel',1700],['bat',1900],['slime',2000],['bat',2200],['skel',2300],['slime',2450]];
const E2=[['slime',380],['slime',520],['bat',600],['skel',760],['slime',880],['bat',980],['slime',1100],['skel',1200],['bat',1320],['slime',1420],['skel',1540],['bat',1640],['slime',1740],['skel',1850],['bat',1950],['slime',2050],['skel',2150],['bat',2240],['slime',2330],['skel',2420],['bat',2480],['slime',2540]];
const PL3=[{x:0,y:GY,w:WW},{x:450,y:235,w:110},{x:650,y:195,w:100},{x:900,y:230,w:130},{x:1150,y:190,w:100},{x:1380,y:150,w:90},{x:1600,y:215,w:140},{x:1850,y:180,w:110},{x:2100,y:225,w:130},{x:2350,y:190,w:110}];
const E3=Array.from({length:26},(_,i)=>[i%3==1?'ape':'snake',380+i*84]);
const PL4=[{x:0,y:GY,w:WW},{x:430,y:230,w:120},{x:690,y:185,w:100},{x:930,y:225,w:140},{x:1200,y:180,w:110},{x:1430,y:140,w:90},{x:1640,y:205,w:130},{x:1900,y:170,w:120},{x:2150,y:220,w:140},{x:2400,y:180,w:110}];
const E4=Array.from({length:28},(_,i)=>[i%4==1?'ape':i%4==3?'bsco':'ysco',360+i*82]);
const PL5=[{x:0,y:GY,w:WW},{x:440,y:232,w:120},{x:700,y:190,w:100},{x:960,y:228,w:140},{x:1220,y:186,w:110},{x:1460,y:150,w:100},{x:1690,y:208,w:130},{x:1940,y:172,w:120},{x:2200,y:222,w:130}];
const E5=Array.from({length:28},(_,i)=>[i%3==1?'ost':'spi',360+i*80]);
const FLYK={bat:1,gfly:1,gfly2:1,fwisp:1,wimp:1,eye:1,swing:1,zdr:1};  // 飞行小怪:关卡里有它们才保留浮空平台
const CY=56,ARL=2570,ARR=3180; // 第五关 Boss 洞窟:天花板高度、左墙、右墙
// 平衡参数:怪物生命倍率、怪物攻击倍率、Boss 攻击范围倍率、Boss 攻击频率倍率
// 怪物 / 首领血量倍率 EHP(2026-10-12 翻倍 3.5→7)、防御倍率 EDF(+50%,只在伤害公式里乘)
const EHP=7,EATK=3.5,BRNG=3,EDF=1.5;
// Boss 攻击频率倍率(相对最初设计):远程 Boss 的弹幕已放大 3 倍,所以加速少;近战 Boss 需要贴身,加速多一点
const BSP={boss:1.1,mage:1.15,king:1.25,sco:1.3},bsp=e=>BSP[e.k]||1.2;
let PL=PL1;
const ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
let uq=0,dq=0,SM={bird:null,vine:null},TAP={l:0,r:0},st='town',P,E,F,I,PB=[],TX=[],cam=0,bossOn=false,endT=0,shake=0,keys={l:0,r:0},jq=0,ah=0,ar=0,lq=0,B=null,bagOpen=false,sel=null,lvl=1,exp=0,gold=0,sp=0,EQ={},BAG=[],CD={sword:Array(8).fill(0),staff:Array(8).fill(0)},LN={sword:[0,0,0,0],staff:[0,0,0,0]},Z=[],CL=null,CL2=null,skOpen=false,sq=-1,hasSave=false;
const $=id=>document.getElementById(id);
