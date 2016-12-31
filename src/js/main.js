import PostEffect from './modules/PostEffect.js';
import Chicken from './modules/Chicken.js';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas: canvas,
});
const renderBack = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const sceneBack = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const cameraBack = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
const clock = new THREE.Clock();

const postEffect = new PostEffect(renderBack.texture);
const chicken = new Chicken();

const resizeWindow = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cameraBack.aspect = window.innerWidth / window.innerHeight;
  cameraBack.updateProjectionMatrix();
  renderBack.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
}
const on = () => {
  window.addEventListener('resize', () => {
    resizeWindow();
  });
}
const render = () => {
  chicken.render(clock.getDelta());
  renderer.render(sceneBack, cameraBack, renderBack);
  postEffect.render(clock.getDelta());
  renderer.render(scene, camera);
}
const renderLoop = () => {
  render();
  requestAnimationFrame(renderLoop);
}

const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee, 1.0);
  cameraBack.position.set(0, 0, 20000);
  cameraBack.lookAt(new THREE.Vector3());

  scene.add(postEffect.mesh);
  chicken.load(() => {
    sceneBack.add(chicken.mesh);
    on();
    renderLoop();
  })

  resizeWindow();
}
init();
