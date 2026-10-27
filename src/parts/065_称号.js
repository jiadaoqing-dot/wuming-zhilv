// ===== 第六十二轮(用户):称号 —— 达成条件就永久获得,全部叠加生效(不用佩戴);生命 / 攻击 / 防御 / 暴击按百分比加在「基础数值」上(和强化荣誉一样走 pctB)=====
// 恶魔之王:暗黑炼狱打通第 20 层 · 地狱之王:打通第 30 层 · 一千零一夜:宠物仓鼠嗑瓜子满 1001 次(另加宠物伤害,pDeal 里乘 ttlPet)
// 记录 R19.ttl = {id:1};ttlGet 横幅 + 存档;twChk(炼狱通关)、hamFeed(嗑瓜子)、toTown(回城补发)会检查;背包人物栏显示「称号」
const TTL={dk:{n:'恶魔之王',d:'暗黑炼狱打通第 20 层',b:{hp:.08,atk:.08,def:.05}},hk:{n:'地狱之王',d:'暗黑炼狱打通第 30 层',b:{hp:.12,atk:.12,def:.08,cr:.15}},
  ny:{n:'一千零一夜',d:'宠物仓鼠嗑瓜子满 1001 次',b:{hp:.05,cr:.1},pet:.2},
  tx:{n:'天下第一',d:'四星挑战打通暗黑炼狱第 30 层',b:{},head:1}};  // 第六十七轮(用户):没有属性加成,名字显示在主角头顶上方(350 drawP → ttlHead)
const TTLO=['tx','hk','dk','ny'];  // 背包里先显示哪个
const ttlHas=id=>!!(typeof R19!='undefined'&&R19&&R19.ttl&&R19.ttl[id]);
const ttlTxt=id=>{const t=TTL[id],b=t.b,p=v=>Math.round(v*100)+'%',a=[];if(b.hp)a.push('生命 +'+p(b.hp));if(b.atk)a.push('攻击 +'+p(b.atk));if(b.def)a.push('防御 +'+p(b.def));if(b.cr)a.push('暴击率 +'+p(b.cr));if(t.pet)a.push('宠物伤害 +'+p(t.pet));if(!a.length)a.push('没有属性加成,名字显示在头顶上方');return a};
function ttlGet(id){if(!TTL[id]||ttlHas(id))return;(R19.ttl||(R19.ttl={}))[id]=1;sfx('win');flash('255,220,120',.3);banner('🏆 获得称号「'+TTL[id].n+'」:'+ttlTxt(id).join(' '));say('🏆 获得称号「'+TTL[id].n+'」('+TTL[id].d+'):'+ttlTxt(id).join('、')+'。称号永久生效,可以在背包的人物栏里查看。');save()}
function ttlChk(){if(typeof HAM!='undefined'&&HAM&&HAM.n>=1001)ttlGet('ny');const f=R19.twr|0;if(f>=20)ttlGet('dk');if(f>=30)ttlGet('hk');if((R19.tw4|0)>=30)ttlGet('tx')}
const ttlPet=()=>1+(ttlHas('ny')?TTL.ny.pet:0);
function ttlAdd(p,L){for(const id in TTL)if(ttlHas(id))for(const k in TTL[id].b){p[k]+=TTL[id].b[k];L.push(['称号「'+TTL[id].n+'」',k,TTL[id].b[k]])}}
// 背包人物栏:最高的那个称号 + 鼠标移上去看全部
const ttlNm=()=>{const L=TTLO.filter(ttlHas),w=ttlWorn();return L.length?(w?TTL[w].n:'未佩戴')+(L.length>1?' · 共 '+L.length+' 个':''):'无'};
const ttlTip=()=>Object.keys(TTL).map(id=>(ttlHas(id)?'✅ ':'⬜ ')+TTL[id].n+'('+TTL[id].d+'):'+ttlTxt(id).join(' ')).join('&#10;');
// 第六十八轮(用户):佩戴称号 —— 属性加成照旧全部叠加,佩戴的那个显示在头顶。R19.ttw:没设过 = 自动(有「天下第一」就戴它),'' = 不佩戴
// 背包人物栏点「称号」弹出选择菜单(620 cmItems 'ttl' → bagAct 'tw_<id>');TTLC = 头顶字的渐变色 + 描边
const TTLC={tx:['#fffbe0','#ffd43b','#ff922b','#5a1d0a'],hk:['#ffe3e3','#ff8787','#e03131','#2b0505'],dk:['#f3d9fa','#da77f2','#9c36b5','#1e0a2b'],ny:['#fff9db','#ffe066','#f59f00','#3d2a05']};
const ttlWorn=()=>{const w=typeof R19!='undefined'&&R19?R19.ttw:'';return w===undefined?(ttlHas('tx')?'tx':''):w&&ttlHas(w)?w:''};
function ttlWear(id){if(id&&!ttlHas(id))return;R19.ttw=id;save();bmsg=id?'已佩戴称号「'+TTL[id].n+'」,名字显示在头顶上方':'已取下称号,头顶不再显示'}
// 头顶称号:佩戴的称号画在主角头顶(进关 / 主城都画;被技能藏起来的时候 drawP 已经先 return)
function ttlHead(){const id=ttlWorn();if(!id)return;const c=TTLC[id]||TTLC.tx,t=performance.now()/1000,cx=P.x+12-cam,y=P.y-24+Math.sin(t*2)*1.2;CT(TTL[id].n,cx,y,10,LG(x,0,y-9,0,y+1,[c[0],c[1],c[2]]),'center',2.6,c[3])}
