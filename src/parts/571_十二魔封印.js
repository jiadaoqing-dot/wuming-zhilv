// ===== 第五十五轮:十二魔封印(第二张地图「暗黑大陆」右上方、四根封魔柱围着的浮空石台,cur 22 ~ 33)=====
// 点地图上的石台 → 恶魔选择页(st 'dms'):12 张肖像卡 + 名字;选一个 → 星级选择页(LVS.m = 2,返回时回恶魔选择页)→ 单独的首领战(和神秘副本一样直接在首领场地开打)
// 这一轮先开放前 3 个:cur 22 巴尔 / 23 达贡 / 24 摩洛克(第十七关通关后解锁);其余 9 个显示封印法阵 + 名字(「尚未开放」)
// 名字取自现实神话 / 宗教传说里的恶魔;暗线:远古时女神用十二根封魔柱镇住十二魔王,无名一路击倒首领、女神的力量流回人间,封印反而松动了——
//   魔王们都说自己是被「司名者」夺走名字之后才堕落的(和主线里写着「无」字的铭牌、司名身边的小暗星接在一起,以后的主线再展开)
// 图集 DMN(art_src/demon/build_dmn.py):巴尔 = Boss: Demon Slime · 达贡 = FREE Cthulu(深海青蓝配色)· 摩洛克 = Boss: Minotaur(焦黑赤铜配色),都是 chierit 的 CC-BY 4.0 素材
// 场地借已有图集:巴尔 = GP 夜镇(压暗红)· 达贡 = GP 古堡室内(压深海蓝)· 摩洛克 = FIRE 火山;地上的火 / 水 / 冲击 = BFX 的 b-flame / b-firebomb / b-vsplash、FX29 的 x-bubble、earth-rupture
// BGM:bgm22b / bgm23b / bgm24b(build_audio.py r55,只有首领曲);恶魔选择页用神秘地带的 bgm11
// 数值:生命 = 炎狱巨像 IGHP ×(1 / 1.08 / 1.16),伤害 = IGDM ×(1 / 1.05 / 1.1),再乘星级;没有魔力(esnm),一半生命以下进入二阶段
// 掉落:「诅咒之力」(每个恶魔一种,必掉 1 个,再按掉落率多掉 1 个)+ 首领装备照常
const DM0=22,DMOPEN=3,isDm=c=>c>=DM0&&c<DM0+12,dmI=()=>cur-DM0;
// 12 个恶魔:n 名字 · en 原名 · k 图集名(null = 还没做)· sl 诅咒的部位(前 6 个一阶,后 6 个二阶,部位和前 6 个一一对应)· lg 传说 + 本作暗线
const DMD=[
 {n:'巴尔',en:'Baal',k:'baal',sl:'sword',lg:'所罗门七十二柱的第一位魔王,统领东方的六十六个军团。传说他三首同体,能让人隐身;封印里的他只剩一把烧红的屠刀,一直念叨「我的名字是被拿走的」。'},
 {n:'达贡',en:'Dagon',k:'dagon',sl:'staff',lg:'古代海边民族供奉的鱼神,后来被当成地狱的恶魔。它从深海里伸出触手,把潮水卷成柱子;封印松动后,石台下面整夜都能听见浪声。'},
 {n:'摩洛克',en:'Moloch',k:'molo',sl:'body',lg:'迦南传说里牛头人身的火神,信徒把祭品投进它铜像腹中的烈火。它举着巨斧守在祭坛前,说只要烧掉足够多的名字,自己的名字就能回来。'},
 {n:'阿斯莫德',en:'Asmodeus',k:null,sl:'head',lg:'《托比传》里的色欲魔王,三个头分别是牛、人和羊。'},
 {n:'贝利亚',en:'Belial',k:null,sl:'ear',lg:'「无价值者」,谎言与背叛的王子,外表是坐在火焰战车上的俊美天使。'},
 {n:'阿斯塔罗特',en:'Astaroth',k:null,sl:'ring',lg:'地狱的大公爵,骑着地狱之龙,吐息带着腐臭,知晓过去与未来。'},
 {n:'别西卜',en:'Beelzebub',k:null,sl:'sword',lg:'「苍蝇之王」,暴食的魔王,一声令下就是遮天的蝇群。'},
 {n:'玛门',en:'Mammon',k:null,sl:'staff',lg:'贪婪的化身,据说地狱里所有的金子都是它挖出来的。'},
 {n:'利维坦',en:'Leviathan',k:null,sl:'body',lg:'深渊里的海中巨兽,嫉妒的魔王,鳞甲连刀剑都刺不穿。'},
 {n:'贝尔芬格',en:'Belphegor',k:null,sl:'head',lg:'怠惰的魔王,坐在便器形的王座上,用发明和财富诱惑人。'},
 {n:'阿撒兹勒',en:'Azazel',k:null,sl:'ear',lg:'把锻造武器的技艺教给人类的堕天使,被锁在荒野的巨石下。'},
 {n:'路西法',en:'Lucifer',k:null,sl:'ring',lg:'曾经的「晨星」,傲慢的魔王。十二根封魔柱的最后一根,镇的就是他。'}];
