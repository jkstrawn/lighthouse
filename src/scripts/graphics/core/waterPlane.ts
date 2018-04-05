/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

import BufferGeometryUtils from "./shaders/bufferGeometryUtils";
import * as THREE from "three";
import WaterShader from "./shaders/waterShader";
import assets from "./assetLoader";

export default class WaterPlane {

	model: THREE.Mesh;

	constructor() {

		var mirrorUniforms = THREE.UniformsUtils.clone(WaterShader.uniforms);

		mirrorUniforms["time"].value = 0.0;
		mirrorUniforms["normalSampler"].value = assets.getTexture("waternormals");
		mirrorUniforms["sunColor"].value = new THREE.Color(0xffffff);
		mirrorUniforms["waterColor"].value = new THREE.Color(0x1f437c);
		mirrorUniforms["waterHighlightColor"].value = new THREE.Color(0xffffff);
		mirrorUniforms["tDisplacement"].value = assets.getTexture("heightmap");

		let material = new THREE.ShaderMaterial({
			fragmentShader: WaterShader.fragmentShader,
			vertexShader: WaterShader.vertexShader,
			uniforms: mirrorUniforms,
			transparent: true
		});

		let geometry = new THREE.PlaneBufferGeometry(6000, 6000, 1, 1);


		BufferGeometryUtils.computeTangents(geometry);

		this.model = new THREE.Mesh(
			geometry,
			material
		);

		this.model.rotation.x = -Math.PI / 2;
		this.model.rotation.z = -Math.PI / 2;
		this.model.position.set(0, -10, 0);
	}

	update() {
		this.model.material["uniforms"].time.value += 1.0 / 60.0;
	}
}