import React from 'react';
import { NavigationThread, NeuronLayer } from '@shared/types'; // Adjust path

interface TimelineViewProps {
  thread?: NavigationThread | null;
}

const TimelineView: React.FC<TimelineViewProps> = ({ thread }) => {
  if (!thread || thread.nodes.length === 0) {
    return (
      <div className="timeline-view p-4 bg-gray-200 rounded-md shadow">
        <p className="text-gray-600">A jornada do conhecimento ainda não começou.</p>
        <p className="text-xs text-gray-500 mt-1">Interaja com a rede para ver o fio do novelo se desenrolar aqui.</p>
      </div>
    );
  }

  return (
    <div className="timeline-view p-4 bg-white rounded-lg shadow-md max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Linha do Tempo da Exploração</h3>
      <ul className="space-y-1">
        {thread.nodes.map((node, index) => (
          <li key={index} className="text-xs p-1.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <span className="font-medium text-indigo-600">Nó {index + 1}:</span> Neuron ID <span className="text-purple-700">{node.neuronId}</span> (Camada: {NeuronLayer[node.layer]})
            <span className="text-gray-500 ml-2">às {new Date(node.timestamp).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
       <p className="text-center text-xs text-gray-400 mt-3">Visualização completa da linha do tempo em breve!</p>
    </div>
  );
};

export default TimelineView;
