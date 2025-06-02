import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Página Não Encontrada</h2>
      <p className="text-gray-500 mb-8">
        Oops! A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFoundPage;
