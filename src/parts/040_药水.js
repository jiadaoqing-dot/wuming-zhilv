// ===== 药水:生命 / 魔力(初级、中级、高级)+ 复活药水。药水背包 50 格,所有药水合计最多带 50 瓶;快捷栏 1 2 3 =====
// [名称, 图标颜色, 类型, 回复比例, 价格]
const POTD={hp1:['初级生命药水','#ff8787','hp',.10,60],hp2:['中级生命药水','#fa5252','hp',.13,220],hp3:['高级生命药水','#c92a2a','hp',.15,600],
  mp1:['初级魔力药水','#74c0fc','mp',.10,50],mp2:['中级魔力药水','#339af0','mp',.13,180],mp3:['高级魔力药水','#1864ab','mp',.15,500],rev:['复活药水','#ffd43b','rev',.5,3000],hp4:['超级生命药水','#e64980','hp',.30,1200,20]};  // 第六项 = 冷却秒数(默认 POTCD);超级生命药水只能从药剂师的好感奖励拿到
// 药水冷却(秒):生命 / 魔力各自计时
const POTCD=8;  // 第二十三轮:10 → 8 秒
// 第二十三轮:药水在百分比之外再加固定回复 POTF(前期主要靠固定值:1 级约 160 血时初级生命药水 ≈ 回 60%;后期主要靠百分比)
const POTF={hp1:80,hp2:220,hp3:500,hp4:1000,mp1:30,mp2:80,mp3:180};
const potAmt=k=>{const d=POTD[k];return Math.round(d[3]*100)+'% 最大'+(d[2]=='hp'?'生命':'魔力')+(POTF[k]?' + '+POTF[k]+' 点':'')};
// 像素药水图标 POTI:Pixel Potion Set 16x16(yafarida,CC0,art_src/potion/build_pot.py);16×17 一格,列 = 蓝 / 红 / 黄 / 绿,行 = 小瓶(初级)/ 中瓶(中级)/ 大圆瓶(高级)
const POTI={I:null,D:'@@A:pot_atlas@@',S:{hp1:[1,0],hp2:[1,1],hp3:[1,2],mp1:[0,0],mp2:[0,1],mp3:[0,2],rev:[2,2],hp4:[3,2]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D;const st=document.createElement('style');st.textContent='.pti{background-image:url('+this.D+')}';document.head.appendChild(st)}};
POTI.init();
const POTK=Object.keys(POTD),POTMAX=50;
const potNew=()=>({hp1:8,mp1:8});
let POT=potNew(),QS=['hp1','mp1','rev'],RVD='';
const potTot=()=>POTK.reduce((s,k)=>s+(POT[k]||0),0);
// 快捷栏用药:这一格的药没了,就自动换同类型的其他品质
function potPick(id){if((POT[id]||0)>0)return id;const ty=POTD[id][2];return POTK.filter(k=>POTD[k][2]==ty&&(POT[k]||0)>0).sort()[0]||null}
function potUse(id,quiet){if(!id||!POTD[id])return false;const d=POTD[id],ty=d[2];
  if(ty=='rev'){if(!quiet)tx('复活药水在倒下时使用',P.x-24,P.y-20,'#ffd43b');return false}
  if(st!='play'&&st!='town')return false;const k=potPick(id);if(!k){tx('没有'+(ty=='hp'?'生命':'魔力')+'药水了',P.x-24,P.y-20,'#adb5bd');return false}
  P.pcd=P.pcd||{};if(P.pcd[ty]>performance.now()/1000){return false}
  const S=stats();if(ty=='hp'&&P.hp>=S.hp){tx('生命已满',P.x-6,P.y-20,'#adb5bd');return false}if(ty=='mp'&&P.mp>=S.mp){tx('魔力已满',P.x-6,P.y-20,'#adb5bd');return false}
  POT[k]--;if(!POT[k])delete POT[k];const pc=POTD[k][5]||POTCD;P.pcd[ty]=performance.now()/1000+pc;P.pcm=P.pcm||{};P.pcm[ty]=pc;const v=Math.round((ty=='hp'?S.hp:S.mp)*POTD[k][3])+(POTF[k]||0);
  if(ty=='hp'){P.hp=Math.min(S.hp,P.hp+v);tx('+'+v,P.x+4,P.y-14,'#69db7c')}else{P.mp=Math.min(S.mp,P.mp+v);tx('+'+v,P.x+4,P.y-14,'#74c0fc')}
  sfx('buff');const c=ty=='hp'?['#ff8787','#ffe3e3','#69db7c']:['#74c0fc','#d0ebff','#a5d8ff'];ring(P.x+12,P.y+16,4,30,c[0],.35,3);for(let i=0;i<12;i++)pt({x:P.x+12+rnd(-12,12),y:P.y+rnd(0,32),vx:rnd(-10,10),vy:rnd(-70,-30),c:pick(c),sh:2,s:rnd(3,5),l:rnd(.4,.7)});save();return true}
