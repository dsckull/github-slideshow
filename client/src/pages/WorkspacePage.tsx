import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    NeuralNetworkData,
    Neuron as NeuronSharedType,
    Connection as ConnectionSharedType,
    NavigationThread,
    ThreadNode,
    NeuronLayer,
    NeuronType,
    ConnectionType // Added for creating connections
} from '@shared/types';
import NetworkView from '../components/network/NetworkView';
import LayerIndicator from '../components/layout/LayerIndicator';
import TimelineView from '../components/timeline/TimelineView';
import { v4 as uuidv4 } from 'uuid'; // For client-side ID generation

const WorkspacePage: React.FC = () => {
  const { networkId } = useParams<{ networkId: string }>();
  const [networkData, setNetworkData] = useState<NeuralNetworkData | null>(null);
  const [currentLayer, setCurrentLayer] = useState<NeuronLayer>(NeuronLayer.MACRO);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [focusedMacroNeuronId, setFocusedMacroNeuronId] = useState<string | null>(null);
  const [navigationThread, setNavigationThread] = useState<NavigationThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MOCK_USER_ID = "user-123";

  const createMockNetwork = useCallback((id: string): NeuralNetworkData => {
    const mockRootNeuronId = \`root-\${id.substring(0,4)}\`;
    const mesoChild1Id = \`meso-child1-\${id.substring(0,4)}\`;
    const mesoChild2Id = \`meso-child2-\${id.substring(0,4)}\`;
    const microChild1Id = \`micro-child1-\${id.substring(0,4)}\`;

    return {
      id: id,
      title: "Mock Test Network",
      rootNeuronIds: [mockRootNeuronId],
      neurons: {
        [mockRootNeuronId]: {
          id: mockRootNeuronId, title: "Conceito Macro Principal", layer: NeuronLayer.MACRO, neuronType: NeuronType.CATEGORY,
          position: { x: 100, y: 100 }, isCollapsed: false, metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}, childrenIds: [mesoChild1Id, mesoChild2Id]
        },
        [mesoChild1Id]: {
          id: mesoChild1Id, title: "Detalhe Meso A", layer: NeuronLayer.MESO, neuronType: NeuronType.CONCEPT,
          position: { x: 50, y: 50 }, isCollapsed: false, parentId: mockRootNeuronId, metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}, childrenIds: [microChild1Id]
        },
        [mesoChild2Id]: {
          id: mesoChild2Id, title: "Detalhe Meso B", layer: NeuronLayer.MESO, neuronType: NeuronType.CONCEPT,
          position: { x: 250, y: 50 }, isCollapsed: false, parentId: mockRootNeuronId, metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}
        },
        [microChild1Id]: {
            id: microChild1Id, title: "Sub-Detalhe Micro Alpha", layer: NeuronLayer.MICRO, neuronType: NeuronType.TEXT_CONTENT,
            position: {x: 20, y: 20}, isCollapsed: false, parentId: mesoChild1Id, metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}
        }
      },
      connections: {
        [\`conn-\${mockRootNeuronId}-\${mesoChild1Id}\`]: { id: \`conn-\${mockRootNeuronId}-\${mesoChild1Id}\`, sourceId: mockRootNeuronId, targetId: mesoChild1Id, connectionType: ConnectionType.CONTAINS, metadata: {createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}},
        [\`conn-\${mockRootNeuronId}-\${mesoChild2Id}\`]: { id: \`conn-\${mockRootNeuronId}-\${mesoChild2Id}\`, sourceId: mockRootNeuronId, targetId: mesoChild2Id, connectionType: ConnectionType.CONTAINS, metadata: {createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}},
        [\`conn-\${mesoChild1Id}-\${microChild1Id}\`]: { id: \`conn-\${mesoChild1Id}-\${microChild1Id}\`, sourceId: mesoChild1Id, targetId: microChild1Id, connectionType: ConnectionType.CONTAINS, metadata: {createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}}
      },
      metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), schemaVersion: "0.1.0" }
    };
  }, []);


  useEffect(() => {
    if (!networkId) {
      setError("Network ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchNetworkData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(\`/api/network/\${networkId}\`);
        if (!response.ok) {
          if (response.status === 404 && networkId === 'test-network-123') {
            console.warn("Test network ID not found on server, creating mock data for test-network-123.");
            const mockNetwork = createMockNetwork(networkId);
            setNetworkData(mockNetwork);
            const rootNeuron = mockNetwork.neurons[mockNetwork.rootNeuronIds[0]];
            setCurrentPath(rootNeuron ? [rootNeuron.title] : []);
          } else {
            throw new Error(\`Failed to fetch network data (\${response.status}): \${response.statusText}\`);
          }
        } else {
            const data = await response.json();
            setNetworkData(data);
            if (data.rootNeuronIds?.length > 0 && data.neurons[data.rootNeuronIds[0]]) {
                 setCurrentPath([data.neurons[data.rootNeuronIds[0]].title]);
            } else {
                 setCurrentPath([]); // Ensure path is empty if no root neurons
            }
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
         if (networkId === 'test-network-123') { // Fallback for test ID if fetch fails for any reason
            console.warn("Fetch failed for test-network-123, using mock data as fallback.");
            const mockNetwork = createMockNetwork(networkId);
            setNetworkData(mockNetwork);
            const rootNeuron = mockNetwork.neurons[mockNetwork.rootNeuronIds[0]];
            setCurrentPath(rootNeuron ? [rootNeuron.title] : []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkData();
  }, [networkId, createMockNetwork]);

  // Initialize or fetch navigation thread
  useEffect(() => {
    if (networkData && networkData.rootNeuronIds.length > 0 && !navigationThread) {
      const rootNeuron = networkData.neurons[networkData.rootNeuronIds[0]];
      if (!rootNeuron) return;

      const startNode: ThreadNode = {
        neuronId: rootNeuron.id,
        layer: rootNeuron.layer,
        timestamp: new Date().toISOString(),
        interactionType: "view"
      };

      const initThread = async () => {
        try {
          const response = await fetch(\`/api/network/\${networkData.id}/thread\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: MOCK_USER_ID,
              startNeuronId: rootNeuron.id,
              startLayer: rootNeuron.layer
            })
          });
          if (!response.ok) throw new Error(\`Failed to initialize thread (\${response.status})\`);
          const threadData = await response.json();
          setNavigationThread(threadData);
        } catch (threadError) {
          console.error("Error initializing thread on server:", threadError);
          setNavigationThread({
            id: \`mock-thread-\${uuidv4().substring(0,4)}\`,
            userId: MOCK_USER_ID,
            nodes: [startNode],
            isImmutable: true,
            canBeExtended: true,
            metadata: { createdAt: new Date().toISOString(), lastExtendedAt: new Date().toISOString() }
          });
        }
      };
      initThread();
    }
  }, [networkData, navigationThread, networkId]); // Added networkId to dependencies

  const updateNavigationThread = useCallback(async (newNode: ThreadNode) => {
    if (!navigationThread || !networkId) return;
    try {
        const response = await fetch(\`/api/network/\${networkId}/thread/\${navigationThread.id}/node\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNode)
        });
        if (!response.ok) throw new Error(\`Failed to update thread on server (\${response.status})\`);
        const updatedThread = await response.json();
        setNavigationThread(updatedThread);
    } catch (threadError) {
        console.error("Error updating thread on server, updating locally:", threadError);
        setNavigationThread(prev => {
            if (!prev) return null;
            // Ensure nodes array exists before spreading
            const currentNodes = prev.nodes || [];
            return {
                ...prev,
                nodes: [...currentNodes, newNode],
                metadata: {...prev.metadata, lastExtendedAt: new Date().toISOString()}
            };
        });
    }
  }, [navigationThread, networkId]);


  const handleNeuronClick = useCallback((neuronId: string) => {
    if (!networkData) return;
    const clickedNeuron = networkData.neurons[neuronId];
    if (!clickedNeuron) return;

    console.log(\`Neuron clicked: \${clickedNeuron.title} (Layer: \${NeuronLayer[clickedNeuron.layer]}), Current Layer: \${NeuronLayer[currentLayer]}\`);

    // Update navigation thread
    const newNode: ThreadNode = {
      neuronId: clickedNeuron.id,
      layer: clickedNeuron.layer,
      timestamp: new Date().toISOString(),
      interactionType: "view"
    };
    updateNavigationThread(newNode);

    // Layer change logic
    if (clickedNeuron.layer === NeuronLayer.MACRO) {
        if (currentLayer === NeuronLayer.MACRO && focusedMacroNeuronId !== clickedNeuron.id) {
            // Zooming into this Macro neuron's Meso layer
            setCurrentLayer(NeuronLayer.MESO);
            setFocusedMacroNeuronId(clickedNeuron.id);
            setCurrentPath([clickedNeuron.title]);
            console.log(\`Zooming into MESO layer of \${clickedNeuron.title}\`);
        } else if (currentLayer !== NeuronLayer.MACRO && focusedMacroNeuronId === clickedNeuron.id) {
            // Clicking the same focused Macro neuron while in Meso/Micro layer - zoom out to Macro
            setCurrentLayer(NeuronLayer.MACRO);
            setFocusedMacroNeuronId(null);
            const rootNeuron = networkData.neurons[networkData.rootNeuronIds[0]]; // Or find the actual root of current path
            setCurrentPath(rootNeuron ? [rootNeuron.title] : []);
            console.log("Zooming out to MACRO layer");
        } else if (currentLayer !== NeuronLayer.MACRO && focusedMacroNeuronId !== clickedNeuron.id) {
            // Clicking a different Macro neuron while zoomed into another - switch focus at Macro then zoom
            setCurrentLayer(NeuronLayer.MESO); // Or MACRO first, then MESO
            setFocusedMacroNeuronId(clickedNeuron.id);
            setCurrentPath([clickedNeuron.title]);
            console.log(\`Switching focus and zooming into MESO layer of \${clickedNeuron.title}\`);
        }
    } else if (clickedNeuron.layer === NeuronLayer.MESO && currentLayer === NeuronLayer.MESO) {
        // Clicked a Meso neuron while in Meso view (of a focused Macro neuron)
        // This means we are zooming into this Meso neuron's Micro layer
        if (clickedNeuron.parentId === focusedMacroNeuronId) {
            setCurrentLayer(NeuronLayer.MICRO);
            // focusedMesoNeuronId(clickedNeuron.id); // Need a new state for this
            setCurrentPath(prev => [prev[0], clickedNeuron.title]);
            console.log(\`Zooming into MICRO layer of \${clickedNeuron.title}\`);
        }
    } else if (clickedNeuron.layer === NeuronLayer.MICRO && currentLayer === NeuronLayer.MICRO) {
        // Clicked a Micro neuron, no further zoom in this model
        console.log(\`Interacting with MICRO neuron \${clickedNeuron.title}\`);
        alert(\`Detalhes do neurônio Micro: \${clickedNeuron.title}\`);
    }
    // Add more conditions for zooming out from Micro to Meso, etc.

  }, [networkData, currentLayer, focusedMacroNeuronId, updateNavigationThread]);

  const handleAddMacroNeuron = useCallback(async () => {
    if (!networkId) return;
    const newNeuronId = \`client-macro-\${uuidv4().substring(0,4)}\`;
    const newNeuronData: Omit<NeuronSharedType, 'id' | 'metadata' | 'childrenIds' | 'isCollapsed'> = {
      title: \`Novo Macro \${Object.keys(networkData?.neurons || {}).length + 1}\`,
      layer: NeuronLayer.MACRO,
      neuronType: NeuronType.CONCEPT,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      // No parentId for Macro neurons added this way
    };

    try {
        const response = await fetch(\`/api/network/\${networkId}/neuron\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNeuronData)
        });
        if (!response.ok) throw new Error(\`Failed to add neuron on server (\${response.status})\`);
        const savedNeuron = await response.json();

        setNetworkData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                neurons: { ...prev.neurons, [savedNeuron.id]: savedNeuron },
                rootNeuronIds: prev.rootNeuronIds.includes(savedNeuron.id) ? prev.rootNeuronIds : [...prev.rootNeuronIds, savedNeuron.id],
                metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
            };
        });
    } catch (err) {
        console.error("Error adding Macro neuron to server, adding locally:", err);
        const fullNewNeuron: NeuronSharedType = {
            ...newNeuronData,
            id: newNeuronId,
            isCollapsed: false,
            childrenIds: [],
            metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: MOCK_USER_ID, version: 1}
        };
        setNetworkData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                neurons: { ...prev.neurons, [newNeuronId]: fullNewNeuron },
                rootNeuronIds: prev.rootNeuronIds.includes(newNeuronId) ? prev.rootNeuronIds : [...prev.rootNeuronIds, newNeuronId],
                metadata: { ...prev.metadata, updatedAt: new Date().toISOString() }
            };
        });
    }
  }, [networkId, networkData]);

  const getDisplayedNeuronsAndConnections = () => {
    if (!networkData) return { displayNeurons: [], displayConnections: [] };

    let displayNeurons: NeuronSharedType[] = [];

    if (currentLayer === NeuronLayer.MACRO) {
        displayNeurons = Object.values(networkData.neurons).filter(n => n.layer === NeuronLayer.MACRO);
    } else if (currentLayer === NeuronLayer.MESO && focusedMacroNeuronId) {
        displayNeurons = Object.values(networkData.neurons).filter(n => n.parentId === focusedMacroNeuronId && n.layer === NeuronLayer.MESO);
        // Optionally, also show the focusedMacroNeuron itself, perhaps styled differently
        // const focusedParent = networkData.neurons[focusedMacroNeuronId];
        // if (focusedParent) displayNeurons.push(focusedParent);
    } else if (currentLayer === NeuronLayer.MICRO && currentPath.length >= 2) {
        // Assume currentPath[0] is Macro title, currentPath[1] is Meso title. Need IDs.
        // This simplified logic needs robust ID tracking for focused Meso parent.
        // For now, let's find the meso parent by title (not robust)
        const mesoParentTitle = currentPath[1];
        const mesoParent = Object.values(networkData.neurons).find(n => n.title === mesoParentTitle && n.layer === NeuronLayer.MESO && n.parentId === focusedMacroNeuronId);
        if (mesoParent) {
            displayNeurons = Object.values(networkData.neurons).filter(n => n.parentId === mesoParent.id && n.layer === NeuronLayer.MICRO);
        }
    }

    const displayNeuronIds = new Set(displayNeurons.map(n => n.id));
    const displayConnections = Object.values(networkData.connections).filter(
        c => displayNeuronIds.has(c.sourceId) && displayNeuronIds.has(c.targetId)
    );

    return { displayNeurons, displayConnections };
  };

  const { displayNeurons, displayConnections } = getDisplayedNeuronsAndConnections();

  if (isLoading) return <div className="p-10 text-center text-xl">Carregando Espaço de Trabalho...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Erro: {error} (ID da Rede: {networkId})</div>;
  if (!networkData) return <div className="p-10 text-center text-xl">Nenhuma informação da rede encontrada.</div>;

  const currentFocusedTitle = focusedMacroNeuronId ? networkData.neurons[focusedMacroNeuronId]?.title : "Nenhum";

  return (
    <div className="workspace-page flex flex-col h-[calc(100vh-var(--header-height,10vh)-var(--footer-height,5vh))]"> {/* Adjust for header/footer */}
      <div className="controls p-2 bg-gray-200 shadow flex items-center space-x-2">
        <button
          onClick={handleAddMacroNeuron}
          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm disabled:bg-gray-400"
          disabled={currentLayer !== NeuronLayer.MACRO}
          title={currentLayer !== NeuronLayer.MACRO ? "Apenas na camada MACRO" : "Adicionar Neurônio Macro"}
        >
          + Macro Neurônio
        </button>
        <span className="text-xs text-gray-700">
            Foco Macro Atual: <span className="font-semibold">{currentFocusedTitle}</span>
        </span>
         {/* Button to zoom out to Macro view if not already there */}
        {currentLayer !== NeuronLayer.MACRO && (
            <button
                onClick={() => {
                    setCurrentLayer(NeuronLayer.MACRO);
                    setFocusedMacroNeuronId(null);
                    const rootNeuron = networkData.neurons[networkData.rootNeuronIds[0]];
                    setCurrentPath(rootNeuron ? [rootNeuron.title] : []);
                }}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
            >
                Ver Camada MACRO
            </button>
        )}
      </div>
      <div className="flex-grow relative">
        <NetworkView
          neurons={displayNeurons}
          connections={displayConnections}
          onNeuronClick={handleNeuronClick}
        />
      </div>
      <LayerIndicator currentLayer={currentLayer} currentPath={currentPath} />
      <div className="fixed bottom-4 right-4 w-1/3 max-w-md z-10"> {/* Ensure z-index is high enough */}
        <TimelineView thread={navigationThread} />
      </div>
    </div>
  );
};

export default WorkspacePage;
