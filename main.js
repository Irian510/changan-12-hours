/* ============================================================
   长安十二时辰 · 靖安司案牍库
   ============================================================ */

/* ---------------- 模块一：十二时辰刻度盘 ---------------- */
const SHICHEN = [
  { name: "子", node: "子时 · 灯楼金光璀璨", hours: [23, 0] },
  { name: "丑", node: "丑时 · 蚍蜉暗涌", hours: [1] },
  { name: "寅", node: "寅时 · 靖安司筹谋", hours: [2, 3, 4, 5] }, // 占位分支，实际用下方判断
  { name: "卯", node: "卯时 · 死囚出牢", hours: [5, 6] },
  { name: "辰", node: "辰时 · 望楼启用", hours: [7, 8] },
  { name: "巳", node: "巳正 · 西市开市", hours: [9, 10] },
  { name: "午", node: "午时 · 狼卫入城", hours: [11, 12] },
  { name: "未", node: "未时 · 长安县追缉", hours: [13, 14] },
  { name: "申", node: "申时 · 平康坊交易", hours: [15, 16] },
  { name: "酉", node: "酉时 · 掌灯", hours: [17, 18] },
  { name: "戌", node: "戌时 · 灯楼大火", hours: [19, 20] },
  { name: "亥", node: "亥时 · 许鹤子登台", hours: [21, 22] },
];

function buildDial() {
  const sectors = document.getElementById("dial-sectors");
  const labels = document.getElementById("dial-labels");
  const ticks = document.getElementById("dial-ticks");
  const NS = "http://www.w3.org/2000/svg";
  const cx = 260, cy = 260, rLabel = 228;

  SHICHEN.forEach((sc, i) => {
    // 每个时辰占 30°，以正上方为子时起点，顺时针
    const startAngle = -105 + i * 30; // 子时在左上，顺时针
    // 扇区刻度线
    for (let k = 0; k <= 6; k++) {
      const a = (startAngle + k * 5 - 90) * Math.PI / 180;
      const r1 = 206, r2 = k % 6 === 0 ? 191 : 198;
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", cx + r1 * Math.cos(a));
      line.setAttribute("y1", cy + r1 * Math.sin(a));
      line.setAttribute("x2", cx + r2 * Math.cos(a));
      line.setAttribute("y2", cy + r2 * Math.sin(a));
      line.setAttribute("stroke", k % 6 === 0 ? "#c9a227" : "#4a6a63");
      line.setAttribute("stroke-width", k % 6 === 0 ? "1.2" : "0.6");
      line.setAttribute("opacity", k % 6 === 0 ? "0.6" : "0.35");
      ticks.appendChild(line);
    }
    // 时辰标签
    const mid = (startAngle + 15 - 90) * Math.PI / 180;
    const lx = cx + rLabel * Math.cos(mid);
    const ly = cy + rLabel * Math.sin(mid);
    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", lx);
    text.setAttribute("y", ly + 7);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "sc-label");
    text.dataset.index = i;
    text.textContent = sc.name + "时";
    text.addEventListener("mouseenter", () => highlight(i, false));
    text.addEventListener("mouseleave", () => highlight(currentIndex, true));
    labels.appendChild(text);
  });
}

let currentIndex = 5; // 默认巳时（入口时刻）
let autoTimer = null;
let manualLock = false;

function highlight(idx, sticky) {
  document.querySelectorAll(".sc-label").forEach((t, i) => {
    t.classList.toggle("on", i === idx);
  });
  const sc = SHICHEN[idx];
  document.getElementById("dial-now-name").textContent = sc.name + "时";
  document.getElementById("dial-now-node").textContent = sc.node;
  if (sticky) currentIndex = idx;
}

function shichenFromNow() {
  const h = new Date().getHours();
  if (h === 23 || h === 0) return 0;
  return Math.floor(((h + 1) % 24) / 2);
}

function startDial() {
  buildDial();
  const nowIdx = shichenFromNow();
  highlight(nowIdx, true);
  // 自动轮转，用户交互后停止
  let auto = nowIdx;
  autoTimer = setInterval(() => {
    if (manualLock) { clearInterval(autoTimer); return; }
    auto = (auto + 1) % 12;
    highlight(auto, false);
  }, 2200);
  document.getElementById("dial").addEventListener("mouseenter", () => { manualLock = true; highlight(nowIdx, true); });
}

startDial();

