/**
 * @author alteredq / http://alteredqualia.com/
 *
 */

import * as THREE from "three";

const WaterShader = {

	uniforms: THREE.UniformsUtils.merge([
		THREE.UniformsLib["fog"], {
			"normalSampler": { type: "t", value: null },
			"tDisplacement": { type: "t", value: null },
			"time": { type: "f", value: 0.0 },
			"sunColor": { type: "c", value: new THREE.Color(0x7F7F7F) },
			"waterColor": { type: "c", value: new THREE.Color(0x555555) },
			"waterHighlightColor": { type: "c", value: new THREE.Color(0x555555) }
		}
	]),

	fragmentShader: [
		'uniform float time;',
		'uniform sampler2D normalSampler;',
		'uniform sampler2D tDisplacement;',
		'uniform vec3 sunColor;',
		'uniform vec3 waterColor;',
		'uniform vec3 waterHighlightColor;',

		'varying vec4 mirrorCoord;',
		'varying vec3 worldPosition;',
		'varying vec3 modelPosition;',
		'varying vec3 surfaceX;',
		'varying vec3 surfaceY;',
		'varying vec3 surfaceZ;',
		"varying vec2 vUv;",

		'void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, in float shiny, in float spec, in float diffuse, inout vec3 diffuseColor, inout vec3 specularColor)',
		'{',
		'  vec3 sunDirection = vec3(1.0, 1.0, 0.0);',
		'  vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));',
		'  float direction = max(0.0, dot(eyeDirection, reflection));',
		'  specularColor += pow(direction, shiny) * sunColor * spec;',
		'  diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;',
		'}',

		'vec3 getNoise(in vec2 uv)',
		'{',
		'  float noiseScale = 1.0;',
		'  vec2 uv0 = uv / (103.0 * noiseScale) + vec2(time / 17.0, time / 29.0);',
		'  vec2 uv1 = uv / (107.0 * noiseScale) - vec2(time / -19.0, time / 31.0);',
		'  vec2 uv2 = uv / (vec2(8907.0, 9803.0) * noiseScale) + vec2(time / 101.0, time /   97.0);',
		'  vec2 uv3 = uv / (vec2(1091.0, 1027.0) * noiseScale) - vec2(time / 109.0, time / -113.0);',
		'  vec4 noise = texture2D(normalSampler, uv0) +',
		'    texture2D(normalSampler, uv1) +',
		'    texture2D(normalSampler, uv2) +',
		'    texture2D(normalSampler, uv3);',
		'  return noise.xyz * 0.5 - 1.0;',
		'}',

		THREE.ShaderChunk["common"],
		THREE.ShaderChunk["fog_pars_fragment"],

		'void main()',
		'{',
		'  vec3 worldToEye = vec3(0.0, 0.0, 0.0) - worldPosition;',
		'  vec3 eyeDirection = normalize(worldToEye);',

		// Get noise based on the 3d position
		'  vec3 noise = getNoise(modelPosition.xy * 1.0);',
		'  vec3 distordCoord = noise.x * surfaceX + noise.y * surfaceY;',
		'  vec3 distordNormal = distordCoord + surfaceZ;',

		// Revert normal if the eye is bellow the mesh
		'  if(dot(eyeDirection, surfaceZ) < 0.0)',
		'    distordNormal = distordNormal * -1.0;',

		// Compute diffuse and specular light (use normal and eye direction)
		'  vec3 diffuseLight = vec3(0.0);',
		'  vec3 specularLight = vec3(0.0);',
		'  sunLight(distordNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);',

		// Compute final 3d distortion, and project it to get the mirror sampling
		// '  float distance = length(worldToEye);',
		// '  vec2 distortion = distordCoord.xy * distortionScale * sqrt(distance) * 0.07;',
		// ' vec3 mirrorDistord = mirrorCoord.xyz + vec3(distortion.x, distortion.y, 1.0);',
		// ' vec3 reflectionSample = texture2DProj(mirrorSampler, mirrorDistord).xyz;',

		// Compute other parameters as the reflectance and the water appareance
		'  float theta = max(dot(eyeDirection, distordNormal), 0.0);',
		'  float reflectance = 0.3 + (1.0 - 0.3) * pow((1.0 - theta), 3.0);',
		'  vec3 scatter = max(0.0, dot(distordNormal, eyeDirection)) * waterHighlightColor;',

		// Compute final pixel color
		'  vec3 albedo = mix(sunColor * diffuseLight * 0.3 + scatter, (vec3(0.1) + waterColor * 0.9 + waterColor * specularLight), reflectance);',

		' vec3 outgoingLight = albedo;',
		THREE.ShaderChunk["fog_fragment"],

		"vec2 adjustedUv = vUv + vec2(0.003, 0.0);",
		"vec2 lowerUv = vUv + vec2(0.0005, 0.0);",

		"float height = 1.0 - texture2D( tDisplacement, adjustedUv ).a;",
		"float lowerHeight = 1.0 - texture2D( tDisplacement, lowerUv ).a;",
		
		// "float diffIn = 0.65 - lowerAlpha;",
		// "float inScale = diffIn * 4.0;",
		// "float diffOut = sin(inScale * 1.57);",
		// "float outScale = diffOut / 4.0;",

		"float lowerAlpha = min(height, lowerHeight);",
		// "if (lowerAlpha < 0.65) {",
		// "  lowerAlpha = lowerAlpha - sin((0.65 - lowerAlpha) * 4.0 * 1.57) / 4.0;",
		// "}",

		' gl_FragColor = vec4( outgoingLight, lowerAlpha );',
		'}'
	].join('\n'),

	vertexShader: [
		'uniform float time;',

		'varying vec3 worldPosition;',
		'varying vec3 modelPosition;',
		'varying vec3 surfaceX;',
		'varying vec3 surfaceY;',
		'varying vec3 surfaceZ;',
		"varying vec2 vUv;",

		'void main()',
		'{',
		'  worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;',
		'  modelPosition = position;',
		'  surfaceX = vec3( modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]);',
		'  surfaceY = vec3( modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]);',
		'  surfaceZ = vec3( modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]);',

		"  vUv = uv;",
		'  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'
	].join('\n')
};

export default WaterShader;