function potQuick(i){const id=QS[i];if(!id)return;if(POTD[id][2]=='rev'){if(st=='dead')reviveP();else tx('复活药水在倒下时使用',P.x-24,P.y-20,'#ffd43b');return}potUse(id)}
// 复活:原地站起来,恢复一半生命和魔力,2.5 秒无敌
function reviveP(){if(!(POT.rev>0)||st!='dead')return false;POT.rev--;if(!POT.rev)delete POT.rev;const S=stats();P.hp=Math.round(S.hp*.5);P.mp=Math.round(S.mp*.5);P.inv=2.5;P.stun=0;P.frz=0;P.grab=0;P.ps=0;P.vy=-200;P.sk=null;P.fly=0;if(P.y>VH-40){P.x=P.sfX!=null?P.sfX:P.x;P.y=(P.sfY!=null?P.sfY:GY-P.h)-4;P.vy=0}
  st='play';sfx('lvl');flash('255,240,190',.5);ring(P.x+12,P.y+16,6,70,'#ffd43b',.6,6);burst(P.x+12,P.y+16,30,['#ffe066','#fff3bf','#fff'],260,{sh:2,s:5,l:.6});tx('复活!',P.x-4,P.y-30,'#ffd43b');save();return true}
// 快捷栏(画在技能栏右边,点一下也能用)
const QSR=i=>({x:176+i*33,y:VH-40,w:30,h:30});
function drawPotBar(){const px=PUI.on();for(let i=0;i<3;i++){const r=QSR(i),id=QS[i],k=id?potPick(id)||id:null,n=k?(POT[k]||0):0,d=k?POTD[k]:null;
    if(px)PUI.ns(x,'pC',6,6,6,6,r.x,r.y,r.w,r.h);else RR(x,r.x,r.y,r.w,r.h,7,LG(x,0,r.y,0,r.y+r.h,['#5c4a7a','#2a1f3c']),1.4);
    if(d){x.globalAlpha=n?1:.35;potIcon(x,r.x+r.w/2,r.y+r.h/2+1,k);x.globalAlpha=1;CT(String(n),r.x+r.w-3,r.y+r.h-3,9,'#fff','right',2.2,'#120d18')}
    const cd=d&&P.pcd&&P.pcd[d[2]]?P.pcd[d[2]]-performance.now()/1000:0;if(cd>0){x.fillStyle='rgba(10,8,20,.55)';x.fillRect(r.x+2,r.y+2,r.w-4,Math.round((r.h-4)*Math.min(1,cd/((P.pcm&&P.pcm[d[2]])||POTCD))))}
    if(px){PUI.box(x,r.x-3,r.y-4,10,10,'#fab005','#3a1d0a');CT(String(i+1),r.x+2,r.y+4,8,'#5a2e08','center',0)}else{RR(x,r.x-3,r.y-4,11,11,3,'#ffd43b',1);CT(String(i+1),r.x+2.5,r.y+5,8,'#5a2e08','center',0)}}}
// 宠物技能栏(2026-10-13 第十三轮):药水栏上方,出战宠物(钢盔小鸡 / 仓鼠)的技能图标 + 冷却扇形
// 第十五轮:图标换成 MENI 图集(496 pixel art icons,7Soul1,CC0;art_src/ui/build_meni.py),菜单按钮也用这张图(CSS 里 body.px #tb)
const MENI={I:null,D:'@@A:meni_atlas@@',P:{atk:9,def:10,fan:11,slow:12,0:13,1:14,2:15,3:16},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D}};MENI.init();
Object.assign(MENI.P,{A0:17,A1:18,add:19,gift:20,food:21,lk1:22,lk2:23,luck:24,dbl:25,gc1:39,gc2:40});  // 第十九轮道具图标(build_meni.py 追加)
const mniEm=k=>`<i class="mni" style="background-position:-${MENI.P[k]*34}px 0"></i>`;  // 宠物界面技能卡上的图标
function drawPetBar(){const L=hamOn()?[0,1,2,3].map(i=>[i,HMP.cd[i]||0,hamCd(HSKD[i][2])]):petOn()?PET.sk.map(k=>[k,PETS.cd[k]||0,petCd(k)]):[];if(!L.length)return;const px=PUI.on(),s=22;
  L.forEach(([k,cd,mx],i)=>{const bx=178+i*25,by=VH-72;if(px)PUI.ns(x,'pC',5,5,5,5,bx,by,s,s);else RR(x,bx,by,s,s,5,LG(x,0,by,0,by+s,['#5c4a7a','#2a1f3c']),1.2);
    if(MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[k]*34,0,34,34,bx+2.5,by+2.5,17,17);x.restore()}  // 34 像素原图画成 17 逻辑像素 = 屏幕 1:1(RS=2)
    if(st=='play'&&cd>0){const q=Math.min(1,cd/mx);x.save();x.beginPath();x.rect(bx+2,by+2,s-4,s-4);x.clip();x.fillStyle='rgba(10,8,20,.62)';x.beginPath();x.moveTo(bx+s/2,by+s/2);x.arc(bx+s/2,by+s/2,16,-Math.PI/2,-Math.PI/2+q*6.2832);x.closePath();x.fill();x.restore();CT(String(Math.ceil(cd)),bx+s/2,by+s/2+3,6,'#fff','center',1)}})}
// 药水瓶图标(画布)
function potIcon(c,cx,cy,k){const s=POTI.S[k];if(!POTI.I||!s)return;c.save();c.imageSmoothingEnabled=false;c.drawImage(POTI.I,s[0]*16,s[1]*17,16,17,Math.round(cx-8),Math.round(cy-9),16,17);c.restore()}
// 药水瓶图标(HTML,背包 / 商店用)
const potEm=k=>{const s=POTI.S[k]||[0,0];return `<i class="pti" style="background-position:-${s[0]*1.25}em -${(s[1]*1.328).toFixed(3)}em"></i>`};
