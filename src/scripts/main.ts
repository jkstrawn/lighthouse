import game from './core/gameEngine';
import * as $ from 'jquery';
import * as THREE from "three";

window["adminMap"] = null;
window["game"] = game;
var gettingFocus = false;

$(document).ready(function () {
	let animate = function () {
		requestAnimationFrame(animate);

		let dt = clock.getDelta() * 1000;

		game.render(dt);
		game.update(dt);
	}

	window["animate"] = animate;

	let clock = new THREE.Clock(true);

	game.init();
});