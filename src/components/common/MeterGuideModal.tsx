import React from 'react';
import { X, Zap, Flame, Info, CheckCircle2 } from 'lucide-react';

interface MeterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'electricity' | 'gas';
}

export const MeterGuideModal: React.FC<MeterGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'electricity'
}) => {
  const [tab, setTab] = React.useState<'electricity' | 'gas'>(defaultTab);

  React.useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">계량기 보는 법 & 지침 확인 가이드</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setTab('electricity')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'electricity'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-blue-600" />
            전기 계량기 (전력량계)
          </button>
          <button
            onClick={() => setTab('gas')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'gas'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600" />
            도시가스 계량기
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {tab === 'electricity' ? (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  전기 계량기 핵심 요약
                </h4>
                <p className="text-blue-800 text-xs leading-5">
                  전기 계량기는 <strong>소수점 앞자리(정수)</strong>만 기록합니다. 디지털 전력량계는 화면 번호(07번 또는 04번)를 확인해야 합니다.
                </p>
              </div>

              {/* 기계식 계량기 */}
              <div className="border border-slate-200 rounded-xl p-4">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded mb-2">
                  1. 기계식 (아날로그 회전식)
                </span>
                <p className="text-xs text-slate-600 mb-3">
                  단독주택, 다세대, 구축 빌라 등에서 주로 볼 수 있는 톱니바퀴 회전식 계량기입니다.
                </p>
                <div className="bg-slate-100 p-3 rounded-lg font-mono text-center text-lg tracking-widest text-slate-900 border border-slate-300">
                  <span className="bg-white px-2 py-1 rounded shadow-inner">0</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">4</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">8</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">2</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">1</span>
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded shadow-inner ml-2 text-sm">. 7</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  👉 빨간색 테두리(소수점)를 제외한 검은색 숫자 <strong>[04821]</strong>이 검침 지침입니다.
                </p>
              </div>

              {/* 전자식 계량기 */}
              <div className="border border-slate-200 rounded-xl p-4">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded mb-2">
                  2. 전자식 (디지털 LCD 계량기)
                </span>
                <p className="text-xs text-slate-600 mb-3">
                  아파트, 신축 오피스텔 등에서 LCD 화면에 여러 항목이 순환 표시됩니다.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong className="text-slate-900">E-Type 계량기 (단상):</strong> 좌측 상단 항목번호 <strong>[07번]</strong> (현재 누적 유효전력량)이 뜰 때의 숫자를 확인합니다.
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong className="text-slate-900">G-Type 계량기:</strong> 항목번호 <strong>[04번]</strong> 또는 [07번]의 현재 누적 유효전력량(kWh)을 읽습니다.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  도시가스 계량기 핵심 요약
                </h4>
                <p className="text-amber-800 text-xs leading-5">
                  가스 계량기는 주로 보일러실, 다용도실, 또는 복도 양수기함에 위치하며 <strong>빨간색 상자(소수점 이하)를 제외한 앞자리</strong>만 읽습니다.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded mb-2">
                  가스 계량기 숫자 확인법
                </span>
                <div className="bg-slate-100 p-3 rounded-lg font-mono text-center text-lg tracking-widest text-slate-900 border border-slate-300 my-3">
                  <span className="bg-white px-2 py-1 rounded shadow-inner">0</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">1</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">3</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">8</span>
                  <span className="bg-white px-2 py-1 rounded shadow-inner ml-1">5</span>
                  <span className="bg-red-500 text-white font-bold px-2 py-1 rounded shadow-inner ml-2 text-sm">2 4</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>• <strong>흰색 바탕 검은 숫자:</strong> 정수 부분 (m³) ➡️ <strong>01385</strong>를 입력합니다.</p>
                  <p>• <strong>빨간색 테두리/바탕 숫자:</strong> 소수점 이하 자리 ➡️ 무시하거나 반올림하지 않습니다.</p>
                  <p className="text-amber-700 font-medium pt-1">
                    ⚠️ 주의: 가스 계량기는 누적 사용량이므로 전출 시 기사님이 직접 안전봉인을 해야 정산이 최종 완료됩니다.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="font-semibold text-slate-800 text-xs mb-1">📸 사진 촬영 팁</h5>
                <p className="text-xs text-slate-600">
                  계량기 번호(시리얼 번호)와 지침 숫자가 한 컷에 모두 선명하게 나오도록 정면에서 밝게 촬영해 두세요. 임대인이나 다음 세입자와의 정산 시 중요한 공식 증빙이 됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-sm transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
