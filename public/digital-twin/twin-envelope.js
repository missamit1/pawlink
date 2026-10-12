import * as T from 'three';
import {maskGLSL} from './body-mask.js';

export function addInnerEnvelope(root,signals,completeTwin){
 const meshes=[];root.traverse(o=>{if(o.isSkinnedMesh&&!o.userData.innerEnvelope)meshes.push(o);});
 for(const outer of meshes){
  const material=new T.MeshStandardMaterial({color:0x716d65,roughness:.82,metalness:.05,side:T.BackSide,transparent:true,opacity:1,depthWrite:false,envMapIntensity:.35});
  material.forceSinglePass=true;
  material.onBeforeCompile=s=>{Object.assign(s.uniforms,{uCompleteTwin:completeTwin,uBodyOrigin:signals.origin,uBodyProgress:signals.progress});
   s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed-=normal*.018;').replace('#include <common>','#include <common>\nvarying vec3 vEnvelopeRest;').replace('#include <project_vertex>','#include <project_vertex>\nvEnvelopeRest=position;');
   s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n'+maskGLSL+'\nuniform float uCompleteTwin;varying vec3 vEnvelopeRest;').replace('#include <opaque_fragment>',`
    vec3 footprint=vEnvelopeRest;footprint.x=mix(footprint.x,uBodyOrigin.x,.85);
    float opened=max(bodyMask(footprint,-.045),uCompleteTwin);if(opened<.005)discard;
    float density=.78+.12*bodyNoise(vEnvelopeRest*13.);
    float cavity=exp(-pow((vEnvelopeRest.y-.45)/.15,2.)-pow((vEnvelopeRest.z-.13)/.22,2.));
    float maturity=smoothstep(.22,.48,uBodyProgress);
    vec3 depthTone=mix(vec3(.075,.080,.077),vec3(.017,.028,.028),cavity*maturity);
    outgoingLight=mix(depthTone,outgoingLight,density*mix(.43,.19,cavity*maturity));
    float face=smoothstep(.49,.64,vEnvelopeRest.y)*smoothstep(.12,.29,vEnvelopeRest.z);
    float nested=bodyNoise(vEnvelopeRest*9.);
    outgoingLight=mix(outgoingLight,outgoingLight*.70+vec3(.035,.063,.056)*( .45+nested),uCompleteTwin*(1.-face));
    diffuseColor.a=opened*.98;
    #include <opaque_fragment>`);
  };material.customProgramCacheKey=()=> 'campaign-inner-envelope-56';
  const inner=outer.clone(false);inner.name='RayInnerEnvelope';inner.castShadow=false;inner.receiveShadow=false;inner.userData={innerEnvelope:true};inner.material=material;inner.geometry=outer.geometry;inner.skeleton=outer.skeleton;inner.bindMatrix.copy(outer.bindMatrix);inner.bindMatrixInverse.copy(outer.bindMatrixInverse);inner.morphTargetInfluences=outer.morphTargetInfluences;inner.renderOrder=0;inner.frustumCulled=false;outer.parent.add(inner);
 }
}
