# 第六十九轮(用户):重新给主城编一首 BGM —— 没有人声,只有器乐;活泼、欢快、充满幻想,流行 / 儿童向热血流行曲,节奏明快、旋律朗朗上口
# 曲名《晨曦镇的早晨》(Morning in Daybreak Town)。全部由本脚本合成(没有用任何外部音乐素材):
#   钟琴(非谐波分音)· 方波 + 长笛混合的主旋律 · 马林巴反拍和弦 · 弦乐铺底(超级锯齿低通)· 跳跃贝斯 · 底鼓 / 拍手 / 铃鼓 / 沙锤 · 魔法闪光音效(钟琴上行刮奏)
# 126 BPM、C 大调、80 小节 ≈ 2 分 32 秒,首尾无缝循环(混响尾巴绕回开头,没有淡出):
#   前奏 4 · 主歌 8 · 导歌 4 · 副歌 16 · 主歌二 8 · 导歌二 4 · 副歌二 8 · 间奏(幻想段)8 · 副歌三 16 · 回旋 4
# 输出 raw/audio/bgm/r69/town_theme.wav(32 kHz 立体声),再由 build_audio.py 转成 assets/au_bgm0.ogg:
#   python art_src/audio/build_song69.py  →  python art_src/audio/build_audio.py bgm0
import os,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,sosfilt_zi,fftconvolve
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTD=os.path.join(ROOT,'raw','audio','bgm','r69');os.makedirs(OUTD,exist_ok=True)
SR=32000;BPM=126;SPB=60/BPM;BAR=4*SPB;NBAR=80;N=int(round(NBAR*BAR*SR))
RS=np.random.RandomState(69)
def T(bar,beat=0):return (bar*4+beat)*SPB
def hz(m):return 440*2**((m-69)/12)
def sos_lp(f,o=2):return butter(o,min(f,SR*.45)/(SR/2),output='sos')
def sos_hp(f,o=2):return butter(o,f/(SR/2),'high',output='sos')
def sos_bp(a,b,o=2):return butter(o,[a/(SR/2),min(b,SR*.45)/(SR/2)],'band',output='sos')
def st():return np.zeros((N,2))
def add(tr,t,sig,pan=0,g=1):  # 单声道信号按声像放进立体声轨;超出结尾的部分绕回开头(循环曲)
  i=int(t*SR)%N;sig=np.asarray(sig)*g;L=sig*np.cos((pan+1)*np.pi/4)*1.414;R=sig*np.sin((pan+1)*np.pi/4)*1.414
  k=min(len(sig),N-i);tr[i:i+k,0]+=L[:k];tr[i:i+k,1]+=R[:k]
  if len(sig)>k:r=len(sig)-k;tr[:r,0]+=L[k:];tr[:r,1]+=R[k:]
def add2(tr,t,sig,g=1):
  i=int(t*SR)%N;sig=np.asarray(sig)*g;k=min(len(sig),N-i);tr[i:i+k]+=sig[:k]
  if len(sig)>k:tr[:len(sig)-k]+=sig[k:]
def adsr(n,a=.005,d=.1,s=.7,r=.05):
  e=np.ones(n)*s;A=max(1,int(a*SR));D=max(1,int(d*SR));R=max(1,int(r*SR))
  e[:A]=np.linspace(0,1,A)[:n] if n>=A else np.linspace(0,1,n)
  if n>A:k=min(D,n-A);e[A:A+k]=np.linspace(1,s,D)[:k]
  if n>R:e[-R:]*=np.linspace(1,0,R)
  return e
def saw(f):
  dt=np.asarray(f,float)/SR;ph=(np.cumsum(dt)+RS.rand())%1.0;y=2*ph-1
  m=ph<dt;t=ph[m]/dt[m];y[m]-=t+t-t*t-1
  m=ph>1-dt;t=(ph[m]-1)/dt[m];y[m]-=t*t+t+t+1
  return y
