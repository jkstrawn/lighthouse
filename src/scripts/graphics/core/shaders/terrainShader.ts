/**
 * @author alteredq / http://alteredqualia.com/
 *
 */

import * as THREE from "three";

const TerrainShader = {

	uniforms: THREE.UniformsUtils.merge([

		THREE.UniformsLib["fog"],
		THREE.UniformsLib["lights"],
		THREE.UniformsLib["shadowmap"],

		{
			"enableReflection": { value: 0 },

			"tDiffuse1": { value: null },
			"tDiffuse2": { value: null },
			"tDetail1": { value: null },
			"tDetail2": { value: null },
			"tNormal": { value: null },
			"tSpecular": { value: null },
			"tDisplacement": { value: null },

			"uNormalScale": { value: 1.0 },

			"uDisplacementBias": { value: 0.0 },
			"uDisplacementScale": { value: 1.0 },

			"diffuse": { value: new THREE.Color(0xeeeeee) },
			"specular": { value: new THREE.Color(0x111111) },
			"shininess": { value: 30 },
			"opacity": { value: 1 },

			"uRepeatBase": { value: new THREE.Vector2(1, 1) },
			"uRepeatOverlay": { value: new THREE.Vector2(1, 1) },

			"uOffset": { value: new THREE.Vector2(0, 0) },
			"uCount": { value: 1 }
		}

	]),

	fragmentShader: [

		"uniform vec3 diffuse;",
		"uniform vec3 specular;",
		"uniform float shininess;",
		"uniform float opacity;",

		"uniform sampler2D tDiffuse1;",
		"uniform sampler2D tDiffuse2;",
		"uniform sampler2D tDetail1;",
		"uniform sampler2D tDetail2;",
		"uniform sampler2D tNormal;",
		"uniform sampler2D tSpecular;",
		"uniform sampler2D tDisplacement;",

		"uniform float uNormalScale;",

		"uniform vec2 uRepeatOverlay;",
		"uniform vec2 uRepeatBase;",

		"uniform vec2 uOffset;",
		"uniform float uCount;",

		"varying vec3 vTangent;",
		"varying vec3 vBinormal;",
		"varying vec3 vNormal;",
		"varying vec2 vUv;",

		"varying vec3 vViewPosition;",

		THREE.ShaderChunk["packing"],
		THREE.ShaderChunk["common"],
		THREE.ShaderChunk["bsdfs"],
		THREE.ShaderChunk["lights_pars"],
		THREE.ShaderChunk["shadowmap_pars_fragment"],
		THREE.ShaderChunk["fog_pars_fragment"],

		"float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {",
		"if ( decayExponent > 0.0 ) {",
		"return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );",
		"}",
		"return 1.0;",
		"}",

		"vec3 hash3( vec2 p )",
		"{",
		"vec3 q = vec3( dot(p,vec2(127.1,311.7)), ",
		"dot(p,vec2(269.5,183.3)), ",
		"dot(p,vec2(419.2,371.9)) );",
		"return fract(sin(q)*43758.5453);",
		"}",

		"float iqnoise( in vec2 x, float u, float v )",
		"{",
		"vec2 p = floor(x);",
		"vec2 f = fract(x);",
		"float k = 1.0+63.0*pow(1.0-v,4.0);",
		"float va = 0.0;",
		"float wt = 0.0;",
		"for( int j=-2; j<=2; j++ )",
		"for( int i=-2; i<=2; i++ )",
		"{",
		"vec2 g = vec2( float(i),float(j) );",
		"vec3 o = hash3( p + g )*vec3(u,u,1.0);",
		"vec2 r = g - f + o.xy;",
		"float d = dot(r,r);",
		"float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );",
		"va += o.z*ww;",
		"wt += ww;",
		"}",
		"return va/wt;",
		"}",

		"void main() {",

		"vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
		"vec4 diffuseColor = vec4( diffuse, opacity );",

		"vec3 specularTex = vec3( 1.0 );",

		"vec2 uvOverlay = uRepeatOverlay * vUv + uOffset * uRepeatOverlay;",
		"vec2 uvBase = uRepeatBase * vUv / uCount + (uOffset / uCount);",

		// normals
		"vec4 colNormal1 = texture2D( tDetail1, uvOverlay );",
		"vec4 colNormal2 = texture2D( tDetail2, uvOverlay );",

		"vec4 normalMix = mix ( colNormal1, colNormal2, 1.0 - texture2D( tDisplacement, uvBase ).y );",
		//"vec4 normalMix = texture2D( tDetail1, uvOverlay );",
		"vec3 normalTex = normalMix.xyz * 2.0 - 1.0;",
		"normalTex.xy *= uNormalScale;",
		"normalTex = normalize( normalTex );",

		// diffuse
		"vec4 colDiffuse1 = texture2D( tDiffuse1, uvOverlay );",
		"vec4 colDiffuse2 = texture2D( tDiffuse2, uvOverlay );",

		"diffuseColor *= mix ( colDiffuse1, colDiffuse2, 1.0 - texture2D( tDisplacement, uvBase ).y );",


		"mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
		"vec3 finalNormal = tsb * normalTex;",

		"vec3 normal = normalize( finalNormal );",
		"vec3 viewPosition = normalize( vViewPosition );",

		"vec3 totalDiffuseLight = vec3( 0.0 );",
		"vec3 totalSpecularLight = vec3( 0.0 );",

		// point lights

		"IncidentLight directLight;",

		"#if NUM_POINT_LIGHTS > 0",

		"for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

		"vec3 lVector = pointLights[ i ].position + vViewPosition.xyz;",

		"float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

		"lVector = normalize( lVector );",

		"vec3 pointHalfVector = normalize( lVector + viewPosition );",

		"float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
		"float pointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",

		"float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",

		"totalDiffuseLight += attenuation * pointLights[ i ].color * pointDiffuseWeight;",
		"totalSpecularLight += attenuation * pointLights[ i ].color * specular * pointSpecularWeight * pointDiffuseWeight;",

		"}",

		"#endif",

		// directional lights

		"#if NUM_DIR_LIGHTS > 0",

		"vec3 dirDiffuse = vec3( 0.0 );",
		"vec3 dirSpecular = vec3( 0.0 );",

		"DirectionalLight directionalLight;",

		"for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

		"directionalLight = directionalLights[ i ];",

		"directLight.color = directionalLight.color;",
		"directLight.direction = directionalLight.direction;",
		"directLight.visible = true;",


		"directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;",


		// "RE_Direct( directLight, geometry, material, reflectedLight );",


		"vec3 dirVector = directLight.direction;",
		"vec3 dirHalfVector = normalize( dirVector + viewPosition );",

		"float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
		"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

		"float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

		"totalDiffuseLight += directLight.color * dirDiffuseWeight;",
		"totalSpecularLight += directLight.color * specular * dirSpecularWeight * dirDiffuseWeight;",

		"}",

		"#endif",

		// hemisphere lights

		"#if NUM_HEMI_LIGHTS > 0",

		"vec3 hemiDiffuse  = vec3( 0.0 );",
		"vec3 hemiSpecular = vec3( 0.0 );",

		"for( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

		"vec3 lVector = hemisphereLightDirection[ i ];",

		// diffuse

		"float dotProduct = dot( normal, lVector );",
		"float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

		"totalDiffuseLight += mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight );",

		// specular (sky light)

		"float hemiSpecularWeight = 0.0;",

		"vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
		"float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
		"hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );",

		// specular (ground light)

		"vec3 lVectorGround = -lVector;",

		"vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
		"float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
		"hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );",

		"totalSpecularLight += specular * mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight ) * hemiSpecularWeight * hemiDiffuseWeight;",

		"}",

		"#endif",

		"outgoingLight += diffuseColor.xyz * ( totalDiffuseLight + ambientLightColor + totalSpecularLight );",

		"float f = iqnoise( 2.0 * vUv * uRepeatOverlay + uOffset*uRepeatOverlay*2.0, 1.0, 1.0 );",
		"f = max(f + 0.4, 0.9);",
		"outgoingLight = outgoingLight * f;",

		"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

		THREE.ShaderChunk["fog_fragment"],

		"}"

	].join("\n"),

	vertexShader: [

		"attribute vec4 tangent;",

		"uniform vec2 uRepeatBase;",

		"uniform sampler2D tNormal;",

		"#ifdef VERTEX_TEXTURES",

		"uniform sampler2D tDisplacement;",
		"uniform float uDisplacementScale;",
		"uniform float uDisplacementBias;",

		"#endif",

		"varying vec3 vTangent;",
		"varying vec3 vBinormal;",
		"varying vec3 vNormal;",
		"varying vec2 vUv;",

		"varying vec3 vViewPosition;",

		THREE.ShaderChunk["shadowmap_pars_vertex"],
		THREE.ShaderChunk["fog_pars_vertex"],

		"void main() {",

		"vNormal = normalize( normalMatrix * normal );",

		// tangent and binormal vectors

		"vTangent = normalize( normalMatrix * tangent.xyz );",

		"vBinormal = cross( vNormal, vTangent ) * tangent.w;",
		"vBinormal = normalize( vBinormal );",

		// texture coordinates

		"vUv = uv;",

		"vec2 uvBase = uv * uRepeatBase;",

		// displacement mapping

		"float dv = 1.0 - texture2D( tDisplacement, uv ).a;",
		// "float df = uDisplacementScale * dv.x + uDisplacementBias;",
		// "vec3 displacedPosition = normal * df + position;",
		"vec3 displacedPosition = normal + position;",

		"vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",
		"vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",

		"float height = dv * -100.0;",
		"if (height > -30.0) {",
		"	height = 0.0;",
		"}",

		"gl_Position = projectionMatrix * mvPosition + vec4(0, height, 0, 0);",
		// "gl_Position = projectionMatrix * mvPosition;",

		"vViewPosition = -mvPosition.xyz;",

		"vec3 normalTex = texture2D( tNormal, uvBase ).xyz * 2.0 - 1.0;",
		"normalTex = vec3(1, 1, 1);",
		"vNormal = normalMatrix * normalTex;",

		THREE.ShaderChunk["shadowmap_vertex"],
		THREE.ShaderChunk["fog_vertex"],

		"}"

	].join("\n")
};

export default TerrainShader;