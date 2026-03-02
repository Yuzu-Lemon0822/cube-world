// main.js
import { initDisplay, addChunkMesh, renderDisplay } from "./display.js";
import { generateChunk, CHUNK_SIZE } from "./data.js";

const canvas = document.querySelector("#canvas");
initDisplay(canvas);

// とりあえず原点付近の1チャンクを作る
const chunk = generateChunk(0, 0, 0);
addChunkMesh(chunk);

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  // 必要ならカメラやmeshの更新もここに
  renderDisplay();
}

animate();