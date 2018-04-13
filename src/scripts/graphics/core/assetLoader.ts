import * as THREE from 'three';
import * as $ from 'jquery';
import assetUrls from "../../core/assetUrls";
import DeadModel from "./deadModel";
import TextureData from "./textureData";

class AssetLoader {

    loader = new THREE.JSONLoader();
    objectLoader = new THREE.ObjectLoader();

    textures: Array<TextureData> = [];
    geometry = [];

    deadModels: Array<DeadModel> = [];
    numToLoad = 1;
    startTime = 0;
    callback = null;

    textureLoader: THREE.TextureLoader;

    constructor() {
        let loadingManager = new THREE.LoadingManager(() => {
            // all textures are done loading
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
        this.numToLoad += assetUrls.dead.length;

        for (let asset of assetUrls.dead) {
            this.loadDeadModel(asset.name, asset.url);
        }

        for (let texture of assetUrls.textures) {
            this.loadTexture(texture);
        }
    }

    checkDoneLoading() {
        this.numToLoad--;

        if (this.numToLoad <= 0) {
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

    finishLoading() {
        let endTime = performance.now();
        let totalTime = Math.round(endTime - this.startTime);
        console.log("assets were loaded successfully after " + totalTime + "ms");

        this.callback();
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