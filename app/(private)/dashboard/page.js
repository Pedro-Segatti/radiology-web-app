'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Dados simulados do usuário
  const user = {
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    avatar: '/api/placeholder/40/40'
  };

  // Análises simuladas anteriores
  const previousAnalyses = [
    { id: 1, date: '15 Mar 2025', title: 'Análise de produto', imageUrl: '/api/placeholder/300/200', status: 'Completo' },
    { id: 2, date: '10 Mar 2025', title: 'Análise de documento', imageUrl: '/api/placeholder/300/200', status: 'Completo' },
    { id: 3, date: '05 Mar 2025', title: 'Análise de rótulo', imageUrl: '/api/placeholder/300/200', status: 'Completo' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    // Simular análise - em um app real, isso enviaria para uma API
    alert('Imagem enviada para análise! Em um app real, isso processaria a imagem.');
    // Redirecionar para uma página de resultado (simulação)
    // router.push('/dashboard/analysis/new');
  };

  const handleLogout = () => {
    // Implementação real usaria um sistema de autenticação como NextAuth.js
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-blue-600 font-bold text-xl">AnalyzeIt</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src={user.avatar}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Upload */}
          <div className="md:col-span-2 flex flex-col">
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analisar Nova Imagem</h2>
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer ${isDragging ? 'bg-blue-50 border-blue-500' : ''}`}
              >
                <div className="text-center">
                  {selectedImage ? (
                    <div className="flex flex-col items-center">
                      <Image
                        src={selectedImage}
                        alt="Preview"
                        width={300}
                        height={200}
                        className="mb-4 max-h-64 object-contain"
                      />
                      <span className="text-sm text-gray-600">Imagem selecionada</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <span className="relative font-semibold text-blue-600 hover:text-blue-500">
                          Carregar arquivo
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </span>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF até 10MB</p>
                    </div>
                  )}
                </div>
              </div>
              {selectedImage && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Analisar Imagem
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - User Profile & Stats */}
          <div className="md:col-span-1 flex flex-col">
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <div className="flex flex-col items-center">
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-6 w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Total de análises</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Análises este mês</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Último login</span>
                    <span className="font-medium">Hoje às 09:45</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="/dashboard/settings" className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </Link>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Análises Recentes</h2>
            <Link href="/dashboard/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas
            </Link>
          </div>

          {/* Cards alinhados horizontalmente com mesmo tamanho */}
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {previousAnalyses.map((analysis) => (
              <Link href={`/dashboard/analysis/${analysis.id}`} key={analysis.id} className="flex-shrink-0">
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow w-64">
                  <div className="h-40 relative">
                    <Image
                      src={analysis.imageUrl}
                      alt={analysis.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900">{analysis.title}</h3>
                    <p className="text-xs text-gray-500">{analysis.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}