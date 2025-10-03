// src/components/DigitSpanTask.js
"use client";
import React, { useState, useEffect, useRef } from 'react';

const MODES = ['forward', 'backward'];
const INITIAL_LENGTH = 3;
const MAX_LENGTH = 8;

/**
 * Digit Span Task (Forward & Backward) component
 * @param {function} onScore   - callback receiving percentage score when task completes
 * @param {function} onStart   - callback invoked when the task starts or restarts
 * @param {function} onStop    - callback invoked when the task stops (upon completion)
 */
export default function DigitSpanTask({ onScore, onStart, onStop }) {
    const [modeIndex, setModeIndex] = useState(0); // 0=forward, 1=backward
    const [length, setLength] = useState(INITIAL_LENGTH);
    const [sequence, setSequence] = useState([]);
    const [stage, setStage] = useState('instructions'); // 'instructions','show','input','done'
    const [currentDigit, setCurrentDigit] = useState(null);
    const [input, setInput] = useState('');
    const [results, setResults] = useState({ forward: 0, backward: 0 });
    const [attempts, setAttempts] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [finalScore, setFinalScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [lastResponse, setLastResponse] = useState(null);
    const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
    const intervalRef = useRef(null);

    // Generate a random sequence of digits without consecutive repeats
    const generateSequence = (len) => {
        const result = [];
        while (result.length < len) {
            const rand = Math.floor(Math.random() * 9) + 1;
            if (result.length === 0 || rand !== result[result.length - 1]) {
                result.push(rand);
            }
        }
        return result;
    };

    // Display digits sequentially
    useEffect(() => {
        if (stage !== 'show') return;
        
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        setCurrentDigitIndex(0);
        setCurrentDigit(sequence[0]);
        
        let idx = 1;
        intervalRef.current = setInterval(() => {
            if (idx < sequence.length) {
                setCurrentDigitIndex(idx);
                setCurrentDigit(sequence[idx]);
                idx += 1;
            } else {
                clearInterval(intervalRef.current);
                setStage('input');
            }
        }, 1000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [stage, sequence]);

    // Start or restart the task
    const startTask = () => {
        setSequence([]);
        setModeIndex(0);
        setLength(INITIAL_LENGTH);
        setSequence(generateSequence(INITIAL_LENGTH));
        setStage('show');
        setInput('');
        setResults({ forward: 0, backward: 0 });
        setAttempts(0);
        setCorrectCount(0);
        setFinalScore(0);
        setShowFeedback(false);
        setLastResponse(null);
        setCurrentDigitIndex(0);
        if (typeof onStart === 'function') onStart();
    };

    // Handle submission of user input
    const handleSubmit = (e) => {
        e.preventDefault();
        const correctSeq = modeIndex === 0 ? sequence : [...sequence].reverse();
        const userSeq = input.split('').map((d) => parseInt(d, 10));
        const isCorrect =
            userSeq.length === correctSeq.length &&
            userSeq.every((d, i) => d === correctSeq[i]);

        // Show feedback
        setLastResponse({ 
            isCorrect, 
            userSeq, 
            correctSeq, 
            mode: MODES[modeIndex] 
        });
        setShowFeedback(true);

        // Count this attempt
        setAttempts((a) => a + 1);

        if (modeIndex === 0) {
            // Forward stage
            if (isCorrect) {
                setCorrectCount((c) => c + 1);
                setResults((r) => ({ ...r, forward: length }));
                // Increase length for next attempt
                const newLength = Math.min(length + 1, MAX_LENGTH);
                setLength(newLength);
            } else {
                setResults((r) => ({ ...r, forward: Math.max(0, length - 1) }));
            }
            
            // Show feedback briefly, then move to backward
            setTimeout(() => {
                setModeIndex(1);
                setLength(INITIAL_LENGTH);
                setSequence(generateSequence(INITIAL_LENGTH));
                setStage('show');
                setInput('');
                setShowFeedback(false);
            }, 1500);
        } else {
            // Backward stage: end task regardless
            if (isCorrect) {
                setCorrectCount((c) => c + 1);
                setResults((r) => ({ ...r, backward: length }));
            } else {
                setResults((r) => ({ ...r, backward: Math.max(0, length - 1) }));
            }
            
            // Show feedback briefly, then show results
            setTimeout(() => {
                setStage('done');
                // Compute percentage score
                const totalAttempts = attempts + 1; // include this
                const totalCorrect = isCorrect ? correctCount + 1 : correctCount;
                const score = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
                setFinalScore(score);
                if (typeof onScore === 'function') onScore(score);
                if (typeof onStop === 'function') onStop();
                setShowFeedback(false);
            }, 1500);
        }
    };

    // Render UI by stage
    if (stage === 'instructions') {
        return (
            <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-white">
                <h2 className="text-2xl font-semibold">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Digit Span Task</span>
                </h2>
                <div className="space-y-3 text-slate-300">
                    <p>You will see a sequence of digits appearing one by one.</p>
                    <p><strong>Forward:</strong> Remember the digits in the order they appear.</p>
                    <p><strong>Backward:</strong> Remember the digits in reverse order.</p>
                    <p><strong>Example:</strong> If you see 1-2-3, enter "123" for forward or "321" for backward.</p>
                    <p>Each digit appears for 1 second. Enter your response when prompted.</p>
                </div>
                <button
                    onClick={startTask}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    Start Task
                </button>
            </div>
        );
    }

    if (stage === 'show') {
        return (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-center text-white">
                {/* Progress indicator */}
                <div className="mb-4 flex justify-between items-center text-sm text-slate-300">
                    <span>{MODES[modeIndex] === 'forward' ? 'Forward' : 'Backward'} Sequence</span>
                    <span>{currentDigitIndex + 1} of {sequence.length}</span>
                </div>
                
                {/* Current digit */}
                <div className="text-6xl font-mono tracking-widest mb-4">{currentDigit}</div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentDigitIndex + 1) / sequence.length) * 100}%` }}
                    />
                </div>
                
                <p className="mt-4 text-slate-400 text-sm">
                    Memorize the sequence...
                </p>
            </div>
        );
    }

    if (stage === 'input') {
        return (
            <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-white">
                <div className="text-center">
                    <p className="text-lg text-slate-200 mb-2">
                        Enter the sequence {MODES[modeIndex] === 'backward' ? '(backward)' : '(forward)'}:
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                        {MODES[modeIndex] === 'backward' 
                            ? 'Enter digits in reverse order' 
                            : 'Enter digits in the same order'
                        }
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={input}
                        maxLength={sequence.length}
                        onChange={(e) => e.target.value.match(/^\d*$/) && setInput(e.target.value)}
                        className="w-full rounded-md border border-white/20 bg-slate-900/50 p-3 text-center text-2xl font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        placeholder="Enter digits..."
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={input.length === 0}
                        className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-[1.02] hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }

    // Feedback stage
    if (showFeedback && lastResponse) {
        return (
            <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-white text-center">
                <div className={`text-2xl font-semibold ${
                    lastResponse.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                    {lastResponse.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                
                <div className="space-y-2 text-slate-300">
                    <p>Your answer: <span className="font-mono text-lg">{lastResponse.userSeq.join('')}</span></p>
                    <p>Correct answer: <span className="font-mono text-lg">{lastResponse.correctSeq.join('')}</span></p>
                    <p>Mode: <span className="capitalize">{lastResponse.mode}</span></p>
                </div>
                
                <div className="text-slate-400 text-sm">
                    {lastResponse.mode === 'forward' ? 'Moving to backward sequence...' : 'Calculating final score...'}
                </div>
            </div>
        );
    }

    if (stage === 'done') {
        return (
            <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-white">
                <h2 className="text-2xl font-semibold text-center">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Task Complete</span>
                </h2>
                
                <div className="space-y-3 text-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-slate-300">Forward Span</p>
                            <p className="text-xl font-bold text-blue-300">{results.forward} digits</p>
                        </div>
                        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-slate-300">Backward Span</p>
                            <p className="text-xl font-bold text-purple-300">{results.backward} digits</p>
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <p className="text-sm text-slate-300">Overall Score</p>
                        <p className="text-2xl font-bold text-emerald-300">{finalScore}%</p>
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <button
                        onClick={startTask}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Restart Task
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
