import React, { useState } from 'react';
import { Header } from './components/Header';
import { ForensicDashboard } from './components/ForensicDashboard';
import { Landing } from './components/Landing';
import { Vision } from './components/Vision';
import { Technology } from './components/Technology';
import { PageView } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing onStart={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <ForensicDashboard />;
      case 'vision':
        return <Vision />;
      case 'technology':
        return <Technology />;
      default:
        return <Landing onStart={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forensic-900 text-slate-200">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <footer className="border-t border-forensic-800 py-6 mt-auto bg-forensic-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-xs font-mono">
          <p>&copy; {new Date().getFullYear()} VeriSight-AI. Proprietary Forensic Technology.</p>
          <p className="mt-1">CONFIDENTIAL // LAW ENFORCEMENT & ENTERPRISE USE ONLY</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