def pulse(f,w=.25):  # 带限脉冲波 = 两个错相的锯齿相减
  dt=np.asarray(f,float)/SR;p0=RS.rand();out=np.zeros(len(dt))
  for off,sg in ((0,1),(w,-1)):
    ph=(np.cumsum(dt)+p0+off)%1.0;y=2*ph-1
    m=ph<dt;t=ph[m]/dt[m];y[m]-=t+t-t*t-1
    m=ph>1-dt;t=(ph[m]-1)/dt[m];y[m]-=t*t+t+t+1
    out+=sg*y
  return out*.5
def ssaw(m,n,det=(-10,-4,0,4,10)):
  L=np.zeros(n);R=np.zeros(n)
  for i,c in enumerate(det):
    y=saw(np.full(n,hz(m+c/100)));p=(i/(len(det)-1))*2-1
    L+=y*(1-p)*.5;R+=y*(1+p)*.5
  return L/len(det),R/len(det)
noise=lambda n:RS.randn(n)
# ===================== 乐器 =====================
def glock(m,du=1.4):  # 钟琴:非谐波分音,高分音衰减快
  n=int(du*SR);t=np.arange(n)/SR;f=hz(m);y=np.zeros(n)
  for r,a,d in ((1,1,.9),(2.76,.42,.32),(5.40,.22,.14),(8.93,.1,.07)):
    if f*r<15000:y+=a*np.sin(2*np.pi*f*r*t)*np.exp(-t/d)
  return y*(1-np.exp(-t/.0015))
def marimba(m,du=.5):
  n=int(du*SR);t=np.arange(n)/SR;f=hz(m)
  return (np.sin(2*np.pi*f*t)*np.exp(-t/.22)+.35*np.sin(2*np.pi*f*4*t)*np.exp(-t/.04)+.12*np.sin(2*np.pi*f*10*t)*np.exp(-t/.012))*(1-np.exp(-t/.002))
def lead(m,du):  # 主旋律:窄方波 + 长笛(正弦 + 气声),带延迟颤音
  n=int((du+.06)*SR);t=np.arange(n)/SR;vib=1+.006*np.sin(2*np.pi*5.5*t)*np.clip((t-.18)/.2,0,1);f=hz(m)*vib
  y=pulse(f,.25)*.55+np.sin(2*np.pi*np.cumsum(f)/SR)*.8+sosfilt(sos_bp(hz(m)*.9,hz(m)*3),noise(n))*.05
  return y*adsr(n,.012,.12,.78,.06)
def bassn(m,du):
  n=int(du*SR);t=np.arange(n)/SR;f=hz(m)
  y=np.sin(2*np.pi*f*t)*.9+saw(np.full(n,f))*.35;y=sosfilt(sos_lp(900),y)
  return y*adsr(n,.004,.12,.55,.04)
def kick():
  n=int(.35*SR);t=np.arange(n)/SR;f=50+110*np.exp(-t/.025);y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.16)
  y+=sosfilt(sos_hp(2500),noise(n))*np.exp(-t/.003)*.4;return np.tanh(y*1.4)
def clap():
  n=int(.35*SR);t=np.arange(n)/SR;b=sosfilt(sos_bp(1000,3600),noise(n));e=np.zeros(n)
  for d in (0,.008,.016):k=t>=d;e[k]+=np.exp(-(t[k]-d)/.006)
  e+=.5*np.exp(-np.maximum(t-.02,0)/.09)*(t>.02);return b*e*.9
def snare():
  n=int(.22*SR);t=np.arange(n)/SR;return sosfilt(sos_bp(1500,9000),noise(n))*np.exp(-t/.08)*.8+np.sin(2*np.pi*200*t)*np.exp(-t/.04)*.5
def tamb():  # 铃鼓:高通噪声 + 几个金属分音
  n=int(.16*SR);t=np.arange(n)/SR;y=sosfilt(sos_hp(6500,4),noise(n))*np.exp(-t/.05)
  for f in (5200,7300,9100):y+=.18*np.sin(2*np.pi*f*t+RS.rand()*6)*np.exp(-t/.04)
  return y