/* ---------------- 模块二：一百零八坊 ---------------- */
const KEY_FANGS = {
  "光德坊": {
    role: "靖安司驻地 · 孙思邈旧宅",
    plot: "靖安司设在光德坊，孙思邈旧宅改造而成；坊内一处不起眼的偏院，掌控着整个长安的消息命脉。",
    quote: "「光德坊的东北隅是京兆府公廨……夹着一处不起眼的偏院。」",
    col: 5, row: 3
  },
  "西市": {
    role: "狼卫入城起点 · 故事开篇地",
    plot: "上元节开市之日，狼卫首领曹破延冒充粟特商人混入西市——整部故事由这里开始。",
    quote: "曹破延冒充粟特商人混入西市。",
    col: 3, row: 8, market: true
  },
  "平康坊": {
    role: "地下势力所在 · 情报集散地",
    plot: "妓女和侠士聚集之地。张小敬在此与地下之王葛老交易，用一条性命换来了追凶的线索。",
    quote: "「妓女和侠士聚集地。」",
    col: 8, row: 5
  },
  "昌明坊": {
    role: "狼卫藏身处 · 阙勒霍多之谜",
    plot: "张小敬在此发现「阙勒霍多」的关键线索——有人违规在坊墙上开门，为大宗货物运输提供便利。",
    quote: "违规在坊墙上开门，为大宗货物运输提供便利。",
    col: 4, row: 9
  },
  "靖安坊": {
    role: "历史回响 · 宰相遇刺之地",
    plot: "历史上，宰相武元衡正是在靖安坊遇刺身亡。或有论者以为，「靖安司」之名即由此坊得到灵感。",
    quote: "历史上真实发生过宰相武元衡被刺杀案。",
    col: 9, row: 8
  }
};

const ORDINARY_NAMES = [
  "大兴","安化","长兴","崇仁","永宁","安义","敦义","大安","丰安","安业",
  "崇贤","延寿","怀远","长乐","永乐","太平","大宁","兴宁","安兴","广德",
  "亲仁","兰陵","新昌","升平","光福","善和","通济","丰乐","修行","延祚"
];

function buildFangs() {
  const board = document.getElementById("changnan");
  const COLS = 13, ROWS = 11;
  const frag = document.createDocumentFragment();
  let ordIdx = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      // 朱雀大街：第 7 列（index 6）为中轴
      if (c === 6) {
        cell.className = "fang street";
        cell.title = "朱雀大街";
        if (r === 0) cell.textContent = "朱雀大街";
        frag.appendChild(cell);
        continue;
      }
      // 皇城：顶部中间偏左
      if (r === 1 && c >= 4 && c <= 8 && c !== 6) {
        cell.className = "fang palace";
        cell.textContent = c === 4 ? "皇城" : "";
        cell.title = "皇城 · 宫城禁地";
        frag.appendChild(cell);
        continue;
      }
      // 重点坊
      const key = Object.keys(KEY_FANGS).find(k => KEY_FANGS[k].col === c && KEY_FANGS[k].row === r);
      if (key) {
        cell.className = "fang gold";
        cell.textContent = key;
        cell.dataset.fang = key;
        cell.title = key + " · 点击调阅案卷";
        cell.addEventListener("click", () => openDossier(key));
        frag.appendChild(cell);
        continue;
      }
      // 东市
      if (r === 5 && c === 9) {
        cell.className = "fang market";
        cell.textContent = "东市";
        cell.title = "东市 · 贵族采购之地";
        frag.appendChild(cell);
        continue;
      }
      // 寻常坊
      cell.className = "fang";
      cell.textContent = ORDINARY_NAMES[ordIdx % ORDINARY_NAMES.length];
      ordIdx++;
      cell.title = "坊册散页 · 档案待誊录";
      frag.appendChild(cell);
    }
  }
  board.appendChild(frag);
}
buildFangs();

