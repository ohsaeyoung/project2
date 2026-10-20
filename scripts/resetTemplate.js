import fs from 'fs';

// index.html을 원본 템플릿으로 복원하고 vite build만 실행
fs.writeFileSync('index.html', `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>이사 정산 도우미 | 실시간 전기·도시가스 요금 조회 및 정산 가이드</title>
    <meta name="description" content="이사 당일 전기요금과 도시가스 요금을 빠르고 정확하게 확인하고 정산할 수 있는 이사 정산 도우미 서비스입니다." />
    <!-- Pretendard WebFont -->
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`, 'utf-8');
console.log('Cleaned index.html template');
