// 판교어 사전 데이터 import
import pangyoDictionaryData from '../data/pangyo_dictionary.json';

// 게임 내 아이템 정보
export const ITEMS = {
  DICTIONARY: {
    id: 'dictionary',
    name: '판교어 기초 단어 사전',
    icon: '/assets/icon/dictionary.png',
    description: '기본적인 판교어를 확인할 수 있는 사전',
    stage: 1
  },
  EMAIL_HELPER: {
    id: 'email_helper',
    name: '판교어 번역기',
    icon: '/assets/icon/translator.png',
    description: '업무 메일 작성을 도와주는 도구',
    stage: 2
  },
  MAGNIFIER: {
    id: 'magnifier',
    name: '판교어 돋보기',
    icon: '/assets/icon/magnifier.png',
    description: '판교어에 마우스를 올리면 뜻을 알려주는 도구',
    stage: 3
  },
  WELCOME_KIT: {
    id: 'welcome_kit',
    name: '판교 생존 웰컴 키트',
    icon: '/assets/icon/certificate.png',
    description: '판교 생존에 필요한 모든 것이 담긴 키트',
    stage: 4
  }
};

// 판교어 사전 데이터 (리스트 형식)
// 각 항목은 { term, category, definition, example, keywords } 구조
export const PANGYO_DICTIONARY_LIST = pangyoDictionaryData;

// 카테고리별로 그룹화된 판교어 사전
export const PANGYO_DICTIONARY_BY_CATEGORY = pangyoDictionaryData.reduce((acc, item) => {
  const category = item.category || '기타';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item);
  return acc;
}, {});

// 용어명으로 빠르게 검색할 수 있는 맵 형식
export const PANGYO_DICTIONARY_MAP = pangyoDictionaryData.reduce((acc, item) => {
  acc[item.term] = item;
  return acc;
}, {});

// 전체 카테고리 목록
export const DICTIONARY_CATEGORIES = [...new Set(pangyoDictionaryData.map(item => item.category))].sort();
