import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ElectricityService } from './services/electricityService.js';
import { GasService } from './services/gasService.js';
import { GAS_PROVIDERS, findGasProvider } from './data/gasProviders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const electricityService = new ElectricityService();
const gasService = new GasService();

// 1. 헬스체크 및 연동 상태 확인
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '이사 정산 도우미 백엔드 API',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    electricity: electricityService.getApiStatus(),
    gas: gasService.getApiStatus(),
    environment: {
      hasKepcoKey: Boolean(process.env.KEPCO_API_KEY),
      hasGasKey: Boolean(process.env.CITYGAS_API_KEY),
      isSimulationAllowed: true
    }
  });
});

// 2. 전국 도시가스 공급사 목록 및 지역 검색
app.get('/api/gas-providers', (req, res) => {
  const { sido, sigungu } = req.query;
  if (sido || sigungu) {
    const provider = findGasProvider(String(sido || ''), String(sigungu || ''));
    return res.json({ provider });
  }
  res.json({ providers: GAS_PROVIDERS });
});

// 3. 전기 요금 조회
app.post('/api/electricity/check', async (req, res) => {
  try {
    const { customerNo, meterReading, address, moveDate } = req.body;
    const result = await electricityService.queryElectricityFee({
      customerNo,
      meterReading,
      address,
      moveDate
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'failed',
      message: `서버 내부 오류: ${err.message}`,
      officialUrl: 'https://online.kepco.co.kr'
    });
  }
});

// 4. 도시가스 요금 조회
app.post('/api/gas/check', async (req, res) => {
  try {
    const { customerNo, meterReading, sido, sigungu, address, moveDate } = req.body;
    const result = await gasService.queryGasFee({
      customerNo,
      meterReading,
      sido,
      sigungu,
      address,
      moveDate
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'failed',
      message: `서버 내부 오류: ${err.message}`,
      officialUrl: 'http://www.citygas.or.kr'
    });
  }
});

// 5. 참고용 예상 요금 계산기 (사용자가 직접 전월/당월 지침을 입력한 경우에 한함)
app.post('/api/estimate', (req, res) => {
  const { type, prevReading, currentReading, housingType } = req.body;
  const prev = Number(prevReading);
  const curr = Number(currentReading);

  if (isNaN(prev) || isNaN(curr) || curr < prev) {
    return res.status(400).json({
      error: '당월 지침 숫자는 전월 지침 숫자보다 크거나 같아야 합니다.'
    });
  }

  const usage = curr - prev;

  if (type === 'electricity') {
    // 한국전력 주택용(저압) 요금표 기준 (기본요금 + 전력량요금 + 기후환경/연료비)
    // 1단계(200kWh 이하): 기본 910원, kWh당 120.0원
    // 2단계(201~400kWh): 기본 1,600원, kWh당 214.6원
    // 3단계(400kWh 초과): 기본 7,300원, kWh당 307.3원
    let baseFee = 910;
    let powerFee = 0;
    if (usage <= 200) {
      baseFee = 910;
      powerFee = usage * 120.0;
    } else if (usage <= 400) {
      baseFee = 1600;
      powerFee = (200 * 120.0) + ((usage - 200) * 214.6);
    } else {
      baseFee = 7300;
      powerFee = (200 * 120.0) + (200 * 214.6) + ((usage - 400) * 307.3);
    }

    const climateFee = usage * 9.0;
    const fuelFee = usage * 5.0;
    const subtotal = baseFee + powerFee + climateFee + fuelFee;
    const vat = Math.round(subtotal * 0.1);
    const fund = Math.floor((subtotal * 0.037) / 10) * 10;
    const estimatedTotal = Math.floor((subtotal + vat + fund) / 10) * 10;

    return res.json({
      type: 'electricity',
      usageKwh: usage,
      estimatedAmount: estimatedTotal,
      isEstimate: true,
      calculationBasis: '한국전력공사 주택용(저압) 3단계 누진 요금표 및 부가세/기금 기준 단순 추정',
      calculationLimit: '본 금액은 참고용 단순 계산치이며, 실제 청구금액은 검침일, 복지할인, 계절별 단가, 이전 잔여일수 일할계산에 따라 달라집니다.',
      notice: '공식 정산 및 납부는 한전ON(123)을 통해서만 가능합니다.'
    });
  } else if (type === 'gas') {
    // 도시가스 주택용(개별난방) 기준 (MJ 환산 대략 42.5MJ/m3, 단가 약 21.5원/MJ)
    // 1m3당 약 915원 + 기본요금 1,000원
    const baseFee = 1000;
    const gasFee = usage * 915;
    const subtotal = baseFee + gasFee;
    const vat = Math.round(subtotal * 0.1);
    const estimatedTotal = Math.floor((subtotal + vat) / 10) * 10;

    return res.json({
      type: 'gas',
      usageM3: usage,
      estimatedAmount: estimatedTotal,
      isEstimate: true,
      calculationBasis: '수도권 주택용(개별난방) 평균 단가(약 915원/m3 + 기본료) 기준 단순 추정',
      calculationLimit: '도시가스 단가는 지역별(시도별 고시단가), 열량계수, 계절에 따라 상이하므로 참고용으로만 활용하세요.',
      notice: '공식 정산은 관할 도시가스사 방문 기사 확인 또는 고객센터를 통해서만 확정됩니다.'
    });
  }

  res.status(400).json({ error: '알 수 없는 요금 유형입니다.' });
});

// 6. 시뮬레이션 모드 토글 (검증 및 테스트 전용)
app.post('/api/simulation/toggle', (req, res) => {
  const { enableKepco, enableGas } = req.body;
  if (typeof enableKepco === 'boolean') {
    electricityService.enableMock = enableKepco;
  }
  if (typeof enableGas === 'boolean') {
    gasService.enableMock = enableGas;
  }
  res.json({
    kepcoMock: electricityService.enableMock,
    gasMock: gasService.enableMock,
    message: '시뮬레이션 모드 상태가 변경되었습니다.'
  });
});

app.listen(PORT, () => {
  console.log(`[이사 정산 도우미 백엔드 서버] 포트 ${PORT}에서 실행 중`);
});
