import * as THREE from 'three';
import map from './map';
import * as $ from 'jquery';
import AnimatedModel from "../animatedModel";
import assetUrls from "../../core/assetUrls";
import LiveModel from "./liveModel";
import DeadModel from "./deadModel";
import TextureData from "./textureData";

class AssetLoader {

    loader = new THREE.JSONLoader();
    objectLoader = new THREE.ObjectLoader();

    textures: Array<TextureData> = [];
    geometry = [];

    deadModels: Array<DeadModel> = [];
    liveModels: Array<LiveModel> = [];
    numToLoad = 2;
    startTime = 0;
    callback = null;

    textureLoader: THREE.TextureLoader;

    constructor() {
        let loadingManager = new THREE.LoadingManager(() => {
            this.checkDoneLoading();
        });
        this.textureLoader = new THREE.TextureLoader(loadingManager);
    }

    getTexture(name) {
        let texture = this.textures.filter(x => x.name == name);

        if (texture.length == 0) {
            console.error("Could not find texture", name, ". Did you forget to add it to AssetUrls?");
        }

        return texture[0].value;
    }

    getGeometry(name) {
        let geometry = this.geometry.filter(x => x.name == name);

        if (geometry.length == 0) {
            console.error("Could not find geometry", name, ". Did you forget to add it to AssetUrls?");
        }

        return geometry[0].value;
    }

    loadTexture(tex) {
        let texture: THREE.Texture = this.textureLoader.load(tex.url);
        texture.anisotropy = 2;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        this.setTexture(tex.name, texture);
    }

    setTexture(name: string, value: THREE.Texture) {
        this.textures.push(new TextureData(name, value));
    }

    loadAssets(callback) {
        this.startTime = performance.now();
        console.log("getting assets...");

        this.callback = callback;
        this.numToLoad += assetUrls.live.length;
        this.numToLoad += assetUrls.dead.length;

        for (let asset of assetUrls.live) {
            this.loadLiveModel(asset.name, asset.url);
        }

        for (let asset of assetUrls.dead) {
            this.loadDeadModel(asset.name, asset.url);
        }

        for (let texture of assetUrls.textures) {
            this.loadTexture(texture);
        }

        $.get("/getMap", (data) => {
            console.log("got map data");

            let objectsMap = JSON.parse(data.objectsMap);

            map.setMapData(data.imageData, objectsMap);
            this.checkDoneLoading();
        });

        // this.loader.load("models/tree.json", (geometry, materials) => {
        //     this.geometry.push({ name: "tree", value: geometry });
        //     //geometry.boundingSphere.set(new THREE.Vector3(0, 100, 0), 100);
        // });
    }

    checkDoneLoading() {
        this.numToLoad--;

        if (this.numToLoad == 0) {
            this.finishLoading();
        }
    }

    loadDeadModel(name, url) {
        this.objectLoader.load(url, (scene) => {
            let model = new DeadModel(name, url, scene);

            this.deadModels.push(model);
            this.checkDoneLoading();
        });
    }

    loadLiveModel(name, url) {
        if (url == assetUrls.live[0].url) {
            let loader = new THREE.ObjectLoader();
            loader.load(url, (result) => {
                this.loadMultipleMeshes(result, name, url, loader.manager);
            });
            return;
        }

        this.loader.load(url, (geometry, materials) => {
            let model = new LiveModel(name, url, geometry, materials);

            this.liveModels.push(model);
            this.checkDoneLoading();
        });
    }

    loadMultipleMeshes(result, name, url, mana) {
        let subMeshes = [];
        let staticMeshes = [];

        for (let child of result.children) {
            if (child.type == "SkinnedMesh" && child.name != "Body") {
                child.material.map.anisotropy = 2;
                child.material.map.magFilter = THREE.LinearFilter;
                child.material.map.minFilter = THREE.LinearFilter;

                subMeshes.push(child);
            }

            if (child.type == "Mesh") {
                child.material.map.anisotropy = 2;
                child.material.map.magFilter = THREE.LinearFilter;
                child.material.map.minFilter = THREE.LinearFilter;

                staticMeshes.push(child);
            }
        }

        let body = result.children.filter(x => x.name == "Body")[0];
        let geometry = body.geometry;
        let material = body.material;

        // let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
        // geometry.applyMatrix(rotation);

        let loader = new THREE.FileLoader(mana);
        loader.load("animations/man_animations.json", (text) => {
            let json = JSON.parse(text);
            let animations = [];

            for (let i = 0; i < json.length; i++) {

                let clip = THREE.AnimationClip.parseAnimation(json[i], geometry.bones, null);
                animations.push(clip);
            }

            let model = new LiveModel(name, url, geometry, [material], animations, subMeshes, staticMeshes);

            this.liveModels.push(model);
            this.checkDoneLoading();
        });
    }

    finishLoading() {
        let endTime = performance.now();
        let totalTime = Math.round(endTime - this.startTime);
        console.log("assets were loaded successfully after " + totalTime + "ms");

        this.callback();
    }

    getAnimatedModel(name: string): AnimatedModel {
        let model = this.liveModels.filter(x => x.name == name)[0];

        if (model == null) {
            throw "Could not find model '" + name + "'";
        }

        return model.createModel();
    }

    getModel(name: string): THREE.Object3D {
        let model = this.deadModels.filter(x => x.name == name)[0];

        if (model == null) {
            throw "Could not find model '" + name + "'";
        }

        return model.createModel();
    }
}

const assets = new AssetLoader();
export default assets;