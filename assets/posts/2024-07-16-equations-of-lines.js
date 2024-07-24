import * as THREE from '/assets/three/three.module.js';
import { Grid2DHelper } from '/assets/three/grid2d.helper.js';

var helper;

//init();

export function init() {
  helper = new Grid2DHelper(document.getElementById("canvas"));

  const a = new THREE.Vector3(0, 0.2, 1);
  const b = new THREE.Vector3(1, 0, 0);

  a.normalize();
  b.normalize();

  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  const c = new THREE.Vector3(x, y, z);

  //const lineA = helper.drawArrowLine(a, 0xff0000);
  //const lineB = helper.drawArrowLine(b, 0x0000ff);
  //const lineC = helper.drawArrowLine(c, 0x00ff00);

  //const plane = helper.drawPlane(2, 2);

}

// animation
export function animate() {
  requestAnimationFrame(animate);

  helper.update();
}
