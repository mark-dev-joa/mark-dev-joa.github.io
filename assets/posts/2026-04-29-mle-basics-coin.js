// MLE 동전 던지기 데모
// 모델: P(H) = θ
// 데이터: 앞면 k 개, 뒷면 (N-k) 개
// L(θ) = θ^k (1-θ)^(N-k)
// ℓ(θ) = k log θ + (N-k) log(1-θ)
// MLE: θ* = k / N
(function () {
  const container = document.getElementById("mle-coin-demo");
  if (!container) return;

  const width = container.clientWidth;
  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }
  const canvasL  = makeCanvas(width, 240);  // L(θ)
  const canvasLL = makeCanvas(width, 240);  // log L(θ)
  const ctxL  = canvasL.getContext("2d");
  const ctxLL = canvasLL.getContext("2d");

  // === State ===
  let k = 3;     // 앞면 수
  let nT = 2;    // 뒷면 수
  let theta = 0.5;

  function N() { return k + nT; }
  function thetaStar() { return N() === 0 ? 0.5 : k / N(); }

  function L(t) {
    if (t <= 0 || t >= 1) {
      if (t === 0 && k === 0) return Math.pow(1 - t, nT);
      if (t === 1 && nT === 0) return Math.pow(t, k);
      return 0;
    }
    return Math.pow(t, k) * Math.pow(1 - t, nT);
  }
  function logL(t) {
    if (t <= 0 || t >= 1) return -Infinity;
    return k * Math.log(t) + nT * Math.log(1 - t);
  }

  // === Drawing helpers ===
  const m = { top: 30, right: 20, bottom: 36, left: 60 };
  function pw(c) { return c.width - m.left - m.right; }
  function ph(c) { return c.height - m.top - m.bottom; }
  function thetaToPx(c, t) { return m.left + t * pw(c); }
  function valToPxL(c, v, vMax) {
    return m.top + ph(c) - (v / vMax) * ph(c);
  }
  function valToPxLL(c, v, vMin, vMax) {
    // ℓ 는 음수가 흔함. vMin ~ vMax 범위로 매핑
    const r = (v - vMin) / (vMax - vMin);
    return m.top + ph(c) - r * ph(c);
  }

  function drawAxes(ctx, c, yLabel, yTickStrs, yTickPos) {
    // bg
    ctx.fillStyle = "#fafbfc";
    ctx.fillRect(m.left, m.top, pw(c), ph(c));
    // grid x
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let t = 0; t <= 1.001; t += 0.1) {
      ctx.beginPath();
      ctx.moveTo(thetaToPx(c, t), m.top);
      ctx.lineTo(thetaToPx(c, t), m.top + ph(c));
      ctx.stroke();
    }
    // grid y
    for (const py of yTickPos) {
      ctx.beginPath();
      ctx.moveTo(m.left, py);
      ctx.lineTo(m.left + pw(c), py);
      ctx.stroke();
    }
    // axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(m.left, m.top + ph(c));
    ctx.lineTo(m.left + pw(c), m.top + ph(c));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(m.left, m.top);
    ctx.lineTo(m.left, m.top + ph(c));
    ctx.stroke();
    // x ticks
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let t = 0; t <= 1.001; t += 0.2) {
      ctx.fillText(t.toFixed(1), thetaToPx(c, t), m.top + ph(c) + 14);
    }
    // y ticks
    ctx.textAlign = "right";
    for (let i = 0; i < yTickStrs.length; i++) {
      ctx.fillText(yTickStrs[i], m.left - 4, yTickPos[i] + 3);
    }
    // labels (y축 라벨은 제목 식에 이미 포함되어 있어 생략)
    ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("θ", m.left + pw(c) - 5, m.top + ph(c) + 28);
  }

  function drawTop() {
    const ctx = ctxL, c = canvasL;
    ctx.clearRect(0, 0, c.width, c.height);

    // Title
    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("L(θ) = θ^k · (1−θ)^(N−k)", m.left, 18);
    const ts = thetaStar();
    ctx.fillStyle = "#1d4ed8"; ctx.textAlign = "right";
    ctx.fillText("★ MLE θ* = " + k + "/" + N() + " = " + ts.toFixed(3), m.left + pw(c), 18);

    // y ticks for L
    const lMax = L(ts) > 0 ? L(ts) * 1.1 : 1;
    const yTickPos = [], yTickStrs = [];
    for (let i = 0; i <= 4; i++) {
      const v = (i / 4) * lMax;
      yTickPos.push(valToPxL(c, v, lMax));
      yTickStrs.push(v.toExponential(1));
    }
    drawAxes(ctx, c, "L(θ)", yTickStrs, yTickPos);

    // Curve
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    const NPTS = 400;
    for (let i = 0; i <= NPTS; i++) {
      const t = i / NPTS;
      const v = L(t);
      const px = thetaToPx(c, t);
      const py = valToPxL(c, v, lMax);
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current θ marker
    const lAtCur = L(theta);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(thetaToPx(c, theta), m.top);
    ctx.lineTo(thetaToPx(c, theta), m.top + ph(c));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(thetaToPx(c, theta), valToPxL(c, lAtCur, lMax), 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.font = "11px sans-serif";
    const cursorPxL = thetaToPx(c, theta);
    const onRightL = cursorPxL > m.left + pw(c) * 0.6;
    ctx.textAlign = onRightL ? "right" : "left";
    const dxL = onRightL ? -8 : 8;
    ctx.fillText("θ = " + theta.toFixed(3), cursorPxL + dxL, m.top + 14);
    ctx.fillText("L = " + lAtCur.toExponential(2), cursorPxL + dxL, m.top + 28);

    // MLE marker
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.arc(thetaToPx(c, ts), valToPxL(c, L(ts), lMax), 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("★", thetaToPx(c, ts), valToPxL(c, L(ts), lMax) + 3);
  }

  function drawBot() {
    const ctx = ctxLL, c = canvasLL;
    ctx.clearRect(0, 0, c.width, c.height);

    // Title
    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("ℓ(θ) = k·log θ + (N−k)·log(1−θ)", m.left, 18);
    const ts = thetaStar();
    ctx.fillStyle = "#7e22ce"; ctx.textAlign = "right";
    ctx.fillText("ℓ_max = " + logL(ts).toFixed(3), m.left + pw(c), 18);

    // 범위: ℓ_max 에서 -10 정도까지
    const llMax = logL(ts);
    const llMin = llMax - 10;
    const yTickPos = [], yTickStrs = [];
    for (let i = 0; i <= 4; i++) {
      const v = llMin + (i / 4) * (llMax - llMin);
      yTickPos.push(valToPxLL(c, v, llMin, llMax));
      yTickStrs.push(v.toFixed(1));
    }
    drawAxes(ctx, c, "ℓ(θ)", yTickStrs, yTickPos);

    // Curve
    ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    const NPTS = 400;
    for (let i = 1; i < NPTS; i++) {
      const t = i / NPTS;
      const v = logL(t);
      if (v < llMin) { first = true; continue; }
      const px = thetaToPx(c, t);
      const py = valToPxLL(c, v, llMin, llMax);
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current θ
    const llAtCur = logL(theta);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(thetaToPx(c, theta), m.top);
    ctx.lineTo(thetaToPx(c, theta), m.top + ph(c));
    ctx.stroke(); ctx.setLineDash([]);
    if (llAtCur >= llMin) {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(thetaToPx(c, theta), valToPxLL(c, llAtCur, llMin, llMax), 6, 0, 2*Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = "#dc2626"; ctx.font = "11px sans-serif";
    const cursorPxLL = thetaToPx(c, theta);
    const onRightLL = cursorPxLL > m.left + pw(c) * 0.6;
    ctx.textAlign = onRightLL ? "right" : "left";
    const dxLL = onRightLL ? -8 : 8;
    ctx.fillText("ℓ(θ) = " + (llAtCur === -Infinity ? "−∞" : llAtCur.toFixed(3)), cursorPxLL + dxLL, m.top + 14);

    // MLE
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.arc(thetaToPx(c, ts), valToPxLL(c, llMax, llMin, llMax), 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("★", thetaToPx(c, ts), valToPxLL(c, llMax, llMin, llMax) + 3);
  }

  function drawAll() { drawTop(); drawBot(); }

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
    valSpan.textContent = val.toString();
    valSpan.style.cssText = "font-family:monospace; min-width:50px; text-align:right;";
    row.appendChild(valSpan);
    slider.addEventListener("input", () => {
      const v = parseFloat(slider.value);
      valSpan.textContent = step < 1 ? v.toFixed(3) : v.toString();
      onChange(v);
    });
    controls.appendChild(row);
    return slider;
  }

  makeRow("θ (현재 추정):", 0.001, 0.999, 0.001, 0.5, (v) => { theta = v; drawAll(); });
  makeRow("앞면 수 k:", 0, 100, 1, 3, (v) => { k = Math.round(v); drawAll(); });
  makeRow("뒷면 수 N−k:", 0, 100, 1, 2, (v) => { nT = Math.round(v); drawAll(); });

  drawAll();
})();
