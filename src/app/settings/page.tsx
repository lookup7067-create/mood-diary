'use client';

import { ArrowLeft, Trash2, PieChart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
    const [logs, setLogs] = useState<any>({});

    useEffect(() => {
        const saved = localStorage.getItem('moodLogs');
        if (saved) setLogs(JSON.parse(saved));
    }, []);

    // 통계 계산
    const counts = { happy: 0, sad: 0, angry: 0 };
    Object.values(logs).forEach((log: any) => {
        if (counts[log.type as keyof typeof counts] !== undefined) {
            counts[log.type as keyof typeof counts]++;
        }
    });

    const total = Object.keys(logs).length;

    const handleReset = () => {
        if (confirm('정말로 모든 기록을 삭제하시겠습니까? 복구할 수 없습니다.')) {
            localStorage.removeItem('moodLogs');
            setLogs({});
            alert('모든 기록이 깨끗하게 지워졌습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-secondary/20 pb-20 animate-fade-in">
            {/* Header */}
            <header className="p-6 pt-8 flex items-center gap-4">
                <Link href="/">
                    <ArrowLeft className="w-6 h-6 text-text-main" />
                </Link>
                <h1 className="text-xl font-bold text-text-main">통계 및 설정</h1>
            </header>

            <div className="px-6 space-y-6">
                {/* 상세 통계 섹션 */}
                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-text-main">
                        <PieChart className="w-5 h-5 text-primary" />
                        감정 분석 리포트
                    </h2>

                    <div className="space-y-6">
                        {/* Happy */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-2xl">😊</div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-gray-700">기쁨</span>
                                    <span className="text-text-sub font-medium">{counts.happy}일</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div style={{ width: `${total ? (counts.happy / total) * 100 : 0}%` }} className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out" />
                                </div>
                            </div>
                        </div>

                        {/* Sad/Calm */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">☁️</div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-gray-700">슬픔/차분</span>
                                    <span className="text-text-sub font-medium">{counts.sad}일</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div style={{ width: `${total ? (counts.sad / total) * 100 : 0}%` }} className="h-full bg-blue-400 rounded-full transition-all duration-1000 ease-out" />
                                </div>
                            </div>
                        </div>

                        {/* Angry */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-2xl">😠</div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-bold text-gray-700">화남</span>
                                    <span className="text-text-sub font-medium">{counts.angry}일</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div style={{ width: `${total ? (counts.angry / total) * 100 : 0}%` }} className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-text-sub text-sm">
                        지금까지 총 <span className="text-primary font-bold text-lg mx-1">{total}</span>개의 감정을 모았어요!
                    </div>
                </section>

                {/* 데이터 관리 섹션 */}
                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-text-main">데이터 관리</h2>
                    <button
                        onClick={handleReset}
                        className="w-full py-4 rounded-xl bg-gray-50 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        모든 기록 초기화
                    </button>
                </section>
            </div>
        </div>
    )
}
