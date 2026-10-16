// ===== 怪物群攻击协调:同一时间最多 2 只小怪在出招(首领战时 1 只),远程攻击同时只允许 1 只,两次出招至少错开 0.35 秒 =====
let GT=0,ATKT=-9;  // GT:游戏时间(暂停不走);ATKT:上一次有怪物开始出招的时间
// 怪物此刻是否在一套攻击动作里:0 没有 · 1 近战 · 2 远程
function mAtk(e){const s=e.s;if(MVK[e.k]){const a=s&&MVK[e.k].at?MVK[e.k].at[s]:null;return s?(a===0?0:a==2?2:1):0}switch(e.k){
  case 'slime':case 'bat':case 'skel':return e.wu>0||e.sw>0?1:0;
  case 'snake':case 'ysco':case 'bsco':return e.wu2>0||e.lg>0?1:0;
  case 'ape':return e.wu2>0||e.ap?1:0;
  case 'spi':return s=='sp'?2:s=='pw'||s=='pj'||s=='bu'?1:0;
  case 'ost':return s=='cw'||s=='ch'||s=='pk'||s=='kw'||s=='kk'?1:0;
  case 'pen':case 'pen2':return s=='th'?2:s&&s!='dz'?1:0;
  case 'dog':return s=='cw'||s=='ds'||s=='bt'?1:0;
  case 'dog2':return s=='sp'?2:s=='cw'||s=='rs'||s=='db'?1:0;
  case 'gfly':case 'gfly2':return s=='fbw'?2:s=='dvw'||s=='dv'||(s=='gdv'&&e.t>=.5)?1:0;
  case 'gland':case 'gland2':return s=='hdv'||s=='rmw'||s=='rm'||s=='rv'||s=='lg'?1:0;
  case 'imp':return s=='cw'||s=='cl'||s=='chw'||s=='ch'?1:0;
  case 'fwisp':return s=='fbw'?2:0;case 'wimp':return s&&s!='up'?1:0;case 'eye':return s=='bw'||s=='bm'||s=='obw'?2:0;case 'swing':return s=='app'||s=='dash'?1:0;
  case 'golem':return s=='cmb'?1:0;
  case 'oni':return s&&s!='rec'?1:0;
  case 'gbot':return s=='spw'||s=='spin'?1:0;case 'zdr':return s=='zw'||s=='zap'?1:0;case 'tank':return s=='aim'||s=='fire'?2:0;case 'skw':return s=='sw'||s=='sl'?1:0;case 'fwm':return s=='aim'||s=='sh'?2:s=='bw'||s=='bt'?1:0;case 'mmt':return s=='mw'||s=='mp'?1:0;case 'fsm':return s=='cw'||s=='cs'?1:s=='ww'||s=='ws'?2:0;case 'nja':return s=='aim'||s=='ds'?1:0;case 'nsh':return s=='aim'||s=='sh'||s=='tw'||s=='tp'?2:0;case 'ron':return s=='w1'||s=='s1'||s=='s2'||s=='wi'||s=='si'?1:0;case 'gob':return s=='aim'||s=='thr'?2:s=='stw'||s=='stb'?1:0;case 'nwz':return s=='cw'||s=='cs'?1:s=='ww'||s=='ws'?2:0;
  case 'seal':case 'seal2':return s=='in'?2:s=='pop'||s=='slp'||s=='cu'||s=='ball'?1:0;
  default:return 0}}
// 申请出招:拿到「攻击令牌」才能开始一次攻击;拿不到就继续走位,稍后再试。被召唤物吸引时不受限制
// 第二十二轮:怪物攻击距离 = 1.5 个闪现(BLKD 170 × 1.5 = 255,MATKR):小怪离主角超过这个距离不出招;小怪的飞弹最多飞 MSHR 就消散(首领不受限)
// 第二十三轮:远程攻击再收紧 —— 远程出招距离 MRNGR = 1 个闪现(170),飞弹最多飞 MSHR 230;每只小怪两次远程至少隔 MRCD 3.5 秒,全场两次远程至少隔 RGAP 1.2 秒(原来只要求同时只有 1 只在放远程)
const BSHR=340;  // 第二十四轮(用户回复):首领的飞弹最多飞 2 个闪现(340 像素),不再隔着整个场地打人
const BLKD=170,MATKR=Math.round(BLKD*1.5),MRNGR=BLKD,MSHR=BLKD+60,MAGR=Math.round(BLKD*1.75),MRCD=3.5,RGAP=1.2;let RATKT=-99;
function tok(e,rg){if(DECOY)return true;if(P.sk&&P.sk.id=='zap')return false;if(!e.max){const ad_=Math.abs(e.x+e.w/2-(P.x+12));if(ad_>(rg?MRNGR:MATKR))return false;if(rg&&(GT-(e.rT??-99)<MRCD||GT-RATKT<RGAP))return false}  // 雷霆连斩期间不可选取:怪物不会对主角出招
 const L3=cur>=8&&cur<=10;if(GT-ATKT<(L3?.22:.35))return false;let n=0,r=0;const pc=P.x+12;
  let al=0;for(const o of E){if(o===e||o.hp<=0||Math.abs(o.x+o.w/2-pc)>420)continue;al++;const m=mAtk(o);if(m){n++;if(m==2)r++}}
  if(L3&&!bossOn&&al<=1&&GT-ATKT<.9)return false;  // 第八~十关只剩一两只时:两次出招至少隔 0.9 秒(不然会一直连发)
  if(n>=(bossOn?1:L3?3:2))return false;if(rg&&(r>=1||F.length>=4))return false;ATKT=GT;if(rg){RATKT=GT;e.rT=GT}return true}
// 小怪索敌(2026-10-12):不出招时一直朝主角(或吸引它的召唤物)走;自己的走位已经在靠近就不管。远程怪(SEEKR)走到射程内停下,交给它自己的出招逻辑
// 首领、潜伏中的海豹(ug)、出招 / 收招中的怪不受影响
const MCHS=110;  // 第二十四轮:超过这个距离(远程怪按 SEEKR)就一定朝玩家走
const SEEKV={slime:45,skel:65,bat:70,snake:60,ape:70,ysco:55,bsco:55,spi:70,ost:85,pen:45,pen2:50,seal:40,seal2:45,dog:105,dog2:95},SEEKR={pen:150,pen2:150,spi:110,dog2:90,seal:120,seal2:120};
function seek(e,x0,dt){if(MVK[e.k])return;const v=SEEKV[e.k];if(!v||e===B||e.ug||e.ca>0||mAtk(e)||e.wu>0||e.sw>0||e.rec>0||e.wu2>0||e.lg>0||e.s||e.dg>0)return;
  const dx=P.x+12-(e.x+e.w/2),d=sgn(dx);if(Math.abs(dx)<(SEEKR[e.k]||e.w/2+26))return;
  if((e.x-x0)*d>=v*dt*.5)return;
  e.x=x0+d*v*dt;e.f=d;if(e.o!=null)e.o=e.x}
