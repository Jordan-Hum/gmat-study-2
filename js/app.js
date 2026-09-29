(function () {
  "use strict";

  // ---------- Data ----------
  const TOPICS = window.TOPICS;
  const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
  const GMAT = window.GMAT;
  const SECTIONS = GMAT.sections;
  const SECTION = Object.fromEntries(SECTIONS.map(s => [s.id, s]));
  const SETS = window.SETS || {};
  // Stable id from the question text, so reordering or adding questions keeps saved progress.
  function hashId(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  const KIND_LABEL = {
    ps: "Problem Solving", ds: "Data Sufficiency", cr: "Critical Reasoning", rc: "Reading Comprehension",
    ta: "Table Analysis", gi: "Graphics Interpretation", tpa: "Two-Part Analysis", msr: "Multi-Source Reasoning"
  };
  // Data Sufficiency always uses these five answers, in this order.
  const DS_OPTS = [
    "Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.",
    "Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient.",
    "BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.",
    "EACH statement ALONE is sufficient.",
    "Statements (1) and (2) TOGETHER are NOT sufficient."
  ];
  // Question formats: mc = one answer from a list; tpa = one row per column (Two-Part Analysis);
  // tf = Yes/No (or True/False…) per statement (Table Analysis); dd = drop-downs in the text (Graphics).
  const QUESTIONS = [];
  for (const t of TOPICS) {
    for (const r of window.QB[t.id] || []) {
      const parts = r.tf || r.dd || r.tpa ? JSON.stringify(r.tf || r.dd || r.tpa) : "";
      const q = { id: t.id + "-" + hashId((r.s || "") + "|" + r.q + parts), topic: t.id, sec: t.sec, kind: r.k || t.kind,
        text: r.q, exp: r.e, set: r.s || null, st: r.st || null };
      if (q.kind === "ds") { q.fmt = "mc"; q.opts = DS_OPTS; q.ans = "ABCDE".indexOf(r.a); q.fixed = true; }
      else if (r.tpa) { q.fmt = "tpa"; q.tpa = r.tpa; }
      else if (r.tf) { q.fmt = "tf"; q.tf = r.tf; q.tfl = r.tfl || ["Yes", "No"]; }
      else if (r.dd) { q.fmt = "dd"; q.dd = r.dd; }
      else { q.fmt = "mc"; q.opts = r.o; q.ans = 0; q.fixed = !!r.fixed; }
      QUESTIONS.push(q);
    }
  }
  const QMAP = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const LETTERS = "ABCDE";

  // ---------- Storage ----------
  const KEY = "gmat-prep-v1";
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") return Object.assign(fresh(), s);
    } catch (e) { /* ignore */ }
    return fresh();
  }
  function fresh() {
    return { q: {}, exams: [], cards: {}, date: "", target: 705, session: null };
  }
  let S = load();
  // Cloud sync settings for this device (see "Cloud sync" below). Null when sync isn't set up here.
  const SYNC_KEY = "gmat-sync-v1";
  let sync = null;
  try { sync = JSON.parse(localStorage.getItem(SYNC_KEY)); } catch (e) { /* ignore */ }
  function save(quiet) {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    if (sync && !quiet) scheduleSync();
  }

  // Per question: attempts, correct, last result, time of last attempt, total seconds,
  // and a short history of recent attempts ([time, right?, seconds]) for the Stats page.
  const HISTORY = 10;
  function record(qid, correct, secs) {
    const r = S.q[qid] || { a: 0, c: 0, last: 0 };
    const now = Date.now(), t = Math.round(secs || 0);
    r.a++; if (correct) r.c++; r.last = correct ? 1 : 0; r.ts = now;
    r.t = (r.t || 0) + t;
    r.h = (r.h || []).concat([[now, correct ? 1 : 0, t]]).slice(-HISTORY);
    S.q[qid] = r;
  }

  // ---------- Helpers ----------
  const $app = document.getElementById("app");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Plain text with line breaks; **text** is shown in bold (used by boldface questions).
  const txt = s => esc(s).replace(/\n/g, "<br>").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const pct = (n, d) => d ? Math.round(100 * n / d) : 0;
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function barClass(p) { return p >= 75 ? "good" : p >= 60 ? "warn" : "bad"; }
  const secTopics = sid => TOPICS.filter(t => t.sec === sid);

  function daysLeft() {
    if (!S.date) return null;
    const d = new Date(S.date + "T00:00:00");
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((d - now) / 86400000);
  }
  function fmtTime(s) {
    s = Math.max(0, Math.floor(s));
    const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(sec).padStart(2, "0");
  }
  function statsOf(qs) {
    let seen = 0, right = 0, missed = 0;
    for (const q of qs) {
      const r = S.q[q.id];
      if (r) { seen++; if (r.last) right++; else missed++; }
    }
    return { total: qs.length, seen, right, missed, acc: pct(right, seen) };
  }
  const topicStats = tid => statsOf(QUESTIONS.filter(q => q.topic === tid));
  const sectionStats = sid => statsOf(QUESTIONS.filter(q => q.sec === sid));
  const allStats = () => statsOf(QUESTIONS);
  const targetSecs = sid => SECTION[sid].minutes * 60 / SECTION[sid].n;

  // ---------- Answers ----------
  function isComplete(q, ch) {
    if (q.fmt === "mc") return ch !== null && ch !== undefined;
    if (!Array.isArray(ch)) return false;
    const n = q.fmt === "tpa" ? 2 : q.fmt === "tf" ? q.tf.length : q.dd.length;
    for (let i = 0; i < n; i++) if (ch[i] === null || ch[i] === undefined) return false;
    return true;
  }
  function isRight(q, ch) {
    if (!isComplete(q, ch)) return false;
    if (q.fmt === "mc") return ch === q.ans;
    if (q.fmt === "tpa") return ch[0] === q.tpa.a[0] && ch[1] === q.tpa.a[1];
    if (q.fmt === "tf") return q.tf.every((s, i) => ch[i] === (s[1] ? 0 : 1));
    return q.dd.every((d, i) => ch[i] === d.a);
  }
  // Numeric answer choices are listed smallest first, as on the real test; others are shuffled.
  function asNumber(s) {
    const t = String(s).replace(/[$,%\s]/g, "").replace(/−/g, "-");
    let m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return +m[1] / +m[2];
    m = t.match(/^-?\d+(?:\.\d+)?$/);
    return m ? +t : NaN;
  }
  function optionOrder(q) {
    if (q.fmt !== "mc") return null;
    const idx = q.opts.map((_, i) => i);
    if (q.fixed) return idx;
    const nums = q.opts.map(asNumber);
    if (nums.every(n => !isNaN(n))) return idx.sort((a, b) => nums[a] - nums[b]);
    return shuffle(idx);
  }

  // ---------- Picking questions ----------
  const freshness = id => { const r = S.q[id]; return !r ? 1 : r.last ? 2 : 0; }; // missed first, then unseen, then right
  function pickQuestions(topics, filter, count, kind) {
    let pool = QUESTIONS.filter(q => topics.includes(q.topic) && (!kind || q.kind === kind));
    if (filter === "unseen") pool = pool.filter(q => !S.q[q.id]);
    if (filter === "missed") pool = pool.filter(q => S.q[q.id] && !S.q[q.id].last);
    pool = shuffle(pool);
    if (filter === "weak") pool.sort((a, b) => freshness(a.id) - freshness(b.id));
    return groupSets(pool.slice(0, count).map(q => q.id));
  }
  // Questions that share a passage or data set sit next to each other, in bank order.
  function groupSets(ids) {
    const out = [], done = new Set();
    for (const id of ids) {
      if (done.has(id)) continue;
      const q = QMAP[id];
      if (!q.set) { out.push(id); done.add(id); continue; }
      const mates = QUESTIONS.filter(x => x.set === q.set && ids.includes(x.id));
      mates.forEach(x => { out.push(x.id); done.add(x.id); });
    }
    return out;
  }
  // Largest-remainder split of n across weights.
  function apportion(weights, n) {
    const tot = weights.reduce((a, b) => a + b, 0);
    const raw = weights.map(w => w * n / tot);
    const counts = raw.map(Math.floor);
    let left = n - counts.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - counts[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { counts[i]++; left--; } });
    return counts;
  }
  // One exam section: each topic's share of n, with passages/data sets kept together.
  // Questions not seen yet come first, then missed ones, then the rest.
  function buildSection(sid, n) {
    const mix = Object.entries(SECTION[sid].mix);
    const counts = apportion(mix.map(m => m[1]), n);
    const score = q => { const r = S.q[q.id]; return !r ? 0 : r.last ? 2 : 1; };
    const units = [];
    mix.forEach(([tid], i) => {
      const groups = new Map();
      for (const q of QUESTIONS.filter(x => x.topic === tid)) {
        const k = q.set || q.id;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(q);
      }
      const avg = u => u.reduce((a, q) => a + score(q), 0) / u.length;
      const pool = shuffle([...groups.values()]).sort((a, b) => avg(a) - avg(b));
      let need = counts[i];
      const used = new Set();
      for (const pass of [0, 1]) {
        for (const [ui, u] of pool.entries()) {
          if (need <= 0) break;
          if (used.has(ui)) continue;
          // First pass: don't open a passage just for a single question.
          if (pass === 0 && u.length > 1 && need < 2) continue;
          const take = u.slice(0, need);
          units.push(take); used.add(ui); need -= take.length;
        }
      }
    });
    return shuffle(units).flat().map(q => q.id);
  }

  // ---------- Score estimate ----------
  // A rough guide only: the real GMAT is adaptive, so the score depends on question difficulty too.
  const SCALE = [[0, 60], [0.3, 68], [0.5, 76], [0.65, 80], [0.8, 84], [0.9, 87], [1, 90]];
  function sectionScore(acc) {
    for (let i = 1; i < SCALE.length; i++) {
      const [x0, y0] = SCALE[i - 1], [x1, y1] = SCALE[i];
      if (acc <= x1) return Math.round(y0 + (y1 - y0) * (acc - x0) / (x1 - x0));
    }
    return 90;
  }
  function totalScore(q, v, di) {
    const raw = 205 + (q + v + di - 180) * 600 / 90;
    return Math.min(805, Math.max(205, Math.round((raw - 5) / 10) * 10 + 5));
  }

  // ---------- Sessions (practice + exam) ----------
  // Exams run section by section: answer each question in order (answer required to move on),
  // then review the section and change up to 3 answers, like the GMAT Focus Edition.
  const MAX_EDITS = 3;
  function newItem(id) {
    return { id, order: optionOrder(QMAP[id]), chosen: null, flag: false, t: 0 };
  }
  function startPractice(qids, title) {
    if (!qids.length) return;
    S.session = { mode: "practice", idx: 0, started: Date.now(), title: title || "Practice", items: qids.map(newItem), done: false };
    save();
    location.hash = "#/quiz";
  }
  // order: section ids in the order taken; size: 1 = full length, 0.5 = half length.
  function startExam(order, size, title) {
    const items = [], secs = [];
    for (const sid of order) {
      const sec = SECTION[sid];
      const n = Math.max(1, Math.round(sec.n * size));
      const ids = buildSection(sid, n);
      secs.push({ id: sid, from: items.length, to: items.length + ids.length, dur: Math.round(sec.minutes * 60 * size), edits: 0 });
      ids.forEach(id => items.push(newItem(id)));
    }
    S.session = {
      mode: "exam", idx: 0, started: Date.now(), title, size, items, secs, si: 0,
      phase: "gap", secStart: 0, done: false
    };
    save();
    location.hash = "#/quiz";
  }

  // ---------- Views ----------
  const views = {};

  views.home = function () {
    const dl = daysLeft();
    const all = allStats();
    const last = S.exams.filter(e => e.est && e.est.total).slice(-1)[0];
    const best = S.exams.reduce((m, e) => Math.max(m, e.est && e.est.total || 0), 0);
    const countdownText = dl === null ? `<b>📅</b><small>set your test date below</small>`
      : dl > 1 ? `<b>${dl}</b><small>days to go</small>` : dl === 1 ? `<b>1</b><small>day to go</small>` : dl === 0 ? `<b>Today</b><small>Good luck! 🍀</small>` : `<b>✓</b><small>test date passed</small>`;

    $app.innerHTML = `
      <div class="card hero">
        <div>
          <h1>GMAT Focus Prep</h1>
          <p>${esc(GMAT.full)}${S.date ? " · " + new Date(S.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : ""} · Target <b>${S.target}</b></p>
          <p style="margin-top:6px;opacity:.85">${QUESTIONS.length} practice questions · 3 sections · ${GMAT.questions} questions in 2 h 15 min on the real test</p>
        </div>
        <div class="countdown">${countdownText}</div>
      </div>

      ${S.session && !S.session.done ? `<div class="card mt row"><span>▶️ You have an unfinished session: <b>${esc(S.session.title)}</b> (${S.session.items.filter(x => x.chosen !== null).length}/${S.session.items.length} answered)</span><span class="spacer"></span><a class="btn primary small" href="#/quiz">Resume</a></div>` : ""}

      <div class="grid grid-4 mt">
        <div class="card stat"><b>${all.seen}/${all.total}</b><span>Questions attempted</span></div>
        <div class="card stat"><b>${all.seen ? all.acc + "%" : "—"}</b><span>Current accuracy</span></div>
        <div class="card stat"><b>${last ? last.est.total : "—"}</b><span>Latest mock score (est.)${best && last && best > last.est.total ? " · best " + best : ""}</span></div>
        <div class="card stat"><b>${all.missed}</b><span>Questions to review</span></div>
      </div>

      <div class="row mt">
        <button class="btn primary" id="go-daily">⚡ Quick 20: weakest areas</button>
        <a class="btn accent" href="#/exam">⏱️ Mock exam</a>
        <button class="btn" id="go-missed" ${all.missed ? "" : "disabled"}>🔁 Redo ${all.missed} missed</button>
        <a class="btn" href="#/stats">📊 Stats & what to practise</a>
      </div>

      ${studyPlan(dl)}

      ${SECTIONS.map(sec => {
        const s = sectionStats(sec.id);
        return `<h2>${sec.icon} ${esc(sec.name)} <span class="tag">${sec.n} questions · ${sec.minutes} min</span></h2>
        <div class="card">
          ${secTopics(sec.id).map(t => {
            const ts = topicStats(t.id);
            return `<div class="topic-row">
              <div class="name"><a href="#/notes/${t.id}">${t.icon} ${esc(t.name)}</a>
                <small>${ts.seen}/${ts.total} attempted${ts.seen ? " · " + ts.acc + "% correct" : ""}</small>
                <div class="bar"><i class="${ts.seen ? barClass(ts.acc) : ""}" style="width:${ts.seen ? ts.acc : 0}%"></i></div>
              </div>
              <button class="btn small" data-topic="${t.id}">Practise</button>
            </div>`;
          }).join("")}
          <div class="row mt"><span class="muted">${s.seen}/${s.total} attempted${s.seen ? " · " + s.acc + "% correct" : ""}</span><span class="spacer"></span>
            <button class="btn small primary" data-sec="${sec.id}">Practise 20 ${esc(sec.short)}</button></div>
        </div>`;
      }).join("")}

      <h2>Settings</h2>
      <div class="card">
        <div class="row">
          <label for="exam-date"><b>Test date</b></label>
          <input type="date" id="exam-date" value="${esc(S.date || "")}">
          <label for="target"><b>Target score</b></label>
          <select id="target">${Array.from({ length: 31 }, (_, i) => 505 + i * 10).map(v => `<option ${v === S.target ? "selected" : ""}>${v}</option>`).join("")}</select>
          <span class="spacer"></span>
          <a class="btn small" href="#/backup">💾 Back up / restore</a>
          <button class="btn small" id="reset">Reset all progress</button>
        </div>
        <p class="muted" id="sync-status" style="margin:10px 0 0">${syncStatusText()}</p>
      </div>`;

    document.getElementById("go-daily").onclick = () =>
      startPractice(pickQuestions(TOPICS.map(t => t.id), "weak", 20), "Quick 20");
    document.getElementById("go-missed").onclick = () =>
      startPractice(pickQuestions(TOPICS.map(t => t.id), "missed", 999), "Review missed");
    $app.querySelectorAll("[data-topic]").forEach(b => b.onclick = () =>
      startPractice(pickQuestions([b.dataset.topic], "weak", 15), TOPIC[b.dataset.topic].name));
    $app.querySelectorAll("[data-sec]").forEach(b => b.onclick = () =>
      startPractice(pickQuestions(secTopics(b.dataset.sec).map(t => t.id), "weak", 20), SECTION[b.dataset.sec].name + " practice"));
    document.getElementById("exam-date").onchange = e => { S.date = e.target.value; save(); render(); };
    document.getElementById("target").onchange = e => { S.target = +e.target.value; save(); render(); };
    document.getElementById("reset").onclick = () => {
      if (confirm("Erase all answers, mock exam history and flashcard progress?")) {
        const d = S.date, t = S.target; S = fresh(); S.date = d; S.target = t; save(true); render(); syncReplace();
      }
    };
  };

  function studyPlan(dl) {
    if (dl !== null && dl < 0) return "";
    const topics = TOPICS.map(t => ({ t, s: topicStats(t.id) }));
    const untouched = topics.filter(x => !x.s.seen);
    const weak = topics.filter(x => x.s.seen).sort((a, b) => a.s.acc - b.s.acc).slice(0, 3);
    let tip;
    if (dl === 0) tip = "Test day! Skim your formula boxes and the Data Sufficiency answer choices, then rest. Don't learn anything new.";
    else if (dl === 1) tip = "Tomorrow's the day. Do a light review of flashcards and your missed questions, check your ID and test appointment, then sleep well.";
    else if (untouched.length) {
      tip = `Start with topics you haven't tried: <b>${untouched.slice(0, 3).map(x => x.t.icon + " " + esc(x.t.name)).join(", ")}</b>. Read the notes, then press Practise.`;
    }
    else if (dl !== null && dl <= 5) tip = "Final stretch: take a full mock in the section order you'll use on test day, then redo every missed question.";
    else tip = `Focus on your weakest topics: <b>${weak.map(x => x.t.icon + " " + esc(x.t.name)).join(", ")}</b>. Take a full mock about once a week and review every miss.`;
    return `<div class="card mt"><b>📅 Today's plan</b><p style="margin:6px 0 0">${tip}</p></div>`;
  }

  views.notes = function (tid) {
    if (tid && TOPIC[tid]) {
      const t = TOPIC[tid];
      const idx = TOPICS.indexOf(t);
      const prev = TOPICS[idx - 1], next = TOPICS[idx + 1];
      const s = topicStats(tid);
      $app.innerHTML = `
        <a href="#/notes" class="muted">← All topics</a>
        <h1>${t.icon} ${esc(t.name)}</h1>
        <p class="sub">${esc(SECTION[t.sec].name)} · ${s.total} practice questions${s.seen ? " · " + s.acc + "% correct so far" : ""}</p>
        <div class="card notes">${window.NOTES[tid] || "<p>No notes yet.</p>"}</div>
        <div class="row mt">
          <button class="btn primary" id="practice-topic">Practise this topic</button>
          <a class="btn" href="#/cards/${tid}">Flashcards</a>
          <span class="spacer"></span>
          ${prev ? `<a class="btn small" href="#/notes/${prev.id}">← ${esc(prev.name)}</a>` : ""}
          ${next ? `<a class="btn small" href="#/notes/${next.id}">${esc(next.name)} →</a>` : ""}
        </div>`;
      document.getElementById("practice-topic").onclick = () =>
        startPractice(pickQuestions([tid], "weak", 999), t.name);
      window.scrollTo(0, 0);
      return;
    }
    $app.innerHTML = `
      <h1>Study Notes</h1>
      <p class="sub">Condensed notes for every GMAT Focus topic, with formulas, strategies and common traps, grouped by section.</p>
      ${SECTIONS.map(sec => `
        <h2 style="margin-top:22px">${sec.icon} ${esc(sec.name)} <span class="tag">${sec.n} questions · ${sec.minutes} min</span></h2>
        <div class="grid grid-3">
          ${secTopics(sec.id).map(t => {
            const st = topicStats(t.id);
            return `<a class="card topic-tile" href="#/notes/${t.id}">
              <div class="ic">${t.icon}</div><b>${esc(t.name)}</b>
              <small>${st.total} questions${st.seen ? " · " + st.acc + "% correct" : ""}</small>
            </a>`;
          }).join("")}
        </div>`).join("")}`;
  };

  views.practice = function () {
    const sel = new Set(TOPICS.map(t => t.id));
    $app.innerHTML = `
      <h1>Practice</h1>
      <p class="sub">See the answer and explanation right after each question. A stopwatch shows how long each one takes against GMAT pace.</p>
      <div class="card">
        <div class="row"><b>Topics</b><span class="spacer"></span>
          ${SECTIONS.map(s => `<button class="btn small" data-only="${s.id}">${esc(s.short)}</button>`).join("")}
          <button class="btn small" id="all">All</button><button class="btn small" id="none">None</button></div>
        ${SECTIONS.map(s => `<div class="tag mt">${s.icon} ${esc(s.name)}</div>
          <div class="chips" style="margin-top:6px">
            ${secTopics(s.id).map(t => `<label class="chip on" data-t="${t.id}">${t.icon} ${esc(t.name)}</label>`).join("")}
          </div>`).join("")}
        <label class="field">Questions</label>
        <div class="chips" id="filter">
          <label class="chip on" data-v="weak">Smart mix (missed & unseen first)</label>
          <label class="chip" data-v="all">Random</label>
          <label class="chip" data-v="unseen">Unseen only</label>
          <label class="chip" data-v="missed">Missed only</label>
        </div>
        <label class="field">How many?</label>
        <div class="chips" id="count">
          ${[10, 20, 40, 999].map((n, i) => `<label class="chip ${i === 1 ? "on" : ""}" data-v="${n}">${n === 999 ? "All" : n}</label>`).join("")}
        </div>
        <p class="muted" id="avail"></p>
        <button class="btn primary" id="start">Start practice</button>
      </div>`;

    let filter = "weak", count = 20;
    const avail = document.getElementById("avail");
    const chips = () => $app.querySelectorAll("[data-t]");
    const update = () => {
      chips().forEach(c => c.classList.toggle("on", sel.has(c.dataset.t)));
      const n = pickQuestions([...sel], filter, 9999).length;
      avail.textContent = n + " questions available with these settings.";
      document.getElementById("start").disabled = n === 0;
    };
    chips().forEach(c => c.onclick = () => {
      const t = c.dataset.t;
      sel.has(t) ? sel.delete(t) : sel.add(t);
      update();
    });
    const setOnly = ids => { sel.clear(); ids.forEach(i => sel.add(i)); update(); };
    document.getElementById("all").onclick = () => setOnly(TOPICS.map(t => t.id));
    document.getElementById("none").onclick = () => setOnly([]);
    $app.querySelectorAll("[data-only]").forEach(b => b.onclick = () => setOnly(secTopics(b.dataset.only).map(t => t.id)));
    const single = (id, fn) => document.getElementById(id).querySelectorAll(".chip").forEach(c => c.onclick = () => {
      document.getElementById(id).querySelectorAll(".chip").forEach(x => x.classList.remove("on"));
      c.classList.add("on"); fn(c.dataset.v); update();
    });
    single("filter", v => filter = v);
    single("count", v => count = +v);
    document.getElementById("start").onclick = () => startPractice(pickQuestions([...sel], filter, count));
    update();
  };

  const ORDERS = [["Q", "V", "DI"], ["Q", "DI", "V"], ["V", "Q", "DI"], ["V", "DI", "Q"], ["DI", "Q", "V"], ["DI", "V", "Q"]];
  views.exam = function () {
    const hist = S.exams.slice().reverse();
    const ord = S.order && ORDERS.some(o => o.join() === S.order.join()) ? S.order : ORDERS[0];
    const secName = id => SECTION[id].short;
    $app.innerHTML = `
      <h1>Mock Exam</h1>
      <p class="sub">Timed like the real GMAT Focus Edition: each section has its own 45-minute clock. Answer every question in order (you can bookmark as you go), then review the section and change up to ${MAX_EDITS} answers before moving on. No feedback until the end. Questions you haven't seen come up first.</p>
      <div class="card">
        <b>Full-length mock</b>
        <p class="muted" style="margin:4px 0 12px">64 questions · 2 h 15 min · estimated score out of 805</p>
        <label class="field" style="margin-top:0" for="order">Section order</label>
        <select id="order">${ORDERS.map(o => `<option value="${o.join(",")}" ${o.join() === ord.join() ? "selected" : ""}>${o.map(secName).join(" → ")}</option>`).join("")}</select>
        <div class="row mt">
          <button class="btn accent" id="full">Start full mock</button>
          <button class="btn" id="half">Half-length (32 questions · 68 min)</button>
        </div>
      </div>
      <h2>Single-section tests</h2>
      <div class="grid grid-3">
        ${SECTIONS.map(sec => `
          <div class="card">
            <b>${sec.icon} ${esc(sec.name)}</b>
            <p class="muted" style="margin:4px 0 12px">${sec.n} questions · ${sec.minutes} min</p>
            <button class="btn primary" data-s="${sec.id}">Start</button>
          </div>`).join("")}
      </div>
      <h2>History</h2>
      <div class="card">
        ${hist.length ? hist.map(e => {
          const p = pct(e.score, e.total);
          const secs = Object.entries(e.bySec || {}).map(([sid, b]) => `${SECTION[sid] ? SECTION[sid].short : sid} ${b.est || pct(b.c, b.n) + "%"}`).join(" · ");
          return `<div class="topic-row"><div class="name">${esc(e.title || "Mock")}: ${e.est && e.est.total ? "<b>" + e.est.total + "</b> · " : ""}${p}% <small>${e.score}/${e.total} · ${secs} · ${new Date(e.date).toLocaleString()} · ${fmtTime(e.secs)}</small>
            <div class="bar"><i class="${barClass(p)}" style="width:${p}%"></i></div></div></div>`;
        }).join("") : `<div class="empty">No mock exams yet.</div>`}
      </div>
      <p class="muted">Estimated scores are a rough guide from your accuracy. The real test is adaptive, so harder questions count for more.</p>`;
    const order = () => { const o = document.getElementById("order").value.split(","); S.order = o; save(true); return o; };
    document.getElementById("full").onclick = () => startExam(order(), 1, "Full mock");
    document.getElementById("half").onclick = () => startExam(order(), 0.5, "Half-length mock");
    $app.querySelectorAll("[data-s]").forEach(b => b.onclick = () => startExam([b.dataset.s], 1, SECTION[b.dataset.s].name + " test"));
  };

  // ----- Question rendering (shared by the quiz and the results review) -----
  const tabState = {};
  function niceScale(lo, hi, n) {
    const raw = (hi - lo) / (n || 5) || 1;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(f => f * p).find(s => s >= raw - 1e-9);
    return { lo: Math.floor(lo / step + 1e-9) * step, hi: Math.ceil(hi / step - 1e-9) * step, step };
  }
  const fmtNum = v => Math.abs(v) >= 1000 ? v.toLocaleString() : String(Math.round(v * 100) / 100);
  function chartSVG(c) {
    const W = 600, H = 320, m = { l: 58, r: 16, t: c.series.length > 1 ? 34 : 16, b: 52 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const vals = c.series.flatMap(s => s.v);
    const sc = niceScale(Math.min(0, c.min != null ? c.min : Math.min(...vals)), c.max != null ? c.max : Math.max(...vals), 5);
    const y = v => m.t + ph - (v - sc.lo) / (sc.hi - sc.lo) * ph;
    const band = pw / c.x.length;
    const cx = i => m.l + band * (i + 0.5);
    let g = "";
    for (let v = sc.lo; v <= sc.hi + 1e-9; v += sc.step) {
      g += `<line class="grid-l" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmtNum(Math.round(v * 1000) / 1000)}</text>`;
    }
    c.x.forEach((lab, i) => { g += `<text class="ax" x="${cx(i)}" y="${H - m.b + 18}" text-anchor="middle">${esc(lab)}</text>`; });
    if (c.xLabel) g += `<text class="ax" x="${m.l + pw / 2}" y="${H - 8}" text-anchor="middle">${esc(c.xLabel)}</text>`;
    if (c.yLabel) g += `<text class="ax" transform="translate(14 ${m.t + ph / 2}) rotate(-90)" text-anchor="middle">${esc(c.yLabel)}</text>`;
    const ns = c.series.length;
    c.series.forEach((s, si) => {
      if (c.type === "line") {
        g += `<polyline class="ln s${si}" points="${s.v.map((v, i) => cx(i) + "," + y(v)).join(" ")}"/>`;
        s.v.forEach((v, i) => {
          g += `<circle class="pt s${si}" cx="${cx(i)}" cy="${y(v)}" r="4"/>`;
          if (c.labels) g += `<text class="val" x="${cx(i)}" y="${y(v) - 9}" text-anchor="middle">${fmtNum(v)}</text>`;
        });
      } else {
        const bw = band * 0.72 / ns;
        s.v.forEach((v, i) => {
          const x = cx(i) - band * 0.36 + bw * si;
          const top = y(Math.max(v, 0)), h = Math.abs(y(v) - y(0));
          g += `<rect class="br s${si}" x="${x}" y="${top}" width="${bw - 2}" height="${h}" rx="2"/>`;
          if (c.labels && v !== 0) g += `<text class="val" x="${x + (bw - 2) / 2}" y="${top - 5}" text-anchor="middle">${fmtNum(v)}</text>`;
        });
      }
    });
    g += `<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${y(Math.max(0, sc.lo))}" y2="${y(Math.max(0, sc.lo))}"/>`;
    if (ns > 1) {
      let lx = m.l;
      c.series.forEach((s, si) => {
        g += `<rect class="br s${si}" x="${lx}" y="8" width="12" height="12" rx="2"/><text class="ax" x="${lx + 17}" y="18">${esc(s.name)}</text>`;
        lx += 30 + s.name.length * 7;
      });
    }
    return `<figure class="chart">${c.title ? `<figcaption>${esc(c.title)}</figcaption>` : ""}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.title || "Chart")}">${g}</svg></figure>`;
  }
  function tableHTML(t, sortable) {
    const num = v => typeof v === "number" || !isNaN(asNumber(v));
    return `<div class="tbl-wrap"><table class="data ${sortable ? "sortable" : ""}">
      ${t.title ? `<caption>${esc(t.title)}</caption>` : ""}
      <thead><tr>${t.head.map((h, i) => `<th data-col="${i}">${esc(h)}${sortable ? ' <span class="sort">↕</span>' : ""}</th>`).join("")}</tr></thead>
      <tbody>${t.rows.map(r => `<tr>${r.map(c => `<td class="${num(c) ? "n" : ""}">${esc(typeof c === "number" ? fmtNum(c) : c)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>${sortable ? `<p class="tag" style="margin:4px 0 0">Tip: select a column heading to sort the table, like on the real test.</p>` : ""}`;
  }
  function paras(t) { return (Array.isArray(t) ? t : [t]).map(p => `<p>${txt(p)}</p>`).join(""); }
  function stimBody(st, sortable) {
    let h = "";
    if (st.title) h += `<div class="stim-title">${esc(st.title)}</div>`;
    if (st.text) h += paras(st.text);
    if (st.table) h += tableHTML(st.table, sortable);
    if (st.chart) h += chartSVG(st.chart);
    if (st.after) h += paras(st.after);
    return h;
  }
  function stimHTML(q, key) {
    const st = q.set ? SETS[q.set] : q.st;
    if (!st) return "";
    const sortable = q.kind === "ta";
    if (st.tabs) {
      const k = q.set || q.id;
      const on = Math.min(tabState[k] || 0, st.tabs.length - 1);
      return `<div class="stim" data-key="${esc(k)}">
        <div class="tabs">${st.tabs.map((t, i) => `<button class="tab ${i === on ? "on" : ""}" data-tab="${i}" data-set="${esc(k)}">${esc(t.t)}</button>`).join("")}</div>
        ${st.tabs.map((t, i) => `<div class="tab-body" ${i === on ? "" : "hidden"}>${stimBody(t, sortable)}</div>`).join("")}
      </div>`;
    }
    return `<div class="stim ${st.text && q.kind === "rc" ? "passage" : ""}">${stimBody(st, sortable)}</div>`;
  }
  const isLong = q => { const st = q.set ? SETS[q.set] : q.st; return !!(st && (st.tabs || (q.kind === "rc" && st.text))); };

  // The answer area. o.reveal = show right/wrong; o.lock = can't change.
  function answerHTML(q, it, o) {
    const ch = it.chosen;
    const dis = o.lock ? "disabled" : "";
    if (q.fmt === "mc") {
      return `<div id="opts">${it.order.map((oi, pos) => {
        let cls = "";
        if (o.reveal) { if (oi === q.ans) cls = "right"; else if (oi === ch) cls = "wrong"; }
        else if (ch === oi) cls = "sel";
        return `<button class="opt ${cls}" data-o="${oi}" ${dis}><span class="k">${LETTERS[pos]}</span><span>${txt(q.opts[oi])}</span></button>`;
      }).join("")}</div>`;
    }
    if (q.fmt === "tpa") {
      const a = q.tpa.a, c = Array.isArray(ch) ? ch : [];
      return `<div class="tbl-wrap"><table class="grid-q"><thead><tr>${q.tpa.cols.map(h => `<th class="c">${esc(h)}</th>`).join("")}<th></th></tr></thead><tbody>
        ${q.tpa.rows.map((row, ri) => `<tr>${[0, 1].map(col => {
          const picked = c[col] === ri;
          let cls = picked ? "sel" : "";
          if (o.reveal) cls = a[col] === ri ? "right" : picked ? "wrong" : "";
          return `<td class="c"><button class="radio ${cls}" data-col="${col}" data-row="${ri}" ${dis} aria-label="${esc(q.tpa.cols[col])}: ${esc(row)}"></button></td>`;
        }).join("")}<td>${txt(row)}</td></tr>`).join("")}
      </tbody></table></div>`;
    }
    if (q.fmt === "tf") {
      const c = Array.isArray(ch) ? ch : [];
      return `<div class="tbl-wrap"><table class="grid-q"><thead><tr>${q.tfl.map(h => `<th class="c">${esc(h)}</th>`).join("")}<th></th></tr></thead><tbody>
        ${q.tf.map((s, i) => `<tr>${[0, 1].map(v => {
          const picked = c[i] === v, right = (s[1] ? 0 : 1) === v;
          let cls = picked ? "sel" : "";
          if (o.reveal) cls = right ? "right" : picked ? "wrong" : "";
          return `<td class="c"><button class="radio ${cls}" data-i="${i}" data-v="${v}" ${dis} aria-label="${esc(q.tfl[v])}: ${esc(s[0])}"></button></td>`;
        }).join("")}<td>${txt(s[0])}</td></tr>`).join("")}
      </tbody></table></div>`;
    }
    return ""; // dd: the drop-downs are inside the question text
  }
  function stemHTML(q, it, o) {
    if (q.fmt !== "dd") return txt(q.text);
    const c = Array.isArray(it.chosen) ? it.chosen : [];
    return esc(q.text).replace(/\n/g, "<br>").replace(/\[(\d)\]/g, (m, n) => {
      const i = +n - 1, d = q.dd[i];
      if (!d) return m;
      let cls = "";
      if (o.reveal) cls = c[i] === d.a ? "right" : "wrong";
      return `<select class="dd ${cls}" data-d="${i}" ${o.lock ? "disabled" : ""}><option value="">Select…</option>${d.o.map((x, j) => `<option value="${j}" ${c[i] === j ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
    });
  }
  function correctText(q) {
    if (q.fmt === "mc") return "";
    if (q.fmt === "tpa") return `<p class="muted" style="margin:0 0 6px">Answer: <b>${esc(q.tpa.cols[0])}</b>: ${esc(q.tpa.rows[q.tpa.a[0]])} · <b>${esc(q.tpa.cols[1])}</b>: ${esc(q.tpa.rows[q.tpa.a[1]])}</p>`;
    if (q.fmt === "tf") return `<p class="muted" style="margin:0 0 6px">Answer: ${q.tf.map((s, i) => `${i + 1}. ${esc(q.tfl[s[1] ? 0 : 1])}`).join(" · ")}</p>`;
    return `<p class="muted" style="margin:0 0 6px">Answer: ${q.dd.map((d, i) => `[${i + 1}] ${esc(d.o[d.a])}`).join(" · ")}</p>`;
  }
  function explainHTML(q, it) {
    const ok = isRight(q, it.chosen);
    return `<div class="explain"><b class="${ok ? "ok" : "no"}">${ok ? "✓ Correct" : it.chosen === null ? "Not answered" : "✗ Not quite"}</b> ${correctText(q)}${txt(q.exp)}</div>`;
  }
  function questionHTML(q, it, o) {
    const ds = q.kind === "ds" ? `<p class="tag" style="margin:0 0 8px">Decide whether the data in the statements are sufficient to answer the question.</p>` : "";
    const stim = stimHTML(q);
    const main = `${ds}<div class="q-text">${stemHTML(q, it, o)}</div>${answerHTML(q, it, o)}${o.reveal ? explainHTML(q, it) : ""}`;
    if (!stim) return main;
    return isLong(q) ? `<div class="split"><div class="split-l">${stim}</div><div class="split-r">${main}</div></div>` : stim + main;
  }
  // Tabs and sortable tables work anywhere a question is shown.
  function wireStims(root) {
    root.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => {
      tabState[b.dataset.set] = +b.dataset.tab;
      const box = b.closest(".stim");
      box.querySelectorAll(".tab").forEach((x, i) => x.classList.toggle("on", i === +b.dataset.tab));
      box.querySelectorAll(".tab-body").forEach((x, i) => { x.hidden = i !== +b.dataset.tab; });
    });
    root.querySelectorAll("table.sortable th").forEach(th => th.onclick = () => {
      const table = th.closest("table"), col = +th.dataset.col;
      const dir = th.dataset.dir === "asc" ? "desc" : "asc";
      table.querySelectorAll("th").forEach(x => { delete x.dataset.dir; });
      th.dataset.dir = dir;
      const body = table.tBodies[0];
      const val = tr => { const s = tr.cells[col].textContent; const n = asNumber(s); return isNaN(n) ? s.toLowerCase() : n; };
      [...body.rows].sort((a, b) => {
        const x = val(a), y = val(b);
        const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
        return dir === "asc" ? r : -r;
      }).forEach(tr => body.appendChild(tr));
    });
  }

  // ----- Quiz runner -----
  let timerId = null;
  // Time spent on the question on screen (added to item.t when it's left or answered).
  let viewing = null;
  const revealed = (ss, it) => ss.mode === "practice" && (QMAP[it.id].fmt === "mc" ? it.chosen !== null : !!it.checked);
  function accrue() {
    if (viewing && viewing.ss === S.session && !viewing.ss.done) {
      const it = viewing.ss.items[viewing.idx];
      if (it && !revealed(viewing.ss, it)) it.t = (it.t || 0) + (Date.now() - viewing.since) / 1000;
    }
    viewing = null;
  }
  const curSec = ss => ss.secs[ss.si];
  const secLeft = ss => curSec(ss).dur - (Date.now() - ss.secStart) / 1000;

  views.quiz = function () {
    accrue();
    const ss = S.session;
    if (!ss) { location.hash = "#/practice"; return; }
    if (ss.done) { views.results(); return; }
    if (ss.mode === "exam") return examView(ss);
    const it = ss.items[ss.idx];
    const q = QMAP[it.id];
    if (!q) { S.session = null; save(); location.hash = "#/practice"; return; }
    const rev = revealed(ss, it);
    const nAns = ss.items.filter(x => revealed(ss, x)).length;
    const nRight = ss.items.filter(x => revealed(ss, x) && isRight(QMAP[x.id], x.chosen)).length;
    $app.className = isLong(q) ? "wide" : "";
    $app.innerHTML = `
      <div class="quiz-top">
        <b>${esc(ss.title)}</b>
        <span class="pill">${ss.idx + 1} / ${ss.items.length}</span>
        <span class="pill">✓ ${nRight} / ${nAns}</span>
        <span class="pill timer" id="timer"></span>
        <div class="progress"><div class="bar"><i style="width:${pct(nAns, ss.items.length)}%"></i></div></div>
        <button class="btn small" id="quit">End</button>
      </div>
      <div class="card">
        <div class="row"><span class="tag">${TOPIC[q.topic].icon} ${esc(TOPIC[q.topic].name)}${TOPIC[q.topic].name === KIND_LABEL[q.kind] ? "" : " · " + KIND_LABEL[q.kind]}</span></div>
        ${questionHTML(q, it, { reveal: rev, lock: rev })}
        <div class="row mt">
          <button class="btn" id="prev" ${ss.idx === 0 ? "disabled" : ""}>← Back</button>
          <span class="spacer"></span>
          ${q.fmt !== "mc" && !rev ? `<button class="btn primary" id="check" ${isComplete(q, it.chosen) ? "" : "disabled"}>Check answer</button>` : ""}
          ${ss.idx < ss.items.length - 1
            ? `<button class="btn primary" id="next" ${rev ? "" : "disabled"}>Next →</button>`
            : `<button class="btn accent" id="finish" ${rev ? "" : "disabled"}>Finish</button>`}
        </div>
        <div class="kbd-hint">Keys: ${q.fmt === "mc" ? "A–E or 1–5 to answer · " : ""}Enter / → next · ← back</div>
      </div>`;
    wireStims($app);
    viewing = { ss, idx: ss.idx, since: Date.now() };

    const go = i => { accrue(); ss.idx = i; save(); views.quiz(); window.scrollTo(0, 0); };
    const commit = () => { accrue(); it.checked = true; record(it.id, isRight(q, it.chosen), it.t); save(); views.quiz(); };
    wireAnswers(q, it, rev, () => {
      if (q.fmt === "mc") commit();
      else { save(true); const c = document.getElementById("check"); if (c) c.disabled = !isComplete(q, it.chosen); }
    });
    const chk = document.getElementById("check");
    if (chk) chk.onclick = () => { if (isComplete(q, it.chosen)) commit(); };
    const next = document.getElementById("next"), fin = document.getElementById("finish");
    document.getElementById("prev").onclick = () => go(ss.idx - 1);
    if (next) next.onclick = () => go(ss.idx + 1);
    if (fin) fin.onclick = () => finish();
    document.getElementById("quit").onclick = () => {
      if (nAns) finish();
      else { S.session = null; save(); location.hash = "#/practice"; }
    };
    tick();

    keyHandler = e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      const k = e.key.toUpperCase();
      if (q.fmt === "mc" && !rev && k.length === 1) {
        let n = LETTERS.indexOf(k); if (n < 0) n = "12345".indexOf(k);
        if (n >= 0 && n < it.order.length) { accrue(); it.chosen = it.order[n]; commit(); return; }
      }
      if ((e.key === "Enter" || e.key === "ArrowRight") && rev) {
        if (ss.idx < ss.items.length - 1) go(ss.idx + 1); else finish();
      }
      if (e.key === "ArrowLeft" && ss.idx > 0) go(ss.idx - 1);
    };
  };

  // Clicking an answer. onChange runs after it.chosen changes; returns false from canChange to block.
  function wireAnswers(q, it, locked, onChange, canChange) {
    if (locked) return;
    const set = fn => {
      if (canChange && !canChange()) return;
      if (q.fmt === "mc") accrue();
      fn(); onChange();
    };
    const arr = () => { if (!Array.isArray(it.chosen)) it.chosen = []; return it.chosen; };
    $app.querySelectorAll(".opt[data-o]").forEach(b => b.onclick = () => set(() => { it.chosen = +b.dataset.o; }));
    $app.querySelectorAll(".radio[data-col]").forEach(b => b.onclick = () => set(() => {
      arr()[+b.dataset.col] = +b.dataset.row;
      $app.querySelectorAll(`.radio[data-col="${b.dataset.col}"]`).forEach(x => x.classList.toggle("sel", x === b));
    }));
    $app.querySelectorAll(".radio[data-i]").forEach(b => b.onclick = () => set(() => {
      arr()[+b.dataset.i] = +b.dataset.v;
      $app.querySelectorAll(`.radio[data-i="${b.dataset.i}"]`).forEach(x => x.classList.toggle("sel", x === b));
    }));
    $app.querySelectorAll("select.dd").forEach(s => s.onchange = () => {
      if (canChange && !canChange()) { s.value = Array.isArray(it.chosen) && it.chosen[+s.dataset.d] != null ? it.chosen[+s.dataset.d] : ""; return; }
      arr()[+s.dataset.d] = s.value === "" ? null : +s.value; onChange();
    });
  }

  function examView(ss) {
    const sec = curSec(ss), meta = SECTION[sec.id];
    const secNo = ss.si + 1, nSec = ss.secs.length;
    const secItems = ss.items.slice(sec.from, sec.to);
    $app.className = "";

    if (ss.phase === "gap") {
      const prevSec = ss.si > 0 ? ss.secs[ss.si - 1] : null;
      $app.innerHTML = `
        <div class="card">
          ${prevSec ? `<p>✓ <b>${esc(SECTION[prevSec.id].name)}</b> is done.${ss.timedOut ? " Time ran out on that section." : ""} Take a short break if you like: the next clock starts when you press Start.</p>` : `<h1>${esc(ss.title)}</h1><p class="muted">${ss.secs.map(s => `${SECTION[s.id].short} (${s.to - s.from} questions · ${fmtTime(s.dur)})`).join(" → ")}</p>`}
          <h2 style="margin-top:12px">Section ${secNo} of ${nSec}: ${meta.icon} ${esc(meta.name)}</h2>
          <p>${secItems.length} questions · ${fmtTime(sec.dur)} minutes. ${esc(meta.blurb)}</p>
          <ul class="muted">
            <li>Answer each question to move on. Use 🔖 Bookmark on anything you want to revisit.</li>
            <li>At the end of the section you can review any question and change up to ${MAX_EDITS} answers, while the clock keeps running.</li>
            <li>Target pace: about ${fmtTime(sec.dur / secItems.length)} per question.</li>
          </ul>
          <div class="row mt"><button class="btn accent" id="begin">Start section</button><span class="spacer"></span><a class="btn small" href="#/">Later</a></div>
        </div>`;
      document.getElementById("begin").onclick = () => {
        ss.phase = "q"; ss.idx = sec.from; ss.secStart = Date.now(); ss.timedOut = false; save(); views.quiz();
      };
      return;
    }
    if (secLeft(ss) <= 0) { endSection(true); return; }

    const edits = sec.edits || 0;
    const topBar = extra => `
      <div class="quiz-top">
        <b>${meta.icon} ${esc(meta.short)}</b>${nSec > 1 ? `<span class="pill">Section ${secNo}/${nSec}</span>` : ""}
        ${extra}
        <span class="pill timer" id="timer"></span>
        <div class="progress"><div class="bar"><i style="width:${pct(secItems.filter(x => isComplete(QMAP[x.id], x.chosen)).length, secItems.length)}%"></i></div></div>
      </div>`;

    if (ss.phase === "review") {
      $app.innerHTML = `
        ${topBar(`<span class="pill">Review</span>`)}
        <div class="card">
          <h2 style="margin-top:0">Question review & edit</h2>
          <p class="muted">Open any question to look at it again. You can change up to ${MAX_EDITS} answers in this section: <b>${MAX_EDITS - edits} edit${MAX_EDITS - edits === 1 ? "" : "s"} left</b>.</p>
          <div class="qnav">${secItems.map((x, i) => `<button data-go="${sec.from + i}" class="${isComplete(QMAP[x.id], x.chosen) ? "ans" : ""} ${x.flag ? "flag" : ""}" title="${x.flag ? "Bookmarked" : ""}">${i + 1}</button>`).join("")}</div>
          <p class="tag">Highlighted = answered · red dot = bookmarked${secItems.some(x => x.edited) ? " · ✎ = edited" : ""}</p>
          <div class="row mt"><span class="spacer"></span><button class="btn accent" id="end-sec">${ss.si < nSec - 1 ? "End section" : "End exam"}</button></div>
        </div>`;
      $app.querySelectorAll("[data-go]").forEach(b => {
        if (ss.items[+b.dataset.go].edited) b.textContent += " ✎";
        b.onclick = () => { ss.phase = "edit"; ss.idx = +b.dataset.go; save(); views.quiz(); };
      });
      document.getElementById("end-sec").onclick = () => {
        if (confirm(ss.si < nSec - 1 ? "End this section? You can't come back to it." : "End the exam and see your results?")) endSection(false);
      };
      tick();
      keyHandler = null;
      return;
    }

    // phase "q" (answering in order) or "edit" (revisiting from the review screen)
    const it = ss.items[ss.idx], q = QMAP[it.id];
    const pos = ss.idx - sec.from + 1;
    const editing = ss.phase === "edit";
    const canEdit = !editing || it.edited || edits < MAX_EDITS;
    $app.className = isLong(q) ? "wide" : "";
    $app.innerHTML = `
      ${topBar(`<span class="pill">${pos} / ${secItems.length}</span>${editing ? `<span class="pill">Edits left: ${MAX_EDITS - edits}</span>` : ""}`)}
      <div class="card">
        <div class="row"><span class="tag">${KIND_LABEL[q.kind]}</span><span class="spacer"></span>
          <button class="btn small" id="flag">${it.flag ? "🔖 Bookmarked" : "🔖 Bookmark"}</button></div>
        ${questionHTML(q, it, { reveal: false, lock: !canEdit })}
        ${!canEdit ? `<p class="muted">You've used all ${MAX_EDITS} edits for this section, so this answer can't be changed.</p>` : ""}
        <div class="row mt">
          ${editing ? `<button class="btn" id="back-review">← Review screen</button>` : ""}
          <span class="spacer"></span>
          ${editing ? "" : `<button class="btn primary" id="next" ${isComplete(q, it.chosen) ? "" : "disabled"}>${pos < secItems.length ? "Next →" : "Go to review →"}</button>`}
        </div>
        ${editing ? "" : `<div class="kbd-hint">Answer to continue. Keys: ${q.fmt === "mc" ? "A–E / 1–5 to select · " : ""}Enter to confirm · B bookmark</div>`}
      </div>`;
    wireStims($app);
    viewing = { ss, idx: ss.idx, since: Date.now() };
    const before = JSON.stringify(it.chosen);
    wireAnswers(q, it, !canEdit, () => {
      if (editing && !it.edited && JSON.stringify(it.chosen) !== before) { it.edited = true; sec.edits = edits + 1; }
      save(true);
      if (q.fmt === "mc" || editing) views.quiz();
      else { const n = document.getElementById("next"); if (n) n.disabled = !isComplete(q, it.chosen); }
    }, () => canEdit);
    document.getElementById("flag").onclick = () => { it.flag = !it.flag; save(true); views.quiz(); };
    const next = () => {
      if (!isComplete(q, it.chosen)) return;
      accrue();
      if (pos < secItems.length) ss.idx++; else ss.phase = "review";
      save(); views.quiz(); window.scrollTo(0, 0);
    };
    const nb = document.getElementById("next");
    if (nb) nb.onclick = next;
    const br = document.getElementById("back-review");
    if (br) br.onclick = () => { accrue(); ss.phase = "review"; save(); views.quiz(); };
    tick();
    keyHandler = e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      const k = e.key.toUpperCase();
      if (q.fmt === "mc" && canEdit && k.length === 1) {
        let n = LETTERS.indexOf(k); if (n < 0) n = "12345".indexOf(k);
        if (n >= 0 && n < it.order.length) {
          it.chosen = it.order[n];
          if (editing && !it.edited && JSON.stringify(it.chosen) !== before) { it.edited = true; sec.edits = edits + 1; }
          save(true); views.quiz(); return;
        }
      }
      if (k === "B" && e.key.length === 1) { it.flag = !it.flag; save(true); views.quiz(); return; }
      if (e.key === "Enter" && !editing) next();
    };
  }

  function endSection(timedOut) {
    const ss = S.session;
    if (!ss || ss.done || ss.mode !== "exam") return;
    accrue();
    curSec(ss).secs = Math.min(curSec(ss).dur, Math.round((Date.now() - ss.secStart) / 1000));
    if (ss.si < ss.secs.length - 1) {
      ss.si++; ss.phase = "gap"; ss.timedOut = timedOut; save(); views.quiz();
    } else finish();
  }

  function tick() {
    clearInterval(timerId);
    const upd = () => {
      const ss = S.session, t = document.getElementById("timer");
      if (!ss || ss.done || !t) { clearInterval(timerId); return; }
      if (ss.mode === "exam") {
        if (ss.phase === "gap") { clearInterval(timerId); return; }
        const left = secLeft(ss);
        t.textContent = "⏱ " + fmtTime(left);
        t.classList.toggle("low", left < 300);
        if (left <= 0) { clearInterval(timerId); endSection(true); }
      } else {
        const it = ss.items[ss.idx];
        const live = viewing && viewing.ss === ss && !revealed(ss, it) ? (Date.now() - viewing.since) / 1000 : 0;
        const secs = (it.t || 0) + live;
        const target = targetSecs(QMAP[it.id].sec);
        t.textContent = "⏱ " + fmtTime(secs);
        t.classList.toggle("low", secs > target * 1.5);
        t.title = "GMAT pace for this section: about " + fmtTime(target) + " per question";
      }
    };
    upd();
    timerId = setInterval(upd, 1000);
  }

  function finish() {
    const ss = S.session;
    if (!ss || ss.done) return;
    accrue();
    clearInterval(timerId);
    ss.done = true;
    ss.secs_total = Math.round((Date.now() - ss.started) / 1000);
    if (ss.mode === "exam") {
      if (ss.phase !== "gap" && !curSec(ss).secs) curSec(ss).secs = Math.min(curSec(ss).dur, Math.round((Date.now() - ss.secStart) / 1000));
      ss.items.forEach(it => { if (it.chosen !== null) record(it.id, isRight(QMAP[it.id], it.chosen), it.t); });
      const bySec = {};
      let score = 0, time = 0;
      for (const sec of ss.secs) {
        const items = ss.items.slice(sec.from, sec.to);
        const c = items.filter(it => isRight(QMAP[it.id], it.chosen)).length;
        score += c; time += sec.secs || 0;
        bySec[sec.id] = { n: items.length, c, est: sectionScore(items.length ? c / items.length : 0) };
      }
      const est = {};
      if (SECTIONS.every(s => bySec[s.id])) est.total = totalScore(bySec.Q.est, bySec.V.est, bySec.DI.est);
      ss.bySec = bySec; ss.est = est;
      S.exams.push({ date: Date.now(), title: ss.title, score, total: ss.items.length, secs: time, bySec, est });
    }
    save();
    location.hash = "#/results";
    render();
  }

  views.results = function () {
    const ss = S.session;
    if (!ss || !ss.done) { location.hash = "#/"; return; }
    const exam = ss.mode === "exam";
    const items = exam ? ss.items : ss.items.filter(it => revealed(ss, it));
    const right = it => isRight(QMAP[it.id], it.chosen);
    const score = items.filter(right).length;
    const p = pct(score, items.length);
    const byTopic = {};
    for (const it of items) {
      const t = QMAP[it.id].topic;
      byTopic[t] = byTopic[t] || { n: 0, c: 0, t: 0 };
      byTopic[t].n++; byTopic[t].t += it.t || 0; if (right(it)) byTopic[t].c++;
    }
    const wrong = items.filter(it => !right(it));
    const onlyWrong = !!views.results.onlyWrong;
    const shown = items.map((it, i) => [it, i]).filter(([it]) => !onlyWrong || !right(it));
    const secRows = exam ? ss.secs.map(sec => {
      const b = ss.bySec[sec.id], meta = SECTION[sec.id];
      const n = sec.to - sec.from, tq = n ? (sec.secs || 0) / n : 0;
      return `<div class="topic-row"><div class="name">${meta.icon} ${esc(meta.name)} <small>${b.c}/${b.n} correct · ${pct(b.c, b.n)}% · ${fmtTime(sec.secs || 0)} used (${fmtTime(tq)} per question, target ${fmtTime(sec.dur / n)})</small>
        <div class="bar"><i class="${barClass(pct(b.c, b.n))}" style="width:${pct(b.c, b.n)}%"></i></div></div><div class="score-sm">${b.est}<small>est.</small></div></div>`;
    }).join("") : "";
    const total = exam && ss.est && ss.est.total;
    $app.className = "";
    $app.innerHTML = `
      <h1>${esc(ss.title)}: results</h1>
      <div class="card">
        <div class="row">
          <div class="score-big ${total ? (total >= S.target ? "pass" : "fail") : ""}">${total || p + "%"}</div>
          <div><b>${score} of ${items.length} correct${total ? " · " + p + "%" : ""}</b><br><span class="muted">${total
            ? (total >= S.target ? `At or above your ${S.target} target 🎉` : `${S.target - total} points below your ${S.target} target, keep going!`) + " · Estimated from accuracy (the real test is adaptive)."
            : "Time: " + fmtTime(exam ? ss.secs.reduce((a, s) => a + (s.secs || 0), 0) : items.reduce((a, it) => a + (it.t || 0), 0))}</span></div>
        </div>
      </div>
      ${exam ? `<h2>By section</h2><div class="card">${secRows}</div>` : ""}
      <h2>By topic</h2>
      <div class="card">
        ${Object.keys(byTopic).map(t => {
          const b = byTopic[t], tp = pct(b.c, b.n);
          return `<div class="topic-row"><div class="name">${TOPIC[t].icon} ${esc(TOPIC[t].name)} <small>${b.c}/${b.n} · ${tp}% · avg ${fmtTime(b.t / b.n)} per question (pace ${fmtTime(targetSecs(TOPIC[t].sec))})</small>
            <div class="bar"><i class="${barClass(tp)}" style="width:${tp}%"></i></div></div>
            <a class="btn small" href="#/notes/${t}">Notes</a></div>`;
        }).join("")}
      </div>
      <div class="row mt">
        ${wrong.length ? `<button class="btn primary" id="retry">🔁 Retry the ${wrong.length} I got wrong</button>` : ""}
        <a class="btn" href="#/">Home</a>
      </div>
      <div class="row" style="margin-top:28px"><h2 style="margin:0">Review</h2><span class="spacer"></span>
        <label class="chip ${onlyWrong ? "on" : ""}" id="only-wrong">Only show mistakes</label></div>
      ${shown.map(([it, i]) => {
        const q = QMAP[it.id];
        return `<div class="card mt">
          <div class="tag">${i + 1}. ${TOPIC[q.topic].icon} ${esc(TOPIC[q.topic].name)} · ${KIND_LABEL[q.kind]} · ${fmtTime(it.t || 0)} ${right(it) ? "· ✓" : "· ✗"}${it.flag ? " · 🔖" : ""}</div>
          ${questionHTML(q, it, { reveal: true, lock: true })}
        </div>`;
      }).join("") || `<div class="card mt empty">No mistakes to show. 🎉</div>`}`;
    wireStims($app);
    const r = document.getElementById("retry");
    if (r) r.onclick = () => startPractice(groupSets(shuffle(wrong.map(it => it.id))), "Retry missed");
    document.getElementById("only-wrong").onclick = () => { views.results.onlyWrong = !onlyWrong; views.results(); };
  };

  // ----- Flashcards -----
  let deck = null;
  views.cards = function (tid) {
    const topic = tid && TOPIC[tid] ? tid : "";
    const onlyLearning = !!(deck && deck.onlyLearning);
    const signature = topic + "|" + onlyLearning;
    const inScope = tp => !topic || tp === topic;
    if (!deck || deck.sig !== signature) {
      let cards = window.GLOSSARY.map((g, i) => ({ i, term: g[0], def: g[1], topic: g[2] })).filter(c => inScope(c.topic));
      if (onlyLearning) cards = cards.filter(c => S.cards[c.term] !== 1);
      deck = { sig: signature, onlyLearning, cards: shuffle(cards), pos: 0, flipped: false };
    }
    const all = window.GLOSSARY.filter(g => inScope(g[2]));
    const known = all.filter(g => S.cards[g[0]] === 1).length;
    const c = deck.cards[deck.pos];

    $app.innerHTML = `
      <h1>Flashcards</h1>
      <p class="sub">Formulas, rules and question-type strategies. Tap the card to flip it, and mark each one to track what you know. ${known}/${all.length} known.</p>
      <div class="row">
        <select id="topic">
          <option value="">All topics</option>
          ${SECTIONS.map(s => `<optgroup label="${esc(s.name)}">${secTopics(s.id).map(t => `<option value="${t.id}" ${t.id === topic ? "selected" : ""}>${t.icon} ${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}
        </select>
        <label class="chip ${onlyLearning ? "on" : ""}" id="only">Only cards I'm still learning</label>
        <span class="spacer"></span>
        <button class="btn small" id="shuf">🔀 Shuffle</button>
      </div>
      <div class="mt">
      ${c ? `
        <div class="flash-wrap">
          <div class="flash ${deck.flipped ? "flipped" : ""}" id="flash">
            <div class="face"><div class="tag">${TOPIC[c.topic].icon} ${esc(TOPIC[c.topic].name)}</div><div class="term">${esc(c.term)}</div><div class="hint">Tap to flip · Space</div></div>
            <div class="face back"><div class="def">${txt(c.def)}</div><div class="hint">${S.cards[c.term] === 1 ? "Marked as known" : ""}</div></div>
          </div>
          <div class="row mt">
            <button class="btn" id="prev" ${deck.pos === 0 ? "disabled" : ""}>←</button>
            <span class="pill">${deck.pos + 1} / ${deck.cards.length}</span>
            <span class="spacer"></span>
            <button class="btn" id="learn">😕 Still learning</button>
            <button class="btn primary" id="know">✓ Know it</button>
          </div>
        </div>` : `<div class="card empty">${onlyLearning ? "🎉 You've marked every card in this set as known!" : "No cards."}</div>`}
      </div>`;

    document.getElementById("topic").onchange = e => { deck = null; location.hash = e.target.value ? "#/cards/" + e.target.value : "#/cards"; };
    document.getElementById("only").onclick = () => { deck = { sig: "", onlyLearning: !onlyLearning }; views.cards(topic); };
    document.getElementById("shuf").onclick = () => { deck.cards = shuffle(deck.cards); deck.pos = 0; deck.flipped = false; views.cards(topic); };
    if (!c) { keyHandler = null; return; }
    const flip = () => { deck.flipped = !deck.flipped; document.getElementById("flash").classList.toggle("flipped", deck.flipped); };
    const move = d => { deck.pos = Math.min(Math.max(0, deck.pos + d), deck.cards.length - 1); deck.flipped = false; views.cards(topic); };
    const mark = v => {
      S.cards[c.term] = v; save();
      if (deck.pos < deck.cards.length - 1) move(1); else { deck.flipped = false; views.cards(topic); }
    };
    document.getElementById("flash").onclick = flip;
    document.getElementById("prev").onclick = () => move(-1);
    document.getElementById("know").onclick = () => mark(1);
    document.getElementById("learn").onclick = () => mark(0);
    keyHandler = e => {
      if (e.target.tagName === "SELECT") return;
      if (e.key === " ") { e.preventDefault(); flip(); }
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
  };

  views.guide = function () {
    const kinds = {};
    QUESTIONS.forEach(q => { kinds[q.kind] = (kinds[q.kind] || 0) + 1; });
    const rows = SECTIONS.map(sec => secTopics(sec.id).map((t, i) => {
      const st = topicStats(t.id);
      return `<tr>
        ${i === 0 ? `<td rowspan="${secTopics(sec.id).length}"><b>${sec.icon} ${esc(sec.name)}</b><br><span class="tag">${sec.n} questions · ${sec.minutes} min · ~${fmtTime(targetSecs(sec.id))} each</span></td>` : ""}
        <td>${t.icon} <a href="#/notes/${t.id}">${esc(t.name)}</a></td>
        <td>${sec.mix[t.id] || 0}</td>
        <td>${st.total}</td>
        <td>${st.seen ? `${st.acc}%<div class="bar"><i class="${barClass(st.acc)}" style="width:${st.acc}%"></i></div>` : `<span class="muted">—</span>`}</td>
      </tr>`;
    }).join("")).join("");
    const recent = S.exams.filter(e => e.est && e.est.total).slice(-3);
    $app.innerHTML = `
      <h1>GMAT Focus Guide</h1>
      <p class="sub"><b>${esc(GMAT.full)}.</b> ${GMAT.questions} questions in 2 hours 15 minutes, in three 45-minute sections that you can take in any order, with one optional 10-minute break. Scores run from 205 to 805.</p>
      <div class="grid grid-3">
        ${SECTIONS.map(sec => `<div class="card"><b>${sec.icon} ${esc(sec.name)}</b><p class="muted" style="margin:4px 0 0">${sec.n} questions · ${sec.minutes} min · scored 60–90</p><p style="margin:8px 0 0;font-size:14px">${esc(sec.blurb)}</p></div>`).join("")}
      </div>
      <h2>Sections and topics</h2>
      <div class="card notes"><table>
        <tr><th>Section</th><th>Topic</th><th>In a mock</th><th>In this bank</th><th>Your accuracy</th></tr>
        ${rows}
      </table></div>
      <p class="muted">Question bank: ${Object.entries(kinds).map(([k, n]) => `${n} ${KIND_LABEL[k]}`).join(" · ")}.</p>
      <h2>How the test works</h2>
      <div class="card notes">
        <ul>
          <li><b>Adaptive</b>: each section adapts to you question by question. Getting harder questions means you're doing well, so don't panic when they feel tough.</li>
          <li><b>You must answer to move on</b>, and unanswered questions at the end of a section are heavily penalized. If time is running short, guess on the rest rather than leaving them blank.</li>
          <li><b>Bookmark and edit</b>: bookmark questions as you go. After the last question you get a review screen and can change up to <b>3 answers per section</b>, while your time allows.</li>
          <li><b>Scoring</b>: each section is scored 60–90; the total is 205–805 (always ending in 5). All three sections count equally.</li>
          <li><b>Calculator</b>: only in Data Insights (an on-screen basic calculator). Quant is mental math and scratch work.</li>
          <li><b>Section order</b>: you pick it on test day. Try your preferred order in a full mock here first.</li>
        </ul>
      </div>
      <h2>Pacing</h2>
      <div class="card notes"><table>
        <tr><th>Section</th><th>Average per question</th><th>Checkpoints</th></tr>
        ${SECTIONS.map(sec => `<tr><td>${sec.icon} ${esc(sec.short)}</td><td>${fmtTime(targetSecs(sec.id))}</td><td>${[1 / 3, 2 / 3].map(f => `Q${Math.round(sec.n * f)} by ${Math.round(sec.minutes * f)} min`).join(" · ")}</td></tr>`).join("")}
      </table>
      <div class="trap">Never sink 4+ minutes into one question. Make your best guess, bookmark it, and use an edit on it later if there's time.</div></div>
      ${recent.length ? `<h2>Your recent mocks</h2><div class="card">${recent.map(e => `<div class="topic-row"><div class="name">${esc(e.title)}: <b>${e.est.total}</b> <small>${Object.entries(e.bySec).map(([sid, b]) => SECTION[sid].short + " " + b.est).join(" · ")} · ${new Date(e.date).toLocaleDateString()}</small></div></div>`).join("")}</div>` : ""}
      <div class="trap">Exam details are based on GMAC's published format for the GMAT Focus Edition. Check mba.com before test day, since details can change. Score estimates here are only a rough guide.</div>`;
  };

  // ----- Backup & restore -----
  // Progress lives in this browser only, so a backup is how it moves between devices.
  const BACKUP_TAG = "GMATPREP1:";
  function backupData() {
    return { v: 1, saved: Date.now(), q: S.q, exams: S.exams, cards: S.cards, date: S.date, target: S.target };
  }
  function toCode(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return BACKUP_TAG + btoa(bin);
  }
  function fromText(text) {
    text = String(text || "").trim();
    let json = text;
    if (text.startsWith(BACKUP_TAG)) {
      const bin = atob(text.slice(BACKUP_TAG.length).replace(/\s+/g, ""));
      json = new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
    }
    const d = JSON.parse(json);
    if (!d || typeof d !== "object" || typeof d.q !== "object") throw new Error("not a backup");
    return d;
  }
  // Merge instead of overwrite, so restoring never loses work done on this device.
  function mergeBackup(d, quiet) {
    let added = 0, updated = 0;
    for (const [id, r] of Object.entries(d.q || {})) {
      const mine = S.q[id];
      if (!mine) { S.q[id] = r; added++; }
      else if ((r.ts || 0) > (mine.ts || 0)) { S.q[id] = r; updated++; }
    }
    const have = new Set(S.exams.map(e => e.date + ":" + e.score + ":" + e.total));
    let exams = 0;
    for (const e of d.exams || []) {
      const k = e.date + ":" + e.score + ":" + e.total;
      if (!have.has(k)) { S.exams.push(e); have.add(k); exams++; }
    }
    S.exams.sort((a, b) => a.date - b.date);
    Object.assign(S.cards, d.cards || {});
    if (d.date && !S.date) S.date = d.date;
    save(quiet);
    return { added, updated, exams };
  }

  // ----- Cloud sync -----
  // Progress is kept in progress.json on a separate "progress" branch of the site's GitHub repo, so
  // it never touches the live site. Writing needs a GitHub token; the token is stored in sync.json on
  // the main branch, encrypted with a password (PBKDF2 + AES-GCM), so a new device only needs the password.
  const SYNC_BRANCH = "progress", SYNC_PATH = "progress.json", SYNC_CONFIG = "sync.json";
  const SYNC_DELAY = 20000;
  let syncTimer = null, syncBusy = false, syncAgain = false;
  let syncState = { status: sync ? "idle" : "off", error: "" };

  function saveSyncSettings() {
    try { sync ? localStorage.setItem(SYNC_KEY, JSON.stringify(sync)) : localStorage.removeItem(SYNC_KEY); } catch (e) { /* ignore */ }
  }
  // owner/repo from the GitHub Pages address, e.g. jordan-hum.github.io/gmat-study-2/ → jordan-hum / gmat-study-2
  function repoFromLocation() {
    const m = location.hostname.match(/^([^.]+)\.github\.io$/i);
    if (!m) return null;
    const first = location.pathname.split("/").filter(Boolean)[0];
    return { owner: m[1], repo: first || m[1] + ".github.io" };
  }
  function b64encode(str) {
    let bin = "";
    new TextEncoder().encode(str).forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }
  function b64decode(b64) {
    const bin = atob(String(b64).replace(/\s+/g, ""));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }
  const bytesToB64 = u8 => btoa(String.fromCharCode(...u8));
  const b64ToBytes = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

  // Deliberately slow (600k PBKDF2 rounds) so guessing the password offline is expensive.
  const KDF_ITERATIONS = 600000;
  async function deriveKey(password, salt, iterations) {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: iterations || KDF_ITERATIONS, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  async function encryptToken(token, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt, KDF_ITERATIONS);
    const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token)));
    return { iter: KDF_ITERATIONS, salt: bytesToB64(salt), iv: bytesToB64(iv), token: bytesToB64(data) };
  }
  async function decryptToken(cfg, password) {
    const key = await deriveKey(password, b64ToBytes(cfg.salt), cfg.iter || KDF_ITERATIONS);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(cfg.iv) }, key, b64ToBytes(cfg.token));
    return new TextDecoder().decode(plain);
  }

  async function gh(method, path, body, opts) {
    const res = await fetch("https://api.github.com" + path, {
      method, cache: "no-store", keepalive: !!(opts && opts.keepalive),
      headers: Object.assign({ Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
        opts && opts.token ? { Authorization: "Bearer " + opts.token } : {},
        body ? { "Content-Type": "application/json" } : {}),
      body: body ? JSON.stringify(body) : undefined
    });
    let json = null;
    try { json = await res.json(); } catch (e) { /* empty body */ }
    return { status: res.status, ok: res.ok, json };
  }
  const repoPath = (cfg, rest) => `/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}${rest}`;

  // The shared config (encrypted token + repo). Served by the site itself, with the API as a fallback.
  async function fetchSyncConfig() {
    try {
      const r = await fetch(SYNC_CONFIG, { cache: "no-store" });
      if (r.ok) { const c = await r.json(); if (c && c.token) return c; }
    } catch (e) { /* not published yet */ }
    const loc = repoFromLocation();
    if (!loc) return null;
    const r = await gh("GET", repoPath(loc, "/contents/" + SYNC_CONFIG));
    if (r.ok && r.json && r.json.content) { try { return JSON.parse(b64decode(r.json.content)); } catch (e) { /* bad file */ } }
    return null;
  }

  // Compact file format ({id: [attempts, correct, lastRight, time, seconds, history]}) keeps saves small enough to finish
  // even as the tab closes (browsers cap those at 64 KB).
  function packProgress(d) {
    const q = {};
    for (const [id, r] of Object.entries(d.q || {})) q[id] = [r.a || 0, r.c || 0, r.last ? 1 : 0, r.ts || 0, r.t || 0, r.h || []];
    return { v: 2, saved: Date.now(), q, exams: d.exams || [], cards: d.cards || {}, date: d.date || "", target: d.target };
  }
  function unpackProgress(d) {
    if (!d || d.v !== 2) return d;
    const q = {};
    for (const [id, r] of Object.entries(d.q || {})) q[id] = { a: r[0], c: r[1], last: r[2], ts: r[3], t: r[4] || 0, h: r[5] || [] };
    return Object.assign({}, d, { q });
  }

  async function readRemote() {
    const r = await gh("GET", repoPath(sync, `/contents/${SYNC_PATH}?ref=${SYNC_BRANCH}`), null, { token: sync.token });
    if (r.status === 404) return { data: null, sha: null };
    if (!r.ok) throw syncHttpError(r);
    return { data: unpackProgress(JSON.parse(b64decode(r.json.content))), sha: r.json.sha };
  }
  async function createSyncBranch() {
    const repo = await gh("GET", repoPath(sync, ""), null, { token: sync.token });
    if (!repo.ok) throw syncHttpError(repo);
    const head = await gh("GET", repoPath(sync, "/git/ref/heads/" + encodeURIComponent(repo.json.default_branch)), null, { token: sync.token });
    if (!head.ok) throw syncHttpError(head);
    const made = await gh("POST", repoPath(sync, "/git/refs"), { ref: "refs/heads/" + SYNC_BRANCH, sha: head.json.object.sha }, { token: sync.token });
    if (!made.ok && made.status !== 422) throw syncHttpError(made); // 422 = it already exists
  }
  // Returns "ok" or "conflict" (someone else saved first).
  async function writeRemote(data, sha, keepalive) {
    const body = { message: "Save study progress", content: b64encode(JSON.stringify(packProgress(data))), branch: SYNC_BRANCH };
    if (sha) body.sha = sha;
    if (keepalive && JSON.stringify(body).length > 60000) keepalive = false;
    let r = await gh("PUT", repoPath(sync, "/contents/" + SYNC_PATH), body, { token: sync.token, keepalive });
    if (r.status === 404 && !keepalive) { await createSyncBranch(); r = await gh("PUT", repoPath(sync, "/contents/" + SYNC_PATH), body, { token: sync.token }); }
    if (r.status === 409 || r.status === 422) return "conflict";
    if (!r.ok) throw syncHttpError(r);
    sync.sha = r.json.content.sha; saveSyncSettings();
    return "ok";
  }
  function syncHttpError(r) {
    const e = new Error(r.status === 401 ? "The GitHub token has expired or was revoked. Set up sync again with a new token."
      : r.status === 403 || r.status === 404 ? "The GitHub token doesn't have access to this repo's contents."
      : "GitHub returned an error (" + r.status + ").");
    e.status = r.status;
    return e;
  }

  // Key-order-independent JSON, to compare local and remote progress.
  function stable(v) {
    if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + stable(v[k])).join(",") + "}";
    return JSON.stringify(v);
  }
  const progressOf = d => stable({ q: d.q || {}, exams: d.exams || [], cards: d.cards || {}, date: d.date || "" });

  function setSyncStatus(status, error) {
    syncState = { status, error: error || "" };
    const el = document.getElementById("sync-status");
    if (el) el.innerHTML = syncStatusText();
  }
  function syncStatusText() {
    if (!sync) return `☁️ Sync is off on this device. <a href="#/backup">Turn it on</a>`;
    if (syncState.status === "syncing") return "☁️ Syncing…";
    if (syncState.status === "error") return `⚠️ Sync problem: ${esc(syncState.error)} <a href="#/backup">Fix</a>`;
    if (sync.last) {
      const mins = Math.round((Date.now() - sync.last) / 60000);
      return `☁️ Progress saved to GitHub ${mins < 1 ? "just now" : mins === 1 ? "1 minute ago" : mins < 60 ? mins + " minutes ago" : new Date(sync.last).toLocaleString()}`;
    }
    return "☁️ Sync is on";
  }

  function scheduleSync(delay) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { syncTimer = null; syncNow(); }, delay == null ? SYNC_DELAY : delay);
  }
  // Pull the saved progress, merge it in, and push the result if anything differs.
  async function syncNow() {
    if (!sync) return;
    if (syncBusy) { syncAgain = true; return; }
    syncBusy = true; clearTimeout(syncTimer); syncTimer = null;
    setSyncStatus("syncing");
    let gotNew = false;
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, sha } = await readRemote();
        sync.sha = sha;
        if (data) {
          const r = mergeBackup(data, true);
          if (r.added || r.updated || r.exams) gotNew = true;
          if (progressOf(data) === progressOf(backupData())) break; // already identical
        }
        if (await writeRemote(backupData(), sha) === "ok") break;
      }
      sync.last = Date.now(); saveSyncSettings();
      setSyncStatus("ok");
      // Show newly pulled progress, but never interrupt a quiz in progress.
      if (gotNew && !/^#\/?(quiz|results)/.test(location.hash)) render();
    } catch (e) {
      setSyncStatus("error", e.message || "Couldn't reach GitHub.");
    } finally {
      syncBusy = false;
      if (syncAgain) { syncAgain = false; scheduleSync(2000); }
    }
  }
  // Leaving the page: push right away (keepalive lets the request finish after the tab closes).
  function flushSync() {
    if (!sync || !syncTimer || syncBusy) return;
    clearTimeout(syncTimer); syncTimer = null;
    writeRemote(backupData(), sync.sha, true).then(r => { if (r === "ok") { sync.last = Date.now(); saveSyncSettings(); } }).catch(() => {});
  }
  // After "Reset all progress": overwrite the saved copy instead of merging the old progress back in.
  async function syncReplace() {
    if (!sync) return;
    try {
      const { sha } = await readRemote();
      await writeRemote(backupData(), sha);
      sync.last = Date.now(); saveSyncSettings(); setSyncStatus("ok");
    } catch (e) { setSyncStatus("error", e.message); }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSync();
    else if (sync && (!sync.last || Date.now() - sync.last > 60000)) syncNow();
  });
  window.addEventListener("pagehide", flushSync);

  // First-time setup (done once, by whoever creates the token): check the token, then publish the
  // encrypted config and the first copy of the progress.
  async function setupSync(token, password, owner, repo) {
    sync = { owner, repo, token };
    const check = await gh("GET", repoPath(sync, "/contents/README.md"), null, { token });
    if (check.status === 401) { sync = null; throw new Error("GitHub didn't accept that token. Check you copied all of it."); }
    if (!check.ok && check.status !== 404) { sync = null; throw new Error("That token can't read the " + owner + "/" + repo + " repo."); }
    const enc = await encryptToken(token, password);
    const cfg = { v: 1, owner, repo, iter: enc.iter, salt: enc.salt, iv: enc.iv, token: enc.token };
    const existing = await gh("GET", repoPath(sync, "/contents/" + SYNC_CONFIG), null, { token });
    const put = await gh("PUT", repoPath(sync, "/contents/" + SYNC_CONFIG),
      Object.assign({ message: "Set up progress sync (encrypted token)", content: b64encode(JSON.stringify(cfg, null, 2)) },
        existing.ok ? { sha: existing.json.sha } : {}), { token });
    if (!put.ok) { sync = null; throw new Error(put.status === 403 || put.status === 404
      ? "The token needs 'Contents: Read and write' permission on this repo." : "GitHub returned an error (" + put.status + ")."); }
    saveSyncSettings();
    await syncNow();
  }
  async function connectSync(cfg, password) {
    let token;
    try { token = await decryptToken(cfg, password); } catch (e) { throw new Error("Wrong password."); }
    const loc = repoFromLocation();
    sync = { owner: loc ? loc.owner : cfg.owner, repo: loc ? loc.repo : cfg.repo, token };
    saveSyncSettings();
    await syncNow();
  }
  function disconnectSync() {
    clearTimeout(syncTimer);
    sync = null; saveSyncSettings(); setSyncStatus("off");
  }

  views.backup = function () {
    const nQ = Object.keys(S.q).length;
    const code = toCode(backupData());
    $app.innerHTML = `
      <a href="#/" class="muted">← Home</a>
      <h1>Save & sync progress</h1>
      <p class="sub">Turn on automatic saving to continue on any device, or move progress by hand with a backup file.</p>

      <h2 style="margin-top:8px">☁️ Save automatically</h2>
      <div class="card" id="cloud"><p class="muted" style="margin:0">Checking sync…</p></div>

      <h2>💾 Manual backup</h2>
      <p class="sub">Restoring <b>adds</b> the backup to what's already on that device (for each question, the most recent answer wins), so nothing gets lost.</p>
      <div class="card">
        <b>1. Save a backup from this device</b>
        <p class="muted" style="margin:4px 0 12px">This device has ${nQ} answered question${nQ === 1 ? "" : "s"} and ${S.exams.length} mock exam${S.exams.length === 1 ? "" : "s"}.</p>
        <div class="row">
          <button class="btn primary" id="dl">⬇️ Download backup file</button>
          <button class="btn" id="copy">📋 Copy backup code</button>
        </div>
        <p class="muted" style="margin:10px 0 0;font-size:14px">Tip: copy the code and text or email it to yourself, then paste it on the other device.</p>
        <textarea id="code-out" readonly rows="3" class="code">${esc(code)}</textarea>
      </div>

      <div class="card mt">
        <b>2. Restore on the other device</b>
        <p class="muted" style="margin:4px 0 12px">Open this same page on the other device, then load the file or paste the code.</p>
        <div class="row">
          <label class="btn primary" for="file">⬆️ Restore from file</label>
          <input type="file" id="file" accept=".json,.txt,application/json,text/plain" hidden>
        </div>
        <label class="field" for="code-in">…or paste a backup code</label>
        <textarea id="code-in" rows="3" class="code" placeholder="GMATPREP1:…"></textarea>
        <div class="row mt"><button class="btn" id="paste-restore">Restore from code</button></div>
        <p id="msg" class="mt" role="status"></p>
      </div>`;

    const msg = document.getElementById("msg");
    const report = (ok, text) => { msg.innerHTML = text; msg.style.color = ok ? "var(--good)" : "var(--bad)"; };
    const restore = text => {
      try {
        const r = mergeBackup(fromText(text));
        report(true, `✓ Restored: ${r.added} new answers, ${r.updated} updated, ${r.exams} mock exam${r.exams === 1 ? "" : "s"} added. <a href="#/">Go to home →</a>`);
      } catch (e) {
        report(false, "That doesn't look like a GMAT Prep backup. Check that you copied the whole code.");
      }
    };
    document.getElementById("dl").onclick = () => {
      const blob = new Blob([JSON.stringify(backupData())], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "gmat-prep-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    document.getElementById("copy").onclick = async () => {
      const ta = document.getElementById("code-out");
      try { await navigator.clipboard.writeText(ta.value); }
      catch (e) { ta.select(); document.execCommand("copy"); }
      report(true, "✓ Backup code copied. Paste it on the other device.");
    };
    document.getElementById("file").onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => restore(rd.result);
      rd.readAsText(f);
    };
    document.getElementById("paste-restore").onclick = () => restore(document.getElementById("code-in").value);
    drawCloud();
  };

  // The automatic-sync card on the Backup page: connected / enter password / first-time setup.
  async function drawCloud(forceSetup) {
    const el = document.getElementById("cloud");
    if (!el) return;
    const note = (id) => `<p id="${id}" class="mt" role="status" style="margin-bottom:0"></p>`;
    const say = (id, ok, text) => { const m = document.getElementById(id); if (m) { m.innerHTML = text; m.style.color = ok ? "var(--good)" : "var(--bad)"; } };

    if (sync && !forceSetup) {
      el.innerHTML = `
        <p style="margin:0 0 4px"><b>Sync is on for this device.</b></p>
        <p class="muted" id="sync-status" style="margin:0 0 12px">${syncStatusText()}</p>
        <p class="muted" style="margin:0 0 12px;font-size:14px">Progress saves to <code>${esc(SYNC_PATH)}</code> on the <code>${esc(SYNC_BRANCH)}</code> branch of <b>${esc(sync.owner)}/${esc(sync.repo)}</b> about ${SYNC_DELAY / 1000} seconds after each answer, and when you leave the page.</p>
        <div class="row">
          <button class="btn primary" id="sync-now">Sync now</button>
          <button class="btn" id="sync-off">Turn off on this device</button>
          <button class="btn small" id="sync-redo">Use a new token</button>
        </div>`;
      document.getElementById("sync-now").onclick = () => syncNow();
      document.getElementById("sync-off").onclick = () => { disconnectSync(); drawCloud(); };
      document.getElementById("sync-redo").onclick = () => drawCloud(true);
      return;
    }

    let cfg = null;
    if (!forceSetup) { try { cfg = await fetchSyncConfig(); } catch (e) { /* offline */ } }
    if (cfg) {
      el.innerHTML = `
        <p style="margin:0 0 4px"><b>Sync is set up. Enter the sync password to turn it on for this device.</b></p>
        <p class="muted" style="margin:0 0 12px">You only need to do this once per device or browser.</p>
        <div class="row">
          <input type="password" id="pw" placeholder="Sync password" autocomplete="current-password" style="flex:1;min-width:200px">
          <button class="btn primary" id="connect">Turn on sync</button>
        </div>
        ${note("cloud-msg")}
        <p style="margin:12px 0 0;font-size:14px"><a href="#" id="to-setup">Set up again with a new token</a></p>`;
      const go = async () => {
        const btn = document.getElementById("connect");
        btn.disabled = true; say("cloud-msg", true, "Unlocking…");
        try { await connectSync(cfg, document.getElementById("pw").value); drawCloud(); }
        catch (e) { say("cloud-msg", false, esc(e.message)); btn.disabled = false; }
      };
      document.getElementById("connect").onclick = go;
      document.getElementById("pw").onkeydown = e => { if (e.key === "Enter") go(); };
      document.getElementById("to-setup").onclick = e => { e.preventDefault(); drawCloud(true); };
      return;
    }

    const loc = repoFromLocation() || (sync ? { owner: sync.owner, repo: sync.repo } : { owner: "", repo: "" });
    el.innerHTML = `
      <p style="margin:0 0 8px"><b>One-time setup</b> (whoever owns the GitHub repo does this once):</p>
      <ol style="margin:0 0 12px;padding-left:22px">
        <li>On GitHub, open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Settings → Developer settings → Fine-grained tokens → Generate new token</a>.</li>
        <li>Name it “GMAT Prep sync”, and set an expiration that lasts past your test date.</li>
        <li>Under <b>Repository access</b>, choose <b>Only select repositories</b> and pick <b>${esc(loc.repo || "this site's repo")}</b>.</li>
        <li>Under <b>Permissions → Repository permissions</b>, set <b>Contents</b> to <b>Read and write</b>. Nothing else is needed.</li>
        <li>Generate the token, copy it (it starts with <code>github_pat_</code>) and paste it below.</li>
      </ol>
      <div class="grid grid-2">
        <label class="field" style="margin:0">GitHub owner<input id="s-owner" value="${esc(loc.owner)}" class="text-in"></label>
        <label class="field" style="margin:0">Repository<input id="s-repo" value="${esc(loc.repo)}" class="text-in"></label>
      </div>
      <label class="field">Token<input id="s-token" type="password" placeholder="github_pat_…" autocomplete="off" class="text-in"></label>
      <div class="grid grid-2">
        <label class="field" style="margin:0">Choose a sync password<input id="s-pw" type="password" autocomplete="new-password" class="text-in"></label>
        <label class="field" style="margin:0">Repeat password<input id="s-pw2" type="password" autocomplete="new-password" class="text-in"></label>
      </div>
      <p class="muted" style="font-size:14px;margin:12px 0">The token is saved in the repo only in encrypted form, locked with this password, and each device needs the password once. If the repo is public, the encrypted token is too, so a longer password is safer (at least 8 characters). The progress file itself (just answer stats) will also be visible in the repo.</p>
      <div class="row">
        <button class="btn primary" id="s-go">Set up sync</button>
        ${sync || forceSetup ? `<button class="btn" id="s-cancel">Cancel</button>` : ""}
      </div>
      ${note("cloud-msg")}`;
    const cancel = document.getElementById("s-cancel");
    if (cancel) cancel.onclick = () => drawCloud();
    document.getElementById("s-go").onclick = async () => {
      const v = id => document.getElementById(id).value.trim();
      const owner = v("s-owner"), repo = v("s-repo"), token = v("s-token"), pw = document.getElementById("s-pw").value;
      if (!owner || !repo) return say("cloud-msg", false, "Enter the GitHub owner and repository.");
      if (!/^(github_pat_|ghp_)/.test(token)) return say("cloud-msg", false, "That doesn't look like a GitHub token (it should start with github_pat_).");
      if (pw.length < 8) return say("cloud-msg", false, "Use a password of at least 8 characters.");
      if (pw !== document.getElementById("s-pw2").value) return say("cloud-msg", false, "The passwords don't match.");
      const btn = document.getElementById("s-go");
      btn.disabled = true; say("cloud-msg", true, "Setting up…");
      try { await setupSync(token, pw, owner, repo); drawCloud(); }
      catch (e) { say("cloud-msg", false, esc(e.message)); btn.disabled = false; }
    };
  }

  // ----- Stats & analytics -----
  // Everything here is computed from S.q (per-question results with recent history) and S.exams,
  // so it's the same on every device once sync has merged the progress.
  function attempts(filter) {
    const out = [];
    for (const q of QUESTIONS) {
      if (filter && !filter(q)) continue;
      const r = S.q[q.id];
      if (r && r.h) r.h.forEach(h => out.push({ q, ts: h[0], ok: h[1], secs: h[2] }));
    }
    return out.sort((a, b) => a.ts - b.ts);
  }
  function groupStats(qs) {
    let seen = 0, right = 0, att = 0, ok = 0, secs = 0, timed = 0;
    for (const q of qs) {
      const r = S.q[q.id];
      if (!r) continue;
      seen++; if (r.last) right++;
      att += r.a; ok += r.c;
      if (r.t && r.a) { secs += r.t; timed += r.a; }
    }
    return { total: qs.length, seen, right, acc: pct(right, seen), att, allAcc: pct(ok, att), avg: timed ? secs / timed : 0, cover: pct(seen, qs.length) };
  }
  // Recent accuracy: the last n attempts in a group (falls back to last results if there's no history).
  function recentAcc(filter, n) {
    const a = attempts(filter).slice(-n);
    if (a.length >= 5) return { acc: a.filter(x => x.ok).length / a.length, n: a.length };
    const g = groupStats(QUESTIONS.filter(filter));
    return { acc: g.seen ? g.right / g.seen : 0, n: g.seen };
  }
  const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

  views.stats = function () {
    const all = attempts();
    const g = groupStats(QUESTIONS);
    const days = new Set(all.map(a => dayKey(a.ts)));
    // Consecutive days with answers, counting back from today (or yesterday, if nothing yet today)
    let streak = 0;
    const d = new Date();
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
    const week = all.filter(a => a.ts > Date.now() - 7 * 86400000);
    const totalSecs = all.reduce((s, a) => s + a.secs, 0);

    // Estimated score from recent accuracy in each section
    const secEst = SECTIONS.map(sec => { const r = recentAcc(q => q.sec === sec.id, 40); return { sec, ...r, est: r.n ? sectionScore(r.acc) : null }; });
    const estTotal = secEst.every(x => x.n >= 10) ? totalScore(secEst[0].est, secEst[1].est, secEst[2].est) : null;

    // Topic priority: exam weight × room to improve, pushed up by low coverage and slow pace
    const topics = TOPICS.map(t => {
      const st = groupStats(QUESTIONS.filter(q => q.topic === t.id));
      const rec = recentAcc(q => q.topic === t.id, 15);
      const weight = SECTION[t.sec].mix[t.id] / SECTION[t.sec].n;
      const pace = st.avg ? st.avg / targetSecs(t.sec) : 0;
      const acc = st.seen ? rec.acc : 0.5;
      const priority = weight * (1 - acc) * (st.seen < 5 ? 1.5 : 1) * (pace > 1.3 ? 1.2 : 1);
      return { t, st, rec, pace, priority };
    });
    const focus = topics.slice().sort((a, b) => b.priority - a.priority).slice(0, 3);
    const sortKey = views.stats.sort || "priority";
    const sorters = {
      priority: (a, b) => b.priority - a.priority,
      acc: (a, b) => (a.st.seen ? a.rec.acc : 2) - (b.st.seen ? b.rec.acc : 2),
      time: (a, b) => b.pace - a.pace,
      cover: (a, b) => a.st.cover - b.st.cover
    };
    const rows = topics.slice().sort(sorters[sortKey]);

    // Question types
    const kinds = Object.keys(KIND_LABEL).map(k => {
      const qs = QUESTIONS.filter(q => q.kind === k);
      const st = groupStats(qs);
      return { k, st, target: targetSecs(qs[0] ? qs[0].sec : "Q") };
    }).filter(x => x.st.total);

    // Pacing: how accuracy changes when you run long
    const timed = all.filter(a => a.secs > 0);
    const slow = timed.filter(a => a.secs > targetSecs(a.q.sec) * 1.5), fast = timed.filter(a => a.secs <= targetSecs(a.q.sec) * 1.5);

    // Last 14 days of activity, and weekly accuracy for the last 8 weeks
    const dayLabels = [], dayCounts = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = dayKey(d);
      dayLabels.push(i === 0 ? "Today" : d.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }));
      dayCounts.push(all.filter(a => dayKey(a.ts) === k).length);
    }
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const end = Date.now() - i * 7 * 86400000, start = end - 7 * 86400000;
      const w = all.filter(a => a.ts > start && a.ts <= end);
      if (w.length) weeks.push({ label: i === 0 ? "This wk" : i + " wk ago", secs: SECTIONS.map(s => { const x = w.filter(a => a.q.sec === s.id); return x.length ? pct(x.filter(a => a.ok).length, x.length) : null; }), acc: pct(w.filter(a => a.ok).length, w.length) });
    }
    const mocks = S.exams.filter(e => e.est && e.est.total).slice(-10);

    const barW = p => `<div class="bar"><i class="${barClass(p)}" style="width:${p}%"></i></div>`;
    const paceCell = (avg, target) => avg ? `<span class="${avg > target * 1.3 ? "slow" : ""}">${fmtTime(avg)}</span> <span class="tag">/ ${fmtTime(target)}</span>` : `<span class="muted">—</span>`;

    $app.innerHTML = `
      <h1>Stats</h1>
      <p class="sub">Where you stand and what to practise next. Built from every answer you've saved${sync ? ", synced across your devices" : ` on this device (<a href="#/backup">turn on sync</a> to combine devices)`}.</p>

      <div class="grid grid-4">
        <div class="card stat"><b>${estTotal || "—"}</b><span>${estTotal ? "Estimated score from recent practice" : "Estimated score (answer 10+ per section)"}</span></div>
        <div class="card stat"><b>${g.seen}/${g.total}</b><span>Questions attempted (${g.cover}%)</span></div>
        <div class="card stat"><b>${g.seen ? g.acc + "%" : "—"}</b><span>Accuracy (latest try per question)</span></div>
        <div class="card stat"><b>${streak}</b><span>Day streak · ${week.length} answers this week · ${Math.round(totalSecs / 3600 * 10) / 10} h total</span></div>
      </div>

      <h2>🎯 Practise next</h2>
      <div class="grid grid-3">
        ${focus.map(({ t, st, rec, pace }) => `<div class="card">
          <b>${t.icon} ${esc(t.name)}</b>
          <p class="muted" style="margin:4px 0 10px;font-size:14px">${!st.seen ? "Not started yet." : `${Math.round(rec.acc * 100)}% recently · ${st.cover}% of bank seen${pace > 1.3 ? " · running slow" : ""}`} ${SECTION[t.sec].mix[t.id]} of ${SECTION[t.sec].n} ${esc(SECTION[t.sec].short)} questions on a mock.</p>
          <div class="row"><button class="btn primary small" data-go-topic="${t.id}">Practise 15</button><a class="btn small" href="#/notes/${t.id}">Notes</a></div>
        </div>`).join("")}
      </div>

      <h2>By section</h2>
      <div class="card notes"><table>
        <tr><th>Section</th><th>Attempted</th><th>Accuracy</th><th>Recent (last 40)</th><th>Avg time / pace</th><th>Est. score</th></tr>
        ${secEst.map(({ sec, acc, n, est }) => {
          const st = groupStats(QUESTIONS.filter(q => q.sec === sec.id));
          return `<tr><td>${sec.icon} ${esc(sec.name)}</td><td>${st.seen}/${st.total}</td><td>${st.seen ? st.acc + "%" + barW(st.acc) : "—"}</td>
            <td>${n ? Math.round(acc * 100) + "%" : "—"}</td><td>${paceCell(st.avg, targetSecs(sec.id))}</td><td><b>${est && n >= 10 ? est : "—"}</b></td></tr>`;
        }).join("")}
      </table></div>

      <div class="row" style="margin-top:28px"><h2 style="margin:0">By topic</h2><span class="spacer"></span>
        <span class="tag">Sort:</span>
        ${[["priority", "Priority"], ["acc", "Weakest"], ["time", "Slowest"], ["cover", "Least covered"]].map(([k, l]) => `<label class="chip ${k === sortKey ? "on" : ""}" data-sort="${k}">${l}</label>`).join("")}
      </div>
      <div class="card notes mt"><table>
        <tr><th>Topic</th><th>Seen</th><th>Accuracy</th><th>Recent</th><th>Avg time / pace</th><th></th></tr>
        ${rows.map(({ t, st, rec, pace }) => `<tr>
          <td>${t.icon} <a href="#/notes/${t.id}">${esc(t.name)}</a><br><span class="tag">${esc(SECTION[t.sec].short)}</span></td>
          <td>${st.seen}/${st.total}<div class="bar"><i style="width:${st.cover}%"></i></div></td>
          <td>${st.seen ? st.acc + "%" + barW(st.acc) : "—"}</td>
          <td>${st.seen ? Math.round(rec.acc * 100) + "%" : "—"}</td>
          <td>${paceCell(st.avg, targetSecs(t.sec))}</td>
          <td><button class="btn small" data-go-topic="${t.id}">Practise</button></td></tr>`).join("")}
      </table></div>

      <h2>By question type</h2>
      <div class="card notes"><table>
        <tr><th>Type</th><th>Seen</th><th>Accuracy</th><th>Avg time / pace</th></tr>
        ${kinds.map(({ k, st, target }) => `<tr><td>${KIND_LABEL[k]}</td><td>${st.seen}/${st.total}</td><td>${st.seen ? st.acc + "%" + barW(st.acc) : "—"}</td><td>${paceCell(st.avg, target)}</td></tr>`).join("")}
      </table></div>

      <h2>Pacing</h2>
      <div class="grid grid-2">
        <div class="card stat"><b>${fast.length ? pct(fast.filter(a => a.ok).length, fast.length) + "%" : "—"}</b><span>Accuracy when on pace (${fast.length} answers)</span></div>
        <div class="card stat"><b>${slow.length ? pct(slow.filter(a => a.ok).length, slow.length) + "%" : "—"}</b><span>Accuracy when over 1.5× pace (${slow.length} answers)${slow.length >= 5 && fast.length && pct(slow.filter(a => a.ok).length, slow.length) < pct(fast.filter(a => a.ok).length, fast.length) - 10 ? ". Extra time isn't paying off: guess and move on sooner." : ""}</span></div>
      </div>

      <h2>Activity</h2>
      <div class="card">${dayCounts.some(x => x) ? chartSVG({ type: "bar", title: "Questions answered per day (last 14 days)", x: dayLabels, series: [{ name: "Answers", v: dayCounts }], labels: true }) : `<div class="empty">No answers yet. Start with a Quick 20 on the home page.</div>`}</div>
      ${weeks.length >= 2 ? `<div class="card mt">${chartSVG({ type: "line", title: "Weekly accuracy (%)", x: weeks.map(w => w.label), series: [{ name: "Overall", v: weeks.map(w => w.acc) }], labels: true, min: 0, max: 100 })}
        <p class="tag" style="margin:6px 0 0">By section: ${weeks.map(w => `${w.label}: ${SECTIONS.map((s, i) => w.secs[i] === null ? "" : s.short + " " + w.secs[i] + "%").filter(Boolean).join(", ")}`).join(" · ")}</p></div>` : ""}

      <h2>Mock exams</h2>
      <div class="card">${mocks.length >= 2 ? chartSVG({ type: "line", title: "Estimated score by full mock", x: mocks.map((e, i) => "#" + (S.exams.indexOf(e) + 1)), series: [{ name: "Score", v: mocks.map(e => e.est.total) }, { name: "Target", v: mocks.map(() => S.target) }], labels: true, min: 205, max: 805 })
        : mocks.length ? `<p style="margin:0">One full mock so far: <b>${mocks[0].est.total}</b>. Take another to see a trend.</p>` : `<div class="empty">No full mocks yet. <a href="#/exam">Take one</a> to get a baseline score.</div>`}</div>
      <div class="row mt">
        <button class="btn" id="go-missed" ${g.seen - g.right ? "" : "disabled"}>🔁 Redo ${g.seen - g.right} missed questions</button>
        <a class="btn" href="#/backup">💾 Save & sync</a>
      </div>`;
    $app.querySelectorAll("[data-go-topic]").forEach(b => b.onclick = () =>
      startPractice(pickQuestions([b.dataset.goTopic], "weak", 15), TOPIC[b.dataset.goTopic].name));
    $app.querySelectorAll("[data-sort]").forEach(c => c.onclick = () => { views.stats.sort = c.dataset.sort; views.stats(); });
    document.getElementById("go-missed").onclick = () => startPractice(pickQuestions(TOPICS.map(t => t.id), "missed", 999), "Review missed");
  };

  views.glossary = function () {
    $app.innerHTML = `
      <h1>Glossary & formulas</h1>
      <p class="sub">Search ${window.GLOSSARY.length} formulas, rules and question-type strategies.</p>
      <input type="search" id="q" placeholder="Search, e.g. 'remainder', 'weaken', 'standard deviation'…" autofocus>
      <div class="card mt" id="list"></div>`;
    const list = document.getElementById("list");
    const draw = term => {
      const t = term.trim().toLowerCase();
      const rows = window.GLOSSARY.filter(g => !t || g[0].toLowerCase().includes(t) || g[1].toLowerCase().includes(t))
        .sort((a, b) => a[0].localeCompare(b[0]));
      list.innerHTML = rows.length ? rows.map(g => `<div class="gl-item"><b>${esc(g[0])} <span class="tag">${TOPIC[g[2]].icon} ${esc(TOPIC[g[2]].name)}</span></b><span>${txt(g[1])}</span></div>`).join("")
        : `<div class="empty">No matches.</div>`;
    };
    document.getElementById("q").oninput = e => draw(e.target.value);
    draw("");
  };

  // ---------- Router ----------
  let keyHandler = null;
  document.addEventListener("keydown", e => { if (keyHandler) keyHandler(e); });

  function render() {
    clearInterval(timerId);
    keyHandler = null;
    accrue();
    $app.className = "";
    const parts = (location.hash.replace(/^#\/?/, "") || "home").split("/");
    const route = parts[0];
    const navKey = route === "quiz" || route === "results" ? (S.session && S.session.mode === "exam" ? "exam" : "practice") : route;
    document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.r === navKey));
    const view = views[route] || views.home;
    view(parts[1]);
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  render();
  if (sync) syncNow();
})();
