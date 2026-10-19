// ===== 第四十轮:第二张世界地图「暗黑大陆」(用户定制插画,art_src/map/build_map2.py → assets/map2_bg.jpg)=====
// 通关第十关后,第一张地图右上角出现「暗黑大陆 ▶」(也可以按 Tab);左下角的机械城 = 第十一关齿轮要塞(cur 14);左下角「返回城镇」(原图写成了浮岛城镇,字已擦掉,这里重写);
// 右上角「◀ 第一张地图」返回;其他地点和右下角的挑战模式尚未开放
const MAPI2={I:null,D:'@@J:map2_bg@@'};{const im=new Image();im.onload=()=>{MAPI2.I=im};im.src=MAPI2.D}
let MPG=0;  // 0 = 第一张地图 · 1 = 暗黑大陆
const map2Open=()=>CLR.includes(10);
const MAPS2=[{n:'第十一关 · 齿轮要塞',d:['钢铁暴君镇守的机械城','推荐 Lv50'],cur:14,lock:()=>!CLR.includes(10),p:[66,258],w:56,h:44},
  {n:'第十二关 · 永夜王城',d:['冰晶雪台上的夜王之城','推荐 Lv52'],cur:15,lock:()=>!CLR.includes(14),p:[62,186],w:56,h:44},
  {n:'第十三关 · 熔心火山',d:['火山深处的焚天炎君','推荐 Lv54'],cur:16,lock:()=>!CLR.includes(15),p:[84,108],w:50,h:32},
  {n:'第十四关 · 月影忍城',d:['月光下的蓝瓦忍者城郭','推荐 Lv55'],cur:18,lock:()=>!CLR.includes(16),p:[205,98],w:52,h:34},
  {n:'第十五关 · 不眠钟楼',d:['千钟之主沉睡的钟楼','推荐 Lv55'],cur:19,lock:()=>!CLR.includes(18),p:[214,196],w:48,h:44},
  {n:'第十六关 · 金核机库',d:['金核炮神镇守的机械神殿','推荐 Lv55'],cur:20,lock:()=>!CLR.includes(19),p:[316,292],w:44,h:40},
  {n:'第十七关 · 炎狱熔渊',d:['炎狱巨像镇守的熔岩要塞','推荐 Lv55'],cur:21,lock:()=>!CLR.includes(20),p:[488,262],w:52,h:42},
  {n:'封魔石台 · 十二魔封印',d:['十二位魔王被封印的浮空石台','推荐 Lv55'],cur:22,dms:1,lock:()=>!CLR.includes(21),p:[535,150],w:50,h:36},
  {n:'宝塔 · 暗黑炼狱',d:['一层一层往上闯的三十层宝塔','推荐 Lv55'],cur:34,tw:1,lock:()=>!CLR.includes(21),p:[352,186],w:40,h:48}];  // 第五十六轮:用户附图 = 正中间冒绿光的宝塔(点开是选层页 st 'twr')  // 第五十五轮:用户附图 = 右上方四根封魔柱围着的浮空石台(点开是恶魔选择页 st 'dms')  // 第五十四轮:右下角的熔岩要塞(位置待用户确认)  // 第五十三轮:用户截图 = 下方正中的金色机器人  // 第四十八轮:用户截图 = 中间偏左的蓝色符文塔  // 第四十七轮:用户附图 = 月亮下的蓝瓦城郭  // 第四十二轮:用户截图 = 左上角的火山  // 用户发截图:放在左边的冰晶雪台(齿轮要塞上面)  // 第四十一轮
