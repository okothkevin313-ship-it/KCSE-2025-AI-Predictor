
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 mt-12 py-4 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} KCSE AI Predictor. All questions are AI-generated and for revision purposes only.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