def shaker():
  n=int(.07*SR);t=np.arange(n)/SR;e=(1-np.exp(-t/.008))*np.exp(-t/.025);return sosfilt(sos_bp(5000,11000),noise(n))*e
def crash(d=2.2):
  n=int(d*SR);t=np.arange(n)/SR;e=np.exp(-t/.7);return np.stack([sosfilt(sos_hp(4000),noise(n))*e*.55 for _ in range(2)],1)
KS,CL,SN,TB,SH=kick(),clap(),snare(),tamb(),shaker()
# ===================== 和弦 / 段落 =====================
VO={'C':[60,64,67],'G':[59,62,67],'Am':[60,64,69],'F':[60,65,69],'Dm':[62,65,69],'Em':[59,64,67],'E':[59,64,68]}
RT={'C':36,'G':31,'Am':33,'F':29,'Dm':38,'Em':28,'E':28}
SEC=[('intro',0,4),('verse',4,8),('pre',12,4),('chorus',16,16),('verse2',32,8),('pre2',40,4),('chorus2',44,8),('bridge',52,8),('chorus3',60,16),('turn',76,4)]
def sec(b):
  for n,s,l in SEC:
    if s<=b<s+l:return n,b-s
  return 'turn',0
VCH=['C','G','Am','F','C','G','F','G'];PCH=['Dm','Em','F','G'];CCH=['F','G','Em','Am','F','G','C','C'];BCH=['Am','F','C','G','Am','F','Dm','E'];ICH=['C','F','G','C']
def chord(b):
  s,k=sec(b)
  if s in('verse','verse2'):return VCH[k%8]
  if s in('pre','pre2'):return PCH[k%4]
  if s.startswith('chorus'):return CCH[k%8]
  if s=='bridge':return BCH[k%8]
  if s=='turn':return ['F','G','F','G'][k]
  return ICH[k%4]
# ===================== 旋律 =====================(拍, 时值, MIDI)
VM=[[(0,.5,64),(.5,.5,67),(1,.5,72),(1.5,.5,67),(2,1,69),(3,1,67)],
    [(0,.5,62),(.5,.5,67),(1,.5,71),(1.5,.5,67),(2,1,69),(3,1,71)],
    [(0,.5,72),(.5,.5,71),(1,.5,69),(1.5,.5,67),(2,1,64),(3,1,69)],
    [(0,1.5,65),(1.5,.5,67),(2,2,69)],
    [(0,.5,64),(.5,.5,67),(1,.5,72),(1.5,.5,67),(2,1,69),(3,1,67)],
    [(0,.5,62),(.5,.5,67),(1,.5,71),(1.5,.5,74),(2,1,72),(3,1,71)],
    [(0,.5,69),(.5,.5,71),(1,.5,72),(1.5,.5,77),(2,1,76),(3,1,72)],
    [(0,2,74),(2,1,71),(3,1,67)]]
PM=[[(0,1,69),(1,1,72),(2,1,74),(3,1,72)],[(0,1,71),(1,1,72),(2,1,76),(3,1,74)],
    [(0,1,72),(1,1,74),(2,1,77),(3,1,76)],[(0,.5,74),(.5,.5,76),(1,.5,77),(1.5,.5,79),(2,2,79)]]
CM=[[(0,.5,72),(.5,.5,74),(1,1,77),(2,.5,76),(2.5,.5,74),(3,1,72)],
    [(0,1.5,74),(1.5,.5,71),(2,1,67),(3,1,74)],
    [(0,.5,71),(.5,.5,72),(1,1,74),(2,.5,76),(2.5,.5,74),(3,1,71)],
    [(0,2,72),(2,.5,69),(2.5,.5,71),(3,1,72)],
    [(0,.5,72),(.5,.5,74),(1,1,77),(2,.5,79),(2.5,.5,77),(3,1,76)],
    [(0,1,74),(1,.5,76),(1.5,.5,77),(2,1,79),(3,1,74)],
    [(0,1,76),(1,1,72),(2,.5,74),(2.5,.5,76),(3,1,79)],
    [(0,3,84)]]
