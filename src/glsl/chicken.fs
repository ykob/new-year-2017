precision highp float;

varying vec3 vNormal;
varying vec2 vUv;

void main(void) {
  gl_FragColor = vec4(vNormal, 1.0);
}
