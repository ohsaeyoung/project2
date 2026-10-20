import React, { useState } from 'react';
import { 
  Zap, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calculator, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import type { SettlementFormData, ElectricityQueryResult } from '../../types';
import { api } from '../../services/api';

interface ElectricityViewProps {
  formData: SettlementFormData;
  onUpdateFormData: (updated: Partial<SettlementFormData>) => void;
  onOpenMeterGuide: () => void;
  onOpenEstimateCalc: () => void;
}

export const ElectricityView: React.FC<ElectricityViewProps> = ({
  formData,
  onUpdateFormData,
  onOpenMeterGuide,
  onOpenEstimateCalc
}) => {
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<ElectricityQueryResult | null>(null);
  const [custNoInput, setCustNoInput] = useState(formData.electricityCustomerNo);
  const [meterInput, setMeterInput] = useState(formData.electricityMeterReading);
  const [showPrepModal, setShowPrepModal] = useState(false);

  // 조회 요청 핸들러
  const handleQuery = async () => {
    setLoading(true);
    try {
      // 폼 데이터 동기화
      onUpdateFormData({
        electricityCustomerNo: custNoInput,
        electricityMeterReading: meterInput
      });

      const res = await api.checkElectricity({
        customerNo: custNoInput,
        meterReading: meterInput,
        address: formData.fullAddress || `${formData.sido} ${formData.sigungu} ${formData.detailAddress}`,
        moveDate: formData.moveDate || new Date().toISOString().split('T')[0]
      });
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 상단 헤더 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Zap className="w-6 h-6 fill-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">한국전력공사 (KEPCO)</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  전국 단일 공급
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                전기요금 이사 정산
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://online.kepco.co.kr"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              한전ON에서 조회하기
            </a>
            <button
              onClick={() => setShowPrepModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              정산 준비물 확인하기
            </button>
          </div>
        </div>

        {/* 현재 입력 정보 요약 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">전기사용 주소</span>
            <span className="font-bold text-slate-900 truncate block" title={formData.fullAddress}>
              {formData.fullAddress || `${formData.sido} ${formData.sigungu} ${formData.detailAddress}` || '주소 미입력'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">이사 기준일</span>
            <span className="font-bold text-slate-900 block">
              {formData.moveDate || '미지정'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">고객번호 입력 상태</span>
            <span className={`font-bold block ${custNoInput ? 'text-blue-600' : 'text-slate-400'}`}>
              {custNoInput ? custNoInput : '미입력 (확인 필요)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">계량기 지침 상태</span>
            <span className={`font-bold block ${meterInput ? 'text-blue-600' : 'text-slate-400'}`}>
              {meterInput ? `${meterInput} kWh` : '미입력'}
            </span>
          </div>
        </div>
      </div>

      {/* 입력 및 조회 패널 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900">고객번호 및 계량기 지침 입력·수정</h2>
          <button
            onClick={onOpenMeterGuide}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            전기 계량기 지침 보는 법
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              한전 고객번호 (10자리)
            </label>
            <input
              type="text"
              placeholder="예: 01-2345-6789"
              value={custNoInput}
              onChange={e => setCustNoInput(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              💡 아파트의 경우 관리비에 포함되어 정산되는 단지는 한전 고객번호가 개별 부여되지 않을 수 있습니다.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              이사 당일 계량기 지침 (kWh)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="예: 4821 (소수점 제외)"
                value={meterInput}
                onChange={e => setMeterInput(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={onOpenEstimateCalc}
                title="참고용 예상 계산기"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                예상 계산
              </button>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              전력량계 화면의 <strong>[07번 또는 04번]</strong> 숫자 또는 회전판의 검은색 숫자를 입력합니다.
            </span>
          </div>
        </div>

        {/* 조회 요청 버튼 */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleQuery}
            disabled={loading}
            className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                한전 연동 확인 중...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>전기요금 조회 요청</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 조회 결과 또는 미연결 상태 안내 영역 */}
      {queryResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900">전기요금 조회 결과</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                queryResult.isConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {queryResult.isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {queryResult.status === 'success' ? '조회 성공' : '조회 상태 확인'}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  공식 사이트 확인 필요
                </>
              )}
            </span>
          </div>

          {/* 원칙 준수 미연결 안내 박스 */}
          {!queryResult.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-2 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  실시간 요금 조회 기능이 아직 연결되지 않았습니다.
                </div>
                <p>
                  실제 정산 금액은 <strong>한국전력 공식 서비스(한전ON)</strong> 또는 <strong>고객센터(국번없이 123)</strong>를 통해 확인해 주세요.
                </p>
                <div className="pt-2 text-[11px] text-amber-800 border-t border-amber-200/60">
                  데이터 출처: {queryResult.dataSource} • 조회 기준시각: {new Date(queryResult.queryTime || '').toLocaleString('ko-KR')}
                </div>
              </div>

              {/* 공식 한전ON 버튼과 123 전화 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://online.kepco.co.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  한전ON 이사정산 바로가기
                </a>

                <a
                  href="tel:123"
                  className="py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  국번없이 123 유선 정산
                </a>
              </div>
            </div>
          ) : (
            // 실시간 연동 또는 시뮬레이션 성공 결과
            <div className="space-y-4">
              {queryResult.dataSource.includes('시뮬레이션') && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>[테스트 시뮬레이션 환경]:</strong> 본 결과는 검증을 위한 가상 데이터이며 실제 청구 금액이 아닙니다.
                  </span>
                </div>
              )}

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {queryResult.dataSource.includes('시뮬레이션') ? '가상 산정 금액' : '실시간 조회 확정 요금'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-blue-600">
                      {queryResult.actualAmount?.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-slate-800">원</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    당월 사용량: <strong>{queryResult.usageKwh} kWh</strong> 기준
                  </span>
                </div>

                <div className="text-right text-xs text-slate-500 space-y-1">
                  <div>데이터 출처: {queryResult.dataSource}</div>
                  <div>조회 시각: {new Date(queryResult.queryTime || '').toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* 다음 해야 할 일 단계별 안내 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              다음에 해야 할 일 (전기 정산 가이드)
            </h4>
            <div className="space-y-2">
              {queryResult.nextActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-5">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 전기 정산 방법 3가지 비교 가이드 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-slate-900">전기요금 정산 3가지 방식 안내</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              1. 123 유선 전화 정산 (가장 간편)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              이사 당일 오전 9시 이후 국번없이 123에 전화하여 "이사 정산"을 요청하고 고객번호와 계량기 지침을 구두로 전달하면 전용 계좌를 즉시 문자로 수신합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              2. 한전ON 인터넷 신청
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              한전ON(online.kepco.co.kr)에 접속하여 본인인증 후 [이사정산] 메뉴에서 계량기 지침을 입력하고 즉시 신용카드 또는 계좌이체로 납부합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              3. 아파트 관리사무소 정산
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              아파트의 경우 한전에 개별 정산하지 않고, 관리사무소에서 이사 당일 일괄 검침 후 '중간관리비 고지서'로 정산하는 경우가 대부분입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 정산 준비물 모달 */}
      {showPrepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">전기요금 정산 필수 준비물</h3>
            <ul className="text-xs text-slate-700 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">✓</span>
                <div>
                  <strong>한전 고객번호 10자리:</strong> 종이 고지서 또는 한전ON에서 확인
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">✓</span>
                <div>
                  <strong>이사 당일 계량기 검침값:</strong> 정수 부분 숫자 (스마트폰 사진 보관)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">✓</span>
                <div>
                  <strong>결제 수단:</strong> 신용카드, 체크카드 또는 계좌이체 준비
                </div>
              </li>
            </ul>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrepModal(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
