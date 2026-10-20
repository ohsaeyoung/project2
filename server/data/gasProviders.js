/**
 * 전국 34개 도시가스사 데이터베이스 및 지역 매핑
 */
export const GAS_PROVIDERS = [
  {
    id: 'seoul-gas',
    name: '서울도시가스',
    tel: '1588-5788',
    websiteUrl: 'https://www.seoulgas.co.kr',
    moveOutUrl: 'https://www.seoulgas.co.kr/customer/move',
    regions: ['서울특별시 마포구', '서울특별시 서대문구', '서울특별시 은평구', '서울특별시 양천구', '서울특별시 강서구', '서울특별시 구로구', '서울특별시 영등포구', '서울특별시 동작구', '서울특별시 관악구', '경기도 고양시', '경기도 파주시', '경기도 김포시'],
    requiresVisit: true,
    visitNotice: '가스레인지 철거 시 안전마개 봉인 시공을 위해 2~3일 전 방문 예약이 필수입니다.'
  },
  {
    id: 'koone-gas',
    name: '코원에너지서비스',
    tel: '1599-3366',
    websiteUrl: 'https://www.kooneenergy.com',
    moveOutUrl: 'https://www.kooneenergy.com',
    regions: ['서울특별시 강남구', '서울특별시 서초구', '서울특별시 송파구', '서울특별시 강동구', '경기도 성남시', '경기도 하남시', '경기도 광주시', '경기도 이천시', '경기도 여주시', '경기도 과천시'],
    requiresVisit: true,
    visitNotice: '전출 시 방문예약 필수. 모바일 웹 또는 고객센터에서 신청 가능합니다.'
  },
  {
    id: 'yesco-gas',
    name: '예스코 (YESCO)',
    tel: '1544-3131',
    websiteUrl: 'https://www.lsyesco.com',
    moveOutUrl: 'https://www.lsyesco.com',
    regions: ['서울특별시 종로구', '서울특별시 중구', '서울특별시 용산구', '서울특별시 성동구', '서울특별시 광진구', '서울특별시 동대문구', '서울특별시 중랑구', '서울특별시 성북구', '서울특별시 노원구', '경기도 구리시', '경기도 남양주시', '경기도 가평군', '경기도 양평군'],
    requiresVisit: true,
    visitNotice: '홈페이지 또는 보이는 ARS를 통해 전출 예약 및 요금 정산이 가능합니다.'
  },
  {
    id: 'daeryun-gas',
    name: '대륜E&S',
    tel: '1566-6116',
    websiteUrl: 'https://www.daeryunens.com',
    moveOutUrl: 'https://www.daeryunens.com',
    regions: ['서울특별시 도봉구', '서울특별시 강북구', '경기도 의정부시', '경기도 양주시', '경기도 동두천시', '경기도 포천시', '경기도 연천군'],
    requiresVisit: true,
    visitNotice: '이사 2~3일 전 방문 예약 접수 필요.'
  },
  {
    id: 'kiturami-gas',
    name: '귀뚜라미에너지',
    tel: '1670-4700',
    websiteUrl: 'https://www.kituramigas.co.kr',
    moveOutUrl: 'https://www.kituramigas.co.kr',
    regions: ['서울특별시 금천구', '서울특별시 구로구 고척동/오류동', '서울특별시 양천구 신월동'],
    requiresVisit: true,
    visitNotice: '전출 시 가스누출 방지 안전마개 시공 필수'
  },
  {
    id: 'samchully-gas',
    name: '삼천리 도시가스',
    tel: '1544-3002',
    websiteUrl: 'https://www.samchully.co.kr',
    moveOutUrl: 'https://www.samchully.co.kr',
    regions: [
      '경기도 수원시', '경기도 안양시', '경기도 안산시', '경기도 부천시', '경기도 광명시', 
      '경기도 평택시', '경기도 시흥시', '경기도 화성시', '경기도 용인시', '경기도 군포시', 
      '경기도 의왕시', '경기도 오산시', '경기도 안성시', '인천광역시 미추홀구', '인천광역시 연수구', 
      '인천광역시 남동구', '인천광역시 동구', '인천광역시 중구'
    ],
    requiresVisit: true,
    visitNotice: '삼삼e 간편 모바일 서비스 또는 콜센터를 통해 전출 예약 및 요금 정산 가능'
  },
  {
    id: 'incheon-gas',
    name: '인천도시가스',
    tel: '1600-0002',
    websiteUrl: 'https://www.icgas.co.kr',
    moveOutUrl: 'https://www.icgas.co.kr',
    regions: ['인천광역시 부평구', '인천광역시 계양구', '인천광역시 서구', '인천광역시 강화군'],
    requiresVisit: true,
    visitNotice: '이사 3일 전 예약 필수'
  },
  {
    id: 'busan-gas',
    name: '부산도시가스',
    tel: '1544-0009',
    websiteUrl: 'https://www.busangas.co.kr',
    moveOutUrl: 'https://www.busangas.co.kr',
    regions: ['부산광역시 해운대구', '부산광역시 수영구', '부산광역시 남구', '부산광역시 연제구', '부산광역시 동래구', '부산광역시 금정구', '부산광역시 부산진구', '부산광역시 동구', '부산광역시 중구', '부산광역시 서구', '부산광역시 영도구', '부산광역시 사하구', '부산광역시 사상구', '부산광역시 북구', '부산광역시 강서구', '부산광역시 기장군'],
    requiresVisit: true,
    visitNotice: '카카오 알림톡 또는 전용 앱에서 간편 예약 지원'
  },
  {
    id: 'daegu-gas',
    name: '대성에너지 (대구)',
    tel: '1577-1190',
    websiteUrl: 'https://www.daesungenergy.com',
    moveOutUrl: 'https://www.daesungenergy.com',
    regions: ['대구광역시 중구', '대구광역시 동구', '대구광역시 서구', '대구광역시 남구', '대구광역시 북구', '대구광역시 수성구', '대구광역시 달서구', '대구광역시 달성군', '경상북도 칠곡군', '경상북도 경산시', '경상북도 고령군'],
    requiresVisit: true,
    visitNotice: '이사 2~3일 전 홈페이지 또는 콜센터 예약'
  },
  {
    id: 'daejeon-gas',
    name: 'CNCITY에너지 (대전)',
    tel: '1666-0009',
    websiteUrl: 'https://www.cncityenergy.com',
    moveOutUrl: 'https://www.cncityenergy.com',
    regions: ['대전광역시 동구', '대전광역시 중구', '대전광역시 서구', '대전광역시 유성구', '대전광역시 대덕구', '충청남도 계룡시'],
    requiresVisit: true,
    visitNotice: '홈페이지 또는 모바일 간편신청 가능'
  },
  {
    id: 'gwangju-gas',
    name: '해양에너지 (광주)',
    tel: '1544-1115',
    websiteUrl: 'https://www.hyenergy.co.kr',
    moveOutUrl: 'https://www.hyenergy.co.kr',
    regions: ['광주광역시 동구', '광주광역시 서구', '광주광역시 남구', '광주광역시 북구', '광주광역시 광산구', '전라남도 나주시', '전라남도 화순군', '전라남도 장성군', '전라남도 담양군', '전라남도 영광군', '전라남도 해남군'],
    requiresVisit: true,
    visitNotice: '이사 전일 18시까지 예약 권장'
  },
  {
    id: 'ulsan-gas',
    name: '경동도시가스 (울산/양산)',
    tel: '1577-8181',
    websiteUrl: 'https://www.kdgas.co.kr',
    moveOutUrl: 'https://www.kdgas.co.kr',
    regions: ['울산광역시 중구', '울산광역시 남구', '울산광역시 동구', '울산광역시 북구', '울산광역시 울주군', '경상남도 양산시'],
    requiresVisit: true,
    visitNotice: '고객지원센터 또는 인터넷 전출신청'
  },
  {
    id: 'chungnam-jb',
    name: 'JB (중부도시가스)',
    tel: '1544-0041',
    websiteUrl: 'https://www.jbcorporation.com',
    moveOutUrl: 'https://www.jbcorporation.com',
    regions: ['충청남도 천안시', '충청남도 아산시', '충청남도 공주시', '충청남도 논산시', '충청남도 보령시', '충청남도 금산군', '충청남도 부여군', '충청남도 서천군', '충청남도 청양군', '세종특별자치시'],
    requiresVisit: true,
    visitNotice: '라이프온 앱 또는 콜센터 예약'
  },
  {
    id: 'mirae-gas',
    name: '미래엔서해에너지',
    tel: '1577-6580',
    websiteUrl: 'https://www.miraensehaeenergy.com',
    moveOutUrl: 'https://www.miraensehaeenergy.com',
    regions: ['충청남도 당진시', '충청남도 서산시', '충청남도 예산군', '충청남도 태안군', '충청남도 홍성군'],
    requiresVisit: true,
    visitNotice: '방문 2일 전 접수 요망'
  },
  {
    id: 'gyeongnam-gas',
    name: '경남에너지',
    tel: '055-260-4000',
    websiteUrl: 'https://www.knenergy.co.kr',
    moveOutUrl: 'https://www.knenergy.co.kr',
    regions: ['경상남도 창원시', '경상남도 김해시', '경상남도 거제시', '경상남도 통영시', '경상남도 밀양시', '경상남도 함안군', '경상남도 창녕군', '경상남도 고성군'],
    requiresVisit: true,
    visitNotice: '고객센터 예약 또는 인터넷 신청'
  },
  {
    id: 'jeju-gas',
    name: '제주도시가스',
    tel: '1600-3437',
    websiteUrl: 'https://www.jejugas.co.kr',
    moveOutUrl: 'https://www.jejugas.co.kr',
    regions: ['제주특별자치도 제주시', '제주특별자치도 서귀포시'],
    requiresVisit: true,
    visitNotice: '도서지역 특성상 최소 3일 전 예약 필요'
  },
  {
    id: 'citygas-assoc',
    name: '한국도시가스협회 (공식 안내센터)',
    tel: '02-554-7721',
    websiteUrl: 'http://www.citygas.or.kr',
    moveOutUrl: 'http://www.citygas.or.kr',
    regions: ['기타 전국 지역'],
    requiresVisit: true,
    visitNotice: '지역별 도시가스사 조회가 필요할 때 전국 34개 공급사를 안내합니다.'
  }
];

