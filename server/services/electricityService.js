/**
 * 한국전력(KEPCO) 전기요금 연동 서비스 계층
 * - 실제 KEPCO API 키가 있을 경우 공공데이터/한전 API 호출
 * - API 키가 없거나 미연동 시 공식 원칙에 따라 '실시간 조회 미연결' 응답 반환
 * - 임의의 데이터를 실제 요금으로 속이지 않음
 */

export class ElectricityService {
  constructor() {
    this.apiKey = process.env.KEPCO_API_KEY || '';
    this.apiEndpoint = process.env.KEPCO_API_ENDPOINT || 'https://api.kepco.co.kr/v1';
    this.enableMock = process.env.ENABLE_KEPCO_MOCK === 'true';
  }

  getApiStatus() {
    return {
      provider: '한국전력공사 (KEPCO)',
      isConnected: Boolean(this.apiKey),
      hasMockEnabled: this.enableMock,
      authMethod: '공공데이터포털/KEPCO Open API 인증키 + 고객번호 대조',
      officialUrl: 'https://online.kepco.co.kr',
      customerCenterTel: '123 (국번없이)',
      notice: '한국전력 공식 이사 정산은 본인 인증 또는 123 고객센터 및 한전ON에서 최종 확정됩니다.'
    };
  }

  /**
   * 전기요금 조회
   */
  async queryElectricityFee({ customerNo, meterReading, address, moveDate }) {
    const cleanCustomerNo = (customerNo || '').replace(/[^0-9]/g, '');

    // 1. API 키가 설정되지 않은 경우 (표준 운영 상태)
    if (!this.apiKey && !this.enableMock) {
      // 계량기 지침이 입력된 경우 참고용 예상치 산출 가능 여부 검토
      let estimatedData = null;
      if (meterReading && !isNaN(Number(meterReading))) {
        // 참고용 단순 추정: 주택용 저압 기본 구간 참고치 (단, 실제로는 전월 지침이 있어야 사용량 계산 가능)
        // 전월 지침이 없으므로 임의로 사용량을 조작하지 않고, 공식 확인 필요 안내
        estimatedData = {
          estimatedAmount: null,
          basis: '계량기 지침은 입력되었으나, 전월 정기 검침 지침이 확인되지 않아 누적 사용량(당월지침 - 전월지침)을 임의 계산하지 않습니다.',
          limit: '정확한 사용량 및 당월 적용 누진 단계는 한전ON 또는 고객센터 123에서만 확인 가능합니다.'
        };
      }

      return {
        success: false,
        isConnected: false,
        status: 'need_official',
        message: '실시간 요금 조회 기능이 아직 연결되지 않았습니다. 실제 정산 금액은 한국전력 공식 서비스를 통해 확인해 주세요.',
        dataSource: '한국전력 공식 사이트 확인 필요',
        customerNo: cleanCustomerNo,
        address,
        moveDate,
        officialUrl: 'https://online.kepco.co.kr',
        customerServiceTel: '123',
        queryTime: new Date().toISOString(),
        calculationBasis: estimatedData?.basis || '공식 실시간 API 미연결 상태입니다.',
        calculationLimit: estimatedData?.limit || '임의의 예상 금액을 표시하지 않습니다. 한전 공식 채널을 이용해 주십시오.',
        nextActions: [
          '국번없이 123(한국전력 고객센터)에 전화하여 상담원 연결',
          '한전ON 웹사이트(online.kepco.co.kr) 접속 후 [민원신청 > 이사정산] 메뉴 이용',
          '이사 당일 촬영한 전기 계량기 지침 숫자를 상담원 또는 웹에 입력',
          '안내받은 전용 가상계좌 또는 카드로 당일 즉시 납부 후 영수증 수령'
        ]
      };
    }

    // 2. Mock 모드가 켜진 경우 (개발/테스트 검증 목적)
    if (this.enableMock) {
      const reading = Number(meterReading) || 2840;
      // 테스트용 가상 사용량
      const mockUsage = 185; 
      // 주택용 저압 1단계 요율 기준 (기본요금 910원 + 120원*kWh + 기후환경/연료비)
      const mockFee = Math.round(910 + (mockUsage * 120) + (mockUsage * 9) + (mockUsage * 5));
      const vat = Math.round(mockFee * 0.1);
      const fund = Math.floor((mockFee * 0.037) / 10) * 10;
      const totalAmount = Math.floor((mockFee + vat + fund) / 10) * 10;

      return {
        success: true,
        isConnected: true,
        status: 'success',
        isSimulation: true,
        message: '[검증용 시뮬레이션 데이터] 테스트 환경에서 연동 응답 형식을 시뮬레이션 중입니다.',
        dataSource: '한국전력 테스트 샌드박스 (실제 청구 금액 아님)',
        customerNo: cleanCustomerNo || '01-2345-6789',
        address,
        moveDate,
        usageKwh: mockUsage,
        actualAmount: totalAmount,
        officialUrl: 'https://online.kepco.co.kr',
        customerServiceTel: '123',
        queryTime: new Date().toISOString(),
        calculationBasis: '주택용(저압) 1구간(200kWh 이하) 요율 시뮬레이션 적용',
        calculationLimit: '실제 부과 요금은 이전 검침일, 계절별 누진제, 복지할인 적용 여부에 따라 달라집니다.',
        nextActions: [
          '실제 정산 시에는 반드시 한전ON 또는 123을 통해 최종 확정 금액을 확인하세요.',
          '지침 사진을 보관하여 다음 입주자와 정산 분쟁을 예방하세요.'
        ]
      };
    }

    // 3. 실제 API 호출 로직 (API 키 구비 시)
    try {
      // 실제 KEPCO API 엔드포인트 호출
      const response = await fetch(`${this.apiEndpoint}/bill/move-settle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          custNo: cleanCustomerNo,
          meterReading: Number(meterReading),
          moveDate
        })
      });

      if (!response.ok) {
        throw new Error(`KEPCO API 오류: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        isConnected: true,
        status: 'success',
        message: '한전 공식 API를 통해 실시간 요금이 성공적으로 조회되었습니다.',
        dataSource: '한국전력 공식 API 실시간 응답',
        customerNo: cleanCustomerNo,
        address,
        moveDate,
        usageKwh: data.usageKwh,
        actualAmount: data.amount,
        officialUrl: 'https://online.kepco.co.kr',
        customerServiceTel: '123',
        queryTime: new Date().toISOString(),
        nextActions: [
          '조회된 금액을 한전 가상계좌로 납부하세요.',
          '납부 완료 후 영수증을 캡처하여 임대인 또는 부동산에 전달하세요.'
        ]
      };
    } catch (err) {
      return {
        success: false,
        isConnected: true,
        status: 'failed',
        message: `한국전력 API 호출 중 오류가 발생했습니다: ${err.message}`,
        dataSource: '한국전력 공식 API (조회 실패)',
        officialUrl: 'https://online.kepco.co.kr',
        customerServiceTel: '123',
        queryTime: new Date().toISOString(),
        nextActions: [
          '일시적인 전산 오류일 수 있습니다. 한전 고객센터 123으로 직접 유선 정산해 주세요.',
          '한전ON 웹사이트에서 직접 조회를 시도해 보세요.'
        ]
      };
    }
  }
}
