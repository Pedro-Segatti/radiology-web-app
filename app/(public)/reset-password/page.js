'use client';

import { useState, useEffect, useContext } from 'react';
import { getFirebaseAuthErrorMessage } from '../../../utils/database';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { resetPassword } = useContext(AuthContext);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {            
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(getFirebaseAuthErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left side - Reset password form */}
                    <div className="w-full md:w-1/2 py-8 px-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Recuperar senha</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Digite seu e-mail para receber instruções de recuperação de senha
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
                                E-mail enviado com sucesso! Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.
                            </div>
                        )}

                        {!success ? (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !isMounted}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 mb-4 disabled:bg-blue-300 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        setEmail('');
                                        setSuccess(false);
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 mb-4"
                                >
                                    Enviar novamente
                                </button>
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voltar para o login
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Image with text overlay */}
                    <div className="w-full md:w-1/2 bg-blue-500 relative hidden md:block" style={{
                        backgroundImage: 'url("login-image.jpg")',
                        backgroundColor: 'rgba(59, 130, 246, 0.9)',
                        backgroundRepeat: 'round',
                        backgroundBlendMode: 'overlay'
                    }}>
                    </div>
                </div>
            </div>
        </div>
    );
}