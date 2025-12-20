import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LayoutGrid, PlusCircle } from 'lucide-react';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            AAcount
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                <LayoutGrid size={18} />
                                Dashboard
                            </Link>
                            <Link to="/create" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                <PlusCircle size={18} />
                                New Pool
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-gray-200 py-6 mt-auto bg-white">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} AAcount. Decentralized Collective Accounting.
                </div>
            </footer>
        </div>
    );
};
