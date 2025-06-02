import React from 'react';
import { Neuron, NeuronLayer, NeuronType } from '@shared/types'; // Adjust path as necessary

interface NeuronComponentProps {
  neuron: Pick<Neuron, 'id' | 'title' | 'layer' | 'position' | 'neuronType' | 'visualProperties'>;
  onClick?: (id: string) => void;
}

const NeuronComponent: React.FC<NeuronComponentProps> = ({ neuron, onClick }) => {
  const { id, title, layer, position, neuronType, visualProperties } = neuron;

  const size = visualProperties?.size || (layer === NeuronLayer.MACRO ? 60 : layer === NeuronLayer.MESO ? 40 : 30);
  let bgColor = visualProperties?.color || 'bg-blue-500';
  let shapeClass = 'rounded-full'; // Default to circle

  switch (neuronType) {
    case NeuronType.CATEGORY:
      bgColor = visualProperties?.color || 'bg-green-500';
      shapeClass = 'rounded-md'; // Square for categories
      break;
    case NeuronType.QUESTION:
      bgColor = visualProperties?.color || 'bg-yellow-400';
      shapeClass = 'rounded-lg'; // Slightly different square
      break;
    case NeuronType.TEXT_CONTENT:
      bgColor = visualProperties?.color || 'bg-indigo-500';
      break;
    default:
      break;
  }

  if (visualProperties?.shape === 'square') shapeClass = 'rounded-md';
  else if (visualProperties?.shape === 'hexagon') shapeClass = 'hexagon-shape'; // Needs custom CSS for hexagon

  const styles: React.CSSProperties = {
    left: \`\${position.x}px\`,
    top: \`\${position.y}px\`,
    width: \`\${size}px\`,
    height: \`\${size}px\`,
    position: 'absolute', // Important for positioning within NetworkView
  };

  return (
    <div
      id={`neuron-\${id}`}
      className={`neuron-component \${bgColor} \${shapeClass} flex items-center justify-center text-white text-xs font-semibold shadow-lg cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-pink-500 transition-all`}
      style={styles}
      onClick={() => onClick?.(id)}
      title={`\${title} (\${NeuronLayer[layer]} - \${neuronType})`}
    >
      <span className="truncate p-1 text-center">{title}</span>
      {/* Basic hexagon requires specific CSS, not covered by Tailwind directly */}
      {visualProperties?.shape === 'hexagon' && (
         <style>{`.hexagon-shape { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }`}</style>
      )}
    </div>
  );
};

export default NeuronComponent;
