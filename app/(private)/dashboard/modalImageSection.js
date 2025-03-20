import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, Maximize, Minimize, RotateCw } from 'lucide-react';

const ImagePreview = ({ imageUrl, altText }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (imageContainerRef.current?.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
    e.preventDefault();
  };

  const resetView = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative h-64 md:h-full overflow-hidden bg-gray-100 rounded-xl border"
      ref={imageContainerRef}
    >
      {/* Image container */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ overflow: 'hidden' }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Image
            src={imageUrl}
            alt={altText}
            quality={100}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full p-1 flex items-center space-x-2">
        <button 
          onClick={zoomIn} 
          className="text-white p-1.5 hover:bg-white/20 rounded-full"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={zoomOut} 
          className="text-white p-1.5 hover:bg-white/20 rounded-full"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          onClick={rotate} 
          className="text-white p-1.5 hover:bg-white/20 rounded-full"
          title="Rotate"
        >
          <RotateCw size={18} />
        </button>
        <button 
          onClick={toggleFullscreen} 
          className="text-white p-1.5 hover:bg-white/20 rounded-full"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <button 
          onClick={resetView} 
          className="text-white px-2 py-1 text-xs hover:bg-white/20 rounded-full"
          title="Reset view"
        >
          Redefinir
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

// Updated implementation for the modal image
const ModalImageSection = ({ analysis }) => {
  return (
    <ImagePreview 
      imageUrl={analysis.image_url} 
      altText={`${analysis.decision} analysis`} 
    />
  );
};

export default ModalImageSection;