import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { AAcountFactoryABI, AACOUNT_FACTORY_ADDRESS } from '../contracts';

export const CreatePool: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) return;

        writeContract({
            address: AACOUNT_FACTORY_ADDRESS as `0x${string}`,
            abi: AAcountFactoryABI,
            functionName: 'createPool',
            args: [name, description],
        });
    };

    React.useEffect(() => {
        if (isSuccess) {
            // In a real app we'd parse the logs to find the new pool address
            // For now, go to dashboard
            const timer = setTimeout(() => navigate('/dashboard'), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Pool</h1>
                    <p className="text-gray-500 mt-2">Start a new collective ledger for your group or event.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pool Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. ETHChiangMai Hackathon Squad"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this pool for?"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending || isConfirming}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} />
                                    Create Pool
                                </>
                            )}
                        </button>
                    </div>

                    {isSuccess && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                            Pool created successfully! Redirecting...
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// Default export for lazy loading if needed, but named is fine
export default CreatePool;
