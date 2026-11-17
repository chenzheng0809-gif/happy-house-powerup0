/* =========================================================
   快乐小屋 · 启动与全局导航
   ========================================================= */
(function () {
  "use strict";
  var U4 = window.U4;
  if (!U4 || !U4.DATA) return;
  var util = U4.util;

  function bind() {
    // 顶部：logo 回小屋
    util.on(util.qs("#btn-brand"), "click", function () { U4.sfx("tap"); U4.router.show("map"); });
    // 星星 → 装扮小屋
    util.on(util.qs("#star-pill"), "click", function () { U4.sfx("tap"); U4.router.show("decor"); });
    // 声音总开关
    util.on(util.qs("#btn-sound"), "click", function () {
      U4.audio.setSound(!(U4.state.sound !== false));
    });
    // 老师面板
    util.on(util.qs("#btn-teacher"), "click", function () { U4.sfx("tap"); U4.router.show("teacher"); });
    // 底部标签
    util.qsa(".tab").forEach(function (t) {
      util.on(t, "click", function () {
        var tab = t.getAttribute("data-tab");
        if (U4.router.current() === tab) return;
        U4.sfx("tap");
        U4.router.show(tab);
      });
    });
    // 激活音频（任意第一次交互）
    document.addEventListener("pointerdown", function once() {
      try { U4.audio.unlock(); } catch (e) { }
      document.removeEventListener("pointerdown", once);
    });
    // 键盘快捷键：1-4 切换页面（方便老师用投影键盘）
    document.addEventListener("keydown", function (e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "1") U4.router.show("map");
      else if (e.key === "2") U4.router.show("journey");
      else if (e.key === "3") U4.router.show("decor");
      else if (e.key === "4") U4.router.show("teacher");
    });
  }

  function start() {
    U4.ui.starCount();
    U4.ui.soundIcon();
    U4.boot();
    bind();
    window.__U4_READY__ = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
