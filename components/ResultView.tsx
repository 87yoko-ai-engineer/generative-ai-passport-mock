
import React from 'react';
import { ExamResult } from '../types';
import { CHAPTER_NAMES, PASSING_SCORE, DIFFICULTY_LABELS } from '../constants';

interface Props {
  result: ExamResult;
  onClose: () => void;
}

export const ResultView: React.FC<Props> = ({ result, onClose }) => {
  const isMock = result.total === 60;
  const isPassed = isMock ? result.score >= PASSING_SCORE : true;
  
  // Determine if this was a single chapter test to highlight the specific chapter card
  const chapterEntries = Object.entries(result.chapterScores);
  const isSingleChapter = chapterEntries.length === 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
          LEVEL: {DIFFICULTY_LABELS[result.difficulty]}
        </div>

        <h2 className="text-2xl font-bold mb-4">採点結果</h2>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="text-5xl font-black text-indigo-600">
            {result.score}<span className="text-xl text-gray-400 font-normal"> / {result.total}</span>
          </div>
          {isMock && (
            <div className={`px-4 py-2 rounded-full font-black text-xl border-4 ${isPassed ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
              {isPassed ? '合格' : '不合格'}
            </div>
          )}
        </div>

        <div className={`grid gap-4 ${isSingleChapter ? 'max-w-xs mx-auto' : 'grid-cols-2 md:grid-cols-5'}`}>
          {chapterEntries.map(([ch, score]) => {
            const chapterNum = parseInt(ch);
            const chapterScore = score as { correct: number; total: number };
            const isActive = isSingleChapter; // If only one chapter exists, it's the active one
            
            return (
              <div 
                key={ch} 
                className={`p-4 rounded-xl border-2 transition-all shadow-sm ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-500 ring-4 ring-indigo-50' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className={`font-black text-gray-900 leading-tight mb-1 ${isActive ? 'text-xl' : 'text-sm'}`}>
                  第{ch}章
                </div>
                {!isSingleChapter && (
                   <div className="text-[10px] text-gray-500 font-bold mb-2 truncate">
                     {CHAPTER_NAMES[chapterNum].split(' ')[1]}
                   </div>
                )}
                {isSingleChapter && (
                  <div className="text-xs text-indigo-600 font-bold mb-3">
                    {CHAPTER_NAMES[chapterNum]}
                  </div>
                )}
                <div className={`font-black text-indigo-600 ${isActive ? 'text-4xl' : 'text-xl'}`}>
                  {Math.round((chapterScore.correct / chapterScore.total) * 100)}%
                </div>
                <div className={`font-bold text-gray-400 mt-1 uppercase tracking-wider ${isActive ? 'text-sm' : 'text-[10px]'}`}>
                  {chapterScore.correct} / {chapterScore.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">正解と解説</h3>
        {result.questions.map((q, idx) => {
          const isCorrect = q.selectedIndex === q.correctIndex;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isCorrect ? 'bg-white border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">問 {idx + 1}</span>
                  {q.difficulty && (
                    <span className="text-[8px] bg-gray-100 text-gray-400 px-1 rounded uppercase font-bold">
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </span>
                  )}
                </div>
                {isCorrect ? (
                   <span className="text-green-600 font-bold">✅ 正解</span>
                ) : (
                   <span className="text-red-600 font-bold">❌ 不正解</span>
                )}
              </div>
              <p className="font-semibold mb-4">{q.question}</p>
              
              <div className="space-y-2 mb-4">
                {q.choices.map((choice, cIdx) => (
                  <div key={cIdx} className={`text-sm p-2 rounded ${
                    cIdx === q.correctIndex ? 'bg-green-100 text-green-800 font-bold border border-green-200' : 
                    cIdx === q.selectedIndex ? 'bg-red-100 text-red-800' : 'bg-gray-50'
                  }`}>
                    {String.fromCharCode(65 + cIdx)}. {choice}
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-indigo-700 mb-1">解説</h4>
                <p className="text-sm text-indigo-900 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={onClose}
          className="px-12 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-black shadow-lg transition-all hover:-translate-y-1"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};
