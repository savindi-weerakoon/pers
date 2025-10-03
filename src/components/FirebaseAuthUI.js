"use client";

import React, { useEffect, useRef, useState } from 'react';
import { EmailAuthProvider } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebaseClient';

export default function FirebaseAuthUI() {
	const containerRef = useRef(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [authUI, setAuthUI] = useState(null);

	useEffect(() => {
		let mounted = true;
		
		const initializeAuthUI = async () => {
			if (!containerRef.current || isInitialized || typeof window === 'undefined') return;
			
			try {
				// Dynamically import firebaseui to avoid SSR issues
				const firebaseui = await import('firebaseui');
				const auth = getFirebaseAuth();
				
				if (!mounted) return;
				
				// Check if there's an existing instance and delete it
				const existingUI = firebaseui.auth.AuthUI.getInstance();
				if (existingUI) {
					existingUI.delete();
				}
				
				// Create new AuthUI instance
				const ui = new firebaseui.auth.AuthUI(auth);
				
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

				if (mounted && containerRef.current) {
					// Start the UI
					await ui.start(containerRef.current, uiConfig);
					setAuthUI(ui);
					setIsInitialized(true);
				}
			} catch (error) {
				console.error('Error initializing AuthUI:', error);
			}
		};

		// Use setTimeout to ensure DOM is ready
		const timeoutId = setTimeout(initializeAuthUI, 100);

		// Cleanup function
		return () => {
			mounted = false;
			clearTimeout(timeoutId);
			if (authUI && isInitialized) {
				try {
					authUI.reset();
				} catch (error) {
					console.warn('Error resetting AuthUI:', error);
				}
			}
		};
	}, [isInitialized, authUI]);

	return (
		<div style={{ maxWidth: 420, margin: '0 auto' }}>
			<div ref={containerRef} id="firebaseui-auth-container"></div>
		</div>
	);
}


