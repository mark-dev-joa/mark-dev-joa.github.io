// MLE = SSE 1D walkthrough demo
// 모델: ŷ = e^(-w*t)
// 가정: yᵢ = ŷᵢ + ε, ε ~ N(0, σ²)
// 위: (t, y) + 데이터 + 모델 + 각 점에 가우시안 종
// 가운데: SSE(w)  — 파란 곡선 (최소화 대상)
// 아래: ℓ(w) = C - SSE/(2σ²) — 보라 곡선 (최대화 대상)
// 핵심: 세 그래프의 마커가 항상 같은 w 위에 정렬됨 → 동일한 문제
(function () {
  const container = document.getElementById("mle-sse-1d-demo");
  if (!container) return;

  const width = container.clientWidth;
  function makeCanvas(h) {
    const c = document.createElement("canvas");
    c.width = width; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }
  const canvasTop = makeCanvas(260);
  const canvasMid = makeCanvas(220);
  const canvasBot = makeCanvas(220);
  const cT = canvasTop.getContext("2d");
  const cM = canvasMid.getContext("2d");
  const cB = canvasBot.getContext("2d");

  // === Setup ===
  const W_TRUE = 0.5;
  const T_DATA = [0, 1, 2, 3, 4];
  const NOISE = [0.05, -0.06, 0.04, -0.03, 0.05];
  const Y_DATA = T_DATA.map((t, i) => Math.exp(-W_TRUE * t) + NOISE[i]);

  // === State ===
  let w = 1.0;
  let sigma = 0.10;

  // === Helpers ===
  function model(t, ww) { return Math.exp(-ww * t); }
  function residual(ww) { return Y_DATA.map((y, i) => y - model(T_DATA[i], ww)); }
  function sse(ww) { return residual(ww).reduce((s, e) => s + e*e, 0); }
  function logL(ww) {
    const N = Y_DATA.length;
    const C = -0.5 * N * Math.log(2 * Math.PI * sigma * sigma);
    return C - sse(ww) / (2 * sigma * sigma);
  }
  function gauss(y, mu, s) {
    return Math.exp(-((y - mu)**2) / (2*s*s)) / (Math.sqrt(2*Math.PI) * s);
  }

  // ============== TOP: (t, y) ==============
  const mT = { top: 28, right: 20, bottom: 30, left: 50 };
  function pwT() { return canvasTop.width - mT.left - mT.right; }
  function phT() { return canvasTop.height - mT.top - mT.bottom; }
  const T_RANGE = [-0.3, 5];
  const Y_RANGE = [-0.3, 1.6];
  function tToPx(t) { return mT.left + ((t - T_RANGE[0]) / (T_RANGE[1] - T_RANGE[0])) * pwT(); }
  function yToPx(y) { return mT.top + phT() - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * phT(); }

  function drawTop() {
    const ctx = cT;
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("yᵢ = e^(−w·tᵢ) + ε,  ε ~ N(0, σ²)   |   w=" + w.toFixed(3) + ", σ=" + sigma.toFixed(3), mT.left, 18);

    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mT.left, mT.top, pwT(), phT());
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let t = 0; t <= 5; t++) { ctx.beginPath(); ctx.moveTo(tToPx(t), mT.top); ctx.lineTo(tToPx(t), mT.top + phT()); ctx.stroke(); }
    for (let y = 0; y <= 1.5; y += 0.5) { ctx.beginPath(); ctx.moveTo(mT.left, yToPx(y)); ctx.lineTo(mT.left + pwT(), yToPx(y)); ctx.stroke(); }
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mT.left, yToPx(0)); ctx.lineTo(mT.left + pwT(), yToPx(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tToPx(0), mT.top); ctx.lineTo(tToPx(0), mT.top + phT()); ctx.stroke();
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let t = 0; t <= 5; t++) ctx.fillText(t.toString(), tToPx(t), yToPx(0) + 14);
    ctx.textAlign = "right";
    for (let y = 0; y <= 1.5; y += 0.5) ctx.fillText(y.toFixed(1), tToPx(0) - 4, yToPx(y) + 3);

    for (let i = 0; i < T_DATA.length; i++) {
      const ti = T_DATA[i];
      const yhi = model(ti, w);
      const px = tToPx(ti);
      ctx.fillStyle = "rgba(22, 163, 74, 0.13)";
      ctx.strokeStyle = "rgba(22, 163, 74, 0.45)"; ctx.lineWidth = 1;
      ctx.beginPath();
      const NPTS = 50;
      const yMin = yhi - 4*sigma, yMax = yhi + 4*sigma;
      const pdfMax = gauss(yhi, yhi, sigma);
      const widthScale = 28 / pdfMax;
      let firstPt = true;
      for (let j = 0; j <= NPTS; j++) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const offX = gauss(yy, yhi, sigma) * widthScale;
        const px1 = px + offX, py1 = yToPx(yy);
        if (firstPt) { ctx.moveTo(px1, py1); firstPt = false; } else ctx.lineTo(px1, py1);
      }
      for (let j = NPTS; j >= 0; j--) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const offX = gauss(yy, yhi, sigma) * widthScale;
        ctx.lineTo(px - offX, yToPx(yy));
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2;
    ctx.beginPath(); let first = true;
    for (let t = 0; t <= 5; t += 0.05) {
      const y = model(t, w);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke();

    for (let i = 0; i < T_DATA.length; i++) {
      const yhi = model(T_DATA[i], w);
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(tToPx(T_DATA[i]), yToPx(Y_DATA[i]));
      ctx.lineTo(tToPx(T_DATA[i]), yToPx(yhi));
      ctx.stroke();
      ctx.fillStyle = "#1d4ed8"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(tToPx(T_DATA[i]), yToPx(Y_DATA[i]), 5, 0, 2*Math.PI); ctx.fill(); ctx.stroke();
    }

    const lgX = mT.left + pwT() - 200, lgY = mT.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(lgX, lgY, 195, 70);
    ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(lgX, lgY, 195, 70);
    ctx.font = "10px sans-serif"; ctx.textAlign = "left";
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(lgX + 12, lgY + 13, 3, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.fillText("관측 yᵢ", lgX + 22, lgY + 16);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 32); ctx.lineTo(lgX + 18, lgY + 32); ctx.stroke();
    ctx.fillStyle = "#dc2626"; ctx.fillText("모델 ŷ = e^(−wt)", lgX + 22, lgY + 35);
    ctx.fillStyle = "rgba(22, 163, 74, 0.4)"; ctx.fillRect(lgX + 6, lgY + 48, 14, 10);
    ctx.fillStyle = "#15803d"; ctx.fillText("가우시안 N(ŷᵢ, σ²)", lgX + 22, lgY + 56);
  }

  // ============== Mid/Bot: SSE(w), ℓ(w) ==============
  const mB = { top: 26, right: 20, bottom: 30, left: 60 };
  function pwB(c) { return c.width - mB.left - mB.right; }
  function phB(c) { return c.height - mB.top - mB.bottom; }
  const W_RANGE = [-0.3, 2.5];
  function wToPx(c, ww) { return mB.left + ((ww - W_RANGE[0]) / (W_RANGE[1] - W_RANGE[0])) * pwB(c); }

  function drawCurveCanvas(ctx, c, opts) {
    ctx.clearRect(0, 0, c.width, c.height);

    const NPTS = 200;
    const xs = [], ys = [];
    let yMin = Infinity, yMax = -Infinity;
    for (let i = 0; i <= NPTS; i++) {
      const ww = W_RANGE[0] + (i / NPTS) * (W_RANGE[1] - W_RANGE[0]);
      const v = opts.fn(ww);
      xs.push(ww); ys.push(v);
      if (isFinite(v)) {
        if (v < yMin) yMin = v;
        if (v > yMax) yMax = v;
      }
    }
    const yPad = (yMax - yMin) * 0.08 || 1;
    const yLo = yMin - yPad, yHi = yMax + yPad;
    function yToPxC(v) {
      const r = (v - yLo) / (yHi - yLo);
      return mB.top + phB(c) - r * phB(c);
    }

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText(opts.title, mB.left, 16);
    ctx.fillStyle = opts.markerColor; ctx.font = "11px monospace";
    ctx.fillText(opts.curLabel + " = " + opts.fn(w).toFixed(opts.decimals || 4), mB.left + 320, 16);

    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mB.left, mB.top, pwB(c), phB(c));
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let ww = -0.3; ww <= 2.6; ww += 0.5) {
      ctx.beginPath(); ctx.moveTo(wToPx(c, ww), mB.top); ctx.lineTo(wToPx(c, ww), mB.top + phB(c)); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const v = yLo + (i / 4) * (yHi - yLo);
      ctx.beginPath(); ctx.moveTo(mB.left, yToPxC(v)); ctx.lineTo(mB.left + pwB(c), yToPxC(v)); ctx.stroke();
    }

    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top + phB(c)); ctx.lineTo(mB.left + pwB(c), mB.top + phB(c)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top); ctx.lineTo(mB.left, mB.top + phB(c)); ctx.stroke();
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let ww = -0.3; ww <= 2.6; ww += 0.5) ctx.fillText(ww.toFixed(1), wToPx(c, ww), mB.top + phB(c) + 14);
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = yLo + (i / 4) * (yHi - yLo);
      ctx.fillText(v.toFixed(opts.decimals || 2), mB.left - 4, yToPxC(v) + 3);
    }
    ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("w", mB.left + pwB(c) - 5, mB.top + phB(c) + 26);
    ctx.fillText(opts.yLabel, mB.left + 14, mB.top - 6);

    ctx.strokeStyle = opts.curveColor; ctx.lineWidth = 2;
    ctx.beginPath(); let first = true;
    for (let i = 0; i <= NPTS; i++) {
      if (!isFinite(ys[i])) { first = true; continue; }
      const px = wToPx(c, xs[i]), py = yToPxC(ys[i]);
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const optW = opts.optW;
    const optV = opts.fn(optW);
    if (isFinite(optV) && optV >= yLo && optV <= yHi) {
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath(); ctx.arc(wToPx(c, optW), yToPxC(optV), 6, 0, 2*Math.PI); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("★", wToPx(c, optW), yToPxC(optV) + 3);
      ctx.fillStyle = "#1d4ed8"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("w*=" + optW, wToPx(c, optW), mB.top + phB(c) - 4);
    }

    const curV = opts.fn(w);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wToPx(c, w), mB.top); ctx.lineTo(wToPx(c, w), mB.top + phB(c)); ctx.stroke(); ctx.setLineDash([]);
    if (isFinite(curV) && curV >= yLo && curV <= yHi) {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath(); ctx.arc(wToPx(c, w), yToPxC(curV), 6, 0, 2*Math.PI); ctx.fill();
    }
  }

  function drawMid() {
    drawCurveCanvas(cM, canvasMid, {
      title: "SSE(w) = Σᵢ (yᵢ − e^(−w·tᵢ))²    [최소화 대상]",
      yLabel: "SSE",
      curveColor: "#1d4ed8",
      markerColor: "#dc2626",
      curLabel: "SSE(w)",
      fn: sse,
      optW: W_TRUE,
      decimals: 4
    });
  }

  function drawBot() {
    drawCurveCanvas(cB, canvasBot, {
      title: "ℓ(w) = log L(w) = C − SSE(w)/(2σ²)    [최대화 대상]",
      yLabel: "ℓ",
      curveColor: "#7e22ce",
      markerColor: "#dc2626",
      curLabel: "ℓ(w)",
      fn: logL,
      optW: W_TRUE,
      decimals: 2
    });
  }

  function drawAll() { drawTop(); drawMid(); drawBot(); }

  // === Controls ===
  const controls = document.createElement("div");
  controls.style.cssText = "margin-top:8px; padding:10px; background:#f6f8fa; border-radius:6px; font-family:sans-serif; font-size:13px;";
  container.appendChild(controls);

  function makeRow(labelText, min, max, step, val, onChange) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:10px; margin-bottom:6px; align-items:center;";
    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    lbl.style.cssText = "font-weight:500; min-width:90px;";
    row.appendChild(lbl);
    const slider = document.createElement("input");
    slider.type = "range"; slider.min = min; slider.max = max; slider.step = step; slider.value = val;
    slider.style.cssText = "flex:1;";
    row.appendChild(slider);
    const valSpan = document.createElement("span");
    valSpan.textContent = val.toFixed(3);
    valSpan.style.cssText = "font-family:monospace; min-width:50px; text-align:right;";
    row.appendChild(valSpan);
    slider.addEventListener("input", () => {
      const v = parseFloat(slider.value);
      valSpan.textContent = v.toFixed(3);
      onChange(v);
    });
    controls.appendChild(row);
  }

  makeRow("w (현재):", -0.3, 2.5, 0.01, 1.0, (v) => { w = v; drawAll(); });
  makeRow("σ (노이즈):", 0.02, 0.5, 0.005, 0.10, (v) => { sigma = v; drawAll(); });

  const note = document.createElement("div");
  note.style.cssText = "margin-top:6px; padding:6px 8px; background:#fef3c7; border-left:3px solid #f59e0b; font-size:11px; color:#78350f;";
  note.textContent = "★ 슬라이더를 움직여 보세요. 빨간 마커가 세 그래프에서 항상 같은 w 위에 정렬됩니다 — SSE 최저 ↔ ℓ 최고 (정답 w*=0.5). σ 를 키우면 ℓ 곡선은 평평해지지만 최댓값 위치는 변하지 않음 → MLE 답 동일.";
  container.appendChild(note);

  drawAll();
})();
