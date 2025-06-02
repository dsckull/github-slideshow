import {
  NeuralNetworkData,
  Neuron,
  Connection,
  NavigationThread,
  ThreadNode,
  NeuronLayer,
  NeuronType,
  CognitiveSignature // Added for future use, not implemented in store yet
} from '@shared/types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Helper to create a basic neuron
const createBaseNeuron = (id: string, title: string, layer: NeuronLayer, type: NeuronType, position: {x:number, y:number}): Neuron => ({
  id,
  title,
  layer,
  neuronType: type,
  position,
  isCollapsed: false,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    createdBy: 'system',
  },
  childrenIds: [],
});


export class InMemoryStore {
  private networks: Map<string, NeuralNetworkData> = new Map();
  // For simplicity, navigation threads and cognitive signatures might be part of network data
  // or managed separately if they become too large or user-specific.
  // For now, let's keep threads within the network object, assuming a single-user context for now or network-specific threads.
  private navigationThreads: Map<string, NavigationThread> = new Map();
  private cognitiveSignatures: Map<string, CognitiveSignature> = new Map();


  constructor() {
    // Initialize with a default network for testing if needed
    // this.createNetwork({ title: "Default Test Network", description: "A network for initial testing." });
  }

  // --- Network Methods ---
  createNetwork(params: { title: string; description?: string; ownerId?: string }): NeuralNetworkData {
    const networkId = uuidv4();
    const now = new Date().toISOString();

    const rootNeuronId = uuidv4();
    const rootNeuron = createBaseNeuron(rootNeuronId, params.title || 'Root Concept', NeuronLayer.MACRO, NeuronType.CATEGORY, {x: 100, y: 100});

    const newNetwork: NeuralNetworkData = {
      id: networkId,
      title: params.title,
      description: params.description,
      neurons: { [rootNeuronId]: rootNeuron },
      connections: {},
      rootNeuronIds: [rootNeuronId],
      metadata: {
        createdAt: now,
        updatedAt: now,
        schemaVersion: "0.1.0",
        ownerId: params.ownerId,
      },
    };
    this.networks.set(networkId, newNetwork);
    console.log(\`Network created: \${networkId} - \${params.title}\`);
    return newNetwork;
  }

  getNetwork(networkId: string): NeuralNetworkData | undefined {
    return this.networks.get(networkId);
  }

  // --- Neuron Methods ---
  addNeuron(networkId: string, neuronData: Omit<Neuron, 'id' | 'metadata' | 'childrenIds' | 'isCollapsed'> & { parentId?: string }): Neuron | null {
    const network = this.networks.get(networkId);
    if (!network) return null;

    const neuronId = uuidv4();
    const now = new Date().toISOString();
    const newNeuron: Neuron = {
      ...neuronData,
      id: neuronId,
      isCollapsed: false,
      childrenIds: [],
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
        createdBy: (neuronData as any).metadata?.createdBy || 'user', // Using 'as any' to simplify for now if metadata structure in Omit is tricky
      },
    };

    network.neurons[neuronId] = newNeuron;

    if (neuronData.parentId) {
      const parent = network.neurons[neuronData.parentId];
      if (parent) {
        parent.childrenIds = [...(parent.childrenIds || []), neuronId];
        // Optionally create a default connection from parent to child
        // For now, connection creation is a separate step.
      }
    } else if (newNeuron.layer === NeuronLayer.MACRO) {
        network.rootNeuronIds = [...new Set([...network.rootNeuronIds, neuronId])];
    }

    network.metadata.updatedAt = now;
    console.log(\`Neuron \${neuronId} added to network \${networkId}\`);
    return newNeuron;
  }

  getNeuron(networkId: string, neuronId: string): Neuron | null {
    const network = this.networks.get(networkId);
    return network?.neurons[neuronId] || null;
  }

  // --- Connection Methods ---
  addConnection(networkId: string, connectionData: Omit<Connection, 'id' | 'metadata'>): Connection | null {
    const network = this.networks.get(networkId);
    if (!network || !network.neurons[connectionData.sourceId] || !network.neurons[connectionData.targetId]) {
      console.error("Failed to add connection: Network or source/target neuron not found.");
      return null;
    }

    const connectionId = uuidv4();
    const now = new Date().toISOString();
    const newConnection: Connection = {
      ...connectionData,
      id: connectionId,
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy: (connectionData as any).metadata?.createdBy || 'user', // Using 'as any' for simplicity
      },
    };
    network.connections[connectionId] = newConnection;
    network.metadata.updatedAt = now;
    console.log(\`Connection \${connectionId} added to network \${networkId}\`);
    return newConnection;
  }

  // --- Navigation Thread Methods ---
  initializeNavigationThread(userId: string, networkId: string, startNode: ThreadNode): NavigationThread | null {
    // For now, ensure network exists, but thread is primarily user-centric.
    // A more robust system might link threads to networks explicitly if they are network-specific.
    if (!this.networks.has(networkId)) {
        console.error("Cannot initialize thread: Network not found.");
        return null;
    }

    const threadId = uuidv4();
    const now = new Date().toISOString();
    const newThread: NavigationThread = {
      id: threadId,
      userId,
      nodes: [startNode],
      isImmutable: true,
      canBeExtended: true,
      metadata: {
        createdAt: now,
        lastExtendedAt: now,
      },
      visualProperties: { // Default color
        color: '#FF0000' // Red
      }
    };
    this.navigationThreads.set(threadId, newThread);
    console.log(\`Navigation thread \${threadId} initialized for user \${userId}\`);
    return newThread;
  }

  addNodeToThread(threadId: string, node: ThreadNode): NavigationThread | null {
    const thread = this.navigationThreads.get(threadId);
    if (!thread) return null;

    // Enforce immutability by creating new array of nodes
    thread.nodes = [...thread.nodes, node];
    thread.metadata.lastExtendedAt = new Date().toISOString();
    // this.navigationThreads.set(threadId, thread); // Map stores by reference, so this is not strictly needed for object property changes
    console.log(\`Node added to thread \${threadId}\`);
    return thread;
  }

  getNavigationThread(threadId: string): NavigationThread | undefined {
    return this.navigationThreads.get(threadId);
  }
}

// Export a singleton instance
export const store = new InMemoryStore();
