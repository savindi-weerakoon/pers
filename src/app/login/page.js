"use client";

import React, { useEffect } from 'react';
import FirebaseAuthUI from '../../components/FirebaseAuthUI';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <main style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h1>
                <p style={{ textAlign: 'center' }}>Loading...</p>
            </main>
        );
    }

    // Show redirect message if user is authenticated
    if (user) {
        return (
            <main style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h1>
                <p style={{ textAlign: 'center' }}>Redirecting...</p>
            </main>
        );
    }

    // Show login form if user is not authenticated
    return (
        <main style={{ padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h1>
            <FirebaseAuthUI key="auth-ui" />
        </main>
    );
}


