'use client';

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Footer() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user &&
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">© 2025 AnalyzeIt. Todos os direitos reservados.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">Termos</a>
                <a href="#" className="text-gray-400 hover:text-gray-500">Privacidade</a>
                <a href="#" className="text-gray-400 hover:text-gray-500">Suporte</a>
              </div>
            </div>
          </div>
        </footer>
      }
    </>
  );
}