

export async function createMovementSense(host){
 let renderer,geometry,material;
 try{
  const T=await import('./vendor/three.module.js');
  renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.append(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(58,1,.1,30);camera.position.set(0,1.1,0);camera.lookAt(0,.7,-8);
  const points=new Float32Array(12*2*3);geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(points,3));material=new T.LineBasicMaterial({color:0xf0dfb9,transparent:true,opacity:0,depthWrite:false});scene.add(new T.LineSegments(geometry,material));
  return {render(time,intensity){const w=host.clientWidth,h=host.clientHeight;if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
    
    for(let i=0;i<12;i++){const side=i%2?1:-1;const z=-1-((i*1.6-time*(.9+intensity*1.1))%12+12)%12;const x=side*(2.2+(i%3)*.38);const k=i*6;points.set([x,0,z,x,0,z-.08-intensity*.24],k)}
    geometry.attributes.position.needsUpdate=true;material.opacity=.04+intensity*.16;renderer.render(scene,camera);
  },clear(){renderer.clear()},dispose(){geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove()}};
 }catch{renderer?.dispose();geometry?.dispose();material?.dispose();return{render(){},clear(){},dispose(){}}}
}
