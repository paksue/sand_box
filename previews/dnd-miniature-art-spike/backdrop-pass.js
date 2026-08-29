import * as THREE from 'three'

function makeBackdropTexture() {
  const c = document.createElement('canvas')
  c.width = 1600
  c.height = 900
  const ctx = c.getContext('2d')

  const sky = ctx.createLinearGradient(0, 0, 0, c.height)
  sky.addColorStop(0, '#e3a5a5')
  sky.addColorStop(0.44, '#bd6868')
  sky.addColorStop(1, '#4a2725')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, c.width, c.height)

  ctx.globalAlpha = 0.34
  ctx.fillStyle = '#522928'
  ctx.beginPath()
  ctx.moveTo(0,690);ctx.lineTo(180,470);ctx.lineTo(330,640);ctx.lineTo(520,420);ctx.lineTo(760,690)
  ctx.lineTo(1010,510);ctx.lineTo(1260,675);ctx.lineTo(1450,500);ctx.lineTo(1600,650);ctx.lineTo(1600,900);ctx.lineTo(0,900);ctx.closePath();ctx.fill()
  ctx.globalAlpha = 1

  const grad = ctx.createLinearGradient(120,80,1050,650)
  grad.addColorStop(0,'#c9171d');grad.addColorStop(.52,'#861219');grad.addColorStop(1,'#3b0a0d')
  ctx.fillStyle=grad;ctx.strokeStyle='#e84a44';ctx.lineWidth=16;ctx.lineJoin='round'
  ctx.beginPath();ctx.moveTo(180,120);ctx.bezierCurveTo(430,12,780,80,1045,265);ctx.bezierCurveTo(820,225,670,335,515,470);ctx.bezierCurveTo(420,330,300,220,180,120);ctx.closePath();ctx.fill();ctx.stroke()
  ctx.beginPath();ctx.moveTo(720,355);ctx.bezierCurveTo(930,300,1080,380,1148,500);ctx.bezierCurveTo(1102,545,1032,560,950,538);ctx.bezierCurveTo(855,512,795,455,720,355);ctx.closePath();ctx.fill()
  ctx.beginPath();ctx.moveTo(1060,410);ctx.bezierCurveTo(1180,350,1330,370,1435,450);ctx.lineTo(1330,480);ctx.lineTo(1450,528);ctx.bezierCurveTo(1350,602,1210,615,1100,550);ctx.closePath();ctx.fill()
  ctx.fillStyle='#ffb052';ctx.beginPath();ctx.ellipse(1364,453,15,8,-.2,0,Math.PI*2);ctx.fill()

  const haze=ctx.createRadialGradient(920,380,40,920,380,650)
  haze.addColorStop(0,'rgba(255,220,200,.24)');haze.addColorStop(1,'rgba(255,220,200,0)')
  ctx.fillStyle=haze;ctx.fillRect(0,0,c.width,c.height)

  const tex=new THREE.CanvasTexture(c)
  tex.colorSpace=THREE.SRGBColorSpace
  tex.minFilter=THREE.LinearMipmapLinearFilter
  tex.magFilter=THREE.LinearFilter
  return tex
}

function run(){
  const world=globalThis.__dndArtSpikeWorld
  if(!world){setTimeout(run,250);return}

  const backdrop=new THREE.Mesh(
    new THREE.PlaneGeometry(18.5,9.6),
    new THREE.MeshBasicMaterial({map:makeBackdropTexture(),toneMapped:true,side:THREE.DoubleSide})
  )
  backdrop.name='printed_fantasy_backdrop'
  backdrop.position.set(-1.15,3.45,-6.0)
  backdrop.rotation.y=0.52
  backdrop.frustumCulled=false
  world.add(backdrop)

  const lip=new THREE.Mesh(
    new THREE.BoxGeometry(15.2,.18,.24),
    new THREE.MeshStandardMaterial({color:'#4a271c',roughness:.84})
  )
  lip.position.set(-.45,-.02,-5.05)
  lip.rotation.y=.20
  lip.castShadow=lip.receiveShadow=true
  world.add(lip)
}
run()
