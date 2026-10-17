// ===== 音频(2026-10-12 第四轮):关卡里除首领外全部用旧版 WebAudio 合成音(SYN);首领、主角技能、熔炉用外部素材 assets/au_*.ogg(art_src/audio/build_audio.py)=====
// BGM:主城 + 第一~七关各一首关卡曲、一首首领曲(外部 CC0 素材,用到时才解码,只留当前关卡的两首)。素材和授权见设置页「美术致谢」的声音一条
const AU={ctx:null,mst:null,mus:null,fx:null,mode:0,buf:{},ld:{},trk:null,src:null,last:{},lp:new Set()};
try{AU.mode=+(localStorage.getItem('wuming-audio')||0)}catch(e){} // 0 全开 · 1 只开音效 · 2 静音
const AUD={swing:'@@O:au_swing@@',dash:'@@O:au_dash@@',zap:'@@O:au_zap@@',blink:'@@O:au_blink@@',buff:'@@O:au_buff@@',slam:'@@O:au_slam@@',boom:'@@O:au_boom@@',fuse:'@@O:au_fuse@@',step:'@@O:au_step@@',
  eatk:'@@O:au_eatk@@',peck:'@@O:au_peck@@',proj:'@@O:au_proj@@',roar:'@@O:au_roar@@',tongue:'@@O:au_tongue@@',sand:'@@O:au_sand@@',storm:'@@O:au_storm@@',howl:'@@O:au_howl@@',breath:'@@O:au_breath@@',
  v_shade:'@@O:au_v_shade@@',b_moo:'@@O:au_b_moo@@',b_axe:'@@O:au_b_axe@@',b_stomp:'@@O:au_b_stomp@@',b_ram:'@@O:au_b_ram@@',b_gallop:'@@O:au_b_gallop@@',b_throw:'@@O:au_b_throw@@',b_imp1:'@@O:au_b_imp1@@',b_imp2:'@@O:au_b_imp2@@',b_imp3:'@@O:au_b_imp3@@',
  k_bite:'@@O:au_k_bite@@',k_spit:'@@O:au_k_spit@@',k_rattle:'@@O:au_k_rattle@@',k_buff:'@@O:au_k_buff@@',k_bump:'@@O:au_k_bump@@',sc_claw:'@@O:au_sc_claw@@',sc_chit:'@@O:au_sc_chit@@',sc_tail:'@@O:au_sc_tail@@',sc_sting:'@@O:au_sc_sting@@',sc_buff:'@@O:au_sc_buff@@',lz_growl:'@@O:au_lz_growl@@',lz_tail:'@@O:au_lz_tail@@',lz_tongue:'@@O:au_lz_tongue@@',lz_spray:'@@O:au_lz_spray@@',lz_climb:'@@O:au_lz_climb@@',lz_land:'@@O:au_lz_land@@',lz_dig:'@@O:au_lz_dig@@',lz_rock:'@@O:au_lz_rock@@',lz_storm:'@@O:au_lz_storm@@',br_growl:'@@O:au_br_growl@@',br_roar:'@@O:au_br_roar@@',br_paw:'@@O:au_br_paw@@',br_slam:'@@O:au_br_slam@@',br_crash:'@@O:au_br_crash@@',br_skate:'@@O:au_br_skate@@',br_throw:'@@O:au_br_throw@@',br_ice:'@@O:au_br_ice@@',br_bliz:'@@O:au_br_bliz@@',w_snarl:'@@O:au_w_snarl@@',w_growl:'@@O:au_w_growl@@',w_claw:'@@O:au_w_claw@@',w_bite:'@@O:au_w_bite@@',w_lunge:'@@O:au_w_lunge@@',w_land:'@@O:au_w_land@@',w_howl:'@@O:au_w_howl@@',
  bgm0:'@@O:au_bgm0@@',bgm1:'@@O:au_bgm1@@',bgm1b:'@@O:au_bgm1b@@',bgm2:'@@O:au_bgm2@@',bgm2b:'@@O:au_bgm2b@@',bgm3:'@@O:au_bgm3@@',bgm3b:'@@O:au_bgm3b@@',bgm4:'@@O:au_bgm4@@',bgm4b:'@@O:au_bgm4b@@',
  bgm5:'@@O:au_bgm5@@',bgm5b:'@@O:au_bgm5b@@',bgm6:'@@O:au_bgm6@@',bgm6b:'@@O:au_bgm6b@@',bgm7:'@@O:au_bgm7@@',bgm7b:'@@O:au_bgm7b@@',bgm8:'@@O:au_bgm8@@',bgm8b:'@@O:au_bgm8b@@',
  y_cry:'@@O:au_y_cry@@',y_cryl:'@@O:au_y_cryl@@',y_laugh:'@@O:au_y_laugh@@',y_tp:'@@O:au_y_tp@@',y_claw:'@@O:au_y_claw@@',y_hand:'@@O:au_y_hand@@',y_sum:'@@O:au_y_sum@@',y_crawl:'@@O:au_y_crawl@@',y_ult:'@@O:au_y_ult@@',y_cradle:'@@O:au_y_cradle@@',
  bgm9:'@@O:au_bgm9@@',bgm9b:'@@O:au_bgm9b@@',l9_roar:'@@O:au_l9_roar@@',l9_growl:'@@O:au_l9_growl@@',l9_fire:'@@O:au_l9_fire@@',l9_chain:'@@O:au_l9_chain@@',l9_punch:'@@O:au_l9_punch@@',l9_erupt:'@@O:au_l9_erupt@@',l9_laugh:'@@O:au_l9_laugh@@',bgm10:'@@O:au_bgm10@@',bgm10b:'@@O:au_bgm10b@@',g10_shriek:'@@O:au_g10_shriek@@',g10_flap:'@@O:au_g10_flap@@',g10_wind:'@@O:au_g10_wind@@',g10_tele:'@@O:au_g10_tele@@',g10_orb:'@@O:au_g10_orb@@',g10_laugh:'@@O:au_g10_laugh@@',
  bgm11:'@@O:au_bgm11@@',bgm11b:'@@O:au_bgm11b@@',bgm14:'@@O:au_bgm14@@',bgm14b:'@@O:au_bgm14b@@',bgm15:'@@O:au_bgm15@@',bgm15b:'@@O:au_bgm15b@@',bgm12:'@@O:au_bgm12@@',bgm12b:'@@O:au_bgm12b@@',bgm13:'@@O:au_bgm13@@',bgm13b:'@@O:au_bgm13b@@',bgm16:'@@O:au_bgm16@@',bgm16b:'@@O:au_bgm16b@@',bgm17:'@@O:au_bgm17@@',bgm17b:'@@O:au_bgm17b@@',bgm17c:'@@O:au_bgm17c@@',bgm18:'@@O:au_bgm18@@',bgm18b:'@@O:au_bgm18b@@',bgm19:'@@O:au_bgm19@@',bgm19b:'@@O:au_bgm19b@@',h_squeak:'@@O:au_h_squeak@@',h_angry:'@@O:au_h_angry@@',h_eat:'@@O:au_h_eat@@',h_shell:'@@O:au_h_shell@@',h_throw:'@@O:au_h_throw@@',h_clap:'@@O:au_h_clap@@'};
