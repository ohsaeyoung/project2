import { useState } from 'react';
import { 
  Flame, 
  ExternalLink, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calculator, 
  Search,
  Wrench
} from 'lucide-react';
import type { SettlementFormData, GasQueryResult } from '../../types';
import { findGasProvider } from '../../data/gasProviderData';
import { api } from '../../services/api';

interface GasViewProps {
  formData: SettlementFormData;
  onUpdateFormData: (updated: Partial<SettlementFormData>) => void;
  onOpenMeterGuide: () => void;
  onOpenEstimateCalc: () => void;
  onOpenCustomerSupport: () => void;
}

export const GasView: React.FC<GasViewProps> = ({
  formData,
  onUpdateFormData,
  onOpenMeterGuide,
  onOpenEstimateCalc,
  onOpenCustomerSupport
}) => {
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<GasQueryResult | null>(null);
  const [custNoInput, setCustNoInput] = useState(formData.gasCustomerNo);
  const [meterInput, setMeterInput] = useState(formData.gasMeterReading);
  const [showReserveModal, setShowReserveModal] = useState(false);

  // 주소 기반 공급사 확인
  const provider = findGasProvider(formData.sido, formData.sigungu);

  // 조회 요청 핸들러
  const handleQuery = async () => {
    setLoading(true);
    try {
      onUpdateFormData({
        gasCustomerNo: custNoInput,
        gasMeterReading: meterInput
      });

      const res = await api.checkGas({
        customerNo: custNoInput,
        meterReading: meterInput,
        sido: formData.sido,
        sigungu: formData.sigungu,
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
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Flame className="w-6 h-6 fill-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">
                  {provider.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                  지역 독점 공급
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                도시가스 이사 정산
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={provider.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              공식 홈페이지에서 요금 조회
            </a>
            <button
              onClick={() => setShowReserveModal(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              전출 예약 안내
            </button>
            <button
              onClick={onOpenCustomerSupport}
              className="px-3 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              우리 지역 도시가스사 찾기
            </button>
          </div>
        </div>

        {/* 현재 입력 정보 요약 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">도시가스 사용 주소</span>
            <span className="font-bold text-slate-900 truncate block" title={formData.fullAddress}>
              {formData.fullAddress || `${formData.sido} ${formData.sigungu} ${formData.detailAddress}` || '주소 미입력'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">관할 공급사</span>
            <span className="font-bold text-amber-700 block truncate">
              {provider.name}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">고객번호/계약번호</span>
            <span className={`font-bold block ${custNoInput ? 'text-amber-700' : 'text-slate-400'}`}>
              {custNoInput || '미입력 (확인 필요)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block mb-1">가스 계량기 지침</span>
            <span className={`font-bold block ${meterInput ? 'text-amber-700' : 'text-slate-400'}`}>
              {meterInput ? `${meterInput} m³` : '미입력'}
            </span>
          </div>
        </div>

        {/* 전출 방문 예약 필수 안내 경고 배너 */}
        <div className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Wrench className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>안전조치 의무사항 (전출 방문 예약 필수):</strong> 도시가스는 가스레인지 철거 시 안전마개(플러그) 봉인 시공이 법적 필수입니다. <strong>이사 2~3일 전</strong> 관할 공급사({provider.name}: {provider.tel})에 방문기사 예약을 접수해야 합니다.
          </div>
        </div>
      </div>

      {/* 입력 및 조회 패널 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900">도시가스 고객번호 및 계량기 지침 입력·수정</h2>
          <button
            onClick={onOpenMeterGuide}
            className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            가스 계량기 지침 보는 법
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {provider.name} 고객번호 / 사용계약번호
            </label>
            <input
              type="text"
              placeholder="예: 1002-345-6789"
              value={custNoInput}
              onChange={e => setCustNoInput(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              ※ 종이 고지서 또는 카카오톡 전자청구서에서 계약번호(고객번호) 확인 가능
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              이사 당일 계량기 지침 (m³)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="예: 1385 (빨간 테두리 제외)"
                value={meterInput}
                onChange={e => setMeterInput(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
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
              가스 계량기의 <strong>빨간색 상자(소수점 이하)를 제외한</strong> 앞자리 숫자만 입력합니다.
            </span>
          </div>
        </div>

        {/* 조회 요청 버튼 */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleQuery}
            disabled={loading}
            className="w-full sm:flex-1 py-3.5 px-6 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-2xl text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {provider.name} 연동 확인 중...
              </span>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                <span>도시가스 요금 조회 요청</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 조회 결과 또는 미연결 상태 안내 */}
      {queryResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900">도시가스 요금 조회 결과</h3>
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

          {/* 원칙 준수: 실시간 조회 미연결 상태 표시 */}
          {!queryResult.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-2 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  실시간 요금 조회 기능이 아직 연결되지 않았습니다.
                </div>
                <p>
                  실제 정산 금액과 기사 방문 예약은 <strong>{provider.name} 공식 서비스</strong> 또는 <strong>고객센터({provider.tel})</strong>를 통해 확인해 주세요.
                </p>
                <div className="pt-2 text-[11px] text-amber-800 border-t border-amber-200/60">
                  데이터 출처: {queryResult.dataSource} • 조회 기준시각: {new Date(queryResult.queryTime || '').toLocaleString('ko-KR')}
                </div>
              </div>

              {/* 공식 공급사 홈페이지 및 고객센터 전화 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {provider.name} 공식 홈페이지 이동
                </a>

                <a
                  href={`tel:${provider.tel.replace(/[^0-9]/g, '')}`}
                  className="py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  고객센터 전화 ({provider.tel})
                </a>
              </div>
            </div>
          ) : (
            // 실시간 연동 또는 시뮬레이션 성공
            <div className="space-y-4">
              {queryResult.dataSource.includes('시뮬레이션') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
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
                    <span className="text-3xl font-black text-amber-600">
                      {queryResult.actualAmount?.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-slate-800">원</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    당월 사용량: <strong>{queryResult.usageM3} m³</strong> 기준
                  </span>
                </div>

                <div className="text-right text-xs text-slate-500 space-y-1">
                  <div>공급사: {provider.name}</div>
                  <div>데이터 출처: {queryResult.dataSource}</div>
                  <div>조회 시각: {new Date(queryResult.queryTime || '').toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* 다음 해야 할 일 단계별 안내 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              다음에 해야 할 일 (도시가스 정산 가이드)
            </h4>
            <div className="space-y-2">
              {queryResult.nextActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-5">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 도시가스 전출 절차 4단계 카드 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-slate-900">도시가스 이사 정산 표준 절차</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-600">Step 1. D-3</span>
            <div className="font-bold text-xs text-slate-900">방문 예약 접수</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              이사 2~3일 전 관할 가스사에 전화 또는 홈페이지로 기사 방문 일정을 잡습니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-600">Step 2. 이사 당일</span>
            <div className="font-bold text-xs text-slate-900">안전마개 시공</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              기사님이 호스를 분리하고 가스 누출 방지 플러그(마개)를 봉인 마감합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-600">Step 3. 당일 현장 정산</span>
            <div className="font-bold text-xs text-slate-900">계량기 검침 & 결제</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              기사님 입회하에 지침을 확인하고 카드 또는 전용 계좌로 당일까지의 요금을 완납합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-emerald-600">Step 4. 새 집 전입</span>
            <div className="font-bold text-xs text-slate-900">새 관할 가스사 연결</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              새 주소지의 관할 가스사에 전입신청을 하고 가스레인지 연결 및 안전점검을 받습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 전출 예약 안내 모달 */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">도시가스 전출 방문 예약 안내</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              도시가스 전출 예약은 가스안전관리법에 따른 방문 작업이 수반되므로 공식 시스템을 통해 접수해야 합니다.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div>• <strong>관할 공급사:</strong> {provider.name}</div>
              <div>• <strong>전화 예약:</strong> {provider.tel}</div>
              <div>• <strong>권장 예약 시점:</strong> 이사 2~3일 전 사전 신청</div>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowReserveModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                닫기
              </button>
              <a
                href={provider.moveOutUrl || provider.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                공식 예약 사이트 이동
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
