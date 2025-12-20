import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Receipt } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-3xl space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                    Transparent Collective <span className="text-blue-600">Ledger</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Manage shared funds with complete transparency on the Ethereum blockchain.
                    Perfect for event splitting, group trips, and community funds.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Launch App
                        <ArrowRight className="ml-2 -mr-1" size={20} />
                    </Link>
                    <a
                        href="https://github.com/your-repo"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-all"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full px-4">
                <FeatureCard
                    icon={<Users className="text-blue-600" size={32} />}
                    title="Collective Ownership"
                    description="Create pools where every member has visibility. Say goodbye to opaque spreadsheets."
                />
                <FeatureCard
                    icon={<Receipt className="text-indigo-600" size={32} />}
                    title="Automated Rules"
                    description="Set predefined rules for payments and reimbursements. Smart contracts handle the logic."
                />
                <FeatureCard
                    icon={<Shield className="text-emerald-600" size={32} />}
                    title="Trustless Security"
                    description="Funds are secured by Ethereum. No single person holds the keys to the treasury."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-3 bg-gray-50 rounded-xl mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </div>
);
