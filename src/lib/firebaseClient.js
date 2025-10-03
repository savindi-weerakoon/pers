// Firebase client initialization helper
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton instances to prevent multiple initializations
let firebaseApp = null;
let firebaseAuth = null;
let authUI = null;

export function getFirebaseApp() {
	if (!firebaseApp) {
		if (!getApps().length) {
			firebaseApp = initializeApp(firebaseConfig);
		} else {
			firebaseApp = getApp();
		}
	}
	return firebaseApp;
}

export function getFirebaseAuth() {
	if (!firebaseAuth) {
		const app = getFirebaseApp();
		firebaseAuth = getAuth(app);
	}
	return firebaseAuth;
}

export function getAuthUI() {
	if (!authUI) {
		const auth = getFirebaseAuth();
		
		// Check if there's an existing instance and delete it
		const existingUI = firebaseui.auth.AuthUI.getInstance();
		if (existingUI) {
			existingUI.delete();
		}
		
		authUI = new firebaseui.auth.AuthUI(auth);
	}
	return authUI;
}

export function resetAuthUI() {
	if (authUI) {
		try {
			authUI.delete();
		} catch (error) {
			console.warn('Error deleting AuthUI:', error);
		}
		authUI = null;
	}
}

export const googleProvider = new GoogleAuthProvider();


