// ===== LPC 主角(像素美术第 5 步):Universal LPC Spritesheet Character Generator 的分层素材 =====
// 图集 LPC.AD:每个子图层一行(64 高),66 帧 × 64 宽,只取朝右那一行;LPC.META:动画表 / 图层表(行号、zPos、有哪些动画)
// 按装备系列 / 形态 / 时装选图层(keys),按 zPos 叠成整条动画并缓存(look);主角朝右,朝左水平翻转;脚底在格子第 62 行
// 某个图层缺某个动画:披风等用替代动画的帧顶上(FBK);长裙 / 和服缺跑、跳时,整个角色改用走路动画(nos)
// =====================================================================
const LPC={I:null,M:null,S:{},LK:{},
  AD:'@@A:lpc_atlas@@',META:{"anims":[["idle",0,2],["walk",2,9],["run",11,8],["jump",19,5],["slash",24,6],["backslash",30,13],["halfslash",43,6],["thrust",49,8],["spellcast",57,7],["combat_idle",64,2]],"nf":66,"layers":{"body":{"row":0,"z":10,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"body/body.json"},"head":{"row":1,"z":100,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"head/heads/human/heads_human_male.json"},"hair0":{"row":2,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/spiky/hair_spiked.json"},"hair1":{"row":3,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/spiky/hair_spiked.json"},"hair2":{"row":4,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/spiky/hair_spiked.json"},"hairX":{"row":5,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/spiky/hair_spiked.json"},"hairP#0":{"row":6,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/braids/hair_high_ponytail.json"},"hairP#1":{"row":7,"z":9,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/braids/hair_high_ponytail.json"},"shirt_navy":{"row":8,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_forest":{"row":9,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_maroon":{"row":10,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_white":{"row":11,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_blue":{"row":12,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_green":{"row":13,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_orange":{"row":14,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"shirt_black":{"row":15,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"pants_navy":{"row":16,"z":20,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"legs/pants/legs_pants.json"},"pants_forest":{"row":17,"z":20,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"legs/pants/legs_pants.json"},"pants_tan":{"row":18,"z":20,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"legs/pants/legs_pants.json"},"skirt_blue":{"row":19,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"skirt_forest":{"row":20,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"skirt_maroon":{"row":21,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"skirt_white":{"row":22,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"skirt_black":{"row":23,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"boots_brown":{"row":24,"z":25,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"feet/boots/feet_boots_basic.json"},"boots_black":{"row":25,"z":25,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"feet/boots/feet_boots_basic.json"},"boots_white":{"row":26,"z":25,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"feet/boots/feet_boots_basic.json"},"plate":{"row":27,"z":60,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/armour/torso_armour_plate.json"},"leather":{"row":28,"z":60,"has":["idle","walk","run","jump","slash","thrust","spellcast"],"def":"torso/armour/torso_armour_leather.json"},"legion":{"row":29,"z":60,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/armour/torso_armour_legion.json"},"helm0":{"row":30,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/helmets/helmets/hat_helmet_barbuta.json"},"helm1":{"row":31,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/coverings/hoods/hat_hood_cloth.json"},"helm2":{"row":32,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/helmets/helmets/hat_helmet_legion.json"},"hat_black":{"row":33,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/hats/magic/hat_magic_celestial.json"},"cape#0":{"row":34,"z":85,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"cape#1":{"row":35,"z":5,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"hair3":{"row":36,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/spiky/hair_spiked.json"},"pants_white":{"row":37,"z":20,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"legs/pants/legs_pants.json"},"chain":{"row":38,"z":50,"has":["idle","walk","run","jump","slash","thrust","spellcast"],"def":"torso/torso_chainmail.json"},"tabard_sky":{"row":39,"z":55,"has":["walk","slash","thrust","spellcast"],"def":"torso/jacket/torso_jacket_tabard.json"},"tabard_forest":{"row":40,"z":55,"has":["walk","slash","thrust","spellcast"],"def":"torso/jacket/torso_jacket_tabard.json"},"helm3":{"row":41,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/helmets/helmets/hat_helmet_spangenhelm_viking.json"},"cape_navy#0":{"row":42,"z":85,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"cape_navy#1":{"row":43,"z":5,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"cape_sky#0":{"row":44,"z":85,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"cape_sky#1":{"row":45,"z":5,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"hood_navy":{"row":46,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/coverings/hoods/hat_hood_cloth.json"},"capf_forest":{"row":47,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/hats/caps/hat_cap_leather.json"},"feather":{"row":48,"z":131,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/hats/caps/hat_cap_leather_feather.json"},"hatm_maroon":{"row":49,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/hats/magic/hat_magic_celestial_moon.json"},"hat_sky":{"row":50,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/hats/magic/hat_magic_celestial.json"},"sash_orange":{"row":51,"z":65,"has":["walk","slash","thrust","spellcast"],"def":"torso/waist/belt_sash.json"},"kimono":{"row":52,"z":30,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/dresses/kimono/dress_kimono.json"},"kimono2#0":{"row":53,"z":31,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/dresses/kimono/dress_kimono_oversize.json"},"obi":{"row":54,"z":65,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/waist/obi/belt_obi.json"},"plate_cu":{"row":55,"z":60,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/armour/torso_armour_plate.json"},"legs_cu":{"row":56,"z":20,"has":["idle","walk","jump","slash","thrust","spellcast"],"def":"legs/legs_armour.json"},"legs_fe":{"row":57,"z":20,"has":["idle","walk","jump","slash","thrust","spellcast"],"def":"legs/legs_armour.json"},"helm4":{"row":58,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/helmets/helmets/hat_helmet_xeon.json"},"helm5":{"row":59,"z":130,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"headwear/helmets/helmets/hat_helmet_xeon.json"},"body_f":{"row":60,"z":10,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"body/body.json"},"head_f":{"row":61,"z":100,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"head/heads/human/heads_human_female.json"},"hair_f#0":{"row":62,"z":120,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/braids/hair_high_ponytail.json"},"hair_f#1":{"row":63,"z":9,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"hair/braids/hair_high_ponytail.json"},"shirt_f":{"row":64,"z":35,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"torso/shirts/longsleeve/torso_clothes_longsleeve2.json"},"skirt_f":{"row":65,"z":20,"has":["idle","walk","slash","thrust","spellcast"],"def":"legs/skirts/legs_skirts_plain.json"},"boots_f":{"row":66,"z":25,"has":["idle","walk","run","jump","slash","backslash","halfslash","thrust","spellcast","combat_idle"],"def":"feet/boots/feet_boots_basic.json"},"cape_f#0":{"row":67,"z":85,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"},"cape_f#1":{"row":68,"z":5,"has":["idle","walk","slash","thrust","spellcast"],"def":"torso/cape/cape_solid.json"}}},
  FBK:{run:'walk',jump:'walk',backslash:'slash',halfslash:'thrust',combat_idle:'idle',idle:'walk'},  // 第十八轮:罩袍 / 腰带没有待机帧,用走路帧顶上
  init(){this.M=this.META;for(const [a,s,n] of this.M.anims)this.S[a]=[s,n];const im=new Image();im.onload=()=>{this.I=im};im.src=this.AD;
    this.HA=[];for(const [a,L] of Object.entries(this.HAT)){const s=this.S[a][0];L.forEach((p,i)=>this.HA[s+i]=p)}
    this.HB={};for(const [a,i] of [['walk',1],['walk',2]])this.HB[this.S[a][0]+i]=1},
  ready(){return SET.art!==0&&!!this.I},
  heroOn(L){return this.ready()&&(st=='town'||st=='play')},
  cloneOn(){return this.ready()},
  tier(){return PXA.tier()},
  ser(k){const it=EQ[k];return it?Math.min(4,it.g||0):-1},  // 第四十一轮:机械系列(4)有自己的外观
  exp(k){const L=this.M.layers;return L[k]?[k]:Object.keys(L).filter(x=>x.startsWith(k+'#'))},
  // 选图层:时装优先;剑士 = 衬衣 + 裤子 (+ 铠甲 + 红披风)(+ 头盔);法师 = 衬衣 + 长裙当法袍 (+ 星月帽);发色跟头部装备的系列
  keys(m,lk){const hg=this.ser('head'),bg=this.ser('body');let K=['body','head'];
    if(lk=='can')K=['body_f','head_f','hair_f','shirt_f','skirt_f','boots_f','cape_f'];  // 第四十六轮:人造人·灿灿一号(女性体型图层)
    else if(lk=='fh')K.push('hairP','kimono','kimono2','obi','boots_white');
    else if(lk=='xy')K.push('hairX','shirt_black','skirt_black','boots_black','cape','hat_black');
    else{K.push('hair'+Math.min(3,Math.max(0,hg)),'boots_brown');
      // 第十八轮:四个系列各自的外观 —— 剑士 板甲 + 桶盔 / 皮甲 + 兜帽 / 军团甲 + 军团盔 / 锁子甲 + 罩袍 + 维京盔;法师 兜帽 / 羽毛皮帽 + 罩袍 / 天月帽 + 腰带 / 星月帽 + 披风
      if(m=='sword'){K.push('shirt_'+(bg<0?'blue':['navy','forest','maroon','navy','black'][bg]),'pants_'+(bg<0?'navy':['navy','forest','tan','white','navy'][bg]));if(bg>=0)K.push(...[['plate','cape'],['leather','cape'],['legion','cape'],['chain','tabard_sky','cape_navy'],['plate_cu','legs_cu']][bg]);if(hg>=0)K.push('helm'+hg)}
      else{K.push('shirt_'+(bg<0?'white':['blue','green','orange','white','black'][bg]),'skirt_'+(bg<0?'white':['blue','forest','maroon','white','black'][bg]));if(bg>0)K.push(['','tabard_forest','sash_orange','cape_sky','plate_cu'][bg]);if(hg>=0)K.push(...[['hood_navy'],['capf_forest','feather'],['hatm_maroon'],['hat_sky'],['helm5']][hg])}}
    return K.flatMap(k=>this.exp(k)).sort((a,b)=>this.M.layers[a].z-this.M.layers[b].z)},
  // 合成整条动画(缓存):返回 {cv, nos};nos[动画]=1 表示这一身衣服缺这个动画,整个角色改用替代动画
  look(m,lk){m=m||P.mode;if(lk===undefined)lk=heroLook().look||'';const tier=this.tier(),K=this.keys(m,lk),key=m+'|'+lk+'|'+K.join(',')+'|'+tier;if(this.LK[key])return this.LK[key];
    const NF=this.M.nf,W=NF*64,cv=document.createElement('canvas');cv.width=W;cv.height=64;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const nos={};
    for(const k of K){const Ly=this.M.layers[k],whole=/^(skirt|kimono)/.test(k);
      for(const [a,s,n] of this.M.anims){if(Ly.has.includes(a)){c.drawImage(this.I,s*64,Ly.row*64,n*64,64,s*64,0,n*64,64);continue}
        if(whole)nos[a]=1;const b=this.FBK[a];if(!b||!Ly.has.includes(b))continue;const [s2,n2]=this.S[b];
        for(let i=0;i<n;i++){const j=Math.min(n2-1,Math.floor(i*n2/n));c.drawImage(this.I,(s2+j)*64,Ly.row*64,64,64,(s+i)*64,0,64,64)}}}
    let out=cv;
    if(tier>=1){const tmp=document.createElement('canvas');tmp.width=W;tmp.height=64;const tc=tmp.getContext('2d');tc.drawImage(cv,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle=TR[tier][1];tc.fillRect(0,0,W,64);
      out=document.createElement('canvas');out.width=W;out.height=64;const oc=out.getContext('2d');oc.imageSmoothingEnabled=false;oc.globalAlpha=.9;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])oc.drawImage(tmp,dx,dy);oc.globalAlpha=1;oc.drawImage(cv,0,0)}
    return this.LK[key]={cv:out,nos}},
  // 动画 a 的第 i 帧 → 图集里的全局帧号(缺动画时换成替代动画的对应帧)
  fr(a,i,lo){let [s,n]=this.S[a];if(lo&&lo.nos[a]){const b=this.FBK[a],[s2,n2]=this.S[b];return s2+Math.min(n2-1,Math.max(0,Math.floor(i*n2/n)))}return s+Math.min(n-1,Math.max(0,i|0))},
  pr(a,p){return [a,Math.floor(Math.min(.999,Math.max(0,p))*this.S[a][1])]},
  // 游戏状态 → [动画, 帧]。SF=1 表示这一帧临时水平翻转(疾风踏斩盘旋时转身)
  hf(tm){const air=!P.gr,mv=Math.abs(P.vx)>1,k=P.sk,m=P.mode;this.SF=0;
    if(P.stun>0)return air?['jump',4]:['jump',1];
    if(k){const id=k.id,t=k.t;
      if(id=='tw'){if(t<.16)return ['halfslash',3];if(t<.62){this.SF=Math.floor(t/.06)%2;return ['backslash',6+Math.floor(t*30)%4]}if(t<1.1)return this.pr('slash',((t-.62)/.24)%1);if(t<1.32)return ['jump',3];return t<1.45?['slash',5]:['combat_idle',0]}
      if(id=='ls')return k.n<30?(k.n%2?['slash',3+k.n%3]:['backslash',6+k.n%4]):['slash',5];
      if(id=='yr'){if(t<.4)return ['combat_idle',0];if(t<.62)return this.pr('slash',(t-.4)/.22);if(t<1.2)return ['halfslash',3];if(t<1.35)return ['combat_idle',1];return this.pr('slash',(t-1.35)/.2)}
      if(id=='slam'||id=='slam2'||id=='smash')return this.pr('slash',t/.4);
      if(id=='up')return this.pr('backslash',.4+t/.3*.6);
      if(id=='dash'||id=='rstab')return this.pr('halfslash',.4+Math.min(1,t/.3)*.5);
      if(m=='staff')return this.pr('spellcast',t/.45);
      return this.pr('slash',(t*2.5)%1)}
    if(P.cs)return this.pr(m=='staff'?'spellcast':'slash',(P.cs.t||0)/.4);
    if(P.at>0){const w=P.swW||.1,D=P.swD||.3,T=P.swT||0,an=m=='staff'?'thrust':['slash','backslash','halfslash','slash'][Math.abs(P.swC||0)%4],n=this.S[an][1],h=an=='backslash'?6:an=='thrust'?4:an=='halfslash'?2:3;
      if(T<w)return [an,Math.floor(T/w*h)];return [an,Math.min(n-1,h+Math.floor((T-w)/Math.max(.05,D-w)*(n-h)))]}
    if(P.ch>.12)return m=='staff'?['spellcast',3]:['slash',2];
    if(P.fly)return ['jump',2];
    if(air)return ['jump',P.vy<-60?2:P.vy<160?3:4];
    if(mv)return P.run?['run',Math.floor(tm*13)%8]:['walk',1+Math.floor(tm*10)%8];
    return ['idle',Math.floor(tm*1.6)%2]},
  // 每个动画每一帧前手(握武器的手)在格子里的位置(按帧手工标定)
  HAT:{idle:[[39,48],[39,47]],walk:[[39,48],[32,48],[28,48],[38,49],[40,47],[40,47],[39,47],[39,48],[38,47]],run:[[41,40],[37,42],[38,45],[41,38],[43,40],[39,43],[35,45],[40,40]],
    jump:[[39,48],[37,47],[43,37],[41,38],[45,39]],slash:[[39,48],[43,48],[39,48],[48,44],[51,33],[52,33]],
    backslash:[[41,41],[48,40],[50,40],[49,41],[49,41],[49,41],[48,40],[47,40],[47,42],[42,39],[41,40],[41,40],[41,40]],halfslash:[[41,41],[48,40],[51,44],[55,44],[56,44],[48,40]],
    thrust:[[39,48],[41,46],[41,45],[40,44],[55,43],[55,44],[53,43],[40,45]],spellcast:[[39,48],[40,47],[36,45],[41,43],[42,40],[40,38],[41,43]],combat_idle:[[42,41],[43,42]]},
  wpn(c,m,f,wa,tier){if(!PXA.WI)return;const h=this.HA[f]||[39,48];c.drawImage(PXA.wc(PXA.wrow(m),PXA.wdir(wa),tier),h[0]-32-28,h[1]-62-28)},
  wgeo(){const h=this.DG?[this.DG[0]+32,this.DG[1]+62]:this.HA[this.LF||0]||[39,48],wa=P.rc?P.rc.wa:0,L=P.mode=='staff'?30:this.DG?48:31,c=Math.cos(wa),s=Math.sin(wa),hx=(h[0]-32)/HSC,hy=(h[1]-62)/HSC,q=v=>[hx+c*v/HSC,hy+s*v/HSC];
    return {h:[hx,hy],b:q(4),m:q(16),tip:q(L),wa,px:1,b0:4,t0:L}},
  tint(cv,f,col,mode,t){t=t||this.TT||(this.TT=document.createElement('canvas'));t.width=64;t.height=64;const g=t.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(cv,f*64,0,64,64,0,0,64,64);
    g.globalCompositeOperation=mode||'source-atop';g.fillStyle=col;g.fillRect(0,0,64,64);return t},
  // 飞行翅膀:LPC 羽翼和 LPC 身体同一个格子,直接对齐
  wings(c,tm,fl){if(!PXA.GI)return;const g=Math.floor(tm*12)%8;c.save();if(fl<0)c.scale(-1,1);c.drawImage(PXA.GI,g*64,0,64,64,-32,-62,64,64);c.drawImage(PXA.GI,g*64,64,64,64,-32,-62,64,64);c.restore()},
  // ===== 骨骼纸娃娃(主角方案①):头 / 躯干用 LPC 图层合成(头 = 待机帧的头 / 发 / 盔 / 帽层,躯干 = 施法帧 4 双臂张开时的身体层裁掉手臂),
  // 四肢按 RIG 用像素线段画(颜色取自当前衣服图层),剑用像素武器图;关节位置 / 角度全部来自 heroRig()(P.rc),和原版几何同一套姿势。
  // 目前只用在待机 + 走路,其余动作仍用 LPC 整帧。DS = LPC 像素 / RIG 单位(LPC 髋高 14 像素 ÷ RIG 12.5)
  DS:1.12,DHX:32,DHY:48,HEADL:/^(head|hair|helm|hat|hood|capf|feather)/,OL2:'#1a1220',
  // 纸娃娃负责主角的全部动作(待机 / 走 / 跑 / 跳 / 普攻 / 技能 / 施法 / 蓄力 / 受击 / 翅膀飞行);LPC 整帧只剩分身、背包纸娃娃、商城预览用
  dollOn(){return this.ready()&&!!P.rc},
  // 纸娃娃部件(按外观缓存):h 头,t 躯干,b 披风,配色 sl 袖子 / sk 手 / pt 裤子 / bt 靴子
  parts(m,lk){const K=this.keys(m,lk),key='D|'+m+'|'+lk+'|'+K.join(',');if(this.LK[key])return this.LK[key];const L=this.M.layers;
    const mk=()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g]};
    const lay=(g,k,a,i)=>{const Ly=L[k];let an=a;if(!Ly.has.includes(an)){an=this.FBK[a];if(!an||!Ly.has.includes(an))return 0}g.drawImage(this.I,(this.S[an][0]+Math.min(i,this.S[an][1]-1))*64,Ly.row*64,64,64,0,0,64,64);return 1};
    const freq=k=>{if(!k)return null;const [,g]=mk();if(!lay(g,k,'idle',0))return null;const d=g.getImageData(0,0,64,64).data,H={};let best=null,bn=0;
      for(let j=0;j<d.length;j+=4){if(d[j+3]<250||d[j]*.3+d[j+1]*.59+d[j+2]*.11<45)continue;const s=d[j]+','+d[j+1]+','+d[j+2];H[s]=(H[s]||0)+1;if(H[s]>bn){bn=H[s];best=s}}return best?'rgb('+best+')':null};
    const [hc,hg]=mk(),[tc,tg]=mk(),[bc,bg]=mk();let skirt=0;
    for(const k of K){if(this.HEADL.test(k))lay(hg,k,'idle',0);else if(/^cape/.test(k))lay(bg,k,'idle',0);else if(!/^boots/.test(k)){lay(tg,k,'spellcast',4);if(/^(skirt|kimono)/.test(k))skirt=1}}
    const bot=skirt?58:50;tg.clearRect(0,0,64,33);tg.clearRect(0,bot,64,64);tg.clearRect(0,0,22,64);tg.clearRect(42,0,22,64);tg.clearRect(22,33,3,9);
    const fk_=re=>K.find(k=>re.test(k));
    return this.LK[key]={h:hc,t:tc,b:bc,skirt,sk:freq('body')||'#f0c8a0',sl:freq(fk_(/^(shirt|kimono)/))||'#3b5bdb',pt:freq(fk_(/^(pants|skirt|kimono)/))||'#2b2f4a',bt:freq(fk_(/^boots/))||'#6b3f1e'}},
  // 画纸娃娃到 176×136 的小画布(脚底在 (88,108)),返回前手位置(相对脚底的像素)
  dollDraw(p,m,lk,tier){const D=this.parts(m,lk),R=RIG,S=this.DS,cv=this.DC||(this.DC=document.createElement('canvas'));cv.width=176;cv.height=136;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
    const OX=88,OY=108,sq=p.sq||0,X=v=>Math.round(OX+((p.x||0)+v[0]*(1+sq*.45))*S),Y=v=>Math.round(OY+((p.y||0)+v[1]*(1-sq))*S);
    const hy=R.hipY,cl=Math.cos(p.lean),sl=Math.sin(p.lean),tf=(px,py)=>[px*cl-py*sl,hy+px*sl+py*cl];
    // 关节(和 drawHero 同一套算法)
    const SF=tf(R.shX,R.shY),SB=tf(-R.shX+.6,R.shY),G=tf(p.gx,p.gy),dw=[Math.cos(p.wa),Math.sin(p.wa)];
    const fA=ik2(SF[0],SF[1],G[0],G[1],R.up,R.fore),HF=fA.H;
    const fb=fk(p.aB),fb2=fk(p.aB+p.eB),freeB=[SB[0]+fb[0]*R.up+fb2[0]*R.fore,SB[1]+fb[1]*R.up+fb2[1]*R.fore],gB=[HF[0]-dw[0]*6.5,HF[1]-dw[1]*6.5];
    const bA=ik2(SB[0],SB[1],lerp(freeB[0],gB[0],p.two),lerp(freeB[1],gB[1],p.two),R.up,R.fore);
    const OL=this.OL2,dk=(col,k)=>{const v=col.match(/\d+/g).map(Number);return 'rgb('+v.map(q=>Math.min(255,Math.round(q*k+(k>1?12:0)))).join(',')+')'};
    // 像素线段:先整条描边再整条填色(关节处不会出现描边断线)
    const limb=(pts,w,col)=>{const P2=pts.map(v=>[X(v),Y(v)]);for(const [ww,cc] of [[w+2,OL],[w,col]]){g.fillStyle=cc;
      for(let s=1;s<P2.length;s++){const [x0,y0]=P2[s-1],[x1,y1]=P2[s],n=Math.max(1,Math.abs(x1-x0),Math.abs(y1-y0));
        for(let i=0;i<=n;i++)g.fillRect(Math.round(x0+(x1-x0)*i/n)-(ww>>1),Math.round(y0+(y1-y0)*i/n)-(ww>>1),ww,ww)}}};
    const blk=(x,y,w,h,col)=>{g.fillStyle=OL;g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=col;g.fillRect(x,y,w,h)};
    const leg=(hx,h,k,front)=>{const Kn=[hx+Math.sin(h)*R.thigh,hy+Math.cos(h)*R.thigh],A=[Kn[0]+Math.sin(h-k)*R.shin,Kn[1]+Math.cos(h-k)*R.shin];
      limb([[hx,hy],Kn,A],4,front?D.pt:dk(D.pt,.72));blk(X(A)-2,Y(A)-1,6,3,front?D.bt:dk(D.bt,.75))};
    const arm=(S0,A,front)=>{limb([S0,A.E,A.H],3,front?dk(D.sl,1.18):dk(D.sl,.72));blk(X(A.H)-1,Y(A.H)-1,3,3,D.sk)};
    // 大剑按任意角度逐像素画(和四肢同一像素密度):剑身约 44 像素(和人差不多高)、宽 7 像素,上半亮下半暗;
    // 剑柄长 22 像素、粗 3 像素(手握在剑柄前端靠近护手,大半截剑柄在手后面),金色宽护手和剑首;剑刃配色按武器品质(WPAL)。法杖仍用像素武器图(16 个方向)
    // 技能 / 蓄力光(heroRig 的 glow):剑身外面一圈半透明光,法杖杖头一团光
    const glow=P.rglow;
    const wpn=()=>{const hx=X(HF),hy2=Y(HF),c0=Math.cos(p.wa),s0=Math.sin(p.wa);
      const dot=(t,s,col)=>{g.fillStyle=col;g.fillRect(Math.round(hx+c0*t-s0*s),Math.round(hy2+s0*t+c0*s),1,1)};
      const band=(t0,t1,wf,colf)=>{for(let t=t0;t<=t1;t+=.5){const w=wf(t);for(let s=-w;s<=w;s+=.5)dot(t,s,colf(t,s,w))}};
      if(m!='sword'){if(glow){const q=STF.M[Math.min(STF.M.length-1,wG(EQ.staff))],hd=STF.I?(.8-(P.stg==null?.25:P.stg))*Math.hypot(q[2]-q[0],q[3]-q[1]):25;g.globalAlpha=.75;band(hd-6,hd+4,t=>Math.max(.5,4.5-Math.abs(t-hd+1)*.8),()=>glow);g.globalAlpha=1}
        // 第十八轮:手里的法杖 = 装备图标里四个系列各自的法杖(7Soul1,CC0),图标里杖头朝左上、握在右下 (24,24),按握持角度最近邻旋转
        // 第二十六轮:换成 Staff [64x64](LordNeo,CC0,art_src/lpc/build_staff.py);普攻 / 蓄力时双手握中段(P.stg 平滑过渡),平时像剑一样握在下段
        if(STF.I){const sg=Math.min(STF.M.length-1,wG(EQ.staff)),q=STF.M[sg],ax=q[2]-q[0],ay=q[3]-q[1],th=Math.atan2(ay,ax),f=P.stg==null?.25:P.stg,vx=q[0]-STF.E,vy=q[1]-STF.E,Gx=vx+(q[2]-vx)*f,Gy=vy+(q[3]-vy)*f;
          g.save();g.translate(hx,hy2);g.rotate(p.wa-th);g.drawImage(STF.I,sg*STF.C,0,STF.C,STF.C,-Gx,-Gy,STF.C,STF.C);g.restore();return}
        if(EQPX.I){const C=EQPX.C,sg=Math.max(0,Math.min(3,EQ.staff?EQ.staff.g||0:0));g.save();g.translate(hx,hy2);g.rotate(p.wa+Math.PI*.75);g.drawImage(EQPX.I,sg*C,EQPX.R.staff*C,C,C,-24,-24,C,C);g.restore();return}
        if(PXA.WI)g.drawImage(PXA.wc(PXA.wrow(m),PXA.wdir(p.wa),tier),hx-28,hy2-28);return}
      const sg=Math.min(HSW.M.length-1,wG(EQ.sword)),W0=WPAL[Math.min(3,sg)];
      const bw=t=>t>42?Math.max(.5,3-(t-42)*.45):3;
      if(glow){g.globalAlpha=.55;band(4,52,t=>bw(t)+3,()=>glow);g.globalAlpha=1}
      if(HSW.I){const q=HSW.M[sg];g.save();g.translate(hx,hy2);g.rotate(p.wa);g.drawImage(HSW.I,0,q[0],q[1],q[2],-q[3],-q[4],q[1],q[2]);g.restore();return}  // 第十七轮:外部素材的剑(最近邻旋转,像素不糊)
      band(5,49,t=>bw(t)+1,()=>OL);band(3,5.5,()=>7.6,()=>OL);band(-23,3,t=>t<-19?3.3:2.2,()=>OL);
      band(-19,3,()=>1.2,(t,s)=>s<-.4?'#9a6a3a':Math.floor(t)%3==0?'#2b1a10':'#5c3a1e');   // 剑柄(缠绳,上缘高光)
      band(-22.5,-19.2,()=>2.3,(t,s)=>s<0?'#ffe066':'#c98a00');                            // 剑首
      band(3.5,5,()=>6.6,(t,s)=>s<-2?'#ffe066':'#c98a00');                                 // 护手
      band(5.5,48,bw,(t,s,w)=>Math.abs(s)>=w-.4?W0[2]:s<0?W0[0]:W0[1])};                   // 剑身
    // 躯干 / 披风 / 头:小角度前倾用逐行错位(像素不糊),大角度(攻击、跑步)绕髋部旋转;髋部对齐 LPC 格子的 (32,48),脖子在 (33,34)
    const hp=[X([0,hy]),Y([0,hy])],big=Math.abs(p.lean)>.2;
    const body=(im)=>{if(big){g.save();g.translate(hp[0],hp[1]);g.rotate(p.lean);g.drawImage(im,-this.DHX,-this.DHY);g.restore();return}
      for(let r=20;r<64;r++){const s=Math.round(-(r-this.DHY)*sl);g.drawImage(im,0,r,64,1,hp[0]-this.DHX+s,hp[1]-this.DHY+r,64,1)}};
    const head=()=>{const nx=hp[0]+Math.round(cl+14*sl),ny=hp[1]+Math.round(sl-14*cl),ha=p.lean*.35+(p.head||0);
      if(Math.abs(ha)<.12){g.drawImage(D.h,nx-33,ny-34);return}g.save();g.translate(nx,ny);g.rotate(ha);g.drawImage(D.h,-33,-34);g.restore()};
    body(D.b);
    if(p.wb)wpn();
    if(p.two<.5)arm(SB,bA,0);
    leg(-R.hipX,p.hB,p.kB,0);
    if(!D.skirt)body(D.t);
    leg(R.hipX,p.hF,p.kF,1);
    if(D.skirt)body(D.t);
    head();
    if(p.two>=.5)arm(SB,bA,0);
    if(!p.wb)wpn();
    if(p.two>=.5)blk(X(bA.H)-1,Y(bA.H)-1,3,3,D.sk);
    arm(SF,fA,1);
    // 品质描边 / 中毒染色(和整帧版一样)
    let out=cv;
    if(tier>=1||P.ps>0){const o2=this.DO||(this.DO=document.createElement('canvas'));o2.width=176;o2.height=136;const oc=o2.getContext('2d');oc.imageSmoothingEnabled=false;
      if(tier>=1){const t2=this.DT||(this.DT=document.createElement('canvas'));t2.width=176;t2.height=136;const tg2=t2.getContext('2d');tg2.drawImage(cv,0,0);tg2.globalCompositeOperation='source-in';tg2.fillStyle=TR[tier][1];tg2.fillRect(0,0,176,136);oc.globalAlpha=.9;for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])oc.drawImage(t2,dx,dy);oc.globalAlpha=1}
      oc.drawImage(cv,0,0);if(P.ps>0){oc.globalCompositeOperation='source-atop';oc.fillStyle='rgba(105,219,124,.45)';oc.fillRect(0,0,176,136);oc.globalCompositeOperation='source-over'}out=o2}
    return {cv:out,h:[X(HF)-OX,Y(HF)-OY],hip:[hp[0]-OX,hp[1]-OY]}},
  hero(c,cx,fy,tm){const lo=this.look(),[a,i]=this.hf(tm),f=this.fr(a,i,lo),tier=this.tier(),fl=P.f*(this.SF?-1:1),wa=P.rc?P.rc.wa:0,m=P.mode;this.LF=f;
    this.DG=null;
    if(this.dollOn()){const d=this.dollDraw(P.rc,m,heroLook().look||'',tier);this.DG=d.h;
      c.save();c.translate(Math.round(cx),Math.round(fy));c.imageSmoothingEnabled=false;
      // 翅膀飞行:LPC 翅膀图对齐的是 LPC 格子(髋部在脚底上方 14 像素),这里按纸娃娃髋部的实际位置平移
      if(P.fly){c.save();c.translate(d.hip[0]*P.f,d.hip[1]+14);this.wings(c,tm,P.f);c.restore()}
      // 站在地上时把地面以下裁掉:砸地 / 重击时剑尖像插进地里,而不是穿到泥土下面
      if(P.gr&&!P.fly){c.beginPath();c.rect(-120,-160,240,162);c.clip()}
      if(P.f<0)c.scale(-1,1);c.drawImage(d.cv,-88,-108);c.restore();return}
    c.save();c.translate(Math.round(cx),Math.round(fy));c.imageSmoothingEnabled=false;
    if(P.fly)this.wings(c,tm,fl);
    if(fl<0)c.scale(-1,1);
    const back=this.HB[f];if(back)this.wpn(c,m,f,wa,tier);
    if(P.ps>0)c.drawImage(this.tint(lo.cv,f,'rgba(105,219,124,.45)'),-32,-62);else c.drawImage(lo.cv,f*64,0,64,64,-32,-62,64,64);
    if(!back)this.wpn(c,m,f,wa,tier);c.restore()},
  // 分身:法师外观 + 法杖,半透明紫色。s = {land, vy, cs, mv}
  clone(c,cx,fy,s,face,a,tm,wa){const lo=this.look('staff'),an=!s.land?['jump',s.vy<0?2:3]:s.cs>0?['spellcast',4]:s.mv?['walk',1+Math.floor(tm*10)%8]:['idle',0],f=this.fr(an[0],an[1],lo);
    const t=this.CT||(this.CT=document.createElement('canvas'));t.width=t.height=128;const g=t.getContext('2d');g.imageSmoothingEnabled=false;g.translate(64,96);
    g.drawImage(lo.cv,f*64,0,64,64,-32,-62,64,64);this.wpn(g,'staff',f,wa==null?-1.05:wa,0);g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(151,117,250,.5)';g.fillRect(0,0,128,128);
    c.save();c.globalAlpha=a;c.imageSmoothingEnabled=false;c.translate(Math.round(cx),Math.round(fy));if(face<0)c.scale(-1,1);c.drawImage(t,-64,-96);c.restore()},
  // 残影:纸娃娃时复制当前纸娃娃画布(dc),否则用整帧
  gf(){if(!this.heroOn(heroLook()))return null;if(this.DG&&this.DC){const d=document.createElement('canvas');d.width=176;d.height=136;d.getContext('2d').drawImage(this.DC,0,0);return {dc:d,fl:P.f,h:this}}
    return {f:this.LF||0,fl:P.f*(this.SF?-1:1),h:this,cv:this.look().cv}},
  ghost(c,g){if(g.pf.dc){const d=g.pf.dc,t=this.GD||(this.GD=document.createElement('canvas'));t.width=176;t.height=136;const tg=t.getContext('2d');tg.drawImage(d,0,0);tg.globalCompositeOperation='source-in';tg.fillStyle=g.c;tg.fillRect(0,0,176,136);
      c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(g.x+12-cam),Math.round(g.y+32));if(g.pf.fl<0)c.scale(-1,1);c.drawImage(t,-88,-108);c.restore();return}
    const t=this.tint(g.pf.cv,g.pf.f,g.c,'source-in',this.GT||(this.GT=document.createElement('canvas')));c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(g.x+12-cam),Math.round(g.y+32));if(g.pf.fl<0)c.scale(-1,1);c.drawImage(t,-32,-62);c.restore()},
  // 背包纸娃娃:法师静态图(c 已经平移到脚底)
  doll(c,L){const m=P.mode,lo=this.look(m);c.imageSmoothingEnabled=false;c.drawImage(lo.cv,0,0,64,64,-32,-62,64,64);this.wpn(c,m,0,STANCE[m].wa,this.tier())},
  // 商城预览:翅膀 = 主角 + 像素挂件;时装 = 穿上时装的主角
  pv(c,id,t){const lo=this.look(P.mode,'');c.imageSmoothingEnabled=false;c.drawImage(lo.cv,0,0,64,64,-32,-62,64,64);this.wpn(c,P.mode,0,STANCE[P.mode].wa,this.tier());PEND.draw(c,id=='xyw'?1:0,-11,-42,t,1)},
  pvF(c,id,t){const lo=this.look(P.mode,id);c.imageSmoothingEnabled=false;c.drawImage(lo.cv,0,0,64,64,-32,-62,64,64);this.wpn(c,P.mode,0,STANCE[P.mode].wa,this.tier())}};
LPC.init();
// 当前用哪套像素主角:LPC(默认)或 Ars(设置里可切回);LPC 图还没加载完时先用 Ars
function HERO(){return SET.hero!=='ars'&&LPC.I?LPC:PXA}
