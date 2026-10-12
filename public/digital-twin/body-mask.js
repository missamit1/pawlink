import * as T from 'three';
export const maskGLSL=`
uniform vec3 uBodyOrigin;
uniform float uBodyProgress;
float bodyHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float bodyNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(bodyHash(i),bodyHash(i+vec3(1,0,0)),f.x),mix(bodyHash(i+vec3(0,1,0)),bodyHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(bodyHash(i+vec3(0,0,1)),bodyHash(i+vec3(1,0,1)),f.x),mix(bodyHash(i+vec3(0,1,1)),bodyHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float bodyDistance(vec3 p){vec3 d=(p-uBodyOrigin)*vec3(1.0,1.15,.82);float n=bodyNoise(p*15.)*.65+bodyNoise(p*31.)*.25+bodyNoise(p*61.)*.10;return length(d)+(n-.5)*.09+(bodyNoise(p*6.)-.5)*.035;}
float bodyMask(vec3 p,float inset){float radius=mix(.005,1.30,pow(uBodyProgress,1.8));float m=1.-smoothstep(radius-.025-inset,radius+.018-inset,bodyDistance(p));return m*smoothstep(0.,.025,uBodyProgress);}
`;
export function bodyMaskSignals(){return {origin:{value:new T.Vector3(0,.46,.20)},progress:{value:0},worldToRest:{value:new T.Matrix4()}};}
export function maskAnatomy(material,signals,inset=.025){const before=material.onBeforeCompile.bind(material);material.onBeforeCompile=s=>{before(s);Object.assign(s.uniforms,{uBodyOrigin:signals.origin,uBodyProgress:signals.progress,uBodyWorldToRest:signals.worldToRest});s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vBodyWorld;').replace('#include <project_vertex>','#include <project_vertex>\nvBodyWorld=(modelMatrix*vec4(transformed,1.)).xyz;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n'+maskGLSL+'\nuniform mat4 uBodyWorldToRest;varying vec3 vBodyWorld;');s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`float inside=bodyMask((uBodyWorldToRest*vec4(vBodyWorld,1.)).xyz,${inset.toFixed(3)});if(inside<.01)discard;diffuseColor.a*=inside;\n#include <opaque_fragment>`);};material.customProgramCacheKey=()=>`body-anatomy-${inset}`;}
