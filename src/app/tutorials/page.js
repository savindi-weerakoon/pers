// src/app/tutorials/page.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import ConfirmationDialog from "@/components/ConfirmationDialog";
import RequireAuth from "@/components/RequireAuth";
import SignOutButton from "@/components/SignOutButton";
import { usePersonalize } from "@/hooks/usePersonalize";

const courses = [
    {
        id: 1,
        title: "Adaptive UI Development",
        instructor: "Dr. Sarah Chen",
        description: "Master modern web interfaces with intelligent personalization and responsive design patterns.",
        duration: "2h 45m",
        lessons: 12,
        level: "Intermediate",
        rating: 4.8,
        students: 2847,
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
        tags: ["React", "CSS", "UX Design"],
        progress: 0,
        lastAccessed: "2 days ago"
    },
    {
        id: 2,
        title: "Cognitive Load Optimization",
        instructor: "Prof. Michael Torres",
        description: "Learn to reduce cognitive load in user interfaces through strategic design and interaction patterns.",
        duration: "1h 30m",
        lessons: 8,
        level: "Advanced",
        rating: 4.9,
        students: 1923,
        thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop",
        tags: ["Psychology", "UX Research", "Design"],
        progress: 65,
        lastAccessed: "1 week ago"
    },
    {
        id: 3,
        title: "Eye-Tracking Integration",
        instructor: "Dr. Emma Watson",
        description: "Implement eye-tracking technology to enhance user experience and gather valuable insights.",
        duration: "3h 15m",
        lessons: 15,
        level: "Expert",
        rating: 4.7,
        students: 1456,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
        tags: ["WebGazer", "Analytics", "JavaScript"],
        progress: 100,
        lastAccessed: "3 days ago"
    },
    {
        id: 4,
        title: "Personalization Algorithms",
        instructor: "Dr. James Rodriguez",
        description: "Build intelligent systems that adapt to individual user preferences and behaviors.",
        duration: "4h 20m",
        lessons: 18,
        level: "Expert",
        rating: 4.6,
        students: 892,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        tags: ["Machine Learning", "AI", "Python"],
        progress: 0,
        lastAccessed: null
    }
];

