import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, ShieldAlert } from 'lucide-react';
import type { ApiStatusResponse } from '../../services/api';
import { api } from '../../services/api';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ApiStatusResponse | null;
  onRefresh: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh
}) => {
  const [kepcoMock, setKepcoMock] = useState(false);
  const [gasMock, setGasMock] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (status) {
      setKepcoMock(status.electricity.hasMockEnabled);
      setGasMock(status.gas.hasMockEnabled);
    }
  }, [status]);

  if (!isOpen) return null;

  const handleToggle = async (type: 'kepco' | 'gas', nextVal: boolean) => {
    setLoading(true);
    try {
      if (type === 'kepco') {
        setKepcoMock(nextVal);
        await api.toggleSimulation({ enableKepco: nextVal });
      } else {
        setGasMock(nextVal);
        await api.toggleSimulation({ enableGas: nextVal });
      }
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">API 연동 아키텍처 및 상태 진단</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed text-slate-600">
            <strong>원칙 준수 상태:</strong> 실제 제휴 또는 공공 API 키가 등록되지 않은 기본 상태에서는 모든 실시간 조회가 <strong>[실시간 조회 미연결 / 공식 사이트 확인 필요]</strong> 상태로 안전하게 작동하며, 임의의 요금을 실제처럼 표시하지 않습니다.
          </div>

          {/* 한전 상태 */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                ⚡ 한국전력공사 (KEPCO) 연동 계층
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                  status?.electricity.isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status?.electricity.isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    API 키 등록됨
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    실시간 조회 미연결
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              인증 방식: 공공데이터포털 / KEPCO Open API 키 (환경변수 <code>KEPCO_API_KEY</code>)
            </p>

            {/* 시뮬레이션 토글 */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  검증용 시뮬레이션 응답 활성화
                </span>
                <span className="text-[11px] text-slate-500">
                  실제 API 응답 형식을 테스트용 가상 데이터로 검증합니다.
                </span>
              </div>
              <button
                disabled={loading}
                onClick={() => handleToggle('kepco', !kepcoMock)}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                {kepcoMock ? (
                  <ToggleRight className="w-7 h-7 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* 도시가스 상태 */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                🔥 도시가스 (전국 34개 사업자) 연동 계층
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                  status?.gas.isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status?.gas.isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    제휴 연동됨
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    실시간 조회 미연결
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              인증 방식: 공급사별 개별 제휴 또는 전자청구서 API (환경변수 <code>CITYGAS_API_KEY</code>)
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  검증용 시뮬레이션 응답 활성화
                </span>
                <span className="text-[11px] text-slate-500">
                  가스 공급사 응답 형식을 테스트용 가상 데이터로 검증합니다.
                </span>
              </div>
              <button
                disabled={loading}
                onClick={() => handleToggle('gas', !gasMock)}
                className="text-slate-600 hover:text-amber-600 transition-colors"
              >
                {gasMock ? (
                  <ToggleRight className="w-7 h-7 text-amber-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              시뮬레이션 모드가 켜진 경우에도 화면에 <strong>[테스트 시뮬레이션 데이터]</strong>로 명확히 표시되어 실제 요금과 절대 혼동되지 않도록 설계되어 있습니다.
            </div>
          </div>
        </div>

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
