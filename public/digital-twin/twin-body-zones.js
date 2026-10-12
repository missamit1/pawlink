import * as T from 'three';

export function bodyZones({getDog,getHeart,getFeet,getPaws}){
 const a=new T.Vector3(),b=new T.Vector3(),nearest=new T.Vector3(),line=new T.Line3();
 return hit=>{
  if(!hit||!getDog()?.visible)return '';
  for(const foot of getFeet()){
   if(!foot)continue;let child=foot;
   for(let depth=0;depth<2&&child.parent?.isBone;depth++,child=child.parent){
    child.getWorldPosition(a);child.parent.getWorldPosition(b);line.set(a,b).closestPointToPoint(hit.point,true,nearest);
    if(nearest.distanceTo(hit.point)<.065)return 'steps';
   }
  }
  const chest=getHeart()?.getWorldPosition(a);
  if(chest&&hit.point.y<chest.y-.12){for(const paw of getPaws?.()||[]){if(Math.hypot(hit.point.x-paw.x,hit.point.z-paw.z)<.14)return 'steps';}}
  
  const heart=getHeart();if(heart){heart.getWorldPosition(a);const d=hit.point.clone().sub(a);if((d.x*d.x)/(.23*.23)+(d.y*d.y)/(.18*.18)+(d.z*d.z)/(.36*.36)<1)return 'heart';}
  return '';
 };
}
