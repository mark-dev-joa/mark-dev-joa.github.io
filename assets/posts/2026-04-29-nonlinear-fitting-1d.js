// Nonlinear Fitting 1D Demo
// Model: y = exp(-w * t)  (single parameter w)
// Visualizes: SSE(w) curve + current w_n + tangent + local quadratic + next w_{n+1}
(function () {
  const container = document.getElementById("nonlinear-fitting-1d-demo");
  if (!container) return;

  const width = container.clientWidth;
  container.style.height = "auto";

  // Two canvas layout: top = (t, y), bottom = (w, SSE)
  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.style.cssText = "width:100%; height:" + h + "px; background:#fff; border-radius:6px; display:block; margin-bottom:8px;";
    container.appendChild(c);
    return c;
  }

  const canvasTop = makeCanvas(width, 220);  // (t, y)
  const canvasBot = makeCanvas(width, 420);  // (w, SSE)
  const ctxTop = canvasTop.getContext("2d");
  const ctxBot = canvasBot.getContext("2d");

  // === Setup ===
  const W_TRUE = 0.5;
  const T_DATA = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5];
  // 노이즈 ~ ±0.10 (이전 ±0.05 의 2배)
  const NOISE = [0.09, -0.11, 0.08, -0.07, 0.10, -0.09, 0.06, -0.10, 0.08, -0.05];
  const Y_DATA = T_DATA.map((t, i) => Math.exp(-W_TRUE * t) + NOISE[i]);

  // === State ===
  let w = 1.5;      // current parameter (single)
  let wPrev = null;
  let wNext = null;
  let dwNext = null;
  let trajectory = [1.5];
  let iterCount = 0;
  let statusMsg = "초기 위치 설정";
  let autoInterval = null;
  let converged = false;
  let convergeReason = "";
  let diverged = false;
  let divergeReason = "";
  // 알고리즘: "gn" | "newton" | "lm" | "newton-lm" | "dl" (dogleg)
  let algo = "gn";
  // LM 상태
  let lambda = 0.01;          // LM 댐핑 파라미터
  let lambdaReason = "";      // λ 변화 이유
  // Dogleg 상태
  let trustRadius = 1.0;      // 신뢰 반경 Δ
  let trustReason = "";       // Δ 변화 이유
  let lastRho = null;         // 마지막 ρ (실제감소/예측감소)

  // === Model & derivatives (scalar) ===
  function model(t, ww) { return Math.exp(-ww * t); }
  function residual(ww) { return Y_DATA.map((y, i) => y - model(T_DATA[i], ww)); }
  function jacobian(ww) {
    // J_i = ∂e_i/∂w = t_i * exp(-w*t_i)
    return T_DATA.map(t => t * Math.exp(-ww * t));
  }
  function jacobianPrime(ww) {
    // J'_i = ∂²e_i/∂w² = -t_i² * exp(-w*t_i)
    return T_DATA.map(t => -t * t * Math.exp(-ww * t));
  }
  function sse(ww) { return residual(ww).reduce((s, e) => s + e * e, 0); }

  // GN: Δw = -J^Te / J^TJ
  // LM: Δw = -J^Te / (J^TJ + λ)
  function computeNext(ww) {
    const e = residual(ww);
    const J = jacobian(ww);
    let JtJ = 0, Jte = 0;
    for (let i = 0; i < J.length; i++) { JtJ += J[i] * J[i]; Jte += J[i] * e[i]; }
    let denom = JtJ;
    if (algo === "lm") denom = JtJ + lambda;
    // Newton: 진짜 헤시안 H = 2·Σ J² + 2·Σ e·J' (스케일은 G 와 같이 2 곱하니 약분됨)
    // 우리는 G/H 만 쓰니 스케일 무시: H_scaled = ΣJ² + Σe·J'
    if (algo === "newton" || algo === "newton-lm") {
      const Jp = jacobianPrime(ww);
      let extra = 0;
      for (let i = 0; i < J.length; i++) extra += e[i] * Jp[i];
      denom = JtJ + extra;
      if (algo === "newton-lm") denom += lambda;  // ★ 진짜 H 에 λ 더함
    }
    if (Math.abs(denom) < 1e-12) return null;
    let dw = -Jte / denom;
    // Dogleg: GN 스텝을 신뢰 반경 Δ 로 클립 (1D 에선 GN 방향 == Cauchy 방향)
    if (algo === "dl") {
      const dwGN = -Jte / JtJ;  // 순수 GN 스텝
      if (Math.abs(dwGN) <= trustRadius) {
        dw = dwGN;  // 안전 영역 안 → 그대로
      } else {
        dw = Math.sign(dwGN) * trustRadius;  // 반경 끝까지만
      }
    }
    return { wNext: ww + dw, dw: dw, JtJ: JtJ, Jte: Jte, denom: denom };
  }

  // === Local quadratic approximation ===
  // SSE_local(Δw) = ‖e + J·Δw‖² = a + 2b·Δw + c·Δw²
  // where a = Σe², b = Σe·J, c = Σ J²
  // In terms of w: Q(w) = a + 2b(w-wn) + c(w-wn)²
  function localQuadratic(wQuery, wn) {
    const e = residual(wn);
    const J = jacobian(wn);
    let a = 0, b = 0, c = 0;
    for (let i = 0; i < J.length; i++) { a += e[i]*e[i]; b += e[i]*J[i]; c += J[i]*J[i]; }
    const dw = wQuery - wn;
    return a + 2*b*dw + c*dw*dw;
  }

  // Gradient of SSE at w (for tangent line)
  function sseGradient(ww) {
    // dE/dw = -2 Σ e_i * J_i  (since ∂e_i/∂w = -J_i ... wait, recheck)
    // Actually e_i = y_i - exp(-w t_i), so ∂e_i/∂w = t_i exp(-w t_i) = J_i (positive)
    // dE/dw = Σ 2 e_i (∂e_i/∂w) = 2 Σ e_i J_i
    const e = residual(ww);
    const J = jacobian(ww);
    let g = 0;
    for (let i = 0; i < J.length; i++) g += e[i] * J[i];
    return 2 * g;
  }

  function gaussNewtonStep() {
    if (converged) {
      statusMsg = "이미 수렴됨 — Reset 으로 새로 시작";
      drawAll(); return;
    }
    if (diverged) {
      statusMsg = "이미 발산 — Reset 으로 새로 시작";
      drawAll(); return;
    }
    const result = computeNext(w);
    if (!result) {
      statusMsg = "⚠ 분모 ≈ 0, 발산 위험";
      drawAll(); return;
    }
    const wTry = result.wNext;
    const sseBefore = sse(w);
    const sseAfter = sse(wTry);

    let stepAccepted = false;

    if (algo === "lm" || algo === "newton-lm") {
      // LM / Newton-LM: 적응형 λ
      const tag = algo === "newton-lm" ? "[N-LM] " : "";
      if (sseAfter < sseBefore) {
        wPrev = w; w = wTry; trajectory.push(w); iterCount++;
        stepAccepted = true;
        const oldL = lambda;
        lambda = Math.max(lambda / 10, 1e-7);
        lambdaReason = tag + "SSE ↓ → λ ÷10 (" + oldL.toFixed(4) + " → " + lambda.toFixed(4) + ")";
        statusMsg = "iter " + iterCount + " ✓ — SSE = " + sseAfter.toFixed(4);
      } else {
        const oldL = lambda;
        lambda = Math.min(lambda * 10, 1e10);
        lambdaReason = tag + "SSE ↑ → 스텝 거부, λ ×10 (" + oldL.toFixed(4) + " → " + lambda.toFixed(4) + ")";
        statusMsg = "iter " + iterCount + " ⚠ 거부 (SSE 증가)";
      }
    } else if (algo === "dl") {
      // Dogleg: ρ 로 신뢰 반경 Δ 갱신
      const qBefore = localQuadratic(w, w);            // = SSE(w)
      const qAfter  = localQuadratic(wTry, w);         // 2차 근사 예측
      const actualReduction = sseBefore - sseAfter;
      const predictedReduction = qBefore - qAfter;
      const rho = predictedReduction !== 0 ? actualReduction / predictedReduction : 0;
      lastRho = rho;
      const oldT = trustRadius;
      if (rho > 0.75) {
        trustRadius = Math.min(trustRadius * 2, 100);
        trustReason = "ρ=" + rho.toFixed(2) + " > 0.75 → Δ ×2 (" + oldT.toFixed(3) + " → " + trustRadius.toFixed(3) + ")";
      } else if (rho < 0.25) {
        trustRadius = Math.max(trustRadius / 4, 1e-4);
        trustReason = "ρ=" + rho.toFixed(2) + " < 0.25 → Δ ÷4 (" + oldT.toFixed(3) + " → " + trustRadius.toFixed(3) + ")";
      } else {
        trustReason = "ρ=" + rho.toFixed(2) + " (0.25~0.75) → Δ 유지";
      }
      if (rho > 0) {
        wPrev = w; w = wTry; trajectory.push(w); iterCount++;
        stepAccepted = true;
        statusMsg = "iter " + iterCount + " ✓ — SSE = " + sseAfter.toFixed(4);
      } else {
        statusMsg = "iter " + iterCount + " ⚠ 거부 (ρ ≤ 0)";
      }
    } else {
      // GN / Newton: 무조건 점프
      wPrev = w; w = wTry; trajectory.push(w); iterCount++;
      stepAccepted = true;
      const hWarn = (algo === "newton" && result.denom < 0) ? " ⚠ H<0 (위험!)" : "";
      statusMsg = "iter " + iterCount + " — SSE = " + sseAfter.toFixed(4) + hWarn;
    }

    // === 진짜 수렴 체크 ===
    // 유일한 진짜 신호: |G| ≈ 0 (그래디언트 0 = 정상점)
    // 다른 신호 (|Δw|, ΔSSE) 들은 stuck/잘못된 방향에서도 트리거되므로 부신호로만 사용.
    if (stepAccepted) {
      const sseNow = sse(w);
      const Gnow = Math.abs(sseGradient(w));
      const dwMag = Math.abs(result.dw);
      const TOL_G  = 1e-4;
      const TOL_DW = 1e-7;
      // 초기 SSE 와 비교 (진짜 최소인지 검증용)
      const sseInit = sse(trajectory[0]);
      let why = null;
      let isReallyMin = false;
      // "진짜 최소" 판단: SSE 가 노이즈 수준이거나 (절대), 또는 충분히 감소함 (상대)
      // 노이즈 floor: 10점 × ±0.1 → Σnoise² ≈ 0.1 정도, 안전하게 0.5 잡음
      const nearNoiseFloor = sseNow < 0.5;
      const droppedALot = sseInit > 0.5 && sseNow < sseInit * 0.3;
      const reasonableW = Math.abs(w) < 20;
      const looksLikeMin = (nearNoiseFloor || droppedALot) && reasonableW;
      if (Gnow < TOL_G) {
        if (looksLikeMin) {
          isReallyMin = true;
          why = "|G| = " + Gnow.toExponential(2) + " < 1e-4, SSE=" + sseNow.toFixed(3) + " (진짜 최솟값)";
        } else {
          // |G|≈0 이지만 SSE 큼 → saturation (Newton 이 ∞ 로 도망)
          diverged = true;
          divergeReason = "⚠ 수렴 실패 — |G|≈0 이지만 SSE=" + sseNow.toFixed(2)
                        + " 초기(" + sseInit.toFixed(2) + ") · w=" + w.toFixed(2)
                        + " · 모델이 saturation (정답 아님)";
          statusMsg = divergeReason;
          stopAuto();
        }
      } else if (dwMag < TOL_DW && Gnow < 1e-2 && looksLikeMin) {
        isReallyMin = true;
        why = "|Δw| < 1e-7 + |G| 작음 + SSE 충분히 작음";
      }
      if (isReallyMin) {
        converged = true;
        convergeReason = why;
        statusMsg = "✓ 수렴 (" + iterCount + " iter) — " + why + ", SSE=" + sseNow.toFixed(6);
        stopAuto();
      }
    }

    // === 발산 / 수렴 실패 감지 (수렴 체크에서 이미 처리되지 않은 경우만) ===
    if (!converged && !diverged) {
      const sseNow = sse(w);
      const Gnow = Math.abs(sseGradient(w));
      if (!isFinite(w) || !isFinite(sseNow)) {
        diverged = true;
        divergeReason = "✗ 발산 — NaN/Infinity 발생";
      } else if (Math.abs(w) > 100) {
        diverged = true;
        divergeReason = "✗ 발산 — |w| > 100 (현재 w=" + w.toFixed(2) + "), 정답 0.5 에서 너무 멈";
      } else if (sseNow > 1e6) {
        diverged = true;
        divergeReason = "✗ 발산 — SSE = " + sseNow.toExponential(2) + " 폭발";
      } else if (algo === "newton" && iterCount >= 3 && sseNow > sseBefore * 5) {
        diverged = true;
        divergeReason = "✗ 발산 — Newton SSE 급증 (" + sseBefore.toFixed(2) + " → " + sseNow.toFixed(2) + ")";
      } else if (iterCount >= 50) {
        // Max iter 도달했는데 수렴 안 됨 → 실패
        diverged = true;
        divergeReason = "⚠ 수렴 실패 — 50 iter 도달, |G|=" + Gnow.toExponential(2) + " (여전히 큼)";
      } else if (lambda >= 1e10) {
        // LM 의 λ 가 max 에 닿음 → stuck
        diverged = true;
        divergeReason = "⚠ 수렴 실패 — λ 가 max(1e10) 도달, 더 못 움직임";
      }
      if (diverged) {
        statusMsg = divergeReason + " (" + iterCount + " iter)";
        stopAuto();
      }
    }

    const nxt = computeNext(w);
    wNext = nxt ? nxt.wNext : null;
    dwNext = nxt ? nxt.dw : null;
    drawAll();
  }

  function reset(wInit) {
    w = wInit !== undefined ? wInit : 1.5;
    wPrev = null;
    trajectory = [w];
    lambda = 0.01;
    trustRadius = 1.0;
    lastRho = null;
    if (algo === "lm") { lambdaReason = "λ 초기값 0.01"; trustReason = ""; }
    else if (algo === "newton-lm") { lambdaReason = "[N-LM] λ 초기값 0.01 (진짜 H + λ)"; trustReason = ""; }
    else if (algo === "dl") { trustReason = "Δ 초기값 1.0"; lambdaReason = ""; }
    else if (algo === "newton") { lambdaReason = "(Newton: 진짜 H = 2ΣJ² + 2Σe·J')"; trustReason = ""; }
    else { lambdaReason = "(GN: λ 없음)"; trustReason = ""; }
    const r = computeNext(w);
    wNext = r ? r.wNext : null;
    dwNext = r ? r.dw : null;
    iterCount = 0;
    converged = false;
    convergeReason = "";
    diverged = false;
    divergeReason = "";
    statusMsg = "초기 위치 설정 (w = " + w.toFixed(2) + ")";
    stopAuto();
    drawAll();
  }

  // ============ TOP: (t, y) ============
  const mT = { top: 28, right: 20, bottom: 30, left: 50 };
  function pwT() { return canvasTop.width - mT.left - mT.right; }
  function phT() { return canvasTop.height - mT.top - mT.bottom; }
  const T_RANGE = [-0.3, 5];
  const Y_RANGE = [-0.15, 1.4];
  function tToPx(t) { return mT.left + ((t - T_RANGE[0]) / (T_RANGE[1] - T_RANGE[0])) * pwT(); }
  function yToPx(y) { return mT.top + phT() - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * phT(); }

  function drawTop() {
    const ctx = ctxTop;
    ctx.clearRect(0, 0, canvasTop.width, canvasTop.height);

    // Title — 모델 식 (현재 wₙ 은 범례에 표시됨)
    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("(t, y) 모델: ŷ = e^(−w·t)", mT.left, 18);
    ctx.fillStyle = "#1d4ed8";  // 파랑 (정답)
    ctx.fillText("★ 정답 w* = " + W_TRUE, mT.left + 195, 18);

    // Bg
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mT.left, mT.top, pwT(), phT());

    // Grid
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    for (let t = 0; t <= 5; t += 1) { ctx.beginPath(); ctx.moveTo(tToPx(t), mT.top); ctx.lineTo(tToPx(t), mT.top + phT()); ctx.stroke(); }
    for (let y = 0; y <= 1.2; y += 0.5) { ctx.beginPath(); ctx.moveTo(mT.left, yToPx(y)); ctx.lineTo(mT.left + pwT(), yToPx(y)); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mT.left, yToPx(0)); ctx.lineTo(mT.left + pwT(), yToPx(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tToPx(0), mT.top); ctx.lineTo(tToPx(0), mT.top + phT()); ctx.stroke();

    // Tick labels
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let t = 0; t <= 5; t += 1) ctx.fillText(t.toString(), tToPx(t), yToPx(0) + 14);
    ctx.textAlign = "right";
    for (let y = 0; y <= 1.2; y += 0.5) ctx.fillText(y.toFixed(1), tToPx(0) - 4, yToPx(y) + 3);

    // Current curve
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5;
    ctx.beginPath(); let first = true;
    for (let t = 0; t <= 5; t += 0.05) {
      const y = model(t, w);
      if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
    }
    ctx.stroke();

    // Next curve
    if (wNext) {
      ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); first = true;
      for (let t = 0; t <= 5; t += 0.05) {
        const y = model(t, wNext);
        if (first) { ctx.moveTo(tToPx(t), yToPx(y)); first = false; } else ctx.lineTo(tToPx(t), yToPx(y));
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    // Residuals
    ctx.lineWidth = 0.8;
    for (let i = 0; i < T_DATA.length; i++) {
      const yPred = model(T_DATA[i], w);
      const e_i = Y_DATA[i] - yPred;
      ctx.strokeStyle = e_i >= 0 ? "#f97316" : "#0891b2";
      ctx.beginPath(); ctx.moveTo(tToPx(T_DATA[i]), yToPx(Y_DATA[i])); ctx.lineTo(tToPx(T_DATA[i]), yToPx(yPred)); ctx.stroke();
    }

    // Data points
    ctx.fillStyle = "#1d4ed8"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
    for (let i = 0; i < T_DATA.length; i++) {
      ctx.beginPath(); ctx.arc(tToPx(T_DATA[i]), yToPx(Y_DATA[i]), 4, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }

    // Legend (top-right) — 모델 식 표기
    const legW = 230, legH = 65;
    const legX = mT.left + pwT() - legW - 5;
    const legY = mT.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(legX, legY, legW, legH);
    ctx.strokeStyle = "#d1d5db"; ctx.lineWidth = 0.8; ctx.strokeRect(legX, legY, legW, legH);

    ctx.font = "10px sans-serif"; ctx.textAlign = "left";

    // 데이터
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(legX + 12, legY + 13, 3, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#374151"; ctx.fillText("데이터 (관측 yᵢ)", legX + 20, legY + 16);

    // 현재 곡선 + 식
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(legX + 6, legY + 32); ctx.lineTo(legX + 18, legY + 32); ctx.stroke();
    ctx.fillStyle = "#dc2626";
    ctx.fillText("현재: y = e^(−wₙ·t),  wₙ = " + w.toFixed(3), legX + 22, legY + 35);

    // 다음 곡선 + 식
    if (wNext) {
      ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(legX + 6, legY + 51); ctx.lineTo(legX + 18, legY + 51); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#15803d";
      ctx.fillText("다음: y = e^(−wₙ₊₁·t), wₙ₊₁ = " + wNext.toFixed(3), legX + 22, legY + 54);
    }
  }

  // ============ BOTTOM: (w, SSE) — MAIN ============
  const mB = { top: 30, right: 20, bottom: 36, left: 60 };
  function pwB() { return canvasBot.width - mB.left - mB.right; }
  function phB() { return canvasBot.height - mB.top - mB.bottom; }
  // 고정 범위 (스케일 변경 X)
  const W_RANGE = [-10, 10];
  const SSE_Y_MAX_FIXED = 10.0;
  let SSE_Y_MAX = SSE_Y_MAX_FIXED;
  function sseToPx(s) { return mB.top + phB() - (s / SSE_Y_MAX) * phB(); }
  function wToPx(ww) { return mB.left + ((ww - W_RANGE[0]) / (W_RANGE[1] - W_RANGE[0])) * pwB(); }

  function drawBot() {
    const ctx = ctxBot;
    ctx.clearRect(0, 0, canvasBot.width, canvasBot.height);

    // 고정 스케일 (변경 안 함)
    SSE_Y_MAX = SSE_Y_MAX_FIXED;
    const sseAtCur = sse(w);

    // Title — SSE 식 + 현재 wₙ 의 SSE + iter (부각) + 수렴 표시
    ctx.fillStyle = "#374151"; ctx.font = "12px monospace"; ctx.textAlign = "left";
    ctx.fillText("SSE(w) = Σᵢ (yᵢ − e^(−w·tᵢ))²", mB.left, 18);
    ctx.fillStyle = "#dc2626";
    ctx.fillText("E(wₙ) = " + sseAtCur.toFixed(3), mB.left + 245, 18);

    // iter 카운터 — 우측 상단에 큼지막한 배지
    const iterText = "ITER " + iterCount;
    ctx.font = "bold 14px sans-serif"; ctx.textAlign = "left";
    const iterTW = ctx.measureText(iterText).width;
    const badgeW = iterTW + 18;
    const badgeX = mB.left + pwB() - badgeW;
    const badgeY = 4;
    // 배지 색: 수렴=초록, 수렴실패=오렌지, 발산=빨강, 진행=파랑
    const isFailBadge = diverged && divergeReason.startsWith("⚠");
    const badgeColor = converged ? "#16a34a"
                       : isFailBadge ? "#ea580c"
                       : diverged    ? "#dc2626"
                       :               "#0969da";
    ctx.fillStyle = badgeColor;
    ctx.fillRect(badgeX, badgeY, badgeW, 22);
    ctx.fillStyle = "#fff";
    ctx.fillText(iterText, badgeX + 9, badgeY + 16);

    // 결과 배너 (수렴 / 발산 / 수렴 실패)
    if (converged || diverged) {
      // divergeReason 첫 글자가 ⚠ 면 "수렴 실패" (오렌지), ✗ 면 "발산" (빨강)
      const isFail = diverged && divergeReason.startsWith("⚠");
      let banner, bgColor, reasonColor;
      if (converged) {
        banner = "✓ 수렴 완료"; bgColor = "rgba(22, 163, 74, 0.92)"; reasonColor = "#15803d";
      } else if (isFail) {
        banner = "⚠ 수렴 실패"; bgColor = "rgba(234, 88, 12, 0.92)"; reasonColor = "#c2410c";
      } else {
        banner = "✗ 발산"; bgColor = "rgba(220, 38, 38, 0.92)"; reasonColor = "#dc2626";
      }
      const reason = converged ? convergeReason : divergeReason;
      ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
      const bw = ctx.measureText(banner).width + 24;
      const bx = mB.left + (pwB() - bw) / 2;
      ctx.fillStyle = bgColor;
      ctx.fillRect(bx, 32, bw, 26);
      ctx.fillStyle = "#fff";
      ctx.fillText(banner, mB.left + pwB() / 2, 50);
      ctx.font = "10px sans-serif"; ctx.fillStyle = reasonColor; ctx.textAlign = "center";
      ctx.fillText(reason, mB.left + pwB() / 2, 72);
    }

    // Bg
    ctx.fillStyle = "#fafbfc"; ctx.fillRect(mB.left, mB.top, pwB(), phB());

    // Grid
    ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 1;
    const wGridStep = (W_RANGE[1] - W_RANGE[0]) > 10 ? 2 : 0.5;
    for (let ww = Math.ceil(W_RANGE[0] / wGridStep) * wGridStep; ww <= W_RANGE[1]; ww += wGridStep) {
      ctx.beginPath(); ctx.moveTo(wToPx(ww), mB.top); ctx.lineTo(wToPx(ww), mB.top + phB()); ctx.stroke();
    }
    const sseStep = SSE_Y_MAX / 5;
    for (let i = 0; i <= 5; i++) {
      const s = i * sseStep;
      ctx.beginPath(); ctx.moveTo(mB.left, sseToPx(s)); ctx.lineTo(mB.left + pwB(), sseToPx(s)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top + phB()); ctx.lineTo(mB.left + pwB(), mB.top + phB()); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mB.left, mB.top); ctx.lineTo(mB.left, mB.top + phB()); ctx.stroke();

    // Tick labels
    ctx.fillStyle = "#6b7280"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    for (let ww = Math.ceil(W_RANGE[0] / wGridStep) * wGridStep; ww <= W_RANGE[1]; ww += wGridStep) ctx.fillText(ww.toFixed(0), wToPx(ww), mB.top + phB() + 14);
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const s = i * sseStep;
      ctx.fillText(s.toFixed(2), mB.left - 4, sseToPx(s) + 3);
    }
    ctx.fillStyle = "#374151"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("w", mB.left + pwB() - 5, mB.top + phB() + 28);
    ctx.fillText("SSE", mB.left + 5, mB.top - 8);

    // === Real SSE curve (blue) ===
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2;
    ctx.beginPath(); let first = true;
    const N = 200;
    for (let i = 0; i <= N; i++) {
      const ww = W_RANGE[0] + (i / N) * (W_RANGE[1] - W_RANGE[0]);
      const s = sse(ww);
      if (s > SSE_Y_MAX) { first = true; continue; }
      const px = wToPx(ww), py = sseToPx(s);
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // === Local quadratic parabola (purple, dashed) — 진하게 ===
    if (dwNext !== null) {
      ctx.strokeStyle = "#9333ea"; ctx.lineWidth = 2.5; ctx.setLineDash([8, 4]);
      ctx.beginPath(); first = true;
      let visiblePoints = 0;
      for (let i = 0; i <= N; i++) {
        const ww = W_RANGE[0] + (i / N) * (W_RANGE[1] - W_RANGE[0]);
        const q = localQuadratic(ww, w);
        // 위/아래 모두 클립 (보이는 영역 내에서만 그림)
        if (q > SSE_Y_MAX || q < 0) { first = true; continue; }
        const px = wToPx(ww), py = sseToPx(q);
        if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
        visiblePoints++;
      }
      ctx.stroke(); ctx.setLineDash([]);
      // 안 보이면 콘솔에 경고
      if (visiblePoints === 0) {
        console.warn("Parabola has no visible points. min Q =", localQuadratic(wNext, w));
      }
    }

    // === Tangent line at w_n (gradient slope) ===
    const G = sseGradient(w);
    const sseAtW = sse(w);
    // Tangent: y = sseAtW + G * (ww - w)
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]);
    ctx.beginPath();
    const span = 0.6;
    const wL = w - span, wR = w + span;
    const yL = sseAtW + G * (wL - w);
    const yR = sseAtW + G * (wR - w);
    ctx.moveTo(wToPx(wL), sseToPx(Math.max(0, Math.min(SSE_Y_MAX, yL))));
    ctx.lineTo(wToPx(wR), sseToPx(Math.max(0, Math.min(SSE_Y_MAX, yR))));
    ctx.stroke(); ctx.setLineDash([]);

    // === Trust region band (Dogleg only) ===
    if (algo === "dl") {
      const wL = Math.max(W_RANGE[0], w - trustRadius);
      const wR = Math.min(W_RANGE[1], w + trustRadius);
      ctx.fillStyle = "rgba(13,148,136,0.10)";  // teal 옅게
      ctx.fillRect(wToPx(wL), mB.top, wToPx(wR) - wToPx(wL), phB());
      ctx.strokeStyle = "#0d9488"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(wToPx(wL), mB.top); ctx.lineTo(wToPx(wL), mB.top + phB()); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wToPx(wR), mB.top); ctx.lineTo(wToPx(wR), mB.top + phB()); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#0d9488"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("신뢰 영역 [wₙ ± Δ]", (wToPx(wL) + wToPx(wR)) / 2, mB.top + phB() - 22);
    }

    // === Markers ===
    // Current w_n (red vertical + dot)
    ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(wToPx(w), mB.top); ctx.lineTo(wToPx(w), mB.top + phB()); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(wToPx(w), sseToPx(Math.min(sseAtW, SSE_Y_MAX)), 6, 0, 2*Math.PI); ctx.fill();
    ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("wₙ = " + w.toFixed(3), wToPx(w) + 8, mB.top + 14);

    // Next w_{n+1} (purple vertical + dot at parabola minimum)
    if (wNext !== null) {
      const sseAtNext = sse(wNext);
      const qAtNext = localQuadratic(wNext, w);
      ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(wToPx(wNext), mB.top); ctx.lineTo(wToPx(wNext), mB.top + phB()); ctx.stroke(); ctx.setLineDash([]);
      // Dot on parabola (= 0점)
      ctx.fillStyle = "#a855f7"; ctx.beginPath();
      ctx.arc(wToPx(wNext), sseToPx(Math.min(qAtNext, SSE_Y_MAX)), 6, 0, 2*Math.PI); ctx.fill();
      // Dot on actual curve (for comparison)
      ctx.strokeStyle = "#16a34a"; ctx.fillStyle = "#16a34a"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(wToPx(wNext), sseToPx(Math.min(sseAtNext, SSE_Y_MAX)), 4, 0, 2*Math.PI); ctx.fill();
      ctx.fillStyle = "#7e22ce"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("wₙ₊₁ = " + wNext.toFixed(3) + " (∂Q/∂w=0)", wToPx(wNext) + 8, mB.top + 28);

      // Δw arrow (between markers, on baseline)
      const arrY = mB.top + phB() - 8;
      ctx.strokeStyle = "#0969da"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(wToPx(w), arrY); ctx.lineTo(wToPx(wNext), arrY); ctx.stroke();
      const ang = wNext > w ? 0 : Math.PI;
      ctx.fillStyle = "#0969da";
      ctx.beginPath();
      ctx.moveTo(wToPx(wNext), arrY);
      ctx.lineTo(wToPx(wNext) - 6 * Math.cos(ang - Math.PI/6), arrY - 6 * Math.sin(ang - Math.PI/6));
      ctx.lineTo(wToPx(wNext) - 6 * Math.cos(ang + Math.PI/6), arrY - 6 * Math.sin(ang + Math.PI/6));
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#0969da"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Δw = " + dwNext.toFixed(3), (wToPx(w) + wToPx(wNext)) / 2, arrY - 4);
    }

    // True w (정답) — 파란 별 마커 (next 와 색 분리)
    ctx.fillStyle = "#1d4ed8"; ctx.beginPath();
    ctx.arc(wToPx(W_TRUE), mB.top + phB() - 3, 6, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("★", wToPx(W_TRUE), mB.top + phB() - 0.5);
    ctx.fillStyle = "#1d4ed8"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("정답 w*=" + W_TRUE, wToPx(W_TRUE), mB.top + phB() + 14);

    // Trajectory dots
    if (trajectory.length > 1) {
      ctx.fillStyle = "#9ca3af";
      for (let i = 0; i < trajectory.length - 1; i++) {
        const wi = trajectory[i];
        ctx.beginPath(); ctx.arc(wToPx(wi), sseToPx(Math.min(sse(wi), SSE_Y_MAX)), 3, 0, 2*Math.PI); ctx.fill();
      }
    }

    // === Inline legend (top-right of bottom canvas) ===
    const lgW = 290;
    const lgX = mB.left + pwB() - lgW - 5;
    const lgY = mB.top + 5;
    ctx.fillStyle = "rgba(255,255,255,0.94)"; ctx.fillRect(lgX, lgY, lgW, 100);
    ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(lgX, lgY, lgW, 100);
    ctx.font = "10px sans-serif"; ctx.textAlign = "left";
    let yLg = lgY + 14;
    // Real SSE (식 명시)
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lgX + 8, yLg - 3); ctx.lineTo(lgX + 22, yLg - 3); ctx.stroke();
    ctx.fillStyle = "#1d4ed8"; ctx.fillText("E(w) = Σᵢ (yᵢ − e^(−w·tᵢ))²", lgX + 26, yLg);
    yLg += 16;
    // Parabola (식 명시 + 깊이)
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(lgX + 8, yLg - 3); ctx.lineTo(lgX + 22, yLg - 3); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#7e22ce";
    let parabolaInfo = "Q(w) — 포물선";
    if (wNext !== null) {
      const qMin = localQuadratic(wNext, w);
      parabolaInfo = "Q 바닥 = " + qMin.toFixed(3) + " (깊이)";
    }
    ctx.fillText(parabolaInfo, lgX + 26, yLg);
    yLg += 16;
    // Tangent + G 정의 + 수식 + 값
    const Gval = sseGradient(w);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(lgX + 8, yLg - 3); ctx.lineTo(lgX + 22, yLg - 3); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#b45309"; ctx.fillText("접선: G = dE/dw = 2·Σᵢ eᵢ·Jᵢ = " + Gval.toFixed(3), lgX + 26, yLg);
    yLg += 16;
    // Arrow Δw — 식 (LM 일 땐 λ 포함)
    ctx.strokeStyle = "#0969da"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(lgX + 6, yLg - 3); ctx.lineTo(lgX + 22, yLg - 3); ctx.stroke();
    ctx.fillStyle = "#0969da";
    let dwFormula;
    if (algo === "lm") dwFormula = "Δw = −G/(H_GN+λ), λ=" + lambda.toExponential(1);
    else if (algo === "newton-lm") dwFormula = "Δw = −G/(H_true+λ), λ=" + lambda.toExponential(1);
    else if (algo === "dl") dwFormula = "Δw = clip(−G/H, ±Δ), Δ=" + trustRadius.toFixed(3);
    else if (algo === "newton") dwFormula = "Δw = −G/H_true (진짜 2차미분)";
    else dwFormula = "Δw = wₙ₊₁ − wₙ = −G/H";
    ctx.fillText(dwFormula, lgX + 26, yLg);
    yLg += 16;
    // 알고리즘별 이유 표시
    if (algo === "lm") {
      ctx.fillStyle = "#7e22ce"; ctx.font = "9px sans-serif";
      ctx.fillText(lambdaReason, lgX + 6, yLg); yLg += 14;
    } else if (algo === "dl") {
      ctx.fillStyle = "#0d9488"; ctx.font = "9px sans-serif";
      ctx.fillText(trustReason, lgX + 6, yLg); yLg += 14;
    } else if (algo === "newton" || algo === "newton-lm") {
      // 진짜 H 값 표시 + 음수 경고
      const eArr = residual(w), Jarr = jacobian(w), Jp = jacobianPrime(w);
      let JtJ = 0, eJp = 0;
      for (let i = 0; i < Jarr.length; i++) { JtJ += Jarr[i]*Jarr[i]; eJp += eArr[i]*Jp[i]; }
      const Htrue = 2*(JtJ + eJp);
      const Hgn   = 2*JtJ;
      ctx.fillStyle = Htrue < 0 ? "#dc2626" : "#15803d"; ctx.font = "9px sans-serif";
      const warn = Htrue < 0 ? " ⚠ 음수!" : "";
      ctx.fillText("H_true=" + Htrue.toFixed(3) + "  (H_GN=" + Hgn.toFixed(3) + ")" + warn, lgX + 6, yLg);
      yLg += 14;
      if (algo === "newton-lm") {
        ctx.fillStyle = "#7e22ce";
        ctx.fillText(lambdaReason, lgX + 6, yLg); yLg += 14;
      }
    }
    // Status
    ctx.fillStyle = "#374151"; ctx.font = "10px sans-serif";
    ctx.fillText(statusMsg, lgX + 6, yLg);
  }

  function drawAll() { drawTop(); drawBot(); }

  // === Controls ===
  const controls = document.createElement("div");
  controls.style.cssText = "margin-top:8px; padding:10px; background:#f6f8fa; border-radius:6px; font-family:sans-serif; font-size:13px;";
  container.appendChild(controls);

  const sliderRow = document.createElement("div");
  sliderRow.style.cssText = "display:flex; gap:10px; margin-bottom:8px; align-items:center;";
  controls.appendChild(sliderRow);

  const lbl = document.createElement("label"); lbl.textContent = "w 초기값:"; lbl.style.fontWeight = "500";
  sliderRow.appendChild(lbl);
  const slider = document.createElement("input");
  slider.type = "range"; slider.min = -10; slider.max = 10; slider.step = 0.1; slider.value = 1.5;
  slider.style.cssText = "flex:1;";
  sliderRow.appendChild(slider);
  const sliderVal = document.createElement("span"); sliderVal.textContent = "1.50"; sliderVal.style.cssText = "font-family:monospace; min-width:40px;";
  sliderRow.appendChild(sliderVal);
  slider.addEventListener("input", () => { sliderVal.textContent = parseFloat(slider.value).toFixed(2); });

  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex; gap:8px; flex-wrap:wrap;";
  controls.appendChild(btnRow);

  function makeBtn(text, color, handler) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cssText = "padding:6px 12px; background:" + color + "; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px; font-weight:500;";
    b.addEventListener("click", handler);
    btnRow.appendChild(b);
    return b;
  }

  // 알고리즘 토글 (GN / LM)
  const algoLabel = document.createElement("label");
  algoLabel.style.cssText = "margin-right:6px; font-weight:500;";
  algoLabel.textContent = "알고리즘:";
  btnRow.appendChild(algoLabel);
  const algoSelect = document.createElement("select");
  algoSelect.style.cssText = "padding:4px 8px; border-radius:4px; border:1px solid #d1d5db; margin-right:12px; font-size:13px;";
  [["gn", "GN (Gauss-Newton)"], ["newton", "Newton (진짜 Hessian)"], ["lm", "GN-LM (Levenberg-Marquardt)"], ["newton-lm", "Newton-LM (진짜 H + λ)"], ["dl", "Dogleg (Trust Region)"]].forEach(([val, label]) => {
    const opt = document.createElement("option");
    opt.value = val; opt.textContent = label;
    algoSelect.appendChild(opt);
  });
  algoSelect.addEventListener("change", () => {
    algo = algoSelect.value;
    reset(parseFloat(slider.value));
  });
  btnRow.appendChild(algoSelect);

  makeBtn("▶ 1 Step", "#0969da", () => gaussNewtonStep());
  const autoBtn = makeBtn("⏵ Auto", "#8250df", () => {
    if (autoInterval) { stopAuto(); }
    else {
      autoBtn.textContent = "⏸ Stop";
      autoInterval = setInterval(() => {
        if (iterCount >= 50 || converged || diverged) { stopAuto(); return; }
        gaussNewtonStep();
      }, 600);
    }
  });
  makeBtn("↻ Reset", "#6b7280", () => reset(parseFloat(slider.value)));

  function stopAuto() { if (autoInterval) { clearInterval(autoInterval); autoInterval = null; autoBtn.textContent = "⏵ Auto"; } }

  slider.addEventListener("change", () => reset(parseFloat(slider.value)));

  // Click on bottom canvas to set w
  canvasBot.addEventListener("click", (ev) => {
    const rect = canvasBot.getBoundingClientRect();
    const px = (ev.clientX - rect.left) * (canvasBot.width / rect.width);
    const ww = W_RANGE[0] + ((px - mB.left) / pwB()) * (W_RANGE[1] - W_RANGE[0]);
    if (ww >= W_RANGE[0] && ww <= W_RANGE[1]) {
      slider.value = ww.toFixed(2);
      sliderVal.textContent = ww.toFixed(2);
      reset(ww);
    }
  });

  reset(1.5);
})();
