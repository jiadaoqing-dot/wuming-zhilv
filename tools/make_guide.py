# 手机纪念版(分支 mobile-v1.52)专用:生成「Boss 与装备图鉴」网页 guide/index.html + guide/img/*.png
# 图片全部由游戏自己的绘图函数画出来(关卡选择页的首领卡片 lvsArt、背包装备图标 eqDraw,用的都是已有图集),数据也直接从游戏里读
# 用法:先 python tools/build.py,再 python tools/make_guide.py(需要 playwright + chromium)
import os,sys,json,base64,html,pathlib
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=[f for f in os.listdir(D+'/out') if f.startswith('无名之旅_v') and f.endswith('.html')][0]
G=D+'/guide';os.makedirs(G+'/img',exist_ok=True)
JS=r"""
(()=>{
const cut=(X,Y,W,H)=>{const c=document.createElement('canvas');c.width=W*RS;c.height=H*RS;c.getContext('2d').drawImage(cv,X*RS,Y*RS,W*RS,H*RS,0,0,W*RS,H*RS);return c.toDataURL('image/png')};
const out={boss:[],eq:[],tr:[],tier:TR.map(t=>({n:t[0],c:t[1],k:t[2]})),ser:SER.map(s=>s.n),slot:Object.keys(SL).map(k=>({k,n:SL[k][0]})),enh:EQE};
const BK={1:'boss',2:'mage',3:'king',4:'sco',5:'andr',6:'bear',7:'wiz',8:'yin',9:'lava',10:'gui',11:'ham',12:'nmr',13:'dmn',14:'mech',15:'nk',16:'fk',17:'mir',18:'nb',19:'alm',90:'can'};
const NM=['铁角牛魔','面具法师','金色蛇王','黑棘巨蝎','沙渊古神','北极熊','血月巫王','怨婴·银太郎','熔狱魔神','归蝇','瓜子大王','梦魇幽驹','深渊炎魔','钢铁暴君','夜王','焚天炎君','镜中无名','影主·胧','千钟之主'];
const lvInfo=n=>{if(n<=10)return {lv:MAPS[n-1].n,d:MAPS[n-1].d};const m=MAPS2.find(q=>q.cur==n);if(m)return {lv:m.n,d:m.d};let s='';try{s=lvName(n)}catch(e){}return {lv:s,d:[]}};
for(const n of [1,2,3,4,5,6,7,8,9,10,14,15,16,18,19,11,12,13,17,90]){
  x.save();x.setTransform(RS,0,0,RS,0,0);x.clearRect(0,0,VW,VH);lvsArt(n,0,0,240,160,1.2);x.restore();
  const k=BK[n],q=MQ.find(q=>q.ty=='boss'&&q.k&&q.k[0]==k),I=lvInfo(n==90?17:n);
  out.boss.push({n,k,name:n==90?'人造人·灿灿一号':NM[n-1],lv:n==90?'神秘副本 4 · 隐藏首领':I.lv,d:I.d,skill:MSS[n]?MSS[n][1]:'',sto:q?q.s:'',after:q?q.d:'',img:cut(0,0,240,160)})}
const S=48;let i=0;
for(let g=0;g<SER.length;g++)for(const sl of Object.keys(SL)){const it=gen(sl,3,null,g,null,1);x.save();x.setTransform(RS,0,0,RS,0,0);x.clearRect(0,0,S,S);eqDraw(it,S/2,S/2,40);x.restore();
  out.eq.push({g,sl,img:cut(0,0,S,S),w:[0,1,2,3].map(t=>eqWhite(sl,t,g))})}
for(const fw of [1,2])for(const sl of ['sword','staff']){const it=fireW(sl,fw);x.save();x.setTransform(RS,0,0,RS,0,0);x.clearRect(0,0,S,S);eqDraw(it,S/2,S/2,40);x.restore();out.eq.push({fw,sl,n:it.n,img:cut(0,0,S,S),w:[it.s]})}
for(const k of TRK)out.tr.push({k,n:TRT[k][0],c:TRT[k][1],a:TRT[k][2],v2:TRT[k][3],v4:TRT[k][4]});
out.ats=ATSD;out.amp=AMP;out.stat={hp:'生命',mp:'魔力',atk:'攻击',def:'防御',cr:'暴击',dg:'闪避'};
return out})()
"""
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.goto(pathlib.Path(D+'/out/'+SRC).as_uri());pg.wait_for_function("typeof SET!='undefined'&&typeof init=='function'",timeout=90000);pg.wait_for_timeout(4000)
    pg.evaluate("closeHome();closeP();PAUSED=1");pg.wait_for_timeout(500)
    # 装备图标是第一次用到时才异步生成的(eqIcon),先全部预热一遍
    pg.evaluate("for(let g=0;g<SER.length;g++)for(const sl of Object.keys(SL))eqIcon(gen(sl,3,null,g,null,1));for(const fw of [1,2])for(const sl of ['sword','staff'])eqIcon(fireW(sl,fw))");pg.wait_for_timeout(2500)
    R=pg.evaluate(JS);b.close()
