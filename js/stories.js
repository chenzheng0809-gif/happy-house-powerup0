/* =========================================================
   快乐小屋 · 互动故事书（The Three Wishes / Frida's Home）
   ========================================================= */
(function () {
  "use strict";
  var U4 = window.U4, DATA = U4.DATA;
  var util = U4.util, tts = U4.tts, sfx = U4.sfx, fx = U4.fx, qs = util.qs, qsa = util.qsa, el = util.el;
  var actions = U4.actions;

  function A(e, en) { return { e: e, en: en || "" }; }

  var STORIES = {
    wishes: {
      id: "wishes", title: "三个愿望", en: "The Three Wishes", emoji: "🐟",
      pages: [
        { art: [A("🧒", "boy"), A("👧", "girl"), A("🌊", "water")],
          en: "Yuri and Anya are by the water.", zh: "尤里和安雅来到水边。" },
        { art: [A("🎣"), A("🐟", "fish")],
          en: "Yuri has got a magic fish!", zh: "尤里钓到了一条魔法鱼！" },
        { art: [A("🐟", "fish"), A("✨", "magic"), A("💬")],
          en: "The fish says: You have got three wishes!", zh: "小鱼说：你们有三个愿望！" },
        { type: "choices",
          en: "Make three wishes with Yuri and Anya!", zh: "帮尤里和安雅许下三个愿望吧！",
          choices: [
            { e: "🏠", en: "A big house!", zh: "大房子" },
            { e: "🌳", en: "A garden!", zh: "花园" },
            { e: "💡", en: "Lamps, clocks and mirrors!", zh: "台灯、时钟和镜子" }
          ] },
        { art: [A("🏠", "house"), A("🌳", "tree"), A("💡", "lamp"), A("🕰️", "clock"), A("🪞", "mirror")],
          en: "Now they have got a big house, a garden and many nice things.", zh: "现在他们有了大房子、花园和很多漂亮的东西。" },
        { art: [A("🐟", "fish"), A("😠", "angry")],
          en: "But the fish is angry. It is not happy.", zh: "可是小鱼生气了，它不开心。" },
        { type: "ask", en: "Is the fish happy?", zh: "小鱼开心吗？", answer: false,
          yesText: "Yes, it is.", noText: "No, it isn't.",
          explainEn: "No. The fish is angry.", explainZh: "不开心。小鱼生气了。" },
        { art: [A("🧒", "boy"), A("👧", "girl"), A("😢", "sad"), A("🏚️", "house")],
          en: "Now they have not got a big house. They are not happy.", zh: "现在他们没有了漂亮的大房子，他们也不开心。" },
        { type: "ask", en: "Are they happy at the end?", zh: "故事最后他们开心吗？", answer: false,
          yesText: "Yes, they are.", noText: "No, they aren't.",
          explainEn: "No. They are not happy.", explainZh: "不开心。" },
        { art: [A("😊", "happy"), A("🏠", "house"), A("⭐")],
          en: "Be happy with what you have.", zh: "知足常乐：珍惜你已经拥有的。" }
      ],
      quiz: [
        { qEn: "Have they got three wishes?", qZh: "他们有三个愿望吗？", answer: true,
          fullEn: "Yes, they have got three wishes.", fullZh: "是的，他们有三个愿望。", stage: "🐟✨" },
        { qEn: "Is the fish happy at the end?", qZh: "故事最后小鱼开心吗？", answer: false,
          fullEn: "No, it isn't. It is angry.", fullZh: "不开心，它生气了。", stage: "🐟😠" },
        { qEn: "Have they got a big house at the end?", qZh: "故事最后他们还有大房子吗？", answer: false,
          fullEn: "No, they haven't. They are not happy.", fullZh: "没有了，他们不开心。", stage: "🏚️😢" },
        { qEn: "Are they happy at the end?", qZh: "故事最后他们开心吗？", answer: false,
          fullEn: "No, they aren't happy.", fullZh: "不开心。", stage: "🧒👧😢" }
      ]
    },

    frida: {
      id: "frida", title: "弗丽达找家", en: "Frida's Home", emoji: "🐦",
      pages: [
        { art: [A("🐦", "bird"), A("🌧️")],
          en: "This is Frida. Frida is a little bird.", zh: "这是弗丽达，一只小鸟。" },
        { art: [A("🐦", "bird"), A("💨"), A("🏚️")],
          en: "Frida has not got a house. She is sad.", zh: "弗丽达没有家，她很难过。" },
        { art: [A("🐦", "bird"), A("🏠", "house"), A("👦", "boy"), A("👩", "woman")],
          en: "Frida flies to Matt and Anna's house.", zh: "弗丽达飞到马特和安娜家。" },
        { type: "ask", en: "Has Frida got a bedroom?", zh: "弗丽达有卧室吗？", answer: false,
          yesText: "Yes, she has.", noText: "No, she hasn't.",
          explainEn: "No, she hasn't got a bedroom.", explainZh: "没有，她没有卧室。" },
        { art: [A("🐦", "bird"), A("🐱", "cat"), A("🐶", "dog")],
          en: "Frida meets a cat and a dog. They are her friends.", zh: "弗丽达遇见了小猫和小狗，他们是她的朋友。" },
        { type: "ask", en: "Has Frida got friends?", zh: "弗丽达有朋友吗？", answer: true,
          yesText: "Yes, she has.", noText: "No, she hasn't.",
          explainEn: "Yes, she has got friends.", explainZh: "有的，她交到了朋友。" },
        { art: [A("👦", "boy"), A("👩", "woman"), A("🪺", "nest"), A("🌳", "tree")],
          en: "Matt and Anna make a nest for Frida in the garden.", zh: "马特和安娜在花园里为弗丽达做了一个鸟窝。" },
        { art: [A("🐦", "bird"), A("🪺", "nest"), A("😊", "happy"), A("🌳", "tree")],
          en: "Now Frida has got a home. She is very happy!", zh: "现在弗丽达有家了，她非常开心！" },
        { art: [A("🐦", "bird"), A("🐱", "cat"), A("🐶", "dog"), A("❤️")],
          en: "Home is where your friends are.", zh: "有朋友的地方，就是家。" }
      ],
      quiz: [
        { qEn: "Has Frida got a house at the beginning?", qZh: "故事开头弗丽达有家吗？", answer: false,
          fullEn: "No, she hasn't got a house.", fullZh: "没有，她没有家。", stage: "🐦🏚️" },
        { qEn: "Has Frida got friends?", qZh: "弗丽达有朋友吗？", answer: true,
          fullEn: "Yes, she has got friends.", fullZh: "有的，她有朋友。", stage: "🐦🐱🐶" },
        { qEn: "Is Frida happy at the end?", qZh: "故事最后弗丽达开心吗？", answer: true,
          fullEn: "Yes, she is very happy!", fullZh: "是的，她非常开心！", stage: "🐦😊" },
        { qEn: "Where is Frida's home?", qZh: "弗丽达的家在哪里？", pick: true,
          options: [
            { e: "🌳", en: "garden", correct: true },
            { e: "🛁", en: "bathroom", correct: false },
            { e: "🍳", en: "kitchen", correct: false }
          ],
          successEn: "Yes! Her home is in the garden.", successZh: "对！她的家在花园里。", stage: "🐦🪺🌳" }
      ]
    }
  };

  /* ---------------- 故事书状态 ---------------- */
  var ctx = null;

  function pageArtHtml(page, chosen) {
    var list = (page.art || []).slice();
    if (chosen) list = list.concat(chosen);
    return list.map(function (item) {
      if (typeof item === "string") item = A(item);
      var label = item.en ? ' data-act="storyArt" data-en="' + item.en + '" style="cursor:pointer"' : "";
      return '<span class="art-e" ' + label + ' title="' + (item.en || "") + '">' + item.e + "</span>";
    }).join("");
  }

  function quizMeta(story, level) {
    var rounds = story.quiz.map(function (q) {
      if (q.pick) {
        return {
          skill: "故事理解",
          questionEn: q.qEn, questionZh: q.qZh,
          stageHtml: '<span style="font-size:3rem">' + q.stage + "</span>",
          options: util.shuffle(q.options.map(function (o) {
            return { html: '<span class="opt-emoji">' + o.e + '</span><span class="opt-en">' + o.en + "</span>", correct: o.correct };
          })),
          successEn: q.successEn, successZh: q.successZh
        };
      }
      return {
        skill: "故事理解",
        questionEn: q.qEn, questionZh: q.qZh,
        stageHtml: '<span style="font-size:3rem">' + q.stage + "</span>",
        options: [
          { html: '<span class="opt-emoji">✅</span><span class="opt-en">Yes</span>', correct: q.answer === true },
          { html: '<span class="opt-emoji">❌</span><span class="opt-en">No</span>', correct: q.answer === false }
        ],
        successEn: q.fullEn, successZh: q.fullZh
      };
    });
    var meta = {
      id: "story-" + story.id, levelId: level ? String(level.id) : null,
      freeKey: "free:story:" + story.id,
      title: story.title + " · 小问答", emoji: "🧠", skill: "故事理解",
      rounds: rounds,
      onContinue: function () { U4.router.show(level ? "journey" : "map"); },
      onClose: function () { U4.router.show(level ? "journey" : "map"); }
    };
    meta.onRetry = function () { U4.startQuiz(meta); };
    return meta;
  }

  function closeStory(silent) {
    if (!ctx) return;
    tts.stop();
    U4.overlays.remove(ctx.overlay);
    if (ctx.shell && ctx.shell.parentNode) ctx.shell.remove();
    ctx = null;
    if (!silent) sfx("page");
  }

  function finishStory() {
    var id = ctx.story.id, level = ctx.level;
    closeStory(true);
    sfx("star");
    fx.confetti(60);
    setTimeout(function () {
      U4.startQuiz(quizMeta(STORIES[id], level));
    }, 350);
  }

  function updateStoryDots() {
    qsa(".sb-dot", ctx.shell).forEach(function (d, i) { d.classList.toggle("on", i === ctx.idx); });
  }

  function renderPage() {
    if (!ctx) return;
    var story = ctx.story, page = story.pages[ctx.idx];
    ctx.answeredAdd = [];
    ctx.answered = false;
    var artRow = qs(".art-row", ctx.shell);
    U4.setHTML(artRow, pageArtHtml(page));
    // 文字
    qs(".sb-en-line", ctx.shell).textContent = page.en;
    qs(".sb-zh-line", ctx.shell).textContent = page.zh;
    // 选项区 / 问答区
    var choiceBox = qs(".sb-choices", ctx.shell);
    var askBox = qs(".ask-box", ctx.shell);
    choiceBox.classList.add("hidden");
    askBox.classList.add("hidden");
    ctx.lockedChoices = {};
    if (page.type === "choices") {
      choiceBox.classList.remove("hidden");
      U4.setHTML(choiceBox, page.choices.map(function (c, i) {
        return '<button class="sb-choice" data-act="storyChoice" data-i="' + i + '">' +
          '<span class="sc-e">' + c.e + '</span><span>' + c.en + '<br><small style="font-weight:700;color:#8A7566">' + c.zh + "</small></span></button>";
      }).join(""));
    } else if (page.type === "ask") {
      askBox.classList.remove("hidden");
      U4.setHTML(askBox,
        '<div class="ask-q">' + page.en + "</div><div class=\"ask-zh\">" + page.zh + "</div>" +
        '<div class="ask-opts">' +
        '<button class="ask-btn" data-act="storyAsk" data-ans="yes">✅ ' + (page.yesText || "Yes") + "</button>" +
        '<button class="ask-btn" data-act="storyAsk" data-ans="no">❌ ' + (page.noText || "No") + "</button>" +
        "</div><div class='ask-exp' style='display:none;margin-top:.7rem;font-size:1rem;font-weight:800;color:#2F9E77'></div>");
    }
    updateStoryDots();
    var nextBtn = qs("[data-act='storyNext']", ctx.shell);
    if (nextBtn) nextBtn.textContent = ctx.idx === story.pages.length - 1 ? "做小问答 🧠" : "下一页 →";
    // 语音
    ctx.replay = function () {
      if (page.type === "choices") {
        tts.seq([{ text: page.zh, lang: "zh-CN" }, { text: page.en, lang: "en-US" }]);
      } else if (page.type === "ask") {
        tts.seq([{ text: page.zh, lang: "zh-CN" }, { text: page.en, lang: "en-US" }]);
      } else {
        tts.seq([{ text: page.en, lang: "en-US" }, { text: page.zh, lang: "zh-CN" }]);
      }
    };
    setTimeout(function () { if (ctx && ctx.replay) ctx.replay(); }, 260);
  }

  function nextPage() {
    if (!ctx) return;
    var page = ctx.story.pages[ctx.idx];
    if ((page.type === "ask" || page.type === "choices") && !ctx.answered) {
      fx.toast(page.type === "ask" ? "先回答小问题哦～" : "先点一点三个愿望吧～");
      sfx("wrong");
      return;
    }
    if (ctx.idx >= ctx.story.pages.length - 1) { finishStory(); return; }
    ctx.idx++;
    sfx("page");
    renderPage();
  }
  function prevPage() {
    if (!ctx) return;
    if (ctx.idx <= 0) return;
    ctx.idx--;
    sfx("page");
    renderPage();
  }

  actions.storyNext = nextPage;
  actions.storyPrev = prevPage;
  actions.storySay = function () { if (ctx && ctx.replay) ctx.replay(); };
  actions.storyClose = function () {
    var level = ctx && ctx.level;
    closeStory();
    U4.router.show(level ? "journey" : "map");
  };
  actions.storyArt = function (t) {
    var en = t.getAttribute("data-en");
    if (en) tts.sayEn(en, { rate: 0.7 });
    sfx("pop");
  };
  actions.storyChoice = function (t) {
    if (!ctx) return;
    var page = ctx.story.pages[ctx.idx];
    var i = parseInt(t.getAttribute("data-i"), 10);
    if (ctx.lockedChoices[i]) return;
    ctx.lockedChoices[i] = true;
    var choice = page.choices[i];
    t.classList.add("done");
    sfx("pop");
    tts.sayEn(choice.en, { rate: 0.75 });
    var row = qs(".art-row", ctx.shell);
    var span = el("span", "art-e", choice.e);
    row.appendChild(span);
    var total = page.choices.length;
    if (Object.keys(ctx.lockedChoices).length >= total) {
      ctx.answered = true;
      setTimeout(function () { sfx("cheer"); fx.confetti(40); }, 300);
    }
  };
  actions.storyAsk = function (t) {
    if (!ctx || ctx.answered) return;
    var page = ctx.story.pages[ctx.idx];
    var ans = t.getAttribute("data-ans") === "yes";
    var correct = ans === page.answer;
    if (correct) {
      t.classList.add("correct");
      sfx("correct");
      fx.praise("Yes!", "答对啦！");
      var exp = qs(".ask-exp", ctx.shell);
      if (exp) { exp.style.display = "block"; exp.textContent = page.explainEn + " " + page.explainZh; }
      qsa(".ask-btn", ctx.shell).forEach(function (b) { b.disabled = true; });
      ctx.answered = true;
      setTimeout(function () { tts.sayEn(page.explainEn, { rate: 0.8 }); }, 150);
    } else {
      t.classList.add("wrong");
      sfx("wrong");
      setTimeout(function () { t.classList.remove("wrong"); }, 600);
      tts.sayEn("Try again!", { rate: 0.8 });
    }
  };

  /* ---------------- 打开故事 ---------------- */
  function open(storyId, level) {
    var story = STORIES[storyId];
    if (!story) return;
    closeStory(true);
    U4.modal.close(true);
    var shell = el("div", "storybook");
    var dots = "";
    story.pages.forEach(function () { dots += '<span class="sb-dot"></span>'; });
    shell.innerHTML =
      '<div class="sb-head">' +
      '<button class="icon-btn sb-close" data-act="storyClose" title="关闭故事">✕</button>' +
      '<div class="game-title"><span class="gt-emoji">' + story.emoji + '</span>' + story.title + " · " + story.en + "</div>" +
      '</div>' +
      '<div class="sb-body">' +
      '<div class="sb-art"><div class="art-sun">☀️</div><div class="art-ground"></div><div class="art-row"></div></div>' +
      '<div class="sb-text"><div class="sbt-main"><div class="sb-en-line"></div><div class="sb-zh-line"></div></div>' +
      '<button class="icon-btn" data-act="storySay" title="再听一次">🔊</button></div>' +
      '<div class="sb-choices hidden"></div>' +
      '<div class="ask-box hidden"></div>' +
      '<div class="sb-nav">' +
      '<button class="btn btn-ghost" data-act="storyPrev">← 上一页</button>' +
      '<div class="sb-dots">' + dots + "</div>" +
      '<button class="btn btn-primary" data-act="storyNext">下一页 →</button>' +
      '</div></div>';
    qs("#overlay-root").appendChild(shell);
    ctx = {
      story: story, level: level || null, shell: shell, idx: 0, answered: false, lockedChoices: {},
      overlay: { close: function () { closeStory(); U4.router.show(level ? "journey" : "map"); } }
    };
    U4.overlays.push(ctx.overlay);
    if (!level) { /* 自由阅读也记录在综合里 */ }
    renderPage();
    sfx("page");
  }

  U4.Stories = { open: open, data: STORIES, close: closeStory };
})();
