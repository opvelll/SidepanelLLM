# Chrome Extension - Chrome AI Chat

Chrome のサイドバーでAI Chatができるようになるプラグインです。現在開発中α版。OpenAIのAPIのみ対応。

他にも似たような拡張機能もありますし、OpenAIもデスクトップ版など出していて、この拡張を作る意味もあまりないのですが、
APIキー使用料金のみ支払いたいというのと、APIを直接触ってみたいので作成しました。

![sidepanel](<doc/スクリーンショット 2024-06-02 143002.png>)

### 使うのに必要なもの

* OpenAIのAPIキーとその使用料金

### 現在できること

* 画面上でドラッグした部分をボタンで挿入
* 動画の字幕情報をボタンで挿入
* 画面全体の文字情報をボタンで挿入
* 画面のスクリーンショットをボタンで挿入
* 簡単なPromptをボタンで挿入

### できないこと

* 動画とかpdfの読み込み
* 音声関連の機能
* GoogleのGeminiなど他のAIの使用
* 履歴機能

等々

### 使用ライブラリ
Chrome Extension Boilerplate with
React + Vite + TypeScript 
https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

## 使い方

1. 拡張機能をいれる

2. 拡張のボタンを右クリック、オプションを開く
![option](doc/option_view.png)

3. オプションのAPI KeyにOpen AIで発行したAPIキーを設定する。キーの盗難に備え、APIキーには上限を設定することをお勧めします。


## 画面のボタン

画面下のフォームからチャットができます。
フォーム上部のボタンを押すと、現在開いているタブから情報をフォームに埋め込むことができます。
ボタンは左から、選択部分、Youtube動画の字幕情報、ページ全体のテキスト情報、スクリーンショットを取得できます。

## 開発

