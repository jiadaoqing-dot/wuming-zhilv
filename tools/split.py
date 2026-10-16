# 把单文件游戏拆成开发用的源码:内嵌的 base64 图片抽成 assets/*.png,源码里留占位 @@A:名字@@
# 用法:python3 tools/split.py 无名之旅.html   → 生成 src/parts/*(分块源码)和 assets/
import re,sys,os,base64
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s=open(sys.argv[1],encoding='utf8').read()
os.makedirs(D+'/assets',exist_ok=True);used={}
def sub(m):
    pre=s[max(0,m.start()-60):m.start()]
    k=re.findall(r'([A-Za-z_$][\w$]*)\s*[:=]\s*[\'"]?$',pre)
    k=k[-1] if k else 'img'
    n=used.get(k,0);used[k]=n+1;name=k if n==0 else f'{k}_{n}'
    open(f'{D}/assets/{name}.png','wb').write(base64.b64decode(m.group(1)))
    return '@@A:'+name+'@@'
out=re.sub(r'data:image/png;base64,([A-Za-z0-9+/=]+)',sub,s)
# JPEG(世界地图插画)抽成 assets/*.jpg,占位 @@J:名字@@
def subJ(m):
    pre=out[max(0,m.start()-60):m.start()];k=re.findall(r'([A-Za-z_$][\w$]*)\s*[:=]\s*[\'"]?$',pre);k=k[-1] if k else 'jpg'
    open(f'{D}/assets/{k}.jpg','wb').write(base64.b64decode(m.group(1)));return '@@J:'+k+'@@'
out=re.sub(r'data:image/jpeg;base64,([A-Za-z0-9+/=]+)',subJ,out)
# 第四十四轮:源码按系统切成 src/parts/ 下的小文件(规则见 tools/srcparts.py;会清空原来的 src/parts/)
sys.path.insert(0,D+'/tools');import srcparts;n=len(srcparts.split(out))
print('assets',len(used),'src bytes',len(out.encode()),'parts',n)