// 第四十六轮:没有自己 BGM 的关卡用别的关卡的(神秘副本 2 / 3 / 4 用神秘地带的 bgm11,第十三关火山用第九关的 bgm9);以前会去请求不存在的 bgm17 等
const BGMF={};  // 第四十八轮:第十五关有了专属 BGM(bgm19 / bgm19b),这张表留给以后临时借曲  // 第四十七轮:神秘副本 2 / 3 / 4、第十三关、第十四关都有了专属 BGM(build_audio.py r47),这张表留给以后临时借曲
function auLoad(k){if(AU.buf[k]||AU.ld[k]||!AU.ctx)return;AU.ld[k]=1;const c=AU.ctx;
  fetch(AUD[k]).then(r=>r.arrayBuffer()).then(b=>c.decodeAudioData(b)).then(d=>{AU.buf[k]=d;AU.ld[k]=0;if(AU.trk==k)bgmPlay()}).catch(()=>{AU.ld[k]=0})}
// 第一次有按键 / 点击时建 AudioContext 并解码音效(data URI → ArrayBuffer → AudioBuffer);BGM 用到时才解码
function auInit(){if(AU.ctx){if(AU.ctx.state=='suspended')AU.ctx.resume();return}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;try{const c=new C();AU.ctx=c;
  const cp=c.createDynamicsCompressor();cp.threshold.value=-14;cp.ratio.value=4;cp.connect(c.destination);
  AU.mst=c.createGain();AU.mst.connect(cp);AU.mus=c.createGain();AU.fx=c.createGain();AU.mus.connect(AU.mst);AU.fx.connect(AU.mst);AU.nb=noiseBuf(c);auVol();
  for(const k in AUD)if(k.slice(0,3)!='bgm')auLoad(k);if(AU.trk)auLoad(AU.trk)}catch(e){AU.ctx=null}}