BM=[[(0,2,76),(2,2,72)],[(0,2,77),(2,1,76),(3,1,74)],[(0,3,72),(3,1,67)],[(0,2,71),(2,2,74)],
    [(0,2,81),(2,2,76)],[(0,2,81),(2,1,79),(3,1,77)],[(0,2,77),(2,1,76),(3,1,74)],[(0,2,76),(2,1,74),(3,1,71)]]
HOOK=[[(0,.5,79),(.5,.5,76),(1,.5,72),(1.5,.5,76),(2,.5,79),(2.5,.5,84),(3,1,83)],[(0,.5,81),(.5,.5,77),(1,.5,72),(1.5,.5,77),(2,1,81),(3,1,79)],
      [(0,.5,79),(.5,.5,74),(1,.5,71),(1.5,.5,74),(2,.5,79),(2.5,.5,83),(3,1,86)],[(0,2,84),(2,.5,79),(2.5,.5,76),(3,1,72)]]
def mel(b):
  s,k=sec(b)
  if s in('verse','verse2'):return VM[k%8],'v'
  if s in('pre','pre2'):return PM[k],'p'
  if s.startswith('chorus'):return CM[k%8],'c'
  if s=='bridge':return BM[k],'b'
  if s in('intro','turn'):return HOOK[k],'h'
  return [],''
