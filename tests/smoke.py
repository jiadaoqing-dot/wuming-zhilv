# 冒烟测试:各模式 / 分辨率下走一遍城镇、关卡、技能、背包、商城、设置,只收集控制台错误(不截图)
# 用法:python3 tests/smoke.py [游戏路径]   需要 playwright + chromium
import asyncio,sys
from playwright.async_api import async_playwright
G='file://'+(sys.argv[1] if len(sys.argv)>1 else __import__('os').path.abspath(__import__('glob').glob('out/无名之旅_v*.html')[0]))
async def run(p,w,h,art,hero,job):
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':w,'height':h});E=[]
    pg.on('pageerror',lambda e:E.append(str(e)));pg.on('console',lambda m:E.append(m.text) if m.type=='error' else None)
    await pg.goto(G);k=pg.keyboard
    try:await pg.wait_for_function("typeof SET!='undefined'&&typeof init=='function'",timeout=30000)  # 文件 15MB(内嵌 BGM),等脚本加载完
    except Exception:print('load failed',E[:3]);raise
    await pg.wait_for_timeout(500)
    await pg.evaluate("([a,h,j])=>{if(HOME)closeHome();SET.art=a;SET.hero=h;init(1);lvl=60;JOB=j;LN.sword=Array(8).fill(9);LN.staff=Array(8).fill(9);LN.fist=Array(8).fill(9);EQ.body=gen('body',2,'x');EQ.head=gen('head',1,'x');OWN.push('fhw','xyw','fh','xy');WEAR.wing='xyw';toTown();GM.god=1}",[art,hero,job])
    await pg.wait_for_timeout(400)
    for key in ['j','h','u','i','o','Space','b','b','p','Escape','Escape']:await k.press(key);await pg.wait_for_timeout(250)
    await pg.evaluate("()=>{P.x=92}");await k.press('w');await pg.wait_for_timeout(400);await k.press('Escape')
    for lv in [1,6,7]:
        await pg.evaluate("(lv)=>{enterLv(lv);for(const q of E){q.hp=1e6};P.mp=9999;const e=E.slice().sort((a,b)=>a.x-b.x)[0];if(e)P.x=e.x-60}",lv);await pg.wait_for_timeout(300)
        for m in ['sword','staff','fist']:  # 第六十九轮:格斗家
            await pg.evaluate("(m)=>{P.mode=m;JOB=m;for(const w in CD)CD[w].fill(0);P.mp=9999}",m)
            for key in ['j','h','u','i','o']:await k.press(key);await pg.wait_for_timeout(350)
            await k.down('w');await k.press('j');await k.up('w');await pg.wait_for_timeout(150);await k.press('u');await pg.wait_for_timeout(500)
            for mod in [None,'w','s']:
                await pg.evaluate("()=>{for(const w in CD)CD[w].fill(0);P.mp=9999;P.sk=null}")
                if mod:await k.down(mod)
                await k.press('Space')
                if mod:await k.up(mod)
                await pg.wait_for_timeout(900)
        await pg.evaluate("()=>{WEAR.wing='fhw';P.ps=3;WEAR.fash='fh'}");await k.press('k');await k.press('k');await k.press('k');await pg.wait_for_timeout(500)
    await b.close();return E
async def main():
    async with async_playwright() as p:
        for cfg in [(1920,1080,1,'lpc','sword')]:   # 只测默认配置(像素美术 + LPC + 剑士,用户 2026-10-12 决定;流程里仍会切到法杖测技能)
            E=await run(p,*cfg);print(cfg,'errors:',len(E),E[:3])
asyncio.run(main())
