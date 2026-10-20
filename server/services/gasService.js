/**
 * 전국 도시가스 요금 연동 서비스 계층
 * - 대한민국 34개 도시가스사별 제휴 및 API 연동 상태 관리
 * - 공식 API가 없는 경우 '실시간 조회 미연결' 상태 및 관할 공급사 공식 링크 안내
 * - 전출 방문 예약 필요 여부 및 절차 안내
 */
import { findGasProvider, GAS_PROVIDERS } from '../data/gasProviders.js';

export class GasService {
  constructor() {
    this.apiKey = process.env.CITYGAS_API_KEY || '';
    this.apiEndpoint = process.env.CITYGAS_API_ENDPOINT || '';
    this.enableMock = process.env.ENABLE_GAS_MOCK === 'true';
  }

  getApiStatus() {
    return {
      providerCount: GAS_PROVIDERS.length,
      isConnected: Boolean(this.apiKey),
      hasMockEnabled: this.enableMock,
      authMethod: '도시가스 사업자별 개별 제휴 또는 본인인증 토큰',
      notice: '도시가스는 전국 34개 사업자가 지역별로 독점 공급하므로 관할 사업자 확인이 필수입니다.'
    };
  }

  /**
   * 도시가스 요금 조회
   */
  async queryGasFee({ customerNo, meterReading, sido, sigungu, address, moveDate }) {
    const provider = findGasProvider(sido, sigungu);
    const cleanCustomerNo = (customerNo || '').replace(/[^0-9]/g, '');

    // 1. API 키가 없거나 미연동 상태 (기본 정상 프로덕션 모드)
    if (!this.apiKey && !this.enableMock) {
      let calculationBasis = '관할 도시가스사 공식 실시간 API 미연결 상태입니다.';
      let calculationLimit = '실시간 사용량 및 단가는 각 지자체 승인 고시 단가와 이전 검침월 지침이 필요하므로 임의 산출하지 않습니다.';

      return {
        success: false,
        isConnected: false,
        status: 'need_official',
        message: `[${provider.name}] 실시간 요금 조회 기능이 아직 연동되지 않았습니다. 실제 정산 금액과 방문 예약은 공급사 공식 서비스를 통해 확인해 주세요.`,
        dataSource: `${provider.name} 공식 사이트 확인 필요`,
        provider,
        customerNo: cleanCustomerNo,
        address,
        moveDate,
        officialUrl: provider.websiteUrl,
        moveOutReserveUrl: provider.moveOutUrl,
        customerServiceTel: provider.tel,
        requiresVisitReservation: provider.requiresVisit,
        queryTime: new Date().toISOString(),
        calculationBasis,
        calculationLimit,
        nextActions: [
          `이사 2~3일 전 ${provider.name} (${provider.tel}) 또는 공식 홈페이지에서 [전출 방문 예약] 접수`,
          '이사 당일 가스 기사 방문 시 가스레인지 호스 분리 및 안전마개(플러그) 마감 조치 필수',
          '기사님 입회하에 계량기 최종 지침 숫자를 대조 확인',
          '현장에서 신용카드, 카카오페이 또는 전용 가상계좌로 당일분 요금 즉시 완납 후 영수증 수령'
        ]
      };
    }

    // 2. Mock 모드가 켜진 경우 (개발 검증 전용 시뮬레이션)
    if (this.enableMock) {
      const mockUsageM3 = 32.5;
      // 대략적인 취사/난방 단가 기준 시뮬레이션
      const baseFee = 1000;
      const unitPrice = 21.5; // 원/MJ 대략 920원/m3
      const mockAmount = Math.round(baseFee + (mockUsageM3 * 925));
      const vat = Math.round(mockAmount * 0.1);
      const totalAmount = Math.floor((mockAmount + vat) / 10) * 10;

      return {
        success: true,
        isConnected: true,
        status: 'success',
        isSimulation: true,
        message: `[${provider.name} 시뮬레이션] 개발 테스트 환경에서 반환된 가상 응답입니다.`,
        dataSource: `${provider.name} 테스트 샌드박스 (실제 청구 금액 아님)`,
        provider,
        customerNo: cleanCustomerNo || '1002-9876-54',
        address,
        moveDate,
        usageM3: mockUsageM3,
        actualAmount: totalAmount,
        officialUrl: provider.websiteUrl,
        moveOutReserveUrl: provider.moveOutUrl,
        customerServiceTel: provider.tel,
        requiresVisitReservation: provider.requiresVisit,
        queryTime: new Date().toISOString(),
        calculationBasis: '주택용 개별난방 표준 열량계수 시뮬레이션 적용',
        calculationLimit: '실제 단가는 시/도별 도시가스 공급비용 및 원료비 연동제에 따라 매월 달라집니다.',
        nextActions: [
          '실제 정산 시에는 반드시 공식 공급사를 통해 최종 금액을 결제하세요.',
          '기사 방문 시 배관 마감 처리가 완료되었는지 꼭 확인하세요.'
        ]
      };
    }

    // 3. 실제 API 호출 (제휴 API 키 구비 시)
    try {
      const response = await fetch(`${this.apiEndpoint}/bill/move-settle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: provider.id,
          custNo: cleanCustomerNo,
          meterReading: Number(meterReading),
          moveDate
        })
      });

      if (!response.ok) {
        throw new Error(`도시가스 API 응답 오류: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        isConnected: true,
        status: 'success',
        message: `${provider.name} 공식 연동을 통해 요금이 조회되었습니다.`,
        dataSource: `${provider.name} 공식 API`,
        provider,
        customerNo: cleanCustomerNo,
        address,
        moveDate,
        usageM3: data.usageM3,
        actualAmount: data.amount,
        officialUrl: provider.websiteUrl,
        moveOutReserveUrl: provider.moveOutUrl,
        customerServiceTel: provider.tel,
        requiresVisitReservation: provider.requiresVisit,
        queryTime: new Date().toISOString(),
        nextActions: [
          '안내된 계좌로 요금을 완납하세요.',
          '방문 일정이 예약되었는지 재확인하세요.'
        ]
      };
    } catch (err) {
      return {
        success: false,
        isConnected: true,
        status: 'failed',
        message: `${provider.name} API 연결 중 오류가 발생했습니다: ${err.message}`,
        dataSource: `${provider.name} 공식 API (조회 실패)`,
        provider,
        officialUrl: provider.websiteUrl,
        moveOutReserveUrl: provider.moveOutUrl,
        customerServiceTel: provider.tel,
        requiresVisitReservation: provider.requiresVisit,
        queryTime: new Date().toISOString(),
        nextActions: [
          `고객센터(${provider.tel})로 직접 전화하여 당일 정산을 진행해 주세요.`
        ]
      };
    }
  }
}
