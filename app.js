(function(){
var root=document.documentElement,btn=document.querySelector(".mode");
var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* tema + menu */
var tbtn=document.getElementById("theme"),mbtn=document.getElementById("menubtn"),menu=document.getElementById("menu"),tl=document.getElementById("tlabel");
function label(){var d=root.dataset.theme==="dark";tl.textContent=d?"Mode terang":"Mode gelap";tbtn.setAttribute("aria-label",d?"Ganti ke mode terang":"Ganti ke mode gelap")}
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem("tema",t)}catch(e){}label()}
label();
tbtn.addEventListener("click",function(){
  var n=root.dataset.theme==="dark"?"light":"dark",r=tbtn.getBoundingClientRect();
  if(document.startViewTransition&&!reduced){
    root.style.setProperty("--tx",r.left+r.width/2+"px");root.style.setProperty("--ty",r.top+r.height/2+"px");
    root.classList.add("theming");
    document.startViewTransition(function(){setTheme(n)}).finished.finally(function(){root.classList.remove("theming")});
  }else setTheme(n);
});
function toggleMenu(o){
  var open=o===undefined?!menu.classList.contains("open"):o;
  if(open)menu.style.setProperty("--mh",menu.querySelector(".mi").offsetHeight+"px");
  menu.classList.toggle("open",open);mbtn.classList.toggle("open",open);
  mbtn.setAttribute("aria-expanded",open);menu.setAttribute("aria-hidden",!open);
}
mbtn.addEventListener("click",function(){toggleMenu()});
document.addEventListener("click",function(e){
  if(!menu.classList.contains("open")||mbtn.contains(e.target))return;
  if(e.target.closest("#theme, .seg button"))return;
  toggleMenu(false);
});
addEventListener("keydown",function(e){if(e.key==="Escape")toggleMenu(false)});

/* sisi teknis dan kreatif: seluruh web berganti tampilan */
var segBtns=menu.querySelectorAll("[data-sisi]");
function segSync(){segBtns.forEach(function(b){b.classList.toggle("on",b.dataset.sisi===root.dataset.sisi)})}
segSync();
function setSide(s,x,y){
  if(s===root.dataset.sisi)return;
  try{localStorage.setItem("sisi",s)}catch(e){}
  function apply(){root.dataset.sisi=s;root.dataset.tone=s;segSync();scrollTo(0,0)}
  if(document.startViewTransition&&!reduced){
    root.style.setProperty("--tx",x+"px");root.style.setProperty("--ty",y+"px");
    root.classList.add("theming","swapside");
    document.startViewTransition(apply).finished.finally(function(){root.classList.remove("theming","swapside")});
  }else apply();
}
segBtns.forEach(function(b){b.addEventListener("click",function(){
  var r=b.getBoundingClientRect();setSide(b.dataset.sisi,r.left+r.width/2,r.top+r.height/2);
  setTimeout(function(){toggleMenu(false)},520);
})});
document.addEventListener("click",function(e){
  var w=e.target.closest("[data-switch]");
  if(w){e.preventDefault();setSide(w.dataset.switch,e.clientX,e.clientY)}
});

/* indikator tab: meluncur dari tab sebelumnya, melar sedikit dan memantul */
var bar=document.querySelector(".bar"),ind=bar.querySelector(".ind"),tabs=bar.querySelectorAll("a");
var cur=+bar.dataset.i,prev=null;
try{var p=sessionStorage.getItem("tabPrev");if(p!==null)prev=+p;sessionStorage.setItem("tabPrev",cur)}catch(e){}
function setOn(i){tabs.forEach(function(a,k){a.classList.toggle("on",k===i)})}
setOn(cur);
if(prev!==null&&prev!==cur&&!reduced){
  setOn(prev);
  ind.animate([{translate:prev*100+"% 0"},{translate:cur*100+"% 0"}],{duration:620,delay:70,easing:"cubic-bezier(.3,1.35,.5,1)",fill:"backwards"});
  ind.animate([{scale:"1 1"},{scale:"1.3 .9",offset:.35},{scale:"1 1"}],{duration:620,delay:70,easing:"ease-in-out"});
  setTimeout(function(){setOn(cur)},90);
}

/* latar cahaya tetap nyambung antar halaman */
try{
  var t0=sessionStorage.getItem("t0");if(!t0){t0=Date.now();sessionStorage.setItem("t0",t0)}
  var s=(Date.now()-t0)/1000;
  document.querySelectorAll(".orbs i").forEach(function(o){
    var d=parseFloat(getComputedStyle(o).animationDuration)||22;
    o.style.animationDelay="-"+(s%(d*2))+"s";
  });
}catch(e){}

/* cahaya putih di panel kaca */
var near=24;
function glow(e){
  document.querySelectorAll(".glass").forEach(function(el){
    var r=el.getBoundingClientRect();
    el.style.setProperty("--mx",(e.clientX-r.left)+"px");
    el.style.setProperty("--my",(e.clientY-r.top)+"px");
    el.classList.toggle("lit",e.clientX>r.left-near&&e.clientX<r.right+near&&e.clientY>r.top-near&&e.clientY<r.bottom+near);
  });
}
function off(){document.querySelectorAll(".lit").forEach(function(el){el.classList.remove("lit")})}
addEventListener("pointermove",glow,{passive:true});
addEventListener("pointerdown",glow,{passive:true});
addEventListener("pointerup",function(e){if(e.pointerType!=="mouse")off()});
addEventListener("pointercancel",off);
document.addEventListener("mouseleave",off);

/* cadangan transisi untuk browser lama */
if(!("onpagereveal" in window)){
  document.addEventListener("click",function(e){
    var a=e.target.closest("a[href]");
    if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var u=new URL(a.href,location.href);
    if(u.origin!==location.origin||u.pathname===location.pathname)return;
    e.preventDefault();document.body.classList.add("leaving");
    setTimeout(function(){location.href=a.href},320);
  });
}
addEventListener("pageshow",function(e){if(e.persisted)document.body.classList.remove("leaving")});

/* layar pembuka: hello berbagai bahasa, lalu NOVRIAN_EDITZ */
(function(){
  var B=document.getElementById("boot");
  if(!B||!root.classList.contains("booting"))return;
  var done=false,hw=document.getElementById("hw"),name=B.querySelector(".b-name");
  "NOVRIAN_EDITZ".split("").forEach(function(c,i){
    var sp=document.createElement("span");sp.textContent=c;sp.style.setProperty("--d",i*70+"ms");
    if(c==="_")sp.className="us";name.appendChild(sp);
  });
  function end(){
    if(done)return;done=true;
    document.body.classList.add("reveal");B.classList.add("out");
    setTimeout(function(){root.classList.remove("booting");B.remove()},850);
  }
  B.addEventListener("click",end);
  addEventListener("keydown",end,{once:true});
  var L=["hello","halo","你好","こんにちは","안녕하세요","hola","नमस्ते","bonjour"],i=0;
  function next(){
    if(done)return;
    if(i>=L.length){B.classList.add("logo");setTimeout(end,3600);return}
    hw.classList.remove("w");void hw.offsetWidth;
    hw.textContent=L[i++];hw.classList.add("w");
    setTimeout(next,750);
  }
  setTimeout(next,500);
})();
})();
