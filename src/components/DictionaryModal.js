import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import {
  PANGYO_DICTIONARY_LIST,
  PANGYO_DICTIONARY_BY_CATEGORY,
  DICTIONARY_CATEGORIES
} from '../constants/items';

const DictionaryModal = () => {
  const { showDictionaryModal, closeDictionary } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 검색 및 필터링된 단어 목록
  const filteredWords = useMemo(() => {
    let words = PANGYO_DICTIONARY_LIST;

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      words = PANGYO_DICTIONARY_BY_CATEGORY[selectedCategory] || [];
    }

    // 검색어 필터
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      words = words.filter(item =>
        item.term.toLowerCase().includes(search) ||
        item.definition.toLowerCase().includes(search) ||
        item.keywords.toLowerCase().includes(search)
      );
    }

    return words;
  }, [searchTerm, selectedCategory]);

  return (
    <AnimatePresence>
      {showDictionaryModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeDictionary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">📚</span>
                  <h2 className="text-2xl font-bold text-kakao-brown">
                    판교어 기초 단어 사전
                  </h2>
                </div>
                <button
                  onClick={closeDictionary}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* 검색바 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="단어, 뜻, 키워드로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-kakao-yellow"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              {/* 카테고리 필터 */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('전체')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === '전체'
                      ? 'bg-kakao-yellow text-kakao-brown'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  전체 ({PANGYO_DICTIONARY_LIST.length})
                </button>
                {DICTIONARY_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-kakao-yellow text-kakao-brown'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category} ({PANGYO_DICTIONARY_BY_CATEGORY[category]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* 단어 목록 */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredWords.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">검색 결과가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWords.map((item, index) => (
                    <motion.div
                      key={`${item.term}-${index}`}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-kakao-brown">
                              {item.term}
                            </h3>
                            <span className="px-2 py-1 bg-kakao-yellow bg-opacity-30 text-kakao-brown text-xs rounded-full">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">
                            {item.definition}
                          </p>
                          {item.example && (
                            <div className="bg-white rounded p-3 border-l-4 border-kakao-yellow">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">예시: </span>
                                {item.example}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-sm text-gray-500 text-center">
                총 {filteredWords.length}개의 단어
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DictionaryModal;
