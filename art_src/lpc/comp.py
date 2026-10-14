# 简易 LPC 合成器:按 ULPC 的 sheet_definitions 叠图层(只取朝右的那一行),支持调色板换色和现成的颜色变体
# 2026-10-13 第十八轮:本机没有 git,改成按需从 raw.githubusercontent.com 下载到 raw/ulpc/(sheet_definitions 已整理好放在里面;
#   spritesheets / palette_definitions 用到才下载,下载不到的路径记在 raw/ulpc/miss.json 里不再重试)
import json,os,sys,urllib.request
from PIL import Image
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','raw','ulpc').replace('\\','/')+'/'
RAW='https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/master/'
MISS=set(json.load(open(R+'miss.json'))) if os.path.exists(R+'miss.json') else set()
def _get(p):
    """本地有就用本地;没有就下载;404 记进 MISS"""
    if os.path.exists(R+p):return True
    if p in MISS:return False
    try:b=urllib.request.urlopen(urllib.request.Request(RAW+p,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read()
    except urllib.error.HTTPError as e:
        if e.code==404:MISS.add(p);json.dump(sorted(MISS),open(R+'miss.json','w'));return False
        raise
    os.makedirs(os.path.dirname(R+p),exist_ok=True);open(R+p,'wb').write(b);return True
class _Files:
    def __contains__(self,p):return _get(p)
FILES=_Files()
PAL={}
def pal(mat):
    if mat not in PAL:
        for q in (f'palette_definitions/{mat}/{mat}_ulpc.json',f'palette_definitions/{mat}/meta_{mat}.json'):_get(q)
        d=json.load(open(R+f'palette_definitions/{mat}/{mat}_ulpc.json'));m=json.load(open(R+f'palette_definitions/{mat}/meta_{mat}.json'))
        PAL[mat]=(d,m['base'])
    return PAL[mat]
def hx(c):return tuple(int(c[i:i+2],16) for i in (1,3,5))
def recolor(im,mat,name):
    d,base=pal(mat);src=[hx(c) for c in d[base]];dst=[hx(c) for c in d[name]]
    px=im.load();w,h=im.size;mp={s:t for s,t in zip(src,dst)}
    for y in range(h):
        for x in range(w):
            p=px[x,y]
            if p[3] and p[:3] in mp:px[x,y]=mp[p[:3]]+(p[3],)
    return im
NEED=[]
def layers(defp,body,variant=None,color=None):
    d=json.load(open(R+'sheet_definitions/'+defp,encoding='utf8'));out=[]
    for k,v in d.items():
        if not k.startswith('layer_'):continue
        bk=body if body in v else ('male' if 'male' in v and len({v[x] for x in v if x not in('zPos','custom_animation')})==1 else None)
        if not bk:continue
        out.append(dict(z=v.get('zPos',0),dir=v[bk],ca=v.get('custom_animation'),rec=(d.get('recolors') or {}).get('material'),variant=variant,color=color,name=d['name']))
    return out,d
def path(L,anim):
    base='spritesheets/'+L['dir']
    cand=[]
    if L['variant']:cand+=[base+anim+'/'+L['variant']+'.png',base+L['variant']+'/'+anim+'.png']
    cand+=[base+anim+'.png']
    for c in cand:
        if c in FILES:return c
    return None
def fetch(paths):
    for p in paths:
        if p:_get(p)
def row(L,anim,cell=64):
    p=path(L,anim)
    if not p:return None
    im=Image.open(R+p).convert('RGBA');n=im.height//cell if im.height>=cell*4 else 1
    c=im.height//4 if im.height>=256 else cell
    r=im.crop((0,3*c,im.width,4*c))
    if L['rec'] and L['color']:r=recolor(r,L['rec'],L['color'])
    return r,c
def compose(spec,body,anim):
    Ls=[]
    for defp,var,col in spec:
        l,_=layers(defp,body,var,col);Ls+=[x for x in l if not x['ca']]
    fetch([path(L,anim) for L in Ls])
    Ls.sort(key=lambda L:L['z']);canvas=None
    for L in Ls:
        r=row(L,anim)
        if not r:continue
        im,c=r
        if c!=64:continue
        if canvas is None:canvas=Image.new('RGBA',im.size)
        if im.width!=canvas.width:
            if im.width>canvas.width:
                nc=Image.new('RGBA',im.size);nc.alpha_composite(canvas);canvas=nc
            else:
                t=Image.new('RGBA',canvas.size);t.alpha_composite(im);im=t
        canvas.alpha_composite(im)
    return canvas

CAMAP={'slash':['slash_128','slash_oversize'],'thrust':['thrust_oversize'],'spellcast':[]}
def anim_dir(L,anim):
    return anim
def frames(spec,body,anim,C=192):
    """返回该动画朝右一行的帧列表(每帧 C×C,64 格居中)"""
    Ls=[]
    for defp,var,col in spec:
        l,_=layers(defp,body,var,col);Ls+=l
    use=[]
    for L in Ls:
        if L['ca']:
            if L['ca'] in CAMAP.get(anim,[]):use.append((L,''))  # 大格攻击动画:目录就是动画本身
        else:use.append((L,anim))
    def p2(L,a):
        base='spritesheets/'+L['dir']
        if not a:
            c=[base+L['variant']+'.png'] if L['variant'] else []
            c+=[base.rstrip('/')+'.png']
            for x in c:
                if x in FILES:return x
            return None
        return path(L,a)
    ps=[(L,p2(L,a)) for L,a in use];fetch([p for _,p in ps])
    ps.sort(key=lambda t:t[0]['z']);out=None;n=0
    for L,p in ps:
        if not p:continue
        im=Image.open(R+p).convert('RGBA');c=im.height//4;r=im.crop((0,3*c,im.width,4*c))
        if L['rec'] and L['color']:r=recolor(r,L['rec'],L['color'])
        k=im.width//c
        if out is None:out=[Image.new('RGBA',(C,C)) for _ in range(max(k,1))]
        while len(out)<k:out.append(Image.new('RGBA',(C,C)))
        for i in range(k):
            fr=r.crop((i*c,0,i*c+c,c));off=(C-c)//2;out[i].alpha_composite(fr,(off,off))
    return out or []
