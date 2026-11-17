window.U4TestSuite = {
  async run(W) {
    const sleep = U4TestLib.sleep;
    const out = { steps: [], pass: 0, fail: 0, errors: [] };
    const ok = (name, cond, extra) => {
      const pass = !!cond;
      out.steps.push({ name, pass, extra: extra === undefined ? "" : String(extra) });
      if (pass) out.pass++; else out.fail++;
    };
    await U4TestLib.waitReady(W);
    const D = W.document;
    const U4 = W.U4;
    const q = (s) => D.querySelector(s);
    const qa = (s) => Array.from(D.querySelectorAll(s));
    try { W.localStorage.clear(); } catch (e) { }

    // 1) splash & home
    await sleep(300);
    ok("app ready flag", W.__U4_READY__ === true);
    ok("boot error hidden", q("#boot-error").classList.contains("hidden"));
    ok("splash visible", !!q("#splash") && !q("#splash").classList.contains("hidden"));
    q("#btn-splash-start").click();
    await sleep(800);
    ok("app visible", !q("#app").classList.contains("hidden"));
    ok("map active", q("#screen-map").classList.contains("active"));
    ok("5 room tiles", qa(".room-tile").length === 5, qa(".room-tile").length);
    ok("continue card", !!q(".continue-card"));
    ok("initial stars 0", q("#star-count").textContent === "0", q("#star-count").textContent);

    // 2) room explore
    qa(".room-tile")[0].click();
    await sleep(500);
    ok("room screen active", q("#screen-room").classList.contains("active"));
    ok("bedroom hotspots = 5", qa("#screen-room .hotspot").length === 5, qa("#screen-room .hotspot").length);
    ok("room window drawn", qa("#screen-room .room-window").length === 1);
    qa("#screen-room .hotspot")[0].click();
    await sleep(600);
    const wc = q(".word-card .wc-en");
    ok("word card opens", !!wc, wc ? wc.textContent : "");
    ok("word card sentence", !!q(".word-card .wc-sentence"));
    const closeBtn = q('.word-card [data-act="modalClose"]');
    if (closeBtn) closeBtn.click();
    else q(".modal-backdrop").click();
    await sleep(250);

    // 3) journey
    U4.router.show("journey");
    await sleep(400);
    ok("9 journey nodes", qa(".j-node").length === 9, qa(".j-node").length);
    ok("level2 locked at start", qa(".j-node")[1].classList.contains("locked"));
    ok("6 free play chips", qa("[data-act='startFree']").length === 6);

    // 4) level 1 room find
    U4.startLevel(U4.DATA.levels[0]);
    await sleep(800);
    ok("roomfind shell", !!q(".game-shell"));
    ok("roomfind hotspots 5", qa(".game-shell .hotspot").length === 5, qa(".game-shell .hotspot").length);
    let played = 0, miss = 0;
    for (let i = 0; i < 4; i++) {
      const capEl = q(".game-shell .stage-caption");
      const cap = capEl ? capEl.textContent : "";
      const m = /Where is the (.+?)\?/.exec(cap);
      if (!m) break;
      const btn = qa(".game-shell .hotspot").filter(h => h.getAttribute("aria-label") === m[1])[0];
      if (!btn) { miss++; break; }
      btn.click();
      played++;
      await sleep(2100);
    }
    ok("roomfind 4 rounds played", played === 4, played);
    ok("roomfind target matched", miss === 0);
    await sleep(600);
    ok("result after level1", !!q(".result-card"), (q(".result-title") || {}).textContent);
    ok("level1 stars", U4.progress.levelStars(1) >= 1, U4.progress.levelStars(1));
    const cont = q('[data-act="resultContinue"]');
    if (cont) cont.click();
    await sleep(700);
    ok("back on journey", q("#screen-journey").classList.contains("active"));
    ok("level2 unlocked", U4.progress.unlocked(2) === true);
    ok("total stars > 0", U4.progress.totalStars() > 0, U4.progress.totalStars());

    // 5) level 2 quiz play
    async function playQuizRound() {
      for (let k = 0; k < 10; k++) {
        const opts = qa(".game-options .opt:not(.ghosted)");
        if (!opts.length) { await sleep(250); continue; }
        opts[0].click();
        await sleep(320);
        if (q(".game-options .opt.correct")) return true;
      }
      return false;
    }
    U4.startLevel(U4.DATA.levels[1]);
    await sleep(700);
    ok("quiz shell", !!q(".game-shell"));
    ok("quiz 5 dots", qa(".game-shell .g-dot").length === 5, qa(".game-shell .g-dot").length);
    for (let r = 0; r < 5; r++) { await playQuizRound(); await sleep(1700); }
    await sleep(900);
    ok("quiz result", !!q(".result-card"), (q(".result-title") || {}).textContent);
    const cont2 = q('[data-act="resultContinue"]');
    if (cont2) cont2.click();
    await sleep(600);
    ok("level2 stars", U4.progress.levelStars(2) >= 1, U4.progress.levelStars(2));

    // 6) all level types start
    for (const id of [3, 4, 6, 8, 9]) {
      U4.startLevel(U4.DATA.levels[id - 1]);
      await sleep(600);
      ok("level " + id + " starts", !!q(".game-shell") && qa(".game-options .opt").length > 0, "opts=" + qa(".game-options .opt").length);
      U4.Games.close(true);
      await sleep(250);
    }

    // 7) story wishes
    U4.Stories.open("wishes");
    await sleep(600);
    ok("story overlay", !!q(".storybook"));
    let storyDone = false;
    for (let p = 0; p < 26; p++) {
      if (q(".game-shell")) { storyDone = true; break; }
      const dots = qa(".sb-dot");
      const idx = dots.findIndex(d => d.classList.contains("on"));
      const page = U4.Stories.data.wishes.pages[idx];
      if (page && page.type === "choices") {
        qa(".sb-choice:not(.done)").forEach(b => b.click());
        await sleep(500);
      }
      if (page && page.type === "ask") {
        const btn = q('[data-act="storyAsk"][data-ans="' + (page.answer ? "yes" : "no") + '"]');
        if (btn) btn.click();
        await sleep(500);
      }
      const next = q('[data-act="storyNext"]');
      if (!next) break;
      next.click();
      await sleep(700);
    }
    ok("wishes story -> quiz", storyDone || !!q(".game-shell"));
    U4.Games.close(true);
    await sleep(300);
    U4.modal.close(true);

    // 8) frida story
    U4.Stories.open("frida");
    await sleep(500);
    ok("frida story overlay", !!q(".storybook"));
    const sc = q('[data-act="storyClose"]');
    if (sc) sc.click();
    await sleep(400);

    // 9) teacher panel
    U4.router.show("teacher");
    await sleep(500);
    for (let i = 0; i < 6; i++) {
      const tab = qa(".t-tab")[i];
      if (!tab) break;
      tab.click(); await sleep(300);
      const panel = q(".t-panel");
      ok("teacher tab " + i, !!panel && panel.textContent.length > 120, panel ? panel.textContent.length : 0);
    }
    qa(".t-tab")[3].click(); await sleep(300);
    ok("data tab skill bars", qa(".progress-row").length > 0, qa(".progress-row").length);

    // 10) decor
    U4.router.show("decor");
    await sleep(500);
    ok("12 stickers", qa(".sticker").length === 12, qa(".sticker").length);
    const unlocked = qa(".sticker:not(.locked)");
    ok("some stickers unlocked", unlocked.length > 0, unlocked.length);
    if (unlocked.length) { unlocked[0].click(); await sleep(600); }
    ok("sticker placed in room", qa(".decor-room .placed").length >= 1, qa(".decor-room .placed").length);
    ok("decor saved in state", Array.isArray(U4.state.decor) && U4.state.decor.length >= 1, (U4.state.decor || []).length);

    // 11) persistence & errors
    try { ok("localStorage saved", !!W.localStorage.getItem("happy_house_u4_v1")); } catch (e) { out.errors.push("localStorage: " + e); }
    ok("boot error hidden at end", q("#boot-error").classList.contains("hidden"));
    out.navCount = qa(".tab").length;
    return out;
  }
};