const DMHK=[1,1.08,1.16],DMAK=[1,1.05,1.1],DMZS={baal:[96,200],dagon:[110,172],molo:[116,186]};
const DMN={I:null,D:'@@A:dmn_atlas@@',M:{"baal_i":[0,0,195,114,6,66,114],"baal_w":[0,115,195,114,12,66,114],"baal_a":[0,230,195,114,15,66,114],"baal_h":[0,345,195,114,5,66,114],"dagon_i":[0,460,148,76,15,53,76],"dagon_w":[0,537,148,76,6,53,76],"dagon_a":[0,614,148,76,7,53,76],"dagon_b":[0,691,148,76,9,53,76],"dagon_h":[0,768,148,76,5,53,76],"molo_i":[0,845,204,122,16,134,119],"molo_w":[0,968,204,122,12,134,119],"molo_a":[0,1091,204,122,16,134,119]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(e.k=='baal'||e.k=='dagon'||e.k=='molo')},
  // 第 i 帧:脚底中间画在 (X, Y),高度按「脚底以上 m[6] 像素」= h
  fr(c,n,i,X,Y,h,a){const m=this.M[n];if(!m||!this.I)return;const s=h/m[6];i=Math.max(0,Math.min(m[4]-1,Math.floor(i)));c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;
    c.drawImage(this.I,m[0]+i*m[2],m[1],m[2],m[3],Math.round(X-m[5]*s),Math.round(Y-m[6]*s),m[2]*s,m[3]*s);c.restore()},
  // 首领:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const vs=e.max?1.1*(e.bsz||1):(e.vs||1),H=e.h/vs,k=e.k,a=e.act,T=e.at||0,w=e.pz=='w';let n='i',i=Math.floor(t*8)%this.M[k+'_i'][4];
    if(k=='baal'){if(a=='cleave'){n='a';i=T<.75?T/.75*8:8+(T-.75)/.08}else if(a=='leap'){n='a';i=w?2:T<1.05?9:12}else if(a=='meteor'||a=='crown'||a=='wave'){n='a';i=w?Math.min(5,T*8):10}else if(e.mv){n='w';i=Math.floor(t*12)%12}}
    else if(k=='dagon'){if(a=='beam'){n='a';i=T<.6?T/.6*2:2+(T-.6)/.12}else if(a=='lash'){n='b';i=T<.55?T/.55*2:2+(T-.55)/.1}else if(a=='dive'||e.mv){n='w';i=Math.floor(t*(a=='dive'?14:9))%6}else if(a){n='a';i=w?Math.min(1,T*3):0}}
    else if(k=='molo'){if(a=='chop'){n='a';i=T<.8?T/.8*9:9+(T-.8)/.09}else if(a=='charge'&&!w||e.mv){n='w';i=Math.floor(t*(a=='charge'?18:10))%12}else if(a){n='a';i=w?Math.min(3,T*6):2}}
    c.save();if(FLW)c.filter='brightness(2.6)';if(e.od){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.35+.15*Math.sin(t*6);this.fr(c,k+'_'+n,i,0,0,H*1.02);c.restore()}
    this.fr(c,k+'_'+n,i,0,0,H);c.restore()},
  // 肖像(恶魔选择页 / 关卡卡片):idle 动画,脚底在 (cx, by),高 h
  pt(c,k,cx,by,h,t){const m=this.M[k+'_i'];if(m)this.fr(c,k+'_i',Math.floor(t*8)%m[4],cx,by,h)}};
