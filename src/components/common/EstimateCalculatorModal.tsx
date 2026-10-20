import React, { useState } from 'react';
import { X, Calculator, Zap, Flame, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface EstimateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'electricity' | 'gas';
}

export const EstimateCalculatorModal: React.FC<EstimateCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'electricity'
}) => {
  const [type, setType] = useState<'electricity' | 'gas'>(defaultType);
  const [prevReading, setPrevReading] = useState('');
  const [currReading, setCurrReading] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setType(defaultType);
    setResult(null);
    setError('');
  }, [defaultType, isOpen]);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const prev = Number(prevReading);
    const curr = Number(currReading);

    if (isNaN(prev) || isNaN(curr)) {
      setError('숫자 지침을 정확히 입력해 주세요.');
      return;
    }

    if (curr < prev) {
      setError('당월 지침 숫자는 전월 지침 숫자보다 크거나 같아야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.estimateFee({
        type,
        prevReading: prev,
        currentReading: curr
      });
      setResult(res);
    } catch {
      setError('계산 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">지침 기반 참고용 예상 요금 계산기</h3>
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
            onClick={() => { setType('electricity'); setResult(null); }}
            className={`flex-1 py-3 text-center font-medium text-xs flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              type === 'electricity'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-blue-600" />
            전기요금 (주택용 저압)
          </button>
          <button
            onClick={() => { setType('gas'); setResult(null); }}
            className={`flex-1 py-3 text-center font-medium text-xs flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              type === 'gas'
                ? 'border-amber-600 text-amber-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600" />
            도시가스 (개별난방)
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>참고용 예상 안내:</strong> 본 계산 결과는 단순 지침 차이에 의한 추정치이며, 실제 정산 금액(일할계산, 누진구간 일수, 할인 등)과 다를 수 있습니다. 실제 납부는 반드시 공식 채널을 이용하세요.
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  전월 검침 지침 ({type === 'electricity' ? 'kWh' : 'm³'})
                </label>
                <input
                  type="number"
                  placeholder="예: 2500"
                  value={prevReading}
                  onChange={e => setPrevReading(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">고지서의 전월검침값</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  당일 계량기 지침 ({type === 'electricity' ? 'kWh' : 'm³'})
                </label>
                <input
                  type="number"
                  placeholder="예: 2680"
                  value={currReading}
                  onChange={e => setCurrReading(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">이사 당일 촬영한 지침</span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Calculator className="w-4 h-4" />
              참고용 예상 금액 계산하기
            </button>
          </form>

          {/* 계산 결과 */}
          {result && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-600">추정 사용량</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {result.usageKwh || result.usageM3} {type === 'electricity' ? 'kWh' : 'm³'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">
                    참고용 예상 금액
                  </span>
                  <span className="text-[11px] text-slate-500">부가세 및 전력기금 포함 추정</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-blue-600">
                    약 {result.estimatedAmount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-blue-900 ml-1">원</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <p>• <strong>계산 기준:</strong> {result.calculationBasis}</p>
                <p>• <strong>한계 및 유의사항:</strong> {result.calculationLimit}</p>
                <p className="text-blue-700 font-semibold">• {result.notice}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
