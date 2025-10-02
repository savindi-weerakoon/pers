// src/components/DigitSpanTask.js
"use client";
import React, { useState, useEffect } from 'react';

const MODES = ['forward', 'backward'];
const INITIAL_LENGTH = 3;

/**
 * Digit Span Task (Forward & Backward) component
 * @param {function} onScore   - callback receiving percentage score when task completes
 * @param {function} onStart   - callback invoked when the task starts or restarts
 * @param {function} onStop    - callback invoked when the task stops (upon completion)
 * @param {function} onFinish    - callback invoked finished
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
        let idx = 0;
        const interval = setInterval(() => {
            if (idx < sequence.length) {
                setCurrentDigit(sequence[idx]);
                idx += 1;
            } else {
                clearInterval(interval);
                setStage('input');
            }
        }, 1000);
        return () => clearInterval(interval);
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

        // Count this attempt
        setAttempts((a) => a + 1);

        if (modeIndex === 0) {
            // Forward stage
            if (isCorrect) {
                setCorrectCount((c) => c + 1);
                setResults((r) => ({ ...r, forward: length }));
            } else {
                setResults((r) => ({ ...r, forward: length - 1 }));
            }
            // Move to backward initial
            setModeIndex(1);
            setLength(INITIAL_LENGTH);
            setSequence(generateSequence(INITIAL_LENGTH));
            setStage('show');
            setInput('');
        } else {
            // Backward stage: end task regardless
            if (isCorrect) {
                setCorrectCount((c) => c + 1);
                setResults((r) => ({ ...r, backward: length }));
            } else {
                setResults((r) => ({ ...r, backward: length - 1 }));
            }
            setStage('done');
            // Compute percentage score
            const totalAttempts = attempts + 1; // include this
            const totalCorrect = isCorrect ? correctCount + 1 : correctCount;
            const score = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
            if (typeof onScore === 'function') onScore(score);
            if (typeof onStop === 'function') onStop();
        }
    };

    // Render UI by stage
    if (stage === 'instructions') {
        return (
            <div className="space-y-4 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold">Digit Span Task</h2>
                <p>Recall sequences of digits forward then backward. Press Start to begin.</p>
                <button
                    onClick={startTask}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    Start Task
                </button>
            </div>
        );
    }

    if (stage === 'show') {
        return (
            <div className="p-6 bg-white rounded-lg shadow text-center">
                <p className="mb-4 text-lg">
                    {MODES[modeIndex] === 'forward' ? 'Forward' : 'Backward'}: Memorize this digit
                </p>
                <div className="text-5xl font-mono tracking-widest">{currentDigit}</div>
            </div>
        );
    }

    if (stage === 'input') {
        return (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
                <p className="text-lg">
                    Enter the sequence {MODES[modeIndex] === 'backward' && '(backward)'}:
                </p>
                <input
                    type="text"
                    inputMode="numeric"
                    value={input}
                    // maxLength={sequence.length}
                    onChange={(e) => e.target.value.match(/^\d*$/) && setInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                >
                    Submit
                </button>
            </form>
        );
    }

    if (stage === 'done') {
        const score = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;

        return (
            <div className="space-y-4 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold">Task Complete</h2>
                <p>Forward span: {results.forward} digits</p>
                <p>Backward span: {results.backward} digits</p>
                <p>Your score: {score}%</p>
                <div className="flex gap-4">
                    <button
                        onClick={startTask}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                    >
                        Restart Task
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
