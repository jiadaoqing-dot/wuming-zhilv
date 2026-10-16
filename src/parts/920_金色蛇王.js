// ===== 金色蛇王 / 北极熊 / 雪球 像素形象(art_src/boss/build_kb.py):King Cobra(AntumDeluge,OGA-BY 3.0)、[LPC] polar bear(tapatilorenzo,CC-BY 4.0)、Snowball(alf0186,CC0)=====
// 第 0 行:蛇王朝东 3 帧(cw×ch,脚底 = 底边;第 1、2 帧吐信子);第 1 行:熊 20 帧(64×64,脚底在第 62 行):
//   0~4 走路右 · 5~7 攻击右(抬掌 → 拍下)· 8~11 倒地右(最后一帧趴平)· 12~15 正面站起攻击 · 16~19 正面倒地(坐下 → 跪趴);第 2 行:雪球 32×32
const KB={I:null,D:'@@A:kb_atlas@@',cw:96,ch:101,by:101,sy:165,
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  ok(){return SET.art!==0&&!!this.I},
  king(c,e,t){if(!this.ok())return false;const a=e.act,mv=(e.mvs||0)>.3,run=a=='charge'&&e.at>=.6,open=(a=='bite'||a=='spit')&&e.at>=.35&&e.at<.8;
    const i=open?2:run?Math.floor(t*14)%3:mv?Math.floor(t*6)%3:(t%2.2<.25?1:0),k=.85;
    SHD(c,0,0,46);c.save();c.scale(k,k);c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.6)';
    c.drawImage(this.I,i*this.cw,0,this.cw,this.ch,-this.cw/2-6,-this.ch,this.cw,this.ch);c.restore();
    if(e.bf>0&&!FLW){c.save();c.globalCompositeOperation='lighter';C_(c,30,-70,8,RGD(c,30,-70,8,['rgba(255,80,80,.8)','rgba(0,0,0,0)']),0);c.restore()}
    return true},
  // 北极熊:K 倍放大;状态 → 帧号(和原来矢量版的四种基本姿势一一对应)
  bear(c,e,t){if(!this.ok())return false;const a=e.act,at=e.at||0,pz=e.pz,rg=e.rage,K=1.8,mv=(e.mvs||0)>.3;let f=0,rot=0,dx=0,side=1;
    const stand=(a=='slam'&&pz=='w')||(a=='combo'&&e.n>=2&&pz=='w')||a=='roar'||a=='hug'||a=='bliz'||a=='aval'||(a=='pillars'&&pz=='w')||(a=='ball'&&pz=='w');
    if(e.gs=='belly')f=11;
    else if(e.dz>0){f=e.kn?19:18;side=0;if(!e.kn)rot=Math.sin(t*5)*.06}
    else if(stand){side=0;f=a=='hug'?(e.gs=='hold'?13:15):a=='ball'?15:(a=='roar'||a=='bliz')?(at>.4?15:14):14;if(pz=='w'&&(a=='slam'||a=='combo'))rot=Math.sin(t*40)*.02}
    else{const pawA=a=='paw'||a=='combo';
      if(pawA&&pz=='w')f=6;else if((pawA||a=='slam')&&pz=='s'){f=7;dx=4}
      else if(a=='charge'&&pz=='w'){f=5;rot=-.06}
      else if(a=='charge'&&at>=.9){f=Math.floor(t*16)%5;rot=.06}
      else if(mv)f=Math.floor(t*9)%5}
    SHD(c,0,0,side?54:40);c.save();c.translate(dx,0);if(rot)c.rotate(rot);c.scale(K,K);c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.6)';
    c.drawImage(this.I,f*64,this.by,64,64,-32,-62,64,64);c.restore();
    // 头的位置(放大后的局部坐标):侧面在右前方,正面在正中
    const hx=side?(f==11?28:f==7?44:46):0,hy=side?(f==11?-26:-70):(f>=16?-50:-92);
    if(a=='ball'&&pz=='w')this.ball(c,0,hy-30,1.3,0);
    if(e.gs=='belly'){c.save();c.globalAlpha=.6;for(let i=0;i<3;i++)LN_(c,[[-70-i*10,-8-i*6],[-96-i*10,-8-i*6]],'#fff',1.6);c.restore()}
    if(e.dz>0&&e.kn)CT('💦',30,-70,12,'#74c0fc','center',0);
    if((a=='roar'||a=='bliz')&&at>.4){c.save();c.globalAlpha=.6;for(let i=0;i<3;i++){c.beginPath();c.arc(hx+16,hy+10,14+i*10+(t*40%10),-.7,.7);c.strokeStyle='#e7f5ff';c.lineWidth=2;c.stroke()}c.restore()}
    if(a=='hug'&&pz=='w'&&!e.gs)WARN(c,8,-148,1.2);
    if(rg&&!FLW){c.save();c.globalCompositeOperation='lighter';C_(c,hx+(side?6:0),hy,9,RGD(c,hx+(side?6:0),hy,9,['rgba(255,70,70,.7)','rgba(0,0,0,0)']),0);c.restore()}
    return true},
  // 雪球:直径约 2r,旋转
  ball(c,bx,by,s,rot){if(!this.ok())return false;c.save();c.translate(Math.round(bx),Math.round(by));if(rot)c.rotate(rot);c.scale(s,s);c.imageSmoothingEnabled=false;c.drawImage(this.I,0,this.sy,32,32,-16,-16,32,32);c.restore();return true}};
KB.init();

