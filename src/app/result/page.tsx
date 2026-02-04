'use client';

import { ArrowLeft, Share2, Download, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const moodParam = searchParams.get('mood') || 'happy';
    const contentParam = searchParams.get('content') || '';

    const [finalMonster, setFinalMonster] = useState<any>(null);

    const moodData: Record<string, any> = {
        happy: {
            name: '햇살 가득 몽글이',
            desc: '당신의 밝은 미소를 닮아 온몸에서 빛이 나요.\n오늘 하루도 정말 반짝거렸군요!',
            color: 'bg-yellow-50',
            icon: '😊',
            variants: [
                { image: '/monster_happy.png', desc: '당신의 밝은 미소를 닮아 온몸에서 빛이 나요.\n오늘 하루도 정말 반짝거렸군요!' },
                { image: '/monster_happy_var1.png', desc: '오늘은 특별한 날인가요? 파티 분위기가 물씬 나네요!\n즐거움이 팡팡 터지는 하루였군요.' },
                { image: '/monster_happy_var2.png', desc: '와우! 당신은 오늘 진정한 챔피언이에요!\n스스로를 자랑스러워해도 충분한 하루군요.' }
            ]
        },
        sad: {
            name: '포근한 구름이',
            desc: '당신의 차분한 마음을 조용히 안아주는 친구예요.\n가끔은 쉬어가도 괜찮아요.',
            color: 'bg-blue-50',
            icon: '☁️',
            variants: [
                { image: '/monster.png', desc: '당신의 차분한 마음을 조용히 안아주는 친구예요.\n가끔은 쉬어가도 괜찮아요.' },
                { image: '/monster_sad_var1.png', desc: '마음이 조금 지쳤나요?\n이 친구가 곰인형과 함께 당신을 따뜻하게 위로해 줄 거예요.' },
                { image: '/monster_sad_var2.png', desc: '비가 오는 날처럼 마음이 촉촉한가요?\n이 우산이 당신의 슬픔을 잠시 막아줄게요.' }
            ]
        },
        angry: {
            name: '불꽃 씩씩이',
            desc: '뜨거운 열정을 품고 있군요!\n화나는 일도 에너지로 바꿔버리는 멋진 친구예요.',
            color: 'bg-red-50',
            icon: '😠',
            variants: [
                { image: '/monster_angry.png', desc: '뜨거운 열정을 품고 있군요!\n화나는 일도 에너지로 바꿔버리는 멋진 친구예요.' },
                { image: '/monster_angry_var1.png', desc: '머리에서 김이 날 정도로 화가 났군요!\n이 친구와 함께 크게 소리치고 털어버리세요.' },
                { image: '/monster_angry_var2.png', desc: '이제 그만! 이라고 외치고 싶은 순간인가요?\n당신의 단호한 마음을 확성기로 크게 알려봐요.' }
            ]
        },
        tired: {
            name: '녹아내리는 멜팅이',
            desc: '오늘 하루 너무 고생 많았어요.\n이 친구처럼 푹 늘어져서 충전할 시간이에요.',
            color: 'bg-purple-50',
            icon: '🫠',
            variants: [
                { image: '/monster_tired.png', desc: '오늘 하루 너무 고생 많았어요.\n이 친구처럼 푹 늘어져서 충전할 시간이에요.' },
                { image: '/monster_tired_var1.png', desc: '지금 당장 침대가 필요해 보이네요.\n수면 모자를 쓴 멜팅이와 함께 꿀잠 자러 가요.' },
                { image: '/monster_tired_var2.png', desc: '배터리가 0%가 되었군요...\n아무것도 하지 말고 푹 쉬는 게 최고의 처방약이에요.' }
            ]
        },
        calm: {
            name: '평화로운 숲숲이',
            desc: '마음이 고요한 호수 같네요.\n따뜻한 차 한 잔 마시며 여유를 즐기세요.',
            color: 'bg-green-50',
            icon: '😌',
            variants: [
                { image: '/monster_calm.png', desc: '마음이 고요한 호수 같네요.\n따뜻한 차 한 잔 마시며 여유를 즐기세요.' },
                { image: '/monster_calm_var1.png', desc: '좋아하는 음악과 함께하는 휴식인가요?\n지금 이 순간의 평온함을 마음껏 즐기세요.' },
                { image: '/monster_calm_var2.png', desc: '구름 위에 둥둥 떠있는 기분인가요?\n아무 생각 없이 이 편안함을 즐겨보세요.' }
            ]
        },
        anxious: {
            name: '소심한 걱정이',
            desc: '괜찮아요, 아무 일도 일어나지 않을 거예요.\n이 친구가 당신의 걱정을 대신 먹어줄게요.',
            color: 'bg-orange-50',
            icon: '😟',
            variants: [
                { image: '/monster_anxious.png', desc: '괜찮아요, 아무 일도 일어나지 않을 거예요.\n이 친구가 당신의 걱정을 대신 먹어줄게요.' },
                { image: '/monster_anxious_var1.png', desc: '세상이 조금 무섭게 느껴진다면 잠시 숨어도 괜찮아요.\n상자 안은 안전하고 포근하니까요.' },
                { image: '/monster_anxious_var2.png', desc: '손톱을 물어뜯을 만큼 걱정이 되나요?\n괜찮아요, 이 친구와 함께 천천히 심호흡을 해봐요.' }
            ]
        }
    };

    useEffect(() => {
        const baseData = moodData[moodParam] || moodData.happy;
        const randomVariant = baseData.variants[Math.floor(Math.random() * baseData.variants.length)];

        setFinalMonster({
            ...baseData,
            image: randomVariant.image,
            desc: randomVariant.desc
        });
    }, [moodParam]);

    const handleSave = () => {
        if (!finalMonster) return;

        const savedLogs = localStorage.getItem('moodLogs');
        const logs = savedLogs ? JSON.parse(savedLogs) : {};

        logs[dateParam] = {
            type: moodParam,
            icon: finalMonster.icon,
            image: finalMonster.image,
            color: finalMonster.color,
            monsterName: finalMonster.name,
            content: contentParam
        };

        localStorage.setItem('moodLogs', JSON.stringify(logs));
        router.push('/');
    };

    if (!finalMonster) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

    return (
        <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${finalMonster.color}`}>
            {/* Header */}
            <header className="p-6 pt-8 flex items-center justify-between text-text-main z-10">
                <Link href="/hatch">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="font-bold">나의 무드 몬스터 만나기</span>
                <Share2 className="w-6 h-6 text-text-sub" />
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-12 animate-fade-in">
                {/* Monster Card */}
                <div className="bg-white p-4 pb-8 rounded-[32px] w-full max-w-sm shadow-xl shadow-black/5 flex flex-col items-center text-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent z-0 opacity-50`} />

                    <div className="relative z-10 my-4 w-64 h-64">
                        <Image
                            src={finalMonster.image}
                            alt="Generated Mood Monster"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>

                    <div className="relative z-10 mt-2">
                        <h2 className="text-2xl font-bold text-text-main mb-2">'{finalMonster.name}'를 만나보세요</h2>
                        <p className="text-text-sub text-sm leading-relaxed px-4 whitespace-pre-line">
                            {finalMonster.desc}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="w-full max-w-sm mt-8 space-y-3">
                    <button
                        onClick={handleSave}
                        className="btn-primary w-full justify-center shadow-lg shadow-orange-200"
                    >
                        <Download className="w-5 h-5" />
                        달력에 저장하기
                    </button>
                    <Link href="/log" className="w-full bg-white text-text-sub py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <RotateCcw className="w-5 h-5" />
                        다시 만들기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResultContent />
        </Suspense>
    )
}
