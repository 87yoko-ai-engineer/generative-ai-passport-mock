
import React from 'react';
import { CHAPTERS, CHAPTER_METADATA } from '../constants';

export const SyllabusTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-blue-800 font-bold mb-2">📚 シラバス確認</h2>
        <p className="text-sm text-blue-700">
          生成AIパスポート試験（第1章〜第5章）の公式シラバスに基づいた学習範囲です。
          本アプリの問題は、以下の内容を学習ソースとしてAIによって自動生成されます。
        </p>
      </div>

      <div className="grid gap-4">
        {CHAPTERS.map((ch) => (
          <div key={ch} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-indigo-600 mb-2">
              {CHAPTER_METADATA[ch].title}
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-50">
              {CHAPTER_METADATA[ch].syllabus}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
