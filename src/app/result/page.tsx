'use client';

import { ArrowLeft, Share2, Download, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const moodParam = searchParams.get('mood') || 'happy';
    const contentParam = searchParams.get('content') || '';

    const moodData: Record<string, any> = {
        happy: {
            image: '/monster_happy.png',
            name: '햇살 가득 몽글이',
            desc: '당신의 밝은 미소를 닮아 온몸에서 빛이 나요.\n오늘 하루도 정말 반짝거렸군요!',
            color: 'bg-yellow-50',
            icon: '😊'
        },
        sad: {
            image: '/monster.png',
            name: '포근한 구름이',
            desc: '당신의 차분한 마음을 조용히 안아주는 친구예요.\n가끔은 쉬어가도 괜찮아요.',
            color: 'bg-blue-50',
            icon: '☁️'
        },
        angry: {
            image: '/monster_angry.png',
            name: '불꽃 씩씩이',
            desc: '뜨거운 열정을 품고 있군요!\n화나는 일도 에너지로 바꿔버리는 멋진 친구예요.',
            color: 'bg-red-50',
            icon: '😠'
        },
        tired: {
            image: '/monster_tired.png',
            name: '녹아내리는 멜팅이',
            desc: '오늘 하루 너무 고생 많았어요.\n이 친구처럼 푹 늘어져서 충전할 시간이에요.',
            color: 'bg-purple-50',
            icon: '🫠'
        },
        calm: {
            image: '/monster_calm.png',
            name: '평화로운 숲숲이',
            desc: '마음이 고요한 호수 같네요.\n따뜻한 차 한 잔 마시며 여유를 즐기세요.',
            color: 'bg-green-50',
            icon: '😌'
        },
        anxious: {
            image: '/monster_anxious.png',
            name: '소심한 걱정이',
            desc: '괜찮아요, 아무 일도 일어나지 않을 거예요.\n이 친구가 당신의 걱정을 대신 먹어줄게요.',
            color: 'bg-orange-50',
            icon: '😟'
        }
    };

    const currentMonster = moodData[moodParam] || moodData.happy;

    const handleSave = () => {
        const savedLogs = localStorage.getItem('moodLogs');
        const logs = savedLogs ? JSON.parse(savedLogs) : {};

        logs[dateParam] = {
            type: moodParam,
            icon: currentMonster.icon,
            image: currentMonster.image,
            color: currentMonster.color,
            monsterName: currentMonster.name,
            content: contentParam
        };

        localStorage.setItem('moodLogs', JSON.stringify(logs));
        router.push('/');
    };

    return (
        <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${currentMonster.color}`}>
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
                            src={currentMonster.image}
                            alt="Generated Mood Monster"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>

                    <div className="relative z-10 mt-2">
                        <h2 className="text-2xl font-bold text-text-main mb-2">'{currentMonster.name}'를 만나보세요</h2>
                        <p className="text-text-sub text-sm leading-relaxed px-4 whitespace-pre-line">
                            {currentMonster.desc}
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
