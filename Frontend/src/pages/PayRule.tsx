import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { AAcountPoolABI } from '../contracts';

const PayRule: React.FC = () => {
    const { address, ruleId } = useParams<{ address: string; ruleId: string }>();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('Payment for Rule');

    const { data: rules } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'getRules',
    });

    const ruleIndex = Number(ruleId);
    const rule = rules && (rules as any[])[ruleIndex];

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handlePay = () => {
        if (!rule || !address) return;
        const finalAmount = rule.amount > 0n ? rule.amount : parseEther(amount);

        writeContract({
            address: address as `0x${string}`,
            abi: AAcountPoolABI,
            functionName: 'depositForRule',
            args: [BigInt(ruleIndex), reason],
            value: finalAmount
        });
    };

    if (!rule) return <div className="p-12 text-center text-gray-500">Loading Rule...</div>;

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-6">Your payment has been recorded.</p>
                <button
                    onClick={() => navigate(`/pool/${address}`)}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Return to Pool
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <button
                onClick={() => navigate(`/pool/${address}`)}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Pool
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
                        PAYMENT REQUEST
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{rule.name}</h1>
                    <p className="text-gray-500">{rule.description}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (ETH)
                        </label>
                        {rule.amount > 0n ? (
                            <div className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 font-medium text-lg">
                                {formatEther(rule.amount)} ETH
                            </div>
                        ) : (
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Note / Reason
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name / Reference"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handlePay}
                        disabled={isPending || isConfirming || (rule.amount === 0n && !amount)}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending || isConfirming ? <Loader2 className="animate-spin" /> : 'Pay Now'}
                    </button>
                    {isConfirming && <p className="text-center text-sm text-gray-500">Confirming transaction...</p>}
                </div>
            </div>
        </div>
    );
};

export default PayRule;
