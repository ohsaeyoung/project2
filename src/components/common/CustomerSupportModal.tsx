import React, { useState } from 'react';
import { X, Phone, Globe, Search, Headphones, ExternalLink, Zap } from 'lucide-react';
import { GAS_PROVIDERS } from '../../data/gasProviderData';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredGas = GAS_PROVIDERS.filter(p => 
    p.name.includes(search) || 
    p.regions.some(r => r.includes(search)) ||
    p.tel.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg">공식 고객센터 & 공급사 연락처 안내</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* 한전 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-600 text-white rounded-lg">
                  <Zap className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-blue-950 text-base">한국전력공사 (전기 정산)</h4>
              </div>
              <p className="text-xs text-blue-800 mt-1">
                전국 단일 공급 • 이사 당일 유선 정산 및 한전ON 웹 신청 가능 (365일 24시간 상담)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:123"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                국번없이 123
              </a>
              <a
                href="https://online.kepco.co.kr"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg text-xs flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                한전ON
              </a>
            </div>
          </div>

          {/* 도시가스 검색 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-sm">전국 도시가스사 고객센터 (34개사)</h4>
              <span className="text-xs text-slate-500">지역별 독점 공급</span>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="지역명 또는 도시가스사 이름 검색 (예: 강남, 수원, 삼천리)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredGas.map(p => (
                <div
                  key={p.id}
                  className="p-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {p.regions.slice(0, 3).join(', ')} {p.regions.length > 3 ? `외 ${p.regions.length - 3}개 지역` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={`tel:${p.tel.replace(/[^0-9]/g, '')}`}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg text-xs flex items-center gap-1 border border-amber-200"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      {p.tel}
                    </a>
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      웹사이트
                    </a>
                  </div>
                </div>
              ))}
              {filteredGas.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">
                  검색 결과가 없습니다. 시/도 명칭을 입력해 보세요.
                </div>
              )}
            </div>
          </div>
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
