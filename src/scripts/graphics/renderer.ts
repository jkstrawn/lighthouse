import * as Stats from 'stats-js';
import * as THREE from "three";
import * as $ from 'jquery';
import assets from './core/assetLoader';
import map from "./core/map";
import particles from "./particles/particleEngine";
import AnimatedModel from "./animatedModel";
import fireballShader from "./core/shaders/fireballShader";
import ProjectileModelSlime from "./particles/models/projectileModelSlime";
import ProjectileModel from "./particles/models/projectileModel";
import ProjectileModelStar from "./particles/models/projectileModelStar";
import EntityTypes from "../../../shared/entities/enum/entityTypeEnum";

export default class Renderer {

	static renderer: THREE.WebGLRenderer;
	static scene = new THREE.Scene();
	static camera: THREE.PerspectiveCamera;
	static projector: THREE.Projector;
	static raycaster = new THREE.Raycaster();
	static stats: Stats = new Stats();

	static img: HTMLImageElement;
	static imageData: ImageData;
	static ctx: CanvasRenderingContext2D;
	static canvas: HTMLCanvasElement;

	static container: HTMLDivElement;
	static models: Array<THREE.Object3D> = [];
	static animatedModels: Array<AnimatedModel> = [];
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

		// this.uniforms = {
		// 	time: { type: "f", value: 1.0 },
		// 	tExplosion: { type: "t", value: assets.getTexture("explosion") },
		// 	brightness: { type: "f", value: 1 },
		// 	fireSpeed: { type: "f", value: 0.75 },
		// 	turbulenceDetail: { type: "f", value: 0.4 },
		// 	displacementHeight: { type: "f", value: 0.5 },
		// 	pulseHeight: { type: "f", value: 0.2 },
		// };

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
		this.renderer.shadowMap.enabled = true;
		//this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.heightmapSize;
		this.canvas.height = this.heightmapSize;

		this.img = new Image();
		this.ctx = this.canvas.getContext('2d');





		// let canvas = document.createElement('canvas');

		// this.canvas.width = this.heightmapSize;
		// this.canvas.height = this.heightmapSize;

		// this.ctx = this.canvas.getContext('2d');
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

