// Lie Algebra 산술 3D 데모
// SO(3) 두 점 R1, R2 → log → so(3) 두 벡터 ω1, ω2
// 평면에서 ω1 ± ω2 = ω_r (산술 가능)
// → exp → SO(3) 새 점 R_r
// 모두 동시에 시각화
(function () {
  const container = document.getElementById("lie-algebra-arithmetic-3d");
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

  // === UI === ω 좌표 (도 단위, -150 ~ 150)
  function makeSlider(val) {
    return el("input", { type: "range", min: -150, max: 150, value: val, step: 1, style: "width:90px;" });
  }
  // R₁: 기본값 ω₁ = (40°, 0°, 40°)
  const w1xSlider = makeSlider(40);
  const w1ySlider = makeSlider(0);
  const w1zSlider = makeSlider(40);
  // R₂: 기본값 ω₂ = (-30°, 0°, 60°)
  const w2xSlider = makeSlider(-30);
  const w2ySlider = makeSlider(0);
  const w2zSlider = makeSlider(60);

  const opSelect = el("select");
  opSelect.appendChild(Object.assign(document.createElement("option"), { value: "add", text: "ω₁ + ω₂" }));
  opSelect.appendChild(Object.assign(document.createElement("option"), { value: "sub", text: "ω₁ − ω₂" }));

  function lbl(color) {
    return el("span", { style: "color:" + color + "; font-weight:600; min-width:38px; display:inline-block; text-align:right; font-size:11px;" });
  }
  const w1xLbl = lbl("#1565c0");
  const w1yLbl = lbl("#1565c0");
  const w1zLbl = lbl("#1565c0");
  const w2xLbl = lbl("#43a047");
  const w2yLbl = lbl("#43a047");
  const w2zLbl = lbl("#43a047");

  const row1 = el("div", { style: "display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:6px; font-family:system-ui,sans-serif; font-size:12px;" }, [
    el("span", { style: "color:#1565c0; font-weight:700; min-width:32px;" }, ["ω₁:"]),
    el("label", null, ["x ", w1xSlider, w1xLbl]),
    el("label", null, ["y ", w1ySlider, w1yLbl]),
    el("label", null, ["z ", w1zSlider, w1zLbl]),
  ]);
  const row2 = el("div", { style: "display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:6px; font-family:system-ui,sans-serif; font-size:12px;" }, [
    el("span", { style: "color:#43a047; font-weight:700; min-width:32px;" }, ["ω₂:"]),
    el("label", null, ["x ", w2xSlider, w2xLbl]),
    el("label", null, ["y ", w2ySlider, w2yLbl]),
    el("label", null, ["z ", w2zSlider, w2zLbl]),
  ]);
  const row3 = el("div", { style: "display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-bottom:8px; font-family:system-ui,sans-serif; font-size:13px;" }, [
    el("label", null, ["연산: ", opSelect]),
    el("span", { style: "color:#9c27b0; font-weight:700;" }, ["→ R_result (보라)"]),
  ]);

  const canvas = el("div", { style: "width:100%; height:460px; background:#fafbfc; border-radius:6px; cursor:grab;" });

  const info = el("div", { style: "font-family:system-ui,sans-serif; font-size:12px; line-height:1.6; margin-top:6px; padding:8px 10px; background:#fff; border:1px solid #e0e6eb; border-radius:6px; color:#222;" });

  const legend = el("div", { style: "font-size:12px; color:#555; margin-top:4px; line-height:1.5;" });
  legend.appendChild(el("b", { style: "color:#222;" }, ["검은 점 I"]));
  legend.appendChild(document.createTextNode(" | "));
  legend.appendChild(el("b", { style: "color:#1565c0;" }, ["파랑 R₁"]));
  legend.appendChild(document.createTextNode(" | "));
  legend.appendChild(el("b", { style: "color:#43a047;" }, ["초록 R₂"]));
  legend.appendChild(document.createTextNode(" | "));
  legend.appendChild(el("b", { style: "color:#9c27b0;" }, ["보라 R_r = exp(ω₁ ± ω₂)"]));
  legend.appendChild(document.createTextNode(" | 주황 평면 = so(3) | "));
  legend.appendChild(el("b", null, ["실선 화살표"]));
  legend.appendChild(document.createTextNode(" = geodesic (R 가는 방향) | "));
  legend.appendChild(el("b", null, ["점선 화살표"]));
  legend.appendChild(document.createTextNode(" = 진짜 axis-angle ω (회전축, geodesic 과 90° 수직). 마우스 드래그/휠 = 카메라."));

  container.appendChild(row1);
  container.appendChild(row2);
  container.appendChild(row3);
  container.appendChild(canvas);
  container.appendChild(info);
  container.appendChild(legend);

  // === Three.js ===
  const W = canvas.clientWidth;
  const H = 460;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafbfc);

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  let camR = 5, camTheta = Math.PI / 4, camPhi = Math.PI / 3;
  function updateCamera() {
    camera.position.set(
      camR * Math.sin(camPhi) * Math.cos(camTheta),
      camR * Math.cos(camPhi),
      camR * Math.sin(camPhi) * Math.sin(camTheta)
    );
    camera.lookAt(0, 0, 0);
  }
  updateCamera();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvas.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(5, 10, 5);
  scene.add(light);

  // 좌표축 (작게) + 라벨
  scene.add(new THREE.AxesHelper(1.4));

  // 라벨 sprite
  function addLabel(text, pos, color, scale) {
    const cv = document.createElement("canvas");
    cv.width = 96; cv.height = 64;
    const ctx = cv.getContext("2d");
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 48, 32);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp = new THREE.Sprite(mat);
    sp.position.set(pos.x, pos.y, pos.z);
    sp.scale.set(scale || 0.3, (scale || 0.3) * 0.6667, 1);
    scene.add(sp);
    return sp;
  }

  // 구
  const sphereGeom = new THREE.SphereGeometry(1, 48, 32);
  const sphereMat = new THREE.MeshLambertMaterial({
    color: 0x1565c0, transparent: true, opacity: 0.13,
  });
  scene.add(new THREE.Mesh(sphereGeom, sphereMat));

  // 격자
  const wireMat = new THREE.LineBasicMaterial({ color: 0x1565c0, transparent: true, opacity: 0.3 });
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

  // I (북극)
  const I_POS = new THREE.Vector3(0, 1, 0);
  const iMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0x222 })
  );
  iMesh.position.copy(I_POS);
  scene.add(iMesh);
  addLabel("I", { x: 0, y: 1.2, z: 0 }, "#222", 0.25);

  // X, Y, Z 축 라벨
  addLabel("X", { x: 1.55, y: 0, z: 0 }, "#e53935", 0.22);
  addLabel("Y", { x: 0, y: 1.55, z: 0 }, "#43a047", 0.22);
  addLabel("Z", { x: 0, y: 0, z: 1.55 }, "#1e88e5", 0.22);

  // Tangent plane at I
  const planeGeom = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.Mesh(planeGeom, new THREE.MeshLambertMaterial({
    color: 0xff9800, transparent: true, opacity: 0.25, side: THREE.DoubleSide,
  }));
  plane.position.copy(I_POS);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);
  scene.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(planeGeom),
    new THREE.LineBasicMaterial({ color: 0xe65100 })
  ).translateY(1).rotateX(Math.PI / 2));

  // R 점들
  function makePoint(color) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshLambertMaterial({ color })
    );
    scene.add(m);
    return m;
  }
  const r1Mesh = makePoint(0x1565c0); // 파랑
  const r2Mesh = makePoint(0x43a047); // 초록
  const rrMesh = makePoint(0x9c27b0); // 보라

  const r1Lbl = addLabel("R₁", { x: 0, y: 0, z: 0 }, "#1565c0", 0.2);
  const r2Lbl = addLabel("R₂", { x: 0, y: 0, z: 0 }, "#43a047", 0.2);
  const rrLbl = addLabel("Rr", { x: 0, y: 0, z: 0 }, "#9c27b0", 0.2);

  // 화살표 (so(3) 벡터들)
  const omega1Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), I_POS, 0.5, 0x1565c0, 0.13, 0.08);
  const omega2Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), I_POS, 0.5, 0x43a047, 0.13, 0.08);
  const omegaRArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), I_POS, 0.5, 0x9c27b0, 0.16, 0.10);
  scene.add(omega1Arrow);
  scene.add(omega2Arrow);
  scene.add(omegaRArrow);

  // 평행이동된 ω2 (ω1 의 끝 → ω_r 의 끝) — 평행사변형 시각화
  const translatedArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), I_POS, 0.5, 0x43a047, 0.10, 0.06);
  scene.add(translatedArrow);

  // === 진짜 axis-angle 화살표 (회전축 자체) — 점선 ===
  function makeDashedAxisArrow(color) {
    // 점선 라인
    const lineMat = new THREE.LineDashedMaterial({
      color, linewidth: 2, dashSize: 0.06, gapSize: 0.04, transparent: true, opacity: 0.95
    });
    const lineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)
    ]);
    const line = new THREE.Line(lineGeom, lineMat);
    line.computeLineDistances();

    // 작은 head (cone)
    const headGeom = new THREE.ConeGeometry(0.04, 0.10, 12);
    const headMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const head = new THREE.Mesh(headGeom, headMat);

    const group = new THREE.Group();
    group.add(line);
    group.add(head);
    group._line = line;
    group._head = head;
    scene.add(group);

    group.update = function (origin, dir, length) {
      // 위치
      this.position.copy(origin);
      // line 회전 — local x축 방향이 dir 가도록 정렬
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
      this.quaternion.copy(q);
      // line 길이 (scale x)
      const lineLen = Math.max(0.001, length - 0.10);
      this._line.scale.set(lineLen, 1, 1);
      this._line.computeLineDistances();
      // head 위치 (line 끝)
      this._head.position.set(lineLen, 0, 0);
      this._head.rotation.set(0, 0, -Math.PI / 2); // cone 의 기본 axis = +y → +x 로 변환
    };

    return group;
  }
  const axisArrow1 = makeDashedAxisArrow(0x1565c0); // 파랑 (점선)
  const axisArrow2 = makeDashedAxisArrow(0x43a047); // 초록 (점선)
  const axisArrowR = makeDashedAxisArrow(0x9c27b0); // 보라 (점선)

  // Geodesic 라인 3개
  const geoMat1 = new THREE.LineBasicMaterial({ color: 0x1565c0 });
  const geoMat2 = new THREE.LineBasicMaterial({ color: 0x43a047 });
  const geoMatR = new THREE.LineBasicMaterial({ color: 0x9c27b0, linewidth: 2 });
  let geoLine1 = null, geoLine2 = null, geoLineR = null;

  function makeGeodesic(R, theta, mat) {
    if (theta < 0.001) return null;
    const I_v = I_POS.clone();
    const N = I_v.clone().cross(R).normalize();
    const pts = [];
    const STEPS = 40;
    for (let s = 0; s <= STEPS; s++) {
      const t = s / STEPS;
      const angle = t * theta;
      const cos_a = Math.cos(angle), sin_a = Math.sin(angle);
      const rot = I_v.clone().multiplyScalar(cos_a)
        .add(N.clone().cross(I_v).multiplyScalar(sin_a))
        .add(N.clone().multiplyScalar(N.dot(I_v) * (1 - cos_a)));
      pts.push(rot);
    }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
  }

  // === log/exp 헬퍼 ===
  // log map (S² 비유): R 점 → I 의 tangent vector (방향 = projection, 크기 = arc length)
  function logMap(R) {
    const cosTheta = Math.max(-1, Math.min(1, I_POS.dot(R)));
    const theta = Math.acos(cosTheta);
    if (theta < 1e-6) return new THREE.Vector3(0, 0, 0);
    const proj = R.clone().sub(I_POS.clone().multiplyScalar(cosTheta));
    proj.normalize();
    return proj.multiplyScalar(theta);
  }

  // exp map: tangent vector ω → SO(3) 점 R
  function expMap(omega) {
    const theta = omega.length();
    if (theta < 1e-6) return I_POS.clone();
    const dir = omega.clone().normalize();
    // I_POS 를 dir 방향으로 theta 만큼 great circle 따라
    // I_POS 가 (0,1,0) 이고 dir 이 평면 (y=1) 위에 있다면
    // 결과 = cos(theta) · I_POS + sin(theta) · dir
    return I_POS.clone().multiplyScalar(Math.cos(theta))
      .add(dir.multiplyScalar(Math.sin(theta)));
  }

  // === ω (도 단위 벡터) → so(3) Vector3 (라디안) ===
  function omegaFromSliders(sx, sy, sz) {
    return new THREE.Vector3(
      parseFloat(sx.value) * Math.PI / 180,
      parseFloat(sy.value) * Math.PI / 180,
      parseFloat(sz.value) * Math.PI / 180
    );
  }

  // Rodrigues' formula 로 R · v 계산 (R = exp(omega))
  // v_rot = v cos θ + (k × v) sin θ + k (k·v)(1 - cos θ)
  function rotateByOmega(omega, v) {
    const theta = omega.length();
    if (theta < 1e-9) return v.clone();
    const k = omega.clone().multiplyScalar(1 / theta);
    const cos_t = Math.cos(theta), sin_t = Math.sin(theta);
    const term1 = v.clone().multiplyScalar(cos_t);
    const term2 = new THREE.Vector3().crossVectors(k, v).multiplyScalar(sin_t);
    const term3 = k.clone().multiplyScalar(k.dot(v) * (1 - cos_t));
    return term1.add(term2).add(term3);
  }

  // === Update ===
  function update() {
    // 슬라이더 → ω (so(3) 벡터, 라디안)
    // |ω| > π 면 같은 회전을 더 짧게 표현 가능 → π 로 clamp
    function clampOmega(omega) {
      const mag = omega.length();
      if (mag > Math.PI) {
        omega.normalize().multiplyScalar(Math.PI);
      }
      return omega;
    }
    const w1 = clampOmega(omegaFromSliders(w1xSlider, w1ySlider, w1zSlider));
    const w2 = clampOmega(omegaFromSliders(w2xSlider, w2ySlider, w2zSlider));

    w1xLbl.textContent = w1xSlider.value + "°";
    w1yLbl.textContent = w1ySlider.value + "°";
    w1zLbl.textContent = w1zSlider.value + "°";
    w2xLbl.textContent = w2xSlider.value + "°";
    w2yLbl.textContent = w2ySlider.value + "°";
    w2zLbl.textContent = w2zSlider.value + "°";

    // R · I = exp(ω) · I 로 sphere 점 계산
    const R1 = rotateByOmega(w1, I_POS);
    const R2 = rotateByOmega(w2, I_POS);

    // ω_r = ω1 + ω2 또는 ω1 - ω2
    const wR = (opSelect.value === "add") ? w1.clone().add(w2) : w1.clone().sub(w2);
    // 그러나 |wR| > π 면 곡면 한바퀴 넘어감 → clamp
    if (wR.length() > Math.PI - 0.05) {
      wR.normalize().multiplyScalar(Math.PI - 0.05);
    }
    const Rr = rotateByOmega(wR, I_POS);

    // === 시각화용 geodesic tangent ===
    // 화살표가 ω 방향이면 "회전축" 이라 sphere 움직임과 90° 차이로 헷갈림
    // → 화살표는 sphere 점 방향을 가리키도록 (geodesic 의 initial velocity)
    function geodesicTangent(R) {
      const cosTheta = Math.max(-1, Math.min(1, I_POS.dot(R)));
      const theta = Math.acos(cosTheta);
      if (theta < 1e-6) return new THREE.Vector3(0, 0, 0);
      const proj = R.clone().sub(I_POS.clone().multiplyScalar(cosTheta));
      if (proj.length() < 1e-6) return new THREE.Vector3(0, 0, 0);
      return proj.normalize().multiplyScalar(theta);
    }
    const t1 = geodesicTangent(R1);
    const t2 = geodesicTangent(R2);
    const tR = geodesicTangent(Rr);

    // 점 위치 업데이트
    r1Mesh.position.copy(R1);
    r2Mesh.position.copy(R2);
    rrMesh.position.copy(Rr);

    // 라벨
    r1Lbl.position.copy(R1.clone().multiplyScalar(1.13));
    r2Lbl.position.copy(R2.clone().multiplyScalar(1.13));
    rrLbl.position.copy(Rr.clone().multiplyScalar(1.13));

    // 화살표
    function setArrow(arrow, omega) {
      const len = omega.length();
      if (len < 1e-4) {
        arrow.visible = false;
        return;
      }
      arrow.visible = true;
      arrow.position.copy(I_POS);
      arrow.setDirection(omega.clone().normalize());
      arrow.setLength(Math.max(0.05, len * 0.8), 0.13, 0.08);
    }
    setArrow(omega1Arrow, t1);
    setArrow(omega2Arrow, t2);
    setArrow(omegaRArrow, tR);
    omegaRArrow.setLength(Math.max(0.05, tR.length() * 0.8), 0.16, 0.10);

    // 진짜 axis-angle 화살표 (회전축 = ω 자체, world 좌표) — 점선
    function setAxisArrowDashed(group, omega) {
      const len = omega.length();
      if (len < 1e-4) {
        group.visible = false;
        return;
      }
      group.visible = true;
      group.update(I_POS, omega.clone().normalize(), Math.max(0.05, len * 0.6));
    }
    setAxisArrowDashed(axisArrow1, w1);
    setAxisArrowDashed(axisArrow2, w2);
    setAxisArrowDashed(axisArrowR, wR);

    // 평행이동된 화살표 (t1 끝 → tR 끝) — 평행사변형/삼각형 닫기
    const w1End = I_POS.clone().add(t1.clone().multiplyScalar(0.8));
    const wREnd = I_POS.clone().add(tR.clone().multiplyScalar(0.8));
    const transVec = wREnd.clone().sub(w1End);
    const transLen = transVec.length();
    if (transLen > 0.01) {
      translatedArrow.visible = true;
      translatedArrow.position.copy(w1End);
      translatedArrow.setDirection(transVec.clone().normalize());
      translatedArrow.setLength(transLen, 0.10, 0.06);
      // 더하기 = 초록 (ω₂), 빼기 = 옅은 빨강 (-ω₂)
      const matColor = (opSelect.value === "add") ? 0x43a047 : 0xef5350;
      translatedArrow.setColor(new THREE.Color(matColor));
    } else {
      translatedArrow.visible = false;
    }

    // Geodesic 업데이트
    if (geoLine1) { scene.remove(geoLine1); geoLine1.geometry.dispose(); }
    if (geoLine2) { scene.remove(geoLine2); geoLine2.geometry.dispose(); }
    if (geoLineR) { scene.remove(geoLineR); geoLineR.geometry.dispose(); }
    geoLine1 = makeGeodesic(R1, w1.length(), geoMat1); if (geoLine1) scene.add(geoLine1);
    geoLine2 = makeGeodesic(R2, w2.length(), geoMat2); if (geoLine2) scene.add(geoLine2);
    geoLineR = makeGeodesic(Rr, wR.length(), geoMatR); if (geoLineR) scene.add(geoLineR);

    // 정보 패널 (산술 결과)
    const op = opSelect.value === "add" ? "+" : "−";
    info.textContent = "";
    function fmt(v) { return "(" + v.x.toFixed(3) + ", " + v.y.toFixed(3) + ", " + v.z.toFixed(3) + ")"; }
    function makeRow(text, val, color) {
      const d = document.createElement("div");
      d.style.cssText = "display:flex; justify-content:space-between; gap:12px; padding:1px 0;";
      const l = document.createElement("span"); l.textContent = text; l.style.color = color || "#222";
      const r = document.createElement("span"); r.textContent = val; r.style.cssText = "font-family:ui-monospace,monospace;";
      d.appendChild(l); d.appendChild(r);
      info.appendChild(d);
    }
    makeRow("ω₁ = log(R₁) = ", fmt(w1) + ", |ω₁| = " + w1.length().toFixed(3), "#1565c0");
    makeRow("ω₂ = log(R₂) = ", fmt(w2) + ", |ω₂| = " + w2.length().toFixed(3), "#43a047");
    makeRow("ω_r = ω₁ " + op + " ω₂ = ", fmt(wR) + ", |ω_r| = " + wR.length().toFixed(3), "#9c27b0");
    makeRow("R_r = exp(ω_r) on sphere = ", fmt(Rr), "#9c27b0");
  }
  update();

  // 마우스 컨트롤
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

  // 슬라이더 이벤트
  [w1xSlider, w1ySlider, w1zSlider, w2xSlider, w2ySlider, w2zSlider, opSelect].forEach((s) => s.addEventListener("input", update));
  opSelect.addEventListener("change", update);

  function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
  animate();

  window.addEventListener("resize", () => {
    const newW = canvas.clientWidth;
    camera.aspect = newW / H;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, H);
  });
})();
