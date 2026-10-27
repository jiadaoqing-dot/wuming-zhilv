# 第六十四轮(用户):原创英文舞曲《Nameless Tonight》—— 暗黑炼狱 30 层通关后的庆功舞(573 分块 DNC)用的 BGM
# 全部由本脚本合成(没有用任何外部音乐素材):鼓 / 贝斯 / 合成器和弦 / 拨弦琶音 / 主旋律都是 numpy 算出来的;
# 人声:先用 Windows 自带的英文语音 Microsoft Zira 把歌词一个词一个词念出来(System.Speech),
#   再做「交叉合成」:取语音的频谱包络(共振峰 = 听得出是哪个词),换上按旋律音高合成的锯齿波,得到电音风格的「唱」声(副歌加三度和声)。
# 128 BPM、A 小调、96 小节 = 3 分钟:前奏 8 · 主歌 16 · 导歌 8 · 副歌 16 · 间奏 8 · 主歌二 8 · 导歌 8 · 副歌二 16 · 尾声 8
# 输出 raw/audio/bgm/r64/nameless_dance.wav(32 kHz 立体声),再由 build_audio.py 转成 assets/au_bgmD.ogg:
#   python art_src/audio/build_song64.py  →  python art_src/audio/build_audio.py bgmD
# 小节表(SEC)和歌词表要和 src/parts/573_庆功舞.js 的 DNS / DNL 对得上(脚本最后会打印 DNL)
import os,sys,json,subprocess,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,sosfilt_zi,fftconvolve
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTD=os.path.join(ROOT,'raw','audio','bgm','r64');TTSD=os.path.join(OUTD,'tts');os.makedirs(TTSD,exist_ok=True)
SR=32000;BPM=128;SPB=60/BPM;BAR=4*SPB;NBAR=96;TAIL=3.0;N=int((NBAR*BAR+TAIL)*SR)
RS=np.random.RandomState(64)
def T(bar,beat=0):return (bar*4+beat)*SPB
def hz(m):return 440*2**((m-69)/12)
def sos_lp(f,o=2):return butter(o,min(f,SR*.45)/(SR/2),output='sos')
def sos_hp(f,o=2):return butter(o,f/(SR/2),'high',output='sos')
def sos_bp(a,b,o=2):return butter(o,[a/(SR/2),min(b,SR*.45)/(SR/2)],'band',output='sos')
def st():return np.zeros((N,2))
def add(tr,t,sig,pan=0,g=1):  # 单声道信号按声像放进立体声轨
  i=int(t*SR)
  if i>=N:return
  sig=sig[:N-i]*g;tr[i:i+len(sig),0]+=sig*np.cos((pan+1)*np.pi/4)*1.414;tr[i:i+len(sig),1]+=sig*np.sin((pan+1)*np.pi/4)*1.414
def add2(tr,t,sig,g=1):
  i=int(t*SR)
  if i>=N:return
  sig=sig[:N-i]*g;tr[i:i+len(sig)]+=sig
def adsr(n,a=.005,d=.1,s=.7,r=.05):
  e=np.ones(n)*s;A=max(1,int(a*SR));D=max(1,int(d*SR));R=max(1,int(r*SR))
  e[:A]=np.linspace(0,1,A)[:n] if n>=A else np.linspace(0,1,n)
  if n>A:k=min(D,n-A);e[A:A+k]=np.linspace(1,s,D)[:k]
  if n>R:e[-R:]*=np.linspace(1,0,R)
  return e
def saw(f,ph0=None):  # 带限锯齿波(polyBLEP),f = 每个采样的频率
  f=np.broadcast_to(f,f.shape) if np.ndim(f) else f;dt=np.asarray(f,float)/SR
  ph=(np.cumsum(dt)+(RS.rand() if ph0 is None else ph0))%1.0;y=2*ph-1
  m=ph<dt;t=ph[m]/dt[m];y[m]-=t+t-t*t-1
  m=ph>1-dt;t=(ph[m]-1)/dt[m];y[m]-=t*t+t+t+1
  return y
