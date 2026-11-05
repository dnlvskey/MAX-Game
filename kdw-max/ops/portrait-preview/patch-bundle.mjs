// PORTRAIT-LAYOUT-C preview: applies the source changes of this branch to the
// shipped, minified www/webgl-v5/app.js in memory. Used only by preview.mjs until
// the bundle is rebuilt with `npm run build:max`; the file on disk is not changed.
export function patchBundle(source) {
let s = source;
const once = (needle, replacement) => {
  const i = s.indexOf(needle);
  if (i < 0 || s.indexOf(needle, i + 1) >= 0) throw Error('needle not unique: ' + needle.slice(0, 80));
  s = s.slice(0, i) + replacement + s.slice(i + needle.length);
};

// 1. kdw-pixel-map.mjs: same minified names (um, a8, Qr, r8, C9, eA, o8, $u, c8, Am, d8, l8).
const start = s.indexOf('var um=Object.freeze({width:3072');
const end = s.indexOf('var z9=new WeakMap');
if (start < 0 || end < start) throw Error('pixel-map region not found');
const pixelMap = `
var __kdwPortrait=typeof location<"u"&&new URLSearchParams(location.search).get("display")==="portrait";
var um=__kdwPortrait?Object.freeze({name:"portrait",width:1080,height:1920,left:0,gameWidth:1080,right:0,safeFraction:.04}):Object.freeze({name:"landscape",width:3072,height:1536,left:560,gameWidth:1760,right:752,safeFraction:.07});
function a8(n){return n.get("view")==="pixel-map"}
function Qr(n,e){let P=um,f=P.safeFraction,t=Math.min(n/P.width,e/P.height),s=(n-P.width*t)/2,i=(e-P.height*t)/2,a={left:s+P.left*t,top:i,width:P.gameWidth*t,height:P.height*t};a.right=a.left+a.width,a.bottom=a.top+a.height;let r={left:a.left+a.width*f,top:a.top+a.height*f,width:a.width*(1-2*f),height:a.height*(1-2*f)};return r.right=r.left+r.width,r.bottom=r.top+r.height,{scale:t,left:s,top:i,width:P.width*t,height:P.height*t,touch:a,safe:r}}
function r8(n,e){let t=Object.values(n.tasks).flatMap(d=>Object.values(d.screens)),s=Math.max(392,...t.map(d=>e({kind:d.deviceKind,asset:n.assets[d.assetId]}).width));
 if(__kdwPortrait){let P=um,f=P.safeFraction,r=Math.min(P.gameWidth*(1-2*f)/800,P.height*(1-2*f)/1400),o=P.width/r,c=P.height/r,w=P.gameWidth*(1-2*f)/r,h=P.height*(1-2*f)/r;return{width:o,height:c,scale:r,zone:{left:(P.left+P.gameWidth*f)/r,top:(c-h)/2,w,h},portrait:!0}}
 let i=Math.ceil(Math.max(2048,s+760+64+64)/64)*64,a=1280,r=Math.min(1760*.86/i,1536*.86/a),o=3072/r,c=1536/r,f={left:(560+1760*.07)/r,top:(c-a)/2,w:i,h:a};return{width:o,height:c,scale:r,zone:f}}
function C9(n){if(n.h>n.w){let iconSize=200,gap=64,lw=Math.min(480,n.w*.6),lh=lw*140/440.4539794921875,vw=n.w,vh=vw*550/960,cw=n.w/2,gh=2*(iconSize+96)+gap,top=Math.max(0,(n.h-lh-64-vh-72-gh)/2),vt=top+lh+64,gt=vt+vh+72;return{centre:{x:n.w/2,y:n.h/2},gap,iconSize,rowShift:0,missionOrder:["digital-id","business","blogger","communication"],logo:{x:(n.w-lw)/2,y:top,width:lw,height:lh},video:{x:0,y:vt,width:vw,height:vh},icons:Array.from({length:4},(m,p)=>({x:cw*(p%2+.5)-iconSize/2,y:gt+Math.floor(p/2)*(iconSize+96+gap)}))}}
 let i=177.99816473537075,a=n.w*.65,r=a*550/960,o=a+80,c=n.w-o,f=c/2,d=2*296+64,l=Math.max(r,d),u=100,A=(n.h-i-u-l)/2,h=A+i+u;return{centre:{x:n.w/2,y:n.h/2},gap:64,iconSize:200,rowShift:0,missionOrder:["digital-id","business","blogger","communication"],logo:{x:(n.w-560)/2,y:A,width:560,height:i},video:{x:0,y:h+(l-r)/2,width:a,height:r},icons:Array.from({length:4},(m,p)=>({x:o+f*(p%2+.5)-200/2,y:h+(l-d)/2+Math.floor(p/2)*360}))}}
function eA(){return typeof document>"u"||document.documentElement.dataset.pixelMap!=="true"?null:Qr(innerWidth,innerHeight).safe}
function o8(n,e){let{safe:t,touch:s}=Qr(n,e);return{...t,top:s.top,bottom:s.bottom,height:s.height}}
var $u={};function c8(n){$u=n??{}}
function Am(n){if(!n)return!1;n.style.setProperty("--kdw-keyboard-width",$u.width??1),n.style.setProperty("--kdw-keyboard-height",$u.height??1);let e=eA(),t=Math.min(innerWidth/um.width,innerHeight/um.height),s=($u.x??0)*t,i=($u.y??0)*t;if(!e)return n.style.left=\`calc(50% + \${s}px)\`,n.style.bottom=-i+"px",!1;let lift=__kdwPortrait?0:e.height*.23;return Object.assign(n.style,{left:(e.left+e.right)/2+s+"px",top:"auto",bottom:innerHeight-e.bottom+lift-i+"px"}),n.style.setProperty("--kdw-scale",__kdwPortrait?Math.min(e.width/1600,e.height*.24/900):Math.min(e.width/1600,e.height/900)),!0}
`;
const original = s.slice(start, end);
const d8Start = original.indexOf('function d8(){');
if (d8Start < 0) throw Error('d8 not found');
s = s.slice(0, start) + pixelMap + original.slice(d8Start) + s.slice(end);

// 2. kdw-composition-layout.mjs: column arrangement (variant C) before uF.
once('function uF({device:n,reference:e=null,button:t=null,icons:s=[],timers:i=[]},a={},r=null,o=n?.height*390/800,c="reference"){if(!n||!Object.keys(a).length)return{device:n,reference:e,button:t,icons:s,timers:i};',
  `function __kdwColumn({device:n,reference:e=null,button:t=null,icons:s=[],timers:i=[]},a,F,o){let pct=(v,d)=>(v??d)*o/100,right=F.x+F.width,bottom=F.y+F.height,ts=a.timerScale??.5,row=i.map((r,j)=>({r,j})).sort((A,B)=>A.r.x-B.r.x),pt=[],rh=row.length?Math.max(...row.map(({r})=>r.height*ts)):0;for(let q=row.length-1,x=right;q>=0;q--){let{r,j}=row[q],w=r.width*ts;pt[j]={...r,x:x-w,y:F.y,width:w,height:r.height*ts},x-=w+pct(a.timerGap,4)}let top=F.y+(row.length?rh+pct(a.timerReferenceGap,6):0)+pct(a.topInset,0),p=e;if(e){let k=Math.min(F.width/e.width,a.referenceWidth===void 0?1:a.referenceWidth*o/100/e.width);p={...e,width:e.width*k,height:e.height*k},p.x=F.x+(F.width-p.width)/2,p.y=top}let iw=s.length?pct(a.iconWidth,22):0,sg=s.length?pct(a.iconsDeviceGap,6):0,dt=(p?p.y+p.height:top+pct(a.referenceReserve,56))+pct(a.deviceReferenceGap,8),bg=t?pct(a.buttonGap,32/390*100):0,left=F.x+iw+sg,req=a.deviceScale??1,fit=Math.max(.1,Math.min(req,(right-left)/n.width,(bottom-dt-bg)/(n.height+(t?.height??0)))),d={...n,x:left,y:dt,width:n.width*fit,height:n.height*fit},b=t?{...t,width:Math.min(t.width*fit,d.width),height:t.height*Math.min(fit,d.width/t.width)}:null;b&&(b.x=d.x+(d.width-b.width)/2,b.y=d.y+d.height+bg);let sc=s.map(r=>({k:iw/r.width,r})),tot=sc.reduce((v,{k,r})=>v+r.height*k,0),gap=s.length>1?Math.min(pct(a.iconGap,8),Math.max(0,(d.height-tot)/(s.length-1))):0,y=d.y,pl=sc.map(({k,r})=>{let v={...r,x:F.x,y,width:r.width*k,height:r.height*k};return y+=v.height+gap,v});return{device:d,reference:p,button:b,icons:pl,timers:pt}}
function uF({device:n,reference:e=null,button:t=null,icons:s=[],timers:i=[]},a={},r=null,o=n?.height*390/800,c="reference",F=null){if(!n||!Object.keys(a).length)return{device:n,reference:e,button:t,icons:s,timers:i};if(a.arrangement==="column"&&F)return __kdwColumn({device:n,reference:e,button:t,icons:s,timers:i},a,F,o);`);

// 3. Call site: portrait arrangement, cardsScale 1 by default, host frame.
once('{...X.relative,deviceScale:(X.relative.deviceScale??1)*fF(X.relative,ne?.kind??Ge,ne?.screen??ye)},{x:Be.x+Be.width/2,y:Be.y+Be.height/2},Re,e.get("transitionLayout")==="device"?"device":"reference")',
  '{...X.relative,...(__kdwPortrait?{arrangement:"column"}:{}),deviceScale:(X.relative.deviceScale??1)*fF(__kdwPortrait?{cardsScale:1,...X.relative}:X.relative,ne?.kind??Ge,ne?.screen??ye)},{x:Be.x+Be.width/2,y:Be.y+Be.height/2},Re,e.get("transitionLayout")==="device"?"device":"reference",{x:Be.x,y:Be.y,width:Be.width,height:Be.height})');

// 4. Offsets unit and brand top follow the profile.
if ([...s.matchAll(/=[A-Za-z_$][\w$]*\.width\/3072,/g)].length !== 1) throw Error('composition unit site not unique');
s = s.replace(/(=[A-Za-z_$][\w$]*)\.width\/3072,/g, '$1.width/um.width,');
once('top:1536*.07/s.scale+"px"', 'top:um.height*um.safeFraction/s.scale+"px"');
// journey-v5-device-timer.mjs: palm wait timer and queue in a row above the palm.
once('function DP({left:n,top:e,width:t,height:s}){let i=n+t/2,a=e+s/2,',
  'function DP({left:n,top:e,width:t,height:s}){let i=n+t/2,a=e+s/2;if(__kdwPortrait){let q={left:i-wr.width-24,top:e-64-wr.height,...wr};return{timer:{...q,left:i+24},queue:q}}let ');
// kdw-contact-area.mjs (not in git): the touch radius is authored for the 3072-wide display.
once('(globalThis.innerWidth??3072)/3072', '(globalThis.innerWidth??um.width)/um.width');

return s;
}
