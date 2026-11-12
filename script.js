(function(){
var root=document.documentElement,btn=document.querySelector(".mode");
function label(){btn.setAttribute("aria-label",root.dataset.theme==="dark"?"Ganti ke tema terang":"Ganti ke tema gelap")}
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem("tema",t)}catch(e){}label()}
label();
btn.addEventListener("click",function(){
  var n=root.dataset.theme==="dark"?"light":"dark";
  if(document.startViewTransition&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    root.classList.add("theming");
    document.startViewTransition(function(){setTheme(n)}).finished.finally(function(){root.classList.remove("theming")});
  }else setTheme(n);
});

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
var near=40;
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
})();
