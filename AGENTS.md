# きゃろってぃー公式サイト 実装ルール

## ボタンの色変化

- ボタンのホバー・フォーカス時に背景色、枠線色、文字色、影色を変更する場合、変化の開始タイミングを必ず揃える。
- `background-color`、`border-color`、`color`、`box-shadow`には同一の`transition-duration`と`transition-timing-function`を指定し、個別の`transition-delay`は設定しない。
- 一部の色だけ先に、または遅れて変わる演出は使用しない。
