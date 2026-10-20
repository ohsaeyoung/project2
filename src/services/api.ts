import type { ElectricityQueryResult, GasQueryResult } from '../types';
import { findGasProvider, GAS_PROVIDERS } from '../data/gasProviderData';

const BASE_URL = '/api';

export interface ApiStatusResponse {
  electricity: {
    provider: string;
    isConnected: boolean;
    hasMockEnabled: boolean;
    officialUrl: string;
    customerCenterTel: string;
    notice: string;
  };
  gas: {
    providerCount: number;
    isConnected: boolean;
    hasMockEnabled: boolean;
    notice: string;
  };
  environment: {
    hasKepcoKey: boolean;
    hasGasKey: boolean;
    isSimulationAllowed: boolean;
  };
}

export const api = {
  // 1. 연동 상태 조회
  async getStatus(): Promise<ApiStatusResponse> {
    try {
      const res = await fetch(`${BASE_URL}/status`);
      if (!res.ok) throw new Error('API 상태 조회 실패');
      return await res.json();
    } catch {
      // 오프라인 / 정적 모드 폴백
      return {
        electricity: {
          provider: '한국전력공사 (KEPCO)',
          isConnected: false,
          hasMockEnabled: false,
          officialUrl: 'https://online.kepco.co.kr',
          customerCenterTel: '123',
          notice: '한국전력 공식 이사 정산은 본인 인증 또는 123 고객센터 및 한전ON에서 최종 확정됩니다.'
        },
        gas: {
          providerCount: GAS_PROVIDERS.length,
          isConnected: false,
          hasMockEnabled: false,
          notice: '도시가스는 전국 34개 사업자가 지역별로 독점 공급하므로 관할 사업자 확인이 필수입니다.'
        },
        environment: {
          hasKepcoKey: false,
          hasGasKey: false,
          isSimulationAllowed: true
        }
      };
    }
  },

  // 2. 전기요금 조회 요청
  async checkElectricity(payload: {
    customerNo: string;
    meterReading: string;
    address: string;
    moveDate: string;
  }): Promise<ElectricityQueryResult> {
    try {
      const res = await fetch(`${BASE_URL}/electricity/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, using standard fallback response:', err);
    }

    // 서버 미구동/에러 시 공식 원칙 준수 폴백
    return {
      status: 'need_official',
      isConnected: false,
      message: '실시간 요금 조회 기능이 아직 연결되지 않았습니다. 실제 정산 금액은 한국전력 공식 서비스를 통해 확인해 주세요.',
      dataSource: '한국전력 공식 사이트 확인 필요',
      customerNo: payload.customerNo,
      address: payload.address,
      moveDate: payload.moveDate,
      officialUrl: 'https://online.kepco.co.kr',
      customerServiceTel: '123',
      queryTime: new Date().toISOString(),
      calculationBasis: '공식 실시간 API 미연결 상태입니다.',
      calculationLimit: '임의의 예상 금액을 표시하지 않습니다. 한전 공식 채널을 이용해 주십시오.',
      nextActions: [
        '국번없이 123(한국전력 고객센터)에 전화하여 상담원 연결',
        '한전ON 웹사이트(online.kepco.co.kr) 접속 후 [민원신청 > 이사정산] 메뉴 이용',
        '이사 당일 촬영한 전기 계량기 지침 숫자를 상담원 또는 웹에 입력',
        '안내받은 전용 가상계좌 또는 카드로 당일 즉시 납부 후 영수증 수령'
      ]
    };
  },

  // 3. 도시가스 요금 조회 요청
  async checkGas(payload: {
    customerNo: string;
    meterReading: string;
    sido: string;
    sigungu: string;
    address: string;
    moveDate: string;
  }): Promise<GasQueryResult> {
    const provider = findGasProvider(payload.sido, payload.sigungu);

    try {
      const res = await fetch(`${BASE_URL}/gas/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, using standard fallback response:', err);
    }

    // 서버 미구동/에러 시 공식 원칙 준수 폴백
    return {
      status: 'need_official',
      isConnected: false,
      message: `[${provider.name}] 실시간 요금 조회 기능이 아직 연동되지 않았습니다. 실제 정산 금액과 방문 예약은 공급사 공식 서비스를 통해 확인해 주세요.`,
      dataSource: `${provider.name} 공식 사이트 확인 필요`,
      provider,
      customerNo: payload.customerNo,
      address: payload.address,
      moveDate: payload.moveDate,
      officialUrl: provider.websiteUrl,
      moveOutReserveUrl: provider.moveOutUrl,
      customerServiceTel: provider.tel,
      requiresVisitReservation: provider.requiresVisit,
      queryTime: new Date().toISOString(),
      calculationBasis: '관할 도시가스사 공식 실시간 API 미연결 상태입니다.',
      calculationLimit: '실시간 사용량 및 단가는 각 지자체 승인 고시 단가와 이전 검침월 지침이 필요하므로 임의 산출하지 않습니다.',
      nextActions: [
        `이사 2~3일 전 ${provider.name} (${provider.tel}) 또는 공식 홈페이지에서 [전출 방문 예약] 접수`,
        '이사 당일 가스 기사 방문 시 가스레인지 호스 분리 및 안전마개(플러그) 마감 조치 필수',
        '기사님 입회하에 계량기 최종 지침 숫자를 대조 확인',
        '현장에서 신용카드, 카카오페이 또는 전용 가상계좌로 당일분 요금 즉시 완납 후 영수증 수령'
      ]
    };
  },

  // 4. 참고용 예상 계산기
  async estimateFee(payload: {
    type: 'electricity' | 'gas';
    prevReading: number;
    currentReading: number;
    housingType?: string;
  }) {
    try {
      const res = await fetch(`${BASE_URL}/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // 폴백 클라이언트 계산
    }

    const usage = Math.max(0, payload.currentReading - payload.prevReading);
    if (payload.type === 'electricity') {
      const baseFee = usage <= 200 ? 910 : usage <= 400 ? 1600 : 7300;
      const powerFee = usage <= 200 ? usage * 120 : (200 * 120) + ((usage - 200) * 214.6);
      const sub = baseFee + powerFee + (usage * 14);
      const vat = Math.round(sub * 0.1);
      const fund = Math.floor((sub * 0.037) / 10) * 10;
      const total = Math.floor((sub + vat + fund) / 10) * 10;
      return {
        type: 'electricity',
        usageKwh: usage,
        estimatedAmount: total,
        isEstimate: true,
        calculationBasis: '주택용(저압) 3단계 누진제 기준 단순 계산치',
        calculationLimit: '실제 금액은 검침일수, 복지할인, 일할계산 등에 의해 차이가 있습니다.',
        notice: '공식 정산 및 납부는 한전ON(123)에서만 확정됩니다.'
      };
    } else {
      const sub = 1000 + (usage * 915);
      const total = Math.floor((sub * 1.1) / 10) * 10;
      return {
        type: 'gas',
        usageM3: usage,
        estimatedAmount: total,
        isEstimate: true,
        calculationBasis: '수도권 평균단가(약 915원/m3 + 기본료 1,000원) 기준 단순 추정치',
        calculationLimit: '지역별 공급비용 및 보정계수에 따라 실제 고지액과 다를 수 있습니다.',
        notice: '공식 정산은 관할 도시가스사 기사 방문 또는 고객센터를 통해 확정됩니다.'
      };
    }
  },

  // 5. 시뮬레이션 토글
  async toggleSimulation(payload: { enableKepco?: boolean; enableGas?: boolean }) {
    try {
      const res = await fetch(`${BASE_URL}/simulation/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return { message: '로컬 환경' };
    }
  }
};
