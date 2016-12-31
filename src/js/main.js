const glslify = require('glslify');

import PostEffect from './modules/PostEffect.js';

class Chicken {
  constructor() {
    this.loader = new THREE.OBJLoader();
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.mesh = null;
  }
  load(callback) {
    this.loader.load('/obj/big_chicken.obj', (obj) => {
      this.mesh = this.createMesh(this.createGeometry(obj));
      if (callback) callback();
    })
  }
  createGeometry(obj) {
    const bGeometry = new THREE.BufferGeometry();
    const iGeometry = new THREE.InstancedBufferGeometry();
    const verticesBase = [];
    const normalsBase = [];
    const uvsBase = [];
    for (var i = 0; i < obj.children.length; i++) {
      Array.prototype.push.apply(verticesBase, obj.children[i].geometry.getAttribute('position').array);
      Array.prototype.push.apply(normalsBase, obj.children[i].geometry.getAttribute('normal').array);
      Array.prototype.push.apply(uvsBase, obj.children[i].geometry.getAttribute('uv').array);
    }
    const vertices = new Float32Array(verticesBase);
    const normals = new Float32Array(normalsBase);
    const uvs = new Int16Array(uvsBase);
    bGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    bGeometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    bGeometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return bGeometry;
  }
  createMesh(geometry) {
    return new THREE.Mesh(geometry, new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../glsl/chicken.vs'),
      fragmentShader: glslify('../glsl/chicken.fs'),
      side: THREE.DoubleSide
    }));
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas: canvas,
});
const renderBack = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const sceneBack = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const cameraBack = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
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
  cameraBack.position.set(0, 0, 5000);
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