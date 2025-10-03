"use client";

import React, { useEffect, useRef, useState } from 'react';
import { EmailAuthProvider } from 'firebase/auth';
import { getAuthUI, resetAuthUI } from '../lib/firebaseClient';

export default function FirebaseAuthUI() {
	const containerRef = useRef(null);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		let authUI = null;
		
		const initializeAuthUI = async () => {
			if (!containerRef.current || isInitialized) return;
			
			try {
				// Reset any existing AuthUI instance
				resetAuthUI();
				
				// Get a fresh AuthUI instance
				authUI = getAuthUI();
				
				const uiConfig = {
					signInFlow: 'popup',
					signInOptions: [
						EmailAuthProvider.PROVIDER_ID,
					],
					callbacks: {
						signInSuccessWithAuthResult: () => {
							// Return false to prevent automatic redirect
							// The AuthProvider will handle the state change
							return false;
						},
					},
				};

				// Start the UI
				await authUI.start(containerRef.current, uiConfig);
				setIsInitialized(true);
			} catch (error) {
				console.error('Error initializing AuthUI:', error);
			}
		};

		// Use setTimeout to ensure DOM is ready
		const timeoutId = setTimeout(initializeAuthUI, 100);

		// Cleanup function
		return () => {
			clearTimeout(timeoutId);
			if (authUI && isInitialized) {
				try {
					authUI.reset();
				} catch (error) {
					console.warn('Error resetting AuthUI:', error);
				}
			}
		};
	}, [isInitialized]);

	return (
		<div style={{ maxWidth: 420, margin: '0 auto' }}>
			<div ref={containerRef} id="firebaseui-auth-container"></div>
		</div>
	);
}


