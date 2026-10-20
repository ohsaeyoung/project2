import { useState } from 'react';
import { 
  Zap, 
  Flame, 
  CheckCircle2, 
  ExternalLink, 
  Printer, 
  Calculator
} from 'lucide-react';
import type { SettlementFormData, SettlementStatus } from '../../types';
import { findGasProvider } from '../../data/gasProviderData';

interface SettlementDashboardProps {
  formData: SettlementFormData;
  onGoElectricity: () => void;
  onGoGas: () => void;
  onGoChecklist: () => void;
  onOpenEstimateCalc: () => void;
}

export const SettlementDashboard: React.FC<SettlementDashboardProps> = ({
  formData,
  onGoElectricity,
  onGoGas,
  onGoChecklist,
  onOpenEstimateCalc
}) => {
  // 사용자가 납부 완료 후 직접 확인할 수 있는 체크 상태
  const [elecConfirmed, setElecConfirmed] = useState(false);
  const [gasConfirmed, setGasConfirmed] = useState(false);

  const gasProvider = findGasProvider(formData.sido, formData.sigungu);

  // 상태 판별 로직
  const getElecStatus = (): { status: SettlementStatus; label: string; color: string } => {
    if (elecConfirmed) {
      return { status: 'confirmed', label: '정산 완료 확인됨', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (!formData.electricityCustomerNo && !formData.electricityMeterReading) {
      return { status: 'not_entered', label: '정보 미입력', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
    return { status: 'need_official', label: '공식 사이트 확인 필요', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  const getGasStatus = (): { status: SettlementStatus; label: string; color: string } => {
    if (gasConfirmed) {
      return { status: 'confirmed', label: '정산 완료 확인됨', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (!formData.gasCustomerNo && !formData.gasMeterReading) {
      return { status: 'not_entered', label: '정보 미입력', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
    return { status: 'need_official', label: '공식 사이트 확인 필요', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  const elecStatusInfo = getElecStatus();
  const gasStatusInfo = getGasStatus();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 상단 통합 대시보드 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
            <span>Integrated Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            통합 정산 결과 대시보드
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            전기(한전)와 도시가스({gasProvider.name})의 실시간 정산 상태를 한눈에 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            화면 인쇄
          </button>
          <button
            onClick={onGoChecklist}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            체크리스트 확인
          </button>
        </div>
      </div>

      {/* 이사 기본 정보 요약 바 */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-1">이사 유형</span>
          <span className="font-bold text-sm text-white">
            {formData.moveType === 'out' ? '전출 (퇴거)' : formData.moveType === 'in' ? '전입 (입주)' : '전출 및 전입 동시'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">이사 기준일</span>
          <span className="font-bold text-sm text-blue-300">
            {formData.moveDate || '미정'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">정산 대상 주소</span>
          <span className="font-bold text-sm text-white truncate block" title={formData.fullAddress}>
            {formData.fullAddress || `${formData.sido} ${formData.sigungu} ${formData.detailAddress}` || '주소 미입력'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">주거 형태</span>
          <span className="font-bold text-sm text-white">
            {formData.housingType === 'apartment' ? '아파트' : formData.housingType === 'officetel' ? '오피스텔' : formData.housingType === 'villa' ? '빌라' : '단독/기타'}
          </span>
        </div>
      </div>

      {/* 2대 항목 상세 대시보드 카드 (전기 & 가스) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 전기 정산 카드 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Zap className="w-5 h-5 fill-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">전기요금 정산</h3>
                  <span className="text-xs text-slate-500">한국전력공사 (국번없이 123)</span>
                </div>
              </div>

              {/* 7종 상태 뱃지 */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${elecStatusInfo.color}`}>
                {elecStatusInfo.label}
              </span>
            </div>

            {/* 금액 영역: 원칙 1 & 4 준수 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 font-medium block">정산 금액 상태</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-amber-600">
                  공식 사이트에서 확인 필요
                </span>
                <button
                  onClick={onOpenEstimateCalc}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  지침으로 예상 계산
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ※ 전기요금은 누진제 일할계산 및 복지할인 적용을 위해 한전 공식 시스템 또는 123 고객센터에서만 정확한 금액 확인이 가능합니다.
              </p>
            </div>

            {/* 입력 정보 요약 */}
            <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">한전 고객번호:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formData.electricityCustomerNo || '미입력 (고지서 확인 필요)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">계량기 검침 지침:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formData.electricityMeterReading ? `${formData.electricityMeterReading} kWh` : '미입력 (이사당일 촬영)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">데이터 출처:</span>
                <span className="text-slate-700">한국전력 공식 서비스 안내</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">조회 기준 시각:</span>
                <span className="text-slate-700">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* 다음에 해야 할 일 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">다음에 해야 할 일</span>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  이사 당일 아침 전기 계량기 사진 촬영
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  국번없이 123 또는 한전ON으로 최종 요금 확정 및 납부
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  납부 문자 또는 영수증을 임대인에게 전달하여 보증금 반환
                </li>
              </ul>
            </div>
          </div>

          {/* 카드 하단 액션 & 정산 완료 체크 버튼 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-xs text-blue-900 font-semibold">공식 납부를 완료하셨나요?</span>
              <button
                type="button"
                onClick={() => setElecConfirmed(!elecConfirmed)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  elecConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {elecConfirmed ? '정산 완료됨 (클릭 시 취소)' : '정산 완료로 표시'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://online.kepco.co.kr"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                한전ON 바로가기
              </a>
              <button
                onClick={onGoElectricity}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                상세 조회
              </button>
            </div>
          </div>
        </div>

        {/* 2. 도시가스 정산 카드 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Flame className="w-5 h-5 fill-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">도시가스 정산</h3>
                  <span className="text-xs text-amber-700 font-semibold">{gasProvider.name} ({gasProvider.tel})</span>
                </div>
              </div>

              {/* 7종 상태 뱃지 */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${gasStatusInfo.color}`}>
                {gasStatusInfo.label}
              </span>
            </div>

            {/* 금액 영역 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 font-medium block">정산 금액 상태</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-amber-600">
                  공식 사이트에서 확인 필요
                </span>
                <button
                  onClick={onOpenEstimateCalc}
                  className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  지침으로 예상 계산
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ※ 도시가스는 방문 기사의 가스레인지 호스 분리 및 안전마개 시공 후 현장 결제 또는 관할 가스사 가상계좌로 수납됩니다.
              </p>
            </div>

            {/* 입력 정보 요약 */}
            <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">관할 가스사:</span>
                <span className="font-bold text-amber-700">{gasProvider.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">고객/계약번호:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formData.gasCustomerNo || '미입력 (고지서 확인 필요)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">가스 계량기 지침:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formData.gasMeterReading ? `${formData.gasMeterReading} m³` : '미입력 (이사당일 촬영)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">전출 방문예약 필요:</span>
                <span className="text-amber-700 font-semibold">필수 (안전마개 시공)</span>
              </div>
            </div>

            {/* 다음에 해야 할 일 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">다음에 해야 할 일</span>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  {gasProvider.name}({gasProvider.tel})에 이사 2~3일 전 전출 방문 예약
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  기사 방문 시 가스레인지 철거 및 계량기 최종 지침 대조
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  현장 카드결제 또는 전용 가상계좌로 완납 영수증 수령
                </li>
              </ul>
            </div>
          </div>

          {/* 카드 하단 액션 & 정산 완료 체크 버튼 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <span className="text-xs text-amber-950 font-semibold">기사 방문 및 정산을 마치셨나요?</span>
              <button
                type="button"
                onClick={() => setGasConfirmed(!gasConfirmed)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  gasConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {gasConfirmed ? '정산 완료됨 (클릭 시 취소)' : '정산 완료로 표시'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={gasProvider.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {gasProvider.name} 바로가기
              </a>
              <button
                onClick={onGoGas}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                상세 조회
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
