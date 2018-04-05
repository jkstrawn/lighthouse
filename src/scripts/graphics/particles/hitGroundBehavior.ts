import * as Proton from "three.proton";

function HitGroundBehavior() {
    HitGroundBehavior["_super_"].call(this, null, null);
    this.reset();
    this.name = "HitGroundBehavior";
}


Proton.Util.inherits(HitGroundBehavior, Proton.Behaviour);
HitGroundBehavior.prototype.reset = function () {
    
}

HitGroundBehavior.prototype.applyBehaviour = function (particle, time, index) {
    HitGroundBehavior["_super_"].prototype.applyBehaviour.call(this, particle, time, index);

    if (particle.hit && particle.v.y > 0) {
        particle.hit = false;
        return;
    }

    if (!particle.hit && particle.p.y < .25 && particle.v.y < 0) {
        particle.hit = true;
        particle.p.setY(.25);
    }

    if (particle.hit) {
        particle.v.setY(0);
        particle.a.setY(0);

        particle.v.setX(0);
        particle.a.setX(0);

        particle.v.setZ(0);
        particle.a.setZ(0);
    }
};

export default HitGroundBehavior;