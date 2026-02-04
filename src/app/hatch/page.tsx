'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';

function HatchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const moodParam = searchParams.get('mood') || 'happy';
    const contentParam = searchParams.get('content') || '';

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    const query = new URLSearchParams({
                        ...(dateParam ? { date: dateParam } : {}),
                        mood: moodParam,
                        content: contentParam
                    }).toString();
                    router.push(`/result?${query}`);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [router, dateParam, moodParam, contentParam]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-6 text-center">
            {/* Egg Animation */}
            <div className="relative mb-12">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-200/40 blur-[60px] rounded-full animate-pulse" />

                {/* The Egg */}
                <div className="w-48 h-60 bg-gradient-to-br from-[#FFF5F0] to-[#FFD8C7] shadow-inner relative z-10 animate-bounce-slow flex items-center justify-center"
                    style={{
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: 'inset -10px -10px 40px rgba(255, 160, 122, 0.2), 0 20px 40px rgba(255, 160, 122, 0.3)'
                    }}>
                    <Sparkles className="w-8 h-8 text-orange-400 absolute top-10 right-10 animate-pulse" />
                </div>
            </div>

            <div className="z-10 w-full animate-fade-in max-w-xs">
                <h2 className="text-2xl font-bold text-text-main mb-2">
                    몬스터가 태어나고 있어요!
                </h2>
                <p className="text-text-sub mb-8">
                    {progress < 50 ? '알을 조심스럽게 품는 중...' : '껍질이 조금씩 움직여요!'}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-orange-300 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-3 text-sm text-primary font-bold">{progress}%</p>
            </div>
        </div>
    );
}

export default function HatchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <HatchContent />
        </Suspense>
    );
}
