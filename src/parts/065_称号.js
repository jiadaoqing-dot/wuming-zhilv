// ===== 第六十二轮(用户):称号 —— 达成条件就永久获得,全部叠加生效(不用佩戴);生命 / 攻击 / 防御 / 暴击按百分比加在「基础数值」上(和强化荣誉一样走 pctB)=====
// 恶魔之王:暗黑炼狱打通第 20 层 · 地狱之王:打通第 30 层 · 一千零一夜:宠物仓鼠嗑瓜子满 1001 次(另加宠物伤害,pDeal 里乘 ttlPet)
// 记录 R19.ttl = {id:1};ttlGet 横幅 + 存档;twChk(炼狱通关)、hamFeed(嗑瓜子)、toTown(回城补发)会检查;背包人物栏显示「称号」
const TTL={dk:{n:'恶魔之王',d:'暗黑炼狱打通第 20 层',b:{hp:.08,atk:.08,def:.05}},hk:{n:'地狱之王',d:'暗黑炼狱打通第 30 层',b:{hp:.12,atk:.12,def:.08,cr:.15}},
  ny:{n:'一千零一夜',d:'宠物仓鼠嗑瓜子满 1001 次',b:{hp:.05,cr:.1},pet:.2}};
const TTLO=['hk','dk','ny'];  // 背包里先显示哪个
const ttlHas=id=>!!(typeof R19!='undefined'&&R19&&R19.ttl&&R19.ttl[id]);
const ttlTxt=id=>{const t=TTL[id],b=t.b,p=v=>Math.round(v*100)+'%',a=[];if(b.hp)a.push('生命 +'+p(b.hp));if(b.atk)a.push('攻击 +'+p(b.atk));if(b.def)a.push('防御 +'+p(b.def));if(b.cr)a.push('暴击率 +'+p(b.cr));if(t.pet)a.push('宠物伤害 +'+p(t.pet));return a};
function ttlGet(id){if(!TTL[id]||ttlHas(id))return;(R19.ttl||(R19.ttl={}))[id]=1;sfx('win');flash('255,220,120',.3);banner('🏆 获得称号「'+TTL[id].n+'」:'+ttlTxt(id).join(' '));say('🏆 获得称号「'+TTL[id].n+'」('+TTL[id].d+'):'+ttlTxt(id).join('、')+'。称号永久生效,可以在背包的人物栏里查看。');save()}
function ttlChk(){if(typeof HAM!='undefined'&&HAM&&HAM.n>=1001)ttlGet('ny');const f=R19.twr|0;if(f>=20)ttlGet('dk');if(f>=30)ttlGet('hk')}
const ttlPet=()=>1+(ttlHas('ny')?TTL.ny.pet:0);
function ttlAdd(p,L){for(const id in TTL)if(ttlHas(id))for(const k in TTL[id].b){p[k]+=TTL[id].b[k];L.push(['称号「'+TTL[id].n+'」',k,TTL[id].b[k]])}}
// 背包人物栏:最高的那个称号 + 鼠标移上去看全部
const ttlNm=()=>{const L=TTLO.filter(ttlHas);return L.length?TTL[L[0]].n+(L.length>1?' 等 '+L.length+' 个':''):'无'};
const ttlTip=()=>Object.keys(TTL).map(id=>(ttlHas(id)?'✅ ':'⬜ ')+TTL[id].n+'('+TTL[id].d+'):'+ttlTxt(id).join(' ')).join('&#10;');
