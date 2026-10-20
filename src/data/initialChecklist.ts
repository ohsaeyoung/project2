import type { ChecklistItem } from '../types';

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // 이사 전 (D-7 ~ D-1)
  {
    id: 'before-1',
    stage: 'before',
    title: '전기 고객번호(10자리) 사전 확인',
    description: '전기요금 고지서 또는 한전ON(123)에서 10자리 고객번호를 미리 확인합니다.',
    required: true,
    completed: false
  },
  {
    id: 'before-2',
    stage: 'before',
    title: '관할 도시가스 공급사 확인',
    description: '주소지에 따라 독점 공급사가 다르므로 관할 가스사를 조회하고 고객번호를 확인합니다.',
    required: true,
    completed: false
  },
  {
    id: 'before-3',
    stage: 'before',
    title: '도시가스 전출 방문기사 예약 (최소 2~3일 전)',
    description: '가스레인지 철거 및 배관 안전 마개(플러그) 마감 조치를 위해 방문 예약을 잡습니다.',
    required: true,
    completed: false
  },
  {
    id: 'before-4',
    stage: 'before',
    title: '관리사무소 정산 방식 확인 (아파트/오피스텔)',
    description: '관리비에 전기·가스가 포함되어 일괄 정산되는지, 개별 정산인지 관리사무소에 문의합니다.',
    required: false,
    completed: false
  },
  {
    id: 'before-5',
    stage: 'before',
    title: '자동이체 해지 또는 변경 준비',
    description: '기존 계좌/카드 자동이체가 걸려있다면 이사일 기준 해지 일정을 확인합니다.',
    required: false,
    completed: false
  },

  // 이사 당일 (D-Day)
  {
    id: 'day-1',
    stage: 'day',
    title: '전기 계량기 지침 숫자 확인 및 사진 촬영',
    description: '계량기 화면의 검침숫자(소수점 앞자리까지)를 확인하고 증빙용 사진을 보관합니다.',
    required: true,
    completed: false
  },
  {
    id: 'day-2',
    stage: 'day',
    title: '도시가스 계량기 지침 숫자 확인 및 사진 촬영',
    description: '가스 계량기의 빨간 테두리(소수점) 앞자리 정수를 촬영 및 기록합니다.',
    required: true,
    completed: false
  },
  {
    id: 'day-3',
    stage: 'day',
    title: '전기요금 당일 정산 (한전 고객센터 123 또는 한전ON)',
    description: '고객번호와 최종 지침을 전달하여 당일까지의 요금을 계산받고 즉시 납부합니다.',
    required: true,
    completed: false
  },
  {
    id: 'day-4',
    stage: 'day',
    title: '도시가스 기사 방문 확인 및 현장 정산',
    description: '방문 기사의 배관 마감 조치를 확인하고, 최종 지침 기준으로 현장 카드/가상계좌 정산을 마칩니다.',
    required: true,
    completed: false
  },
  {
    id: 'day-5',
    stage: 'day',
    title: '정산 영수증 및 납부 문자 보관 (임대인/다음 세입자 인계)',
    description: '납부 확인증이나 이체 내역 캡처본을 공인중개사나 임대인에게 전달하여 보증금 반환 시 증빙합니다.',
    required: true,
    completed: false
  },

  // 이사 후 (새 집)
  {
    id: 'after-1',
    stage: 'after',
    title: '새 주소 전기 명의 변경 및 계약 확인',
    description: '새 집의 전기 고객번호로 한전ON 또는 123을 통해 명의 변경 및 사용자 등록을 진행합니다.',
    required: true,
    completed: false
  },
  {
    id: 'after-2',
    stage: 'after',
    title: '새 주소 도시가스 전입 신청 및 안전점검',
    description: '새 관할 도시가스사에 전입 신청을 하고, 가스레인지 연결 및 안전점검 방문 일정을 잡습니다.',
    required: true,
    completed: false
  },
  {
    id: 'after-3',
    stage: 'after',
    title: '새 주소 자동이체 및 전자고지서 신청',
    description: '할인 혜택(모바일 고지서 등)을 적용받을 수 있도록 납부 방법을 등록합니다.',
    required: false,
    completed: false
  },
  {
    id: 'after-4',
    stage: 'after',
    title: '이전 주소 추가 요금 청구 여부 최종 점검',
    description: '정산 완료 후 다음 달 청구서에 이전 주소지 미납분이나 중복 청구가 없는지 확인합니다.',
    required: false,
    completed: false
  }
];
