# きゃろってぃー公式サイト 実装ルール

## ボタンの色変化

- ボタンのホバー・フォーカス時に背景色、枠線色、文字色、影色を変更する場合、変化の開始タイミングを必ず揃える。
- `background-color`、`border-color`、`color`、`box-shadow`には同一の`transition-duration`と`transition-timing-function`を指定し、個別の`transition-delay`は設定しない。
- 一部の色だけ先に、または遅れて変わる演出は使用しない。
- タッチ端末では疑似ホバー色を残さない。タップ終了後に必ず通常デザインへ戻るよう、`hover: none`または`pointer: coarse`向けの状態を定義する。

## モバイルページの基準

- HOME以外の各ページも、HOMEと同じ画面幅、左右余白、下端余白、フッターの配置基準に揃える。
- 長文を含むカードでは固定の`word-break: keep-all`による横はみ出しを発生させず、カード幅と画像比率を端末幅の内側に収める。
