// main.js
import { initDisplay, addChunkMesh, renderDisplay } from "./main/display.js";
import { generateChunk } from "./main/data.js";

const canvas = document.querySelector("#canvas");
initDisplay(canvas);

// とりあえず原点付近の1チャンクを作る
const chunk = generateChunk(0, 0, 0);
alert("generated")
addChunkMesh(chunk);
alert("added")
renderDisplay()
alert("displayed")
/*
try {
  import { gameMain } from "./main/game.js";
} catch(e) {
  alert(e)
}
// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  gameMain()
  renderDisplay();
  alert("success")
}

animate();

*/