def png(name,durl):
    open(f'{G}/img/{name}.png','wb').write(base64.b64decode(durl.split(',',1)[1]));return f'img/{name}.png'
E=html.escape
ST=R['stat']
def stats(s):return ' · '.join(f'{ST[k]} {v}' for k,v in s.items())
# ---- Boss ----
bc=[]
for i,o in enumerate(R['boss']):
    src=png('boss_'+o['k'],o['img']);sec='第一张地图' if o['n']<=10 else '暗黑大陆' if o['n'] in (14,15,16,18,19) else '神秘地带'
    d=' · '.join(E(t) for t in o['d'])
    bc.append(f'''<article class="card boss" data-sec="{sec}"><img src="{src}" alt="{E(o['name'])}" loading="lazy" width="240" height="160"><div class="bd">
<h3>{E(o['name'])}</h3><div class="meta"><span class="chip">{sec}</span><span>{E(o['lv'])}</span></div>{f'<p class="sub">{d}</p>' if d else ''}
{f'<p><b>招牌技能</b>{E(o["skill"])}<small>(击败后有几率掉落同名怪物技能石)</small></p>' if o['skill'] else ''}
{f'<details><summary>主线剧情</summary><p>{E(o["sto"])}</p>{f"<p class=sub>后记:{E(o[chr(97)+chr(102)+chr(116)+chr(101)+chr(114)])}</p>" if o["after"] else ""}</details>' if o['sto'] else ''}</div></article>''')
# ---- 装备 ----
tier=R['tier'];slot={s['k']:s['n'] for s in R['slot']}
ec=[]
for g,sn in enumerate(R['ser']):
    rows=[]
    for e in [q for q in R['eq'] if q.get('g')==g]:
        src=png(f'eq_{g}_{e["sl"]}',e['img'])
        cells=''.join(f'<td style="color:{t["c"]}">{stats(e["w"][j])}</td>' for j,t in enumerate(tier))
        rows.append(f'<tr><th><img src="{src}" alt="" width="40" height="40"><span>{slot[e["sl"]]}</span></th>{cells}</tr>')
    ec.append(f'<section class="ser"><h3>{E(sn)}系列</h3><div class="tw"><table><thead><tr><th>部位</th>{"".join(f"<th style=color:{t[chr(99)]}>{t[chr(110)]}</th>" for t in tier)}</tr></thead><tbody>{"".join(rows)}</tbody></table></div></section>')
fw=[]
for e in [q for q in R['eq'] if q.get('fw')]:
    src=png(f'fw{e["fw"]}_{e["sl"]}',e['img']);fw.append(f'<div class="mini"><img src="{src}" alt="" width="40" height="40"><div><b>{E(e["n"])}</b><br><small>史诗 · 白字 {stats(e["w"][0])}</small></div></div>')
