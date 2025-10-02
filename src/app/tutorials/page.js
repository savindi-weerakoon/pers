// src/app/tutorials/page.js
"use client";

import { useState, useEffect } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const tutorials = [
    {
        id: 1,
        title: "Introduction to Adaptive UIs",
        description: "Learn why adaptive UIs matter and how they improve engagement.",
        videoUrl: "https://www.youtube.com/embed/0al2hk4Q8w0",
        duration: "5m 30s",
    },
    {
        id: 2,
        title: "Setting Up Your Project",
        description: "Step-by-step guide to scaffold a Next.js adaptive UI project.",
        videoUrl: "https://www.youtube.com/embed/2mwLgoZjkUE",
        duration: "8m 12s",
    },
    {
        id: 3,
        title: "Integrating WebGazer.js",
        description: "Add eye-tracking to measure attention & focus in real time.",
        videoUrl: "https://www.youtube.com/embed/Wh77ZGdIaZQ",
        duration: "10m 45s",
    },
    {
        id: 4,
        title: "Personalising Content",
        description: "Use cognitive scores to adapt your interface dynamically.",
        videoUrl: "https://www.youtube.com/embed/A0o-xisSQRg",
        duration: "7m 18s",
    },
];

export default function TutorialsPage() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [personalisedHtml, setPersonalisedHtml] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const current = tutorials[currentIdx];
    const progress = Math.round(((currentIdx + 1) / tutorials.length) * 100);

    const goPrev = () => setCurrentIdx((idx) => Math.max(0, idx - 1));
    const goNext = () => setCurrentIdx((idx) => Math.min(tutorials.length - 1, idx + 1));

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 2000);
    }, []);

    const callPersonaliser = (htmlSnippet) => {
        setLoading(true);
        const xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "https://savindiweerakoon-ui-personaliser.hf.space/run/predict"
        );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            setLoading(false);
            if (xhr.status === 200) {
                try {
                    // Gradio returns { data: [...], ... }
                    const json = JSON.parse(xhr.responseText);
                    setPersonalisedHtml(json.data?.[0] || "");
                } catch (e) {
                    console.error("Response parse error", e);
                }
            } else {
                console.error("API error status", xhr.status);
            }
        };
        xhr.onerror = () => {
            setLoading(false);
            console.error("Network error");
        };
        // fn_index: 0 because this is the first (and only) function in app.py
        const payload = JSON.stringify({
            data: [htmlSnippet, 79, 60, 50],
            fn_index: 0
        });
        xhr.send(payload);
    };


    useEffect(() => {
        const snippet = `<h1>${current.title}</h1><p>${current.description}</p>`;
        callPersonaliser(snippet);
    }, [currentIdx]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <>

                <aside className="w-64 bg-white border-r overflow-y-auto">
                    <h2 className="p-4 text-xl font-semibold border-b">Course Contents</h2>
                    <ul>
                        {tutorials.map((tut, i) => (
                            <li
                                key={tut.id}
                                onClick={() => setCurrentIdx(i)}
                                className={`cursor-pointer px-4 py-3 flex items-center space-x-2 ${i === currentIdx ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-100"
                                    }`}
                            >
                                <span className="text-sm font-medium flex-1">{tut.title}</span>
                                <span className="text-xs text-gray-500">{tut.duration}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main content */}
                <main className="flex-1 flex flex-col">
                    {/* Progress Bar */}
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                                Lesson {currentIdx + 1} of {tutorials.length}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded">
                            <div
                                className="bg-blue-600 h-2 rounded"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Video + Details */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                            <iframe
                                className="w-full h-full"
                                src={current.videoUrl}
                                title={current.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{current.title}</h1>
                        <p className="text-gray-700 mb-4">{current.description}</p>

                        {/* Personalised HTML snippet */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-2">Personalised Content</h2>
                            {loading ? (
                                <p className="text-gray-500">Loading personalised UI...</p>
                            ) : personalisedHtml ? (
                                <div
                                    className="border p-4 bg-white rounded"
                                    dangerouslySetInnerHTML={{ __html: personalisedHtml }}
                                />
                            ) : (
                                <p className="text-gray-500">No personalised content available.</p>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-4 border-t bg-white flex justify-between">
                        <button
                            onClick={goPrev}
                            disabled={currentIdx === 0}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={goNext}
                            disabled={currentIdx === tutorials.length - 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
                        >
                            {currentIdx < tutorials.length - 1 ? "Next Lesson" : "Finish Course"}
                        </button>
                    </div>
                </main>
            </>

            <ConfirmationDialog
                open={isOpen}
                title="Personalised UI"
                description="Do you want try our NEW personalised UI feature?"
                onConfirm={() => {
                    callPersonaliser()
                    setIsOpen(false);
                }}
                onCancel={() => setIsOpen(false)}
            />
        </div>
    );
}
