// src/components/AttentionFocusWrapper.js
"use client";
import React, { useEffect, useState, useRef, Children, cloneElement, isValidElement } from 'react';

/**
 * A reusable wrapper that initializes WebGazer,
 * renders the camera preview immediately,
 * provides start/stop stopwatch controls,
 * and computes the average focus level upon stop.
 *
 * Usage:
 * <AttentionFocusWrapper intervalMs={1000} onTimerStop={(avg) => console.log(avg)}>
 *   {({ focusLevel, averageFocusLevel, isRunning, elapsedTime, start, stop }) => (
 *     <YourChild {...{ focusLevel, averageFocusLevel, isRunning, elapsedTime, start, stop }} />
 *   )}
 * </AttentionFocusWrapper>
 */
export default function AttentionFocusWrapper({ intervalMs = 1000, onTimerStop, children }) {
    const [focusLevel, setFocusLevel] = useState(0);
    const [averageFocusLevel, setAverageFocusLevel] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Store each interval's focus level
    const focusLevelsRef = useRef([]);
    // Counters for current interval
    const hitsRef = useRef(0);
    const totalRef = useRef(0);

    const containerRef = useRef(null);
    const webgazerRef = useRef(null);
    const metricsIntervalRef = useRef(null);
    const stopwatchIntervalRef = useRef(null);
    const previewPollRef = useRef(null);

    // Initialize WebGazer and attach preview on mount
    useEffect(() => {
        import('webgazer')
            .then((module) => {
                const wg = module.default || module;
                webgazerRef.current = wg;
                globalThis.webgazer = wg;
                // Start camera preview immediately
                return wg
                    .setRegression('ridge')
                    .setTracker('clmtrackr')
                    .showVideoPreview(true)
                    .showPredictionPoints(false)
                    .showFaceOverlay(true)
                    .begin();
            })
            .catch((err) => console.error('WebGazer init error:', err));

        // Poll for preview elements and move them into container
        previewPollRef.current = setInterval(() => {
            const video = document.getElementById('webgazerVideoFeed');
            const overlay = document.getElementById('webgazerFaceOverlay');
            const defaultContainer = document.getElementById('webgazerVideoContainer');
            if (defaultContainer) defaultContainer.style.display = 'none';
            const container = containerRef.current;

            if (container && video) {
                Object.assign(video.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                });
                container.appendChild(video);
            }
            if (container && overlay) {
                // Remove the default canvas dimensions so it can be sized by CSS
                overlay.removeAttribute('width');
                overlay.removeAttribute('height');

                Object.assign(overlay.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',    // same as your video
                    pointerEvents: 'none',    // so clicks go through
                });
                setTimeout(() => {
                    container.appendChild(overlay);
                }, 1000);
            }

            if (video && overlay) {
                clearInterval(previewPollRef.current);
            }
        }, 200);

        // Cleanup
        return () => {
            clearInterval(previewPollRef.current);
            if (metricsIntervalRef.current) clearInterval(metricsIntervalRef.current);
            if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
            if (webgazerRef.current) {
                webgazerRef.current.clearGazeListener();
                webgazerRef.current.end();
            }
            delete globalThis.webgazer;
        };
    }, []);

    // Start capturing gaze and stopwatch
    const start = () => {
        if (isRunning || !webgazerRef.current) return;
        focusLevelsRef.current = [];
        hitsRef.current = 0;
        totalRef.current = 0;
        setFocusLevel(0);
        setAverageFocusLevel(0);
        setElapsedTime(0);
        setIsRunning(true);

        const wg = webgazerRef.current;
        // Listen to gaze data
        wg.setGazeListener(({ x, y }) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const marginX = w * 0.25;
            const marginY = h * 0.25;
            const cx = w / 2;
            const cy = h / 2;
            totalRef.current++;
            if (x > cx - marginX && x < cx + marginX && y > cy - marginY && y < cy + marginY) {
                hitsRef.current++;
            }
        });

        // Compute focus level at each interval, store for average later
        metricsIntervalRef.current = setInterval(() => {
            const total = totalRef.current;
            const hits = hitsRef.current;
            const lvl = total > 0 ? Math.round((hits / total) * 100) : 0;
            setFocusLevel(lvl);
            focusLevelsRef.current.push(lvl);
            // Update rolling average live
            const arr = focusLevelsRef.current;
            const sum = arr.reduce((acc, val) => acc + val, 0);
            const avg = arr.length > 0 ? Math.round(sum / arr.length) : 0;
            setAverageFocusLevel(avg);
            // reset counters
            hitsRef.current = 0;
            totalRef.current = 0;
        }, intervalMs);

        // Stopwatch ticks every second
        stopwatchIntervalRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    };

    // Stop capturing and compute final average
    const stop = () => {
        if (!isRunning) return;
        setIsRunning(false);
        clearInterval(metricsIntervalRef.current);
        clearInterval(stopwatchIntervalRef.current);

        if (webgazerRef.current) {
            webgazerRef.current.clearGazeListener();
            webgazerRef.current.end();
        }

        // Calculate average after stop
        const arr = focusLevelsRef.current;
        const sum = arr.reduce((acc, val) => acc + val, 0);
        const avg = arr.length > 0 ? Math.round(sum / arr.length) : 0;
        setAverageFocusLevel(avg);

        if (typeof onTimerStop === 'function') {
            onTimerStop(avg)
        };
        return avg
    };

    // Inject props into child
    const childProps = { focusLevel, averageFocusLevel, isRunning, elapsedTime, start, stop };
    let renderedChild;
    if (typeof children === 'function') renderedChild = children(childProps);
    else if (isValidElement(children)) renderedChild = cloneElement(children, childProps);
    else if (Array.isArray(children)) renderedChild = Children.map(children, (c) =>
        isValidElement(c) ? cloneElement(c, childProps) : c,
    );
    else renderedChild = children;

    return (
        <div className="grid grid-cols-12 gap-6 p-4 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm text-white">
            {/* Main content: child component */}
            <div className="col-span-12 lg:col-span-8 flex items-center justify-center">
                {renderedChild}
            </div>

            {/* Sidebar: preview and controls */}
            <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
                {/* Preview */}
                <div className="relative w-full aspect-video rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden">
                    <div ref={containerRef} className="w-full h-full relative" />
                </div>

                {/* Controls & Timer */}
                <div className="space-y-3">
                    {isRunning && <span className="text-emerald-400 font-medium">Monitoring…</span>}
                    <span className="text-slate-300">Elapsed: {elapsedTime}s</span>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
                            <p className="text-xs text-slate-300">Current Focus</p>
                            <p className="font-bold text-blue-300">{focusLevel}%</p>
                        </div>
                        <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
                            <p className="text-xs text-slate-300">Average Focus</p>
                            <p className="font-bold text-purple-300">{averageFocusLevel}%</p>
                        </div>
                    </div>
                    {/* <div className="flex space-x-2">
                        <button
                            onClick={start}
                            disabled={isRunning}
                            className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded disabled:opacity-50"
                        >
                            Start
                        </button>
                        <button
                            onClick={stop}
                            disabled={!isRunning}
                            className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded disabled:opacity-50"
                        >
                            Stop
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
