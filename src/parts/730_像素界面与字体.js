// ===== 像素界面 PUI:Tiny RPG - Mana Soul GUI(tiopalada,CC0)的九宫格面板 / 血条框 / 按钮 / 菱形格 / 羊皮纸标题,
// ===== 加中文像素字体 Fusion Pixel(TakWolf,OFL 1.1)。art_src/ui/build_pui.py 生成图集;设置里「美术」切回原版几何时全部回到原来的画法
// =====================================================================
const PUI={I:null,D:'@@A:pui_atlas@@',fr:0,
  M:{"pA":[0,0,95,96],"pC":[96,0,95,95],"cur0":[192,0,10,34],"cur1":[203,0,10,34],"cur2":[214,0,10,34],"cur4":[225,0,12,33],"tD0":[238,0,80,32],"tD1":[0,97,86,32],"tD2":[87,97,87,32],"tD3":[175,97,79,32],"tG0":[255,97,90,32],"tG1":[0,130,96,32],"tG2":[97,130,86,32],"tG3":[184,130,88,32],"hdr":[273,130,95,32],"cur3":[369,130,13,32],"dia0":[0,163,30,30],"dia1":[31,163,30,30],"dia2":[62,163,30,30],"dia3":[93,163,30,30],"dia4":[124,163,30,30],"btn1":[155,163,96,22],"btn0":[252,163,93,20],"btn2":[0,194,86,18],"bA":[87,194,95,17],"btn3":[183,194,82,16],"bB":[266,194,95,15],"bC":[0,213,94,15],"hc3":[95,213,32,14],"hc4":[128,213,33,12],"hc0":[162,213,34,10],"hc1":[197,213,34,10],"hc2":[232,213,34,10]},
  // 血条框:左右端宽、中间装饰(不拉伸)范围、内部填色区域(左缩进 / 右缩进 / y / 高)
  BG:{bA:{L:12,R:13,C:[41,54],f:[4,7,2,6]},bB:{L:8,R:9,C:null,f:[7,8,4,5]},bC:{L:5,R:6,C:null,f:[4,7,3,8]}},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D;
    if(document.fonts&&document.fonts.load)Promise.all([document.fonts.load('12px FPX12'),document.fonts.load('8px FPX8')]).then(()=>{this.fr=1}).catch(()=>{})},
  on(){return SET.art!==0&&!!this.I},
  fon(){return SET.art!==0&&this.fr},
  // 字号吸附:像素字体只有「屏幕像素 = 字体像素的整数倍」时才清晰;在 12px / 8px 两套字里找离目标字号最近的清晰字号
  fnt(sz){let b=null;for(const [fm,base] of [['FPX12',12],['FPX8',8]])for(let n=1;n<=10;n++){const s=n*base/RS,d=Math.abs(s-sz)+(base==8?.35:0);if(!b||d<b[2])b=[fm,s,d,base]}return b},
  // 像素字:按字体像素描边(4 或 8 个方向错开一格),起点对齐屏幕像素
  text(c,s,px,py,sz,fill,al,ow,oc){const [fm,fs,,base]=this.fnt(sz),u=fs/base;c.font=fs+'px '+fm;c.textAlign='left';
    const w=c.measureText(s).width;let lx=al=='right'?px-w:al=='left'?px:px-w/2;lx=Math.round(lx*RS)/RS;py=Math.round(py*RS)/RS;
    if(ow!==0){c.fillStyle=oc||'#3a1d0a';const D=ow!=null&&ow<2?[[-1,0],[1,0],[0,-1],[0,1]]:[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];for(const [dx,dy] of D)c.fillText(s,lx+dx*u,py+dy*u)}
    c.fillStyle=fill;c.fillText(s,lx,py)},
  tw(s,sz){const [fm,fs]=this.fnt(sz);x.font=fs+'px '+fm;return x.measureText(s).width},
  // 九宫格:n 图块名,L T R B 边宽(源图像素),目标矩形;k 整数放大倍数
  ns(c,n,L,T,R,B,dx,dy,dw,dh,k){if(!this.I)return;k=k||1;const [sx,sy,sw,sh]=this.M[n];dx=Math.round(dx);dy=Math.round(dy);dw=Math.round(dw);dh=Math.round(dh);
    if((T+B)*k>dh){const q=dh/((T+B)*k);T=Math.floor(T*q);B=Math.floor(B*q)}if((L+R)*k>dw){const q=dw/((L+R)*k);L=Math.floor(L*q);R=Math.floor(R*q)}
    const xs=[sx,sx+L,sx+sw-R,sx+sw],ys=[sy,sy+T,sy+sh-B,sy+sh],xd=[dx,dx+L*k,dx+dw-R*k,dx+dw],yd=[dy,dy+T*k,dy+dh-B*k,dy+dh],sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;
    for(let i=0;i<3;i++)for(let j=0;j<3;j++){const w=xs[i+1]-xs[i],h=ys[j+1]-ys[j],W=xd[i+1]-xd[i],H=yd[j+1]-yd[j];if(w>0&&h>0&&W>0&&H>0)c.drawImage(this.I,xs[i],ys[j],w,h,xd[i],yd[j],W,H)}
    c.imageSmoothingEnabled=sm},
  img(c,n,dx,dy,k){if(!this.I)return;k=k||1;const [sx,sy,sw,sh]=this.M[n],sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;c.drawImage(this.I,sx,sy,sw,sh,Math.round(dx),Math.round(dy),sw*k,sh*k);c.imageSmoothingEnabled=sm},
  // 横向三段拉伸(左端 / 中间 / 右端,可选中间装饰不拉伸)
  h3(c,n,dx,dy,dw,L,R,C,k){if(!this.I)return;k=k||1;const [sx,sy,sw,sh]=this.M[n],sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;dx=Math.round(dx);dy=Math.round(dy);dw=Math.round(dw);
    const pc=(a,b,X0,X1)=>{if(b>a&&X1>X0)c.drawImage(this.I,sx+a,sy,b-a,sh,X0,dy,X1-X0,sh*k)};
    pc(0,L,dx,dx+L*k);pc(sw-R,sw,dx+dw-R*k,dx+dw);
    if(C){const cw=(C[1]-C[0])*k,cx=dx+Math.round((dw-cw)/2);pc(L,C[0],dx+L*k,cx);pc(C[0],C[1],cx,cx+cw);pc(C[1],sw-R,cx+cw,dx+dw-R*k)}else pc(L,sw-R,dx+L*k,dx+dw-R*k);
    c.imageSmoothingEnabled=sm},
  // 血条:先画底色和填色(上 1 像素高光、下 1 像素暗边),再盖上框
  bar(c,n,dx,dy,dw,v,cols){const g=this.BG[n],[fl,fr,fy,fh]=g.f,X0=Math.round(dx)+fl,W=Math.round(dw)-fl-fr,Y0=Math.round(dy)+fy;
    c.fillStyle='#120d18';c.fillRect(X0,Y0,W,fh);const fw=Math.round(W*Math.max(0,Math.min(1,v)));
    if(fw>0){c.fillStyle=cols[1];c.fillRect(X0,Y0,fw,fh);c.fillStyle=cols[0];c.fillRect(X0,Y0,fw,1);c.fillStyle=cols[2];c.fillRect(X0,Y0+fh-1,fw,1)}
    this.h3(c,n,dx,dy,dw,g.L,g.R,g.C)},
  // 像素小框(状态标签、按键提示):纯色底 + 1 像素深色描边 + 顶部 1 像素亮边
  box(c,dx,dy,dw,dh,col,ol){dx=Math.round(dx);dy=Math.round(dy);dw=Math.round(dw);dh=Math.round(dh);c.fillStyle=ol||'#120d18';c.fillRect(dx-1,dy-1,dw+2,dh+2);c.fillStyle=col;c.fillRect(dx,dy,dw,dh);c.fillStyle='rgba(255,255,255,.28)';c.fillRect(dx,dy,dw,1)},
  // 像素金币(7×7)
  coin(c,cx,cy){cx=Math.round(cx);cy=Math.round(cy);c.fillStyle='#7a4a00';c.fillRect(cx-2,cy-4,5,9);c.fillRect(cx-4,cy-2,9,5);c.fillRect(cx-3,cy-3,7,7);
    c.fillStyle='#fab005';c.fillRect(cx-2,cy-3,5,7);c.fillRect(cx-3,cy-2,7,5);c.fillStyle='#ffe066';c.fillRect(cx-2,cy-2,2,2);c.fillStyle='#c97a00';c.fillRect(cx,cy-1,1,3)},
  // 主角像素头像:纸娃娃的头部图层(LPC 待机帧),没有时用原来的矢量头像
  head(cx,cy){if(!(HERO()===LPC&&LPC.ready()))return heroHeadC(cx,cy,1.05);const D=LPC.parts(P.mode,heroLook().look||''),sm=x.imageSmoothingEnabled;x.imageSmoothingEnabled=false;
    x.drawImage(D.h,16,4,34,34,Math.round(cx-17),Math.round(cy-18),34,34);x.imageSmoothingEnabled=sm}};
