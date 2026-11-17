/* =========================================================
   快乐小屋 · 核心：状态 / 语音 / 音效 / 动画 / 弹窗 / 路由
   ========================================================= */
(function () {
  "use strict";
  var U4 = window.U4 || (window.U4 = {});
  var DATA = U4.DATA;
  var STORE_KEY = "happy_house_u4_v1";

  /* ---------------- 小工具 ---------------- */
  var util = {
    qs: function (sel, root) { return (root || document).querySelector(sel); },
    qsa: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },
    el: function (tag, cls, html) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (html != null) n.innerHTML = html;
      return n;
    },
    on: function (node, ev, fn, opts) { if (node) node.addEventListener(ev, fn, opts); },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    sample: function (arr, n) { return util.shuffle(arr).slice(0, n); },
    randInt: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    stars: function (n) { return new Array(Math.max(0, n) + 1).join("⭐"); }
  };
  U4.util = util;

  /* ---------------- SVG 小图（无外部图片依赖） ---------------- */
  var ART = {
    eraser: function () {
      return '<svg viewBox="0 0 100 100" role="img" aria-label="eraser">' +
        '<g transform="rotate(-16 50 52)">' +
        '<rect x="16" y="36" width="68" height="32" rx="12" fill="#F7A5B5" stroke="#C95873" stroke-width="4"/>' +
        '<rect x="50" y="36" width="34" height="32" rx="12" fill="#FFF6F8" stroke="#C95873" stroke-width="4"/>' +
        '<path d="M50 38v28" stroke="#C95873" stroke-width="4"/>' +
        '</g></svg>';
    },
    cupboard: function () {
      return '<svg viewBox="0 0 100 100" role="img" aria-label="cupboard">' +
        '<rect x="18" y="8" width="64" height="82" rx="9" fill="#DFA86B" stroke="#9E6A36" stroke-width="4"/>' +
        '<rect x="24" y="14" width="24" height="70" rx="4" fill="#F6CE97"/>' +
        '<rect x="52" y="14" width="24" height="70" rx="4" fill="#F6CE97"/>' +
        '<circle cx="45" cy="50" r="3.2" fill="#7B4A22"/><circle cx="55" cy="50" r="3.2" fill="#7B4A22"/>' +
        '<rect x="16" y="86" width="68" height="9" rx="4" fill="#9E6A36"/></svg>';
    },
    towel: function () {
      return '<svg viewBox="0 0 100 100" role="img" aria-label="towel">' +
        '<rect x="26" y="16" width="48" height="66" rx="11" fill="#9BD6F2" stroke="#4E9DC6" stroke-width="4"/>' +
        '<path d="M27 34h46M27 62h46" stroke="#EAF8FF" stroke-width="6"/>' +
        '<rect x="26" y="76" width="48" height="8" rx="4" fill="#4E9DC6"/></svg>';
    },
    shape: function (type, color) {
      var svg = '<svg viewBox="0 0 100 100" role="img" aria-label="' + type + '" style="overflow:visible">';
      var fill = color || "#FF8A7A";
      if (type === "circle") svg += '<circle cx="50" cy="50" r="40" fill="' + fill + '" stroke="#FFFFFF" stroke-width="5"/>';
      else if (type === "square") svg += '<rect x="12" y="12" width="76" height="76" rx="7" fill="' + fill + '" stroke="#FFFFFF" stroke-width="5"/>';
      else if (type === "rectangle") svg += '<rect x="6" y="26" width="88" height="48" rx="7" fill="' + fill + '" stroke="#FFFFFF" stroke-width="5"/>';
      else svg += '<polygon points="50,8 94,88 6,88" fill="' + fill + '" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>';
      return svg + '</svg>';
    }
  };
  U4.ART = ART;

  var STYLE = document.createElement("style");
  STYLE.textContent = ".svg-art{display:inline-block;vertical-align:middle;line-height:0}.svg-art svg{width:100%;height:100%;display:block}";
  document.head.appendChild(STYLE);

  function artOf(obj) {
    if (!obj) return { art: null, e: "" };
    if (obj.html) {
      var m = /data-art="([^"]+)"/.exec(obj.html);
      return { art: m ? m[1] : null, e: "" };
    }
    return { art: null, e: obj.e || "" };
  }
  function artHtml(obj, size, extra) {
    size = size || 3;
    var a = artOf(obj);
    if (a.art) return '<span class="svg-art" data-art="' + a.art + '" style="width:' + size + 'rem;height:' + size + 'rem;' + (extra || "") + '"></span>';
    return '<span class="emoji-art" style="font-size:' + size + 'rem;line-height:1;' + (extra || "") + '">' + a.e + '</span>';
  }
  U4.artOf = artOf;
  U4.artHtml = artHtml;

  function hydrate(root) {
    util.qsa(".svg-art[data-art]", root).forEach(function (node) {
      var id = node.getAttribute("data-art");
      if (ART[id] && !node.firstChild) {
        node.innerHTML = (ART[id] === ART.shape) ? ART.shape(node.getAttribute("data-shape") || "circle", node.getAttribute("data-color")) : ART[id]();
      }
    });
  }
  U4.hydrate = hydrate;
  function setHTML(node, html) { node.innerHTML = html || ""; hydrate(node); return node; }
  U4.setHTML = setHTML;

  /* ---------------- 状态存档 ---------------- */
  function defaultState() {
    return { stars: 0, levels: {}, skills: {}, decor: [], sound: true, music: true, firstRun: true };
  }
  var state = defaultState();
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var loaded = JSON.parse(raw);
      state = Object.assign(defaultState(), loaded);
      state.levels = loaded.levels || {};
      state.skills = loaded.skills || {};
      state.decor = loaded.decor || [];
    }
  } catch (e) { /* 忽略存档异常 */ }
  U4.state = state;

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 无痕模式忽略 */ }
  }
  U4.save = save;

  var progress = {
    record: function (key, info) {
      var prev = state.levels[key] || { stars: 0, best: 0 };
      var prevStars = prev.stars || 0;
      var stars = util.clamp(info.stars || 0, 0, 3);
      var gained = Math.max(0, stars - prevStars);
      state.levels[key] = {
        stars: Math.max(prevStars, stars),
        best: Math.max(prev.best || 0, info.correct || 0),
        correct: info.correct, total: info.total,
        skill: info.skill || "", plays: (prev.plays || 0) + 1
      };
      if (info.skill) {
        var s = state.skills[info.skill] || { correct: 0, total: 0 };
        s.correct += info.correct || 0;
        s.total += info.total || 0;
        state.skills[info.skill] = s;
      }
      state.stars = (state.stars || 0) + gained;
      save();
      ui.starCount();
      if (gained > 0) fx.toast("+" + gained + " 颗星星！", "star");
      return gained;
    },
    levelStars: function (id) { var l = state.levels[String(id)]; return l ? l.stars : 0; },
    unlocked: function (id) {
      if (id === 1) return true;
      var prev = state.levels[String(id - 1)];
      return !!(prev && prev.stars >= 1);
    },
    totalStars: function () { return state.stars || 0; },
    reset: function () {
      state = defaultState();
      U4.state = state;
      save();
      ui.starCount();
    }
  };
  U4.progress = progress;

  /* ---------------- 星星 & 顶栏 ---------------- */
  var ui = {
    starCount: function () {
      var n = util.qs("#star-count");
      if (n) n.textContent = progress.totalStars();
    },
    bumpStar: function (delta) {
      var pill = util.qs("#star-pill");
      if (!pill) return;
      pill.classList.remove("bump");
      void pill.offsetWidth;
      pill.classList.add("bump");
      ui.starCount();
    },
    soundIcon: function () {
      var b = util.qs("#btn-sound");
      if (b) b.textContent = state.sound === false ? "🔇" : "🔊";
    },
    toast: function () { }
  };
  U4.ui = ui;

  /* ---------------- 音效（WebAudio 合成，无需音频文件） ---------------- */
  var actx = null, master = null, musicGain = null, musicTimer = null, musicStep = 0;
  var audio = {
    ready: false,
    init: function () {
      if (actx) return;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
        master = actx.createGain();
        master.gain.value = 0.55;
        master.connect(actx.destination);
        musicGain = actx.createGain();
        musicGain.gain.value = 0.06;
        musicGain.connect(master);
        audio.ready = true;
      } catch (e) { audio.ready = false; }
    },
    unlock: function () {
      audio.init();
      if (actx && actx.state === "suspended") { try { actx.resume(); } catch (e) { } }
      if (state.music !== false) audio.startMusic();
    },
    tone: function (freq, start, dur, type, vol, dest) {
      if (!actx || state.sound === false) return;
      try {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = type || "sine";
        o.frequency.value = freq;
        var t0 = actx.currentTime + (start || 0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol == null ? 0.25 : vol, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(dest || master);
        o.start(t0); o.stop(t0 + dur + 0.03);
      } catch (e) { }
    },
    sfx: function (name) {
      if (state.sound === false || !audio.ready) return;
      var S = {
        tap: [[620, 0, .05, "sine", .12]],
        pop: [[760, 0, .07, "triangle", .18], [1040, .05, .08, "sine", .12]],
        page: [[420, 0, .05, "sine", .08], [560, .04, .05, "sine", .07]],
        correct: [[523.25, 0, .08, "triangle", .2], [659.25, .08, .09, "triangle", .2], [783.99, .17, .16, "sine", .22]],
        wrong: [[233, 0, .11, "sine", .16], [196, .1, .16, "sine", .14]],
        star: [[880, 0, .06, "triangle", .16], [1108.7, .06, .06, "triangle", .15], [1318.5, .12, .14, "sine", .15]],
        cheer: [[523, 0, .1, "triangle", .18], [659, .08, .1, "triangle", .18], [784, .16, .1, "triangle", .18], [1046, .24, .3, "sine", .2]]
      }[name];
      if (!S) return;
      for (var i = 0; i < S.length; i++) audio.tone(S[i][0], S[i][1], S[i][2], S[i][3], S[i][4]);
    },
    startMusic: function () {
      if (!actx || state.music === false || state.sound === false || musicTimer) return;
      var scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
      var seq = [0, 2, 4, 2, 3, 1, 5, 4];
      musicTimer = setInterval(function () {
        if (state.music === false || state.sound === false) return;
        if (actx.state === "suspended") return;
        var f = scale[seq[musicStep % seq.length]];
        musicStep++;
        audio.tone(f, 0, 0.5, "sine", 0.35, musicGain);
        if (musicStep % 2 === 0) audio.tone(f / 2, 0, 0.7, "sine", 0.22, musicGain);
      }, 1500);
    },
    stopMusic: function () { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } },
    setSound: function (on) {
      state.sound = !!on;
      save();
      ui.soundIcon();
      if (!state.sound) { tts.stop(); audio.stopMusic(); }
      else { audio.unlock(); audio.sfx("pop"); }
    }
  };
  U4.audio = audio;
  var sfx = function (n) { audio.sfx(n); };
  U4.sfx = sfx;

  /* ---------------- 浏览器语音合成（英语 + 中文） ---------------- */
  var synth = window.speechSynthesis || null;
  var voices = [];
  var PREF_EN = ["Samantha", "Karen", "Moira", "Daniel", "Alex", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Tessa", "Fiona"];
  var PREF_ZH = ["Tingting", "Ting-Ting", "Meijia", "Mei-Jia", "Google 普通话", "Microsoft Xiaoxiao", "Microsoft Huihui", "Sinji", "Li-mu"];
  function loadVoices() {
    if (!synth) { voices = []; return voices; }
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    return voices;
  }
  if (synth) {
    loadVoices();
    try {
      if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", loadVoices);
      else synth.onvoiceschanged = loadVoices;
    } catch (e) { }
    // Chrome / Safari 的语音列表是异步加载的，多取几次
    setTimeout(loadVoices, 300);
    setTimeout(loadVoices, 1200);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden || !synth) return;
      try { if (synth.paused) synth.resume(); } catch (e) { }
    });
  }
  function pickVoice(lang, pref) {
    var l = (lang || "en").slice(0, 2).toLowerCase();
    var list = voices.filter(function (v) { return (v.lang || "").toLowerCase().indexOf(l) === 0; });
    for (var i = 0; i < pref.length; i++) {
      for (var j = 0; j < list.length; j++) if (list[j].name && list[j].name.indexOf(pref[i]) >= 0) return list[j];
    }
    return list[0] || null;
  }
  /* ---------- 预录英语配音：任何浏览器都能放，不依赖系统语音包 ---------- */
  var CLIPS = window.U4_AUDIO || {};
  var CLIPS_ZH = window.U4_AUDIO_ZH || {};
  var clipCount = Object.keys(CLIPS).length + Object.keys(CLIPS_ZH).length;
  var clipEl = null, clipGen = 0;
  function clipKey(text) { return String(text).replace(/\s+/g, " ").trim().toLowerCase(); }
  function stopClip() {
    clipGen++;
    if (clipEl) { try { clipEl.pause(); } catch (e) { } clipEl = null; }
  }
  function playClip(text, opts) {
    var url = CLIPS[clipKey(text)] || CLIPS_ZH[clipKey(text)];
    if (!url) return false;
    opts = opts || {};
    if (synth) { try { synth.cancel(); } catch (e) { } }
    stopClip();
    var myGen = clipGen;
    var el;
    try { el = new Audio(url); } catch (e) { return false; }
    el.preload = "auto";
    el.volume = 1;
    clipEl = el;
    var finished = false, counted = false;
    function countStart() {
      if (counted) return;
      counted = true;
      tts.health.starts++;
      tts.health.clips++;
      tts.health.lastStartAt = Date.now();
    }
    function finish(ok) {
      if (finished) return;
      finished = true;
      if (myGen !== clipGen) return;
      tts.speaking = false;
      if (ok) {
        countStart();
        if (opts.onend) { try { opts.onend(); } catch (e) { } }
      } else if (opts.onfail) { try { opts.onfail(); } catch (e) { } }
    }
    el.onended = function () { finish(true); };
    el.onerror = function () { finish(false); };
    el.onplaying = countStart;
    el.onplayingthrough = countStart;
    tts.speaking = true;
    var p = null;
    try { p = el.play(); } catch (e) { finish(false); return false; }
    if (p && typeof p.catch === "function") p.catch(function () { finish(false); });
    return true;
  }

  var tts = {
    supported: !!synth,
    speaking: false,
    gen: 0,
    clips: clipCount,
    health: { starts: 0, clips: 0, lastStartAt: 0, lastError: "", errors: [] },
    refresh: function () { loadVoices(); return tts.status(); },
    status: function () {
      loadVoices();
      var en = 0, zh = 0;
      for (var i = 0; i < voices.length; i++) {
        var l = (voices[i].lang || "").toLowerCase();
        if (l.indexOf("en") === 0) en++;
        if (l.indexOf("zh") === 0) zh++;
      }
      var ev = pickVoice("en-US", PREF_EN), zv = pickVoice("zh-CN", PREF_ZH);
      var paused = false;
      try { paused = !!(synth && synth.paused); } catch (e) { }
      return {
        supported: !!synth, sound: state.sound !== false, voices: voices.length, en: en, zh: zh,
        enVoice: ev ? ev.name : "", zhVoice: zv ? zv.name : "",
        starts: tts.health.starts, lastStartAt: tts.health.lastStartAt, lastError: tts.health.lastError,
        errors: tts.health.errors.slice(), paused: paused,
        clips: clipCount, clipStarts: tts.health.clips
      };
    },
    stop: function () {
      tts.gen++;
      tts.speaking = false;
      if (clipEl) { try { clipEl.pause(); } catch (e) { } clipEl = null; }
      if (synth) { try { synth.cancel(); } catch (e) { } }
    },
    speak: function (text, opts) {
      opts = opts || {};
      if (!text) return false;
      if (state.sound === false) { if (opts.onend) setTimeout(opts.onend, 0); return false; }
      var raw = String(text).replace(/\s+/g, " ").trim();
      if (!raw) return false;
      // 1) 优先播放预录音频（最稳定：不依赖系统语音包）
      if (clipCount && playClip(raw, {
        onend: opts.onend,
        onfail: function () { tts.speakTTS(raw, opts); }
      })) return true;
      // 2) 回退：浏览器语音合成
      return tts.speakTTS(raw, opts);
    },
    speakTTS: function (text, opts) {
      opts = opts || {};
      if (!synth || !tts.supported) { if (opts.onend) setTimeout(opts.onend, 0); return false; }
      if (clipEl) { try { clipEl.pause(); } catch (e) { } clipEl = null; clipGen++; }
      var lang = opts.lang || "en-US";
      var myGen = ++tts.gen;
      var wasActive = false;
      try { wasActive = !!(synth.speaking || synth.pending); } catch (e) { wasActive = false; }
      if (wasActive) { try { synth.cancel(); } catch (e) { } }
      if (!voices.length) loadVoices();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      var v = pickVoice(lang, lang.indexOf("zh") === 0 ? PREF_ZH : PREF_EN);
      if (v) u.voice = v;
      u.rate = opts.rate || (lang.indexOf("zh") === 0 ? 0.95 : 0.82);
      u.pitch = opts.pitch || (lang.indexOf("zh") === 0 ? 1.05 : 1.12);
      u.volume = 1;
      var done = false, attempt = 0, startedAt = Date.now();
      tts.speaking = true;
      function finish(kind, evObj) {
        if (done) return;
        done = true;
        if (myGen === tts.gen) tts.speaking = false;
        if (kind === "error") {
          var errName = (evObj && evObj.error) || "unknown";
          tts.health.lastError = errName;
          tts.health.errors.push(errName);
          if (tts.health.errors.length > 8) tts.health.errors.shift();
          if (myGen === tts.gen && opts.onerror) { try { opts.onerror(evObj); } catch (e) { } }
        }
        if (myGen === tts.gen && opts.onend) { try { opts.onend(); } catch (e) { } }
      }
      u.onstart = function () {
        tts.health.starts++;
        tts.health.lastStartAt = Date.now();
        if (opts.onstart) { try { opts.onstart(); } catch (e) { } }
      };
      u.onend = function () { finish("end"); };
      u.onerror = function (ev2) { finish("error", ev2); };
      function go() {
        if (myGen !== tts.gen) return;
        try { if (synth.paused) synth.resume(); } catch (e) { }
        try { synth.speak(u); } catch (e) {
          tts.health.lastError = "speak-failed";
          finish("error", { error: "speak-failed" });
          return;
        }
        setTimeout(function () {
          if (done || myGen !== tts.gen) return;
          if (tts.health.lastStartAt > startedAt) return;
          if (attempt >= 1) return;
          attempt++;
          try { synth.cancel(); } catch (e) { }
          try { if (synth.paused) synth.resume(); } catch (e) { }
          setTimeout(function () {
            if (done || myGen !== tts.gen) return;
            try { synth.speak(u); } catch (e) { }
          }, 140);
        }, 1400);
      }
      if (wasActive) setTimeout(go, 80);
      else go();
      return true;
    },
    sayEn: function (text, opts) { opts = opts || {}; opts.lang = "en-US"; return tts.speak(text, opts); },
    sayZh: function (text, opts) { opts = opts || {}; opts.lang = "zh-CN"; return tts.speak(text, opts); },
    /* 依次说：中文提示 → 英文目标 → 中文提示，用 onend 串联 */
    seq: function (list, opts) {
      opts = opts || {};
      var i = 0;
      function next() {
        if (i >= list.length) { if (opts.onend) opts.onend(); return; }
        var item = list[i++];
        var o = { lang: item.lang || "en-US", rate: item.rate, pitch: item.pitch, onend: next };
        tts.speak(item.text, o);
      }
      next();
    },
    /* 启动后自检：没声音时给出可见提示 */
    selfCheck: function () {
      if (state.sound === false) return;
      if (util.qs("#sound-banner")) return;
      var st = tts.status();
      if (!st.supported && !st.clips) { fx.banner("这个浏览器不支持语音，建议用 Chrome 或 Safari 打开", "openSoundCheck"); return; }
      if (st.starts === 0) { fx.banner("好像没有听到声音？点这里检查音量与声音设置", "openSoundCheck"); }
    }
  };
  U4.tts = tts;

  /* ---------------- 动画 / 特效 ---------------- */
  var fx = {
    confetti: function (count) {
      count = count || 70;
      var cv = util.qs("#fx-canvas");
      if (!cv) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
      cv.style.width = window.innerWidth + "px"; cv.style.height = window.innerHeight + "px";
      var ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var colors = ["#FF8A7A", "#FFD166", "#7FD8BE", "#8ECAE6", "#C3AEDD", "#FFB3C6", "#FFA94D", "#63C7AC"];
      var ps = [];
      for (var i = 0; i < count; i++) {
        ps.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.5,
          y: window.innerHeight * 0.32 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 11,
          vy: -Math.random() * 9 - 3,
          g: 0.28 + Math.random() * 0.14,
          s: 5 + Math.random() * 7,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.35,
          c: colors[Math.floor(Math.random() * colors.length)],
          life: 70 + Math.random() * 50
        });
      }
      var frames = 0;
      function tick() {
        frames++;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        var alive = 0;
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          if (frames > p.life) continue;
          alive++;
          p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
          p.vx *= 0.995;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = Math.max(0, 1 - frames / p.life);
          ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.62);
          ctx.restore();
        }
        if (alive > 0 && frames < 170) requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
      requestAnimationFrame(tick);
    },
    praise: function (en, zh, emoji) {
      var d = util.el("div", "praise-pop");
      d.innerHTML = '<div class="pp-emoji">' + (emoji || util.pick(["🎉", "🌟", "👏", "💯", "🥳", "✨"])) + '</div>' +
        '<div class="pp-en">' + (en || "Great!") + '</div>' +
        (zh ? '<div class="pp-zh">' + zh + '</div>' : "");
      document.body.appendChild(d);
      setTimeout(function () { d.remove(); }, 1250);
    },
    toast: function (msg, type) {
      var root = util.qs("#toast-root");
      if (!root) return;
      var t = util.el("div", "toast " + (type || ""), msg);
      root.appendChild(t);
      setTimeout(function () {
        t.style.transition = "opacity .3s,transform .3s";
        t.style.opacity = "0"; t.style.transform = "translateY(.5rem)";
        setTimeout(function () { t.remove(); }, 320);
      }, 1500);
    },
    /* 底部常驻提示条（用于声音故障自检） */
    banner: function (msg, act) {
      var old = util.qs("#sound-banner");
      if (old) old.remove();
      var d = util.el("div", "sound-banner");
      d.id = "sound-banner";
      d.innerHTML = '<span class="sb-icon">🔇</span><span class="sb-msg">' + msg + "</span>" +
        '<button class="sb-btn" data-act="' + (act || "openSoundCheck") + '">检查一下</button>' +
        '<button class="sb-x" data-act="soundBannerClose" title="关闭">×</button>';
      document.body.appendChild(d);
    }
  };
  U4.fx = fx;

  /* ---------------- 弹窗 ---------------- */
  var modalState = { node: null, onClose: null };
  var modal = {
    open: function (html, opts) {
      opts = opts || {};
      modal.close(true);
      var back = util.el("div", "modal-backdrop");
      back.innerHTML = '<div class="modal-card ' + (opts.cls || "") + '">' +
        (opts.closable === false ? "" : '<button class="icon-btn modal-close" data-act="modalClose" aria-label="关闭">✕</button>') +
        html + '</div>';
      document.body.appendChild(back);
      hydrate(back);
      modalState.node = back;
      modalState.onClose = opts.onClose || null;
      back.addEventListener("click", function (e) { if (e.target === back && opts.dismissible !== false) modal.close(); });
      if (opts.onOpen) opts.onOpen(back);
      return back;
    },
    close: function (silent) {
      if (modalState.node) {
        modalState.node.remove();
        var cb = modalState.onClose;
        modalState.node = null; modalState.onClose = null;
        if (!silent && cb) cb();
      }
    },
    isOpen: function () { return !!modalState.node; }
  };
  U4.modal = modal;

  /* 浮层栈：Esc 关闭最上层 */
  var overlays = [];
  U4.overlays = {
    push: function (o) { overlays.push(o); },
    remove: function (o) { overlays = overlays.filter(function (x) { return x !== o; }); },
    closeTop: function () {
      if (modal.isOpen()) { modal.close(); return true; }
      var top = overlays[overlays.length - 1];
      if (top && top.close) { top.close(); return true; }
      return false;
    }
  };

  /* ---------------- 路由 & 页面 ---------------- */
  var current = "", currentArg = null;
  var router = {
    current: function () { return current; },
    show: function (name, arg) {
      var scr = util.qs("#screen-" + name);
      if (!scr || !U4.PAGES || !U4.PAGES[name]) return;
      if (modal.isOpen()) modal.close(true);
      util.qsa(".screen").forEach(function (s) { s.classList.remove("active"); });
      setHTML(scr, U4.PAGES[name](arg));
      scr.classList.add("active");
      scr.scrollTop = 0;
      util.qsa(".tab").forEach(function (t) { t.classList.toggle("active", t.getAttribute("data-tab") === name); });
      current = name; currentArg = arg;
      if (name !== "room") sfx("page");
      document.dispatchEvent(new CustomEvent("screen:shown", { detail: { name: name, arg: arg, el: scr } }));
    },
    refresh: function () { if (current) router.show(current, currentArg); }
  };
  U4.router = router;

  /* 全局点击代理：所有交互通过 data-act 声明 */
  var actions = {};
  U4.actions = actions;
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) return;
    var act = t.getAttribute("data-act");
    if (actions[act]) { e.preventDefault(); actions[act](t, e); }
  });

  /* 键盘：Esc 关闭最上层 */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") U4.overlays.closeTop();
  });

  /* ---------------- 词卡 ---------------- */
  function wordCardHtml(w) {
    var size = 6.2;
    return '<div class="word-card">' +
      '<div class="wc-emoji">' + U4.artHtml(w, size) + '</div>' +
      '<div class="wc-en">' + w.en + '</div>' +
      '<div class="wc-ipa">' + (w.ipa || "") + '</div>' +
      '<div class="wc-zh">' + (w.zh || "") + '</div>' +
      (w.sentence ? '<div class="wc-sentence"><div><span class="s-en">' + w.sentence + '</span>' +
        '<span class="s-zh">' + (w.sentenceZh || "") + '</span></div>' +
        '<button class="icon-btn" data-act="wordSay" data-word="' + encodeURIComponent(w.sentence) + '" title="听句子">🔊</button></div>' : "") +
      '<div class="wc-actions">' +
      '<button class="btn btn-listen" data-act="wordSay" data-word="' + encodeURIComponent(w.en) + '" data-rate="0.7">🔊 读单词</button>' +
      '<button class="btn btn-ghost" data-act="wordSay" data-word="' + encodeURIComponent(w.en) + '" data-rate="0.45">🐢 慢速</button>' +
      '<button class="btn btn-mint" data-act="modalClose">记住了 ✓</button>' +
      '</div></div>';
  }
  function showWordCard(w, opts) {
    opts = opts || {};
    modal.open(wordCardHtml(w), { onClose: opts.onClose, dismissible: true });
    // 立即朗读：保留用户手势上下文，iOS / Safari 才会发声
    tts.sayEn(w.en, { rate: 0.7 });
  }
  U4.showWordCard = showWordCard;

  actions.openSoundCheck = function () {
    if (U4.teacherGo) U4.teacherGo("settings");
    else U4.router.show("teacher");
  };
  actions.soundBannerClose = function () {
    var b = util.qs("#sound-banner");
    if (b) b.remove();
  };
  actions.wordSay = function (t) {
    var word = decodeURIComponent(t.getAttribute("data-word") || "");
    var rate = parseFloat(t.getAttribute("data-rate") || "0.7");
    if (word) tts.sayEn(word, { rate: rate });
  };
  actions.modalClose = function () { modal.close(); };

  /* ---------------- 开始 / 引导 ---------------- */
  U4.boot = function () {
    ui.starCount();
    ui.soundIcon();
    var splash = util.qs("#splash");
    var startBtn = util.qs("#btn-splash-start");
    var started = false;
    function start() {
      if (started) return;   // 事件冒泡会让 splash/按钮各触发一次，必须只执行一次
      started = true;
      if (startBtn) startBtn.disabled = true;
      try { audio.init(); audio.unlock(); } catch (e) { }
      try { if (synth && !voices.length) loadVoices(); } catch (e) { }
      document.body.classList.add("started");
      if (splash) { splash.classList.add("out"); setTimeout(function () { splash.classList.add("hidden"); }, 600); }
      var app = util.qs("#app");
      if (app) app.classList.remove("hidden");
      router.show("map");
      // 欢迎语放在用户手势里同步触发（iOS / Safari 的语音必须由手势引发）
      try {
        tts.sayZh("欢迎来到快乐小屋！", {
          rate: 0.95,
          onend: function () { tts.sayEn("Welcome to Happy House!", { rate: 0.8 }); }
        });
      } catch (e) { }
      setTimeout(function () { tts.selfCheck(); }, 3200);
    }
    util.on(startBtn, "click", start);
    util.on(splash, "click", start);
  };

  /* 对外暴露给调试 / 自动化测试 */
  U4.internal = { util: util, setHTML: setHTML, hydrate: hydrate };

  window.addEventListener("error", function (ev) {
    var box = util.qs("#boot-error");
    if (!box) return;
    box.classList.remove("hidden");
    box.textContent = "出错了：" + (ev.message || ev.error) + "\n" + (ev.filename || "") + ":" + (ev.lineno || "");
  });
})();