function auVol(){const b=$('mb');if(b){b.textContent=['🔊','🔉','🔇'][AU.mode];b.title=['声音:全开','声音:只开音效','声音:静音'][AU.mode]+' (M)'}
  if(!AU.ctx)return;AU.mst.gain.value=AU.mode==2?0:.8;AU.mus.gain.value=AU.mode==0?.45:0;AU.fx.gain.value=.7}
function auCycle(){AU.mode=(AU.mode+1)%3;try{localStorage.setItem('wuming-audio',AU.mode)}catch(e){}auInit();auVol()}
// 旧版合成音(2026-10-11 版原样恢复):关卡里的小怪、主角普攻 / W+J / S+J / 受击 / 跳跃、拾取、升级、通关等
function noiseBuf(c){const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function osc(c,dst,t,type,f0,f1,dur,vol,a){const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!=f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(a||.005));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dst);o.start(t);o.stop(t+dur+.03)}
function nz(c,dst,t,dur,vol,ft,f0,f1,q){const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.nb;f.type=ft;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+dur);f.Q.value=q||1;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(dst);s.start(t,Math.random()*.4);s.stop(t+dur+.03)}
const SYN={
  swing:(c,d,t)=>nz(c,d,t,.09,.5,'bandpass',1800,4200,1.2),
  heavy:(c,d,t)=>{nz(c,d,t,.2,.6,'bandpass',600,2400,1);osc(c,d,t+.05,'sine',140,55,.22,.5)},
  hit:(c,d,t)=>{osc(c,d,t,'square',260,90,.07,.16);nz(c,d,t,.05,.35,'highpass',1500)},
  shot:(c,d,t)=>osc(c,d,t,'square',520,1250,.09,.11),
  bigshot:(c,d,t)=>{osc(c,d,t,'sawtooth',260,900,.22,.15);osc(c,d,t,'square',130,450,.22,.07)},
  hurt:(c,d,t)=>{osc(c,d,t,'square',330,110,.22,.2);nz(c,d,t,.12,.3,'lowpass',900)},
  jump:(c,d,t)=>osc(c,d,t,'square',380,720,.09,.07),
  dj:(c,d,t)=>{osc(c,d,t,'square',560,1100,.1,.07);osc(c,d,t+.04,'triangle',840,1500,.1,.08)},
  dash:(c,d,t)=>nz(c,d,t,.28,.5,'bandpass',500,3500,2),
  thunder:(c,d,t)=>{nz(c,d,t,.35,.7,'lowpass',3000,300);osc(c,d,t,'sawtooth',90,40,.3,.18)},
  zap:(c,d,t)=>{nz(c,d,t,.18,.4,'highpass',2500,800);osc(c,d,t,'square',1400,200,.12,.07)},
  slam:(c,d,t)=>{osc(c,d,t,'sine',110,38,.4,.7);nz(c,d,t,.3,.5,'lowpass',700,120)},
  wave:(c,d,t)=>{osc(c,d,t,'sawtooth',220,880,.3,.13);nz(c,d,t,.3,.3,'bandpass',1200,4000,3)},
  blink:(c,d,t)=>{osc(c,d,t,'sine',900,1900,.12,.18);osc(c,d,t+.05,'sine',1400,2600,.1,.1)},
  fire:(c,d,t)=>{nz(c,d,t,.35,.5,'lowpass',1400,300);osc(c,d,t,'sawtooth',160,90,.25,.08)},
  cloud:(c,d,t)=>nz(c,d,t,.8,.4,'lowpass',300,120),
  eatk:(c,d,t)=>{osc(c,d,t,'sawtooth',170,85,.14,.12);nz(c,d,t,.08,.2,'bandpass',900)},
  peck:(c,d,t)=>osc(c,d,t,'square',900,500,.04,.09),
  proj:(c,d,t)=>osc(c,d,t,'square',480,220,.12,.08),
  roar:(c,d,t)=>{osc(c,d,t,'sawtooth',120,60,.45,.2);osc(c,d,t,'square',90,50,.45,.07);nz(c,d,t,.4,.3,'lowpass',600,200)},
  boom:(c,d,t)=>{osc(c,d,t,'sine',90,30,.5,.8);nz(c,d,t,.45,.6,'lowpass',900,100)},
  tongue:(c,d,t)=>osc(c,d,t,'sine',250,1100,.16,.22),
  sand:(c,d,t)=>nz(c,d,t,.6,.45,'bandpass',900,500,.8),
  storm:(c,d,t)=>{nz(c,d,t,2.2,.5,'lowpass',500,1800);osc(c,d,t,'sawtooth',70,55,1.5,.1)},
  buff:(c,d,t)=>[440,554,659].forEach((f,i)=>osc(c,d,t+i*.07,'triangle',f,0,.18,.15)),
  coin:(c,d,t)=>{osc(c,d,t,'square',988,0,.08,.09);osc(c,d,t+.08,'square',1319,0,.2,.09)},
  lvl:(c,d,t)=>[523,659,784,1047].forEach((f,i)=>osc(c,d,t+i*.08,'square',f,0,.14,.09)),
  win:(c,d,t)=>[523,659,784,1047,784,1047].forEach((f,i)=>osc(c,d,t+i*.11,'square',f,0,i==5?.5:.14,.1)),
  howl:(c,d,t)=>{osc(c,d,t,'triangle',300,690,.7,.17,.2);osc(c,d,t+.62,'triangle',690,380,1.1,.15,.05);osc(c,d,t,'sine',600,1380,.7,.05,.25);nz(c,d,t,1.4,.08,'bandpass',900,600,2)},
  breath:(c,d,t)=>{nz(c,d,t,.45,.3,'bandpass',700,300,.9);nz(c,d,t+.55,.5,.22,'bandpass',500,250,.9)},
  step:(c,d,t)=>nz(c,d,t,.09,.4,'lowpass',600,180,.7),
  lose:(c,d,t)=>[392,370,349,330].forEach((f,i)=>osc(c,d,t+i*.22,'triangle',f,0,.3,.18))};
