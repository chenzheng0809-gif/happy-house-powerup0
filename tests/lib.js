window.U4TestLib = {
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
  waitReady(W, timeout) {
    timeout = timeout || 15000;
    return new Promise((res, rej) => {
      const t0 = Date.now();
      (function poll() {
        if (W.__U4_READY__ === true) return res();
        if (Date.now() - t0 > timeout) return rej(new Error("timeout waiting __U4_READY__"));
        setTimeout(poll, 60);
      })();
    });
  }
};
