import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { MoveInfoForm } from './components/form/MoveInfoForm';
import { ElectricityView } from './components/electricity/ElectricityView';
import { GasView } from './components/gas/GasView';
import { SettlementDashboard } from './components/result/SettlementDashboard';
import { ChecklistView } from './components/checklist/ChecklistView';
import { MeterGuideModal } from './components/common/MeterGuideModal';
import { PrivacyModal } from './components/common/PrivacyModal';
import { CustomerSupportModal } from './components/common/CustomerSupportModal';
import { ApiSettingsModal } from './components/common/ApiSettingsModal';
import { EstimateCalculatorModal } from './components/common/EstimateCalculatorModal';
import type { SettlementFormData } from './types';
import type { ApiStatusResponse } from './services/api';
import { api } from './services/api';

const DEFAULT_FORM_DATA: SettlementFormData = {
  moveType: 'out',
  moveDate: new Date().toISOString().split('T')[0],
  sido: '서울특별시',
  sigungu: '강남구',
  detailAddress: '',
  fullAddress: '서울특별시 강남구',
  housingType: 'apartment',
  electricityCustomerNo: '',
  electricityMeterReading: '',
  gasCustomerNo: '',
  gasMeterReading: '',
  privacyAgreed: true
};

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'form' | 'electricity' | 'gas' | 'result' | 'checklist'>('home');
  const [formData, setFormData] = useState<SettlementFormData>(() => {
    try {
      const saved = localStorage.getItem('move_settlement_form_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_FORM_DATA;
  });

  const [apiStatus, setApiStatus] = useState<ApiStatusResponse | null>(null);

  // 모달 제어 상태
  const [meterGuideOpen, setMeterGuideOpen] = useState(false);
  const [meterGuideTab, setMeterGuideTab] = useState<'electricity' | 'gas'>('electricity');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [customerSupportOpen, setCustomerSupportOpen] = useState(false);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [estimateCalcOpen, setEstimateCalcOpen] = useState(false);
  const [estimateCalcType, setEstimateCalcType] = useState<'electricity' | 'gas'>('electricity');

  // API 상태 로드
  const loadApiStatus = async () => {
    const status = await api.getStatus();
    setApiStatus(status);
  };

  useEffect(() => {
    loadApiStatus();
  }, []);

  // 폼 데이터 변경 시 로컬 저장
  useEffect(() => {
    try {
      localStorage.setItem('move_settlement_form_v1', JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const handleUpdateFormData = (updated: Partial<SettlementFormData>) => {
    setFormData(prev => ({ ...prev, ...updated }));
  };

  const handleFormSubmit = (data: SettlementFormData) => {
    setFormData(data);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllStorage = () => {
    localStorage.removeItem('move_settlement_form_v1');
    localStorage.removeItem('move_settlement_checklist_v1');
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleOpenMeterGuide = (tab: 'electricity' | 'gas' = 'electricity') => {
    setMeterGuideTab(tab);
    setMeterGuideOpen(true);
  };

  const handleOpenEstimateCalc = (type: 'electricity' | 'gas' = 'electricity') => {
    setEstimateCalcType(type);
    setEstimateCalcOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <Header
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        apiStatus={apiStatus}
        onOpenApiSettings={() => setApiSettingsOpen(true)}
        onOpenCustomerSupport={() => setCustomerSupportOpen(true)}
        onOpenMeterGuide={() => handleOpenMeterGuide('electricity')}
      />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentTab === 'home' && (
          <HomeView
            onStartSettlement={() => {
              setCurrentTab('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoChecklist={() => {
              setCurrentTab('checklist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoElectricity={() => {
              setCurrentTab('electricity');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoGas={() => {
              setCurrentTab('gas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMeterGuide={() => handleOpenMeterGuide('electricity')}
            onOpenCustomerSupport={() => setCustomerSupportOpen(true)}
            apiStatus={apiStatus}
          />
        )}

        {currentTab === 'form' && (
          <MoveInfoForm
            initialData={formData}
            onSubmit={handleFormSubmit}
            onOpenMeterGuide={handleOpenMeterGuide}
          />
        )}

        {currentTab === 'electricity' && (
          <ElectricityView
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onOpenMeterGuide={() => handleOpenMeterGuide('electricity')}
            onOpenEstimateCalc={() => handleOpenEstimateCalc('electricity')}
          />
        )}

        {currentTab === 'gas' && (
          <GasView
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onOpenMeterGuide={() => handleOpenMeterGuide('gas')}
            onOpenEstimateCalc={() => handleOpenEstimateCalc('gas')}
            onOpenCustomerSupport={() => setCustomerSupportOpen(true)}
          />
        )}

        {currentTab === 'result' && (
          <SettlementDashboard
            formData={formData}
            onGoElectricity={() => setCurrentTab('electricity')}
            onGoGas={() => setCurrentTab('gas')}
            onGoChecklist={() => setCurrentTab('checklist')}
            onOpenEstimateCalc={() => handleOpenEstimateCalc('electricity')}
          />
        )}

        {currentTab === 'checklist' && <ChecklistView />}
      </main>

      {/* 3. 하단 공공서비스형 푸터 */}
      <Footer
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenCustomerSupport={() => setCustomerSupportOpen(true)}
        onClearStorage={handleClearAllStorage}
      />

      {/* 4. 모달 컴포넌트들 */}
      <MeterGuideModal
        isOpen={meterGuideOpen}
        onClose={() => setMeterGuideOpen(false)}
        defaultTab={meterGuideTab}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        onClearStorage={handleClearAllStorage}
      />

      <CustomerSupportModal
        isOpen={customerSupportOpen}
        onClose={() => setCustomerSupportOpen(false)}
      />

      <ApiSettingsModal
        isOpen={apiSettingsOpen}
        onClose={() => setApiSettingsOpen(false)}
        status={apiStatus}
        onRefresh={loadApiStatus}
      />

      <EstimateCalculatorModal
        isOpen={estimateCalcOpen}
        onClose={() => setEstimateCalcOpen(false)}
        defaultType={estimateCalcType}
      />
    </div>
  );
}

export default App;