def ssaw(m,n,det=(-12,-5,0,5,12)):  # 超级锯齿(几个失谐的锯齿叠起来),返回左右两路
  L=np.zeros(n);R=np.zeros(n)
  for i,c in enumerate(det):
    y=saw(np.full(n,hz(m+c/100)));p=(i/(len(det)-1))*2-1 if len(det)>1 else 0
    L+=y*(1-p)*.5;R+=y*(1+p)*.5
  return L/len(det),R/len(det)
def varf(x,fc,kind='lp',B=512):  # 随时间变化的滤波(按块换系数)
  y=np.zeros_like(x);zi=None
  for i in range(0,len(x),B):
    f=float(fc(i/SR));s=sos_lp(f) if kind=='lp' else sos_hp(f)
    if zi is None:zi=sosfilt_zi(s)*0
    y[i:i+B],zi=sosfilt(s,x[i:i+B],zi=zi)
  return y
noise=lambda n:RS.randn(n)
# ===================== 和弦进行 =====================
VO={'Am':[57,60,64,69],'F':[53,60,65,69],'C':[55,60,64,67],'G':[55,59,62,67],'Em':[55,59,64,67],'E':[56,59,64,68]}
RT={'Am':33,'F':29,'C':36,'G':31,'Em':28,'E':28}
LOOP=['Am','F','C','G'];PREC=['F','G','Em','Am','F','G','E','E']
SEC=[('intro',0,8),('verse',8,16),('pre',24,8),('chorus',32,16),('break',48,8),('verse2',56,8),('pre2',64,8),('chorus2',72,16),('outro',88,8)]
def sec(b):
  for n,s,l in SEC:
    if s<=b<s+l:return n
  return 'end'
CHD=[(PREC[(b-24)%8] if sec(b) in('pre','pre2') else LOOP[b%4]) for b in range(NBAR)]
# ===================== 歌词与旋律 =====================
# 每句 2 小节:「词-里-的-音节」用 - 连起来;旋律 = 每个音节一个音(MIDI);节奏模板 = (起拍, 拍数)
T7=[(0,.5),(.5,.5),(1,.5),(1.5,.5),(2,.5),(2.5,.5),(3,2.5)];T6=[(0,.5),(.5,.5),(1,1),(2,.5),(2.5,.5),(3,2.5)];T5=[(0,1),(1,1),(2,.5),(2.5,.5),(3,2.5)]
V1=[("Thir-ty floors of fire and stone",[64,64,64,62,64,67,69],T7,"三十层的烈火和岩石"),
    ("Ev-ery door I walked a-lone",[64,64,64,62,64,62,60],T7,"每一扇门,我都独自走过"),
    ("Now the tow-er lights are green",[64,64,64,62,64,67,69],T7,"如今宝塔亮起了绿光"),
    ("Bright-est night I've ev-er seen",[67,67,69,67,64,62,64],T7,"这是我见过最亮的夜晚"),
    ("Sword is shin-ing in my hand",[64,64,64,62,64,67,69],T7,"剑在我的手里发光"),
    ("Ma-gic danc-ing where we stand",[64,64,64,62,64,62,60],T7,"魔法在我们脚边起舞"),
    ("No more mon-sters, no more fight",[69,69,67,64,67,67,69],T7,"没有怪物,也没有战斗"),
    ("On-ly mu-sic in the night",[67,67,69,67,64,62,64],T7,"夜里只剩下音乐")]
PRE=[("They nev-er gave me a name",[64,65,67,69,67,65,64],T7,"他们从没给过我名字"),
     ("But I nev-er lost the flame",[64,65,67,69,71,69,67],T7,"可我心里的火从没熄灭"),
     ("Hear the beat, feel it rise",[69,69,71,72,71,72],T6,"听那节拍,感受它升起"),
     ("One, two, three, o-pen your eyes",[71,71,71,72,74,71,68],T7,"一、二、三,睁开眼睛")]
