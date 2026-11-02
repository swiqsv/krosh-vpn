import * as THREE from './three.module.js';
const container=document.querySelector('#scene');
try{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.8,10);camera.lookAt(0,.5,0);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;container.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xc8efff,0x193d22,2.7));
function light(color,intensity,x,y,z){const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);return l}
const key=light(0xffffff,4,-3,5,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.025;light(0xa7ff5d,3,4,1,-2);light(0x2bbcff,2,-4,0,-2);
const blue=new THREE.MeshStandardMaterial({color:0x26b9ed,roughness:.32,metalness:.05});const innerBlue=new THREE.MeshStandardMaterial({color:0x8bddef,roughness:.5});const white=new THREE.MeshStandardMaterial({color:0xffffef,roughness:.23});const pupilMat=new THREE.MeshStandardMaterial({color:0x152e44,roughness:.16});const pink=new THREE.MeshStandardMaterial({color:0xec6995,roughness:.3});const mouthMat=new THREE.MeshStandardMaterial({color:0x3f1625,roughness:.7});
const krosh=new THREE.Group();scene.add(krosh);krosh.position.y=.2;krosh.rotation.y=-.14;
const geo=new THREE.SphereGeometry(1,64,48);
function sphere(parent,mat,x,y,z,sx,sy,sz){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
sphere(krosh,blue,0,0,0,1.17,1.13,.99);
const ears=[];[-1,1].forEach((side)=>{const e=new THREE.Group();e.position.set(side*.49,.82,0);e.rotation.z=side*-.17;krosh.add(e);sphere(e,blue,0,.83,0,.28,1.03,.24);sphere(e,innerBlue,0,.88,.192,.154,.78,.07);ears.push(e)});
const leftArm=sphere(krosh,blue,-1.16,-.14,.1,.24,.58,.25);leftArm.rotation.z=-.7;
const rightArm=sphere(krosh,blue,1.18,.04,.05,.24,.66,.25);rightArm.rotation.z=-.9;
sphere(krosh,blue,-.64,-1.02,.25,.51,.25,.55);sphere(krosh,blue,.64,-1.02,.25,.51,.25,.55);
const eyes=[];[-1,1].forEach(side=>{sphere(krosh,white,side*.34,.38,.865,.335,.43,.16);const eye=sphere(krosh,pupilMat,side*.29,.36,1.014,.128,.205,.068);eyes.push(eye);sphere(eye,white,-.28,.38,.73,.27,.2,.27);const brow=sphere(krosh,blue,side*.35,.83,.88,.24,.055,.07);brow.rotation.z=side*-.14});
sphere(krosh,pink,0,.03,1.04,.20,.145,.14);
const smileShape=new THREE.Shape();smileShape.moveTo(-.55,-.19);smileShape.bezierCurveTo(-.28,-.31,.28,-.31,.55,-.15);smileShape.bezierCurveTo(.41,-.72,-.3,-.76,-.55,-.19);
const smile=new THREE.Mesh(new THREE.ShapeGeometry(smileShape,40),mouthMat);smile.position.set(0,0,.985);krosh.add(smile);
sphere(krosh,pink,.04,-.51,1.005,.23,.075,.025);
const toothGeo=new THREE.BoxGeometry(.18,.24,.10,1,1,1);[-1,1].forEach(s=>{const tooth=new THREE.Mesh(toothGeo,white);tooth.position.set(s*.099,-.35,1.04);tooth.rotation.z=s*.04;krosh.add(tooth)});
// Small cheek dimples, a soft ground shadow, and a luminous orbital platform.
const cheek=new THREE.MeshStandardMaterial({color:0x138bc5,roughness:.65});[-1,1].forEach(s=>{const c=sphere(krosh,cheek,s*.56,-.18,.88,.07,.035,.025);c.rotation.z=s*.4});
const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.7,.13,96),new THREE.MeshStandardMaterial({color:0x152b1a,metalness:.65,roughness:.25}));platform.position.y=-1.55;platform.receiveShadow=true;scene.add(platform);
const ring=new THREE.Mesh(new THREE.TorusGeometry(1.62,.017,12,100),new THREE.MeshBasicMaterial({color:0xa5fa55}));ring.rotation.x=Math.PI/2;ring.position.y=-1.49;scene.add(ring);
const disk=new THREE.Mesh(new THREE.CircleGeometry(1.25,64),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22}));disk.rotation.x=-Math.PI/2;disk.position.y=-1.475;scene.add(disk);
const sparkles=new THREE.Group();scene.add(sparkles);const sparkleMat=new THREE.MeshBasicMaterial({color:0xadff70});for(let i=0;i<22;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.012+(i%3)*.006,8,6),sparkleMat);s.position.set(Math.sin(i*12.989)*2.5,Math.cos(i*8.2)*1.7+.6,Math.sin(i*5.3)*1.5-1);sparkles.add(s)}
let tx=0,ty=0,jumpStart=-10,visible=true;const start=performance.now();container.addEventListener('pointermove',e=>{const r=container.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*.65;ty=((e.clientY-r.top)/r.height-.5)*.22});container.addEventListener('pointerleave',()=>{tx=0;ty=0});container.addEventListener('click',()=>jumpStart=(performance.now()-start)/1000);window.addEventListener('krosh-jump',()=>jumpStart=(performance.now()-start)/1000);
new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}).observe(container);
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(container);
function animate(now){requestAnimationFrame(animate);if(!visible||document.hidden)return;const t=(now-start)/1000;const j=t-jumpStart;const bounce=!reduced&&j<1.2&&j>=0?Math.sin(j/1.2*Math.PI)*.65:0;krosh.rotation.y+=(tx-.14-krosh.rotation.y)*.045;krosh.rotation.x+=(-ty-krosh.rotation.x)*.04;krosh.position.y=.18+(reduced?0:Math.sin(t*1.8)*.085)+bounce;if(!reduced){krosh.rotation.z=Math.sin(t*1.3)*.028;ears[0].rotation.z=.17+Math.sin(t*2)*.045;ears[1].rotation.z=-.17+Math.sin(t*2+.7)*.06;rightArm.rotation.z=-.9+Math.sin(t*2)*.09+bounce*.4;sparkles.rotation.y=t*.04;eyes.forEach(e=>e.scale.y=.205*(Math.sin(t*.8)> .998?.12:1))}renderer.render(scene,camera)}requestAnimationFrame(animate);
}catch(error){container.innerHTML='<div style="display:grid;place-items:center;height:100%;font-size:110px" aria-label="Крош">🐰</div>';document.querySelector('.scene-hint').textContent='3D НЕДОСТУПНО В ЭТОМ БРАУЗЕРЕ';console.warn('WebGL unavailable',error)}
