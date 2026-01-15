import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

const Stage1 = () => {
  const { addDialogue, addItemToInventory, goToNextStage } = useGame();
  const [showChoices, setShowChoices] = useState(false);
  const [answered, setAnswered] = useState(false);

  const choices = [
    { id: 1, text: '네, 참석하겠습니다!', isCorrect: false },
    { id: 2, text: '그럼 인비(Invitation) 보내주세요~', isCorrect: true },
    { id: 3, text: '2시요? 알겠습니다.', isCorrect: false },
  ];

  useEffect(() => {
    // 초기 NPC 대화
    const timer1 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '안녕하세요! 오늘 첫 출근이시네요. 환영합니다! 👋',
        timestamp: getCurrentTime(),
      });
    }, 500);

    const timer2 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '아, 그리고 오늘 오후 2시에 팀 미팅이 있는데요,\n참석 가능하신가요?',
        timestamp: getCurrentTime(),
      });
    }, 2000);

    const timer3 = setTimeout(() => {
      setShowChoices(true);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [addDialogue]);

  const handleChoice = (choice) => {
    if (answered) return;

    // 사용자 응답 추가
    addDialogue({
      sender: 'user',
      text: choice.text,
      timestamp: getCurrentTime(),
    });

    setShowChoices(false);
    setAnswered(true);

    if (choice.isCorrect) {
      // 정답
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '오! 벌써 판교어를 알고 계시네요! 😊\n"인비(Invitation)"는 회의 초대를 의미합니다.\n방금 캘린더에 인비 보내드렸어요!',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '첫 출근부터 훌륭하세요!\n이 판교어 기초 단어 사전을 드릴게요. 📚',
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        // 아이템 획득
        addItemToInventory(ITEMS.DICTIONARY);
      }, 4500);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다음 단계로 넘어가볼까요?',
          timestamp: getCurrentTime(),
        });
      }, 6000);

      setTimeout(() => {
        goToNextStage();
      }, 7500);
    } else {
      // 오답
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '음... 회의에 참석하려면 캘린더 초대가 필요해요.\n판교에서는 "인비(Invitation)"라고 부른답니다! 😅',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다시 한번 선택해보세요!',
          timestamp: getCurrentTime(),
        });
        setAnswered(false);
        setShowChoices(true);
      }, 3000);
    }
  };

  return (
    <ChatInterface>
      {showChoices && !answered && (
        <div className="space-y-3">
          {choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              className="w-full bg-white hover:bg-kakao-yellow border-2 border-gray-200 hover:border-kakao-yellow rounded-xl px-4 py-3 text-left transition-all shadow-sm hover:shadow-md"
              onClick={() => handleChoice(choice)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium text-gray-800">
                {choice.text}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage1;
