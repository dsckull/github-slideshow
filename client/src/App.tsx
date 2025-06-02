import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container min-h-screen flex flex-col">
        {/* Basic Header/Nav placeholder */}
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold hover:text-gray-300">
              NeuroLearn AI
            </Link>
            <div>
              {/* <Link to="/some-other-page" className="ml-4 hover:text-gray-300">Other Page</Link> */}
            </div>
          </nav>
        </header>

        {/* Main content area */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workspace/:networkId" element={<WorkspacePage />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Basic Footer placeholder */}
        <footer className="bg-gray-700 text-white p-4 text-center text-xs">
          © 2024 NeuroLearn AI Fractal Explorer
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
