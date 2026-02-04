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
# Generative AI Passport Mock Exam App

This is a web-based mock exam application designed to help learners prepare for the
**Generative AI Passport (生成AIパスポート)** exam.

The app was developed using **Google AI Studio** as an AI-assisted development environment,
with a focus on syllabus-based question design and exam-style practice.

---

## Features

- 📘 **Chapter-based practice**
  - Practice questions for each chapter (Chapter 1–5)
  - Default: 10 questions per chapter

- 📝 **Full mock exam**
  - 60 questions / 60 minutes
  - Fixed chapter distribution:  
    - Ch1: 13 / Ch2: 17 / Ch3: 10 / Ch4: 11 / Ch5: 9
  - Pass/Fail judgment (default: 70%)

- 🔁 **Review mode**
  - Reattempt the exact questions answered incorrectly
  - Generate similar questions from the same chapter and topic area

- 🎚 **Difficulty control**
  - Easy / Normal / Hard / Exam
  - Exam mode is designed to simulate real exam-style confusing questions

---

## Design Highlights

- Questions are generated based on the **official Generative AI Passport syllabus**
- Chapter structure and syllabus content are embedded in code to avoid UI state loss
- Topic-based tagging is used to enable focused review and similar-question generation
- No external API calls are made at runtime (no usage-based cost)

---

## Technology Stack

- Google AI Studio (AI-assisted development)
- React / TypeScript
- Vite

---

## Disclaimer

This application is **not an official product** of GUGA.
It is an independent study tool created for educational purposes,
based on publicly available syllabus information.

---

## Repository

This repository contains the full source code of the application.

> Google AI Studioを活用して開発した、生成AIパスポート対策用の模擬試験Webアプリ。

