import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const InventoryBar = () => {
  const { inventory, openDictionary, openEmailTranslator } = useGame();
  const [hoveredItem, setHoveredItem] = useState(null);

  // 아이템 클릭 핸들러
  const handleItemClick = (item) => {
    if (item.id === 'dictionary') {
      openDictionary();
    } else if (item.id === 'email_helper') {
      openEmailTranslator();
    }
    // 추후 다른 아이템들의 기능 추가 가능
  };

  return (
    <div className="w-full bg-white border-t-2 border-gray-200 px-6 py-4 relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-kakao-brown">내 아이템</h3>

          <div className="flex gap-3">
            {inventory.length === 0 ? (
              <p className="text-sm text-gray-400">아직 획득한 아이템이 없습니다</p>
            ) : (
              inventory.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    className="w-14 h-14 bg-kakao-yellow rounded-xl flex items-center justify-center text-3xl cursor-pointer shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleItemClick(item)}
                  >
                    <img
                      src={item.icon}
                    />
                  </motion.div>

                  {/* 툴팁 */}
                  <AnimatePresence>
                    {hoveredItem === item.id && (
                      <motion.div
                        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-kakao-brown text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-gray-300 text-xs mt-1">
                          {item.description}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-kakao-brown" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryBar;