DMN.init();
// 场地:借已有图集,再整体压一层颜色
function dmBg(){const t=performance.now()/1000,k=DMD[dmI()].k;
  if(k=='baal'){GP.arena3(t);x.fillStyle='rgba(110,8,0,.32)';x.fillRect(0,0,VW,VH)}
  else if(k=='dagon'){GP.arena2(t);x.fillStyle='rgba(0,36,64,.4)';x.fillRect(0,0,VW,VH)}
  else{FIRE.bg();x.fillStyle='rgba(30,6,0,.25)';x.fillRect(0,0,VW,VH)}}
// ---- 场上的东西:地面火 / 深渊水洼 DMZ · 火柱 / 水柱 DMP · 天降火球 / 水球 DMM · 贴地冲击波 DMW(跳过去)----
let DMZ=[],DMP=[],DMM=[],DMW=[];
function dmClr(){DMZ=[];DMP=[];DMM=[];DMW=[]}
const dmCX=v=>Math.max(ARL+20,Math.min(ARR-20,v));
const dmZone=(x0,x1,life,dm,d,c)=>{x0=Math.max(ARL,x0);x1=Math.min(ARR,x1);if(x1-x0<8)return;DMZ.push({x0,x1,t:0,life,dm,d,c});if(DMZ.length>36)DMZ.shift()};
const dmPil=(px,dm,d,dl,c)=>DMP.push({x:dmCX(px),t:-(dl||0),dm,d,c});
const dmMet=(px,dm,d,dl,zl,c)=>DMM.push({x:dmCX(px),y:-30-rnd(0,40),vy:120,t:-(dl||0),dm,d,zl,c});
const dmWave=(px,v,dm,d,c,dl)=>DMW.push({x:px,lx:px,v,t:-(dl||0),life:2.4,dm,d,c});
const dmSplash=(px,py,s)=>VFX.spawn('x-bubble',px,py,{s,life:.7,add:1});  // 水花:FX29 的蓝白光泡(BFX 的 b-vsplash 是绿色毒液)
function dmBoom(bx,r,dm,d,c){if(c=='sea')dmSplash(bx,GY-20,r/22);else VFX.spawn(c=='rock'?'earth-rupture':'b-firebomb',bx,c=='rock'?GY:GY-12,{s:c=='rock'?r/55:r/30});syn('boom');shake=Math.max(shake,.25);const pc=P.x+12;if(Math.abs(pc-bx)<r&&P.y+P.h>GY-r*.9)hurt(d*dm,{kb:sgn(pc-bx)*320})}
function dmStep(dt){const pc=P.x+12,onG=P.y+P.h>=GY-4;P.dmT=(P.dmT||0)-dt;
  for(const z of DMZ){z.t+=dt;if(onG&&P.dmT<=0&&z.t>.15&&z.t<z.life-.2&&pc>z.x0&&pc<z.x1&&hurt(z.d*z.dm,{kb:0}))P.dmT=.45}DMZ=DMZ.filter(z=>z.t<z.life);
  for(const p of DMP){p.t+=dt;if(p.t>=0&&!p.w0){p.w0=1;syn('blink')}if(p.t>=.8&&!p.sn){p.sn=1;syn('boom');shake=Math.max(shake,.25)}if(p.t>=.8&&p.t<2&&Math.abs(pc-p.x)<26&&P.dmT<=0&&hurt(p.d*p.dm,{kb:sgn(pc-p.x)*260}))P.dmT=.45}DMP=DMP.filter(p=>p.t<2.2);
  for(const m of DMM){m.t+=dt;if(m.t<0)continue;m.vy+=520*dt;m.y+=m.vy*dt;if(m.y>=GY-14){m.dd=1;dmBoom(m.x,50,m.dm,m.d,m.c);if(m.zl)dmZone(m.x-55,m.x+55,m.zl,m.dm,5,m.c)}}DMM=DMM.filter(m=>!m.dd);
  for(const w of DMW){w.t+=dt;if(w.t<0)continue;w.x+=w.v*dt;if(Math.abs(w.x-w.lx)>=34){w.lx=w.x;if(w.c=='sea')dmSplash(w.x,GY-18,1.1);else VFX.spawn(w.c=='rock'?'earth-rupture':'b-firebomb',w.x,w.c=='rock'?GY:GY-10,{s:w.c=='rock'?1.1:.9})}
    if(!w.hit&&onG&&Math.abs(pc-w.x)<24&&hurt(w.d*w.dm,{kb:sgn(w.v)*380}))w.hit=1}DMW=DMW.filter(w=>w.t<w.life&&w.x>ARL-20&&w.x<ARR+20);
  if(bossOn&&!(B&&B.hp>0)){DMP=[];DMM=[];DMW=[]}}
