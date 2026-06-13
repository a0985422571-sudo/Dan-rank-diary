# 第五人格排位降溫日記

一個給排位紅溫時使用的小型單頁日記工具。  
可以記錄當天排位情緒、快速發洩、保存歷史紀錄，並附帶雷包射擊場與換裝艾瑪互動區。

## 目前功能

- 排位降溫日記：日期、主日記、心情複選、紅溫值、最雷目標、冷靜度、給自己一句話。
- 快速填入與主日記模板：一鍵帶入常用情境。
- 發洩按鈕：💩 大便噴射、🙄💅 白眼噴射，可短按或長按連續噴射。
- 歷史紀錄：把當天內容存成正式紀錄，可展開、載入、刪除。
- 匯出與分享：複製文字、下載 txt、截圖分享。
- 雷包射擊場：切換標靶、射擊樣式、音效、爆擊、紅溫同步。
- 換裝艾瑪：切換服裝、餵食、摸摸頭與小互動。

## 使用方式

直接打開 `index.html` 即可使用。  
如果部署到 GitHub Pages，也可以直接用瀏覽器開啟頁面。

資料會存在瀏覽器的 `localStorage`，不會自動同步到雲端。換裝與標靶匯入圖片也會存在本機瀏覽器中。

## 圖片與素材放置

目前 `index.html` 預設從專案根目錄讀取圖片與影片。請把素材放在跟 `index.html` 同一層。

### 日記完成動畫

- `red_lady_diary_complete.png`
- `red_lady_diary_complete_02.png`
- `red_lady_diary_complete_03.png`
- `red_lady_diary_complete_04.png`

### 紅蝶加油動畫

- `red_butterfly.mp4`

### 雷包射擊場標靶

- `target_01.png`
- `target_02.png`
- `target_03.png`

### 射擊樣式素材

- `edamame_mode.png`
- `bigedamame_mode.png`
- `mist_blade_mode.png`

### 律師告你青蛙動畫

- `green_frog1.png`
- `green_frog2.png`
- `green_frog3.png`
- `green_frog4.png`
- `green_frog5.png`
- `green_frog6.png`
- `green_frog7.png`

### 換裝艾瑪

- `doll_base.png`
- `doll_base_shy.png`
- `outfit_green_adventurer.png`
- `outfit_blue_lolita.png`

## v0.4 小整理

- 新增 README，整理專案用途、功能與素材放置方式。
- 明確記錄目前圖片路徑採用「根目錄」版本，避免素材放錯資料夾。
- 保留原本單檔 HTML 架構，不拆檔、不改主要功能。

## 備註

這是一個偏情緒整理與自娛用的小工具，不是正式資料庫。  
重要日記可以用「匯出文字」另外備份。