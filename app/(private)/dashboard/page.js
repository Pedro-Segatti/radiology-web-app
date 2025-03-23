'use client';

import { useState, useRef, useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Header from '../Header';
import Footer from '../Footer';
import { collection, limit, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/utils/database';
import { apiPost } from '@/utils/requests';
import AnalysisList from './analysisCard';
import { format } from 'date-fns';
import { X, AlertCircle, CheckCircle, Loader, BarChart2, Calendar, Clock } from 'lucide-react';

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    thisWeekAnalyses: 0,
    avgProcessingTime: 0,
    latestAnalysisDate: null
  });

  const fileInputRef = useRef(null);
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const analysisRef = collection(firestore, "analysis");
    const q = query(analysisRef, where("user_id", "==", user.uid), orderBy("created_at", "desc"), limit(4));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const analysisData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnalysis(analysisData);
      setIsLoading(false);
    });

    // Fetch statistics
    fetchStats();

    return () => unsubscribe();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Reference to all user analyses
      const analysisRef = collection(firestore, "analysis");
      const q = query(analysisRef, where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const now = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      
      let totalAnalyses = 0;
      let thisWeekAnalyses = 0;
      let totalProcessingTime = 0;
      let processedAnalyses = 0;
      let latestDate = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalAnalyses++;
        
        // Count analyses from the last 7 days
        if (data.created_at && new Date(data.created_at) >= oneWeekAgo) {
          thisWeekAnalyses++;
        }
        
        // Calculate average processing time if available
        if (data.processing_time) {
          totalProcessingTime += data.processing_time;
          processedAnalyses++;
        }
        
        // Track the latest analysis date
        if (data.created_at && (!latestDate || new Date(data.created_at) > latestDate)) {
          latestDate = new Date(data.created_at);
        }
      });
      
      setStats({
        totalAnalyses,
        thisWeekAnalyses,
        avgProcessingTime: processedAnalyses > 0 ? totalProcessingTime / processedAnalyses : 0,
        latestAnalysisDate: latestDate
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification('error', 'A imagem excede o tamanho máximo de 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.onerror = () => {
        showNotification('error', 'Erro ao ler o arquivo');
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
      if (file.size > 10 * 1024 * 1024) {
        showNotification('error', 'A imagem excede o tamanho máximo de 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.onerror = () => {
        showNotification('error', 'Erro ao ler o arquivo');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      const startTime = Date.now();
      
      const data = {
        image: selectedImage
      };

      await apiPost("/analysis", data);
      
      setTimeout(() => fetchStats(), 1000);
      
      showNotification('success', 'Imagem enviada para análise!');
      setSelectedImage(null);
    } catch (error) {
      showNotification('Não foi possível analisar a imagem. Tente novamente mais tarde.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Loading screen while initial data is loading
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Carregando seu dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Notification component */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-md transform transition-transform duration-300 ease-in-out ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Upload */}
          <div className="md:col-span-2 flex flex-col">
            <div className="bg-white shadow-lg rounded-lg p-6 flex-1 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Analisar Nova Imagem</h2>
              {/* Upload Area - Altura fixa para manter o tamanho do card */}
              <div
                onClick={() => { if (fileInputRef.current) fileInputRef.current.click() }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-8 h-72 overflow-hidden transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'bg-blue-50 border-blue-500'
                    : selectedImage
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="text-center flex flex-col items-center justify-center w-full">
                  {selectedImage ? (
                    <div className="flex flex-col items-center justify-center relative w-full h-full">
                      {/* Imagem com container melhorado e espaço para o botão X */}
                      <div className="relative group bg-white p-3 rounded-lg shadow-md max-w-sm w-full mt-4">
                        {/* Botão X com posicionamento ajustado para não ser cortado */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md z-10 transform hover:scale-110"
                          title="Remover imagem"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className="overflow-hidden rounded-md">
                          <Image
                            src={selectedImage}
                            alt="Preview"
                            width={400}
                            height={300}
                            style={{ objectFit: 'contain', maxHeight: '220px', width: '100%' }}
                            className="rounded-md transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-center">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Imagem pronta para análise</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-50 p-6 rounded-full mb-4">
                        <svg className="h-12 w-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="mt-2 flex text-sm leading-6 text-gray-600">
                        <span className="relative font-semibold text-blue-600 hover:text-blue-500 transition-colors">
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
                      <p className="text-xs leading-5 text-gray-600 mt-1">PNG, JPG, GIF até 10MB</p>
                    </div>
                  )}
                </div>
              </div>
              {selectedImage && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`
                      ${isAnalyzing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                      text-white font-bold py-3.5 px-8 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                      transform hover:translate-y-[-2px] hover:shadow-xl active:translate-y-[0px] disabled:transform-none disabled:cursor-not-allowed
                      w-full sm:w-auto text-lg
                    `}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="animate-spin h-6 w-6" />
                        <span>Enviando para Análise</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 5H20M20 5V11M20 5L13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 13.5V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 3H8C5.79086 3 4 4.79086 4 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>Analisar Imagem</span>
                      </>
                    )}
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
                  src={user.photoURL || "/default-avatar.jpg"}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.displayName}</h2>
                <p className="text-gray-700">{user.email}</p>
                
                {/* Stats Cards */}
                <div className="mt-6 w-full space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-sm font-medium text-blue-800">Estatísticas</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Total de análises</span>
                        <span className="font-medium text-gray-900">{stats.totalAnalyses}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Análises esta semana</span>
                        <span className="font-medium text-gray-900">{stats.thisWeekAnalyses}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Tempo médio</span>
                        <span className="font-medium text-gray-900">
                          {stats.avgProcessingTime ? `${stats.avgProcessingTime.toFixed(1)}s` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Última análise</span>
                        <span className="font-medium text-gray-900">
                          {stats.latestAnalysisDate ? format(stats.latestAnalysisDate, 'dd/MM/yyyy') : 'N/A'}
                        </span>
                      </div>
                    </div>
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

        {/* Recent Analyses Section */}
        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Análises Recentes</h2>
            <Link href="/dashboard/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todas
            </Link>
          </div>

          {/* Cards alinhados horizontalmente com mesmo tamanho */}
          {analysis.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 pb-4">
              <AnalysisList analyses={analysis} />
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Você ainda não tem análises. Faça sua primeira análise agora!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}