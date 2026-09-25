import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { heightAt, surfaceAt } from './world.js';

export class RCCar {
  constructor(scene){
    this.position=new THREE.Vector3(5.5,0,17);this.yaw=0;this.speed=0;this.steer=0;this.throttle=0;this.brake=0;this.battery=1;this.headlights=false;this.distance=0;this._steerAngle=0;
    this.root=new THREE.Group();this.visual=new THREE.Group();this.root.add(this.visual);scene.add(this.root);this.wheels=[];this.lights=[];this.buildVisual();this.reset();
  }
  buildVisual(){
    const chassisMat=new THREE.MeshStandardMaterial({color:'#1e2420',roughness:.64,metalness:.4});
    const bodyMat=new THREE.MeshPhysicalMaterial({color:'#c8d66c',roughness:.24,metalness:.08,clearcoat:1,clearcoatRoughness:.11});
    const trimMat=new THREE.MeshStandardMaterial({color:'#111511',roughness:.72,metalness:.18});
    const glassMat=new THREE.MeshPhysicalMaterial({color:'#64817e',roughness:.08,metalness:.05,transparent:true,opacity:.76,transmission:.08});
    const metalMat=new THREE.MeshStandardMaterial({color:'#7d847c',roughness:.32,metalness:.75});

    const chassis=new THREE.Mesh(new RoundedBoxGeometry(1.58,.2,2.72,3,.05),chassisMat);chassis.position.y=.45;chassis.castShadow=true;this.visual.add(chassis);
    const body=new THREE.Mesh(new RoundedBoxGeometry(1.5,.52,2.28,5,.12),bodyMat);body.position.set(0,.76,.03);body.castShadow=true;this.visual.add(body);
    const hood=new THREE.Mesh(new RoundedBoxGeometry(1.43,.3,.94,4,.08),bodyMat);hood.position.set(0,.93,-1.04);hood.castShadow=true;this.visual.add(hood);
    const cabin=new THREE.Mesh(new RoundedBoxGeometry(1.22,.56,1.02,4,.1),glassMat);cabin.position.set(0,1.16,.19);cabin.rotation.x=-.035;cabin.castShadow=true;this.visual.add(cabin);

    const bumper=new THREE.Mesh(new RoundedBoxGeometry(1.7,.15,.18,3,.04),trimMat);bumper.position.set(0,.42,-1.45);this.visual.add(bumper);
    const rear=bumper.clone();rear.position.z=1.45;this.visual.add(rear);
    [-.68,.68].forEach(x=>{const rail=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,2.15,8),metalMat);rail.rotation.x=Math.PI/2;rail.position.set(x,1.52,.24);this.visual.add(rail)});
    [-.56,.56].forEach(z=>{const cross=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,1.42,8),metalMat);cross.rotation.z=Math.PI/2;cross.position.set(0,1.52,z);this.visual.add(cross)});
    [-.82,.82].forEach(x=>{const step=new THREE.Mesh(new RoundedBoxGeometry(.08,.09,1.5,2,.03),trimMat);step.position.set(x,.55,.12);this.visual.add(step)});

    const tireMat=new THREE.MeshStandardMaterial({color:'#111411',roughness:1});
    const rimMat=new THREE.MeshStandardMaterial({color:'#8a9086',roughness:.28,metalness:.72});
    [[-.86,-.92],[.86,-.92],[-.86,.92],[.86,.92]].forEach(([x,z],idx)=>{
      const pivot=new THREE.Group();pivot.position.set(x,.42,z);this.visual.add(pivot);
      const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.3,24),tireMat);tire.rotation.z=Math.PI/2;tire.castShadow=true;pivot.add(tire);
      const rim=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.312,20),rimMat);rim.rotation.z=Math.PI/2;pivot.add(rim);
      for(let t=0;t<12;t++){const lug=new THREE.Mesh(new THREE.BoxGeometry(.055,.055,.34),tireMat);const a=t/12*Math.PI*2;lug.position.set(0,Math.cos(a)*.405,Math.sin(a)*.405);lug.rotation.x=a;pivot.add(lug)}
      this.wheels.push({pivot,tire,front:idx<2,side:x<0?-1:1,z});
    });
    [-.48,.48].forEach(x=>{
      const lamp=new THREE.SpotLight('#fff1c7',0,24,.38,.42,1.5);lamp.position.set(x,.9,-1.45);lamp.target.position.set(x,.1,-9);this.visual.add(lamp,lamp.target);this.lights.push(lamp);
      const lens=new THREE.Mesh(new THREE.CircleGeometry(.105,18),new THREE.MeshBasicMaterial({color:'#fff0ae'}));lens.position.set(x,.9,-1.542);lens.rotation.x=-Math.PI/2;this.visual.add(lens);
    });
    [-.48,.48].forEach(x=>{const tail=new THREE.Mesh(new THREE.BoxGeometry(.2,.12,.025),new THREE.MeshBasicMaterial({color:'#b32f22'}));tail.position.set(x,.83,1.225);this.visual.add(tail)});
    const spare=new THREE.Mesh(new THREE.TorusGeometry(.31,.1,10,24),tireMat);spare.position.set(0,.9,1.25);spare.rotation.x=Math.PI/2;this.visual.add(spare);
    const ant=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.1,6),trimMat);ant.position.set(.52,1.52,.72);ant.rotation.z=-.08;this.visual.add(ant);
  }
  reset(){this.position.set(5.5,heightAt(5.5,17)+.52,17);this.yaw=0;this.speed=0;this.steer=0;this._steerAngle=0;this.battery=Math.max(this.battery,.35);this.syncVisual(0)}
  setInput({throttle=0,brake=0,steer=0}){this.throttle=THREE.MathUtils.clamp(throttle,-1,1);this.brake=THREE.MathUtils.clamp(brake,0,1);this.steer=THREE.MathUtils.clamp(steer,-1,1)}
  update(dt){
    const surf=surfaceAt(this.position.x,this.position.z),engine=11.5,reverse=7,accel=this.throttle>=0?this.throttle*engine:this.throttle*reverse;
    this.speed+=accel*dt;if(this.brake>0)this.speed*=Math.max(0,1-this.brake*7*dt);this.speed*=Math.pow(surf.drag,dt*6);this.speed=THREE.MathUtils.clamp(this.speed,-5.5,13.5);
    if(Math.abs(this.throttle)<.02)this.speed*=Math.pow(.985,dt*60);
    this._steerAngle=THREE.MathUtils.lerp(this._steerAngle,this.steer*.62,1-Math.exp(-8*dt));
    const sf=THREE.MathUtils.clamp(Math.abs(this.speed)/3,0,1);this.yaw+=this._steerAngle*this.speed*.22*surf.grip*dt*(.35+.65*sf);
    const forward=new THREE.Vector3(Math.sin(this.yaw),0,-Math.cos(this.yaw));this.position.addScaledVector(forward,this.speed*dt);
    this.position.x=THREE.MathUtils.clamp(this.position.x,-39,39);this.position.z=THREE.MathUtils.clamp(this.position.z,-31,30);this.distance+=Math.abs(this.speed*dt);this.battery=Math.max(0,this.battery-Math.abs(this.throttle)*dt*.00045);
    this.position.y=THREE.MathUtils.lerp(this.position.y,heightAt(this.position.x,this.position.z)+.52,1-Math.exp(-10*dt));this.syncVisual(dt);
  }
  syncVisual(dt){
    const f=new THREE.Vector3(Math.sin(this.yaw),0,-Math.cos(this.yaw)),r=new THREE.Vector3(Math.cos(this.yaw),0,Math.sin(this.yaw)),samples=[];
    this.wheels.forEach((w,i)=>{const wx=this.position.x+r.x*w.pivot.position.x+f.x*(-w.z),wz=this.position.z+r.z*w.pivot.position.x+f.z*(-w.z);samples[i]=heightAt(wx,wz)});
    const front=(samples[0]+samples[1])*.5,rear=(samples[2]+samples[3])*.5,left=(samples[0]+samples[2])*.5,right=(samples[1]+samples[3])*.5;
    const pitch=THREE.MathUtils.clamp(Math.atan2(front-rear,1.84),-.32,.32),roll=THREE.MathUtils.clamp(Math.atan2(right-left,1.72),-.28,.28);
    this.root.position.copy(this.position);this.root.rotation.set(pitch,this.yaw,roll,'YXZ');
    this.wheels.forEach((w,i)=>{if(w.front)w.pivot.rotation.y=this._steerAngle;if(dt)w.tire.rotation.x+=this.speed*dt/.43;const targetY=.42+(samples[i]-(front+rear)*.25)*.28;w.pivot.position.y=THREE.MathUtils.lerp(w.pivot.position.y,targetY,.22)});
    this.lights.forEach(l=>l.intensity=this.headlights?42:0);
  }
  snapshot(){return{position:{x:this.position.x,y:this.position.y,z:this.position.z},yaw:this.yaw,speed:this.speed,steer:this._steerAngle,battery:this.battery,surface:surfaceAt(this.position.x,this.position.z).name,distance:this.distance}}
}
