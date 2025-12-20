import React from 'react';
import { useReadContract } from 'wagmi';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AAcountFactoryABI, AACOUNT_FACTORY_ADDRESS } from '../contracts';
import { PoolCard } from '../components/PoolCard';

export const Dashboard: React.FC = () => {
    const { data: pools, isLoading, error } = useReadContract({
        address: AACOUNT_FACTORY_ADDRESS as `0x${string}`,
        abi: AAcountFactoryABI,
        functionName: 'getPools',
    });

    const poolList = pools as `0x${string}`[] | undefined;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Pools</h2>
                <p className="text-gray-500">{error.message}</p>
                <div className="mt-4 text-sm text-gray-400">
                    Make sure the contract address is correct and you are on the right network.
                </div>
            </div>
        );
    }

    if (!poolList || poolList.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pools Found</h2>
                <p className="text-gray-500 mb-6">Create your first collective ledger to get started.</p>
                <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    Create Pool
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Explore Pools</h1>
                <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    New Pool
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poolList.map((address) => (
                    <PoolCard key={address} address={address} />
                ))}
            </div>
        </div>
    );
};

// Default export
export default Dashboard;
