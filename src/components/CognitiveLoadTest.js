// src/components/CognitiveLoadTest.js
"use client";
import React, { useState, useEffect, useRef } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Cognitive Load Test using N-Back task
 * @param {number} n - the N-back level (default: 2)
 * @param {number} sequenceLength - total stimuli count (default: 20)
 * @param {number} intervalMs - stimulus display duration in ms (default: 2000)
 * @param {function} onComplete - callback receives accuracy percentage when done
 */
export default function CognitiveLoadTest({
    n = 2,
    sequenceLength = 20,
    intervalMs = 2000,
    onComplete,
}) {
    const [stage, setStage] = useState('instructions'); // 'instructions', 'test', 'results'
    const [sequence, setSequence] = useState([]);
    const [responses, setResponses] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [currentLetter, setCurrentLetter] = useState('');
    const [expectMatch, setExpectMatch] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [lastResponse, setLastResponse] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const timerRef = useRef(null);

    // Generate random sequence on start
    const startTest = () => {
        const seq = Array.from({ length: sequenceLength },
            () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
        );
        setSequence(seq);
        setResponses([]);
        setCurrentIdx(0);
        setLastResponse(null);
        setShowFeedback(false);
        setStage('test');
    };

    // Test loop
    useEffect(() => {
        if (stage !== 'test') return;
        if (currentIdx >= sequenceLength) {
            setStage('results');
            return;
        }

        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Determine expected match
        const letter = sequence[currentIdx];
        const match = currentIdx >= n && letter === sequence[currentIdx - n];
        setCurrentLetter(letter);
        setExpectMatch(match);
        setTimeLeft(intervalMs / 1000);
        setShowFeedback(false);

        // Countdown timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up - record no response
                    setResponses(prev => [...prev, { match, response: null, correct: false }]);
                    setCurrentIdx(idx => idx + 1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [stage, currentIdx, sequence, n, intervalMs]);

    // Handle user response
    const handleRespond = (resp) => {
        if (stage !== 'test') return;
        
        // Clear the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        const correct = resp === expectMatch;
        setLastResponse({ response: resp, correct, expected: expectMatch });
        setShowFeedback(true);
        
        // Record the response
        setResponses(prev => [...prev, { match: expectMatch, response: resp, correct }]);
        
        // Show feedback briefly before advancing
        setTimeout(() => {
            setCurrentIdx(idx => idx + 1);
            setShowFeedback(false);
        }, 800);
    };

    // When results stage, compute accuracy
    useEffect(() => {
        if (stage !== 'results') return;
        const valid = responses.filter(r => r.correct === true).length;
        const total = responses.length;
        const accuracy = total > 0 ? Math.round((valid / total) * 100) : 0;
        if (typeof onComplete === 'function') onComplete(accuracy);
    }, [stage, responses, onComplete]);

    // Render
    if (stage === 'instructions') {
        return (
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm space-y-4 text-white">
                <h2 className="text-2xl font-semibold">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">N-Back Cognitive Load Test</span>
                </h2>
                <div className="space-y-3 text-slate-300">
                    <p>You will see a sequence of letters appearing one by one.</p>
                    <p><strong>Your task:</strong> Press "Match" if the current letter is the same as the letter that appeared {n} steps back.</p>
                    <p><strong>Example:</strong> If you see A → B → C → A, the second A matches the first A (2 steps back).</p>
                    <p>You have {intervalMs / 1000} seconds to respond to each letter.</p>
                </div>
                <button
                    onClick={startTest}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    Start {n}-Back Test
                </button>
            </div>
        );
    }

    if (stage === 'test') {
        return (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-center space-y-6 text-white">
                {/* Progress and timer */}
                <div className="flex justify-between items-center text-sm text-slate-300">
                    <span>{currentIdx + 1} of {sequenceLength}</span>
                    <span className="font-mono text-lg">{timeLeft}s</span>
                </div>
                
                {/* Current letter */}
                <div className="text-6xl font-mono tracking-widest">{currentLetter}</div>
                
                {/* Feedback */}
                {showFeedback && lastResponse && (
                    <div className={`text-lg font-semibold ${
                        lastResponse.correct ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                        {lastResponse.correct ? '✓ Correct!' : '✗ Incorrect'}
                        {!lastResponse.correct && (
                            <div className="text-sm text-slate-400 mt-1">
                                Expected: {lastResponse.expected ? 'Match' : 'No Match'}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Response buttons */}
                {!showFeedback && (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleRespond(true)}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-[1.02] hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            Match
                        </button>
                        <button
                            onClick={() => handleRespond(false)}
                            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-2 text-base font-semibold text-white shadow-lg shadow-rose-600/20 transition-transform hover:scale-[1.02] hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            No Match
                        </button>
                    </div>
                )}
                
                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIdx + 1) / sequenceLength) * 100}%` }}
                    />
                </div>
            </div>
        );
    }

    // results
    const valid = responses.filter(r => r.correct === true).length;
    const total = responses.length;
    const accuracy = total > 0 ? Math.round((valid / total) * 100) : 0;
    const noResponse = responses.filter(r => r.response === null).length;

    return (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm space-y-4 text-center text-white">
            <h2 className="text-2xl font-semibold">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Test Complete</span>
            </h2>
            <div className="space-y-2 text-slate-300">
                <p>Correct responses: {valid} / {total}</p>
                <p>No response: {noResponse}</p>
                <p className="text-lg font-bold text-white">Accuracy: {accuracy}%</p>
            </div>
            <button
                onClick={startTest}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
                Restart Test
            </button>
        </div>
    );
}
