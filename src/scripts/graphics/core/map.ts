import * as THREE from 'three';
import assets from "./assetLoader";
import GrassShader from "./shaders/grassShader";
import TerrainShader from "./shaders/terrainShader";
import mapMetaData from "./mapMetaData";
import renderer from "../renderer";
import BufferGeometryUtils from "./shaders/bufferGeometryUtils";
import WaterPlane from "./waterPlane";
import MapLogic from "../../core/collision/mapLogic";

class Grass {
    dims = [];
    positions: Float32Array;
    mesh: THREE.Points;
}

class Map {

    grass = new Grass();

    img = new Image();
    debug = { hitboxes: [] };

    imageData = null;
    savedMapObjects = null;
    meshes = [];
    scene: THREE.Scene;
    totalSize = 6000;
    tileCount = 1;
    waterPlane: any;
    terrainGeometries: Array<THREE.Object3D> = [];

    constructor() {

    }

    init(scene, callback) {
        this.scene = scene;
        this.loadMapTexture();

        // javascript requires at least 1 ms for the Image to load before using it
        setTimeout(() => {
            this.addTerrain();
            this.generateMapObjects();
            MapLogic.heightmap = assets.getTexture("heightmap");

            callback();
        }, 1);
    }

    generatePlaneGeometry(size: number, h: number) {
        let geometry = new THREE.BufferGeometry();
        let vertexArray = [];
        let indexArray = [];
        let uvArray = [];
        let normalArray = [];

        // for each vertex
        for (let x = 0; x < h + 1; x++) {
            for (let y = 0; y < h + 1; y++) {
                vertexArray.push(x * (size / h));
                vertexArray.push(y * (size / h));
                vertexArray.push(0);

                uvArray.push(x / h);
                uvArray.push(y / h);

                normalArray.push(0);
                normalArray.push(0);
                normalArray.push(1);
            }
        }

        // for each square on the plane
        for (let x = 0; x < h; x++) {
            for (let y = 0; y < h; y++) {
                let isOdd = (x + y) % 2 == 1;

                let x1 = (h + 1) * x + y;
                let x2 = (h + 1) * (x + 1) + y;
                let y1 = (h + 1) * x + y + 1;
                let y2 = (h + 1) * (x + 1) + y + 1;

                if (isOdd) {
                    indexArray.push(x1);
                    indexArray.push(x2);
                    indexArray.push(y1);

                    indexArray.push(x2);
                    indexArray.push(y2);
                    indexArray.push(y1);
                } else {
                    indexArray.push(y1);
                    indexArray.push(x1);
                    indexArray.push(y2);

                    indexArray.push(x1);
                    indexArray.push(x2);
                    indexArray.push(y2);
                }
            }
        }

        let vertices = new Float32Array(vertexArray);
        let uvs = new Float32Array(uvArray);
        let normals = new Float32Array(normalArray);
        let indices = new Uint16Array(indexArray);

        geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.index = new THREE.BufferAttribute(indices, 1);

        return geometry;
    }

    addTerrain() {
        for (let x = 0; x < this.tileCount; x++) {
            for (let y = 0; y < this.tileCount; y++) {
                let terrain = this.createTerrainTile(x, y, this.totalSize / this.tileCount);
                this.scene.add(terrain);
                this.terrainGeometries.push(terrain);
            }
        }

        this.waterPlane = new WaterPlane();
        this.scene.add(this.waterPlane.model);
    }

    createTerrainTile(x: number, y: number, tileSize: number) {
        var uniformsTerrain = THREE.UniformsUtils.clone(TerrainShader.uniforms);

        uniformsTerrain['tDisplacement'].value = assets.getTexture("heightmap");
        uniformsTerrain['tDiffuse1'].value = assets.getTexture("grass");
        uniformsTerrain['tDiffuse2'].value = assets.getTexture("dirt");
        uniformsTerrain['tDetail1'].value = assets.getTexture("grassNormals");;
        uniformsTerrain['tDetail2'].value = assets.getTexture("dirtNormals");;
        uniformsTerrain['diffuse'].value.setHex(0xffffff);
        uniformsTerrain['specular'].value.setHex(0xffffff);
        uniformsTerrain['shininess'].value = 50;
        uniformsTerrain['uRepeatOverlay'].value.set(tileSize / 95, tileSize / 95);
        uniformsTerrain['uNormalScale'].value = 1;
        uniformsTerrain['uCount'].value = this.tileCount;
        uniformsTerrain['uOffset'].value.set(y, x);

        // currently only drawing 1/6th the size of the entire heightmap
        // var terrainGeometry = new THREE.PlaneBufferGeometry(tileSize, tileSize, 200, 200);
        var terrainGeometry = this.generatePlaneGeometry(tileSize, 200);

        BufferGeometryUtils.computeTangents(terrainGeometry);

// material = new THREE.MeshBasicMaterial({
//     color: 0xff0000,
//     wireframe: true
// });

        let terrainMaterial = new THREE.ShaderMaterial({
            uniforms: uniformsTerrain,
            vertexShader: TerrainShader.vertexShader,
            fragmentShader: TerrainShader.fragmentShader,
            lights: true,
            //fog: true,
        });

        let terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        let terrainOffset = this.totalSize / 2 - tileSize / 2;

        // terrain.position.set(x * tileSize - terrainOffset, -1, y * tileSize - terrainOffset);
        terrain.position.set(-this.totalSize / 2, -1, -this.totalSize / 2);
        terrain.rotation.x = -Math.PI / 2;
        terrain.rotation.z = -Math.PI / 2;
        terrain.receiveShadow = true;

        return terrain;
    }

