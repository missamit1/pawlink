
(async()=>{
 const wrapper=document.querySelector('.paw-horizontal'),text=wrapper?.querySelector('h2');
 const frame=document.querySelector('#gradientPortraits');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!frame)return;if(entry.isIntersecting&&!frame.hasAttribute('src'))frame.src=frame.dataset.src;frame.contentWindow?.postMessage({type:'pawlink:gallery-visibility',visible:entry.isIntersecting},location.origin)}},{rootMargin:'150px'});if(frame)observer.observe(frame);
 if(true){wrapper?.classList.remove('type-active'); dispatchEvent(new Event('pawlink:layout-ready')); return;}
if(!window.gsap||!window.SplitText||!window.ScrollTrigger||!wrapper||!text)return;
 gsap.registerPlugin(SplitText,ScrollTrigger);
 await document.fonts.ready;
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
   wrapper.classList.add('type-active');
   const split=SplitText.create(text,{type:'chars,words',aria:'auto'});
   const scrollTween=gsap.to(text,{x:()=>-Math.max(0,text.scrollWidth-innerWidth+innerWidth*.07),ease:'none',scrollTrigger:{id:'pawlink-horizontal',trigger:wrapper,start:'top bottom',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
   split.chars.forEach(char=>gsap.from(char,{yPercent:12,rotation:0,ease:'back.out(1.2)',scrollTrigger:{trigger:char,containerAnimation:scrollTween,start:'left 100%',end:'left 30%',scrub:1}}));
   return ()=>{split.revert();wrapper.classList.remove('type-active')};
 });
 ScrollTrigger.refresh();
 dispatchEvent(new Event('pawlink:layout-ready'));
 
 
 document.querySelector('.campaign-notebook')?.addEventListener('toggle',()=>ScrollTrigger.refresh());
 addEventListener('pagehide',()=>{observer.disconnect();mm.revert()},{once:true});
})();