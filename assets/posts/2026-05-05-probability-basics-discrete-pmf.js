// 이산 확률 (PMF) 시각화 데모
// "여러 선택지 중 하나가 될 확률" — 동전 / 주사위 / 일반 K개 결과
// 막대 = 각 선택지의 확률 P(X=x_k), 합 = 1
// "굴리기" 버튼으로 샘플링 → 빈도가 PMF 로 수렴 (대수의 법칙)
(function () {
  const container = document.getElementById("discrete-pmf-demo");
  if (!container) return;

  // === UI (DOM API only) ===
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

  const selK = el("select", { id: "pmf-k", style: "margin-left:4px;" });
  [["2", "2 (동전)"], ["6", "6 (주사위)"], ["4", "4"], ["10", "10"]].forEach(([v, t]) => {
    const o = el("option"); o.value = v; o.textContent = t; if (v === "6") o.selected = true;
    selK.appendChild(o);
  });
  const selDist = el("select", { id: "pmf-dist", style: "margin-left:4px;" });
  [["uniform", "균등 (공정)"], ["biased", "편향 (한쪽 큰 확률)"]].forEach(([v, t]) => {
    const o = el("option"); o.value = v; o.textContent = t; if (v === "uniform") o.selected = true;
    selDist.appendChild(o);
  });

  const btn1 = el("button", { style: "padding:4px 10px;" }, ["1번 굴리기"]);
  const btn100 = el("button", { style: "padding:4px 10px;" }, ["100번"]);
  const btnReset = el("button", { style: "padding:4px 10px;" }, ["초기화"]);
  const countEl = el("span", { style: "color:#666;" }, ["샘플: 0"]);

  const controls = el("div", { style: "display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-bottom:10px; font-family:system-ui,sans-serif; font-size:13px;" }, [
    el("label", null, ["선택지 수 K:", selK]),
    el("label", null, ["분포:", selDist]),
    btn1, btn100, btnReset, countEl,
  ]);

  const canvas = el("canvas", { style: "width:100%; height:280px; background:#fff; border-radius:6px; display:block;" });

  const legend = el("div", { style: "font-size:12px; color:#555; margin-top:8px; line-height:1.5;" });
  legend.appendChild(el("b", null, ["회색 막대"]));
  legend.appendChild(document.createTextNode(" = 진짜 확률 P(X=x_k)  |  "));
  legend.appendChild(el("b", null, ["주황 막대"]));
  legend.appendChild(document.createTextNode(" = 관측 빈도 (샘플/총샘플)  |  많이 굴릴수록 주황이 회색에 수렴 ("));
  legend.appendChild(el("i", null, ["대수의 법칙"]));
  legend.appendChild(document.createTextNode(")."));

  container.appendChild(controls);
  container.appendChild(canvas);
  container.appendChild(legend);

  // High-DPI canvas
  function fitCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // === State ===
  let K = 6;
  let probs = [];
  let counts = [];
  let total = 0;
  let lastSample = -1;
  let yMax = 1.0; // 그리드 고정용 — K/분포 바뀔 때만 갱신

  function buildProbs() {
    K = parseInt(selK.value, 10);
    probs = new Array(K);
    if (selDist.value === "uniform") {
      for (let i = 0; i < K; i++) probs[i] = 1 / K;
    } else {
      const raw = [];
      for (let i = 0; i < K; i++) raw.push(Math.pow(0.55, i));
      const s = raw.reduce((a, b) => a + b, 0);
      for (let i = 0; i < K; i++) probs[i] = raw[i] / s;
    }
    counts = new Array(K).fill(0);
    total = 0;
    lastSample = -1;

    // yMax 를 "보기 좋은" 고정 눈금으로 한 번만 결정
    // - 관측 빈도가 일시적으로 진짜 확률을 초과해도 그리드는 안 움직임
    // - 그리드 단위: 0.05 / 0.1 / 0.2 / 0.25 등 깔끔한 값
    const maxP = Math.max(...probs);
    const headroom = maxP * 1.5;          // 빈도가 튀어도 들어갈 여유
    const niceSteps = [0.1, 0.2, 0.25, 0.5, 1.0];
    yMax = niceSteps.find((s) => s >= headroom) || 1.0;
  }

  function sampleOne() {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < K; i++) {
      acc += probs[i];
      if (r < acc) return i;
    }
    return K - 1;
  }

  function rollN(n) {
    for (let i = 0; i < n; i++) {
      const k = sampleOne();
      counts[k]++;
      total++;
      lastSample = k;
    }
    draw();
  }

  function draw() {
    const ctx = fitCanvas();
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    const padL = 50, padR = 16, padT = 18, padB = 36;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // yMax 는 buildProbs() 에서 고정됨 — 굴려도 안 변함
    // 단, 빈도가 yMax 초과하면 yMax 위까지 채워서 안전하게 클램프
    // 축
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // y 격자 + 레이블
    ctx.fillStyle = "#666";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const yTicks = 5;
    for (let t = 0; t <= yTicks; t++) {
      const v = (yMax * t) / yTicks;
      const y = padT + plotH - (v / yMax) * plotH;
      ctx.strokeStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(2), padL - 6, y);
    }

    // y 라벨
    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#444";
    ctx.fillText("확률 / 빈도", 0, 0);
    ctx.restore();

    // 막대
    const barGap = 0.18;
    const barW = (plotW / K) * (1 - barGap);
    for (let i = 0; i < K; i++) {
      const cx = padL + (plotW / K) * (i + 0.5);
      const clampP = Math.min(probs[i], yMax);
      const trueY = padT + plotH - (clampP / yMax) * plotH;
      const trueH = padT + plotH - trueY;

      // 회색 (진짜 확률)
      ctx.fillStyle = "#d0d7de";
      ctx.fillRect(cx - barW / 2, trueY, barW, trueH);

      // 주황 (관측 빈도) — 안쪽 좁은 막대
      if (total > 0) {
        const freq = counts[i] / total;
        const clampF = Math.min(freq, yMax);
        const obsY = padT + plotH - (clampF / yMax) * plotH;
        const obsH = padT + plotH - obsY;
        ctx.fillStyle = i === lastSample ? "#fb8c00" : "#ffb74d";
        ctx.fillRect(cx - barW * 0.25, obsY, barW * 0.5, obsH);
      }

      // x 레이블
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const label = K === 2 ? (i === 0 ? "앞" : "뒤") : String(i + 1);
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(label, cx, padT + plotH + 6);

      // 진짜 확률 숫자
      ctx.fillStyle = "#666";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textBaseline = "bottom";
      ctx.fillText(probs[i].toFixed(3), cx, trueY - 2);
    }

    // 합 = 1 표시
    ctx.fillStyle = "#444";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    const sumProb = probs.reduce((a, b) => a + b, 0);
    ctx.fillText("∑ P = " + sumProb.toFixed(2), padL + plotW, padT - 14);

    countEl.textContent = "샘플: " + total;
  }

  selK.addEventListener("change", () => { buildProbs(); draw(); });
  selDist.addEventListener("change", () => { buildProbs(); draw(); });
  btn1.addEventListener("click", () => rollN(1));
  btn100.addEventListener("click", () => rollN(100));
  btnReset.addEventListener("click", () => { counts = new Array(K).fill(0); total = 0; lastSample = -1; draw(); });
  window.addEventListener("resize", draw);

  buildProbs();
  draw();
})();
