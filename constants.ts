
import { Difficulty } from './types';

export const CHAPTERS = [1, 2, 3, 4, 5] as const;

export const CHAPTER_METADATA: Record<number, { title: string; syllabus: string }> = {
  1: {
    title: '第1章 AI（人工知能）',
    syllabus: 'AIの定義、歴史（第一次〜第三次ブーム）、機械学習（教師あり・教師なし・強化学習）、ディープラーニングの仕組み、ニューラルネットワーク、統計学とAIの違い、チューリングテスト、ダートマス会議など。'
  },
  2: {
    title: '第2章 生成AI（ジェネレーティブAI）',
    syllabus: '生成AIの仕組み（Transformerのアーキテクチャ、Attentionメカニズム）、GAN（敵対的生成ネットワーク）、VAE、拡散モデル（Diffusion Models）、大規模言語モデル（LLM）の基礎、トークナイズの仕組み。'
  },
  3: {
    title: '第3章 現在の生成AI（ジェネレーティブAI）の動向',
    syllabus: '主要なLLM（ChatGPT, Gemini, Claude, Llama）、画像生成AI（Stable Diffusion, Midjourney, DALL-E）、マルチモーダルAI、動画生成AI、音声合成技術、ビジネスにおける最新の活用事例とツールの特徴。'
  },
  4: {
    title: '第4章 情報リテラシー・基本理念とAI社会原則',
    syllabus: 'ハルシネーション（幻覚）、機密情報の漏洩リスク、バイアスと公平性、AI倫理（人間中心のAI社会原則）、著作権法（第30条の4等）、個人情報保護法、国内外のAIガイドライン（総務省・経済産業省、EU AI法）、ディープフェイクのリスク。'
  },
  5: {
    title: '第5章 テキスト生成AIのプロンプト制作と実例',
    syllabus: 'プロンプトエンジニアリングの基本原則、Few-shotプロンプティング、Chain of Thought (CoT)、ReAct、ゼロショット、具体的な業務効率化（要約、翻訳、コード生成）のプロンプト実例、出力結果の検証とファクトチェックの方法。'
  }
};

export const CHAPTER_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(CHAPTER_METADATA).map(([id, meta]) => [id, meta.title])
);

export const MOCK_EXAM_DISTRIBUTION: Record<number, number> = {
  1: 13,
  2: 17,
  3: 10,
  4: 11,
  5: 9
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.EASY]: '初級 (Easy)',
  [Difficulty.NORMAL]: '中級 (Normal)',
  [Difficulty.HARD]: '上級 (Hard)',
  [Difficulty.EXAM]: '本番級 (Exam)'
};

export const PASSING_SCORE = 42; // 70% of 60
export const MOCK_EXAM_TOTAL = 60;
export const MOCK_EXAM_TIME_LIMIT = 60 * 60; // 60 minutes in seconds
