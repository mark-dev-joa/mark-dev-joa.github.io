import * as THREE from '/assets/three/three.module.js';
import { GridSceneHelper } from '/assets/three/starter.js';

var helper;

init();
animate();

function init() {
  helper = new GridSceneHelper(document.getElementById("canvas"));

  const a = new THREE.Vector3(0, 0.2, 1);
  const b = new THREE.Vector3(1, 0, 0);

  a.normalize();
  a.multiplyScalar(2);
  b.normalize();

  //a.sca

  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  const c = new THREE.Vector3(x, y, z);
  //c.multiplyScalar(2);
  console.log(c);


  const lineA = helper.drawArrowLine(a, 0xff0000);
  const lineB = helper.drawArrowLine(b, 0x0000ff);
  const lineC = helper.drawArrowLine(c, 0x00ff00);

  const plane = helper.drawPlane(2, 2);


}

// animation
function animate() {
  requestAnimationFrame(animate);

  helper.update();
}

function _Triangularation(origin1, r, origin2, s) {
  const a11 = r.clone().dot(r.clone());
  const a12 = -s.clone().dot(r.clone());
  const a21 = r.clone().dot(s.clone());
  const a22 = -s.clone().dot(s.clone());

  const invD = 1 / (a11 * a22 - a12 * a21);
  const invA11 = a22 * invD;
  const invA12 = -a12 * invD;
  const invA21 = -a21 * invD;
  const invA22 = a11 * invD;

  const diff = origin2.clone().sub(origin1.clone());
  const ro = r.clone().dot(diff);
  const so = s.clone().dot(diff);

  const lambda = invA11 * ro + invA12 * so;
  const mu = invA21 * ro + invA22 * so;

  const f = origin1.clone().add(r.multiplyScalar(lambda))
  const g = origin2.clone().add(s.multiplyScalar(mu));
  const h = f.add(g);
  h.divideScalar(2);

  return h;
}
