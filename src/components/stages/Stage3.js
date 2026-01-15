import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

const Stage3 = () => {
  const { addDialogue, addItemToInventory, goToNextStage } = useGame();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const requiredKeywords = ['백업', '슬랙', '대응'];

  useEffect(() => {
    // 초기 NPC 대화
    const timer1 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '프로젝트가 드디어 끝났네요! 수고하셨습니다! 🎉',
        timestamp: getCurrentTime(),
      });
    }, 500);

    const timer2 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '이제 휴가(오프)를 가실 수 있을 것 같은데요,\n휴가 전에 팀원들에게 부재중 메일을 보내주세요!',
        timestamp: getCurrentTime(),
      });
    }, 2500);

    const timer3 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '필수 포함 사항:\n- 백업 담당자\n- 연락 방법 (슬랙 등)\n- 긴급 상황 대응 방법',
        timestamp: getCurrentTime(),
      });
    }, 4500);

    const timer4 = setTimeout(() => {
      setShowEmailForm(true);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [addDialogue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || !emailContent.trim()) return;

    // 필수 키워드 검사
    const missingKeywords = requiredKeywords.filter(
      (keyword) => !emailContent.includes(keyword)
    );

    // 사용자 메일 추가
    addDialogue({
      sender: 'user',
      text: `[메일 작성]\n\n${emailContent}`,
      timestamp: getCurrentTime(),
    });

    setShowEmailForm(false);
    setSubmitted(true);

    if (missingKeywords.length === 0) {
      // 정답
      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '완벽한 부재중 메일이네요! 👍\n모든 필수 요소가 포함되어 있습니다!',
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '- ✅ 백업 담당자 지정\n- ✅ 연락 방법 명시 (슬랙)\n- ✅ 긴급 상황 대응 방법\n\n완벽해요!',
          timestamp: getCurrentTime(),
        });
      }, 3000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '이제 판교어 돋보기를 드릴게요! 🔍\n마우스를 올리면 판교어 뜻을 알려줍니다!',
          timestamp: getCurrentTime(),
        });
      }, 5500);

      setTimeout(() => {
        // 아이템 획득
        addItemToInventory(ITEMS.MAGNIFIER);
      }, 7000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '마지막 단계로 이동합니다!',
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
          text: `음... 필수 요소가 빠졌네요! 😅\n다음 키워드를 포함해주세요:\n${missingKeywords.map((k) => `- ${k}`).join('\n')}`,
          timestamp: getCurrentTime(),
        });
      }, 1000);

      setTimeout(() => {
        addDialogue({
          sender: 'npc',
          text: '다시 작성해주세요!',
          timestamp: getCurrentTime(),
        });
        setSubmitted(false);
        setShowEmailForm(true);
        setEmailContent('');
      }, 3000);
    }
  };

  return (
    <ChatInterface>
      {showEmailForm && !submitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kakao-yellow resize-none"
            rows="6"
            placeholder="부재중 메일을 작성하세요...&#10;&#10;예시:&#10;안녕하세요,&#10;○월 ○일부터 ○일까지 오프 예정입니다.&#10;긴급한 사항은..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />

          <motion.button
            type="submit"
            className="w-full bg-kakao-yellow hover:bg-yellow-400 text-kakao-brown font-bold py-3 rounded-xl transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!emailContent.trim()}
          >
            메일 보내기 📤
          </motion.button>

          <p className="text-xs text-gray-500 text-center">
            필수 포함: 백업, 슬랙, 대응
          </p>
        </motion.form>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage3;
