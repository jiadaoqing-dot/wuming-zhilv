#!/bin/sh
# 下载美术素材源(只需要在新环境里重新生成素材时用)。shell 只能访问 GitHub:
#  · 普通文件:git clone --filter=blob:none --sparse 后 sparse-checkout 需要的目录
#  · Git LFS 文件(jam-ready-assets 仓库):git lfs pull 会卡住,改用 https://media.githubusercontent.com/media/<仓库>/main/<路径> 直接下载
# 用法:sh tools/fetch_assets.sh <目标目录>
set -e
D=${1:-ext};mkdir -p "$D";cd "$D"
# 1) ULPC(主角 / NPC 的 LPC 图层)
[ -d ulpc ] || git clone -q --depth 1 --filter=blob:none --sparse https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator.git ulpc
(cd ulpc && git sparse-checkout set --no-cone "/sheet_definitions/" "/palette_definitions/" && git ls-tree -r --name-only HEAD spritesheets > ../ulpc_files.txt)
# 2) jam-ready-assets(CC0 素材合集:Kenney、ansimuz、Foozle、Alex's Assets 等;每个包有 License.txt 写明 SPDX 和原始出处)
[ -d jra ] || git clone -q --depth 1 --filter=blob:none --no-checkout https://github.com/series-ai/jam-ready-assets.git jra
cd jra
PACKS="16x16-rpg-item-pack kenney-ui-pack-pixel-adventure kenney-fantasy-ui-borders foozle-lucifer-rpg-ui foozle-lucifer-equipment ansimuz-sunnyland/2D/platformer/environment grafxkid-seasonal-tilesets ansimuz-gothicvania-collection/2D/fantasy/night-town-background-files"
git sparse-checkout init --no-cone;git sparse-checkout set --no-cone $(for p in $PACKS;do echo "/$p/";done) "/*/*/*/License.txt" "/*/*/License.txt";git checkout -q
grep -rl "^version https://git-lfs" $(for p in $PACKS;do echo $p;done) 2>/dev/null | while read f;do curl -sS -m 60 -L -o "$f" "https://media.githubusercontent.com/media/series-ai/jam-ready-assets/main/$(echo "$f"|sed 's/ /%20/g')";done
echo done
