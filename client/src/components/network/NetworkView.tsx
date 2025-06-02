import React from 'react';
import { Neuron as NeuronType, Connection as ConnectionType } from '@shared/types'; // Adjust path
import NeuronComponent from '../neuron/NeuronComponent';
import ConnectionComponent from '../connection/ConnectionComponent';

interface NetworkViewProps {
  neurons: NeuronType[];
  connections: ConnectionType[];
  onNeuronClick?: (id: string) => void;
  // Add props for viewport manipulation (pan, zoom) later
}

const NetworkView: React.FC<NetworkViewProps> = ({ neurons, connections, onNeuronClick }) => {
  // Create a map for quick neuron lookup by ID for connections
  const neuronMap = React.useMemo(() =>
    new Map(neurons.map(n => [n.id, n])),
    [neurons]
  );

  return (
    <div className="network-view relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Render Connections First (behind neurons) */}
      {connections.map((conn) => {
        const sourceN = neuronMap.get(conn.sourceId);
        const targetN = neuronMap.get(conn.targetId);
        if (sourceN && targetN) {
          return (
            <ConnectionComponent
              key={conn.id}
              connection={conn}
              sourceNeuron={sourceN}
              targetNeuron={targetN}
            />
          );
        }
        return null; // Or some placeholder/error for missing neuron
      })}

      {/* Render Neurons */}
      {neurons.map((neuron) => (
        <NeuronComponent
          key={neuron.id}
          neuron={neuron}
          onClick={onNeuronClick}
        />
      ))}

      {/* Placeholder for Pan/Zoom controls */}
      {/* <div className="absolute top-2 right-2 p-2 bg-white shadow rounded">Pan/Zoom UI</div> */}
    </div>
  );
};

export default NetworkView;
