// src/components/ConfirmationDialog.js
"use client";
import React from 'react';

/**
 * ConfirmationDialog
 * 
 * Props:
 * - open: boolean
 * - title: string
 * - description?: string               // optional if you pass children
 * - children?: React.ReactNode         // custom description/content
 * - onConfirm: () => void
 * - onCancel: () => void
 * - confirmText?: string (default: 'Yes')
 * - cancelText?: string (default: 'No')
 */
export default function ConfirmationDialog({
    open,
    title,
    description,
    children,
    onConfirm,
    onCancel,
    confirmText = 'Yes',
    cancelText = 'No',
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative z-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {title}
                </h2>

                {/* Description or custom children */}
                {children ? (
                    <div className="mb-6">
                        {children}
                    </div>
                ) : (
                    <p className="text-gray-600 mb-6">
                        {description}
                    </p>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