CH=[("We are name-less, we are free",[72,72,74,72,69,67,69],T7,"我们没有名字,我们自由自在"),
    ("Thir-ty floors be-neath our feet",[72,72,74,72,69,67,64],T7,"三十层宝塔踩在脚下"),
    ("Sword and spell, left and right",[76,74,72,72,74,76],T6,"剑与魔法,一左一右"),
    ("We're the he-roes of the night",[72,72,74,72,69,71,69],T7,"我们是今夜的英雄"),
    ("Na na name-less, shine so bright",[76,76,76,74,72,74,76],T7,"无名,无名,闪闪发光"),
    ("Move your bo-dy, feel the light",[72,72,74,72,69,67,69],T7,"舞动身体,感受光芒"),
    ("Sword and spell, left and right",[76,74,72,72,74,76],T6,"剑与魔法,一左一右"),
    ("Dance un-til the morn-ing light",[72,72,74,72,71,71,69],T7,"一直跳到天亮")]
BRK=[("Oh, oh, oh, oh, oh",[69,72,76,74,72],T5,"哦——哦——"),("Oh, oh, oh, oh, oh",[69,72,76,79,76],T5,"哦——哦——"),
     ("Oh, oh, oh, oh, oh",[69,72,76,74,72],T5,"哦——哦——"),("Oh, oh, oh, oh, oh",[72,74,76,79,79],T5,"哦——哦——")]
V2=[("God-dess sleep-ing, can you hear",[64,64,64,62,64,67,69],T7,"沉睡的女神,你听见了吗"),
    ("All your chil-dren danc-ing here",[64,64,64,62,64,62,60],T7,"你的孩子们正在这里跳舞"),
    ("Twelve dark kings have turned to dust",[64,64,64,62,64,67,69],T7,"十二位魔王化成了尘土"),
    ("Now the on-ly kings are us",[67,67,69,67,64,62,64],T7,"现在,我们就是王")]
OUT=[CH[0],CH[7],("Name-less",[72,69],[(0,1),(1,3)],"无名"),("Dance to-night",[72,71,69],[(0,1),(1,1),(2,6)],"今夜起舞")]
HEY=("Hey",[76],[(2,1)],"嘿!")
LYR=[]  # (起始小节, 句子, 是否加和声)
for i,l in enumerate(V1):LYR.append((8+2*i,l,0))
for b0 in (24,64):
  for i,l in enumerate(PRE):LYR.append((b0+2*i,l,0))
for b0 in (32,72):
  for i,l in enumerate(CH):LYR.append((b0+2*i,l,1))
for i,l in enumerate(BRK):LYR.append((48+2*i,l,1))
for i,l in enumerate(V2):LYR.append((56+2*i,l,0))
for i,l in enumerate(OUT):LYR.append((88+2*i,l,1))
SCALE=[45,47,48,50,52,53,55,57,59,60,62,64,65,67,69,71,72,74,76,77,79,81,83,84]
def third(m):  # 调内下方三度
  m2=m if m in SCALE else m+1;i=SCALE.index(m2);return SCALE[i-2]-(m2-m)
# ===================== 语音合成(Windows System.Speech,Microsoft Zira)=====================
def words():
  W=set()
  for _,l,_h in LYR+[(0,HEY,0)]:
    for w in l[0].split():W.add(w.replace('-','').strip(',.!?'))
  return sorted(W)
def wpath(w):return os.path.join(TTSD,w.lower().replace("'",'_')+'.wav')
def tts():
  need=[w for w in words() if not os.path.exists(wpath(w))]
  if not need:return
  lst=os.path.join(TTSD,'_list.txt');open(lst,'w',encoding='utf-8').write('\n'.join(w+'|'+wpath(w) for w in need))
  ps=r'''Add-Type -AssemblyName System.Speech
$s=New-Object System.Speech.Synthesis.SpeechSynthesizer;$s.SelectVoice('Microsoft Zira Desktop');$s.Rate=-1
$f=New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(32000,[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,[System.Speech.AudioFormat.AudioChannel]::Mono)
foreach($l in Get-Content -Encoding UTF8 'LST'){$p=$l.Split('|');$s.SetOutputToWaveFile($p[1],$f);$s.Speak($p[0])}
$s.SetOutputToNull()'''.replace('LST',lst)
  subprocess.run(['powershell','-NoProfile','-Command',ps],check=True)
