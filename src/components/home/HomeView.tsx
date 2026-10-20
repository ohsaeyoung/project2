import React from 'react';
import { 
  Zap, 
  Flame, 
  ArrowRight, 
  CheckSquare, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Building
} from 'lucide-react';
import type { ApiStatusResponse } from '../../services/api';

interface HomeViewProps {
  onStartSettlement: () => void;
  onGoChecklist: () => void;
  onGoElectricity: () => void;
  onGoGas: () => void;
  onOpenMeterGuide: () => void;
  onOpenCustomerSupport: () => void;
  apiStatus: ApiStatusResponse | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartSettlement,
  onGoChecklist,
  onGoElectricity,
  onGoGas,
  onOpenMeterGuide,
  onOpenCustomerSupport,
  apiStatus
}) => {
  const electricityConnected = apiStatus?.electricity.isConnected || false;
  const gasConnected = apiStatus?.gas.isConnected || false;

  return (
    <div className="space-y-12">
      {/* 1. 히어로 섹션 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-800">
        {/* 은은한 배경 효과 */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            이사 당일 원스톱 공공 정산 도우미
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            이사할 때 전기·가스 정산,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              한 번에 준비하세요.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            이사 날짜와 주소를 입력하고 필요한 정산 절차를 확인하세요. 전국 34개 도시가스사 관할 조회와 한국전력 이사정산 공식 절차를 단계별로 명확하게 안내해 드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <button
              onClick={onStartSettlement}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
            >
              <span>정산 시작하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoChecklist}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 active:bg-white/5 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-xs transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>이사 당일 체크리스트</span>
            </button>
          </div>

          {/* 신뢰 지표 안내 */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>민감 개인정보 미수집</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>이사 당일 실시간 확인</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400 shrink-0" />
              <span>전국 34개 도시가스사 연계</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 핵심 요금 조회 카드 2개 (전기 & 도시가스) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              실시간 요금 조회 & 정산 서비스
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              전기요금과 도시가스 요금의 공식 조회 경로 및 필요 서류를 안내합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 전기요금 카드 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Zap className="w-6 h-6 fill-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">전기요금 이사 정산</h3>
                    <span className="text-xs text-slate-500 font-medium">한국전력공사 (KEPCO) 관할</span>
                  </div>
                </div>

                {/* 연결 상태 뱃지 */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                    electricityConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      electricityConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {electricityConnected ? '실시간 연동' : '실시간 조회 미연결'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                이사 당일 최종 전기 계량기 검침 지침 숫자를 기반으로 당일까지의 전기요금을 계산하고 즉시 가상계좌 또는 카드로 납부합니다.
              </p>

              {/* 필요한 정보 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">정산 시 필요한 정보</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <strong>전기 고객번호 (10자리):</strong> 고지서 또는 한전ON에서 확인
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <strong>이사 당일 계량기 지침:</strong> 소수점 앞자리 정수 확인
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <strong>계량기 증빙 사진:</strong> 정산 분쟁 방지용 사진 보관 권장
                  </li>
                </ul>
              </div>
            </div>

            {/* 카드 액션 버튼들 */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={onGoElectricity}
                className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>전기 정산 페이지로 이동</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="https://online.kepco.co.kr"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>한전ON 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 도시가스 요금 카드 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Flame className="w-6 h-6 fill-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">도시가스 요금 이사 정산</h3>
                    <span className="text-xs text-slate-500 font-medium">전국 34개 지역 공급사 관할</span>
                  </div>
                </div>

                {/* 연결 상태 뱃지 */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                    gasConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      gasConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {gasConnected ? '실시간 연동' : '실시간 조회 미연결'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                도시가스는 전국 단일 사업자가 아닌 시·군·구별 34개 사업자가 독점 공급합니다. 안전마개 시공을 위해 <strong>이사 2~3일 전 방문 예약</strong>이 필요합니다.
              </p>

              {/* 필요한 정보 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">정산 시 필요한 정보</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    <strong>관할 도시가스사 확인:</strong> 서울도시가스, 삼천리, 예스코 등
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    <strong>전출 방문 예약 여부:</strong> 배관 마감 플러그 조치 필수
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    <strong>가스 계량기 지침:</strong> 빨간 테두리 제외 앞자리 정수
                  </li>
                </ul>
              </div>
            </div>

            {/* 카드 액션 버튼들 */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={onGoGas}
                className="w-full sm:flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>도시가스 정산 페이지로 이동</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCustomerSupport}
                className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>우리 지역 가스사 찾기</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 이사 당일 정산 4단계 가이드 */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Process Guide</span>
          <h2 className="text-2xl font-bold text-slate-900">이사 정산 절차 한눈에 보기</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            놓치기 쉬운 필수 정산 단계, 순서대로 차근차근 진행하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-900">사전 정보 확인 (D-3)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              전기 고객번호와 관할 도시가스사를 확인하고, 가스레인지 철거 기사 방문을 예약합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-slate-900">계량기 촬영 (당일 오전)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              짐을 빼기 직전 전기 전력량계와 가스 계량기의 지침 숫자를 선명하게 촬영하여 보관합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-slate-900">당일 요금 즉시 납부</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              한전(123) 및 가스사 기사에게 최종 지침을 알리고 가상계좌나 카드로 즉시 완납합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm text-slate-900">영수증 전달 & 명의변경</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              납부 확인 문자를 임대인에게 전달하여 보증금을 수령하고, 새 집에서 명의변경을 신청합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 빠른 도우미 배너 (계량기 보는 법 & 자주 묻는 질문) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
              <BookOpen className="w-5 h-5 text-blue-600" />
              계량기 지침 읽는 법이 헷갈리시나요?
            </div>
            <p className="text-xs text-blue-800 leading-relaxed max-w-md">
              기계식 vs 전자식(E/G타입) 전력량계 및 가스 계량기의 소수점 구분법을 그림과 예시로 쉽게 확인하세요.
            </p>
            <button
              onClick={onOpenMeterGuide}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1 shadow-xs"
            >
              <span>계량기 가이드 열기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              이사 체크리스트로 누락 방지하기
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-md">
              이사 전 준비부터 이사 당일, 이사 후 명의변경까지 총 14가지 체크 항목의 진행률을 브라우저에 저장하며 관리하세요.
            </p>
            <button
              onClick={onGoChecklist}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1 shadow-xs"
            >
              <span>체크리스트 열기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
