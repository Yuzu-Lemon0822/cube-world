// ===== 設定 =====
export let CHUNK_SIZE = 16;
export const THRESHOLD = 0.35;
export const seed = 1923098019


function Hash(x, y, z) {
  let h = x * 374761393 + y * 668265263 + z * 2147483647 + seed;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function lerp(t) {
  return t * t * (3 - 2 * t);
}

function vn3(x, y, z) {
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const cz = Math.floor(z);

  const fx = x - cx;
  const fy = y - cy;
  const fz = z - cz;

  const w000 = Hash(cx, cy, cz);
  const w001 = Hash(cx, cy, cz + 1);
  const w010 = Hash(cx, cy + 1, cz);
  const w011 = Hash(cx, cy + 1, cz + 1);
  const w100 = Hash(cx + 1, cy, cz);
  const w101 = Hash(cx + 1, cy, cz + 1);
  const w110 = Hash(cx + 1, cy + 1, cz);
  const w111 = Hash(cx + 1, cy + 1, cz + 1);

  const ux = lerp(fx)
  const uy = lerp(fy)
  const uz = lerp(fz)

  const w00 = w000 + (w001 - w000) * uz;
  const w01 = w010 + (w011 - w010) * uz;
  const w10 = w100 + (w101 - w100) * uz;
  const w11 = w110 + (w111 - w110) * uz;

  const w0 = w00 + (w01 - w00) * uy;
  const w1 = w10 + (w11 - w10) * uy;

  return w0 + (w1 - w0) * ux;
}

function noise(x, y, z, octave = 4) {
  let k = 2; //k=1だとギザギザになるので2から始める。
  let value = 0;
  for (let i = 0; i < octave; i++) {
    value += vn3(x/k, y/k, z/k) * k
    k *= 2
  }
  return value / (k-1) //正規化
}

function density(x, y, z) {
  return noise(x, y, z);
}

function isSolid(x, y, z) {
  return density(x, y, z) >= THRESHOLD;
}

function getFaceVertices(x, y, z, dx, dy, dz) {

  const px = x;
  const py = y;
  const pz = z;

  if (dx === 1) return [
    [px+1, py,   pz  ],
    [px+1, py+1, pz  ],
    [px+1, py+1, pz+1],
    [px+1, py,   pz+1],
  ];

  if (dx === -1) return [
    [px, py,   pz+1],
    [px, py+1, pz+1],
    [px, py+1, pz  ],
    [px, py,   pz  ],
  ];

  if (dy === 1) return [
    [px,   py+1, pz  ],
    [px+1, py+1, pz  ],
    [px+1, py+1, pz+1],
    [px,   py+1, pz+1],
  ];

  if (dy === -1) return [
    [px,   py, pz+1],
    [px+1, py, pz+1],
    [px+1, py, pz  ],
    [px,   py, pz  ],
  ];

  if (dz === 1) return [
    [px,   py,   pz+1],
    [px+1, py,   pz+1],
    [px+1, py+1, pz+1],
    [px,   py+1, pz+1],
  ];

  if (dz === -1) return [
    [px,   py+1, pz],
    [px+1, py+1, pz],
    [px+1, py,   pz],
    [px,   py,   pz],
  ];
}

// ===== チャンク生成 =====
export function generateChunk(cx, cy, cz) {

  const vertices = [];
  const normals = [];
  const indices = [];

  let indexOffset = 0;

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {

        const wx = cx * CHUNK_SIZE + x;
        const wy = cy * CHUNK_SIZE + y;
        const wz = cz * CHUNK_SIZE + z;

        if (!isSolid(wx, wy, wz)) continue;

        // 6方向チェック
        const dirs = [
          [ 1, 0, 0],
          [-1, 0, 0],
          [ 0, 1, 0],
          [ 0,-1, 0],
          [ 0, 0, 1],
          [ 0, 0,-1],
        ];

        for (const [dx, dy, dz] of dirs) {

          if (isSolid(wx + dx, wy + dy, wz + dz)) continue;

          // 面生成
          const face = getFaceVertices(x, y, z, dx, dy, dz);

          for (let i = 0; i < 4; i++) {
            vertices.push(
              face[i][0],
              face[i][1],
              face[i][2]
            );
            normals.push(dx, dy, dz);
          }

          indices.push(
            indexOffset,
            indexOffset + 1,
            indexOffset + 2,
            indexOffset,
            indexOffset + 2,
            indexOffset + 3
          );

          indexOffset += 4;
        }
      }
    }
  }

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    indices: new Uint32Array(indices)
  };
}