"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onIdTokenChanged,
} from "firebase/auth";
import { auth } from "@/utils/database";
import { api } from "@/utils/requests";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { push } = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken(true);

                Cookies.set("token", token, { expires: 1, secure: true });

                setUser(user);

                api.defaults.headers.Authorization = `Bearer ${token}`;
            } else {
                Cookies.remove("token");
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function login(data) {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const token = await user.getIdToken(true);

        Cookies.set("token", token, { expires: 1, secure: true });

        setUser(user);

        api.defaults.headers.Authorization = `Bearer ${token}`;
        push("/dashboard");
    }

    async function loginWithProvider(authProvider) {
        const providerLogin = await signInWithPopup(auth, authProvider);

        const user = providerLogin.user;
        const token = await user.accessToken;

        Cookies.set("token", token, { expires: 1, secure: true });
        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser(user);

        push("/dashboard");
    }

    async function logout() {
        setLoading(true);
        await signOut(auth);
        Cookies.remove("token");
        setUser(null);
        push("/login");
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loginWithProvider, logout, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};