// 各合成音的音量调整(旧版原样)
const SG={howl:1.5,breath:1.6,step:1.8,jump:2.6,dj:2.6,proj:2.8,peck:2.2,coin:2.8,lvl:2.8,win:2.8,shot:2,dash:2,cloud:2.5,eatk:2,buff:2,wave:2,blink:1.5,bigshot:1.6,lose:1.5,boom:.6,slam:.7,thunder:.8};
function syn(n,v){if(!AU.ctx||AU.mode==2||!SYN[n]||!AU.nb)return null;const c=AU.ctx,t=c.currentTime;if(t-(AU.last['s'+n]||-1)<.045)return null;AU.last['s'+n]=t;
  try{const g=c.createGain();g.gain.value=(SG[n]||1)*(v||1);g.connect(AU.fx);SYN[n](c,g,t);setTimeout(()=>g.disconnect(),3000)}catch(e){}return null}
// 播放音效:有同名合成音的,除了首领出招(SFXB=1)以外都播合成音;其余播外部素材。
// 外部素材:同名 45 毫秒内只播一次;音调随机 ±4%;d = 持续秒数(比素材长就循环,到时间淡出);返回句柄,sfxStop 可以提前停
let SFXB=0;const PSKV=.6;
// 主角技能(H U I O、空格系列)用旧版合成音,音量 ×0.6(2026-10-12 第五轮:降低 40%)
function psx(...n){for(const k of n)if(k)syn(k,PSKV)}
function sfx(n,v,d){if(SFXB&&!BSF&&!PFX[n])return null;  // 首领 AI 里的出招音效不再播(改成 bossVoice 按间隔随机播);主角受击等反馈音照常
  if(SFXB&&B&&B.max&&BSX[B.k]){const o=BSX[B.k],m=o[B.act+':'+n]||o[n];if(m&&AU.buf[m])n=m}if(BXN.has(n))v=(v||1)*BKV;
  if(SYN[n]&&!(SFXB&&AU.buf[n]))return syn(n,v);if(!AU.ctx||AU.mode==2||!AU.buf[n])return null;const c=AU.ctx,t=c.currentTime;if(t-(AU.last[n]||-1)<.045)return null;AU.last[n]=t;
  try{const b=AU.buf[n],s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.playbackRate.value=.96+Math.random()*.08;g.gain.value=v||1;s.connect(g);g.connect(AU.fx);s.start(t);
    const h={s,g};if(d){if(d>b.duration)s.loop=true;const e=t+d;g.gain.setValueAtTime(v||1,Math.max(t,e-.1));g.gain.linearRampToValueAtTime(0,e);s.stop(e+.02);AU.lp.add(h);s.onended=()=>AU.lp.delete(h)}return h}catch(e){return null}}