const M2B=[504,6,130,26],M2T=[8,322,104,32],M2C=[548,300,90,58];  // 第一张地图上的「暗黑大陆」按钮 · 返回城镇 · 挑战模式
const inR=(mx,my,r)=>mx>r[0]&&mx<r[0]+r[2]&&my>r[1]&&my<r[1]+r[3];
function map2Btn(t){const hv=inR(MX_,MY_,M2B);RR(x,M2B[0],M2B[1],M2B[2],M2B[3],12,LG(x,0,M2B[1],0,M2B[1]+M2B[3],hv?['#9775fa','#5f3dc4']:['#7048e8','#3b1f8f']),1.8);CT('暗黑大陆 ▶',M2B[0]+M2B[2]/2,M2B[1]+18,12,'#fff','center',2.6,'#1e1030')}
function map2Hit(mx,my){for(let i=0;i<MAPS2.length;i++){const m=MAPS2[i];if(Math.abs(mx-m.p[0])<m.w&&Math.abs(my-m.p[1])<m.h)return i}return -1}
function map2Go(i){const m=MAPS2[i];if(!m)return;if(m.lock()){say(m.cur==14?'通关第十关后解锁':m.dms||m.tw?'通关第十七关后解锁':'通关上一关后解锁');return}if(m.dms){openDms();return}if(m.tw){openTwr();return}openLvSel(m.cur-1)}
function map2Click(mx,my){const i=map2Hit(mx,my);if(i>=0){map2Go(i);return}if(inR(mx,my,M2T)){st='town';return}if(inR(mx,my,[504,6,130,26])){MPG=0;return}if(inR(mx,my,M2C)){say('挑战模式尚未开放');return}if(my>40&&my<310)say('这里尚未开放')}
function drawMap2(t){x.imageSmoothingEnabled=true;x.drawImage(MAPI2.I,0,0,VW,VH);
  MAPS2.forEach((m,i)=>{const [a,b]=m.p,hv=map2Hit(MX_,MY_)==i,lk=m.lock(),n=m.cur;
    x.save();x.globalCompositeOperation='lighter';E_(x,a,b,58+Math.sin(t*4)*3,40,RGD(x,a,b,58,[hv?'rgba(150,242,215,.55)':'rgba(120,220,200,.32)','rgba(0,0,0,0)']),0);x.restore();
    RR(x,a-42,b+30,84,28,5,lk?'rgba(18,20,30,.75)':'rgba(10,30,40,.82)',1.4);CT(m.n.split(' · ')[1],a,b+43,12,'#fff','center',2.6,'#0b2a2e');CT(lk?(n==14?'🔒 通关第十关后解锁':m.dms||m.tw?'🔒 通关第十七关后解锁':'🔒 通关上一关后解锁'):m.d[1],a,b+54,8,'#c3fae8','center',2,'#0b2a2e');
    {const sn=m.dms||m.tw?0:starOf(n);for(let k=0;k<sn;k++)CT('★',a+28+k*10,b+28,10,STARK[sn].c,'center',2.4,'#5a2e08')}});
  {const hv=inR(MX_,MY_,M2T);CT('返回城镇',M2T[0]+M2T[2]/2,M2T[1]+22,17,hv?'#ffe066':'#fff','center',3.4,'#16213e')}
  {const hv=inR(MX_,MY_,[504,6,130,26]);RR(x,504,6,130,26,12,LG(x,0,6,0,32,hv?['#ffb84d','#e8590c']:['#e8590c','#a63f08']),1.8);CT('◀ 第一张地图',569,24,12,'#fff','center',2.6,'#3a1d0a')}
  CT('点击地名进入关卡 · Esc 回第一张地图',320,350,9,'#fff','center',2.4,'#0b3a6b');
  if(performance.now()<msgU)CT(msg,320,58,13,'#ffe3e3','center',3,'#7a1f1f')}
function mapHit(mx,my){if(MAPI.I){for(let i=0;i<MAPP.length;i++){const [a,b]=MAPP[i];if(Math.abs(mx-a)<40&&Math.abs(my-b)<17)return i}return -1}for(let i=0;i<MAPN.length;i++){const [a,b]=MAPN[i];if(Math.abs(mx-a)<52&&my>b-18&&my<b+42)return i}return -1}
