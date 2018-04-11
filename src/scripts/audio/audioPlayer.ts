import BufferLoader from './bufferLoader';
interface AudioUrl {
    name: string;
    url: string;
}

class AudioPlayer {

    sounds: Array<AudioUrl>;
    walking: boolean = false;
    context: AudioContext;
    walkInterval1: any;
    walkInterval2: any;
    walkTimeout: any;
    buffer: Array<AudioBuffer>;

    constructor() {
        this.sounds = [
            { name: 'bug1', url: 'sounds/bug/bug1.mp3' },
            { name: 'bug2', url: 'sounds/bug/bug2.mp3' },
            { name: 'bug3', url: 'sounds/bug/bug3.mp3' },
            { name: 'bug6', url: 'sounds/bug/bug6.mp3' },
            { name: 'bug7', url: 'sounds/bug/bug7.mp3' },
            { name: 'bugArcher1', url: 'sounds/bug/archer/damage3.wav' },
            { name: 'bugArcher2', url: 'sounds/bug/archer/rise_attack1-2.mp3' },
            { name: 'bugArcher3', url: 'sounds/bug/archer/shield_hit1-3.mp3' },
            { name: 'bugArcher4', url: 'sounds/bug/archer/shield_hit2-3.mp3' },
            { name: 'bugArcher5', url: 'sounds/bug/archer/shield_hit3-3.mp3' },
            { name: 'bugArcher6', url: 'sounds/bug/archer/attack1-2.mp3' },
            { name: 'bugArcher7', url: 'sounds/bug/archer/attack2-2.mp3' },
            { name: 'bugArcher8', url: 'sounds/bug/archer/hit1.mp3' },
            { name: 'bugArcher9', url: 'sounds/bug/archer/death.wav' },
            { name: 'birds1', url: 'sounds/birds/birds1.mp3' },
            { name: 'birds2', url: 'sounds/birds/birds2.mp3' },
            { name: 'birds3', url: 'sounds/birds/birds3.mp3' },
            { name: 'birds4', url: 'sounds/birds/birds4.mp3' },
            { name: 'birds5', url: 'sounds/birds/birds5.mp3' },
            { name: 'birds6', url: 'sounds/birds/birds6.mp3' },
            { name: 'birds7', url: 'sounds/birds/birds7.mp3' },
            { name: 'birds8', url: 'sounds/birds/birds8.mp3' },
            { name: 'birds9', url: 'sounds/birds/birds9.mp3' },
            { name: 'birds10', url: 'sounds/birds/birds10.mp3' },
            { name: 'walk1', url: 'sounds/walking/grass/walk1.mp3' },
            { name: 'walk2', url: 'sounds/walking/grass/walk2.mp3' },
            { name: 'walk3', url: 'sounds/walking/grass/walk3.mp3' },
            { name: 'walk4', url: 'sounds/walking/grass/walk4.mp3' },
            { name: 'walk5', url: 'sounds/walking/grass/walk5.mp3' },
            { name: 'walk6', url: 'sounds/walking/grass/walk6.mp3' },
            { name: 'walk7', url: 'sounds/walking/grass/walk7.mp3' },
            { name: 'walk8', url: 'sounds/walking/grass/walk8.mp3' },
            { name: 'walk9', url: 'sounds/walking/grass/walk9.mp3' },
            { name: 'walk10', url: 'sounds/walking/grass/walk10.mp3' },
            { name: 'grassRustle1', url: 'sounds/walking/grass/grassRustle1.mp3' },
            { name: 'grassRustle2', url: 'sounds/walking/grass/grassRustle2.mp3' },
            { name: 'grassRustle3', url: 'sounds/walking/grass/grassRustle3.mp3' },
            { name: 'grassRustle4', url: 'sounds/walking/grass/grassRustle4.mp3' },
            { name: 'grassRustle5', url: 'sounds/walking/grass/grassRustle5.mp3' },
            { name: 'grassRustle6', url: 'sounds/walking/grass/grassRustle6.mp3' },
            { name: 'grassRustle7', url: 'sounds/walking/grass/grassRustle7.mp3' },
            { name: 'grassRustle8', url: 'sounds/walking/grass/grassRustle8.mp3' },
            { name: 'grassRustle9', url: 'sounds/walking/grass/grassRustle9.mp3' },
            { name: 'grassRustle10', url: 'sounds/walking/grass/grassRustle10.mp3' },
            { name: 'grassRustle11', url: 'sounds/walking/grass/grassRustle11.mp3' },
            { name: 'grassRustle12', url: 'sounds/walking/grass/grassRustle12.mp3' },
            { name: 'grassBreeze1', url: 'sounds/wind/grassBreeze1F.mp3' },
            { name: 'grassBreeze2', url: 'sounds/wind/grassBreeze2F.mp3' },
            { name: 'grassBreeze3', url: 'sounds/wind/grassBreeze3F.mp3' },
            { name: 'grassBreeze4', url: 'sounds/wind/grassBreeze4F.mp3' },
            { name: 'grassBreeze5', url: 'sounds/wind/grassBreeze5F.mp3' },
            { name: 'grassBreeze6', url: 'sounds/wind/grassBreeze6F.mp3' },
            { name: 'grassBreeze7', url: 'sounds/wind/grassBreeze7F.mp3' },
            { name: 'walkLeather1', url: 'sounds/walking/leather/walk1.mp3' },
            { name: 'walkLeather2', url: 'sounds/walking/leather/walk2.mp3' },
            { name: 'walkLeather3', url: 'sounds/walking/leather/walk3.mp3' },
            { name: 'walkLeather4', url: 'sounds/walking/leather/walk4.mp3' },
            { name: 'walkLeather5', url: 'sounds/walking/leather/walk5.mp3' },
            { name: 'walkLeather6', url: 'sounds/walking/leather/walk6.mp3' },
            { name: 'walkLeather7', url: 'sounds/walking/leather/walk7.mp3' },
            { name: 'walkLeather8', url: 'sounds/walking/leather/walk8.mp3' },
            { name: 'walkLeather9', url: 'sounds/walking/leather/walk9.mp3' },
            { name: 'walkLeather10', url: 'sounds/walking/leather/walk10.mp3' },
            { name: 'whoosh', url: 'sounds/whoosh.mp3' },
            { name: 'whooshSword', url: 'sounds/whooshSword.mp3' },
            { name: 'leatherArmor', url: 'sounds/LeatherArmor_Rustle.mp3' },
            { name: 'orchestra', url: 'sounds/orchestra.mp3' },
            { name: 'guitar', url: 'sounds/guitar.wav' },
            { name: 'shield', url: 'sounds/shield.mp3' },
            { name: 'metal', url: 'sounds/metal.mp3' },
            { name: 'wood', url: 'sounds/wood.mp3' },
            { name: 'money', url: 'sounds/money.mp3' },
            { name: 'paper', url: 'sounds/paper.mp3' },
            { name: 'paperClose', url: 'sounds/paper_close.mp3' },
            { name: 'bugbearRoar', url: 'sounds/bugbear/bugbear_roar.mp3' },
            { name: 'bugbearPain', url: 'sounds/bugbear/bugbear_pain.mp3' },
            { name: 'bugbearDeath', url: 'sounds/bugbear/bugbear_death.mp3' },
            { name: 'crunch', url: 'sounds/crunch.mp3' },
            { name: 'shatter1', url: 'sounds/shatter1_bass.mp3' },
            { name: 'spell1', url: 'sounds/spell1_bass.mp3' },
            { name: 'shieldUp', url: 'sounds/shield/up.mp3' },
            { name: 'shieldDown', url: 'sounds/shield/down.mp3' },
            { name: 'coins', url: 'sounds/coins.mp3' },
            { name: 'coinDrop', url: 'sounds/coin_drop.mp3' },
            { name: 'maleGrunt', url: 'sounds/male_grunt.mp3' },
            { name: 'maleGrunt2', url: 'sounds/male_grunt2.mp3' }
        ];

        try {
            //AudioContext = webkitAudioContext || msAudioContext || mozAudioContext;
            //window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            let soundUrls = this.sounds.map(function (s) { return s.url; });
            let bufferLoader = new BufferLoader(this.context, soundUrls, (b) => {
                this.buffer = b;
                //this.playSoundBuffer('forest');
                this.startBirdsSound();
                this.startWindSound();
            });

            bufferLoader.load();
        }
        catch (e) {
            console.log(e);
            alert('Web Audio API is not supported in this browser');
        }
    }

