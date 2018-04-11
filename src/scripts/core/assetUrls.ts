class AssetUrl {
    name: string;
    url: string;
}

class AssetUrls {
    dead: Array<AssetUrl>;
    live: Array<AssetUrl>;
    textures: Array<AssetUrl>;
}

const assetUrls: AssetUrls = new AssetUrls();

assetUrls.dead = [
    { name: "tree", url: "models/tree.json" },
    { name: "cart", url: "models/cart.json" },
    { name: "mausoleum", url: "models/mausoleum.json" },
    { name: "wall", url: "models/wall.json" },
    { name: "wallWithDoor", url: "models/wallWithDoor.json" },
    { name: "wallWithWindow", url: "models/wallWithWindow.json" },
    { name: "wallPost", url: "models/wallPost.json" },
    { name: "floorWood", url: "models/floorWood.json" },
    { name: "roof", url: "models/roof.json" },
    { name: "sack", url: "models/sack.json" },
    { name: "barrel", url: "models/barrel.json" },
    { name: "bedPillow", url: "models/bedPillow.json" },
    { name: "crate", url: "models/crate.json" },
];

assetUrls.live = [
    { name: "man", url: "animations/man.json" },
    { name: "ant", url: "animations/ant.json" },
    { name: "grub", url: "animations/grub.json" },
    { name: "bugbear", url: "animations/bugbear.json" },
];

assetUrls.textures = [
    { name: "grass", url: "textures/grass_diffuse.jpg" },
    { name: "dirt", url: "textures/dirt_diffuse.jpg" },
    { name: "grass4", url: "textures/grass4.png" },
    { name: "grassNormals", url: "textures/grass_normal.jpg" },
    { name: "dirtNormals", url: "textures/dirt_normal.jpg" },
    { name: "raindrop", url: "textures/particles/raindrop.png" },
    { name: "spark", url: "textures/particles/spark.png" },
    { name: "snowflake", url: "textures/particles/snowflake.png" },
    { name: "circle", url: "textures/particles/circle.png" },
    { name: "spikey", url: "textures/particles/spikey.png" },
    { name: "fuzz", url: "textures/particles/fuzz.png" },
    { name: "smoke", url: "textures/particles/smoke.png" },
    { name: "waternormals", url: "textures/waternormals.jpg" },
];

export default assetUrls;