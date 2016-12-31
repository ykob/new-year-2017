attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vNormal;
varying vec2 vUv;

#pragma glslify: rotateMatrix = require(glsl-matrix/rotateMatrix);
#pragma glslify: scaleMatrix = require(glsl-matrix/scaleMatrix);

void main(void) {
  vec4 updatePosition = rotateMatrix(radians(time * 20.0), radians(time * 10.0), radians(time * 10.0)) * vec4(position, 1.0);
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
