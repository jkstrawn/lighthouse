//
// Description : Array and textureless GLSL 3D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110409 (stegu)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//

const fireballShader =
    {
        vertexShader:
        [

            "/**",
            "* Example Vertex Shader",
            "* Sets the position of the vertex by setting gl_Position",
            "*/",

            "// Set the precision for data types used in this shader",
            "precision highp float;",
            "precision highp int;",


            "// Default uniforms provided by ShaderFrog.",
            "uniform float time;",

            "// Default attributes provided by THREE.js. Attributes are only available in the",
            "// vertex shader. You can pass them to the fragment shader using varyings",
            "attribute vec2 uv2;",

            "// Examples of variables passed from vertex to fragment shader",
            "varying vec3 vPosition;",
            "varying vec3 vNormal;",
            "varying vec2 vUv;",
            "varying vec2 vUv2;",

            "void main() {",

            "// To pass variables to the fragment shader, you assign them here in the",
            "// main function. Traditionally you name the varying with vAttributeName",
            "vNormal = normal;",
            "vUv = uv;",
            "vUv2 = uv2;",
            "vPosition = position;",

            "// This sets the position of the vertex in 3d space. The correct math is",
            "// provided below to take into account camera and object data.",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}",

        ].join("\n"),


        fragmentShader: [


            "precision highp float;",

            "varying vec2 vUv;",
            "uniform float time;",
            "uniform vec3 color;",

            "void main(void) {",
            "vec2 resolution = vec2(1, 1);",
            "float t = time * 1.0;",
            "vec2 position = (vUv.xy - resolution.xy * .5) / resolution.x;",
            "float angle = atan(position.y, position.x) / (2. * 3.14159265359);",
            "angle -= floor(angle);",
            "float rad = length(position);",
            "float angleFract = fract(angle * 256.);",
            "float angleRnd = floor(angle * 256.) + 1.;",
            "float angleRnd1 = fract(angleRnd * fract(angleRnd * .7235) * 45.1);",
            "float angleRnd2 = fract(angleRnd * fract(angleRnd * .82657) * 13.724);",
            "float t2 = t + angleRnd1 * 10.0;",
            "float radDist = sqrt(angleRnd2);",
            "float adist = radDist / rad * .1;",
            "float dist = (t2 * .1 + adist);",
            "dist = abs(fract(dist) - 1.0);",

            "float outputColor = (1.0 / (dist)) * cos(0.7 * sin(t)) * adist / radDist / 30.0;",
            "angle = fract(angle + .61);",
            "gl_FragColor = vec4(outputColor * color, outputColor);",
            "}"


        ].join("\n")
    };


export default fireballShader;



