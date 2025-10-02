// src/app/attention/page.js
"use client";

import AttentionFocusWrapper from '@/components/AttentionFocusWrapper';
import Stepper from '@/components/Stepper';
import DigitSpanTask from '@/components/DigitSpanTask';
import CognitiveLoadTest from '@/components/CognitiveLoadTest';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from "@/components/ConfirmationDialog";


export default function Page() {
    const [digitSpanScore, setDigitSpanScore] = useState(0);
    const [cognitiveLoadScore, setCognitiveLoadScore] = useState(0);
    const [avgFocusLevel, setAverageFocusLevel] = useState(0);
    const [scores, setScores] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const onFinalize = (averageFocusLevel) => {
        debugger
        const allScores = {
            digitSpanScore,
            cognitiveLoadScore,
            averageFocusLevel
        }
        setScores(allScores);
        setIsOpen(true);
    }
    const redirectToTutorialsPage = () => {
        router.push('/tutorials');
    }

    return (
        <div className="min-h-screen flex justify-center bg-gray-50 p-6">
            <div className="w-full max-w-5xl">
                <AttentionFocusWrapper
                    intervalMs={1000}
                    onTimerStop={avg => setAverageFocusLevel(avg)}
                >
                    {({ focusLevel, averageFocusLevel, start, stop, isRunning, elapsedTime }) => (
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
                    )}
                </AttentionFocusWrapper>
            </div>

            <ConfirmationDialog
                open={isOpen}
                title="Test results"
                onConfirm={() => {
                    setIsOpen(false);
                    redirectToTutorialsPage();
                }}
                onCancel={() => setIsOpen(false)}
            >
                <pre>{JSON.stringify(scores, null, 2)}</pre>
            </ConfirmationDialog>
        </div>
    );
}