    playWalkSound(armor) {
        let number = Math.floor(Math.random() * 10) + 1;
        this.playSound(this.getBuffer('walk' + number));

        let number2 = Math.floor(Math.random() * 10) + 1;
        this.playSound(this.getBuffer('grassRustle' + number2), 0, 0.01, 0.5);

        if (armor == 'leather') {
            let number = Math.floor(Math.random() * 10) + 1;
            this.playSound(this.getBuffer('walkLeather' + number));
        }
    }

    startWalkSound(armor) {
        if (this.walking) return;

        this.walking = true;
        this.playWalkSound(armor);

        this.walkInterval1 = setInterval(() => {
            this.playWalkSound(armor);
        }, 1000);

        this.walkTimeout = setTimeout(() => {
            this.playWalkSound(armor);
            this.walkInterval2 = setInterval(() => {
                this.playWalkSound(armor);
            }, 1000);
        }, 500);
    }

    stopWalkSound() {
        this.walking = false;
        clearInterval(this.walkInterval1);
        clearInterval(this.walkInterval2);
        clearTimeout(this.walkTimeout);
    }

    randomIntBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    playBugSound() {
        let number = this.randomIntBetween(1, 3);
        console.log('bug' + number);
        this.playSound(this.getBuffer('bug' + number));
    }

