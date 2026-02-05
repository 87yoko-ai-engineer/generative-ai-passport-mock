## 🔗 デモURL（Vercel）

https://generative-ai-passport-mock.vercel.app/

- ログイン不要
- PC / スマートフォン対応
- Google AI Studio + React + Vercel で構築
- 
-## セキュリティについて（提出版の仕様）

本アプリは「生成AIパスポート模擬試験」の学習支援を目的としたWebアプリです。
UI/画面遷移/復習機能などは動作しますが、**問題の自動生成（Gemini API呼び出し）は提出版では停止**しています。

### なぜ停止しているか
ブラウザ（フロントエンド）から直接Gemini APIを呼ぶ設計でAPIキーを設定すると、
公開環境でキーが漏洩し、第三者に不正利用され課金が発生するリスクがあります。
そのため、安全性を優先して提出版は生成機能を無効化しています。

### 生成機能を有効化する場合（推奨方式）
APIキーをフロントエンドに置かず、VercelのServerless Function（/api）側で保持し、
フロントは /api 経由で生成を依頼する構成にするのが推奨です。
（将来的にこの方式での実装を想定しています）

### 提出版の制御
環境変数 `VITE_GENERATION_ENABLED` が `true` の場合のみ生成処理を実行する想定です。
※提出版では `false` を想定しています。


<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Eh6Tahkj_HwPzHTQx00hGtH8-vLd_zkO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   <img width="1159" height="789" alt="image" src="https://github.com/user-attachments/assets/1cd91d55-c98e-4e2f-87f5-a7e4659226f8" />
   <img width="1103" height="767" alt="image" src="https://github.com/user-attachments/assets/9c20683d-95cf-44d0-940b-b1697832376b" />
   <img width="998" height="976" alt="image" src="https://github.com/user-attachments/assets/c58c864e-c332-4e8c-9319-88b0d8497571" />
   <img width="1057" height="852" alt="image" src="https://github.com/user-attachments/assets/33214ad7-5f49-4c88-b42d-f8ef94e754cf" />
   <img width="970" height="849" alt="image" src="https://github.com/user-attachments/assets/f8bd8ef6-076a-4015-af9c-c0454a700a71" />
   <img width="1167" height="778" alt="image" src="https://github.com/user-attachments/assets/003df8ff-e111-4c13-a941-d58b591c9fd2" />
   <img width="1085" height="679" alt="image" src="https://github.com/user-attachments/assets/2b07af6b-30bb-4fe1-8e0c-f23ce1ab0290" />
   <img width="958" height="496" alt="image" src="https://github.com/user-attachments/assets/f19f50d7-4e7b-4a58-b8f0-94475907ddf5" />




