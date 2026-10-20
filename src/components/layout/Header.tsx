import React, { useState } from 'react';
import { Zap, Flame, CheckSquare, Headphones, Menu, X, Activity, BookOpen } from 'lucide-react';
import type { ApiStatusResponse } from '../../services/api';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  apiStatus: ApiStatusResponse | null;
  onOpenApiSettings: () => void;
  onOpenCustomerSupport: () => void;
  onOpenMeterGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  apiStatus,
  onOpenApiSettings,
  onOpenCustomerSupport,
  onOpenMeterGuide
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'form', label: '정보 입력' },
    { id: 'electricity', label: '전기요금 조회' },
    { id: 'gas', label: '도시가스 조회' },
    { id: 'result', label: '통합 정산 대시보드' },
    { id: 'checklist', label: '이사 체크리스트' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isConnected = apiStatus?.electricity.isConnected || apiStatus?.gas.isConnected;
  const isMock = apiStatus?.electricity.hasMockEnabled || apiStatus?.gas.hasMockEnabled;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 상단 공공서비스형 배너 */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] sm:text-xs">대한민국 주거 이사 당일 전기·도시가스 정산 도우미</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApiSettings}
              className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 py-0.5 px-2 rounded hover:bg-slate-800 transition-colors"
            >
              <Activity className="w-3 h-3 text-blue-400" />
              API 상태: {isMock ? (
                <span className="text-amber-400 font-semibold">시뮬레이션 모드</span>
              ) : isConnected ? (
                <span className="text-emerald-400 font-semibold">실시간 연동</span>
              ) : (
                <span className="text-slate-400">실시간 미연결 (공식 안내)</span>
              )}
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              onClick={onOpenMeterGuide}
              className="text-[11px] text-slate-300 hover:text-white hidden sm:flex items-center gap-1 py-0.5 px-1.5"
            >
              <BookOpen className="w-3 h-3 text-sky-400" />
              계량기 보는 법
            </button>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <Flame className="w-4 h-4 text-orange-300 fill-orange-300 -ml-1" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                이사 정산 도우미
              </span>
              <span className="text-[10px] text-slate-600 tracking-wider uppercase font-semibold">
                Electric & City Gas Settlement
              </span>
            </div>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('form')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'form'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              요금 조회 시작
            </button>
            <button
              onClick={() => handleNavClick('electricity')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'electricity'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              전기요금
            </button>
            <button
              onClick={() => handleNavClick('gas')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'gas'
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              도시가스
            </button>
            <button
              onClick={() => handleNavClick('result')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'result'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              통합 결과
            </button>
            <button
              onClick={() => handleNavClick('checklist')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'checklist'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              체크리스트
            </button>
            <button
              onClick={onOpenCustomerSupport}
              className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Headphones className="w-4 h-4 text-slate-500" />
              고객지원
            </button>
          </nav>

          {/* 우측 퀵 버튼 */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('form')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              정산 시작하기
            </button>
          </div>

          {/* 모바일 햄버거 토글 */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('form')}
              className="py-2.5 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold text-center"
            >
              정산 시작하기
            </button>
            <button
              onClick={() => handleNavClick('checklist')}
              className="py-2.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold text-center"
            >
              체크리스트
            </button>
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCustomerSupport(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-slate-500" />
              공식 고객센터 안내 (123 / 도시가스사)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenMeterGuide(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              계량기 지침 읽는 법 가이드
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenApiSettings(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              API 연동 상태 진단
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