function dmFx(){const t=performance.now()/1000;if(!VFX.ok())return;x.imageSmoothingEnabled=false;
  for(const z of DMZ){const a=Math.min(1,z.t/.2,(z.life-z.t)/.4);if(a<=0)continue;for(let px=z.x0+6,i=0;px<z.x1-2;px+=z.c=='sea'?18:12,i++){const sx=px-cam;if(sx<-20||sx>VW+20)continue;
    if(z.c=='sea')VFX.frame(x,'x-bubble',Math.floor(t*12+i*3)%16,sx,GY-6,.42+(i%3)*.06,1,0,a*.85);else VFX.frame(x,'b-flame',Math.floor(t*12+i*1.7)%5,sx,GY+2,1.05+(i%3)*.18,1,0,a)}}
  for(const p of DMP){const sx=p.x-cam;if(p.t<0)continue;const sea=p.c=='sea';
    if(p.t<.8){for(let k=-1;k<=1;k++)sea?VFX.frame(x,'x-bubble',Math.floor(t*14+k*4)%16,sx+k*10,GY-8,.35+p.t*.3,1,0,.75):VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx+k*9,GY+2,.6+p.t*.5,1,0,.7)}
    else{const a=Math.min(1,(2-p.t)/.3);x.save();x.globalCompositeOperation='lighter';for(let y=GY+2,k=0;y>-20;y-=sea?40:52,k++)sea?VFX.frame(x,'x-bubble',Math.floor(t*14+k*5)%16,sx,y-20,1.1,k%2?-1:1,0,a):VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx,y,2.4,k%2?-1:1,0,a,1.75);x.restore()}}
  for(const m of DMM)if(m.t>=0){if(m.c=='sea')VFX.frame(x,'x-bubble',Math.floor(t*14)%16,m.x-cam,m.y,.7,1,0,1);else IFN.fr(x,'fb',1,m.x-cam-16,m.y-16,2.2,1,Math.PI/2)}
  x.imageSmoothingEnabled=true}
// ---- 三个恶魔共用 ----
function dmEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.hd=0;e.cd=(e.od?.75:1.1)+Math.random()*.4+(x_||0)}
function dmOdChk(e,s){if(!e.od&&e.hp<e.max*.5){e.od=1;flash('255,80,60',.35);shake=.5;syn('boom');banner(DMD[dmI()].n+' · '+s)}}
const dmHit=(e,x0,x1,top,d,kb)=>{const pc=P.x+12;if(pc>Math.min(x0,x1)&&pc<Math.max(x0,x1)&&P.y+P.h>top)hurt(d*e.dm,{kb})};
function dmNew(LM,b){const d=DMD[dmI()],z=DMZS[d.k];return {k:d.k,x:2860,y:GY-z[1]-(d.k=='dagon'?18:0),w:z[0],h:z[1],...b,fl:0,f:-1,cd:2,act:null,dm:1,lm:LM}}
function dmInit(){const i=dmI(),K=STK();B.esnm=1;B.hp=B.max=Math.round(IGHP*DMHK[i]*K.hp);B.dm=IGDM*DMAK[i]*K.atk;B.od=0;B.avT=7;B.gy=B.y}
// ---- 巴尔:屠刀斩 cleave · 跃击 leap · 业火陨落 meteor · 炎浪 wave(往两边推开)· 王冠烈焰 crown(二阶段:五根火柱)----
function baalStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('巴尔 · 东方之王从封印里醒来了');bsfx('l9_roar')}
  dmOdChk(e,'王之烈焰!地火烧得更久');
  if(od&&!e.act){e.avT-=dt;if(e.avT<=0){e.avT=7;dmBoom(cx,110,dm,10,'fire');dmZone(cx-150,cx+150,zl,dm,6,'fire')}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?62:50)*dt)}
    if(e.cd>0)return;const Q=['cleave','cleave','leap','meteor','wave'];if(ad<e.w/2+150)Q.push('cleave');if(ad>240)Q.push('leap','meteor');if(od)Q.push('crown','wave');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='cleave'){if(T<.75){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.35;syn('slam');dmHit(e,cx-e.f*20,cx+e.f*210,GY-160,24,e.f*460);VFX.spawn('earth-rupture',cx+e.f*130,GY,{s:2});dmZone(Math.min(cx+e.f*30,cx+e.f*220),Math.max(cx+e.f*30,cx+e.f*220),zl,dm,6,'fire')}
    if(T>1.3)dmEnd(e);return}
  if(a=='leap'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;e.x0=e.x;e.jx=gpCl(e,pc-e.w/2);return}e.pz='s';const u=Math.min(1,(T-.45)/.6);e.x=e.x0+(e.jx-e.x0)*u;e.y=e.gy-Math.sin(u*Math.PI)*130;
    if(u>=1&&!e.hd){e.hd=1;e.y=e.gy;const fx=e.x+e.w/2;dmBoom(fx,120,dm,20,'fire');dmZone(fx-140,fx+140,zl,dm,6,'fire');VFX.spawn('earth-rupture',fx,GY,{s:2.2})}if(T>1.4){e.y=e.gy;dmEnd(e)}return}
  if(a=='meteor'){if(T<.8){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.25;syn('boom');const n=od?11:7;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-280,280),dm,14,.13*i,zl-1,'fire')}if(T>1.6)dmEnd(e,.2);return}
  if(a=='wave'){if(T<.6){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.4;syn('boom');for(const sd of [-1,1]){dmWave(cx+sd*e.w/2,sd*270,dm,16,'fire');if(od)dmWave(cx+sd*e.w/2,sd*200,dm,16,'fire',.55)}}if(T>1.2)dmEnd(e,.1);return}
  if(a=='crown'){if(T<.7){e.pz='w';return}e.pz='s';const k=Math.floor((T-.7)/.25);if(e.n<=k&&k<5){e.n=k+1;dmPil(pc+[0,-90,90,-180,180][k],dm,15,0,'fire')}if(T>2.2)dmEnd(e,.3);return}
  dmEnd(e)}
