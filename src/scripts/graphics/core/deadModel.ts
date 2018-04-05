import * as THREE from "three";

export default class DeadModel {
    name: string;
    url: string;
    children: Array<THREE.Mesh>;
    model = new THREE.Object3D();

    constructor(name, url, scene) {
        this.name = name;
        this.url = url;
        this.children = scene.children.filter(x => x.type == "Mesh");

        for (let child of this.children) {
            // if (child.material.name == "LeavesMat") {
            // child.castShadow = true;
            //     var customDepthMaterial = new THREE.MeshDepthMaterial( {
            //         depthPacking: THREE.RGBADepthPacking,
            //         alphaMap: child.material.map, // or, alphaMap: myAlphaMap
            //         alphaTest: 0.5
            //     } );

            //     child.customDepthMaterial = customDepthMaterial;
            // }
            child.material["map"].anisotropy = 2;
            //var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
            this.model.add(child);
        }
    }

    createModel(): THREE.Object3D {
        return this.model.clone();
    }
}