import React from 'react';
import { Info, Phone, ExternalLink, Lock, Trash2 } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenCustomerSupport: () => void;
  onClearStorage: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenCustomerSupport,
  onClearStorage
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* 브랜드 및 서비스 소개 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">이사 정산 도우미</span>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-semibold border border-blue-700/50">
                공공 편의 안내 웹서비스
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              대한민국 주거 이사 당일, 복잡하게 분산된 전기요금(한국전력)과 지역별 도시가스 공급사의 정산 절차, 필요 준비물, 계량기 지침 확인법을 원스톱으로 지원합니다.
            </p>
            <div className="flex items-center gap-4 text-xs pt-2">
              <button
                onClick={onOpenPrivacy}
                className="text-slate-300 hover:text-white underline underline-offset-4 flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                개인정보 처리방침
              </button>
              <button
                onClick={onOpenCustomerSupport}
                className="text-slate-300 hover:text-white underline underline-offset-4 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                공식 고객센터 목록
              </button>
              <button
                onClick={() => {
                  if (confirm('브라우저에 임시 저장된 입력 데이터와 체크리스트를 모두 삭제하시겠습니까?')) {
                    onClearStorage();
                    alert('저장된 데이터가 초기화되었습니다.');
                  }
                }}
                className="text-slate-400 hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                로컬 데이터 초기화
              </button>
            </div>
          </div>

          {/* 주요 공식 사이트 링크 */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">공식 정산 서비스</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://online.kepco.co.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  한전ON (전기요금 이사정산)
                </a>
              </li>
              <li>
                <a
                  href="http://www.citygas.or.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  한국도시가스협회 공식
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  정부24 (전입신고 안내)
                </a>
              </li>
            </ul>
          </div>

          {/* 긴급 연락처 */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">공식 콜센터 안내</h4>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400">전기 (한전 고객센터):</span>
                <span className="text-white font-bold ml-1.5">국번없이 123</span>
              </div>
              <div>
                <span className="text-slate-400">도시가스 협회 안내:</span>
                <span className="text-white font-bold ml-1.5">02-554-7721</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                ※ 관할 도시가스사별 직통 전화는 상단 [고객지원]에서 조회 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 법적 고지 및 책임의 한계 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            법적 고지 및 서비스 책임의 한계
          </div>
          <p>
            본 웹서비스는 이사 당일 전기 및 도시가스 요금 정산에 필요한 정보와 절차를 안내하는 독립적인 보조 도구입니다. 실제 요금 청구, 수납, 가상계좌 발급, 공급 계약의 승계 및 명의변경의 법적 효력은 한국전력공사 및 지역별 도시가스 공급사의 공식 확인 절차를 거쳐야만 유효합니다.
          </p>
          <p>
            제공되는 예상 요금 및 시뮬레이션 수치는 사용자가 입력한 지침을 기반으로 한 참고용 단순 추정치이며, 실제 고지서상의 금액과 차이가 발생할 수 있습니다.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 이사 정산 도우미. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            사용자 입력 데이터는 브라우저 내부 로컬스토리지에만 보관됩니다.
          </p>
        </div>
      </div>
    </footer>
  );
};