export default function TutorialsPage() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState(courses);
    const [isOpen, setIsOpen] = useState(false);
    const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
    const [incomingScores, setIncomingScores] = useState(null);
    const [cognitiveScores, setCognitiveScores] = useState({
        digitSpanScore: 79,
        cognitiveLoadScore: 60,
        averageFocusLevel: 50
    });
    const [isCustomizeRetryOpen, setIsCustomizeRetryOpen] = useState(false);

    const onCancelInitialPersonalization = () => {
        setIsOpen(false);
        setIsCustomizeRetryOpen(true);
    }

    const categories = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

    // Use the personalization hook
    const {
        loading,
        error,
        personalizedHtml,
        personalize,
        reset
    } = usePersonalize();

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 3000);
    }, []);

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

    // Filter courses based on search and category
    useEffect(() => {
        let filtered = courses;

        if (selectedCategory !== "All") {
            filtered = filtered.filter(course => course.level === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredCourses(filtered);
    }, [selectedCategory, searchQuery]);

    const getEntireUIAsHTML = () => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Learning Platform - Course Catalog</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #333;
                    line-height: 1.6;
                    min-height: 100vh;
                }
                
                .platform-container {
                    background: #f8fafc;
                    min-height: 100vh;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem 0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                
                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                
                .logo-text h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }
                
                .logo-text p {
                    font-size: 14px;
                    opacity: 0.9;
                    margin: 0;
                }
                
                .search-bar {
                    position: relative;
                    max-width: 400px;
                    width: 100%;
                }
                
                .search-input {
                    width: 100%;
                    padding: 12px 16px 12px 44px;
                    border: none;
                    border-radius: 25px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    font-size: 16px;
                    backdrop-filter: blur(10px);
                }
                
                .search-input::placeholder {
                    color: rgba(255,255,255,0.7);
                }
                
                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.7);
                }
                
                .header-stats {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    margin-top: 1rem;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    display: block;
                }
                
                .stat-label {
                    font-size: 14px;
                    opacity: 0.9;
                }
                
                .main-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                
                .filters-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-bottom: 2rem;
                }
                
                .filter-tabs {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .filter-tab {
                    padding: 8px 16px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .filter-tab:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                }
                
                .filter-tab.active {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-color: transparent;
                }
                
                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }
                
                .course-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .course-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                }
                
                .course-thumbnail {
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    position: relative;
                    overflow: hidden;
                }
                
                .course-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .course-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: rgba(0,0,0,0.2);
                }
                
                .course-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #10b981, #34d399);
                    transition: width 0.3s ease;
                }
                
                .course-content {
                    padding: 1.5rem;
                }
                
                .course-header {
                    margin-bottom: 1rem;
                }
                
                .course-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }
                
                .course-instructor {
                    font-size: 14px;
                    color: #64748b;
                    margin-bottom: 8px;
                }
                
                .course-description {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                }
                
                .course-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    font-size: 12px;
                    color: #64748b;
                }
                
                .course-tags {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                }
                
                .course-tag {
                    background: #f1f5f9;
                    color: #475569;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }
                
                .course-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .course-rating {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 14px;
                    color: #64748b;
                }
                
                .stars {
                    color: #fbbf24;
                }
                
                .course-action {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .course-action:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .course-action.completed {
                    background: #10b981;
                }
                
                .course-action.completed:hover {
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                
                @media (max-width: 768px) {
                    .header-content {
                        padding: 0 1rem;
                    }
                    
                    .header-top {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                    
                    .header-stats {
                        gap: 1rem;
                    }
                    
                    .main-content {
                        padding: 1rem;
                    }
                    
                    .courses-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .filter-tabs {
                        justify-content: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="platform-container">
                <header class="header">
                    <div class="header-content">
                        <div class="header-top">
                            <div class="logo">
                                <div class="logo-icon">🎓</div>
                                <div class="logo-text">
                                    <h1>Learning Platform</h1>
                                    <p>Master modern web development</p>
                                </div>
                            </div>
                            <div class="search-bar">
                                <span class="search-icon">🔍</span>
                                <input type="text" class="search-input" placeholder="Search courses, instructors, or topics...">
                            </div>
                        </div>
                        <div class="header-stats">
                            <div class="stat-item">
                                <span class="stat-number">4</span>
                                <span class="stat-label">Courses</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">7,118</span>
                                <span class="stat-label">Students</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">4.8</span>
                                <span class="stat-label">Avg Rating</span>
                    </div>
                        </div>
                    </div>
                </header>
                
                <div class="main-content">
                    <div class="filters-section">
                        <div class="filter-tabs">
                            <button class="filter-tab active">All Courses</button>
                            <button class="filter-tab">Beginner</button>
                            <button class="filter-tab">Intermediate</button>
                            <button class="filter-tab">Advanced</button>
                            <button class="filter-tab">Expert</button>
                        </div>
                    </div>

                    <div class="courses-grid">
                        <a href="http://localhost:3000/tutorial" class="course-tag">
                            <div class="course-thumbnail">
                                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop" alt="Adaptive UI Development">
                                <div class="course-progress">
                                    <div class="course-progress-fill" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="course-content">
                                <div class="course-header">
                                    <h3 class="course-title">Adaptive UI Development</h3>
                                    <p class="course-instructor">Dr. Sarah Chen</p>
                                    <p class="course-description">Master modern web interfaces with intelligent personalization and responsive design patterns.</p>
                                </div>
                                <div class="course-meta">
                                    <span>2h 45m • 12 lessons</span>
                                    <span>2,847 students</span>
                                </div>
                                <div class="course-tags">
                                    <span class="course-tag">React</span>
                                    <span class="course-tag">CSS</span>
                                    <span class="course-tag">UX Design</span>
                                </div>
                                <div class="course-footer">
                                    <div class="course-rating">
                                        <span class="stars">⭐⭐⭐⭐⭐</span>
                                        <span>4.8</span>
                    </div>
                                    <button class="course-action">Start Course</button>
                        </div>
                        </div>
                    </a>

                        <a href="http://localhost:3000/tutorial" class="course-tag">
                            <div class="course-thumbnail">
                                <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop" alt="Cognitive Load Optimization">
                                <div class="course-progress">
                                    <div class="course-progress-fill" style="width: 65%"></div>
                                </div>
                            </div>
                            <div class="course-content">
                                <div class="course-header">
                                    <h3 class="course-title">Cognitive Load Optimization</h3>
                                    <p class="course-instructor">Prof. Michael Torres</p>
                                    <p class="course-description">Learn to reduce cognitive load in user interfaces through strategic design and interaction patterns.</p>
                                </div>
                                <div class="course-meta">
                                    <span>1h 30m • 8 lessons</span>
                                    <span>1,923 students</span>
                                </div>
                                <div class="course-tags">
                                    <span class="course-tag">Psychology</span>
                                    <span class="course-tag">UX Research</span>
                                    <span class="course-tag">Design</span>
                                </div>
                                <div class="course-footer">
                                    <div class="course-rating">
                                        <span class="stars">⭐⭐⭐⭐⭐</span>
                                        <span>4.9</span>
                                    </div>
                                    <button class="course-action">Continue</button>
                                </div>
                            </div>
                        </a>
                        
                        <a href="http://localhost:3000/tutorial" class="course-tag">
                            <div class="course-thumbnail">
                                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop" alt="Eye-Tracking Integration">
                                <div class="course-progress">
                                    <div class="course-progress-fill" style="width: 100%"></div>
                                </div>
                            </div>
                            <div class="course-content">
                                <div class="course-header">
                                    <h3 class="course-title">Eye-Tracking Integration</h3>
                                    <p class="course-instructor">Dr. Emma Watson</p>
                                    <p class="course-description">Implement eye-tracking technology to enhance user experience and gather valuable insights.</p>
                                </div>
                                <div class="course-meta">
                                    <span>3h 15m • 15 lessons</span>
                                    <span>1,456 students</span>
                                </div>
                                <div class="course-tags">
                                    <span class="course-tag">WebGazer</span>
                                    <span class="course-tag">Analytics</span>
                                    <span class="course-tag">JavaScript</span>
                                </div>
                                <div class="course-footer">
                                    <div class="course-rating">
                                        <span class="stars">⭐⭐⭐⭐⭐</span>
                                        <span>4.7</span>
                                    </div>
                                    <button class="course-action completed">Completed</button>
                                </div>
                        </a>
                    </div>

                        <a href="http://localhost:3000/tutorial" class="course-tag">
                            <div class="course-thumbnail">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop" alt="Personalization Algorithms">
                                <div class="course-progress">
                                    <div class="course-progress-fill" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="course-content">
                                <div class="course-header">
                                    <h3 class="course-title">Personalization Algorithms</h3>
                                    <p class="course-instructor">Dr. James Rodriguez</p>
                                    <p class="course-description">Build intelligent systems that adapt to individual user preferences and behaviors.</p>
                                </div>
                                <div class="course-meta">
                                    <span>4h 20m • 18 lessons</span>
                                    <span>892 students</span>
                                </div>
                                <div class="course-tags">
                                    <span class="course-tag">Machine Learning</span>
                                    <span class="course-tag">AI</span>
                                    <span class="course-tag">Python</span>
                                </div>
                                <div class="course-footer">
                                    <div class="course-rating">
                                        <span class="stars">⭐⭐⭐⭐⭐</span>
                                        <span>4.6</span>
                                    </div>
                                    <button class="course-action">Start Course</button>
                                </div>
                            </div>
                        </a>
                    </div>
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
                <div className="no-helper-media">
                    <div className="p-4 flex justify-end gap-2">
                        <button
                            onClick={() => setIsPersonalizeOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Customize Personalization
                        </button>
                        <SignOutButton className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: personalizedHtml }} />

                    <ConfirmationDialog
                        open={isPersonalizeOpen}
                        title="Customize Personalization"
                        description="Adjust cognitive scores for personalization:"
                        onConfirm={() => {
                            callPersonaliser();
                            setIsPersonalizeOpen(false);
                        }}
                        onCancel={() => setIsPersonalizeOpen(false)}
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
                        <div className="p-4 flex justify-end">
                            {isCustomizeRetryOpen && <button
                                onClick={() => callPersonaliser()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Retry Personalization
                            </button>}
                            <SignOutButton className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" />
                        </div>
                        <div className="flex-1" dangerouslySetInnerHTML={{ __html: getEntireUIAsHTML() }} />

            <ConfirmationDialog
                open={isOpen}
                            title="Personalized Learning Experience"
                            description="Would you like to try our personalized learning platform that adapts to your cognitive profile?"
                onConfirm={() => {
                                callPersonaliser();
                                isOpen(false);
                }}
                            onCancel={() => onCancelInitialPersonalization()}
            />
        </div>
                </div>
            )}
        </RequireAuth>
    );
}
