// 판교어 번역 서비스
import { PANGYO_DICTIONARY_LIST } from '../constants/items';

// 판교어 사전을 컨텍스트로 변환
const getDictionaryContext = () => {
  return PANGYO_DICTIONARY_LIST.map(
    item => `${item.term}: ${item.definition} (예: ${item.example})`
  ).join('\n');
};

/**
 * OpenAI API를 사용한 번역
 * @param {string} text - 번역할 텍스트
 * @param {string} direction - 'toNormal' (판교어→일반어) 또는 'toPangyo' (일반어→판교어)
 * @returns {Promise<string>} 번역된 텍스트
 */
export const translateWithOpenAI = async (text, direction = 'toNormal') => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_OPENAI_API_KEY를 설정해주세요.');
  }

  const dictionaryContext = getDictionaryContext();

  const systemPrompt = direction === 'toNormal'
    ? `당신은 IT 업계의 판교어(업계 은어)를 일반 한국어로 번역하는 전문가입니다.

[판교어 사전]
${dictionaryContext}

사용자가 제공한 텍스트에서 판교어를 찾아 일반 한국어로 자연스럽게 변환하세요.
번역 후에는 다음 형식으로 응답하세요:

[번역된 텍스트]
(번역된 내용)

[사용된 판교어]
- 판교어: 일반어 설명`
    : `당신은 일반 한국어를 IT 업계의 판교어(업계 은어)로 변환하는 전문가입니다.

[판교어 사전]
${dictionaryContext}

사용자가 제공한 일반 한국어 텍스트를 판교어를 적절히 사용하여 전문적이고 세련된 업무 메일 스타일로 변환하세요.
번역 후에는 다음 형식으로 응답하세요:

[판교어 버전]
(변환된 내용)

[사용한 판교어]
- 판교어: 의미 설명`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '번역 요청 실패');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

/**
 * Claude API를 사용한 번역 (대안)
 * @param {string} text - 번역할 텍스트
 * @param {string} direction - 'toNormal' (판교어→일반어) 또는 'toPangyo' (일반어→판교어)
 * @returns {Promise<string>} 번역된 텍스트
 */
export const translateWithClaude = async (text, direction = 'toNormal') => {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_ANTHROPIC_API_KEY를 설정해주세요.');
  }

  const dictionaryContext = getDictionaryContext();

  const systemPrompt = direction === 'toNormal'
    ? `당신은 IT 업계의 판교어(업계 은어)를 일반 한국어로 번역하는 전문가입니다.

[판교어 사전]
${dictionaryContext}

사용자가 제공한 텍스트에서 판교어를 찾아 일반 한국어로 자연스럽게 변환하세요.`
    : `당신은 일반 한국어를 IT 업계의 판교어(업계 은어)로 변환하는 전문가입니다.

[판교어 사전]
${dictionaryContext}

사용자가 제공한 일반 한국어 텍스트를 판교어를 적절히 사용하여 전문적이고 세련된 업무 메일 스타일로 변환하세요.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n번역할 텍스트:\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '번역 요청 실패');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

/**
 * 기본 번역 함수 (OpenAI 사용)
 */
export const translate = translateWithOpenAI;
