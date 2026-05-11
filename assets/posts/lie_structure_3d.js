// Lie 이론의 구조 — 통합 3D 애니메이션 (섹션 5.2)
// PDF 의 8 가지 용어를 모두 시각화 + R 자동 회전
(function () {
  const container = document.getElementById("lie-structure-3d");
  if (!container) return;
  if (typeof THREE === "undefined") {
    container.textContent = "Three.js 로딩 실패";
    return;
  }

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "style") e.setAttribute("style", attrs[k]);
      else if (k in e) e[k] = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (children) for (const c of children) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return e;
  }

  // === UI ===
  function makeSlider(val) {
    return el("input", { type: "range", min: -150, max: 150, value: val, step: 1, style: "width:100px;" });
  }
  const wxSlider = makeSlider(40);
  const wySlider = makeSlider(0);
  const wzSlider = makeSlider(60);
  function lbl(color) { return el("span", { style: "color:" + color + "; font-weight:600; min-width:38px; display:inline-block; text-align:right; font-size:11px;" }); }
  const wxLbl = lbl("#bf360c");
  const wyLbl = lbl("#bf360c");
  const wzLbl = lbl("#bf360c");

  const autoBtn = el("button", { style: "padding:6px 14px; font-size:13px;" }, ["▶ 자동 회전"]);

  const controls = el("div", {
    style: "display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-bottom:8px; font-family:system-ui,sans-serif; font-size:12px;",
  }, [
    el("span", { style: "color:#bf360c; font-weight:700;" }, ["ω:"]),
    el("label", null, ["x ", wxSlider, wxLbl]),
    el("label", null, ["y ", wySlider, wyLbl]),
    el("label", null, ["z ", wzSlider, wzLbl]),
    autoBtn,
    el("span", { style: "color:#666;" }, ["| 마우스 드래그/휠 = 카메라"]),
  ]);

  const canvas = el("div", { style: "width:100%; height:480px; background:#fafbfc; border-radius:6px; cursor:grab;" });

  // 범례 (DOM API only)
  function lgTag(text, color) {
    const b = el("b", { style: "color:" + color + ";" }, [text]);
    return b;
  }
  const legend = el("div", { style: "font-size:12px; color:#444; margin-top:8px; line-height:1.7;" });
  legend.appendChild(lgTag("파란 sphere", "#1565c0"));
  legend.appendChild(document.createTextNode(" = Lie group (manifold) | "));
  legend.appendChild(lgTag("검은 점 I", "#222"));
  legend.appendChild(document.createTextNode(" = identity | "));
  legend.appendChild(lgTag("초록 점 R", "#43a047"));
  legend.appendChild(document.createTextNode(" = group element (회전) | "));
  legend.appendChild(lgTag("주황 평면", "#e65100"));
  legend.appendChild(document.createTextNode(" = Lie algebra (tangent space at I) | "));
  legend.appendChild(lgTag("빨간 화살표", "#bf360c"));
  legend.appendChild(document.createTextNode(" = tangent vector ω | "));
  legend.appendChild(lgTag("진한 보라 호", "#9c27b0"));
  legend.appendChild(document.createTextNode(" = geodesic (I→R) | "));
  legend.appendChild(lgTag("옅은 보라 원", "#ce93d8"));
  legend.appendChild(document.createTextNode(" = great circle (회전 평면) | "));
  legend.appendChild(lgTag("빨강 직선", "#ef5350"));
  legend.appendChild(document.createTextNode(" = 회전축 (sphere 가로지름) | "));
  legend.appendChild(lgTag("exp", "#ff9800"));
  legend.appendChild(document.createTextNode(" 평면→곡면, "));
  legend.appendChild(lgTag("log", "#3f51b5"));
  legend.appendChild(document.createTextNode(" 곡면→평면"));

  container.appendChild(controls);
  container.appendChild(canvas);
  container.appendChild(legend);

  // === Three.js ===
  const W = canvas.clientWidth;
  const H = 480;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafbfc);

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  let camR = 5, camTheta = Math.PI / 4, camPhi = Math.PI / 2.5;  // 약간 위에서
  const lookTarget = new THREE.Vector3(0, 0.5, 0);  // 시점 중앙 = sphere 중간 + I 사이
  function updateCamera() {
    camera.position.set(
      lookTarget.x + camR * Math.sin(camPhi) * Math.cos(camTheta),
      lookTarget.y + camR * Math.cos(camPhi),
      lookTarget.z + camR * Math.sin(camPhi) * Math.sin(camTheta)
    );
    camera.lookAt(lookTarget);
  }
  updateCamera();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvas.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(5, 10, 5);
  scene.add(light);

  scene.add(new THREE.AxesHelper(1.4));

  function addLabel(text, pos, color, scale, fontSize) {
    const cv = document.createElement("canvas");
    cv.width = 256; cv.height = 64;
    const ctx = cv.getContext("2d");
    ctx.font = "bold " + (fontSize || 28) + "px system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 32);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp = new THREE.Sprite(mat);
    sp.position.set(pos.x, pos.y, pos.z);
    sp.scale.set((scale || 0.6), (scale || 0.6) * 0.25, 1);
    scene.add(sp);
    return sp;
  }

  addLabel("X", { x: 1.55, y: 0, z: 0 }, "#e53935", 0.22, 36);
  addLabel("Y", { x: 0, y: 1.55, z: 0 }, "#43a047", 0.22, 36);
  addLabel("Z", { x: 0, y: 0, z: 1.55 }, "#1e88e5", 0.22, 36);

  // Sphere
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 32),
    new THREE.MeshLambertMaterial({ color: 0x1565c0, transparent: true, opacity: 0.15 })
  ));

  const wireMat = new THREE.LineBasicMaterial({ color: 0x1565c0, transparent: true, opacity: 0.35 });
  for (let lat = -75; lat <= 75; lat += 15) {
    const r = Math.cos(lat * Math.PI / 180);
    const y = Math.sin(lat * Math.PI / 180);
    const pts = [];
    for (let lon = 0; lon <= 360; lon += 6) {
      const a = lon * Math.PI / 180;
      pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
  }
  for (let lon = 0; lon < 360; lon += 30) {
    const a = lon * Math.PI / 180;
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 6) {
      const r = Math.cos(lat * Math.PI / 180);
      const y = Math.sin(lat * Math.PI / 180);
      pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
  }

  // I (identity)
  const I_POS = new THREE.Vector3(0, 1, 0);
  const iMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0x222 })
  );
  iMesh.position.copy(I_POS);
  scene.add(iMesh);
  addLabel("I (identity)", { x: 0, y: 1.18, z: 0 }, "#222", 0.45, 22);

  // Tangent plane (Lie algebra)
  const planeGeom = new THREE.PlaneGeometry(1.6, 1.6);
  const plane = new THREE.Mesh(planeGeom, new THREE.MeshLambertMaterial({
    color: 0xff9800, transparent: true, opacity: 0.30, side: THREE.DoubleSide,
  }));
  plane.position.copy(I_POS);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);
  const planeWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(planeGeom),
    new THREE.LineBasicMaterial({ color: 0xe65100, transparent: true, opacity: 0.6 })
  );
  planeWire.position.copy(I_POS);
  planeWire.rotation.x = Math.PI / 2;
  scene.add(planeWire);

  addLabel("so(3) — Lie algebra", { x: 0.95, y: 1.05, z: 0.95 }, "#e65100", 0.55, 20);

  // R (group element)
  const rMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0x43a047 })
  );
  scene.add(rMesh);
  const rLabel = addLabel("R", { x: 0, y: 0, z: 0 }, "#43a047", 0.18, 28);

  // Tangent vector arrow
  const tangentArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0), I_POS, 0.4, 0xbf360c, 0.13, 0.08
  );
  scene.add(tangentArrow);
  const omegaLabel = addLabel("ω", { x: 0, y: 0, z: 0 }, "#bf360c", 0.15, 28);

  // Geodesic — I→R 진한 호 (보라)
  let geodesicArc = null;
  const geodesicMat = new THREE.LineBasicMaterial({ color: 0x9c27b0, linewidth: 3 });

  // Full great circle — 회전 평면 표시 (옅은 보라)
  let greatCircle = null;
  const greatCircleMat = new THREE.LineBasicMaterial({ color: 0xce93d8, transparent: true, opacity: 0.7 });

  // Rotation axis — sphere 가로지르는 직선 (옅은 빨강)
  let axisLine = null;
  const axisMat = new THREE.LineBasicMaterial({ color: 0xef5350, linewidth: 2 });

  function updateGeodesicAndAxis(R, omega) {
    // 정리
    if (geodesicArc) { scene.remove(geodesicArc); geodesicArc.geometry.dispose(); geodesicArc = null; }
    if (greatCircle) { scene.remove(greatCircle); greatCircle.geometry.dispose(); greatCircle = null; }
    if (axisLine) { scene.remove(axisLine); axisLine.geometry.dispose(); axisLine = null; }

    const theta = omega.length();
    if (theta < 0.001) return;

    const axisDir = omega.clone().normalize();  // n̂ = ω/|ω|

    // 1. Axis line — sphere 양 끝 가로지름 (-axisDir 부터 +axisDir 까지)
    const axisExt = 1.3;  // 살짝 sphere 밖으로
    axisLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        axisDir.clone().multiplyScalar(-axisExt),
        axisDir.clone().multiplyScalar(axisExt),
      ]),
      axisMat
    );
    scene.add(axisLine);

    // 2. Great circle — axis 에 수직인 평면 위 원
    // axis 에 수직인 두 단위 벡터 찾기 (e1, e2)
    const I_v = new THREE.Vector3(0, 1, 0);
    let e1 = I_v.clone().sub(axisDir.clone().multiplyScalar(axisDir.dot(I_v))).normalize();
    if (e1.length() < 0.1) e1 = new THREE.Vector3(1, 0, 0).sub(axisDir.clone().multiplyScalar(axisDir.dot(new THREE.Vector3(1, 0, 0)))).normalize();
    const e2 = axisDir.clone().cross(e1).normalize();

    const circlePts = [];
    const STEPS = 64;
    for (let s = 0; s <= STEPS; s++) {
      const a = (s / STEPS) * Math.PI * 2;
      circlePts.push(e1.clone().multiplyScalar(Math.cos(a)).add(e2.clone().multiplyScalar(Math.sin(a))));
    }
    greatCircle = new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePts), greatCircleMat);
    scene.add(greatCircle);

    // 3. Geodesic arc — I 에서 R 까지 호 (진한 보라)
    const arcPts = [];
    const ARC_STEPS = 50;
    for (let s = 0; s <= ARC_STEPS; s++) {
      const t = s / ARC_STEPS;
      const angle = t * theta;
      const cos_a = Math.cos(angle), sin_a = Math.sin(angle);
      const rot = I_POS.clone().multiplyScalar(cos_a)
        .add(axisDir.clone().cross(I_POS).multiplyScalar(sin_a))
        .add(axisDir.clone().multiplyScalar(axisDir.dot(I_POS) * (1 - cos_a)));
      arcPts.push(rot);
    }
    geodesicArc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), geodesicMat);
    scene.add(geodesicArc);
  }

  // exp / log labels
  const expLabel = addLabel("exp →", { x: 0, y: 0, z: 0 }, "#ff9800", 0.3, 22);
  const logLabel = addLabel("← log", { x: 0, y: 0, z: 0 }, "#3f51b5", 0.3, 22);

  // === Animation / Slider ===
  let auto = false;
  let t = 0;

  autoBtn.addEventListener("click", () => {
    auto = !auto;
    autoBtn.textContent = auto ? "⏸ 정지 (수동)" : "▶ 자동 회전";
  });
  [wxSlider, wySlider, wzSlider].forEach(s => s.addEventListener("input", () => {}));

  // Rodrigues — R = exp(ω) · I_POS
  function rotateByOmega(omega, v) {
    const theta = omega.length();
    if (theta < 1e-9) return v.clone();
    const k = omega.clone().multiplyScalar(1 / theta);
    const cos_t = Math.cos(theta), sin_t = Math.sin(theta);
    return v.clone().multiplyScalar(cos_t)
      .add(new THREE.Vector3().crossVectors(k, v).multiplyScalar(sin_t))
      .add(k.clone().multiplyScalar(k.dot(v) * (1 - cos_t)));
  }

  function update() {
    let w;
    if (auto) {
      // 자동: ω 가 부드럽게 변화
      t += 0.01 * 0.6;
      const wx = Math.sin(t * 0.8) * Math.PI * 0.4;
      const wy = Math.cos(t * 0.5) * Math.PI * 0.3;
      const wz = Math.sin(t * 1.1 + 1) * Math.PI * 0.4;
      w = new THREE.Vector3(wx, wy, wz);
      // 슬라이더에도 반영 (degree)
      wxSlider.value = Math.round(wx * 180 / Math.PI);
      wySlider.value = Math.round(wy * 180 / Math.PI);
      wzSlider.value = Math.round(wz * 180 / Math.PI);
    } else {
      w = new THREE.Vector3(
        parseFloat(wxSlider.value) * Math.PI / 180,
        parseFloat(wySlider.value) * Math.PI / 180,
        parseFloat(wzSlider.value) * Math.PI / 180
      );
    }

    // |ω| > π 면 정규화 (axis-angle 표준 범위)
    if (w.length() > Math.PI - 0.05) {
      w.normalize().multiplyScalar(Math.PI - 0.05);
    }

    wxLbl.textContent = wxSlider.value + "°";
    wyLbl.textContent = wySlider.value + "°";
    wzLbl.textContent = wzSlider.value + "°";

    // R = exp(ω) · I
    const R = rotateByOmega(w, I_POS);
    rMesh.position.copy(R);
    rLabel.position.copy(R.clone().multiplyScalar(1.18));

    // tangent vector (geodesic 방향)
    const cosTheta = Math.max(-1, Math.min(1, I_POS.dot(R)));
    const theta = Math.acos(cosTheta);
    if (theta > 1e-6) {
      const proj = R.clone().sub(I_POS.clone().multiplyScalar(cosTheta));
      proj.normalize();
      tangentArrow.position.copy(I_POS);
      tangentArrow.setDirection(proj);
      tangentArrow.setLength(Math.max(0.05, theta * 0.8), 0.13, 0.08);
      tangentArrow.visible = true;
      const arrowEnd = I_POS.clone().add(proj.clone().multiplyScalar(theta * 0.8 + 0.12));
      omegaLabel.position.copy(arrowEnd);
      omegaLabel.visible = true;
    } else {
      tangentArrow.visible = false;
      omegaLabel.visible = false;
    }

    // Great circle + axis line + geodesic arc
    updateGeodesicAndAxis(R, w);

    // exp / log 라벨
    if (theta > 0.3) {
      const axisDir = w.clone().normalize();
      const halfAngle = theta * 0.5;
      const cos_a = Math.cos(halfAngle), sin_a = Math.sin(halfAngle);
      const midPoint = I_POS.clone().multiplyScalar(cos_a)
        .add(axisDir.clone().cross(I_POS).multiplyScalar(sin_a))
        .add(axisDir.clone().multiplyScalar(axisDir.dot(I_POS) * (1 - cos_a)));
      const outward = midPoint.clone().multiplyScalar(1.20);
      expLabel.position.copy(outward);
      logLabel.position.copy(outward.clone().add(new THREE.Vector3(0, 0.12, 0)));
      expLabel.visible = true;
      logLabel.visible = true;
    } else {
      expLabel.visible = false;
      logLabel.visible = false;
    }
  }

  let isDragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener("mousedown", (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = "grabbing"; });
  window.addEventListener("mouseup", () => { isDragging = false; canvas.style.cursor = "grab"; });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    camTheta -= dx * 0.01;
    camPhi -= dy * 0.01;
    camPhi = Math.max(0.1, Math.min(Math.PI - 0.1, camPhi));
    updateCamera();
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    camR *= e.deltaY > 0 ? 1.1 : 0.9;
    camR = Math.max(2, Math.min(15, camR));
    updateCamera();
  }, { passive: false });

  function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const newW = canvas.clientWidth;
    camera.aspect = newW / H;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, H);
  });
})();
