const m4 = {

    identityMatrix: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    perspectiveMatrix: function(fieldOfViewInRadians, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    },

    orthoMatrix: function(left, right, bottom, top, near, far) {
        return [
            2 / (right - left), 0,                  0,                 0,
            0,                  2 / (top - bottom), 0,                 0,
            0,                  0,                  -2 / (far - near), 0,
            -(right + left) / (right - left),
            -(top + bottom) / (top - bottom),
            -(far + near) / (far - near),
            1
        ];
    },

    translationMatrix: function(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ];
    },

    xRotationMatrix: function(angleInRadians) {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotationMatrix: function(angleInRadians) {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotationMatrix: function(angleInRadians) {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    scalingMatrix: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    viewMatrix: function (eye, center, up) {
        const z = [eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]];
        const zLen = Math.sqrt(z[0] * z[0] + z[1] * z[1] + z[2] * z[2]);
        z[0] /= zLen; z[1] /= zLen; z[2] /= zLen;

        const x = [up[1] * z[2] - up[2] * z[1], up[2] * z[0] - up[0] * z[2], up[0] * z[1] - up[1] * z[0]];
        const xLen = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
        x[0] /= xLen; x[1] /= xLen; x[2] /= xLen;
        const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];

        return [
            x[0], y[0], z[0], 0,
            x[1], y[1], z[1], 0,
            x[2], y[2], z[2], 0,
            -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
            -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
            -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]),
            1
        ];
    },

    multiply: function(a, b) {
        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    translate: function(m, [tx, ty, tz]) {
        return m4.multiply(m, m4.translationMatrix(tx, ty, tz));
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotationMatrix(angleInRadians));
    },

    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotationMatrix(angleInRadians));
    },

    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotationMatrix(angleInRadians));
    },

    rotate: function(m, [angleXInRadians, angleYInRadians, angleZInRadians]) {
        return this.xRotate(this.yRotate(this.zRotate(m, angleZInRadians), angleYInRadians), angleXInRadians);
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scalingMatrix(sx, sy, sz));
    },

    invert: function(m) {
        const result = new Float32Array(16);
        const a00 = m[0],  a01 = m[1],  a02 = m[2],  a03 = m[3];
        const a10 = m[4],  a11 = m[5],  a12 = m[6],  a13 = m[7];
        const a20 = m[8],  a21 = m[9],  a22 = m[10], a23 = m[11];
        const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det === 0) return null; // Matrix is not invertible

        det = 1.0 / det;

        result[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        result[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        result[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        result[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        result[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        result[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        result[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        result[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        result[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        result[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        result[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        result[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        result[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        result[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        result[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        result[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return result;
    },

    transpose: function(m) {
        const result = new Float32Array(16);
        result[0]  = m[0];  result[1]  = m[4];  result[2]  = m[8];  result[3]  = m[12];
        result[4]  = m[1];  result[5]  = m[5];  result[6]  = m[9];  result[7]  = m[13];
        result[8]  = m[2];  result[9]  = m[6];  result[10] = m[10]; result[11] = m[14];
        result[12] = m[3];  result[13] = m[7];  result[14] = m[11]; result[15] = m[15];
        return result;
    }
};

export default m4;
