precision highp float;

varying vec3 vNormal;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  float h = dot(vNormal, vec3(1.0, 0.0, 0.0)) * 0.1 + 0.08;
  vec3 color = convertHsvToRgb(vec3(h, 0.8, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
