// src/app/tutorials/page.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import RequireAuth from "@/components/RequireAuth";
import SignOutButton from "@/components/SignOutButton";
import { usePersonalize } from "@/hooks/usePersonalize";

export default function TutorialsPage() {
    const searchParams = useSearchParams();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomizeRetryOpen, setIsCustomizeRetryOpen] = useState(false);
    const [incomingScores, setIncomingScores] = useState(null);
    const [retryDialogOpen, setRetryDialogOpen] = useState(false);
    const [cognitiveScores, setCognitiveScores] = useState({
        digitSpanScore: 79,
        cognitiveLoadScore: 60,
        averageFocusLevel: 50
    });
    const [showPersonalized, setShowPersonalized] = useState(false);

    const onCancelInitialPersonalization = () => {
        setIsOpen(false);
        setIsCustomizeRetryOpen(true);
    }

    // Use the personalization hook
    const {
        loading,
        error,
        personalizedHtml,
        spec,
        personalize,
        reset
    } = usePersonalize({ pageName: 'tutorial' });

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 2000);
    }, []);

    useEffect(() => {
        if (personalizedHtml) {
            setShowPersonalized(true);
        } else {
            setShowPersonalized(false);
        }
    }, [personalizedHtml]);

    // Read scores from query string
    useEffect(() => {
        try {
            const digitSpanScore = parseInt(searchParams.get('digitSpanScore') || '', 10);
            const cognitiveLoadScore = parseInt(searchParams.get('cognitiveLoadScore') || '', 10);
            const averageFocusLevel = parseInt(searchParams.get('averageFocusLevel') || '', 10);
            if (!Number.isNaN(digitSpanScore) || !Number.isNaN(cognitiveLoadScore) || !Number.isNaN(averageFocusLevel)) {
                const scores = { digitSpanScore, cognitiveLoadScore, averageFocusLevel };
                setIncomingScores(scores);
                setCognitiveScores(scores);
            }
        } catch (_) { }
    }, [searchParams]);

    // Get the entire UI as raw HTML with internal CSS - LinkedIn Learning inspired
    const getEntireUIAsHTML = () => {
        return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Minimal LMS — Color Accent Variant</title>
            <style>
                :root{
                --ink:#0e1320; --muted:#5b667a; --line:#e9eef6; --bg:#ffffff;
                --brand:#2d8cff; --brand-2:#7aa7ff; --accent:#28c997; --warn:#ffba49;
                --chip-bg:#f1f7ff; --chip-text:#1457b5;
                }
                html,body{margin:0;background:var(--bg);color:var(--ink)}
                body{font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}

                /* Header with a soft gradient bar */
                header{border-bottom:1px solid var(--line); background:linear-gradient(180deg,#f7fbff, #ffffff 40%)}
                .wrap{max-width:1000px;margin:0 auto;padding:14px 16px 24px}
                .top{display:flex;align-items:center;gap:12px}
                .logo{width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,var(--brand),var(--brand-2));box-shadow:0 3px 10px rgba(45,140,255,.25)}
                .title{margin:0;font-size:18px;font-weight:800}
                .sub{margin:2px 0 0;color:var(--muted);font-size:13px}

                /* Layout */
                .grid{display:grid;grid-template-columns:280px 1fr;gap:22px}
                @media (max-width:860px){.grid{grid-template-columns:1fr}}

                /* Outline */
                nav h2, main h2{font-size:14px;text-transform:uppercase;letter-spacing:.04em;color:#24344d;margin:8px 0 10px}
                nav{padding-top:6px}
                .meta{font-size:13px;color:var(--muted);margin-bottom:8px}
                .chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
                .chip{background:var(--chip-bg);color:var(--chip-text);border:1px solid #d9e9ff;border-radius:999px;padding:3px 8px;font-size:12px}

                .outline{list-style:none;padding:0;margin:0;border-top:1px solid var(--line)}
                .outline li{display:flex;justify-content:space-between;gap:12px;padding:9px 8px;border-bottom:1px solid var(--line);align-items:baseline}
                .outline .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .outline .d{color:var(--muted);font-size:12px}
                .outline li.active{border-left:4px solid var(--brand);padding-left:4px;background:#f6fbff}

                /* Content */
                main{padding-top:6px}
                .kvs{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:14px}
                @media (max-width:560px){.kvs{grid-template-columns:1fr}}
                .kv{border:1px solid var(--line);padding:8px 10px;border-radius:8px;background:#fcfdfd}

                .section{margin:16px 0 20px}
                .bullets{padding-left:18px;margin:8px 0 0}

                .transcript{border:1px solid var(--line);background:#fbfdff;border-radius:8px}
                .line{display:grid;grid-template-columns:64px 1fr;gap:10px;padding:8px 10px;border-top:1px solid var(--line)}
                .line:first-child{border-top:none}

                .tags{display:flex;gap:6px;flex-wrap:wrap}
                .tag{border:1px solid #e8f3ec;background:#effaf6;color:#0d6b53;border-radius:6px;padding:2px 8px;font-size:12px}
                .tag.warn{border-color:#ffeccc;background:#fff8e9;color:#8a5a00}

                footer{margin-top:24px;padding-top:12px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}
            </style>
            </head>
            <body>
            <header>
                <div class="wrap">
                <div class="top">
                    <div class="logo" aria-hidden="true"></div>
                    <div>
                    <h1 class="title">Practical HTML & CSS</h1>
                    <p class="sub">Lesson page • Minimal, text‑first with soft colours</p>
                    </div>
                </div>
                </div>
            </header>

            <div class="wrap">
                <div class="grid">
                <!-- Outline -->
                <nav aria-label="Course outline">
                    <h2>Outline</h2>
                    <p class="meta">Total: 1h 32m • 11 videos</p>
                    <div class="chips">
                    <span class="chip">Beginner</span>
                    <span class="chip">HTML</span>
                    <span class="chip">CSS</span>
                    </div>
                    <ol class="outline">
                    <li class="active"><span class="n">Welcome to the course</span><span class="d">1m 12s</span></li>
                    <li><span class="n">How the web works (quick tour)</span><span class="d">6m 45s</span></li>
                    <li><span class="n">Structuring pages with semantic HTML</span><span class="d">8m 10s</span></li>
                    <li><span class="n">Styling with CSS: the essentials</span><span class="d">9m 05s</span></li>
                    <li><span class="n">Layout basics: Flexbox</span><span class="d">10m 31s</span></li>
                    <li><span class="n">Responsive design in 10 minutes</span><span class="d">7m 58s</span></li>
                    <li><span class="n">Accessible markup (a11y) quick wins</span><span class="d">6m 40s</span></li>
                    <li><span class="n">Mini‑project: Build a profile card</span><span class="d">12m 19s</span></li>
                    <li><span class="n">Debugging CSS: common gotchas</span><span class="d">5m 34s</span></li>
                    <li><span class="n">Organizing CSS for small projects</span><span class="d">7m 03s</span></li>
                    <li><span class="n">Wrap‑up and next steps</span><span class="d">1m 49s</span></li>
                    </ol>
                </nav>

                <!-- Content -->
                <main aria-label="Lesson content">
                    <h2>Lesson: Welcome to the course</h2>
                    <div class="kvs">
                    <div class="kv"><strong>Instructor:</strong> Jane Doe</div>
                    <div class="kv"><strong>Updated:</strong> Aug 2025</div>
                    <div class="kv"><strong>Level:</strong> Beginner–Intermediate</div>
                    <div class="kv"><strong>Prereqs:</strong> Basic computer literacy</div>
                    </div>

                    <section class="section">
                    <h3>Overview</h3>
                    <p>This opening lesson explains the course goals and the mini‑project. Keep notes brief and actionable. Use the outline to jump between short videos.</p>
                    <ul class="bullets">
                        <li>Course structure and resources</li>
                        <li>How to use practice files</li>
                        <li>Mini‑project preview</li>
                    </ul>
                    </section>

                    <section class="section">
                    <h3>Transcript (excerpt)</h3>
                    <div class="transcript" aria-label="Transcript">
                        <div class="line"><div>00:00</div><div>Welcome! We’ll build comfort with HTML and CSS via small, practical steps.</div></div>
                        <div class="line"><div>00:23</div><div>We’ll tour how the web works, then move into semantic structure.</div></div>
                        <div class="line"><div>00:51</div><div>CSS starts with typography and spacing, then layout using Flexbox.</div></div>
                        <div class="line"><div>01:18</div><div>By the end you’ll create a reusable profile card.</div></div>
                    </div>
                    </section>

                    <section class="section">
                    <h3>Key Terms</h3>
                    <div class="tags">
                        <span class="tag">Semantic HTML</span>
                        <span class="tag">Flexbox</span>
                        <span class="tag warn">Accessibility</span>
                    </div>
                    </section>

                    <section class="section">
                    <h3>Resources</h3>
                    <ul class="bullets">
                        <li>Slides (PDF, 1.8 MB)</li>
                        <li>Starter files (ZIP, 620 KB)</li>
                        <li>Completed project (ZIP, 1.2 MB)</li>
                    </ul>
                    </section>

                    
                    <section class="section">
                        <a style="text-decoration: underline; color: blue;" href="#">Download learning pack (slides + starter + completed)</a>
                    </section>

                    <footer>
                    © 2025 Simple LMS — subtle colours for focus without distraction.
                    </footer>
                </main>
                </div>
            </div>
            </body>
            </html>

        `;
    };

    const callPersonaliser = async () => {
        try {
            const rawHtml = getEntireUIAsHTML();
            await personalize({
                rawHtml: rawHtml,
                digitSpanScore: cognitiveScores.digitSpanScore,
                cognitiveLoadScore: cognitiveScores.cognitiveLoadScore,
                averageFocusLevel: cognitiveScores.averageFocusLevel
            });
        } catch (err) {
            console.error("Personalization failed:", err);
        }
    };

    return (
        <RequireAuth>
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white">Personalizing your learning experience...</p>
                    </div>
                </div>
            )}
            {error ? (
                <div className="flex items-center justify-center h-screen bg-gray-50">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <button
                            onClick={() => callPersonaliser()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : personalizedHtml ? (
                <div>
                    <div className="p-4 flex justify-end gap-2">
                        <button
                            onClick={() => setShowPersonalized(!showPersonalized)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            {showPersonalized ? 'Show Raw HTML' : 'Show Personalized'}
                        </button>
                        <button
                            onClick={() => setRetryDialogOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Customize and Retry Personalization
                        </button>
                        <SignOutButton className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" />
                    </div>
                    {showPersonalized ? (
                        <div dangerouslySetInnerHTML={{ __html: personalizedHtml }} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: getEntireUIAsHTML() }} />
                    )}

                    <ConfirmationDialog
                        open={retryDialogOpen}
                        title="Retry Personalization"
                        description="Adjust cognitive scores for personalization:"
                        onConfirm={() => {
                            callPersonaliser();
                            setRetryDialogOpen(false);
                        }}
                        onCancel={() => setRetryDialogOpen(false)}
                        confirmText="Personalize"
                        cancelText="Cancel"
                    >
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-slate-200 mb-1">Digit Span Score (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={cognitiveScores.digitSpanScore}
                                        onChange={(e) => setCognitiveScores(prev => ({
                                            ...prev,
                                            digitSpanScore: parseInt(e.target.value) || 0
                                        }))}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-200 mb-1">Cognitive Load Score (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={cognitiveScores.cognitiveLoadScore}
                                        onChange={(e) => setCognitiveScores(prev => ({
                                            ...prev,
                                            cognitiveLoadScore: parseInt(e.target.value) || 0
                                        }))}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-200 mb-1">Average Focus Level (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={cognitiveScores.averageFocusLevel}
                                        onChange={(e) => setCognitiveScores(prev => ({
                                            ...prev,
                                            averageFocusLevel: parseInt(e.target.value) || 0
                                        }))}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </ConfirmationDialog>
                </div>
            ) : (
                <div className="flex h-screen bg-gray-50">
                    <div className="flex-1">
                        <div className="p-4 flex justify-end gap-2">
                            {isCustomizeRetryOpen && <button
                                onClick={() => callPersonaliser()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Retry Personalization
                            </button>}
                            {personalizedHtml && (
                                <button
                                    onClick={() => setShowPersonalized(!showPersonalized)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                >
                                    {showPersonalized ? 'Show Raw HTML' : 'Show Personalized'}
                                </button>
                            )}
                            <SignOutButton className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" />

                        </div>
                        {showPersonalized ? (
                            <div dangerouslySetInnerHTML={{ __html: personalizedHtml }} />
                        ) : (
                            <div className="flex-1" dangerouslySetInnerHTML={{ __html: getEntireUIAsHTML() }} />
                        )}

                        <ConfirmationDialog
                            open={isOpen}
                            title="Personalised UI"
                            description="Do you want try our NEW personalised UI feature?"
                            onConfirm={() => {
                                callPersonaliser();
                                setIsOpen(false);
                            }}
                            onCancel={() => onCancelInitialPersonalization()}
                        />
                    </div>
                </div>
            )}
        </RequireAuth>
    );
}
