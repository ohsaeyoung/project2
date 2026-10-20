import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Home
} from 'lucide-react';
import type { ChecklistItem } from '../../types';
import { INITIAL_CHECKLIST } from '../../data/initialChecklist';

const STORAGE_KEY = 'move_settlement_checklist_v1';

export const ChecklistView: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load checklist from localStorage:', e);
    }
    return INITIAL_CHECKLIST;
  });

  const [filterStage, setFilterStage] = useState<'all' | 'before' | 'day' | 'after'>('all');
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  // 로컬스토리지 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save checklist:', e);
    }
  }, [items]);

  // 체크 토글
  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // 전체 초기화
  const handleReset = () => {
    if (confirm('체크리스트의 모든 체크 상태를 초기화하시겠습니까?')) {
      setItems(INITIAL_CHECKLIST);
    }
  };

  // 진행률 계산
  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  const getStageStats = (stage: 'before' | 'day' | 'after') => {
    const stageItems = items.filter(i => i.stage === stage);
    const completed = stageItems.filter(i => i.completed).length;
    const percent = Math.round((completed / stageItems.length) * 100) || 0;
    return { total: stageItems.length, completed, percent };
  };

  const beforeStats = getStageStats('before');
  const dayStats = getStageStats('day');
  const afterStats = getStageStats('after');

  // 필터링 적용된 항목
  const filteredItems = items.filter(item => {
    if (filterStage !== 'all' && item.stage !== filterStage) return false;
    if (showIncompleteOnly && item.completed) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 상단 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1">
              <span>Smart Checklist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              이사 정산 단계별 체크리스트
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              이사 전, 당일, 이사 후 필요한 필수 정산 항목의 진행 상태를 점검하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              인쇄하기
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>

        {/* 로컬 저장 안내 배너 */}
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>자동 저장 안내:</strong> 체크리스트의 진행 상태는 브라우저의 로컬 저장소(LocalStorage)에 안전하게 자동 저장되어 새로고침 후에도 유지됩니다.
            </span>
          </div>
          <span className="text-[11px] font-bold bg-emerald-200/60 px-2.5 py-1 rounded-lg text-emerald-800">
            {completedCount} / {totalCount} 완료
          </span>
        </div>

        {/* 전체 진행률 프로그레스 바 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>전체 정산 준비 진행률</span>
            <span className="text-base text-emerald-600 font-extrabold">{overallPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* 단계별 요약 3개 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => setFilterStage('before')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStage === 'before'
                ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                1. 이사 전 (D-7 ~ D-1)
              </span>
              <span className="text-xs font-bold text-blue-600">{beforeStats.percent}%</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {beforeStats.completed}개 완료 / 총 {beforeStats.total}개
            </div>
          </button>

          <button
            onClick={() => setFilterStage('day')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStage === 'day'
                ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                2. 이사 당일 (D-Day)
              </span>
              <span className="text-xs font-bold text-amber-600">{dayStats.percent}%</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {dayStats.completed}개 완료 / 총 {dayStats.total}개
            </div>
          </button>

          <button
            onClick={() => setFilterStage('after')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStage === 'after'
                ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-600" />
                3. 이사 후 (새 집)
              </span>
              <span className="text-xs font-bold text-emerald-600">{afterStats.percent}%</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {afterStats.completed}개 완료 / 총 {afterStats.total}개
            </div>
          </button>
        </div>
      </div>

      {/* 필터 및 목록 영역 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* 단계 탭 필터 */}
          <div className="flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: '전체 보기' },
              { id: 'before', label: '이사 전' },
              { id: 'day', label: '이사 당일' },
              { id: 'after', label: '이사 후' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStage(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterStage === tab.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 미완료만 보기 토글 */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showIncompleteOnly}
              onChange={e => setShowIncompleteOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>미완료 항목만 모아보기</span>
          </label>
        </div>

        {/* 체크리스트 항목 목록 */}
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-emerald-50/30 border-emerald-200 text-slate-500'
                  : 'bg-white hover:border-slate-300 border-slate-200 text-slate-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-bold text-sm ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.required && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                      필수
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {item.stage === 'before' ? '이사 전' : item.stage === 'day' ? '이사 당일' : '이사 후'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              표시할 체크리스트 항목이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