// 停掉所有带时长的(循环)音效:首领被击败、回城、进关卡时调用,免得招式音效一直响
function sfxAll(){for(const h of AU.lp)sfxStop(h,.05);AU.lp.clear()}
function sfxStop(h,f){if(!h||!AU.ctx)return;AU.lp.delete(h);const t=AU.ctx.currentTime;f=f||.08;try{h.g.gain.cancelScheduledValues(t);h.g.gain.setValueAtTime(h.g.gain.value,t);h.g.gain.linearRampToValueAtTime(0,t+f);h.s.stop(t+f+.02)}catch(e){}}
// BGM:n = 曲名(null 停止),循环播放;sp = 播放速度(首领狂暴时略快)。换曲时释放不再用的曲子(只留同一关的关卡曲 / 首领曲)
function bgmSet(n,tr,sp){sp=sp||1;if(AU.trk==n){if(AU.src&&AU.src.playbackRate.value!=sp)AU.src.playbackRate.value=sp;return}AU.trk=n;AU.sp=sp;
  if(n){const g=n.replace(/b$/,'');for(const k in AU.buf)if(k.slice(0,3)=='bgm'&&k.replace(/b$/,'')!=g)delete AU.buf[k];auLoad(n)}bgmPlay()}
function bgmPlay(){if(AU.src){const s=AU.src,g=AU.srcG,c=AU.ctx;try{g.gain.setValueAtTime(g.gain.value,c.currentTime);g.gain.linearRampToValueAtTime(0,c.currentTime+.6);s.stop(c.currentTime+.65)}catch(e){}AU.src=null}
  if(!AU.ctx||!AU.trk||!AU.buf[AU.trk])return;const c=AU.ctx,s=c.createBufferSource(),g=c.createGain();s.buffer=AU.buf[AU.trk];s.loop=true;s.playbackRate.value=AU.sp||1;
  g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(1,c.currentTime+.8);s.connect(g);g.connect(AU.mus);s.start();AU.src=s;AU.srcG=g}
// 怪物出招音效:状态切换时播放(只播屏幕内的)。小怪 = 旧版合成音;首领 = 外部素材,eatk / roar 换成各自的叫声(MVO),风暴 / 沙暴循环到招式结束(SUS)
const ESF={leap:'dash',ambush:'blink',rush:'roar',ghost:'blink',combo:'roar',pounce:'roar',ult:'roar',db:'eatk',pj:'eatk',sp:'proj',bu:'sand',cw:'eatk',ch:'roar',pk:'peck',kw:'eatk',L:'eatk',claw:'eatk',sweep:'roar',sting:'eatk',buff:'buff',spit:'proj',charge:'roar',bite:'eatk',tail:'roar',tongue:'tongue',spray:'sand',wall:'roar',ceil:'roar',burrow:'sand',storm:'storm',sw:'dash',tk:'roar',th:'eatk',in:'eatk',slp:'eatk',cu:'roar',pop:'roar',paw:'roar',slam:'roar',skate:'dash',hug:'roar',bliz:'storm',roar:'roar',ball:'eatk',dvw:'blink',fbw:'proj',gdv:'blink',hdv:'blink',rmw:'roar',rv:'roar'};
const MVO={boss:'b_moo',mage:'v_shade'};
// 第三~七关首领专属音效(2026-10-12 第五轮,动物叫声 + 攻击方式;art_src/audio/build_audio.py 的 k_ / sc_ / lz_ / br_ / w_):
// '@招式' = 出招(状态切换)时播;'招式:原音效名' = 招式进行中把通用音效换掉;'原音效名' = 整场替换。音量 ×BKV
const BKV=.75,BSX={
  king:{'@bite':'k_bite','@charge':'k_rattle','@spit':'k_spit','@buff':'k_buff','charge:boom':'k_bump'},
  sco:{'@claw':'sc_claw','@sweep':'sc_chit','@sting':'sc_chit','@buff':'sc_buff','sweep:boom':'sc_tail','sting:boom':'sc_sting'},
  bear:{'@paw':'br_growl','paw:slam':'br_paw','@slam':'br_growl','slam:boom':'br_slam','slam:slam':'br_slam','@combo':'br_growl','combo:slam':'br_paw','combo:boom':'br_slam','@charge':'br_growl','charge:boom':'br_crash',
    '@ball':'br_growl','ball:proj':'br_throw','@skate':'br_skate','skate:boom':'br_crash','@roar':'br_growl','roar:roar':'br_roar','roar:storm':'br_ice','@hug':'br_growl','hug:roar':'br_roar','hug:boom':'br_paw','@bliz':'br_bliz','bliz:storm':'br_roar',zap:'br_ice'},
  yin:{'@cry':'y_cry','@tp':'y_tp','@claw':'y_laugh','@sum':'y_sum','@cra':'y_cradle','@chn':'y_cry','@crl':'y_crawl','@ult':'y_ult'}};  // 第八关怨婴(2026-10-13):哭声合成,见 build_audio.py 的 y_
