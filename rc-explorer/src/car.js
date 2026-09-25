import * as THREE from 'three';
import { heightAt, surfaceAt } from './world.js';

export class RCCar {
  constructor(scene){
    this.position=new THREE.Vector3(0,0,-22);this.yaw=0;this.speed=0;this.steer=0;this.throttle=0;this.brake=0;this.battery=1;this.headlights=false;this.distance=0;this._steerAngle=0;
    this.root=new THREE.Group();this.visual=new THREE.Group();this.root.add(this.visual);scene.add(this.root);this.wheels=[];this.lights=[];this.buildVisual();this.reset();
  }
  buildVisual(){
    const chassisMat=new THREE.MeshStandardMaterial({color:'#232a25',roughness:.68,metalness:.32});
    const bodyMat=new THREE.MeshPhysicalMaterial({color:'#c8d66c',roughness:.28,metalness:.08,clearcoat:.9,clearcoatRoughness:.15});
    const darkMat=new THREE.MeshStandardMaterial({color:'#101311',roughness:.7});
    const glassMat=new THREE.MeshPhysicalMaterial({color:'#71908a',roughness:.12,metalness:.1,transparent:true,opacity:.82});
    const chassis=new THREE.Mesh(new THREE.BoxGeometry(1.55,.18,2.7),chassisMat);chassis.position.y=.46;chassis.castShadow=true;this.visual.add(chassis);
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.48,.56,2.35),bodyMat);body.position.set(0,.78,.02);body.castShadow=true;this.visual.add(body);
    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.42,.32,.92),bodyMat);hood.position.set(0,.86,-1.05);hood.castShadow=true;this.visual.add(hood);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.25,.58,1),glassMat);cabin.position.set(0,1.15,.18);cabin.rotation.x=-.03;cabin.castShadow=true;this.visual.add(cabin);
    const bumper=new THREE.Mesh(new THREE.BoxGeometry(1.65,.16,.18),darkMat);bumper.position.set(0,.43,-1.45);this.visual.add(bumper);
    const rear=bumper.clone();rear.position.z=1.45;this.visual.add(rear);
    const tireMat=new THREE.MeshStandardMaterial({color:'#141715',roughness:1});
    const rimMat=new THREE.MeshStandardMaterial({color:'#777d72',roughness:.42,metalness:.6});
    [[-.86,-.92],[.86,-.92],[-.86,.92],[.86,.92]].forEach(([x,z],idx)=>{
      const pivot=new THREE.Group();pivot.position.set(x,.42,z);this.visual.add(pivot);
      const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.28,18),tireMat);tire.rotation.z=Math.PI/2;tire.castShadow=true;pivot.add(tire);
      const rim=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.292,16),rimMat);rim.rotation.z=Math.PI/2;pivot.add(rim);
      this.wheels.push({pivot,tire,front:idx<2,side:x<0?-1:1,z});
    });
    [-.48,.48].forEach(x=>{
      const lamp=new THREE.SpotLight('#fff6d5',0,20,.42,.45,1.4);lamp.position.set(x,.84,-1.43);lamp.target.position.set(x,.1,-8);this.visual.add(lamp,lamp.target);this.lights.push(lamp);
      const lens=new THREE.Mesh(new THREE.CircleGeometry(.11,16),new THREE.MeshBasicMaterial({color:'#fff2b1'}));lens.position.set(x,.84,-1.531);lens.rotation.x=-Math.PI/2;this.visual.add(lens);
    });
    const ant=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1,6),darkMat);ant.position.set(.52,1.45,.78);ant.rotation.z=-.08;this.visual.add(ant);
  }
  reset(){this.position.set(0,heightAt(0,-22)+.52,-22);this.yaw=0;this.speed=0;this.steer=0;this._steerAngle=0;this.battery=Math.max(this.battery,.35);this.syncVisual(0)}
  setInput({throttle=0,brake=0,steer=0}){this.throttle=THREE.MathUtils.clamp(throttle,-1,1);this.brake=THREE.MathUtils.clamp(brake,0,1);this.steer=THREE.MathUtils.clamp(steer,-1,1)}
  update(dt){
    const surf=surfaceAt(this.position.x,this.position.z),engine=11.5,reverse=7,accel=this.throttle>=0?this.throttle*engine:this.throttle*reverse;
    this.speed+=accel*dt;if(this.brake>0)this.speed*=Math.max(0,1-this.brake*7*dt);this.speed*=Math.pow(surf.drag,dt*6);this.speed=THREE.MathUtils.clamp(this.speed,-5.5,13.5);
    if(Math.abs(this.throttle)<.02)this.speed*=Math.pow(.985,dt*60);
    this._steerAngle=THREE.MathUtils.lerp(this._steerAngle,this.steer*.62,1-Math.exp(-8*dt));
    const speedFactor=THREE.MathUtils.clamp(Math.abs(this.speed)/3,0,1);this.yaw+=this._steerAngle*this.speed*.22*surf.grip*dt*(.35+.65*speedFactor);
    const forward=new THREE.Vector3(Math.sin(this.yaw),0,-Math.cos(this.yaw));this.position.addScaledVector(forward,this.speed*dt);
    this.position.x=THREE.MathUtils.clamp(this.position.x,-39,39);this.position.z=THREE.MathUtils.clamp(this.position.z,-31,30);this.distance+=Math.abs(this.speed*dt);this.battery=Math.max(0,this.battery-Math.abs(this.throttle)*dt*.00045);
    const floor=heightAt(this.position.x,this.position.z);this.position.y=THREE.MathUtils.lerp(this.position.y,floor+.52,1-Math.exp(-10*dt));this.syncVisual(dt);
  }
  syncVisual(dt){
    const f=new THREE.Vector3(Math.sin(this.yaw),0,-Math.cos(this.yaw)),r=new THREE.Vector3(Math.cos(this.yaw),0,Math.sin(this.yaw)),samples=[];
    this.wheels.forEach((w,i)=>{const wx=this.position.x+r.x*w.pivot.position.x+f.x*(-w.z),wz=this.position.z+r.z*w.pivot.position.x+f.z*(-w.z);samples[i]=heightAt(wx,wz)});
    const front=(samples[0]+samples[1])*.5,rear=(samples[2]+samples[3])*.5,left=(samples[0]+samples[2])*.5,right=(samples[1]+samples[3])*.5;
    const pitch=THREE.MathUtils.clamp(Math.atan2(front-rear,1.84),-.32,.32),roll=THREE.MathUtils.clamp(Math.atan2(right-left,1.72),-.28,.28);
    this.root.position.copy(this.position);this.root.rotation.set(pitch,this.yaw,roll,'YXZ');
    this.wheels.forEach((w,i)=>{if(w.front)w.pivot.rotation.y=this._steerAngle;if(dt)w.tire.rotation.x+=this.speed*dt/.43;const targetY=.42+(samples[i]-(front+rear)*.25)*.28;w.pivot.position.y=THREE.MathUtils.lerp(w.pivot.position.y,targetY,.22)});
    this.lights.forEach(l=>l.intensity=this.headlights?38:0);
  }
  snapshot(){return{position:{x:this.position.x,y:this.position.y,z:this.position.z},yaw:this.yaw,speed:this.speed,steer:this._steerAngle,battery:this.battery,surface:surfaceAt(this.position.x,this.position.z).name,distance:this.distance}}
}
