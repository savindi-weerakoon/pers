// src/app/attention/page.js
"use client";

import AttentionFocusWrapper from '@/components/AttentionFocusWrapper';
import Stepper from '@/components/Stepper';
import DigitSpanTask from '@/components/DigitSpanTask';
import CognitiveLoadTest from '@/components/CognitiveLoadTest';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import RequireAuth from '@/components/RequireAuth';
import SignOutButton from "@/components/SignOutButton";


export default function Page() {
    const [digitSpanScore, setDigitSpanScore] = useState(0);
    const [cognitiveLoadScore, setCognitiveLoadScore] = useState(0);
    const [avgFocusLevel, setAverageFocusLevel] = useState(0);
    const [scores, setScores] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const onFinalize = (averageFocusLevel) => {
        const allScores = {
            digitSpanScore,
            cognitiveLoadScore,
            // use the measured value passed in, not the stale state variable
            avgFocusLevel: averageFocusLevel
        }
        // update state with the actual measured average focus
        setAverageFocusLevel(averageFocusLevel)
        setScores(allScores);

        // Store scores in localStorage for later use
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('assessment:scores', JSON.stringify(allScores));
            }
        } catch (error) {
            console.error('Failed to save scores to localStorage:', error);
        }

        setIsOpen(true);
    }
    const redirectToTutorialsPage = () => {
        if (scores) {
            const params = new URLSearchParams({
                digitSpanScore: String(scores.digitSpanScore ?? ''),
                cognitiveLoadScore: String(scores.cognitiveLoadScore ?? ''),
                averageFocusLevel: String(scores.avgFocusLevel ?? ''),
            });
            router.push(`/tutorials?${params.toString()}`);
        } else {
            router.push('/tutorials');
        }
    }

    return (
        <RequireAuth>
            <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-10 sm:px-6 sm:py-14">
                {/* Glow accents */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-[110px]" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[110px]" />
                </div>

                <div className="mx-auto w-full max-w-5xl">
                    <div className="flex justify-end">
                        <SignOutButton className="bg-white text-gray-700 rounded p-4 hover:bg-gray-300 transition" />
                    </div>
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Attention & Cognitive Assessment</span>
                        </h1>
                        <p className="mt-2 text-slate-300">Complete the two short tasks below. Your focus is measured in real time.</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm sm:p-6">
                        <AttentionFocusWrapper
                            intervalMs={1000}
                            onTimerStop={avg => setAverageFocusLevel(avg)}
                        >
                            {({ focusLevel, averageFocusLevel, start, stop, isRunning, elapsedTime }) => (
                                <>
                                    {/* <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10">
                                <div className="text-slate-300">Current focus</div>
                                <div className="text-base font-semibold text-white">{Math.round(focusLevel)}%</div>
                            </div>
                            <div className="rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10">
                                <div className="text-slate-300">Average focus</div>
                                <div className="text-base font-semibold text-white">{Math.round(averageFocusLevel)}%</div>
                            </div>
                            <div className="rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10">
                                <div className="text-slate-300">Elapsed</div>
                                <div className="text-base font-semibold text-white">{Math.floor(elapsedTime / 1000)}s</div>
                            </div>
                        </div> */}

                                    <Stepper
                                        labels={['Memory Span', 'Cognitive Load']}
                                        onFinish={() => {
                                            onFinalize(stop())
                                        }}
                                    >
                                        {/* Step 1: Digit Span */}
                                        <DigitSpanTask
                                            onStart={start}
                                            onScore={score => setDigitSpanScore(score)}
                                        />

                                        {/* Step 2: N-Back */}
                                        <CognitiveLoadTest
                                            n={2}
                                            sequenceLength={20}
                                            intervalMs={1500}
                                            onComplete={accuracy => setCognitiveLoadScore(accuracy)}
                                        />
                                    </Stepper>
                                </>
                            )}
                        </AttentionFocusWrapper>
                    </div>
                </div>

                <ConfirmationDialog
                    open={isOpen}
                    title="Test results"
                    onConfirm={() => {
                        setIsOpen(false);
                        redirectToTutorialsPage();
                    }}
                    onCancel={() => setIsOpen(false)}
                    confirmText="Let's proceed"
                    cancelText="No, I will get the test again"
                >
                    <p className='mb-2'>Your test results are as follows:</p>
                    <div className="rounded-lg bg-slate-900/60 p-3 text-left text-slate-200 ring-1 ring-white/10">
                        <p>Digit Span Score: {scores?.digitSpanScore ?? 'N/A'}</p>
                        <p>Cognitive Load Score: {scores?.cognitiveLoadScore ?? 'N/A'}</p>
                        <p>Average Focus Level: {scores?.avgFocusLevel ?? 'N/A'}</p>
                        {/* <pre className="whitespace-pre-wrap">{JSON.stringify(scores, null, 2)}</pre> */}
                    </div>
                    <p className='mt-3'>Based on your test results, we will be personalised the learning materials just for you.</p>
                </ConfirmationDialog>
            </div>
        </RequireAuth>
    );
}
