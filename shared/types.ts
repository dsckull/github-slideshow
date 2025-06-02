// Core Data Structures for NeuroLearn AI - Fractal Edition

// --------------- ENUMS -----------------

export enum NeuronLayer {
  MACRO = 1,
  MESO = 2,
  MICRO = 3,
}

export enum NeuronType {
  // General Types
  CONCEPT = "concept", // A general idea or topic
  CATEGORY = "category", // A grouping of related concepts

  // User Interaction Types
  QUESTION = "question", // A question posed by the user or system
  ANSWER = "answer", // An answer to a question
  HYPOTHESIS = "hypothesis", // A proposed explanation or idea

  // Content Types
  TEXT_CONTENT = "text_content", // A block of text
  IMAGE_CONTENT = "image_content", // An image
  VIDEO_CONTENT = "video_content", // A video link
  EXTERNAL_RESOURCE = "external_resource", // Link to an outside website/document

  // Structural & Meta Types
  REFERENCE_LINK = "reference_link", // A link to another neuron in the network
  NOTE = "note", // A user's personal annotation
  SYSTEM_NODE = "system_node", // For internal system use (e.g. entry point)
}

export enum ConnectionType {
  // General Relationships
  RELATED_TO = "related_to", // General association
  PART_OF = "part_of", // Hierarchical (e.g., Meso is part_of Macro)
  CONTAINS = "contains", // Hierarchical (e.g., Macro contains Meso)
  EXEMPLIFIES = "exemplifies", // Illustrates a concept

  // Causal & Logical Relationships
  LEADS_TO = "leads_to", // One concept/event leads to another
  CAUSES = "causes", // Direct causation
  RESULTS_IN = "results_in", // Consequence
  DEPENDS_ON = "depends_on", // Dependency

  // User-Defined & Interaction
  DEFINES = "defines", // One concept defines another
  ANSWERS = "answers", // Connects an answer to a question
  QUESTIONS = "questions", // Connects a question to a concept
  SUPPORTS = "supports", // Evidence supports a hypothesis
  CONTRADICTS = "contradicts", // Evidence contradicts a hypothesis
  USER_DEFINED = "user_defined", // Custom relationship defined by user
}

// --------------- QUANTUM-INSPIRED METAPHORS -----------------

export interface QuantumSuperpositionState {
  contextId: string; // ID of the context where this state is relevant (e.g., another neuron's ID)
  position?: { x: number; y: number; z?: number }; // Optional position in that context
  relevance: number; // How relevant this neuron is in that context (0-1)
}

export interface QuantumEntanglementLink {
  neuronId: string; // ID of the entangled neuron
  // Type of entanglement (e.g., content mirroring, state dependency)
  entanglementType: "content_mirror" | "state_dependency" | "existence_dependency";
  strength: number; // Strength of entanglement (0-1)
}

// --------------- CORE INTERFACES -----------------

export interface Neuron {
  id: string; // Unique identifier (e.g., UUID)
  title: string;
  description?: string; // Optional detailed description
  content?: string; // Main content, could be text, JSON, or link to resource
  layer: NeuronLayer; // Macro, Meso, or Micro
  neuronType: NeuronType;

  position: { x: number; y: number; z?: number }; // z for future 3D/layering visualization

  visualProperties?: {
    color?: string;
    size?: number; // Relative size
    icon?: string;
    shape?: "circle" | "square" | "hexagon";
  };

  // Properties for quantum-inspired metaphors
  quantumProperties?: {
    superpositionStates?: QuantumSuperpositionState[];
    entangledWith?: QuantumEntanglementLink[];
    // Represents the neuron's potential states before "collapse"
    // This is highly conceptual and might be a vector or a set of possibilities
    waveFunction?: any;
    isCollapsed: boolean; // Whether the neuron's state is "collapsed" to a specific view/detail
  };

  parentId?: string | null; // ID of the parent neuron if this is in Meso or Micro layer
  childrenIds?: string[]; // IDs of direct children neurons (for faster traversal downwards)

  metadata: {
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    tags?: string[];
    createdBy?: string; // User ID or "system"
    version?: number;
  };
}

export interface Connection {
  id: string; // Unique identifier
  sourceId: string; // ID of the source neuron
  targetId: string; // ID of the target neuron
  connectionType: ConnectionType;
  label?: string; // Optional descriptive label for the connection
  strength?: number; // Strength or relevance of the connection (0-1)