def build():
  D=st();BS=st();PD=st();MR=st();LD=st();GL=st();FX=st()
  for b in range(NBAR):
    s,k=sec(b);ch=chord(b);r=RT[ch];big=s.startswith('chorus');calm=s=='bridge'
    # ---- 鼓 ----
    for be in range(4):
      t=T(b,be)
      if s=='intro' and k<2:continue
      if big or s=='turn' or be in(0,2) or (s=='pre' and be%1==0):add(D,t,KS,0,.9 if not calm else .55)
      if calm and be in(1,3):add(D,t,SN,0,.25)
      elif be in(1,3):add(D,t,CL,.04,.55);add(D,t,SN,-.04,.25)
      if not calm:
        for q in (0,.5):add(D,t+q*SPB,TB,.35,.3 if q else .18)
      for q in (.25,.75):add(D,t+q*SPB,SH,-.4,.13 if not calm else .09)
    if s in('pre','pre2') and k==3:  # 导歌最后一小节:军鼓 16 分滚奏
      for i in range(8):add(D,T(b,2+i/4),SN,0,.2+.05*i)
    if (s.startswith('chorus') and k in(0,8)) or s=='bridge' and k==0 or b==4:add2(D,T(b),crash(),.4)
    # ---- 贝斯:根音 / 五度 / 八度跳跃 ----
    pat=[(0,.45,0),(1,.4,7),(1.5,.4,12),(2,.45,0),(3,.4,7),(3.5,.4,12)] if not calm else [(0,1.8,0),(2,1.8,7)]
    if s=='intro' and k<2:pat=[]
    for be,du,iv in pat:add(BS,T(b,be),bassn(r+iv,du*SPB),0,.6)
    # ---- 马林巴反拍和弦(「蹦跳」感)----
    for be in range(4):
      if s=='intro' and k<2 and be<2:continue
      for i,m in enumerate(VO[ch]):add(MR,T(b,be+.5),marimba(m+12 if calm else m,.45),(-.3+i*.3),.22 if not calm else .14)
    # ---- 弦乐铺底(副歌 / 间奏 / 导歌)----
    if big or calm or s in('pre','pre2','turn'):
      n=int((BAR+.1)*SR);g=.24 if big else .3 if calm else .2
      for m in VO[ch]+[VO[ch][0]+12]:
        L,R=ssaw(m,n);e=adsr(n,.15 if calm else .05,.3,.85,.15);add2(PD,T(b),np.stack([L*e,R*e],1),g)
    # ---- 主旋律 ----
    ml,kind=mel(b)
    for be,du,m in ml:
      g=.34 if kind in('c','p') else .3
      add(LD,T(b,be),lead(m,du*SPB),.08,g)
      if kind=='c':add(GL,T(b,be),glock(m+12,1.0),-.25,.22)  # 副歌:钟琴高八度加倍
      if kind=='h':add(GL,T(b,be),glock(m,1.2),.2,.32)
      if kind=='b':add(GL,T(b,be),glock(m+12,1.6),-.2,.12)
    # ---- 钟琴琶音(前奏 / 间奏 / 主歌 = 幻想感的点缀)----
    if s in('verse','verse2','bridge','intro'):
      nt=VO[ch];seq=[nt[0]+24,nt[1]+24,nt[2]+24,nt[1]+24] if s!='bridge' else [nt[0]+12,nt[1]+12,nt[2]+12,nt[0]+24,nt[2]+12,nt[1]+12,nt[2]+24,nt[1]+24]
      step=1 if s in('verse','verse2') else .5
      for i in range(int(4/step)):
        if s in('verse','verse2') and i%2==0:continue
        add(GL,T(b,i*step),glock(seq[i%len(seq)],.9),(.45 if i%2 else -.45),.1 if s!='bridge' else .14)
    # ---- 魔法闪光:段落交界处钟琴上行刮奏 ----
    if (s in('pre','pre2') and k==3) or (s=='bridge' and k==7) or (s=='turn' and k==3):
      sc=[72,74,76,77,79,81,83,84,86,88,89,91]
      for i,m in enumerate(sc):add(FX,T(b,2)+i*SPB*2/len(sc),glock(m,.8),-.6+i*.1,.16)
  # ---- 分轨电平(按副歌段)→ 混音 ----
  def lvl(tr,a,b):return np.sqrt((tr[int(T(a)*SR):int(T(b)*SR)]**2).mean())+1e-9
  for tr,db in ((D,-15),(BS,-17),(PD,-22),(MR,-21),(LD,-15.5),(GL,-21),(FX,-24)):tr*=10**(db/20)/lvl(tr,16,32)
  # 混响(循环卷积:尾巴绕回开头,首尾无缝)
  n=int(2.0*SR);t=np.arange(n)/SR;IR=np.stack([sosfilt(sos_lp(7000),noise(n))*np.exp(-t/.38) for _ in range(2)],1);IR[:int(.015*SR)]=0;IR/=np.sqrt((IR**2).sum(0))
  send=LD*.3+GL*.45+MR*.25+PD*.2+FX*.5+D*.03
  RV=np.zeros_like(send)
  for c in (0,1):
    y=fftconvolve(send[:,c],IR[:,c]);RV[:,c]=y[:N];RV[:len(y)-N,c]+=y[N:]
  # 主旋律附点八分延迟(左右来回,也绕回开头)
  dl=int(.75*SPB*SR);LDD=np.zeros_like(LD)
  for k,(g,c) in enumerate([(.22,1),(.12,0)]):d=dl*(k+1);LDD[d:,c]+=LD[:-d].mean(1)*g;LDD[:d,c]+=LD[-d:].mean(1)*g
  M=D+BS+PD+MR+LD+GL+FX+LDD+RV*.5
  for c in (0,1):M[:,c]=sosfilt(sos_hp(30),M[:,c])
  M/=np.abs(M).max()*.62;M=np.tanh(M*1.25)/np.tanh(1.25)
  pk=np.abs(M).max(1);from scipy.ndimage import maximum_filter1d,uniform_filter1d
  g=np.minimum(1,.92/np.maximum(maximum_filter1d(pk,int(.006*SR)),1e-6));g=uniform_filter1d(g,int(.004*SR));M*=g[:,None]
  k=96;w=np.linspace(0,1,k)[:,None];M[-k:]=M[-k:]*(1-w)+M[:1]*w  # 结尾最后 3 毫秒平滑接到开头第一个采样(循环点不咔哒)
  out=os.path.join(OUTD,'town_theme.wav')
  with sf.SoundFile(out,'w',SR,2,subtype='FLOAT') as f:
    for i in range(0,len(M),8192):f.write(M[i:i+8192].astype(np.float32))
  print('wrote',out,round(len(M)/SR,1),'s')
if __name__=='__main__':build()