		// var helper = new THREE.CameraHelper(sunlight.shadow.camera);
		// this.scene.add(helper);
	}

	static assetsLoaded(callback: Function) {
		map.init(this.scene, () => {
			let heightmap = assets.getTexture("heightmap");
			// heightmap.magFilter = THREE.NearestFilter;
			// heightmap.minFilter = THREE.NearestFilter;
			this.ctx.drawImage(heightmap.image, 0, 0);
			this.imageData = this.ctx.getImageData(0, 0, this.heightmapSize, this.heightmapSize);

			callback();
		});

		particles.initialize(this.scene);
	}

	static createAnimatedModel(name: string): AnimatedModel {
		let model = assets.getAnimatedModel(name);

		this.animatedModels.push(model);
		this.scene.add(model);

		return model;
	}

	static createModel(name: string): THREE.Object3D {
		let model = assets.getModel(name);

		this.models.push(model);
		this.scene.add(model);

		return model;
	}

	static createProjectile(type: string, position: THREE.Vector3): ProjectileModel {
		let particle: ProjectileModel;

		switch (type) {
			case EntityTypes.ProjectileSlime:
				particle = new ProjectileModelSlime(type);
				break;
			case EntityTypes.ProjectileStar:
				particle = new ProjectileModelStar(type, position);
				break;
		}

		this.scene.add(particle);

		return particle;
	}

	static getClickDirection(x, y) {
		let diffX = x - this.renderer.context.canvas.width / 2;
		let diffY = y - this.renderer.context.canvas.height / 2;


		let direction = new THREE.Vector2(diffX * -1, diffY);
		return direction.angle();
	}

	static focusCameraOnPosition(x, y) {
		this.camera.position.set(x, this.camera.position.y, y - 250);

		let sunlightPosition = this.sunlightOffset.clone().add(new THREE.Vector3(x, 0, y));
		this.sunlight.position.copy(sunlightPosition);
		this.sunlight.target.position.set(x, 0, y);
	}

	static getModel(url) {
		return assets.getModel(url);
	}

	static getMousePositionByZ(screenCoords: THREE.Vector2) {
		let x = (screenCoords.x / this.screenWidth) * 2 - 1;
		let y = - (screenCoords.y / this.screenHeight) * 2 + 1;

		let vector = new THREE.Vector3(x, y, 0.5);
		vector.unproject(this.camera);
		this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

		let factor = (0 - this.camera.position.y) / this.raycaster.ray.direction.y;
		let position = new THREE.Vector3(
			this.camera.position.x + this.raycaster.ray.direction.x * factor,
			this.camera.position.y + this.raycaster.ray.direction.y * factor,
			this.camera.position.z + this.raycaster.ray.direction.z * factor
		);

		return position;
	};

	static getHeightmapPixel(coords: THREE.Vector3): THREE.Vector2 {
		let normX = Math.round(coords.z / map.totalSize * this.heightmapSize) + this.heightmapSize / 2;
		let normY = Math.round(coords.x / map.totalSize * this.heightmapSize) + this.heightmapSize / 2;

		return new THREE.Vector2(normX, normY);
	}

	static getHeightmapAlphaAt(position: THREE.Vector3): number {
		let relativePos = new THREE.Vector3(-position.x, 0, position.z);

		let normX = (relativePos.z / map.totalSize * this.heightmapSize) + this.heightmapSize / 2;
		let normY = (relativePos.x / map.totalSize * this.heightmapSize) + this.heightmapSize / 2;

		let point1 = new THREE.Vector2(normX, normY);

		let x1 = Math.floor(normX);
		let x2 = Math.ceil(normX);
		let y1 = Math.floor(normY);
		let y2 = Math.ceil(normY);

		let a1 = this.getAlphaForPixel(new THREE.Vector2(x1, y1));
		let a2 = this.getAlphaForPixel(new THREE.Vector2(x2, y1));
		let a3 = this.getAlphaForPixel(new THREE.Vector2(x1, y2));
		let a4 = this.getAlphaForPixel(new THREE.Vector2(x2, y2));

		let inter1 = (x2 - normX) * a1 + (normX - x1) * a2;
		let inter2 = (x2 - normX) * a3 + (normX - x1) * a4;

		let interpolated = (y2 - normY) * inter1 + (normY - y1) * inter2;

		return interpolated;
	}

	static getAlphaForPixel(pixel: THREE.Vector2): number {
		let i = (pixel.x + pixel.y * this.heightmapSize) * 4 + 3;
		let alphaMaybe = this.imageData.data[i];

		return alphaMaybe;
	}

	static getObjectsObscuringPlayer(objects) {
		this.raycaster.set(this.camera.position, this.camera.getWorldDirection());

		let intersects = this.raycaster.intersectObjects(objects);

		return intersects;
	}

	static getParent(object: THREE.Object3D) {
		while (object.parent && !(object.parent instanceof THREE.Scene)) {
			object = object.parent;
		}

		return object;
	}

	static getHoveredObjects(mouse: THREE.Vector2, objects: Array<THREE.Object3D>) {
		let relativeMouse = {
			x: (mouse.x / this.screenWidth) * 2 - 1,
			y: - (mouse.y / this.screenHeight) * 2 + 1
		};

		this.raycaster.setFromCamera(relativeMouse, this.camera);

		let intersects = this.raycaster.intersectObjects(objects);

		return intersects;
	}

	static getTerrainHeightUnderPosition(position: THREE.Vector3): number {
		let higherUp = position.clone().add(new THREE.Vector3(0, 1000, 0));
		this.raycaster.set(higherUp, new THREE.Vector3(0, -1, 0));

		var intersects = this.raycaster.intersectObjects(map.terrainGeometries);

		if (intersects.length > 0) {
			console.log(intersects);
			console.log(intersects[0]);
			return intersects[0].point.y;
		}

		return 0;
	}

	static resize() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.camera.aspect = this.screenWidth / this.screenHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.screenWidth, this.screenHeight);
	}

	static addModel(model) {
		this.scene.add(model);
	}

	static removeModel(model) {
		this.scene.remove(model);

		if (model.animated) {
			var index = this.animatedModels.indexOf(model);
			this.animatedModels.splice(index, 1);
		}
	}

	static render(dt) {
		//this.particles.render();
		//this.blendMesh.update( dt / 1000 );

		this.renderer.render(this.scene, this.camera);
		//TWEEN.update();
	}

	static update(dt) {

		particles.update(dt);
		map.update();

		for (let model of this.animatedModels) {
			//model.update(dt / 1000);
		}


		//this.uniforms.time.value += 0.275 * dt / 1000;
		this.stats.update();

		//this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		//THREE.AnimationHandler.update(dt / 1000);
	}
}