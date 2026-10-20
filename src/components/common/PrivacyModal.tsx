import React from 'react';
import { X, ShieldCheck, Lock, Trash2, AlertTriangle } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearStorage?: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearStorage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg">개인정보 처리방침 및 데이터 보호 안내</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
            <strong>안심 보호 원칙:</strong> 본 '이사 정산 도우미'는 사용자의 주민등록번호, 계좌 비밀번호, 결제정보 등 민감한 금융/신용정보를 절대 요구하거나 저장하지 않습니다.
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-blue-600" /> 1. 수집 항목 및 목적
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>이사 정보 (이사 유형, 주소, 주거형태, 날짜):</strong> 관할 도시가스 공급사 판별 및 정산 체크리스트 가이드 생성 목적</li>
              <li><strong>고객번호 및 계량기 지침:</strong> 실시간 조회 API 요청 매개변수 및 예상 요금 산출 참고용 (선택 입력)</li>
              <li><strong>체크리스트 진행 상태:</strong> 브라우저 재방문 시 편의 제공 목적</li>
            </ul>

            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm pt-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> 2. 저장 위치 및 보관 기간
            </h4>
            <p className="text-xs text-slate-600">
              사용자가 입력한 모든 정보는 외부 데이터베이스에 보관되지 않으며, 사용자의 웹 브라우저(LocalStorage / Session) 내에만 일시적으로 보관됩니다. 브라우저 캐시 삭제 또는 하단 데이터 초기화 버튼을 누르면 즉시 완전히 파기됩니다.
            </p>

            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm pt-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> 3. 계량기 사진 첨부 시 유의사항
            </h4>
            <p className="text-xs text-slate-600">
              계량기 사진 업로드 시 스마트폰 카메라의 위치 메타데이터(EXIF)나 주변 개인정보가 포함될 수 있습니다. 본 서비스는 사진을 서버로 전송하지 않고 브라우저 메모리 상에서만 미리보기로 띄우며, 정산 증빙용으로 본인이 직접 보관할 수 있도록 돕습니다.
            </p>
          </div>

          {onClearStorage && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                <div>
                  <div className="text-xs font-bold text-red-900">로컬 저장 데이터 초기화</div>
                  <div className="text-xs text-red-700">체크리스트 진행상황 및 입력폼 임시 저장값을 삭제합니다.</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('저장된 체크리스트와 입력 데이터를 초기화하시겠습니까?')) {
                      onClearStorage();
                      alert('모든 저장 데이터가 삭제되었습니다.');
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  데이터 초기화
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