const BXN=new Set([].concat(...Object.values(BSX).map(Object.values)));
// 2026-10-13 第九轮:所有首领音效改成按时间间隔播放 —— 出招时不再播;首领战中每隔 BSI 秒(区间内随机)从该首领的音效里随机挑一个播。
// 各首领的音效按前缀从 AUD 里取(BSP_);PFX = 首领 AI 里照常播的主角反馈音;BSF=1 时强制播放(bossVoice、第八关暴走哭声循环)
const BSI=[3,6.5],BSP_={fk:'l9_',boss:'b_',mage:'v_',king:'k_',sco:'sc_',andr:'lz_',bear:'br_',wiz:'g10_',yin:'y_',lava:'l9_',gui:'g10_',ham:'h_'},PFX={hurt:1,hit:1,blink:1,coin:1,lvl:1,win:1,lose:1};let BSF=0;
const BSR={nmr:['lz_growl','l9_growl'],dmn:['g10_shriek','g10_laugh','g10_flap'],gui:['g10_shriek','g10_laugh','g10_flap'],ham:['h_squeak'],andr:['lz_growl','lz_rock','l9_growl'],wiz:['g10_laugh','l9_laugh','v_shade']};  // 第十七轮:古神 / 巫王的随机叫声  // 2026-10-13 第十三轮:这两个首领随机只播叫声,招式音效跟着出招播(bsfx)
const BSL=k=>{if(BSR[k])return BSR[k];const p=BSP_[k];return p?Object.keys(AUD).filter(n=>n.startsWith(p)&&n!='y_cryl'):[]};
const bsfx=(n,v,d)=>{BSF=1;const h=sfx(n,v,d);BSF=0;return h};  // 首领 AI 里强制播外部音效
function bossVoice(dt){if(!bossOn||!B||!(B.hp>0)||st!='play')return;B.vT=(B.vT==null?rnd(1,2.5):B.vT)-dt;if(B.vT>0)return;B.vT=BSR[B.k]?rnd(5,9):rnd(BSI[0],BSI[1]);
  const L=BSL(B.k);if(!L.length)return;const n=L[Math.random()*L.length|0];BSF=1;sfx(n,1,SUS[n]?2.5:0);BSF=0}
const SUS={y_crawl:1,storm:1,sand:1,k_rattle:1,lz_dig:1,lz_storm:1,br_skate:1,br_bliz:1};
function esfx(e){const sg=(e.act||'')+(e.lg>0?'L':'')+(e.s||'');if(sg!==e.psg){e.psg=sg;if(e.sh){sfxStop(e.sh);e.sh=null}const bo=e.max&&BSX[e.k];let n=(bo&&e.act&&bo['@'+e.act])||ESF[e.act||(e.lg>0?'L':e.s)];if(n&&e.x+e.w>cam-40&&e.x<cam+VW+40){
  if(!e.max){sfx(n);return}if((n=='eatk'||n=='roar')&&MVO[e.k])n=MVO[e.k];e.sh=sfx(n,SUS[n]&&BXN.has(n)?.8:1,SUS[n]?20:0)}}}
const MSC=1.25;  // 小怪体型放大(碰撞盒和画面一起放大)
// 怪物体积(2026-10-12):小怪 = 玩家的 1.25 倍,首领 = 玩家的 2.25 倍。按「体积」比:画面上实测的 宽×高 开方(VSZ,放大前),玩家身体约 32×56;
// 只放大不缩小(鸵鸟、北极熊本来就比目标大,保持原样)。碰撞盒、画面一起放大
const VSZ={slime:[24,20],skel:[20,45],bat:[17,15],snake:[22,20],ape:[35,44],ysco:[49,33],bsco:[49,33],spi:[34,35],ost:[52,66],pen:[22,33],pen2:[25,38],seal:[54,20],seal2:[54,20],dog:[33,23],dog2:[33,33],gfly:[20,28],gfly2:[20,28],gland:[24,58],gland2:[26,58],imp:[40,58],fwisp:[30,34],
  ham:[44,40],boss:[96,96],mage:[34,63],king:[78,93],sco:[99,69],andr:[52,86],bear:[126,105],wiz:[60,90]},PSZ=Math.sqrt(32*56);
