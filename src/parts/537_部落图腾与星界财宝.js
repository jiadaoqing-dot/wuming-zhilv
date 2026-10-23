// ===== 第四十七轮(用户):星界财宝改成在主城开启 —— 新加「部落图腾」(装备商人和强化师之间,TOTX)=====
// 站在图腾前按 W:消耗 1 个星界财宝,宝箱从图腾脚下缓缓升到空中(TOTA 动画),停住后打开,掉出下面随机一种道具(直接放进背包 / 道具页)
// 图集 TOTEM = art_src/totem/build_totem.py:图腾(Gothul,OGA-BY 4.0)熄灭 / 亮 3 帧 + 宝箱(Ansimuz,CC0)关 / 开;宝箱用 filter 染成星空蓝紫
const TOTEM={I:null,D:'@@A:totem_atlas@@'};{const im=new Image();im.onload=()=>{TOTEM.I=im};im.src=TOTEM.D}
const TOTX=1090,TOTS=2;  // 图腾位置 / 放大倍数
// 奖励表:[名字, 发放](随机一个)
const ASTRR=[['普通 Lv1 强化石 ×3',()=>{STN[1][0]+=3}],['普通 Lv2 强化石 ×2',()=>{STN[2][0]+=2}],['普通 Lv3 强化石 ×1',()=>{STN[3][0]+=1}],['普通 Lv4 强化石 ×1',()=>{STN[4][0]+=1}],['合成添加剂 ×1',()=>{MAT.add=(MAT.add|0)+1}],
  ['360 小鸟碎片 ×1',()=>{MAT.b360=(MAT.b360|0)+1}],['高级属性石 ×1',()=>{R19.ats.push(atsNew(2))}],['洗脸券 ×1',()=>{MAT.wash=(MAT.wash|0)+1}],['高级幸运宝石 ×1',()=>{LUCK++}],['击杀点 ×200',()=>{KP+=200}]];
let TOTA=null;  // 开启动画 {t, r 奖励序号, d 已发放}
MISC.astr=['星界财宝','从星界坠落的宝箱。带回主城,站在「部落图腾」(装备商人和强化师之间)前按 W 开启:随机获得 Lv1~3 强化石、合成添加剂、360 小鸟碎片、高级属性石、洗脸券、高级幸运宝石、200 击杀点之一。人造人·灿灿一号掉落。','',0];
function astrOpen(){return '星界财宝要在主城的「部落图腾」前按 W 开启(装备商人和强化师之间)'}
function totemGo(){if(TOTA)return;if(!(MAT.astr>0)){say('部落图腾:「带来星界财宝,我为你打开它。」(背包里没有星界财宝)');return}
  MAT.astr--;TOTA={t:0,r:Math.random()*ASTRR.length|0,d:0};psx('buff');flash('150,140,255',.15);save()}
function totemStep(dt){const a=TOTA;if(!a)return;a.t+=dt;
  if(a.t>=2.2&&!a.d){a.d=1;const r=ASTRR[a.r];r[1]();sfx('coin');shake=.2;VFX.spawn('mass-release',TOTX,GY-120,{s:1.4});for(let i=0;i<24;i++)pt({x:TOTX+rnd(-8,8),y:GY-118,vx:rnd(-120,120),vy:rnd(-160,40),c:pick(['#d0bfff','#a5d8ff','#fff3bf']),s:1.6,l:.8,sh:1});
    tx('🎁 '+r[0],TOTX-40,GY-150,'#ffe066');say('🎁 星界财宝打开了:获得 '+r[0]);save()}
  if(a.t>=3.6)TOTA=null}
// 画:图腾(附近 / 开启中亮起)+ 升空的宝箱
function totemDraw(t){if(!TOTEM.I)return;const I=TOTEM.I,on=TOTA||Math.abs(P.x+12-TOTX)<60,f=on?1+Math.floor(t*6)%3:0,s=TOTS;x.imageSmoothingEnabled=false;
  x.drawImage(I,f*32,0,32,32,TOTX-16*s,GY-32*s,32*s,32*s);
  if(on){x.save();x.globalCompositeOperation='lighter';C_(x,TOTX,GY-34,30,RGD(x,TOTX,GY-34,32,['rgba(110,200,255,.35)','rgba(0,0,0,0)']),0);x.restore()}
  if(!TOTA)PLQ(x,TOTX,GY-32*s-14,'部落图腾','开启星界财宝'+(MAT.astr>0?' ×'+MAT.astr:''));
  const a=TOTA;if(a){const k=Math.min(1,a.t/1.8),e=1-(1-k)*(1-k),cy=GY-10-e*110+(a.t>1.8?Math.sin(a.t*4)*2:0),op=a.t>=2.2,al=a.t>3?Math.max(0,(3.6-a.t)/.6):Math.min(1,a.t/.3);
    x.save();x.globalCompositeOperation='lighter';x.globalAlpha=al;C_(x,TOTX,cy,26+Math.sin(t*6)*3,RGD(x,TOTX,cy,28,['rgba(170,150,255,.6)','rgba(0,0,0,0)']),0);x.restore();
    x.save();x.globalAlpha=al;x.filter='hue-rotate(215deg) saturate(1.3) brightness(1.7)';x.drawImage(I,op?36:0,32,36,25,Math.round(TOTX-36),Math.round(cy-25),72,50);x.restore();
    if(Math.random()<.3)pt({x:TOTX+rnd(-30,30),y:cy+rnd(-20,20),vx:0,vy:rnd(-30,-10),c:pick(['#d0bfff','#a5d8ff']),s:1.2,l:.6,sh:1})}
  x.imageSmoothingEnabled=true}
