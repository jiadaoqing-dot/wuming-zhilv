// o 可选:{ns:不造成僵直}。所有伤害都按暴击率判定暴击(2 倍)
function dealt(e,dm,o){if(e.pp){MWH.push(dm);return}if(e.ug)return;  // 第四十五轮:e.pp = 镜中无名的假目标(真主角),伤害记下来换回后再打(mwHit)
  if(e.k=='mir'&&!(e.tpT>0)&&Math.random()<e.mdg){e.tpT=.2;smoke(e.x+e.w/2,e.y+16);e.x=gpCl(e,e.x+sgn(e.x+e.w/2-(P.x+12))*rnd(40,70))}  // 第四十三轮:镜中无名按主角闪避率 ×5 闪开
  if(e.dg>0||e.tpT>0){if(!(e.mx>0)){e.mx=.35;tx('闪避',e.x+e.w/2,e.y-4,'#a5d8ff')}return}
  if(e.k=='gui'){if(e.hide)return;if(!(o&&o.nm)&&(e.miss>0||Math.random()<.3)){if(!(e.mx>0)){e.mx=.35;if(e.miss>0)e.miss--;tx('MISS',e.x+e.w/2,e.y-4,'#e5dbff');S10.af.push({x:e.x,y:e.y,f:e.f,t:.3})}return}e.pbx=sgn(e.x+e.w/2-(P.x+12))*90}  // 归蝇:出场后前 3 次必定 MISS,之后 30% MISS;被打中只轻微后退
  if(!(o&&o.ns)&&e.k!='mir'&&!(e.saT>0))hitStun(e);sfx('hit');let cr=0;if(!noCombo){P.combo=(P.combo||0)+1;P.cbT=m2On('ji')?6:2;mscAdd()}
  {const c=setTr();if(!noCombo&&!NRMH&&!ELX){const b=lingSkB(c);if(b)dm=Math.round(dm*(1+b))}if(PETX&&tr6('ling',c))dm=Math.round(dm*(1+LING6));  // 第四十二轮:邪灵 4 件技能伤害 / 6 件宠物伤害
    const scr=stats().cr,l2=m2On('lei');if(l2)dm=Math.round(dm*(1+scr/1000));  // 第五十七轮:大师二阶怒雷四件(暴击率 ÷ 10 的增伤 + 溢出暴击率转暴击伤害)
    // 第五十八轮:o.cra = 额外暴击率(宠物仓鼠的「眼力」)
    if(Math.random()<(scr+(o&&o.cra||0))/100){dm=Math.round(dm*(critK()+(l2?Math.max(0,scr-100)/200:0))*(PETX&&tr6('ling',c)?1+LING6:1));cr=1;if(tr6('lei',c))e.lsh=Math.min(LEI6N,(e.lsh|0)+1)}}  // 怒雷 6 件:暴击叠破防
  if(e.def)dm=Math.max(1,Math.round(dm*100/(100+e.def*EDF*(e.bf>0||e.shd>0?2:1)*(P.apen>0?.95:1)*(1-LEI6*(e.lsh|0)))));  // 蛇王蜕皮 shd:防御翻倍
  if(P.pdT>0)dm=Math.round(dm*(1+PDK));if(PETX){const k=peqInf();if(k)dm=Math.round(dm*(1+k))}if(MEMB&&st=='play'&&!MWON)dm=Math.round(dm*1.1);  // 第四十八轮:宠物装备「无尽」/ 记忆晶片 +10%
   // 第四十四轮:完美闪避后 3 秒伤害 +50%
  if(P.mode=='sword'&&st=='play'){if(e.bld>0)dm=Math.round(dm*BLDK);if(!noCombo&&GT-(P.qiT||0)>.2){P.qiT=GT;P.qi=Math.min(QIMAX,(P.qi|0)+1)}}  // 第十六轮:裂伤 +15%;剑势每 0.2 秒 +1 层
  if(e.fsh>0){dm=Math.max(1,Math.round(dm*.5));heatAdd(5)}  // 炎狱鬼将的爆炎护体:伤害减半,打它的人自己升温
  if(GM.ko){e.sh=0;dm=Math.max(dm,Math.ceil(e.hp))}
  if(e.hdr>0)dm=Math.max(1,Math.round(dm*(1-e.hdr)));if(e.mdr)dm=Math.max(1,Math.round(dm*(1-e.mdr)));  // 镜中无名:主角的防御减伤 ×5  // 瓜子大王吃瓜子壳:减伤 + 护盾 hsd(e.sh 被首领音效占用)
  if(e.hsd>0){const a=Math.min(e.hsd,dm);e.hsd-=a;dm-=a;tx('🛡'+a,e.x+e.w/2,e.y-16,'#ffe8a3');if(dm<=0){e.fl=.08;return}}
  if(e.sh>0){const a=Math.min(e.sh,dm);e.sh-=a;dm-=a;tx('🛡'+a,e.x+e.w/2,e.y-16,'#74c0fc');if(dm<=0){e.fl=.08;return}}
  e.hp-=dm;e.fl=.15;if(PETX&&peqOn('lch')&&P.hp>0)P.hp=Math.min(stats().hp,P.hp+Math.max(1,Math.round(dm*.01)));  // 第四十八轮:汲取
 {const fz=m2On('ji');if(e.max&&e.k!='mir'&&(fz||!(e.saT>0)))poiseHit(e,dm);else if(fz||!(o&&o.ns))mobPz(e,dm,fz)}hitFX(e,cr);tx(dm,e.x+e.w/2,e.y-4,cr?'#d68cff':'#fff',cr?'c':'d');m2Hit(e);elemChk(e)}  // 第五十七轮:神技四件强制削韧 · 圣愈 / 邪灵四件额外伤害(m2Hit)
// 元素印记(第十六轮):雷印 + 火印 同时存在 → 爆燃(攻击 ×1.5 额外伤害,清掉印记)。ELX 防止爆燃伤害再触发爆燃
let ELX=0;
function elemChk(e){if(ELX||!(e.mkT>0&&e.mkF>0)||e.hp<=0)return;ELX=1;e.mkT=e.mkF=0;const cx=e.x+e.w/2,cy=e.y+e.h/2;
  VFX.spawn('warm-explosion',cx,cy,{s:1.4});SFX5('r-burst',cx,cy,{s:1.3,life:.4,gr:.5});ring(cx,cy,6,60,'#ffa94d',.4,5);burst(cx,cy,16,['#ffd43b','#ff922b','#a5d8ff'],260,{sh:1,s:2.4,l:.35,dr:3});psx('boom');shake=Math.max(shake,.15);
  hitFx='slam';dealt(e,Math.round(stats().atk*ELK*rnd(.9,1.1)),{ns:1});hitFx=null;tx('爆燃!',cx,e.y-30,'#ffa94d');ELX=0}
const mkT=e=>{if(e.hp>0&&!e.ug)e.mkT=MKT},mkF=e=>{if(e.hp>0&&!e.ug)e.mkF=MKT};