# ===================== 人声:交叉合成 =====================
NF=1024;HOP=160;WIN=np.hanning(NF+1)[:-1];LIF=46
def stft(x):
  x=np.concatenate([np.zeros(NF//2),x,np.zeros(NF)]);n=1+(len(x)-NF)//HOP
  idx=np.arange(NF)[None,:]+HOP*np.arange(n)[:,None];return np.fft.rfft(x[idx]*WIN,axis=1)
def istft(S,n):
  fr=np.fft.irfft(S,n=NF,axis=1)*WIN;L=HOP*(len(S)-1)+NF;y=np.zeros(L);w=np.zeros(L)
  for i in range(len(S)):y[i*HOP:i*HOP+NF]+=fr[i];w[i*HOP:i*HOP+NF]+=WIN**2
  y=y/np.maximum(w,1e-3);return y[NF//2:NF//2+n]
def cenv(mag):  # 倒谱平滑 → 频谱包络(去掉语音自己的音高谐波)
  c=np.fft.irfft(np.log(mag+1e-7),n=NF,axis=1);c[:,LIF:NF-LIF]=0;return np.exp(np.fft.rfft(c,axis=1).real)
WC={}
def word(w):
  if w in WC:return WC[w]
  x,s=sf.read(wpath(w));x=x if x.ndim==1 else x.mean(1);a=np.abs(x);th=a.max()*.03
  k=np.where(a>th)[0];x=x[max(0,k[0]-160):k[-1]+320]
  S=stft(x);mag=np.abs(S);env=cenv(mag);fq=np.fft.rfftfreq(NF,1/SR)
  e=(mag**2).sum(1);hi=(mag[:,fq>3800]**2).sum(1)/(e+1e-9);uv=np.clip((hi-.18)/.4,0,1)
  ed=10*np.log10(e+1e-12);vo=np.where((ed>ed.max()-22)&(uv<.5))[0]
  a0,a1=(vo[0],vo[-1]) if len(vo) else (0,len(S)-1)
  env=env/np.sqrt((env[a0:a1+1]**2).sum(1).mean()+1e-9)
  WC[w]=(np.log(env+1e-9),uv,a0,a1);return WC[w]
def sing(w,notes,hm=0):
  """notes = [(相对起点秒, 秒数, midi)];返回 (起点偏移秒, 左, 右)"""
  le,uv,a0,a1=word(w);ns=len(le);D=notes[-1][0]+notes[-1][1];D=max(D-.04,.08)
  nt=int(D*SR/HOP)+1;on=a0;co=ns-1-a1;mid=max(1,a1-a0)
  # 时间映射:开头辅音、结尾辅音按原速,中间元音拉长 / 压缩到填满
  if nt>on+co+4:m=np.concatenate([np.arange(on),a0+np.linspace(0,mid,nt-on-co),a1+1+np.arange(co)])
  else:m=np.linspace(0,ns-1,nt)
  m=np.clip(m,0,ns-1);i0=np.floor(m).astype(int);i1=np.minimum(i0+1,ns-1);q=(m-i0)[:,None]
  E=np.exp(le[i0]*(1-q)+le[i1]*q);U=(uv[i0]*(1-q[:,0])+uv[i1]*q[:,0])
  pre=min(on*HOP/SR,.07)  # 辅音提前一点出声,元音正好落在拍上
  n=nt*HOP;tt=np.arange(n)/SR-pre;f=np.zeros(n)
  for (t0,du,mm) in notes:f[tt>=t0-.02]=mm
  f[f==0]=notes[0][2]
  # 滑音 + 颤音(每个音 0.22 秒以后渐入)
  sm=np.exp(-1/(.028*SR));lf=np.zeros(n);acc=f[0]
  for i in range(0,n,64):acc=acc*sm**64+f[i]*(1-sm**64);lf[i:i+64]=acc
  vib=np.zeros(n)
  for (t0,du,mm) in notes:
    k=(tt>=t0+.22)&(tt<t0+du);vib[k]=.22*np.sin(2*np.pi*5.6*(tt[k]-t0))*np.clip((tt[k]-t0-.22)/.25,0,1)
  out=[]
  for sh,g in ([(0,1),(-12,.32)]+([(None,.55)] if hm else [])):
    mm=lf+vib if sh is not None else np.array([third(int(round(v))) for v in f])+vib*.8
    if sh:mm=mm+sh
    fr=hz(mm);c=(saw(fr)+saw(fr*1.004)+saw(fr*.996))/3
    C=stft(c)[:nt];Cm=cenv(np.abs(C));Cw=C/(Cm+1e-6)
    Nz=stft(noise(n))[:nt];Nw=Nz/(cenv(np.abs(Nz))+1e-6)
    Y=Cw*E*(1-.85*U[:,None])+Nw*E*U[:,None]*.8
    y=istft(Y,n)*adsr(n,.008,.05,1,.06);out.append((y,g,sh))
  L=np.zeros(n);R=np.zeros(n)
  for y,g,sh in out:
    if sh is None:L+=y*g*.8;R+=y*g*.45
    else:L+=y*g;R+=y*g
  if hm:  # 和声再放一份到右边(稍微延迟,声像拉开)
    y=out[-1][0];d=int(.012*SR);R[d:]+=y[:-d]*.55*.8;L[d:]+=y[:-d]*.55*.45
  y=L+R;k=min(3,.2/(np.sqrt((y[np.abs(y)>np.abs(y).max()*.05]**2).mean())+1e-9))  # 每个词响度一致(主歌 / 副歌不会差太多;高音区单个音特别弱时最多放大 3 倍)
  return -pre,L*k,R*k
# ===================== 鼓 =====================
def kick():
  n=int(.42*SR);t=np.arange(n)/SR;f=48+120*np.exp(-t/.028);y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.2)
  y+=sosfilt(sos_hp(2500),noise(n))*np.exp(-t/.003)*.5;return np.tanh(y*1.6)
def clap():
  n=int(.4*SR);t=np.arange(n)/SR;b=sosfilt(sos_bp(900,3200),noise(n));e=np.zeros(n)
  for d in (0,.009,.018):k=t>=d;e[k]+=np.exp(-(t[k]-d)/.006)
  e+=.55*np.exp(-np.maximum(t-.02,0)/.11)*(t>.02);return b*e*.9
def hat(o=0):
  n=int((.32 if o else .07)*SR);t=np.arange(n)/SR;return sosfilt(sos_hp(7000 if not o else 6000,4),noise(n))*np.exp(-t/(.13 if o else .022))
def snare():
  n=int(.25*SR);t=np.arange(n)/SR;return sosfilt(sos_bp(1400,9000),noise(n))*np.exp(-t/.09)*.8+np.sin(2*np.pi*190*t)*np.exp(-t/.05)*.5
def crash(d=2.4):
  n=int(d*SR);t=np.arange(n)/SR;e=np.exp(-t/.75);return [sosfilt(sos_hp(3800),noise(n))*e*.6 for _ in range(2)]
def impact():
  n=int(1.6*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*np.cumsum(38+30*np.exp(-t/.08))/SR)*np.exp(-t/.5)+sosfilt(sos_lp(600),noise(n))*np.exp(-t/.25)*.6
KS,CL,HC,HO,SN,IM=kick(),clap(),hat(),hat(1),snare(),impact()
def build():
  tts()
  D=st();BS=st();PD=st();PL=st();LD=st();VX=st();FXT=st();kt=[]
  for b in range(NBAR):
    s=sec(b)
    for be in range(4):
      t=T(b,be)
      kon=(s in('verse','verse2','chorus','chorus2'))or(s=='intro' and b>=4)or(s in('pre','pre2') and (b-SEC[[x[0] for x in SEC].index(s)][1])<6)or(s=='outro' and b<93)or(s=='break' and b>=54 and be%2==0 and b<55)
      if kon:add(D,t,KS,0,.95);kt.append(t)
      if s in('verse','verse2','chorus','chorus2','outro') and be in(1,3) and b<94 and not(s=='verse' and b<16):add(D,t,CL,.05,.5)  # 主歌前 8 小节先不拍手
      if s in('break',) and be==3 and b%2==1 and b<54:add(D,t,CL,0,.4)
      if (s!='break' and s!='intro') or (s=='intro' and b>=2):
        if b<94:add(D,t+SPB/2,HO if s in('chorus','chorus2') else HC,.25,.32 if s in('chorus','chorus2') else .28)
      if s in('verse','verse2','chorus','chorus2','pre','pre2') and b<94:
        for q in (.25,.75):add(D,t+q*SPB,HC,-.35,.12+.05*(q==.75))
    if s in('pre','pre2'):
      b0=24 if s=='pre' else 64
      if b-b0>=6:  # 军鼓滚奏越来越密
        k=b-b0-6;st_=[4,8] if k==0 else [8,16]
        for half,dv in enumerate(st_):
          for i in range(dv//2):tt=T(b,half*2+i*4/dv);add(D,tt,SN,0,.25+.35*((k*2+half)/3)*(i/(dv/2)))
  for b in (8,32,48,56,72,88):c=crash();add2(D,T(b),np.stack(c,1),.35);add(D,T(b),IM,0,.45 if b in(32,72) else .2)
  c=crash(4);add2(D,T(95),np.stack(c,1),.45);add(D,T(95),IM,0,.6);add(D,T(95),KS,0,1)
  for b0 in (24,64):  # 导歌最后 4 小节:噪声上升音
    n=int(4*BAR*SR);t=np.arange(n)/SR/(4*BAR);x=noise(n)*(t**1.6);y=varf(x,lambda s:500*16**(s/(4*BAR)),'hp');add(FXT,T(b0+4),y,0,.22)
    rv=np.stack(crash(2.0),1)[::-1];add2(FXT,T(b0+8)-2.0,rv,.25)
  # 侧链:底鼓响的时候把和弦 / 贝斯压下去(舞曲的「抽吸」感)
  sc=np.ones(N);ta=np.arange(int(.32*SR))/SR;dip=1-.72*np.exp(-ta/.09)*(1-np.exp(-ta/.004))
  for t in kt:i=int(t*SR);k=min(len(dip),N-i);sc[i:i+k]=np.minimum(sc[i:i+k],dip[:k])
  # ---- 贝斯 ----
  for b in range(NBAR):
    s=sec(b);r=RT[CHD[b]]
    if s in('intro','break') or b>=95:
      if s=='break' or (s=='intro' and b>=4):
        n=int(BAR*SR);y=np.sin(2*np.pi*hz(r)*np.arange(n)/SR)*adsr(n,.02,.3,.8,.2);add(BS,T(b),y,0,.22)
      continue
    pat=[(be+q) for be in range(4) for q in ((.25,.5,.75) if s in('chorus','chorus2') else (.5,))]
    for p in pat:
      du=.22 if s in('chorus','chorus2') else .42;n=int(du*SPB*SR);m=r+12+(12 if s in('chorus','chorus2') and p%1==.75 else 0)
      y=saw(np.full(n,hz(m)))*.6+np.sin(2*np.pi*hz(r+12)*np.arange(n)/SR)*.7;y*=adsr(n,.004,.08,.6,.03);add(BS,T(b,p),y,0,.55)
  BS[:,0]=sosfilt(sos_lp(1100),BS[:,0]);BS[:,1]=BS[:,0]
  # ---- 和弦铺底(超级锯齿)----
  for b in range(NBAR):
    s=sec(b);n=int((BAR+.12)*SR);g={'intro':.5,'verse':.32,'pre':.42,'chorus':.48,'break':.42,'verse2':.32,'pre2':.45,'chorus2':.5,'outro':.45}[s]
    if b==95:n=int((BAR+2.5)*SR)
    for m in VO[CHD[b]]:
      L,R=ssaw(m,n);e=adsr(n,.03,.2,.85,.12 if b<95 else 2.4);add2(PD,T(b),np.stack([L*e,R*e],1),g*.3)
  def pcut(t):
    b=t/BAR;s=sec(int(b))
    if s=='intro':return 350*np.exp(np.log(5200/350)*min(1,b/8))
    if s=='break':return 1600+1800*np.sin(np.pi*(b-48)/8)
    if s in('pre','pre2'):b0=24 if s=='pre' else 64;return 1800+3800*((b-b0)/8)**2
    if s=='outro':return 5200*np.exp(-np.log(5200/600)*max(0,(b-90)/6))
    return 3600 if s in('verse','verse2') else 5600
  for ch in (0,1):PD[:,ch]=varf(PD[:,ch],pcut)
  # ---- 拨弦琶音(16 分音符)----
  for b in range(NBAR):
    s=sec(b)
    if s in('break',) and b<52:continue
    if b>=95:continue
    nt=VO[CHD[b]];seq=[nt[0]+12,nt[1]+12,nt[2]+12,nt[3]+12,nt[2]+12,nt[1]+12,nt[3]+12,nt[1]+12+12]
    g={'intro':.32,'verse':.18,'pre':.24,'chorus':.22,'break':.28,'verse2':.2,'pre2':.26,'chorus2':.24,'outro':.3}[s]
    for i in range(16):
      m=seq[i%8];n=int(.26*SR);t=np.arange(n)/SR;y=np.zeros(n)
      for h in range(1,14):
        if hz(m)*h>14000:break
        y+=np.sin(2*np.pi*hz(m)*h*t)/h*np.exp(-t*(6+h*3.2))
      add(PL,T(b,i/4),y,(-.4 if i%2 else .4),g)
  # ---- 主旋律(前奏后半、间奏后半、尾声)----
  HOOK=[(0,.5,76),(.5,.5,76),(1,.5,74),(1.5,1,72),(2.5,.5,69),(3,1,72),
        (4,.5,72),(4.5,.5,72),(5,.5,71),(5.5,1,69),(6.5,.5,67),(7,1,69),
        (8,.5,67),(8.5,.5,69),(9,.5,72),(9.5,1,76),(10.5,.5,74),(11,1,72),
        (12,.5,74),(12.5,.5,72),(13,.5,71),(13.5,1.5,71),(15,.5,74),(15.5,.5,76)]
  for b0 in (4,52,88,92):
    for (be,du,m) in HOOK:
      n=int((du*SPB+.08)*SR);L,R=ssaw(m+12,n,(-8,0,8));sq=np.sign(np.sin(2*np.pi*hz(m)*np.arange(n)/SR))*.25;e=adsr(n,.006,.12,.7,.08)
      add2(LD,T(b0,be),np.stack([(L+sq)*e,(R+sq)*e],1),.32 if b0!=4 else .26)
  for ch in (0,1):LD[:,ch]=sosfilt(sos_lp(5200),LD[:,ch])
  # ---- 人声 ----
  for b0,(txt,mel,rh,zh),hm in LYR+[(31,HEY,0),(71,HEY,0)]:
    sy=[];ws=[]
    for w in txt.split():
      parts=w.split('-');ws.append((w.replace('-','').strip(',.!?'),len(parts)))
    i=0
    for w,k in ws:
      nts=[(rh[i+j][0]*SPB,rh[i+j][1]*SPB,mel[i+j]) for j in range(k)];t0=nts[0][0];nts=[(a-t0,d,m) for a,d,m in nts]
      off,L,R=sing(w,nts,hm);add2(VX,T(b0)+t0+off,np.stack([L,R],1),.5);i+=k
  for ch in (0,1):VX[:,ch]=sosfilt(sos_hp(140),VX[:,ch])
  if os.environ.get('SONG_STEM'):  # 检查用:单独导出人声(16 kHz 单声道),可以拿语音识别听听歌词清不清楚
    from scipy.signal import resample_poly;v=resample_poly(VX.mean(1),1,2);v=v/np.abs(v).max()*.9;sf.write(os.path.join(OUTD,'_vox16k.wav'),v,16000,subtype='PCM_16')
  # 各分轨按副歌段(主旋律按前奏后半)的响度对齐到目标电平(dB)
  def lvl(tr,a,b):return np.sqrt((tr[int(T(a)*SR):int(T(b)*SR)]**2).mean())+1e-9
  for tr,db,a,b in ((D,-14,32,48),(BS,-16.5,32,48),(PD,-19,32,48),(PL,-24,32,48),(LD,-19,4,8),(VX,-14.5,32,48),(FXT,-22,28,32)):tr*=10**(db/20)/lvl(tr,a,b)
  # 人声延迟(附点八分,左右来回)
  dl=int(.75*SPB*SR);VD=np.zeros_like(VX)
  for k,(g,ch) in enumerate([(.28,1),(.16,0),(.09,1)]):d=dl*(k+1);VD[d:,ch]+=VX[:-d].mean(1)*g
  # ---- 混响 ----
  n=int(2.4*SR);t=np.arange(n)/SR;IR=np.stack([sosfilt(sos_lp(6000),noise(n))*np.exp(-t/.42) for _ in range(2)],1);IR[:int(.02*SR)]=0;IR/=np.sqrt((IR**2).sum(0))
  send=VX*.32+PL*.35+LD*.3+PD*.12+VD*.3+D*np.array([.03,.03]);RV=np.stack([fftconvolve(send[:,c],IR[:,c])[:N] for c in (0,1)],1)
  for tr in (BS,PD):tr*=sc[:,None]
  PL*=(.55+.45*sc)[:,None]
  M=D+BS+PD+PL+LD+VX+VD*.8+FXT+RV*.55
  # 母带:高通 + 软削波 + 简单限幅
  for c in (0,1):M[:,c]=sosfilt(sos_hp(28),M[:,c])
  if os.environ.get('SONG_STEM'):
    i0,i1=int(T(32)*SR),int(T(48)*SR);i2,i3=int(T(52)*SR),int(T(56)*SR)
    for nm,tr,g in (('drums',D,1),('bass',BS,1),('pad',PD,1),('pluck',PL,1),('lead',LD,1),('vox',VX,1),('delay',VD,.8),('reverb',RV,.55)):
      print(nm,'chorus',round(20*np.log10(np.sqrt(((tr[i0:i1]*g)**2).mean())+1e-9),1),'verse',round(20*np.log10(np.sqrt(((tr[i2:i3]*g)**2).mean())+1e-9),1))
  M/=np.abs(M).max()*.62;M=np.tanh(M*1.3)/np.tanh(1.3)
  pk=np.abs(M).max(1);from scipy.ndimage import maximum_filter1d,uniform_filter1d
  g=np.minimum(1,.92/np.maximum(maximum_filter1d(pk,int(.006*SR)),1e-6));g=uniform_filter1d(np.minimum.accumulate(g[::-1])[::-1] if False else g,int(.004*SR));M*=g[:,None]
  e=int(TAIL*SR);M[-e:]*=np.linspace(1,0,e)[:,None]**1.5
  out=os.path.join(OUTD,'nameless_dance.wav')
  with sf.SoundFile(out,'w',SR,2,subtype='FLOAT') as f:
    for i in range(0,len(M),8192):f.write(M[i:i+8192].astype(np.float32))
  print('wrote',out,round(len(M)/SR,1),'s')
  # 打印给 573 分块用的歌词表:[起始小节, 英文, 中文]
  L=sorted([(b0,l[0].replace('-',''),l[3]) for b0,l,_ in LYR])
  print('DNL='+json.dumps([[b,e,z] for b,e,z in L],ensure_ascii=False,separators=(',',':')))
if __name__=='__main__':build()
