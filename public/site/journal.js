(()=>{
 const root=document.querySelector('#day-journal');if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const videos=[...document.querySelectorAll('.pl-journal video,.pl-details video')];
 const manuallyPaused=new WeakSet();
 const observer=new IntersectionObserver(entries=>{for(const e of entries){const v=e.target;if(e.isIntersecting&&!document.hidden&&!reduced.matches&&!manuallyPaused.has(v)){v.play().catch(()=>{});}else v.pause();}},{threshold:.45});
 const warmup=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.preload='auto';if(e.target.readyState===0)e.target.load();warmup.unobserve(e.target);}}},{rootMargin:'1200px 0px'});
 videos.forEach(v=>warmup.observe(v));
 videos.forEach(v=>{const b=v.parentElement.querySelector('.pl-film-toggle');const sync=()=>{b.textContent=v.paused?'Play film ↗':'Pause film Ⅱ';b.setAttribute('aria-label',(v.paused?'Play ':'Pause ')+v.getAttribute('aria-label'));};b.addEventListener('click',()=>{if(v.paused){manuallyPaused.delete(v);v.play().catch(()=>{b.textContent='Try playing again ↗';});}else{manuallyPaused.add(v);v.pause();}});v.addEventListener('play',()=>{videos.forEach(other=>{if(other!==v)other.pause();});sync();});v.addEventListener('pause',sync);v.addEventListener('canplay',()=>{const r=v.getBoundingClientRect();const visible=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));if(visible>=r.height*.45&&!document.hidden&&!reduced.matches&&!manuallyPaused.has(v))v.play().catch(()=>{});});observer.observe(v);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());});
 reduced.addEventListener('change',()=>{if(reduced.matches)videos.forEach(v=>v.pause());});
 const moments=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){root.querySelectorAll('.pl-day-nav a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -40% 0px'});root.querySelectorAll('.pl-moment').forEach(x=>moments.observe(x));
 const dialog=document.querySelector('.pl-detail-dialog');let opener;
 const details={collar:['assets/journal/collar.webp','A familiar little connection.','Ivory tones. Fine stitching. A small detail that stays close, through every ordinary moment.','Ivory PawLink collar, shown in detail'],characters:['assets/journal/characters.webp','No two quite alike.','Different faces, textures and personalities. A whole world behind every pair of eyes.','Three distinctive dogs against a burgundy backdrop']};
 document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{opener=b;const d=details[b.dataset.detail];dialog.querySelector('img').src=d[0];dialog.querySelector('img').alt=d[3];dialog.querySelector('h2').textContent=d[1];dialog.querySelector('p').textContent=d[2];dialog.showModal();}));
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>opener?.focus());
 addEventListener('pagehide',()=>{observer.disconnect();moments.disconnect();videos.forEach(v=>v.pause());},{once:true});
})();
