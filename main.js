import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

// Angle of view, aspect ratio, near and far clipping plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer - canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30); // move camera back
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus /START

const geometry = new THREE.TorusGeometry(10, 2, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x3bc492 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Torus /END

// Plane /START

// const ssLabsTexture = new THREE.TextureLoader().load('sslabs.png');
// const ssLabsPlane = new THREE.PlaneGeometry(3, 3);
// const ssLabsGeometry = new THREE.MeshBasicMaterial({ map: ssLabsTexture });
// const ssLabs = new THREE.Mesh(ssLabsPlane, ssLabsGeometry);
// scene.add(ssLabs);

// Plane /END

// Text SkySpirit Labs /START

// Load font
var loader = new THREE.FontLoader();
loader.load( 'Roboto-Black-Font.json', function ( font ) {

  // Create text geometry
  var textGeometry = new THREE.TextGeometry( "SkySpiritLabs", {
    font: font,
    size: 5,
    height: 1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.5,
    bevelOffset: 0.1,
    bevelSegments: 2
  } );

  // Apply material
  var textMaterial = new THREE.MeshStandardMaterial( { color: 0x3bc492, roughness: 0.5, metalness: 1 } );
  var textMesh = new THREE.Mesh( textGeometry, textMaterial );

  // Add text to the scene
  scene.add( textMesh );
  textMesh.position.x = -50;
  textMesh.position.y = 20;
  textMesh.rotateOnAxis(new THREE.Vector3(0, 1.5, 0), 0.5);

} );

// Text SkySpirit Labs /END

// Torus Knot /START

const torusKNTexture = new THREE.TextureLoader().load('torus_bg.png');

const geometryTK = new THREE.TorusKnotGeometry( 6, 1, 100, 16 );
//const materialTK = new THREE.MeshStandardMaterial( { color: 0xB20EE3 } );
const materialTK = new THREE.MeshStandardMaterial( { map: torusKNTexture } );
const torusKnot = new THREE.Mesh( geometryTK, materialTK );
scene.add( torusKnot );
torusKnot.position.x = -100;

// Torus Knot /END

// Lights /START

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
//scene.add(pointLight);

// Lights /END

// Helpers /START

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Helpers /END

// Stars /START

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Stars /END

// Background /START

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Background /END

// Avatar /START

const vargazoltTexture = new THREE.TextureLoader().load('avatar_05.png');

const zoltVargaObj = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: vargazoltTexture }));

scene.add(zoltVargaObj);

// Avatar /END

// Particles /START 
const particleCount = 1000;
const geometryPart = new THREE.BufferGeometry();

// create an array of positions for the particles
const positions = new Float32Array( particleCount * 3 );
for ( let i = 0; i < particleCount; i ++ ) {
  positions[ i * 3 ] = ( Math.random() * 2 - 1 ) * 300;
  positions[ i * 3 + 1 ] = ( Math.random() * 2 - 1 ) * 300;
  positions[ i * 3 + 2 ] = ( Math.random() * 2 - 1 ) * 300;
}

// set the positions attribute of the geometry
geometryPart.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

//const materialPart = new THREE.PointsMaterial({ size: 10 });
const materialPart = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
  },
  vertexShader: `
    uniform float time;
    attribute vec3 myPosition;
    void main() {
      vec3 pos = myPosition;
      pos.z += sin( pos.x + time * 10.0 ) * 100.0;
      pos.y += cos( pos.z + time * 8.0 ) * 100.0;
      pos.x += sin( pos.y + time * 6.0 ) * 100.0;
      gl_PointSize = 10.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
    }
  `,
});

const mesh = new THREE.Points( geometryPart, materialPart );
scene.add( mesh );



// Particles /END 

// Mars /START

const marsTexture = new THREE.TextureLoader().load('mars_flat.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  })
);

scene.add(mars);

// Mars /END

mars.position.z = 30;
mars.position.setX(-10);

zoltVargaObj.position.z = -5;
zoltVargaObj.position.x = 2;

// Scroll Animation /START

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  torusKnot.rotation.x += 0.05;
  torusKnot.rotation.y += 0.075;
  torusKnot.rotation.z += 0.05;

  zoltVargaObj.rotation.y += 0.01;
  zoltVargaObj.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Scroll Animation /END

// Animation Loop /START

function animate() {
  requestAnimationFrame(animate);

  materialPart.uniforms.time.value += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  mars.rotation.y += 0.005;

  torusKnot.rotation.x += 0.001;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.001;

  // controls.update();

  renderer.render(scene, camera);
}

animate();

// Animation Loop /END

// Button clicks /START

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") {
    //console.log("W key pressed");
    torusKnot.position.y += 2;
  } else if (event.code === "KeyA") {
    //console.log("A key pressed");
    torusKnot.position.x -= 2;
  } else if (event.code === "KeyS") {
    //console.log("S key pressed");
    torusKnot.position.y -= 2;
  } else if (event.code === "KeyD") {
    //console.log("D key pressed");
    torusKnot.position.x += 2;
  }
});

// Button clicks /END