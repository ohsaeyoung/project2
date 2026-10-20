// 이사 정산 도우미 타입 정의

export type MoveType = 'out' | 'in' | 'both'; // 전출 | 전입 | 전출 및 전입

export type HousingType = 
  | 'apartment'    // 아파트
  | 'officetel'    // 오피스텔
  | 'villa'        // 빌라/다세대/연립
  | 'house'        // 단독/다가구주택
  | 'oneroom'      // 원룸
  | 'other';       // 기타

export type SettlementStatus = 
  | 'not_entered'       // 정보 미입력
  | 'entered'           // 정보 입력 완료
  | 'need_official'     // 공식 사이트 확인 필요
  | 'in_progress'       // 조회 진행 중
  | 'success'           // 조회 성공
  | 'failed'            // 조회 실패
  | 'confirmed';        // 정산 완료 확인

export interface GasProviderInfo {
  id: string;
  name: string;
  tel: string;
  websiteUrl: string;
  moveOutUrl?: string;
  regions: string[]; // 지원 시도 및 시군구
  requiresVisit: boolean; // 전출 방문 예약 필수 여부
  visitNotice?: string;
}

export interface SettlementFormData {
  moveType: MoveType;
  moveDate: string;
  sido: string;
  sigungu: string;
  detailAddress: string;
  fullAddress: string;
  housingType: HousingType;
  
  // 전기 관련
  electricityCustomerNo: string;
  electricityMeterReading: string;
  electricityMeterPhotoName?: string;
  
  // 도시가스 관련
  gasCustomerNo: string;
  gasMeterReading: string;
  gasMeterPhotoName?: string;
  gasProviderId?: string;
  gasProviderName?: string;
  
  // 개인정보 동의
  privacyAgreed: boolean;
}

export interface ElectricityQueryResult {
  status: SettlementStatus;
  isConnected: boolean;
  message: string;
  customerNo?: string;
  address?: string;
  moveDate?: string;
  queryTime?: string;
  usageKwh?: number;
  actualAmount?: number;
  estimatedAmount?: number;
  calculationBasis?: string;
  calculationLimit?: string;
  dataSource: string; // '한국전력 공식 API' | '공식 사이트 확인 필요' | '자체 산출 참고용'
  nextActions: string[];
  officialUrl: string;
  customerServiceTel: string;
}

export interface GasQueryResult {
  status: SettlementStatus;
  isConnected: boolean;
  message: string;
  customerNo?: string;
  provider: GasProviderInfo;
  address?: string;
  moveDate?: string;
  queryTime?: string;
  usageM3?: number;
  actualAmount?: number;
  estimatedAmount?: number;
  calculationBasis?: string;
  calculationLimit?: string;
  dataSource: string;
  requiresVisitReservation: boolean;
  nextActions: string[];
  officialUrl: string;
  moveOutReserveUrl?: string;
  customerServiceTel: string;
}

export interface ChecklistItem {
  id: string;
  stage: 'before' | 'day' | 'after';
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  note?: string;
}
