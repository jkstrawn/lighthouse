class AssetUrl {
    name: string;
    url: string;
}

class AssetUrls {
    dead: Array<AssetUrl>;
    textures: Array<AssetUrl>;
}

const assetUrls: AssetUrls = new AssetUrls();

assetUrls.dead = [
    { name: "spaceship", url: "models/spaceship.json" },
    { name: "enemy", url: "models/enemyShip.json" },
];

assetUrls.textures = [
    // { name: "grass", url: "textures/grass_diffuse.jpg" },
    // { name: "dirt", url: "textures/dirt_diffuse.jpg" },
    // { name: "grass4", url: "textures/grass4.png" },
    // { name: "grassNormals", url: "textures/grass_normal.jpg" },
    // { name: "dirtNormals", url: "textures/dirt_normal.jpg" },
    { name: "raindrop", url: "textures/particles/raindrop.png" },
    { name: "spark", url: "textures/particles/spark.png" },
    { name: "snowflake", url: "textures/particles/snowflake.png" },
    { name: "circle", url: "textures/particles/circle.png" },
    { name: "spikey", url: "textures/particles/spikey.png" },
    { name: "fuzz", url: "textures/particles/fuzz.png" },
    { name: "smoke", url: "textures/particles/smoke.png" },
    // { name: "waternormals", url: "textures/waternormals.jpg" },
];

export default assetUrls;