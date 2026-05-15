// MLE 가우시안 노이즈 데모
// 모델: ŷ(t; w) = exp(-w*t)
// 가정: yᵢ = ŷᵢ + ε,  ε ~ N(0, σ²)
// ℓ(w) = const − SSE(w) / (2σ²)
// → ℓ 최대화 = SSE 최소화
(function () {
  const container = document.getElementById("mle-gaussian-demo");
  if (!container) return;

  const width = container.clientWidth;
  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }
  const canvasTop = makeCanvas(width, 280);   // (t, y) + 종 모양
  const canvasBot = makeCanvas(width, 240);   // ℓ(w)
  const ctxTop = canvasTop.getContext("2d");
  const ctxBot = canvasBot.getContext("2d");

  // Setup
  const W_TRUE = 0.5;
  const T_DATA = [0, 1, 2, 3, 4];
  const NOISE = [0.05, -0.06, 0.04, -0.03, 0.05];
  const Y_DATA = T_DATA.map((t, i) => Math.exp(-W_TRUE * t) + NOISE[i]);

  // State
  let w = 1.0;
  let sigma = 0.15;

  function model(t, ww) { return Math.exp(-ww * t); }
  function residual(ww) { return Y_DATA.map((y, i) => y - model(T_DATA[i], ww)); }
  function sse(ww) { return residual(ww).reduce((s, e) => s + e*e, 0); }
  function logL(ww) {
    const N = Y_DATA.length;
    return -0.5 * N * Math.log(2 * Math.PI * sigma * sigma) - sse(ww) / (2 * sigma * sigma);
  }
  function gaussPDF(y, mu, s) {
    return Math.exp(-((y - mu)**2) / (2*s*s)) / (Math.sqrt(2*Math.PI) * s);
  }

  // === TOP: (t, y) ===
  const mT = { top: 30, right: 20, bottom: 36, left: 50 };
  function pwT() { return canvasTop.width - mT.left - mT.right; }
  function phT() { return canvasTop.height - mT.top - mT.bottom; }
  const T_RANGE = [-0.3, 5];
  const Y_RANGE = [-0.3, 1.6];
  function tToPx(t) { return mT.left + ((t - T_RANGE[0]) / (T_RANGE[1] - T_RANGE[0])) * pwT(); }
  function yToPx(y) { return mT.top + phT() - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * phT(); }

  function drawTop() {
    const ctx = ctxTop;
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("yᵢ = e^(−w·tᵢ) + ε,  ε ~ N(0, σ²)", mT.left, 18);
    ctx.fillStyle = "#16a34a";
    ctx.fillText("σ = " + sigma.toFixed(3), mT.left + 290, 18);

    // bg
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mT.left, mT.top, pwT(), phT());

    // grid
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let t = 0; t <= 5; t++) { ctx.beginPath(); ctx.moveTo(tToPx(t), mT.top); ctx.lineTo(tToPx(t), mT.top + phT()); ctx.stroke(); }
    for (let y = 0; y <= 1.5; y += 0.5) { ctx.beginPath(); ctx.moveTo(mT.left, yToPx(y)); ctx.lineTo(mT.left + pwT(), yToPx(y)); ctx.stroke(); }

    // axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mT.left, yToPx(0)); ctx.lineTo(mT.left + pwT(), yToPx(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tToPx(0), mT.top); ctx.lineTo(tToPx(0), mT.top + phT()); ctx.stroke();

    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let t = 0; t <= 5; t++) ctx.fillText(t.toString(), tToPx(t), yToPx(0) + 14);
    ctx.textAlign = "right";
    for (let y = 0; y <= 1.5; y += 0.5) ctx.fillText(y.toFixed(1), tToPx(0) - 4, yToPx(y) + 3);

    // === Gaussian "bell" at each tᵢ (vertical, centered at ŷᵢ) ===
    for (let i = 0; i < T_DATA.length; i++) {
      const ti = T_DATA[i];
      const yi_hat = model(ti, w);
      const px = tToPx(ti);
      // 종을 옆으로 그림 (수평 폭이 PDF 값에 비례)
      ctx.fillStyle = "rgba(22, 163, 74, 0.15)";
      ctx.strokeStyle = "rgba(22, 163, 74, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const NPTS = 60;
      const yMin = yi_hat - 4*sigma, yMax = yi_hat + 4*sigma;
      const pdfMax = gaussPDF(yi_hat, yi_hat, sigma);
      const widthScale = 30 / pdfMax;  // 픽셀 폭
      let firstPt = true;
      for (let j = 0; j <= NPTS; j++) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const pdf = gaussPDF(yy, yi_hat, sigma);
        const xOffset = pdf * widthScale;
        const px1 = px + xOffset;
        const py1 = yToPx(yy);
        if (firstPt) { ctx.moveTo(px1, py1); firstPt = false; } else ctx.lineTo(px1, py1);
      }
      // 다시 좌측으로 닫기
      for (let j = NPTS; j >= 0; j--) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const pdf = gaussPDF(yy, yi_hat, sigma);
        const xOffset = pdf * widthScale;
        ctx.lineTo(px - xOffset, yToPx(yy));
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Current model curve
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2;
    ctx.beginPath(); let first = true;
    for (let t = 0; t <= 5; t += 0.05) {
      const y = model(t, w);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke();

    // Data points + 잔차 + 점별 확률 밀도값 (likelihood 기여도)
    for (let i = 0; i < T_DATA.length; i++) {
      const yi_hat = model(T_DATA[i], w);
      const px = tToPx(T_DATA[i]);
      const py = yToPx(Y_DATA[i]);
      const pyHat = yToPx(yi_hat);
      // 잔차 선
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, pyHat);
      ctx.stroke();
      // 모델 예측 점 (중앙치 ŷᵢ) — 작은 빨간 점 + 정점 밀도값
      ctx.fillStyle = "#dc2626"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, pyHat, 3.5, 0, 2*Math.PI); ctx.fill(); ctx.stroke();
      const pdfPeak = gaussPDF(yi_hat, yi_hat, sigma);
      ctx.fillStyle = "#b91c1c";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(pdfPeak.toFixed(2), px + 6, pyHat + 3);
      // 관측 데이터 점 + 그 위치의 밀도값 (점 위에 표시)
      ctx.fillStyle = "#1d4ed8"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(px, py, 5, 0, 2*Math.PI); ctx.fill(); ctx.stroke();
      const pdfVal = gaussPDF(Y_DATA[i], yi_hat, sigma);
      ctx.fillStyle = "#1e40af";
      ctx.textAlign = "center";
      ctx.fillText(pdfVal.toFixed(2), px, py - 9);
    }

    // Legend
    const lgX = mT.left + pwT() - 200, lgY = mT.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(lgX, lgY, 195, 70);
    ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(lgX, lgY, 195, 70);
    ctx.font = "10px sans-serif"; ctx.textAlign = "left";
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(lgX + 12, lgY + 13, 3, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.fillText("관측 데이터 yᵢ", lgX + 22, lgY + 16);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 32); ctx.lineTo(lgX + 18, lgY + 32); ctx.stroke();
    ctx.fillStyle = "#dc2626"; ctx.fillText("현재 모델 ŷ = e^(−wt)", lgX + 22, lgY + 35);
    ctx.fillStyle = "rgba(22, 163, 74, 0.4)"; ctx.fillRect(lgX + 6, lgY + 48, 14, 10);
    ctx.fillStyle = "#15803d"; ctx.fillText("가우시안 N(ŷᵢ, σ²)", lgX + 22, lgY + 56);
  }

  // === BOT: ℓ(w) ===
  const mB = { top: 30, right: 20, bottom: 36, left: 60 };
  function pwB() { return canvasBot.width - mB.left - mB.right; }
  function phB() { return canvasBot.height - mB.top - mB.bottom; }
  const W_RANGE = [-0.5, 3];
  function wToPx(ww) { return mB.left + ((ww - W_RANGE[0]) / (W_RANGE[1] - W_RANGE[0])) * pwB(); }

  function drawBot() {
    const ctx = ctxBot;
    ctx.clearRect(0, 0, canvasBot.width, canvasBot.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("ℓ(w) = const − SSE(w) / (2σ²)", mB.left, 18);
    ctx.fillStyle = "#7e22ce";
    ctx.fillText("ℓ(w_now) = " + logL(w).toFixed(3), mB.left + 250, 18);
    ctx.fillStyle = "#1d4ed8"; ctx.font = "11px sans-serif";
    ctx.fillText("SSE(w_now) = " + sse(w).toFixed(4), mB.left + 420, 18);

    // bg
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mB.left, mB.top, pwB(), phB());

    // ℓ 범위 — 최댓값 근처
    let llMax = -Infinity, llMin = Infinity;
    const NPTS = 200;
    const lls = [];
    for (let i = 0; i <= NPTS; i++) {
      const ww = W_RANGE[0] + (i / NPTS) * (W_RANGE[1] - W_RANGE[0]);
      const v = logL(ww);
      lls.push(v);
      if (v > llMax) llMax = v;
    }
    llMin = llMax - 30;
    function valToPx(v) {
      const r = (v - llMin) / (llMax - llMin);
      return mB.top + phB() - r * phB();
    }

    // grid
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let ww = -0.5; ww <= 3.001; ww += 0.5) { ctx.beginPath(); ctx.moveTo(wToPx(ww), mB.top); ctx.lineTo(wToPx(ww), mB.top + phB()); ctx.stroke(); }
    for (let i = 0; i <= 4; i++) {
      const v = llMin + (i / 4) * (llMax - llMin);
      ctx.beginPath(); ctx.moveTo(mB.left, valToPx(v)); ctx.lineTo(mB.left + pwB(), valToPx(v)); ctx.stroke();
    }

    // axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top + phB()); ctx.lineTo(mB.left + pwB(), mB.top + phB()); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top); ctx.lineTo(mB.left, mB.top + phB()); ctx.stroke();

    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let ww = -0.5; ww <= 3.001; ww += 0.5) ctx.fillText(ww.toFixed(1), wToPx(ww), mB.top + phB() + 14);
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = llMin + (i / 4) * (llMax - llMin);
      ctx.fillText(v.toFixed(1), mB.left - 4, valToPx(v) + 3);
    }
    ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("w", mB.left + pwB() - 5, mB.top + phB() + 28);
    ctx.fillText("ℓ", mB.left + 14, mB.top - 8);

    // ℓ(w) curve
    ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2;
    ctx.beginPath(); let first = true;
    for (let i = 0; i <= NPTS; i++) {
      const ww = W_RANGE[0] + (i / NPTS) * (W_RANGE[1] - W_RANGE[0]);
      const v = lls[i];
      if (v < llMin) { first = true; continue; }
      const px = wToPx(ww), py = valToPx(v);
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current w
    const llCur = logL(w);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wToPx(w), mB.top); ctx.lineTo(wToPx(w), mB.top + phB()); ctx.stroke(); ctx.setLineDash([]);
    if (llCur >= llMin) {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath(); ctx.arc(wToPx(w), valToPx(llCur), 6, 0, 2*Math.PI); ctx.fill();
    }
    ctx.fillStyle = "#dc2626"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("w = " + w.toFixed(3), wToPx(w) + 8, mB.top + 14);

    // True w
    ctx.fillStyle = "#1d4ed8";
    const llStar = logL(W_TRUE);
    if (llStar >= llMin) {
      ctx.beginPath(); ctx.arc(wToPx(W_TRUE), valToPx(llStar), 6, 0, 2*Math.PI); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("★", wToPx(W_TRUE), valToPx(llStar) + 3);
    }
    ctx.fillStyle = "#1d4ed8"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("w*=" + W_TRUE, wToPx(W_TRUE), mB.top + phB() - 5);
  }

  function drawAll() { drawTop(); drawBot(); }

  // Controls
  const controls = document.createElement("div");
  controls.style.cssText = "margin-top:8px; padding:10px; background:#f6f8fa; border-radius:6px; font-family:sans-serif; font-size:13px;";
  container.appendChild(controls);

  function makeRow(labelText, min, max, step, val, onChange) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:10px; margin-bottom:6px; align-items:center;";
    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    lbl.style.cssText = "font-weight:500; min-width:80px;";
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

  makeRow("w:", -0.5, 3, 0.01, 1.0, (v) => { w = v; drawAll(); });
  makeRow("σ (노이즈):", 0.02, 0.5, 0.01, 0.15, (v) => { sigma = v; drawAll(); });

  drawAll();
})();
