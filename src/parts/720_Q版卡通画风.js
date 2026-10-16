// ===== Q 版卡通画风:矢量绘图工具(粗描边 + 渐变 + 大眼睛 + 描边字)=====
// =====================================================================
const OL='#2b1a12';let FLW=0;  // FLW=1:受击闪白,所有填充改成白色
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(a,b,w,h,r){r=Math.max(0,Math.min(+r||0,w/2,h/2));this.moveTo(a+r,b);this.arcTo(a+w,b,a+w,b+h,r);this.arcTo(a+w,b+h,a,b+h,r);this.arcTo(a,b+h,a,b,r);this.arcTo(a,b,a+w,b,r);this.closePath()};
const fc=f=>FLW?'#ffffff':f;
function FS_(c,fill,lw,sc){c.fillStyle=fc(fill);c.fill();if(lw!==0){c.lineWidth=lw||1.2;c.strokeStyle=sc||OL;c.lineJoin='round';c.stroke()}}
function E_(c,a,b,rx,ry,fill,lw,rot){c.beginPath();c.ellipse(a,b,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,6.2832);FS_(c,fill,lw)}
function C_(c,a,b,r,fill,lw){E_(c,a,b,r,r,fill,lw)}
function RR(c,a,b,w,h,r,fill,lw){c.beginPath();c.roundRect(a,b,w,h,r);FS_(c,fill,lw)}
function PG(c,pts,fill,lw){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();FS_(c,fill,lw)}
// 平滑闭合曲线:用相邻点中点做二次贝塞尔,画有机形状(头发、云、身体)
function SMO(c,pts,fill,lw){const n=pts.length,m=i=>[(pts[i%n][0]+pts[(i+1)%n][0])/2,(pts[i%n][1]+pts[(i+1)%n][1])/2];c.beginPath();const s=m(n-1);c.moveTo(s[0],s[1]);for(let i=0;i<n;i++){const q=m(i);c.quadraticCurveTo(pts[i][0],pts[i][1],q[0],q[1])}c.closePath();FS_(c,fill,lw)}
function LN_(c,pts,col,w){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=fc(col);c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke()}
// 平滑开放曲线(粗管子):先画深色描边再画颜色,用来画尾巴、脖子、藤蔓
function crv(c,pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);if(pts.length==2){c.lineTo(pts[1][0],pts[1][1]);return}for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;c.quadraticCurveTo(pts[i][0],pts[i][1],i==pts.length-2?pts[i+1][0]:mx,i==pts.length-2?pts[i+1][1]:my)}}
function TUBE(c,pts,w,col,ol){c.lineCap='round';c.lineJoin='round';if(ol!==0){crv(c,pts);c.strokeStyle=OL;c.lineWidth=w+2.4;c.stroke()}crv(c,pts);c.strokeStyle=fc(col);c.lineWidth=w;c.stroke()}
function LG(c,x0,y0,x1,y1,st){if(FLW)return '#fff';const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s));return g}
function RGD(c,x0,y0,r,st){if(FLW)return '#fff';const g=c.createRadialGradient(x0,y0,0,x0,y0,Math.max(.1,r));st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s));return g}
function SHD(c,a,b,rx){E_(c,a,b,rx,rx*.22,'rgba(0,0,0,.22)',0)}
// 卡通大眼睛:白底 + 彩色虹膜 + 黑瞳 + 两个高光
function EYE(c,a,b,rx,ry,iris,lk){E_(c,a,b,rx,ry,'#fff',.8);if(FLW)return;const ix=a+rx*.22*(lk==null?1:lk);E_(c,ix,b+ry*.12,rx*.66,ry*.74,iris,0);E_(c,ix,b+ry*.18,rx*.34,ry*.42,'#14101c',0);C_(c,ix-rx*.28,b-ry*.3,Math.max(.35,rx*.24),'#fff',0);C_(c,ix+rx*.25,b+ry*.35,Math.max(.2,rx*.1),'rgba(255,255,255,.8)',0)}
function WARN(c,a,b,s){if(bwSkip())return;s=s||1;c.save();c.translate(a,b);c.scale(s,s);const k=1+.12*Math.sin(performance.now()/60);c.scale(k,k);PG(c,[[0,-11],[9,6],[-9,6]],'#ffd43b',1.4);c.fillStyle='#c92a2a';c.fillRect(-1.2,-5,2.4,6);c.fillRect(-1.2,2.4,2.4,2);c.restore()}
// 卡通描边文字(页游风:粗黑边 + 亮色/渐变填充)
// =====================================================================
