'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import Header from '../../Header';
import Footer from '../../Footer';
import AnalysisList from '../analysisCard';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/utils/database';
import { ArrowLeft, Filter, SortDesc, Loader, Search, X } from 'lucide-react';

export default function HistoryPage() {
    const [analyses, setAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [decisionFilter, setDecisionFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');

    const router = useRouter();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const analysisRef = collection(firestore, "analysis");
        const q = query(
            analysisRef,
            where("user_id", "==", user.uid),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const analysisData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnalyses(analysisData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDecisionFilter('all');
        setSortOption('newest');
    };

    const filteredAnalyses = analyses
        .filter(analysis => {
            // Filtro de pesquisa por ID
            if (searchTerm && !analysis.id.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Filtro por status
            if (statusFilter !== 'all' && analysis.status !== statusFilter) {
                return false;
            }

            // Filtro por decisão
            if (decisionFilter !== 'all' && analysis.decision !== decisionFilter) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            // Ordenação
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'highest_prob':
                    return (b.probability || 0) - (a.probability || 0);
                case 'lowest_prob':
                    return (a.probability || 0) - (b.probability || 0);
                default:
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });

    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Carregando histórico de análises...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header da página */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Link href="/dashboard" className="mr-3 p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Histórico de Análises</h1>
                    </div>

                    <button
                        onClick={toggleFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filtros</span>
                    </button>
                </div>

                {/* Painel de filtros */}
                {filterVisible && (
                    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Filtros e Ordenação</h2>
                            <button
                                onClick={toggleFilter}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Busca por ID */}
                            <div className="relative">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    Buscar por ID
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2 text-gray-500"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filtro de status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-base py-2 text-gray-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    <option value="success">Concluído</option>
                                    <option value="unsuccessful">Falhou</option>
                                    <option value="under_analysis">Analisando</option>
                                </select>
                            </div>

                            {/* Filtro de decisão */}
                            <div>
                                <label htmlFor="decision" className="block text-sm font-medium text-gray-700 mb-1">
                                    Decisão
                                </label>
                                <select
                                    id="decision"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-base py-2 text-gray-500"
                                    value={decisionFilter}
                                    onChange={(e) => setDecisionFilter(e.target.value)}
                                >
                                    <option value="all">Todas</option>
                                    <option value="compression">Compressão</option>
                                    <option value="normal">Normal</option>
                                    <option value="undefined">Indefinido</option>
                                </select>
                            </div>

                            {/* Ordenação */}
                            <div>
                                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ordenar por
                                </label>
                                <select
                                    id="sort"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-base py-2 text-gray-500"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="newest">Mais recentes</option>
                                    <option value="oldest">Mais antigas</option>
                                    <option value="highest_prob">Maior probabilidade</option>
                                    <option value="lowest_prob">Menor probabilidade</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>
                )}

                {/* Contagem de resultados */}
                <div className="bg-white rounded-lg shadow px-4 py-3 mb-6 flex justify-between items-center">
                    <div className="text-gray-700">
                        Mostrando <span className="font-medium">{filteredAnalyses.length}</span> de <span className="font-medium">{analyses.length}</span> análises
                    </div>

                    <div className="flex items-center text-sm text-gray-300">
                        <SortDesc className="h-4 w-4 mr-1" />
                        <span>
                            {sortOption === 'newest' && 'Ordenado por mais recentes'}
                            {sortOption === 'oldest' && 'Ordenado por mais antigas'}
                            {sortOption === 'highest_prob' && 'Ordenado por maior probabilidade'}
                            {sortOption === 'lowest_prob' && 'Ordenado por menor probabilidade'}
                        </span>
                    </div>
                </div>

                {/* Lista de análises */}
                <div className="bg-white shadow rounded-lg p-6">
                    {filteredAnalyses.length > 0 ? (
                        <AnalysisList analyses={filteredAnalyses} />
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-gray-500 mb-2">Nenhuma análise encontrada com os filtros selecionados.</p>
                            {(statusFilter !== 'all' || decisionFilter !== 'all' || searchTerm) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Limpar todos os filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Paginação (opcional, poderia ser implementada para grandes volumes de dados) */}
                {filteredAnalyses.length > 20 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Anterior
                                </button>
                                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Próxima
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                                <div>
                                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Anterior</span>
                                            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            1
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700">
                                            2
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            3
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                            ...
                                        </span>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            10
                                        </button>
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Próxima</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}