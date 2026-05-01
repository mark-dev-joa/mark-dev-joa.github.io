// WLS 인터랙티브 데모
// 모델: ŷ = e^(-w*t)
// 5 데이터 점, 각 점의 σᵢ 슬라이더, OLS vs WLS 비교
(function () {
  const container = document.getElementById("wls-demo");
  if (!container) return;

  const width = container.clientWidth;
  function makeCanvas(h) {
    const c = document.createElement("canvas");
    c.width = width; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }

  const canvasTop = makeCanvas(320);  // (t, y) + 종 + fits
  const canvasBot = makeCanvas(160);  // 가중치 막대
  const cT = canvasTop.getContext("2d");
  const cB = canvasBot.getContext("2d");

  // === Setup ===
  const W_TRUE = 0.5;
  const T_DATA = [0, 1, 2, 3, 4];
  const NOISE = [0.05, -0.06, 0.04, -0.03, 0.05];
  let Y_DATA = T_DATA.map((t, i) => Math.exp(-W_TRUE * t) + NOISE[i]);
  let outlierOn = false;
  const OUTLIER_Y = 1.4;  // 점 3 (t=3) 을 1.4 로 (원래 0.22)
  function applyOutlier() {
    Y_DATA = T_DATA.map((t, i) => Math.exp(-W_TRUE * t) + NOISE[i]);
    if (outlierOn) Y_DATA[3] = OUTLIER_Y;
  }

  // 각 점의 σᵢ (초기값)
  let sigmas = [0.05, 0.05, 0.05, 0.05, 0.05];

  // === Helpers ===
  function model(t, w) { return Math.exp(-w * t); }
  function residual(w) { return Y_DATA.map((y, i) => y - model(T_DATA[i], w)); }

  function sse(w) {
    return residual(w).reduce((s, e) => s + e * e, 0);
  }
  function wls(w) {
    const r = residual(w);
    let s = 0;
    for (let i = 0; i < r.length; i++) {
      const wi = 1 / (sigmas[i] * sigmas[i]);
      s += wi * r[i] * r[i];
    }
    return s;
  }

  // 1D grid search 로 최소점 찾기 (빠르고 정확)
  function findMin(fn, wMin, wMax, steps) {
    let bestW = wMin, bestVal = Infinity;
    for (let i = 0; i <= steps; i++) {
      const w = wMin + (i / steps) * (wMax - wMin);
      const v = fn(w);
      if (v < bestVal) { bestVal = v; bestW = w; }
    }
    // refine
    const dw = (wMax - wMin) / steps;
    return findMinRefine(fn, bestW - dw, bestW + dw, 50, 0);
  }
  function findMinRefine(fn, wMin, wMax, steps, depth) {
    if (depth > 4) return (wMin + wMax) / 2;
    let bestW = wMin, bestVal = Infinity;
    for (let i = 0; i <= steps; i++) {
      const w = wMin + (i / steps) * (wMax - wMin);
      const v = fn(w);
      if (v < bestVal) { bestVal = v; bestW = w; }
    }
    const dw = (wMax - wMin) / steps;
    return findMinRefine(fn, bestW - dw, bestW + dw, 50, depth + 1);
  }

  function gauss(y, mu, s) {
    return Math.exp(-((y - mu) ** 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s);
  }

  // ============== TOP canvas ==============
  const mT = { top: 30, right: 20, bottom: 36, left: 50 };
  function pwT() { return canvasTop.width - mT.left - mT.right; }
  function phT() { return canvasTop.height - mT.top - mT.bottom; }
  const T_RANGE = [-0.3, 5];
  const Y_RANGE = [-0.3, 1.7];
  function tToPx(t) { return mT.left + ((t - T_RANGE[0]) / (T_RANGE[1] - T_RANGE[0])) * pwT(); }
  function yToPx(y) { return mT.top + phT() - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * phT(); }

  function drawTop(wOLS, wWLS) {
    const ctx = cT;
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height);

    // Title
    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("ŷ = e^(−w·t)  |  outlier: " + (outlierOn ? "ON" : "OFF"), mT.left, 18);
    ctx.fillStyle = "#dc2626";
    ctx.fillText("OLS w*=" + wOLS.toFixed(3), mT.left + 280, 18);
    ctx.fillStyle = "#7e22ce";
    ctx.fillText("WLS w*=" + wWLS.toFixed(3), mT.left + 410, 18);

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

    // 각 점 위 가우시안 종 (수평 폭이 PDF 값에 비례)
    for (let i = 0; i < T_DATA.length; i++) {
      const ti = T_DATA[i];
      const sigma = sigmas[i];
      // 종의 중심 = 모델값 (WLS fit 기준)
      const muY = model(ti, wWLS);
      const px = tToPx(ti);
      ctx.fillStyle = "rgba(22, 163, 74, 0.13)";
      ctx.strokeStyle = "rgba(22, 163, 74, 0.4)"; ctx.lineWidth = 1;
      ctx.beginPath();
      const NPTS = 50;
      const yMin = muY - 4 * sigma, yMax = muY + 4 * sigma;
      const pdfMax = gauss(muY, muY, sigma);
      const widthScale = 22 / pdfMax;
      let firstPt = true;
      for (let j = 0; j <= NPTS; j++) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const off = gauss(yy, muY, sigma) * widthScale;
        const py = yToPx(yy);
        if (py < mT.top || py > mT.top + phT()) continue;
        if (firstPt) { ctx.moveTo(px + off, py); firstPt = false; } else ctx.lineTo(px + off, py);
      }
      for (let j = NPTS; j >= 0; j--) {
        const yy = yMin + (j / NPTS) * (yMax - yMin);
        const off = gauss(yy, muY, sigma) * widthScale;
        const py = yToPx(yy);
        if (py < mT.top || py > mT.top + phT()) continue;
        ctx.lineTo(px - off, py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // OLS fit 곡선 (빨강 점선)
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); let first = true;
    for (let t = 0; t <= 5; t += 0.05) {
      const y = model(t, wOLS);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke(); ctx.setLineDash([]);

    // WLS fit 곡선 (보라 실선)
    ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2.5;
    ctx.beginPath(); first = true;
    for (let t = 0; t <= 5; t += 0.05) {
      const y = model(t, wWLS);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke();

    // 데이터 점
    for (let i = 0; i < T_DATA.length; i++) {
      const isOutlier = outlierOn && i === 3;
      ctx.fillStyle = isOutlier ? "#ea580c" : "#1d4ed8";
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(tToPx(T_DATA[i]), yToPx(Y_DATA[i]), 5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }

    // Legend
    const lgX = mT.left + pwT() - 220, lgY = mT.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(lgX, lgY, 215, 80);
    ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(lgX, lgY, 215, 80);
    ctx.font = "10px sans-serif"; ctx.textAlign = "left";
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(lgX + 12, lgY + 13, 3, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.fillText("데이터 yᵢ (outlier=주황)", lgX + 22, lgY + 16);
    ctx.fillStyle = "rgba(22, 163, 74, 0.4)"; ctx.fillRect(lgX + 6, lgY + 28, 14, 8);
    ctx.fillStyle = "#15803d"; ctx.fillText("가우시안 종 (σᵢ)", lgX + 22, lgY + 35);
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 50); ctx.lineTo(lgX + 18, lgY + 50); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626"; ctx.fillText("OLS (모두 가중 1)", lgX + 22, lgY + 53);
    ctx.strokeStyle = "#7e22ce"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lgX + 6, lgY + 67); ctx.lineTo(lgX + 18, lgY + 67); ctx.stroke();
    ctx.fillStyle = "#7e22ce"; ctx.fillText("WLS (1/σᵢ² 가중)", lgX + 22, lgY + 70);
  }

  // ============== BOT canvas — 가중치 막대 ==============
  const mB = { top: 30, right: 20, bottom: 30, left: 50 };
  function pwB() { return canvasBot.width - mB.left - mB.right; }
  function phB() { return canvasBot.height - mB.top - mB.bottom; }

  function drawBot() {
    const ctx = cB;
    ctx.clearRect(0, 0, canvasBot.width, canvasBot.height);

    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("가중치 wᵢ = 1/σᵢ²  (높이가 신뢰도)", mB.left, 18);

    // bg
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mB.left, mB.top, pwB(), phB());

    // 각 점의 가중치
    const weights = sigmas.map(s => 1 / (s * s));
    const wMax = Math.max(...weights, 1);
    const logScale = wMax > 100;  // 큰 차이는 log 스케일
    const transform = (w) => logScale ? Math.log10(1 + w) / Math.log10(1 + wMax) : w / wMax;

    const barW = pwB() / 7;  // 5 점 + 약간 여백
    for (let i = 0; i < 5; i++) {
      const wi = weights[i];
      const h = transform(wi) * (phB() - 30);
      const xLeft = mB.left + (i + 1) * barW;

      // 막대
      const isOutlier = outlierOn && i === 3;
      ctx.fillStyle = isOutlier ? "#ea580c" : "#0969da";
      ctx.fillRect(xLeft, mB.top + phB() - h, barW * 0.7, h);

      // 라벨 (점 인덱스)
      ctx.fillStyle = "#374151"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("점 " + (i + 1) + " (t=" + T_DATA[i] + ")", xLeft + barW * 0.35, mB.top + phB() + 14);

      // 값 표시 위
      ctx.fillStyle = "#374151"; ctx.font = "10px monospace";
      ctx.fillText("w=" + wi.toExponential(1), xLeft + barW * 0.35, mB.top + phB() - h - 4);
    }

    if (logScale) {
      ctx.fillStyle = "#6b7280"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("(log scale)", canvasBot.width - 10, 14);
    }
  }

  function drawAll() {
    applyOutlier();
    const wOLS = findMin(sse, -0.3, 3.0, 200);
    const wWLS = findMin(wls, -0.3, 3.0, 200);
    drawTop(wOLS, wWLS);
    drawBot();
  }

  // ============== Controls ==============
  const controls = document.createElement("div");
  controls.style.cssText = "margin-top:8px; padding:10px; background:#f6f8fa; border-radius:6px; font-family:sans-serif; font-size:13px;";
  container.appendChild(controls);

  // 5개 σ 슬라이더
  for (let i = 0; i < 5; i++) {
    const idx = i;
    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:10px; margin-bottom:5px; align-items:center;";
    const lbl = document.createElement("label");
    lbl.textContent = "σ_" + (idx + 1) + " (t=" + T_DATA[idx] + "):";
    lbl.style.cssText = "font-weight:500; min-width:90px;";
    row.appendChild(lbl);
    const slider = document.createElement("input");
    slider.type = "range"; slider.min = 0.01; slider.max = 2.0; slider.step = 0.01;
    slider.value = sigmas[idx];
    slider.style.cssText = "flex:1;";
    row.appendChild(slider);
    const valSpan = document.createElement("span");
    valSpan.textContent = sigmas[idx].toFixed(2);
    valSpan.style.cssText = "font-family:monospace; min-width:50px; text-align:right;";
    row.appendChild(valSpan);
    slider.addEventListener("input", () => {
      sigmas[idx] = parseFloat(slider.value);
      valSpan.textContent = sigmas[idx].toFixed(2);
      drawAll();
    });
    controls.appendChild(row);
  }

  // 버튼들
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

  const outlierBtn = makeBtn("Outlier 추가 (점 4)", "#ea580c", () => {
    outlierOn = !outlierOn;
    outlierBtn.textContent = outlierOn ? "Outlier 제거" : "Outlier 추가 (점 4)";
    drawAll();
  });

  makeBtn("점 4 σ 키우기 (5.0)", "#7e22ce", () => {
    sigmas[3] = 5.0;
    // 슬라이더는 max 2.0 이라 표시는 max
    const sliders = controls.querySelectorAll("input[type=range]");
    sliders[3].value = 2.0;
    sliders[3].nextElementSibling.textContent = sigmas[3].toFixed(2);
    drawAll();
  });

  makeBtn("↻ Reset", "#6b7280", () => {
    sigmas = [0.05, 0.05, 0.05, 0.05, 0.05];
    outlierOn = false;
    outlierBtn.textContent = "Outlier 추가 (점 4)";
    const sliders = controls.querySelectorAll("input[type=range]");
    sliders.forEach((s, i) => {
      s.value = sigmas[i];
      s.nextElementSibling.textContent = sigmas[i].toFixed(2);
    });
    drawAll();
  });

  // 안내
  const note = document.createElement("div");
  note.style.cssText = "margin-top:8px; padding:6px 8px; background:#fef3c7; border-left:3px solid #f59e0b; font-size:11px; color:#78350f;";
  note.textContent = "★ 실험: (1) 'Outlier 추가' → OLS(빨강) 가 outlier 쪽으로 끌림. (2) '점 4 σ 키우기' → WLS(보라) 가 outlier 무시 → 정답 곡선 유지. σ 작음 = 신뢰도 ↑ = 가중치 ↑.";
  container.appendChild(note);

  drawAll();
})();
