# 无名之旅

HTML5 Canvas 横版像素 RPG(电脑端)。在线玩:https://jiadaoqing-dot.github.io/wuming-zhilv/

- `src/parts/`:源码(按系统 / 关卡分成小文件,按序号拼起来就是完整游戏;图片 / 音频用 `@@A:名字@@` 等占位),`assets/`:图集 / 音效,`art_src/`:素材生成脚本
- `python tools/build.py`:拼成单文件 `out/无名之旅_v版本.html`(素材全部内嵌,可以离线直接打开),并更新根目录 `index.html`(分享版:素材引用 `assets/` 里的文件,要通过网页服务器打开,例如 GitHub Pages)
- 美术 / 音乐素材的作者和授权见游戏「设置 → 美术致谢」和 `docs/素材清单.txt`
