import AnimatedModel from "../animatedModel";

export default class LiveModel {
    name: string;
    url: string;
    geometry: THREE.Geometry;
    material: THREE.Material;
    anims: Array<THREE.AnimationClip>;
    meshes: Array<THREE.Mesh>;
    staticMeshes: Array<THREE.Mesh>;

    constructor(name, url, geometry, materials, anims = null, meshes = null, staticMeshes = null) {
        let material = materials[0];
        material.skinning = true;
        material.map.anisotropy = 2;
        
        this.name = name;
        this.url = url;
        this.geometry = geometry;
        this.material = material;
        this.anims = anims;
        this.meshes = meshes;
        this.staticMeshes = staticMeshes;
    }

    createModel(): AnimatedModel {
        return new AnimatedModel(this.geometry, this.material.clone(), this.anims, this.meshes, this.staticMeshes);
    }
}