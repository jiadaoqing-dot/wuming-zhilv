// ===== 强化石(2026-10-12 改版):Lv1~4 四级,每级管 3 个强化等级(Lv1 = +1~+3 · Lv2 = +4~+6 · Lv3 = +7~+9 · Lv4 = +10~+12);
// 品质 普通 / 精良 / 史诗 / 卓越(蓝白 / 绿 / 紫 / 金黄):品质越高每级强化加的属性越多(b)、光芒越明显。关卡只掉普通,高品质在熔炉里 3 合 1。STN[级][品质] = 数量(存档字段 STN2)
const STQ=[{n:'普通',c:'#a5d8ff',b:.08,p:1},{n:'精良',c:'#51cf66',b:.1,p:3},{n:'史诗',c:'#cc5de8',b:.12,p:9},{n:'卓越',c:'#fcc419',b:.15,p:27}];  // 第十六轮:每级 8% / 10% / 12% / 15%(原 10 / 12 / 15 / 20,+12 全卓越从 ×3.4 降到 ×2.8)
const STP2=[0,40,170,560,1800];  // 强化石参考价(只用于出售道具;第三十二轮起强化师不再卖强化石)
const stnLv=k=>Math.ceil(k/3),stnUse=l=>l>=4?'+10':'+'+(l*3-2)+'~+'+l*3;
function stnNew(){return [null,[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]}
// 读档:新存档 STN2;旧存档 STN[k](k = 强化等级)换成对应等级的普通强化石
function stnLoad(d){const S=stnNew();if(Array.isArray(d.STN2)){for(let l=1;l<=2;l++)for(let q=0;q<4;q++)S[l][q]=+(d.STN2[l]&&d.STN2[l][q])||0}else if(Array.isArray(d.STN))d.STN.forEach((n,k)=>{if(k&&n>0)S[stnLv(Math.min(ENMX,k))][0]+=n});return S}  // 第十九轮:旧存档的 Lv3 / Lv4 强化石直接删除
const stnTot=l=>STN[l].reduce((a,b)=>a+b,0);
const stnRollQ=()=>0;  // 关卡只掉普通品质
// 熔炉合成(免费):3 颗同级同品质 → 1 颗高一档品质(卓越最高);n = 合成次数(0 = 能合多少合多少)
function stnFuse(l,q,n){if(q>=3)return 0;let k=Math.min(Math.floor(STN[l][q]/3),MAT.add|0);if(n)k=Math.min(k,n);if(k<=0)return 0;STN[l][q]-=k*3;MAT.add-=k;STN[l][q+1]+=k;return k}  // 第十九轮:每次合成再消耗 1 瓶合成添加剂
const stnName=(l,q)=>STQ[q].n+' Lv'+l+' 强化石';
// 强化石像素图标(art_src/stone/build_stone.py,自绘):列 = 等级,行 = 品质
const STNI={I:null,D:'@@A:stn_atlas@@'};{const im=new Image();im.onload=()=>{STNI.I=im};im.src=STNI.D;const st=document.createElement('style');st.textContent='.sti{background-image:url('+STNI.D+')}';document.head.appendChild(st)}
const stnEm=(l,q)=>`<i class="sti sq${q}" style="background-position:-${(l-1)*1.25}em -${q*1.25}em"></i>`;
// 画布上画强化石:中心 (cx,cy);品质越高光晕越大越亮,史诗 / 卓越还有绕圈的闪光
function stnDraw(c,l,q,cx,cy,s){s=s||1;const t=performance.now()/1000,col=STQ[q].c,gr=[6,9,13,18][q]*s;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=[.25,.4,.6,.85][q]*(.8+.2*Math.sin(t*4));C_(c,cx,cy,gr,RGD(c,cx,cy,gr,[col,'rgba(0,0,0,0)']),0);c.restore();
  if(STNI.I){c.save();c.imageSmoothingEnabled=false;c.drawImage(STNI.I,(l-1)*16,q*16,16,16,Math.round(cx-8*s),Math.round(cy-8*s),16*s,16*s);c.restore()}
  if(q>=2)for(let i=0;i<q;i++){const a=t*2+i*2.1;C_(c,cx+Math.cos(a)*9*s,cy+Math.sin(a)*6*s,1,'#fff',0)}}
let FQ=-1;  // 强化面板里选中的强化石品质(-1 = 自动选持有的最低品质)
function setLv(){let m=99;for(const k of ALL){const it=EQ[k];m=Math.min(m,it?(it.en||0):0)}return m}
// 第三十二轮:强化荣誉(代替原来的全身 +5 起每级 5% 基础属性):除时装 / 翅膀外 6 个部位(发型、铠甲、戒指、耳坠、剑、法杖)都强化到 +N 时,
// 按最低等级取下表一档(不累加):hp 生命 · cr 暴击率 · def 防御 · atk 攻击(都是最终值 ×(1+x),暴击率按全部来源合计 ×(1+x))· mv 移动力(每点 +HMV 移动速度)
const HONR={4:{hp:.1},5:{hp:.15,cr:.1},6:{hp:.15,cr:.15,mv:1},7:{hp:.15,atk:.2,def:.05,mv:1},8:{hp:.2,cr:.25,def:.07,mv:1},9:{hp:.2,cr:.25,def:.1,atk:.05,mv:1},10:{hp:.27,cr:.25,def:.15,atk:.32,mv:2}},HMV=.05;
const mvK=()=>pb('spd')*(1+(hon().mv||0)*HMV);  // 移动速度倍率(被动疾风 × 强化荣誉移动力)
const honLv=()=>{const m=Math.min(ENMX,setLv());return m>=4?m:0},hon=()=>HONR[honLv()]||{};  // 第三十三轮:+7~+10 留给以后(表先保留),现在只到强化上限 ENMX
const honTxt=l=>{const h=HONR[l],p=v=>Math.round(v*100)+'%',a=[];if(h.hp)a.push('提高生命值'+p(h.hp));if(h.cr)a.push('提高暴击率'+p(h.cr));if(h.def)a.push('提高防御力'+p(h.def));if(h.atk)a.push('提高攻击力'+p(h.atk));if(h.mv)a.push('提升'+h.mv+'点移动力');return a};
// 强化荣誉徽章(+4~+10 一排;达到的亮起,鼠标移上去显示这一档的效果,样式见 CSS .hon)
const honRow=()=>{const L=honLv();return `<div class="hon">${[4,5,6,7,8,9,10].filter(l=>l<=ENMX).map(l=>`<span class="hb${l==L?' on':l<L?' ok':''}">+${l}<span class="ht"><b>强化荣誉+${l}</b>${honTxt(l).join(' ')}</span></span>`).join('')}</div>`};
