// ===== 第五关 · 噬沙荒漠 =====
// ===== 第十七轮(2026-10-13):第五关首领「沙渊古神」/ 第七关首领「血月巫王」(代替沙暴巨蜥 / 银色狼人)=====
// 图集 ARS(art_src/boss/build_ars.py):Bosses and monsters spritesheets (Ars Notoria)(Balmer,原画 Stephen Challener / Redshrike,CC-BY 3.0)
// M:名字 → [y, 帧宽, 帧高, 帧数],帧横排。andr / andrR 古神(0~15 待机,16~19 睁眼,20~23 睁眼待机;R = 狂暴赤红);
// tenS / tenB 触手(0~7 冒头,8~15 钻出,16~23 摇摆;S 沙 / B 血);gysS / gysB 液柱(0~7 升起,8~15 喷涌,16~23 落下);
// wiz1~3 巫王三形态;fbB / fbS 冰焰球 / 沙焰球;orb 红色法球;imp 触灵
const ARS={D:'@@A:ars_atlas@@',I:null,M:{"andr":[0,57,88,24],"andrR":[88,57,88,24],"tenS":[176,25,90,24],"tenB":[266,25,90,24],"gysS":[356,14,67,24],"gysB":[423,14,67,24],"wiz1":[490,85,94,8],"wiz2":[584,122,110,8],"wiz3":[694,87,110,8],"fbB":[804,32,32,4],"fbS":[836,32,32,4],"orb":[868,13,13,5],"imp":[881,45,66,6]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  // 画一帧:底边中点在 (px,py),s 放大,f 朝向,a 透明度
  fr(c,n,i,px,py,s,f,a){const m=this.M[n];if(!this.I||!m)return;i=((Math.floor(i)%m[3])+m[3])%m[3];c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;
    c.translate(Math.round(px),Math.round(py));c.scale((f||1)*s,s);c.drawImage(this.I,i*m[1],m[0],m[1],m[2],-m[1]/2,-m[2],m[1],m[2]);c.restore()},
  // 首领本体(c 已经平移到脚底、按朝向翻转、放大 1.1 × 体型):悬浮上下浮动;力竭时落地、动作变慢
  boss(c,e,t){if(!this.I)return;const dz=e.dz>0,by=dz?-2:-8-Math.sin(t*2.2)*3;c.save();c.scale(1/1.1,1/1.1);
    if(e.k=='andr'){if(e.ug){c.restore();return}const sk=e.sk||0;SHD(c,0,0,28*(1-sk));if(sk>0){c.beginPath();c.rect(-120,-300,240,300);c.clip()}
      const i=e.eyeT==null?Math.floor(t*(dz?3:8))%16:e.eyeT<.6?16+Math.floor(e.eyeT/.15):20+Math.floor(t*(dz?3:7))%4;
      if(FLW)c.filter='brightness(2.6)';this.fr(c,e.p3?'andrR':'andr',i,0,by+sk*130+(dz?12:0),1,1)}
    else{SHD(c,0,0,30);const fr=Math.floor(t*(dz?3:8))%8,a=e.al==null?1:Math.max(0,e.al);if(FLW)c.filter='brightness(2.6)';
      if(e.mo>0){const fl=Math.sin(t*50)>0;this.fr(c,'wiz'+e.fm,fr,0,by,1,1,a*(1-e.mo)*(fl?1:.35));this.fr(c,'wiz'+e.nf,fr,0,by,1,1,a*e.mo*(fl?.35:1))}  // 变身:新旧形态交替闪烁
      else this.fr(c,'wiz'+e.fm,fr,0,by,1,1,a)}
    c.restore()},
  // 飞弹:17 沙焰球 / 18 冰焰球(火焰尾巴朝飞行的反方向)/ 19 红色法球
  shot(f,fx,fy,t){if(!this.I||f.c<17||f.c>19)return false;const s=f.s||1;
    if(f.c==19){this.fr(x,'orb',t*12+f.x*.1,fx,fy+6.5*s,s,1);return true}
    x.save();x.translate(Math.round(fx),Math.round(fy));x.rotate(Math.atan2(f.vy,f.vx)-Math.PI/2);this.fr(x,f.c==17?'fbS':'fbB',t*12+f.x*.05,0,8*s,s,1);x.restore();return true}};
ARS.init();
function arsEnd(e,cd){e.act=null;e.sg=null;e.pz=null;e.n=0;e.al=1;e.cd=cd!=null?cd:e.k=='wiz'?[1.15,.9,.7][e.fm-1]:e.p3?.75:e.p2?.95:1.2}
// 地面招式(e.T):ten 触手 / gys 液柱 / ice 冰晶。wt 预警秒数,c 'S' 沙 / 'B' 血,dm 伤害倍数,up 击飞速度,kb 击退,sd 沙尘迷眼,sl 减速,wd 液柱宽度(一格画几根)
function arsTen(e,px,wt,o){e.T.push(Object.assign({k:'ten',x:px,t:0,wt,c:'S',dm:16,hold:.5,f:1},o||{}))}
function arsGys(e,px,wt,o){e.T.push(Object.assign({k:'gys',x:px,t:0,wt,c:'S',dm:13},o||{}))}
const ARSD={ten:[.5,12,84,0,.3],gys:[.9,11,90,.2,.65],ice:[.45,11,52,0,.3]};  // [收尾时长, 半宽, 高, 判定开始, 判定结束]
function arsHz(e,dt){
  for(const h of e.T){h.t+=dt;const u=h.t-h.wt,D=ARSD[h.k];if(u<0)continue;
    if(!h.fx){h.fx=1;VFX.spawn(h.k=='ice'?'frost-nova':'landing-dust',h.x,GY-2,{s:h.k=='ice'?.5:.8});if(h.k=='ten')shake=Math.max(shake,.1)}
    const hw=h.wd?h.wd/2:D[1];
    if(u>=D[3]&&u<D[4]&&!h.hit&&ov(P,{x:h.x-hw,y:GY-D[2],w:2*hw,h:D[2]})){h.hit=1;if(hurt(h.dm*e.dm,{kb:sgn(P.x+12-h.x)*(h.kb||200)})){if(h.up)P.vy=-h.up;if(h.sd)sandP(h.sd);if(h.sl)slowP(h.sl)}}}
  e.T=e.T.filter(h=>h.t<h.wt+ARSD[h.k][0]+(h.k=='ten'?h.hold:0));
  for(const z of e.Z)z.t+=dt;e.Z=e.Z.filter(z=>z.t<z.wt);
  for(const r of e.R)r.t+=dt;for(const r of e.R.filter(r=>r.t>=0))F.push({x:r.x,y:-30,vx:0,vy:520,ng:1,c:18,s:1.3,sn:1,dmg:13*e.dm});e.R=e.R.filter(r=>r.t<0)}
function arsHzDraw(e){const t=performance.now()/1000;
  for(const h of e.T){const u=h.t-h.wt,sx=h.x-cam,hw=h.wd?h.wd/2:h.k=='ten'?16:12;if(sx<-80||sx>VW+80)continue;
    if(u<0){DZ.zone(sx-hw,2*hw);continue}
    if(h.k=='ten'){const H=h.hold,i=u<.25?8+u/.25*8:u<.25+H?16+(t*10+h.x)%8:15-(u-.25-H)/.25*8;ARS.fr(x,'ten'+h.c,Math.max(8,Math.min(23,i)),sx,GY+4,1,h.f)}
    else if(h.k=='gys'){const i=u<.2?u/.2*8:u<.65?8+(t*14)%8:16+Math.min(7,(u-.65)/.25*8),n=h.wd?Math.max(1,Math.round(h.wd/19)):1;for(let k=0;k<n;k++)ARS.fr(x,'gys'+h.c,i+k*3,sx+(k-(n-1)/2)*19,GY+4,1.4,k%2?-1:1)}
    else{const fi=Math.min(3,Math.floor(u*12)),fa=Math.max(0,1-Math.max(0,u-.25)/.2);for(let k=0;k<3;k++)VFX.frame(x,'i-cry'+k,fi,sx+(k-1)*9,GY+2,1+(k%2)*.3,1,0,fa)}}
  for(const z of e.Z)if(z.t>=0)DZ.zone(z.x-z.w/2-cam,z.w)}
