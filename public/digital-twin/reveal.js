
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const zero=()=>({coat:0,scan:0,ribs:0,heart:0,labels:0,collar:0});
export class TwinReveal {
 constructor(){this.value=zero();this.from=zero();this.target=false;this.started=0;this.beatSeen=null;this.state='real';}
 set(target,now){if(target===this.target)return;this.from={...this.value};this.target=target;this.started=now;this.beatSeen=null;this.state=target?'revealing':'closing';}
 update(now,beatCrossed,hasHeartRate,reduced=false){
  const age=Math.max(0,now-this.started);
  if(this.target){
   if(age>=3.2&&this.beatSeen===null&&(beatCrossed||!hasHeartRate||reduced))this.beatSeen=now;
   const wait=this.beatSeen===null?0:smooth(.5,1.25,now-this.beatSeen);
   const to={coat:smooth(.35,1.1,age),scan:smooth(.55,3,age),ribs:smooth(1.7,2.7,age),heart:smooth(2.55,3.2,age),labels:wait,collar:Math.sin(Math.PI*Math.min(1,age/.95))};
   for(const key of Object.keys(to))this.value[key]=reduced?(key==='collar'?0:1):this.from[key]+(1-this.from[key])*to[key];
   this.value.collar=reduced?0:to.collar;
   this.state=this.value.labels>=1?'twin':'revealing';
  }else{
   for(const key of Object.keys(this.value))this.value[key]=reduced?0:this.from[key]*(1-smooth(0,key==='labels'?.3:1.1,age));
   this.state=this.value.coat===0?'real':'closing';
  }
  return this.value;
 }
}
export function advancePulse(phase,dt,bpm){
 const step=Number.isFinite(bpm)&&bpm>0?dt*bpm/60:0;
 return {phase:(phase+step)%1,crossed:step>0&&Math.floor(phase+step-.12)>Math.floor(phase-.12)};
}
