"use strict";

import { createProgram } from "./utils.js";
import m4 from "./m4.js";
import { crateVertices, crateNormals, crateIndices, lidVertices, lidNormals, lidIndices } from "./coords.js";

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
gl.viewport(0, 0, canvas.width, canvas.height);

const vs = await (await fetch('./vertex.vert')).text();
const fs = await (await fetch('./fragment.frag')).text();

const program = createProgram(gl, vs, fs);
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const modelMatrixLoc = gl.getUniformLocation(program, 'uModelMatrix');
const viewMatrixLoc = gl.getUniformLocation(program, 'uViewMatrix');
const projectionMatrixLoc = gl.getUniformLocation(program, 'uProjectionMatrix');
const normalMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
const lightPosLoc = gl.getUniformLocation(program, "uLightPos");
const viewPosLoc = gl.getUniformLocation(program, "uViewPos");
const ambientColorLoc = gl.getUniformLocation(program, "uAmbientColor");
const diffuseColorLoc = gl.getUniformLocation(program, "uDiffuseColor");
const specularColorLoc = gl.getUniformLocation(program, "uSpecularColor");
const textureLoc = gl.getUniformLocation(program, "uTexture");

const positionLoc = gl.getAttribLocation(program, 'aPosition');
const vertexNormalLoc = gl.getAttribLocation(program, "aVertexNormal");
const texCoordLoc = gl.getAttribLocation(program, 'aTexCoord');

const textures = [];
const textureUrls = [
    'textures/texture1.jpg',
    'textures/texture2.jpg',
    'textures/texture3.jpg'
];
let currentTextureIndex = 0;

async function loadTexture(url) {
    return new Promise((resolve) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            resolve(texture);
        };
        image.src = url;
    });
}

await Promise.all(textureUrls.map(url => loadTexture(url))).then(loadedTextures => {
    textures.push(...loadedTextures);
});

const crateVao = gl.createVertexArray();
gl.bindVertexArray(crateVao);

const stride = 5 * 4;
const textureOffset = 3 * 4;

const crateVerticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, crateVerticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, crateVertices, gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, stride, 0);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, stride, textureOffset);
gl.enableVertexAttribArray(texCoordLoc);

const crateNormalsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, crateNormalsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, crateNormals, gl.STATIC_DRAW);
gl.vertexAttribPointer(vertexNormalLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexNormalLoc);

const crateIndicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, crateIndicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, crateIndices, gl.STATIC_DRAW);

const lidVao = gl.createVertexArray();
gl.bindVertexArray(lidVao);

const lidVerticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, lidVerticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, lidVertices, gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, stride, 0);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, stride, textureOffset);
gl.enableVertexAttribArray(texCoordLoc);

const lidNormalsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, lidNormalsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, lidNormals, gl.STATIC_DRAW);
gl.vertexAttribPointer(vertexNormalLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexNormalLoc);

const lidIndicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lidIndicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lidIndices, gl.STATIC_DRAW);

const fovRadians = Math.PI / 4;
const near = 0.1;
const far = 100;
const cameraLocation = [0, 0, 5];

let crateModelMatrix;
let viewMatrix = m4.viewMatrix(cameraLocation, [0, 0, 0], [0, 1, 0]);
let projectionMatrix = m4.perspectiveMatrix(fovRadians, canvas.width / canvas.height, near, far);

let crateRotationAngles = [0, 0, 0];
let crateRotationStep = 0.05;
let dz = 0;
let dzStep = 0.2;

let lidRotationAngle = 0;
let lidRotationStep = 0.05;

let lightPos = [0.0, 5.0, 10.0];
let lightPosStep = 1.0;

let ambientColor = [0.5, 0.5, 0.5];
let diffuseColor = [1.0, 1.0, 1.0];
let specularColor = [1.0, 1.0, 1.0];

function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

    gl.uniform3fv(lightPosLoc, lightPos);
    gl.uniform3fv(viewPosLoc, cameraLocation);
    gl.uniform3fv(ambientColorLoc, ambientColor);
    gl.uniform3fv(diffuseColorLoc, diffuseColor);
    gl.uniform3fv(specularColorLoc, specularColor);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currentTextureIndex]);
    gl.uniform1i(textureLoc, 0);

    gl.bindVertexArray(crateVao);
    crateModelMatrix = m4.translate(m4.identityMatrix(), [0, 0, dz]);
    crateModelMatrix = m4.rotate(crateModelMatrix, crateRotationAngles);
    gl.uniformMatrix4fv(modelMatrixLoc, false, crateModelMatrix);
    let normalMatrix = m4.invert(crateModelMatrix);
    normalMatrix = m4.transpose(normalMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
    gl.drawElements(gl.TRIANGLES, crateIndices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(lidVao);
    let lidModelMatrix = m4.translate(crateModelMatrix, [-0.5, 0.5, 0]);
    lidModelMatrix = m4.rotate(lidModelMatrix, [0, 0, lidRotationAngle]);
    lidModelMatrix = m4.translate(lidModelMatrix, [0.5, -0.5, 0]);
    gl.uniformMatrix4fv(modelMatrixLoc, false, lidModelMatrix);
    normalMatrix = m4.invert(lidModelMatrix);
    normalMatrix = m4.transpose(normalMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
    gl.drawElements(gl.TRIANGLES, lidIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', () => {
    currentTextureIndex = (currentTextureIndex + 1) % textures.length;
});

document.addEventListener('keydown', (e) => {
    let lightPosChanged = false;

    if (e.key === 'ArrowLeft') {
        crateRotationAngles[1] -= crateRotationStep;
    } else if (e.key === 'ArrowRight') {
        crateRotationAngles[1] += crateRotationStep;
    } else if (e.key === '8') {
        crateRotationAngles[0] -= crateRotationStep;
    } else if (e.key === '2') {
        crateRotationAngles[0] += crateRotationStep;
    } else if (e.key === '4') {
        crateRotationAngles[2] += crateRotationStep;
    } else if (e.key === '6') {
        crateRotationAngles[2] -= crateRotationStep;
    } else if (e.key === 'ArrowUp') {
        if (lidRotationAngle < Math.PI) {
            lidRotationAngle += lidRotationStep;
        }
    } else if (e.key === 'ArrowDown') {
        if (lidRotationAngle > 0) {
            lidRotationAngle -= lidRotationStep;
        }
    } else if (e.key === '0') {
        dz -= dzStep;
    } else if (e.key === '1') {
        dz += dzStep;
    } else if (e.key === 'a') {
        lightPos[0] -= lightPosStep;
        lightPosChanged = true;
    } else if (e.key === 'd') {
        lightPos[0] += lightPosStep;
        lightPosChanged = true;
    } else if (e.key === 'w') {
        lightPos[1] += lightPosStep;
        lightPosChanged = true;
    } else if (e.key === 'x') {
        lightPos[1] -= lightPosStep;
        lightPosChanged = true;
    } else if (e.key === '3') {
        lightPos[2] -= lightPosStep;
        lightPosChanged = true;
    } else if (e.key === '5') {
        lightPos[2] += lightPosStep;
        lightPosChanged = true;
    }

    if (lightPosChanged) {
        document.getElementById('light-position').textContent = lightPos;
    }
});

document.getElementById('light-position').textContent = lightPos;
animate();
