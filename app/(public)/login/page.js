'use client';

import { useState, useEffect, useContext } from 'react';
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirebaseAuthErrorMessage } from '../../../utils/database';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { login, loginWithProvider } = useContext(AuthContext);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        try {            
            await login({ email, password });
        } catch (err) {
            console.error(err);
            setError(getFirebaseAuthErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderLogin = async (provider) => {
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        try {
            const authProvider = provider === 'google'
                ? new GoogleAuthProvider()
                : new FacebookAuthProvider();

            await loginWithProvider(authProvider);

            router.push('/test');
        } catch (err) {
            console.error(err);
            setError('Erro ao realizar login com provedor externo. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left side - Login form */}
                    <div className="w-full md:w-1/2 py-8 px-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Entrar</h2>
                        <p className="text-sm text-gray-500 mb-6">Acesse o sistema para visualizar suas funcionalidades</p>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailLogin}>
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

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link href="/reset-password" className="text-xs text-blue-600 hover:text-blue-800">
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !isMounted}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 mb-4 disabled:bg-blue-300 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Entrar"
                                )}
                            </button>

                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                            </div>
                        </div>

                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={() => handleProviderLogin('google')}
                                className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                <span className="ml-2 text-gray-700">Google</span>
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta? <Link href="/register" className="text-blue-600 hover:text-blue-800">Cadastre-se</Link>
                            </p>
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