// ---- 达贡(低空浮游):潮刃 beam(往前横扫一道水刃)· 触手鞭 lash(超长距离贴地横抽)· 潮柱 tide(主角脚下接连涌出水柱)·
//      深渊雨 rain(天上落水球,落地留下水洼)· 俯冲 dive(贴地横冲到墙,沿路留水洼)· 二阶段「深渊涨潮」:每 6 秒脚下涌一根水柱 ----
function dagStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5,by=e.gy;e.pz=null;
  if(e.act!='dive')e.y+=(by+Math.sin(GT*2.2)*6-e.y)*Math.min(1,dt*6);
  if(!e.intro){e.intro=1;banner('达贡 · 深海之神浮出了水面');bsfx('lz_growl')}
  dmOdChk(e,'深渊涨潮!水柱更多');
  if(od){e.avT-=dt;if(e.avT<=0){e.avT=6;dmPil(pc,dm,13,0,'sea')}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>200){e.mv=1;e.x=gpCl(e,e.x+e.f*72*dt)}else if(ad<90){e.mv=1;e.x=gpCl(e,e.x-e.f*48*dt)}
    if(e.cd>0)return;const Q=['beam','lash','tide','rain','dive'];if(ad<300)Q.push('lash','beam');if(od)Q.push('tide','dive');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='beam'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;syn('zap');dmHit(e,cx-e.f*30,cx+e.f*300,GY-120,20,e.f*380);for(let k=1;k<=4;k++)dmSplash(cx+e.f*k*70,GY-60,1.3)}if(T>1.15)dmEnd(e);return}
  if(a=='lash'){if(T<.55){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd&&T>=.65){e.hd=1;shake=.3;syn('slam');dmHit(e,cx,cx+e.f*340,GY-70,18,e.f*520);dmSplash(cx+e.f*320,GY-24,1.8)}if(T>1.35)dmEnd(e);return}
  if(a=='tide'){if(T<.7){e.pz='w';return}e.pz='s';const n=od?6:4,k=Math.floor((T-.7)/.35);if(e.n<=k&&k<n){e.n=k+1;dmPil(pc+(k%2?rnd(-60,60):0),dm,15,0,'sea')}if(T>.7+n*.35+.5)dmEnd(e,.3);return}
  if(a=='rain'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('proj');const n=od?13:9;for(let i=0;i<n;i++)dmMet(i==0?pc:pc+rnd(-300,300),dm,12,.12*i,zl-.5,'sea')}if(T>1.5)dmEnd(e,.2);return}
  if(a=='dive'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';e.y+=(GY-e.h+4-e.y)*Math.min(1,dt*10);const ox=e.x;e.x=gpCl(e,e.x+e.f*330*dt);const back=cx-e.f*e.w/2;
    if(!e.hd||Math.abs(back-e.lz)>70){e.hd=1;e.lz=back;dmZone(back-34,back+34,zl,dm,5,'sea')}if(!e.rh&&ov(P,e)&&hurt(22*dm,{kb:e.f*520}))e.rh=1;
    if(T>2.2||e.x==ox&&T>.7){e.rh=0;shake=.3;dmBoom(cx+e.f*e.w/2,80,dm,12,'sea');dmEnd(e,.2)}return}
  dmEnd(e)}
