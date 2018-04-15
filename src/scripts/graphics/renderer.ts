import * as Stats from 'stats-js';
import * as THREE from "three";
import * as $ from 'jquery';
import assets from './core/assetLoader';
import particles from "./particles/particleEngine";
import fireballShader from "./core/shaders/fireballShader";
import ProjectileModelSlime from "./particles/models/projectileModelSlime";
import ProjectileModel from "./particles/models/projectileModel";
import ProjectileModelStar from "./particles/models/projectileModelStar";
import assetUrls from '../core/assetUrls';

export default class Renderer {

	static renderer: THREE.WebGLRenderer;
	static scene = new THREE.Scene();
	static camera: THREE.PerspectiveCamera;
	static projector: THREE.Projector;
	static raycaster = new THREE.Raycaster();
	static stats: Stats = new Stats();

	static container: HTMLDivElement;
	static models: Array<THREE.Object3D> = [];
	static shadowTarget: THREE.Mesh;
	static sunlight: THREE.DirectionalLight;
	static sunlightOffset = new THREE.Vector3(250, 1000, -300);

	static uniforms: any;
	static debug: boolean = true;
	static debugInfo: object;
	static screenWidth: number;
	static screenHeight: number;
	static heightmapSize: number = 1024;
	static cameraViewDistance: number = 500;

	static init() {
		this.debug = true;
		this.debugInfo = {
			arrow: {
				direction: 0,
				length: 20,
				lineObject: null
			}
		}

		this.addRenderer();
		this.addCamera();
		this.addLights();

		let container = document.getElementById('canvasContainer');
		container.appendChild(this.renderer.domElement);
		container.appendChild(this.stats.domElement);
	}

	static addRenderer() {
		console.log(window.devicePixelRatio, window.innerWidth, window.innerHeight);

		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(devicePixelRatio || 1);
		this.renderer.setSize(this.screenWidth, this.screenHeight);
	}

	static addCamera() {
		this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, this.cameraViewDistance);
		this.camera.position.set(0, 250, -250);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		window["cam"] = this.camera;
		window["scene"] = this.scene;
	}

	static addLights() {
		let geo = new THREE.CubeGeometry(10, 10, 10);
		let mat = new THREE.MeshLambertMaterial();
		this.shadowTarget = new THREE.Mesh(geo, mat);
		this.shadowTarget.visible = false;
		this.scene.add(this.shadowTarget);


		let ambientLight = new THREE.AmbientLight(0xffffff, .8);
		this.scene.add(ambientLight);


		var sunlight = new THREE.DirectionalLight(0xffffdd, 1.2);
		sunlight.up = new THREE.Vector3(0, 1, 0);
		sunlight.position.set(250, 1000, -300);
		sunlight.target = this.shadowTarget;

		sunlight.castShadow = true;


		sunlight.shadow.mapSize.width = 512;
		sunlight.shadow.mapSize.height = 512;

		var d = 200;

		sunlight.shadow.camera.left = -d;
		sunlight.shadow.camera.right = d;
		sunlight.shadow.camera.top = d;
		sunlight.shadow.camera.bottom = -d;

		sunlight.shadow.camera.near = 800;
		sunlight.shadow.camera.far = 1200;
		sunlight.shadow.bias = -0.0001;

		sunlight.shadow.camera.up = new THREE.Vector3(1, 4.5, 0);

		this.sunlight = sunlight;

		this.scene.add(sunlight);
	}

	static assetsLoaded() {
		particles.initialize(this.scene);
	}

	static createModel(name: string): THREE.Object3D {
		let model = assets.getModel(name);

		this.models.push(model);
		this.scene.add(model);

		return model;
	}

	static getModel(url) {
		return assets.getModel(url);
	}

	static getParent(object: THREE.Object3D) {
		while (object.parent && !(object.parent instanceof THREE.Scene)) {
			object = object.parent;
		}

		return object;
	}

	static resize() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.camera.aspect = this.screenWidth / this.screenHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.screenWidth, this.screenHeight);
	}

	static addModel(model: THREE.Object3D) {
		this.scene.add(model);
	}

	static removeModel(model) {
		this.scene.remove(model);
	}

	static render(dt) {
		//this.particles.render();
		//this.blendMesh.update( dt / 1000 );

		this.renderer.render(this.scene, this.camera);
		//TWEEN.update();
	}

	static update(dt) {
		particles.update(dt);

		this.stats.update();
	}
}