// ===== 第四十一轮:第十二关「永夜王城」(第二张地图「暗黑大陆」左边的冰晶雪台(用户截图指定),cur = 15)=====
// 图集 CST(art_src/castle/build_castle.py,全部 CC0):场景 Old Dark Castle Interior(ansimuz)· 首领 夜王 Medieval King Pack 2 · 精英 夜巫 EVil Wizard 2 ·
//   小怪 骷髅卫兵 skw / 哥布林投弹手 gob(Monsters Creatures Fantasy,三个都是 LuizMelo)
// 数值约 = 第十一关 ×1.15(LM 23 · MHK 74 · BHN 12400 · BDF 42);掉落沿用第十一关(机械系列、合成添加剂 30%)
// 首领招式:王者三连斩 cmb(往前踏步两刀)· 王座突进 dash(冲过场地)· 跃空斩 leap(跳到主角头上砸地 + 两道冲击波)·
//   王威震慑 roar(群控):举剑蓄力 1.4 秒(身上金光越来越亮)→ 300 像素内的主角直接眩晕 1 秒,正在放的技能被打断(无敌也挡不住);
//   蓄力期间受到最大生命 5% 的伤害就被打断,首领自己愣住 1.5 秒(用户:技能也会被中途打断)。半血以下二阶段:动作快 20%,震慑更频繁
const PL15=[{x:0,y:GY,w:WW},{x:340,y:224,w:96},{x:640,y:206,w:128},{x:1000,y:220,w:96},{x:1360,y:200,w:128},{x:1740,y:222,w:96},{x:2120,y:206,w:128},{x:2450,y:222,w:96}];
const E15=[['skw',360],['skw',480],['gob',640],['nwz',860],['skw',1040],['gob',1180],['skw',1300],['nwz',1520],['gob',1680],['skw',1820],['skw',1960],['nwz',2140],['gob',2260],['skw',2380],['nwz',2520]];
const CST={I:null,D:'@@A:cst_atlas@@',M:{"bg":[0,0,960,304],"wz_idle":[0,305,1368,156,171,8],"wz_run":[0,462,1368,156,171,8],"wz_attack1":[0,619,1368,156,171,8],"wz_attack2":[0,776,1368,156,171,8],"wz_hurt":[1369,776,513,156,171,3],"wz_death":[0,933,1197,156,171,7],"kg_idle":[0,1090,1160,105,145,8],"kg_run":[0,1196,1160,105,145,8],"kg_attack1":[1161,1196,580,105,145,4],"kg_attack2":[0,1302,580,105,145,4],"kg_attack3":[581,1302,580,105,145,4],"kg_takehit":[1162,1302,580,105,145,4],"kg_death":[0,1408,870,105,145,6],"kg_jump":[871,1408,290,105,145,2],"kg_fall":[1162,1408,290,105,145,2],"gnd":[1453,1408,256,64],"bomb_f":[0,1514,1064,64,56,19],"skl_idle":[1065,1514,400,61,100,4],"skl_walk":[1466,1514,400,61,100,4],"skl_attack":[0,1579,800,61,100,8],"skl_shield":[801,1579,400,61,100,4],"skl_hurt":[1202,1579,400,61,100,4],"skl_death":[1603,1579,400,61,100,4],"gob_idle":[0,1641,360,48,90,4],"gob_run":[361,1641,720,48,90,8],"gob_attack":[1082,1641,720,48,90,8],"gob_throw":[0,1690,1080,48,90,12],"gob_hurt":[1081,1690,360,48,90,4],"gob_death":[1442,1690,360,48,90,4],"plat":[1803,1690,48,24]},
  // 帧里身体的位置:[身体中心 x, 身体高, 脚底 y](build_castle.py 按待机第 0 帧算)
  A:{kg:[64.5,54,104],wz:[63.5,95,142],skl:[33.5,51,58],gob:[44.5,36,47],bomb:[27.5,14,43]},
  P:{skw:'skl',gob:'gob',nwz:'wz',nk:'kg'},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&!!this.P[e.k]},
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;const fw=m[4]||m[2],n=m[5]||1;i=((Math.floor(i)%n)+n)%n;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(fw*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],0,0,fw*s,m[3]*s);c.restore()},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右);素材本来就朝右
  draw(c,e,t){const k=e.k,p=this.P[k],A=this.A[p],H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),s=H/A[1];let row=p+'_idle',fi=t*8+(e.ph||0)*3;c.save();if(FLW)c.filter='brightness(2.6)';
    if(k=='nk'){const a=e.act,T=e.at||0;fi=t*8;
      if(a=='cmb'){if(T<.45){row='kg_attack1';fi=Math.min(1,T/.25)}else if(T<.8){row='kg_attack1';fi=2+Math.min(1,(T-.45)/.15)}else{row='kg_attack2';fi=Math.min(3,(T-.8)/.1)}}
      else if(a=='dash'){if(T<.5){row='kg_attack3';fi=0}else if(T<1.1){row='kg_run';fi=t*16}else{row='kg_attack3';fi=Math.min(3,1+(T-1.1)/.1)}}
      else if(a=='leap'){if(T<.5){row='kg_jump';fi=0}else if(!e.hd){row=e.y<e.gy-60?'kg_jump':'kg_fall';fi=t*8}else{row='kg_attack3';fi=Math.min(3,2+(T-e.lt)/.12)}}
      else if(a=='roar'){row=T<1.4?'kg_attack1':'kg_attack2';fi=T<1.4?1:3;if(T<1.4&&!FLW){const k_=Math.min(1,T/1.4);c.filter='brightness('+(1+k_*.9)+') sepia('+k_*.6+')'}}
      else if(e.daze>0){row='kg_takehit';fi=1}
      else if(e.st>0){row='kg_takehit';fi=t*10}else if(e.mv){row='kg_run';fi=t*12}}
    else{const st=e.s;
      if(k=='skw'){if(st=='sw'){row='skl_attack';fi=Math.min(3,e.t/.12)}else if(st=='sl'){row='skl_attack';fi=4+Math.min(3,e.t/.06)}else if(st=='shd'){row='skl_shield';fi=Math.min(3,e.t/.1)}}
      else if(k=='gob'){if(st=='aim'){row='gob_throw';fi=Math.min(6,e.t/.08)}else if(st=='thr'){row='gob_throw';fi=7+Math.min(4,e.t/.06)}else if(st=='stw'){row='gob_attack';fi=Math.min(3,e.t/.1)}else if(st=='stb'){row='gob_attack';fi=4+Math.min(3,e.t/.06)}}
      else if(k=='nwz'){if(st=='cw'||st=='ww'){row=st=='cw'?'wz_attack1':'wz_attack2';fi=Math.min(3,e.t/.15)}else if(st=='cs'||st=='ws'){row=st=='cs'?'wz_attack1':'wz_attack2';fi=4+Math.min(3,e.t/.07)}}
      if(row==p+'_idle'){if(e.st>0){row=p+'_hurt';fi=0}else if(e.mv){row=p+(p=='skl'?'_walk':'_run');fi=t*10}}}
    this.fr(c,row,fi,-A[0]*s,-A[2]*s,s,1);c.restore()},
  // 场景:城堡大厅背景(视差)+ 青苔石柱地面 + 浮空小石块
  bg(){x.fillStyle='#0f1f2a';x.fillRect(0,0,VW,VH);const I=this.I,M=this.M;if(!I)return;x.imageSmoothingEnabled=false;
    {const m=M.bg,sc=1.2,w=m[2]*sc,h=m[3]*sc;for(let px=-(((cam*.3)%w)+w)%w;px<VW;px+=w)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),Math.round(GY+14-h),Math.ceil(w),h)}
    {const m=M.gnd;for(let px=Math.floor((cam-4)/m[2])*m[2];px<cam+VW+4;px+=m[2])x.drawImage(I,m[0],m[1],m[2],m[3],Math.round(px-cam),GY-6,m[2],m[3])}
    for(const p of PL)if(p.y<GY&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20){const m=M.plat,px=Math.round(p.x-cam),y=Math.round(p.y-3),w=Math.round(p.w);
      x.drawImage(I,m[0],m[1],16,24,px,y,16,24);for(let q=16;q<w-16;q+=16){const c=Math.min(16,w-16-q);x.drawImage(I,m[0]+16,m[1],c,24,px+q,y,c,24)}x.drawImage(I,m[0]+32,m[1],16,24,px+w-16,y,16,24)}},
  over(){x.fillStyle='rgba(60,30,90,.07)';x.fillRect(0,0,VW,VH)}};
CST.init();
