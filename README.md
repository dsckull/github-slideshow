# NeuroLearn AI - Fractal Knowledge Explorer

## Vision
NeuroLearn AI is a revolutionary educational platform designed to simulate the way knowledge is interconnected and explored. It's built on the concepts of:

*   **Multi-layered Fractal Knowledge:** Information is structured in layers (Macro, Meso, Micro), allowing users to zoom into concepts to reveal deeper, more granular understanding, creating an illusion of infinite depth.
*   **Irreversible Learning Paths ("Novelo de Lã"):** Each user's journey through the knowledge space is unique and permanent, visualized as a "red thread" (fio vermelho) that unravels, creating a personal tapestry of learning.
*   **Unique Cognitive Signatures:** The system aims to derive a unique "cognitive signature" for each user based on their exploration patterns, interests, and interactions.

## Current Architecture (v0.1 - Initial Pass)

*   **Frontend:** React, Vite, TypeScript, TailwindCSS, React Router.
*   **Backend:** Node.js, Express, TypeScript.
*   **Data Store:** In-memory (temporary, for initial development).
*   **Shared:** Core data structures defined in TypeScript for type safety between client and server.

## Key Features Implemented (v0.1)

*   **Project Setup:** Monorepo-like structure with client, server, and shared directories. Configured with Vite, TypeScript, and TailwindCSS.
*   **Core Data Structures:** Defined types for Neurons (with layers), Connections, Navigation Threads (Novelo de Lã), and basic Cognitive Signature placeholders.
*   **Basic Backend API:**
    *   In-memory storage for neural network data.
    *   Endpoints to create/retrieve networks, add neurons/connections, and manage navigation threads.
*   **Basic Frontend UI:**
    *   Components for `Neuron`, `Connection`, `NetworkView`, `LayerIndicator`, and a placeholder `TimelineView`.
    *   Routing for Home and Workspace pages.
*   **Proof-of-Concept Interactions:**
    *   Ability to add new Macro neurons on the workspace (client-side with backend call).
    *   Simulated "zoom-in" functionality: clicking a Macro neuron changes the view to a conceptual Meso layer by filtering displayed neurons.
    *   Navigation path tracking: user clicks on neurons are recorded in a `NavigationThread` and displayed simply in the `TimelineView`.

## Running the Project

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    \`\`\`
    *(Note: In some execution environments, this step might be handled automatically or need to be performed manually if not done during setup.)*

2.  **Development Mode (Client & Server with Hot Reloading):**
    \`\`\`bash
    npm run dev
    \`\`\`
    *   Client will typically run on \`http://localhost:3000\`.
    *   Server will typically run on \`http://localhost:5000\`.
    *   Vite is configured to proxy API requests from \`/api\` on the client to the backend server.

3.  **Build for Production:**
    \`\`\`bash
    npm run build
    \`\`\`
    *   This builds the client application to \`client/dist\` and compiles the server to \`server/dist\`.

4.  **Run Production Server:**
    \`\`\`bash
    npm start
    \`\`\`
    *   This runs the compiled server from \`server/dist/index.js\`, which also serves the static client files.

## Next Steps & Future Development

This initial version lays the groundwork. Future development will focus on:

1.  **Full Layer Implementation & Navigation:**
    *   Properly fetching, displaying, and managing neurons across Macro, Meso, and Micro layers based on parent-child relationships.
    *   Implementing true recursive "zoom" capabilities and intuitive navigation between layers (zoom-in, zoom-out, pan).
    *   Managing relative positioning of neurons within their parent's context when zoomed.

2.  **"Novelo de Lã" (Navigation Thread) Visualization:**
    *   Develop the 3D spatial "fio vermelho" visualization within the `NetworkView`.
    *   Create a rich, interactive 2D `TimelineView` component to clearly display the user's learning path with annotations and metadata.

3.  **Cognitive Signature - Phase 1:**
    *   Begin collecting more detailed metrics (e.g., time spent per concept, types of interactions).
    *   Develop initial algorithms to identify and visualize user interest clusters.
    *   Design the initial visual representation of the cognitive signature.

4.  **Backend Enhancements:**
    *   Transition from in-memory storage to a persistent database (e.g., PostgreSQL, MongoDB) to store all network data, user threads, and signatures.
    *   Implement robust user authentication and authorization.
    *   Improve API error handling, validation, and add more comprehensive endpoints for complex queries.

5.  **UI/UX Refinements:**
    *   Enhance the visual styling of neurons, connections, and the overall interface.
    *   Implement smooth pan and zoom controls for the `NetworkView`.
    *   Develop and integrate the "quantum-inspired" visual metaphors in a meaningful way.
    *   Improve accessibility and responsiveness.

6.  **AI Integration - Phase 1:**
    *   Integrate with an LLM (e.g., OpenAI API) for:
        *   Generating initial content for neurons based on titles or user queries.
        *   Suggesting related concepts or potential connections.
        *   Answering user questions within the context of a neuron.
    *   Develop basic AI agents for tasks like identifying duplicate concepts or suggesting organizational improvements.

7.  **Testing:**
    *   Implement comprehensive unit tests for components and utility functions.
    *   Add integration tests for API endpoints and key user flows.

This project aims to be a long-term exploration into new ways of interacting with and understanding complex information.
