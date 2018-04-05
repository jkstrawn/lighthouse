export default class TextureData {
    name: string;
    value: THREE.Texture;

    constructor(name: string, value: THREE.Texture) {
        this.name = name;
        this.value = value;
    }
}