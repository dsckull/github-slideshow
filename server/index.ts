import express, { Request, Response } from 'express';
import path from 'path';
import { store } from './storage'; // Assuming storage.ts is in the same directory
import { NeuronLayer, NeuronType, ThreadNode } from '@shared/types'; // Import necessary types
import { v4 as uuidv4 } from 'uuid'; // For client-side ID generation if needed, or server-side

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

// --- API Routes ---

// Create a new neural network
app.post('/api/network', (req: Request, res: Response) => {
  try {
    const { title, description, ownerId } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required for a new network.' });
    }
    const newNetwork = store.createNetwork({ title, description, ownerId });
    res.status(201).json(newNetwork);
  } catch (error) {
    console.error("Error creating network:", error);
    res.status(500).json({ message: 'Failed to create network' });
  }
});

// Get a specific neural network
app.get('/api/network/:networkId', (req: Request, res: Response) => {
  const { networkId } = req.params;
  const network = store.getNetwork(networkId);
  if (network) {
    res.json(network);
  } else {
    res.status(404).json({ message: 'Network not found' });
  }
});

// Add a new neuron to a network
app.post('/api/network/:networkId/neuron', (req: Request, res: Response) => {
  const { networkId } = req.params;
  // Simplified: expecting full neuron data minus id, metadata, childrenIds, isCollapsed
  const neuronData = req.body;

  if (!neuronData || !neuronData.title || !neuronData.layer || !neuronData.neuronType || !neuronData.position) {
    return res.status(400).json({ message: 'Missing required neuron data (title, layer, neuronType, position).' });
  }

  const newNeuron = store.addNeuron(networkId, neuronData);
  if (newNeuron) {
    res.status(201).json(newNeuron);
  } else {
    // Status might vary: 404 if network not found, or 500 if other error
    res.status(404).json({ message: 'Failed to add neuron (network not found or invalid data).' });
  }
});

// Add a new connection to a network
app.post('/api/network/:networkId/connection', (req: Request, res: Response) => {
    const { networkId } = req.params;
    // Expecting Omit<Connection, 'id' | 'metadata'>
    const connectionData = req.body;

    if (!connectionData || !connectionData.sourceId || !connectionData.targetId || !connectionData.connectionType) {
        return res.status(400).json({ message: 'Missing required connection data (sourceId, targetId, connectionType).' });
    }

    const newConnection = store.addConnection(networkId, connectionData);
    if (newConnection) {
        res.status(201).json(newConnection);
    } else {
        res.status(404).json({ message: 'Failed to add connection (network, source or target neuron not found).' });
    }
});


// Initialize or get a navigation thread
// For simplicity, this endpoint will create a new thread if one for the user doesn't exist,
// or could be adapted to fetch an existing one.
// Requires userId and a starting node.
app.post('/api/network/:networkId/thread', (req: Request, res: Response) => {
  const { networkId } = req.params;
  const { userId, startNeuronId, startLayer } = req.body;

  if (!userId || !startNeuronId || !startLayer) {
    return res.status(400).json({ message: 'UserId, startNeuronId, and startLayer are required to initialize a thread.' });
  }

  const startNode: ThreadNode = {
      neuronId: startNeuronId,
      layer: startLayer as NeuronLayer, // Ensure type safety
      timestamp: new Date().toISOString(),
      interactionType: "view" // Default interaction for starting node
  };

  const thread = store.initializeNavigationThread(userId, networkId, startNode);
  if (thread) {
    res.status(201).json(thread);
  } else {
    res.status(404).json({ message: 'Failed to initialize thread (network not found).' });
  }
});

// Add a node to a navigation thread
app.put('/api/network/:networkId/thread/:threadId/node', (req: Request, res: Response) => {
  const { threadId } = req.params;
  const nodeData = req.body as Omit<ThreadNode, 'timestamp'>; // Timestamp will be set by server

  if (!nodeData || !nodeData.neuronId || !nodeData.layer) {
      return res.status(400).json({ message: 'Missing required node data (neuronId, layer).' });
  }

  const node: ThreadNode = {
      ...nodeData,
      timestamp: new Date().toISOString()
  };

  const updatedThread = store.addNodeToThread(threadId, node);
  if (updatedThread) {
    res.json(updatedThread);
  } else {
    res.status(404).json({ message: 'Thread not found or failed to add node.' });
  }
});


// --- Static File Serving for Production ---
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  console.log(\`Serving static files from: \${clientDistPath}\`);
  app.use(express.static(clientDistPath));

  app.get('*', (req: Request, res: Response) => {
    const indexPath = path.join(clientDistPath, 'index.html');
    console.log(\`Catch-all: attempting to serve \${indexPath}\`);
    res.sendFile(indexPath);
  });
}

app.listen(port, () => {
  console.log(\`NeuroLearn AI Server is running on http://localhost:\${port}\`);
  // Initialize a default network on startup for easier testing
  if (process.env.NODE_ENV !== 'production') { // Avoid creating in prod unless intended
    const defaultNetwork = store.getNetwork("default-test-network-id"); // A unique ID or use a constant
    if (!defaultNetwork) {
        // Use a more specific ID if you want to fetch this exact one later for tests
        store.createNetwork({title: "Default Test Network", description: "Auto-created for development."});
    }
  }
});
