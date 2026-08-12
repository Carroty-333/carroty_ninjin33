# きゃろってぃー Official Site

VTuber「きゃろってぃー(喫茶Carrolバリスタ)」の公式プロフィールサイト。

- 公開URL: https://Carroty-333.github.io/carroty_ninjin33/
- 構成: 静的HTML/CSS/JS(ビルド不要、GitHub Pagesでそのまま配信)

## 構成

```
index.html        全タブ(HOME/Profile/FA Gallery/Guideline/Commission/Contact)を内包
css/style.css      スタイル(カラーパレット・レスポンシブ・アニメーション)
js/script.js       タブ切替・ハンバーガーメニュー・FA Gallery自動読み込み・ライトボックス
assets/images/     サイト共通素材
assets/gallery/    FA Gallery表示用画像(ここに画像を追加するだけで自動的にギャラリーに反映されます)
```

## FA Galleryへの画像追加方法

1. GitHub上でこのリポジトリの `assets/gallery/` フォルダを開く
2. 「Add file」→「Upload files」で画像をアップロードしてコミット
3. ファイル名を `タイトル-by-絵師名.jpg` の形式にすると、ギャラリー上にクレジット表示されます(例: `2026-halloween-by-paipukoron.jpg`)
4. コーディング不要。数分でサイトに反映されます(GitHub Contents APIを利用して一覧を自動取得しています)

## Contactフォームについて

Contactタブのフォームは、Tally.so等の外部フォームサービスをNotion「お問い合わせ」データベースに連携する形で今後埋め込み予定です。埋め込みコードが発行され次第 `index.html` の `#contactFormEmbed` 部分に追加してください。
