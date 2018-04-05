import * as THREE from "three";

const GrassShader = {

	uniforms: THREE.UniformsUtils.merge( [

		THREE.UniformsLib[ "fog" ],

		{
			"texture": { value: null },

			"numColumns": { value: 2.0 },
			"numRows": { value: 2.0 },
		}

	] ),

	fragmentShader: [
		"precision mediump float;",
		"uniform sampler2D texture;",
		"uniform float numColumns;",
		"uniform float numRows;",
		"varying vec2 vDim;",

		THREE.ShaderChunk["fog_pars_fragment"],
		// THREE.ShaderChunk[ "packing" ],
		// THREE.ShaderChunk[ "common" ],
		// THREE.ShaderChunk[ "bsdfs" ],
		// THREE.ShaderChunk[ "lights_pars" ],
		// THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

		"void main() { ",
		"float width = (gl_PointCoord.x / numColumns);",
		"float height = (gl_PointCoord.y / numRows);",
		"float x = vDim.x;",
		"float y = vDim.y;",
		"gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );",
		"gl_FragColor = gl_FragColor * texture2D( texture, vec2(x + width, (y + height) * -1.0 ));",
		"if ( gl_FragColor.a < 0.01 ) discard;",

		THREE.ShaderChunk["fog_fragment"],

		"}"

	].join("\n"),

	vertexShader: [

		"precision mediump float; \n" +
		"uniform mat4 projectionMatrix; \n" +
		"uniform mat4 modelViewMatrix; \n" +
		"attribute vec3 position; \n" +
		"uniform vec4 origin; \n" +
		"attribute vec2 dim; \n" +
		"varying vec2 vDim; \n" +

		THREE.ShaderChunk["fog_pars_vertex"],

		"void main() { ",
		"vDim = dim;",
		"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
		"float cameraDist = distance( mvPosition, origin );",
		"gl_PointSize = 150.0 * 150.0 / cameraDist;",
		"gl_Position = projectionMatrix * mvPosition;",

		THREE.ShaderChunk["fog_vertex"],

		"}"

	].join("\n")

};

export default GrassShader;