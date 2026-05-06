// PDF 적분 시각화 — 키 (cm) 가우시안
// "구간 [a, b] 의 면적 = P(a < X < b)" 직관
// - 두 손잡이 (a, b) 드래그
// - 채워진 면적 = 적분값 = 확률
// - 좁은 구간 → 거의 0 (단일 점 확률 = 0 시각화)
// - 프리셋 버튼: ±1σ, ±2σ, ±3σ
(function () {
  const container = document.getElementById("pdf-height-demo");
  if (!container) return;

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

  // === 분포: N(170, 7²) cm ===
  const MU = 170;
  const SIGMA = 7;
  // 가우시안은 이론상 (-∞, ∞), 화면은 ±5σ (≈ 99.99994%) 까지 확보
  // → 양 끝까지 끌면 적분이 1.0000 으로 표시됨
  const X_MIN = MU - 5 * SIGMA; // 135
  const X_MAX = MU + 5 * SIGMA; // 205

  function pdf(x) {
    const z = (x - MU) / SIGMA;
    return Math.exp(-0.5 * z * z) / (SIGMA * Math.sqrt(2 * Math.PI));
  }

  // 표준정규 CDF (Abramowitz & Stegun 근사)
  function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  function gaussianCDF(x) {
    return 0.5 * (1 + erf((x - MU) / (SIGMA * Math.SQRT2)));
  }
  function intervalProb(a, b) {
    return gaussianCDF(b) - gaussianCDF(a);
  }

  // === UI ===
  const btnRow = el("div", { style: "display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px; font-family:system-ui,sans-serif; font-size:13px;" });
  const presets = [
    ["전체 (≈ 1.0000)", X_MIN, X_MAX],
    ["±1σ (163~177)", MU - SIGMA, MU + SIGMA],
    ["±2σ (156~184)", MU - 2 * SIGMA, MU + 2 * SIGMA],
    ["±3σ (149~191)", MU - 3 * SIGMA, MU + 3 * SIGMA],
    ["좁은 구간 (174.9~175.1)", 174.9, 175.1],
    ["한 점 → 점근 (175 ± 0.001)", 174.999, 175.001],
  ];
  presets.forEach(([label, a, b]) => {
    const btn = el("button", { style: "padding:4px 10px;" }, [label]);
    btn.addEventListener("click", () => { aVal = a; bVal = b; draw(); });
    btnRow.appendChild(btn);
  });

  const info = el("div", {
    style: "font-family:system-ui,sans-serif; font-size:13px; line-height:1.6; margin-top:6px; padding:8px 10px; background:#fff; border:1px solid #e0e6eb; border-radius:6px; color:#222;",
  });

  const canvas = el("canvas", { style: "width:100%; height:340px; background:#fff; border-radius:6px; display:block; cursor:ew-resize;" });

  const help = el("div", { style: "font-size:12px; color:#555; margin-top:6px; line-height:1.5;" }, [
    "↔ 캔버스 안의 ", el("b", null, ["빨간 손잡이"]), " 또는 ", el("b", null, ["파란 손잡이"]),
    " 를 드래그해서 구간 [a, b] 를 바꿔봐. 주황 면적 = 그 구간의 확률.",
  ]);

  container.appendChild(btnRow);
  container.appendChild(canvas);
  container.appendChild(info);
  container.appendChild(help);

  // === State ===
  let aVal = MU - SIGMA;
  let bVal = MU + SIGMA;
  let dragging = null; // 'a' | 'b' | null

  // === Drawing ===
  function fitCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // 좌표 변환
  let geom = null;
  function computeGeom() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const padL = 50, padR = 20, padT = 20, padB = 36;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    // y 축: PDF 값 0 ~ yMax (분포 정점이 0.057 정도) — 여유롭게 0.07
    const yMax = pdf(MU) * 1.25;
    const xToPx = (x) => padL + ((x - X_MIN) / (X_MAX - X_MIN)) * plotW;
    const pxToX = (px) => X_MIN + ((px - padL) / plotW) * (X_MAX - X_MIN);
    const yToPx = (y) => padT + plotH - (y / yMax) * plotH;
    return { padL, padR, padT, padB, plotW, plotH, yMax, xToPx, pxToX, yToPx, W, H };
  }

  function draw() {
    // 정렬 + 클램프
    if (aVal > bVal) { const t = aVal; aVal = bVal; bVal = t; }
    aVal = Math.max(X_MIN, Math.min(X_MAX, aVal));
    bVal = Math.max(X_MIN, Math.min(X_MAX, bVal));

    const ctx = fitCanvas();
    geom = computeGeom();
    const { padL, padT, plotW, plotH, yMax, xToPx, yToPx, W, H } = geom;
    ctx.clearRect(0, 0, W, H);

    // y 격자
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#666";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const yTicks = 5;
    for (let t = 0; t <= yTicks; t++) {
      const v = (yMax * t) / yTicks;
      const y = yToPx(v);
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(3), padL - 6, y);
    }

    // x 축 눈금 — 5cm 간격
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let x = 140; x <= 200; x += 10) {
      const px = xToPx(x);
      ctx.strokeStyle = "#ccc";
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();
      ctx.fillStyle = "#666";
      ctx.fillText(x + "", px, padT + plotH + 6);
    }

    // 축
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // 채워진 면적 [aVal, bVal]
    ctx.fillStyle = "rgba(255, 152, 0, 0.45)";
    ctx.beginPath();
    const aPx = xToPx(aVal), bPx = xToPx(bVal);
    ctx.moveTo(aPx, yToPx(0));
    const STEP = 2;
    for (let px = aPx; px <= bPx; px += STEP) {
      const x = X_MIN + ((px - padL) / plotW) * (X_MAX - X_MIN);
      ctx.lineTo(px, yToPx(pdf(x)));
    }
    ctx.lineTo(bPx, yToPx(pdf(bVal)));
    ctx.lineTo(bPx, yToPx(0));
    ctx.closePath();
    ctx.fill();

    // PDF 곡선
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let px = padL; px <= padL + plotW; px += 1) {
      const x = X_MIN + ((px - padL) / plotW) * (X_MAX - X_MIN);
      const y = yToPx(pdf(x));
      if (first) { ctx.moveTo(px, y); first = false; } else ctx.lineTo(px, y);
    }
    ctx.stroke();

    // a, b 손잡이
    function handle(x, color, label) {
      const px = xToPx(x);
      const fy = pdf(x);
      const pyOnCurve = yToPx(fy);

      // 세로선
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();

      // 손잡이 원 (x축)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, padT + plotH, 6, 0, Math.PI * 2);
      ctx.fill();

      // 곡선과 만나는 점 (PDF 값) 강조
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, pyOnCurve, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 상단 라벨: x 값
      ctx.fillStyle = color;
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(label + " = " + x.toFixed(2), px, padT - 4);

      // 곡선 옆 PDF 값 라벨 — f(a) = ... 형태
      // a 는 왼쪽으로, b 는 오른쪽으로 배치 (겹침 방지)
      const isLeft = label === "a";
      ctx.fillStyle = color;
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = isLeft ? "right" : "left";
      ctx.textBaseline = "middle";
      const offsetX = isLeft ? -8 : 8;
      const tag = "f(" + label + ") = " + fy.toFixed(4) + " /cm";
      // 배경 박스 (가독성 ↑)
      const tw = ctx.measureText(tag).width;
      const bx = isLeft ? px + offsetX - tw - 6 : px + offsetX - 2;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(bx, pyOnCurve - 9, tw + 8, 18);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, pyOnCurve - 9, tw + 8, 18);
      ctx.fillStyle = color;
      ctx.fillText(tag, px + offsetX, pyOnCurve);
    }
    handle(aVal, "#d32f2f", "a");
    handle(bVal, "#1565c0", "b");

    // === 정보 패널 ===
    const prob = intervalProb(aVal, bVal);
    const width = bVal - aVal;
    const midPdf = pdf((aVal + bVal) / 2);
    const rectApprox = midPdf * width;

    // textContent 로 안전하게 채우기
    info.textContent = "";
    const row = (txt, val, color) => {
      const d = document.createElement("div");
      d.style.cssText = "display:flex; justify-content:space-between; gap:12px; padding:2px 0;";
      const l = document.createElement("span"); l.textContent = txt;
      const r = document.createElement("span");
      r.textContent = val;
      r.style.cssText = "font-family:ui-monospace,monospace; color:" + (color || "#222") + "; font-weight:600;";
      d.appendChild(l); d.appendChild(r);
      info.appendChild(d);
    };
    row("구간 [a, b]:", "[" + aVal.toFixed(2) + " , " + bVal.toFixed(2) + "] cm");
    row("폭 (b − a):", width.toFixed(3) + " cm");
    row("PDF 값 (중앙점):", midPdf.toFixed(4) + " /cm");
    row("면적 ≈ PDF × 폭 (사각형 근사):", rectApprox.toFixed(4));
    row("정확한 적분 P(a < X < b):", prob.toFixed(4), "#e65100");
    row("→ 퍼센트로:", (prob * 100).toFixed(2) + " %", "#e65100");

    // 해석 (전체 폭 문장)
    const interp = document.createElement("div");
    interp.style.cssText = "margin-top:6px; padding:6px 8px; background:#fff8e1; border-left:3px solid #fbc02d; color:#5d4037; line-height:1.5;";
    interp.textContent =
      "해석: 전체 인구 중 키가 " + aVal.toFixed(1) + " ~ " + bVal.toFixed(1) +
      " cm 인 사람의 비율 ≈ " + (prob * 100).toFixed(2) + " %";
    info.appendChild(interp);

    // 좁은 구간 → 거의 0 메시지
    if (prob > 0.9999) {
      const note = document.createElement("div");
      note.style.cssText = "margin-top:6px; padding:6px 8px; background:#e8f5e9; border-left:3px solid #43a047; color:#1b5e20;";
      note.textContent = "→ 전체 영역 ⇒ 적분 = 1 (정의에 의해 항상 성립). PDF 가 PDF 인 이유.";
      info.appendChild(note);
    } else if (width < 0.01) {
      const note = document.createElement("div");
      note.style.cssText = "margin-top:6px; padding:6px 8px; background:#fff3e0; border-left:3px solid #fb8c00; color:#5d4037;";
      note.textContent = "→ 폭이 0 에 가까워지면 면적도 0. 단일 점 확률 = 0 의 정체.";
      info.appendChild(note);
    } else if (Math.abs(width - 2 * SIGMA) < 0.1) {
      const note = document.createElement("div");
      note.style.cssText = "margin-top:6px; padding:6px 8px; background:#e3f2fd; border-left:3px solid #1976d2; color:#1a237e;";
      note.textContent = "→ ±1σ 구간 ⇒ 약 68% (가우시안의 유명한 규칙)";
      info.appendChild(note);
    } else if (Math.abs(width - 4 * SIGMA) < 0.1) {
      const note = document.createElement("div");
      note.style.cssText = "margin-top:6px; padding:6px 8px; background:#e3f2fd; border-left:3px solid #1976d2; color:#1a237e;";
      note.textContent = "→ ±2σ 구간 ⇒ 약 95%";
      info.appendChild(note);
    }
  }

  // === 마우스 이벤트 ===
  function getMouseX(ev) {
    const rect = canvas.getBoundingClientRect();
    return ev.clientX - rect.left;
  }
  canvas.addEventListener("mousedown", (ev) => {
    if (!geom) return;
    const px = getMouseX(ev);
    const aPx = geom.xToPx(aVal), bPx = geom.xToPx(bVal);
    dragging = Math.abs(px - aPx) < Math.abs(px - bPx) ? "a" : "b";
    if (dragging === "a") aVal = geom.pxToX(px);
    else bVal = geom.pxToX(px);
    draw();
  });
  canvas.addEventListener("mousemove", (ev) => {
    if (!dragging || !geom) return;
    const px = getMouseX(ev);
    if (dragging === "a") aVal = geom.pxToX(px);
    else bVal = geom.pxToX(px);
    draw();
  });
  window.addEventListener("mouseup", () => { dragging = null; });
  window.addEventListener("resize", draw);

  draw();
})();
