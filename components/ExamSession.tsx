
import React, { useState, useEffect, useCallback } from 'react';
import { Question, ExamResult } from '../types';

interface Props {
  title: string;
  questions: Question[];
  timeLimit?: number; // in seconds
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

export const ExamSession: React.FC<Props> = ({ title, questions, timeLimit, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);

  useEffect(() => {
    if (!timeLimit) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit]);

  const handleSubmit = useCallback(() => {
    let score = 0;
    const chapterScores: Record<number, { correct: number; total: number }> = {};

    const questionsWithAnswers = questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctIndex;
      if (isCorrect) score++;

      if (!chapterScores[q.chapter]) {
        chapterScores[q.chapter] = { correct: 0, total: 0 };
      }
      chapterScores[q.chapter].total++;
      if (isCorrect) chapterScores[q.chapter].correct++;

      return { ...q, selectedIndex: answers[idx] };
    });

    onComplete({
      date: new Date().toISOString(),
      score,
      total: questions.length,
      chapterScores,
      questions: questionsWithAnswers,
    });
  }, [answers, questions, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md p-4 z-10 border-b">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-500">問題 {currentIndex + 1} / {questions.length}</p>
        </div>
        {timeLimit && (
          <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>
             ⏱️ {formatTime(timeLeft)}
          </div>
        )}
        <button 
          onClick={() => { if(confirm('試験を中断しますか？')) onCancel(); }}
          className="text-gray-500 hover:text-red-500 font-medium"
        >
          終了
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <div className="mb-4">
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold mr-2">
            第{currentQuestion.chapter}章
          </span>
          <span className="text-gray-400 text-xs">#{currentQuestion.topicTag}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentIndex] = idx;
                setAnswers(newAnswers);
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[currentIndex] === idx
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 border-2 ${
                  answers[currentIndex] === idx ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{choice}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center max-w-3xl mx-auto shadow-lg rounded-t-xl">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="px-6 py-2 rounded-lg font-bold disabled:opacity-30"
        >
          ← 戻る
        </button>
        
        <div className="flex gap-2">
           {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                採点する
              </button>
           ) : (
             <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-8 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-black"
              >
                次へ →
              </button>
           )}
        </div>
      </div>
    </div>
  );
};
