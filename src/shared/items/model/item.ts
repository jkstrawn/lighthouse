export default class Item {
    id: number;
    modelName: string;
    name: string;
    defaultSellPrice: number;
    x: number;
    y: number;
    type: string;
    material: string;
    protection?: number;
    healthRestore?: number;
    damage?: number;
}