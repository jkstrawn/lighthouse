import * as THREE from "three";

class _VertexHelper {
    rotatePoint(position, width, height, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let nx = cos * width + sin * height;
        let ny = cos * height - sin * width;

        return new THREE.Vector3(nx, 0, ny).add(position);
    }
}

const VertexHelper = new _VertexHelper();
export default VertexHelper;