export function findGasProvider(sido = '', sigungu = '') {
  const query = `${sido} ${sigungu}`.trim();
  
  if (!sido && !sigungu) {
    return GAS_PROVIDERS.find(p => p.id === 'citygas-assoc') || GAS_PROVIDERS[0];
  }

  // 1차: 시도+시군구 매칭
  const match = GAS_PROVIDERS.find(p => 
    p.regions.some(r => r.includes(query) || (sigungu && r.includes(sigungu) && r.includes(sido)))
  );
  if (match) return match;

  // 2차: 시군구 기준 매칭
  if (sigungu) {
    const sigunguMatch = GAS_PROVIDERS.find(p => p.regions.some(r => r.includes(sigungu)));
    if (sigunguMatch) return sigunguMatch;
  }

  // 3차: 광역시도 기준
  if (sido.includes('서울')) return GAS_PROVIDERS[0];
  if (sido.includes('경기')) return GAS_PROVIDERS.find(p => p.id === 'samchully-gas');
  if (sido.includes('부산')) return GAS_PROVIDERS.find(p => p.id === 'busan-gas');
  if (sido.includes('인천')) return GAS_PROVIDERS.find(p => p.id === 'samchully-gas');
  if (sido.includes('대구')) return GAS_PROVIDERS.find(p => p.id === 'daegu-gas');
  if (sido.includes('대전') || sido.includes('세종')) return GAS_PROVIDERS.find(p => p.id === 'daejeon-gas');
  if (sido.includes('광주')) return GAS_PROVIDERS.find(p => p.id === 'gwangju-gas');
  if (sido.includes('울산')) return GAS_PROVIDERS.find(p => p.id === 'ulsan-gas');
  if (sido.includes('제주')) return GAS_PROVIDERS.find(p => p.id === 'jeju-gas');

  return GAS_PROVIDERS.find(p => p.id === 'citygas-assoc') || GAS_PROVIDERS[0];
}
