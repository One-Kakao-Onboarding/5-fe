import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { PANGYO_DICTIONARY_MAP } from '../constants/items';

const MagnifierTooltip = () => {
  const { magnifierData, hideMagnifier, hasItem } = useGame();
  const [wordInfo, setWordInfo] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 돋보기 아이템을 가지고 있는지 확인
  const hasMagnifier = hasItem('magnifier');

  useEffect(() => {
    if (magnifierData && hasMagnifier) {
      const { word, position: pos } = magnifierData;

      // 사전에서 단어 찾기
      const info = PANGYO_DICTIONARY_MAP[word];

      if (info) {
        setWordInfo(info);

        // 화면 경계를 고려한 위치 조정
        const tooltipWidth = 350;
        const tooltipHeight = 200;
        const padding = 20;

        let x = pos.x;
        let y = pos.y + 20; // 커서 아래에 표시

        // 오른쪽 경계 체크
        if (x + tooltipWidth > window.innerWidth - padding) {
          x = window.innerWidth - tooltipWidth - padding;
        }

        // 왼쪽 경계 체크
        if (x < padding) {
          x = padding;
        }

        // 아래쪽 경계 체크
        if (y + tooltipHeight > window.innerHeight - padding) {
          y = pos.y - tooltipHeight - 20; // 커서 위에 표시
        }

        // 위쪽 경계 체크
        if (y < padding) {
          y = padding;
        }

        setPosition({ x, y });
      } else {
        setWordInfo(null);
      }
    } else {
      setWordInfo(null);
    }
  }, [magnifierData, hasMagnifier]);

  // 클릭 시 툴팁 닫기
  useEffect(() => {
    if (wordInfo) {
      const handleClick = () => {
        hideMagnifier();
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [wordInfo, hideMagnifier]);

  // ESC 키로 닫기
  useEffect(() => {
    if (wordInfo) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          hideMagnifier();
        }
      };

      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [wordInfo, hideMagnifier]);

  return (
    <AnimatePresence>
      {wordInfo && hasMagnifier && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-2xl border-2 border-kakao-yellow p-4 max-w-sm pointer-events-auto">
            {/* 돋보기 아이콘 헤더 */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
              <span className="text-2xl">🔍</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-kakao-brown">
                  {wordInfo.term}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-kakao-yellow bg-opacity-30 text-kakao-brown rounded-full">
                  {wordInfo.category}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hideMagnifier();
                }}
                className="text-gray-400 hover:text-gray-600 text-xl w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* 단어 정의 */}
            <div className="mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {wordInfo.definition}
              </p>
            </div>

            {/* 사용 예시 */}
            {wordInfo.example && (
              <div className="bg-kakao-lightGray rounded-lg p-3 border-l-4 border-kakao-yellow">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-kakao-brown">예시: </span>
                  {wordInfo.example}
                </p>
              </div>
            )}

            {/* 힌트 텍스트 */}
            <p className="text-xs text-gray-400 mt-2 text-center">
              클릭하거나 ESC를 눌러 닫기
            </p>

            {/* 화살표 (위치에 따라 표시) */}
            {position.y > magnifierData?.position?.y && (
              <div className="absolute bottom-full left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-kakao-yellow" />
            )}
            {position.y <= magnifierData?.position?.y && (
              <div className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-kakao-yellow" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MagnifierTooltip;
