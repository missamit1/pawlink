
function stepPortrait(direction){if(isEntering)return;vX=0;SCROLL_X=mod((Math.round(SCROLL_X/STEP)+direction)*STEP,TRACK);updateCarouselTransforms();}
document.querySelector('#previous').addEventListener('click',()=>stepPortrait(-1));
document.querySelector('#next').addEventListener('click',()=>stepPortrait(1));
stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stepPortrait(event.key==='ArrowRight'?1:-1)}});
const paintCount=()=>{document.querySelector('#portraitCount').textContent=String(activeIndex+1).padStart(2,'0')+' / '+IMAGES.length;};
setInterval(paintCount,250);
function cancelDrag(){dragging=false;lastDelta=0;stage.classList.remove('dragging')}
stage.addEventListener('pointercancel',cancelDrag);stage.addEventListener('lostpointercapture',cancelDrag);window.addEventListener('blur',cancelDrag);
let hostVisible=true;
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='pawlink:gallery-visibility')return;hostVisible=event.data.visible;if(!hostVisible){cancelCarousel();cancelBG()}else if(!isEntering&&!document.hidden){startCarousel();startBG()}});
document.addEventListener('visibilitychange',()=>{if(!hostVisible){cancelCarousel();cancelBG()}});
window.addEventListener('pagehide',()=>{cancelCarousel();cancelBG()});

function scrollStory(delta){if(parent!==window)parent.scrollBy({top:delta,behavior:'instant'});}
window.addEventListener('wheel',event=>{if(parent===window||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;event.preventDefault();event.stopImmediatePropagation();scrollStory(event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1));},{capture:true,passive:false});
let storyTouch=null;
window.addEventListener('touchstart',event=>{const t=event.touches[0];storyTouch=t?{x:t.clientX,y:t.clientY,last:t.clientY,vertical:null}:null;},{capture:true,passive:true});
window.addEventListener('touchmove',event=>{if(!storyTouch||parent===window)return;const t=event.touches[0];const dx=t.clientX-storyTouch.x,dy=t.clientY-storyTouch.y;if(storyTouch.vertical===null&&Math.max(Math.abs(dx),Math.abs(dy))>8)storyTouch.vertical=Math.abs(dy)>Math.abs(dx);if(storyTouch.vertical){event.preventDefault();event.stopImmediatePropagation();cancelDrag();scrollStory(storyTouch.last-t.clientY);}storyTouch.last=t.clientY;},{capture:true,passive:false});
window.addEventListener('touchend',()=>{storyTouch=null;},{passive:true});
window.addEventListener('keydown',event=>{if(parent===window||event.target.closest('a,button,input'))return;const distance={ArrowDown:80,ArrowUp:-80,PageDown:innerHeight*.85,PageUp:-innerHeight*.85,' ':innerHeight*.85}[event.key];if(distance){event.preventDefault();scrollStory(distance);}},{capture:true});
