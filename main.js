// main.js
import { initDisplay, addChunkMesh, renderDisplay } from "./main/display.js";
import { generateChunk } from "./main/data.js";
//import { main } from "./main/game.js"

const canvas = document.querySelector("#canvas");
initDisplay(canvas);

// とりあえず原点付近の1チャンクを作る
const chunk = generateChunk(0, 0, 0);
alert("generated")
addChunkMesh(chunk);
alert("added")
rendeerDisplay()
alert("displayed")

/*
// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  main()
  renderDisplay();
  alert("success")
}

animate();
*/
