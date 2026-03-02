// main/display.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

let camera;
let scene, renderer;
let meshGroup;

export function initDisplay(canvas) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 空色

  camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(20, 20, 20);

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  meshGroup = new THREE.Group();
  scene.add(meshGroup);
}

export function addChunkMesh(chunk) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(chunk.vertices, 3)
  );
  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(chunk.normals, 3)
  );
  geometry.setIndex(new THREE.BufferAttribute(chunk.indices, 1));

  const material = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // 茶色
    flatShading: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  meshGroup.add(mesh);
}

export function renderDisplay() {
  renderer.render(scene, camera);
}