// ---- 摩洛克:焚祭巨斧 chop(二阶段连砍两下)· 蛮牛冲撞 charge(撞墙为止)· 焚祭之火 altar(主角脚下接连喷火柱)·
//      震地 quake(冲击波往两边推开,跳过去)· 烙印 brand(二阶段:天降火球)· 二阶段「狂怒」:走得更快 ----
function moloStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?5:3.5;e.pz=null;
  if(!e.intro){e.intro=1;banner('摩洛克 · 祭坛上的火又烧起来了');bsfx('b_moo')}
  dmOdChk(e,'狂怒!巨斧连砍两下');
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;if(ad>e.w/2+60){e.mv=1;e.x=gpCl(e,e.x+e.f*(od?60:46)*dt)}
    if(e.cd>0)return;const Q=['chop','chop','charge','altar','quake'];if(ad<e.w/2+170)Q.push('chop');if(ad>260)Q.push('charge','altar');if(od)Q.push('brand','quake');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='chop'){if(T<.8){e.pz='w';if(T<.5)e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd&&T>=.85){e.hd=1;shake=.45;syn('slam');bsfx('b_axe');dmHit(e,cx-e.f*40,cx+e.f*230,GY-170,26,e.f*520);VFX.spawn('earth-rupture',cx+e.f*150,GY,{s:2.2});dmZone(Math.min(cx+e.f*40,cx+e.f*230),Math.max(cx+e.f*40,cx+e.f*230),zl,dm,6,'fire')}
    if(T>1.45){if(od&&!e.n){e.n=1;e.at=.45;e.hd=0;return}dmEnd(e)}return}
  if(a=='charge'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';e.mv=1;const ox=e.x;e.x=gpCl(e,e.x+e.f*300*dt);if(!e.rh&&ov(P,e)&&hurt(22*dm,{kb:e.f*560}))e.rh=1;
    if(T>2.2||e.x==ox&&T>.8){e.rh=0;shake=.4;bsfx('b_stomp');dmBoom(cx+e.f*e.w/2,90,dm,12,'fire');dmZone(cx-90,cx+90,zl,dm,6,'fire');dmEnd(e,.2)}return}
  if(a=='altar'){if(T<.7){e.pz='w';return}e.pz='s';const n=od?5:3,k=Math.floor((T-.7)/.4);if(e.n<=k&&k<n){e.n=k+1;dmPil(pc,dm,16,0,'fire')}if(T>.7+n*.4+.6)dmEnd(e,.3);return}
  if(a=='quake'){if(T<.5){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;shake=.5;bsfx('b_stomp');dmBoom(cx,e.w/2+40,dm,14,'rock');for(const sd of [-1,1]){dmWave(cx+sd*e.w/2,sd*240,dm,16,'rock');if(od)dmWave(cx+sd*e.w/2,sd*240,dm,16,'rock',.45)}}if(T>1.2)dmEnd(e,.1);return}
  if(a=='brand'){if(T<.7){e.pz='w';return}e.pz='s';if(!e.hd){e.hd=1;syn('boom');for(let i=0;i<7;i++)dmMet(i==0?pc:pc+rnd(-260,260),dm,14,.15*i,zl-1,'fire')}if(T>1.6)dmEnd(e,.2);return}
  dmEnd(e)}
const DMST={baal:baalStep,dagon:dagStep,molo:moloStep};
// 首领倒下:诅咒之力(必掉 1 个,再按掉落率多掉 1 个)
function dmDrop(e){const id='cz'+dmI();if(!MISC[id])return;gdDrop(e,{k:'gc',id,n:1});if(Math.random()<.3*STK().dr*DBLK())gdDrop(e,{k:'gc',id,n:1})}