tr=''.join(f'<div class="mini"><b style="color:{t["c"]}">{t["n"]}</b><div><small>{E(t["a"])} · 2 件 +{t["v2"]} · 4 件再 +{t["v4"]}</small></div></div>' for t in R['tr'])
ats=''.join(f'<span class="chip">{v[0]} {v[1]}~{v[2]}</span>' for v in R['ats'].values())
amp=''.join(f'<span class="chip">{v[0]}:{v[2]} +{round(v[1]*100)}%</span>' for v in R['amp'].values())
enh=''.join(f'<span class="chip">{slot.get(k,{"fash":"时装","wing":"翅膀"}.get(k,k))}:{ST[v[0]]} +{v[1][0]} / {v[1][1]} / {v[1][2]} / {v[1][3]}</span>' for k,v in R['enh'].items())
page=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>无名之旅 图鉴</title><meta name="description" content="《无名之旅》v1.52 手机纪念版:全部首领与装备介绍">
<style>
:root{{--bg:#f4ecdc;--card:#fffaf0;--ink:#2b2a33;--sub:#7a6f62;--line:#e0d2b8;--acc:#c8661a;--chip:#efe2c8}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#17151f;--card:#221f2c;--ink:#ece6f5;--sub:#a49cb6;--line:#3a3448;--acc:#ffb05c;--chip:#2f2a3c}}}}
:root[data-theme="dark"]{{--bg:#17151f;--card:#221f2c;--ink:#ece6f5;--sub:#a49cb6;--line:#3a3448;--acc:#ffb05c;--chip:#2f2a3c}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.65 "PingFang SC","Microsoft YaHei",sans-serif}}
header{{padding:28px 16px 8px;max-width:1100px;margin:auto}}h1{{margin:0;font-size:28px;color:var(--acc)}}header p{{margin:4px 0 0;color:var(--sub)}}
nav{{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line)}}nav div{{max-width:1100px;margin:auto;padding:8px 16px;display:flex;gap:8px;overflow-x:auto}}
nav a,nav button{{white-space:nowrap;text-decoration:none;color:var(--ink);background:var(--chip);border:0;border-radius:999px;padding:6px 14px;font:inherit;cursor:pointer}}nav .on{{background:var(--acc);color:#fff}}
main{{max-width:1100px;margin:auto;padding:8px 16px 48px}}h2{{margin:28px 0 10px;font-size:22px}}h3{{margin:0 0 4px;font-size:18px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}}.boss img{{display:block;width:100%;height:auto;image-rendering:pixelated;background:#111}}
.bd{{padding:12px 14px}}.meta{{display:flex;gap:8px;flex-wrap:wrap;align-items:center;color:var(--sub);font-size:13px}}.sub{{color:var(--sub);font-size:13px;margin:4px 0}}
.bd p{{margin:6px 0}}.bd p b{{margin-right:6px;color:var(--acc)}}.bd small{{color:var(--sub)}}details summary{{cursor:pointer;color:var(--acc)}}
.chip{{display:inline-block;background:var(--chip);border-radius:999px;padding:1px 10px;font-size:13px;margin:2px 4px 2px 0}}
.tw{{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:var(--card)}}table{{border-collapse:collapse;width:100%;min-width:640px;font-size:13px}}
th,td{{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle}}tbody th{{display:flex;align-items:center;gap:8px;font-weight:600}}tbody th img{{image-rendering:pixelated}}
.ser{{margin-bottom:18px}}.minis{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}}
.mini{{display:flex;gap:10px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px}}.mini img{{image-rendering:pixelated}}
.note{{color:var(--sub);font-size:13px}}footer{{color:var(--sub);font-size:12px;text-align:center;padding:24px 16px}}
</style></head><body>
<header><h1>无名之旅 · 图鉴</h1><p>v1.52 手机纪念版 · 全部首领与装备介绍(数据和图片都直接取自游戏)</p></header>
<nav><div><a href="#boss">首领</a><button data-f="全部" class="on">全部首领</button><button data-f="第一张地图">第一张地图</button><button data-f="暗黑大陆">暗黑大陆</button><button data-f="神秘地带">神秘地带</button><a href="#eq">装备</a><a href="#tr">特性 / 强化</a><a href="../">▶ 回到游戏</a></div></nav>
<main><h2 id="boss">首领</h2><p class="note">首领在每关的最后登场;一星通关后开放二星、三星,星级越高首领越强、掉落越好。</p><div class="grid" id="bg">{"".join(bc)}</div>
<h2 id="eq">装备</h2><p class="note">装备有 6 个部位:头饰、战甲、项链、戒指(这 4 件是防具,可以带特性),剑和法杖(剑士 / 法师各用一把,按 L 切换)。
系列按关卡掉落:旅者(第一、二关)→ 林王(第三、四关)→ 荒漠(第五~七关)→ 雪原(第八~十关)→ 机械(暗黑大陆)。下表是各品质的白字(固定属性);每件另外有 3 条随机绿字,可以锻造(每级白字 +10%,最高 5 级)。</p>
{"".join(ec)}
<h3>火之武器</h3><p class="note">神秘副本 4 首领掉落火之大剑 / 火之法杖;真~火之武器用火之武器加材料在熔炉制作。</p><div class="minis">{"".join(fw)}</div>
<h2 id="tr">特性 / 强化 / 属性石</h2><p class="note">防具的特性:同一特性穿 2 件、4 件分别有套装效果;大师制作装备特性效果翻倍。</p><div class="minis">{tr}</div>
<h3 style="margin-top:18px">强化(每级固定加值,按强化石品质 普通 / 精良 / 稀有 / 史诗)</h3><p>{enh}</p><p class="note">Lv2 强化石(+4~+6)起加值 ×2.5。</p>
<h3>属性石(低级 1 条 / 中级 2 条,数值 ×1.2;在熔炉镶嵌)</h3><p>{ats}</p><h3>增幅宝石</h3><p>{amp}</p>
</main><footer>《无名之旅》手机纪念版 · 本页由 tools/make_guide.py 从游戏数据自动生成</footer>
<script>document.querySelectorAll('nav [data-f]').forEach(b=>b.onclick=()=>{{document.querySelectorAll('nav [data-f]').forEach(q=>q.classList.toggle('on',q==b));const f=b.dataset.f;document.querySelectorAll('#bg .boss').forEach(c=>c.hidden=f!='全部'&&c.dataset.sec!=f);document.getElementById('boss').scrollIntoView({{behavior:'smooth'}})}})</script>
</body></html>'''
open(G+'/index.html','w',encoding='utf8').write(page)
print('guide',len(R['boss']),'bosses',len(R['eq']),'items')
