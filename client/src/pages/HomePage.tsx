import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartNewSession = async () => {
    // In a real app, you'd call the backend to create a new network
    // For now, we'll simulate this and navigate to a placeholder ID or a new one.
    try {
      const response = await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Exploration Session', description: 'Started from homepage' })
      });
      if (!response.ok) {
        throw new Error(\`Failed to create network: \${response.statusText}\`);
      }
      const newNetwork = await response.json();
      if (newNetwork && newNetwork.id) {
        navigate(\`/workspace/\${newNetwork.id}\`);
      } else {
        console.error("New network data is invalid:", newNetwork);
        alert("Could not start a new session due to invalid network data from server.");
      }
    } catch (error) {
      console.error("Error starting new session:", error);
      // Fallback for local testing if server isn't fully working yet
      alert(\`Could not start new session: \${error instanceof Error ? error.message : String(error)}. Navigating to a test ID.\`);
      navigate('/workspace/test-network-123');
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Bem-vindo ao NeuroLearn AI
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Explore o conhecimento de forma fractal e construa sua assinatura cognitiva única.
      </p>
      <button
        onClick={handleStartNewSession}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Iniciar Nova Sessão de Exploração
      </button>

      <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sessões Anteriores</h2>
        <p className="text-gray-500">
          (Em breve: Aqui você poderá ver e retomar suas jornadas de conhecimento anteriores.)
        </p>
        {/* Placeholder for listing sessions */}
      </div>
    </div>
  );
};

export default HomePage;
