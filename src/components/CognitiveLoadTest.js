// src/components/CognitiveLoadTest.js
"use client";
import React, { useState, useEffect } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Cognitive Load Test using N-Back task
 * @param {number} n - the N-back level (default: 2)
 * @param {number} sequenceLength - total stimuli count (default: 20)
 * @param {number} intervalMs - stimulus display duration in ms (default: 1500)
 * @param {function} onComplete - callback receives accuracy percentage when done
 */
export default function CognitiveLoadTest({
    n = 2,
    sequenceLength = 20,
    intervalMs = 1500,
    onComplete,
}) {
    const [stage, setStage] = useState('instructions'); // 'instructions', 'test', 'results'
    const [sequence, setSequence] = useState([]);
    const [responses, setResponses] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [currentLetter, setCurrentLetter] = useState('');
    const [expectMatch, setExpectMatch] = useState(false);

    // Generate random sequence on start
    const startTest = () => {
        const seq = Array.from({ length: sequenceLength },
            () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
        );
        setSequence(seq);
        setResponses([]);
        setCurrentIdx(0);
        setStage('test');
    };

    // Test loop
    useEffect(() => {
        if (stage !== 'test') return;
        if (currentIdx >= sequenceLength) {
            setStage('results');
            return;
        }

        // Determine expected match
        const letter = sequence[currentIdx];
        const match = currentIdx >= n && letter === sequence[currentIdx - n];
        setCurrentLetter(letter);
        setExpectMatch(match);

        const timer = setTimeout(() => {
            // if no response, record false
            setResponses(prev => [...prev, { match, response: null }]);
            setCurrentIdx(idx => idx + 1);
        }, intervalMs);

        return () => clearTimeout(timer);
    }, [stage, currentIdx, sequence, n, intervalMs]);

    // Handle user response
    const handleRespond = (resp) => {
        if (stage !== 'test') return;
        // cancel pending auto-response
        setResponses(prev => {
            // replace last auto response if within window
            if (prev.length === currentIdx) {
                return [...prev, { match: expectMatch, response: resp }];
            }
            return prev;
        });
        setCurrentIdx(idx => idx + 1);
    };

    // When results stage, compute accuracy
    useEffect(() => {
        if (stage !== 'results') return;
        const valid = responses.filter(r => r.response !== null && r.response === r.match).length;
        const total = responses.length;
        const accuracy = total > 0 ? Math.round((valid / total) * 100) : 0;
        if (typeof onComplete === 'function') onComplete(accuracy);
    }, [stage, responses, onComplete]);

    // Render
    if (stage === 'instructions') {
        return (
            <div className="p-4 bg-white rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold">N-Back Cognitive Load Test</h2>
                <p>You will see a sequence of letters. Press "Match" if the letter matches the one {n} steps back.</p>
                <button
                    onClick={startTest}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    Start {n}-Back Test
                </button>
            </div>
        );
    }

    if (stage === 'test') {
        return (
            <div className="p-6 bg-white rounded-lg shadow text-center space-y-6">
                <div className="text-6xl font-mono">{currentLetter}</div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => handleRespond(true)}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                    >
                        Match
                    </button>
                    <button
                        onClick={() => handleRespond(false)}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                        No Match
                    </button>
                </div>
                <p className="text-gray-600">{currentIdx + 1} of {sequenceLength}</p>
            </div>
        );
    }

    // results
    const valid = responses.filter(r => r.response === r.match).length;
    const total = responses.length;
    const accuracy = total > 0 ? Math.round((valid / total) * 100) : 0;

    return (
        <div className="p-4 bg-white rounded-lg shadow space-y-4 text-center">
            <h2 className="text-xl font-semibold">Test Complete</h2>
            <p>Matches: {valid} / {total}</p>
            <p className="text-lg font-bold">Accuracy: {accuracy}%</p>
            <button
                onClick={startTest}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
                Restart Test
            </button>
        </div>
    );
}
