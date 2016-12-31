const glslify = require('glslify');

export default class Chicken {
  constructor() {
    this.loader = new THREE.OBJLoader();
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.mesh = null;
    this.instances = 1000;
  }
  load(callback) {
    this.loader.load('./obj/big_chicken.obj', (obj) => {
      this.mesh = this.createMesh(this.createGeometry(obj));
      if (callback) callback();
    })
  }
  createGeometry(obj) {
    const geometry = new THREE.InstancedBufferGeometry();
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
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
      offsets.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      rotates.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    geometry.addAttribute('offset', offsets);
    geometry.addAttribute('rotate', rotates);
    return geometry;
  }
  createMesh(geometry) {
    return new THREE.Mesh(geometry, new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../glsl/chicken.vs'),
      fragmentShader: glslify('../../glsl/chicken.fs'),
    }));
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
