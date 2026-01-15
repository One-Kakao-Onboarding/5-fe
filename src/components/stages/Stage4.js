import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ITEMS } from '../../constants/items';
import ChatInterface from '../ChatInterface';

const Stage4 = () => {
  const { addDialogue, addItemToInventory } = useGame();
  const [showRetrospectiveForm, setShowRetrospectiveForm] = useState(false);
  const [retrospectiveContent, setRetrospectiveContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showEnding, setShowEnding] = useState(false);

  useEffect(() => {
    // 초기 NPC 대화
    const timer1 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '휴가 잘 다녀오셨나요? 😊',
        timestamp: getCurrentTime(),
      });
    }, 500);

    const timer2 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '이제 프로젝트 회고(Retrospective) 시간입니다!\n지금까지의 경험을 돌아보는 시간이에요.',
        timestamp: getCurrentTime(),
      });
    }, 2500);

    const timer3 = setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '다음 질문에 대해 간단히 작성해주세요:\n- 잘한 점 (Good)\n- 아쉬운 점 (Bad)\n- 개선할 점 (Action)',
        timestamp: getCurrentTime(),
      });
    }, 4500);

    const timer4 = setTimeout(() => {
      setShowRetrospectiveForm(true);
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
    if (submitted || !retrospectiveContent.trim()) return;

    // 사용자 회고 추가
    addDialogue({
      sender: 'user',
      text: `[회고 작성]\n\n${retrospectiveContent}`,
      timestamp: getCurrentTime(),
    });

    setShowRetrospectiveForm(false);
    setSubmitted(true);

    // 성공 메시지
    setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '훌륭한 회고네요! 👏\n자신을 돌아보고 개선점을 찾는 자세가 멋져요!',
        timestamp: getCurrentTime(),
      });
    }, 1000);

    setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '지금까지 정말 수고 많으셨습니다!\n판교 생존의 모든 단계를 완료하셨어요! 🎉',
        timestamp: getCurrentTime(),
      });
    }, 3000);

    setTimeout(() => {
      addDialogue({
        sender: 'npc',
        text: '축하드립니다! 🎁\n"판교 생존 웰컴 키트"를 드릴게요!',
        timestamp: getCurrentTime(),
      });
    }, 5500);

    setTimeout(() => {
      // 마지막 아이템 획득
      addItemToInventory(ITEMS.WELCOME_KIT);
    }, 7000);

    setTimeout(() => {
      setShowEnding(true);
    }, 9000);
  };

  return (
    <ChatInterface>
      {showRetrospectiveForm && !submitted && (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kakao-yellow resize-none"
            rows="8"
            placeholder="회고를 작성하세요...&#10;&#10;Good (잘한 점):&#10;- &#10;&#10;Bad (아쉬운 점):&#10;- &#10;&#10;Action (개선할 점):&#10;- "
            value={retrospectiveContent}
            onChange={(e) => setRetrospectiveContent(e.target.value)}
          />

          <motion.button
            type="submit"
            className="w-full bg-kakao-yellow hover:bg-yellow-400 text-kakao-brown font-bold py-3 rounded-xl transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!retrospectiveContent.trim()}
          >
            회고 제출하기 ✍️
          </motion.button>
        </motion.form>
      )}

      {showEnding && (
        <motion.div
          className="text-center py-8 space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-2xl font-bold text-kakao-brown">
            판교 생존 완료!
          </h2>
          <p className="text-gray-600">
            이제 당신은 진정한 판교인입니다!
          </p>
          <div className="flex justify-center gap-2 text-4xl mt-6">
            📚 📧 🔍 🎁
          </div>
          <motion.div
            className="mt-8 bg-kakao-yellow text-kakao-brown font-bold py-4 px-6 rounded-xl inline-block"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            모든 아이템을 획득했습니다! ✨
          </motion.div>
        </motion.div>
      )}
    </ChatInterface>
  );
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export default Stage4;
