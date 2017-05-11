attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 offset;
attribute vec3 rotate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vNormal;

#pragma glslify: translateMatrix = require(glsl-matrix/computeTranslateMat);
#pragma glslify: rotateMatrix = require(glsl-matrix/computeRotateMat);

void main(void) {
  float radian = radians(time);
  vec4 updatePosition =
    rotateMatrix(radian * 5.0 + rotate.x, radian * 20.0 + rotate.y, radian + rotate.z)
    * translateMatrix(offset * 60000.0 + offset * sin(radian + rotate.x * 10.0) * 40000.0)
    * rotateMatrix(radian * rotate.x * 100.0, radian * rotate.y * 100.0, radian * rotate.z * 100.0)
    * vec4(position, 1.0);
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
