import React from 'react';
import { NeuronLayer } from '@shared/types'; // Adjust path

interface LayerIndicatorProps {
  currentLayer: NeuronLayer;
  currentPath?: string[]; // e.g., ["Solar System", "Earth", "Atmosphere"]
}

const LayerIndicator: React.FC<LayerIndicatorProps> = ({ currentLayer, currentPath = [] }) => {
  const layerName = NeuronLayer[currentLayer]; // Gets the string name like "MACRO"

  return (
    <div className="layer-indicator fixed bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg shadow-xl text-sm">
      <div className="font-bold">
        Camada Atual: {layerName} ({currentLayer}/3)
      </div>
      {currentPath.length > 0 && (
        <div className="mt-1 text-xs">
          Caminho: {currentPath.join(' > ')}
        </div>
      )}
    </div>
  );
};

export default LayerIndicator;