PUI.init();
const CTF='"PingFang SC","Microsoft YaHei","Noto Sans SC","Heiti SC",sans-serif';
function CT(s,px,py,sz,fill,al,ow,oc,c){if(!c&&window.PXL&&PXL.act){PXL.q.push([s,px,py,sz,fill,al,ow,oc]);return}c=c||x;if(PUI.fon()){PUI.text(c,s,px,py,sz,fill,al,ow,oc);return}c.font='900 '+sz+'px '+CTF;c.textAlign=al||'center';c.lineJoin='round';c.lineWidth=ow==null?Math.max(2.2,sz*.26):ow;c.strokeStyle=oc||'#3a1d0a';c.strokeText(s,px,py);c.fillStyle=fill;c.fillText(s,px,py)}
function CTG(s,px,py,sz,cols,al,c){c=c||x;CT(s,px,py,sz,LG(c,0,py-sz*.85,0,py+sz*.1,cols||['#fffbe0','#ffd43b','#ff922b']),al,null,null,c)}
// 圆角标牌(NPC 名字、地图地名)
function PLQ(c,px,py,s,sub,col){
  // 像素名牌:Mana Soul 金角紫标签(tD1)九宫格,宽度跟着字
  if(PUI.on()){const w=Math.round(Math.max(PUI.tw(s,11),sub?PUI.tw(sub,9):0)+26),h=sub?38:20;PUI.ns(c,'tD1',12,8,14,9,px-w/2,py-h/2-(sub?1:0),w,h);
    CT(s,px,py+(sub?-2:4),11,col||'#fff6d5','center',2.6,'#1a1022',c);if(sub)CT(sub,px,py+9,8,'#ffd43b','center',2.2,'#1a1022',c);return}
  c.font='900 11px '+CTF;const w=Math.max(c.measureText(s).width,sub?c.measureText(sub).width*.82:0)+18,h=sub?28:18;
  RR(c,px-w/2,py-h/2,w,h,7,LG(c,0,py-h/2,0,py+h/2,['#4b3a63','#2a1f3c']),1.6);c.beginPath();c.roundRect(px-w/2+2,py-h/2+2,w-4,h-4,5);c.strokeStyle='rgba(255,212,59,.55)';c.lineWidth=1;c.stroke();
  CT(s,px,py+(sub?-1:4),11,col||'#fff6d5','center',2.6,'#1a1022',c);if(sub)CT(sub,px,py+10,9,'#ffd43b','center',2.2,'#1a1022',c)}

// =====================================================================