// ===== 诅咒之力:诅咒装备(用户:增益相当于精良强化石 +12;每次诅咒随机一种属性;前 6 个恶魔一阶,后 6 个二阶 = 一阶 ×1.5;每个恶魔只能诅咒自己对应的部位)=====
// 一阶数值 = 精良强化石从 +1 强化到 +12 的累计值(+1~+3 每级 EQE 精良一档,+4~+12 每级 ×EQE2):攻击 / 防御 25.5×8 = 204 · 生命 25.5×48 = 1224 · 魔力 25.5×24 = 612 · 暴击 25.5×20 = 510(8.5%)
// 闪避单独压低(用户:闪避不能堆太高):90 点 = 3%,出现几率也最低;每次诅咒在 60% ~ 100% 之间随机,新的诅咒替换旧的(可以反复刷)
const CUNM={atk:'攻击',def:'防御',hp:'生命',mp:'魔力',cr:'暴击',dg:'闪避'},CUV={atk:204,def:204,hp:1224,mp:612,cr:510,dg:90},CUW=[['atk',20],['cr',18],['def',18],['hp',18],['mp',16],['dg',10]],CUN=['','一阶','二阶'],CUK=[0,1,1.5];
function cuRoll(t){let r=Math.random()*100,k='atk';for(const [q,w] of CUW){if(r<w){k=q;break}r-=w}return {k,v:Math.max(1,Math.round(CUV[k]*rnd(.6,1)*CUK[t]))}}
const cuTxt=it=>it&&it.cu?`<span style="color:#e03131">😈 ${DMD[it.cu.d].n}之诅咒(${CUN[it.cu.t]}):${CUNM[it.cu.k]} +${it.cu.v}</span>`:'';
const cuRng=(k,t)=>Math.round(CUV[k]*.6*CUK[t])+' ~ '+Math.round(CUV[k]*CUK[t]);
function curseUse(id,sl){const i=+id.slice(2),d=DMD[i];if(!d||!(MAT[id]>0))return '';const it=EQ[sl];if(d.sl!=sl)return '「'+d.n+'」只能诅咒'+SL[d.sl][0];if(!it)return '还没有装备'+SL[sl][0];
  const t=i>=6?2:1;if(t==2&&!(it.cu&&it.cu.t>=1))return '二阶诅咒要先有一阶诅咒';
  const old=it.cu,r=cuRoll(t);it.cu={k:r.k,v:r.v,t,d:i};MAT[id]--;sfx('fuse');flash('200,30,40',.2);
  return '😈 '+SL[sl][0]+'被「'+d.n+'」诅咒了:'+CUNM[r.k]+' +'+r.v+(old?'(原来是 '+CUNM[old.k]+' +'+old.v+')':'')}
for(let i=0;i<DMOPEN;i++){const d=DMD[i];MISC['cz'+i]=[d.n+'的诅咒之力',`十二魔封印「${d.n}」掉落的诅咒能量(${i>=6?'二阶':'一阶'})。在背包里左键点它 →「诅咒${SL[d.sl][0]}」:给身上穿着的${SL[d.sl][0]}附上一条随机诅咒属性(攻击 / 暴击 / 防御 / 生命 / 魔力 / 闪避之一,强度约等于精良强化石 +12,闪避较低)。每次诅咒都会重新随机,新的替换旧的;装备的强化、锻造、属性石都不受影响。<br>一阶:${['atk','cr','def','hp','mp','dg'].map(k=>CUNM[k]+' '+cuRng(k,1)).join(' · ')}`,'',3000];MENI.P['cz'+i]=i>=6?52:51}

