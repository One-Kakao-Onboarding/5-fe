const fs = require('fs');
const Papa = require('papaparse');

// 파일 설정
const INPUT_FILE = 'src/data/dict.csv';
const OUTPUT_FILE = 'src/data/pangyo_dictionary.json'; // React 프로젝트 경로에 맞게 수정하세요

try {
  // 1. 파일 읽기
  const csvFile = fs.readFileSync(INPUT_FILE, 'utf8');

  // 2. 앞의 불필요한 5줄 제거 (메타데이터 건너뛰기)
  // 줄바꿈 문자로 나누고 6번째 줄부터 다시 합칩니다.
  const rows = csvFile.split('\n').slice(5).join('\n');

  // 3. CSV 파싱 (PapaParse 사용)
  Papa.parse(rows, {
    header: true, // 첫 줄을 키값으로 사용
    skipEmptyLines: true,
    complete: (results) => {
      // 4. 데이터 가공 (필요한 컬럼만 추출 및 이름 변경)
      const formattedData = results.data
        .filter(item => item['용어/표현']) // 용어가 없는 행 제거
        .map(item => ({
          term: item['용어/표현'],
          category: item['카테고리'] || '',
          definition: item['정의'] || '',
          example: item['용례'] || '',
          keywords: item['키워드'] || ''
        }));

      // 5. JSON 파일 저장
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedData, null, 2), 'utf8');
      
      console.log(`✅ 변환 성공! ${formattedData.length}개의 데이터가 변환되었습니다.`);
      console.log(`📂 저장 위치: ${OUTPUT_FILE}`);
    },
    error: (err) => {
      console.error("❌ 파싱 중 에러 발생:", err);
    }
  });

} catch (err) {
  console.error("❌ 파일을 읽을 수 없습니다. 파일명을 확인해주세요.", err);
}