
import React, { useState, useEffect } from 'react';
import { TabType, Question, ExamResult, AppState, Difficulty } from './types';
import { CHAPTERS, CHAPTER_NAMES, CHAPTER_METADATA, MOCK_EXAM_DISTRIBUTION, MOCK_EXAM_TIME_LIMIT, DIFFICULTY_LABELS } from './constants';
import { SyllabusTab } from './components/SyllabusTab';
import { ExamSession } from './components/ExamSession';
import { ResultView } from './components/ResultView';
import { generateQuestionsFromSyllabus, generateSimilarQuestion } from './services/geminiService';

const STORAGE_KEY = 'genai_passport_app_v3';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SYLLABUS);
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      questions: [],
      wrongQuestionIds: [],
      examHistory: [],
      difficulty: Difficulty.NORMAL
    };
  });

  const [currentSession, setCurrentSession] = useState<{
    title: string;
    questions: Question[];
    isMock: boolean;
  } | null>(null);
  
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as Difficulty;
    setAppState(prev => ({ ...prev, difficulty: newDifficulty }));
  };

  const startChapterExam = async (chapter: number) => {
    setIsGenerating(true);
    try {
      const qs = await generateQuestionsFromSyllabus(
        chapter, 
        CHAPTER_METADATA[chapter].syllabus, 
        10, 
        appState.difficulty
      );
      setAppState(prev => ({
        ...prev,
        questions: [...prev.questions, ...qs]
      }));
      setCurrentSession({
        title: `${CHAPTER_NAMES[chapter]} [${DIFFICULTY_LABELS[appState.difficulty]}]`,
        questions: qs,
        isMock: false
      });
    } catch (e) {
      alert('問題生成に失敗しました。APIキーを確認してください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const startMockExam = async () => {
    setIsGenerating(true);
    try {
      const allMockQuestions: Question[] = [];
      for (const ch of CHAPTERS) {
        const count = MOCK_EXAM_DISTRIBUTION[ch];
        const qs = await generateQuestionsFromSyllabus(
          ch, 
          CHAPTER_METADATA[ch].syllabus, 
          count, 
          appState.difficulty
        );
        allMockQuestions.push(...qs);
      }
      const shuffled = allMockQuestions.sort(() => Math.random() - 0.5);
      
      setAppState(prev => ({
        ...prev,
        questions: [...prev.questions, ...allMockQuestions]
      }));
      
      setCurrentSession({
        title: `模擬試験（全60問） [${DIFFICULTY_LABELS[appState.difficulty]}]`,
        questions: shuffled,
        isMock: true
      });
    } catch (e) {
      alert('問題生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const startReviewWrong = () => {
    const wrongQs = appState.questions.filter(q => appState.wrongQuestionIds.includes(q.id));
    if (wrongQs.length === 0) {
      alert('間違えた問題はありません。');
      return;
    }
    setCurrentSession({
      title: "復習（間違えた問題）",
      questions: wrongQs.sort(() => Math.random() - 0.5),
      isMock: false
    });
  };

  const startReviewSimilar = async () => {
    const wrongQs = appState.questions.filter(q => appState.wrongQuestionIds.includes(q.id));
    if (wrongQs.length === 0) {
      alert('間違えた問題はありません。');
      return;
    }

    setIsGenerating(true);
    try {
      const similarQs: Question[] = [];
      const sample = wrongQs.sort(() => Math.random() - 0.5).slice(0, 5);
      for (const q of sample) {
        // Maintain the difficulty level of the original question or use current app setting
        const targetDifficulty = q.difficulty || appState.difficulty;
        const similar = await generateSimilarQuestion(
          q, 
          CHAPTER_METADATA[q.chapter].syllabus, 
          targetDifficulty
        );
        similarQs.push(similar);
      }
      
      setAppState(prev => ({
        ...prev,
        questions: [...prev.questions, ...similarQs]
      }));
      
      setCurrentSession({
        title: "復習（AIによる類題）",
        questions: similarQs,
        isMock: false
      });
    } catch (e) {
      alert('類題の生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExamComplete = (result: ExamResult) => {
    const newWrongIds = new Set(appState.wrongQuestionIds);
    result.questions.forEach(q => {
      if (q.selectedIndex !== q.correctIndex) {
        newWrongIds.add(q.id);
      } else {
        newWrongIds.delete(q.id);
      }
    });

    const resultWithDiff = { ...result, difficulty: appState.difficulty };

    setAppState(prev => ({
      ...prev,
      wrongQuestionIds: Array.from(newWrongIds),
      examHistory: [resultWithDiff, ...prev.examHistory]
    }));
    
    setLastResult(resultWithDiff);
    setCurrentSession(null);
  };

  if (currentSession) {
    return (
      <ExamSession
        title={currentSession.title}
        questions={currentSession.questions}
        timeLimit={currentSession.isMock ? MOCK_EXAM_TIME_LIMIT : undefined}
        onComplete={handleExamComplete}
        onCancel={() => setCurrentSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black text-indigo-600 tracking-tight">AI Passport Mock</h1>
          <nav className="flex gap-2 text-sm font-bold overflow-x-auto no-scrollbar">
            {[
              { id: TabType.SYLLABUS, label: 'シラバス' },
              { id: TabType.CHAPTER, label: '章別' },
              { id: TabType.MOCK, label: '模擬' },
              { id: TabType.REVIEW, label: '復習' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setLastResult(null); }}
                className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        {!lastResult && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold flex items-center">
                <span className="mr-2">⚙️</span> 学習設定
              </h2>
              <p className="text-indigo-100 text-xs">生成される問題の難易度を選択してください。</p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="difficulty-select" className="text-sm font-bold whitespace-nowrap">難易度:</label>
              <select
                id="difficulty-select"
                value={appState.difficulty}
                onChange={handleDifficultyChange}
                className="bg-white text-gray-900 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white border-none cursor-pointer"
              >
                {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold mb-2">問題を生成中...</h2>
              <p className="text-gray-500 text-sm">Gemini AIが公式シラバスから【{DIFFICULTY_LABELS[appState.difficulty]}】レベルのオリジナル問題を作成しています。しばらくお待ちください。</p>
            </div>
          </div>
        )}

        {lastResult ? (
          <ResultView result={lastResult} onClose={() => setLastResult(null)} />
        ) : (
          <>
            {activeTab === TabType.SYLLABUS && (
              <SyllabusTab />
            )}

            {activeTab === TabType.CHAPTER && (
              <div className="grid gap-4 md:grid-cols-2">
                {CHAPTERS.map(ch => (
                  <button
                    key={ch}
                    onClick={() => startChapterExam(ch)}
                    className="p-6 bg-white border border-gray-200 rounded-2xl text-left hover:border-indigo-500 hover:shadow-lg transition-all group"
                  >
                    <div className="text-sm font-bold text-indigo-600 mb-2">CHAPTER {ch}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 h-12 leading-tight overflow-hidden line-clamp-2">{CHAPTER_NAMES[ch]}</h3>
                    <div className="flex items-center text-xs text-gray-400 group-hover:text-indigo-500">
                      <span>10問作成して開始</span>
                      <span className="ml-auto">→</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === TabType.MOCK && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📝</div>
                <h2 className="text-2xl font-black mb-2">生成AIパスポート 模擬試験</h2>
                <p className="text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                  本試験と同じ形式で60問、60分間の試験を実施します。<br/>
                  難易度は現在設定されている「{DIFFICULTY_LABELS[appState.difficulty]}」が適用されます。
                </p>
                <div className="grid grid-cols-5 gap-2 mb-8 text-[10px] text-gray-400 font-bold uppercase">
                  <div>Ch1: 13問</div>
                  <div>Ch2: 17問</div>
                  <div>Ch3: 10問</div>
                  <div>Ch4: 11問</div>
                  <div>Ch5: 9問</div>
                </div>
                <button
                  onClick={startMockExam}
                  className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95"
                >
                  試験を開始する
                </button>
              </div>
            )}

            {activeTab === TabType.REVIEW && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <span className="mr-2">🔄</span> 復習モード
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={startReviewWrong}
                      className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-left hover:bg-orange-100 transition-colors"
                    >
                      <div className="font-bold text-orange-800 mb-1">間違えた問題を解く</div>
                      <div className="text-xs text-orange-600">
                        {appState.wrongQuestionIds.length}問が登録されています
                      </div>
                    </button>
                    <button
                      onClick={startReviewSimilar}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors"
                    >
                      <div className="font-bold text-blue-800 mb-1">AIで類題を生成する</div>
                      <div className="text-xs text-blue-600">
                        設定難易度で類似問題を新しく5問作成
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">過去の履歴</h3>
                  {appState.examHistory.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">履歴はありません。</p>
                  ) : (
                    <div className="space-y-3">
                      {appState.examHistory.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <div className="text-sm font-bold">{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString()}</div>
                            <div className="text-xs text-gray-400">
                              スコア: {h.score}/{h.total} 
                              <span className="ml-2 bg-gray-200 px-1 rounded text-[10px]">{DIFFICULTY_LABELS[h.difficulty]}</span>
                            </div>
                          </div>
                          <div className={`text-xs font-bold px-2 py-1 rounded ${h.total === 60 ? (h.score >= 42 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-gray-200 text-gray-600'}`}>
                            {h.total === 60 ? (h.score >= 42 ? '合格' : '不合格') : '章別演習'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} 生成AIパスポート 模擬試験対策アプリ. Generated by Gemini AI.
      </footer>
    </div>
  );
};

export default App;
