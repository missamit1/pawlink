import * as T from './vendor/three.module.js';

export function smoothWalkingClip(source){
 const clip=source.clone();
 clip.tracks=clip.tracks.map(track=>{
  if(!track.name.endsWith('.quaternion')||track.times.length<4)return track;
  const n=track.times.length-1,duration=source.duration,values=Array.from(track.values);
  for(let i=1;i<=n;i++){let dot=0;for(let c=0;c<4;c++)dot+=values[(i-1)*4+c]*values[i*4+c];if(dot<0)for(let c=0;c<4;c++)values[i*4+c]*=-1;}
  
  if(Math.hypot(...values.slice(0,4).map((v,c)=>v-values[n*4+c]))>.001)return track;
  const count=Math.ceil(duration*120),times=[],out=[];
  const at=(i,c)=>values[((i%n+n)%n)*4+c];
  const time=i=>i<0?track.times[n-1]-duration:i>=n?track.times[i-n]+duration:track.times[i];
  for(let k=0;k<=count;k++){
   const t=k*duration/count;let i=0;while(i<n-1&&track.times[i+1]<=t)i++;
   const h=time(i+1)-time(i),u=(t-time(i))/h,q=[];
   for(let c=0;c<4;c++){
    const p=at(i,c),next=at(i+1,c),m0=(next-at(i-1,c))/(time(i+1)-time(i-1)),m1=(at(i+2,c)-p)/(time(i+2)-time(i));
    q[c]=(2*u*u*u-3*u*u+1)*p+(u*u*u-2*u*u+u)*h*m0+(-2*u*u*u+3*u*u)*next+(u*u*u-u*u)*h*m1;
   }
   const norm=Math.hypot(...q);times.push(t);out.push(...q.map(v=>v/norm));
  }
  return new T.QuaternionKeyframeTrack(track.name,times,out);
 });return clip;
}

export function walkingWeight(root,clip,feet){
 if(feet.some(f=>!f))return ()=>{};
 const bones={};root.traverse(o=>{if(o.isBone)bones[o.name.replaceAll(':','')]=o;});
 const spine=bones.Spine_0,head=bones.Head_0;
 if(!spine||!head)return ()=>{};
 const sampleMixer=new T.AnimationMixer(root);sampleMixer.clipAction(clip).play();
 const count=96,samples=[],point=new T.Vector3();
 for(let i=0;i<count;i++){sampleMixer.setTime(i*clip.duration/count);root.updateMatrixWorld(true);samples.push(feet.map(f=>f.getWorldPosition(point).y));}
 sampleMixer.stopAllAction();sampleMixer.uncacheRoot(root);
 const minimum=feet.map((_,j)=>Math.min(...samples.map(s=>s[j])));
 const balance=samples.map(s=>{const w=s.map((v,j)=>Math.exp(-Math.max(0,v-minimum[j])/.025));return [(w[0]+w[2]-w[1]-w[3])/(w.reduce((a,b)=>a+b,0)+.001),(w[0]+w[1]-w[2]-w[3])/(w.reduce((a,b)=>a+b,0)+.001)];});
 const baseSpine=spine.quaternion.clone(),baseHead=head.quaternion.clone(),q=new T.Quaternion(),e=new T.Euler();
 return (seconds,enabled)=>{
  if(!enabled)return;
  const phase=((seconds/clip.duration)%1+1)%1*count,i=Math.floor(phase),u=phase-i;
  const side=T.MathUtils.lerp(balance[i][0],balance[(i+1)%count][0],u),fore=T.MathUtils.lerp(balance[i][1],balance[(i+1)%count][1],u);
  
  e.set(fore*.006,0,side*.009);q.setFromEuler(e);spine.quaternion.copy(baseSpine).multiply(q);
  e.set(-fore*.004,0,-side*.006);q.setFromEuler(e);head.quaternion.copy(baseHead).multiply(q);
 };
}
