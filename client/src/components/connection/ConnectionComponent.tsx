import React from 'react';
import { Connection, Neuron } from '@shared/types'; // Adjust path

interface ConnectionComponentProps {
  connection: Pick<Connection, 'id' | 'sourceId' | 'targetId' | 'visualProperties'>;
  sourceNeuron: Pick<Neuron, 'id' | 'position' | 'visualProperties'>;
  targetNeuron: Pick<Neuron, 'id' | 'position' | 'visualProperties'>;
}

const ConnectionComponent: React.FC<ConnectionComponentProps> = ({ connection, sourceNeuron, targetNeuron }) => {
  if (!sourceNeuron || !targetNeuron) {
    // This can happen if neurons are not yet loaded or an ID is incorrect
    console.warn(\`Skipping connection \${connection.id} due to missing source/target neuron data.\`);
    return null;
  }

  const sourceSize = sourceNeuron.visualProperties?.size || 50; // Default or match NeuronComponent
  const targetSize = targetNeuron.visualProperties?.size || 50;

  // Calculate center points of the neurons
  const x1 = sourceNeuron.position.x + sourceSize / 2;
  const y1 = sourceNeuron.position.y + sourceSize / 2;
  const x2 = targetNeuron.position.x + targetSize / 2;
  const y2 = targetNeuron.position.y + targetSize / 2;

  const color = connection.visualProperties?.color || 'stroke-gray-500';
  const thickness = connection.visualProperties?.thickness || 2;
  const style = connection.visualProperties?.style;

  let strokeDasharray = "";
  if (style === 'dashed') strokeDasharray = "5,5";
  if (style === 'dotted') strokeDasharray = "2,3";

  // The SVG container needs to be positioned absolutely at (0,0) of the NetworkView
  // and have a size that encompasses all possible lines.
  // For simplicity, we draw one SVG per line. More optimal would be one large SVG.
  // The line coordinates are absolute within this SVG, assuming SVG is at (0,0) of parent.
  return (
    <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }} // Render behind neurons
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`connection-line \${color}`}
        strokeWidth={thickness}
        strokeDasharray={strokeDasharray || undefined}
        markerEnd="url(#arrowhead)" // Optional: for directed connections
      />
      {/* Optional: Define an arrowhead marker if needed for directed graphs
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className={color.replace('stroke-', 'fill-')} />
        </marker>
      </defs>
      */}
    </svg>
  );
};

export default ConnectionComponent;
