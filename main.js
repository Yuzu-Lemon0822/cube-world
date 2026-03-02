// main.js
import { initDisplay, addChunkMesh, renderDisplay, camera } from "./main/display.js";
import { generateChunk } from "./main/data.js";
import { gameMain } from './game.js';

const canvas = document.querySelector("#canvas");
initDisplay(canvas);

function tick() {
    gameMain(player, key);

    camera.position.set(player.x, player.y, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0);

    renderDisplay();
    requestAnimationFrame(tick);
}

// とりあえず原点付近の1チャンクを作る
const chunk = generateChunk(0, 0, 0);
alert("generated")
addChunkMesh(chunk);
alert("added")
renderDisplay()
alert("displayed")

function animate() {
  tick()
  alert("success")
}

animate();