const overlay = document.getElementById("dossier-overlay");
function openDossier(name) {
  const d = KEY_FANGS[name];
  if (!d) return;
  document.getElementById("dossier-name").textContent = name;
  document.getElementById("dossier-role").textContent = d.role;
  document.getElementById("dossier-plot").textContent = d.plot;
  document.getElementById("dossier-quote").textContent = d.quote;
  overlay.hidden = false;
}
document.getElementById("dossier-close").addEventListener("click", () => overlay.hidden = true);
overlay.addEventListener("click", e => { if (e.target === overlay) overlay.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") overlay.hidden = true; });

/* ---------------- 模块三：望楼信令 ---------------- */
const GLYPHS = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
const DECODE_TEXT = "狼过樊记鞍马铺，朝十字街西北而去！";
const SIGNAL = ["☳", "☵", "☴"]; // 震 · 坎 · 巽

let sending = false;
document.getElementById("wl-send").addEventListener("click", () => {
  if (sending) return;
  sending = true;
  const boards = [0, 1, 2].map(i => document.getElementById("wl-b" + i));
  const glyphs = boards.map(b => b.querySelector(".wl-glyph"));
  const decode = document.getElementById("wl-decode");
  const msg = document.getElementById("wl-msg");
  decode.innerHTML = "";
  msg.textContent = "";

  boards.forEach(b => b.classList.remove("flip"));

  // 依次翻板
  SIGNAL.forEach((g, i) => {
    setTimeout(() => {
      boards[i].classList.add("flip");
      setTimeout(() => {
        glyphs[i].textContent = g;
        decode.innerHTML += `<span>${g}</span>`;
        boards[i].classList.remove("flip");
      }, 620);
    }, i * 1400);
  });

  // 破译输出
  setTimeout(() => {
    let n = 0;
    const typer = setInterval(() => {
      msg.textContent = DECODE_TEXT.slice(0, ++n);
      if (n >= DECODE_TEXT.length) clearInterval(typer);
    }, 110);
    setTimeout(() => { sending = false; }, DECODE_TEXT.length * 110 + 400);
  }, 3 * 1400 + 800);
});

/* ---------------- 成片视频：运行时构建 + 点击播放 ----------------
   静态 HTML 里的 <video> 会被部分预览管线剥离，因此整个视频组件
   （video + 播放徽标 + 错误提示）全部由 JS 在运行时创建。 */
(function () {
  const frame = document.getElementById("video-frame");
  if (!frame) return;

  const badge = document.createElement("button");
  badge.className = "video-play-badge";
  badge.id = "video-play-badge";
  badge.setAttribute("aria-label", "播放视频");
  badge.textContent = "▶ 播放";

  const errBox = document.createElement("div");
  errBox.className = "video-error";
  errBox.hidden = true;
  errBox.innerHTML =
    '<div class="ve-title">视频暂无法在此环境内嵌播放</div>' +
    '<p>预览内核缺少视频解码支持。请用系统浏览器（Edge / Chrome）直接打开本页面的 <code>index.html</code>，或打开同目录的单文件版，即可正常内嵌播放。</p>';

  const v = document.createElement("video");
  v.id = "final-video";
  v.controls = true;
  v.playsInline = true;
  v.preload = "metadata";

  // 播放源：单文件版会注入 base64 内嵌视频；普通版使用文件路径（mp4 优先，webm 兜底）
  if (window.__VIDEO_SRC__) {
    v.poster = window.__POSTER_SRC__ || "";
    const s = document.createElement("source");
    s.src = window.__VIDEO_SRC__;
    s.type = "video/mp4";
    v.appendChild(s);
  } else {
    v.poster = "images/s001.jpg";
    [["video/final.mp4", 'video/mp4; codecs="avc1.640028, mp4a.40.2"'],
     ["video/final.webm", 'video/webm; codecs="vp9, opus"']].forEach(([src, type]) => {
      const s = document.createElement("source");
      s.src = src; s.type = type;
      v.appendChild(s);
    });
  }

  frame.appendChild(v);
  frame.appendChild(badge);
  frame.appendChild(errBox);
  v.load(); // 动态插入 source 后需显式触发加载

  let failedSources = 0;
  const sources = Array.from(v.querySelectorAll("source"));
  const showInlineError = () => {
    badge.classList.add("hide");
    errBox.hidden = false;
    v.style.display = "none";
  };

  // 点击视频区域：若未在播放则播放（原生 controls 失效时也有效）
  frame.addEventListener("click", e => {
    if (e.target === badge) { v.play().catch(() => {}); return; }
    if (v.paused) v.play().catch(() => {});
  });

  // 播放状态切换：显示/隐藏播放徽标
  v.addEventListener("play", () => badge.classList.add("hide"));
  v.addEventListener("pause", () => badge.classList.remove("hide"));

  // 逐个 source 尝试：mp4 失败自动切 webm；全部失败才显示内嵌提示（无任何跳转）
  // 注意 source 的 error 事件不冒泡，必须逐个监听
  sources.forEach(s => s.addEventListener("error", () => {
    failedSources++;
    if (failedSources >= sources.length) showInlineError();
  }));
  v.addEventListener("error", showInlineError);
})();

/* ---------------- 模块五：画卷横向滚动 ---------------- */
const syScroll = document.getElementById("sy-scroll");
document.getElementById("sy-prev").addEventListener("click", () => {
  syScroll.scrollBy({ left: -Math.min(580, syScroll.clientWidth * 0.8), behavior: "smooth" });
});
document.getElementById("sy-next").addEventListener("click", () => {
  syScroll.scrollBy({ left: Math.min(580, syScroll.clientWidth * 0.8), behavior: "smooth" });
});

/* ---------------- 滚动浮现 ---------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".module > *, .hero .entry-card").forEach(el => {
  el.classList.add("reveal");
  io.observe(el);
});
