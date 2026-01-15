import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { translate } from '../services/translationService';

const EmailTranslator = () => {
  const { showEmailTranslator, closeEmailTranslator } = useGame();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState('toNormal'); // 'toNormal' | 'toPangyo'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('번역할 텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const result = await translate(inputText, direction);
      setOutputText(result);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || '번역 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const handleCopyOutput = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      alert('번역 결과가 클립보드에 복사되었습니다!');
    }
  };

  if (!showEmailTranslator) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 배경 오버레이 */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeEmailTranslator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* 모달 콘텐츠 */}
        <motion.div
          className="relative bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-kakao-yellow to-yellow-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                📧
              </div>
              <div>
                <h2 className="text-2xl font-bold text-kakao-brown">
                  메일 작성 도우미
                </h2>
                <p className="text-sm text-gray-600">
                  판교어 ↔ 일반어 번역기
                </p>
              </div>
            </div>
            <button
              onClick={closeEmailTranslator}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* 번역 방향 선택 */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="bg-gray-100 rounded-full p-2 flex items-center gap-2">
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  direction === 'toNormal'
                    ? 'bg-kakao-yellow text-kakao-brown shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  setDirection('toNormal');
                  setOutputText('');
                  setError(null);
                }}
              >
                판교어 → 일반어
              </button>
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  direction === 'toPangyo'
                    ? 'bg-kakao-yellow text-kakao-brown shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => {
                  setDirection('toPangyo');
                  setOutputText('');
                  setError(null);
                }}
              >
                일반어 → 판교어
              </button>
            </div>
          </div>

          {/* 입력/출력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {direction === 'toNormal' ? '판교어 텍스트' : '일반 한국어 텍스트'}
              </label>
              <textarea
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kakao-yellow resize-none"
                placeholder={
                  direction === 'toNormal'
                    ? '번역할 판교어 메일을 입력하세요...\n\n예시: "다음 주 미팅 인비 보내주세요. 현재 리소스가 풀이라 얼라인이 필요합니다."'
                    : '일반 한국어로 작성한 메일을 입력하세요...\n\n예시: "다음 주 회의 초대장을 보내주세요. 현재 업무가 많아서 일정 조율이 필요합니다."'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {/* 출력 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {direction === 'toNormal' ? '일반 한국어' : '판교어 버전'}
              </label>
              <div className="relative">
                <div className="w-full h-64 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-y-auto whitespace-pre-wrap">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          className="w-12 h-12 border-4 border-kakao-yellow border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <p className="text-sm text-gray-500">번역 중...</p>
                      </div>
                    </div>
                  ) : outputText ? (
                    <p className="text-gray-800 leading-relaxed">{outputText}</p>
                  ) : (
                    <p className="text-gray-400 text-center mt-20">
                      번역 결과가 여기에 표시됩니다
                    </p>
                  )}
                </div>

                {/* 복사 버튼 */}
                {outputText && !isLoading && (
                  <motion.button
                    className="absolute top-2 right-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700"
                    onClick={handleCopyOutput}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📋 복사
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <motion.div
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end">
            <motion.button
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
              onClick={handleClear}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              초기화
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-kakao-yellow to-yellow-400 hover:from-yellow-400 hover:to-kakao-yellow text-kakao-brown font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '번역 중...' : '번역하기 ✨'}
            </motion.button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              💡 <strong>팁:</strong> 메일 작성 도우미는 AI를 활용하여 판교어와 일반 한국어를 자연스럽게 번역합니다.
              번역 결과를 참고하여 상황에 맞게 수정해서 사용하세요!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailTranslator;
