/* =========================================================
   快乐小屋 · 页面渲染（小屋 / 闯关 / 房间 / 装扮 / 老师）
   ========================================================= */
(function () {
  "use strict";
  var U4 = window.U4, DATA = U4.DATA;
  var util = U4.util, qs = util.qs, qsa = util.qsa, el = util.el;
  var actions = U4.actions, progress = U4.progress, tts = U4.tts, sfx = U4.sfx, fx = U4.fx;
  var modal = U4.modal;

  function starsStr(n, max) {
    max = max || 3;
    var s = "";
    for (var i = 0; i < max; i++) s += i < n ? "⭐" : "☆";
    return s;
  }
  function nextLevel() {
    for (var i = 0; i < DATA.levels.length; i++) {
      var l = DATA.levels[i];
      if (progress.levelStars(l.id) < 1 && progress.unlocked(l.id)) return l;
    }
    return DATA.levels[DATA.levels.length - 1];
  }
  function roomOf(id) { return DATA.rooms[id]; }

  /* =====================================================
     页面：小屋
     ===================================================== */
  function mapPage() {
    var stars = progress.totalStars();
    var lv = nextLevel();
    var done = 0;
    DATA.levels.forEach(function (l) { if (progress.levelStars(l.id) >= 1) done++; });
    var tiles = DATA.roomOrder.map(function (rid) {
      var r = roomOf(rid);
      return '<button class="room-tile" data-act="openRoom" data-room="' + rid + '" style="--tile-bg:' + r.tile + '" title="' + r.en + '">' +
        '<span class="rt-badge">' + r.words.length + " 词</span>" +
        '<span class="rt-emoji">' + r.emoji + "</span>" +
        '<span class="rt-name">' + r.zh + "</span>" +
        '<span class="rt-en">' + r.en + "</span></button>";
    }).join("");
    return '<div class="page">' +
      '<div class="page-head"><div><h2>🏡 欢迎来到快乐小屋</h2><p>' + DATA.unit.tagline + '</p></div>' +
      '<span class="pill-note">⭐ 已收集 ' + stars + " 颗星星 · 通关 " + done + "/" + DATA.levels.length + "</span></div>" +
      '<div class="home-grid">' +
      '<div class="house-card"><div class="house-roof"><span>🏠</span><span class="roof-title">Friendly House · 点一点房间</span><span>🏠</span></div>' +
      '<div class="house-grid">' + tiles + "</div></div>" +
      '<aside class="home-side">' +
      '<button class="continue-card" data-act="continueLevel">' +
      '<span class="cc-emoji">' + lv.emoji + '</span><span><span class="cc-title">继续闯关 · 第 ' + lv.id + " 关</span>" +
      '<span class="cc-sub">' + lv.title + " · " + lv.desc + '</span></span><span class="cc-go">▶</span></button>' +
      '<button class="side-card" data-act="goJourney"><span class="side-emoji">🗺️</span><span><span class="side-title">闯关地图</span><br><span class="side-sub">9 个关卡，对应教材 Lesson 1-8</span></span></button>' +
      '<button class="side-card" data-act="openStory" data-story="wishes"><span class="side-emoji">🐟</span><span><span class="side-title">故事屋</span><br><span class="side-sub">三个愿望 · 弗丽达找家</span></span></button>' +
      '<button class="side-card" data-act="goDecor"><span class="side-emoji">🎨</span><span><span class="side-title">我的小屋</span><br><span class="side-sub">用星星解锁家具，自己布置房间</span></span></button>' +
      '<div class="char-card" data-act="sayHi" title="点我和马特打招呼">' +
      '<span class="char-avatar">👦</span><div class="char-bubble"><b>Hi! I\'m Matt.</b><br>Let\'s learn English together!<br><span style="font-size:.78rem;color:#8A7566">点我打招呼</span></div></div>' +
      "</aside></div></div>";
  }

  /* =====================================================
     页面：闯关地图
     ===================================================== */
  function journeyPage() {
    var stars = progress.totalStars();
    var done = 0;
    DATA.levels.forEach(function (l) { if (progress.levelStars(l.id) >= 1) done++; });
    var rows = DATA.levels.map(function (l, i) {
      var st = progress.levelStars(l.id);
      var unlocked = progress.unlocked(l.id);
      var cls = st >= 1 ? "done" : (!unlocked ? "locked" : (nextLevel().id === l.id ? "current" : ""));
      return '<div class="j-row">' +
        '<button class="j-node ' + cls + '" data-act="startLevel" data-level="' + l.id + '" title="' + l.title + '">' +
        '<span class="jn-num">' + l.id + "</span>" +
        '<span class="jn-emoji">' + (unlocked ? l.emoji : "🔒") + "</span>" +
        (st > 0 ? '<span class="jn-stars">' + starsStr(st) + "</span>" : "") +
        "</button>" +
        '<div class="j-card ' + (unlocked ? "" : "locked") + '">' +
        "<div class='j-title'>" + l.title + "</div>" +
        "<div class='j-sub'>" + l.sub + "</div>" +
        "<div class='j-desc'>" + l.desc + "</div></div></div>";
    }).join("");
    var freeChips = DATA.freePlay.map(function (f, i) {
      return '<button class="chip" data-act="startFree" data-free="' + i + '"><span class="ce">' + f.emoji + "</span>" + f.label + "</button>";
    }).join("");
    return '<div class="page">' +
      '<div class="page-head"><div><h2>🗺️ 闯关地图</h2><p>跟着教材的 8 节课一路闯关，最后来一次大大的复习！</p></div>' +
      '<span class="pill-note">⭐ ' + stars + " 颗星星 · " + done + "/" + DATA.levels.length + " 关完成</span></div>" +
      '<div class="journey-wrap">' + rows + "</div>" +
      '<div class="free-play"><div class="section-title" style="margin:0">🎈 自由练习</div>' +
      '<p style="margin:.4rem 0 0;color:#8A7566;font-size:.9rem">想先玩哪个都可以，复习也计星星！</p>' +
      '<div class="free-chips">' + freeChips + "</div></div></div>";
  }

  /* =====================================================
     页面：房间探索
     ===================================================== */
  function roomPage(roomId) {
    var room = roomOf(roomId) || roomOf("bedroom");
    return '<div class="page room-page">' +
      '<div class="room-head"><div class="rh-title">' + room.emoji + " " + room.zh +
      ' <span class="rh-en">' + room.en + "</span></div>" +
      '<div class="row"><button class="btn btn-ghost" data-act="goMap">← 回小屋</button>' +
      '<button class="btn btn-primary" data-act="roomChallenge" data-room="' + room.id + '">🎯 听音找物</button></div></div>' +
      '<div class="room-tip">点一点房间里的东西，听听英语怎么说；点「听音找物」来玩小挑战！</div>' +
      U4.Games.roomStageHtml(room) +
      '<div class="room-toolbar">' +
      '<button class="btn btn-listen" data-act="roomIntro" data-room="' + room.id + '">🔊 听房间介绍</button>' +
      '<button class="btn btn-ghost" data-act="goMap">🏡 去别的房间</button></div></div>';
  }

  /* =====================================================
     页面：装扮小屋
     ===================================================== */
  function decorPage() {
    var stars = progress.totalStars();
    var placed = (U4.state.decor || []).map(function (d) {
      var item = DATA.decorItems.filter(function (x) { return x.id === d.id; })[0];
      if (!item) return "";
      return '<span class="placed" data-decor-id="' + d.id + '" style="left:' + d.x + "%;top:" + d.y + "%;font-size:" + (d.fs || 3) + 'rem">' +
        item.e + '</span>';
    }).join("");
    var tray = DATA.decorItems.map(function (item) {
      var unlocked = stars >= item.need;
      var added = (U4.state.decor || []).some(function (d) { return d.id === item.id; });
      return '<button class="sticker ' + (unlocked ? "" : "locked") + '" data-act="decorAdd" data-id="' + item.id + '" title="' + item.zh + '">' +
        item.e + (!unlocked ? '<span class="lock-cost">⭐' + item.need + "</span>" : (added ? '<span class="lock-cost" style="color:#2F9E77">已放入</span>' : "")) + "</button>";
    }).join("");
    return '<div class="page">' +
      '<div class="page-head"><div><h2>🎨 我的小屋</h2><p>用闯关得到的星星解锁家具，点一点贴纸，再拖动它摆到喜欢的位置！</p></div>' +
      '<span class="pill-note">⭐ ' + stars + " 颗星星</span></div>" +
      '<div class="decor-layout">' +
      '<div><div class="decor-room" id="decor-room">' +
      '<div class="dw-window"></div><div class="dw-bed">🛏️</div>' +
      (placed || '<div class="decor-hint">这里还空空的～<br>去闯关赚星星，把家具搬进来吧！</div>') +
      "</div>" +
      '<div class="decor-tools">' +
      '<button class="btn btn-ghost" data-act="decorUndo">↩️ 撤销</button>' +
      '<button class="btn btn-ghost" data-act="decorClear">🧹 清空</button>' +
      '<span class="decor-score">拖动家具可以改变位置，位置会自动保存</span></div></div>' +
      '<div class="decor-tray"><div class="section-title" style="margin-top:0">🧸 我的家具</div>' +
      '<div class="tray-grid">' + tray + "</div>" +
      '<p style="font-size:.82rem;color:#8A7566;line-height:1.5;margin:.8rem 0 0">灰色的还用不了哦，继续闯关赚星星⭐</p></div>' +
      "</div></div>";
  }

  /* =====================================================
     页面：老师 / 家长
     ===================================================== */
  var teacherTab = "kp";
  /* 供其他模块跳转到指定标签（如声音自检） */
  U4.teacherGo = function (id) { teacherTab = id || "kp"; U4.router.show("teacher"); };
  var T_TABS = [
    { id: "kp", label: "📚 知识清单" },
    { id: "map", label: "🗺️ 课程地图" },
    { id: "tips", label: "🧑‍🏫 教学建议" },
    { id: "data", label: "📊 学习数据" },
    { id: "settings", label: "⚙️ 设置" },
    { id: "about", label: "ℹ️ 关于" }
  ];

  function teacherPage() {
    var tabs = T_TABS.map(function (t) {
      return '<button class="t-tab ' + (teacherTab === t.id ? "active" : "") + '" data-act="teacherTab" data-tab="' + t.id + '">' + t.label + "</button>";
    }).join("");
    return '<div class="page teacher-page">' +
      '<div class="page-head"><div><h2>👩‍🏫 老师 / 家长</h2><p>PowerUp 0 · Unit 4 At home · 教学说明与学习数据</p></div>' +
      '<span class="pill-note">离线可用 · 无需登录</span></div>' +
      '<div class="tabs">' + tabs + "</div>" +
      '<div class="t-panel active">' + teacherPanel() + "</div>" +
      '<div class="teacher-foot">快乐小屋 Happy House · 对标 PowerUp 0 Unit 4 At home · 供课堂教学与家庭共学使用</div></div>';
  }

  function teacherPanel() {
    var T = DATA.teacher;
    if (teacherTab === "kp") {
      var objectives = T.objectives.map(function (o) { return "<li>" + o + "</li>"; }).join("");
      var tables = T.vocabTables.map(function (tb) {
        var rows = tb.rows.map(function (r) {
          return "<tr><td class='en-cell'>" + r.en + "</td><td class='ipa-cell'>" + (r.ipa || "") + "</td><td>" + r.zh + "</td></tr>";
        }).join("");
        return "<h4>" + tb.title + "</h4><table class='kp-table'><thead><tr><th>English</th><th>音标</th><th>中文</th></tr></thead><tbody>" + rows + "</tbody></table>";
      }).join("");
      var patterns = T.patterns.map(function (p) {
        return "<tr><td class='en-cell'>" + p.en + "</td><td>" + p.zh + "</td></tr>";
      }).join("");
      return '<div class="t-card"><h3>🎯 本单元学习目标</h3><ul>' + objectives + "</ul></div>" +
        '<div class="t-card"><h3>📖 词汇清单</h3><p>点击工具中的词卡可以听到发音，音标仅供老师参考。</p>' + tables + "</div>" +
        '<div class="t-card"><h3>💬 核心句型</h3><table class="kp-table"><thead><tr><th>English</th><th>中文</th></tr></thead><tbody>' + patterns + "</tbody></table></div>";
    }
    if (teacherTab === "map") {
      var rows = T.levelMap.map(function (r) {
        return "<tr><td>" + r.lesson + "</td><td><b>" + r.app + "</b></td><td>" + r.target + "</td></tr>";
      }).join("");
      return '<div class="t-card"><h3>🗺️ 教材 Lesson 与工具关卡对照</h3>' +
        '<table class="kp-table lv-table"><thead><tr><th>教材</th><th>工具中的活动</th><th>覆盖知识点</th></tr></thead><tbody>' + rows + "</tbody></table>" +
        '<p>💡 建议：新课当天玩对应关卡 1 次，第二天复习再玩 1 次；每关 5 题，约 3-5 分钟，适合课堂热身或分组学习角。</p></div>';
    }
    if (teacherTab === "tips") {
      var plans = T.plans.map(function (p) {
        return '<div class="t-card"><h3>🗒️ ' + p.title + "</h3><ul>" + p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>";
      }).join("");
      var diff = T.differentiation.map(function (d) {
        return '<div class="t-card"><h3>🌱 ' + d.group + "</h3><ul>" + d.tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>";
      }).join("");
      return "<div class='t-card'><h3>🧑‍🏫 一节课怎么用？</h3><p>下面两套方案都在真实幼儿园课堂里可直接照做；也适合家长陪玩。</p></div>" + plans + diff;
    }
    if (teacherTab === "data") {
      var levels = DATA.levels.map(function (l) {
        var st = progress.levelStars(l.id);
        var rec = U4.state.levels[String(l.id)];
        return "<tr><td>" + l.id + "</td><td>" + l.title + "</td><td>" + (st ? starsStr(st) : "—") + "</td><td>" +
          (rec && rec.total ? rec.correct + " / " + rec.total : "未记录") + "</td></tr>";
      }).join("");
      var skillKeys = Object.keys(U4.state.skills || {});
      var skillHtml = "";
      if (skillKeys.length) {
        skillHtml = skillKeys.map(function (k) {
          var s = U4.state.skills[k];
          var pct = s.total ? Math.round(s.correct / s.total * 100) : 0;
          return '<div class="progress-row"><span class="pr-label">' + k + '</span><div class="progress-bar"><i style="width:' + pct + '%"></i></div><span class="pr-val">' + s.correct + "/" + s.total + " · " + pct + "%</span></div>";
        }).join("");
      } else {
        skillHtml = '<p>还没有练习记录。完成任意关卡后，这里会自动统计各类知识点的正确率。</p>';
      }
      return '<div class="t-card"><h3>📊 本机学习数据</h3>' +
        '<p>⭐ 累计星星：<b>' + progress.totalStars() + '</b> 颗 · 已通关：<b>' +
        DATA.levels.filter(function (l) { return progress.levelStars(l.id) >= 1; }).length + "/" + DATA.levels.length + "</b></p>" +
        "<h4>知识点正确率（累计）</h4>" + skillHtml + "</div>" +
        '<div class="t-card"><h3>🚩 各关卡记录</h3><table class="kp-table"><thead><tr><th>关卡</th><th>名称</th><th>最好成绩</th><th>答对 / 总题</th></tr></thead><tbody>' + levels + "</tbody></table>" +
        '<p>数据仅保存在本机浏览器，不会上传。换设备或清除浏览器缓存后会重新开始。</p></div>';
    }
    if (teacherTab === "settings") {
      var soundOn = U4.state.sound !== false;
      var musicOn = U4.state.music !== false;
      var vs = U4.tts.status();
      var okVoice = vs.supported && vs.voices > 0;
      var diag = '<div class="diag-line"><span>浏览器语音合成</span><b class="' + (vs.supported ? "diag-ok" : "diag-bad") + '">' + (vs.supported ? "✅ 支持" : "❌ 不支持") + "</b></div>" +
        '<div class="diag-line"><span>可用声音</span><b class="' + (vs.voices ? "diag-ok" : "diag-bad") + '">' + vs.voices + " 个（英语 " + vs.en + " · 中文 " + vs.zh + "）</b></div>" +
        '<div class="diag-line"><span>首选声音</span><b>' + (vs.enVoice || "—") + " / " + (vs.zhVoice || "—") + "</b></div>" +
        '<div class="diag-line"><span>预录英语配音</span><b class="' + (vs.clips ? "diag-ok" : "diag-bad") + '">' + (vs.clips ? vs.clips + " 条（不依赖系统语音包，推荐）" : "未加载") + "</b></div>" +
        '<div class="diag-line"><span>最近朗读</span><b class="' + (vs.starts ? "diag-ok" : "diag-bad") + '">' + (vs.starts ? "已成功开始 " + vs.starts + " 次" : (vs.lastError ? "出错：" + vs.lastError : "还没有开始过")) + "</b></div>" +
        '<div class="row-btns"><button class="btn btn-listen" data-act="testVoiceEn">🔊 测英语</button>' +
        '<button class="btn btn-ghost" data-act="testVoiceZh">🔊 测中文</button>' +
        '<button class="btn btn-mint" data-act="voiceCheck">🔄 重新检测</button></div>' +
        (okVoice ? "" : '<div class="diag-tip"><b>没有检测到语音包：</b>Mac：系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音，下载「Samantha（英语）」和「婷婷（中文）」；Windows：设置 → 时间和语言 → 语言 → 添加「英语(美国)」并安装语音包；iPad / 安卓：在系统设置里下载英语语音。</div>') +
        '<div class="diag-tip">如果点「测英语」仍没有声音：① 把电脑 / 平板音量调到 50% 以上；② 在浏览器标签页上右键，取消「静音网站」；③ iPad / iPhone 先点一下页面再播放；④ 换 Chrome 或 Safari 浏览器试试。</div>';
      return '<div class="t-card"><h3>🔊 语音自检</h3><p>点开页面后应该能听到欢迎语和单词发音。如果听不到，先在这里检查一下：</p>' + diag + "</div>" +
        '<div class="t-card"><h3>⚙️ 声音与语音</h3>' +
        '<div class="setting-row"><div><div class="sr-label">音效与语音</div><div class="sr-sub">关闭后所有英语发音和游戏音效都会静音</div></div>' +
        '<button class="switch ' + (soundOn ? "on" : "") + '" data-act="toggleSound" aria-label="音效开关"></button></div>' +
        '<div class="setting-row"><div><div class="sr-label">背景音乐</div><div class="sr-sub">轻柔的钢琴小品，可在课堂上关闭</div></div>' +
        '<button class="switch ' + (musicOn ? "on" : "") + '" data-act="toggleMusic" aria-label="音乐开关"></button></div>' +
        '<div class="setting-row"><div><div class="sr-label">试一试英语发音</div><div class="sr-sub">听到 Hello 说明英语语音正常</div></div>' +
        '<button class="btn btn-listen" data-act="testVoiceEn">🔊 Hello! I\'m Matt.</button></div>' +
        '<div class="setting-row"><div><div class="sr-label">试一试中文语音</div><div class="sr-sub">中文提示音</div></div>' +
        '<button class="btn btn-ghost" data-act="testVoiceZh">🔊 欢迎来到快乐小屋</button></div></div>' +
        '<div class="t-card"><h3>🧹 清除学习进度</h3><p>会清空星星、关卡记录和装扮小屋的布置，适合换一个班级或重新开始。</p>' +
        '<button class="btn btn-ghost" data-act="resetProgress" style="color:#C04A3B">清除全部进度</button></div>' +
        '<div class="t-card"><h3>🖥️ 大屏使用小贴士</h3><ul>' +
        "<li>Mac 按 ⌃⌘F 全屏，Windows 按 F11；建议浏览器缩放 100%。</li>" +
        "<li>先用「小屋」点词卡带读，再打开「闯关」集体作答。</li>" +
        "<li>投影时如果声音太小，可把系统音量调大；语音速度在 0.7-0.9 之间最适合幼儿。</li></ul></div>";
    }
    // about
    return '<div class="t-card"><h3>ℹ️ 关于这个工具</h3><ul>' +
      T.about.map(function (a) { return "<li>" + a + "</li>"; }).join("") + "</ul></div>" +
      '<div class="t-card"><h3>🧩 内容来源</h3><p>词汇、句型、故事与自然拼读内容整理自老师提供的 PowerUp 0 Unit 4 At home 课件（Lesson 1-8）；故事文本为适合 4-6 岁幼儿课堂使用的简化改编版，保留了教材人物、核心词汇与情感主题。</p>' +
      '<p>版本：1.1 · 单文件离线网页 · 无需联网 · 数据保存在本机 · 新增语音自检</p></div>';
  }

  /* =====================================================
     装扮小屋的拖拽
     ===================================================== */
  function bindDecorDrag() {
    var room = qs("#decor-room");
    if (!room) return;
    var dragId = null;
    function itemOf(id) {
      return (U4.state.decor || []).filter(function (d) { return d.id === id; })[0];
    }
    function onDown(e) {
      var p = e.target.closest ? e.target.closest(".placed") : null;
      if (!p) return;
      if (e.target.classList.contains("rm")) return;
      e.preventDefault();
      dragId = p.getAttribute("data-decor-id");
      try { p.setPointerCapture(e.pointerId); } catch (err) { }
    }
    function onMove(e) {
      if (!dragId) return;
      var r = room.getBoundingClientRect();
      var x = util.clamp(((e.clientX - r.left) / r.width) * 100, 5, 95);
      var y = util.clamp(((e.clientY - r.top) / r.height) * 100, 6, 94);
      var item = itemOf(dragId);
      if (item) { item.x = Math.round(x * 10) / 10; item.y = Math.round(y * 10) / 10; }
      var node = room.querySelector('[data-decor-id="' + dragId + '"]');
      if (node) { node.style.left = x + "%"; node.style.top = y + "%"; }
    }
    function onUp() {
      if (!dragId) return;
      dragId = null;
      U4.save();
      sfx("tap");
    }
    room.addEventListener("pointerdown", onDown);
    room.addEventListener("pointermove", onMove);
    room.addEventListener("pointerup", onUp);
    room.addEventListener("pointercancel", onUp);
  }
  document.addEventListener("screen:shown", function (e) {
    if (e.detail.name === "decor") bindDecorDrag();
  });

  /* =====================================================
     页面动作
     ===================================================== */
  actions.openRoom = function (t) {
    sfx("tap");
    U4.router.show("room", t.getAttribute("data-room"));
  };
  actions.goMap = function () { U4.router.show("map"); };
  actions.goJourney = function () { U4.router.show("journey"); };
  actions.goDecor = function () { U4.router.show("decor"); };
  actions.continueLevel = function () { U4.startLevel(nextLevel()); };
  actions.startLevel = function (t) {
    var id = parseInt(t.getAttribute("data-level"), 10);
    var lv = DATA.levels.filter(function (l) { return l.id === id; })[0];
    if (!lv) return;
    if (!progress.unlocked(id)) {
      sfx("wrong");
      fx.toast("先完成第 " + (id - 1) + " 关，才能解锁哦～");
      return;
    }
    U4.startLevel(lv);
  };
  actions.startFree = function (t) {
    var i = parseInt(t.getAttribute("data-free"), 10);
    var f = DATA.freePlay[i];
    if (f) U4.startFree(f);
  };
  actions.roomChallenge = function (t) {
    var roomId = t.getAttribute("data-room");
    U4.startRoomFind(roomId, {
      skill: "家具词汇",
      onContinue: function () { U4.router.show("room", roomId); },
      onClose: function () { U4.router.show("room", roomId); }
    });
  };
  actions.roomIntro = function (t) {
    var room = roomOf(t.getAttribute("data-room"));
    if (!room) return;
    tts.seq([{ text: room.zh, lang: "zh-CN" }, { text: room.intro.en, lang: "en-US" }]);
  };
  actions.sayHi = function () {
    sfx("pop");
    tts.seq([
      { text: "Hi! I'm Matt. Let's learn English together!", lang: "en-US" },
      { text: "你好！我是马特，我们一起学英语吧！", lang: "zh-CN" }
    ]);
  };
  actions.openStory = function (t) {
    sfx("tap");
    U4.Stories.open(t.getAttribute("data-story") || "wishes", null);
  };
  actions.teacherTab = function (t) {
    teacherTab = t.getAttribute("data-tab") || "kp";
    sfx("page");
    U4.router.refresh();
  };
  actions.toggleSound = function () {
    U4.audio.setSound(!(U4.state.sound !== false));
    U4.router.refresh();
  };
  actions.toggleMusic = function () {
    U4.state.music = !(U4.state.music !== false);
    U4.save();
    if (U4.state.music) U4.audio.startMusic();
    else U4.audio.stopMusic();
    sfx("pop");
    U4.router.refresh();
  };
  function refreshVoicePanel() {
    setTimeout(function () {
      if (U4.router.current() === "teacher") U4.router.refresh();
    }, 1500);
  }
  actions.testVoiceEn = function () {
    txtTest("Hello! I'm Matt. Let's learn English!", "en-US");
    refreshVoicePanel();
  };
  actions.testVoiceZh = function () {
    txtTest("欢迎来到快乐小屋！", "zh-CN");
    refreshVoicePanel();
  };
  function txtTest(text, lang) {
    var ok = U4.tts.speak(text, { lang: lang, rate: lang === "zh-CN" ? 0.95 : 0.8 });
    if (!ok) fx.toast("语音没有打开：请检查上面的「音效与语音」开关");
  }
  actions.voiceCheck = function () {
    var st = U4.tts.refresh();
    U4.router.refresh();
    if (!st.supported) fx.toast("这个浏览器不支持语音朗读，请换 Chrome / Safari");
    else if (st.voices === 0) fx.toast("还是没有检测到语音包，请按下面的方法安装");
    else if (st.starts > 0) fx.toast("语音正常 ✅ 已经成功朗读 " + st.starts + " 次");
    else fx.toast("检测到 " + st.voices + " 个声音，请点「测英语」试一下");
  };

  /* 装扮动作 */
  actions.decorAdd = function (t) {
    var id = t.getAttribute("data-id");
    var item = DATA.decorItems.filter(function (x) { return x.id === id; })[0];
    if (!item) return;
    var stars = progress.totalStars();
    if (stars < item.need) {
      sfx("wrong");
      fx.toast("再得 " + (item.need - stars) + " 颗星星就能解锁「" + item.zh + "」啦！");
      return;
    }
    if ((U4.state.decor || []).some(function (d) { return d.id === id; })) {
      tts.sayEn(item.en, { rate: 0.7 });
      fx.toast("已经在小屋里啦，拖动它试试～");
      return;
    }
    var n = (U4.state.decor || []).length;
    U4.state.decor = U4.state.decor || [];
    U4.state.decor.push({ id: id, x: 22 + (n % 4) * 19, y: 40 + Math.floor(n / 4) * 17, fs: 3 });
    U4.save();
    sfx("pop");
    tts.sayEn(item.en, { rate: 0.7 });
    U4.router.refresh();
  };
  actions.decorUndo = function () {
    if (!(U4.state.decor || []).length) { fx.toast("还没有放家具哦～"); return; }
    U4.state.decor.pop();
    U4.save();
    sfx("page");
    U4.router.refresh();
  };
  actions.decorRemove = function (t) {
    var id = t.getAttribute("data-id");
    U4.state.decor = (U4.state.decor || []).filter(function (d) { return d.id !== id; });
    U4.save();
    sfx("page");
    U4.router.refresh();
  };
  actions.decorClear = function () {
    modal.open('<div style="text-align:center"><div style="font-size:3rem">🧹</div>' +
      '<div style="font-size:1.3rem;font-weight:900;margin:.3rem 0">要清空小屋吗？</div>' +
      '<p style="color:#8A7566">家具会全部收起来，星星不会减少。</p>' +
      '<div class="wc-actions"><button class="btn btn-ghost" data-act="modalClose">再想想</button>' +
      '<button class="btn btn-primary" data-act="decorClearYes">清空</button></div></div>');
  };
  actions.decorClearYes = function () {
    U4.state.decor = [];
    U4.save();
    modal.close(true);
    sfx("page");
    U4.router.refresh();
  };
  actions.resetProgress = function () {
    modal.open('<div style="text-align:center"><div style="font-size:3rem">⚠️</div>' +
      '<div style="font-size:1.3rem;font-weight:900;margin:.3rem 0">清除全部学习进度？</div>' +
      '<p style="color:#8A7566">星星、关卡记录和我的小屋都会清空，无法恢复。</p>' +
      '<div class="wc-actions"><button class="btn btn-ghost" data-act="modalClose">取消</button>' +
      '<button class="btn btn-primary" data-act="doReset" style="background:linear-gradient(180deg,#FF8A7A,#D4553F)">确认清除</button></div></div>');
  };
  actions.doReset = function () {
    progress.reset();
    modal.close(true);
    fx.toast("进度已清除，可以重新开始啦！");
    U4.router.refresh();
  };

  /* =====================================================
     导出页面
     ===================================================== */
  U4.PAGES = {
    map: mapPage,
    journey: journeyPage,
    room: roomPage,
    decor: decorPage,
    teacher: teacherPage
  };
})();
