// ===== 铁角牛魔像素形象(第一关首领):Animated Minotaur(Calciumtrice,CC-BY 3.0),art_src/boss/build_mnt.py 生成 =====
// 144×144 一格,脚底中心 (72,144),面朝右;行 0 待机 · 1 示威(刨地)· 2 走路 / 冲撞 · 3 挥锤 · 4 倒下(各 10 帧)
const MNT={I:null,D:'@@A:mnt_atlas@@',C:144,
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&e.k=='boss'},
  fr(e,now){const a=e.act,at=e.at||0;
    if(e.st>0)return [4,1+Math.floor(now*6)%2];
    if(a=='slam')return [3,at<.7?Math.floor(at/.7*6):at<.9?6+Math.floor((at-.7)/.2*3):9];
    if(a=='charge')return at<.8?[1,Math.floor(at/.8*10)]:[2,Math.floor(now*18)%10];
    if(a=='leap')return at<.5?[1,2]:at<1.2?[3,5]:[3,Math.min(9,7+Math.floor((at-1.2)/.1))];
    if(a=='roar')return [1,Math.floor(now*10)%10];if(a=='stomp')return at%.6<.4?[2,Math.floor(now*12)%10]:[3,8];  // 第十六轮:怒吼用示威行,践踏用走路行 + 砸下帧
    if(e.dg>0)return [3,5];
    return e.mvs>.4?[2,Math.floor(now*10)%10]:[0,Math.floor(now*8)%10]},
  draw(c,e,t){const now=performance.now()/1000,[r,i]=this.fr(e,now),C=this.C;
    c.save();c.scale(1/1.1,1/1.1);c.imageSmoothingEnabled=false;SHD(c,0,0,40);
    if(FLW)c.filter='brightness(2.6)';else if(e.hp<e.max/2)c.filter='saturate(1.5) brightness(1.05)';
    c.drawImage(this.I,i*C,r*C,C,C,-72,-144,C,C);c.restore()}};
MNT.init();
// ===== 面具法师 / 黑棘巨蝎 像素形象(第十七轮:银色狼人、沙暴巨蜥换成 ARS 的沙渊古神、血月巫王,bos_atlas 已删)=====
const BOS={
  MD:'@@A:mage_atlas@@',SD:'@@A:scob_atlas@@',SW:101,SH:70,
  // 黑棘巨蝎(Scorpy Scorp 原尺寸 + 暗紫红):走路 4 帧;钳击 / 毒针 / 扫尾 用攻击 3 帧(前摇停在第 0 帧抖动,出手第 2 帧前冲)
  scob(c,e,t){if(!this.SI)return false;const a0=e.act,a=a0=='combo'?e.cact:a0,at=a0=='combo'?e.cat:e.at;let row=0,i=0,dx=0,rot=0;  // 第十六轮:连段按当前那一下的动作画
    const w=a&&MWUP.sco[a];if(a&&w){row=1;if(at<w[0]){i=0;rot=Math.sin(t*40)*.02}else if(at<w[1]){i=2;dx=a=='claw'?10:4}else i=1}
    else if(a=='buff'){row=1;i=0}else if((e.mvs||0)>.3){i=Math.floor(t*8)%4}
    c.save();c.scale(1/1.1,1/1.1);SHD(c,0,0,52);c.translate(dx,0);if(rot)c.rotate(rot);c.scale(-1,1);c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.6)';
    c.drawImage(this.SI,i*this.SW,row*this.SH,this.SW,this.SH,-this.SW/2,-this.SH,this.SW,this.SH);c.restore();return true},
  ok(){return SET.art!==0&&!!(this.MI||this.SI)},
  init(){const m=new Image();m.onload=()=>{this.MI=m};m.src=this.MD;const q=new Image();q.onload=()=>{this.SI=q};q.src=this.SD},
  // 面具法师(ULPC 图层合成):待机 2 帧 / 施法 7 帧(前摇时按进度)/ 受击 2 帧;悬浮、紫色光晕、瞬移时透明
  mage(c,e,t){if(!this.MI)return false;c.save();c.globalAlpha=e.al==null?1:Math.max(.08,e.al);
    c.save();c.globalCompositeOperation='lighter';E_(c,0,-30,24,34,RGD(c,0,-30,34,['rgba(150,90,255,.3)','rgba(150,90,255,0)']),0);c.restore();
    const cast=e.fire<.55&&!(e.tpT>0);let row=0,i=Math.floor(t*2.5)%2;
    if(e.st>0&&!cast){row=2;i=Math.floor(t*8)%2}else if(cast){row=1;i=Math.min(6,Math.floor((.55-e.fire)/.55*7))}
    c.scale(1.3/1.1,1.3/1.1);c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.6)';c.drawImage(this.MI,i*64,row*64,64,64,-32,-63,64,64);c.filter='none';
    if(cast){c.globalCompositeOperation='lighter';c.filter='none';const g=Math.min(1,(.55-e.fire)/.4);C_(c,14,-40,10*g+2,RGD(c,14,-40,10*g+2,['rgba(229,153,247,.95)','rgba(0,0,0,0)']),0)}
    c.restore();return true}};
BOS.init();
