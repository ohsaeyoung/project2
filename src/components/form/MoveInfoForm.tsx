import React, { useState, useEffect } from 'react';
import type { 
  MoveType, 
  HousingType, 
  SettlementFormData 
} from '../../types';
import { KOREAN_DISTRICTS } from '../../data/koreanDistricts';
import { findGasProvider } from '../../data/gasProviderData';
import { 
  Calendar, 
  MapPin, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Camera, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  X,
  HelpCircle
} from 'lucide-react';

interface MoveInfoFormProps {
  initialData: SettlementFormData;
  onSubmit: (data: SettlementFormData) => void;
  onOpenMeterGuide: (tab: 'electricity' | 'gas') => void;
}

export const MoveInfoForm: React.FC<MoveInfoFormProps> = ({
  initialData,
  onSubmit,
  onOpenMeterGuide
}) => {
  const [formData, setFormData] = useState<SettlementFormData>(initialData);
  const [selectedSido, setSelectedSido] = useState(initialData.sido || '서울특별시');
  const [selectedSigungu, setSelectedSigungu] = useState(initialData.sigungu || '강남구');
  const [elecPhotoPreview, setElecPhotoPreview] = useState<string | null>(null);
  const [gasPhotoPreview, setGasPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 관할 도시가스사 자동 추천
  const matchedGasProvider = findGasProvider(selectedSido, selectedSigungu);

  // 시도 변경 시 시군구 기본값 갱신
  const handleSidoChange = (sido: string) => {
    setSelectedSido(sido);
    const district = KOREAN_DISTRICTS.find(d => d.sido === sido);
    const newSigungu = district && district.sigunguList.length > 0 ? district.sigunguList[0] : '';
    setSelectedSigungu(newSigungu);
    setFormData(prev => ({
      ...prev,
      sido,
      sigungu: newSigungu,
      gasProviderId: findGasProvider(sido, newSigungu).id,
      gasProviderName: findGasProvider(sido, newSigungu).name
    }));
  };

  const handleSigunguChange = (sigungu: string) => {
    setSelectedSigungu(sigungu);
    setFormData(prev => ({
      ...prev,
      sigungu,
      gasProviderId: findGasProvider(selectedSido, sigungu).id,
      gasProviderName: findGasProvider(selectedSido, sigungu).name
    }));
  };

  useEffect(() => {
    if (!formData.gasProviderName && matchedGasProvider) {
      setFormData(prev => ({
        ...prev,
        gasProviderId: matchedGasProvider.id,
        gasProviderName: matchedGasProvider.name
      }));
    }
  }, [matchedGasProvider]);

  // 빠른 날짜 선택 버튼 헬퍼
  const setQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const dateStr = d.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, moveDate: dateStr }));
  };

  // 사진 업로드 핸들러 (브라우저 메모리 로컬 미리보기)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'electricity' | 'gas') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'electricity') {
        setElecPhotoPreview(url);
        setFormData(prev => ({ ...prev, electricityMeterPhotoName: file.name }));
      } else {
        setGasPhotoPreview(url);
        setFormData(prev => ({ ...prev, gasMeterPhotoName: file.name }));
      }
    }
  };

  // 유효성 검사 및 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.moveDate) {
      newErrors.moveDate = '이사 날짜를 선택해 주세요.';
    }
    if (!selectedSido || !selectedSigungu) {
      newErrors.address = '시·도 및 시·군·구를 선택해 주세요.';
    }
    if (!formData.detailAddress && !formData.fullAddress) {
      newErrors.detailAddress = '동·호수 또는 도로명 상세주소를 입력해 주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const fullAddr = `${selectedSido} ${selectedSigungu} ${formData.detailAddress}`.trim();
    const submission: SettlementFormData = {
      ...formData,
      sido: selectedSido,
      sigungu: selectedSigungu,
      fullAddress: fullAddr,
      gasProviderId: matchedGasProvider.id,
      gasProviderName: matchedGasProvider.name
    };

    onSubmit(submission);
  };

  const currentDistrict = KOREAN_DISTRICTS.find(d => d.sido === selectedSido);

  const housingOptions: { id: HousingType; label: string; desc: string }[] = [
    { id: 'apartment', label: '아파트', desc: '관리비 포함 여부 확인 필요' },
    { id: 'officetel', label: '오피스텔', desc: '개별 또는 일괄 부과' },
    { id: 'villa', label: '빌라 / 다세대', desc: '개별 계량기 개별 정산' },
    { id: 'oneroom', label: '원룸 / 도시형', desc: '임대인 또는 관리비 정산' },
    { id: 'house', label: '단독 / 다가구', desc: '가구별 분리검침 확인' },
    { id: 'other', label: '기타 주거', desc: '상가주택 등' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 상단 타이틀 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
          <span>Step 1. 이사 정보 입력</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          이사 정산 대상 정보 입력
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          정확한 정산 가이드와 관할 도시가스사 연결을 위해 필요한 기본 정보를 입력해 주세요. 고객번호나 계량기 지침은 아직 확인 전이어도 다음 단계로 이동할 수 있습니다.
        </p>

        {/* 개인정보 안내 박스 */}
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>개인정보 안심 수집:</strong> 입력하신 주소와 고객번호는 실시간 조회 매개변수 생성 및 사용자 브라우저에만 일시 보관되며 외부 서버에 영구 수집·저장되지 않습니다.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 필수 항목 카드 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="font-bold text-base text-slate-900">1. 필수 항목</h2>
            <span className="text-xs text-slate-400 font-normal ml-auto">* 필수 입력 항목입니다.</span>
          </div>

          {/* 1) 이사 유형 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              이사 유형 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'out', label: '전출 (나가는 집)', desc: '현재 집 요금 정산' },
                { id: 'in', label: '전입 (들어가는 집)', desc: '새 집 명의변경' },
                { id: 'both', label: '전출 및 전입 (동시)', desc: '이사 당일 양쪽 처리' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, moveType: item.id as MoveType })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.moveType === item.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{item.label}</span>
                    {formData.moveType === item.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2) 이사 날짜 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800">
                이사 날짜 (정산 기준일) <span className="text-red-500">*</span>
              </label>
              {/* 퀵 버튼 */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  내일
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  7일 뒤
                </button>
              </div>
            </div>

            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={formData.moveDate}
                onChange={e => {
                  setFormData({ ...formData, moveDate: e.target.value });
                  if (errors.moveDate) setErrors({ ...errors, moveDate: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.moveDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.moveDate && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.moveDate}
              </p>
            )}
          </div>

          {/* 3) 주소 입력 */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              정산 대상 주소 <span className="text-red-500">*</span>
            </label>

            {/* 시도 / 시군구 드롭다운 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">시·도 선택</span>
                <select
                  value={selectedSido}
                  onChange={e => handleSidoChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {KOREAN_DISTRICTS.map(d => (
                    <option key={d.sido} value={d.sido}>
                      {d.sido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">시·군·구 선택</span>
                <select
                  value={selectedSigungu}
                  onChange={e => handleSigunguChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {currentDistrict?.sigunguList.map(sg => (
                    <option key={sg} value={sg}>
                      {sg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 상세 주소 */}
            <div>
              <span className="text-[11px] text-slate-500 mb-1 block">상세 주소 (도로명, 아파트명/동/호수)</span>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="예: 테헤란로 123, 101동 1204호"
                  value={formData.detailAddress}
                  onChange={e => {
                    setFormData({ ...formData, detailAddress: e.target.value });
                    if (errors.detailAddress) setErrors({ ...errors, detailAddress: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.detailAddress
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.detailAddress && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.detailAddress}
                </p>
              )}
            </div>

            {/* 자동 판별된 도시가스사 안내 뱃지 */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span className="text-amber-900">
                  주소지 관할 도시가스사: <strong>{matchedGasProvider.name}</strong> ({matchedGasProvider.tel})
                </span>
              </div>
              <span className="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-medium">
                지역 자동 매핑됨
              </span>
            </div>
          </div>

          {/* 4) 주거 형태 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              주거 형태 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {housingOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, housingType: opt.id })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.housingType === opt.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                    {formData.housingType === opt.id && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 선택 항목 카드 (고객번호 & 지침 & 사진) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h2 className="font-bold text-base text-slate-900">2. 선택 항목 (고객번호 & 계량기 지침)</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">나중에 입력 가능</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            고객번호와 계량기 지침 숫자를 미리 입력해 두시면 당일 정산 시 빠르게 대조할 수 있습니다. 당일 아침에 확인 예정이라면 비워두고 넘어가셔도 좋습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 전기 입력 영역 */}
            <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  한국전력 전기 정보
                </span>
                <button
                  type="button"
                  onClick={() => onOpenMeterGuide('electricity')}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <HelpCircle className="w-3 h-3" />
                  지침 보는 법
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  전기 고객번호 (10자리)
                </label>
                <input
                  type="text"
                  placeholder="예: 01-2345-6789"
                  value={formData.electricityCustomerNo}
                  onChange={e => setFormData({ ...formData, electricityCustomerNo: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ※ 전기요금 고지서 우측 상단 또는 한전ON에서 확인 가능
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  전기 계량기 지침 (kWh)
                </label>
                <input
                  type="number"
                  placeholder="예: 4821 (소수점 제외)"
                  value={formData.electricityMeterReading}
                  onChange={e => setFormData({ ...formData, electricityMeterReading: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                />
              </div>

              {/* 사진 첨부 UI */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1">
                  계량기 사진 첨부 (증빙 보관용)
                </span>
                <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Camera className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-xs text-blue-700 font-medium">
                    {formData.electricityMeterPhotoName || '전기 계량기 사진 촬영 / 첨부'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    기기 내 브라우저 임시 미리보기 (서버 전송 안됨)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => handlePhotoUpload(e, 'electricity')}
                  />
                </label>

                {elecPhotoPreview && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center">
                    <img src={elecPhotoPreview} alt="전기 계량기 미리보기" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setElecPhotoPreview(null);
                        setFormData({ ...formData, electricityMeterPhotoName: '' });
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 도시가스 입력 영역 */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  도시가스 정보 ({matchedGasProvider.name})
                </span>
                <button
                  type="button"
                  onClick={() => onOpenMeterGuide('gas')}
                  className="text-[11px] text-amber-600 hover:underline flex items-center gap-0.5"
                >
                  <HelpCircle className="w-3 h-3" />
                  지침 보는 법
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  가스 고객번호 / 계약번호
                </label>
                <input
                  type="text"
                  placeholder="예: 1002-345-6789"
                  value={formData.gasCustomerNo}
                  onChange={e => setFormData({ ...formData, gasCustomerNo: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ※ 도시가스 고지서 또는 카카오알림톡 청구서에서 확인
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  가스 계량기 지침 (m³)
                </label>
                <input
                  type="number"
                  placeholder="예: 1385 (빨간 상자 제외)"
                  value={formData.gasMeterReading}
                  onChange={e => setFormData({ ...formData, gasMeterReading: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                />
              </div>

              {/* 사진 첨부 UI */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1">
                  가스 계량기 사진 첨부 (증빙 보관용)
                </span>
                <label className="border-2 border-dashed border-amber-200 hover:border-amber-400 bg-white rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Camera className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-xs text-amber-700 font-medium">
                    {formData.gasMeterPhotoName || '가스 계량기 사진 촬영 / 첨부'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    기기 내 브라우저 임시 미리보기 (서버 전송 안됨)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => handlePhotoUpload(e, 'gas')}
                  />
                </label>

                {gasPhotoPreview && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center">
                    <img src={gasPhotoPreview} alt="가스 계량기 미리보기" className="h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setGasPhotoPreview(null);
                        setFormData({ ...formData, gasMeterPhotoName: '' });
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>조회 및 정산 안내 받기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
