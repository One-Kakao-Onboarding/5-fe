import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

const Stage2 = () => {
  const { addDialogue, addItemToInventory, goToNextStage } = useGame();
  const [showChoices, setShowChoices] = useState(false);
  const [answered, setAnswered] = useState(false);

  const choices = [
    {
      id: 1,
      text: '죄송하지만 지금 급한 일이 있어서 나중에 할게요.',
      isCorrect: false,
      keywords: [],
    },
    {
      id: 2,
      text: '현재 리소스가 풀이라 다른 업무는 내일 시작 가능할 것 같아요. 이 아이디어를 디벨롭해서 팀에 공유드릴게요!',
      isCorrect: true,
      keywords: ['리소스', '풀', '디벨롭', '공유'],
    },
    {
      id: 3,
      text: '네, 바로 하겠습니다!',
      isCorrect: false,
      keywords: [],
    },
  ];

  useEffect(() => {
    // 초기 NPC 대화
    const timer1 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '저기요~ 갑자기 급한 업무가 생겼는데요,\n이거 좀 도와주실 수 있나요? 🙏',
        timestamp: getCurrentTime(),
      });
    }, 500);

    const timer2 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '지금 하던 업무도 있으실 텐데...\n어떻게 대응하시겠어요?',
        timestamp: getCurrentTime(),
      });
    }, 2500);

    const timer3 = setTimeout(() => {
      setShowChoices(true);
    }, 4000);

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
          text: '완벽해요! 👏\n리소스(Resource)와 풀(Full)을 적절히 사용하셨네요!\n업무 우선순위를 명확히 하고, 소통하는 것이 중요합니다.',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '판교어 키워드도 잘 활용하셨어요:\n- 리소스: 자원, 인력\n- 풀: 가득 찬 상태\n- 디벨롭: 발전시키다\n- 공유: 정보를 나누다',
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '업무 메일 작성할 때 유용한\n"메일 작성 도우미"를 드릴게요! 📧',
          timestamp: getCurrentTime(),
        });
      }, 5500);

      setTimeout(() => {
        // 아이템 획득
        addItemToInventory(ITEMS.EMAIL_HELPER);
      }, 7000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다음 단계로 이동할게요!',
          timestamp: getCurrentTime(),
        });
      }, 8500);

      setTimeout(() => {
        goToNextStage();
      }, 10000);
    } else {
      // 오답
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '음... 판교에서는 좀 더 구체적으로\n상황을 설명하는 게 좋아요! 😅',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '힌트: "리소스", "풀", "디벨롭", "공유" 같은\n판교어를 사용해보세요!',
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다시 선택해주세요!',
          timestamp: getCurrentTime(),
        });
        setAnswered(false);
        setShowChoices(true);
      }, 5000);
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

export default Stage2;
