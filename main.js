(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
if(toggle)toggle.addEventListener('click',()=>{const open=header.classList.toggle('is-open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'Закрити':'Меню';});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
if(new URLSearchParams(location.search).has('sent')){const m=document.querySelector('.sent-msg');if(m){m.hidden=false;m.scrollIntoView({block:'center'});}}

// rotating word
document.querySelectorAll('.rotator').forEach(r=>{const w=[...r.children];if(reduce||w.length<2)return;let i=0;
  setInterval(()=>{const prev=w[i];prev.classList.remove('on');prev.classList.add('out');setTimeout(()=>prev.classList.remove('out'),750);i=(i+1)%w.length;w[i].classList.add('on');},2300);});

// accordion: one open at a time
document.querySelectorAll('.acc').forEach(a=>{const items=[...a.querySelectorAll('details')];items.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)items.forEach(o=>{if(o!==d)o.open=false;});}));});

// progress bars widget
document.querySelectorAll('.prog').forEach(p=>{const n=+p.dataset.n||30,on=+p.dataset.on||20;p.innerHTML=Array.from({length:n},(_,i)=>'<i style="--i:'+i+'"'+(i<on?' data-on':'')+'></i>').join('');});
document.querySelectorAll('.bars').forEach(b=>{const hs=[30,46,38,60,52,70,44,78,66,58,84,72,90,80,96,88,100,92];b.innerHTML=hs.map((h,i)=>'<i style="--h:'+h+'%;--i:'+i+'"></i>').join('');});

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.prog i[data-on]').forEach(i=>i.classList.add('on'));io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));

// words lighting up
document.querySelectorAll('[data-words]').forEach(el=>{const out=[];el.childNodes.forEach(n=>{
  if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))out.push(document.createTextNode(t));else{const s=document.createElement('span');s.className='w';s.textContent=t;out.push(s);}});}
  else if(n.nodeType===1){n.classList.add('w');out.push(n);}});el.replaceChildren(...out);});
const words=[...document.querySelectorAll('[data-words]')];
const hs=[...document.querySelectorAll('.hs')];
const desk=matchMedia('(min-width: 901px)');
function sizeHs(){hs.forEach(s=>{const t=s.querySelector('.hs-track');
  if(desk.matches&&!reduce&&t.offsetWidth){const dist=Math.max(0,t.scrollWidth-innerWidth);s.style.height=(dist+innerHeight)+'px';s.dataset.dist=dist;}
  else{s.style.height='';s.dataset.dist=0;t.style.transform='';}});}
let ticking=false;
function frame(){const vh=innerHeight;
  header.classList.toggle('scrolled',scrollY>20);
  words.forEach(el=>{const r=el.getBoundingClientRect();const p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.3)));const ws=el.querySelectorAll('.w');const n=Math.round(p*ws.length);ws.forEach((w,i)=>w.classList.toggle('lit',reduce||i<n));});
  hs.forEach(s=>{const d=+s.dataset.dist;if(!d)return;const r=s.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/(s.offsetHeight-vh)));
    s.querySelector('.hs-track').style.transform='translate3d('+(-p*d)+'px,0,0)';const bar=s.querySelector('.hs-bar i');if(bar)bar.style.transform='scaleX('+p+')';});
  ticking=false;}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame);}}
addEventListener('scroll',req,{passive:true});
addEventListener('resize',()=>{sizeHs();req();});
window.uppoRefresh=()=>{sizeHs();frame();};
uppoRefresh();
if(document.fonts)document.fonts.ready.then(uppoRefresh);

// orb follows mouse
if(!reduce&&matchMedia('(pointer:fine)').matches){addEventListener('mousemove',e=>{const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;document.querySelectorAll('.orb-wrap').forEach(o=>{o.style.setProperty('--mx',x.toFixed(3));o.style.setProperty('--my',y.toFixed(3));});});
  const c=document.createElement('div');c.className='cursor';c.setAttribute('aria-hidden','true');document.body.appendChild(c);
  let x=-100,y=-100,cx=x,cy=y;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';requestAnimationFrame(loop);})();
  document.addEventListener('mouseover',e=>c.classList.toggle('big',!!e.target.closest('a,button,label,summary')));}
})();