const szF=(k,big)=>{const v=VSZ[k];return v?Math.max(1,(big?2.25:1.25)*PSZ/Math.sqrt(v[0]*v[1])):1};
function mk(k,px,m){m=m||1;const d={slime:[28,20,20],skel:[24,34,36],bat:[26,16,12],snake:[30,14,26],ape:[28,30,40],ysco:[30,18,30],bsco:[34,20,60],spi:[26,14,28],ost:[30,44,55],pen:[24,26,30],pen2:[28,30,50],seal:[36,20,42],seal2:[40,24,66],dog:[30,18,46],dog2:[38,24,82],gfly:[22,24,30],gfly2:[24,26,52],gland:[24,40,50],gland2:[26,42,84],imp:[26,40,55],wimp:[28,26,60],eye:[28,22,50],swing:[30,28,100],fwisp:[24,24,40],golem:[44,44,150],oni:[40,70,220],gbot:[32,30,70],zdr:[30,26,55],tank:[42,42,170],skw:[30,46,80],gob:[28,32,60],nwz:[38,62,200],fwm:[34,30,70],mmt:[30,48,90],fsm:[36,60,210],nja:[30,44,96],nsh:[30,44,88],ron:[36,46,230],ckb:[30,34,100],ckr:[30,34,80]}[k];const e={k,x:px,w:Math.round(d[0]*MSC),h:Math.round(d[1]*MSC),vs:k=='ysco'||k=='bsco'?1:MSC,hp:Math.round(d[2]*(MHK[cur>=14?cur-2:Math.min(cur,11)]||8)*STK().hp),m,dm:(1+(m-1)*.6)*STK().atk,o:px,fl:0,ph:Math.random()*6,f:-1};{const f=szF(k);if(f>1){e.w=Math.round(e.w*f);e.h=Math.round(e.h*f);e.vs*=f;e.sz=f}}e.y=k=='bat'?95+Math.random()*45:k=='gfly'||k=='gfly2'||k=='fwisp'||k=='wimp'||k=='eye'||k=='swing'||k=='zdr'?GY-e.h-rnd(110,150):GY-e.h;if(k=='gland2')e.dis=1;e.by=e.y;e.hp0=e.hp;e.zi=ZB.findIndex(b=>px<b);
  // 小怪防御(2026-10-12):按关卡倍率 m 递增,第一关 0;精英(黑棘蝎 / 精英企鹅 / 精英海豹 / 双头狗)×1.5。
  // 减伤 = 防御×1.5 ÷ (100 + 防御×1.5):第七关普通 13 → 约 16%,精英 20 → 约 23%,低级玩家照样打得动
  {const d=Math.round(((m-1)*1.2+STK().def)*(MDEL[k]?1.5:1));if(d>0)e.def=d}return e}
