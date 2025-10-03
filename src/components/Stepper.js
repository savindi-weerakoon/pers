// src/components/Stepper.js
"use client";
import React, { useState, Children, cloneElement, isValidElement } from 'react';

/**
 * Reusable Stepper component with progress bar
 * @param {React.ReactNode[]} children - the steps to render in order
 * @param {string[]} [labels]         - optional labels for each step
 * @param {() => void} [onFinish]     - callback when finishing last step
 */
export default function Stepper({ children, labels = [], onFinish }) {
    const steps = Children.toArray(children);
    const total = steps.length;
    const [current, setCurrent] = useState(0);

    const goPrev = () => current > 0 && setCurrent(c => c - 1);
    const goNext = () => {
        if (current < total - 1) setCurrent(c => c + 1);
        else if (typeof onFinish === 'function') onFinish();
    };

    const percent = Math.round(((current + 1) / total) * 100);

    // Clone the current step (so it receives any extra props if needed)
    let stepContent = steps[current];
    if (isValidElement(stepContent)) {
        stepContent = cloneElement(stepContent, { stepIndex: current });
    }

    return (
        <div className="space-y-6 w-full">
            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>{labels[current] || `Step ${current + 1}`}</span>
                    <span>{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Step content */}
            <div>{stepContent}</div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={goPrev}
                    disabled={current === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                    {current < total - 1 ? 'Previous' : 'Start Over'}
                </button>
                <button
                    onClick={goNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {current < total - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        </div>
    );
}
