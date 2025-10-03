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
				className="fixed inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onCancel}
			/>

			{/* Dialog */}
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-md">
				<h2 className="mb-2 text-xl font-semibold">
					<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">{title}</span>
				</h2>

				{/* Description or custom children */}
				{children ? (
					<div className="mb-6 text-slate-200">
						{children}
					</div>
				) : (
					<p className="mb-6 text-slate-300">
						{description}
					</p>
				)}

				<div className="flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 transition hover:bg-white/15"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.02]"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
    );
}
