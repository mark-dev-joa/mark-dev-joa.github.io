import * as THREE from '/assets/three/three.module.js';
import { GridSceneHelper } from '/assets/three/starter.js';

var helper;

init();
animate();

function init() {
  helper = new GridSceneHelper(document.getElementById("canvas"));

  const a = new THREE.Vector3(0, 1, 0);
  const b = new THREE.Vector3(1, 0, 0);

  a.normalize();
  b.normalize();

  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  //const c = new THREE.Vector3(x, y, z);

  const lineA = helper.drawArrowLine(a, 0xff0000);
  const lineB = helper.drawArrowLine(b, 0x0000ff);
  //const lineC = helper.drawArrowLine(c, 0x00ff00);

  //const loop = Math.random() % 10;
  for (let i = 0; i < 100; ++i) {
    const xx = (Math.random() - 0.5) * 4;
    const yy = (Math.random() - 0.5) * 4;
    const r = a.multiplyScalar(xx).add(b.multiplyScalar(yy));
    helper.drawArrowLine(r, 0xff00ff);
  }


}

// animation
function animate() {
  requestAnimationFrame(animate);

  helper.update();
}
