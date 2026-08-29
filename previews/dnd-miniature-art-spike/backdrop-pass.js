import * as THREE from 'three'

function makeBackdropTexture(){
  const c=document.createElement('canvas');c.width=1600;c.height=900;const ctx=c.getContext('2d')
  const sky=ctx.createLinearGradient(0,0,0,c.height);sky.addColorStop(0,'#e1a1a3');sky.addColorStop(.42,'#bc676b');sky.addColorStop(1,'#4b2928');ctx.fillStyle=sky;ctx.fillRect(0,0,c.width,c.height)

  ctx.globalAlpha=.32;ctx.fillStyle='#542b2c';ctx.beginPath();ctx.moveTo(0,700);ctx.lineTo(210,470);ctx.lineTo(350,640);ctx.lineTo(540,410);ctx.lineTo(760,690);ctx.lineTo(1010,500);ctx.lineTo(1270,680);ctx.lineTo(1450,490);ctx.lineTo(1600,650);ctx.lineTo(1600,900);ctx.lineTo(0,900);ctx.closePath();ctx.fill();ctx.globalAlpha=1

  const g=ctx.createLinearGradient(120,70,1240,620);g.addColorStop(0,'#cb1a20');g.addColorStop(.5,'#8a1319');g.addColorStop(1,'#3b090d');ctx.fillStyle=g;ctx.strokeStyle='#ed5049';ctx.lineWidth=17;ctx.lineJoin='round'
  // Sweeping wing.
  ctx.beginPath();ctx.moveTo(120,115);ctx.bezierCurveTo(420,0,790,55,1120,275);ctx.bezierCurveTo(870,220,680,330,490,500);ctx.bezierCurveTo(390,330,250,210,120,115);ctx.closePath();ctx.fill();ctx.stroke()
  // Body and neck.
  ctx.beginPath();ctx.moveTo(720,360);ctx.bezierCurveTo(930,285,1090,375,1170,505);ctx.bezierCurveTo(1110,570,1000,575,900,525);ctx.bezierCurveTo(820,485,780,430,720,360);ctx.closePath();ctx.fill()
  // Head.
  ctx.beginPath();ctx.moveTo(1060,405);ctx.bezierCurveTo(1190,340,1345,370,1460,450);ctx.lineTo(1348,482);ctx.lineTo(1470,535);ctx.bezierCurveTo(1360,610,1210,610,1100,548);ctx.closePath();ctx.fill()
  // Horns / jaw notches.
  ctx.fillStyle='#651014';ctx.beginPath();ctx.moveTo(1245,380);ctx.lineTo(1320,305);ctx.lineTo(1290,405);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(1340,398);ctx.lineTo(1435,345);ctx.lineTo(1385,430);ctx.closePath();ctx.fill()
  ctx.fillStyle='#ffb85d';ctx.beginPath();ctx.ellipse(1375,452,16,9,-.2,0,Math.PI*2);ctx.fill()

  const haze=ctx.createRadialGradient(980,385,50,980,385,660);haze.addColorStop(0,'rgba(255,224,205,.24)');haze.addColorStop(1,'rgba(255,224,205,0)');ctx.fillStyle=haze;ctx.fillRect(0,0,c.width,c.height)
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;return tex
}

function run(){
  const scene=globalThis.__dndArtSpikeScene
  const world=globalThis.__dndArtSpikeWorld
  if(!scene||!world){setTimeout(run,250);return}

  // A flat background is intentional: the physical reference itself uses a printed DM screen.
  scene.background=makeBackdropTexture()

  const lip=new THREE.Mesh(new THREE.BoxGeometry(15.5,.18,.28),new THREE.MeshStandardMaterial({color:'#4a281c',roughness:.84}))
  lip.name='printed_fantasy_backdrop_lip';lip.position.set(-.25,-.02,-5.0);lip.rotation.y=.18;lip.castShadow=lip.receiveShadow=true;world.add(lip)
}
run()
