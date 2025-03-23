import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import ModalImageSection from './modalImageSection';

const AnalysisCard = ({ analysis }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const timeAgo = formatDistanceToNow(new Date(analysis.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  const processingTime = analysis.finished_at
    ? ((new Date(analysis.finished_at) - new Date(analysis.created_at)) / 1000).toFixed(1)
    : null;

  // Format probability as percentage
  const probabilityPercentage = analysis.probability
    ? `${(analysis.probability * 100).toFixed(1)}%`
    : 'N/A';

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'unsuccessful': return 'bg-red-100 text-red-800';
      case 'under_analysis': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 'success': return 'Concluído';
      case 'unsuccessful': return 'Falhou';
      case 'under_analysis': return 'Analisando';
      default: return 'Desconhecido';
    }
  };

  const getDecision = (decision) => {
    switch (decision) {
      case 'compression': return 'Compressão';
      case 'normal': return 'Normal';
      case 'undefined': return 'Indefinido';
      default: return 'N/A';
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex-shrink-0">
        <div
          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-72 cursor-pointer"
          onClick={openModal}
        >
          <div className="h-48 relative">
            <Image
              src={analysis.image_url}
              alt={`${analysis.decision} analysis`}
              priority={false}
              quality={35}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 272px"
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(analysis.status)}`}>
                {getStatus(analysis.status)}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 capitalize">{getDecision(analysis.decision)}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {probabilityPercentage}
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Criado: {timeAgo}</p>
              {processingTime && (
                <p>Tempo de Processamento: {processingTime}s</p>
              )}
              <p>ID: {analysis.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold capitalize text-gray-700">{getDecision(analysis.decision)}</h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <ModalImageSection analysis={analysis} />

              {/* Details section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(analysis.status)}`}>
                    {getStatus(analysis.status)}
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-md">
                    Probabilidade: {probabilityPercentage}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Informações de Tempo</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Criado</div>
                    <div className="text-gray-400">{format(new Date(analysis.created_at), 'PPP pp', { locale: ptBR })}</div>

                    {analysis.finished_at && (
                      <>
                        <div className="text-gray-500">Finalizado</div>
                        <div className="text-gray-400">{format(new Date(analysis.finished_at), 'PPP pp', { locale: ptBR })}</div>

                        <div className="text-gray-500">Tempo de Processamento</div>
                        <div className="text-gray-400">{processingTime} seconds</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Detalhes da Análise</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">ID</div>
                    <div className="font-mono text-xs break-all text-gray-400">{analysis.id}</div>

                    <div className="text-gray-500">Decisão</div>
                    <div className="capitalize text-gray-400">{getDecision(analysis.decision)}</div>

                    <div className="text-gray-500">Status</div>
                    <div className="capitalize text-gray-400">{getStatus(analysis.status)}</div>

                    <div className="text-gray-500">Probabilidade</div>
                    <div className="text-gray-400">{probabilityPercentage}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Informações da Imagem</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Dimensão</div>
                    <div className="font-mono text-xs break-all text-gray-400">{`${analysis.image_width ?? "-"}px x ${analysis.image_height ?? "-"}px`}</div>

                    <div className="text-gray-500">Formato</div>
                    <div className="font-mono text-xs break-all text-gray-400">{analysis.image_format ?? "-"}</div>

                    <div className="text-gray-500">Tamanho</div>
                    <div className="font-mono text-xs break-all text-gray-400">{analysis.image_size_kb ?? "-"}kb</div>

                    <div className="text-gray-500">URL</div>
                    <div className="text-xs break-all">
                      <a href={analysis.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {analysis.image_url.substring(0, 35)}...
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AnalysisList = ({ analyses }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {analyses.map((analysis) => (
        <AnalysisCard key={analysis.id} analysis={analysis} />
      ))}
    </div>
  );
};

export default AnalysisList;