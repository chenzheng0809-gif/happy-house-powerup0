/* =========================================================
   快乐小屋 · 游戏引擎 + 7 类游戏
   ========================================================= */
(function () {
  "use strict";
  var U4 = window.U4, DATA = U4.DATA;
  var util = U4.util, tts = U4.tts, sfx = U4.sfx, fx = U4.fx, modal = U4.modal, actions = U4.actions;
  var el = util.el, qs = util.qs, qsa = util.qsa;

  /* =====================================================
     房间场景 HTML（房间页 & 听音找物游戏共用）
     ===================================================== */
  function roomStageHtml(room, opts) {
    opts = opts || {};
    var act = opts.hotspotAct || "roomWord";
    var html = '<div class="room-stage" style="--wall:' + room.wall + ';--floor:' + room.floor + '">' +
      '<div class="room-wall"></div><div class="room-floor"></div>';
    if (room.window) {
      html += '<div class="room-window" style="left:' + room.window.l + '%;top:' + room.window.t + '%;width:' + room.window.w + '%;height:' + room.window.h + '%"></div>';
    }
    (room.decor || []).forEach(function (d) {
      html += '<span class="decor-e" style="left:' + d.x + '%;top:' + d.y + '%;font-size:' + d.fs + 'rem">' + d.e + '</span>';
    });
    room.words.forEach(function (w) {
      html += '<button class="hotspot" data-act="' + act + '" data-word="' + w.id + '" data-room="' + room.id + '" ' +
        'style="left:' + w.x + '%;top:' + w.y + '%;font-size:' + w.fs + 'rem" aria-label="' + w.en + '">' +
        U4.artHtml(w, w.fs) + '<span class="hs-spark">✨</span></button>';
    });
    html += '</div>';
    return html;
  }

  function findWord(id, roomId) {
    var rooms = roomId ? [roomId] : DATA.roomOrder;
    for (var i = 0; i < rooms.length; i++) {
      var r = DATA.rooms[rooms[i]];
      if (!r) continue;
      for (var j = 0; j < r.words.length; j++) if (r.words[j].id === id) return { word: r.words[j], room: r };
    }
    for (var k = 0; k < DATA.stationery.length; k++) if (DATA.stationery[k].en === id) return { word: DATA.stationery[k], room: null };
    return null;
  }

  /* 房间热点：探索模式 → 词卡 */
  actions.roomWord = function (t) {
    var got = findWord(t.getAttribute("data-word"), t.getAttribute("data-room"));
    if (!got) return;
    sfx("pop");
    U4.showWordCard(got.word);
  };

  /* =====================================================
     通用游戏外壳
     ===================================================== */
  var ctx = null, resultCtx = null;

  function dotsHtml(n) {
    var out = "";
    for (var i = 0; i < n; i++) out += '<span class="g-dot"></span>';
    return out;
  }
  function updateDots(done) {
    if (!ctx) return;
    qsa(".g-dot", ctx.shell).forEach(function (d, i) {
      d.classList.toggle("done", i < done);
      d.classList.toggle("now", i === done);
    });
  }
  function gameHead(title, emoji, total) {
    return '<div class="game-head">' +
      '<button class="icon-btn" data-act="gameClose" title="结束游戏">✕</button>' +
      '<div class="game-title"><span class="gt-emoji">' + (emoji || "🎮") + '</span>' + title + '</div>' +
      '<div class="g-progress">' + dotsHtml(total) + '</div>' +
      '</div>';
  }
  function feedback(good, en, zh) {
    var node = el("div", "feedback-bar " + (good ? "good" : "bad"));
    node.innerHTML = (good ? "🌟" : "🤔") + ' <span><span class="fb-en">' + en + "</span><small>" + zh + "</small></span>";
    document.body.appendChild(node);
    setTimeout(function () { node.remove(); }, 1100);
  }
  function starsFor(correct, total) {
    if (!total) return 0;
    var r = correct / total;
    if (r >= 0.95) return 3;
    if (r >= 0.75) return 2;
    if (r >= 0.5) return 1;
    return 0;
  }

  /* =====================================================
     结果弹窗
     ===================================================== */
  function showResult(info) {
    var stars = info.stars || 0;
    var starsHtml = "";
    for (var i = 1; i <= 3; i++) {
      starsHtml += '<span class="star ' + (i <= stars ? "on" : "") + '" style="animation-delay:' + (i * 0.16) + 's">⭐</span>';
    }
    var title = stars >= 3 ? "太棒了！" : stars >= 1 ? "做得好！" : "再试一次吧！";
    var subEn = stars >= 3 ? "Perfect! You did it!" : stars >= 1 ? "Well done! Keep going!" : "Never give up! 加油！";
    var html = '<div class="result-card">' +
      '<div class="result-emoji">' + (stars >= 3 ? "🎉" : stars >= 1 ? "🌟" : "💪") + '</div>' +
      '<div class="result-title">' + title + '</div>' +
      '<div class="result-sub">' + subEn + '</div>' +
      (info.total ? '<div class="result-sub">答对 ' + info.correct + " / " + info.total + " 题</div>" : "") +
      '<div class="stars-row">' + starsHtml + '</div>' +
      '<div class="result-stats">' + (stars >= 2 ? "⭐ 获得 " + stars + " 颗星星！" : "再玩一次，争取三颗星！") + '</div>' +
      '<div class="wc-actions">' +
      '<button class="btn btn-mint" data-act="resultRetry">🔁 再玩一次</button>' +
      '<button class="btn btn-primary" data-act="resultContinue">继续 →</button>' +
      '</div></div>';
    modal.open(html, { cls: "result-card", closable: false });
    resultCtx = info;
    if (stars >= 2) setTimeout(function () { sfx("cheer"); fx.confetti(90); }, 260);
    else sfx("star");
  }

  function closeResult() { if (modal.isOpen()) modal.close(true); }

  actions.resultRetry = function () {
    closeResult();
    var cb = resultCtx && resultCtx.onRetry;
    resultCtx = null;
    closeGame(true);
    if (cb) cb();
  };
  actions.resultContinue = function () {
    closeResult();
    var cb = resultCtx && resultCtx.onContinue;
    resultCtx = null;
    closeGame(true);
    if (cb) cb();
  };

  /* =====================================================
     关闭游戏
     ===================================================== */
  function closeGame(silent) {
    if (ctx) {
      tts.stop();
      if (ctx.overlay) U4.overlays.remove(ctx.overlay);
      if (ctx.shell && ctx.shell.parentNode) ctx.shell.remove();
      ctx = null;
    }
    if (!silent) { sfx("page"); closeResult(); }
  }
  actions.gameClose = function () {
    var onClose = ctx && ctx.meta && ctx.meta.onClose;
    closeGame();
    if (onClose) onClose();
  };
  actions.gameReplay = function () { if (ctx && ctx.replay) ctx.replay(); };

  /* =====================================================
     类型一：通用问答（数字 / 是非 / 猜房间 / 自然拼读 / 形状 / 复习）
     ===================================================== */
  function playQuizRound() {
    if (!ctx) return;
    var r = ctx.meta.rounds[ctx.idx];
    if (!r) { finishQuiz(); return; }
    ctx.locked = false; ctx.firstTry = true; ctx.attempts = 0;
    U4.setHTML(ctx.els.visual, r.stageHtml || "");
    U4.setHTML(ctx.els.caption, r.captionEn || r.questionEn || "");
    U4.setHTML(ctx.els.zh, r.questionZh || "");
    var cls = r.options.length <= 2 ? " big" : "";
    U4.setHTML(ctx.els.options, r.options.map(function (o, i) {
      return '<button class="opt' + cls + '" data-act="gameOpt" data-i="' + i + '">' + o.html + "</button>";
    }).join(""));
    updateDots(ctx.idx);
    ctx.replay = function () {
      if (r.speakList) tts.seq(r.speakList);
      else {
        tts.seq([
          { text: r.questionZh, lang: "zh-CN" },
          { text: r.speakEn || r.questionEn, lang: "en-US" }
        ]);
      }
    };
    setTimeout(function () { if (ctx && ctx.replay) ctx.replay(); }, 280);
  }

  function nextQuizRound() {
    if (!ctx) return;
    ctx.idx++;
    if (ctx.idx >= ctx.meta.rounds.length) finishQuiz();
    else playQuizRound();
  }

  function finishQuiz() {
    var meta = ctx.meta, correct = ctx.correct, total = meta.rounds.length;
    var stars = Math.max(1, starsFor(correct, total));
    var key = meta.levelId ? String(meta.levelId) : (meta.freeKey || ("free:" + meta.id));
    var gained = U4.progress.record(key, { stars: stars, correct: correct, total: total, skill: meta.skill });
    ctx.locked = true;
    showResult({
      stars: stars, correct: correct, total: total, gained: gained,
      onRetry: meta.onRetry || null,
      onContinue: meta.onContinue || function () { U4.router.show("journey"); }
    });
  }

  actions.gameOpt = function (t) {
    if (!ctx || ctx.type !== "quiz" || ctx.locked) return;
    var r = ctx.meta.rounds[ctx.idx];
    var i = parseInt(t.getAttribute("data-i"), 10);
    var o = r.options[i];
    if (!o || o.blocked) return;
    ctx.attempts = (ctx.attempts || 0) + 1;
    if (o.correct) {
      ctx.locked = true;
      t.classList.add("correct");
      qsa(".opt", ctx.els.options).forEach(function (b) { b.classList.add("ghosted"); });
      t.classList.remove("ghosted");
      if (ctx.attempts <= 2) ctx.correct++;
      sfx("correct");
      feedback(true, "Great job!", "太棒了！");
      setTimeout(function () { tts.sayEn(r.successEn || "Great job!", { rate: 0.8 }); }, 120);
      setTimeout(nextQuizRound, 1400);
    } else {
      ctx.firstTry = false;
      o.blocked = true;
      t.classList.add("wrong");
      sfx("wrong");
      feedback(false, "Try again!", "再想一想～");
      setTimeout(function () { tts.sayEn("Try again!", { rate: 0.8 }); }, 120);
      setTimeout(function () { t.classList.remove("wrong"); t.classList.add("ghosted"); }, 600);
    }
  };

  function startQuiz(meta) {
    closeGame(true);
    var shell = el("div", "game-shell");
    shell.innerHTML = gameHead(meta.title, meta.emoji, meta.rounds.length) +
      '<div class="game-stage"><div class="stage-card">' +
      '<div class="stage-visual"></div><div class="stage-caption"></div><div class="stage-zh"></div>' +
      '</div></div><div class="game-options"></div>' +
      '<div class="game-foot"><button class="btn btn-ghost" data-act="gameReplay">🔊 再听一次</button></div>';
    qs("#overlay-root").appendChild(shell);
    ctx = {
      type: "quiz", meta: meta, shell: shell, idx: 0, correct: 0, locked: false,
      els: { visual: qs(".stage-visual", shell), caption: qs(".stage-caption", shell), zh: qs(".stage-zh", shell), options: qs(".game-options", shell) },
      overlay: { close: function () { closeGame(true); } }
    };
    U4.overlays.push(ctx.overlay);
    playQuizRound();
  }
  U4.startQuiz = startQuiz;

  /* =====================================================
     类型二：听音找物（房间场景点一点）
     ===================================================== */
  function playRoomRound() {
    if (!ctx) return;
    var w = ctx.rounds[ctx.idx];
    if (!w) { finishRoomFind(); return; }
    ctx.locked = false;
    U4.setHTML(ctx.els.caption, "Where is the " + w.en + "?");
    U4.setHTML(ctx.els.zh, w.zh + "在哪里？点一点它！");
    qsa(".hotspot", ctx.shell).forEach(function (h) { h.classList.remove("found", "wrong"); });
    updateDots(ctx.idx);
    ctx.replay = function () {
      tts.seq([
        { text: w.zh + "在哪里？点一点它！", lang: "zh-CN" },
        { text: "Where is the " + w.en + "?", lang: "en-US" }
      ]);
    };
    setTimeout(function () { if (ctx && ctx.replay) ctx.replay(); }, 300);
  }
  function nextRoomRound() {
    if (!ctx) return;
    ctx.idx++;
    if (ctx.idx >= ctx.rounds.length) finishRoomFind();
    else playRoomRound();
  }
  function finishRoomFind() {
    var meta = ctx.meta, correct = ctx.correct, total = ctx.rounds.length;
    var wrong = ctx.wrong || 0;
    var stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;
    var key = meta.levelId ? String(meta.levelId) : (meta.freeKey || ("free:room:" + meta.roomId));
    var gained = U4.progress.record(key, { stars: stars, correct: correct, total: total, skill: meta.skill });
    ctx.locked = true;
    showResult({
      stars: stars, correct: correct, total: total, gained: gained,
      onRetry: meta.onRetry,
      onContinue: meta.onContinue || function () { U4.router.show("journey"); }
    });
  }
  actions.rfTap = function (t) {
    if (!ctx || ctx.type !== "roomfind" || ctx.locked) return;
    var id = t.getAttribute("data-word");
    var target = ctx.rounds[ctx.idx];
    if (!target) return;
    if (id === target.id) {
      ctx.locked = true;
      t.classList.add("found");
      sfx("correct");
      fx.praise("Yes!", "找到了！");
      ctx.correct++;
      setTimeout(function () { tts.sayEn(target.sentence || ("It's a " + target.en + "."), { rate: 0.8 }); }, 100);
      setTimeout(nextRoomRound, 1800);
    } else {
      ctx.wrong = (ctx.wrong || 0) + 1;
      t.classList.add("wrong");
      sfx("wrong");
      setTimeout(function () { t.classList.remove("wrong"); }, 480);
      tts.sayEn("Not here. Try again!", { rate: 0.8 });
    }
  };

  function startRoomFind(roomId, opts) {
    opts = opts || {};
    var room = DATA.rooms[roomId];
    if (!room) return;
    closeGame(true);
    var rounds = util.shuffle(room.words).slice(0, Math.min(4, room.words.length));
    var shell = el("div", "game-shell");
    var meta = {
      title: opts.title || ("听音找物 · " + room.zh),
      emoji: opts.emoji || room.emoji,
      levelId: opts.levelId || null,
      skill: opts.skill || "家具词汇",
      roomId: roomId,
      onContinue: opts.onContinue,
      onClose: opts.onClose
    };
    shell.innerHTML = gameHead(meta.title, meta.emoji, rounds.length) +
      '<div class="game-stage"><div class="stage-card" style="max-width:64rem;padding:.8rem 1rem">' +
      '<div class="stage-caption"></div><div class="stage-zh"></div>' +
      '<div class="rf-slot" style="width:100%"></div>' +
      '</div></div><div class="game-foot"><button class="btn btn-ghost" data-act="gameReplay">🔊 再听一次</button></div>';
    qs("#overlay-root").appendChild(shell);
    U4.setHTML(qs(".rf-slot", shell), roomStageHtml(room, { hotspotAct: "rfTap" }));
    ctx = {
      type: "roomfind", meta: meta, shell: shell, rounds: rounds, idx: 0, correct: 0, wrong: 0, locked: false,
      els: { caption: qs(".stage-caption", shell), zh: qs(".stage-zh", shell) },
      overlay: { close: function () { closeGame(true); } }
    };
    ctx.meta.onRetry = function () { startRoomFind(roomId, opts); };
    U4.overlays.push(ctx.overlay);
    playRoomRound();
  }
  U4.startRoomFind = startRoomFind;

  /* =====================================================
     题库生成器
     ===================================================== */
  function numZh(n) { return ["零", "一", "二", "三", "四", "五"][n] || n; }

  function buildFindRounds(count) {
    var pool = [];
    DATA.roomOrder.forEach(function (rid) {
      DATA.rooms[rid].words.forEach(function (w) { pool.push(w); });
    });
    DATA.stationery.forEach(function (s) {
      pool.push({ id: s.en, en: s.en, zh: s.zh, ipa: s.ipa, e: s.e, html: s.html, sentence: "I have got a " + s.en + ".", sentenceZh: "我有一个" + s.zh + "。" });
    });
    pool = util.shuffle(pool).filter(function (w, i, a) { return a.map(function (x) { return x.en; }).indexOf(w.en) === i; });
    var rounds = [];
    for (var i = 0; i < count && i < pool.length; i++) {
      var target = pool[i];
      var others = util.shuffle(pool.filter(function (w) { return w.en !== target.en; })).slice(0, 3);
      var options = util.shuffle([{ w: target, correct: true }].concat(others.map(function (o) { return { w: o, correct: false }; })))
        .map(function (o) {
          return { html: U4.artHtml(o.w, 3.1), correct: o.correct };
        });
      rounds.push({
        skill: "词汇复习",
        questionEn: "Where is the " + target.en + "?",
        questionZh: "找到「" + target.zh + "」！",
        stageHtml: '<span style="font-size:1.6rem;font-weight:900">🔎 找一找</span>',
        options: options,
        successEn: "Yes! It is the " + target.en + ".",
        successZh: "对！是" + target.zh + "。"
      });
    }
    return rounds;
  }

  function buildHowMany() {
    return util.shuffle(DATA.howManyRounds).map(function (r) {
      var visual = "";
      for (var i = 0; i < r.count; i++) {
        visual += '<span class="sv-item" style="animation-delay:' + (i * 0.07) + 's">' + U4.artHtml(r.item, 4.0) + "</span>";
      }
      return {
        skill: "数量与文具",
        questionEn: "How many " + r.item.plural + " have you got?",
        questionZh: "数一数：你有几" + r.item.zh + "？",
        stageHtml: visual,
        captionEn: "How many " + r.item.plural + "?",
        options: DATA.numbers.map(function (num) {
          return { html: '<span class="opt-num">' + num.n + '</span><span class="opt-en">' + num.en + "</span>", correct: num.n === r.count };
        }),
        successEn: "I have got " + r.numEn + " " + r.item.plural + ".",
        successZh: "我有" + r.numZh + r.item.zh + "。"
      };
    });
  }

  function buildYesNo() {
    return util.shuffle(DATA.yesNoRounds).slice(0, 5).map(function (r) {
      var items = r.items.map(function (e) { return '<span style="font-size:2.2rem">' + e + "</span>"; }).join("");
      return {
        skill: "have / has got",
        questionEn: r.qEn,
        questionZh: r.qZh,
        stageHtml: '<div class="char-line"><span class="cl-face">' + r.face + (r.face2 ? r.face2 : "") + '</span>' +
          '<div style="text-align:left"><b style="font-family:var(--font-en)">' + r.who + '</b>' +
          '<div class="cl-items">' + items + '</div></div></div>' +
          '<div style="font-size:1.9rem;font-weight:900;margin-top:.3rem">❓ ' + r.target.e + ' ' + r.target.en + '</div>',
        options: [
          { html: '<span class="opt-emoji">✅</span><span class="opt-en">Yes</span>', correct: r.answer === true },
          { html: '<span class="opt-emoji">❌</span><span class="opt-en">No</span>', correct: r.answer === false }
        ],
        successEn: r.fullEn,
        successZh: r.fullZh
      };
    });
  }

  function buildGuessRoom() {
    return util.shuffle(DATA.guessRoomRounds).map(function (r) {
      var clues = r.clues.map(function (c) {
        return '<span style="display:inline-flex;align-items:center;gap:.35rem;background:#FFF3D6;border-radius:999px;padding:.3rem .85rem;font-weight:800;font-size:1.2rem">' + c.e + " " + c.en + "</span>";
      }).join("");
      var room = DATA.rooms[r.room];
      return {
        skill: "房间词汇",
        questionEn: r.qEn,
        questionZh: r.qZh,
        stageHtml: '<div style="display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center">' + clues + "</div>",
        captionEn: "Where is it?",
        options: DATA.roomOrder.map(function (rid) {
          var rm = DATA.rooms[rid];
          return { html: '<span class="opt-emoji">' + rm.emoji + '</span><span class="opt-en">' + rm.en + "</span>", correct: rid === r.room };
        }),
        successEn: "Yes! It is the " + room.en + ".",
        successZh: "对！是" + room.zh + "。"
      };
    });
  }

  function buildPhonics() {
    var b = util.shuffle(DATA.phonics.B).slice(0, 3).map(function (w) { return { w: w, letter: "B" }; });
    var c = util.shuffle(DATA.phonics.C).slice(0, 3).map(function (w) { return { w: w, letter: "C" }; });
    return util.shuffle(b.concat(c)).map(function (o) {
      var masked = "_" + o.w.word.slice(1);
      return {
        skill: "自然拼读",
        questionEn: "Which letter comes first?",
        questionZh: "听一听，第一个字母是 B 还是 C？",
        speakList: [
          { text: "Listen!", lang: "en-US" },
          { text: o.w.word, lang: "en-US" },
          { text: o.w.word, lang: "en-US", rate: 0.6 }
        ],
        stageHtml: '<span style="font-size:4.6rem;line-height:1.1">' + o.w.e + '</span>' +
          '<div style="font-family:var(--font-en);font-size:2.2rem;font-weight:900;letter-spacing:.1em">' + masked + '</div>',
        options: [
          { html: '<span class="opt-letter">B</span><span class="opt-en">/b/</span>', correct: o.letter === "B" },
          { html: '<span class="opt-letter">C</span><span class="opt-en">/k/</span>', correct: o.letter === "C" }
        ],
        successEn: o.letter + " is for " + o.w.word + "!",
        successZh: "对！" + o.w.word + " 以 " + o.letter + " 开头。"
      };
    });
  }

  var SHAPE_COLORS = ["#FF8A7A", "#FFD166", "#7FD8BE", "#8ECAE6", "#C3AEDD", "#FFB3C6", "#F4A261"];
  function shapeOption(type, color, size) {
    size = size || 4.8;
    return '<span style="display:inline-block;width:' + size + 'rem;height:' + size + 'rem">' + U4.ART.shape(type, color) + "</span>";
  }
  function buildShapes() {
    var rounds = [];
    var orders = [
      ["circle", "square", "triangle", "rectangle"],
      ["square", "circle", "rectangle", "triangle"],
      ["triangle", "rectangle", "circle", "square"],
      ["rectangle", "triangle", "square", "circle"],
      ["circle", "triangle", "square", "rectangle"],
      ["square", "rectangle", "triangle", "circle"]
    ];
    var targets = ["circle", "square", "rectangle", "triangle", "circle", "triangle"];
    for (var i = 0; i < 6; i++) {
      var target = targets[i];
      var types = util.shuffle(orders[i]);
      var options = types.map(function (t) {
        return { html: shapeOption(t, util.pick(SHAPE_COLORS)), correct: t === target };
      });
      var meta = DATA.shapes.filter(function (s) { return s.type === target; })[0];
      rounds.push({
        skill: "形状",
        questionEn: "Find the " + target + "!",
        questionZh: "找到「" + meta.zh + "」点一点！",
        stageHtml: '<span style="font-size:1.5rem;font-weight:900">🔷 ' + meta.zh + "</span>",
        options: util.shuffle(options),
        successEn: "Yes! It is a " + target + ".",
        successZh: "对！这是" + meta.zh + "。"
      });
    }
    return rounds;
  }

  function buildReview() {
    var rounds = [];
    rounds = rounds.concat(buildFindRounds(3));
    rounds = rounds.concat(buildHowMany().slice(0, 2));
    rounds = rounds.concat(buildYesNo().slice(0, 2));
    rounds = rounds.concat(buildPhonics().slice(0, 2));
    rounds = rounds.concat(buildShapes().slice(0, 2));
    return util.shuffle(rounds).slice(0, 10);
  }

  var builders = {
    find: buildFindRounds, howmany: buildHowMany, yesno: buildYesNo,
    guessroom: buildGuessRoom, phonics: buildPhonics, shapes: buildShapes, review: buildReview
  };
  U4.builders = builders;

  /* =====================================================
     关卡入口
     ===================================================== */
  function levelMeta(level, rounds) {
    return {
      levelId: String(level.id), title: "第 " + level.id + " 关 · " + level.title,
      emoji: level.emoji, skill: level.skill, rounds: rounds, id: "lv" + level.id,
      onRetry: function () { startLevel(level); },
      onContinue: function () { U4.router.show("journey"); }
    };
  }

  function startLevel(level) {
    sfx("tap");
    if (level.type === "story") { U4.Stories.open(level.story, level); return; }
    if (level.type === "room") {
      startRoomFind(level.room, {
        levelId: String(level.id), title: "第 " + level.id + " 关 · " + level.title,
        skill: level.skill, emoji: level.emoji,
        onContinue: function () { U4.router.show("journey"); },
        onClose: function () { U4.router.show("journey"); }
      });
      return;
    }
    var rounds;
    if (level.type === "howmany") rounds = buildHowMany();
    else if (level.type === "guessroom") rounds = buildGuessRoom();
    else if (level.type === "yesno") rounds = buildYesNo();
    else if (level.type === "phonics") rounds = buildPhonics();
    else if (level.type === "shapes") rounds = buildShapes();
    else rounds = buildReview();
    startQuiz(levelMeta(level, rounds));
  }
  U4.startLevel = startLevel;

  function startFree(item) {
    var rounds, meta;
    if (item.type === "room") {
      startRoomFind(item.room, {
        title: "自由练习 · " + DATA.rooms[item.room].zh, skill: "家具词汇",
        freeKey: "free:room:" + item.room,
        onContinue: function () { U4.router.show("map"); },
        onClose: function () { U4.router.show("map"); }
      });
      return;
    }
    if (item.type === "howmany") rounds = buildHowMany();
    else if (item.type === "yesno") rounds = buildYesNo();
    else if (item.type === "phonics") rounds = buildPhonics();
    else if (item.type === "shapes") rounds = buildShapes();
    else rounds = buildReview();
    var skill = item.type === "howmany" ? "数量与文具" : item.type === "yesno" ? "have / has got" : item.type === "phonics" ? "自然拼读" : item.type === "shapes" ? "形状" : "综合复习";
    startQuiz({
      id: "free-" + item.type, freeKey: "free:" + item.type,
      title: item.label + " · 自由练习", emoji: item.emoji || "🎮", skill: skill,
      rounds: rounds,
      onContinue: function () { U4.router.show("map"); },
      onClose: function () { U4.router.show("map"); }
    });
  }
  U4.startFree = startFree;

  /* 对外 */
  U4.Games = {
    start: startLevel, startFree: startFree, startQuiz: startQuiz, startRoomFind: startRoomFind,
    roomStageHtml: roomStageHtml, findWord: findWord, showResult: showResult,
    builders: builders, close: closeGame
  };
})();
