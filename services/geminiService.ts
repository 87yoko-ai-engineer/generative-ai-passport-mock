
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types";

const SYLLABUS_QUESTION_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      chapter: { type: Type.INTEGER },
      topicTag: { type: Type.STRING },
      question: { type: Type.STRING },
      choices: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        minItems: 4,
        maxItems: 4
      },
      correctIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING }
    },
    required: ["id", "chapter", "topicTag", "question", "choices", "correctIndex", "explanation"]
  }
};

const getDifficultyPrompt = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return "難易度: 初級。専門用語の定義や基本的な知識を確認する、直球で分かりやすい問題にしてください。";
    case Difficulty.NORMAL:
      return "難易度: 中級。基本的な定義に加え、簡単な活用事例問題を混ぜてください。ひっかけは少なめにし、学習者の理解を促す内容にしてください。";
    case Difficulty.HARD:
      return "難易度: 上級。紛らわしい選択肢を多用し、識別力を問う問題にしてください。単なる定義ではなく具体的なシナリオに基づいた事例問題を優先し、「最も適切」「最も不適切」なものを選択させる形式を多用してください。誤答の選択肢も一見もっともらしく、関連性の高い内容にしてください。";
    case Difficulty.EXAM:
      return "難易度: 本番級（最上級）。実際のGUGA（一般社団法人日本ディープラーニング協会）主催「生成AIパスポート試験」と同等の難易度・品質にしてください。4つの選択肢すべてが専門家でも一瞬迷うような高度な内容にし、よくある誤解や微細な表現の違い（「のみ」「場合がある」「必須である」等）で正誤を分ける問題にしてください。";
    default:
      return "";
  }
};

export async function generateQuestionsFromSyllabus(
  chapter: number,
  syllabusText: string,
  count: number = 10,
  difficulty: Difficulty = Difficulty.NORMAL
): Promise<Question[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const difficultyInstruction = getDifficultyPrompt(difficulty);
  
  const prompt = `
あなたは「生成AIパスポート」の高度な試験作成者です。
以下の第${chapter}章のシラバス内容に基づいて、オリジナルの4択問題を${count}問作成してください。

${difficultyInstruction}

シラバス内容:
${syllabusText}

出力は指定されたJSON形式（日本語）で行ってください。
IDはランダムな文字列（例: q_ch${chapter}_${Math.random().toString(36).substr(2, 9)}）にしてください。
解説は、なぜその選択肢が正解で他が間違いなのかを、1〜3文程度で論理的に記述してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SYLLABUS_QUESTION_SCHEMA
      }
    });

    const qs = JSON.parse(response.text) as Question[];
    return qs.map(q => ({ ...q, difficulty }));
  } catch (error) {
    console.error("Question generation failed:", error);
    throw error;
  }
}

export async function generateSimilarQuestion(
  original: Question,
  syllabusText: string,
  difficulty: Difficulty = Difficulty.NORMAL
): Promise<Question> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const difficultyInstruction = getDifficultyPrompt(difficulty);
  
  const prompt = `
以下の問題と同一トピック（${original.topicTag}）で、かつ異なる切り口の新しい4択問題を1問作成してください。
元の問題と同じ文章や選択肢を使わず、完全にオリジナルの内容にしてください。

元の問題: ${original.question}
元の難易度: ${original.difficulty || difficulty}

${difficultyInstruction}

第${original.chapter}章のシラバス情報: ${syllabusText}

出力は指定されたJSON形式の配列（要素数1）でお願いします。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SYLLABUS_QUESTION_SCHEMA
      }
    });

    const questions = JSON.parse(response.text) as Question[];
    return { ...questions[0], difficulty };
  } catch (error) {
    console.error("Similar question generation failed:", error);
    throw error;
  }
}
