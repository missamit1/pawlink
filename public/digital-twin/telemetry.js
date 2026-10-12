
export function normalizeTelemetry(input={}){
 const finite=(v,min=-Infinity,max=Infinity)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:null;
 const steps=finite(input.steps,0);
 const created=typeof input.created_at==='string'?Date.parse(input.created_at):NaN;
 return {heart_rate:finite(input.heart_rate,1),hydration:finite(input.hydration,0,100),temperature:finite(input.temperature),activity:finite(input.activity,0),steps:Number.isSafeInteger(steps)?steps:null,activity_state:['walking','running','resting','sleeping'].includes(input.activity_state)?input.activity_state:null,latitude:finite(input.location?.latitude??input.latitude,-90,90),longitude:finite(input.location?.longitude??input.longitude,-180,180),alerts:Array.isArray(input.alerts)?input.alerts:[],created_at:Number.isFinite(created)?new Date(created).toISOString():null};
}
export function isStale(reading,now=Date.now(),thresholdMs=60000){return reading.created_at!==null&&now-Date.parse(reading.created_at)>thresholdMs;}
