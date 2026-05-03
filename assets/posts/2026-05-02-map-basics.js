// MAP overfitting demo — 다항식 회귀로 MLE vs MAP 비교
// True: y = sin(2t), t ∈ [0, 3]
// 다항식 features [1, t, t², ..., t^N]
// Ridge 닫힌 해: w = (X^T X + λI)^(-1) X^T y
(function () {
  const container = document.getElementById("map-overfitting-demo");
  if (!container) return;

  const width = container.clientWidth;
  function makeCanvas(h) {
    const c = document.createElement("canvas");
    c.width = width; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }

  const canvasTop = makeCanvas(320);  // (t, y) — true + data + fits
  const canvasBot = makeCanvas(180);  // 계수 막대
  const cT = canvasTop.getContext("2d");
  const cB = canvasBot.getContext("2d");

  // ============== Setup ==============
  const T_RANGE = [0, 3];
  const Y_RANGE = [-1.5, 1.8];
  function trueY(t) { return Math.sin(2 * t); }

  // State
  let N = 10;          // 차수
  let nPoints = 6;     // 데이터 점 수
  let lambda = 1e-3;   // 정칙화 강도
  let noiseLevel = 0.15;

  // Generate data (deterministic noise for reproducibility)
  function pseudoRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  let dataT = [], dataY = [];
  function regenData() {
    dataT = []; dataY = [];
    for (let i = 0; i < nPoints; i++) {
      const t = T_RANGE[0] + (i + 0.5) / nPoints * (T_RANGE[1] - T_RANGE[0]);
      const noise = (pseudoRandom(i + 1) - 0.5) * 2 * noiseLevel;
      dataT.push(t);
      dataY.push(trueY(t) + noise);
    }
  }
  regenData();

  // ============== Linear algebra ==============
  function matZeros(rows, cols) {
    const m = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) row.push(0);
      m.push(row);
    }
    return m;
  }
  function matT(A) {
    const r = A.length, c = A[0].length;
    const T = matZeros(c, r);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = A[i][j];
    return T;
  }
  function matMul(A, B) {
    const r1 = A.length, c1 = A[0].length, c2 = B[0].length;
    const C = matZeros(r1, c2);
    for (let i = 0; i < r1; i++) for (let j = 0; j < c2; j++) {
      let s = 0;
      for (let k = 0; k < c1; k++) s += A[i][k] * B[k][j];
      C[i][j] = s;
    }
    return C;
  }
  function matAdd(A, B) {
    const r = A.length, c = A[0].length;
    const C = matZeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = A[i][j] + B[i][j];
    return C;
  }
  // Gauss-Jordan inverse
  function matInv(A) {
    const n = A.length;
    const M = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) row.push(A[i][j]);
      for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
      M.push(row);
    }
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-15) return null;
      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;
      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const f = M[k][i];
        for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j];
      }
    }
    const inv = matZeros(n, n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) inv[i][j] = M[i][j + n];
    return inv;
  }

  // Build polynomial design matrix X (N+1 features)
  function buildX(tArr, deg) {
    const X = matZeros(tArr.length, deg + 1);
    for (let i = 0; i < tArr.length; i++) {
      let p = 1;
      for (let j = 0; j <= deg; j++) {
        X[i][j] = p;
        p *= tArr[i];
      }
    }
    return X;
  }

  // Solve ridge: w = (X^T X + λI)^(-1) X^T y
  function solveRidge(tArr, yArr, deg, lam) {
    const X = buildX(tArr, deg);
    const Xt = matT(X);
    const XtX = matMul(Xt, X);
    // Add λI (don't regularize bias term [0][0]? — we apply to all for simplicity)
    const reg = matZeros(deg + 1, deg + 1);
    for (let i = 0; i < deg + 1; i++) reg[i][i] = lam;
    const A = matAdd(XtX, reg);
    const Ainv = matInv(A);
    if (!Ainv) return null;
    const Y = yArr.map(v => [v]);
    const XtY = matMul(Xt, Y);
    const w = matMul(Ainv, XtY);
    return w.map(r => r[0]);
  }

  // Evaluate poly at t
  function evalPoly(w, t) {
    let v = 0, p = 1;
    for (let i = 0; i < w.length; i++) { v += w[i] * p; p *= t; }
    return v;
  }

  // ============== Drawing ==============
  const mT = { top: 28, right: 20, bottom: 32, left: 50 };
  function pwT() { return canvasTop.width - mT.left - mT.right; }
  function phT() { return canvasTop.height - mT.top - mT.bottom; }
  function tToPx(t) { return mT.left + ((t - T_RANGE[0]) / (T_RANGE[1] - T_RANGE[0])) * pwT(); }
  function yToPx(y) { return mT.top + phT() - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * phT(); }

  function drawTop(wMLE, wMAP) {
    const ctx = cT;
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("진짜 함수: y = sin(2t)  |  차수 N=" + N + ", 데이터 " + nPoints + "점, λ=" + lambda.toExponential(1), mT.left, 18);

    // bg + grid
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mT.left, mT.top, pwT(), phT());
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let t = 0; t <= 3; t += 0.5) { ctx.beginPath(); ctx.moveTo(tToPx(t), mT.top); ctx.lineTo(tToPx(t), mT.top + phT()); ctx.stroke(); }
    for (let y = -1; y <= 1.5; y += 0.5) { ctx.beginPath(); ctx.moveTo(mT.left, yToPx(y)); ctx.lineTo(mT.left + pwT(), yToPx(y)); ctx.stroke(); }

    // axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mT.left, yToPx(0)); ctx.lineTo(mT.left + pwT(), yToPx(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mT.left, mT.top); ctx.lineTo(mT.left, mT.top + phT()); ctx.stroke();
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let t = 0; t <= 3; t += 0.5) ctx.fillText(t.toFixed(1), tToPx(t), mT.top + phT() + 14);
    ctx.textAlign = "right";
    for (let y = -1; y <= 1.5; y += 0.5) ctx.fillText(y.toFixed(1), mT.left - 4, yToPx(y) + 3);

    // 진짜 곡선 (회색 점선)
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); let first = true;
    for (let t = T_RANGE[0]; t <= T_RANGE[1]; t += 0.02) {
      const y = trueY(t);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke(); ctx.setLineDash([]);

    // MLE fit (빨간 점선)
    if (wMLE) {
      ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.beginPath(); first = true;
      for (let t = T_RANGE[0]; t <= T_RANGE[1]; t += 0.01) {
        const y = evalPoly(wMLE, t);
        if (y < Y_RANGE[0] - 1 || y > Y_RANGE[1] + 1) { first = true; continue; }
        if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    // MAP fit (보라 실선)
    if (wMAP) {
      ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2.5;
      ctx.beginPath(); first = true;
      for (let t = T_RANGE[0]; t <= T_RANGE[1]; t += 0.01) {
        const y = evalPoly(wMAP, t);
        if (y < Y_RANGE[0] - 1 || y > Y_RANGE[1] + 1) { first = true; continue; }
        if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
      }
      ctx.stroke();
    }

    // 데이터 점
    ctx.fillStyle = "#1d4ed8"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
    for (let i = 0; i < dataT.length; i++) {
      ctx.beginPath(); ctx.arc(tToPx(dataT[i]), yToPx(dataY[i]), 5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }

    // Legend
    const lgX = mT.left + pwT() - 200, lgY = mT.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(lgX, lgY, 195, 80);
    ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(lgX, lgY, 195, 80);
    ctx.font = "10px sans-serif"; ctx.textAlign = "left";

    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 14); ctx.lineTo(lgX + 18, lgY + 14); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#6b7280"; ctx.fillText("진짜 함수 sin(2t)", lgX + 22, lgY + 17);

    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(lgX + 12, lgY + 32, 3, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.fillText("관측 데이터 (노이즈)", lgX + 22, lgY + 35);

    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 50); ctx.lineTo(lgX + 18, lgY + 50); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626"; ctx.fillText("MLE (λ=0, overfit)", lgX + 22, lgY + 53);

    ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 68); ctx.lineTo(lgX + 18, lgY + 68); ctx.stroke();
    ctx.fillStyle = "#7e22ce"; ctx.fillText("MAP (λ=" + lambda.toExponential(1) + ")", lgX + 22, lgY + 71);
  }

  function drawBot(wMLE, wMAP) {
    const ctx = cB;
    ctx.clearRect(0, 0, canvasBot.width, canvasBot.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("계수 wᵢ 비교 (MLE vs MAP)", 20, 18);

    const mB = { top: 30, right: 20, bottom: 28, left: 50 };
    const pwB = canvasBot.width - mB.left - mB.right;
    const phB = canvasBot.height - mB.top - mB.bottom;
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mB.left, mB.top, pwB, phB);

    // 계수 절댓값 의 max (스케일링)
    const allW = (wMLE || []).concat(wMAP || []);
    const maxAbs = Math.max(...allW.map(Math.abs), 1);
    const useLog = maxAbs > 100;
    function transform(v) {
      if (useLog) return Math.sign(v) * Math.log10(1 + Math.abs(v)) / Math.log10(1 + maxAbs);
      return v / maxAbs;
    }

    const nBars = N + 1;
    const groupW = pwB / Math.max(nBars, 1);
    const barW = groupW * 0.35;

    // x축 (0 line)
    const zeroY = mB.top + phB / 2;
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mB.left, zeroY); ctx.lineTo(mB.left + pwB, zeroY); ctx.stroke();

    for (let i = 0; i <= N; i++) {
      const xCenter = mB.left + (i + 0.5) * groupW;

      // MLE 막대 (빨강, 왼쪽)
      if (wMLE) {
        const v = transform(wMLE[i]);
        const h = v * (phB / 2 - 5);
        ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
        ctx.fillRect(xCenter - barW, zeroY - h, barW, h);
      }

      // MAP 막대 (보라, 오른쪽)
      if (wMAP) {
        const v = transform(wMAP[i]);
        const h = v * (phB / 2 - 5);
        ctx.fillStyle = "rgba(126, 34, 206, 0.85)";
        ctx.fillRect(xCenter, zeroY - h, barW, h);
      }

      // 라벨
      ctx.fillStyle = "#6b7280"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("w" + i, xCenter, mB.top + phB + 12);
    }

    // 스케일 표시
    if (useLog) {
      ctx.fillStyle = "#6b7280"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("(log scale, max=" + maxAbs.toExponential(1) + ")", canvasBot.width - 10, 14);
    } else {
      ctx.fillStyle = "#6b7280"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("max=" + maxAbs.toFixed(2), canvasBot.width - 10, 14);
    }
  }

  function drawAll() {
    const wMLE = solveRidge(dataT, dataY, N, 1e-12);  // 사실상 0
    const wMAP = solveRidge(dataT, dataY, N, lambda);
    drawTop(wMLE, wMAP);
    drawBot(wMLE, wMAP);
  }

  // ============== Controls ==============
  const controls = document.createElement("div");
  controls.style.cssText = "margin-top:8px; padding:10px; background:#f6f8fa; border-radius:6px; font-family:sans-serif; font-size:13px;";
  container.appendChild(controls);

  function makeRow(labelText, min, max, step, val, fmt, onChange) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:10px; margin-bottom:6px; align-items:center;";
    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    lbl.style.cssText = "font-weight:500; min-width:100px;";
    row.appendChild(lbl);
    const slider = document.createElement("input");
    slider.type = "range"; slider.min = min; slider.max = max; slider.step = step; slider.value = val;
    slider.style.cssText = "flex:1;";
    row.appendChild(slider);
    const valSpan = document.createElement("span");
    valSpan.textContent = fmt(val);
    valSpan.style.cssText = "font-family:monospace; min-width:80px; text-align:right;";
    row.appendChild(valSpan);
    slider.addEventListener("input", () => {
      const v = parseFloat(slider.value);
      valSpan.textContent = fmt(v);
      onChange(v);
    });
    controls.appendChild(row);
    return slider;
  }

  makeRow("차수 N:", 0, 12, 1, N, v => v.toString(), v => { N = Math.round(v); drawAll(); });
  makeRow("데이터 점 수:", 3, 30, 1, nPoints, v => v.toString(), v => { nPoints = Math.round(v); regenData(); drawAll(); });

  // λ 는 log scale
  const lambdaExp = makeRow("log₁₀(λ):", -8, 2, 0.1, Math.log10(lambda), v => "λ=" + Math.pow(10, v).toExponential(1), v => {
    lambda = Math.pow(10, v);
    drawAll();
  });

  makeRow("노이즈:", 0, 0.5, 0.01, noiseLevel, v => v.toFixed(2), v => { noiseLevel = v; regenData(); drawAll(); });

  // Buttons
  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;";
  controls.appendChild(btnRow);

  function makeBtn(text, color, onClick) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cssText = "padding:6px 12px; background:" + color + "; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px; font-weight:500;";
    b.addEventListener("click", onClick);
    btnRow.appendChild(b);
    return b;
  }

  makeBtn("Overfit 시나리오 (N=10, 5점, λ=0)", "#dc2626", () => {
    N = 10; nPoints = 5; lambda = 1e-12; noiseLevel = 0.15;
    regenData(); drawAll();
    const sliders = controls.querySelectorAll("input[type=range]");
    sliders[0].value = N; sliders[0].nextElementSibling.textContent = N.toString();
    sliders[1].value = nPoints; sliders[1].nextElementSibling.textContent = nPoints.toString();
    sliders[2].value = -12; sliders[2].nextElementSibling.textContent = "λ=" + (1e-12).toExponential(1);
    sliders[3].value = 0.15; sliders[3].nextElementSibling.textContent = (0.15).toFixed(2);
  });

  makeBtn("MAP 살림 (N=10, 5점, λ=0.01)", "#7e22ce", () => {
    N = 10; nPoints = 5; lambda = 0.01; noiseLevel = 0.15;
    regenData(); drawAll();
    const sliders = controls.querySelectorAll("input[type=range]");
    sliders[0].value = N; sliders[0].nextElementSibling.textContent = N.toString();
    sliders[1].value = nPoints; sliders[1].nextElementSibling.textContent = nPoints.toString();
    sliders[2].value = -2; sliders[2].nextElementSibling.textContent = "λ=" + (0.01).toExponential(1);
    sliders[3].value = 0.15; sliders[3].nextElementSibling.textContent = (0.15).toFixed(2);
  });

  makeBtn("↻ Reset", "#6b7280", () => {
    N = 10; nPoints = 6; lambda = 1e-3; noiseLevel = 0.15;
    regenData(); drawAll();
    const sliders = controls.querySelectorAll("input[type=range]");
    sliders[0].value = N; sliders[0].nextElementSibling.textContent = N.toString();
    sliders[1].value = nPoints; sliders[1].nextElementSibling.textContent = nPoints.toString();
    sliders[2].value = -3; sliders[2].nextElementSibling.textContent = "λ=" + (1e-3).toExponential(1);
    sliders[3].value = 0.15; sliders[3].nextElementSibling.textContent = (0.15).toFixed(2);
  });

  // 안내
  const note = document.createElement("div");
  note.style.cssText = "margin-top:8px; padding:6px 8px; background:#fef3c7; border-left:3px solid #f59e0b; font-size:11px; color:#78350f;";
  note.textContent = "★ 실험: (1) 'Overfit 시나리오' → MLE(빨강) 가 미친 듯이 흔들림, 계수 폭발. (2) 'MAP 살림' → 같은 조건에서 MAP(보라) 부드러운 fit. (3) 데이터 점 수 늘리면 둘 다 안정. λ 너무 크면 둘 다 underfit (직선).";
  container.appendChild(note);

  drawAll();
})();
