# 女神像像素底稿:用游戏自己的矢量画法(drawTown 里的底座 + drawAngel 石像)在 1 倍分辨率渲染一张 200×160 的透明图,
# 再由 build_tpx.py 量化成像素画(限色、描边、去掉半透明边)。发光符文拱 / 光点仍由游戏运行时画。
# 用法:python art_src/town/render_statue.py <out/无名之旅.html> <输出 png>   需要 playwright + chromium
import asyncio,sys,os,base64
from playwright.async_api import async_playwright
G='file:///'+os.path.abspath(sys.argv[1]).replace('\\','/');OUT=sys.argv[2]
JS="""()=>{const cv=document.createElement('canvas');cv.width=200;cv.height=160;const c=cv.getContext('2d'),GY=150,sx=100,tb=GY-50,t=0;
  RR(c,sx-27,GY-10,54,10,3,LG(c,0,GY-10,0,GY,['#d5ccd3','#8a8290']),1.4);RR(c,sx-15,tb+6,30,GY-10-tb-6,3,LG(c,sx-15,0,sx+15,0,['#a39aa6','#ddd5db','#9a91a0']),1.4);
  RR(c,sx-21,tb,42,7,3,LG(c,0,tb,0,tb+7,['#e6dfe4','#a69ea8']),1.4);for(const k of [-10,10])LN_(c,[[sx+k,tb+10],[sx+k,GY-12]],'rgba(80,70,90,.35)',1.2);
  c.strokeStyle='#e3fafc';c.lineWidth=1.8;c.beginPath();c.moveTo(sx-6,GY-14);c.lineTo(sx-6,GY-28);c.arc(sx,GY-28,6,Math.PI,0);c.lineTo(sx+6,GY-14);c.stroke();
  c.save();c.translate(sx,tb);c.scale(.64,.64);drawAngel(c,t,1);c.restore();return cv.toDataURL()}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto(G);await pg.wait_for_timeout(800)
        u=await pg.evaluate(JS);open(OUT,'wb').write(base64.b64decode(u.split(',')[1]));await b.close();print('statue',OUT)
asyncio.run(main())
