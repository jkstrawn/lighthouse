export default class XpManager {

    static xpFor(level: number) : number {
        return xpPerLevel[level];
    }

    static getLevelFromXp(xp: number) : number {
        for (var i = 2; i < 60; i++) {
            if (xpPerLevel[i] > xp) {
                return i - 1;
            }
        }
        
        return 1;
    }
};

let xpPerLevel = {
    1: 10,
    2: 50,
    3: 100,
    4: 200,
    5: 350,
    6: 600,
    7: 1000,
    8: 1750,
    9: 3000

    // 1: 0,
    // 2: 200,
    // 3: 1000,
    // 4: 2000,
    // 5: 4000,
    // 6: 7000,
    // 7: 12000,
    // 8: 22000,
    // 9: 35000,
    // 10: 50000,
    // 11: 70000,
    // 12: 100000,
    // 13: 150000,
    // 14: 250000,
    // 15: 450000,
    // 16: 750000,
    // 17: 1250000,
    // 18: 1750000,
    // 19: 2250000,
    // 20: 2750000
};