  visualProperties?: {
    color?: string;
    thickness?: number;
    style?: "solid" | "dashed" | "dotted";
    animated?: boolean;
  };

  metadata: {
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    createdBy?: string; // User ID or "system"
  };
}

// --------------- NAVIGATION THREAD ("NOVELO DE LÃ") -----------------

export interface ThreadNode {
  neuronId: string;
  layer: NeuronLayer;
  timestamp: string; // ISO Date string of when this node was visited
  dwellTimeMs?: number; // How long the user spent on this node
  interactionType?: "view" | "question_asked" | "content_added" | "connection_made";
  // For future use: snapshot of neuron state or user annotation at this point in thread
  // stateSnapshot?: Partial<Neuron>;
  // userAnnotation?: string;
}

export interface NavigationThread {
  id: string; // Unique identifier for this thread/journey
  userId: string; // User to whom this thread belongs
  nodes: ThreadNode[]; // Chronological sequence of visited neurons

  // Philosophical principles
  readonly isImmutable: true; // Cannot be erased or fundamentally altered
  readonly canBeExtended: true;
  // canBeMergedWith?: string[]; // IDs of other threads this one has merged with
  // canBeHidden: boolean; // User can choose to hide it from active view

  visualProperties?: {
    color?: string; // Default color for the "fio vermelho"
    // Potentially evolve this to a more complex pattern based on thread content
    pattern?: any;
  };

  metadata: {
    createdAt: string; // ISO Date string
    lastExtendedAt: string; // ISO Date string
    title?: string; // Optional user-given title for this journey
    tags?: string[];
  };
}

// --------------- COGNITIVE SIGNATURE -----------------

export interface InterestCluster {
  conceptKeywords: string[]; // Keywords defining the cluster
  neuronIds: string[]; // Neurons belonging to this cluster
  intensity: number; // Normalized score of interest (0-1)
  timeSpentMs: number;
  revisitRate: number;
  layerPreference?: { [layer in NeuronLayer]?: number }; // Proportion of time in each layer
}

export interface CognitiveSignature {
  userId: string;

  // Metrics derived from NavigationThreads
  signatureMetrics: {
    totalExplorationTimeMs: number;
    totalNeuronsVisited: number;
    totalQuestionsAsked?: number;
    averageDwellTimeMs: number;
    depthVsBreadthRatio: number; // 0=purely breadth, 1=purely depth
    layerDistribution: { [layer in NeuronLayer]?: number }; // Proportion of neurons visited in each layer
    commonNeuronSequences?: { sequence: string[]; frequency: number }[]; // Common paths
  };

  interestClusters: InterestCluster[];

  // Visual representation derived from metrics and clusters
  visualSignature?: {
    dominantColors?: string[]; // Based on neuron colors in high-interest clusters
    // A simplified representation of the common exploration paths or structure
    // Could be a graph, a set of vectors, or a procedural generation seed
    structuralPattern?: any;
    temporalRhythm?: number[]; // Pattern of activity over time
  };

  metadata: {
    lastCalculatedAt: string; // ISO Date string
    version: number;
  };
}

// --------------- TOP-LEVEL NETWORK STRUCTURE -----------------

export interface NeuralNetworkData {
  id: string; // Unique ID for this entire network dataset
  title: string;
  description?: string;

  neurons: Record<string, Neuron>; // Storing neurons in a map for easy ID-based access
  connections: Record<string, Connection>; // Same for connections
  // NavigationThreads could be stored per user, this might be more of an aggregate or example
  // navigationThreads?: Record<string, NavigationThread>;

  rootNeuronIds: string[]; // Entry points, typically Macro layer neurons

  metadata: {
    createdAt: string;
    updatedAt: string;
    schemaVersion: string; // Version of these type definitions
    ownerId?: string; // User who owns/created this network
  };
}

// Example of how you might start a network
// const myNetwork: NeuralNetworkData = {
//   id: "network-1",
//   title: "My First NeuroLearn AI Network",
//   neurons: {},
//   connections: {},
//   rootNeuronIds: [],
//   metadata: {
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     schemaVersion: "0.1.0"
//   }
// };

console.log("Core data structures defined in shared/types.ts");
