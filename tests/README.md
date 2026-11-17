# 自动化冒烟测试（可选）

用无头 Chrome 跑一遍全部页面的关键交互，共 50 项断言：

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --no-sandbox --allow-file-access-from-files \
  --user-data-dir=/tmp/u4prof --virtual-time-budget=180000 --dump-dom \
  "file://$(pwd)/tests/autotest.html" | grep -o "<title>[^<]*</title>"
# 期望输出：<title>U4TEST PASS=50 FAIL=0</title>
```

- `autotest.html` / `suite.js`：把 `index.html` 放进 iframe，自动完成：进入小屋、点房间和词卡、闯第 1/2 关、打开全部关卡、走完《三个愿望》故事、切换老师面板 6 个标签、装扮小屋、检查存档。
- `shot.html`：截图用页面，支持参数：`?mode=screen&screen=map`、`?mode=room&room=bedroom`、`?mode=level&id=2`、`?mode=story`，可加 `&seed=1` 注入演示进度。
- `../screenshots/` 内是 1440×900 的实际界面截图（含 1 张竖屏）。
