import React from 'react';
import { useReadContract } from 'wagmi';
import { Link } from 'react-router-dom';
import { ArrowRight, Coins } from 'lucide-react';
import { AAcountPoolABI } from '../contracts';
import { formatEther } from 'viem';

interface PoolCardProps {
    address: `0x${string}`;
}

export const PoolCard: React.FC<PoolCardProps> = ({ address }) => {
    // We can use multicall here implicitly by just using multiple hooks or a single contract read
    // For MVP, reading individual fields is readable.
    const { data: name } = useReadContract({
        address,
        abi: AAcountPoolABI,
        functionName: 'name',
    });

    const { data: description } = useReadContract({
        address,
        abi: AAcountPoolABI,
        functionName: 'description',
    });

    const { data: balance } = useReadContract({
        address,
        abi: AAcountPoolABI,
        functionName: 'getBalance',
    });

    if (!name) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {String(name).charAt(0).toUpperCase()}
                    </div>
                    <div className="bg-gray-50 px-3 py-1 rounded-full text-xs font-medium text-gray-500 font-mono">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{String(name)}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {String(description)}
                </p>

                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Coins size={16} className="text-yellow-500" />
                    <span>{balance ? formatEther(balance as bigint) : '0'} ETH</span>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <Link
                    to={`/pool/${address}`}
                    className="flex items-center justify-between text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                    View Details
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