    playBugArcherAttack() {
        this.playSound(this.getBuffer('bugArcher2'));

        setTimeout(() => {
            //let number = this.randomIntBetween(6, 7);
            this.playSound(this.getBuffer('bugArcher7'));
        }, 700);
    }

    playParticleHit(type: string, hitShield: boolean) {
        // switch (type) {
        //     case EntityTypes.ProjectileSlime:
        //         if (hitShield) {
        //             let number = this.randomIntBetween(3, 5);
        //             this.playSound(this.getBuffer('bugArcher' + number));
        //         } else {
        //             this.playSound(this.getBuffer('bugArcher8'));
        //         }
        //         break;
        //     case EntityTypes.ProjectileStar:
        //         this.playSoundBuffer('shatter1');
        //         break;
        // }
    }

    startBirdsSound() {
        let audio = this;
        this.playBirdsSound();
        setInterval(function () {
            audio.playBirdsSound();
        }, 6000);
    };

    playBirdsSound() {
        let number = Math.floor(Math.random() * 10) + 1;
        let pan = (Math.random() * 2) - 1;
        let gain = Math.random() * 0.3;

        this.playSound(this.getBuffer('birds' + number), 0, pan, gain);
    }

    startWindSound() {
        let audio = this;
        this.playWindSound();
        setInterval(function () {
            audio.playWindSound();
        }, 20000);
    };

    playWindSound() {
        let number = Math.floor(Math.random() * 7) + 1;

        this.playSound(this.getBuffer('grassBreeze' + number), 0, 0.01, 0.8);
    }

    playDeathSoundFor(type) {
        // switch (type) {
        //     case EntityTypes.Ant:
        //         this.playSoundBuffer('bug6');
        //         break;
        //     case EntityTypes.Grub:
        //         this.playSoundBuffer('bugArcher9');
        //         break;
        //     case EntityTypes.Bugbear:
        //         this.playSoundBuffer('bugbearDeath');
        //         break;
        // }
    }

    playAttackSoundFor(type) {
        // switch (type) {
        //     case EntityTypes.Ant:
        //         this.playSoundBuffer('bug7');
        //         break;
        //     case EntityTypes.Grub:
        //         this.playBugArcherAttack();
        //         break;
        //     case EntityTypes.Bugbear:
        //         this.playSoundBuffer('bugbearRoar', 0.1);
        //         break;
        // }
    }

    playDamagedSoundFor(type) {
        // switch (type) {
        //     case EntityTypes.Ant:
        //         this.playBugSound();
        //         break;
        //     case EntityTypes.Grub:
        //         this.playSoundBuffer('bugArcher1');
        //         break;
        //     case EntityTypes.Bugbear:
        //         this.playSoundBuffer('bugbearPain');
        //         break;
        // }
    }

    playInventoryItemSound(material) {
        // switch (material) {
        //     case ItemMaterials.Wood:
        //         this.playSoundBuffer('wood');
        //         break;
        //     case ItemMaterials.Leather:
        //         this.playSoundBuffer('leatherArmor');
        //         break;
        //     case ItemMaterials.Metal:
        //         this.playSoundBuffer('metal');
        //         break;
        // }
    }

    getBuffer(soundName) {
        let sound = this.sounds.filter(x => x.name == soundName)[0]
        if (!sound) {
            return null;
        }

        let index = this.sounds.indexOf(sound);
        if (index >= 0) return this.buffer[index];
    }

    playSoundBuffer(soundName, delay = 0) {
        this.playSound(this.getBuffer(soundName), delay);
    }

    playSound(buffer, delay?, pan?, gain?, rate?) {
        delay = delay ? this.context.currentTime + delay : 0;
        let source = this.context.createBufferSource();
        source.buffer = buffer;

        if (rate) {
            source.playbackRate.value = rate;
        }

        if (pan && gain) {
            //console.log(gain);
            let gainNode = this.context.createGain();
            gainNode.gain.value = gain;
            source.connect(gainNode);

            let panner = this.context.createStereoPanner();
            panner.pan.value = pan;
            gainNode.connect(panner);
            panner.connect(this.context.destination);
        } else {
            source.connect(this.context.destination);
        }

        source.start(delay);

        //source.loop = true;
    }
}

const audioPlayer = new AudioPlayer();
export default audioPlayer;