    updateHeightmap(source) {
        this.img.src = source;

        var heightMap = assets.getTexture("heightmap");
        heightMap.image = this.img;
        heightMap.needsUpdate = true;
    }

    loadMapTexture() {
        this.img.src = this.imageData;

        let mapTexture = new THREE.Texture(this.img);
        mapTexture.needsUpdate = true;

        assets.setTexture("heightmap", mapTexture);
    }

    getMapData() {
        return this.img.src;
    }

    generateMapObjects() {
        for (let object of this.savedMapObjects) {
            if (object.type == 1) {
                this.grass.positions = object.data;
            } else if (object.type == 2) {
                this.grass.dims = object.data;
            } else {
                this.createModelForMapObject(object);
            }
        }

        if (this.grass.dims && this.grass.positions) {
            this.generateGrass();
        }
    }

    createModelForMapObject(object) {
        let meta = mapMetaData.filter(x => x.id == object.type)[0];
        if (!meta) {
            console.error(object.type, "not found");
        }

        let newModel = this.createNewModel(meta.name);

        newModel.position.set(object.x, object.y, object.z);
        newModel.scale.set(object.sx, object.sy, object.sz);
        newModel.rotation.y = object.rot;
        newModel["modelType"] = meta.id;

        this.meshes.push(newModel);

        if (meta.meta.solid) {
            this.generateObjectBounds(object);
        }

        if (window["mapEditor"]) {
            window["mapEditor"].addModel(newModel);
        }
    }

    createNewModel(name) {
        var newModel = assets.getModel(name);

        this.scene.add(newModel);
        return newModel;
    }

    generateObjectBounds(object) {
        let metaData = mapMetaData.filter(x => x.id == object.type)[0];

        let hitboxes = MapLogic.addCollidable(object, metaData.meta.hitboxes);

        if (window["game"].debug) {
            for (let hitbox of hitboxes) {
                let hitboxView = hitbox.getView();
                hitboxView.type = metaData.name;

                this.scene.add(hitboxView);
                this.debug.hitboxes.push(hitboxView);
            }
        }
    }

    generateGrass() {
        let uniformsGrass = THREE.UniformsUtils.clone(GrassShader.uniforms);

        uniformsGrass['texture'].value = assets.getTexture("grass4");
        uniformsGrass['numColumns'].value = 2;
        uniformsGrass['numRows'].value = 2;

        let material = new THREE.RawShaderMaterial({
            uniforms: uniformsGrass,
            vertexShader: GrassShader.vertexShader,
            fragmentShader: GrassShader.fragmentShader,
            transparent: true,
            // depthTest: true,
            // depthWrite: true,
            // alphaTest: 0.5,
            //fog: true,
        });

        let count = this.grass.positions.length / 2;
        let positions = new Float32Array(count * 3);
        let types = new Float32Array(this.grass.dims);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = this.grass.positions[i * 2];
            positions[i * 3 + 2] = this.grass.positions[i * 2 + 1];
        }

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.attributes["position"].needsUpdate = true;

        geometry.addAttribute('dim', new THREE.BufferAttribute(types, 2));
        geometry.attributes["dim"].needsUpdate = true;

        if (window["mapEditor"]) {
            window["mapEditor"].addGrass(positions, types);
        }

        let mesh = new THREE.Points(geometry, material);
        mesh.position.set(0, 4.5, 0);
        mesh.renderOrder = -1;
        this.grass.mesh = mesh;
        this.grass.positions = positions;

        this.scene.add(mesh);
    }

    regenerateGrass(positions, dims) {
        this.grass.positions = positions;
        this.grass.dims = dims;

        let newPositions = new Float32Array(positions);
        let newDims = new Float32Array(dims);

        let geometry = (<THREE.BufferGeometry>this.grass.mesh.geometry);
        geometry.removeAttribute('position');
        geometry.removeAttribute('dim');

        geometry.addAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        geometry.addAttribute('dim', new THREE.BufferAttribute(newDims, 2));

        if (window["mapEditor"]) {
            window["mapEditor"].addGrass(newPositions, newDims);
        }
    }

    setMapData(imageData, savedMapObjects) {
        this.imageData = imageData;
        this.savedMapObjects = savedMapObjects;
    }

    // getHeightmapPixelAt(position: THREE.Vector3) {
    //     relativeX = position.x / 3000;
    // }

    update() {
        let typesWithOverheadHiding = mapMetaData.filter(x => x.meta != null && x.meta.hideOverhead).map(x => x.id);
        let objectsWithOverheadHiding = [];

        for (let type of typesWithOverheadHiding) {
            let objectsOfType = this.meshes.filter(x => x.modelType == type);

            for (let object of objectsOfType) {
                object.visible = true;
            }

            objectsWithOverheadHiding = objectsWithOverheadHiding.concat(objectsOfType);
        }


        var flattened = objectsWithOverheadHiding.reduce((a, b) => a.concat(b.children), []);
        let intersects = renderer.getObjectsObscuringPlayer(flattened);

        if (intersects.length) {
            let hover = intersects[0].object.parent;

            hover.visible = false;
        }

        this.waterPlane.update();
    }
}

const map = new Map();
export default map;