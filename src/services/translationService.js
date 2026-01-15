// 판교어 번역 서비스
// API 서버 주소
const API_BASE_URL = 'http://192.168.8.204:8000';

/**
 * 판교어 변환 API를 사용한 번역
 * @param {string} text - 번역할 텍스트
 * @param {string} direction - 'toNormal' (판교어→일반어) 또는 'toPangyo' (일반어→판교어)
 * @returns {Promise<string>} 번역된 텍스트
 */
export const translate = async (text, direction = 'toNormal') => {
  if (!text || !text.trim()) {
    throw new Error('번역할 텍스트를 입력해주세요.');
  }

  try {
    let response;
    let endpoint;
    let body;

    if (direction === 'toNormal') {
      // 판교어 → 일반어
      endpoint = `${API_BASE_URL}/to-normal`;
      body = { sentence: text };
    } else {
      // 일반어 → 판교어
      endpoint = `${API_BASE_URL}/translate`;
      body = { sentence: text, top_k: 10 };
    }

    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `번역 요청 실패 (${response.status})`);
    }

    const data = await response.json();

    // 번역된 텍스트만 반환
    return data.translated;
  } catch (error) {
    console.error('Translation error:', error);

    // 타임아웃 에러 처리
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error('번역 요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    // 네트워크 에러 처리
    if (error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    }

    throw error;
  }
};
