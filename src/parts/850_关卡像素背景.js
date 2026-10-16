// ===== 关卡像素背景(LBG,art_src/lbg/build_lbg.py):每关一组视差图层,像素美术时代替矢量的天空 / 云 / 远景 / 中景 / 近景(地面、平台、巢穴不变)=====
// 一关 Mountain at Dusk · 二关 Night Town(转紫)· 三关 Forest Background · 四关 Gothicvania Swamp(以上 ansimuz,CC0)· 五关 Rocky Roads(GrafxKid,CC0,换沙色)
// 六关 Winter Pixel Art Background With Mountain(CraftPix,OGA-BY 3.0)· 七关 同上调成夜色 + Dark winter background 枯树雾气(dlsxjvb1,CC0)
// meta:sky = [图集 y, 宽, 高, 放大, 横向拉伸, 视差];layers = [图集 y, 宽, 高, 放大, 屏幕底边 y, 视差, 自动飘移速度]
const LBG={I:null,D:'@@A:lbg_atlas@@',M:{"1":{"layers":[[160,272,83,2,312,0.08,0],[243,544,90,2,312,0.18,0],[333,544,46,2,312,0.35,0],[379,544,55,2,318,0.55,0]],"sky":[0,272,160,2,1,0]},"2":{"layers":[[658,288,108,2,78,0.04,4],[766,96,139,2,300,0.1,0],[905,96,139,2,300,0.1,0],[1044,320,68,2,262,0.22,0],[1112,64,91,2,306,0.32,0],[1203,512,94,2,306,0.45,0]],"sky":[434,96,224,2,1,0]},"3":{"layers":[[1457,272,67,2,132,0.12,0],[1524,272,160,2,318,0.25,0],[1684,272,160,2,318,0.5,0]],"sky":[1297,272,160,2,1,0.06]},"4":{"layers":[[1844,416,256,2,318,0.18,0],[2100,288,208,2,318,0.42,0]],"top":"rgb(47,47,28)"},"5":{"layers":[[2436,256,83,2,200,0.03,3],[2519,256,107,2,292,0.12,0],[2626,256,111,2,300,0.2,0],[2737,256,83,2,304,0.32,0]],"sky":[2308,256,128,2,1,0]},"6":{"layers":[[3144,576,92,1,114,0.02,5],[3236,576,324,1,330,0.1,0],[3560,576,253,1,330,0.22,0],[3813,576,41,1,330,0.4,0]],"sky":[2820,576,324,1,1.12,0]},"7":{"layers":[[3854,576,324,1,330,0.08,0],[4178,576,253,1,330,0.2,0],[4431,420,129,1,312,0.32,0],[4560,576,41,1,330,0.45,0]],"vsky":1}},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(){return SET.art!==0&&!!this.I&&!!this.M[cur]},
  row(r,sc,bot,par,dr,t){const W=r[1]*sc,H=r[2]*sc,top=Math.round(bot-H);let ox=-(((cam*par+t*dr)%W)+W)%W;ox=Math.floor(ox);
    for(let px=ox;px<VW;px+=W)x.drawImage(this.I,0,r[0],r[1],r[2],px,top,W,H)},
  draw(t){const m=this.M[cur];x.imageSmoothingEnabled=false;
    if(m.top){x.fillStyle=m.top;x.fillRect(0,0,VW,VH)}
    if(m.vsky)x.drawImage(lvArt().sky,0,0,VW,VH);
    if(m.sky){const [y,w,h,sc,ss,par]=m.sky,W=w*sc*ss,H=h*sc*ss,top=312-H;
      if(top>0)x.drawImage(this.I,0,y,w,1,0,0,VW,top+1);
      let ox=ss>1?(VW-W)/2:-(((cam*par)%W)+W)%W;ox=Math.floor(ox);for(let px=ox;px<VW;px+=W)x.drawImage(this.I,0,y,w,h,px,Math.round(top),W,H)}
    if(cur==7)moon7();
    for(const L of m.layers)this.row(L,L[3],L[4],L[5],L[6],t);
    if(cur==5){// 沙漠近景:原来的矢量仙人掌 / 石头按 1 倍分辨率画成像素图
      if(!this.vn){const r=RS;RS=1;this.vn=mkL(960,72,LVA[5].near,236);RS=r}const W=960;let ox=Math.floor(-(((cam*.75)%W)+W)%W);for(let q=ox;q<VW;q+=W)x.drawImage(this.vn,q,236,W,72)}
    x.imageSmoothingEnabled=true}};
LBG.init();