// 第十六轮:小怪血量 = 基础值 × MHK[关卡](原来 × 关卡倍率 × EHP 7,后期怪 8~10 关太厚);按「同关精良 +5 装备普攻 5 下左右打死」校准
const MHK=[0,8,10,20,18,30,31,32,50,56,58,30,64,74,82,88,90,200];  // 第四十八轮:[17] = 第十五关不眠钟楼(cur 19,小怪数值膨胀)  // 第四十七轮:[16] = 第十四关月影忍城(cur 18)  // 第四十二轮:[14] = 第十三关熔心火山(cur 16)  // 第四十一轮:[13] = 第十二关永夜王城(cur 15)  // 第四十轮:[12] = 第十一关齿轮要塞(cur 14)
const MDEL={bsco:1,pen2:1,seal2:1,dog2:1,gfly2:1,gland2:1,oni:1,golem:1,swing:1,tank:1,nwz:1,fsm:1,ron:1};
const SL={head:['头饰','💇'],body:['战甲','🛡️'],ring:['戒指','💍'],ear:['项链','📿'],sword:['剑','🗡️'],staff:['法杖','🪄']};
const TR=[['普通','#adb5bd',1],['精良','#51cf66',1.6],['稀有','#4dabf7',2.4],['史诗','#cc5de8',3.4]];
// 装备系列:0 旅者(第一、二关 / 商店) · 1 林王(第三、四关) · 2 荒漠(第五关,身体部位带特性)
// m 作用于生命/魔力/攻击,d 作用于防御(防御是减法公式,涨太快会让小怪完全打不疼,所以涨得慢一些)
const SER=[{n:'旅者',m:1,d:1},{n:'林王',m:6,d:3},{n:'荒漠',m:13,d:6},{n:'雪原',m:22,d:10},{n:'机械',m:30,d:13}];  // 4 机械:第十一关齿轮要塞掉落(第四十轮)  // 3 雪原:第八关起掉落(2026-10-13)
// 特性:[名称, 颜色, 说明, 2 件效果, 4 件追加效果](4 件 = 2 件效果 + 4 件追加)
// 第四十二轮:圣愈 2 件 = 防御力 +15%,4 件 = 每秒回复 2% 最大生命;邪灵 2 件 = 魔力 +25%,4 件 = 技能伤害 +(最大魔力 ÷ LINGK)%(最多 +40%);两套原来的回血 / 回魔取消
const TRT={lei:['怒雷','#fab005','暴击率',.05,.05],yu:['圣愈','#51cf66','防御力 / 回血',.15,.02],ling:['邪灵','#9775fa','魔力 / 技能伤害',.25,0],ji:['神技','#339af0','每次连击攻击力',.01,.01],xue:['热血','#fa5252','损失生命转化攻击力',.25,.35]};
const TRK=Object.keys(TRT),BODY=['head','body','ring','ear'],TRS=BODY.concat(['sword','staff']);  // TRS:算套装件数的 6 个部位(武器用「武器幻化券」加了特性才算)
// 6 件效果(第四十二轮):邪灵 宠物技能伤害 / 暴击伤害 +25% · 圣愈 受到伤害的 10% 反弹给最近的敌人 · 神技 关卡内每击杀 1 个敌人攻击 +0.5%(最多 +20%,被怪物打中掉 60% 层数)
//   怒雷 敌人每受到一次暴击防御 -3%(最多 -30%)· 热血 攻击力 + 最大生命 × 3%
const LINGK=80,LINGMX=.4,YU6=.1,JI6=.005,JI6N=40,LEI6=.03,LEI6N=10,XUE6=.03,LING6=.25;
const TR6={lei:`敌人每受到一次暴击,防御力 -${LEI6*100}%(最多 -${LEI6*LEI6N*100}%)`,yu:`受到伤害的 ${YU6*100}% 反弹给最近的敌人`,ling:`宠物的技能伤害和暴击伤害 +${LING6*100}%`,ji:`关卡内每击杀 1 个敌人攻击力 +${JI6*100}%(最多 +${JI6*JI6N*100}%);被怪物打中时失去 60% 层数`,xue:`最大生命的 ${XUE6*100}% 转化为攻击力`};
function trDesc(k){const q=TRT[k],pc=v=>+(v*100).toFixed(1)+'%';
  return (k=='ji'?`2 件:每次命中攻击 +1%(最多 12 层),闪避率 +${JIDG[0]}% · 4 件:每层改为 +2%(最多 15 层,即 +30%),闪避率再 +${JIDG[1]}%(合计 ${JIDG[0]+JIDG[1]}%)。2 秒没打中或自己受伤会清空连击,闪避成功不会清空`
   :k=='xue'?`2 件:每损失 10% 生命,攻击 +2.5% · 4 件:每损失 10% 生命,攻击 +6%(剩 20% 血时 +48%)`
   :k=='yu'?`2 件:防御力 +${pc(q[3])} · 4 件:每秒回复最大生命的 ${pc(q[4])}`
   :k=='ling'?`2 件:魔力 +${pc(q[3])} · 4 件:技能伤害 +(最大魔力 ÷ ${LINGK})%,最多 +${pc(LINGMX)}(现在 +${pc(lingSkB())})`
   :`2 件:${q[2]} +${pc(q[3])} · 4 件:再 +${pc(q[4])}(合计 ${pc(q[3]+q[4])})`+(k=='lei'?',暴击造成 2 倍伤害':''))+` · 6 件:${TR6[k]}`}
// 暴击率 / 闪避率词条(百分数):发型、戒指、耳坠带暴击率,铠甲带闪避率;按品质和系列成长,强化同样 +10%/级
const JIDG=[2,2];
// 第十九轮:装备的暴击 / 闪避词条改成数值显示(没有 %);CRPT 点暴击 = 1% 暴击率,DGPT 点闪避 = 1% 闪避率(换算不在游戏里说明)
// 第二十轮重算:原来 1223 / 300 让属性石的 80~108 暴击、50~72 闪避几乎等于 0;改成 60 / 30 后低级属性石 ≈ 1.3% 暴击 / 1.7% 闪避,
// 中级 ≈ 1.8% / 2.4%,五颗全镶同一项约 +9% 暴击 / +12% 闪避;装备词条按百分比不变换算(migIt v7),满配暴击约 50%、闪避约 25%(上限 35%)
const CRPT=60,DGPT=30,CRPT0=1223,DGPT0=300;