// ===== 恶魔选择页 st = 'dms' =====
let DMS={s:0};
const DMSX=20,DMSY=44,DMSW=96,DMSH=124,DMSG=100;
const dmsOpen=i=>i<DMOPEN&&!!DMD[i].k;
function openDms(){st='dms';msgU=0;keys.l=keys.r=0;ah=ar=0}
function dmsHit(mx,my){if(mx>582&&mx<622&&my>4&&my<32)return 'x';for(let i=0;i<12;i++){const X=DMSX+(i%6)*DMSG,Y=DMSY+Math.floor(i/6)*(DMSH+8);if(mx>=X&&mx<=X+DMSW&&my>=Y&&my<=Y+DMSH)return i}return -1}
function dmsGo(i){if(!dmsOpen(i)){say('「'+DMD[i].n+'」的封印还很牢固(尚未开放)');return}openLvSel(DM0+i-1,2)}
function dmsClick(mx,my){const h=dmsHit(mx,my);if(h=='x'){st='map';MPG=1;return}if(h>=0){DMS.s=h;dmsGo(h)}}
function dmsKey(e){const k=e.key;if(k=='Escape'){st='map';MPG=1;return}if(e.repeat)return;if(KM[k]=='l')DMS.s=(DMS.s+11)%12;else if(KM[k]=='r')DMS.s=(DMS.s+1)%12;else if(k=='ArrowUp'||k=='ArrowDown')DMS.s=(DMS.s+6)%12;else if(k=='Enter'||k==' ')dmsGo(DMS.s)}
function drawDms(){const t=performance.now()/1000,px=PUI.on(),hv=dmsHit(MX_,MY_);drawMap2(t);x.fillStyle='rgba(8,4,14,.9)';x.fillRect(0,0,VW,VH);
  if(px)PUI.ns(x,'tD1',12,8,14,9,170,4,300,26);else RR(x,170,4,300,26,13,LG(x,0,4,0,30,['#8a2828','#4a1212']),1.8);CTG('十二魔封印 · 封魔石台',320,23,14);
  if(px)PUI.ns(x,'pC',6,6,6,6,586,6,32,24);else RR(x,586,6,32,24,6,'#2a1f3c',1.4);CT('✕',602,23,14,hv=='x'?'#fff':'#ffd43b','center',0);
  CT('远古的女神用十二根封魔柱镇住了十二位魔王……如今,前三根柱子的光已经熄灭',320,39,8,'#ffc9c9','center',2,'#1a0808');
  for(let i=0;i<12;i++){const X=DMSX+(i%6)*DMSG,Y=DMSY+Math.floor(i/6)*(DMSH+8),d=DMD[i],op=dmsOpen(i),on=DMS.s==i||hv===i,cx=X+DMSW/2;
    if(px)PUI.ns(x,'pC',6,6,6,6,X,Y,DMSW,DMSH);else RR(x,X,Y,DMSW,DMSH,8,'#1e1829',1.6);
    x.save();x.beginPath();x.rect(X+4,Y+4,DMSW-8,90);x.clip();x.fillStyle=op?'#2a0f12':'#0e0b16';x.fillRect(X+4,Y+4,DMSW-8,90);
    VFX.frame(x,op?'mc-fire':'mc-blue',0,cx,Y+82,.62,1,0,(op?.45:.75)+.15*Math.sin(t*2+i),.36);  // 封印法阵(MG27 已有的召唤法阵)
    if(op){x.save();x.translate(cx,Y+92);DMN.pt(x,d.k,0,0,d.k=='dagon'?72:78,t);x.restore()}
    else{CT('?',cx,Y+56,26,'#5c5470','center',0);CT('封印中',cx,Y+86,8,'#9775fa','center',2,'#0e0b16')}x.restore();
    CT((i+1)+' · '+d.n,cx,Y+106,10,op?'#fff3bf':'#868e96','center',2.4,'#1a0808');CT(d.en+(i>=6?' · 二阶':' · 一阶'),cx,Y+117,7,op?'#ffa8a8':'#5c5f66','center',2,'#1a0808');
    if(op){const sn=starOf(DM0+i);for(let k=0;k<sn;k++)CT('★',X+12+k*9,Y+14,9,STARK[sn].c,'center',2.2,'#5a2e08');CT(SL[d.sl][0],X+DMSW-8,Y+14,8,'#ff8787','right',2,'#1a0808')}
    if(on){x.save();x.strokeStyle=DMS.s==i?'rgba(255,107,107,'+(.7+.3*Math.sin(t*6))+')':'rgba(255,230,220,.5)';x.lineWidth=DMS.s==i?3:1.5;x.strokeRect(X+1.5,Y+1.5,DMSW-3,DMSH-3);x.restore()}}
  const q=DMD[hv>=0?hv:DMS.s];if(q){const L=[];let s=q.lg;while(s.length){L.push(s.slice(0,44));s=s.slice(44)}L.slice(0,2).forEach((l,i)=>CT(l,320,320+i*12,8,'#ffe3e3','center',2,'#1a0808'))}
  CT('点击恶魔肖像挑战 · 掉落「诅咒之力」可诅咒对应部位的装备 · Esc 返回地图',320,352,8,'#fff','center',2.2,'#3a0b0b');
  if(performance.now()<msgU)CT(msg,320,300,11,'#ffe3e3','center',2.6,'#7a1f1f')}
