// ===== 怪物 / 首领特效(第三张特效图 BFX,art_src/bfx/build_bfx.py):Magic Pack 9(ansimuz)、Pixel Art Spells(DevWizard,CC0)、Ardentryst(Elle Trudgett,CC-BY 3.0)=====
// 面具法师:暗影法球(c=1)、天降暗影雷(c=2,落地暗影爆裂 + 闪电)、瞬移闪光;蛇王 / 毒液(c=3):毒液球 + 绿色溅射;火球命中:火焰爆炸 + 地面余火;黑棘巨蝎:护盾、毒针毒雾
const BFX={D:'@@A:bfx_atlas@@',M:{"b-dorb":{"y":0,"w":16,"h":16,"n":6,"px":8,"py":8,"fps":12,"loop":true,"im":3},"b-dbolt":{"y":16,"w":16,"h":12,"n":6,"px":8,"py":6,"fps":12,"loop":true,"im":3},"b-darkhit":{"y":28,"w":63,"h":64,"n":6,"px":31,"py":60,"fps":18,"loop":false,"im":3},"b-firebomb":{"y":92,"w":58,"h":48,"n":8,"px":29,"py":31,"fps":18,"loop":false,"im":3},"b-spark":{"y":140,"w":30,"h":30,"n":8,"px":15,"py":15,"fps":18,"loop":false,"im":3},"b-light":{"y":170,"w":56,"h":126,"n":11,"px":28,"py":122,"fps":20,"loop":false,"im":3},"b-shield":{"y":296,"w":48,"h":48,"n":6,"px":24,"py":24,"fps":10,"loop":true,"im":3},"b-vsplash":{"y":344,"w":32,"h":21,"n":6,"px":16,"py":13,"fps":16,"loop":false,"im":3},"b-slime":{"y":365,"w":15,"h":18,"n":1,"px":7,"py":9,"fps":1,"loop":true,"im":3},"b-gas":{"y":383,"w":57,"h":37,"n":1,"px":29,"py":18,"fps":1,"loop":true,"im":3},"b-ice":{"y":420,"w":38,"h":39,"n":1,"px":20,"py":20,"fps":1,"loop":true,"im":3},"b-icel":{"y":459,"w":16,"h":5,"n":4,"px":8,"py":3,"fps":10,"loop":true,"im":3},"b-iorb":{"y":464,"w":16,"h":16,"n":6,"px":8,"py":8,"fps":12,"loop":true,"im":3},"b-flame":{"y":480,"w":13,"h":31,"n":5,"px":7,"py":30,"fps":12,"loop":true,"im":3}},
  init(){Object.assign(VFX.M,this.M);const im=new Image();im.onload=()=>{VFX.I3=im};im.src=this.D},
  ok(){return VFX.ok()&&!!VFX.I3},
  shot(f,fx,fy,t){if(!this.ok())return false;const s=f.s||1;
    if(f.c==1||f.c==2){const big=f.c==2;x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,(big?20:13)*s,RGD(x,fx,fy,(big?20:13)*s,['rgba(190,110,255,.85)','rgba(0,0,0,0)']),0);x.restore();
      if(big)VFX.frame(x,'b-dbolt',Math.floor(t*12)%6,fx,fy,1.1*s,1,Math.atan2(f.vy,f.vx));else VFX.frame(x,'b-dorb',Math.floor(t*12+f.x*.05)%6,fx,fy,.85*s,1,0);return true}
    if(f.c==5){VFX.frame(x,'b-icel',Math.floor(t*10)%4,fx,fy,1.3*s,1,Math.atan2(f.vy,f.vx));return true}
    if(f.c==7){x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,10*s,RGD(x,fx,fy,10*s,['rgba(165,216,255,.6)','rgba(0,0,0,0)']),0);x.restore();VFX.frame(x,'b-iorb',Math.floor(t*12)%6,fx,fy,1.2*s,1,t*8*sgn(f.vx));return true}
    if(f.c==3){x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,10*s,RGD(x,fx,fy,10*s,['rgba(120,230,90,.6)','rgba(0,0,0,0)']),0);x.restore();VFX.frame(x,'b-slime',0,fx,fy,.55*s,1,t*9);return true}
    return false},
  // 怪物飞弹结束:打中主角(hp=1)或落地
  end(f,hp){if(!this.ok())return;const gy=Math.min(f.y,GY);
    if(f.c==null){VFX.spawn('b-firebomb',f.x,gy+8,{s:1.1});if(!hp)VFX.spawn('b-flame',f.x,GY,{life:1.2})}
    else if(f.c==1)VFX.spawn('b-darkhit',f.x,gy+14,{s:.45});
    else if(f.c==2){VFX.spawn('b-darkhit',f.x,hp?gy+20:GY,{s:.8});if(!hp)VFX.spawn('b-light',f.x,GY,{s:.7,a:.85})}
    else if(f.c==3)VFX.spawn('b-vsplash',f.x,hp?gy+6:GY,{s:1})}};
BFX.init();
