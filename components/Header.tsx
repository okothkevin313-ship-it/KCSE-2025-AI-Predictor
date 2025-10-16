
import React from 'react';
import { BookOpenIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center md:justify-start">
        <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="ml-3 text-2xl font-bold text-slate-800 dark:text-white">
          KCSE 2025 AI Predictor
        </h1>
      </div>
    </header>
  );
};

export default Header;
