attribute vec3 aPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoord;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

void main() {
    vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    vNormal = mat3(uNormalMatrix) * aVertexNormal;
    vTexCoord = aTexCoord;
    vPosition = worldPosition.xyz;
}
